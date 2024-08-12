from fastapi import FastAPI, HTTPException
from supabase import create_client, Client
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai import GenerationConfig,GenerativeModel
import pandas as pd
import os, re, json

load_dotenv()
app = FastAPI()

# Supabase configuration
url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_ANON_KEY')
supabase: Client = create_client(url, key)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-pro-latest")

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
    # Mockup: Logic to get recommended products (replace this with your actual logic)
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
    # Mockup: Logic to get sale information (replace this with your actual logic)
    try:
        response = supabase.table('sales').select("*").eq('product_id', product_id).execute()
        sale_info = response.data[0] if response.data else None
        print(sale_info)
        return sale_info
    except Exception as e:
        print(e)
        return str(e)

@app.get("/product/{barcode}")
async def get_product(barcode: str):
    try:
        # Fetch the product details from the database
        response = supabase.table('products').select("*").eq('barcode', barcode).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Product not found")
        
        product = response.data[0]       
        # Fetch sales information
        sale_info = await check_sales(product['prod_id'])
        recommendations = await outputfn(product['price'],product['name'],product['description'])
        # Add sales information to the product details if available
        if sale_info:
            product['sale_price'] = sale_info.get('sale_price')
            product['discount_percentage'] = sale_info.get('discount_percentage')

        # Add recommendations to the product details
        product['recommendations'] = recommendations

        return product
    except Exception as e:
        print("Error occured at /product/barcocde route: ",str(e))
