from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query
from pymongo import MongoClient

from Oauth import get_current_user
from config.db import get_collection
from schemas.user import UserUpdateSchema

router = APIRouter(
    prefix="/user",
    tags=["User"],
    responses={404: {"description": "Not found"}},
)

@router.get('/all')
async def get_all_users(
    current_user: str = Depends(get_current_user),
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1)
):
    try:
        User = get_collection("user")
        users = User.find({}, {"password": 0,'_id': 0 }).sort("id", -1).limit(page_size).skip((page - 1) * page_size)
        users_list = [user for user in users]
        return {"msg": "Users retrieved successfully", "users": users_list}

    except HTTPException as http_exception:
        raise http_exception

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/{id}')
async def get_user_by_id(id: int, current_user: str = Depends(get_current_user)):
    try:
        User = get_collection("user")
        user = User.find_one({"id": id}, {"password": 0})

        if user:
            return {"msg": "User retrieved successfully", "user": user}
        else:
            raise HTTPException(status_code=404, detail="User not found")

    except HTTPException as http_exception:
        raise http_exception

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put('/{id}')
async def update_user_by_id(id: str, user_data: UserUpdateSchema, current_user: str = Depends(get_current_user)):
    try:
        print(type(ObjectId(id)))

        User = get_collection("user")
        user = await User.find_one({"_id": ObjectId(id)})

        if not user:
            raise HTTPException(status_code=404, detail=f'No user with this id: {id} found')

        user_data = {
            k: v for k, v in user_data.model_dump(by_alias=True).items() if v is not None
        }
        update_result = User.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": user_data}
        )

        return {"msg": "User updated successfully"}

    except HTTPException as http_exception:
        raise http_exception

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
