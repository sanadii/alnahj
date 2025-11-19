import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.candidates.models import Candidate
from apps.elections.models import Election

election = Election.objects.first()

# Proper Arabic names for independent candidates
proper_names = {
    31: 'Ø¹Ø¨Ø¯Ø§Ù„Ø¹Ø²ÙŠØ² Ù…Ø­Ù…Ø¯ Ø§Ù„Ø´Ù…Ø±ÙŠ',
    32: 'ÙÙ‡Ø¯ Ø®Ø§Ù„Ø¯ Ø§Ù„Ø¹ØªÙŠØ¨ÙŠ',
    33: 'Ù†Ø§ØµØ± Ø³Ø¹ÙˆØ¯ Ø§Ù„Ù…Ø·ÙŠØ±ÙŠ',
    34: 'Ø¨Ø¯Ø± Ø£Ø­Ù…Ø¯ Ø§Ù„Ø±Ø´ÙŠØ¯ÙŠ',
    35: 'Ø³Ù„Ø·Ø§Ù† Ø¹Ø¨Ø¯Ø§Ù„Ù„Ù‡ Ø§Ù„Ø¯ÙˆØ³Ø±ÙŠ',
    36: 'Ø·Ø§Ø±Ù‚ ÙŠÙˆØ³Ù Ø§Ù„Ø¹Ù†Ø²ÙŠ',
    37: 'Ø±Ø§Ø´Ø¯ Ø¹Ù„ÙŠ Ø§Ù„Ù‡Ø§Ø¬Ø±ÙŠ'
}

# Get independent candidates
independents = Candidate.objects.filter(election=election, party__isnull=True).order_by('candidate_number')

print(f'Found {independents.count()} independent candidates')
print('Fixing names...')

for candidate in independents:
    if candidate.candidate_number in proper_names:
        new_name = proper_names[candidate.candidate_number]
        candidate.name = new_name
        candidate.save()
        print(f'Fixed candidate #{candidate.candidate_number}')

print(f'\nAll independent candidate names have been corrected')