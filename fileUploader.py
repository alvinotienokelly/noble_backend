import pandas as pd
import json
from tkinter import Tk, filedialog

def select_file():
    """Open a file dialog to select a file."""
    from tkinter import Tk
    from tkinter.filedialog import askopenfilename

    Tk().withdraw()  # We don't want a full GUI, so keep the root window from appearing
    file_path = askopenfilename(
        title="Select a file",
        filetypes=[("Excel files", "*.xls *.xlsx"), ("CSV files", "*.csv")]
    )
    return file_path

def extract_data(file_path):
    """Extract the 'Company Name', 'Quantity', 'Price', and 'Unit Price' columns from the file."""
    try:
        if file_path.endswith((".xls", ".xlsx")):
            data = pd.read_excel(file_path)
        elif file_path.endswith(".csv"):
            data = pd.read_csv(file_path)
        else:
            print("Unsupported file type.")
            return None

        required_columns = ["Company Name"]
        if all(column in data.columns for column in required_columns):
            extracted_data = data[required_columns].dropna().to_dict(orient="records")
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
            print(extracted_data)
            copy_to_clipboard(extracted_data)
            print("Data copied to clipboard.")
        else:
            print("Failed to extract data.")
    else:
        print("No file selected.")
