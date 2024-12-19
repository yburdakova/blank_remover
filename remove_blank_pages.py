import os
import shutil
import sys

def create_blank_page_folder(parent_folder, target_folder_name):
    """
    Creates a folder '_BP_<target-folder>' to store blank pages.
    """
    new_folder_name = f"_BP_{target_folder_name}"
    new_folder_path = os.path.join(parent_folder, new_folder_name)
    if not os.path.exists(new_folder_path):
        os.makedirs(new_folder_path)
    return new_folder_path

def move_blank_pages_by_size(folder_path, size_threshold_kb=160):
    """
    Moves files smaller than the specified size threshold (in KB) to a new folder.
    """
    blank_pages = []
    parent_folder, target_folder_name = os.path.split(folder_path)

    for file_name in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file_name)

        # Check file size
        if os.path.isfile(file_path):
            file_size_kb = os.path.getsize(file_path) / 1024  # Convert to KB
            if file_size_kb < size_threshold_kb:
                print(f"Detected small file ({file_size_kb:.2f} KB): {file_path}")
                blank_pages.append(file_path)

    # Move blank pages to the new folder
    if blank_pages:
        destination_folder = create_blank_page_folder(parent_folder, target_folder_name)
        for blank_file in blank_pages:
            shutil.move(blank_file, os.path.join(destination_folder, os.path.basename(blank_file)))
            print(f"Moved blank page to: {destination_folder}")
        print(f"Blank pages moved to: {destination_folder}")
    else:
        print("No blank pages found.")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python remove_blank_pages.py <folder_path>")
        sys.exit(1)

    folder_path = sys.argv[1]
    if not os.path.exists(folder_path):
        print(f"Folder does not exist: {folder_path}")
        sys.exit(1)

    move_blank_pages_by_size(folder_path)
    print("Blank page processing complete.")
