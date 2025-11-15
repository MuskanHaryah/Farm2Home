from rest_framework import serializers
from .models import Customer, Product, Inventory, Order, OrderItem, Cart, Address


class CustomerSerializer(serializers.ModelSerializer):
    """Serializer for Customer model"""
    
    class Meta:
        model = Customer
        fields = ['customer_id', 'name', 'email', 'phone']
        read_only_fields = ['customer_id']
    
    def validate_email(self, value):
        """Ensure email is unique (case-insensitive)"""
        if Customer.objects.filter(email__iexact=value).exists():
            if not self.instance or self.instance.email.lower() != value.lower():
                raise serializers.ValidationError("A customer with this email already exists.")
        return value.lower()


class CustomerProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for Customer Profile with computed statistics
    Returns customer data along with total_spent, total_orders, and growth_percentage
    """
    total_spent = serializers.SerializerMethodField()
    total_orders = serializers.SerializerMethodField()
    growth_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = Customer
        fields = ['customer_id', 'name', 'email', 'phone', 
                  'total_spent', 'total_orders', 'growth_percentage']
        read_only_fields = ['customer_id']
    
    def get_total_spent(self, obj):
        """Calculate total amount spent by customer across all orders"""
        from django.db.models import Sum
        total = obj.orders.aggregate(total=Sum('total_amount'))['total']
        return float(total) if total else 0.0
    
    def get_total_orders(self, obj):
        """Get total number of orders for this customer"""
        return obj.orders.count()
    
    def get_growth_percentage(self, obj):
        """
        Calculate growth percentage based on recent vs older orders
        Compares last 30 days spending vs previous 30 days
        Returns None if insufficient data
        """
        from django.utils import timezone
        from datetime import timedelta
        from django.db.models import Sum
        
        now = timezone.now()
        last_30_days = now - timedelta(days=30)
        previous_60_to_30_days = now - timedelta(days=60)
        
        # Get spending in last 30 days
        recent_spending = obj.orders.filter(
            order_date__gte=last_30_days
        ).aggregate(total=Sum('total_amount'))['total'] or 0
        
        # Get spending in previous 30 days (30-60 days ago)
        previous_spending = obj.orders.filter(
            order_date__gte=previous_60_to_30_days,
            order_date__lt=last_30_days
        ).aggregate(total=Sum('total_amount'))['total'] or 0
        
        # Calculate percentage change
        if previous_spending > 0:
            growth = ((recent_spending - previous_spending) / previous_spending) * 100
            return round(growth, 1)
        elif recent_spending > 0:
            return 100.0  # 100% growth if spending started in last 30 days
        else:
            return 0.0  # No growth if no spending in either period


class InventorySerializer(serializers.ModelSerializer):
    """Serializer for Inventory model"""
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = Inventory
        fields = ['inventory_id', 'product', 'product_name', 'stock_available']
        read_only_fields = ['inventory_id']


class ProductCatalogSerializer(serializers.ModelSerializer):
    """
    Enhanced serializer for Product Catalog page
    Matches the frontend data structure for seamless integration
    """
    # Map database fields to frontend expected fields
    id = serializers.IntegerField(source='product_id', read_only=True)
    variety = serializers.CharField(source='local_name')
    image = serializers.SerializerMethodField()
    inStock = serializers.SerializerMethodField()
    inSeasonNow = serializers.SerializerMethodField()
    stock_available = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id',               # Maps to product_id
            'name',             # English name
            'variety',          # Maps to local_name (Urdu/local)
            'price',            # Price per kg
            'image',            # Image path
            'category',         # vegetables/fruits/herbs
            'season',           # SUMMER/WINTER/ALL_YEAR
            'inStock',          # Computed from inventory
            'inSeasonNow',      # Computed based on current season
            'stock_available',  # Quantity available
            'discount',         # Discount percentage
            'slug',             # URL slug
        ]
        read_only_fields = ['id', 'slug']
    
    def get_image(self, obj):
        """Return the image path with static prefix"""
        if obj.image:
            return obj.image
        # Default image based on category
        return f'/static/images/{obj.category}/default.png'
    
    def get_inStock(self, obj):
        """Check if product is in stock"""
        try:
            return obj.inventory.stock_available > 0
        except Inventory.DoesNotExist:
            return False
    
    def get_inSeasonNow(self, obj):
        """
        Determine if product is in season now
        For demo: Summer = May-September, Winter = October-April
        """
        import datetime
        current_month = datetime.datetime.now().month
        
        # Summer months: 5-9 (May to September)
        is_summer = current_month in [5, 6, 7, 8, 9]
        
        if obj.season == 'ALL_YEAR':
            return True
        elif obj.season == 'SUMMER':
            return is_summer
        elif obj.season == 'WINTER':
            return not is_summer
        
        return False
    
    def get_stock_available(self, obj):
        """Get available stock from related inventory"""
        try:
            return obj.inventory.stock_available
        except Inventory.DoesNotExist:
            return 0
    
    def to_representation(self, instance):
        """
        Customize the output to match frontend structure
        Convert season choices to frontend format
        """
        data = super().to_representation(instance)
        
        # Convert season from SUMMER/WINTER/ALL_YEAR to summer/winter/year-round
        season_mapping = {
            'SUMMER': 'summer',
            'WINTER': 'winter',
            'ALL_YEAR': 'year-round'
        }
        data['season'] = season_mapping.get(data['season'], 'year-round')
        
        return data


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for Product model with inventory details"""
    inventory = InventorySerializer(read_only=True)
    stock_available = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['product_id', 'name', 'category', 'price', 'inventory', 'stock_available']
        read_only_fields = ['product_id']
    
    def get_stock_available(self, obj):
        """Get available stock from related inventory"""
        try:
            return obj.inventory.stock_available
        except Inventory.DoesNotExist:
            return 0


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product lists (without full inventory)"""
    stock_available = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['product_id', 'name', 'category', 'price', 'stock_available']
    
    def get_stock_available(self, obj):
        try:
            return obj.inventory.stock_available
        except Inventory.DoesNotExist:
            return 0


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for OrderItem model"""
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_category = serializers.CharField(source='product.category', read_only=True)
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['item_id', 'order', 'product', 'product_name', 'product_category', 
                  'quantity', 'price', 'subtotal']
        read_only_fields = ['item_id', 'subtotal']
    
    def get_subtotal(self, obj):
        """Calculate subtotal for this item"""
        return obj.quantity * obj.price
    
    def validate_quantity(self, value):
        """Ensure quantity is positive"""
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0.")
        return value


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order model with related items"""
    order_items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    items_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = ['order_id', 'customer', 'customer_name', 'customer_email', 
                  'order_date', 'status', 'total_amount', 'payment', 
                  'order_items', 'items_count']
        read_only_fields = ['order_id', 'order_date', 'total_amount']
    
    def get_items_count(self, obj):
        """Get total number of items in order"""
        return obj.order_items.count()


class OrderSummarySerializer(serializers.ModelSerializer):
    """
    Serializer for Order Summary in Account Overview
    Returns order with product names formatted for display
    """
    product_names = serializers.SerializerMethodField()
    order_date_formatted = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Order
        fields = ['order_id', 'status', 'status_display', 'total_amount', 
                  'order_date', 'order_date_formatted', 'product_names']
        read_only_fields = ['order_id', 'order_date', 'total_amount']
    
    def get_product_names(self, obj):
        """
        Get product names from order items
        Returns first 2 product names, then '+X more' if more exist
        """
        order_items = obj.order_items.select_related('product').all()
        
        if not order_items.exists():
            return "No items"
        
        # Get first 2 product names
        product_names = [item.product.name for item in order_items[:2]]
        
        # Add "+X more" if there are more than 2 items
        remaining = order_items.count() - 2
        if remaining > 0:
            product_names.append(f"+{remaining} more")
        
        return ", ".join(product_names)
    
    def get_order_date_formatted(self, obj):
        """
        Format order date as 'Nov 28, 2024'
        """
        return obj.order_date.strftime('%b %d, %Y')


class OrderItemDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for OrderItem with product details for Orders page
    Includes product name, image, quantity for display in order cards
    """
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.CharField(source='product.image', read_only=True)
    product_category = serializers.CharField(source='product.category', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['item_id', 'product', 'product_name', 'product_image', 
                  'product_category', 'quantity', 'price']
        read_only_fields = ['item_id']


class OrderDetailSerializer(serializers.ModelSerializer):
    """
    Comprehensive serializer for Order Details in Orders page
    Returns complete order information with all order items and formatted data
    Includes formatted order_id (ORD-2024-XXXX), formatted dates, status display,
    and nested order items with product details
    """
    order_id_formatted = serializers.SerializerMethodField()
    order_date_formatted = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    order_items = OrderItemDetailSerializer(many=True, read_only=True)
    items_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = ['order_id', 'order_id_formatted', 'status', 'status_display', 
                  'total_amount', 'order_date', 'order_date_formatted', 
                  'payment', 'order_items', 'items_count']
        read_only_fields = ['order_id', 'order_date', 'total_amount']
    
    def get_order_id_formatted(self, obj):
        """
        Format order ID as 'ORD-2024-XXXX'
        Example: order_id 1128 becomes 'ORD-2024-1128'
        """
        return f"ORD-2024-{obj.order_id}"
    
    def get_order_date_formatted(self, obj):
        """
        Format order date as 'PLACED ON NOV 28, 2024'
        Returns uppercase format for consistency with UI
        """
        return obj.order_date.strftime('%b %d, %Y').upper()
    
    def get_items_count(self, obj):
        """
        Get total number of items in this order
        """
        return obj.order_items.count()


class OrderCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating orders with items"""
    items = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        help_text="List of items: [{'product_id': 1, 'quantity': 2, 'price': 10.50}, ...]"
    )
    
    class Meta:
        model = Order
        fields = ['customer', 'status', 'payment', 'items']
    
    def validate_items(self, value):
        """Validate order items"""
        if not value:
            raise serializers.ValidationError("Order must contain at least one item.")
        
        for item in value:
            if 'product_id' not in item or 'quantity' not in item or 'price' not in item:
                raise serializers.ValidationError(
                    "Each item must have 'product_id', 'quantity', and 'price'."
                )
            
            # Check if product exists
            if not Product.objects.filter(product_id=item['product_id']).exists():
                raise serializers.ValidationError(
                    f"Product with ID {item['product_id']} does not exist."
                )
            
            # Check stock availability
            try:
                inventory = Inventory.objects.get(product_id=item['product_id'])
                if inventory.stock_available < item['quantity']:
                    product = Product.objects.get(product_id=item['product_id'])
                    raise serializers.ValidationError(
                        f"Insufficient stock for {product.name}. Available: {inventory.stock_available}"
                    )
            except Inventory.DoesNotExist:
                raise serializers.ValidationError(
                    f"No inventory found for product ID {item['product_id']}."
                )
        
        return value
    
    def create(self, validated_data):
        """Create order with items and update inventory"""
        items_data = validated_data.pop('items')
        
        # Create the order
        order = Order.objects.create(**validated_data)
        
        # Calculate total amount and create order items
        total = 0
        for item_data in items_data:
            order_item = OrderItem.objects.create(
                order=order,
                product_id=item_data['product_id'],
                quantity=item_data['quantity'],
                price=item_data['price']
            )
            total += order_item.quantity * order_item.price
            
            # Update inventory
            inventory = Inventory.objects.get(product_id=item_data['product_id'])
            inventory.stock_available -= item_data['quantity']
            inventory.save()
        
        # Update order total
        order.total_amount = total
        order.save()
        
        return order


class CartSerializer(serializers.ModelSerializer):
    """Serializer for Cart model"""
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_category = serializers.CharField(source='product.category', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    product_image = serializers.CharField(source='product.image', read_only=True)
    stock_available = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = ['cart_id', 'customer', 'product', 'product_name', 
                  'product_category', 'product_price', 'product_image', 'quantity', 'stock_available']
        read_only_fields = ['cart_id']
    
    def get_stock_available(self, obj):
        """Get available stock for the product"""
        try:
            return obj.product.inventory.stock_available
        except Inventory.DoesNotExist:
            return 0
    
    def validate(self, data):
        """Validate cart item"""
        product = data.get('product')
        quantity = data.get('quantity', 1)
        
        # Check if product has inventory
        try:
            inventory = product.inventory
            if inventory.stock_available < quantity:
                raise serializers.ValidationError(
                    f"Insufficient stock. Available: {inventory.stock_available}"
                )
        except Inventory.DoesNotExist:
            raise serializers.ValidationError(f"Product {product.name} is out of stock.")
        
        return data
    
    def validate_quantity(self, value):
        """Ensure quantity is positive"""
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0.")
        return value


class CartItemCatalogSerializer(serializers.Serializer):
    """
    Serializer for catalog page cart items (matches frontend structure)
    Used for sending cart data in the format expected by script.js
    """
    id = serializers.IntegerField()
    name = serializers.CharField()
    variety = serializers.CharField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    image = serializers.CharField()
    category = serializers.CharField()
    season = serializers.CharField()
    inStock = serializers.BooleanField()
    inSeasonNow = serializers.BooleanField()
    quantity = serializers.IntegerField()


class CartSummarySerializer(serializers.Serializer):
    """Serializer for cart summary/checkout"""
    items = CartSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    estimated_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)


# ==================== CHECKOUT SERIALIZERS ====================

class CheckoutCartItemSerializer(serializers.Serializer):
    """
    Serializer for checkout cart items - matches the exact format expected by checkout.js
    This serializer transforms Cart model data into the format used by the frontend
    Ensures image paths are correctly formatted for display
    """
    id = serializers.IntegerField(source='product.product_id')
    name = serializers.CharField(source='product.name')
    price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2)
    quantity = serializers.IntegerField()
    image = serializers.SerializerMethodField()  # Use SerializerMethodField for proper image handling
    category = serializers.CharField(source='product.category')
    
    def get_image(self, obj):
        """
        Return properly formatted image path for checkout display
        Handles both absolute paths (starting with /) and relative paths
        Returns fallback image if product has no image
        """
        product = obj.product
        
        # Check if product has an image
        if product.image:
            # If image path already starts with /, return as is
            if product.image.startswith('/'):
                return product.image
            # If image path starts with 'static/', add leading /
            elif product.image.startswith('static/'):
                return f"/{product.image}"
            # If image path is relative (e.g., 'images/vegetables/tomato.png')
            else:
                # Assume it's meant to be under static
                return f"/static/{product.image}"
        else:
            # Return default fallback image based on category
            return f"/static/images/{product.category}/default.png"


class ShippingAddressSerializer(serializers.Serializer):
    """
    Serializer for shipping address information
    Matches the shipping form in checkout.js
    """
    fullName = serializers.CharField(max_length=200, required=True)
    email = serializers.EmailField(required=True)
    phone = serializers.CharField(max_length=20, required=True)
    address = serializers.CharField(max_length=500, required=True)
    city = serializers.CharField(max_length=100, required=True)
    zipCode = serializers.CharField(max_length=20, required=True)
    
    def validate_phone(self, value):
        """Validate phone number format"""
        import re
        # Remove all non-digit characters
        digits = re.sub(r'\D', '', value)
        if len(digits) < 10:
            raise serializers.ValidationError("Phone number must be at least 10 digits")
        return value
    
    def validate_zipCode(self, value):
        """Validate zip code"""
        if not value.strip():
            raise serializers.ValidationError("Zip code is required")
        return value


class BillingInfoSerializer(serializers.Serializer):
    """
    Serializer for billing/payment information
    Matches the billing form in checkout.js
    Note: In production, never store full card details. Use payment gateway tokens.
    """
    cardName = serializers.CharField(max_length=200, required=True)
    cardNumber = serializers.CharField(max_length=19, required=True, write_only=True)
    cardNumberLast4 = serializers.CharField(max_length=4, read_only=True)  # Only store last 4 digits
    expiryDate = serializers.CharField(max_length=5, required=True)
    cvv = serializers.CharField(max_length=4, required=True, write_only=True)  # Never store CVV
    billingAddress = serializers.CharField(max_length=500, required=True)
    billingCity = serializers.CharField(max_length=100, required=True)
    billingZip = serializers.CharField(max_length=20, required=True)
    
    def validate_cardNumber(self, value):
        """Basic card number validation"""
        import re
        # Remove spaces and dashes
        card_digits = re.sub(r'[\s-]', '', value)
        
        # Check if all characters are digits
        if not card_digits.isdigit():
            raise serializers.ValidationError("Card number must contain only digits")
        
        # Check length (most cards are 13-19 digits)
        if len(card_digits) < 13 or len(card_digits) > 19:
            raise serializers.ValidationError("Card number must be between 13 and 19 digits")
        
        return card_digits
    
    def validate_expiryDate(self, value):
        """Validate expiry date format (MM/YY)"""
        import re
        if not re.match(r'^\d{2}/\d{2}$', value):
            raise serializers.ValidationError("Expiry date must be in MM/YY format")
        
        month, year = value.split('/')
        if int(month) < 1 or int(month) > 12:
            raise serializers.ValidationError("Invalid month in expiry date")
        
        return value
    
    def validate_cvv(self, value):
        """Validate CVV"""
        if not value.isdigit() or len(value) < 3 or len(value) > 4:
            raise serializers.ValidationError("CVV must be 3 or 4 digits")
        return value


class CheckoutOrderCreateSerializer(serializers.Serializer):
    """
    Comprehensive serializer for creating orders from checkout
    Accepts cart items, shipping address, and billing info
    Creates Customer (if needed) and Order with OrderItems
    """
    # Customer/Shipping information
    shipping = ShippingAddressSerializer(required=True)
    
    # Billing/Payment information
    billing = BillingInfoSerializer(required=True)
    
    # Cart items
    items = serializers.ListField(
        child=serializers.DictField(),
        required=True,
        min_length=1,
        help_text="Cart items: [{'product_id': 1, 'quantity': 2}, ...]"
    )
    
    # Optional customer_id if user is already registered
    customer_id = serializers.IntegerField(required=False, allow_null=True)
    
    def validate_items(self, value):
        """Validate cart items"""
        if not value:
            raise serializers.ValidationError("Order must contain at least one item")
        
        for item in value:
            if 'product_id' not in item or 'quantity' not in item:
                raise serializers.ValidationError(
                    "Each item must have 'product_id' and 'quantity'"
                )
            
            # Validate product exists and is active
            try:
                product = Product.objects.get(product_id=item['product_id'], is_active=True)
            except Product.DoesNotExist:
                raise serializers.ValidationError(
                    f"Product with ID {item['product_id']} not found or inactive"
                )
            
            # Check stock availability
            try:
                inventory = product.inventory
                if inventory.stock_available < item['quantity']:
                    raise serializers.ValidationError(
                        f"Insufficient stock for {product.name}. "
                        f"Available: {inventory.stock_available}, Requested: {item['quantity']}"
                    )
            except Inventory.DoesNotExist:
                raise serializers.ValidationError(
                    f"No inventory found for {product.name}"
                )
            
            # Validate quantity is positive
            if item['quantity'] <= 0:
                raise serializers.ValidationError("Item quantity must be greater than 0")
        
        return value
    
    def validate(self, data):
        """Cross-field validation"""
        # Ensure we have either customer_id or shipping email
        customer_id = data.get('customer_id')
        shipping_email = data.get('shipping', {}).get('email')
        
        if not customer_id and not shipping_email:
            raise serializers.ValidationError(
                "Either customer_id or shipping email is required"
            )
        
        return data
    
    def create(self, validated_data):
        """
        Create the complete order with customer, order items, and update inventory
        Returns the created order with all related data
        """
        from django.db import transaction
        
        shipping_data = validated_data.pop('shipping')
        billing_data = validated_data.pop('billing')
        items_data = validated_data.pop('items')
        customer_id = validated_data.pop('customer_id', None)
        
        with transaction.atomic():
            # Step 1: Get or create customer
            if customer_id:
                try:
                    customer = Customer.objects.get(customer_id=customer_id)
                    # Update customer info from shipping data
                    customer.name = shipping_data['fullName']
                    customer.email = shipping_data['email']
                    customer.phone = shipping_data['phone']
                    customer.save()
                except Customer.DoesNotExist:
                    customer_id = None
            
            if not customer_id:
                # Create new customer from shipping data
                customer = Customer.objects.create(
                    name=shipping_data['fullName'],
                    email=shipping_data['email'],
                    phone=shipping_data['phone']
                )
            
            # Step 2: Create the order
            order = Order.objects.create(
                customer=customer,
                status='PENDING',
                payment=f"Card ending in {billing_data['cardNumber'][-4:]}"  # Store only last 4 digits
            )
            
            # Step 3: Create order items and calculate total
            total_amount = 0
            for item_data in items_data:
                product = Product.objects.get(product_id=item_data['product_id'])
                
                # Create order item
                order_item = OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=item_data['quantity'],
                    price=product.price  # Use current product price
                )
                
                # Add to total
                total_amount += order_item.quantity * order_item.price
                
                # Update inventory
                inventory = product.inventory
                inventory.stock_available -= item_data['quantity']
                inventory.save()
            
            # Step 4: Update order total
            order.total_amount = total_amount
            order.save()
            
            # Step 5: Clear customer's cart if customer_id exists
            if customer_id:
                Cart.objects.filter(customer=customer).delete()
            
            return order


class OrderConfirmationSerializer(serializers.ModelSerializer):
    """
    Serializer for order confirmation page
    Returns order details in format expected by checkout.js confirmation
    """
    items = serializers.SerializerMethodField()
    total = serializers.DecimalField(source='total_amount', max_digits=10, decimal_places=2)
    shipping = serializers.SerializerMethodField()
    orderNumber = serializers.CharField(source='order_id')
    orderDate = serializers.DateTimeField(source='order_date', format='%B %d, %Y at %I:%M %p')
    status = serializers.CharField()
    
    class Meta:
        model = Order
        fields = ['orderNumber', 'orderDate', 'status', 'items', 'total', 'shipping']
    
    def get_items(self, obj):
        """Get order items in checkout format"""
        items = []
        for order_item in obj.order_items.all():
            items.append({
                'name': order_item.product.name,
                'quantity': order_item.quantity,
                'price': float(order_item.price),
                'subtotal': float(order_item.quantity * order_item.price),
                'image': order_item.product.image
            })
        return items
    
    def get_shipping(self, obj):
        """Get shipping information from customer"""
        customer = obj.customer
        return {
            'fullName': customer.name,
            'email': customer.email,
            'phone': customer.phone
        }


class AddressSerializer(serializers.ModelSerializer):
    """
    Serializer for Address model
    Handles customer addresses with validation for phone and postal code
    """
    label_display = serializers.CharField(source='get_label_display', read_only=True)
    
    class Meta:
        model = Address
        fields = [
            'address_id', 'customer', 'label', 'label_display',
            'address_line', 'city', 'postal_code', 'phone',
            'is_default', 'created_at', 'updated_at'
        ]
        read_only_fields = ['address_id', 'created_at', 'updated_at']
    
    def validate_phone(self, value):
        """Validate phone number format"""
        import re
        # Remove spaces and dashes for validation
        cleaned = re.sub(r'[\s\-\(\)]', '', value)
        
        # Check if it contains only digits and + (for country code)
        if not re.match(r'^\+?\d{10,15}$', cleaned):
            raise serializers.ValidationError(
                "Invalid phone number format. Use format: +92 (300) 1234567 or 03001234567"
            )
        return value
    
    def validate_postal_code(self, value):
        """Validate postal code format (Pakistan postal codes are 5 digits)"""
        import re
        cleaned = re.sub(r'\s', '', value)
        
        if not re.match(r'^\d{5}$', cleaned):
            raise serializers.ValidationError(
                "Invalid postal code format. Pakistan postal codes are 5 digits (e.g., 74000)"
            )
        return value
    
    def validate(self, data):
        """Ensure required fields are present"""
        required_fields = ['address_line', 'city', 'postal_code', 'phone']
        
        for field in required_fields:
            if field in data and not data[field]:
                raise serializers.ValidationError({
                    field: f"{field.replace('_', ' ').title()} is required."
                })
        
        return data

