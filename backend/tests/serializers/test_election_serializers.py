"""
Unit tests for Election serializers.
"""
import pytest
from django.contrib.auth import get_user_model

from apps.elections.serializers import (
    ElectionSerializer,
    CommitteeSerializer,
    CommitteeCreateSerializer,
    CommitteeListSerializer,
    AddElectionMembersSerializer,
)
from apps.elections.models import Election, Committee

User = get_user_model()


@pytest.mark.unit
@pytest.mark.django_db
class TestElectionSerializer:
    """Test ElectionSerializer."""
    
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
            description='Test description',
            voting_mode='BOTH',
            max_candidates_per_ballot=5,
            allow_partial_voting=True,
            minimum_votes_required=3,
            status='GUARANTEE_PHASE',
            created_by=user
        )
    
    def test_election_serialization(self, election):
        """Test serializing an election."""
        serializer = ElectionSerializer(election)
        data = serializer.data
        
        assert data['id'] == election.id
        assert data['name'] == 'Test Election'
        assert data['voting_mode'] == 'BOTH'
        assert data['voting_mode_display'] == 'Both Options'
        assert data['status'] == 'GUARANTEE_PHASE'
        assert data['status_display'] == 'Guarantee Collection Phase'
        assert 'committee_count' in data
        assert 'member_count' in data
        assert 'created_by_name' in data
    
    def test_committee_count_property(self, election, user):
        """Test committee_count is calculated correctly."""
        Committee.objects.create(
            election=election,
            code='C001',
            name='Committee 1'
        )
        Committee.objects.create(
            election=election,
            code='C002',
            name='Committee 2'
        )
        
        serializer = ElectionSerializer(election)
        assert serializer.data['committee_count'] == 2
    
    def test_member_count_property(self, election, user):
        """Test member_count is calculated correctly."""
        member1 = User.objects.create_user(
            email='member1@example.com',
            password='testpass123'
        )
        member2 = User.objects.create_user(
            email='member2@example.com',
            password='testpass123'
        )
        
        election.members.add(member1, member2)
        
        serializer = ElectionSerializer(election)
        assert serializer.data['member_count'] == 2
    
    def test_read_only_fields(self, election):
        """Test read-only fields cannot be set."""
        data = {
            'id': 999,
            'committee_count': 999,
            'member_count': 999,
            'created_at': '2020-01-01T00:00:00Z'
        }
        serializer = ElectionSerializer(election, data=data, partial=True)
        # Read-only fields should be ignored
        assert serializer.is_valid()


@pytest.mark.unit
@pytest.mark.django_db
class TestCommitteeSerializer:
    """Test CommitteeSerializer."""
    
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
    
    @pytest.fixture
    def committee(self, election):
        """Create test committee."""
        return Committee.objects.create(
            election=election,
            code='C001',
            name='Test Committee',
            gender='MALE',
            location='Building A',
            electors_from=1,
            electors_to=100
        )
    
    def test_committee_serialization(self, committee):
        """Test serializing a committee."""
        serializer = CommitteeSerializer(committee)
        data = serializer.data
        
        assert data['id'] == committee.id
        assert data['code'] == 'C001'
        assert data['name'] == 'Test Committee'
        assert data['gender'] == 'MALE'
        assert data['gender_display'] == 'Male'
        assert data['election_name'] == 'Test Election'
        assert 'elector_count' in data
        assert 'attendance_count' in data
        assert 'attendance_percentage' in data
        assert 'vote_count' in data
    
    def test_assigned_user_names(self, committee, user):
        """Test assigned_user_names property."""
        member1 = User.objects.create_user(
            email='member1@example.com',
            password='testpass123',
            first_name='John',
            last_name='Doe'
        )
        member2 = User.objects.create_user(
            email='member2@example.com',
            password='testpass123',
            first_name='Jane',
            last_name='Smith'
        )
        
        committee.assigned_users.add(member1, member2)
        
        serializer = CommitteeSerializer(committee)
        user_names = serializer.data['assigned_user_names']
        assert len(user_names) == 2
        assert any('John' in name or 'Doe' in name for name in user_names)
        assert any('Jane' in name or 'Smith' in name for name in user_names)


