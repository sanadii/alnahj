"""
Unit tests for Guarantee ViewSets.
"""
import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

from apps.guarantees.models import GuaranteeGroup, Guarantee, GuaranteeNote, GuaranteeHistory
from apps.elections.models import Election, Committee
from apps.electors.models import Elector

User = get_user_model()


@pytest.mark.unit
@pytest.mark.django_db
class TestGuaranteeGroupViewSet:
    """Test GuaranteeGroupViewSet CRUD operations."""
    
    @pytest.fixture
    def user(self, django_user_model):
        """Create test user."""
        return django_user_model.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
    
    @pytest.fixture
    def client(self, user):
        """Create authenticated API client."""
        client = APIClient()
        client.force_authenticate(user=user)
        return client
    
    @pytest.fixture
    def group(self, user):
        """Create test guarantee group."""
        return GuaranteeGroup.objects.create(
            user=user,
            name='Test Group',
            color='#FF5722',
            order=1
        )
    
    def test_list_groups(self, client, user, group):
        """Test listing user's guarantee groups."""
        response = client.get('/api/guarantees/groups/')
        assert response.status_code == status.HTTP_200_OK
        assert 'data' in response.data
        assert len(response.data['data']) == 1
        assert response.data['data'][0]['name'] == 'Test Group'
    
    def test_create_group(self, client, user):
        """Test creating a guarantee group."""
        data = {
            'name': 'New Group',
            'color': '#1976d2',
            'description': 'Test description',
            'order': 2
        }
        response = client.post('/api/guarantees/groups/', data)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['data']['name'] == 'New Group'
        assert GuaranteeGroup.objects.filter(user=user, name='New Group').exists()
    
    def test_retrieve_group(self, client, group):
        """Test retrieving a specific group."""
        response = client.get(f'/api/guarantees/groups/{group.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['data']['name'] == 'Test Group'
        assert response.data['data']['color'] == '#FF5722'
    
    def test_update_group(self, client, group):
        """Test updating a guarantee group."""
        data = {
            'name': 'Updated Group',
            'color': '#FF5722',
            'order': 1
        }
        response = client.put(f'/api/guarantees/groups/{group.id}/', data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['data']['name'] == 'Updated Group'
        group.refresh_from_db()
        assert group.name == 'Updated Group'
    
    def test_delete_group(self, client, group):
        """Test deleting a guarantee group."""
        response = client.delete(f'/api/guarantees/groups/{group.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert not GuaranteeGroup.objects.filter(id=group.id).exists()
    
    def test_reorder_group(self, client, group):
        """Test reordering a guarantee group."""
        data = {'new_order': 5}
        response = client.patch(f'/api/guarantees/groups/{group.id}/reorder/', data)
        assert response.status_code == status.HTTP_200_OK
        group.refresh_from_db()
        assert group.order == 5
    
    def test_reorder_group_invalid_data(self, client, group):
        """Test reorder with invalid data."""
        response = client.patch(f'/api/guarantees/groups/{group.id}/reorder/', {})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_user_only_sees_own_groups(self, client, django_user_model):
        """Test user only sees their own groups."""
        other_user = django_user_model.objects.create_user(
            email='other@example.com',
            password='testpass123'
        )
        GuaranteeGroup.objects.create(
            user=other_user,
            name='Other Group'
        )
        
        response = client.get('/api/guarantees/groups/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']) == 0  # Should not see other user's groups


@pytest.mark.unit
@pytest.mark.django_db
class TestGuaranteeViewSet:
    """Test GuaranteeViewSet CRUD and custom actions."""
    
    @pytest.fixture
    def user(self, django_user_model):
        """Create test user."""
        return django_user_model.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
    
    @pytest.fixture
    def client(self, user):
        """Create authenticated API client."""
        client = APIClient()
        client.force_authenticate(user=user)
        return client
    
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
            name='Test Committee'
        )
    
    @pytest.fixture
    def elector(self, committee):
        """Create test elector."""
        return Elector.objects.create(
            koc_id='12345',
            name_first='John',
            family_name='Doe',
            gender='MALE',
            committee=committee
        )
    
    @pytest.fixture
    def group(self, user):
        """Create test guarantee group."""
        return GuaranteeGroup.objects.create(
            user=user,
            name='Test Group'
        )
    
    @pytest.fixture
    def guarantee(self, user, elector, group):
        """Create test guarantee."""
        return Guarantee.objects.create(
            user=user,
            elector=elector,
            guarantee_status='GUARANTEED',
            group=group,
            mobile='12345678'
        )
    
    def test_list_guarantees(self, client, guarantee):
        """Test listing guarantees."""
        response = client.get('/api/guarantees/')
        assert response.status_code == status.HTTP_200_OK
        assert 'data' in response.data
        assert 'guarantees' in response.data['data']
        assert 'statistics' in response.data['data']
        assert 'groups' in response.data['data']
        assert len(response.data['data']['guarantees']) == 1
    
    def test_create_guarantee(self, client, elector, group):
        """Test creating a guarantee."""
        data = {
            'elector': elector.koc_id,
            'guarantee_status': 'GUARANTEED',
            'group': group.id,
            'mobile': '12345678',
            'quick_note': 'Test note'
        }
        response = client.post('/api/guarantees/', data)
        assert response.status_code == status.HTTP_201_CREATED
        # Get the user from the authenticated client
        user = client.handler._force_user
        assert Guarantee.objects.filter(
            user=user,
            elector=elector
        ).exists()
    
    def test_retrieve_guarantee(self, client, guarantee):
        """Test retrieving a specific guarantee."""
        response = client.get(f'/api/guarantees/{guarantee.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['data']['id'] == guarantee.id
    
    def test_update_guarantee(self, client, guarantee):
        """Test updating a guarantee."""
        data = {
            'guarantee_status': 'PENDING',
            'mobile': '87654321',
            'quick_note': 'Updated note'
        }
        response = client.patch(f'/api/guarantees/{guarantee.id}/', data)
        assert response.status_code == status.HTTP_200_OK
        guarantee.refresh_from_db()
        assert guarantee.guarantee_status == 'PENDING'
        assert guarantee.mobile == '87654321'
    
    def test_delete_guarantee(self, client, guarantee):
        """Test deleting a guarantee."""
        response = client.delete(f'/api/guarantees/{guarantee.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert not Guarantee.objects.filter(id=guarantee.id).exists()
    
    def test_quick_update_guarantee(self, client, guarantee):
        """Test quick update action."""
        data = {'guarantee_status': 'PENDING'}
        response = client.patch(f'/api/guarantees/{guarantee.id}/quick-update/', data)
        assert response.status_code == status.HTTP_200_OK
        guarantee.refresh_from_db()
        assert guarantee.guarantee_status == 'PENDING'
    
    def test_bulk_update_guarantees(self, client, user, elector):
        """Test bulk update action."""
        # Create multiple guarantees
        guarantee1 = Guarantee.objects.create(
            user=user,
            elector=elector,
            guarantee_status='GUARANTEED'
        )
        elector2 = Elector.objects.create(
            koc_id='67890',
            name_first='Jane',
            family_name='Smith',
            gender='FEMALE',
            committee=elector.committee
        )
        guarantee2 = Guarantee.objects.create(
            user=user,
            elector=elector2,
            guarantee_status='GUARANTEED'
        )
        
        data = {
            'guarantee_ids': [guarantee1.id, guarantee2.id],
            'guarantee_status': 'PENDING'
        }
        response = client.post('/api/guarantees/bulk-update/', data)
        assert response.status_code == status.HTTP_200_OK
        
        guarantee1.refresh_from_db()
        guarantee2.refresh_from_db()
        assert guarantee1.guarantee_status == 'PENDING'
        assert guarantee2.guarantee_status == 'PENDING'
    
    def test_statistics_action(self, client, guarantee):
        """Test statistics action."""
        response = client.get('/api/guarantees/statistics/')
        assert response.status_code == status.HTTP_200_OK
        assert 'data' in response.data
        stats = response.data['data']
        assert 'total_guarantees' in stats
        assert stats['total_guarantees'] == 1
    
    def test_history_action(self, client, guarantee):
        """Test history action."""
        response = client.get(f'/api/guarantees/{guarantee.id}/history/')
        assert response.status_code == status.HTTP_200_OK
        assert 'data' in response.data
    
    def test_add_note_action(self, client, guarantee):
        """Test add note action."""
        data = {
            'content': 'Test note content',
            'is_important': True
        }
        response = client.post(f'/api/guarantees/{guarantee.id}/add-note/', data)
        assert response.status_code == status.HTTP_201_CREATED
        assert GuaranteeNote.objects.filter(guarantee=guarantee).exists()
    
    def test_list_notes_action(self, client, guarantee):
        """Test list notes action."""
        # Create a note first
        GuaranteeNote.objects.create(
            guarantee=guarantee,
            user=guarantee.user,
            content='Test note'
        )
        
        response = client.get(f'/api/guarantees/{guarantee.id}/notes/')
        assert response.status_code == status.HTTP_200_OK
        assert 'data' in response.data
        assert len(response.data['data']) == 1
    
    def test_search_elector_action(self, client, elector):
        """Test search elector action."""
        response = client.get('/api/guarantees/search-elector/', {'q': 'John'})
        assert response.status_code == status.HTTP_200_OK
        assert 'data' in response.data
    
    def test_filter_by_status(self, client, guarantee):
        """Test filtering guarantees by status."""
        response = client.get('/api/guarantees/?guarantee_status=GUARANTEED')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']['guarantees']) == 1
        
        response = client.get('/api/guarantees/?guarantee_status=PENDING')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']['guarantees']) == 0
    
    def test_search_guarantees(self, client, guarantee):
        """Test searching guarantees."""
        response = client.get('/api/guarantees/?search=John')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']['guarantees']) == 1
    
    def test_user_only_sees_own_guarantees(self, client, django_user_model, elector):
        """Test user only sees their own guarantees."""
        other_user = django_user_model.objects.create_user(
            email='other@example.com',
            password='testpass123'
        )
        Guarantee.objects.create(
            user=other_user,
            elector=elector,
            guarantee_status='GUARANTEED'
        )
        
        response = client.get('/api/guarantees/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']['guarantees']) == 0  # Should not see other user's guarantees
    
    def test_unauthorized_access(self):
        """Test unauthorized access is rejected."""
        client = APIClient()
        response = client.get('/api/guarantees/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

