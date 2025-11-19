"""
Django management command to import parties and candidates from CSV files.
"""
import csv
import os
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.candidates.models import Party, Candidate
from apps.elections.models import Election


class Command(BaseCommand):
    help = 'Import parties and candidates from CSV files into the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--election-id',
            type=int,
            help='Election ID to associate parties and candidates with'
        )
        parser.add_argument(
            '--parties-file',
            type=str,
            default='files/parties.csv',
            help='Path to parties CSV file'
        )
        parser.add_argument(
            '--candidates-file',
            type=str,
            default='files/candidates.csv',
            help='Path to candidates CSV file'
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing parties and candidates for this election before importing'
        )

    def handle(self, *args, **options):
        parties_file = options['parties_file']
        candidates_file = options['candidates_file']
        election_id = options.get('election_id')
        clear_existing = options['clear']
        
        # Check files exist
        if not os.path.exists(parties_file):
            self.stdout.write(self.style.ERROR(f'Parties file not found: {parties_file}'))
            return
        
        if not os.path.exists(candidates_file):
            self.stdout.write(self.style.ERROR(f'Candidates file not found: {candidates_file}'))
            return
        
        # Get election
        if election_id:
            try:
                election = Election.objects.get(id=election_id)
                self.stdout.write(self.style.SUCCESS(f'Using election: {election.name} (ID: {election.id})'))
            except Election.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'Election with ID {election_id} not found'))
                return
        else:
            # Get the most recent election
            election = Election.objects.first()
            if not election:
                self.stdout.write(self.style.ERROR('No elections found. Please create an election first.'))
                return
            self.stdout.write(self.style.SUCCESS(f'Using most recent election: {election.name} (ID: {election.id})'))
        
        stats = {
            'parties_created': 0,
            'parties_updated': 0,
            'candidates_created': 0,
            'candidates_updated': 0,
            'errors': 0,
        }
        
        try:
            with transaction.atomic():
                # Clear existing data if requested
                if clear_existing:
                    deleted_candidates = Candidate.objects.filter(election=election).delete()[0]
                    deleted_parties = Party.objects.filter(election=election).delete()[0]
                    self.stdout.write(
                        self.style.WARNING(
                            f'Cleared {deleted_candidates} candidates and {deleted_parties} parties'
                        )
                    )
                
                # Import parties
                self.stdout.write('\nImporting parties...')
                party_map = {}  # Map party name to Party object
                
                with open(parties_file, 'r', encoding='utf-8') as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        party_name = row['party_name'].strip()
                        
                        if not party_name:
                            continue
                        
                        try:
                            party, created = Party.objects.update_or_create(
                                election=election,
                                name=party_name,
                                defaults={
                                    'is_active': True,
                                    # Set default colors
                                    'color': '#D32F2F' if 'الإئتلاف' in party_name else '#1976D2',
                                }
                            )
                            
                            party_map[party_name] = party
                            
                            if created:
                                stats['parties_created'] += 1
                                self.stdout.write(
                                    self.style.SUCCESS(f'  + Created party (ID: {party.id})')
                                )
                            else:
                                stats['parties_updated'] += 1
                                self.stdout.write(f'  > Updated party (ID: {party.id})')
                        
                        except Exception as e:
                            stats['errors'] += 1
                            self.stdout.write(
                                self.style.ERROR(f'  x Error with party: {str(e)}')
                            )
                
                # Import candidates
                self.stdout.write('\nImporting candidates...')
                
                with open(candidates_file, 'r', encoding='utf-8') as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        try:
                            candidate_number = int(row['number'])
                            candidate_name = row['name'].strip()
                            party_name = row['party'].strip()
                            
                            if not candidate_name:
                                continue
                            
                            # Get party object
                            party_obj = party_map.get(party_name)
                            if not party_obj:
                                self.stdout.write(
                                    self.style.WARNING(
                                        f'  ! Party not found for candidate #{candidate_number}'
                                    )
                                )
                            
                            # Create or update candidate
                            candidate, created = Candidate.objects.update_or_create(
                                election=election,
                                candidate_number=candidate_number,
                                defaults={
                                    'name': candidate_name,
                                    'party': party_obj,
                                    'is_active': True,
                                }
                            )
                            
                            if created:
                                stats['candidates_created'] += 1
                                self.stdout.write(
                                    self.style.SUCCESS(
                                        f'  + Created candidate #{candidate_number} (Party ID: {party_obj.id if party_obj else "None"})'
                                    )
                                )
                            else:
                                stats['candidates_updated'] += 1
                                self.stdout.write(
                                    f'  > Updated candidate #{candidate_number}'
                                )
                        
                        except Exception as e:
                            stats['errors'] += 1
                            self.stdout.write(
                                self.style.ERROR(f'  x Error with candidate: {str(e)}')
                            )
        
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error during import: {str(e)}'))
            return
        
        # Print summary
        self.stdout.write(self.style.SUCCESS('\n' + '='*60))
        self.stdout.write(self.style.SUCCESS('IMPORT SUMMARY'))
        self.stdout.write(self.style.SUCCESS('='*60))
        self.stdout.write(self.style.SUCCESS(f'Parties created: {stats["parties_created"]}'))
        self.stdout.write(f'Parties updated: {stats["parties_updated"]}')
        self.stdout.write(self.style.SUCCESS(f'Candidates created: {stats["candidates_created"]}'))
        self.stdout.write(f'Candidates updated: {stats["candidates_updated"]}')
        self.stdout.write(self.style.ERROR(f'Errors: {stats["errors"]}'))
        
        self.stdout.write(self.style.SUCCESS('\nImport complete!'))

