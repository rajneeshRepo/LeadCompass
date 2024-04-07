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
from schemas.people import PeopleResponse, PeopleSchema, PeopleUpdateSchema, AddPeopleSchema

router = APIRouter(
    # prefix="/contact",
    tags=["Organization"],
    responses={404: {"description": "Not found"}},
)

_ = load_dotenv(find_dotenv())
mongo_url = os.getenv("mongo_url")

def get_people_collection():
    client = MongoClient(mongo_url)
    db = client["harry"]
    contact_collection = db["people"]
    return contact_collection

def get_contact_collection():
    client = MongoClient(mongo_url)
    db = client["harry"]
    contact_collection = db["contact"]
    return contact_collection

def get_organization_collection():
    client = MongoClient(mongo_url)
    db = client["harry"]
    organization_collection = db["organization"]
    return organization_collection

def get_user_collection():
    client = MongoClient(mongo_url)
    db = client["harry"]
    organization_collection = db["user"]
    return organization_collection

@router.get('/contact', response_description="List of particular contact", response_model=PeopleResponse, response_model_by_alias=False, status_code=status.HTTP_200_OK)
async def get_contact_by_id(
        id: str = Query(...),
        page_size: int = Query(10, ge=1),
        page: int = Query(1, ge=1)):
    try:
        collection_contact = get_people_collection()

        existing_contact = collection_contact.find_one({"_id": ObjectId(id)})

        if not existing_contact:
            raise HTTPException(status_code=404, detail="Organization not found")
        filter_query = {"_id": ObjectId(id)}

        organization = list(collection_contact.find(filter_query).limit(page_size).skip((page - 1) * page_size))

        return PeopleResponse(result=organization, total=1, message="Organization retrieved successfully")

    except HTTPException as http_exception:
        traceback.print_exc()
        raise http_exception

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get('/people/all', response_description="List of people", response_model=PeopleResponse, response_model_by_alias=False, status_code=status.HTTP_200_OK)
async def get_contacts_by_organization(
        id: str = Query(...),
        page_size: int = Query(10, ge=1),
        page: int = Query(1, ge=1)):
    try:
        collection_people = get_people_collection()
        collection_contact = get_contact_collection()

        filter_query = {"organization_id": ObjectId(id)}

        organization = list(collection_people.find(filter_query))
        
        for person in organization:
            contact_details = collection_contact.find({"people_id": person["_id"]})
            if contact_details:
                for c1 in contact_details:
                    if c1['type']=='phone' and c1["is_primary"]==True:
                        person['primary_contact'] = c1['value']
                    if c1['type']=='phone' and c1["is_primary"]==False:
                        person['secondary_contact'] = c1['value']
                    if c1['type']=='email' and c1["is_primary"]==True:
                        person['primary_email'] = c1['value']
                    if c1['type']=='email' and c1["is_primary"]==False:
                        person['secondary_email'] = c1['value']


        return PeopleResponse(result=organization, total=len(organization), message="contacts retrieved successfully")

    except HTTPException as http_exception:
        raise http_exception

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/contact', response_model_by_alias=False, response_description="Contact added successfully", status_code=status.HTTP_201_CREATED)
async def create_contact(contact: AddPeopleSchema):
    try:
        collection_people = get_people_collection()
        collection_contact = get_contact_collection()
        collection_organization = get_organization_collection()
        collection_user = get_user_collection()
        user = collection_user.find_one({"email": contact.user_email})
        existing_organization = collection_organization.find_one({"_id":ObjectId(contact.organization_id) })

        if not user:
            raise HTTPException(status_code=404, detail=f'No user with this email: {contact.user_email} found')
        if not existing_organization:
            raise HTTPException(status_code=404, detail=f'No organization with this id: {contact.organization_id} found')
        
        new_contact = {
            "user_id": user["_id"],
            "organization_id":existing_organization["_id"],
            "name": contact.name,
            "title": contact.title,
            "linkedin": contact.linkedin,
            "created_at": datetime.now(),
            "last_modified": datetime.now()
        }
        result_people= collection_people.insert_one(new_contact)
        if contact.primary_contact:
            primary_new_contact = {
                    "user_id": user["_id"],
                    "people_id": result_people.inserted_id,
                    "value": contact.primary_contact,
                    "type": "phone",
                    "is_primary": True,
                    "created_at": datetime.now(),
                    "last_modified": datetime.now()
                }
            collection_contact.insert_one(primary_new_contact)
        if contact.secondary_contact:
            secondary_new_contact = {
                    "user_id": user["_id"],
                    "people_id": result_people.inserted_id,
                    "value": contact.secondary_contact,
                    "type": "phone",
                    "is_primary": False,
                    "created_at": datetime.now(),
                    "last_modified": datetime.now()
                }
            collection_contact.insert_one(secondary_new_contact)
        if contact.primary_email:
            primary_new_email = {
                        "user_id": user["_id"],
                        "people_id": result_people.inserted_id,
                        "value": contact.primary_email,
                        "type": "email",
                        "is_primary": True,
                        "created_at": datetime.now(),
                        "last_modified": datetime.now()
                    }
            collection_contact.insert_one(primary_new_email)
        if contact.secondary_email:
            secondary_new_email = {
                        "user_id": user["_id"],
                        "people_id": result_people.inserted_id,
                        "value": contact.secondary_email,
                        "type": "email",
                        "created_at": datetime.now(),
                        "is_primary": False,
                        "last_modified": datetime.now()
                    }
            collection_contact.insert_one(secondary_new_email)

        return PeopleResponse(message = "Contact added successfully",result=new_contact, total=1)

    except HTTPException as http_exception:
        raise http_exception

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

