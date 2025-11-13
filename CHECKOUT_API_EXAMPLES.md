# Checkout API Examples & Data Structures

## 📦 API Endpoint Responses

### 1. GET `/api/checkout/cart/?customer_id=1`
**Purpose**: Get cart items for checkout page

**Response Format:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Tomatoes",
      "price": "3.99",
      "quantity": 2,
      "image": "/static/images/vegetables/tomatoes.png",
      "category": "vegetables"
    },
    {
      "id": 5,
      "name": "Apples",
      "price": "4.50",
      "quantity": 3,
      "image": "/static/images/fruits/apples.png",
      "category": "fruits"
    }
  ],
  "total": 21.48,
  "count": 2
}
```

**What happens:**
- Fetches all Cart items for the customer
- Uses `CheckoutCartItemSerializer` to format data
- Calculates total price
- Returns exactly the format `checkout.js` expects

---

### 2. POST `/api/checkout/create-order/`
**Purpose**: Create complete order with shipping, billing, and items

**Request Body:**
```json
{
  "shipping": {
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "(555) 123-4567",
    "address": "123 Farm Road",
    "city": "Springfield",
    "zipCode": "12345"
  },
  "billing": {
    "cardName": "John Doe",
    "cardNumber": "4532015112830366",
    "expiryDate": "12/25",
    "cvv": "123",
    "billingAddress": "123 Farm Road",
    "billingCity": "Springfield",
    "billingZip": "12345"
  },
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 5,
      "quantity": 3
    }
  ],
  "customer_id": 1
}
```

**Response Format (Success):**
```json
{
  "orderNumber": "1001",
  "orderDate": "November 13, 2025 at 02:30 PM",
  "status": "PENDING",
  "items": [
    {
      "name": "Tomatoes",
      "quantity": 2,
      "price": 3.99,
      "subtotal": 7.98,
      "image": "/static/images/vegetables/tomatoes.png"
    },
    {
      "name": "Apples",
      "quantity": 3,
      "price": 4.50,
      "subtotal": 13.50,
      "image": "/static/images/fruits/apples.png"
    }
  ],
  "total": "21.48",
  "shipping": {
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "(555) 123-4567",
    "address": "123 Farm Road, Springfield, 12345"
  }
}
```

**What happens:**
1. Creates/updates Customer with shipping info
2. Creates Order with PENDING status
3. Creates OrderItems for each cart item
4. Updates Inventory (reduces stock)
5. Clears customer's Cart
6. Returns order confirmation data

**Response Format (Error):**
```json
{
  "error": "Insufficient stock for Tomatoes. Available: 1, Requested: 2"
}
```

---

### 3. GET `/api/checkout/order/{order_id}/`
**Purpose**: Get order confirmation details (for confirmation page or order history)

**Response Format:**
```json
{
  "orderNumber": "1001",
  "orderDate": "November 13, 2025 at 02:30 PM",
  "status": "PENDING",
  "items": [
    {
      "name": "Tomatoes",
      "quantity": 2,
      "price": 3.99,
      "subtotal": 7.98,
      "image": "/static/images/vegetables/tomatoes.png"
    }
  ],
  "total": "7.98",
  "shipping": {
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "(555) 123-4567",
    "address": "123 Farm Road, Springfield, 12345"
  }
}
```

---

## 🔍 Serializer Field Mappings

### CheckoutCartItemSerializer
| Frontend Field | Database Field | Source |
|----------------|----------------|--------|
| `id` | `product_id` | Product model |
| `name` | `name` | Product model |
| `price` | `price` | Product model |
| `quantity` | `quantity` | Cart model |
| `image` | `image` | Product model |
| `category` | `category` | Product model |

### ShippingAddressSerializer
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `fullName` | String | Yes | Max 200 chars |
| `email` | Email | Yes | Valid email format |
| `phone` | String | Yes | Min 10 digits |
| `address` | String | Yes | Max 500 chars |
| `city` | String | Yes | Max 100 chars |
| `zipCode` | String | Yes | Not empty |

### BillingInfoSerializer
| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `cardName` | String | Yes | Max 200 chars | |
| `cardNumber` | String | Yes (write-only) | 13-19 digits | Never stored |
| `cardNumberLast4` | String | Read-only | 4 chars | Only last 4 stored |
| `expiryDate` | String | Yes | MM/YY format | |
| `cvv` | String | Yes (write-only) | 3-4 digits | Never stored |
| `billingAddress` | String | Yes | Max 500 chars | |
| `billingCity` | String | Yes | Max 100 chars | |
| `billingZip` | String | Yes | Not empty | |

---

## 🧪 Testing with Sample Data

### Test Customer
```python
# Create test customer in Django shell
from main.models import Customer
customer = Customer.objects.create(
    name="Test User",
    email="test@farm2home.com",
    phone="5551234567",
    address="123 Test Street, Test City, 12345"
)
print(f"Created customer ID: {customer.customer_id}")
```

### Test Cart Items
```python
from main.models import Cart, Product
product1 = Product.objects.first()
product2 = Product.objects.all()[1]

Cart.objects.create(customer=customer, product=product1, quantity=2)
Cart.objects.create(customer=customer, product=product2, quantity=1)
```

### Test API Call (using curl)
```bash
# 1. Get cart items
curl http://localhost:8000/api/checkout/cart/?customer_id=1

