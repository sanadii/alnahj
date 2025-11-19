"""
Management command to create demo election data.

Usage:
    python manage.py create_demo_election
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.elections.models import Election
from apps.voting.models import Party, Candidate
from apps.electors.models import Elector


class Command(BaseCommand):
    help = 'Create demo election with 2 parties (15 candidates each) and 5 independent candidates'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('\n=== Creating Demo Election ===\n'))
        
        # Step 1: Create Election
        self.stdout.write('Creating election...')
        
        # Get or create a system user for the election
        from apps.account.models import CustomUser
        system_user, _ = CustomUser.objects.get_or_create(
            email='system@election.local',
            defaults={
                'first_name': 'System',
                'last_name': 'Admin',
                'is_staff': True,
                'is_superuser': True,
                'is_active': True,
            }
        )
        if not system_user.password:
            system_user.set_password('SystemPassword123!')
            system_user.save()
        
        election, created = Election.objects.get_or_create(
            name='Kuwait National Assembly Election 2025',
            defaults={
                'description': 'Demo election for testing purposes',
                'voting_mode': 'BOTH',
                'max_candidates_per_ballot': 19,
                'allow_partial_voting': True,
                'minimum_votes_required': 1,
                'status': 'SETUP',
                'guarantee_start_date': timezone.now().date(),
                'guarantee_end_date': (timezone.now() + timedelta(days=30)).date(),
                'voting_date': (timezone.now() + timedelta(days=45)).date(),
                'created_by': system_user,
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS(f'[OK] Created election: {election.name}'))
        else:
            self.stdout.write(self.style.WARNING(f'[!] Election already exists: {election.name}'))
        
        # Step 2: Create Parties
        self.stdout.write('\nCreating parties...')
        
        party1, created1 = Party.objects.get_or_create(
            election=election,
            name='Progressive Alliance',
            defaults={
                'color': '#1976D2',
                'description': 'Progressive political alliance focused on reform and development'
            }
        )
        
        party2, created2 = Party.objects.get_or_create(
            election=election,
            name='National Coalition',
            defaults={
                'color': '#D32F2F',
                'description': 'National coalition promoting traditional values and stability'
            }
        )
        
        if created1:
            self.stdout.write(self.style.SUCCESS(f'[OK] Created party: {party1.name}'))
        else:
            self.stdout.write(self.style.WARNING(f'! Party already exists: {party1.name}'))
        
        if created2:
            self.stdout.write(self.style.SUCCESS(f'[OK] Created party: {party2.name}'))
        else:
            self.stdout.write(self.style.WARNING(f'! Party already exists: {party2.name}'))
        
        # Step 3: Create a default committee for candidates
        self.stdout.write('\nCreating default committee...')
        from apps.elections.models import Committee
        
        default_committee, committee_created = Committee.objects.get_or_create(
            election=election,
            code='CAND-01',
            defaults={
                'name': 'Candidates Committee',
                'gender': 'MALE',
            }
        )
        
        if committee_created:
            self.stdout.write(self.style.SUCCESS(f'[OK] Created committee: {default_committee.code}'))
        else:
            self.stdout.write(self.style.WARNING(f'[!] Committee already exists: {default_committee.code}'))
        
        # Step 4: Create Electors (candidates will be electors)
        self.stdout.write('\nCreating electors for candidates...')
        
        candidate_data = []
        candidate_number = 1
        
        # Party 1 candidates (15)
        for i in range(1, 16):
            candidate_data.append({
                'party': party1,
                'name_first': f'Ahmad',
                'name_second': f'Abdullah',
                'name_third': f'Salem',
                'family_name': f'AlReformed{i:02d}',
                'koc_id': f'PA{i:04d}',
                'number': candidate_number
            })
            candidate_number += 1
        
        # Party 2 candidates (15)
        for i in range(1, 16):
            candidate_data.append({
                'party': party2,
                'name_first': f'Mohammed',
                'name_second': f'Hassan',
                'name_third': f'Ali',
                'family_name': f'AlNational{i:02d}',
                'koc_id': f'NC{i:04d}',
                'number': candidate_number
            })
            candidate_number += 1
        
        # Independent candidates (5)
        for i in range(1, 6):
            candidate_data.append({
                'party': None,
                'name_first': f'Khalid',
                'name_second': f'Yousef',
                'name_third': f'Ibrahim',
                'family_name': f'Independent{i:02d}',
                'koc_id': f'IND{i:04d}',
                'number': candidate_number
            })
            candidate_number += 1
        
        # Create electors and candidates
        created_count = 0
        for data in candidate_data:
            koc_id = data['koc_id']
            
            # Create or get elector
            elector, elector_created = Elector.objects.get_or_create(
                koc_id=koc_id,
                defaults={
                    'name_first': data['name_first'],
                    'name_second': data['name_second'],
                    'name_third': data['name_third'],
                    'family_name': data['family_name'],
                    'gender': 'MALE',
                    'is_active': True,
                    'committee': default_committee,
                }
            )
            
            # Create candidate
            candidate, candidate_created = Candidate.objects.get_or_create(
                election=election,
                elector=elector,
                defaults={
                    'candidate_number': data['number'],
                'party': data['party'],
                    'is_active': True,
                }
            )
            
            if candidate_created:
                created_count += 1
                party_info = f"({data['party'].name})" if data['party'] else "(Independent)"
                self.stdout.write(
                    f'  [OK] Candidate #{data["number"]}: {elector.full_name} {party_info}'
                )
        
        # Summary
        self.stdout.write(self.style.SUCCESS(f'\n=== Demo Election Created Successfully ==='))
        self.stdout.write(f'Election: {election.name}')
        self.stdout.write(f'Parties: 2')
        self.stdout.write(f'  - {party1.name}: {party1.candidate_count} candidates')
        self.stdout.write(f'  - {party2.name}: {party2.candidate_count} candidates')
        independent_count = Candidate.objects.filter(election=election, party=None).count()
        self.stdout.write(f'Independent candidates: {independent_count}')
        self.stdout.write(f'Total candidates: {Candidate.objects.filter(election=election).count()}')
        self.stdout.write(self.style.SUCCESS('\nDone!'))

