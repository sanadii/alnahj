from __future__ import annotations

import random
import string
import logging
from typing import Dict, Any, List, Optional

from django.db.models import Max
from django.utils import timezone
from django.utils.crypto import get_random_string

from apps.account.models import CustomUser
from apps.attendees.models import Attendance
from apps.candidates.models import Candidate, Party
from apps.demos.models import DemoSeedJob
from apps.electors.models import Elector
from apps.elections.models import Committee
from apps.guarantees.models import Guarantee

logger = logging.getLogger(__name__)

PARTY_PREFIXES = [
  'Democratic', 'Progressive', 'National', 'People\'s', 'Liberal',
  'Conservative', 'Renewal', 'Alliance', 'Unity', 'Heritage', 'Vision', 'Prosperity'
]

PARTY_SUFFIXES = [
  'Movement', 'Front', 'Alliance', 'Coalition', 'Union', 'Group',
  'Committee', 'Council', 'Party', 'League', 'Bloc', 'Forum'
]

CANDIDATE_FIRST_NAMES = [
  'Ahmed', 'Mohammed', 'Ali', 'Hassan', 'Omar', 'Khalid', 'Saeed', 'Yousef',
  'Fatima', 'Aisha', 'Mariam', 'Noor', 'Layla', 'Zainab', 'Sarah', 'Hala',
  'Abdullah', 'Ibrahim', 'Yusuf', 'Hamza', 'Tariq', 'Nasser', 'Faisal', 'Salem'
]

CANDIDATE_LAST_NAMES = [
  'Al-Ahmad', 'Al-Mohammed', 'Al-Hassan', 'Al-Omar', 'Al-Khalid', 'Al-Saeed',
  'Al-Yousef', 'Al-Abdullah', 'Al-Ibrahim', 'Al-Yusuf', 'Al-Hamza', 'Al-Tariq',
  'Al-Nasser', 'Al-Faisal', 'Al-Salem', 'Al-Mansour', 'Al-Rashid', 'Al-Mahmoud'
]

COMMITTEE_LOCATIONS = [
  'Main Hall', 'North Wing', 'South Wing', 'East Building', 'West Building',
  'Conference Center', 'Auditorium A', 'Auditorium B', 'Training Room 1',
  'Training Room 2', 'Exhibition Hall', 'Multi-Purpose Hall'
]

USER_FIRST_NAMES = [
  'Khalid', 'Fahad', 'Nasser', 'Saud', 'Turki', 'Bandar', 'Mishal', 'Faisal',
  'Noura', 'Hessa', 'Lulwa', 'Shaikha', 'Amal', 'Reem', 'Dana', 'Rana'
]

USER_LAST_NAMES = [
  'Al-Rashid', 'Al-Mansour', 'Al-Saud', 'Al-Khalifa', 'Al-Thani', 'Al-Nahyan',
  'Al-Maktoum', 'Al-Sabah', 'Al-Hashimi', 'Al-Zahrani', 'Al-Ghamdi', 'Al-Mutairi'
]


