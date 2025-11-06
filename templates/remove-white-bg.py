#!/usr/bin/env python3
"""
Remove white backgrounds from product images and make them transparent
"""
import os
from PIL import Image
import numpy as np

def remove_white_background(image_path, output_path=None, threshold=240):
    """
    Remove white background from an image and make it transparent
    
    Args:
        image_path: Path to input image
        output_path: Path to save output (if None, overwrites input)
        threshold: Brightness threshold to consider as white (0-255)
    """
    if output_path is None:
        output_path = image_path
    
    # Open image
    img = Image.open(image_path)
    
    # Convert to RGBA if not already
    img = img.convert("RGBA")
    
    # Get image data
    data = np.array(img)
    
    # Create mask: pixels where R, G, B are all above threshold
    # These are the "white" pixels
    red, green, blue, alpha = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    white_mask = (red >= threshold) & (green >= threshold) & (blue >= threshold)
    
    # Set alpha to 0 (transparent) where white
    data[:,:,3] = np.where(white_mask, 0, alpha)
    
    # Create new image
    result = Image.fromarray(data)
    
    # Save
    result.save(output_path, "PNG", optimize=True)
    print(f"✓ Processed: {os.path.basename(image_path)}")

def process_directory(directory):
    """Process all PNG images in a directory"""
    count = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith('.png'):
                image_path = os.path.join(root, file)
                try:
                    remove_white_background(image_path, threshold=240)
                    count += 1
                except Exception as e:
                    print(f"✗ Error processing {file}: {e}")
    return count

if __name__ == "__main__":
    print("🎨 Removing white backgrounds from product images...\n")
    
    # Process all product images with lower threshold (more aggressive)
    images_dir = "/workspaces/Farm2home/images"
    
    if os.path.exists(images_dir):
        # Use threshold of 230 instead of 240 to catch more near-white pixels
        count = 0
        for root, dirs, files in os.walk(images_dir):
            for file in files:
                if file.lower().endswith('.png'):
                    image_path = os.path.join(root, file)
                    try:
                        remove_white_background(image_path, threshold=230)
                        count += 1
                    except Exception as e:
                        print(f"✗ Error processing {file}: {e}")
        print(f"\n✅ Done! Processed {count} images.")
        print("All product images now have transparent backgrounds!")
    else:
        print(f"❌ Images directory not found: {images_dir}")
