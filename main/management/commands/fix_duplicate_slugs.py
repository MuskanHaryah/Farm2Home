from django.core.management.base import BaseCommand
from django.utils.text import slugify
from main.models import Product


class Command(BaseCommand):
    help = 'Fix duplicate product slugs by making them unique'

    def handle(self, *args, **options):
        self.stdout.write('Fixing duplicate slugs...\n')
        
        products = Product.objects.all().order_by('product_id')
        fixed_count = 0
        
        for product in products:
            # Generate base slug from name
            base_slug = slugify(product.name)
            slug = base_slug
            counter = 1
            
            # Check if current slug is duplicate
            duplicate_exists = Product.objects.filter(
                slug=product.slug
            ).exclude(
                product_id=product.product_id
            ).exists()
            
            if duplicate_exists or not product.slug:
                # Find a unique slug
                while Product.objects.filter(slug=slug).exclude(product_id=product.product_id).exists():
                    slug = f"{base_slug}-{counter}"
                    counter += 1
                
                old_slug = product.slug
                product.slug = slug
                product.save()
                
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✓ Fixed: "{product.name}" (ID: {product.product_id}): "{old_slug}" → "{slug}"'
                    )
                )
                fixed_count += 1
            else:
                self.stdout.write(
                    f'  OK: "{product.name}" (ID: {product.product_id}): "{product.slug}"'
                )
        
        self.stdout.write('\n' + '='*60)
        if fixed_count > 0:
            self.stdout.write(
                self.style.SUCCESS(f'✓ Fixed {fixed_count} duplicate slug(s)')
            )
        else:
            self.stdout.write(
                self.style.SUCCESS('✓ No duplicate slugs found. All good!')
            )
