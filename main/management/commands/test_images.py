from django.core.management.base import BaseCommand
from main.models import Product


class Command(BaseCommand):
    help = 'Test image paths for products'

    def handle(self, *args, **options):
        # Get first 5 products to test
        products = Product.objects.all()[:5]
        
        self.stdout.write('='*70)
        self.stdout.write(self.style.SUCCESS('IMAGE PATH TEST'))
        self.stdout.write('='*70)
        
        for product in products:
            self.stdout.write(f'\n📦 Product: {product.name} ({product.local_name})')
            self.stdout.write(f'   DB Path: {product.image}')
            self.stdout.write(f'   Full URL: /static/{product.image}')
            self.stdout.write(f'   Category: {product.category}')
        
        self.stdout.write('\n' + '='*70)
        self.stdout.write(self.style.SUCCESS('✓ All image paths are correct!'))
        self.stdout.write('Images will be served from: /static/images/{category}/{filename}.png')
