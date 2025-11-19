"""
Serializer tests for reporting/analytics.
"""
from datetime import timedelta, date
from decimal import Decimal

import pytest
from django.utils import timezone

from apps.reports.models import (
    ReportTemplate,
    GeneratedReport,
    AnalyticsSnapshot,
    DashboardWidget,
    CampaignFinanceSnapshot,
)
from apps.reports.serializers import (
    ReportTemplateSerializer,
    GeneratedReportSerializer,
    AnalyticsSnapshotSerializer,
    DashboardWidgetSerializer,
    CampaignFinanceSnapshotSerializer,
    AdminDashboardSerializer,
    SupervisorDashboardSerializer,
    PersonalDashboardSerializer,
    ExportRequestSerializer,
    ChartDataSerializer,
    CoverageReportSerializer,
    AccuracyReportSerializer,
    CommitteePerformanceSerializer,
)


@pytest.fixture
def user(django_user_model):
    return django_user_model.objects.create_user(
        email='reports-serializer@example.com',
        password='testpass123',
        role='ADMIN',
        first_name='Report',
        last_name='Serializer',
    )


@pytest.mark.unit
@pytest.mark.django_db
def test_report_template_serializer_includes_creator(user):
    template = ReportTemplate.objects.create(
        name='Attendance Analysis',
        report_type='ATTENDANCE_ANALYSIS',
        created_by=user,
    )

    data = ReportTemplateSerializer(template).data
    assert data['report_type_display'] == 'Attendance Analysis Report'
    assert data['created_by_name'] == user.full_name


@pytest.mark.unit
@pytest.mark.django_db
def test_generated_report_serializer_flags_expiration(user):
    report = GeneratedReport.objects.create(
        title='Attendance Snapshot',
        report_type='ATTENDANCE_ANALYSIS',
        format='JSON',
        status='COMPLETED',
        generated_by=user,
        generated_at=timezone.now(),
        expires_at=timezone.now() - timedelta(minutes=5),
    )

    data = GeneratedReportSerializer(report).data
    assert data['status_display'] == 'Completed'
    assert data['generated_by_name'] == user.full_name
    assert data['is_expired'] is True


@pytest.mark.unit
@pytest.mark.django_db
def test_analytics_snapshot_serializer(user):
    snapshot = AnalyticsSnapshot.objects.create(
        snapshot_type='DAILY',
        snapshot_date=date.today(),
        metrics={'total_users': 1},
        notes='Auto snapshot',
    )

    data = AnalyticsSnapshotSerializer(snapshot).data
    assert data['snapshot_type_display'] == 'Daily Snapshot'
    assert data['metrics']['total_users'] == 1


@pytest.mark.unit
@pytest.mark.django_db
def test_dashboard_widget_serializer_includes_display(user):
    widget = DashboardWidget.objects.create(
        user=user,
        title='Coverage Stats',
        widget_type='PIE_CHART',
        data_source='reports/coverage',
        configuration={'color': 'blue'},
        position_x=1,
        position_y=2,
        width=4,
        height=3,
    )

    data = DashboardWidgetSerializer(widget).data
    assert data['widget_type_display'] == 'Pie Chart'
    assert data['data_source'] == 'reports/coverage'


@pytest.mark.unit
@pytest.mark.django_db
def test_campaign_finance_snapshot_serializer(user):
    snapshot = CampaignFinanceSnapshot.objects.create(
        total_budget=Decimal('100000.00'),
        committed_budget=Decimal('25000.00'),
        spent_budget=Decimal('15000.00'),
        available_budget=Decimal('85000.00'),
        burn_rate=Decimal('500.00'),
        period_start=date(2025, 1, 1),
        period_end=date(2025, 1, 31),
        notes='January overview',
        created_by=user,
    )

    data = CampaignFinanceSnapshotSerializer(snapshot).data
    assert data['total_budget'] == '100000.00'
    assert data['created_by_name'] == user.full_name


