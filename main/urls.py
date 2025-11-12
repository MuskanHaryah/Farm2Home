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
    # API endpoints
    path('api/', include(router.urls)),
    
    # Custom API endpoint for product catalog page
    # This endpoint returns products in the exact format expected by script.js
    path('api/catalog/products/', views.catalog_products_api, name='catalog_products_api'),
    
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
    
    # Checkout
    path('checkout/', views.checkout, name='checkout'),
    path('checkout/payment/', views.checkout_payment, name='checkout_payment'),
    path('checkout/confirmation/', views.checkout_confirmation, name='checkout_confirmation'),
]
