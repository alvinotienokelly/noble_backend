import pandas as pd
import json
import re
import requests
import math

def extract_data(file_path):
    """
    Extract the required columns from the file and format the output.
    """
    try:
        # Load the file into a pandas DataFrame
        if file_path.endswith((".xls", ".xlsx")):
            data = pd.read_excel(file_path)
        elif file_path.endswith(".csv"):
            data = pd.read_csv(file_path)
        else:
            print("Unsupported file type.")
            return None

        # Define the required columns
        required_columns = ["name", "website", "phone", "email"]
        if all(column in data.columns for column in required_columns):
            # Extract the required columns
            extracted_data = data[required_columns]

            # Convert each row to a dictionary and add additional fields
            json_data = []
            for _, row in extracted_data.iterrows():
                item = row.to_dict()  # Convert the row to a dictionary
                item["email"] = extract_first_email(str(item.get("email", "")))  # Extract only one email
                item["password"] = "password"  # Add additional fields
                item["role"] = "Investor"  # Add additional fields
                item["role_id"] = "deae260b-2c79-4f96-8aeb-0d4ea71835ff"  # Add additional fields
                json_data.append(item)

            # Convert the list of dictionaries to JSON
            return json.dumps(json_data, indent=4)

        else:
            missing_columns = [column for column in required_columns if column not in data.columns]
            print(f"The following required columns were not found in the file: {', '.join(missing_columns)}")
            return None

    except Exception as e:
        print(f"An error occurred: {e}")
        return None
def extract_first_email(email_field):
    """
    Extract the first valid email from a string containing multiple emails.
    """
    # Use regex to find all valid email addresses
    emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', email_field)
    return emails[0] if emails else None

def clean_data(item):
    """
    Clean the data to ensure it is JSON-compliant.
    Replace NaN, Infinity, and -Infinity with None.
    """
    for key, value in item.items():
        if isinstance(value, float) and (math.isnan(value) or math.isinf(value)):
            item[key] = None  # Replace invalid float values with None
    return item


if __name__ == "__main__":
    # Example file path (replace with your file selection logic)
    file_path = "/Users/solutions/Downloads/Investor Tracker _ CRM.xlsx - Contacts PE (2).csv"

    # Extract the required data
    extracted_data = extract_data(file_path)

    if extracted_data:
        for index, item in enumerate(json.loads(extracted_data), start=1):
                item = clean_data(item)

            # Here you can send the data to your API or perform other actions
                print(f"Item {index}: {item}")
                if item["name"] and item["email"]:
                    # Example API request logic
                    try:
                        # Replace with your actual API endpoint and request logic
                        api_url = "http://46.101.91.153:3030/api/users/signup"
                        headers = {"Content-Type": "application/json"}
                        response = requests.post(api_url, json=item, headers=headers)
                        
                        if response.status_code == 201:
                            print(f"Successfully sent data for Item {index}")
                        else:
                            print(f"Failed to send data for Item {index}: {response.status_code} - {response.text}")
                    except Exception as e:
                        print(f"An error occurred while sending data for Item {index}: {e}")
                else:
                    print(f"Skipping Item {index} due to missing name or email.")
        print("Extracted Data in JSON format:")
        # print(extracted_data)
    else:
        print("Failed to extract data.")