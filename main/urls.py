from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'main'

# API Router
router = DefaultRouter()
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'cart', views.CartViewSet, basename='cart')
router.register(r'orders', views.OrderViewSet, basename='order')
router.register(r'customers', views.CustomerViewSet, basename='customer')
router.register(r'inventory', views.InventoryViewSet, basename='inventory')

urlpatterns = [
    # ==================== API ENDPOINTS ====================
    
    # REST API endpoints (CRUD operations via ViewSets)
    path('api/', include(router.urls)),
    
    # Product catalog API endpoint
    # Returns products in the exact format expected by script.js on catalog page
    path('api/catalog/products/', views.catalog_products_api, name='catalog_products_api'),
    
    # Checkout API endpoints
    # These endpoints handle the complete checkout flow from cart to order confirmation
    path('api/checkout/cart/', views.checkout_cart_api, name='checkout_cart_api'),
    path('api/checkout/create-order/', views.create_checkout_order, name='create_checkout_order'),
    path('api/checkout/order/<int:order_id>/', views.get_order_confirmation, name='get_order_confirmation'),
    
    # Authentication API endpoints
    # These endpoints handle user login and signup via API (returns JSON)
    path('api/auth/login/', views.api_login, name='api_login'),
    path('api/auth/signup/', views.api_signup, name='api_signup'),
    
    # Customer Profile API endpoints
    # These endpoints provide customer profile data and order summaries for account pages
    path('api/customer/profile/', views.customer_profile_api, name='customer_profile_api'),
    path('api/customer/profile/update/', views.update_customer_profile_api, name='update_customer_profile_api'),
    path('api/customer/change-password/', views.change_password_api, name='change_password_api'),
    path('api/customer/delete-account/', views.delete_customer_account_api, name='delete_customer_account_api'),
    path('api/customer/orders-summary/', views.customer_orders_summary_api, name='customer_orders_summary_api'),
    path('api/customer/orders/', views.customer_orders_api, name='customer_orders_api'),
    
    # Customer Address API endpoints
    # These endpoints handle CRUD operations for customer addresses
    path('api/customer/addresses/', views.customer_addresses_api, name='customer_addresses_api'),
    path('api/customer/addresses/add/', views.add_address_api, name='add_address_api'),
    path('api/customer/addresses/<int:address_id>/', views.update_address_api, name='update_address_api'),
    path('api/customer/addresses/<int:address_id>/delete/', views.delete_address_api, name='delete_address_api'),
    path('api/customer/addresses/<int:address_id>/set-default/', views.set_default_address_api, name='set_default_address_api'),
    
    # ==================== HTML PAGE ROUTES ====================
    
    # Home and landing
    path('', views.home, name='home'),
    path('landing/', views.landing, name='landing'),
    
    # Product catalog
    path('catalog/', views.catalog, name='catalog'),
    path('product/<slug:slug>/', views.product_detail, name='product_detail'),
    
    # Account pages
    path('account/', views.account_home, name='account_home'),
    path('account/new/', views.account_new, name='account_new'),
    path('account/addresses/', views.account_addresses, name='account_addresses'),
    path('account/orders/', views.account_orders, name='account_orders'),
    path('account/payment/', views.account_payment, name='account_payment'),
    path('account/settings/', views.account_settings, name='account_settings'),
    
    # Auth
    path('login/', views.login, name='login'),
    path('signup/', views.signup, name='signup'),
    path('logout/', views.logout_view, name='logout'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    
    # Checkout
    path('checkout/', views.checkout, name='checkout'),
    path('checkout/payment/', views.checkout_payment, name='checkout_payment'),
    path('checkout/confirmation/', views.checkout_confirmation, name='checkout_confirmation'),
]
