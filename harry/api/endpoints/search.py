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
import re

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
    

# create api to filter organizations on basis of county or state or annual revenue
@router.get('/filter/organization', response_description="List of organizations", response_model=OrganizationResponse, response_model_by_alias=False, status_code=status.HTTP_200_OK)
async def search_organization(
        county: str = Query(None),
        state: str = Query(None),
        annual_revenue_min: int = Query(None),
        annual_revenue_max: int = Query(None),
        growth_from_last_year: int = Query(None),
        page_size: int = Query(10, ge=1),
        page: int = Query(1, ge=1)):
    try:
        filter_query = {}
        collection_organization = get_organization_collection()

        if county:
            filter_query["county"] = county

        if state:
            state_pattern = re.compile(f'^{state}$', re.IGNORECASE)
            filter_query["state"] = state_pattern

        if annual_revenue_min is not None or annual_revenue_max is not None:
            annual_revenue_query = {}
            if annual_revenue_min is not None:
                annual_revenue_query["$gte"] = annual_revenue_min
            if annual_revenue_max is not None:
                annual_revenue_query["$lte"] = annual_revenue_max
            filter_query["annual_revenue"] = annual_revenue_query

        if growth_from_last_year:
            growth_mapping = {
                '1': {'$gte': 0, '$lte': 20},
                '2': {'$gte': 20, '$lte': 40},
                '3': {'$gte': 40, '$lte': 60},
                '4': {'$gte': 60, '$lte': 80},
                '5': {'$gte': 80, '$lte': 100},
            }
            if growth_from_last_year in growth_mapping:
                filter_query["growth_from_last_year"] = growth_mapping[growth_from_last_year]

        organizations = list(collection_organization.find(filter_query).limit(page_size).skip((page - 1) * page_size))

        return OrganizationResponse(result=organizations, total=len(organizations), message="Organizations retrieved successfully")

    except HTTPException as http_exception:
        traceback.print_exc()
        raise http_exception

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))