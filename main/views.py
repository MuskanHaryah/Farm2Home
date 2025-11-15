from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from .models import Product, Inventory, Customer, Order, OrderItem, Cart, Address
from .serializers import (
    ProductSerializer, ProductListSerializer, 
    ProductCatalogSerializer,
    InventorySerializer, CustomerSerializer, CustomerProfileSerializer,
    OrderSerializer, OrderCreateSerializer, OrderSummarySerializer,
    CartSerializer, CheckoutCartItemSerializer,
    CheckoutOrderCreateSerializer, OrderConfirmationSerializer,
    AddressSerializer
)

# ==================== API VIEWS ====================

@api_view(['GET'])
def catalog_products_api(request):
    """
    API endpoint specifically for product catalog page
    Returns products in the exact format expected by script.js
    
    Supported Query Parameters:
    - category: Filter by category (vegetables, fruits, herbs)
    - season: Filter by season (summer, winter, year-round)
    - in_stock: Filter only in-stock items (true/false)
    - search: Search by name or local name
    - price_min: Minimum price filter
    - price_max: Maximum price filter
    - sort: Sort order (price_low, price_high, name_asc, name_desc, featured)
    
    Returns: JSON array of products matching frontend structure
    """
    # Start with active products and optimize query with select_related
    products = Product.objects.filter(is_active=True).select_related('inventory')
    
    # ===== CATEGORY FILTER =====
    category = request.GET.get('category')
    if category and category != 'all':
        products = products.filter(category__iexact=category)
    
    # ===== SEASON FILTER =====
    # Convert frontend format (summer, winter, year-round) to DB format (SUMMER, WINTER, ALL_YEAR)
    season = request.GET.get('season')
    if season:
        season_mapping = {
            'summer': 'SUMMER',
            'winter': 'WINTER',
            'year-round': 'ALL_YEAR'
        }
        db_season = season_mapping.get(season.lower())
        if db_season:
            products = products.filter(season=db_season)
    
    # ===== IN STOCK FILTER =====
    in_stock = request.GET.get('in_stock')
    if in_stock and in_stock.lower() == 'true':
        products = products.filter(inventory__stock_available__gt=0)
    
    # ===== SEARCH FILTER =====
    # Search in both English name and local name (variety)
    search = request.GET.get('search')
    if search:
        search_term = search.strip()
        if search_term:
            products = products.filter(
                Q(name__icontains=search_term) | Q(local_name__icontains=search_term)
            )
    
    # ===== PRICE RANGE FILTERS =====
    price_min = request.GET.get('price_min')
    if price_min:
        try:
            products = products.filter(price__gte=float(price_min))
        except (ValueError, TypeError):
            pass  # Ignore invalid price values
    
    price_max = request.GET.get('price_max')
    if price_max:
        try:
            products = products.filter(price__lte=float(price_max))
        except (ValueError, TypeError):
            pass
    
    # ===== SORTING =====
    sort_by = request.GET.get('sort', 'featured')
    
    if sort_by == 'price_low':
        products = products.order_by('price', 'name')
    elif sort_by == 'price_high':
        products = products.order_by('-price', 'name')
    elif sort_by == 'name_asc':
        products = products.order_by('name')
    elif sort_by == 'name_desc':
        products = products.order_by('-name')
    elif sort_by == 'date_new':
        # Sort by newest first (using product_id as proxy for creation order)
        products = products.order_by('-product_id')
    else:  # featured or default
        # Default sorting: by category and name
        products = products.order_by('category', 'name')
    
    # ===== SERIALIZE AND RETURN =====
    serializer = ProductCatalogSerializer(products, many=True)
    
    # Return the data with proper JSON response
    return Response(serializer.data, status=status.HTTP_200_OK)


