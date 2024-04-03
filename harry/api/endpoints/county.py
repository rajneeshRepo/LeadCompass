from typing import Union
from dotenv import load_dotenv, find_dotenv
from fastapi import APIRouter, HTTPException, Depends, Body, status, Query
from util import state_with_county
from pymongo import MongoClient
from pymongo.collection import Collection
from bson import ObjectId
from datetime import datetime
from config.db import get_collection
import os
import traceback


router = APIRouter(
    tags=["state"],
    responses={404: {"description": "Not found"}},
)

_ = load_dotenv(find_dotenv())
mongo_url = os.getenv("mongo_url")



# write api to generate state with counties
@router.get('/state/county', response_description="List of states with counties", response_model_by_alias=False, status_code=status.HTTP_200_OK)
async def get_state_with_counties():
    try:
        state_with_counties = state_with_county.state_county_data
        # print(state_with_counties)
        state = list(state_with_counties.keys())

        # counties_data = state_with_counties.get(state, {})
        # print(counties_data)
        # counties_list = list(counties_data.keys())
        return {"states": state, "counties": []}
    except HTTPException as http_exception:
        traceback.print_exc()
        raise http_exception
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))