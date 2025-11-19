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

