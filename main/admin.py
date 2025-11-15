from django.contrib import admin
from .models import Customer, Product, Inventory, Order, OrderItem, Cart, Address


# =====================================================
# CUSTOMER ADMIN
# =====================================================
@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    """Enhanced admin interface for Customer model"""
    
    # List display columns
    list_display = ['customer_id', 'name', 'email', 'phone', 'order_count', 'address_count']
    
    # Search functionality
    search_fields = ['name', 'email', 'phone']
    
    # Filters in right sidebar
    list_filter = ['name']
    
    # Fields to display when viewing/editing
    fields = ['name', 'email', 'phone']
    
    # Read-only fields
    readonly_fields = ['customer_id']
    
    # Number of items per page
    list_per_page = 25
    
    # Ordering
    ordering = ['-customer_id']
    
    def order_count(self, obj):
        """Display number of orders for this customer"""
        return obj.orders.count()
    order_count.short_description = 'Total Orders'
    
    def address_count(self, obj):
        """Display number of addresses for this customer"""
        count = obj.addresses.count()
        if count == 0:
            return '❌ No addresses'
        elif count == 1:
            return '✓ 1 address'
        else:
            return f'✓ {count} addresses'
    address_count.short_description = 'Addresses'


# =====================================================
# PRODUCT ADMIN
# =====================================================
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Enhanced admin interface for Product model"""
    
    # List display columns
    list_display = [
        'product_id', 
        'name', 
        'local_name',
        'slug',
        'category', 
        'season',
        'price',
        'discount',
        'stock_status',
        'is_active',
        'created_at'
    ]    # Search functionality - searches in multiple fields
    search_fields = ['name', 'local_name', 'slug', 'category']
    
    # Filters in right sidebar
    list_filter = [
        'is_active',
        'category', 
        'season',
        'created_at',
        'updated_at'
    ]
    
    # Fields that are clickable to edit
    list_display_links = ['product_id', 'name']
    
    # Editable fields directly in list view
    list_editable = ['price', 'discount', 'is_active']
    
    # Prepopulated fields (slug auto-fills from name)
    prepopulated_fields = {'slug': ('name',)}
    
    # Fieldsets for organized form layout
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'local_name', 'slug', 'category')
        }),
        ('Pricing & Availability', {
            'fields': ('price', 'discount', 'season', 'is_active')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)  # Collapsible section
        }),
    )
    
    # Read-only fields
    readonly_fields = ['product_id', 'created_at', 'updated_at']
    
    # Number of items per page
    list_per_page = 30
    
    # Default ordering
    ordering = ['category', 'name']
    
    # Date hierarchy navigation
    date_hierarchy = 'created_at'
    
    # Custom actions
    actions = ['activate_products', 'deactivate_products', 'set_summer_season', 'set_winter_season']
    
    def stock_status(self, obj):
        """Display stock availability"""
        try:
            stock = obj.inventory.stock_available
            if stock > 50:
                return f'✅ {stock} (In Stock)'
            elif stock > 0:
                return f'⚠️ {stock} (Low Stock)'
            else:
                return '❌ Out of Stock'
        except Inventory.DoesNotExist:
            return '❓ No Inventory'
    stock_status.short_description = 'Stock Status'
    
    # Custom admin actions
    def activate_products(self, request, queryset):
        """Activate selected products"""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} product(s) activated successfully.')
    activate_products.short_description = 'Activate selected products'
    
    def deactivate_products(self, request, queryset):
        """Deactivate selected products"""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} product(s) deactivated successfully.')
    deactivate_products.short_description = 'Deactivate selected products'
    
    def set_summer_season(self, request, queryset):
        """Set season to summer for selected products"""
        updated = queryset.update(season='SUMMER')
        self.message_user(request, f'{updated} product(s) set to Summer season.')
    set_summer_season.short_description = 'Set season to Summer'
    
    def set_winter_season(self, request, queryset):
        """Set season to winter for selected products"""
        updated = queryset.update(season='WINTER')
        self.message_user(request, f'{updated} product(s) set to Winter season.')
    set_winter_season.short_description = 'Set season to Winter'


# =====================================================
# INVENTORY ADMIN
# =====================================================
@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    """Enhanced admin interface for Inventory model"""
    
    # List display columns
    list_display = [
        'inventory_id', 
        'product_name', 
        'product_category',
        'stock_available', 
        'stock_status_badge'
    ]
    
    # Search functionality
    search_fields = ['product__name', 'product__local_name']
    
    # Filters
    list_filter = ['product__category', 'product__season']
    
    # Editable fields in list view
    list_editable = ['stock_available']
    
    # Fields to display
    fields = ['product', 'stock_available']
    
    # Read-only fields
    readonly_fields = ['inventory_id']
    
    # Number of items per page
    list_per_page = 30
    
    # Ordering
    ordering = ['product__name']
    
    # Custom actions
    actions = ['restock_items', 'clear_stock']
    
    def product_name(self, obj):
        """Display product name"""
        return obj.product.name
    product_name.short_description = 'Product'
    product_name.admin_order_field = 'product__name'  # Allows sorting
    
    def product_category(self, obj):
        """Display product category"""
        return obj.product.category
    product_category.short_description = 'Category'
    product_category.admin_order_field = 'product__category'
    
    def stock_status_badge(self, obj):
        """Visual stock status indicator"""
        if obj.stock_available > 50:
            return '🟢 Healthy'
        elif obj.stock_available > 10:
            return '🟡 Low'
        elif obj.stock_available > 0:
            return '🟠 Critical'
        else:
            return '🔴 Out'
    stock_status_badge.short_description = 'Status'
    
    # Custom actions
    def restock_items(self, request, queryset):
        """Add 50 units to selected items"""
        for item in queryset:
            item.stock_available += 50
            item.save()
        self.message_user(request, f'{queryset.count()} item(s) restocked with 50 units.')
    restock_items.short_description = 'Restock (+50 units)'
    
    def clear_stock(self, request, queryset):
        """Set stock to 0 for selected items"""
        updated = queryset.update(stock_available=0)
        self.message_user(request, f'{updated} item(s) stock cleared.')
    clear_stock.short_description = 'Clear stock (set to 0)'


# =====================================================
# ORDER ITEM INLINE (for Order Admin)
# =====================================================
class OrderItemInline(admin.TabularInline):
    """Inline display of order items within order"""
    model = OrderItem
    extra = 0  # Don't show empty forms
    fields = ['product', 'quantity', 'price', 'subtotal']
    readonly_fields = ['subtotal']
    
    def subtotal(self, obj):
        """Calculate subtotal for this order item"""
        if obj.price is None or obj.quantity is None:
            return 'N/A'
        return f'Rs. {obj.quantity * obj.price:.2f}'
    subtotal.short_description = 'Subtotal'


# =====================================================
# ORDER ADMIN
# =====================================================
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Enhanced admin interface for Order model"""
    
    # List display columns
    list_display = [
        'order_id', 
        'customer_name',
        'customer_email',
        'order_date', 
        'status', 
        'total_amount',
        'item_count',
        'payment'
    ]
    
    # Search functionality
    search_fields = [
        'order_id', 
        'customer__name', 
        'customer__email',
        'payment'
    ]
    
    # Filters
    list_filter = [
        'status', 
        'order_date',
        'payment'
    ]
    
    # Fields that are clickable
    list_display_links = ['order_id', 'customer_name']
    
    # Editable fields in list view
    list_editable = ['status']
    
    # Inline display of order items
    inlines = [OrderItemInline]
    
    # Fields organization
    fieldsets = (
        ('Order Information', {
            'fields': ('customer', 'status', 'payment')
        }),
        ('Financial Details', {
            'fields': ('total_amount',)
        }),
        ('Timestamps', {
            'fields': ('order_date',),
            'classes': ('collapse',)
        }),
    )
    
    # Read-only fields
    readonly_fields = ['order_id', 'order_date', 'total_amount']
    
    # Number of items per page
    list_per_page = 25
    
    # Default ordering (newest first)
    ordering = ['-order_date']
    
    # Date hierarchy
    date_hierarchy = 'order_date'
    
    # Custom actions
    actions = ['mark_confirmed', 'mark_shipped', 'mark_delivered', 'mark_cancelled']
    
    def customer_name(self, obj):
        """Display customer name"""
        return obj.customer.name
    customer_name.short_description = 'Customer'
    customer_name.admin_order_field = 'customer__name'
    
    def customer_email(self, obj):
        """Display customer email"""
        return obj.customer.email
    customer_email.short_description = 'Email'
    customer_email.admin_order_field = 'customer__email'
    
    def item_count(self, obj):
        """Display number of items in order"""
        return obj.order_items.count()
    item_count.short_description = 'Items'
    
    # Custom actions for order status
    def mark_confirmed(self, request, queryset):
        """Mark orders as confirmed"""
        updated = queryset.update(status='CONFIRMED')
        self.message_user(request, f'{updated} order(s) marked as CONFIRMED.')
    mark_confirmed.short_description = 'Mark as CONFIRMED'
    
    def mark_shipped(self, request, queryset):
        """Mark orders as shipped"""
        updated = queryset.update(status='SHIPPED')
        self.message_user(request, f'{updated} order(s) marked as SHIPPED.')
    mark_shipped.short_description = 'Mark as SHIPPED'
    
    def mark_delivered(self, request, queryset):
        """Mark orders as delivered"""
        updated = queryset.update(status='DELIVERED')
        self.message_user(request, f'{updated} order(s) marked as DELIVERED.')
    mark_delivered.short_description = 'Mark as DELIVERED'
    
    def mark_cancelled(self, request, queryset):
        """Mark orders as cancelled"""
        updated = queryset.update(status='CANCELLED')
        self.message_user(request, f'{updated} order(s) marked as CANCELLED.')
    mark_cancelled.short_description = 'Mark as CANCELLED'


