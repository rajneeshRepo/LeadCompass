from datetime import datetime

from bson import ObjectId
from dotenv import load_dotenv, find_dotenv
from fastapi import APIRouter, HTTPException, Depends, Body, Query, BackgroundTasks, UploadFile, File
import subprocess
from pymongo import MongoClient
from pymongo.collection import Collection
import asyncio

from Oauth import get_current_user, create_access_token
from config.db import get_collection
from schemas import CreateUserSchema, UserBaseSchema
from schemas.project import CreateProject
from utils import hash_password, verify_password, upload_file
import os

router = APIRouter(
    prefix="",
    tags=["Prospect"],
    responses={404: {"description": "Not found"}},
)

_ = load_dotenv(find_dotenv())
mongo_url = os.getenv("MONGO_URL")


def get_project_collection():
    client = MongoClient("mongodb://localhost:27017")
    db = client["lead_compass"]
    project_collection = db["project"]
    return project_collection


def get_group_mvp_collection():
    client = MongoClient("mongodb://localhost:27017")
    db = client["lead_compass"]
    mvp_group_collection = db["group_mvp"]
    return mvp_group_collection


@router.get('/prospect')
async def get_prospects(module_id: str):
    try:
        collection_mvp_group = get_group_mvp_collection()

        # given_module_id = "659a928c52d60cb5405adc38"

        query = {"RcCalTransactions.module_id": {"$eq": module_id}}
        result = list(collection_mvp_group.find(query))

        for prospect in result:
            prospect["_id"] = str(prospect["_id"])
            # prospect["RcCalTransactions.module_id"] = str(prospect["RcCalTransactions.module_id"])

        return {"msg": "prospects fetched successfully", "prospects": result}

    except HTTPException as http_exception:
        raise http_exception

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
