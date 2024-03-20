from dotenv import load_dotenv, find_dotenv
from fastapi import APIRouter, HTTPException, Depends, Body
from pymongo import MongoClient
from pymongo.collection import Collection
from datetime import datetime
from bson import ObjectId
from utils import hash_password, verify_password
from schemas.user import UserSchema,UserResponse
import os

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
    responses={404: {"description": "Not found"}},
)

_ = load_dotenv(find_dotenv())
mongo_url = os.getenv("mongo_url")

def get_user_collection():
    client = MongoClient(mongo_url)
    db = client["harry"]
    user_collection = db["user"]
    return user_collection


#write api to create user
@router.post('/register', response_model_by_alias=False, response_description="User added successfully")
async def create_user(user: UserSchema = None):
    try:
        collection_user = get_user_collection()

        existing_user = collection_user.find_one({"email": user.email.lower()})

        if existing_user:
            raise HTTPException(status_code=404, detail="User already exists with this email.")
        
        new_user = {
            "id": ObjectId(),
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "password": hash_password(user.password),
            "role": user.role,
            "created_at": datetime.now()
        }
        new_user = UserSchema(**new_user)

        result_user = collection_user.insert_one(new_user.model_dump(by_alias=True, exclude=["id"]))
        print(f"result_user: {result_user}")

        return UserResponse(message = "User added successfully",result=new_user, total=1)
    
    except HTTPException as http_exception:
        raise http_exception
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


#write api to login user
@router.post('/login', response_model_by_alias=False, response_description="User login successfully")
async def login_user(email: str = Body(...), password: str = Body(...)):
    try:
        collection_user = get_user_collection()

        existing_user = collection_user.find_one({"email": email.lower()})

        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found with this email.")
        
        if not verify_password(password, existing_user['password']):
            raise HTTPException(status_code=401, detail='Incorrect Password')
        
        return UserResponse(message = "User login successfully",result=existing_user, total=1)
    
    except HTTPException as http_exception:
        raise http_exception
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

#write api to update password for user
@router.put('/update-password', response_model_by_alias=False, response_description="Password updated successfully")
async def update_password(email: str = Body(...), old_password: str = Body(...), new_password: str = Body(...)):
    try:
        collection_user = get_user_collection()

        existing_user = collection_user.find_one({"email": email.lower()})
        
        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found with this email.")
        
        if not verify_password(old_password, existing_user['password']):
            raise HTTPException(status_code=401, detail='Incorrect Password')
        
        new_password = hash_password(new_password)
        result_user = collection_user.update_one({"email": email}, {"$set": {"password": new_password}})
        print(f"result_user: {result_user}")
        
        return {"message": "Password updated successfully"}
    
    except HTTPException as http_exception:
        raise http_exception
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))