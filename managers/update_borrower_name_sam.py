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

# field_to_check_mortgage = ["Borrower1LastNameOeCorporationName", "Borrower1FirstNameMiddleName",
#                            "Borrower2FirstNameMiddleName", "Borrower2LastNameOrCorporationName"]

# Set batch size based on your system's memory constraints
batch_size = 1000

st = get_current_time()

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
        b1f = document["Borrower1FirstNameMiddleName"]
        b1l = document["Borrower1LastNameOeCorporationName"]

        borrower1_full_name = (b1f if b1f else "") + (b1l if b1l else "")

        b2f = document["Borrower2FirstNameMiddleName"]
        b2l = document["Borrower2LastNameOrCorporationName"]

        borrower2_full_name = (b2f if b2f else "") + (b2l if b2l else "")

        # Prepare update data for each document
        update_operation = UpdateOne(
            {"_id": document["_id"]},
            {"$set": {"borrower1_full_name": borrower1_full_name, "borrower2_full_name": borrower2_full_name}}
        )

        last_processed_id = document["_id"]
        update_operations.append(update_operation)

    if update_operations:
        collection_sam.bulk_write(update_operations)

et = get_current_time()
duration = et - st

print(f"Processing time for mortgage table: {duration} seconds")

