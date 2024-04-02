from enum import Enum
from pydantic import ConfigDict, BaseModel, EmailStr, constr, Field
from datetime import datetime
from typing import Optional, Annotated, List, Union
from pydantic.functional_validators import BeforeValidator


# Represents an ObjectId field in the database.
# It will be represented as a `str` on the model so that it can be serialized to JSON.
PyObjectId = Annotated[str, BeforeValidator(str)]


class PeopleSchema(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    linkedin_id: Optional[str] = ""
    title: Optional[str] = ""
    created_at: datetime = None
    organization_id: PyObjectId
    user_id: PyObjectId

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )


class PeopleUpdateSchema(BaseModel):
    id: PyObjectId = Field(alias="_id")
    name: Optional[str] = None
    linkedin_id: Optional[str] = None
    title : Optional[int] = None

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )


class PeopleResponse(BaseModel):
    message: str
    total: Optional[int] = None
    result: Union[PeopleSchema, List[PeopleSchema]]