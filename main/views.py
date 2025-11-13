from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

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
    """Handle login - GET redirects to landing with modal, POST processes login"""
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        # Try to find user by email
        try:
            user_obj = User.objects.get(email=email)
            username = user_obj.username
        except User.DoesNotExist:
            messages.error(request, 'Invalid email or password')
            return redirect('main:landing')
        
        # Authenticate user
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            auth_login(request, user)
            messages.success(request, f'Welcome back, {user.first_name or user.username}!')
            return redirect('main:account_home')
        else:
            messages.error(request, 'Invalid email or password')
            # Redirect back to landing with error message
            return redirect('main:landing')
    
    # GET request - redirect to landing page
    # Modal will auto-open if there are messages
    return redirect('main:landing')


def signup(request):
    """Handle signup - GET renders form, POST creates user"""
    if request.method == 'POST':
        full_name = request.POST.get('fullName')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirmPassword')
        
        # Validate passwords match
        if password != confirm_password:
            messages.error(request, 'Passwords do not match')
            return redirect('main:landing')
        
        # Check if email already exists
        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already registered')
            return redirect('main:landing')
        
        # Check if username (from email) already exists
        username = email.split('@')[0]
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
        
        try:
            # Create new user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            
            # Split name into first and last
            name_parts = full_name.split(' ', 1)
            user.first_name = name_parts[0]
            if len(name_parts) > 1:
                user.last_name = name_parts[1]
            user.save()
            
            # Create customer profile if needed
            from .models import Customer
            Customer.objects.create(
                name=full_name,
                email=email,
                phone=phone,
                address=''
            )
            
            messages.success(request, 'Account created successfully! Please login.')
            return redirect('main:landing')
            
        except Exception as e:
            messages.error(request, f'Error creating account: {str(e)}')
            return redirect('main:signup')
    
    # GET request - redirect to landing page with signup modal
    return redirect('main:landing')


def logout_view(request):
    """Handle user logout"""
    auth_logout(request)
    messages.success(request, 'You have been logged out successfully')
    return redirect('main:login')


def forgot_password(request):
    """Redirect to landing page - forgot password handled via modal"""
    messages.info(request, 'Please enter your email to reset your password')
    return redirect('main:landing')


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
