from pydantic import BaseModel, EmailStr, constr, Field
from datetime import datetime
from typing import Optional
from Enum import StatusEnum


# class PyObjectId:
#     pass


class ProjectSchema(BaseModel):
    name: str
    user_name: str
    created_at: datetime


class CreateProject(ProjectSchema):

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True
