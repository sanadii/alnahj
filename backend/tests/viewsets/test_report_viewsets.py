"""
Unit tests for Reports ViewSets.
"""
import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.utils import timezone
from datetime import timedelta

from apps.guarantees.models import Guarantee
from apps.reports.models import AnalyticsSnapshot


@pytest.mark.unit
@pytest.mark.django_db
class TestDashboardViewSet:
    """Test DashboardViewSet endpoints."""

    @pytest.fixture
    def admin_client(self, admin_user):
        client = APIClient()
        client.force_authenticate(user=admin_user)
        return client

    @pytest.fixture
    def supervisor_client(self, supervisor_user):
        client = APIClient()
        client.force_authenticate(user=supervisor_user)
        return client

    @pytest.fixture
    def user_client(self, regular_user):
        client = APIClient()
        client.force_authenticate(user=regular_user)
        return client

    @pytest.fixture
    def guarantee(self, regular_user, elector_factory):
        elector = elector_factory()
        return Guarantee.objects.create(
            user=regular_user,
            elector=elector,
            guarantee_status='PENDING',
            confirmation_status='PENDING',
        )

    def test_personal_dashboard(self, user_client, guarantee):
        response = user_client.get('/api/reports/dashboard/personal/')
        assert response.status_code == status.HTTP_200_OK
        assert 'data' in response.data
        assert 'my_guarantees' in response.data['data']

    def test_supervisor_dashboard(self, supervisor_client, supervisor_user, regular_user, guarantee):
        regular_user.supervisor = supervisor_user
        regular_user.save()

        response = supervisor_client.get('/api/reports/dashboard/supervisor/')
        assert response.status_code == status.HTTP_200_OK
        assert 'team_overview' in response.data['data']

    def test_supervisor_dashboard_regular_forbidden(self, user_client):
        response = user_client.get('/api/reports/dashboard/supervisor/')
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_admin_dashboard(self, admin_client, guarantee):
        response = admin_client.get('/api/reports/dashboard/admin/')
        assert response.status_code == status.HTTP_200_OK
        assert 'system_overview' in response.data['data']


@pytest.mark.unit
@pytest.mark.django_db
class TestReportsViewSet:
    """Test ReportsViewSet endpoints."""

    @pytest.fixture
    def admin_client(self, admin_user):
        client = APIClient()
        client.force_authenticate(user=admin_user)
        return client

    @pytest.fixture
    def user_client(self, regular_user):
        client = APIClient()
        client.force_authenticate(user=regular_user)
        return client

    @pytest.fixture
    def guarantee(self, regular_user, elector_factory):
        elector = elector_factory()
        return Guarantee.objects.create(
            user=regular_user,
            elector=elector,
            guarantee_status='GUARANTEED',
            confirmation_status='CONFIRMED',
        )

    def test_coverage_report_admin(self, admin_client, election, committee, elector_factory, guarantee):
        elector_factory(committee=committee)

        response = admin_client.get('/api/reports/coverage/')
        assert response.status_code == status.HTTP_200_OK
        assert 'summary' in response.data['data']

    def test_coverage_report_regular_forbidden(self, user_client):
        response = user_client.get('/api/reports/coverage/')
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_accuracy_report(self, admin_client, guarantee):
        response = admin_client.get('/api/reports/accuracy/')
        assert response.status_code == status.HTTP_200_OK

    def test_committee_performance_report(self, admin_client):
        response = admin_client.get('/api/reports/committee-performance/')
        assert response.status_code == status.HTTP_200_OK

    def test_export_report(self, admin_client):
        data = {
            'report_type': 'COVERAGE',
            'format': 'EXCEL',
            'filters': {},
        }
        response = admin_client.post('/api/reports/export/', data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert 'data' in response.data

    def test_campaign_performance_admin(self, admin_client):
        response = admin_client.get('/api/reports/analytics/campaign-performance/')
        assert response.status_code == status.HTTP_200_OK
        assert 'budget' in response.data['data']
        assert 'resources' in response.data['data']

    def test_campaign_performance_regular_forbidden(self, user_client):
        response = user_client.get('/api/reports/analytics/campaign-performance/')
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.unit
@pytest.mark.django_db
class TestAnalyticsViewSet:
    """Test AnalyticsViewSet endpoints."""

    @pytest.fixture
    def admin_client(self, admin_user):
        client = APIClient()
        client.force_authenticate(user=admin_user)
        return client

    @pytest.fixture
    def user_client(self, regular_user):
        client = APIClient()
        client.force_authenticate(user=regular_user)
        return client

    def test_trends(self, admin_client):
        AnalyticsSnapshot.objects.create(
            snapshot_date=timezone.now().date(),
            snapshot_type='DAILY',
            metrics={'total_guarantees': 100},
        )
        AnalyticsSnapshot.objects.create(
            snapshot_date=(timezone.now() - timedelta(days=1)).date(),
            snapshot_type='DAILY',
            metrics={'total_guarantees': 90},
        )

        response = admin_client.get('/api/reports/analytics/trends/')
        assert response.status_code == status.HTTP_200_OK
        assert 'dates' in response.data['data']

    def test_trends_with_days_param(self, admin_client):
        response = admin_client.get('/api/reports/analytics/trends/?days=7')
        assert response.status_code == status.HTTP_200_OK

    def test_create_snapshot_admin(self, admin_client):
        response = admin_client.post('/api/reports/analytics/create-snapshot/')
        assert response.status_code == status.HTTP_201_CREATED
        assert AnalyticsSnapshot.objects.exists()

    def test_create_snapshot_regular_forbidden(self, user_client):
        response = user_client.post('/api/reports/analytics/create-snapshot/')
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_campaign_performance(self, admin_client):
        response = admin_client.get('/api/reports/analytics/campaign-performance/')
        assert response.status_code == status.HTTP_200_OK


@pytest.mark.unit
@pytest.mark.django_db
class TestChartViewSet:
    """Test ChartViewSet endpoints."""

    @pytest.fixture
    def admin_client(self, admin_user):
        client = APIClient()
        client.force_authenticate(user=admin_user)
        return client

    def test_guarantee_distribution_chart(self, admin_client):
        response = admin_client.get('/api/reports/charts/guarantee-distribution/')
        assert response.status_code == status.HTTP_200_OK
        assert 'data' in response.data

    def test_committee_comparison_chart(self, admin_client):
        response = admin_client.get('/api/reports/charts/committee-comparison/')
        assert response.status_code == status.HTTP_200_OK
        assert 'data' in response.data

