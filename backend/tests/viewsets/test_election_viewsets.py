"""
Unit tests for Election ViewSets.
"""
import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

from apps.elections.models import Election, Committee

User = get_user_model()


@pytest.mark.unit
@pytest.mark.django_db
class TestElectionViewSet:
    """Test ElectionViewSet CRUD and custom actions."""
    
    @pytest.fixture
    def admin_user(self, django_user_model):
        """Create admin user."""
        return django_user_model.objects.create_user(
            email='admin@example.com',
            password='testpass123',
            role='ADMIN'
        )
    
    @pytest.fixture
    def regular_user(self, django_user_model):
        """Create regular user."""
        return django_user_model.objects.create_user(
            email='user@example.com',
            password='testpass123',
            role='USER'
        )
    
    @pytest.fixture
    def admin_client(self, admin_user):
        """Create authenticated admin API client."""
        client = APIClient()
        client.force_authenticate(user=admin_user)
        return client
    
    @pytest.fixture
    def user_client(self, regular_user):
        """Create authenticated regular user API client."""
        client = APIClient()
        client.force_authenticate(user=regular_user)
        return client
    
    @pytest.fixture
    def election(self, admin_user):
        """Create test election."""
        return Election.objects.create(
            name='Test Election',
            description='Test description',
            voting_mode='BOTH',
            status='SETUP',
            created_by=admin_user
        )
    
    def test_list_elections(self, admin_client, election):
        """Test listing elections."""
        response = admin_client.get('/api/elections/')
        assert response.status_code == status.HTTP_200_OK
        assert 'data' in response.data
        assert len(response.data['data']) == 1
    
    def test_create_election_admin(self, admin_client):
        """Test admin can create election."""
        data = {
            'name': 'New Election',
            'description': 'New description',
            'voting_mode': 'BOTH',
            'status': 'SETUP'
        }
        response = admin_client.post('/api/elections/', data)
        assert response.status_code == status.HTTP_201_CREATED
        assert Election.objects.filter(name='New Election').exists()
    
    def test_create_election_regular_user_forbidden(self, user_client):
        """Test regular user cannot create election."""
        data = {
            'name': 'New Election',
            'voting_mode': 'BOTH',
            'status': 'SETUP'
        }
        response = user_client.post('/api/elections/', data)
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_retrieve_election(self, admin_client, election):
        """Test retrieving a specific election."""
        response = admin_client.get(f'/api/elections/{election.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['data']['name'] == 'Test Election'
    
    def test_update_election_admin(self, admin_client, election):
        """Test admin can update election."""
        data = {
            'name': 'Updated Election',
            'description': 'Updated description',
            'voting_mode': 'BOTH',
            'status': 'SETUP'
        }
        response = admin_client.put(f'/api/elections/{election.id}/', data)
        assert response.status_code == status.HTTP_200_OK
        election.refresh_from_db()
        assert election.name == 'Updated Election'
    
    def test_update_election_regular_user_forbidden(self, user_client, election):
        """Test regular user cannot update election."""
        data = {'name': 'Updated Election'}
        response = user_client.patch(f'/api/elections/{election.id}/', data)
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_delete_election_admin(self, admin_client, election):
        """Test admin can delete election."""
        response = admin_client.delete(f'/api/elections/{election.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert not Election.objects.filter(id=election.id).exists()
    
    def test_current_election_action(self, admin_client, election):
        """Test current election action."""
        # Election status is 'SETUP' which matches the filter
        response = admin_client.get('/api/elections/current/')
        assert response.status_code == status.HTTP_200_OK
        assert 'data' in response.data
        assert 'election' in response.data['data']
        assert response.data['data']['election']['name'] == 'Test Election'
    
    def test_current_election_not_found(self, admin_client):
        """Test current election when none exists."""
        response = admin_client.get('/api/elections/current/')
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_assign_users_action(self, admin_client, election, regular_user):
        """Test assign users action."""
        data = {'user_ids': [regular_user.id]}
        # Action has custom url_path='assign-users', so URL is: /api/elections/{id}/assign-users/
        response = admin_client.post(f'/api/elections/{election.id}/assign-users/', data, format='json')
        assert response.status_code == status.HTTP_200_OK, (
            f"Expected 200, got {response.status_code}. "
            f"URL: /api/elections/{election.id}/assign-users/. "
            f"Response: {getattr(response, 'data', response.content)}"
        )
        # Refresh election from database to get updated members
        election.refresh_from_db()
        assert regular_user in election.members.all()
    
    def test_assign_users_regular_user_forbidden(self, user_client, election, regular_user):
        """Test regular user cannot assign users."""
        data = {'user_ids': [regular_user.id]}
        response = user_client.post(f'/api/elections/{election.id}/assign-users/', data, format='json')
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_filter_by_status(self, admin_client, election):
        """Test filtering elections by status."""
        response = admin_client.get('/api/elections/?status=SETUP')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']) == 1
    
    def test_search_elections(self, admin_client, election):
        """Test searching elections."""
        response = admin_client.get('/api/elections/?search=Test')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']) == 1
    
    def test_unauthorized_access(self):
        """Test unauthorized access is rejected."""
        client = APIClient()
        response = client.get('/api/elections/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.unit
@pytest.mark.django_db
class TestCommitteeViewSet:
    """Test CommitteeViewSet CRUD operations."""
    
    @pytest.fixture
    def admin_user(self, django_user_model):
        """Create admin user."""
        return django_user_model.objects.create_user(
            email='admin@example.com',
            password='testpass123',
            role='ADMIN'
        )
    
    @pytest.fixture
    def client(self, admin_user):
        """Create authenticated API client."""
        client = APIClient()
        client.force_authenticate(user=admin_user)
        return client
    
    @pytest.fixture
    def election(self, admin_user):
        """Create test election."""
        return Election.objects.create(
            name='Test Election',
            created_by=admin_user
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
    
    def test_list_committees(self, client, committee):
        """Test listing committees."""
        response = client.get('/api/elections/committees/')
        assert response.status_code == status.HTTP_200_OK
        assert 'data' in response.data
        assert len(response.data['data']) == 1
    
    def test_create_committee(self, client, election):
        """Test creating a committee."""
        data = {
            'election': election.id,
            'code': 'C002',
            'name': 'New Committee',
            'gender': 'FEMALE'
        }
        response = client.post('/api/elections/committees/', data)
        assert response.status_code == status.HTTP_201_CREATED
        assert Committee.objects.filter(code='C002').exists()
    
    def test_retrieve_committee(self, client, committee):
        """Test retrieving a specific committee."""
        response = client.get(f'/api/elections/committees/{committee.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['data']['code'] == 'C001'
    
    def test_update_committee(self, client, committee):
        """Test updating a committee."""
        data = {
            'election': committee.election.id,
            'code': 'C001',
            'name': 'Updated Committee',
            'gender': 'MALE'
        }
        response = client.put(f'/api/elections/committees/{committee.id}/', data)
        assert response.status_code == status.HTTP_200_OK
        committee.refresh_from_db()
        assert committee.name == 'Updated Committee'
    
    def test_delete_committee(self, client, committee):
        """Test deleting a committee."""
        response = client.delete(f'/api/elections/committees/{committee.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert not Committee.objects.filter(id=committee.id).exists()
    
    def test_filter_by_election(self, client, election, committee):
        """Test filtering committees by election."""
        response = client.get(f'/api/elections/committees/?election={election.id}')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']) == 1