class DemoSeedService:
  """Backend orchestration for demo data generation."""

  PHASE_ORDER = ['parties', 'committees', 'users', 'guarantees', 'attendance']

  def __init__(self, job: DemoSeedJob):
    self.job = job
    self.config = job.config or {}
    self.progress = job.progress or {}
    self._members_cache: Optional[List[CustomUser]] = None

  # Public API ----------------------------------------------------------------
  def run(self):
    self.job.mark_running()
    self.progress = self.progress or {}

    try:
      for phase in self.PHASE_ORDER:
        phase_config = self.config.get(phase, {})
        enabled = phase_config.get('enabled', True)

        if not enabled:
          self._update_progress(phase, {'status': 'skipped'})
          continue

        self.job.mark_running(phase)
        handler = getattr(self, f'_run_{phase}', None)
        if not handler:
          logger.info('No handler implemented for phase %s', phase)
          self._update_progress(phase, {'status': 'pending'})
          continue

        handler(phase_config)

      self.job.mark_complete()
    except Exception as exc:  # pragma: no cover - defensive logging
      logger.exception('Demo seed job failed (id=%s)', self.job.id)
      self.job.mark_failed(
        {
          'phase': self.job.current_phase,
          'message': str(exc),
          'timestamp': timezone.now().isoformat(),
        }
      )
      raise

  # Phase Handlers -------------------------------------------------------------
  def _run_parties(self, config: Dict[str, Any]):
    election = self.job.election
    party_count = max(int(config.get('count', 0)), 0)
    candidates_per_party = max(int(config.get('candidates_per_party', 0)), 0)
    independent_candidates = max(int(config.get('independent_candidates', 0)), 0)

    created_parties: List[Party] = []
    for idx in range(party_count):
      name = self._generate_party_name(idx + Party.objects.filter(election=election).count())
      party = Party.objects.create(
        election=election,
        name=name,
        color=self._random_color(),
        description=f'Demo party {name}',
      )
      created_parties.append(party)

    max_candidate_number = Candidate.objects.filter(election=election).aggregate(
      Max('candidate_number')
    )['candidate_number__max'] or 0

    created_candidates = 0
    for party in created_parties:
      for _ in range(candidates_per_party):
        max_candidate_number += 1
        Candidate.objects.create(
          election=election,
          name=self._generate_candidate_name(),
          candidate_number=max_candidate_number,
          party=party,
        )
        created_candidates += 1

    for _ in range(independent_candidates):
      max_candidate_number += 1
      Candidate.objects.create(
        election=election,
        name=self._generate_candidate_name(),
        candidate_number=max_candidate_number,
        party=None,
      )
      created_candidates += 1

    self._update_progress(
      'parties',
      {
        'status': 'completed',
        'created_parties': len(created_parties),
        'created_candidates': created_candidates,
      },
    )

  def _run_committees(self, config: Dict[str, Any]):
    election = self.job.election
    committee_count = max(int(config.get('count', 0)), 0)
    created_committees = 0
    existing_codes = set(election.committees.values_list('code', flat=True))

    for idx in range(committee_count):
      code = self._generate_unique_committee_code(existing_codes, idx)
      existing_codes.add(code)
      gender = 'MALE' if idx % 2 == 0 else 'FEMALE'
      location = random.choice(COMMITTEE_LOCATIONS)

      Committee.objects.create(
        election=election,
        code=code,
        name=f'{gender.title()} Committee - {location}',
        gender=gender,
        location=location,
      )
      created_committees += 1

    self._update_progress(
      'committees',
      {
        'status': 'completed',
        'created_committees': created_committees,
      },
    )

  def _run_users(self, config: Dict[str, Any]):
    election = self.job.election
    user_count = max(int(config.get('count', 0)), 0)
    assign_to_committees = bool(config.get('assign_to_committees', True))
    committees = list(election.committees.all())

    created_users: List[CustomUser] = []
    for _ in range(user_count):
      profile = self._generate_user_profile()
      user = CustomUser.objects.create_user(
        email=profile['email'],
        password=profile['password'],
        first_name=profile['first_name'],
        last_name=profile['last_name'],
        phone=profile['phone'],
        role='USER',
        is_active=True,
      )
      election.members.add(user)
      created_users.append(user)

      if assign_to_committees and committees:
        committee = random.choice(committees)
        committee.assigned_users.add(user)

    if created_users:
      self._refresh_members_cache()

    self._update_progress(
      'users',
      {
        'status': 'completed',
        'created_users': len(created_users),
      },
    )

  def _run_guarantees(self, config: Dict[str, Any]):
    election = self.job.election
    members = self._get_members()
    if not members:
      raise ValueError('No election members available to create guarantees.')

    batch_size = max(int(config.get('batch_size', 100)), 1)
    total_limit = config.get('total_limit')
    guarantee_status = config.get('guarantee_status', 'GUARANTEED')

    electors = list(
      Elector.objects.filter(committee__election=election, is_active=True).order_by('?')[:2000]
    )
    if not electors:
      raise ValueError('No electors available for this election.')

    target_total = min(total_limit or len(electors), len(electors))
    created = 0
    batches = 0
    idx = 0

    while created < target_total and idx < len(electors):
      batch = electors[idx : idx + batch_size]
      idx += batch_size
      batches += 1

      for elector in batch:
        user = random.choice(members)
        defaults = {
          'guarantee_status': guarantee_status,
        }
        _, created_flag = Guarantee.objects.get_or_create(
          user=user,
          elector=elector,
          defaults=defaults,
        )
        if created_flag:
          created += 1
        if created >= target_total:
          break

    self._update_progress(
      'guarantees',
      {
        'status': 'completed',
        'total_created': created,
        'batches': batches,
      },
    )

  def _run_attendance(self, config: Dict[str, Any]):
    election = self.job.election
    members = self._get_members()
    committees = list(election.committees.all())
    if not committees:
      raise ValueError('No committees available for attendance simulation.')

    electors = list(
      Elector.objects.filter(committee__election=election, is_active=True).order_by('?')[:5000]
    )
    if not electors:
      raise ValueError('No electors available for attendance simulation.')

    total_electors = len(electors)
    target_rate = float(config.get('rate', 0.75))
    target_total = max(int(total_electors * target_rate), 1)
    batch_size = max(int(config.get('batch_size', 50)), 1)

    created = 0
    batches = 0
    idx = 0

    while created < target_total and idx < len(electors):
      batch = electors[idx : idx + batch_size]
      idx += batch_size
      batches += 1

      for elector in batch:
        if Attendance.objects.filter(elector=elector).exists():
          continue

        committee = elector.committee or random.choice(committees)
        marked_by = random.choice(members) if members else None

        Attendance.objects.create(
          elector=elector,
          committee=committee,
          marked_by=marked_by,
          status=Attendance.Status.ATTENDED,
        )
        created += 1
        if created >= target_total:
          break

    rate = created / total_electors if total_electors else 0
    self._update_progress(
      'attendance',
      {
        'status': 'completed',
        'total_created': created,
        'batches': batches,
        'rate': round(rate, 2),
      },
    )

  # Helpers -------------------------------------------------------------------
  def _update_progress(self, phase: str, data: Dict[str, Any]):
    progress = self.progress or {}
    progress.setdefault(phase, {}).update(data)
    self.progress = progress
    DemoSeedJob.objects.filter(pk=self.job.pk).update(progress=progress, updated_at=timezone.now())

  def _generate_party_name(self, seed: int) -> str:
    prefix = PARTY_PREFIXES[seed % len(PARTY_PREFIXES)]
    suffix = random.choice(PARTY_SUFFIXES)
    return f'{prefix} {suffix}'

  def _random_color(self) -> str:
    return '#' + ''.join(random.choices('0123456789ABCDEF', k=6))

  def _generate_candidate_name(self) -> str:
    return f"{random.choice(CANDIDATE_FIRST_NAMES)} {random.choice(CANDIDATE_LAST_NAMES)}"

  def _generate_unique_committee_code(self, existing_codes: set, idx: int) -> str:
    while True:
      code = f'C-{idx + 1}-{get_random_string(3).upper()}'
      if code not in existing_codes:
        return code
      idx += 1

  def _generate_user_profile(self) -> Dict[str, str]:
    first_name = random.choice(USER_FIRST_NAMES)
    last_name = random.choice(USER_LAST_NAMES)
    timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
    random_suffix = get_random_string(4, allowed_chars=string.ascii_lowercase + string.digits)
    email = f"{first_name.lower()}.{last_name.lower()}.{timestamp}.{random_suffix}@demo.election.kw"
    phone = f"5{random.randint(1000000, 9999999):07d}"
    password = get_random_string(12)
    return {
      'first_name': first_name,
      'last_name': last_name,
      'email': email,
      'phone': phone,
      'password': password,
    }

  def _get_members(self) -> List[CustomUser]:
    if self._members_cache is None:
      self._refresh_members_cache()
    return self._members_cache

  def _refresh_members_cache(self):
    self._members_cache = list(self.job.election.members.filter(is_active=True))

