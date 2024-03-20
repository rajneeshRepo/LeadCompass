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
from schemas.contact import ContactResponse, ContactSchema, ContactUpdateSchema

router = APIRouter(
    # prefix="/contact",
    tags=["Organization"],
    responses={404: {"description": "Not found"}},
)

_ = load_dotenv(find_dotenv())
mongo_url = os.getenv("mongo_url")

def get_contact_collection():
    client = MongoClient(mongo_url)
    db = client["harry"]
    contact_collection = db["contact"]
    return contact_collection


@router.post('/contact', response_model_by_alias=False, response_description="Contact added successfully", status_code=status.HTTP_201_CREATED)
async def create_contact(contact: ContactSchema):
    try:
        collection_contact = get_contact_collection()
        
        new_contact = {
            "id": ObjectId(),
            "people_id": contact.people_id,
            "person_contact": contact.person_contact,
            "is_primary": contact.is_primary,
            "contact_type": contact.contact_type
        }
        new_contact = ContactSchema(**new_contact)

        result_contact = collection_contact.insert_one(new_contact.model_dump(by_alias=True, exclude=["id"]))

        return ContactResponse(message = "Contact added successfully",result=new_contact, total=1)

    except HTTPException as http_exception:
        raise http_exception

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

#write api to update contact
@router.put('/contact', response_model_by_alias=False, response_description="Contact updated successfully", status_code=status.HTTP_200_OK)
async def update_contact(contact_data: ContactUpdateSchema):
    try:
            
        collection_contact = get_contact_collection()
        print(contact_data)
        print(contact_data.id)
        contact = collection_contact.find_one({"_id": ObjectId(contact_data.id)})

        if not contact:
            raise HTTPException(status_code=404, detail=f'No contact with this id: {contact_data.id} found')

        updated_contact_data = {
            k: v for k, v in contact_data.model_dump(by_alias=True,exclude={"id"}).items() if v is not None
        }
        print(updated_contact_data)
        update_result = collection_contact.find_one_and_update(
            {"_id": ObjectId(contact_data.id)},
            {"$set": updated_contact_data}
        )

        return {"msg": "Contact updated successfully"} 
    
    except HTTPException as http_exception:
        raise http_exception
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
#write api to delete contact
@router.delete('/contact', response_model_by_alias=False, response_description="Contact deleted successfully", status_code=status.HTTP_200_OK)
async def delete_contact(contact_id: str = None):
    try:
        collection_contact = get_contact_collection()
        contact = collection_contact.find_one({"_id": ObjectId(contact_id)})

        if not contact:
            raise HTTPException(status_code=404, detail=f'No contact with this id: {contact_id} found')

        collection_contact.delete_one({"_id": ObjectId(contact_id)})

        return {"msg": "Contact deleted successfully"} 
    
    except HTTPException as http_exception:
        raise http_exception
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

