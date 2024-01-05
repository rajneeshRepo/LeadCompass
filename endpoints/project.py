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
    tags=["Project"],
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


# async def run_script(script_path):
#     process = await asyncio.create_subprocess_exec("python", script_path)
#     await process.communicate()
#
# async def run_scripts():
#     collection_project = get_project_collection()
#
#     cur_dir = os.getcwd()
#     script_directory = os.path.join(cur_dir, "managers")
#
#     script_filenames = ["update_borrower_name_sam.py", "update_sam.py", "filter_sam.py",
#                         "flattened.py", "listing_more_than_one_borrower.py", "tags_for_company_borrowers.py",
#                         "mvp.py"]
#
#     tasks = [run_script(f"{script_directory}/{script_filename}") for script_filename in script_filenames]
#     await asyncio.gather(*tasks)

async def run_scripts():
    collection_project = get_project_collection()

    cur_dir = os.getcwd()
    script_directory = os.path.join(cur_dir, "managers")

    script_filenames = ["update_borrower_name_sam.py", "update_sam.py", "filter_sam.py",
                        "flattened.py", "listing_more_than_one_borrower.py", "tags_for_company_borrowers.py",
                        "mvp.py"]

    for script_filename in script_filenames:
        script_path = f"{script_directory}/{script_filename}"
        subprocess.run(["python", script_path])

    # collection_project.update_one({"_id": id}, {"$set": {"status": "completed"}})


@router.post('/project')
async def create_project(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    try:
        collection_sam = get_sam_collection()
        result_sam = []
        if file:
            response = await upload_file(file)
            companies = []
            if response.get("status_code") == 200:
                if response.get("type") == "json":
                    companies = response.get('data', dict())

                elif response.get("type") == "csv":
                    companies = response.get('data', [])

                elif response.get("type") == "xlsx":
                    companies = response.get('data', [])

            if not companies:
                return {"msg": "No Companies Provided in request"}

            result_sam = collection_sam.insert_many(companies)

        collection_project = get_project_collection()

        new_project = {
            "pid": collection_project.count_documents({}) + 1,
            "project_name": f"project_{datetime.now().strftime('%Y%m%d')}",
            "user_name": "uk",
            "total_mortgage_transaction": collection_sam.count_documents({}),
            "last_10_year_transactions_mortgage": collection_sam.count_documents({"time_tag": "N"}),
            "residential_properties_transactions_mortgage": collection_sam.count_documents({"residential_tag": 1}),
            "created_at": datetime.now(),
            "status": "complete",
            "source": "blackknight"
        }
        # print(new_project)
        result_project = collection_project.insert_one(new_project)

        collection_sam.update_many({}, {"$set": {"project_id": new_project.get('pid')}})
        new_project["_id"] = str(new_project["_id"])

        # new_project_response = {key: value for key, value in new_project.items() if key != '_id'}

        background_tasks.add_task(run_scripts)
        return {"msg": "project added successfully",
                "new_project": new_project}

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