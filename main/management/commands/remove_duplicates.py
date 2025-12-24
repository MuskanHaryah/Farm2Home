from django.core.management.base import BaseCommand
from django.db.models import Count
from main.models import Product

# python manage.py remove_duplicates --dry-run
class Command(BaseCommand):
    help = 'Find and remove duplicate products, keeping the oldest one'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be deleted without actually deleting',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        
        self.stdout.write('='*70)
        self.stdout.write('SEARCHING FOR DUPLICATE PRODUCTS...\n')
        
        # Find products with duplicate names
        duplicate_names = Product.objects.values('name').annotate(
            count=Count('name')
        ).filter(count__gt=1).order_by('name')
        
        if not duplicate_names:
            self.stdout.write(self.style.SUCCESS('No duplicate products found!'))
            return
        
        self.stdout.write(f'Found {len(duplicate_names)} product name(s) with duplicates:\n')
        
        total_to_delete = 0
        
        for dup in duplicate_names:
            name = dup['name']
            count = dup['count']
            
            # Get all products with this name
            products = Product.objects.filter(name=name).order_by('product_id')
            
            self.stdout.write(f'\n{self.style.WARNING(f"Product: {name}")} ({count} copies)')
            
            # Keep the first (oldest) one, mark others for deletion
            for idx, product in enumerate(products):
                if idx == 0:
                    self.stdout.write(
                        f'  KEEP: ID={product.product_id}, '
                        f'Local Name="{product.local_name}", '
                        f'Price={product.price}, '
                        f'Slug="{product.slug}", '
                        f'Created={product.created_at}'
                    )
                else:
                    self.stdout.write(
                        self.style.ERROR(
                            f'  DELETE: ID={product.product_id}, '
                            f'Local Name="{product.local_name}", '
                            f'Price={product.price}, '
                            f'Slug="{product.slug}", '
                            f'Created={product.created_at}'
                        )
                    )
                    total_to_delete += 1
                    
                    if not dry_run:
                        product.delete()
        
        self.stdout.write('\n' + '='*70)
        
        if dry_run:
            self.stdout.write(
                self.style.WARNING(
                    f'\nDRY RUN: Would delete {total_to_delete} duplicate product(s)'
                )
            )
            self.stdout.write('\nRun without --dry-run to actually delete them.')
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f'\nSuccessfully deleted {total_to_delete} duplicate product(s)!'
                )
            )
            self.stdout.write('Kept the oldest version of each product.')
