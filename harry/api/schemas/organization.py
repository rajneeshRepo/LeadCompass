from enum import Enum
from pydantic import ConfigDict, BaseModel, EmailStr, constr, Field
from datetime import datetime
from typing import Optional, Annotated, List, Union
from pydantic.functional_validators import BeforeValidator


# Represents an ObjectId field in the database.
# It will be represented as a `str` on the model so that it can be serialized to JSON.
PyObjectId = Annotated[str, BeforeValidator(str)]


class OrganizationSchema(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = ""
    address: Optional[str] = None
    annual_revenue : Optional[int] = None
    growth_from_last_year : Optional[str] = ""
    team_size : Optional[int] = ""
    official_phone: Optional[str] = ""
    website : Optional[str] = ""
    city : Optional[str] = ""
    state : Optional[str] = ""
    last_modified: str = None
    created_at: datetime = None

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )

class OrganizationUpdateSchema(BaseModel):
    id: PyObjectId = Field(alias="_id")
    name: Optional[str] = None
    address: Optional[str] = None
    annual_revenue : Optional[int] = None
    growth_from_last_year : Optional[str] = None
    team_size : Optional[int] = None
    official_phone: Optional[str] = None
    website : Optional[str] = None
    city : Optional[str] = None
    state : Optional[str] = None
    last_modified: str 


    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )

class OrganizationResponse(BaseModel):
    message: str
    total: Optional[int] = None
    result: Union[OrganizationSchema, List[OrganizationSchema]]