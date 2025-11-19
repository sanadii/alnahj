"""
Comprehensive model tests for attendance tracking.
Tests validation, sanitization, and business logic.
"""
import pytest
from django.core.exceptions import ValidationError
from django.utils.html import strip_tags

from apps.attendees.models import Attendance, AttendanceStatistics


@pytest.fixture
def other_committee(committee_factory):
    return committee_factory(code='C-ATT-2', name='Second Committee', location='Branch')


# ========================================================================
# ATTENDANCE MODEL VALIDATION
# ========================================================================

@pytest.mark.unit
@pytest.mark.django_db
def test_attendance_requires_matching_committee(committee, other_committee, elector_factory, admin_user):
    """Attendance.clean enforces elector committee alignment."""
    elector = elector_factory(committee=committee)

    with pytest.raises(ValidationError):
        Attendance.objects.create(
            elector=elector,
            committee=other_committee,
            marked_by=admin_user
        )


@pytest.mark.unit
@pytest.mark.django_db
def test_attendance_sanitizes_notes(committee, elector_factory, admin_user):
    """Notes are sanitized to remove HTML tags."""
    elector = elector_factory(committee=committee)
    attendance = Attendance(
        elector=elector,
        committee=committee,
        marked_by=admin_user,
        notes='<script>alert("xss")</script>Test note'
    )
    attendance.save()
    
    assert '<script>' not in attendance.notes
    assert 'Test note' in attendance.notes
    assert len(attendance.notes) <= 1000


@pytest.mark.unit
@pytest.mark.django_db
def test_attendance_validates_device_info_ip(committee, elector_factory, admin_user):
    """Device info IP address is validated."""
    elector = elector_factory(committee=committee)
    
    # Valid IP
    attendance1 = Attendance(
        elector=elector,
        committee=committee,
        marked_by=admin_user,
        device_info={'ip_address': '192.168.1.1', 'user_agent': 'Test'}
    )
    attendance1.save()
    assert attendance1.device_info['ip_address'] == '192.168.1.1'
    
    # Invalid IP
    elector2 = elector_factory(committee=committee)
    attendance2 = Attendance(
        elector=elector2,
        committee=committee,
        marked_by=admin_user,
        device_info={'ip_address': 'invalid-ip', 'user_agent': 'Test'}
    )
    attendance2.save()
    assert attendance2.device_info['ip_address'] is None


@pytest.mark.unit
@pytest.mark.django_db
def test_attendance_validates_device_info_user_agent(committee, elector_factory, admin_user):
    """Device info user agent is truncated if too long."""
    elector = elector_factory(committee=committee)
    long_ua = 'A' * 300  # Longer than 255
    attendance = Attendance(
        elector=elector,
        committee=committee,
        marked_by=admin_user,
        device_info={'user_agent': long_ua}
    )
    attendance.save()
    assert len(attendance.device_info['user_agent']) <= 255


@pytest.mark.unit
@pytest.mark.django_db
def test_attendance_validates_device_info_structure(committee, elector_factory, admin_user):
    """Device info must be a dict."""
    elector = elector_factory(committee=committee)
    attendance = Attendance(
        elector=elector,
        committee=committee,
        marked_by=admin_user,
        device_info='invalid'  # Not a dict
    )
    attendance.save()
    assert isinstance(attendance.device_info, dict)


@pytest.mark.unit
@pytest.mark.django_db
def test_attendance_one_to_one_constraint(committee, elector_factory, admin_user):
    """One elector can only have one attendance record."""
    elector = elector_factory(committee=committee)
    Attendance.objects.create(
        elector=elector,
        committee=committee,
        marked_by=admin_user
    )
    
    # Try to create duplicate
    with pytest.raises(Exception):  # IntegrityError or ValidationError
        Attendance.objects.create(
            elector=elector,
            committee=committee,
            marked_by=admin_user
        )


# ========================================================================
# ATTENDANCE STATISTICS MODEL
# ========================================================================

@pytest.mark.unit
@pytest.mark.django_db
def test_attendance_statistics_percentage_calculation(committee):
    """Attendance percentage rounds correctly."""
    stats = AttendanceStatistics.objects.create(
        committee=committee,
        total_electors=25,
        total_attended=10,
    )

    assert stats.attendance_percentage == 40.0


@pytest.mark.unit
@pytest.mark.django_db
def test_attendance_statistics_percentage_zero_electors(committee):
    """Percentage is 0 when no electors."""
    stats = AttendanceStatistics.objects.create(
        committee=committee,
        total_electors=0,
        total_attended=0,
    )
    assert stats.attendance_percentage == 0


@pytest.mark.unit
@pytest.mark.django_db
def test_attendance_statistics_update_from_database(committee, admin_user, elector_factory):
    """update_statistics pulls latest totals and hourly breakdown."""
    electors = [elector_factory(committee=committee) for _ in range(3)]
    Attendance.objects.create(
        elector=electors[0],
        committee=committee,
        marked_by=admin_user,
    )
    Attendance.objects.create(
        elector=electors[1],
        committee=committee,
        marked_by=admin_user,
    )

    stats = AttendanceStatistics.objects.create(committee=committee)
    stats.update_statistics()
    stats.refresh_from_db()

    assert stats.total_electors == 3
    assert stats.total_attended == 2
    assert isinstance(stats.hourly_breakdown, dict)
    assert len(stats.hourly_breakdown) > 0


@pytest.mark.unit
@pytest.mark.django_db
def test_attendance_statistics_update_optimized(committee, admin_user, elector_factory):
    """update_statistics uses optimized queries."""
    # Create multiple attendances
    for i in range(5):
        elector = elector_factory(committee=committee)
        Attendance.objects.create(
            elector=elector,
            committee=committee,
            marked_by=admin_user
        )
    
    stats = AttendanceStatistics.objects.create(committee=committee)
    stats.update_statistics()
    
    assert stats.total_attended == 5
    assert stats.total_electors == 5
    # Check that hourly breakdown is populated
    assert len(stats.hourly_breakdown) > 0


