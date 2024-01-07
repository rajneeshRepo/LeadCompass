from enum import Enum

from pydantic import BaseModel, EmailStr, constr, Field
from datetime import datetime
from typing import Optional
from Enum import StatusEnum


class AmountOptions(str, Enum):
    ALL_AMOUNTS = "All Amounts"
    LESS_THAN_100K = "Less than $100,000"
    GREATER_THAN_100K = "Greater than $100,000"


class TransactionCountOptions(str, Enum):
    ALL_TRANSACTIONS = "All Transactions"
    GREATER_THAN_1 = "Greater than 1"
    LESS_THAN_10 = "Less than 10"
    GREATER_THAN_10 = "Greater than 10"


class DurationOptions(str, Enum):
    ALL_DURATIONS = "All Durations"
    LESS_THAN_6_MONTHS = "Less than 6 months"
    LESS_THAN_1_YEAR = "Less than 1 year"
    GREATER_THAN_1_YEAR = "Greater than 1 year"


class TransactionFilters(BaseModel):
    amount: Optional[AmountOptions]
    transaction_count: Optional[TransactionCountOptions]
    duration: Optional[DurationOptions]
