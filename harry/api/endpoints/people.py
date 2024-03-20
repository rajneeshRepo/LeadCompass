from dotenv import load_dotenv, find_dotenv
from fastapi import APIRouter, HTTPException, Depends, Body, status, Query
from pymongo import MongoClient
from pymongo.collection import Collection
from bson import ObjectId
from datetime import datetime
from config.db import get_collection
import os
import traceback
from schemas.people import PeopleSchema, PeopleResponse, PeopleUpdateSchema

router = APIRouter(
    # prefix="/people",
    tags=["People"],
    responses={404: {"description": "Not found"}},
)

_ = load_dotenv(find_dotenv())
mongo_url = os.getenv("mongo_url")
print(f"harry mongo url: {mongo_url}")

def get_people_collection():
    client = MongoClient(mongo_url)
    db = client["harry"]
    people_collection = db["people"]
    return people_collection


@router.post('/people', response_model_by_alias=False, response_description="Project added successfully", status_code=status.HTTP_201_CREATED)
async def create_person(person: PeopleSchema = None):
    try:
        collection_people = get_people_collection()
        
        new_person = {
            "id": ObjectId(),
            "name": person.name,
            "linkedin_id": person.linkedin_id,
            "title": person.title,
            "created_at": datetime.now(),
            "organization_id": person.organization_id,
            "user_id": person.user_id
        }
        new_person = PeopleSchema(**new_person)

        result_organization = collection_people.insert_one(new_person.model_dump(by_alias=True, exclude=["id"]))

        return PeopleSchema(message = "Person added successfully",result=new_person, total=1)

    except HTTPException as http_exception:
        raise http_exception

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
#write api to update person
@router.put('/people', response_model_by_alias=False, response_description="Person updated successfully", status_code=status.HTTP_200_OK)
async def update_person(person_data: PeopleUpdateSchema = None):
    try:
            
        collection_people = get_people_collection()
        person = collection_people.find_one({"_id": ObjectId(person_data.id)})

        if not person:
            raise HTTPException(status_code=404, detail=f'No person with this id: {person_data.id} found')

        updated_person_data = {
            k: v for k, v in person_data.model_dump(by_alias=True,exclude={"id"}).items() if v is not None
        }

        update_result = collection_people.find_one_and_update(
            {"_id": ObjectId(person_data.id)},
            {"$set": updated_person_data}
        )

        return {"msg": "person updated successfully"} 
    
    except HTTPException as http_exception:
        raise http_exception
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    






# @router.get('/people/all', response_description="List of peoples for particular organization", response_model=PeopleResponse, response_model_by_alias=False, status_code=status.HTTP_200_OK)
# async def get_all_organization_person(
#         organization_id: int = Query(...),
#         page_size: int = Query(10, ge=1),
#         page: int = Query(1, ge=1)):
#     try:
#         collection_people = get_people_collection()

#         existing_person = collection_people.find_one({"_id": ObjectId(organization_id)})

#         if not existing_person:
#             raise HTTPException(status_code=404, detail="No Person found for this organization.")

#         filter_query = {}

#         person = list(collection_people.find(filter_query).limit(page_size).skip((page - 1) * page_size))

#         return PeopleResponse(result=person, total=collection_people.count_documents(filter_query), message="Persons retrieved successfully")

#     except HTTPException as http_exception:
#         traceback.print_exc()
#         raise http_exception

#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=str(e))