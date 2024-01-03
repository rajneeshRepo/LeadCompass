from pymongo import MongoClient
import os
import time
from dotenv import load_dotenv
import pandas as pd
from pymongo import UpdateOne
import random
from bson.objectid import ObjectId

load_dotenv()


def get_sam_collection():
    client = MongoClient("mongodb+srv://user:admin@leadcompass.auduirj.mongodb.net/?retryWrites=true&w=majority")
    db = client["lead_compass"]
    sam_collection = db["complete_sam"]
    return sam_collection


def get_current_time():
    return time.time()


start_time = get_current_time()

# Define your terms and tags
terms_to_check = ["TRUST", "INC", "LLP", "LP"]
companyCodes = ["CN", "CO", "GN", "GP", "GV", "HO", "LC", "LL", "LP", "LS", "PA", "RL", "RT", "SP", "TT"]
field_to_check_mortgage = ["Borrower1LastNameOeCorporationName", "Borrower1FirstNameMiddleName",
                           "Borrower2FirstNameMiddleName", "Borrower2LastNameOrCorporationName"]
company_codes_fields_mortgage = ["Borrower1IDCode", "Borrower2IDCode"]

# Set batch size based on your system's memory constraints
batch_size = 1000

st = get_current_time()

# Get the total number of documents in the collection

last_processed_id = None

# Process data in batches
while True:
    query = {}  # You can add additional filters if needed
    print(last_processed_id)
    if last_processed_id:
        query["_id"] = {"$gt": ObjectId(last_processed_id)}

    collection_sam = get_sam_collection()
    cursor = collection_sam.find(query).sort("_id").limit(batch_size)

    x = collection_sam.count_documents(query)

    print(x)

    if x == 0:
        print("Reached end of document")
        break  # No more documents, break out of the loop

    update_operations = []

    # Process each document in the batch
    for document in cursor:
        company_tag_cal = ""
        company_tag_given = ""
        time_tag = "N"

        for field in field_to_check_mortgage:
            if document[field]:
                for term in terms_to_check:
                    if term in document[field].upper().split(" "):
                        company_tag_cal += term + " "

        for field in company_codes_fields_mortgage:
            if document[field] in companyCodes:
                company_tag_given += document[field] + ","

        if not document["OriginalDateOfContract"]:
            time_tag = "U"
        else:
            if document["OriginalDateOfContract"] < str(20130000):
                time_tag = "O"

        # Prepare update data for each document
        update_operation = UpdateOne(
            {"_id": document["_id"]},
            {"$set": {"company_tag_cal": company_tag_cal, "time_tag": time_tag, "company_tag_given": company_tag_given}}
        )

        last_processed_id = document["_id"]

        update_operations.append(update_operation)

    if update_operations:
        collection_sam.bulk_write(update_operations)

et = get_current_time()
duration = et - st

print(f"Processing time for deed table: {duration} seconds")

