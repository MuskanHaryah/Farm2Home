#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --no-input --clear
echo "Static files collected to: $(python -c 'from Farm2Home import settings; print(settings.STATIC_ROOT)')"
ls -la staticfiles/ || echo "staticfiles directory not found"

# Run migrations
python manage.py migrate --no-input

# Load initial data if data.json exists
if [ -f "data.json" ]; then
  python -c "
import json
import os

data_file = 'data.json'

# Check if data already loaded or error occurred
if os.path.exists(data_file):
    with open(data_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
        if data:  # If there's data to load
            import subprocess
            result = subprocess.run(['python', 'manage.py', 'loaddata', 'data.json'], capture_output=True, text=True)
            if 'already loaded' in result.stderr or 'error occurred' not in result.stderr.lower():
                print('Data loaded successfully or already exists')
            else:
                print('Warning: Data load had issues but continuing deployment')
        else:
            print('No data to load from data.json')
"
fi

# Create superuser (will skip if already exists)
python manage.py create_customer_user
