import os
import base64

def decode_and_save_images(data, base_dir="images"):
    # Ensure the base directory exists

    # Helper function to decode and save images
    def save_image(base64_str, key, idx):
        # Decode the image
        image_data = base64.b64decode(base64_str)
        # Create a unique filename
        filename = f"{key}_{idx}.png"
        filepath = os.path.join(base_dir, filename)
        # Write the image to the file
        with open(filepath, "wb") as img_file:
            img_file.write(image_data)
        return filepath

    # Iterate through the JSON structure
    for category, items in data.get("IMAGES", {}).items():
        if isinstance(items, dict):
            for key, value in items.items():
                if isinstance(value, list):
                    paths = []
                    for idx, img_str in enumerate(value):
                        if img_str.strip():  # Ensure it's not an empty string
                            path = save_image(img_str, f"{category}_{key}", idx)
                            paths.append(path)
                    # Replace the list of base64 strings with file paths
                    data["IMAGES"][category][key] = paths
                elif isinstance(value, str) and value.strip():  # Single image as string
                    path = save_image(value, f"{category}_{key}", 0)
                    data["IMAGES"][category][key] = path
        elif isinstance(items, list):
            paths = []
            for idx, img_str in enumerate(items):
                if img_str.strip():  # Ensure it's not an empty string
                    path = save_image(img_str, category, idx)
                    paths.append(path)
            # Replace the list of base64 strings with file paths
            data["IMAGES"][category] = paths
        elif isinstance(items, str) and items.strip():  # Single image as string
            path = save_image(items, category, 0)
            data["IMAGES"][category] = path

    return data
