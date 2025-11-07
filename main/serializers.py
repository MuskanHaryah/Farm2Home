from rest_framework import serializers
from .models import Customer, Product, Inventory, Order, OrderItem, Cart


class CustomerSerializer(serializers.ModelSerializer):
    """Serializer for Customer model"""
    
    class Meta:
        model = Customer
        fields = ['customer_id', 'name', 'email', 'phone', 'address']
        read_only_fields = ['customer_id']
    
    def validate_email(self, value):
        """Ensure email is unique (case-insensitive)"""
        if Customer.objects.filter(email__iexact=value).exists():
            if not self.instance or self.instance.email.lower() != value.lower():
                raise serializers.ValidationError("A customer with this email already exists.")
        return value.lower()


class InventorySerializer(serializers.ModelSerializer):
    """Serializer for Inventory model"""
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = Inventory
        fields = ['inventory_id', 'product', 'product_name', 'stock_available']
        read_only_fields = ['inventory_id']


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
    stock_available = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = ['cart_id', 'customer', 'product', 'product_name', 
                  'product_category', 'product_price', 'quantity', 'stock_available']
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


class CartSummarySerializer(serializers.Serializer):
    """Serializer for cart summary/checkout"""
    items = CartSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    estimated_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
