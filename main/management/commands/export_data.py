from django.core.management.base import BaseCommand
from django.core.management import call_command
import os


class Command(BaseCommand):
    help = 'Export all data to data.json file for Railway deployment'

    def handle(self, *args, **options):
        try:
            # Export all data using natural foreign keys for better portability
            output_file = 'data.json'
            
            self.stdout.write('Exporting data to data.json...')
            
            with open(output_file, 'w', encoding='utf-8') as f:
                call_command(
                    'dumpdata',
                    'main',  # Only export main app data
                    '--natural-foreign',
                    '--natural-primary',
                    '--indent', '2',
                    stdout=f
                )
            
            # Check file size
            file_size = os.path.getsize(output_file)
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully exported data to {output_file} ({file_size} bytes)'
                )
            )
            
            self.stdout.write(
                self.style.WARNING(
                    '\nIMPORTANT: Commit this data.json file to your repository '
                    'so it can be loaded automatically on Railway deployment!'
                )
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error exporting data: {str(e)}')
            )
