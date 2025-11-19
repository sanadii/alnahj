"""
Unit tests for Guarantee models.
"""
import pytest
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.utils import timezone

from apps.guarantees.models import (
    GuaranteeGroup,
    Guarantee,
    normalize_kuwait_phone,
    KUWAIT_PHONE_PATTERN
)
from apps.elections.models import Election
from apps.electors.models import Elector

User = get_user_model()


@pytest.mark.unit
class TestNormalizeKuwaitPhone:
    """Test phone number normalization."""
    
    def test_normalize_8_digit_number(self):
        """Test normalizing 8-digit number."""
        assert normalize_kuwait_phone('12345678') == '12345678'
    
    def test_normalize_with_plus_965(self):
        """Test normalizing number with +965 prefix."""
        assert normalize_kuwait_phone('+96512345678') == '+96512345678'
        # When number has more than 8 digits after +965, it takes last 8 digits
        assert normalize_kuwait_phone('+965123456789') == '+96523456789'  # Last 8 digits
    
    def test_normalize_with_965_prefix(self):
        """Test normalizing number with 965 prefix."""
        assert normalize_kuwait_phone('96512345678') == '+96512345678'
    
    def test_normalize_empty_string(self):
        """Test normalizing empty string."""
        assert normalize_kuwait_phone('') == ''
        assert normalize_kuwait_phone(None) == ''
    
    def test_normalize_invalid_number(self):
        """Test invalid phone number raises ValidationError."""
        with pytest.raises(ValidationError):
            normalize_kuwait_phone('123')  # Too short
    
    def test_normalize_with_spaces(self):
        """Test normalizing number with spaces."""
        assert normalize_kuwait_phone('1234 5678') == '12345678'
        assert normalize_kuwait_phone('+965 1234 5678') == '+96512345678'


@pytest.mark.unit
@pytest.mark.django_db
class TestGuaranteeGroup:
    """Test GuaranteeGroup model."""
    
    @pytest.fixture
    def user(self, django_user_model):
        """Create test user."""
        return django_user_model.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
    
    def test_create_guarantee_group(self, user):
        """Test creating a guarantee group."""
        group = GuaranteeGroup.objects.create(
            user=user,
            name='Test Group',
            color='#FF5722',
            description='Test description',
            order=1
        )
        
        assert group.user == user
        assert group.name == 'Test Group'
        assert group.color == '#FF5722'
        assert group.description == 'Test description'
        assert group.order == 1
        assert group.created_at is not None
        assert group.updated_at is not None
    
    def test_guarantee_group_str(self, user):
        """Test GuaranteeGroup string representation."""
        group = GuaranteeGroup.objects.create(
            user=user,
            name='Test Group'
        )
        assert str(group) == f'{user.email} - Test Group'
    
    def test_guarantee_count_property(self, user):
        """Test guarantee_count property."""
        group = GuaranteeGroup.objects.create(
            user=user,
            name='Test Group'
        )
        assert group.guarantee_count == 0
    
    def test_unique_user_name_constraint(self, user):
        """Test that user and name combination must be unique."""
        GuaranteeGroup.objects.create(
            user=user,
            name='Test Group'
        )
        
        # Creating another group with same user and name should fail
        with pytest.raises(Exception):  # IntegrityError or ValidationError
            GuaranteeGroup.objects.create(
                user=user,
                name='Test Group'
            )
    
    def test_default_color(self, user):
        """Test default color value."""
        group = GuaranteeGroup.objects.create(
            user=user,
            name='Test Group'
        )
        assert group.color == '#1976d2'


@pytest.mark.unit
@pytest.mark.django_db
class TestGuarantee:
    """Test Guarantee model."""
    
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
            status='GUARANTEE_PHASE',
            created_by=user
        )
    
    @pytest.fixture
    def elector(self, user, election):
        """Create test elector."""
        from apps.elections.models import Committee
        committee = Committee.objects.create(
            election=election,
            code='C001',
            name='Test Committee'
        )
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
        guarantee = Guarantee.objects.create(
            user=user,
            elector=elector,
            group=guarantee_group,
            mobile='12345678',
            guarantee_status='PENDING'
        )
        
        assert guarantee.user == user
        assert guarantee.elector == elector
        assert guarantee.group == guarantee_group
        assert guarantee.mobile == '12345678'
        assert guarantee.guarantee_status == 'PENDING'
        assert guarantee.created_at is not None
    
    def test_guarantee_str(self, user, elector, guarantee_group):
        """Test Guarantee string representation."""
        guarantee = Guarantee.objects.create(
            user=user,
            elector=elector,
            group=guarantee_group,
            mobile='12345678'
        )
        # __str__ returns: "{user.email} → {elector.full_name} ({guarantee_status})"
        assert user.email in str(guarantee)
        assert elector.full_name in str(guarantee)
        assert guarantee.guarantee_status in str(guarantee)
    
    def test_phone_normalization(self, user, elector, guarantee_group):
        """Test phone number is normalized on save."""
        guarantee = Guarantee.objects.create(
            user=user,
            elector=elector,
            group=guarantee_group,
            mobile='+96512345678'
        )
        assert guarantee.mobile == '+96512345678'
    
    def test_default_guarantee_status(self, user, elector, guarantee_group):
        """Test default guarantee status."""
        guarantee = Guarantee.objects.create(
            user=user,
            elector=elector,
            group=guarantee_group,
            mobile='12345678'
        )
        # Default guarantee_status is 'GUARANTEED', not 'PENDING'
        assert guarantee.guarantee_status == 'GUARANTEED'
    
    def test_confirmation_status_default(self, user, elector, guarantee_group):
        """Test default confirmation status."""
        guarantee = Guarantee.objects.create(
            user=user,
            elector=elector,
            group=guarantee_group,
            mobile='12345678'
        )
        # Default confirmation_status is 'PENDING'
        assert guarantee.confirmation_status == 'PENDING'

