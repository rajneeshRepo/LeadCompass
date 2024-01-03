import json
import os

# cur_dir = os.getcwd()
cur_dir = '/Users/shtlpmac042/Desktop/LeadCompass'
company_file_path = os.path.join(cur_dir, "data/mud_lead.json")
# print(company_file_path)


def load_data_from_json(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data


company_data = load_data_from_json(company_file_path)