# 2. Create order (save to file for easier reading)
curl -X POST http://localhost:8000/api/checkout/create-order/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: YOUR_CSRF_TOKEN" \
  -d @checkout_test_data.json

# 3. Get order confirmation
curl http://localhost:8000/api/checkout/order/1/
```

### Test Data File (checkout_test_data.json)
```json
{
  "shipping": {
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "phone": "5559876543",
    "address": "456 Oak Avenue",
    "city": "Farmville",
    "zipCode": "54321"
  },
  "billing": {
    "cardName": "Jane Smith",
    "cardNumber": "4532015112830366",
    "expiryDate": "03/26",
    "cvv": "456",
    "billingAddress": "456 Oak Avenue",
    "billingCity": "Farmville",
    "billingZip": "54321"
  },
  "items": [
    {"product_id": 1, "quantity": 2},
    {"product_id": 2, "quantity": 1}
  ],
  "customer_id": 1
}
```

---

## 🔒 Security Validation Examples

### ✅ Valid Card Number
```json
"cardNumber": "4532015112830366"  // 16 digits, valid
```

### ❌ Invalid Card Numbers
```json
"cardNumber": "4532"              // Too short
"cardNumber": "45320151128303661234"  // Too long
"cardNumber": "4532-0151-1283-0366"   // Will be cleaned, then validated
```

### ✅ Valid Expiry Date
```json
"expiryDate": "12/25"  // MM/YY format
```

### ❌ Invalid Expiry Dates
```json
"expiryDate": "13/25"  // Invalid month
"expiryDate": "12-25"  // Wrong format
"expiryDate": "12/2025" // Wrong format
```

### ✅ Valid CVV
```json
"cvv": "123"   // 3 digits (Visa, MC)
"cvv": "1234"  // 4 digits (Amex)
```

### ❌ Invalid CVV
```json
"cvv": "12"     // Too short
"cvv": "12345"  // Too long
"cvv": "abc"    // Not numeric
```

---

## 📊 Database Updates After Order

### Before Order:
```sql
-- Cart table
customer_id | product_id | quantity
1          | 1          | 2
1          | 5          | 3

-- Inventory table
product_id | stock_available
1          | 50
5          | 30
```

### After Order Created:
```sql
-- Cart table (CLEARED for this customer)
(empty for customer_id = 1)

-- Inventory table (UPDATED)
product_id | stock_available
1          | 48  (was 50, now -2)
5          | 27  (was 30, now -3)

-- Order table (NEW ENTRY)
order_id | customer_id | total_amount | status   | payment
1001     | 1           | 21.48        | PENDING  | Card ending in 0366

-- OrderItem table (NEW ENTRIES)
item_id | order_id | product_id | quantity | price
1       | 1001     | 1          | 2        | 3.99
2       | 1001     | 5          | 3        | 4.50
```

---

## 🎯 Integration Checklist

- [x] **Serializers created** (CheckoutCartItemSerializer, ShippingAddressSerializer, etc.)
- [ ] **Views implemented** (checkout_cart_api, create_checkout_order, get_order_confirmation)
- [ ] **URLs configured** (added to main/urls.py)
- [ ] **checkout.js updated** (fetch from API instead of localStorage)
- [ ] **Authentication implemented** (customer_id management)
- [ ] **CSRF token handling** (for POST requests)
- [ ] **Error handling** (display backend errors to user)
- [ ] **Loading states** (show spinner during API calls)
- [ ] **Testing completed** (all endpoints tested)
- [ ] **Production security** (HTTPS, payment gateway, etc.)

---

## 💡 Quick Integration Tips

1. **Start with GET endpoint**: Test cart loading first
2. **Use browser DevTools**: Check Network tab for API calls
3. **Test with Postman**: Before integrating with frontend
4. **Add console.logs**: Debug the data flow
5. **Handle errors gracefully**: Show user-friendly messages
6. **Use loading spinners**: Better UX during API calls
7. **Keep localStorage as fallback**: For offline testing

---

## 🚀 Frontend Integration Example

```javascript
// checkout.js - Complete example of API integration

// 1. Load cart on page load
async function loadCartData() {
    const customerId = getCustomerId();
    
    try {
        showLoading(true);
        const response = await fetch(`/api/checkout/cart/?customer_id=${customerId}`);
        const data = await response.json();
        
        cart = data.items;
        updateUI();
        showLoading(false);
    } catch (error) {
        notifications.error('Failed to load cart');
        showLoading(false);
    }
}

// 2. Submit order
async function submitOrder() {
    const orderData = {
        shipping: shippingData,
        billing: billingData,
        items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity
        })),
        customer_id: getCustomerId()
    };
    
    try {
        showLoading(true);
        const response = await fetch('/api/checkout/create-order/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Success!
            showConfirmation(result);
        } else {
            notifications.error(result.error);
        }
        showLoading(false);
    } catch (error) {
        notifications.error('Failed to create order');
        showLoading(false);
    }
}

// 3. Helper functions
function showLoading(show) {
    // Show/hide loading spinner
}

function getCustomerId() {
    return localStorage.getItem('customerId') || null;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
```

This structure keeps your UI exactly the same while pulling data from the backend!
