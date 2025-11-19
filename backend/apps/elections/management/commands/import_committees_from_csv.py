"""
Django management command to import committees from CSV file.
Handles elector reassignment properly.
"""
import csv
import os
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.elections.models import Committee, Election
from apps.electors.models import Elector


class Command(BaseCommand):
    help = 'Import committees from CSV file and clear existing committees'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            default='files/committees.csv',
            help='Path to the committees CSV file'
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing committees before importing'
        )

    def handle(self, *args, **options):
        csv_file = options['file']
        clear_existing = options['clear']
        
        # Check file exists
        if not os.path.exists(csv_file):
            self.stdout.write(self.style.ERROR(f'File not found: {csv_file}'))
            return
        
        # Get election
        election = Election.objects.first()
        if not election:
            self.stdout.write(self.style.ERROR('No election found!'))
            return
        
        self.stdout.write(f'Election: {election.name}')
        
        try:
            with transaction.atomic():
                # Read new committees from CSV first
                new_committees = []
                with open(csv_file, 'r', encoding='utf-8-sig') as f:  # utf-8-sig handles BOM
                    reader = csv.DictReader(f)
                    for row in reader:
                        code = row['code'].strip()
                        gender_ar = row['gender'].strip()
                        electors_from = int(row['elector_range_start']) if row.get('elector_range_start') else None
                        electors_to = int(row['elector_range_end']) if row.get('elector_range_end') else None
                        
                        # Map Arabic gender to model gender (check if starts with certain letters)
                        if code.lower().startswith('m'):
                            gender = 'MALE'
                            name_prefix = 'Male'
                        elif code.lower().startswith('f'):
                            gender = 'FEMALE'
                            name_prefix = 'Female'
                        else:
                            gender = 'MIXED'
                            name_prefix = 'Mixed'
                        
                        committee_name = f'{name_prefix} Committee {code.upper()}'
                        new_committees.append({
                            'code': code,
                            'name': committee_name,
                            'gender': gender,
                            'electors_from': electors_from,
                            'electors_to': electors_to
                        })
                
                self.stdout.write(f'Found {len(new_committees)} committees in CSV')
                
                if clear_existing:
                    # Get existing committees
                    existing_committees = list(Committee.objects.filter(election=election))
                    self.stdout.write(f'Found {len(existing_committees)} existing committees')
                    
                    if existing_committees:
                        # Create a temporary committee to hold electors
                        temp_committee = Committee.objects.create(
                            election=election,
                            code='TEMP',
                            name='Temporary Committee',
                            gender='MIXED',
                            location=''
                        )
                        self.stdout.write('Created temporary committee')
                        
                        # Move all electors to temporary committee
                        elector_count = Elector.objects.filter(
                            committee__election=election
                        ).update(committee=temp_committee)
                        self.stdout.write(f'Moved {elector_count} electors to temporary committee')
                        
                        # Delete all existing committees except temp
                        deleted_count = Committee.objects.filter(
                            election=election
                        ).exclude(code='TEMP').delete()[0]
                        self.stdout.write(f'Deleted {deleted_count} existing committees')
                
                # Create new committees
                created_committees = []
                for comm_data in new_committees:
                    committee = Committee.objects.create(
                        election=election,
                        code=comm_data['code'],
                        name=comm_data['name'],
                        gender=comm_data['gender'],
                        location='',
                        electors_from=comm_data['electors_from'],
                        electors_to=comm_data['electors_to']
                    )
                    created_committees.append(committee)
                    range_str = f'{comm_data["electors_from"]}-{comm_data["electors_to"]}' if comm_data["electors_from"] else 'No range'
                    self.stdout.write(f'Created: {comm_data["code"]} - {comm_data["gender"]} - Range: {range_str}')
                
                # If we created a temp committee, move electors to first new committee and delete temp
                if clear_existing and existing_committees:
                    if created_committees:
                        # Move electors from temp to first new committee
                        first_committee = created_committees[0]
                        moved_count = Elector.objects.filter(
                            committee__code='TEMP'
                        ).update(committee=first_committee)
                        self.stdout.write(f'Moved {moved_count} electors to {first_committee.code}')
                        
                        # Delete temporary committee
                        Committee.objects.filter(code='TEMP', election=election).delete()
                        self.stdout.write('Deleted temporary committee')
                
                self.stdout.write(self.style.SUCCESS(f'\nSuccessfully created {len(created_committees)} committees'))
                self.stdout.write(f'Total committees in DB: {Committee.objects.filter(election=election).count()}')
        
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
            raise

