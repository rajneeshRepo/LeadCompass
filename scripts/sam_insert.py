from pymongo import MongoClient

from data import load_json

# Connect to MongoDB
client = MongoClient("mongodb+srv://user:admin@leadcompass.auduirj.mongodb.net/?retryWrites=true&w=majority")
db = client["lead_compass"]
collection = db["complete_sam"]


batch_size = 100
offset = 0

while True:
    records = load_json.company_data
    if not records:
        break



    # documents = []
    # for record in records:
    #     document = {
    #         "FIPSCode": record[0],
    #         "PropertyFullStreetAddress": record[1],
    #         "PropertyCityName": record[2],
    #     }
    #     documents.append(document)

    collection.insert_many(list(records))

    offset += batch_size

