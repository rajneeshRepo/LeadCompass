import math
from pydantic import BaseModel, EmailStr, constr, Field, validator, confloat, field_validator, conlist
from datetime import datetime
from typing import Optional, Union, Any
from Enum import StatusEnum

#
# class PropertyData(BaseModel):
#     FIPSCode: Any
#     PropertyZipCode: Any
#     PropertyZip4: Any
#     PropertyUnitNumber: Any
#     PropertyHouseNumber: Any
#     RecordingDate: Any
#     RecorderBookNumber: Any
#     RecorderPageNumber: Any
#     RecorderDocumentNumber: Any
#     APN: Any
#     MultiAPNFlag: Any
#     LegalBlock: Any
#     LegalSection: Any
#     LegalDistrict: Any
#     LegalLandLot: Any
#     LegalUnit: Any
#     LegalPhaseNumber: Any
#     LegalTractNumber: Any
#     LenderNameID: Any
#     DueDate: Any
#     AdjustableRateRider: Any
#     FirstChangeDateYearConversionRider: Any
#     FirstChangeDateMonthDayConversionRider: Any
#     PrepaymentRider: Any
#     PrepaymentTermPenaltyRider: Any
#     BorrowerMailUnitNumber: Any
#     BorrowerMailZipCode: Any
#     BorrowerMailZip4: Any
#     OriginalDateOfContract: Any
#     LenderMailFullStreetAddress: Any
#     LenderMailZipCode: Any
#     LenderMailZip4: Any
#     LoanTermMonths: Any
#     LoanTermYears: Any
#     AssessorLandUse: Any
#     LoanTransactionType: Any
#     LoanOrganizationNMLS_ID: Any
#     MortgageBrokerNMLS_ID: Any
#     LoanOfficerNMLS_ID: Any
#     DPID: Any
#     UpdateTimeStamp: Any


class PropertyData(BaseModel):
    FIPSCode: Union[str, int]
    PropertyZipCode: Union[str, int]
    PropertyZip4: Union[str, int]
    PropertyUnitNumber: Union[str, int]
    PropertyHouseNumber: Union[str, int]
    RecordingDate: Union[str, int]
    RecorderBookNumber: Union[str, int]
    RecorderPageNumber: Union[str, int]
    RecorderDocumentNumber: Union[str, int]
    APN: Union[str, int]
    MultiAPNFlag: Union[float, str, int, None]
    LegalBlock: Union[str, int]
    LegalSection: Union[str, int]
    LegalDistrict: Union[str, int]
    LegalLandLot: Union[str, int]
    LegalUnit: Union[str, int]
    LegalPhaseNumber: Union[str, int]
    LegalTractNumber: Union[str, int]
    LenderNameID: Union[str, int]
    DueDate: Union[str, int]
    AdjustableRateRider: Union[str, None]
    FirstChangeDateYearConversionRider: Union[str, int]
    FirstChangeDateMonthDayConversionRider: Union[str, int]
    PrepaymentRider: Union[str, None]
    PrepaymentTermPenaltyRider: Union[str, int]
    BorrowerMailUnitNumber: Union[str, int]
    BorrowerMailZipCode: Union[str, int]
    BorrowerMailZip4: Union[str, int]
    OriginalDateOfContract: Union[str, int]
    LenderMailFullStreetAddress: Union[str, None]
    LenderMailZipCode: Union[str, int]
    LenderMailZip4: Union[str, int]
    LoanTermMonths: Union[str, int]
    LoanTermYears: Union[str, int, float]
    AssessorLandUse: Union[str, int]
    LoanTransactionType: Union[str, int]
    LoanOrganizationNMLS_ID: Union[str, int]
    MortgageBrokerNMLS_ID: Union[str, int]
    LoanOfficerNMLS_ID: Union[str, int]
    DPID: Union[str, int]
    UpdateTimeStamp: Union[str, int]

# @field_validator('MultiAPNFlag')
# def check_nan(cls, value):
#     if isinstance(value, (float, int)):
#         return float(value)
#     elif isinstance(value, str) and value.lower() == 'nan':
#         return 0
#     raise ValueError('Invalid value for MultiAPNFlag')
