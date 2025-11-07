"""
Script to populate the database with sample data for Farm2Home
Run this script: python populate_db.py
"""

import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Farm2Home.settings')
django.setup()

from main.models import Customer, Product, Inventory, Order, OrderItem, Cart
from decimal import Decimal
from django.utils import timezone
import random

def clear_data():
    """Clear all existing data"""
    print("Clearing existing data...")
    Cart.objects.all().delete()
    OrderItem.objects.all().delete()
    Order.objects.all().delete()
    Inventory.objects.all().delete()
    Product.objects.all().delete()
    Customer.objects.all().delete()
    print("✓ Data cleared")

def create_customers():
    """Create sample customers"""
    print("\nCreating customers...")
    customers = [
        {
            'name': 'Ahmed Khan',
            'email': 'ahmed.khan@email.com',
            'phone': '+92-300-1234567',
            'address': 'House 123, Street 5, F-7 Islamabad'
        },
        {
            'name': 'Fatima Ali',
            'email': 'fatima.ali@email.com',
            'phone': '+92-321-9876543',
            'address': 'Flat 45, DHA Phase 2, Karachi'
        },
        {
            'name': 'Hassan Malik',
            'email': 'hassan.malik@email.com',
            'phone': '+92-333-5555555',
            'address': 'Villa 78, Model Town, Lahore'
        },
        {
            'name': 'Ayesha Rizwan',
            'email': 'ayesha.rizwan@email.com',
            'phone': '+92-301-7777777',
            'address': 'Apartment 12, Gulberg III, Lahore'
        },
        {
            'name': 'Ali Raza',
            'email': 'ali.raza@email.com',
            'phone': '+92-345-2222222',
            'address': 'House 56, Bahria Town, Rawalpindi'
        }
    ]
    
    created_customers = []
    for customer_data in customers:
        customer = Customer.objects.create(**customer_data)
        created_customers.append(customer)
        print(f"  ✓ Created customer: {customer.name}")
    
    return created_customers

def create_products():
    """Create all products from frontend data"""
    print("\nCreating products...")
    
    products_data = [
        # VEGETABLES (24 items)
        {'name': 'Tomato', 'category': 'Vegetables', 'price': Decimal('120.00')},
        {'name': 'Potato', 'category': 'Vegetables', 'price': Decimal('80.00')},
        {'name': 'Onion', 'category': 'Vegetables', 'price': Decimal('100.00')},
        {'name': 'Okra', 'category': 'Vegetables', 'price': Decimal('150.00')},
        {'name': 'Bitter Gourd', 'category': 'Vegetables', 'price': Decimal('110.00')},
        {'name': 'Carrot', 'category': 'Vegetables', 'price': Decimal('95.00')},
        {'name': 'Cucumber', 'category': 'Vegetables', 'price': Decimal('70.00')},
        {'name': 'Bottle Gourd', 'category': 'Vegetables', 'price': Decimal('60.00')},
        {'name': 'Ridge Gourd', 'category': 'Vegetables', 'price': Decimal('85.00')},
        {'name': 'Apple Gourd', 'category': 'Vegetables', 'price': Decimal('90.00')},
        {'name': 'Pumpkin', 'category': 'Vegetables', 'price': Decimal('75.00')},
        {'name': 'Beetroot', 'category': 'Vegetables', 'price': Decimal('110.00')},
        {'name': 'Radish', 'category': 'Vegetables', 'price': Decimal('65.00')},
        {'name': 'Turnip', 'category': 'Vegetables', 'price': Decimal('70.00')},
        {'name': 'Green Beans', 'category': 'Vegetables', 'price': Decimal('140.00')},
        {'name': 'Peas', 'category': 'Vegetables', 'price': Decimal('130.00')},
        {'name': 'Lettuce', 'category': 'Vegetables', 'price': Decimal('80.00')},
        {'name': 'Green Onions', 'category': 'Vegetables', 'price': Decimal('50.00')},
        {'name': 'Red Chillies', 'category': 'Vegetables', 'price': Decimal('350.00')},
        {'name': 'Green Mustard', 'category': 'Vegetables', 'price': Decimal('90.00')},
        {'name': 'Sweet Potato', 'category': 'Vegetables', 'price': Decimal('95.00')},
        {'name': 'Taro Root', 'category': 'Vegetables', 'price': Decimal('110.00')},
        {'name': 'Zucchini', 'category': 'Vegetables', 'price': Decimal('180.00')},
        {'name': 'Artichoke', 'category': 'Vegetables', 'price': Decimal('400.00')},
        
        # FRUITS (24 items)
        {'name': 'Watermelon', 'category': 'Fruits', 'price': Decimal('60.00')},
        {'name': 'Melon', 'category': 'Fruits', 'price': Decimal('70.00')},
        {'name': 'Sweet Melon', 'category': 'Fruits', 'price': Decimal('55.00')},
        {'name': 'Guava', 'category': 'Fruits', 'price': Decimal('120.00')},
        {'name': 'Green Apple', 'category': 'Fruits', 'price': Decimal('350.00')},
        {'name': 'Pomegranate', 'category': 'Fruits', 'price': Decimal('280.00')},
        {'name': 'Papaya', 'category': 'Fruits', 'price': Decimal('90.00')},
        {'name': 'Pineapple', 'category': 'Fruits', 'price': Decimal('150.00')},
        {'name': 'Grapefruit', 'category': 'Fruits', 'price': Decimal('200.00')},
        {'name': 'Mosambi', 'category': 'Fruits', 'price': Decimal('140.00')},
        {'name': 'Apricot', 'category': 'Fruits', 'price': Decimal('450.00')},
        {'name': 'Peaches', 'category': 'Fruits', 'price': Decimal('320.00')},
        {'name': 'Plums', 'category': 'Fruits', 'price': Decimal('380.00')},
        {'name': 'Cherries', 'category': 'Fruits', 'price': Decimal('850.00')},
        {'name': 'Lychee', 'category': 'Fruits', 'price': Decimal('420.00')},
        {'name': 'Pear', 'category': 'Fruits', 'price': Decimal('250.00')},
        {'name': 'Persimmon', 'category': 'Fruits', 'price': Decimal('380.00')},
        {'name': 'Avocado', 'category': 'Fruits', 'price': Decimal('600.00')},
        {'name': 'Jackfruit', 'category': 'Fruits', 'price': Decimal('120.00')},
        {'name': 'Custard Apple', 'category': 'Fruits', 'price': Decimal('220.00')},
        {'name': 'Sapodilla', 'category': 'Fruits', 'price': Decimal('180.00')},
        {'name': 'Dates', 'category': 'Fruits', 'price': Decimal('550.00')},
        {'name': 'Figs', 'category': 'Fruits', 'price': Decimal('750.00')},
        {'name': 'Mulberries', 'category': 'Fruits', 'price': Decimal('320.00')},
        
        # HERBS (8 items)
        {'name': 'Curry Leaves', 'category': 'Herbs', 'price': Decimal('40.00')},
        {'name': 'Basil', 'category': 'Herbs', 'price': Decimal('60.00')},
        {'name': 'Ginger', 'category': 'Herbs', 'price': Decimal('200.00')},
        {'name': 'Lemongrass', 'category': 'Herbs', 'price': Decimal('80.00')},
        {'name': 'Fenugreek', 'category': 'Herbs', 'price': Decimal('50.00')},
        {'name': 'Celery', 'category': 'Herbs', 'price': Decimal('120.00')},
        {'name': 'Rosemary', 'category': 'Herbs', 'price': Decimal('150.00')},
        {'name': 'Thyme', 'category': 'Herbs', 'price': Decimal('140.00')},
    ]
    
    created_products = []
    for product_data in products_data:
        product = Product.objects.create(**product_data)
        created_products.append(product)
        print(f"  ✓ Created product: {product.name} - Rs.{product.price}")
    
    return created_products

