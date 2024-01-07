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


@router.get('/prospect/timeline')
async def get_prospect_timeline(module_id: str):
    try:
        collection_project = get_project_collection()
        collection_module = get_module_collection()
        module_object_id = ObjectId(module_id)
        module_document = collection_module.find_one({"_id": module_object_id})

        if not module_document:
            raise HTTPException(status_code=404, detail="Module not found")

        module_created_at = module_document.get("created_at")
        module_created_by = module_document.get("user_mail")

        project_id = module_document.get("project_id")
        if not project_id:
            raise HTTPException(status_code=404, detail="Project ID not found in the module")

        project_document = collection_project.find_one({"project_id": int(project_id)})
        print(project_document)

        if not project_document:
            raise HTTPException(status_code=404, detail="Project not found")

        project_created_at = project_document.get("created_at")
        project_name = project_document.get("project_name")

        result_dict = {
            "project_name": project_name,
            "module_created_by": module_created_by,
            "module_created_at": module_created_at,
            "metadata": {
                "raw": project_created_at,
                "bronze": module_created_at
            }
        }

        return {"msg": "prospect timeline fetched successfully", "data": result_dict}

    except HTTPException as http_exception:
        raise http_exception

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# @router.get('/prospect/timeline')
# async def get_prospect_timeline(module_id: str):
#     try:
#         collection_project = get_project_collection()
#         collection_module = get_module_collection()
#         module_object_id = ObjectId(module_id)
#
#         # Perform a $lookup to get project information using the project_id from the module
#         pipeline = [
#             {
#                 "$match": {"_id": module_object_id}
#             },
#             {
#                 "$lookup": {
#                     "from": "collection_project",
#                     "localField": "project_id",
#                     "foreignField": "project_id",
#                     "as": "project_info"
#                 }
#             },
#             {
#                 "$unwind": "$project_info"  # Unwind the result of the lookup
#             }
#         ]
#
#         result = list(collection_module.aggregate(pipeline))
#
#         if not result:
#             raise HTTPException(status_code=404, detail="Module not found")
#
#         # Extract information from the result
#         module_created_at = result[0].get("created_at")
#         module_created_by = result[0].get("user_mail")
#         project_created_at = result[0]["project_info"].get("created_at")
#         project_name = result[0]["project_info"].get("project_name")
#
#         # Create a dictionary with the required information
#         result_dict = {
#             "project_created_at": project_created_at,
#             "module_created_at": module_created_at,
#             "module_created_by": module_created_by,
#             "project_name": project_name,
#         }
#
#         return {"msg": "prospect timeline fetched successfully", "prospects": result_dict}
#
#     except HTTPException as http_exception:
#         raise http_exception
#
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))
