from fastapi import FastAPI, HTTPException
from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()
app = FastAPI()

# Supabase configuration
url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_ANON_KEY')
supabase: Client = create_client(url, key)

# Function to get related products (simple mockup for demonstration)
def get_recommendations(product_id: str):
    # Mockup: Logic to get recommended products (replace this with your actual logic)
    response = supabase.table('recommendations').select("*").eq('product_id', product_id).execute()
    if response.data:
        resp = supabase.table('products').select('name').eq('prod_id',response.data[0]['recommended_product_id']).execute()
        response.data[0]["recommended_prod_name"]=resp.data[0]["name"]
        recommended_products = response.data
    else:
        recommended_products = []
    return recommended_products

# Function to check if the product is on sale
def check_sales(product_id: str):
    # Mockup: Logic to get sale information (replace this with your actual logic)
    response = supabase.table('sales').select("*").eq('product_id', product_id).execute()
    sale_info = response.data[0] if response.data else None
    print(sale_info)
    return sale_info

@app.get("/product/{barcode}")
def get_product(barcode: str):
    try:
        # Fetch the product details from the database
        response = supabase.table('products').select("*").eq('barcode', barcode).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Product not found")
        
        product = response.data[0]

        # Fetch recommendations
        recommendations = get_recommendations(product['prod_id'])
        
        # Fetch sales information
        sale_info = check_sales(product['prod_id'])

        # Add sales information to the product details if available
        if sale_info:
            product['sale_price'] = sale_info.get('sale_price')
            product['discount_percentage'] = sale_info.get('discount_percentage')

        # Add recommendations to the product details
        product['recommendations'] = recommendations

        return product
    except Exception as e:
        print("Error occured at /product/barcocde route: ",str(e))
