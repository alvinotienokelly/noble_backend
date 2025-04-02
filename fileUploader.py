import pandas as pd
import json
from tkinter import Tk, filedialog
import logging
import requests

def select_file():
    """Open a file dialog to select a file."""
    from tkinter.filedialog import askopenfilename

    Tk().withdraw()  # We don't want a full GUI, so keep the root window from appearing
    file_path = askopenfilename(
        title="Select a file",
        filetypes=[("Excel files", "*.xls *.xlsx"), ("CSV files", "*.csv")]
    )
    return file_path

def extract_data(file_path):
    """Extract the required columns from the file and format the output."""
    try:
        if file_path.endswith((".xls", ".xlsx")):
            data = pd.read_excel(file_path)
        elif file_path.endswith(".csv"):
            data = pd.read_csv(file_path)
        else:
            print("Unsupported file type.")
            return None

        required_columns = [
            "project", "ticket_size", "status", "deal_type", "sector",
            "description", "maximum_selling_stake", "teaser",
            "model"
        ]

        if all(column in data.columns for column in required_columns):
            extracted_data = data[required_columns].dropna().to_dict(orient="records")
            
            # Add additional fields to each object
            for item in extracted_data:
                item["title"] = item["description"][:100]  # First 100 letters of description
                item["region"] = "Africa"
                item["ticket_size"] = round(item["ticket_size"])
                item["deal_stage"] = "Due Diligence"
                item["key_investors"] = "Financiers"
                item["deal_size"] = 14.0
                item["target_company_id"] = 3
                item["deal_lead"] = 3
                item["retainer_amount"] = 0
                item["success_fee"] = 0
                item['maximum_selling_stake']="Minority"

                logging.info(f"Processed Item: {item}")
            return json.dumps(extracted_data, indent=4)
        else:
            missing_columns = [column for column in required_columns if column not in data.columns]
            print(f"The following required columns were not found in the file: {', '.join(missing_columns)}")
            return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def copy_to_clipboard(data):
    """Copy the given data to the clipboard."""
    from tkinter import Tk

    r = Tk()
    r.withdraw()
    r.clipboard_clear()
    r.clipboard_append(data)
    r.update()  # now it stays on the clipboard after the window is closed
    r.destroy()

if __name__ == "__main__":
    file_path = select_file()
    if file_path:
        extracted_data = extract_data(file_path)
        if extracted_data:
            print("Extracted Data in JSON format:")
            for index, item in enumerate(json.loads(extracted_data), start=1):
                response = requests.post("http://localhost:3030/api/deals", json=item)
                if response.status_code == 201:
                    print(f"Item {index} successfully sent.")
                else:
                    print(f"Failed to send Item {index}. Status Code: {response.status_code}, Response: {response.text}")
                print(f"Item {index}: {item}")
            copy_to_clipboard(extracted_data)
            print("Data copied to clipboard.")
        else:
            print("Failed to extract data.")
    else:
        print("No file selected.")
