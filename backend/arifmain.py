from fastapi import FastAPI, HTTPException
from supabase import create_client, Client
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai import GenerationConfig, GenerativeModel
import pandas as pd
import os, re, json, time, threading
from pydantic import BaseModel
from typing import Dict, List

load_dotenv()
app = FastAPI()

# Supabase configuration
url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_ANON_KEY')
supabase: Client = create_client(url, key)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-pro-latest")

# Queue Configuration
queues = {
    "queue1": [],
    "queue2": []
}
CHECKOUT_TIME = 2 * 60  # in seconds
queue_lock = threading.Lock()

class QueueStatus(BaseModel):
    total_people: int
    remaining_times: List[int]

class QueueAllocationResponse(BaseModel):
    queue_name: str
    estimated_time: int  # in seconds
    position: int
    queue_status: Dict[str, QueueStatus]

async def outputfn(price, name, description):
    try:
        prompt = f"""
        I am providing you with a product with its price, name, and description. Suggest me with similar products or frequently bought products. The response must be a valid JSON array containing exactly 5 objects, each representing a product with "Price", "Name", and "Description" fields. Follow the exact format shown below:

        Example: 
        Input: Price: 35, Name: Bread, Description: Bread made using high fibre.
        Output: [
            {{
                "Price": "80",
                "Name": "Butter",
                "Description": "Amul Butter made in Ahmedabad"
            }},
            {{
                "Price": "60",
                "Name": "Egg",
                "Description": "Fresh from poultry"
            }},
            {{
                "Price": "35",
                "Name": "Lettuce",
                "Description": "Fresh Lettuce from Spain"
            }},
            {{
                "Price": "70",
                "Name": "Milk",
                "Description": "Organic cow milk"
            }},
            {{
                "Price": "25",
                "Name": "Tomato",
                "Description": "Fresh organic tomatoes"
            }}
        ]

        Input: Price: {price}, Name: {name}, Description: {description}
        """

        generated_config = GenerationConfig(temperature=0.1)
        response = model.generate_content(prompt, generation_config=generated_config)
        generated_text = response.text
        print("This is generated text:\n", generated_text)

        # Extracting and cleaning the JSON part from the response
        try:
            json_start_index = generated_text.find('[')
            json_end_index = generated_text.rfind(']') + 1
            json_substring = generated_text[json_start_index:json_end_index]

            json_data = json.loads(json_substring)
            print("\nThis is the JSON output:\n", json_data)
            return json_data
        except json.JSONDecodeError as e:
            raise ValueError("Failed to parse JSON: " + str(e))

    except Exception as e:
        print("Error:", e)
        return str(e)

# Function to get related products (simple mockup for demonstration)
async def get_recommendations(product_id: str):
    try:
        response = supabase.table('recommendations').select("*").eq('product_id', product_id).execute()
        if response.data:
            resp = supabase.table('products').select('name').eq('prod_id',response.data[0]['recommended_product_id']).execute()
            response.data[0]["recommended_prod_name"]=resp.data[0]["name"]
            recommended_products = response.data
        else:
            recommended_products = []
        return recommended_products
    except Exception as e:
        print(e)
        return str(e)

# Function to check if the product is on sale
async def check_sales(product_id: str):
    try:
        response = supabase.table('sales').select("*").eq('product_id', product_id).execute()
        sale_info = response.data[0] if response.data else None
        print(sale_info)
        return sale_info
    except Exception as e:
        print(e)
        return str(e)

# Background task to remove users from the queue after they are done
def process_queues():
    while True:
        with queue_lock:
            current_time = time.time()
            for queue_name in queues:
                # Remove users who have completed their checkout time
                queues[queue_name] = [
                    timestamp for i, timestamp in enumerate(queues[queue_name])
                    if current_time - timestamp < CHECKOUT_TIME * (i + 1)
                ]
        time.sleep(10)  # Check every 10 seconds

# Start the background task
threading.Thread(target=process_queues, daemon=True).start()

@app.get("/product/{barcode}")
async def get_product(barcode: str):
    try:
        # Fetch the product details from the database
        response = supabase.table('products').select("*").eq('prod_id', barcode).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Product not found")
        
        product = response.data[0]
        print(product)
        sale_info = None
        recommendations = await outputfn(product['price'], product['name'], product['description'])

        # Add sales information to the product details if available
        if sale_info:
            product['sale_price'] = sale_info.get('sale_price')
            product['discount_percentage'] = sale_info.get('discount_percentage')

        # Add recommendations to the product details
        product['recommendations'] = recommendations

        return product

    except Exception as e:
        print("Error occurred at /product/barcode route: ", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/allocate_queue", response_model=QueueAllocationResponse)
async def allocate_and_status():
    try:
        with queue_lock:
            # Find the queue with the least number of people
            least_busy_queue = min(queues, key=lambda k: len(queues[k]))
            current_time = time.time()

            # Calculate the estimated time for this person
            if len(queues[least_busy_queue]) == 0:
                estimated_time = 0  # First person in the queue has no wait time
            else:
                # Time remaining for the person currently at the counter
                time_passed_for_first_person = current_time - queues[least_busy_queue][0]
                time_remaining_for_first_person = max(0, CHECKOUT_TIME - time_passed_for_first_person)
                
                # The total wait time is the time remaining for the first person
                # plus the time required for all others ahead of the current person
                num_people_ahead = len(queues[least_busy_queue])-1
                estimated_time = time_remaining_for_first_person + (num_people_ahead * CHECKOUT_TIME)

            # Add the current time to the queue
            queues[least_busy_queue].append(current_time)

            # Update the status of all queues
            status = {}
            for queue_name, queue in queues.items():
                remaining_times = []
                for i, timestamp in enumerate(queue):
                    if i == 0:
                        time_remaining = int(max(0, CHECKOUT_TIME - (current_time - timestamp)))
                    else:
                        time_remaining = remaining_times[-1] + CHECKOUT_TIME
                    remaining_times.append(time_remaining)
                status[queue_name] = {
                    "total_people": len(queue),
                    "remaining_times": remaining_times
                }

        return {
            "queue_name": least_busy_queue,
            "estimated_time": int(estimated_time),  # Convert to integer
            "position": len(queues[least_busy_queue]),  # Position should reflect the actual size of the queue
            "queue_status": status
        }

    except Exception as e:
        print("Error occurred at /allocate_queue route: ", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")