# =====================================================
# ORDER ITEM ADMIN
# =====================================================
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    """Enhanced admin interface for OrderItem model"""
    
    # List display columns
    list_display = [
        'item_id', 
        'order_id_link',
        'product_name',
        'quantity', 
        'price',
        'subtotal_display'
    ]
    
    # Search functionality
    search_fields = [
        'order__order_id',
        'product__name',
        'product__local_name'
    ]
    
    # Filters
    list_filter = [
        'product__category',
        'order__status',
        'order__order_date'
    ]
    
    # Fields
    fields = ['order', 'product', 'quantity', 'price']
    
    # Read-only fields
    readonly_fields = ['item_id']
    
    # Number of items per page
    list_per_page = 30
    
    # Ordering
    ordering = ['-order__order_date']
    
    def order_id_link(self, obj):
        """Display order ID"""
        return f'Order #{obj.order.order_id}'
    order_id_link.short_description = 'Order'
    order_id_link.admin_order_field = 'order__order_id'
    
    def product_name(self, obj):
        """Display product name"""
        return obj.product.name
    product_name.short_description = 'Product'
    product_name.admin_order_field = 'product__name'
    
    def subtotal_display(self, obj):
        """Display calculated subtotal"""
        return f'Rs. {obj.quantity * obj.price:.2f}'
    subtotal_display.short_description = 'Subtotal'


