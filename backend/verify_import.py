import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.candidates.models import Party, Candidate
from apps.elections.models import Election

election = Election.objects.first()

# Write output to file with UTF-8 encoding
with open('import_verification.txt', 'w', encoding='utf-8') as f:
    f.write(f'Election: {election.name}\n')
    f.write(f'\nParties:\n')
    for party in Party.objects.filter(election=election):
        f.write(f'  ID {party.id}: {party.name} (Color: {party.color})\n')
        f.write(f'    Candidates: {party.candidates.count()}\n')

    f.write(f'\nTotal Candidates: {Candidate.objects.filter(election=election).count()}\n')

    f.write(f'\nFirst 5 Candidates:\n')
    for c in Candidate.objects.filter(election=election)[:5]:
        party_name = c.party.name if c.party else 'Independent'
        f.write(f'  #{c.candidate_number}: {c.name} ({party_name})\n')

    f.write(f'\nLast 5 Candidates:\n')
    for c in Candidate.objects.filter(election=election).order_by('-candidate_number')[:5]:
        party_name = c.party.name if c.party else 'Independent'
        f.write(f'  #{c.candidate_number}: {c.name} ({party_name})\n')

    f.write(f'\nBreakdown by party:\n')
    for party in Party.objects.filter(election=election):
        count = Candidate.objects.filter(election=election, party=party).count()
        f.write(f'  {party.name}: {count} candidates\n')

print('Verification complete! Check import_verification.txt')

