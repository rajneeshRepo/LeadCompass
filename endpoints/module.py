from datetime import datetime

from bson import ObjectId
from dotenv import load_dotenv, find_dotenv
from fastapi import APIRouter, HTTPException, Depends, Body, Query, BackgroundTasks, UploadFile, File
import subprocess
from pymongo import MongoClient, UpdateOne
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


def get_module_collection():
    client = MongoClient("mongodb://localhost:27017")
    db = client["lead_compass"]
    module_collection = db["module"]
    return module_collection


def get_group_mvp_collection():
    client = MongoClient("mongodb://localhost:27017")
    db = client["lead_compass"]
    mvp_group_collection = db["group_mvp"]
    return mvp_group_collection


def get_project_collection():
    client = MongoClient("mongodb://localhost:27017")
    db = client["lead_compass"]
    project_collection = db["project"]
    return project_collection


@router.post('/module')
async def create_module(filters: TransactionFilters, project_id: str = Body(...)):
    try:
        print(project_id)

        query_filter = {}
        if filters.amount:
            if filters.amount.value == 'All Amounts':
                query_filter["RcCalTotalLoanAmount"] = {}

            if filters.amount.value == 'Less than $100,000':
                query_filter["RcCalTotalLoanAmount"] = {"$lt": 100000}

            if filters.amount.value == 'Greater than $100,000':
                query_filter["RcCalTotalLoanAmount"] = {"$gt": 100000}

        if filters.transaction_count:
            if filters.transaction_count.value == 'All Transactions':
                query_filter["RcCalNumberOfLoans"] = {}

            if filters.transaction_count.value == 'Greater than 1':
                query_filter["RcCalNumberOfLoans"] = {"$gt": 1}

            if filters.transaction_count.value == 'Less than 10':
                query_filter["RcCalNumberOfLoans"] = {"$lt": 10}

            if filters.transaction_count.value == 'Greater than 10':
                query_filter["RcCalNumberOfLoans"] = {"$gt": 10}

        if filters.duration:
            if filters.duration.value == 'All Durations':
                query_filter["RcCalLatestTransactionDate"] = {}

            if filters.transaction_count.value == 'Less than 6 months':
                query_filter["RcCalLatestTransactionDate"] = {"$gt": 1}

            if filters.transaction_count.value == 'Less than 1 year':
                query_filter["RcCalLatestTransactionDate"] = {"$lt": 10}

            if filters.transaction_count.value == 'Greater than 1 year':
                query_filter["RcCalLatestTransactionDate"] = {"$gt": 10}

        collection_mvp_grp = get_group_mvp_collection()
        filtered_documents = list(collection_mvp_grp.find(query_filter, {'_id': 0}))

        new_module = {
            "project_id": str(project_id),
            "user_mail": "admin@gmail.com",
            "created_at": datetime.now(),
            "filters": query_filter,
        }

        collection_module = get_module_collection()
        result_project = collection_module.insert_one(new_module)

        collection_project = get_project_collection()

        update_result = collection_mvp_grp.update_many(
            {"RcCalTransactions.ProjectId": int(project_id)},
            {"$set": {"RcCalTransactions.$.module_id": str(new_module["_id"])}}
        )

        new_module["_id"] = str(new_module["_id"])
        return {"msg": "module added successfully", "new_module": new_module}

    except HTTPException as http_exception:
        raise http_exception

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get('/module/all')
async def get_modules(
        payload: dict = Body(None, description="source"),
        page: int = Query(1, ge=1),
        page_size: int = Query(100, ge=1)):
    try:
        collection_module = get_module_collection()

        filter_query = {}

        modules = collection_module.find(filter_query, {'_id': 0}).sort("created_at", 1).limit(page_size).skip(
            (page - 1) * page_size)

        module_list = [module for module in modules]
        return {"msg": "modules retrieved successfully", "modules": module_list}

    except HTTPException as http_exception:
        raise http_exception

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
