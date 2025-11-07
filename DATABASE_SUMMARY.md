# Farm2Home Database Summary

## Database Successfully Populated! ✓

### Data Overview

#### 📊 Statistics
- **Customers**: 5
- **Products**: 56 (24 Vegetables + 24 Fruits + 8 Herbs)
- **Inventory Items**: 56 (all products have stock)
- **Orders**: 10 sample orders
- **Order Items**: 32 items across orders
- **Cart Items**: 4 items in Ahmed Khan's cart

---

## Sample Customers

1. **Ahmed Khan**
   - Email: ahmed.khan@email.com
   - Phone: +92-300-1234567
   - Address: House 123, Street 5, F-7 Islamabad

2. **Fatima Ali**
   - Email: fatima.ali@email.com
   - Phone: +92-321-9876543
   - Address: Flat 45, DHA Phase 2, Karachi

3. **Hassan Malik**
   - Email: hassan.malik@email.com
   - Phone: +92-333-5555555
   - Address: Villa 78, Model Town, Lahore

4. **Ayesha Rizwan**
   - Email: ayesha.rizwan@email.com
   - Phone: +92-301-7777777
   - Address: Apartment 12, Gulberg III, Lahore

5. **Ali Raza**
   - Email: ali.raza@email.com
   - Phone: +92-345-2222222
   - Address: House 56, Bahria Town, Rawalpindi

---

## Products by Category

### 🥬 Vegetables (24 items)
| Product | Price (Rs/kg) | Category |
|---------|---------------|----------|
| Tomato | 120.00 | Vegetables |
| Potato | 80.00 | Vegetables |
| Onion | 100.00 | Vegetables |
| Okra | 150.00 | Vegetables |
| Bitter Gourd | 110.00 | Vegetables |
| Carrot | 95.00 | Vegetables |
| Cucumber | 70.00 | Vegetables |
| Bottle Gourd | 60.00 | Vegetables |
| Ridge Gourd | 85.00 | Vegetables |
| Apple Gourd | 90.00 | Vegetables |
| Pumpkin | 75.00 | Vegetables |
| Beetroot | 110.00 | Vegetables |
| Radish | 65.00 | Vegetables |
| Turnip | 70.00 | Vegetables |
| Green Beans | 140.00 | Vegetables |
| Peas | 130.00 | Vegetables |
| Lettuce | 80.00 | Vegetables |
| Green Onions | 50.00 | Vegetables |
| Red Chillies | 350.00 | Vegetables |
| Green Mustard | 90.00 | Vegetables |
| Sweet Potato | 95.00 | Vegetables |
| Taro Root | 110.00 | Vegetables |
| Zucchini | 180.00 | Vegetables |
| Artichoke | 400.00 | Vegetables |

### 🍎 Fruits (24 items)
| Product | Price (Rs/kg) | Category |
|---------|---------------|----------|
| Watermelon | 60.00 | Fruits |
| Melon | 70.00 | Fruits |
| Sweet Melon | 55.00 | Fruits |
| Guava | 120.00 | Fruits |
| Green Apple | 350.00 | Fruits |
| Pomegranate | 280.00 | Fruits |
| Papaya | 90.00 | Fruits |
| Pineapple | 150.00 | Fruits |
| Grapefruit | 200.00 | Fruits |
| Mosambi | 140.00 | Fruits |
| Apricot | 450.00 | Fruits |
| Peaches | 320.00 | Fruits |
| Plums | 380.00 | Fruits |
| Cherries | 850.00 | Fruits |
| Lychee | 420.00 | Fruits |
| Pear | 250.00 | Fruits |
| Persimmon | 380.00 | Fruits |
| Avocado | 600.00 | Fruits |
| Jackfruit | 120.00 | Fruits |
| Custard Apple | 220.00 | Fruits |
| Sapodilla | 180.00 | Fruits |
| Dates | 550.00 | Fruits |
| Figs | 750.00 | Fruits |
| Mulberries | 320.00 | Fruits |

### 🌿 Herbs (8 items)
| Product | Price (Rs/kg) | Category |
|---------|---------------|----------|
| Curry Leaves | 40.00 | Herbs |
| Basil | 60.00 | Herbs |
| Ginger | 200.00 | Herbs |
| Lemongrass | 80.00 | Herbs |
| Fenugreek | 50.00 | Herbs |
| Celery | 120.00 | Herbs |
| Rosemary | 150.00 | Herbs |
| Thyme | 140.00 | Herbs |

---

## Sample Orders Created

10 orders have been created with different statuses:
- **PENDING**: Orders awaiting confirmation
- **CONFIRMED**: Orders confirmed and being prepared
- **SHIPPED**: Orders in transit
- **DELIVERED**: Completed orders

---

## How to Re-populate Database

If you need to reset and repopulate the database with fresh data:

```powershell
# Make sure you're in the Farm2Home directory with activated virtual environment
cd C:\Users\Lenovo\Desktop\python\Projects\Farm-2-Home
.\.venv\Scripts\Activate.ps1
cd Farm2Home

# Run the population script
python populate_db.py
```

---

## Model Structure

### Product Model
```python
- product_id (Auto, Primary Key)
- name (CharField)
- category (CharField)
- price (DecimalField) ✓ NEW
```

### Inventory Model
```python
- inventory_id (Auto, Primary Key)
- product (OneToOne → Product)
- stock_available (PositiveInteger)
```

### Customer Model
```python
- customer_id (Auto, Primary Key)
- name (CharField)
- email (EmailField, Unique)
- phone (CharField)
- address (TextField)
```

### Order Model
```python
- order_id (Auto, Primary Key)
- customer (ForeignKey → Customer)
- order_date (DateTime, Auto)
- status (Choice: PENDING/CONFIRMED/SHIPPED/DELIVERED/CANCELLED)
- total_amount (Decimal)
- payment (CharField)
```

### OrderItem Model
```python
- item_id (Auto, Primary Key)
- order (ForeignKey → Order)
- product (ForeignKey → Product)
- quantity (PositiveInteger)
- price (Decimal)
```

### Cart Model
```python
- cart_id (Auto, Primary Key)
- customer (ForeignKey → Customer)
- product (ForeignKey → Product)
- quantity (PositiveInteger)
- unique_together: (customer, product)
```

---

## Next Steps

1. ✅ Database is populated with all 56 products matching your frontend
2. ✅ All products have prices
3. ✅ Inventory is set up with random stock (50-500 kg per product)
4. ✅ Sample customers, orders, and cart items created

You can now:
- Test your application with real data
- Access Django Admin to view/edit data
- Create API endpoints to serve this data to your frontend
- Test checkout flows with real products

---

**Generated**: November 7, 2025
