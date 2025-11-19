# Migration Guide: Manual Factories → Factory Boy

This guide provides step-by-step instructions for migrating from manual factories to Factory Boy once the Python 3.13 compatibility issue is resolved.

## Prerequisites

1. **Verify Factory Boy compatibility**: Test that Factory Boy imports successfully:
   ```bash
   python -c "from factory.django import DjangoModelFactory; print('OK')"
   ```

2. **Backup current conftest.py**: 
   ```bash
   cp tests/conftest.py tests/conftest.py.backup
   ```

## Migration Steps

### Step 1: Update `tests/conftest.py`

Replace the entire file content with:

```python
"""
Shared pytest fixtures for backend test suite.

Uses Factory Boy factories for test data generation. Fixtures provide
backward-compatible access to factories while leveraging Factory Boy's
powerful features.
"""
import pytest

from .factories import (
    AdminUserFactory,
    SupervisorUserFactory,
    UserFactory,
    ElectionFactory,
    CommitteeFactory,
    ElectorFactory,
    CandidateFactory,
    PartyFactory,
)


@pytest.fixture
def admin_user():
    """Reusable admin-level user."""
    return AdminUserFactory()


@pytest.fixture
def supervisor_user():
    """Reusable supervisor-level user."""
    return SupervisorUserFactory()


@pytest.fixture
def regular_user():
    """Reusable regular user."""
    return UserFactory()


@pytest.fixture
def election(admin_user):
    """Baseline election."""
    return ElectionFactory(created_by=admin_user, name='Test Election')


@pytest.fixture
def committee_factory(election):
    """
    Factory for committees tied to the active election.
    
    Returns a callable that creates Committee instances using Factory Boy.
    Maintains backward compatibility with existing tests.
    """
    def _create(**overrides):
        # Ensure election is set unless explicitly overridden
        if 'election' not in overrides:
            overrides['election'] = election
        return CommitteeFactory(**overrides)
    
    return _create


@pytest.fixture
def committee(committee_factory):
    """Default committee for tests that only need a single instance."""
    return committee_factory()


@pytest.fixture
def elector_factory(committee):
    """
    Factory for electors with sensible defaults.
    
    Returns a callable that creates Elector instances using Factory Boy.
    Maintains backward compatibility with existing tests.
    """
    def _create(**overrides):
        # Ensure committee is set unless explicitly overridden
        if 'committee' not in overrides:
            overrides['committee'] = committee
        return ElectorFactory(**overrides)
    
    return _create


@pytest.fixture
def candidate_factory(election):
    """
    Factory for candidates tied to the active election.
    
    Returns a callable that creates Candidate instances using Factory Boy.
    Maintains backward compatibility with existing tests.
    """
    def _create(number=None, name=None, **overrides):
        # Ensure election is set unless explicitly overridden
        if 'election' not in overrides:
            overrides['election'] = election
        
        # Handle legacy signature: candidate_factory(number, name)
        if number is not None:
            overrides['candidate_number'] = number
        if name is not None:
            overrides['name'] = name
        
        return CandidateFactory(**overrides)
    
    return _create


@pytest.fixture
def party_factory(election):
    """
    Factory for parties tied to the active election.
    
    Returns a callable that creates Party instances using Factory Boy.
    """
    def _create(**overrides):
        # Ensure election is set unless explicitly overridden
        if 'election' not in overrides:
            overrides['election'] = election
        return PartyFactory(**overrides)
    
    return _create
```

### Step 2: Fix `tests/factories.py`

Update the imports to use direct imports (remove the lazy import function):

```python
"""
Factory Boy factories for test data generation.

Replaces manual factory fixtures with proper Factory Boy factories for
cleaner, more maintainable test data creation.
"""
import random
from factory.django import DjangoModelFactory
from factory import Sequence, Faker, SubFactory, PostGenerationMethodCall
from django.contrib.auth import get_user_model

from apps.elections.models import Election, Committee
from apps.electors.models import Elector
from apps.candidates.models import Candidate, Party

User = get_user_model()


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
```

### Step 3: Remove Manual Factory Code

The manual factory code in `tests/conftest.py` will be completely replaced by the Factory Boy version above.

### Step 4: Verify Migration

Run the test suite to ensure everything works:

```bash
# Run all tests
pytest tests/ -v

# Run specific test suites
pytest tests/models/ -v
pytest tests/serializers/ -v
pytest tests/viewsets/ -v
pytest tests/integration/ -v
```

### Step 5: Clean Up

1. Remove `tests/FACTORY_BOY_SETUP.md` (no longer needed)
2. Remove `tests/MIGRATE_TO_FACTORY_BOY.md` (migration complete)
3. Update `tests/conftest.py` docstring to remove compatibility note

## Benefits After Migration

- ✅ Cleaner, more maintainable test data
- ✅ Better defaults with Faker integration
- ✅ Easier to create complex object graphs
- ✅ Less boilerplate code
- ✅ Consistent factory patterns across the codebase

## Rollback Plan

If issues arise, restore the backup:

```bash
cp tests/conftest.py.backup tests/conftest.py
```

## Notes

- All existing tests should continue to work without modification
- The fixture signatures remain the same (backward compatible)
- Factory Boy provides better defaults and more flexibility
- Faker integration provides realistic test data

