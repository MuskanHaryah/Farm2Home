from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from main.models import Customer

class Command(BaseCommand):
    help = 'Updates existing customers with hashed passwords (user123 for all)'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('Updating customer passwords...'))
        
        # Get all customers
        customers = Customer.objects.all()
        
        if not customers.exists():
            self.stdout.write(self.style.ERROR('No customers found in database!'))
            return
        
        # Update each customer with hashed password
        updated_count = 0
        password = 'user123'
        hashed_password = make_password(password)
        
        for customer in customers:
            # Only update if password is empty or not hashed
            if not customer.password or len(customer.password) < 50:  # Hashed passwords are much longer
                customer.password = hashed_password
                customer.save()
                updated_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Updated password for: {customer.name} ({customer.email})')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'⊗ Skipped (already has password): {customer.name} ({customer.email})')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'\n✓ Successfully updated {updated_count} customer(s)')
        )
        self.stdout.write(
            self.style.SUCCESS(f'✓ Total customers in database: {customers.count()}')
        )
        self.stdout.write(
            self.style.SUCCESS(f'✓ Default password for all: {password}')
        )
