from django.urls import path
from . import views

app_name = 'main'

urlpatterns = [
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
]
