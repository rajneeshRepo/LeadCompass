from dotenv import load_dotenv, find_dotenv
from fastapi import APIRouter, HTTPException, Depends, Body, status, Query
from pymongo import MongoClient
from pymongo.collection import Collection
from bson import ObjectId
from datetime import datetime
from config.db import get_collection
import os
import traceback
from schemas.organization import OrganizationSchema, OrganizationResponse, OrganizationUpdateSchema

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

@router.post('/organization', response_model_by_alias=False, response_description="Project added successfully", status_code=status.HTTP_201_CREATED)
async def create_organization(organization: OrganizationSchema = None):
    try:
        collection_organization = get_organization_collection()

        existing_organization = collection_organization.find_one({"name": organization.name})

        if existing_organization:
            raise HTTPException(status_code=404, detail="Organization already exists with this name.")
        
        new_organization = {
            "id": ObjectId(),
            # "user_id": user.get('id'),
            "user_id": 1,
            "name": organization.name,
            "address": organization.address,
            "annual_revenue": organization.annual_revenue,
            "growth_from_last_year": organization.growth_from_last_year,
            "team_size": organization.team_size,
            "official_phone": organization.official_phone,
            "website": organization.website,
            "city": organization.city,
            "state": organization.state,
            # "last_modified": user.get('name'),
            "last_modified": "ujjwal",
            "created_at": datetime.now()
        }
        new_organization = OrganizationSchema(**new_organization)

        result_organization = collection_organization.insert_one(new_organization.model_dump(by_alias=True, exclude=["id"]))

        return OrganizationResponse(message = "organization added successfully",result=new_organization, total=1)

    except HTTPException as http_exception:
        raise http_exception

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# @router.get('/organization', response_description="List of organizations", response_model=OrganizationResponse, response_model_by_alias=False, status_code=status.HTTP_200_OK)
# async def get_organization_by_id(
#         id: str = Query(...),
#         page_size: int = Query(10, ge=1),
#         page: int = Query(1, ge=1)):
#     try:
#         collection_organization = get_organization_collection()

#         existing_organization = collection_organization.find_one({"_id": ObjectId(id)})

#         if not existing_organization:
#             raise HTTPException(status_code=404, detail="Organization not found")
#         filter_query = {"_id": ObjectId(id)}

#         organization = list(collection_organization.find(filter_query).limit(page_size).skip((page - 1) * page_size))

#         return OrganizationResponse(result=organization, total=1, message="Organization retrieved successfully")

#     except HTTPException as http_exception:
#         traceback.print_exc()
#         raise http_exception

#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=str(e))
    

# @router.get('/organization/all', response_description="List of organizations", response_model=OrganizationResponse, response_model_by_alias=False, status_code=status.HTTP_200_OK)
# async def get_organizations(
#         page_size: int = Query(10, ge=1),
#         page: int = Query(1, ge=1)):
#     try:
#         collection_organization = get_organization_collection()

#         filter_query = {}

#         organization = list(collection_organization.find(filter_query).limit(page_size).skip((page - 1) * page_size))

#         return OrganizationResponse(result=organization, total=len(organization), message="Organizations retrieved successfully")

#     except HTTPException as http_exception:
#         traceback.print_exc()
#         raise http_exception

#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=str(e))
    



#write api to update organization
@router.put('/organization', response_model_by_alias=False, response_description="Organization updated successfully")
async def update_organization(organization_data: OrganizationUpdateSchema):
    try:
            
        collection_organization = get_organization_collection()
        organization = collection_organization.find_one({"_id": ObjectId(organization_data.id)})

        if not organization:
            raise HTTPException(status_code=404, detail=f'No organization with this id: {organization_data.id} found')

        updated_organization_data = {
            k: v for k, v in organization_data.model_dump(by_alias=True,exclude={"id"}).items() if v is not None
        }
        print(updated_organization_data)
        update_result = collection_organization.find_one_and_update(
            {"_id": ObjectId(organization_data.id)},
            {"$set": updated_organization_data}
        )

        return {"msg": "Organization updated successfully"} 
    
    except HTTPException as http_exception:
        raise http_exception
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



    

    
