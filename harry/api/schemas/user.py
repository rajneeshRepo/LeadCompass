from enum import Enum
from pydantic import ConfigDict, BaseModel, EmailStr, constr, Field
from datetime import datetime
from typing import Optional, Annotated, List, Union
from pydantic.functional_validators import BeforeValidator
from Enum import RoleEnum


# Represents an ObjectId field in the database.
# It will be represented as a `str` on the model so that it can be serialized to JSON.
PyObjectId = Annotated[str, BeforeValidator(str)]


class UserSchema(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    username: str
    email: EmailStr
    first_name: Optional[str] = ""
    last_name: Optional[str] = ""
    password: constr(min_length=5) # type: ignore
    role: Optional[RoleEnum] = "user"
    created_at: datetime = None
  

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )

class UserUpdateSchema(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)


class UserResponse(BaseModel):
    message: str
    total: Optional[int] = None
    result: Union[UserSchema, List[UserSchema]]