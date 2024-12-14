import os
import cv2
import numpy as np
import sys

def is_blank_page(image_path, threshold=0.98):
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if image is None:
        print(f"Error reading file: {image_path}")
        return False

    _, binary = cv2.threshold(image, 250, 255, cv2.THRESH_BINARY)
    blank_ratio = np.sum(binary == 255) / binary.size

    return blank_ratio > threshold

def remove_blank_pages(folder_path):
    for file_name in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file_name)

        if os.path.isfile(file_path) and file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp')):
            if is_blank_page(file_path):
                print(f"Removing blank page: {file_path}")
                os.remove(file_path)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python remove_blank_pages.py <folder_path>")
        sys.exit(1)

    folder_path = sys.argv[1]
    if not os.path.exists(folder_path):
        print(f"Folder does not exist: {folder_path}")
        sys.exit(1)

    remove_blank_pages(folder_path)
    print("Blank pages removed successfully.")
