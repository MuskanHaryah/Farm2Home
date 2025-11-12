from django.core.management.base import BaseCommand
from main.models import Product


class Command(BaseCommand):
    help = 'Show count of active products by season and category'

    def handle(self, *args, **options):
        active_products = Product.objects.filter(is_active=True)
        
        total = active_products.count()
        
        # By season
        winter = active_products.filter(season='WINTER').count()
        summer = active_products.filter(season='SUMMER').count()
        year_round = active_products.filter(season='ALL_YEAR').count()
        
        # By category
        vegetables = active_products.filter(category='vegetables').count()
        fruits = active_products.filter(category='fruits').count()
        herbs = active_products.filter(category='herbs').count()
        
        self.stdout.write('='*60)
        self.stdout.write(self.style.SUCCESS(f'ACTIVE PRODUCTS: {total}'))
        self.stdout.write('='*60)
        
        self.stdout.write('\n📅 BY SEASON:')
        self.stdout.write(f'  ❄️  Winter: {winter}')
        self.stdout.write(f'  ☀️  Summer: {summer}')
        self.stdout.write(f'  🔄 Year-round: {year_round}')
        
        self.stdout.write('\n📦 BY CATEGORY:')
        self.stdout.write(f'  🥕 Vegetables: {vegetables}')
        self.stdout.write(f'  🍎 Fruits: {fruits}')
        self.stdout.write(f'  🌿 Herbs: {herbs}')
        
        self.stdout.write('\n' + '='*60)
        
        # Show inactive products if any
        inactive = Product.objects.filter(is_active=False).count()
        if inactive > 0:
            self.stdout.write(self.style.WARNING(f'\n⚠️  Inactive products: {inactive}'))
            inactive_products = Product.objects.filter(is_active=False).values_list('name', flat=True)
            for name in inactive_products:
                self.stdout.write(f'  - {name}')
