from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AttendanceDashboardView,
    CommitteeViewSet,
    DashboardOverviewView,
    ElectorDemographicsView,
    ElectorDistributionView,
    ElectionViewSet,
    GuaranteeDistributionView,
    GuaranteesTrendView,
    GroupPerformanceView,
    HourlyAttendanceView,
)

router = DefaultRouter()
router.register(r'committees', CommitteeViewSet, basename='election-committee')
router.register(r'', ElectionViewSet, basename='election')

app_name = 'elections'

urlpatterns = [
    path('', include(router.urls)),
    path(
        '<int:election_id>/dashboard/guarantees/trends/',
        GuaranteesTrendView.as_view(),
        name='guarantee-trend',
    ),
    path(
        '<int:election_id>/dashboard/guarantees/distribution/',
        GuaranteeDistributionView.as_view(),
        name='guarantee-distribution',
    ),
    path(
        '<int:election_id>/dashboard/groups/performance/',
        GroupPerformanceView.as_view(),
        name='group-performance',
    ),
    path(
        '<int:election_id>/dashboard/attendance/hourly/',
        HourlyAttendanceView.as_view(),
        name='hourly-attendance',
    ),
    path(
        '<int:election_id>/dashboard/electors/demographics/',
        ElectorDemographicsView.as_view(),
        name='elector-demographics',
    ),
    path(
        '<int:election_id>/dashboard/electors/distribution/',
        ElectorDistributionView.as_view(),
        name='elector-distribution',
    ),
    path(
        '<int:election_id>/dashboard/attendance/summary/',
        AttendanceDashboardView.as_view(),
        name='attendance-dashboard',
    ),
    path(
        '<int:election_id>/dashboard/overview/',
        DashboardOverviewView.as_view(),
        name='dashboard-overview',
    ),
]
