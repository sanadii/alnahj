"""
Comprehensive serializer tests for attendance workflows.
Tests validation, data transformation, and edge cases.
"""
import pytest
from rest_framework.exceptions import ValidationError

from apps.attendees.models import Attendance
from apps.attendees.serializers import (
    AttendanceSerializer,
    AttendanceListSerializer,
    ElectorAttendanceSerializer,
    MarkAttendanceSerializer,
)


@pytest.fixture
def other_committee(committee_factory):
    return committee_factory(code='C-OTHER', name='Other Committee')


@pytest.fixture
def user(admin_user):
    return admin_user


@pytest.fixture
def elector(elector_factory, committee):
    return elector_factory(
        committee=committee,
        koc_id='ATT0001',
        name_first='Attend',
        section='HR',
        department='Operations',
        team='Alpha',
        family_name='Elector',
        is_active=True
    )


@pytest.fixture
def attendance(elector, committee, user):
    return Attendance.objects.create(
        elector=elector,
        committee=committee,
        marked_by=user,
        notes='Arrived early',
        device_info={'device': 'tablet'},
    )


# ========================================================================
# ATTENDANCE SERIALIZER
# ========================================================================

@pytest.mark.unit
@pytest.mark.django_db
def test_attendance_serializer_returns_readonly_fields(attendance, user, committee):
    """AttendanceSerializer exposes denormalized elector info."""
    data = AttendanceSerializer(attendance).data
    assert data['elector_koc_id'] == attendance.elector.koc_id
    assert data['committee_code'] == committee.code
    assert data['marked_by_name'] == user.full_name
    assert 'attended_at' in data


@pytest.mark.unit
@pytest.mark.django_db
def test_attendance_list_serializer_subset(attendance, user):
    """AttendanceListSerializer returns compact card data."""
    data = AttendanceListSerializer(attendance).data
    assert data['elector_name'] == attendance.elector.full_name
    assert data['marked_by_name'] == user.full_name
    assert 'notes' in data
    assert 'elector_koc_id' in data


@pytest.mark.unit
@pytest.mark.django_db
def test_elector_attendance_serializer_flags_status(attendance):
    """ElectorAttendanceSerializer reports attendance booleans."""
    serializer = ElectorAttendanceSerializer(attendance.elector)
    data = serializer.data
    assert data['kocId'] == attendance.elector.koc_id
    assert data['committeeCode'] == attendance.committee.code
    assert data['hasAttended'] is True
    assert data['attendedAt'] is not None


@pytest.mark.unit
@pytest.mark.django_db
def test_elector_attendance_serializer_no_attendance(elector):
    """ElectorAttendanceSerializer shows False when not attended."""
    serializer = ElectorAttendanceSerializer(elector)
    data = serializer.data
    assert data['hasAttended'] is False
    assert data['attendedAt'] is None


# ========================================================================
# MARK ATTENDANCE SERIALIZER
# ========================================================================

@pytest.mark.unit
@pytest.mark.django_db
def test_mark_attendance_serializer_validates_koc_id(committee):
    """MarkAttendanceSerializer validates KOC ID exists."""
    serializer = MarkAttendanceSerializer(data={
        'koc_id': 'INVALID',
        'committee_code': committee.code
    })
    assert not serializer.is_valid()
    assert 'koc_id' in serializer.errors


@pytest.mark.unit
@pytest.mark.django_db
def test_mark_attendance_serializer_validates_inactive_elector(elector_factory, committee):
    """MarkAttendanceSerializer rejects inactive electors."""
    inactive_elector = elector_factory(committee=committee, is_active=False)
    serializer = MarkAttendanceSerializer(data={
        'koc_id': inactive_elector.koc_id,
        'committee_code': committee.code
    })
    assert not serializer.is_valid()
    assert 'koc_id' in serializer.errors


@pytest.mark.unit
@pytest.mark.django_db
def test_mark_attendance_serializer_validates_duplicate(attendance, elector, committee):
    """MarkAttendanceSerializer rejects duplicate attendance."""
    serializer = MarkAttendanceSerializer(data={
        'koc_id': elector.koc_id,
        'committee_code': committee.code
    })
    assert not serializer.is_valid()
    assert 'koc_id' in serializer.errors


@pytest.mark.unit
@pytest.mark.django_db
def test_mark_attendance_serializer_validates_committee_mismatch(elector, other_committee):
    """MarkAttendanceSerializer validates committee assignment."""
    serializer = MarkAttendanceSerializer(data={
        'koc_id': elector.koc_id,
        'committee_code': other_committee.code
    })
    assert not serializer.is_valid()
    assert 'committee_code' in serializer.errors or 'non_field_errors' in serializer.errors


@pytest.mark.unit
@pytest.mark.django_db
def test_mark_attendance_serializer_sanitizes_notes(elector, committee, user):
    """MarkAttendanceSerializer sanitizes notes to prevent XSS."""
    # Create a mock request with proper META structure
    request = type('obj', (object,), {
        'user': user,
        'META': {
            'REMOTE_ADDR': '192.168.1.1',  # Valid IP to avoid None error
            'HTTP_USER_AGENT': 'Test Agent'
        }
    })()
    
    serializer = MarkAttendanceSerializer(data={
        'koc_id': elector.koc_id,
        'committee_code': committee.code,
        'notes': '<script>alert("xss")</script>Test note'
    }, context={'request': request})
    
    assert serializer.is_valid()
    attendance = serializer.save()
    assert '<script>' not in attendance.notes
    assert 'Test note' in attendance.notes


@pytest.mark.unit
@pytest.mark.django_db
def test_mark_attendance_serializer_validates_notes_length(elector, committee, user):
    """MarkAttendanceSerializer limits notes length."""
    # Notes are validated in validate_notes method which truncates, but serializer max_length=1000
    # So we test with exactly 1000 chars (should pass) and verify truncation happens in model clean
    long_notes = 'A' * 1000  # Exactly at limit
    serializer = MarkAttendanceSerializer(data={
        'koc_id': elector.koc_id,
        'committee_code': committee.code,
        'notes': long_notes
    }, context={'request': type('obj', (object,), {'user': user, 'META': {}})()})
    
    assert serializer.is_valid()
    attendance = serializer.save()
    assert len(attendance.notes) <= 1000
    
    # Test that notes longer than 1000 are rejected by serializer validation
    very_long_notes = 'B' * 1001  # Exceeds serializer max_length
    serializer2 = MarkAttendanceSerializer(data={
        'koc_id': elector.koc_id,
        'committee_code': committee.code,
        'notes': very_long_notes
    }, context={'request': type('obj', (object,), {'user': user, 'META': {}})()})
    
    # Should be invalid due to max_length constraint
    assert not serializer2.is_valid()
    assert 'notes' in serializer2.errors


@pytest.mark.unit
@pytest.mark.django_db
def test_mark_attendance_serializer_validates_device_info(elector, committee, user):
    """MarkAttendanceSerializer validates and sanitizes device info."""
    request = type('obj', (object,), {
        'user': user,
        'META': {
            'REMOTE_ADDR': '192.168.1.1',
            'HTTP_USER_AGENT': 'Test User Agent'
        }
    })()
    
    serializer = MarkAttendanceSerializer(data={
        'koc_id': elector.koc_id,
        'committee_code': committee.code
    }, context={'request': request})
    
    assert serializer.is_valid()
    attendance = serializer.save()
    assert 'ip_address' in attendance.device_info
    assert 'user_agent' in attendance.device_info
    assert attendance.device_info['ip_address'] == '192.168.1.1'


