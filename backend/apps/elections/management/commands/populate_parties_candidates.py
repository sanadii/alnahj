"""
Management command to populate parties and candidates for the current election.

Usage:
    python manage.py populate_parties_candidates
"""
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.elections.models import Election
from apps.candidates.models import Party, Candidate


class Command(BaseCommand):
    help = 'Populate parties and candidates for the current election'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing parties and candidates before populating',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('=' * 70))
        self.stdout.write(self.style.SUCCESS('Populating Parties and Candidates'))
        self.stdout.write(self.style.SUCCESS('=' * 70))
        self.stdout.write('')

        # Get or create current election
        election = Election.objects.first()
        if not election:
            self.stdout.write(self.style.ERROR('No election found!'))
            self.stdout.write(self.style.WARNING('Creating a new election...'))
            election = Election.objects.create(
                name='Kuwait Parliamentary Election 2025',
                description='Kuwait National Assembly Election',
                status='SETUP',
                voting_mode='BOTH',
                max_candidates_per_ballot=19,
                allow_partial_voting=True,
                minimum_votes_required=1
            )
            self.stdout.write(self.style.SUCCESS('Created election successfully'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Using election: {election.id}'))
        
        self.stdout.write('')

        # Clear existing data if requested
        if options['clear']:
            self.stdout.write(self.style.WARNING('Clearing existing parties and candidates...'))
            deleted_candidates = Candidate.objects.filter(election=election).delete()
            deleted_parties = Party.objects.filter(election=election).delete()
            self.stdout.write(self.style.SUCCESS(f'   Deleted {deleted_candidates[0]} candidates'))
            self.stdout.write(self.style.SUCCESS(f'   Deleted {deleted_parties[0]} parties'))
            self.stdout.write('')

        # Populate parties
        self.stdout.write(self.style.SUCCESS('Creating Political Parties...'))
        self.stdout.write('')
        
        parties_data = [
            {
                'name': 'التحالف الديمقراطي',  # Democratic Alliance
                'color': '#2196F3',
                'description': 'التحالف الديمقراطي الكويتي'
            },
            {
                'name': 'التجمع الشعبي',  # Popular Gathering
                'color': '#4CAF50',
                'description': 'التجمع الشعبي الإسلامي'
            },
            {
                'name': 'الحركة الدستورية',  # Constitutional Movement
                'color': '#FF9800',
                'description': 'الحركة الدستورية الإسلامية (حدس)'
            },
            {
                'name': 'التحالف الوطني',  # National Alliance
                'color': '#9C27B0',
                'description': 'التحالف الوطني الكويتي'
            },
            {
                'name': 'مستقل',  # Independent
                'color': '#607D8B',
                'description': 'مرشحون مستقلون'
            },
        ]

        created_parties = {}
        
        with transaction.atomic():
            for party_data in parties_data:
                party, created = Party.objects.get_or_create(
                    election=election,
                    name=party_data['name'],
                    defaults={
                        'color': party_data['color'],
                        'description': party_data['description'],
                        'is_active': True
                    }
                )
                
                created_parties[party_data['name']] = party
                
                status = 'Created' if created else 'Updated'
                self.stdout.write(
                    f"{status} Party: {party.name} - {party.color}"
                )

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(f'Created/Updated {len(parties_data)} parties'))
        self.stdout.write('')

        # Populate candidates
        self.stdout.write(self.style.SUCCESS('Creating Candidates...'))
        self.stdout.write('')
        
        # Sample candidates (you can customize this list)
        candidates_data = [
            # Democratic Alliance
            {'number': 1, 'name': 'أحمد عبدالله الكندري', 'party': 'التحالف الديمقراطي'},
            {'number': 2, 'name': 'فاطمة محمد العنزي', 'party': 'التحالف الديمقراطي'},
            {'number': 3, 'name': 'خالد سعد المطيري', 'party': 'التحالف الديمقراطي'},
            {'number': 4, 'name': 'نورة حمد الرشيدي', 'party': 'التحالف الديمقراطي'},

            # Popular Gathering
            {'number': 5, 'name': 'عبدالعزيز ناصر العتيبي', 'party': 'التجمع الشعبي'},
            {'number': 6, 'name': 'سارة علي الدوسري', 'party': 'التجمع الشعبي'},
            {'number': 7, 'name': 'محمد فهد الشمري', 'party': 'التجمع الشعبي'},
            {'number': 8, 'name': 'منى إبراهيم الهاجري', 'party': 'التجمع الشعبي'},

            # Constitutional Movement
            {'number': 9, 'name': 'سعد مبارك العجمي', 'party': 'الحركة الدستورية'},
            {'number': 10, 'name': 'ريم عبدالرحمن الصباح', 'party': 'الحركة الدستورية'},
            {'number': 11, 'name': 'فيصل أحمد الخالد', 'party': 'الحركة الدستورية'},
            {'number': 12, 'name': 'لطيفة سالم العنزي', 'party': 'الحركة الدستورية'},

            # National Alliance
            {'number': 13, 'name': 'بدر خليفة الشايع', 'party': 'التحالف الوطني'},
            {'number': 14, 'name': 'مريم حسن البدر', 'party': 'التحالف الوطني'},
            {'number': 15, 'name': 'عثمان راشد الزيد', 'party': 'التحالف الوطني'},
            {'number': 16, 'name': 'هند يوسف القطامي', 'party': 'التحالف الوطني'},

            # Independents
            {'number': 17, 'name': 'عبدالله صالح الرومي', 'party': 'مستقل'},
            {'number': 18, 'name': 'جاسم مشعل الصقر', 'party': 'مستقل'},
            {'number': 19, 'name': 'هدى عادل السعيد', 'party': 'مستقل'},
            {'number': 20, 'name': 'طلال فهد العوضي', 'party': 'مستقل'},
        ]

        created_count = 0
        updated_count = 0
        
        with transaction.atomic():
            for candidate_data in candidates_data:
                party = created_parties.get(candidate_data['party'])
                
                candidate, created = Candidate.objects.update_or_create(
                    election=election,
                    candidate_number=candidate_data['number'],
                    defaults={
                        'name': candidate_data['name'],
                        'party': party,
                        'is_active': True
                    }
                )
                
                if created:
                    created_count += 1
                    status_icon = 'Created'
                else:
                    updated_count += 1
                    status_icon = 'Updated'
                
                party_name = party.name if party else 'مستقل'
                # Avoid printing Arabic names to console (Windows encoding issue)
                self.stdout.write(
                    f"{status_icon} #{candidate.candidate_number:02d} - ({party_name})"
                )

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=' * 70))
        self.stdout.write(self.style.SUCCESS('Summary'))
        self.stdout.write(self.style.SUCCESS('=' * 70))
        self.stdout.write(self.style.SUCCESS(f'Election ID: {election.id}'))
        self.stdout.write(self.style.SUCCESS(f'Parties: {len(created_parties)}'))
        self.stdout.write(self.style.SUCCESS(f'Candidates Created: {created_count}'))
        self.stdout.write(self.style.SUCCESS(f'Candidates Updated: {updated_count}'))
        self.stdout.write(self.style.SUCCESS(f'Total Candidates: {created_count + updated_count}'))
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('Database population complete!'))
        self.stdout.write('')
        
        # Show party distribution
        self.stdout.write(self.style.WARNING('Candidate Distribution by Party:'))
        for party_name, party in created_parties.items():
            count = Candidate.objects.filter(election=election, party=party, is_active=True).count()
            self.stdout.write(f'   {party_name}: {count} candidates')
        
        self.stdout.write('')

