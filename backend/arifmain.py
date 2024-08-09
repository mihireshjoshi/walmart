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

@app.get("/product/{barcode}")
def get_product(barcode: str):
    response = supabase.table('products').select("*").eq('barcode', barcode).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return response.data[0]

# Run the server using: uvicorn filename:app --reload
