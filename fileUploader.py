import pandas as pd
import pyperclip
from tkinter import Tk, filedialog

def select_file():
    """Open a file dialog to select a file."""
    root = Tk()
    root.withdraw()  # Hide the main window
    file_path = filedialog.askopenfilename(
        filetypes=[("Excel files", "*.xls *.xlsx"), ("CSV files", "*.csv")]
    )
    return file_path

def extract_company_names(file_path):
    """Extract the 'Company Name' column from the file."""
    try:
        if file_path.endswith((".xls", ".xlsx")):
            data = pd.read_excel(file_path)
        elif file_path.endswith(".csv"):
            data = pd.read_csv(file_path)
        else:
            print("Unsupported file type.")
            return None

        if "Company Name" in data.columns:
            company_names = data["Company Name"].dropna().tolist()
            return company_names
        else:
            print("The column 'Company Name' was not found in the file.")
            return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def copy_to_clipboard(data):
    """Copy data to clipboard."""
    try:
        pyperclip.copy("\n".join(data))
        print("Data copied to clipboard successfully!")
    except Exception as e:
        print(f"Failed to copy to clipboard: {e}")

def main():
    print("Select a file to upload...")
    file_path = select_file()
    if not file_path:
        print("No file selected.")
        return

    print("Processing the file...")
    company_names = extract_company_names(file_path)
    if company_names:
        print(f"Extracted {len(company_names)} company names.")
        copy_to_clipboard(company_names)

if __name__ == "__main__":
    main()