def create_inventory(products):
    """Create inventory for all products"""
    print("\nCreating inventory...")
    
    for product in products:
        # Generate random stock between 50-500 kg
        stock = random.randint(50, 500)
        inventory = Inventory.objects.create(
            product=product,
            stock_available=stock
        )
        print(f"  ✓ {product.name}: {stock} kg in stock")

def create_sample_orders(customers, products):
    """Create sample orders"""
    print("\nCreating sample orders...")
    
    statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED']
    
    # Create 10 sample orders
    for i in range(10):
        customer = random.choice(customers)
        status = random.choice(statuses)
        
        # Create order
        order = Order.objects.create(
            customer=customer,
            status=status,
            payment='Cash on Delivery' if random.random() > 0.5 else 'Credit Card'
        )
        
        # Add 2-5 random items to order
        num_items = random.randint(2, 5)
        selected_products = random.sample(products, num_items)
        total = Decimal('0.00')
        
        for product in selected_products:
            quantity = random.randint(1, 5)
            price = product.price
            
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=price
            )
            
            total += price * quantity
            
            # Update inventory
            inventory = product.inventory
            inventory.stock_available = max(0, inventory.stock_available - quantity)
            inventory.save()
        
        # Update order total
        order.total_amount = total
        order.save()
        
        print(f"  ✓ Order #{order.order_id}: {customer.name} - Rs.{total} ({status})")

def create_sample_carts(customers, products):
    """Create sample cart items"""
    print("\nCreating sample cart items...")
    
    # Add 3-5 items to first customer's cart
    customer = customers[0]
    selected_products = random.sample(products, random.randint(3, 5))
    
    for product in selected_products:
        quantity = random.randint(1, 3)
        Cart.objects.create(
            customer=customer,
            product=product,
            quantity=quantity
        )
        print(f"  ✓ {customer.name}'s cart: {product.name} x{quantity}")

def main():
    """Main function to populate database"""
    print("=" * 60)
    print("FARM2HOME DATABASE POPULATION SCRIPT")
    print("=" * 60)
    
    # Clear existing data
    clear_data()
    
    # Create data
    customers = create_customers()
    products = create_products()
    create_inventory(products)
    create_sample_orders(customers, products)
    create_sample_carts(customers, products)
    
    # Summary
    print("\n" + "=" * 60)
    print("DATABASE POPULATION COMPLETE!")
    print("=" * 60)
    print(f"✓ Customers: {Customer.objects.count()}")
    print(f"✓ Products: {Product.objects.count()}")
    print(f"✓ Inventory Items: {Inventory.objects.count()}")
    print(f"✓ Orders: {Order.objects.count()}")
    print(f"✓ Order Items: {OrderItem.objects.count()}")
    print(f"✓ Cart Items: {Cart.objects.count()}")
    print("=" * 60)

if __name__ == '__main__':
    main()
