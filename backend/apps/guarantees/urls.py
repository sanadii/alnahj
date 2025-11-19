"""
URL configuration for guarantee endpoints.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GuaranteeGroupViewSet, GuaranteeViewSet, TeamDashboardViewSet

router = DefaultRouter()
router.register(r'groups', GuaranteeGroupViewSet, basename='guarantee-group')
router.register(r'', GuaranteeViewSet, basename='guarantee')

app_name = 'guarantees'

urlpatterns = [
    path('', include(router.urls)),
    path('team/', TeamDashboardViewSet.as_view({'get': 'statistics'}), name='team-statistics'),
]
