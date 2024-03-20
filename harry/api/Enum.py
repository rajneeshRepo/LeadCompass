from enum import Enum

class RoleEnum(str, Enum):
    user = "user"
    admin = "admin"

class ContactEnum(str, Enum):
    PHONE = "p"
    EMAIL = "e"