#write api to update contact
@router.put('/contact', response_model_by_alias=False, response_description="Contact updated successfully", status_code=status.HTTP_200_OK)
async def update_contact(contact_data: PeopleUpdateSchema):
    try:
            
        collection_people = get_people_collection()
        people = collection_people.find_one({"_id": ObjectId(contact_data.id)})
        if not people:
            raise HTTPException(status_code=404, detail=f'No contact with this id: {contact_data.id} found')
        update_people = {
                "name": contact_data.name,
                "title": contact_data.title,
                "linkedin": contact_data.linkedin,
                "last_modified": datetime.now()
            }
        updated_contact_data = {
            k: v for k, v in update_people.items() if getattr(contact_data, k, None) is not None
            }
        update_result =collection_people.find_one_and_update(
            {"_id": ObjectId(contact_data.id)},
            {"$set": updated_contact_data}
        )
        #remove the releated contact for  the people from the contact collection
        collection_contact = get_contact_collection()
        collection_contact.delete_many({"people_id": ObjectId(contact_data.id)})
        #insert the new contact details
        if contact_data.primary_contact:
                primary_new_contact = {
                    "user_id": people["user_id"],
                    "people_id": people["_id"],
                    "value": contact_data.primary_contact,
                    "type": "phone",
                    "is_primary": True,
                    "created_at": datetime.now(),
                    "last_modified": datetime.now()
                }
                collection_contact.insert_one(primary_new_contact)
        if contact_data.secondary_contact:
            secondary_new_contact = {
                    "user_id": people["user_id"],
                    "people_id": people["_id"],
                    "value": contact_data.secondary_contact,
                    "type": "phone",
                    "is_primary": False,
                    "created_at": datetime.now(),
                    "last_modified": datetime.now()
                }
            collection_contact.insert_one(secondary_new_contact)
        if contact_data.primary_email:
            primary_new_email = {
                        "user_id": people["user_id"],
                        "people_id": people["_id"],
                        "value": contact_data.primary_email,
                        "type": "email",
                        "is_primary": True,
                        "created_at": datetime.now(),
                        "last_modified": datetime.now()
                    }
            collection_contact.insert_one(primary_new_email)
        if contact_data.secondary_email:
            secondary_new_email = {
                        "user_id": people["user_id"],
                        "people_id": people["_id"],
                        "value":contact_data.secondary_email,
                        "type": "email",
                        "created_at": datetime.now(),
                        "is_primary": False,
                        "last_modified": datetime.now()
                    }
            collection_contact.insert_one(secondary_new_email)

        return {"msg": "Contact updated successfully"} 
    
    except HTTPException as http_exception:
        raise http_exception
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
#write api to delete contact
@router.delete('/contact', response_model_by_alias=False, response_description="Contact deleted successfully", status_code=status.HTTP_200_OK)
async def delete_contact(contact_id: str = None):
    try:
        collection_contact = get_people_collection()
        contact = collection_contact.find_one({"_id": ObjectId(contact_id)})

        if not contact:
            raise HTTPException(status_code=404, detail=f'No contact with this id: {contact_id} found')
        
        collection_contact = get_contact_collection()
        collection_contact.delete_many({"people_id": ObjectId(contact.id)})
        collection_contact.delete_one({"_id": ObjectId(contact_id)})
        return {"msg": "Contact deleted successfully"} 
    
    except HTTPException as http_exception:
        raise http_exception
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

