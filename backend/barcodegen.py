import barcode
from barcode.writer import ImageWriter
from dotenv import load_dotenv
import os
from supabase import create_client, Client

load_dotenv()
# Supabase configuration
url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_ANON_KEY')
supabase: Client = create_client(url, key)

def generate_barcode(product_id: str):
    EAN = barcode.get_barcode_class('code128')
    if EAN is None:
        raise ValueError("Barcode type 'code128' is not supported.")
    ean = EAN(product_id, writer=ImageWriter())
    barcode_image_path = ean.save(f'barcode_{product_id}')
    return barcode_image_path

# Store product details in Supabase
def store_product_in_supabase(product_id: str, name: str, description: str, price: float, barcode_image_path: str):
    product_data = {
        "prod_id": product_id,
        "name": name,
        "description": description,
        "price": price,
        "barcode": product_id,
        "barcode_image": barcode_image_path  # Store path or upload to storage
    }
    response = supabase.table('products').insert(product_data).execute()
    return response

# Example usage
product_id = "123456789013"
barcode_image_path = generate_barcode(product_id)
store_product_in_supabase(product_id, "Gokul Milk 1 ltr", "This milk is from Ahmedabad", 70, barcode_image_path)
