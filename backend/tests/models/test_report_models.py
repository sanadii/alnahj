"""
Model coverage for reporting/analytics domain.
"""
from datetime import timedelta, date

import pytest
from django.utils import timezone

from apps.reports.models import ReportTemplate, GeneratedReport, AnalyticsSnapshot
from apps.attendees.models import Attendance
from apps.guarantees.models import Guarantee


@pytest.fixture
def user(admin_user):
    return admin_user


@pytest.mark.unit
@pytest.mark.django_db
def test_generated_report_set_data_marks_completed(user):
    """GeneratedReport.set_data updates status/timestamps."""
    template = ReportTemplate.objects.create(
        name='Coverage',
        report_type='GUARANTEE_COVERAGE',
        created_by=user,
    )

    report = GeneratedReport.objects.create(
        template=template,
        title='Coverage Snapshot',
        report_type='GUARANTEE_COVERAGE',
        format='JSON',
        status='PENDING',
        generated_by=user,
    )

    payload = {'summary': {'total': 10}}
    report.set_data(payload)
    report.refresh_from_db()

    assert report.status == 'COMPLETED'
    assert report.data == payload
    assert report.generated_at is not None


@pytest.mark.unit
@pytest.mark.django_db
def test_generated_report_expiration_flags(user):
    """is_expired reflects expires_at boundary."""
    expired_report = GeneratedReport.objects.create(
        title='Old Report',
        report_type='GUARANTEE_COVERAGE',
        format='JSON',
        status='COMPLETED',
        expires_at=timezone.now() - timedelta(days=1),
        generated_by=user,
    )
    active_report = GeneratedReport.objects.create(
        title='Fresh Report',
        report_type='GUARANTEE_COVERAGE',
        format='JSON',
        status='COMPLETED',
        expires_at=timezone.now() + timedelta(days=1),
        generated_by=user,
    )

    assert expired_report.is_expired is True
    assert active_report.is_expired is False


@pytest.mark.unit
@pytest.mark.django_db
def test_analytics_snapshot_create_snapshot(user, committee, elector_factory):
    """AnalyticsSnapshot.create_snapshot compiles metrics."""
    # Ensure at least two electors exist
    electors = [elector_factory(committee=committee) for _ in range(2)]
    Attendance.objects.create(
        elector=electors[0],
        committee=committee,
        marked_by=user,
    )

    Guarantee.objects.create(
        user=user,
        elector=electors[0],
    )

    # mark user as active today
    user.last_login = timezone.now()
    user.save()

    snapshot = AnalyticsSnapshot.create_snapshot(snapshot_type='DAILY')

    assert snapshot.snapshot_type == 'DAILY'
    assert snapshot.snapshot_date == date.today()
    metrics = snapshot.metrics
    assert metrics['total_users'] >= 1
    assert metrics['total_electors'] == 2
    assert metrics['total_guarantees'] == 1
    assert metrics['total_attendance'] == 1
    assert metrics['elector_coverage'] == 50.0

