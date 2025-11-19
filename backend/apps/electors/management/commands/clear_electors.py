"""
Management command to clear all electors from the database.

Usage:
    python manage.py clear_electors [--confirm]
"""
from django.core.management.base import BaseCommand, CommandError
from apps.electors.models import Elector


class Command(BaseCommand):
    help = 'Clear all electors from the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Confirm deletion without prompting',
        )

    def handle(self, *args, **options):
        # Count electors before deletion
        total_electors = Elector.objects.count()
        
        if total_electors == 0:
            self.stdout.write(self.style.WARNING('No electors found in the database.'))
            return
        
        self.stdout.write(self.style.WARNING(
            f'\n⚠️  WARNING: This will permanently delete {total_electors} elector(s)!\n'
        ))
        
        # Get confirmation unless --confirm flag is used
        if not options['confirm']:
            confirm = input('Are you sure you want to proceed? Type "yes" to confirm: ')
            if confirm.lower() != 'yes':
                self.stdout.write(self.style.ERROR('Operation cancelled.'))
                return
        
        # Delete all electors
        try:
            deleted_count, _ = Elector.objects.all().delete()
            self.stdout.write(
                self.style.SUCCESS(f'\n✓ Successfully deleted {deleted_count} elector(s).\n')
            )
        except Exception as e:
            raise CommandError(f'Error deleting electors: {str(e)}')


























