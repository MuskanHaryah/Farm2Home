# Checkout Backend Integration Guide

## ✅ What Has Been Done

### 1. **Serializers Created** (in `main/serializers.py`)

I've added comprehensive serializers to handle all checkout data:

#### **CheckoutCartItemSerializer**
- Transforms Cart model data into the format expected by `checkout.js`
- Fields: `id`, `name`, `price`, `quantity`, `image`, `category`
- Automatically formats image paths correctly
- **Purpose**: Send cart items to checkout page in the exact format the frontend expects

#### **ShippingAddressSerializer**
- Handles shipping form data from Step 1 of checkout
- Fields: `fullName`, `email`, `phone`, `address`, `city`, `zipCode`
- Includes validation for phone numbers and zip codes
- **Purpose**: Validate and process shipping information

#### **BillingInfoSerializer**
- Handles billing/payment form data from Step 2
- Fields: `cardName`, `cardNumber`, `expiryDate`, `cvv`, `billingAddress`, `billingCity`, `billingZip`
- Security: Only stores last 4 digits of card, never stores CVV
- Validates card number format, expiry date (MM/YY), and CVV
- **Purpose**: Securely handle payment information

#### **CheckoutOrderCreateSerializer**
- **Main checkout serializer** - combines everything
- Accepts: `shipping` (address), `billing` (payment), `items` (cart), optional `customer_id`
- Creates or updates Customer, creates Order with OrderItems
- Automatically updates inventory after order
- Clears cart after successful order
- **Purpose**: Complete end-to-end order creation from checkout

#### **OrderConfirmationSerializer**
- Returns order details for confirmation page (Step 3)
- Fields: `orderNumber`, `orderDate`, `status`, `items`, `total`, `shipping`
- Formats data exactly as `checkout.js` expects for the confirmation display
- **Purpose**: Send order confirmation data to frontend

---

## 🔧 Files That Need Modification

### 1. **`main/views.py`** ⚠️ REQUIRED

Add these new API endpoints:

```python
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    CheckoutCartItemSerializer, 
    CheckoutOrderCreateSerializer,
    OrderConfirmationSerializer
)

# === CHECKOUT ENDPOINTS ===

@api_view(['GET'])
def checkout_cart_api(request):
    """
    Get cart items for checkout page
    Query param: customer_id (required if user is logged in)
    
    Returns cart items in format expected by checkout.js
    """
    customer_id = request.GET.get('customer_id')
    
    if not customer_id:
        # For guest users, return empty or handle differently
        return Response({
            'items': [],
            'total': 0,
            'message': 'No customer specified'
        })
    
    try:
        cart_items = Cart.objects.filter(
            customer_id=customer_id
        ).select_related('product', 'product__inventory')
        
        serializer = CheckoutCartItemSerializer(cart_items, many=True)
        
        # Calculate total
        total = sum(
            float(item['price']) * item['quantity'] 
            for item in serializer.data
        )
        
        return Response({
            'items': serializer.data,
            'total': total,
            'count': len(serializer.data)
        })
    
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
def create_checkout_order(request):
    """
    Create order from checkout
    
    Expected POST data:
    {
        "shipping": {
            "fullName": "John Doe",
            "email": "john@example.com",
            "phone": "1234567890",
            "address": "123 Farm Road",
            "city": "Springfield",
            "zipCode": "12345"
        },
        "billing": {
            "cardName": "John Doe",
            "cardNumber": "1234567890123456",
            "expiryDate": "12/25",
            "cvv": "123",
            "billingAddress": "123 Farm Road",
            "billingCity": "Springfield",
            "billingZip": "12345"
        },
        "items": [
            {"product_id": 1, "quantity": 2},
            {"product_id": 3, "quantity": 1}
        ],
        "customer_id": 1  // optional
    }
    
    Returns: Order confirmation data
    """
    serializer = CheckoutOrderCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            order = serializer.save()
            
            # Return order confirmation
            confirmation_serializer = OrderConfirmationSerializer(order)
            return Response(
                confirmation_serializer.data, 
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to create order: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    return Response(
        serializer.errors, 
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['GET'])
def get_order_confirmation(request, order_id):
    """
    Get order confirmation details
    Used for confirmation page after order creation
    """
    try:
        order = Order.objects.get(order_id=order_id)
        serializer = OrderConfirmationSerializer(order)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response(
            {'error': 'Order not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
```

