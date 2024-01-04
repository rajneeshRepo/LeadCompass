import json

from bson import ObjectId
from dotenv import load_dotenv, find_dotenv
from fastapi import APIRouter, Depends, HTTPException, Query
from pymongo import MongoClient

from Oauth import get_current_user
from config.db import get_collection
from data import load_json
# from schemas.mud_lead import Mud_Lead
from schemas.user import UserUpdateSchema
import os

router = APIRouter(
    prefix="/upload",
    tags=["User"],
    responses={404: {"description": "Not found"}},
)

_ = load_dotenv(find_dotenv())
mongo_url = os.getenv("MONGO_URL")


def get_sam_collection():
    client = MongoClient("mongo_url")
    db = client["lead_compass"]
    sam_collection = db["complete_sam"]
    return sam_collection


@router.post('/all')
async def upload_sam():
    try:
        sam_collection = get_sam_collection()

        data = load_json.company_data

        result_sam = sam_collection.insert_many(data)
        total_docs = len(result_sam.inserted_ids)
        print(total_docs)

        return {"msg": "successfully uploaded", "data": str(result_sam.inserted_ids)}

    except HTTPException as http_exception:
        raise http_exception

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
