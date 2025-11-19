"""
Unit tests for Elector serializers.
"""
import pytest
from django.contrib.auth import get_user_model

from apps.electors.serializers import (
    ElectorSerializer,
    ElectorListSerializer,
    ElectorCreateSerializer,
    ElectorImportSerializer,
    ElectorSearchSerializer,
)
from apps.electors.models import Elector
from apps.elections.models import Election, Committee

User = get_user_model()


@pytest.mark.unit
@pytest.mark.django_db
class TestElectorSerializer:
    """Test ElectorSerializer."""
    
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
            name='Test Committee'
        )
    
    @pytest.fixture
    def elector(self, committee, user):
        """Create test elector."""
        return Elector.objects.create(
            koc_id='12345',
            name_first='John',
            name_second='Michael',
            family_name='Doe',
            gender='MALE',
            committee=committee,
            designation='Engineer',
            section='Operations',
            department='Production',
            created_by=user
        )
    
    def test_elector_serialization(self, elector):
        """Test serializing an elector."""
        serializer = ElectorSerializer(elector)
        data = serializer.data
        
        assert data['koc_id'] == '12345'
        assert data['name_first'] == 'John'
        assert data['name_second'] == 'Michael'
        assert data['family_name'] == 'Doe'
        assert data['full_name'] == 'John Michael'  # Doesn't include family_name
        assert data['gender'] == 'MALE'
        assert data['gender_display'] == 'Male'
        assert data['committee_code'] == 'C001'
        assert data['committee_name'] == 'Test Committee'
        assert 'has_attended' in data
        assert 'created_by_email' in data
    
    def test_read_only_fields(self, elector):
        """Test read-only fields cannot be set."""
        data = {
            'koc_id': '99999',
            'created_at': '2020-01-01T00:00:00Z',
            'created_by': 999
        }
        serializer = ElectorSerializer(elector, data=data, partial=True)
        # Read-only fields should be ignored
        assert serializer.is_valid()


@pytest.mark.unit
@pytest.mark.django_db
class TestElectorListSerializer:
    """Test ElectorListSerializer."""
    
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
            committee=committee,
            department='Production',
            team='Operations Team'
        )
    
    def test_list_serializer_camel_case(self, elector):
        """Test list serializer returns camelCase fields."""
        from rest_framework.test import APIRequestFactory
        factory = APIRequestFactory()
        request = factory.get('/')
        request.user = None
        
        serializer = ElectorListSerializer(
            elector,
            context={'request': request}
        )
        data = serializer.data
        
        # Should have camelCase fields
        assert 'kocId' in data
        assert 'fullName' in data
        assert 'committeeCode' in data
        assert 'committeeName' in data
        assert 'isActive' in data
        assert 'isApproved' in data
        assert 'isGuarantee' in data
        assert 'guaranteeStatus' in data
    
    def test_guarantee_fields(self, elector, user):
        """Test guarantee-related fields."""
        from apps.guarantees.models import Guarantee, GuaranteeGroup
        from rest_framework.test import APIRequestFactory
        
        # Create guarantee for this elector
        group = GuaranteeGroup.objects.create(
            user=user,
            name='Test Group',
            color='#FF5722'
        )
        guarantee = Guarantee.objects.create(
            user=user,
            elector=elector,
            guarantee_status='GUARANTEED',
            group=group,
            confirmation_status='CONFIRMED'
        )
        
        factory = APIRequestFactory()
        request = factory.get('/')
        request.user = user
        
        serializer = ElectorListSerializer(
            elector,
            context={'request': request}
        )
        data = serializer.data
        
        assert data['isGuarantee'] is True
        assert data['guaranteeStatus'] == 'GUARANTEED'
        assert data['guaranteeId'] == guarantee.id
        assert data['guaranteeConfirmationStatus'] == 'CONFIRMED'
        assert data['guaranteeGroup'] is not None
        assert data['guaranteeGroup']['id'] == group.id
        assert data['guaranteeGroup']['name'] == 'Test Group'


