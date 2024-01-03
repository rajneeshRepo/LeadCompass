from datetime import datetime
from typing import List

from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends, Body, UploadFile, File
from pymongo import MongoClient

from schemas.sam import PropertyData
from utils import hash_password, verify_password, upload_file

router = APIRouter(
    prefix="/project",
    tags=["Project"],
    responses={404: {"description": "Not found"}},
)


def get_api_key_collection():
    client = MongoClient("mongodb+srv://user:admin@leadcompass.auduirj.mongodb.net/?retryWrites=true&w=majority")
    db = client["lead_compass"]
    api_key_collection = db["api_key"]
    return api_key_collection


def validate_fields(companies: List[dict]):
    for company in companies:
        try:
            PropertyData(**company)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid data: {str(e)}")


@router.post('/validate')
async def validate_file(api_key: str = Body(None), source: str = Body(None), file: UploadFile = File(None)):
    try:
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

            validate_fields(companies)
            return {"msg": "file validated successfully", "companies": companies}

        elif api_key:
            if str(source).lower() == "forecasa" and api_key == "fNc4oVFWFjx1SZX9YdI0MRzWaE3Jlh7":
                return {"msg": "forecasa_api_key is valid"}

            elif str(source).lower() == "blacknight" and api_key == "b2Gz8tO0YsFb1v6iPpTmAj9KkH7hJqLx":
                return {"msg": "blacknight_api_key is valid"}

            else:
                return {"msg": "invalid api key"}

    except HTTPException as http_exception:
        raise http_exception

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post('/api_key')
async def create_api_key(api_key: str = Body(None), source: str = Body(None)):
    try:
        api_key_collection = get_api_key_collection()
        if (str(source).lower() == "forecasa" and api_key == "fNc4oVFWFjx1SZX9YdI0MRzWaE3Jlh7") or \
                (str(source).lower() == "blacknight" and api_key == "b2Gz8tO0YsFb1v6iPpTmAj9KkH7hJqLx"
        ):
            query = {"api_key": api_key, "source": str(source).lower()}
            existing_key = api_key_collection.find_one(query)
            if existing_key:
                return {"msg": "key already exists"}
            result_api_key = api_key_collection.insert_one(query)
            return {"msg": "key successfully inserted"}

    except HTTPException as http_exception:
        raise http_exception

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
