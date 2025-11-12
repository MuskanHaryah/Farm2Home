from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.db.models import Q
from .models import Product, Inventory, Customer, Order, OrderItem, Cart
from .serializers import (
    ProductSerializer, ProductListSerializer, 
    ProductCatalogSerializer,
    InventorySerializer, CustomerSerializer,
    OrderSerializer, OrderCreateSerializer,
    CartSerializer
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
    
    def get_queryset(self):
        customer_id = self.request.query_params.get('customer_id')
        if customer_id:
            return Cart.objects.filter(customer_id=customer_id).select_related('product', 'product__inventory')
        return Cart.objects.none()
    
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
    """Render account settings page"""
    return render(request, 'account/settings.html')


# Auth pages
def login(request):
    """Render login page"""
    return render(request, 'auth/login.html')


def signup(request):
    """Render signup page"""
    return render(request, 'auth/signup.html')


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
