"""
URL configuration for reports endpoints.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DashboardViewSet, ReportsViewSet, AnalyticsViewSet, ChartViewSet

router = DefaultRouter()

app_name = 'reports'

urlpatterns = [
    # Dashboards
    path('dashboard/personal/', DashboardViewSet.as_view({'get': 'personal'}), name='dashboard-personal'),
    path('dashboard/supervisor/', DashboardViewSet.as_view({'get': 'supervisor'}), name='dashboard-supervisor'),
    path('dashboard/admin/', DashboardViewSet.as_view({'get': 'admin'}), name='dashboard-admin'),
    
    # Reports
    path('coverage/', ReportsViewSet.as_view({'get': 'coverage'}), name='report-coverage'),
    path('accuracy/', ReportsViewSet.as_view({'get': 'accuracy'}), name='report-accuracy'),
    path('committee-performance/', ReportsViewSet.as_view({'get': 'committee_performance'}), name='report-committee'),
    path('export/', ReportsViewSet.as_view({'post': 'export'}), name='report-export'),
    
    # Analytics
    path('analytics/trends/', AnalyticsViewSet.as_view({'get': 'trends'}), name='analytics-trends'),
    path('analytics/create-snapshot/', AnalyticsViewSet.as_view({'post': 'create_snapshot'}), name='analytics-snapshot'),
    path('analytics/campaign-performance/', ReportsViewSet.as_view({'get': 'campaign_performance'}), name='analytics-campaign-performance'),
    
    # Charts
    path('charts/guarantee-distribution/', ChartViewSet.as_view({'get': 'guarantee_distribution'}), name='chart-guarantee-dist'),
    path('charts/committee-comparison/', ChartViewSet.as_view({'get': 'committee_comparison'}), name='chart-committee-comp'),
]