@pytest.mark.unit
@pytest.mark.django_db
class TestCommitteeCreateSerializer:
    """Test CommitteeCreateSerializer."""
    
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
    
    @pytest.fixture
    def member1(self, django_user_model):
        """Create test member."""
        return django_user_model.objects.create_user(
            email='member1@example.com',
            password='testpass123'
        )
    
    @pytest.fixture
    def member2(self, django_user_model):
        """Create test member."""
        return django_user_model.objects.create_user(
            email='member2@example.com',
            password='testpass123'
        )
    
    def test_create_committee(self, election):
        """Test creating a committee."""
        data = {
            'election': election.id,
            'code': 'C001',
            'name': 'Test Committee',
            'gender': 'MALE',
            'location': 'Building A',
            'electors_from': 1,
            'electors_to': 100
        }
        
        serializer = CommitteeCreateSerializer(data=data)
        assert serializer.is_valid()
        
        committee = serializer.save()
        assert committee.code == 'C001'
        assert committee.name == 'Test Committee'
        assert committee.election == election
    
    def test_create_committee_with_assigned_users(self, election, member1, member2):
        """Test creating a committee with assigned users."""
        data = {
            'election': election.id,
            'code': 'C001',
            'name': 'Test Committee',
            'gender': 'MALE',
            'assigned_users': [member1.id, member2.id]
        }
        
        serializer = CommitteeCreateSerializer(data=data)
        assert serializer.is_valid()
        
        committee = serializer.save()
        assert committee.assigned_users.count() == 2
        assert member1 in committee.assigned_users.all()
        assert member2 in committee.assigned_users.all()
    
    def test_update_committee_assigned_users(self, election, member1, member2):
        """Test updating committee assigned users."""
        committee = Committee.objects.create(
            election=election,
            code='C001',
            name='Test Committee',
            gender='MALE'
        )
        committee.assigned_users.add(member1)
        
        # Update to assign member2 instead
        data = {
            'assigned_users': [member2.id]
        }
        
        serializer = CommitteeCreateSerializer(
            committee,
            data=data,
            partial=True
        )
        assert serializer.is_valid()
        
        updated = serializer.save()
        assert updated.assigned_users.count() == 1
        assert member2 in updated.assigned_users.all()
        assert member1 not in updated.assigned_users.all()


@pytest.mark.unit
@pytest.mark.django_db
class TestCommitteeListSerializer:
    """Test CommitteeListSerializer."""
    
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
    
    @pytest.fixture
    def committee(self, election):
        """Create test committee."""
        return Committee.objects.create(
            election=election,
            code='C001',
            name='Test Committee',
            gender='MALE'
        )
    
    def test_list_serializer_fields(self, committee):
        """Test list serializer has correct fields."""
        serializer = CommitteeListSerializer(committee)
        data = serializer.data
        
        # Should have basic fields
        assert 'id' in data
        assert 'code' in data
        assert 'name' in data
        assert 'gender' in data
        assert 'gender_display' in data
        
        # Should NOT have assigned_users details (lighter weight)
        assert 'assigned_user_names' not in data


@pytest.mark.unit
@pytest.mark.django_db
class TestAddElectionMembersSerializer:
    """Test AddElectionMembersSerializer."""
    
    def test_valid_user_ids(self):
        """Test validation with valid user IDs."""
        data = {
            'user_ids': [1, 2, 3]
        }
        serializer = AddElectionMembersSerializer(data=data)
        assert serializer.is_valid()
    
    def test_empty_user_ids(self):
        """Test validation rejects empty user IDs."""
        data = {
            'user_ids': []
        }
        serializer = AddElectionMembersSerializer(data=data)
        assert not serializer.is_valid()
        assert 'user_ids' in serializer.errors
    
    def test_invalid_user_id_format(self):
        """Test validation rejects invalid user ID format."""
        data = {
            'user_ids': [0, -1]  # Invalid IDs (min_value=1)
        }
        serializer = AddElectionMembersSerializer(data=data)
        assert not serializer.is_valid()

