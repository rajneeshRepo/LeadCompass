from dotenv import load_dotenv, find_dotenv
from fastapi import APIRouter, HTTPException, Depends, Body
from pymongo import MongoClient
from pymongo.collection import Collection
from datetime import datetime
from bson import ObjectId, json_util
from util.passutil import get_password_hash, verify_password
from schemas.user import UserSchema,UserResponse
import os


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"],
    responses={404: {"description": "Not found"}},
)

_ = load_dotenv(find_dotenv())
mongo_url = os.getenv("mongo_url")


def get_user_collection():
    client = MongoClient(mongo_url)
    db = client["harry"]
    user_collection = db["user"]
    return user_collection


def get_org_collection():
    client = MongoClient(mongo_url)
    db = client["harry"]
    user_collection = db["organization"]
    return user_collection

@router.get("/resources_info", response_model_by_alias=False, response_description="Get all users")
def get_users():
    try:
        user_collection = get_user_collection()
        users = user_collection.find()
        user_list = []
        for user in users:
            full_name = f"{user['first_name']} {user['last_name']}"
            user_info = {
                "id": str(user["_id"]),
                "full_name": full_name,
                "email": user["email"]
            }
            user_list.append(user_info)
        return user_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user_org_info", response_description="Get user organization info")
def get_user_org_info():
    try:
        user_collection = get_user_collection()
        org_collection = get_org_collection()
        users = user_collection.find()
        user_org_info_list = []
        for user in users:
            user_orgs = list(org_collection.find({"user_id": ObjectId(user["_id"])}))
            total_orgs = len(user_orgs) if user_orgs else 0
            today_orgs = len([org for org in user_orgs if datetime.strptime(org["created_at"], "%Y-%m-%dT%H:%M:%S") >= datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)]) if user_orgs else 0
            user_org_info = {
                "full_name": f"{user['first_name']} {user['last_name']} ",
                "email": user["email"],
                "user_id": str(user["_id"]),
                "total_orgs": total_orgs,
                "today_orgs": today_orgs
            }
            user_org_info_list.append(user_org_info)
        return user_org_info_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))