### 2. **`main/urls.py`** ⚠️ REQUIRED

Add URL patterns for the new checkout endpoints:

```python
from django.urls import path
from . import views

urlpatterns = [
    # ... existing patterns ...
    
    # Checkout API endpoints
    path('api/checkout/cart/', views.checkout_cart_api, name='checkout-cart-api'),
    path('api/checkout/create-order/', views.create_checkout_order, name='create-checkout-order'),
    path('api/checkout/order/<int:order_id>/', views.get_order_confirmation, name='order-confirmation'),
]
```

### 3. **`static/js/checkout.js`** 🔄 NEEDS UPDATE

Modify to fetch data from backend instead of localStorage:

#### **Changes needed:**

1. **Load cart from API instead of localStorage**
```javascript
// OLD (line 18-33)
function loadCartData() {
    const cartData = localStorage.getItem('checkoutCart');
    if (cartData) {
        try {
            cart = JSON.parse(cartData);
        } catch (e) {
            console.error('Error loading cart data:', e);
            cart = [];
        }
    }
    // ... rest
}

// NEW
async function loadCartData() {
    // Get customer_id (from session, localStorage, or auth system)
    const customerId = getCustomerId(); // You'll need to implement this
    
    if (!customerId) {
        notifications.error('Please log in to continue');
        setTimeout(() => window.location.href = '/login/', 2000);
        return;
    }
    
    try {
        const response = await fetch(`/api/checkout/cart/?customer_id=${customerId}`);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            cart = data.items;
            console.log('Cart loaded from backend:', cart);
        } else {
            notifications.error('No items in cart');
            setTimeout(() => window.location.href = '/', 2000);
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        notifications.error('Failed to load cart data');
    }
}
```

2. **Submit order to backend**
```javascript
// Add this new function after collectBillingData()
async function submitOrder() {
    const customerId = getCustomerId();
    
    const orderData = {
        shipping: shippingData,
        billing: billingData,
        items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity
        })),
        customer_id: customerId
    };
    
    try {
        const response = await fetch('/api/checkout/create-order/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')  // Add CSRF token
            },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Order created successfully
            console.log('Order created:', result);
            
            // Store order number for confirmation
            localStorage.setItem('lastOrderId', result.orderNumber);
            
            // Show confirmation
            currentStep = 3;
            updateFormDisplay();
            updateProgressSteps();
            showConfirmation();
        } else {
            notifications.error(result.error || 'Failed to create order');
        }
    } catch (error) {
        console.error('Error creating order:', error);
        notifications.error('Failed to process order. Please try again.');
    }
}

// Add CSRF token helper
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
```

3. **Modify nextStep() to submit order**
```javascript
// Modify the nextStep function (around line 113)
async function nextStep() {
    if (currentStep === 1) {
        if (validateShippingForm()) {
            collectShippingData();
            window.location.href = '/checkout/payment/';
        }
    } else if (currentStep === 2) {
        if (validateBillingForm()) {
            collectBillingData();
            // Submit order to backend
            await submitOrder();
        }
    }
}
```

4. **Add helper function to get customer ID**
```javascript
// Add this helper function at the top
function getCustomerId() {
    // Option 1: From localStorage (if you store it after login)
    return localStorage.getItem('customerId');
    
    // Option 2: From session/cookie
    // return getCookie('customer_id');
    
    // Option 3: From a global variable set by backend
    // return window.CUSTOMER_ID;
    
    // For testing, you can hardcode:
    // return 1;
}
```

### 4. **Authentication System** 🎯 IMPORTANT

You need to implement customer authentication:

**Options:**
1. **Simple approach**: Store customer_id in localStorage after login
2. **Session-based**: Use Django sessions
3. **Token-based**: Use JWT or similar

