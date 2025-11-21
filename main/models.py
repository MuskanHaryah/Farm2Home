from django.db import models
import uuid
from datetime import timedelta
from django.utils import timezone

class Customer(models.Model):
    customer_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    password = models.CharField(max_length=128)  # Stores hashed password

    def __str__(self):
        return self.name


class Product(models.Model):
    SEASON_CHOICES = [
        ('SUMMER', '☀️ Summer'),
        ('WINTER', '❄️ Winter'),
        ('ALL_YEAR', '🔄 All Year'),
    ]
    
    CATEGORY_CHOICES = [
        ('vegetables', 'Vegetables'),
        ('fruits', 'Fruits'),
        ('herbs', 'Herbs'),
    ]
    
    product_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)  # English name
    local_name = models.CharField(max_length=100, blank=True)  # Urdu/local name
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, help_text="Discount percentage (0-100)")
    season = models.CharField(max_length=20, choices=SEASON_CHOICES, default='ALL_YEAR')
    image = models.CharField(max_length=255, blank=True)  # Image path
    slug = models.SlugField(unique=True, blank=True, null=True, max_length=150)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Inventory(models.Model):
    inventory_id = models.AutoField(primary_key=True)
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name="inventory")
    stock_available = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.product.name} - {self.stock_available}"


class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('SHIPPED', 'Shipped'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]

    order_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="orders")
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"Order #{self.order_id} - {self.customer.name}"


class OrderItem(models.Model):
    item_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="order_items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} (x{self.quantity})"


class Cart(models.Model):
    cart_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="cart")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1) # i have added extra (not in erd)

    class Meta:
        unique_together = ('customer', 'product')  # Prevent duplicate cart items
        ordering = ['-cart_id']  # Order by newest first to fix pagination warning

    def __str__(self):
        return f"{self.customer.name} - {self.product.name} (x{self.quantity})"


class Address(models.Model):
    LABEL_CHOICES = [
        ('HOME', 'Home'),
        ('WORK', 'Work'),
        ('OTHER', 'Other'),
    ]
    
    address_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="addresses")
    label = models.CharField(max_length=20, choices=LABEL_CHOICES, default='HOME')
    address_line = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    phone = models.CharField(max_length=20)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Address'
        verbose_name_plural = 'Addresses'
        ordering = ['-is_default', '-created_at']
    
    def __str__(self):
        return f"{self.customer.name} - {self.label} ({self.city})"
    
    def save(self, *args, **kwargs):
        # If this address is set as default, remove default from other addresses
        if self.is_default:
            Address.objects.filter(customer=self.customer, is_default=True).update(is_default=False)
        super().save(*args, **kwargs)


class PasswordResetToken(models.Model):
    """
    Model to store password reset tokens for customers
    Each token is valid for 1 hour and can only be used once
    """
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='reset_tokens')
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Reset token for {self.customer.email} - {self.token}"
    
    def is_valid(self):
        """Check if token is still valid (not expired and not used)"""
        # Token expires after 1 hour
        expiry_time = self.created_at + timedelta(hours=1)
        return not self.is_used and timezone.now() < expiry_time
    
    def mark_as_used(self):
        """Mark token as used"""
        self.is_used = True
        self.save()