class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint for products
    GET /api/products/ - List all products
    GET /api/products/{id}/ - Get product details
    POST /api/products/ - Create product
    PUT /api/products/{id}/ - Update product
    DELETE /api/products/{id}/ - Delete product
    """
    queryset = Product.objects.all().select_related('inventory')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        return ProductSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset().filter(is_active=True)
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__iexact=category)
        
        # Filter by season
        season = self.request.query_params.get('season', None)
        if season:
            queryset = queryset.filter(season=season)
        
        # Search by name
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(local_name__icontains=search)
            )
        
        # Filter by stock availability
        in_stock = self.request.query_params.get('in_stock', None)
        if in_stock == 'true':
            queryset = queryset.filter(inventory__stock_available__gt=0)
        
        return queryset.order_by('category', 'name')
    
    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Get all unique categories"""
        categories = Product.objects.filter(is_active=True).values_list('category', flat=True).distinct()
        return Response({'categories': list(categories)})
    
    @action(detail=False, methods=['get'])
    def count(self, request):
        """Get total product count"""
        count = self.get_queryset().count()
        return Response({'count': count})


class CartViewSet(viewsets.ModelViewSet):
    """
    API endpoint for shopping cart
    GET /api/cart/?customer_id=1 - Get cart items
    POST /api/cart/ - Add item to cart
    PUT /api/cart/{id}/ - Update cart item
    DELETE /api/cart/{id}/ - Remove cart item
    """
    serializer_class = CartSerializer
    lookup_field = 'cart_id'
    
    def get_queryset(self):
        customer_id = self.request.query_params.get('customer_id')
        if customer_id:
            return Cart.objects.filter(customer_id=customer_id).select_related('product', 'product__inventory')
        return Cart.objects.all().select_related('product', 'product__inventory')
    
    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Add item to cart or update quantity"""
        customer_id = request.data.get('customer_id')
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)
        
        try:
            cart_item, created = Cart.objects.get_or_create(
                customer_id=customer_id,
                product_id=product_id,
                defaults={'quantity': quantity}
            )
            
            if not created:
                cart_item.quantity += quantity
                cart_item.save()
            
            serializer = self.get_serializer(cart_item)
            return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['delete'])
    def clear(self, request):
        """Clear entire cart for customer"""
        customer_id = request.query_params.get('customer_id')
        if customer_id:
            deleted_count = Cart.objects.filter(customer_id=customer_id).delete()[0]
            return Response({'message': f'Cart cleared. {deleted_count} items removed.'})
        return Response({'error': 'Customer ID required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get cart summary with total"""
        customer_id = request.query_params.get('customer_id')
        if not customer_id:
            return Response({'error': 'Customer ID required'}, status=status.HTTP_400_BAD_REQUEST)
        
        cart_items = Cart.objects.filter(customer_id=customer_id).select_related('product')
        total = sum(item.quantity * item.product.price for item in cart_items)
        
        return Response({
            'items': CartSerializer(cart_items, many=True).data,
            'total_items': cart_items.count(),
            'estimated_total': total
        })


class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint for orders
    GET /api/orders/ - List all orders
    GET /api/orders/?customer_id=1 - Get customer orders
    POST /api/orders/ - Create new order
    GET /api/orders/{id}/ - Get order details
    """
    queryset = Order.objects.all().prefetch_related('order_items__product')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        customer_id = self.request.query_params.get('customer_id')
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)
        return queryset.order_by('-order_date')


class CustomerViewSet(viewsets.ModelViewSet):
    """
    API endpoint for customers
    GET /api/customers/ - List all customers
    POST /api/customers/ - Create customer
    GET /api/customers/{id}/ - Get customer details
    PUT /api/customers/{id}/ - Update customer
    DELETE /api/customers/{id}/ - Delete customer
    """
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    
    @action(detail=True, methods=['get'])
    def orders(self, request, pk=None):
        """Get all orders for a customer"""
        customer = self.get_object()
        orders = customer.orders.all().order_by('-order_date')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class InventoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for inventory management
    GET /api/inventory/ - List all inventory
    PUT /api/inventory/{id}/ - Update stock
    """
    queryset = Inventory.objects.all().select_related('product')
    serializer_class = InventorySerializer


# ==================== CHECKOUT API VIEWS ====================