**Minimal implementation:**
```python
# In views.py
@api_view(['POST'])
def simple_login(request):
    """Simple login that returns customer_id"""
    email = request.data.get('email')
    # Validate and get customer
    try:
        customer = Customer.objects.get(email=email)
        return Response({
            'customer_id': customer.customer_id,
            'name': customer.name,
            'email': customer.email
        })
    except Customer.DoesNotExist:
        return Response(
            {'error': 'Customer not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
```

### 5. **Optional Enhancements**

#### Add to `checkout.js`:
- Loading spinners during API calls
- Better error handling
- Retry logic for failed requests
- Order tracking redirect after confirmation

#### Add to backend:
- Email notifications after order
- Order status tracking
- Payment gateway integration (Stripe, PayPal, etc.)
- Receipt PDF generation

---

## 📋 Summary of Data Flow

### Current Flow (Hardcoded):
```
localStorage → checkout.js → Display in UI
```

### New Flow (Backend):
```
1. GET /api/checkout/cart/?customer_id=1
   ↓
   Returns: [{id, name, price, quantity, image}, ...]
   ↓
   checkout.js displays items

2. User fills shipping form (Step 1)
   ↓
   checkout.js validates and stores data

3. User fills billing form (Step 2)
   ↓
   checkout.js validates and stores data

4. POST /api/checkout/create-order/
   Body: {shipping, billing, items, customer_id}
   ↓
   Backend creates Order, OrderItems, updates inventory
   ↓
   Returns: Order confirmation data

5. checkout.js shows confirmation (Step 3)
```

---

## 🧪 Testing Steps

1. **Test cart loading:**
   ```bash
   curl http://localhost:8000/api/checkout/cart/?customer_id=1
   ```

2. **Test order creation:**
   ```bash
   curl -X POST http://localhost:8000/api/checkout/create-order/ \
     -H "Content-Type: application/json" \
     -d '{
       "shipping": {
         "fullName": "Test User",
         "email": "test@example.com",
         "phone": "1234567890",
         "address": "123 Test St",
         "city": "Test City",
         "zipCode": "12345"
       },
       "billing": {
         "cardName": "Test User",
         "cardNumber": "4111111111111111",
         "expiryDate": "12/25",
         "cvv": "123",
         "billingAddress": "123 Test St",
         "billingCity": "Test City",
         "billingZip": "12345"
       },
       "items": [
         {"product_id": 1, "quantity": 2}
       ],
       "customer_id": 1
     }'
   ```

3. **Test order confirmation:**
   ```bash
   curl http://localhost:8000/api/checkout/order/1/
   ```

---

## 🔒 Security Notes

1. **Never store full credit card numbers** - Only last 4 digits
2. **Never store CVV** - Used for validation only
3. **Use HTTPS in production**
4. **Consider using a payment gateway** (Stripe, PayPal) instead of handling cards directly
5. **Implement CSRF protection** for all POST requests
6. **Add rate limiting** to prevent abuse
7. **Validate all input** on backend (don't trust frontend validation)

---

## 📊 Database Changes

No database changes needed! The existing models support everything:
- ✅ Customer (name, email, phone, address)
- ✅ Order (customer, total_amount, status, payment)
- ✅ OrderItem (order, product, quantity, price)
- ✅ Cart (customer, product, quantity)
- ✅ Inventory (product, stock_available)

---

## 🚀 Next Steps

1. ✅ **Done**: Update serializers (COMPLETED)
2. ⚠️ **Next**: Add views in `main/views.py`
3. ⚠️ **Next**: Add URLs in `main/urls.py`
4. ⚠️ **Next**: Update `checkout.js` to use API
5. ⚠️ **Next**: Implement customer authentication
6. 🎯 **Optional**: Add payment gateway integration
7. 🎯 **Optional**: Add email notifications

---

## 💡 Quick Start

To get started immediately:

1. Copy the view functions to `main/views.py`
2. Add the URL patterns to `main/urls.py`
3. Restart Django server: `python manage.py runserver`
4. Test the API endpoints with curl or Postman
5. Update `checkout.js` with the new functions
6. Test the full checkout flow

The UI will remain exactly the same - only the data source changes from localStorage to backend API!
