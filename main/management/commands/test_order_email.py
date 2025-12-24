"""
Django management command to test order confirmation email
Run: python manage.py test_order_email
"""

from django.core.management.base import BaseCommand
from main.models import Customer, Product, Order, OrderItem
from main.utils import send_order_confirmation_email
from decimal import Decimal


class Command(BaseCommand):
    help = 'Test the order confirmation email system'

    def handle(self, *args, **options):
        self.stdout.write("=" * 70)
        self.stdout.write(self.style.SUCCESS("🧪 TESTING ORDER CONFIRMATION EMAIL"))
        self.stdout.write("=" * 70)
        
        try:
            # Get or create a test customer
            customer, created = Customer.objects.get_or_create(
                email='test@farm2home.com',
                defaults={
                    'name': 'Test Customer',
                    'phone': '+92 (300) 123-4567',
                    'password': 'test123'
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f"✅ Created test customer: {customer.name}"))
            else:
                self.stdout.write(self.style.SUCCESS(f"✅ Using existing customer: {customer.name}"))
            
            # Get some products for the order
            products = Product.objects.filter(is_active=True)[:3]
            
            if not products:
                self.stdout.write(self.style.ERROR("❌ No products found in database. Please add products first."))
                return
            
            self.stdout.write(self.style.SUCCESS(f"✅ Found {len(products)} products for order"))
            
            # Create a test order
            order = Order.objects.create(
                customer=customer,
                status='PENDING',
                payment='Card ending in 1234',
                total_amount=Decimal('0.00')
            )
            
            self.stdout.write(self.style.SUCCESS(f"✅ Created order #{order.order_id}"))
            
            # Add order items
            total = Decimal('0.00')
            for i, product in enumerate(products, 1):
                quantity = i  # 1, 2, 3
                price = product.price
                
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=quantity,
                    price=price
                )
                
                total += quantity * price
                self.stdout.write(f"  - Added {quantity}x {product.name} @ Rs. {price}")
            
            # Update order total
            order.total_amount = total
            order.save()
            
            # Add shipping info to order (simulating checkout process)
            order.shipping_info = {
                'name': 'Test Customer',
                'address': '123 Farm Road, Green Valley',
                'city': 'Lahore',
                'zip': '54000',
                'phone': '+92 (300) 123-4567',
            }
            
            self.stdout.write(self.style.SUCCESS(f"✅ Order total: Rs. {total}"))
            self.stdout.write(self.style.SUCCESS(f"✅ Added shipping information"))
            
            # Send the email
            self.stdout.write("\n📧 Sending order confirmation email...")
            self.stdout.write("-" * 70)
            
            success = send_order_confirmation_email(order)
            
            if success:
                self.stdout.write("-" * 70)
                self.stdout.write(self.style.SUCCESS("✅ Order confirmation email sent successfully!"))
                self.stdout.write(f"\n📧 Check your terminal output above to see the email content")
                self.stdout.write(f"\n📋 Order Summary:")
                self.stdout.write(f"   Order ID: #{order.order_id}")
                self.stdout.write(f"   Customer: {customer.name} ({customer.email})")
                self.stdout.write(f"   Items: {order.order_items.count()}")
                self.stdout.write(f"   Total: Rs. {order.total_amount:,.2f}")
                self.stdout.write(f"   Payment: {order.payment}")
                self.stdout.write(f"   Shipping: {order.shipping_info['address']}, {order.shipping_info['city']}")
            else:
                self.stdout.write(self.style.ERROR("❌ Failed to send email. Check error message above."))
            
            self.stdout.write("\n" + "=" * 70)
            self.stdout.write(self.style.SUCCESS("✅ TEST COMPLETED"))
            self.stdout.write("=" * 70)
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"\n❌ Test failed with error: {str(e)}"))
            import traceback
            traceback.print_exc()
