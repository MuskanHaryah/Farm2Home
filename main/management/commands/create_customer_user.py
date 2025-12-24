from django.core.management.base import BaseCommand
from main.models import Customer
import secrets


class Command(BaseCommand):
    help = 'Creates a test customer user for initial deployment'

    def handle(self, *args, **options):
        # Check if any customers exist
        if Customer.objects.exists():
            self.stdout.write(
                self.style.WARNING('Customers already exist. Skipping user creation.')
            )
            return

        # Create a test customer
        try:
            customer = Customer.objects.create(
                name='Test Customer',
                email='customer@farm2home.com',
                phone='1234567890',
                address='123 Test Street',
                password='test_customer_123'  # You can change this
            )
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created test customer: {customer.email}\n'
                    f'Password: test_customer_123\n'
                    f'Please change this password after first login!'
                )
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating customer: {str(e)}')
            )
