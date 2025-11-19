"""
Unit tests for Guarantee serializers.
"""
import pytest
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model

from apps.guarantees.serializers import (
    GuaranteeGroupSerializer,
    GuaranteeSerializer,
    GuaranteeCreateSerializer,
    GuaranteeUpdateSerializer,
    GuaranteeBulkUpdateSerializer,
    GuaranteeBulkConfirmSerializer,
    GuaranteeConfirmSerializer,
)
from apps.guarantees.models import GuaranteeGroup, Guarantee
from apps.elections.models import Election, Committee
from apps.electors.models import Elector

User = get_user_model()


@pytest.mark.unit
@pytest.mark.django_db
class TestGuaranteeGroupSerializer:
    """Test GuaranteeGroupSerializer."""
    
    @pytest.fixture
    def user(self, django_user_model):
        """Create test user."""
        return django_user_model.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
    
    def test_create_guarantee_group(self, user):
        """Test creating a guarantee group."""
        data = {
            'name': 'Test Group',
            'color': '#FF5722',
            'description': 'Test description',
            'order': 1
        }
        serializer = GuaranteeGroupSerializer(data=data)
        assert serializer.is_valid()
        
        group = serializer.save(user=user)
        assert group.name == 'Test Group'
        assert group.color == '#FF5722'
        assert group.user == user
    
    def test_validate_color_valid_hex(self, user):
        """Test color validation with valid hex format."""
        data = {
            'name': 'Test Group',
            'color': '#FF5722'
        }
        serializer = GuaranteeGroupSerializer(data=data)
        assert serializer.is_valid()
        assert serializer.validated_data['color'] == '#FF5722'
    
    def test_validate_color_invalid_format(self, user):
        """Test color validation rejects invalid format."""
        data = {
            'name': 'Test Group',
            'color': 'FF5722'  # Missing #
        }
        serializer = GuaranteeGroupSerializer(data=data)
        assert not serializer.is_valid()
        assert 'color' in serializer.errors
    
    def test_validate_color_wrong_length(self, user):
        """Test color validation rejects wrong length."""
        data = {
            'name': 'Test Group',
            'color': '#FF572'  # Too short
        }
        serializer = GuaranteeGroupSerializer(data=data)
        assert not serializer.is_valid()
        assert 'color' in serializer.errors
    
    def test_guarantee_count_read_only(self, user):
        """Test guarantee_count is read-only."""
        group = GuaranteeGroup.objects.create(
            user=user,
            name='Test Group'
        )
        serializer = GuaranteeGroupSerializer(group)
        assert 'guarantee_count' in serializer.data
        assert serializer.data['guarantee_count'] == 0


