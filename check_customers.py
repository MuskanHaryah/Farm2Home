"""
Quick script to check existing customers in database
"""
import django
import os
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Farm2Home.settings')
django.setup()

from main.models import Customer

customers = Customer.objects.all()
print(f"\n{'='*60}")
print(f"Total Customers in Database: {customers.count()}")
print(f"{'='*60}\n")

if customers.count() > 0:
    for customer in customers[:5]:
        print(f"  ID: {customer.customer_id}")
        print(f"  Name: {customer.name}")
        print(f"  Email: {customer.email}")
        print(f"  Phone: {customer.phone}")
        print("-" * 60)
else:
    print("⚠️  No customers found in database!")
    print("Please create a customer first to test the address API.")
    print("\nYou can create a customer by:")
    print("  1. Using Django Admin: http://127.0.0.1:8000/admin/")
    print("  2. Using the signup page")
    print("  3. Creating manually via Django shell")

print()
