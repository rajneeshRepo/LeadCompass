from enum import Enum
from pydantic import ConfigDict, BaseModel, EmailStr, constr, Field, validator
from datetime import datetime
from typing import Optional, Annotated, List, Union
from pydantic.functional_validators import BeforeValidator
from Enum import ContactEnum


# Represents an ObjectId field in the database.
# It will be represented as a `str` on the model so that it can be serialized to JSON.
PyObjectId = Annotated[str, BeforeValidator(str)]

class ContactSchema(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    people_id: int
    contact_type: ContactEnum
    person_contact: Union[str, EmailStr]  # Represents either an email or a phone number
    is_primary: Optional[bool] = False
    

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )

    @validator("person_contact")
    def validate_contact_value(cls, v, values):
        print(values)
        if "contact_type" in values:
            if values["contact_type"] == ContactEnum.PHONE and "@" in v:
                raise ValueError("should be a valid phone number, not email address")
            elif values["contact_type"] == ContactEnum.EMAIL and "@" not in v:
                raise ValueError("should be a valid email address, not phone number")
        return v
    
class ContactUpdateSchema(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    people_id: int
    contact_type: ContactEnum
    person_contact: Union[str, EmailStr]  # Represents either an email or a phone number
    is_primary: Optional[bool] = False
    

    @validator("person_contact")
    def validate_contact_value(cls, v, values):
        print(values)
        if "contact_type" in values:
            if values["contact_type"] == ContactEnum.PHONE and "@" in v:
                raise ValueError("should be a valid phone number, not email address")
            elif values["contact_type"] == ContactEnum.EMAIL and "@" not in v:
                raise ValueError("should be a valid email address, not phone number")
        return v

class ContactResponse(BaseModel):
    message: str
    total: Optional[int] = None
    result: Union[ContactSchema, List[ContactSchema]]



