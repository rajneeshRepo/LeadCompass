from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends, Body
from pymongo import MongoClient
from pymongo.collection import Collection

from Oauth import get_current_user, create_access_token
from config.db import get_collection
from schemas import CreateUserSchema
from utils import hash_password, verify_password

router = APIRouter(
    prefix="",
    tags=["Auth"],
    responses={404: {"description": "Not found"}},
)


@router.post('/state')
async def get_states():
    try:
        states = []

        return {"msg": "User registered successfully", "states": states }

    except HTTPException as http_exception:
        raise http_exception

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
