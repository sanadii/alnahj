"""
Unit tests for Elector models.
"""
import pytest
from django.core.exceptions import ValidationError

from apps.electors.models import Elector


@pytest.mark.unit
@pytest.mark.django_db
class TestElector:
    """Test Elector model."""
    
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
        from apps.elections.models import Election
        return Election.objects.create(
            name='Test Election',
            created_by=user
        )
    
    @pytest.fixture
    def committee(self, election):
        """Create test committee."""
        from apps.elections.models import Committee
        return Committee.objects.create(
            election=election,
            code='C001',
            name='Test Committee'
        )
    
    def test_create_elector(self, committee):
        """Test creating an elector."""
        elector = Elector.objects.create(
            koc_id='12345',
            name_first='John',
            name_second='Michael',
            name_third='David',
            family_name='Doe',
            gender='MALE',
            committee=committee,
            designation='Engineer',
            section='Operations',
            department='Production',
            area='North Kuwait',
            team='Operations Team',
            mobile='12345678'
        )
        
        assert elector.koc_id == '12345'
        assert elector.name_first == 'John'
        assert elector.name_second == 'Michael'
        assert elector.name_third == 'David'
        assert elector.family_name == 'Doe'
        assert elector.gender == 'MALE'
        assert elector.designation == 'Engineer'
        assert elector.section == 'Operations'
        assert elector.department == 'Production'
        assert elector.area == 'North Kuwait'
        assert elector.team == 'Operations Team'
        assert elector.mobile == '12345678'
    
    def test_elector_str(self, committee):
        """Test Elector string representation."""
        elector = Elector.objects.create(
            koc_id='12345',
            name_first='John',
            family_name='Doe',
            gender='MALE',
            committee=committee
        )
        # Check that string representation includes koc_id and first name
        # __str__ returns: "{koc_id} - {full_name}" where full_name doesn't include family_name
        assert '12345' in str(elector)
        assert 'John' in str(elector)
    
    def test_elector_koc_id_is_primary_key(self, committee):
        """Test that koc_id is the primary key."""
        elector = Elector.objects.create(
            koc_id='12345',
            name_first='John',
            family_name='Doe',
            gender='MALE',
            committee=committee
        )
        assert elector.pk == '12345'
    
    def test_elector_unique_koc_id(self, committee):
        """Test that koc_id must be unique."""
        Elector.objects.create(
            koc_id='12345',
            name_first='John',
            family_name='Doe',
            gender='MALE',
            committee=committee
        )
        
        # Creating another elector with same koc_id should fail
        with pytest.raises(Exception):  # IntegrityError
            Elector.objects.create(
                koc_id='12345',
                name_first='Jane',
                family_name='Smith',
                gender='FEMALE',
                committee=committee
            )
    
    def test_elector_optional_fields(self, committee):
        """Test that optional name fields can be blank."""
        elector = Elector.objects.create(
            koc_id='12345',
            name_first='John',
            family_name='Doe',
            gender='MALE',
            committee=committee
        )
        
        assert elector.name_second == ''
        assert elector.name_third == ''
        assert elector.name_fourth == ''
        assert elector.name_fifth == ''
        assert elector.name_sixth == ''
        assert elector.sub_family_name == ''
    
    def test_elector_full_name_property(self, committee):
        """Test full_name property."""
        elector = Elector.objects.create(
            koc_id='12345',
            name_first='John',
            name_second='Michael',
            family_name='Doe',
            gender='MALE',
            committee=committee
        )
        
        # full_name property combines name_first through name_sixth (NOT family_name)
        full_name = elector.full_name
        assert 'John' in full_name
        assert 'Michael' in full_name
        assert isinstance(full_name, str)
        # Verify it's "John Michael" (family_name not included)
        assert full_name == 'John Michael'
    
    def test_elector_gender_choices(self, committee):
        """Test gender field accepts valid choices."""
        elector_male = Elector.objects.create(
            koc_id='12345',
            name_first='John',
            family_name='Doe',
            gender='MALE',
            committee=committee
        )
        assert elector_male.gender == 'MALE'
        
        elector_female = Elector.objects.create(
            koc_id='67890',
            name_first='Jane',
            family_name='Smith',
            gender='FEMALE',
            committee=committee
        )
        assert elector_female.gender == 'FEMALE'
    
    def test_elector_blank_fields(self, committee):
        """Test that optional fields can be blank."""
        elector = Elector.objects.create(
            koc_id='12345',
            name_first='John',
            family_name='Doe',
            gender='MALE',
            committee=committee,
            designation='',
            section='',
            department='',
            area='',
            team='',
            mobile=''
        )
        
        assert elector.designation == ''
        assert elector.section == ''
        assert elector.department == ''
        assert elector.area == ''
        assert elector.team == ''
        assert elector.mobile == ''

