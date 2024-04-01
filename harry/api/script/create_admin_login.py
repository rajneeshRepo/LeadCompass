
from pymongo import MongoClient
from dotenv import load_dotenv, find_dotenv
from passlib.context import CryptContext
import os

_ = load_dotenv(find_dotenv())

db_host = os.getenv("db_host")
db_port = os.getenv("db_port")
db_username = os.getenv("db_username")
db_password = os.getenv("db_password")
db_name = os.getenv("db_name")

MONGO_URL = os.getenv("MONGO_URL")
from datetime import datetime


pwd_context = CryptContext(schemes=["sha256_crypt", "md5_crypt", "des_crypt"],
                           deprecated=["md5_crypt", "des_crypt"])

def get_password_hash(password: str):
    return pwd_context.hash(password)

def create_admin_user():
    # MongoDB connection URI
    mongo_uri = MONGO_URL
    
    # Connect to MongoDB
    client = MongoClient(mongo_uri)
    
    # Access the admin database
    db = client[db_name]
    
    # Define admin user details
    admin_user = {
        "username": "admin",
        "email": "admin@harry.com",
        "first_name": "Rajneesh",
        "last_name": "Singh",
        "password": get_password_hash("Fsd#34xc!"),
        "role": "admin",
        "created_at": datetime.now()
    }
    
    # Insert admin user into the database
    db.user.insert_one(admin_user)
    
    print("Admin user created successfully.")

if __name__ == "__main__":
    create_admin_user()