# =====================================================
# CART ADMIN
# =====================================================
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    """Enhanced admin interface for Cart model"""
    
    # List display columns
    list_display = [
        'cart_id',
        'customer_name',
        'customer_email',
        'product_name',
        'quantity',
        'item_price',
        'subtotal_display'
    ]
    
    # Search functionality
    search_fields = [
        'customer__name',
        'customer__email',
        'product__name',
        'product__local_name'
    ]
    
    # Filters
    list_filter = [
        'product__category',
        'product__season',
        'customer__name'
    ]
    
    # Editable fields in list view
    list_editable = ['quantity']
    
    # Fields
    fields = ['customer', 'product', 'quantity']
    
    # Read-only fields
    readonly_fields = ['cart_id']
    
    # Number of items per page
    list_per_page = 30
    
    # Ordering
    ordering = ['customer__name', 'product__name']
    
    # Custom actions
    actions = ['clear_carts', 'increase_quantity']
    
    def customer_name(self, obj):
        """Display customer name"""
        return obj.customer.name
    customer_name.short_description = 'Customer'
    customer_name.admin_order_field = 'customer__name'
    
    def customer_email(self, obj):
        """Display customer email"""
        return obj.customer.email
    customer_email.short_description = 'Email'
    customer_email.admin_order_field = 'customer__email'
    
    def product_name(self, obj):
        """Display product name"""
        return obj.product.name
    product_name.short_description = 'Product'
    product_name.admin_order_field = 'product__name'
    
    def item_price(self, obj):
        """Display product price"""
        return f'Rs. {obj.product.price:.2f}/kg'
    item_price.short_description = 'Price'
    
    def subtotal_display(self, obj):
        """Display calculated subtotal"""
        return f'Rs. {obj.quantity * obj.product.price:.2f}'
    subtotal_display.short_description = 'Subtotal'
    
    # Custom actions
    def clear_carts(self, request, queryset):
        """Remove selected cart items"""
        count = queryset.count()
        queryset.delete()
        self.message_user(request, f'{count} cart item(s) removed.')
    clear_carts.short_description = 'Remove selected cart items'
    
    def increase_quantity(self, request, queryset):
        """Increase quantity by 1 for selected items"""
        for item in queryset:
            item.quantity += 1
            item.save()
        self.message_user(request, f'{queryset.count()} item(s) quantity increased.')
    increase_quantity.short_description = 'Increase quantity (+1)'


