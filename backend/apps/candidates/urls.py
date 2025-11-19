"""
URL configuration for candidates endpoints.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PartyViewSet, CandidateViewSet

router = DefaultRouter()
router.register(r'parties', PartyViewSet, basename='party')
router.register(r'', CandidateViewSet, basename='candidate')

app_name = 'candidates'

urlpatterns = [
    path('', include(router.urls)),
]

