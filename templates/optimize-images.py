#!/usr/bin/env python3
"""
Image Optimization and Classification Script for Farm2Home
This script will:
1. Classify images into vegetables, fruits, and herbs
2. Resize them to optimize for web (500x500px max)
3. Compress them for faster loading
4. Move them to appropriate folders
"""

import os
from PIL import Image
import shutil

# Classification mappings
VEGETABLES = [
    'artichoke', 'beetroot', 'bitter-gourd', 'bottle-gourd', 'carrot',
    'cucumber', 'green-beans', 'greenmustard', 'greenonins', 'lettuce',
    'okra', 'onions', 'peas', 'potatoes', 'pumpkin', 'radish',
    'red-chillies', 'ridge-gourd', 'sweetpotato', 'taroo-root',
    'tomato', 'turnips', 'zucchini', 'applegourd'
]

FRUITS = [
    'apricot', 'avacado', 'cherries', 'custard-apple', 'dates',
    'figs', 'grapefruit', 'green-apples', 'guava', 'jackfruit',
    'lychees', 'melon', 'mosambi', 'mulberries', 'papaya',
    'peaches', 'pear', 'persimmon', 'pineapple', 'plums',
    'pomegranate', 'sapodilla', 'sweetmelon', 'watermelon'
]

HERBS = [
    'basil', 'celery', 'curry-leaves', 'fenugreek', 'ginger',
    'lemon-grass', 'rosemarry', 'thyme'
]

# Target size for optimization
MAX_SIZE = 500
QUALITY = 85  # JPEG quality (1-95, higher is better)

def get_category(filename):
    """Determine the category of the image based on filename"""
    name = filename.lower().replace('.png', '').replace('.jpg', '').replace('.jpeg', '')
    
    if any(veg in name for veg in VEGETABLES):
        return 'vegetables'
    elif any(fruit in name for fruit in FRUITS):
        return 'fruits'
    elif any(herb in name for herb in HERBS):
        return 'herbs'
    return None

def optimize_image(input_path, output_path):
    """Resize and optimize image for web"""
    try:
        # Open image
        img = Image.open(input_path)
        
        # Convert to RGB if necessary (for PNG with transparency)
        if img.mode in ('RGBA', 'LA', 'P'):
            # Create white background
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        
        # Get original size
        original_size = img.size
        
        # Calculate new size maintaining aspect ratio
        if max(original_size) > MAX_SIZE:
            ratio = MAX_SIZE / max(original_size)
            new_size = tuple(int(dim * ratio) for dim in original_size)
            img = img.resize(new_size, Image.Resampling.LANCZOS)
        
        # Save optimized image as PNG with compression
        img.save(output_path, 'PNG', optimize=True, compress_level=9)
        
        # Get file sizes
        original_size_kb = os.path.getsize(input_path) / 1024
        new_size_kb = os.path.getsize(output_path) / 1024
        
        print(f"  ✓ Optimized: {os.path.basename(input_path)}")
        print(f"    Original: {original_size_kb:.1f} KB → New: {new_size_kb:.1f} KB (Saved {original_size_kb - new_size_kb:.1f} KB)")
        
        return True
    except Exception as e:
        print(f"  ✗ Error processing {input_path}: {e}")
        return False

def main():
    # Base directory
    base_dir = '/workspaces/Farm2home/images'
    
    # Get all image files in the root images directory
    image_files = [f for f in os.listdir(base_dir) 
                   if f.lower().endswith(('.png', '.jpg', '.jpeg')) 
                   and os.path.isfile(os.path.join(base_dir, f))]
    
    print(f"\n🌾 Farm2Home Image Optimizer")
    print(f"=" * 60)
    print(f"Found {len(image_files)} images to process\n")
    
    stats = {'vegetables': 0, 'fruits': 0, 'herbs': 0, 'unknown': 0}
    
    for image_file in sorted(image_files):
        input_path = os.path.join(base_dir, image_file)
        category = get_category(image_file)
        
        if category:
            print(f"\n📦 Processing: {image_file} → {category.upper()}")
            
            # Create output path
            output_dir = os.path.join(base_dir, category)
            os.makedirs(output_dir, exist_ok=True)
            output_path = os.path.join(output_dir, image_file.replace('.jpg', '.png').replace('.jpeg', '.png'))
            
            # Optimize and save
            if optimize_image(input_path, output_path):
                stats[category] += 1
                # Remove original file
                os.remove(input_path)
        else:
            print(f"\n⚠️  Unknown category: {image_file}")
            stats['unknown'] += 1
    
    print(f"\n" + "=" * 60)
    print(f"✅ OPTIMIZATION COMPLETE!")
    print(f"=" * 60)
    print(f"🥕 Vegetables: {stats['vegetables']} images")
    print(f"🍎 Fruits: {stats['fruits']} images")
    print(f"🌿 Herbs: {stats['herbs']} images")
    if stats['unknown'] > 0:
        print(f"❓ Unknown: {stats['unknown']} images")
    print(f"\nTotal processed: {sum(stats.values())} images\n")

if __name__ == '__main__':
    main()