@pytest.mark.unit
@pytest.mark.django_db
class TestGuaranteeCreateSerializer:
    """Test GuaranteeCreateSerializer."""
    
    @pytest.fixture
    def user(self, django_user_model):
        """Create test user."""
        return django_user_model.objects.create_user(
            email='test@example.com',
            password='testpass123'
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
    def guarantee_group(self, user):
        """Create test guarantee group."""
        return GuaranteeGroup.objects.create(
            user=user,
            name='Test Group'
        )
    
    def test_create_guarantee(self, user, elector, guarantee_group):
        """Test creating a guarantee."""
        data = {
            'elector': elector.koc_id,
            'guarantee_status': 'GUARANTEED',
            'group': guarantee_group.id,
            'mobile': '12345678',
            'quick_note': 'Test note'
        }
        
        # Mock request context
        from rest_framework.test import APIRequestFactory
        factory = APIRequestFactory()
        request = factory.get('/')
        request.user = user
        
        serializer = GuaranteeCreateSerializer(
            data=data,
            context={'request': request}
        )
        assert serializer.is_valid()
        
        guarantee = serializer.save(user=user)
        assert guarantee.elector == elector
        assert guarantee.user == user
        assert guarantee.mobile == '12345678'
    
    def test_validate_mobile_normalization(self, user, elector):
        """Test mobile number normalization."""
        data = {
            'elector': elector.koc_id,
            'mobile': '+96512345678'
        }
        
        from rest_framework.test import APIRequestFactory
        factory = APIRequestFactory()
        request = factory.get('/')
        request.user = user
        
        serializer = GuaranteeCreateSerializer(
            data=data,
            context={'request': request}
        )
        assert serializer.is_valid()
        assert serializer.validated_data['mobile'] == '+96512345678'
    
    def test_validate_duplicate_guarantee(self, user, elector):
        """Test validation prevents duplicate guarantees."""
        # Create existing guarantee
        Guarantee.objects.create(
            user=user,
            elector=elector,
            guarantee_status='GUARANTEED'
        )
        
        data = {
            'elector': elector.koc_id,
            'guarantee_status': 'GUARANTEED'
        }
        
        from rest_framework.test import APIRequestFactory
        factory = APIRequestFactory()
        request = factory.get('/')
        request.user = user
        
        serializer = GuaranteeCreateSerializer(
            data=data,
            context={'request': request}
        )
        assert not serializer.is_valid()
        assert 'non_field_errors' in serializer.errors or 'elector' in serializer.errors
    
    def test_validate_group_belongs_to_user(self, user, elector):
        """Test validation ensures group belongs to user."""
        # Create group for different user
        other_user = User.objects.create_user(
            email='other@example.com',
            password='testpass123'
        )
        other_group = GuaranteeGroup.objects.create(
            user=other_user,
            name='Other Group'
        )
        
        data = {
            'elector': elector.koc_id,
            'group': other_group.id
        }
        
        from rest_framework.test import APIRequestFactory
        factory = APIRequestFactory()
        request = factory.get('/')
        request.user = user
        
        serializer = GuaranteeCreateSerializer(
            data=data,
            context={'request': request}
        )
        assert not serializer.is_valid()
        assert 'group' in serializer.errors


@pytest.mark.unit
@pytest.mark.django_db
class TestGuaranteeUpdateSerializer:
    """Test GuaranteeUpdateSerializer."""
    
    @pytest.fixture
    def user(self, django_user_model):
        """Create test user."""
        return django_user_model.objects.create_user(
            email='test@example.com',
            password='testpass123'
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
    def guarantee(self, user, elector):
        """Create test guarantee."""
        return Guarantee.objects.create(
            user=user,
            elector=elector,
            guarantee_status='GUARANTEED'
        )
    
    def test_update_guarantee(self, guarantee):
        """Test updating a guarantee."""
        data = {
            'guarantee_status': 'PENDING',
            'mobile': '87654321',
            'quick_note': 'Updated note'
        }
        
        from rest_framework.test import APIRequestFactory
        factory = APIRequestFactory()
        request = factory.get('/')
        request.user = guarantee.user
        
        serializer = GuaranteeUpdateSerializer(
            guarantee,
            data=data,
            context={'request': request}
        )
        assert serializer.is_valid()
        
        updated = serializer.save()
        assert updated.guarantee_status == 'PENDING'
        assert updated.mobile == '87654321'
        assert updated.quick_note == 'Updated note'
    
    def test_validate_group_belongs_to_user(self, guarantee):
        """Test validation ensures group belongs to user."""
        # Create group for different user
        other_user = User.objects.create_user(
            email='other@example.com',
            password='testpass123'
        )
        other_group = GuaranteeGroup.objects.create(
            user=other_user,
            name='Other Group'
        )
        
        data = {
            'group': other_group.id
        }
        
        from rest_framework.test import APIRequestFactory
        factory = APIRequestFactory()
        request = factory.get('/')
        request.user = guarantee.user
        
        serializer = GuaranteeUpdateSerializer(
            guarantee,
            data=data,
            context={'request': request}
        )
        assert not serializer.is_valid()
        assert 'group' in serializer.errors


@pytest.mark.unit
@pytest.mark.django_db
class TestGuaranteeBulkUpdateSerializer:
    """Test GuaranteeBulkUpdateSerializer."""
    
    @pytest.fixture
    def user(self, django_user_model):
        """Create test user."""
        return django_user_model.objects.create_user(
            email='test@example.com',
            password='testpass123'
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
    def guarantees(self, user, elector):
        """Create test guarantees."""
        return [
            Guarantee.objects.create(
                user=user,
                elector=elector,
                guarantee_status='GUARANTEED'
            ),
            Guarantee.objects.create(
                user=user,
                elector=Elector.objects.create(
                    koc_id='67890',
                    name_first='Jane',
                    family_name='Smith',
                    gender='FEMALE',
                    committee=elector.committee
                ),
                guarantee_status='PENDING'
            )
        ]
    
    def test_validate_guarantee_ids_valid(self, user, guarantees):
        """Test validation with valid guarantee IDs."""
        data = {
            'guarantee_ids': [g.id for g in guarantees],
            'guarantee_status': 'GUARANTEED'
        }
        
        from rest_framework.test import APIRequestFactory
        factory = APIRequestFactory()
        request = factory.get('/')
        request.user = user
        
        serializer = GuaranteeBulkUpdateSerializer(
            data=data,
            context={'request': request}
        )
        assert serializer.is_valid()
    
    def test_validate_guarantee_ids_invalid(self, user, guarantees):
        """Test validation with invalid guarantee IDs."""
        data = {
            'guarantee_ids': [99999, 99998],  # Non-existent IDs
            'guarantee_status': 'GUARANTEED'
        }
        
        from rest_framework.test import APIRequestFactory
        factory = APIRequestFactory()
        request = factory.get('/')
        request.user = user
        
        serializer = GuaranteeBulkUpdateSerializer(
            data=data,
            context={'request': request}
        )
        assert not serializer.is_valid()
        assert 'guarantee_ids' in serializer.errors
    
    def test_validate_group_id_valid(self, user, guarantees):
        """Test validation with valid group ID."""
        group = GuaranteeGroup.objects.create(
            user=user,
            name='Test Group'
        )
        
        data = {
            'guarantee_ids': [g.id for g in guarantees],
            'group_id': group.id
        }
        
        from rest_framework.test import APIRequestFactory
        factory = APIRequestFactory()
        request = factory.get('/')
        request.user = user
        
        serializer = GuaranteeBulkUpdateSerializer(
            data=data,
            context={'request': request}
        )
        assert serializer.is_valid()
    
    def test_validate_group_id_invalid(self, user, guarantees):
        """Test validation with invalid group ID."""
        other_user = User.objects.create_user(
            email='other@example.com',
            password='testpass123'
        )
        other_group = GuaranteeGroup.objects.create(
            user=other_user,
            name='Other Group'
        )
        
        data = {
            'guarantee_ids': [g.id for g in guarantees],
            'group_id': other_group.id
        }
        
        from rest_framework.test import APIRequestFactory
        factory = APIRequestFactory()
        request = factory.get('/')
        request.user = user
        
        serializer = GuaranteeBulkUpdateSerializer(
            data=data,
            context={'request': request}
        )
        assert not serializer.is_valid()
        assert 'group_id' in serializer.errors


@pytest.mark.unit
@pytest.mark.django_db
class TestGuaranteeBulkConfirmSerializer:
    """Test GuaranteeBulkConfirmSerializer."""
    
    @pytest.fixture
    def user(self, django_user_model):
        """Create test user."""
        return django_user_model.objects.create_user(
            email='test@example.com',
            password='testpass123'
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
            name='Test Committee'
        )
    
    @pytest.fixture
    def guarantees(self, user, committee):
        """Create test guarantees."""
        elector1 = Elector.objects.create(
            koc_id='12345',
            name_first='John',
            family_name='Doe',
            gender='MALE',
            committee=committee
        )
        elector2 = Elector.objects.create(
            koc_id='67890',
            name_first='Jane',
            family_name='Smith',
            gender='FEMALE',
            committee=committee
        )
        
        return [
            Guarantee.objects.create(
                user=user,
                elector=elector1,
                guarantee_status='GUARANTEED'
            ),
            Guarantee.objects.create(
                user=user,
                elector=elector2,
                guarantee_status='GUARANTEED'
            )
        ]
    
    def test_validate_guarantee_ids_valid(self, user, guarantees):
        """Test validation with valid guarantee IDs."""
        data = {
            'guarantee_ids': [g.id for g in guarantees],
            'confirmation_status': 'CONFIRMED'
        }
        
        from rest_framework.test import APIRequestFactory
        factory = APIRequestFactory()
        request = factory.get('/')
        request.user = user
        
        serializer = GuaranteeBulkConfirmSerializer(
            data=data,
            context={'request': request}
        )
        assert serializer.is_valid()
    
    def test_validate_guarantee_ids_invalid(self, user, guarantees):
        """Test validation with invalid guarantee IDs."""
        data = {
            'guarantee_ids': [99999, 99998],
            'confirmation_status': 'CONFIRMED'
        }
        
        from rest_framework.test import APIRequestFactory
        factory = APIRequestFactory()
        request = factory.get('/')
        request.user = user
        
        serializer = GuaranteeBulkConfirmSerializer(
            data=data,
            context={'request': request}
        )
        assert not serializer.is_valid()
        assert 'guarantee_ids' in serializer.errors


@pytest.mark.unit
@pytest.mark.django_db
class TestGuaranteeConfirmSerializer:
    """Test GuaranteeConfirmSerializer."""
    
    def test_valid_confirmation_status(self):
        """Test valid confirmation status choices."""
        data = {'confirmation_status': 'CONFIRMED'}
        serializer = GuaranteeConfirmSerializer(data=data)
        assert serializer.is_valid()
        
        data = {'confirmation_status': 'PENDING'}
        serializer = GuaranteeConfirmSerializer(data=data)
        assert serializer.is_valid()
        
        data = {'confirmation_status': 'NOT_AVAILABLE'}
        serializer = GuaranteeConfirmSerializer(data=data)
        assert serializer.is_valid()
    
    def test_invalid_confirmation_status(self):
        """Test invalid confirmation status is rejected."""
        data = {'confirmation_status': 'INVALID'}
        serializer = GuaranteeConfirmSerializer(data=data)
        assert not serializer.is_valid()
        assert 'confirmation_status' in serializer.errors

