from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends, Body
from pymongo import MongoClient
from pymongo.collection import Collection

from Oauth import get_current_user, create_access_token
from config.db import get_collection
from schemas import CreateUserSchema
from schemas.project import CreateProject
from utils import hash_password, verify_password

router = APIRouter(
    prefix="/project",
    tags=["Project"],
    responses={404: {"description": "Not found"}},
)


def get_project_collection():
    client = MongoClient("mongodb+srv://user:admin@leadcompass.auduirj.mongodb.net/?retryWrites=true&w=majority")
    db = client["lead_compass"]
    project_collection = db["project"]
    return project_collection





@router.post('/create')
async def create_project(project: CreateProject, current_user: str = Depends(get_current_user)):
    try:

        project_collection = get_project_collection()
        existing_project = project_collection.find_one({"email": user.email.lower()})
        if existing_project:
            raise HTTPException(status_code=409, detail='project already exists')

        new_project = {
            "project_id" : "1",
            "project_name": "dhjs",
            "user_name": current_user.name,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        result_project = project_collection.insert_one(new_project)

        return {"msg": "User registered successfully", "user_id": str(result_project.inserted_id)}

    except HTTPException as http_exception:
        raise http_exception

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

