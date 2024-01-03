import json
import os
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query
from pymongo import MongoClient

from Oauth import get_current_user
from config.db import get_collection
from data import load_json
# from schemas.mud_lead import Mud_Lead
from schemas.user import UserUpdateSchema

router = APIRouter(
    prefix="/upload",
    tags=["User"],
    responses={404: {"description": "Not found"}},
)


client = MongoClient("mongodb+srv://user:admin@leadcompass.auduirj.mongodb.net/?retryWrites=true&w=majority")
db = client["lead_compass"]
collection_mortgage = db["mortgage"]


batch_size = 1000
offset = 0
skip = 0

filter = {
    "$or": [
        {"company_tag_cal": {"$ne": ""}},
        {"company_tag_given": {"$ne": ""}}
    ],
    "time_tag": "N"
}

@router.post('/all')
async def upload_mud_lead():
    try:

        cursor = collection_mortgage.find(filter).skip(skip).limit(batch_size)

        batch_documents = list(cursor)
        for document in batch_documents:
            del document['_id']



        # total_docs = len(result.inserted_ids)
        # print(total_docs)

        return {"msg": "uploaded success", "data": result.inserted_ids}

    except HTTPException as http_exception:
        raise http_exception

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
