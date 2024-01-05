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
from schemas.module import TransactionFilters
from schemas.project import CreateProject
from utils import hash_password, verify_password, upload_file
import os

router = APIRouter(
    prefix="",
    tags=["Module"],
    responses={404: {"description": "Not found"}},
)

_ = load_dotenv(find_dotenv())
mongo_url = os.getenv("MONGO_URL")


def get_sam_collection():
    client = MongoClient("mongodb://localhost:27017")
    db = client["lead_compass"]
    sam_collection = db["complete_sam"]
    return sam_collection


def get_project_collection():
    client = MongoClient("mongodb://localhost:27017")
    db = client["lead_compass"]
    project_collection = db["project"]
    return project_collection



@router.post('/module')
async def create_module(filters: TransactionFilters):
    try:

        filter = TransactionFilters(**filters)

        query_filter = {}

        if filter.amount:
            query_filter["amount"] = filters.amount

        if filter.transaction_count:
            query_filter["transaction_count"] = filters.transaction_count

        if filter.duration:
            query_filter["duration"] = filters.duration




        # new_module = {
        #     "pid": collection_project.count_documents({}) + 1,
        #     "project_name": f"project_{datetime.now().strftime('%Y%m%d')}",
        #     "user_name": "uk",
        #     "total_mortgage_transaction": collection_sam.count_documents({}),
        #     "last_10_year_transactions_mortgage": collection_sam.count_documents({"time_tag": "N"}),
        #     "residential_properties_transactions_mortgage": collection_sam.count_documents({"residential_tag": 1}),
        #     "created_at": datetime.now(),
        #     "status": "complete",
        #     "source": "blackknight"
        # }
        # # print(new_project)
        # result_project = collection_project.insert_one(new_project)
        #
        # collection_sam.update_many({}, {"$set": {"project_id": new_project.get('pid')}})
        #
        # new_project_response = {key: value for key, value in new_project.items() if key != '_id'}
        #
        # background_tasks.add_task(run_scripts)
        # return {"msg": "project added successfully", "project_id": str(result_project.inserted_id),
        #         "new_project": new_project_response}

    except HTTPException as http_exception:
        raise http_exception

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post('/project')
async def get_projects(
        payload: dict = Body(None, description="source"),
        page: int = Query(1, ge=1),
        page_size: int = Query(100, ge=1)):
    try:
        collection_project = get_project_collection()

        filter_query = {}
        source = payload.get('source')
        created_asc = payload.get('first_entry')
        created_desc = payload.get('last_entry')

        if source:
            filter_query["source"] = source

        if created_asc:
            projects = collection_project.find(filter_query, {'_id': 0}).sort("created_at", 1).limit(page_size).skip(
                (page - 1) * page_size)
        else:
            projects = collection_project.find(filter_query, {'_id': 0}).sort("created_at", -1).limit(page_size).skip(
                (page - 1) * page_size)

        project_list = [project for project in projects]
        return {"msg": "projects retrieved successfully", "projects": project_list}

    except HTTPException as http_exception:
        raise http_exception

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
