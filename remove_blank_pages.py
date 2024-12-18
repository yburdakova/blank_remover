import os
from PIL import Image
import sys

def is_punch_hole_line(image, edge='left', threshold=20, hole_min_size=10, spacing_tolerance=5):
    """
    Detects a line of punch holes along the left or right edge of the image.
    """
    width, height = image.size
    region = None

    # Define regions for left or right edge
    if edge == 'left':
        region = (0, 0, 50, height)  # Left 50 pixels
    elif edge == 'right':
        region = (width - 50, 0, width, height)  # Right 50 pixels

    cropped = image.crop(region).convert('L')
    black_pixels = []

    # Detect black pixels along the edge
    for y in range(cropped.height):
        row = cropped.getpixel((25, y))  # Middle of the cropped edge region
        if row < threshold:  # Black pixel
            black_pixels.append(y)

    # Check for evenly spaced holes
    if len(black_pixels) < 3:  # Not enough points for a line
        return False

    # Calculate distances between black pixels
    distances = [black_pixels[i + 1] - black_pixels[i] for i in range(len(black_pixels) - 1)]
    average_spacing = sum(distances) / len(distances)

    # Verify spacing consistency
    for dist in distances:
        if abs(dist - average_spacing) > spacing_tolerance:
            return False

    return True

def remove_blank_pages(folder_path):
    """
    Removes blank pages based on file size and punch hole detection (single holes and edge lines).
    """
    for file_name in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file_name)

        # Check file size first
        if os.path.isfile(file_path) and os.path.getsize(file_path) < 150 * 1024:  # Less than 150 KB
            print(f"Removing small file (potentially blank): {file_path}")
            os.remove(file_path)
            continue

        # Check for punch hole lines and single holes
        if file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.tif', '.bmp')):
            try:
                with Image.open(file_path) as img:
                    if is_punch_hole_line(img, edge='left') or is_punch_hole_line(img, edge='right'):
                        print(f"Removing file with punch hole line: {file_path}")
                        os.remove(file_path)
            except Exception as e:
                print(f"Error processing file {file_path}: {e}")

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
