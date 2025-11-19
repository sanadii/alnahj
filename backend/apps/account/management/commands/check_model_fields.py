"""Management command to check model fields."""
from django.core.management.base import BaseCommand
from apps.account.models import CustomUser


class Command(BaseCommand):
    help = 'Check CustomUser model fields'

    def handle(self, *args, **options):
        fields = [f.name for f in CustomUser._meta.get_fields()]
        self.stdout.write('\n===Custom User Fields===')
        for field in sorted(fields):
            self.stdout.write(f'  - {field}')
        
        # Check if there are any legacy fields that shouldn't exist
        legacy_fields = [f for f in fields if 'business' in f.lower()]
        if legacy_fields:
            self.stdout.write(self.style.WARNING(f'\nFound legacy business fields (should not exist): {legacy_fields}'))
        else:
            self.stdout.write(self.style.SUCCESS('\nNo legacy business fields found!'))