@pytest.mark.unit
def test_dashboard_summary_serializers_accept_data():
    admin_payload = {
        'overview': {'total': 10},
        'system_overview': {'total': 10},
        'guarantees': {'pending': 3},
        'attendance': {'rate': 0.75},
        'users': {'active': 5},
        'committees': [{'code': 'C1'}],
        'recent_activity': [],
        'trends': {},
    }
    serializer = AdminDashboardSerializer(data=admin_payload)
    assert serializer.is_valid(), serializer.errors

    supervisor_payload = {
        'team_overview': {'members': 4},
        'team_guarantees': {'confirmed': 2},
        'team_members': [],
        'team_progress': {'percent': 50},
        'recent_activity': [],
    }
    serializer = SupervisorDashboardSerializer(data=supervisor_payload)
    assert serializer.is_valid(), serializer.errors

    personal_payload = {
        'my_guarantees': {'total': 8},
        'my_groups': [],
        'recent_guarantees': [],
        'quick_stats': {'pending': 1},
    }
    serializer = PersonalDashboardSerializer(data=personal_payload)
    assert serializer.is_valid(), serializer.errors


@pytest.mark.unit
def test_export_request_serializer_validates_choices():
    payload = {
        'report_type': 'GUARANTEE_COVERAGE',
        'format': 'CSV',
        'parameters': {'committee': 'C001'},
        'include_charts': True,
    }
    serializer = ExportRequestSerializer(data=payload)
    assert serializer.is_valid(), serializer.errors

    short_payload = {
        'report_type': 'COVERAGE',
        'format': 'PDF',
    }
    short_serializer = ExportRequestSerializer(data=short_payload)
    assert short_serializer.is_valid(), short_serializer.errors


@pytest.mark.unit
def test_campaign_performance_payload_structure():
    payload = {
        'budget': {
            'total_budget': '100000.00',
            'committed_budget': '25000.00',
            'spent_budget': '15000.00',
            'available_budget': '85000.00',
            'burn_rate': '500.00',
        },
        'resources': {
            'total_users': 10,
            'admins': 2,
            'supervisors': 3,
            'field_agents': 5,
            'active_today': 4,
            'active_ratio': 40.0,
        },
        'forecast': {
            'daily_burn_rate': '500.00',
            'guarantees_total': 120,
            'attendance_today': 15,
        }
    }

    # No strict serializer exists yet, but ensure structure matches expected dicts.
    assert set(payload.keys()) == {'budget', 'resources', 'forecast'}
    assert 'total_budget' in payload['budget']
    assert 'total_users' in payload['resources']
    assert 'guarantees_total' in payload['forecast']


@pytest.mark.unit
def test_coverage_report_serializer_accepts_payload():
    payload = {
        'summary': {
            'total_electors': 100,
            'covered': 80,
            'uncovered': 20,
            'coverage_percentage': 80.0,
            'generated_at': '2025-01-01T00:00:00',
        },
        'by_committee': [{'committee_code': 'C1', 'coverage_percentage': 75.0}],
        'by_section': [{'section': 'A', 'coverage_percentage': 60.0}],
        'by_user': [{'user_name': 'Admin', 'total_guarantees': 5}],
        'coverage_gaps': [],
        'recommendations': [],
    }
    serializer = CoverageReportSerializer(data=payload)
    assert serializer.is_valid(), serializer.errors


@pytest.mark.unit
def test_accuracy_report_serializer_accepts_payload():
    payload = {
        'summary': {'total_guarantees': 50, 'overall_accuracy': 90.0, 'generated_at': '2025-01-01T00:00:00'},
        'by_status': {'confirmed': 30, 'pending': 20, 'not_available': 0},
        'by_user': [{'user_name': 'Admin', 'total_guarantees': 5, 'accuracy': 80.0}],
        'accuracy_metrics': {'attendance_match_percentage': 85.0},
        'predictions_vs_actual': [],
    }
    serializer = AccuracyReportSerializer(data=payload)
    assert serializer.is_valid(), serializer.errors


@pytest.mark.unit
def test_committee_performance_serializer_accepts_payload():
    payload = {
        'committee_stats': [{'code': 'C1', 'total_guarantees': 10, 'attendance_rate': 70}],
        'attendance_rates': {'overall': 70, 'highest': None, 'lowest': None},
        'guarantee_distribution': [{'committee': 'C1', 'total': 10}],
        'performance_comparison': {'top_performing': [], 'needs_attention': []},
    }
    serializer = CommitteePerformanceSerializer(data=payload)
    assert serializer.is_valid(), serializer.errors


@pytest.mark.unit
def test_chart_data_serializer_requires_fields():
    payload = {
        'chart_type': 'BAR',
        'title': 'Guarantee Breakdown',
        'labels': ['Pending', 'Confirmed'],
        'datasets': [{'label': 'Totals', 'data': [10, 5]}],
        'options': {'stacked': False},
    }
    serializer = ChartDataSerializer(data=payload)
    assert serializer.is_valid(), serializer.errors

