"""
Factory Boy factories for test data generation.

Replaces manual factory fixtures with proper Factory Boy factories for
cleaner, more maintainable test data creation.

Migration completed successfully! Factory Boy is now active.
"""
import random
from django.contrib.auth import get_user_model

from apps.elections.models import Election, Committee
from apps.electors.models import Elector
from apps.candidates.models import Candidate, Party
from apps.attendees.models import Attendance, AttendanceStatistics

User = get_user_model()

# ============================================================================
# Factory Boy imports - compatibility issue resolved!
# ============================================================================
from factory.django import DjangoModelFactory
from factory import Sequence, Faker, SubFactory, PostGenerationMethodCall
# ============================================================================


class UserFactory(DjangoModelFactory):
    """Factory for User model."""
    
    class Meta:
        model = User
        django_get_or_create = ('email',)
    
    email = Sequence(lambda n: f'user{n}@example.com')
    password = PostGenerationMethodCall('set_password', 'testpass123')
    first_name = Faker('first_name')
    last_name = Faker('last_name')
    role = 'USER'
    is_active = True


class AdminUserFactory(UserFactory):
    """Factory for admin users."""
    email = Sequence(lambda n: f'admin{n}@example.com')
    role = 'ADMIN'
    first_name = 'Admin'
    last_name = 'User'


class SupervisorUserFactory(UserFactory):
    """Factory for supervisor users."""
    email = Sequence(lambda n: f'supervisor{n}@example.com')
    role = 'SUPERVISOR'
    first_name = 'Supervisor'
    last_name = 'User'


class ElectionFactory(DjangoModelFactory):
    """Factory for Election model."""
    
    class Meta:
        model = Election
        django_get_or_create = ('name',)
    
    name = Sequence(lambda n: f'Test Election {n}')
    description = Faker('text', max_nb_chars=200)
    voting_mode = 'BOTH'
    status = 'SETUP'
    max_candidates_per_ballot = 19
    allow_partial_voting = True
    minimum_votes_required = 1
    created_by = SubFactory(AdminUserFactory)


class CommitteeFactory(DjangoModelFactory):
    """Factory for Committee model."""
    
    class Meta:
        model = Committee
        django_get_or_create = ('election', 'code')
    
    election = SubFactory(ElectionFactory)
    code = Sequence(lambda n: f'CMT-{n:03d}')
    name = Sequence(lambda n: f'Committee {n}')
    location = Faker('city')
    gender = 'MIXED'


class ElectorFactory(DjangoModelFactory):
    """Factory for Elector model."""
    
    class Meta:
        model = Elector
        django_get_or_create = ('koc_id',)
    
    koc_id = Sequence(lambda n: f'KOC{n:05d}')
    name_first = Faker('first_name')
    name_second = Faker('first_name')
    name_third = ''
    name_fourth = ''
    name_fifth = ''
    name_sixth = ''
    sub_family_name = ''
    family_name = Faker('last_name')
    designation = Faker('job')
    section = Faker('word')
    extension = Faker('numerify', text='####')
    mobile = Faker('phone_number')
    area = Faker('city')
    department = Faker('word')
    team = Faker('word')
    committee = SubFactory(CommitteeFactory)
    gender = Sequence(lambda n: random.choice(['MALE', 'FEMALE']))
    is_active = True
    is_approved = True


class PartyFactory(DjangoModelFactory):
    """Factory for Party model."""
    
    class Meta:
        model = Party
        django_get_or_create = ('election', 'name')
    
    election = SubFactory(ElectionFactory)
    name = Sequence(lambda n: f'Party {n}')
    color = Faker('hex_color')
    description = Faker('text', max_nb_chars=200)
    is_active = True


class CandidateFactory(DjangoModelFactory):
    """Factory for Candidate model."""
    
    class Meta:
        model = Candidate
        django_get_or_create = ('election', 'candidate_number')
    
    election = SubFactory(ElectionFactory)
    name = Faker('name')
    candidate_number = Sequence(lambda n: n + 1)
    party = None  # Independent by default
    is_active = True


class AttendanceFactory(DjangoModelFactory):
    """Factory for Attendance model."""
    
    class Meta:
        model = Attendance
        django_get_or_create = ('elector',)
    
    elector = SubFactory(ElectorFactory)
    committee = None  # Will be set from elector's committee
    marked_by = SubFactory(AdminUserFactory)
    notes = ''
    device_info = {}


class AttendanceStatisticsFactory(DjangoModelFactory):
    """Factory for AttendanceStatistics model."""
    
    class Meta:
        model = AttendanceStatistics
        django_get_or_create = ('committee',)
    
    committee = SubFactory(CommitteeFactory)
    total_electors = 0
    total_attended = 0
    hourly_breakdown = {}

