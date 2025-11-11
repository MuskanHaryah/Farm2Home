from django.core.management.base import BaseCommand
from main.models import Product, Inventory
from django.utils.text import slugify


class Command(BaseCommand):
    help = 'Populate database with all 56 products from frontend'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting to populate products...')
        
        # All 56 products data based on your frontend
        products_data = [
            # VEGETABLES (24 items)
            {'name': 'Tomato', 'local_name': 'Tamatar', 'category': 'vegetables', 'price': 120, 'season': 'SUMMER', 'image': 'static/images/vegetables/tomato.jpg'},
            {'name': 'Potato', 'local_name': 'Aloo', 'category': 'vegetables', 'price': 80, 'season': 'ALL_YEAR', 'image': 'static/images/vegetables/potato.jpg'},
            {'name': 'Onion', 'local_name': 'Pyaz', 'category': 'vegetables', 'price': 100, 'season': 'ALL_YEAR', 'image': 'static/images/vegetables/onion.jpg'},
            {'name': 'Okra', 'local_name': 'Bhindi', 'category': 'vegetables', 'price': 150, 'season': 'SUMMER', 'image': 'static/images/vegetables/okra.jpg'},
            {'name': 'Bitter Gourd', 'local_name': 'Karela', 'category': 'vegetables', 'price': 110, 'season': 'SUMMER', 'image': 'static/images/vegetables/bitter-gourd.jpg'},
            {'name': 'Carrot', 'local_name': 'Gajar', 'category': 'vegetables', 'price': 95, 'season': 'WINTER', 'image': 'static/images/vegetables/carrot.jpg'},
            {'name': 'Cucumber', 'local_name': 'Kheera', 'category': 'vegetables', 'price': 70, 'season': 'SUMMER', 'image': 'static/images/vegetables/cucumber.jpg'},
            {'name': 'Bottle Gourd', 'local_name': 'Lauki', 'category': 'vegetables', 'price': 60, 'season': 'SUMMER', 'image': 'static/images/vegetables/bottle-gourd.jpg'},
            {'name': 'Ridge Gourd', 'local_name': 'Tori', 'category': 'vegetables', 'price': 85, 'season': 'SUMMER', 'image': 'static/images/vegetables/ridge-gourd.jpg'},
            {'name': 'Apple Gourd', 'local_name': 'Tinda', 'category': 'vegetables', 'price': 90, 'season': 'SUMMER', 'image': 'static/images/vegetables/apple-gourd.jpg'},
            {'name': 'Pumpkin', 'local_name': 'Kaddu', 'category': 'vegetables', 'price': 75, 'season': 'ALL_YEAR', 'image': 'static/images/vegetables/pumpkin.jpg'},
            {'name': 'Beetroot', 'local_name': 'Chukandar', 'category': 'vegetables', 'price': 110, 'season': 'WINTER', 'image': 'static/images/vegetables/beetroot.jpg'},
            {'name': 'Radish', 'local_name': 'Mooli', 'category': 'vegetables', 'price': 65, 'season': 'WINTER', 'image': 'static/images/vegetables/radish.jpg'},
            {'name': 'Turnip', 'local_name': 'Shaljam', 'category': 'vegetables', 'price': 70, 'season': 'WINTER', 'image': 'static/images/vegetables/turnip.jpg'},
            {'name': 'Green Beans', 'local_name': 'Sem', 'category': 'vegetables', 'price': 140, 'season': 'ALL_YEAR', 'image': 'static/images/vegetables/green-beans.jpg'},
            {'name': 'Peas', 'local_name': 'Matar', 'category': 'vegetables', 'price': 130, 'season': 'WINTER', 'image': 'static/images/vegetables/peas.jpg'},
            {'name': 'Lettuce', 'local_name': 'Salad Patta', 'category': 'vegetables', 'price': 80, 'season': 'WINTER', 'image': 'static/images/vegetables/lettuce.jpg'},
            {'name': 'Green Onions', 'local_name': 'Hara Pyaz', 'category': 'vegetables', 'price': 50, 'season': 'ALL_YEAR', 'image': 'static/images/vegetables/green-onions.jpg'},
            {'name': 'Red Chillies', 'local_name': 'Lal Mirch', 'category': 'vegetables', 'price': 350, 'season': 'ALL_YEAR', 'image': 'static/images/vegetables/red-chillies.jpg'},
            {'name': 'Green Mustard', 'local_name': 'Sarson', 'category': 'vegetables', 'price': 90, 'season': 'WINTER', 'image': 'static/images/vegetables/green-mustard.jpg'},
            {'name': 'Sweet Potato', 'local_name': 'Shakarkandi', 'category': 'vegetables', 'price': 95, 'season': 'WINTER', 'image': 'static/images/vegetables/sweet-potato.jpg'},
            {'name': 'Taro Root', 'local_name': 'Arvi', 'category': 'vegetables', 'price': 110, 'season': 'ALL_YEAR', 'image': 'static/images/vegetables/taro-root.jpg'},
            {'name': 'Zucchini', 'local_name': 'Zucchini', 'category': 'vegetables', 'price': 180, 'season': 'SUMMER', 'image': 'static/images/vegetables/zucchini.jpg'},
            {'name': 'Artichoke', 'local_name': 'Artichoke', 'category': 'vegetables', 'price': 400, 'season': 'ALL_YEAR', 'image': 'static/images/vegetables/artichoke.jpg'},
            
            # FRUITS (24 items)
            {'name': 'Watermelon', 'local_name': 'Tarbooz', 'category': 'fruits', 'price': 60, 'season': 'SUMMER', 'image': 'static/images/fruits/watermelon.jpg'},
            {'name': 'Melon', 'local_name': 'Kharboza', 'category': 'fruits', 'price': 70, 'season': 'SUMMER', 'image': 'static/images/fruits/melon.jpg'},
            {'name': 'Sweet Melon', 'local_name': 'Garam', 'category': 'fruits', 'price': 55, 'season': 'SUMMER', 'image': 'static/images/fruits/sweet-melon.jpg'},
            {'name': 'Guava', 'local_name': 'Amrood', 'category': 'fruits', 'price': 120, 'season': 'WINTER', 'image': 'static/images/fruits/guava.jpg'},
            {'name': 'Green Apple', 'local_name': 'Hara Seb', 'category': 'fruits', 'price': 350, 'season': 'WINTER', 'image': 'static/images/fruits/green-apple.jpg'},
            {'name': 'Pomegranate', 'local_name': 'Anar', 'category': 'fruits', 'price': 280, 'season': 'WINTER', 'image': 'static/images/fruits/pomegranate.jpg'},
            {'name': 'Papaya', 'local_name': 'Papita', 'category': 'fruits', 'price': 90, 'season': 'ALL_YEAR', 'image': 'static/images/fruits/papaya.jpg'},
            {'name': 'Pineapple', 'local_name': 'Ananas', 'category': 'fruits', 'price': 150, 'season': 'SUMMER', 'image': 'static/images/fruits/pineapple.jpg'},
            {'name': 'Grapefruit', 'local_name': 'Chakotra', 'category': 'fruits', 'price': 200, 'season': 'WINTER', 'image': 'static/images/fruits/grapefruit.jpg'},
            {'name': 'Mosambi', 'local_name': 'Sweet Lime', 'category': 'fruits', 'price': 140, 'season': 'WINTER', 'image': 'static/images/fruits/mosambi.jpg'},
            {'name': 'Apricot', 'local_name': 'Khubani', 'category': 'fruits', 'price': 450, 'season': 'SUMMER', 'image': 'static/images/fruits/apricot.jpg'},
            {'name': 'Peaches', 'local_name': 'Aaru', 'category': 'fruits', 'price': 320, 'season': 'SUMMER', 'image': 'static/images/fruits/peaches.jpg'},
            {'name': 'Plums', 'local_name': 'Alubukhara', 'category': 'fruits', 'price': 380, 'season': 'SUMMER', 'image': 'static/images/fruits/plums.jpg'},
            {'name': 'Cherries', 'local_name': 'Cherry', 'category': 'fruits', 'price': 850, 'season': 'SUMMER', 'image': 'static/images/fruits/cherries.jpg'},
            {'name': 'Lychee', 'local_name': 'Leechi', 'category': 'fruits', 'price': 420, 'season': 'SUMMER', 'image': 'static/images/fruits/lychee.jpg'},
            {'name': 'Pear', 'local_name': 'Nashpati', 'category': 'fruits', 'price': 250, 'season': 'WINTER', 'image': 'static/images/fruits/pear.jpg'},
            {'name': 'Persimmon', 'local_name': 'Japani Phal', 'category': 'fruits', 'price': 380, 'season': 'WINTER', 'image': 'static/images/fruits/persimmon.jpg'},
            {'name': 'Avocado', 'local_name': 'Avocado', 'category': 'fruits', 'price': 600, 'season': 'ALL_YEAR', 'image': 'static/images/fruits/avocado.jpg'},
            {'name': 'Jackfruit', 'local_name': 'Kathal', 'category': 'fruits', 'price': 120, 'season': 'SUMMER', 'image': 'static/images/fruits/jackfruit.jpg'},
            {'name': 'Custard Apple', 'local_name': 'Sharifa', 'category': 'fruits', 'price': 220, 'season': 'WINTER', 'image': 'static/images/fruits/custard-apple.jpg'},
            {'name': 'Sapodilla', 'local_name': 'Chikoo', 'category': 'fruits', 'price': 180, 'season': 'ALL_YEAR', 'image': 'static/images/fruits/sapodilla.jpg'},
            {'name': 'Dates', 'local_name': 'Khajoor', 'category': 'fruits', 'price': 550, 'season': 'ALL_YEAR', 'image': 'static/images/fruits/dates.jpg'},
            {'name': 'Figs', 'local_name': 'Anjeer', 'category': 'fruits', 'price': 750, 'season': 'SUMMER', 'image': 'static/images/fruits/figs.jpg'},
            {'name': 'Mulberries', 'local_name': 'Shahtoot', 'category': 'fruits', 'price': 320, 'season': 'SUMMER', 'image': 'static/images/fruits/mulberries.jpg'},
            
            # HERBS (8 items)
            {'name': 'Curry Leaves', 'local_name': 'Kari Patta', 'category': 'herbs', 'price': 40, 'season': 'ALL_YEAR', 'image': 'static/images/herbs/curry-leaves.jpg'},
            {'name': 'Basil', 'local_name': 'Tulsi', 'category': 'herbs', 'price': 60, 'season': 'ALL_YEAR', 'image': 'static/images/herbs/basil.jpg'},
            {'name': 'Ginger', 'local_name': 'Adrak', 'category': 'herbs', 'price': 200, 'season': 'ALL_YEAR', 'image': 'static/images/herbs/ginger.jpg'},
            {'name': 'Lemongrass', 'local_name': 'Lemon Ghaas', 'category': 'herbs', 'price': 80, 'season': 'ALL_YEAR', 'image': 'static/images/herbs/lemongrass.jpg'},
            {'name': 'Fenugreek', 'local_name': 'Methi', 'category': 'herbs', 'price': 50, 'season': 'WINTER', 'image': 'static/images/herbs/fenugreek.jpg'},
            {'name': 'Celery', 'local_name': 'Celery', 'category': 'herbs', 'price': 120, 'season': 'ALL_YEAR', 'image': 'static/images/herbs/celery.jpg'},
            {'name': 'Rosemary', 'local_name': 'Rosemary', 'category': 'herbs', 'price': 150, 'season': 'ALL_YEAR', 'image': 'static/images/herbs/rosemary.jpg'},
            {'name': 'Thyme', 'local_name': 'Thyme', 'category': 'herbs', 'price': 140, 'season': 'ALL_YEAR', 'image': 'static/images/herbs/thyme.jpg'},
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
