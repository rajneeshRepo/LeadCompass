from enum import Enum
from pydantic import ConfigDict, BaseModel, EmailStr, constr, Field
from datetime import datetime
from typing import Optional, Annotated, List, Union
from pydantic.functional_validators import BeforeValidator


# Represents an ObjectId field in the database.
# It will be represented as a `str` on the model so that it can be serialized to JSON.
PyObjectId = Annotated[str, BeforeValidator(str)]


class DecisionMaker(BaseModel):
    name: str
    title: str
    linkedin: str
    primary_email: Optional[str]
    secondary_email: Optional[str] = None
    primary_contact: Optional[str]
    secondary_contact: Optional[str] = None

class OrganizationSchema(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = ""
    address: Optional[str] = None
    annual_revenue : Optional[str] = None
    growth_from_last_year : Optional[int] = ""
    team_size : Optional[str] = ""
    official_phone: Optional[str] = ""
    website : Optional[str] = ""
    city : Optional[str] = ""
    state : Optional[str] = ""
    last_modified: datetime = None
    created_at: datetime = None
    user_id: PyObjectId = None
    total_decision_makers: Optional[int] = None


    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )

class OrganizationUpdateSchema(BaseModel):
    id: PyObjectId = Field(alias="_id")
    name: Optional[str] = None
    address: Optional[str] = None
    annual_revenue : Optional[str] = None
    growth_from_last_year : Optional[int] = None
    team_size : Optional[str] = None
    official_phone: Optional[str] = None
    website : Optional[str] = None
    city : Optional[str] = None
    state : Optional[str] = None
    last_modified: datetime


    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )






class AddOrganizationSchema(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = ""
    address: Optional[str] = None
    annual_revenue : Optional[str] = None
    growth_from_last_year : Optional[int] = ""
    team_size : Optional[str] = ""
    official_phone: Optional[str] = ""
    website : Optional[str] = ""
    city : Optional[str] = ""
    state : Optional[str] = ""
    last_modified: datetime = None
    created_at: datetime = None
    user_id: PyObjectId = None
    user_email: Optional[str]
    decisionMakers: Optional[List[DecisionMaker]] = None


    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )

class OrganizationResponse(BaseModel):
    message: str
    total: Optional[int] = None
    result: Union[OrganizationSchema, List[OrganizationSchema]]