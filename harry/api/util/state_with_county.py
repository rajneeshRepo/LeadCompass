import json
import os

cur_dir = os.getcwd()
state_with_counties_file_path = os.path.join(cur_dir, "util/state_with_counties.json")


def load_data_from_json(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data


state_county_data = load_data_from_json(state_with_counties_file_path)
