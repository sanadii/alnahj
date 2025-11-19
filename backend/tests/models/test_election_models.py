"""
Unit tests for Election models.
"""
import pytest
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import date, timedelta

from apps.elections.models import Election, Committee

User = get_user_model()


@pytest.mark.unit
@pytest.mark.django_db
class TestElection:
    """Test Election model."""
    
    @pytest.fixture
    def user(self, django_user_model):
        """Create test user."""
        return django_user_model.objects.create_user(
            email='admin@example.com',
            password='testpass123',
            role='ADMIN'
        )
    
    def test_create_election(self, user):
        """Test creating an election."""
        election = Election.objects.create(
            name='Test Election 2025',
            description='Test election description',
            voting_mode='BOTH',
            max_candidates_per_ballot=19,
            status='SETUP',
            election_date=date.today() + timedelta(days=30),
            created_by=user
        )
        
        assert election.name == 'Test Election 2025'
        assert election.description == 'Test election description'
        assert election.voting_mode == 'BOTH'
        assert election.max_candidates_per_ballot == 19
        assert election.status == 'SETUP'
        assert election.created_by == user
        assert election.created_at is not None
    
    def test_election_str(self, user):
        """Test Election string representation."""
        election = Election.objects.create(
            name='Test Election',
            created_by=user
        )
        assert str(election) == 'Test Election'
    
    def test_default_voting_mode(self, user):
        """Test default voting mode."""
        election = Election.objects.create(
            name='Test Election',
            created_by=user
        )
        assert election.voting_mode == 'BOTH'
    
    def test_default_status(self, user):
        """Test default status."""
        election = Election.objects.create(
            name='Test Election',
            created_by=user
        )
        assert election.status == 'SETUP'
    
    def test_default_max_candidates(self, user):
        """Test default max candidates per ballot."""
        election = Election.objects.create(
            name='Test Election',
            created_by=user
        )
        assert election.max_candidates_per_ballot == 19
    
    def test_default_allow_partial_voting(self, user):
        """Test default allow_partial_voting."""
        election = Election.objects.create(
            name='Test Election',
            created_by=user
        )
        assert election.allow_partial_voting is True
    
    def test_election_members(self, user):
        """Test adding members to election."""
        election = Election.objects.create(
            name='Test Election',
            created_by=user
        )
        
        member1 = User.objects.create_user(
            email='member1@example.com',
            password='testpass123'
        )
        member2 = User.objects.create_user(
            email='member2@example.com',
            password='testpass123'
        )
        
        election.members.add(member1, member2)
        assert election.members.count() == 2
        assert member1 in election.members.all()
        assert member2 in election.members.all()


@pytest.mark.unit
@pytest.mark.django_db
class TestCommittee:
    """Test Committee model."""
    
    @pytest.fixture
    def user(self, django_user_model):
        """Create test user."""
        return django_user_model.objects.create_user(
            email='admin@example.com',
            password='testpass123',
            role='ADMIN'
        )
    
    @pytest.fixture
    def election(self, user):
        """Create test election."""
        return Election.objects.create(
            name='Test Election',
            created_by=user
        )
    
    def test_create_committee(self, election):
        """Test creating a committee."""
        committee = Committee.objects.create(
            election=election,
            code='C001',
            name='Committee 1',
            location='Ahmadi HQ',
            gender='MIXED'
        )
        
        assert committee.election == election
        assert committee.code == 'C001'
        assert committee.name == 'Committee 1'
        assert committee.location == 'Ahmadi HQ'
        assert committee.gender == 'MIXED'
        assert committee.created_at is not None
    
    def test_committee_str(self, election):
        """Test Committee string representation."""
        committee = Committee.objects.create(
            election=election,
            code='C001',
            name='Committee 1'
        )
        assert str(committee) == 'C001 - Committee 1'
    
    def test_default_gender(self, election):
        """Test default gender."""
        committee = Committee.objects.create(
            election=election,
            code='C001',
            name='Committee 1'
        )
        assert committee.gender == 'MIXED'
    
    def test_committee_unique_code_per_election(self, election):
        """Test that committee code must be unique per election."""
        Committee.objects.create(
            election=election,
            code='C001',
            name='Committee 1'
        )
        
        # Creating another committee with same code in same election should fail
        with pytest.raises(Exception):  # IntegrityError
            Committee.objects.create(
                election=election,
                code='C001',
                name='Committee 2'
            )
    
    def test_multiple_committees_same_code_different_elections(self, user):
        """Test that same code can exist in different elections."""
        election1 = Election.objects.create(
            name='Election 1',
            created_by=user
        )
        election2 = Election.objects.create(
            name='Election 2',
            created_by=user
        )
        
        committee1 = Committee.objects.create(
            election=election1,
            code='C001',
            name='Committee 1'
        )
        committee2 = Committee.objects.create(
            election=election2,
            code='C001',
            name='Committee 1'
        )
        
        assert committee1.code == committee2.code == 'C001'
        assert committee1.election != committee2.election

