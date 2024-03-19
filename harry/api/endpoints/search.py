from typing import Union
from dotenv import load_dotenv, find_dotenv
from fastapi import APIRouter, HTTPException, Depends, Body, status, Query
from pymongo import MongoClient
from pymongo.collection import Collection
from bson import ObjectId
from datetime import datetime
from config.db import get_collection
import os
import traceback
from schemas.people import PeopleResponse
from schemas.organization import OrganizationSchema, OrganizationResponse

router = APIRouter(
    # prefix="/organization",
    tags=["Organization"],
    responses={404: {"description": "Not found"}},
)

_ = load_dotenv(find_dotenv())
mongo_url = os.getenv("mongo_url")

def get_organization_collection():
    client = MongoClient(mongo_url)
    db = client["harry"]
    organization_collection = db["organization"]
    return organization_collection

def get_people_collection():
    client = MongoClient(mongo_url)
    db = client["harry"]
    people_collection = db["people"]
    return people_collection

    

@router.get('/search/all', response_description="List of organizations or people", response_model=list[Union[OrganizationResponse, PeopleResponse]], response_model_by_alias=False, status_code=status.HTTP_200_OK)
async def search_by_organization_or_person(
        type: str = Query(...),
        search_query: str = Query(...),
        page_size: int = Query(10, ge=1),
        page: int = Query(1, ge=1)):
    try:
        filter_query = {}
        response_list = []

        if type == "organization":
            collection_organization = get_organization_collection()
            filter_query["$or"] = [
                {"name": {"$regex": search_query, "$options": "i"}}
            ]

            organizations = list(collection_organization.find(filter_query).limit(page_size).skip((page - 1) * page_size))

            response_list.append(OrganizationResponse(result=organizations, total=len(organizations), message="Organizations retrieved successfully"))
        
        elif type == "person":
            collection_people = get_people_collection()
            filter_query["$or"] = [
                {"name": {"$regex": search_query, "$options": "i"}}
            ]

            people = list(collection_people.find(filter_query).limit(page_size).skip((page - 1) * page_size))

            response_list.append(PeopleResponse(result=people, total=len(people), message="People retrieved successfully"))

        return response_list

    except HTTPException as http_exception:
        traceback.print_exc()
        raise http_exception

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))