# =====================================================
# ADDRESS ADMIN
# =====================================================
@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    """Enhanced admin interface for Address model"""
    
    # List display columns
    list_display = [
        'address_id',
        'customer_name',
        'customer_email',
        'label',
        'city',
        'postal_code',
        'phone_formatted',
        'is_default',
        'created_at',
        'updated_at'
    ]
    
    # Search functionality - search by customer, city, phone
    search_fields = [
        'customer__name',
        'customer__email',
        'address_line',
        'city',
        'postal_code',
        'phone'
    ]
    
    # Filters in right sidebar
    list_filter = [
        'label',           # Filter by HOME/WORK/OTHER
        'is_default',      # Filter by default status
        'city',            # Filter by city
        'created_at',      # Filter by creation date
        'updated_at'       # Filter by update date
    ]
    
    # Fields that are clickable to edit
    list_display_links = ['address_id', 'customer_name']
    
    # Editable fields directly in list view (cannot use when field is in list_display_links)
    # list_editable = ['label', 'is_default']  # Commented out - use detail page to edit
    
    # Fieldsets for organized form layout
    fieldsets = (
        ('Customer Information', {
            'fields': ('customer',),
            'description': 'Select the customer for this address'
        }),
        ('Address Details', {
            'fields': ('label', 'address_line', 'city', 'postal_code'),
            'description': 'Enter the complete address details'
        }),
        ('Contact Information', {
            'fields': ('phone',)
        }),
        ('Default Settings', {
            'fields': ('is_default',),
            'description': 'Set as default delivery address for this customer'
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),  # Collapsible section
            'description': 'Timestamp information'
        }),
    )
    
    # Read-only fields
    readonly_fields = ['address_id', 'created_at', 'updated_at']
    
    # Number of items per page
    list_per_page = 25
    
    # Default ordering (default addresses first, then newest)
    ordering = ['-is_default', '-created_at']
    
    # Date hierarchy navigation
    date_hierarchy = 'created_at'
    
    # Custom actions
    actions = [
        'set_as_default',
        'unset_default',
        'set_label_home',
        'set_label_work',
        'set_label_other'
    ]
    
    # Enable select across all pages
    actions_selection_counter = True
    
    def customer_name(self, obj):
        """Display customer name with link"""
        return obj.customer.name
    customer_name.short_description = 'Customer'
    customer_name.admin_order_field = 'customer__name'  # Allows column sorting
    
    def customer_email(self, obj):
        """Display customer email"""
        return obj.customer.email
    customer_email.short_description = 'Email'
    customer_email.admin_order_field = 'customer__email'
    
    def label_badge(self, obj):
        """Display label with icon badge"""
        icons = {
            'HOME': '🏠',
            'WORK': '💼',
            'OTHER': '📍'
        }
        icon = icons.get(obj.label, '📍')
        return f'{icon} {obj.get_label_display()}'
    label_badge.short_description = 'Type'
    label_badge.admin_order_field = 'label'
    
    def default_badge(self, obj):
        """Display default status with badge"""
        if obj.is_default:
            return '⭐ Default'
        return '—'
    default_badge.short_description = 'Status'
    default_badge.admin_order_field = 'is_default'
    
    def phone_formatted(self, obj):
        """Display formatted phone number"""
        phone = obj.phone
        # Format: 0300-1234567 or as-is if already formatted
        if phone and len(phone) >= 10:
            if not '-' in phone:
                return f'{phone[:4]}-{phone[4:]}'
        return phone
    phone_formatted.short_description = 'Phone'
    phone_formatted.admin_order_field = 'phone'
    
    # Custom admin actions
    def set_as_default(self, request, queryset):
        """Set selected addresses as default (only one per customer)"""
        updated = 0
        customers_updated = set()
        
        for address in queryset:
            # First, remove default from all addresses of this customer
            Address.objects.filter(
                customer=address.customer,
                is_default=True
            ).update(is_default=False)
            
            # Then set this address as default
            address.is_default = True
            address.save()
            
            updated += 1
            customers_updated.add(address.customer.name)
        
        customers_list = ', '.join(customers_updated)
        self.message_user(
            request,
            f'{updated} address(es) set as default for: {customers_list}'
        )
    set_as_default.short_description = '⭐ Set as Default Address'
    
    def unset_default(self, request, queryset):
        """Remove default status from selected addresses"""
        updated = queryset.update(is_default=False)
        self.message_user(
            request,
            f'{updated} address(es) removed from default status.'
        )
    unset_default.short_description = '✖️ Remove Default Status'
    
    def set_label_home(self, request, queryset):
        """Change label to HOME for selected addresses"""
        updated = queryset.update(label='HOME')
        self.message_user(
            request,
            f'{updated} address(es) changed to HOME label.'
        )
    set_label_home.short_description = '🏠 Set Label to HOME'
    
    def set_label_work(self, request, queryset):
        """Change label to WORK for selected addresses"""
        updated = queryset.update(label='WORK')
        self.message_user(
            request,
            f'{updated} address(es) changed to WORK label.'
        )
    set_label_work.short_description = '💼 Set Label to WORK'
    
    def set_label_other(self, request, queryset):
        """Change label to OTHER for selected addresses"""
        updated = queryset.update(label='OTHER')
        self.message_user(
            request,
            f'{updated} address(es) changed to OTHER label.'
        )
    set_label_other.short_description = '📍 Set Label to OTHER'
    
    # Override get_queryset to optimize database queries
    def get_queryset(self, request):
        """Optimize query with select_related to reduce database hits"""
        queryset = super().get_queryset(request)
        return queryset.select_related('customer')
    
    # Custom list filters
    class Meta:
        verbose_name = 'Delivery Address'
        verbose_name_plural = 'Delivery Addresses'


# =====================================================
# ADMIN SITE CUSTOMIZATION
# =====================================================
admin.site.site_header = "Farm2Home Administration"
admin.site.site_title = "Farm2Home Admin"
admin.site.index_title = "Welcome to Farm2Home Admin Portal"
