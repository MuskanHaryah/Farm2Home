from django.core.management.base import BaseCommand
from main.models import Product, Inventory
from django.utils.text import slugify


class Command(BaseCommand):
    help = 'Populate database with all 56 products from frontend'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force population even if products exist (will update existing)',
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear all existing products before populating (fresh start)',
        )

    def handle(self, *args, **kwargs):
        force = kwargs.get('force', False)
        clear = kwargs.get('clear', False)
        
        # Clear existing data if requested
        if clear:
            confirm = input('\n⚠️  WARNING: This will delete ALL products and inventory data!\nType "yes" to confirm: ')
            if confirm.lower() == 'yes':
                Product.objects.all().delete()
                Inventory.objects.all().delete()
                self.stdout.write(self.style.SUCCESS('✓ Cleared all existing products and inventory'))
            else:
                self.stdout.write(self.style.WARNING('Aborted. No data was deleted.'))
                return
        
        # Safety check to prevent accidental duplicate creation
        existing_count = Product.objects.count()
        if existing_count > 0 and not force and not clear:
            self.stdout.write(
                self.style.WARNING(
                    f'\n⚠️  WARNING: Database already has {existing_count} products!\n'
                    f'Running this command will UPDATE existing products.\n'
                    f'Use --force flag to proceed with updates.\n'
                    f'Use --clear flag to delete all and start fresh.\n'
                    f'Example: python manage.py populate_products --clear\n'
                )
            )
            return
        
        self.stdout.write('Starting to populate products...')
        
        # All 56 products data with CORRECT image paths (relative to static/)
        products_data = [
            # VEGETABLES (24 items)
            {'name': 'Tomato', 'local_name': 'Tamatar', 'category': 'vegetables', 'price': 120, 'season': 'SUMMER', 'image': 'images/vegetables/tomato.png'},
            {'name': 'Potato', 'local_name': 'Aloo', 'category': 'vegetables', 'price': 80, 'season': 'ALL_YEAR', 'image': 'images/vegetables/potatoes.png'},
            {'name': 'Onion', 'local_name': 'Pyaz', 'category': 'vegetables', 'price': 100, 'season': 'ALL_YEAR', 'image': 'images/vegetables/onions.png'},
            {'name': 'Okra', 'local_name': 'Bhindi', 'category': 'vegetables', 'price': 150, 'season': 'SUMMER', 'image': 'images/vegetables/okra.png'},
            {'name': 'Bitter Gourd', 'local_name': 'Karela', 'category': 'vegetables', 'price': 110, 'season': 'SUMMER', 'image': 'images/vegetables/bitter-gourd.png'},
            {'name': 'Carrot', 'local_name': 'Gajar', 'category': 'vegetables', 'price': 95, 'season': 'WINTER', 'image': 'images/vegetables/carrot.png'},
            {'name': 'Cucumber', 'local_name': 'Kheera', 'category': 'vegetables', 'price': 70, 'season': 'SUMMER', 'image': 'images/vegetables/cucumber.png'},
            {'name': 'Bottle Gourd', 'local_name': 'Lauki', 'category': 'vegetables', 'price': 60, 'season': 'SUMMER', 'image': 'images/vegetables/bottle-gourd.png'},
            {'name': 'Ridge Gourd', 'local_name': 'Tori', 'category': 'vegetables', 'price': 85, 'season': 'SUMMER', 'image': 'images/vegetables/ridge-gourd.png'},
            {'name': 'Apple Gourd', 'local_name': 'Tinda', 'category': 'vegetables', 'price': 90, 'season': 'SUMMER', 'image': 'images/vegetables/applegourd.png'},
            {'name': 'Pumpkin', 'local_name': 'Kaddu', 'category': 'vegetables', 'price': 75, 'season': 'ALL_YEAR', 'image': 'images/vegetables/pumpkin.png'},
            {'name': 'Beetroot', 'local_name': 'Chukandar', 'category': 'vegetables', 'price': 110, 'season': 'WINTER', 'image': 'images/vegetables/beetroot.png'},
            {'name': 'Radish', 'local_name': 'Mooli', 'category': 'vegetables', 'price': 65, 'season': 'WINTER', 'image': 'images/vegetables/radish.png'},
            {'name': 'Turnip', 'local_name': 'Shaljam', 'category': 'vegetables', 'price': 70, 'season': 'WINTER', 'image': 'images/vegetables/turnips.png'},
            {'name': 'Green Beans', 'local_name': 'Sem', 'category': 'vegetables', 'price': 140, 'season': 'ALL_YEAR', 'image': 'images/vegetables/green-beans.png'},
            {'name': 'Peas', 'local_name': 'Matar', 'category': 'vegetables', 'price': 130, 'season': 'WINTER', 'image': 'images/vegetables/peas.png'},
            {'name': 'Lettuce', 'local_name': 'Salad Patta', 'category': 'vegetables', 'price': 80, 'season': 'WINTER', 'image': 'images/vegetables/lettuce.png'},
            {'name': 'Green Onions', 'local_name': 'Hara Pyaz', 'category': 'vegetables', 'price': 50, 'season': 'ALL_YEAR', 'image': 'images/vegetables/greenonins.png'},
            {'name': 'Red Chillies', 'local_name': 'Lal Mirch', 'category': 'vegetables', 'price': 350, 'season': 'ALL_YEAR', 'image': 'images/vegetables/red-chillies.png'},
            {'name': 'Green Mustard', 'local_name': 'Sarson', 'category': 'vegetables', 'price': 90, 'season': 'WINTER', 'image': 'images/vegetables/greenmustard.png'},
            {'name': 'Sweet Potato', 'local_name': 'Shakarkandi', 'category': 'vegetables', 'price': 95, 'season': 'WINTER', 'image': 'images/vegetables/sweetpotato.png'},
            {'name': 'Taro Root', 'local_name': 'Arvi', 'category': 'vegetables', 'price': 110, 'season': 'ALL_YEAR', 'image': 'images/vegetables/taroo-root.png'},
            {'name': 'Zucchini', 'local_name': 'Zucchini', 'category': 'vegetables', 'price': 180, 'season': 'SUMMER', 'image': 'images/vegetables/zucchini.png'},
            {'name': 'Artichoke', 'local_name': 'Artichoke', 'category': 'vegetables', 'price': 400, 'season': 'ALL_YEAR', 'image': 'images/vegetables/artichoke.png'},
            
            # FRUITS (24 items)
            {'name': 'Watermelon', 'local_name': 'Tarbooz', 'category': 'fruits', 'price': 60, 'season': 'SUMMER', 'image': 'images/fruits/watermelon.png'},
            {'name': 'Melon', 'local_name': 'Kharboza', 'category': 'fruits', 'price': 70, 'season': 'SUMMER', 'image': 'images/fruits/melon.png'},
            {'name': 'Sweet Melon', 'local_name': 'Garam', 'category': 'fruits', 'price': 55, 'season': 'SUMMER', 'image': 'images/fruits/sweetmelon.png'},
            {'name': 'Guava', 'local_name': 'Amrood', 'category': 'fruits', 'price': 120, 'season': 'WINTER', 'image': 'images/fruits/guava.png'},
            {'name': 'Green Apple', 'local_name': 'Hara Seb', 'category': 'fruits', 'price': 350, 'season': 'WINTER', 'image': 'images/fruits/green-apples.png'},
            {'name': 'Pomegranate', 'local_name': 'Anar', 'category': 'fruits', 'price': 280, 'season': 'WINTER', 'image': 'images/fruits/pomegranate.png'},
            {'name': 'Papaya', 'local_name': 'Papita', 'category': 'fruits', 'price': 90, 'season': 'ALL_YEAR', 'image': 'images/fruits/papaya.png'},
            {'name': 'Pineapple', 'local_name': 'Ananas', 'category': 'fruits', 'price': 150, 'season': 'SUMMER', 'image': 'images/fruits/pineapple.png'},
            {'name': 'Grapefruit', 'local_name': 'Chakotra', 'category': 'fruits', 'price': 200, 'season': 'WINTER', 'image': 'images/fruits/grapefruit.png'},
            {'name': 'Mosambi', 'local_name': 'Sweet Lime', 'category': 'fruits', 'price': 140, 'season': 'WINTER', 'image': 'images/fruits/mosambi.png'},
            {'name': 'Apricot', 'local_name': 'Khubani', 'category': 'fruits', 'price': 450, 'season': 'SUMMER', 'image': 'images/fruits/apricot.png'},
            {'name': 'Peaches', 'local_name': 'Aaru', 'category': 'fruits', 'price': 320, 'season': 'SUMMER', 'image': 'images/fruits/peaches.png'},
            {'name': 'Plums', 'local_name': 'Alubukhara', 'category': 'fruits', 'price': 380, 'season': 'SUMMER', 'image': 'images/fruits/plums.png'},
            {'name': 'Cherries', 'local_name': 'Cherry', 'category': 'fruits', 'price': 850, 'season': 'SUMMER', 'image': 'images/fruits/cherries.png'},
            {'name': 'Lychee', 'local_name': 'Leechi', 'category': 'fruits', 'price': 420, 'season': 'SUMMER', 'image': 'images/fruits/lychees.png'},
            {'name': 'Pear', 'local_name': 'Nashpati', 'category': 'fruits', 'price': 250, 'season': 'WINTER', 'image': 'images/fruits/pear.png'},
            {'name': 'Persimmon', 'local_name': 'Japani Phal', 'category': 'fruits', 'price': 380, 'season': 'WINTER', 'image': 'images/fruits/persimmon.png'},
            {'name': 'Avocado', 'local_name': 'Avocado', 'category': 'fruits', 'price': 600, 'season': 'ALL_YEAR', 'image': 'images/fruits/avacado.png'},
            {'name': 'Jackfruit', 'local_name': 'Kathal', 'category': 'fruits', 'price': 120, 'season': 'SUMMER', 'image': 'images/fruits/jackfruit.png'},
            {'name': 'Custard Apple', 'local_name': 'Sharifa', 'category': 'fruits', 'price': 220, 'season': 'WINTER', 'image': 'images/fruits/custard-apple.png'},
            {'name': 'Sapodilla', 'local_name': 'Chikoo', 'category': 'fruits', 'price': 180, 'season': 'ALL_YEAR', 'image': 'images/fruits/Sapodilla.png'},
            {'name': 'Dates', 'local_name': 'Khajoor', 'category': 'fruits', 'price': 550, 'season': 'ALL_YEAR', 'image': 'images/fruits/dates.png'},
            {'name': 'Figs', 'local_name': 'Anjeer', 'category': 'fruits', 'price': 750, 'season': 'SUMMER', 'image': 'images/fruits/figs.png'},
            {'name': 'Mulberries', 'local_name': 'Shahtoot', 'category': 'fruits', 'price': 320, 'season': 'SUMMER', 'image': 'images/fruits/mulberries.png'},
            
            # HERBS (8 items)
            {'name': 'Curry Leaves', 'local_name': 'Kari Patta', 'category': 'herbs', 'price': 40, 'season': 'ALL_YEAR', 'image': 'images/herbs/curry-leaves.png'},
            {'name': 'Basil', 'local_name': 'Tulsi', 'category': 'herbs', 'price': 60, 'season': 'ALL_YEAR', 'image': 'images/herbs/basil.png'},
            {'name': 'Ginger', 'local_name': 'Adrak', 'category': 'herbs', 'price': 200, 'season': 'ALL_YEAR', 'image': 'images/herbs/ginger.png'},
            {'name': 'Lemongrass', 'local_name': 'Lemon Ghaas', 'category': 'herbs', 'price': 80, 'season': 'ALL_YEAR', 'image': 'images/herbs/lemon-grass.png'},
            {'name': 'Fenugreek', 'local_name': 'Methi', 'category': 'herbs', 'price': 50, 'season': 'WINTER', 'image': 'images/herbs/fenugreek.png'},
            {'name': 'Celery', 'local_name': 'Celery', 'category': 'herbs', 'price': 120, 'season': 'ALL_YEAR', 'image': 'images/herbs/celery.png'},
            {'name': 'Rosemary', 'local_name': 'Rosemary', 'category': 'herbs', 'price': 150, 'season': 'ALL_YEAR', 'image': 'images/herbs/rosemarry.png'},
            {'name': 'Thyme', 'local_name': 'Thyme', 'category': 'herbs', 'price': 140, 'season': 'ALL_YEAR', 'image': 'images/herbs/thyme.png'},
        ]
        
        created_count = 0
        updated_count = 0
        
        for product_data in products_data:
            slug = slugify(product_data['name'])
            product, created = Product.objects.update_or_create(
                slug=slug,
                defaults={
                    'name': product_data['name'],
                    'local_name': product_data['local_name'],
                    'category': product_data['category'],
                    'price': product_data['price'],
                    'season': product_data['season'],
                    'image': product_data['image'],
                    'discount': 0.00,
                    'is_active': True,
                }
            )
            
            # Create inventory with stock
            inventory, inv_created = Inventory.objects.get_or_create(
                product=product,
                defaults={'stock_available': 100}  # Default stock
            )
            
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'✓ Created: {product.name} ({product.local_name})'))
            else:
                updated_count += 1
                self.stdout.write(self.style.WARNING(f'↻ Updated: {product.name} ({product.local_name})'))
        
        self.stdout.write(self.style.SUCCESS(f'\n{"="*60}'))
        self.stdout.write(self.style.SUCCESS(f'Successfully populated products!'))
        self.stdout.write(self.style.SUCCESS(f'Created: {created_count} products'))
        self.stdout.write(self.style.SUCCESS(f'Updated: {updated_count} products'))
        self.stdout.write(self.style.SUCCESS(f'Total: {created_count + updated_count} products'))
        self.stdout.write(self.style.SUCCESS(f'{"="*60}\n'))
