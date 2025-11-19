"""
Unit tests for Elector ViewSet.
"""
import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

from apps.electors.models import Elector
from apps.elections.models import Election, Committee
from apps.utils.permissions import IsAdminOrAbove

User = get_user_model()


@pytest.mark.unit
@pytest.mark.django_db
class TestElectorViewSet:
    """Test ElectorViewSet CRUD and custom actions."""
    
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
    
    @pytest.fixture
    def elector(self, committee, admin_user):
        """Create test elector."""
        return Elector.objects.create(
            koc_id='12345',
            name_first='John',
            name_second='Michael',
            family_name='Doe',
            gender='MALE',
            committee=committee,
            created_by=admin_user
        )
    
    def test_list_electors(self, admin_client, elector):
        """Test listing electors."""
        response = admin_client.get('/api/electors/')
        assert response.status_code == status.HTTP_200_OK
        assert 'data' in response.data
        assert 'electors' in response.data['data']
        assert len(response.data['data']['electors']) == 1
    
    def test_list_electors_with_include(self, admin_client, elector):
        """Test listing electors with include parameter."""
        response = admin_client.get('/api/electors/?include=groups,committees')
        assert response.status_code == status.HTTP_200_OK
        assert 'groups' in response.data['data']
        assert 'committees' in response.data['data']
    
    def test_create_elector_admin(self, admin_client, committee):
        """Test admin can create elector."""
        data = {
            'koc_id': '67890',
            'name_first': 'Jane',
            'family_name': 'Smith',
            'gender': 'FEMALE',
            'committee': committee.id
        }
        response = admin_client.post('/api/electors/', data)
        assert response.status_code == status.HTTP_201_CREATED
        assert Elector.objects.filter(koc_id='67890').exists()
    
    def test_create_elector_regular_user_forbidden(self, user_client, committee):
        """Test regular user cannot create elector."""
        data = {
            'koc_id': '67890',
            'name_first': 'Jane',
            'family_name': 'Smith',
            'gender': 'FEMALE',
            'committee': committee.id
        }
        response = user_client.post('/api/electors/', data)
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_retrieve_elector(self, admin_client, elector):
        """Test retrieving a specific elector."""
        response = admin_client.get(f'/api/electors/{elector.koc_id}/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['data']['koc_id'] == '12345'
    
    def test_update_elector_admin(self, admin_client, elector):
        """Test admin can update elector."""
        data = {
            'koc_id': '12345',
            'name_first': 'John',
            'name_second': 'Updated',
            'family_name': 'Doe',
            'gender': 'MALE',
            'committee': elector.committee.id
        }
        response = admin_client.put(f'/api/electors/{elector.koc_id}/', data)
        assert response.status_code == status.HTTP_200_OK
        elector.refresh_from_db()
        assert elector.name_second == 'Updated'
    
    def test_update_elector_regular_user_forbidden(self, user_client, elector):
        """Test regular user cannot update elector."""
        data = {'name_first': 'Updated'}
        response = user_client.patch(f'/api/electors/{elector.koc_id}/', data)
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_delete_elector_admin(self, admin_client, elector):
        """Test admin can delete elector."""
        response = admin_client.delete(f'/api/electors/{elector.koc_id}/')
        assert response.status_code == status.HTTP_200_OK
        assert not Elector.objects.filter(koc_id=elector.koc_id).exists()
    
    def test_filter_by_committee(self, admin_client, elector, committee):
        """Test filtering electors by committee."""
        response = admin_client.get(f'/api/electors/?committee={committee.id}')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']['electors']) == 1
    
    def test_filter_by_gender(self, admin_client, elector):
        """Test filtering electors by gender."""
        response = admin_client.get('/api/electors/?gender=MALE')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']['electors']) == 1
    
    def test_search_electors(self, admin_client, elector):
        """Test searching electors."""
        response = admin_client.get('/api/electors/?search=John')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']['electors']) == 1
    
    def test_search_by_koc_id(self, admin_client, elector):
        """Test searching electors by KOC ID."""
        response = admin_client.get('/api/electors/?search=12345')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']['electors']) == 1
    
    def test_ordering_electors(self, admin_client, elector):
        """Test ordering electors."""
        # Create another elector
        Elector.objects.create(
            koc_id='99999',
            name_first='Alice',
            family_name='Brown',
            gender='FEMALE',
            committee=elector.committee
        )
        
        response = admin_client.get('/api/electors/?ordering=name_first')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']['electors']) == 2
    
    def test_unauthorized_access(self):
        """Test unauthorized access is rejected."""
        client = APIClient()
        response = client.get('/api/electors/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

