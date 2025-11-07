from django.shortcuts import render

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