@api_view(['GET'])
def checkout_cart_api(request):
    """
    API endpoint to get cart items formatted for checkout page
    Returns cart items in the exact structure expected by checkout.js
    
    Query Parameters:
    - customer_id (required): The ID of the customer whose cart to retrieve
    
    Returns:
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
            ...
        ],
        "total": 21.48,
        "count": 2
    }
    
    Use Case: Called when checkout page loads to populate the carousel with cart items
    """
    customer_id = request.GET.get('customer_id')
    
    # Validate customer_id parameter
    if not customer_id:
        return Response({
            'error': 'Customer ID is required',
            'items': [],
            'total': 0,
            'count': 0
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Verify customer exists
        try:
            customer = Customer.objects.get(customer_id=customer_id)
        except Customer.DoesNotExist:
            return Response({
                'error': f'Customer with ID {customer_id} not found',
                'items': [],
                'total': 0,
                'count': 0
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Fetch cart items with related product and inventory data
        cart_items = Cart.objects.filter(
            customer_id=customer_id
        ).select_related('product', 'product__inventory')
        
        # Check if cart is empty
        if not cart_items.exists():
            return Response({
                'message': 'Cart is empty',
                'items': [],
                'total': 0,
                'count': 0
            }, status=status.HTTP_200_OK)
        
        # Serialize cart items using CheckoutCartItemSerializer
        serializer = CheckoutCartItemSerializer(cart_items, many=True)
        
        # Calculate total price (quantity * price for each item)
        total = sum(
            float(item['price']) * item['quantity'] 
            for item in serializer.data
        )
        
        # Return formatted response
        return Response({
            'items': serializer.data,
            'total': round(total, 2),
            'count': len(serializer.data)
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        # Catch any unexpected errors
        return Response({
            'error': f'Failed to retrieve cart: {str(e)}',
            'items': [],
            'total': 0,
            'count': 0
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def create_checkout_order(request):
    """
    API endpoint to create a complete order from checkout
    Handles shipping, billing, and cart items in a single transaction
    
    Expected POST data structure:
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
        "customer_id": 1  // optional - if not provided, creates new customer
    }
    
    Returns: Order confirmation data with order number, items, total, and shipping info
    
    What this endpoint does:
    1. Validates all input data (shipping, billing, items)
    2. Checks product availability and stock levels
    3. Creates or updates Customer record
    4. Creates Order record with PENDING status
    5. Creates OrderItem records for each cart item
    6. Updates Inventory (decreases stock)
    7. Clears customer's Cart
    8. Returns order confirmation data
    """
    # Validate request data using CheckoutOrderCreateSerializer
    serializer = CheckoutOrderCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            # Create the order (serializer handles all the logic)
            # This includes: customer creation/update, order creation, 
            # order items creation, inventory updates, and cart clearing
            order = serializer.save()
            
            # Prepare order confirmation response
            confirmation_serializer = OrderConfirmationSerializer(order)
            
            return Response(
                confirmation_serializer.data, 
                status=status.HTTP_201_CREATED
            )
        
        except Inventory.DoesNotExist as e:
            # Handle case where product has no inventory record
            return Response({
                'error': 'Product inventory not found',
                'detail': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        
        except Product.DoesNotExist as e:
            # Handle case where product doesn't exist
            return Response({
                'error': 'Product not found',
                'detail': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            # Handle any other unexpected errors during order creation
            return Response({
                'error': 'Failed to create order',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Return validation errors if serializer validation failed
    return Response({
        'error': 'Invalid order data',
        'details': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_order_confirmation(request, order_id):
    """
    API endpoint to retrieve order confirmation details
    Used for displaying order confirmation page or order history
    
    URL Parameters:
    - order_id: The ID of the order to retrieve
    
    Returns: Complete order details including items, total, and shipping information
    
    Use Cases:
    1. Display confirmation page after successful order
    2. Allow users to view past order details
    3. Generate order receipts
    """
    try:
        # Fetch order with related items and product data
        order = Order.objects.prefetch_related(
            'order_items__product'
        ).get(order_id=order_id)
        
        # Serialize order data for confirmation display
        serializer = OrderConfirmationSerializer(order)
        
        return Response(
            serializer.data, 
            status=status.HTTP_200_OK
        )
    
    except Order.DoesNotExist:
        # Handle case where order doesn't exist
        return Response({
            'error': 'Order not found',
            'detail': f'No order exists with ID {order_id}'
        }, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        # Handle any unexpected errors
        return Response({
            'error': 'Failed to retrieve order',
            'detail': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==================== AUTHENTICATION API VIEWS ====================

@api_view(['POST'])
def api_login(request):
    """
    API endpoint for user login authentication
    
    Expected POST data:
    {
        "email": "user@example.com",
        "password": "user123"
    }
    
    Returns on success:
    {
        "success": true,
        "message": "Login successful",
        "customer_id": 1,
        "name": "John Doe",
        "email": "user@example.com"
    }
    
    Returns on failure:
    {
        "success": false,
        "error": "Invalid email or password"
    }
    
    Use Case: Called from modal login form to authenticate user
    """
    from django.contrib.auth.hashers import check_password
    
    # Extract email and password from request
    email = request.data.get('email', '').strip()
    password = request.data.get('password', '')
    
    # Validate required fields
    if not email or not password:
        return Response({
            'success': False,
            'error': 'Email and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Find customer by email
        customer = Customer.objects.get(email__iexact=email)
        
        # Verify password using Django's check_password
        if check_password(password, customer.password):
            # Password is correct - return customer data
            return Response({
                'success': True,
                'message': 'Login successful',
                'customer_id': customer.customer_id,
                'name': customer.name,
                'email': customer.email,
                'phone': customer.phone
            }, status=status.HTTP_200_OK)
        else:
            # Password is incorrect
            return Response({
                'success': False,
                'error': 'Incorrect password. Please try again.'
            }, status=status.HTTP_401_UNAUTHORIZED)
    
    except Customer.DoesNotExist:
        # Customer with this email doesn't exist
        return Response({
            'success': False,
            'error': 'No account exists with this email. Please sign up first.'
        }, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        # Handle unexpected errors
        return Response({
            'success': False,
            'error': 'Login failed. Please try again.',
            'detail': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def api_signup(request):
    """
    API endpoint for user registration
    
    Expected POST data:
    {
        "name": "John Doe",
        "email": "user@example.com",
        "phone": "1234567890",
        "address": "123 Farm Road, City",
        "password": "user123"
    }
    
    Returns on success:
    {
        "success": true,
        "message": "Account created successfully",
        "customer_id": 1,
        "name": "John Doe",
        "email": "user@example.com"
    }
    
    Returns on failure:
    {
        "success": false,
        "error": "Email already exists"
    }
    
    Use Case: Called from modal signup form to register new user
    """
    from django.contrib.auth.hashers import make_password
    
    # Extract data from request
    name = request.data.get('name', '').strip()
    email = request.data.get('email', '').strip()
    phone = request.data.get('phone', '').strip()
    password = request.data.get('password', '')
    
    # Validate required fields
    if not all([name, email, phone, password]):
        return Response({
            'success': False,
            'error': 'All fields are required',
            'missing_fields': [
                field for field, value in {
                    'name': name, 'email': email, 'phone': phone,
                    'password': password
                }.items() if not value
            ]
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate email format
    if '@' not in email or '.' not in email:
        return Response({
            'success': False,
            'error': 'Invalid email format'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate password length
    if len(password) < 6:
        return Response({
            'success': False,
            'error': 'Password must be at least 6 characters long'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Check if email already exists
        if Customer.objects.filter(email__iexact=email).exists():
            return Response({
                'success': False,
                'error': 'Email already exists. Please login instead.'
            }, status=status.HTTP_409_CONFLICT)
        
        # Check if phone number already exists
        if Customer.objects.filter(phone=phone).exists():
            return Response({
                'success': False,
                'error': 'Phone number already registered. Please use a different number or login.'
            }, status=status.HTTP_409_CONFLICT)
        
        # Hash password using Django's make_password
        hashed_password = make_password(password)
        
        # Create new customer
        customer = Customer.objects.create(
            name=name,
            email=email,
            phone=phone,
            password=hashed_password
        )
        
        # Return success response with customer data
        return Response({
            'success': True,
            'message': 'Account created successfully',
            'customer_id': customer.customer_id,
            'name': customer.name,
            'email': customer.email,
            'phone': customer.phone
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        # Handle unexpected errors
        return Response({
            'success': False,
            'error': 'Failed to create account. Please try again.',
            'detail': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==================== CUSTOMER PROFILE API VIEWS ====================

@api_view(['GET'])
def customer_profile_api(request):
    """
    API endpoint to get customer profile with statistics
    
    Query Parameters:
    - customer_id (required): The ID of the customer
    
    Returns:
    {
        "customer_id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "address": "123 Farm Road",
        "total_spent": 15420.50,
        "total_orders": 12,
        "growth_percentage": 15.5
    }
    
    Use Case: Called by account overview page to populate profile info and stats
    """
    customer_id = request.GET.get('customer_id')
    
    # Validate customer_id parameter
    if not customer_id:
        return Response({
            'status': 'error',
            'message': 'Customer ID is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Get customer with prefetch for optimization
        customer = Customer.objects.prefetch_related('orders').get(customer_id=customer_id)
        
        # Serialize customer data with statistics
        from .serializers import CustomerProfileSerializer
        serializer = CustomerProfileSerializer(customer)
        
        return Response({
            'status': 'success',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Customer.DoesNotExist:
        return Response({
            'status': 'error',
            'message': f'Customer with ID {customer_id} not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({
            'status': 'error',
            'message': 'Failed to retrieve customer profile',
            'detail': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def customer_orders_summary_api(request):
    """
    API endpoint to get recent orders summary for customer
    
    Query Parameters:
    - customer_id (required): The ID of the customer
    - limit (optional): Number of recent orders to return (default: 3)
    
    Returns:
    {
        "status": "success",
        "data": [
            {
                "order_id": 1128,
                "status": "DELIVERED",
                "status_display": "Delivered",
                "total_amount": "3850.00",
                "order_date": "2024-11-28T10:30:00Z",
                "order_date_formatted": "Nov 28, 2024",
                "product_names": "Tomato, Spinach, Potato"
            },
            ...
        ],
        "count": 3
    }
    
    Use Case: Called by account overview page to populate recent orders list
    """
    customer_id = request.GET.get('customer_id')
    limit = request.GET.get('limit', 3)
    
    # Validate customer_id parameter
    if not customer_id:
        return Response({
            'status': 'error',
            'message': 'Customer ID is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Validate limit parameter
        try:
            limit = int(limit)
            if limit <= 0:
                limit = 3
        except (ValueError, TypeError):
            limit = 3
        
        # Verify customer exists
        try:
            customer = Customer.objects.get(customer_id=customer_id)
        except Customer.DoesNotExist:
            return Response({
                'status': 'error',
                'message': f'Customer with ID {customer_id} not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get recent orders with prefetch for optimization
        orders = Order.objects.filter(
            customer_id=customer_id
        ).prefetch_related(
            'order_items__product'
        ).order_by('-order_date')[:limit]
        
        # Serialize orders
        from .serializers import OrderSummarySerializer
        serializer = OrderSummarySerializer(orders, many=True)
        
        return Response({
            'status': 'success',
            'data': serializer.data,
            'count': len(serializer.data)
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'status': 'error',
            'message': 'Failed to retrieve orders summary',
            'detail': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def customer_orders_api(request):
    """
    API endpoint to get ALL orders for customer (for Orders page)
    
    Query Parameters:
    - customer_id (required): The ID of the customer
    
    Returns:
    {
        "status": "success",
        "data": [
            {
                "order_id": 1128,
                "order_id_formatted": "ORD-2024-1128",
                "status": "DELIVERED",
                "status_display": "Delivered",
                "total_amount": "2850.00",
                "order_date": "2024-11-28T10:30:00Z",
                "order_date_formatted": "NOV 28, 2024",
                "payment": "Card ending in 1234",
                "order_items": [
                    {
                        "item_id": 1,
                        "product": 5,
                        "product_name": "Tomato",
                        "product_image": "/static/images/vegetables/tomato.png",
                        "product_category": "vegetables",
                        "quantity": 1,
                        "price": "95.00"
                    },
                    ...
                ],
                "items_count": 3
            },
            ...
        ],
        "count": 47
    }
    
    Use Case: Called by orders page to display complete order history with all details
    Difference from orders-summary: Returns ALL orders (not just 3) with complete order_items data
    """
    customer_id = request.GET.get('customer_id')
    
    # Validate customer_id parameter
    if not customer_id:
        return Response({
            'status': 'error',
            'message': 'Customer ID is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Verify customer exists
        try:
            customer = Customer.objects.get(customer_id=customer_id)
        except Customer.DoesNotExist:
            return Response({
                'status': 'error',
                'message': f'Customer with ID {customer_id} not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get ALL orders for this customer with prefetch for optimization
        orders = Order.objects.filter(
            customer_id=customer_id
        ).prefetch_related(
            'order_items__product'
        ).order_by('-order_date')  # Most recent first
        
        # Serialize orders with complete details
        from .serializers import OrderDetailSerializer
        serializer = OrderDetailSerializer(orders, many=True)
        
        return Response({
            'status': 'success',
            'data': serializer.data,
            'count': len(serializer.data)
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'status': 'error',
            'message': 'Failed to retrieve orders',
            'detail': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT', 'PATCH'])
@csrf_exempt
def update_customer_profile_api(request):
    """
    API endpoint to update customer profile information
    
    Expected PUT/PATCH data:
    {
        "customer_id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890"
    }
    
    Returns on success:
    {
        "success": true,
        "message": "Profile updated successfully",
        "data": {
            "customer_id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "1234567890"
        }
    }
    
    Returns on failure:
    {
        "success": false,
        "error": "Error message"
    }
    
    Use Case: Called from settings page when user updates personal information
    """
    customer_id = request.data.get('customer_id')
    
    # Validate customer_id
    if not customer_id:
        return Response({
            'success': False,
            'error': 'Customer ID is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Get the customer
        customer = Customer.objects.get(customer_id=customer_id)
        
        # Extract update data
        name = request.data.get('name', '').strip()
        email = request.data.get('email', '').strip()
        phone = request.data.get('phone', '').strip()
        
        # Validate required fields
        if not name or not email or not phone:
            return Response({
                'success': False,
                'error': 'Name, email, and phone are required',
                'missing_fields': []
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate email format
        if '@' not in email or '.' not in email:
            return Response({
                'success': False,
                'error': 'Invalid email format'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if email is already taken by another customer
        if Customer.objects.filter(email__iexact=email).exclude(customer_id=customer_id).exists():
            return Response({
                'success': False,
                'error': 'Email already exists'
            }, status=status.HTTP_409_CONFLICT)
        
        # Update customer fields
        customer.name = name
        customer.email = email
        customer.phone = phone
        customer.save()
        
        # Return success response
        return Response({
            'success': True,
            'message': 'Profile updated successfully',
            'data': {
                'customer_id': customer.customer_id,
                'name': customer.name,
                'email': customer.email,
                'phone': customer.phone
            }
        }, status=status.HTTP_200_OK)
    
    except Customer.DoesNotExist:
        return Response({
            'success': False,
            'error': f'Customer with ID {customer_id} not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({
            'success': False,
            'error': 'Failed to update profile',
            'detail': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@csrf_exempt
def change_password_api(request):
    """
    API endpoint to change customer password
    
    Expected POST data:
    {
        "customer_id": 1,
        "current_password": "oldpass123",
        "new_password": "newpass123"
    }
    
    Returns on success:
    {
        "success": true,
        "message": "Password changed successfully"
    }
    
    Returns on failure:
    {
        "success": false,
        "error": "Error message"
    }
    
    Use Case: Called from settings page when user changes password
    """
    from django.contrib.auth.hashers import check_password, make_password
    
    customer_id = request.data.get('customer_id')
    current_password = request.data.get('current_password', '')
    new_password = request.data.get('new_password', '')
    
    # Validate required fields
    if not customer_id:
        return Response({
            'success': False,
            'error': 'Customer ID is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not current_password or not new_password:
        return Response({
            'success': False,
            'error': 'Current password and new password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate new password length
    if len(new_password) < 6:
        return Response({
            'success': False,
            'error': 'New password must be at least 6 characters long'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Get the customer
        customer = Customer.objects.get(customer_id=customer_id)
        
        # Verify current password
        if not check_password(current_password, customer.password):
            return Response({
                'success': False,
                'error': 'Current password is incorrect'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Hash and save new password
        customer.password = make_password(new_password)
        customer.save()
        
        # Return success response
        return Response({
            'success': True,
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)
    
    except Customer.DoesNotExist:
        return Response({
            'success': False,
            'error': f'Customer with ID {customer_id} not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({
            'success': False,
            'error': 'Failed to change password',
            'detail': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==================== HTML VIEWS ====================

def home(request):
    """Render homepage"""
    return render(request, 'index.html')


def landing(request):
    """Render landing page"""
    return render(request, 'landing/index.html')


def catalog(request):
    """Render product catalog"""
    return render(request, 'prod-catalog/index.html')


def product_detail(request, slug):
    """Render product detail page"""
    return render(request, 'prod-catalog/product_detail.html', {'slug': slug})


# Account pages
def account_home(request):
    """Render account home page"""
    return render(request, 'account/index.html')


def account_new(request):
    """Render new account page"""
    return render(request, 'account/index-new.html')


def account_addresses(request):
    """Render addresses page"""
    return render(request, 'account/addresses.html')


def account_orders(request):
    """Render orders page"""
    return render(request, 'account/orders.html')


def account_payment(request):
    """Render payment methods page"""
    return render(request, 'account/payment.html')


def account_settings(request):
    """
    Render account settings page with customer data
    Requires customer_id in localStorage (set during login)
    """
    # Note: Since we're using localStorage for auth (not Django sessions),
    # we don't check authentication here. The JavaScript will handle
    # redirecting if customer_id is not in localStorage.
    # The page will load, and JS will fetch customer data via API.
    
    return render(request, 'account/settings.html')


# Auth pages
def login(request):
    """Render login page"""
    return render(request, 'auth/login.html')


def signup(request):
    """Render signup page"""
    return render(request, 'auth/signup.html')


def logout_view(request):
    """Render logout page or handle logout"""
    return render(request, 'auth/login.html')


def forgot_password(request):
    """Render forgot password page"""
    return render(request, 'auth/forgot_password.html')


# Checkout pages
def checkout(request):
    """Render checkout page"""
    return render(request, 'checkout/index.html')


def checkout_payment(request):
    """Render checkout payment page"""
    return render(request, 'checkout/payment.html')


def checkout_confirmation(request):
    """Render checkout confirmation page"""
    return render(request, 'checkout/confirmation.html')


# ==================== ADDRESS API ENDPOINTS ====================

@api_view(['GET'])
def customer_addresses_api(request):
    """
    Get all addresses for a customer
    GET /api/customer/addresses/?customer_id=1
    
    Returns:
        - 200: Success with addresses list
        - 400: Missing customer_id
        - 404: Customer not found
        - 500: Server error
    """
    customer_id = request.query_params.get('customer_id')
    
    if not customer_id:
        return Response({
            'status': 'error',
            'message': 'customer_id is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Verify customer exists
        customer = Customer.objects.get(customer_id=customer_id)
        
        # Get all addresses for this customer
        addresses = Address.objects.filter(customer=customer).order_by('-is_default', '-created_at')
        
        # Serialize the data
        serializer = AddressSerializer(addresses, many=True)
        
        return Response({
            'status': 'success',
            'data': serializer.data,
            'count': addresses.count()
        }, status=status.HTTP_200_OK)
        
    except Customer.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Customer not found'
        }, status=status.HTTP_404_NOT_FOUND)
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def add_address_api(request):
    """
    Add a new address for a customer
    POST /api/customer/addresses/add/
    
    Body:
        - customer_id: int (required)
        - label: str (HOME/WORK/OTHER)
        - address_line: str (required)
        - city: str (required)
        - postal_code: str (required)
        - phone: str (required)
        - is_default: bool (optional, default False)
    
    Returns:
        - 201: Address created successfully
        - 400: Validation error
        - 404: Customer not found
        - 500: Server error
    """
    try:
        customer_id = request.data.get('customer_id')
        
        if not customer_id:
            return Response({
                'status': 'error',
                'message': 'customer_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify customer exists
        try:
            customer = Customer.objects.get(customer_id=customer_id)
        except Customer.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Customer not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Prepare data for serializer
        address_data = {
            'customer': customer_id,
            'label': request.data.get('label', 'HOME'),
            'address_line': request.data.get('address_line'),
            'city': request.data.get('city'),
            'postal_code': request.data.get('postal_code'),
            'phone': request.data.get('phone'),
            'is_default': request.data.get('is_default', False)
        }
        
        # Validate and create address
        serializer = AddressSerializer(data=address_data)
        
        if serializer.is_valid():
            serializer.save()
            
            return Response({
                'status': 'success',
                'message': 'Address added successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'status': 'error',
                'message': 'Validation failed',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
def update_address_api(request, address_id):
    """
    Update an existing address
    PUT /api/customer/addresses/<address_id>/
    
    Body:
        - customer_id: int (required for ownership validation)
        - label: str (optional)
        - address_line: str (optional)
        - city: str (optional)
        - postal_code: str (optional)
        - phone: str (optional)
        - is_default: bool (optional)
    
    Returns:
        - 200: Address updated successfully
        - 400: Validation error
        - 403: Not authorized (address doesn't belong to customer)
        - 404: Address not found
        - 500: Server error
    """
    try:
        customer_id = request.data.get('customer_id')
        
        if not customer_id:
            return Response({
                'status': 'error',
                'message': 'customer_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the address
        try:
            address = Address.objects.get(address_id=address_id)
        except Address.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Address not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Verify ownership
        if address.customer.customer_id != int(customer_id):
            return Response({
                'status': 'error',
                'message': 'You are not authorized to update this address'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Update address with partial data
        serializer = AddressSerializer(address, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            
            return Response({
                'status': 'success',
                'message': 'Address updated successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'status': 'error',
                'message': 'Validation failed',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
def delete_address_api(request, address_id):
    """
    Delete an address
    DELETE /api/customer/addresses/<address_id>/
    
    Query Parameters:
        - customer_id: int (required for ownership validation)
    
    Returns:
        - 200: Address deleted successfully
        - 400: Cannot delete (only address or is default)
        - 403: Not authorized
        - 404: Address not found
        - 500: Server error
    """
    try:
        customer_id = request.query_params.get('customer_id')
        
        if not customer_id:
            return Response({
                'status': 'error',
                'message': 'customer_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the address
        try:
            address = Address.objects.get(address_id=address_id)
        except Address.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Address not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Verify ownership
        if address.customer.customer_id != int(customer_id):
            return Response({
                'status': 'error',
                'message': 'You are not authorized to delete this address'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # If deleting default address, set another as default (if there are other addresses)
        if address.is_default:
            # Get another address to set as default
            another_address = Address.objects.filter(
                customer=address.customer
            ).exclude(address_id=address_id).first()
            
            if another_address:
                another_address.is_default = True
                another_address.save()
        
        # Delete the address
        address.delete()
        
        return Response({
            'status': 'success',
            'message': 'Address deleted successfully'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def set_default_address_api(request, address_id):
    """
    Set an address as default
    POST /api/customer/addresses/<address_id>/set-default/
    
    Body:
        - customer_id: int (required for ownership validation)
    
    Returns:
        - 200: Default address updated successfully
        - 403: Not authorized
        - 404: Address not found
        - 500: Server error
    """
    try:
        customer_id = request.data.get('customer_id')
        
        if not customer_id:
            return Response({
                'status': 'error',
                'message': 'customer_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the address
        try:
            address = Address.objects.get(address_id=address_id)
        except Address.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Address not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Verify ownership
        if address.customer.customer_id != int(customer_id):
            return Response({
                'status': 'error',
                'message': 'You are not authorized to modify this address'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Remove default from all other addresses
        Address.objects.filter(customer=address.customer).update(is_default=False)
        
        # Set this address as default
        address.is_default = True
        address.save()
        
        # Serialize and return updated address
        serializer = AddressSerializer(address)
        
        return Response({
            'status': 'success',
            'message': 'Default address updated successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
def delete_customer_account_api(request):
    """
    Delete a customer account permanently
    DELETE /api/customer/delete-account/
    
    Body:
        - customer_id: int (required)
    
    Returns:
        - 200: Account deleted successfully
        - 400: Invalid request
        - 404: Customer not found
        - 500: Server error
    
    This will delete:
    - Customer record
    - All associated orders
    - All associated addresses
    - Cart items (cascading delete)
    """
    try:
        customer_id = request.data.get('customer_id')
        
        if not customer_id:
            return Response({
                'status': 'error',
                'message': 'customer_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the customer
        try:
            customer = Customer.objects.get(customer_id=customer_id)
        except Customer.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Customer not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Store customer name for response message
        customer_name = customer.name
        
        # Delete the customer (this will cascade delete related records)
        customer.delete()
        
        return Response({
            'status': 'success',
            'message': f'Account for {customer_name} has been permanently deleted'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': f'Failed to delete account: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

