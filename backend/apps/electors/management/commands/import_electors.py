"""
Management command to import electors from CSV file.

Usage:
    python manage.py import_electors <csv_file_path> [--update]
    
Example:
    python manage.py import_electors backend/files/electors.csv
    python manage.py import_electors backend/files/electors.csv --update
"""
import csv
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from apps.electors.models import Elector
from apps.elections.models import Committee, Election


class Command(BaseCommand):
    help = 'Import electors from CSV file'

    def add_arguments(self, parser):
        parser.add_argument(
            'csv_file',
            type=str,
            help='Path to the CSV file to import'
        )
        parser.add_argument(
            '--update',
            action='store_true',
            help='Update existing electors instead of skipping them',
        )
        parser.add_argument(
            '--election-id',
            type=int,
            help='Election ID (defaults to first election)',
        )

    def handle(self, *args, **options):
        csv_file_path = options['csv_file']
        update_existing = options['update']
        election_id = options.get('election_id')
        
        # Get or create election
        if election_id:
            try:
                self.election = Election.objects.get(id=election_id)
            except Election.DoesNotExist:
                raise CommandError(f'Election with ID {election_id} not found')
        else:
            # Get first election or create default
            self.election = Election.objects.first()
            if not self.election:
                self.stdout.write(self.style.WARNING('No election found, creating default election...'))
                self.election = Election.objects.create(
                    name='Default Election',
                    description='Auto-created for elector import',
                    voting_mode='BOTH',
                    status='SETUP'
                )
                self.stdout.write(self.style.SUCCESS(f'Created election: {self.election.name}\n'))
        
        self.stdout.write(self.style.NOTICE(f'Using election: {self.election.name} (ID: {self.election.id})\n'))
        
        # Statistics
        stats = {
            'total': 0,
            'created': 0,
            'updated': 0,
            'skipped': 0,
            'errors': []
        }
        
        self.stdout.write(self.style.NOTICE(f'Reading CSV file: {csv_file_path}\n'))
        
        try:
            with open(csv_file_path, 'r', encoding='utf-8-sig') as file:
                reader = csv.DictReader(file)
                
                # Validate columns
                expected_columns = ['row_id', 'internal_reference', 'fullname', 'gender', 
                                   'registeration_status', 'team_icon', 'team_name', 'group_name']
                if not all(col in reader.fieldnames for col in ['internal_reference', 'fullname']):
                    raise CommandError(
                        f'Invalid CSV format. Expected columns: {", ".join(expected_columns)}'
                    )
                
                self.stdout.write(self.style.SUCCESS('CSV file validated\n'))
                self.stdout.write(self.style.NOTICE('Starting import...\n'))
                
                rows = list(reader)
                stats['total'] = len(rows)
                
                with transaction.atomic():
                    for row_num, row in enumerate(rows, start=2):  # Start at 2 (row 1 is header)
                        try:
                            result = self._process_row(row, row_num, update_existing)
                            if result == 'created':
                                stats['created'] += 1
                            elif result == 'updated':
                                stats['updated'] += 1
                            elif result == 'skipped':
                                stats['skipped'] += 1
                                
                        except Exception as e:
                            error_msg = f"Row {row_num}: {str(e)}"
                            stats['errors'].append(error_msg)
                            self.stdout.write(self.style.ERROR(f'ERROR: {error_msg}'))
                
        except FileNotFoundError:
            raise CommandError(f'File not found: {csv_file_path}')
        except Exception as e:
            raise CommandError(f'Error reading CSV file: {str(e)}')
        
        # Print summary
        self._print_summary(stats)
    
    def _process_row(self, row, row_num, update_existing):
        """Process a single CSV row"""
        
        # Extract and validate KOC ID
        koc_id = row.get('internal_reference', '').strip()
        if not koc_id:
            raise ValueError(f"Missing KOC ID (internal_reference)")
        
        # Extract full name
        fullname = row.get('fullname', '').strip()
        if not fullname:
            raise ValueError(f"Missing full name")
        
        # Parse name into components
        name_parts = Elector.parse_full_name(fullname)
        
        # Extract gender and normalize
        gender = row.get('gender', '').strip().upper()
        if gender == 'أنثى' or gender == 'FEMALE' or gender == 'F':
            gender = 'FEMALE'
        elif gender == 'ذكر' or gender == 'MALE' or gender == 'M':
            gender = 'MALE'
        else:
            # Default to MALE if not specified or unclear
            gender = 'MALE'
        
        # Extract team and group
        team_name = row.get('team_name', '').strip()
        group_name = row.get('group_name', '').strip()
        team_icon = row.get('team_icon', '').strip()
        
        # Get or create a default committee based on gender
        # You may need to adjust this logic based on your committee structure
        committee_code = f'DEFAULT_{gender}'
        committee, created = Committee.objects.get_or_create(
            code=committee_code,
            defaults={
                'election': self.election,
                'name': f'Default Committee ({gender})',
                'gender': gender,
            }
        )
        
        if created:
            self.stdout.write(
                self.style.WARNING(f'  INFO: Created committee: {committee_code}')
            )
        
        # Check if elector exists
        try:
            elector = Elector.objects.get(koc_id=koc_id)
            
            if update_existing:
                # Update existing elector
                for key, value in name_parts.items():
                    setattr(elector, key, value)
                elector.department = team_name
                elector.team = group_name
                elector.area = group_name
                elector.gender = gender
                elector.committee = committee
                elector.save()
                
                try:
                    self.stdout.write(
                        self.style.WARNING(f'  Updated: {koc_id} - {fullname}')
                    )
                except UnicodeEncodeError:
                    self.stdout.write(
                        self.style.WARNING(f'  Updated: {koc_id}')
                    )
                return 'updated'
            else:
                try:
                    self.stdout.write(
                        self.style.WARNING(f'  Skipped (exists): {koc_id}')
                    )
                except UnicodeEncodeError:
                    self.stdout.write(
                        self.style.WARNING(f'  Skipped: {koc_id}')
                    )
                return 'skipped'
                
        except Elector.DoesNotExist:
            # Create new elector
            elector = Elector.objects.create(
                koc_id=koc_id,
                committee=committee,
                gender=gender,
                department=team_name,
                team=group_name,
                area=group_name,
                **name_parts
            )
            
            try:
                self.stdout.write(
                    self.style.SUCCESS(f'  Created: {koc_id} - {fullname}')
                )
            except UnicodeEncodeError:
                self.stdout.write(
                    self.style.SUCCESS(f'  Created: {koc_id}')
                )
            return 'created'
    
    def _print_summary(self, stats):
        """Print import summary"""
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.NOTICE('\nIMPORT SUMMARY\n'))
        self.stdout.write('='*60 + '\n')
        
        self.stdout.write(f"Total rows processed: {stats['total']}")
        self.stdout.write(self.style.SUCCESS(f"Created: {stats['created']}"))
        self.stdout.write(self.style.WARNING(f"Updated: {stats['updated']}"))
        self.stdout.write(self.style.WARNING(f"Skipped: {stats['skipped']}"))
        
        if stats['errors']:
            self.stdout.write(self.style.ERROR(f"\nErrors: {len(stats['errors'])}"))
            for error in stats['errors'][:10]:  # Show first 10 errors
                self.stdout.write(self.style.ERROR(f"  - {error}"))
            if len(stats['errors']) > 10:
                self.stdout.write(
                    self.style.ERROR(f"  ... and {len(stats['errors']) - 10} more errors")
                )
        
        self.stdout.write('\n' + '='*60 + '\n')
        
        if stats['created'] > 0 or stats['updated'] > 0:
            self.stdout.write(self.style.SUCCESS('\nImport completed successfully!\n'))
        elif stats['errors']:
            self.stdout.write(self.style.ERROR('\nImport completed with errors.\n'))
        else:
            self.stdout.write(self.style.WARNING('\nNo new records imported.\n'))