@pytest.mark.unit
@pytest.mark.django_db
class TestElectorCreateSerializer:
    """Test ElectorCreateSerializer."""
    
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
            name='Test Committee'
        )
    
    def test_create_elector_with_individual_fields(self, committee):
        """Test creating elector with individual name fields."""
        data = {
            'koc_id': '12345',
            'name_first': 'John',
            'name_second': 'Michael',
            'family_name': 'Doe',
            'gender': 'MALE',
            'committee': committee.id,
            'designation': 'Engineer',
            'section': 'Operations'
        }
        
        serializer = ElectorCreateSerializer(data=data)
        assert serializer.is_valid()
        
        elector = serializer.save()
        assert elector.koc_id == '12345'
        assert elector.name_first == 'John'
        assert elector.name_second == 'Michael'
        assert elector.family_name == 'Doe'
    
    def test_create_elector_with_full_name(self, committee):
        """Test creating elector with full_name (parsed into components)."""
        data = {
            'koc_id': '12345',
            'full_name': 'John Michael David Doe',
            'gender': 'MALE',
            'committee': committee.id
        }
        
        serializer = ElectorCreateSerializer(data=data)
        assert serializer.is_valid(), f"Serializer should be valid. Errors: {serializer.errors}"
        
        elector = serializer.save()
        # For 4-part name: ['John', 'Michael', 'David', 'Doe']
        # Parsing logic: first=John, middle=Michael, sub_family=David, family=Doe
        assert elector.name_first == 'John'
        assert elector.name_second == 'Michael'  # Middle part (parts[1:-2])
        assert elector.sub_family_name == 'David'  # Second-to-last part
        assert elector.family_name == 'Doe'
        assert elector.name_third == ''  # No third middle name for 4-part name
    
    def test_create_elector_missing_name_first(self, committee):
        """Test validation requires name_first if full_name not provided."""
        data = {
            'koc_id': '12345',
            'family_name': 'Doe',
            'gender': 'MALE',
            'committee': committee.id
        }
        
        serializer = ElectorCreateSerializer(data=data)
        assert not serializer.is_valid()
        assert 'name_first' in serializer.errors
    
    def test_create_elector_missing_family_name(self, committee):
        """Test validation requires family_name if full_name not provided."""
        data = {
            'koc_id': '12345',
            'name_first': 'John',
            'gender': 'MALE',
            'committee': committee.id
        }
        
        serializer = ElectorCreateSerializer(data=data)
        assert not serializer.is_valid()
        assert 'family_name' in serializer.errors


@pytest.mark.unit
class TestElectorImportSerializer:
    """Test ElectorImportSerializer."""
    
    def test_valid_import_data(self):
        """Test validation with valid import data."""
        data = {
            'koc_id': '12345',
            'name': 'John Doe',
            'designation': 'Engineer',
            'section': 'Operations',
            'mobile': '12345678'
        }
        serializer = ElectorImportSerializer(data=data)
        assert serializer.is_valid()
    
    def test_validate_koc_id_required(self):
        """Test KOC ID is required."""
        data = {
            'name': 'John Doe'
        }
        serializer = ElectorImportSerializer(data=data)
        assert not serializer.is_valid()
        assert 'koc_id' in serializer.errors
    
    def test_validate_koc_id_not_empty(self):
        """Test KOC ID cannot be empty."""
        data = {
            'koc_id': '   '  # Whitespace only
        }
        serializer = ElectorImportSerializer(data=data)
        assert not serializer.is_valid()
        assert 'koc_id' in serializer.errors
    
    def test_validate_koc_id_stripped(self):
        """Test KOC ID is stripped of whitespace."""
        data = {
            'koc_id': '  12345  '
        }
        serializer = ElectorImportSerializer(data=data)
        assert serializer.is_valid()
        assert serializer.validated_data['koc_id'] == '12345'
    
    def test_optional_fields(self):
        """Test optional fields can be blank."""
        data = {
            'koc_id': '12345',
            'name': '',
            'designation': '',
            'section': ''
        }
        serializer = ElectorImportSerializer(data=data)
        assert serializer.is_valid()


@pytest.mark.unit
class TestElectorSearchSerializer:
    """Test ElectorSearchSerializer."""
    
    def test_valid_search_parameters(self):
        """Test validation with valid search parameters."""
        data = {
            'query': 'John',
            'koc_id': '12345',
            'name': 'Doe',
            'gender': 'MALE'
        }
        serializer = ElectorSearchSerializer(data=data)
        assert serializer.is_valid()
    
    def test_empty_search_parameters(self):
        """Test all search parameters are optional."""
        data = {}
        serializer = ElectorSearchSerializer(data=data)
        assert serializer.is_valid()
    
    def test_invalid_gender_choice(self):
        """Test invalid gender choice is rejected."""
        data = {
            'gender': 'INVALID'
        }
        serializer = ElectorSearchSerializer(data=data)
        assert not serializer.is_valid()
        assert 'gender' in serializer.errors
    
    def test_valid_gender_choices(self):
        """Test valid gender choices are accepted."""
        data_male = {'gender': 'MALE'}
        serializer = ElectorSearchSerializer(data=data_male)
        assert serializer.is_valid()
        
        data_female = {'gender': 'FEMALE'}
        serializer = ElectorSearchSerializer(data=data_female)
        assert serializer.is_valid()

