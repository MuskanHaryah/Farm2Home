from django.core.management.base import BaseCommand
from main.models import Product, Inventory, Cart, OrderItem, Order


class Command(BaseCommand):
    help = 'Reset database: Delete all products, inventory, carts, and orders'

    def add_arguments(self, parser):
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Confirm that you want to delete ALL data',
        )

    def handle(self, *args, **options):
        if not options['confirm']:
            self.stdout.write(
                self.style.ERROR(
                    '\n⚠️  DANGER: This will delete ALL products, inventory, carts, and orders!\n'
                    'Add --confirm flag if you really want to proceed.\n'
                    'Example: python manage.py reset_products --confirm\n'
                )
            )
            return
        
        self.stdout.write('='*70)
        self.stdout.write(self.style.WARNING('RESETTING DATABASE...'))
        
        # Delete in correct order (respecting foreign keys)
        cart_count = Cart.objects.count()
        Cart.objects.all().delete()
        self.stdout.write(f'✓ Deleted {cart_count} cart items')
        
        order_item_count = OrderItem.objects.count()
        OrderItem.objects.all().delete()
        self.stdout.write(f'✓ Deleted {order_item_count} order items')
        
        order_count = Order.objects.count()
        Order.objects.all().delete()
        self.stdout.write(f'✓ Deleted {order_count} orders')
        
        inventory_count = Inventory.objects.count()
        Inventory.objects.all().delete()
        self.stdout.write(f'✓ Deleted {inventory_count} inventory records')
        
        product_count = Product.objects.count()
        Product.objects.all().delete()
        self.stdout.write(f'✓ Deleted {product_count} products')
        
        self.stdout.write('='*70)
        self.stdout.write(
            self.style.SUCCESS(
                '\n✓ Database reset complete!\n'
                'Run: python manage.py populate_products\n'
                'To repopulate with fresh data.\n'
            )
        )
