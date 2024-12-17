import os
from PIL import Image, ImageChops
import sys

def is_blank_page(image_path, threshold=0.98):
    try:
        image = Image.open(image_path).convert('L')

        bbox = ImageChops.invert(image).getbbox()

        if not bbox:
            return True

        white_pixels = sum(1 for pixel in image.getdata() if pixel > 245)
        total_pixels = image.width * image.height
        blank_ratio = white_pixels / total_pixels
        return blank_ratio > threshold
    except Exception as e:
        print(f"Error processing file {image_path}: {e}")
        return False

def remove_blank_pages(folder_path):
    for file_name in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file_name)

        if os.path.isfile(file_path) and file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.tif', '.bmp')):
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
