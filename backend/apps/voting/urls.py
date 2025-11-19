"""
URL configuration for voting endpoints.

Note: Parties and Candidates have been moved to /api/candidates/
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    VoteCountViewSet,
    CommitteeVoteEntryViewSet,
    ElectionResultsViewSet
)

router = DefaultRouter()
router.register(r'vote-counts', VoteCountViewSet, basename='vote-count')
router.register(r'committee-entries', CommitteeVoteEntryViewSet, basename='committee-entry')

app_name = 'voting'

urlpatterns = [
    path('', include(router.urls)),
    
    # Results endpoints
    path('results/', ElectionResultsViewSet.as_view({'get': 'current'}), name='results-current'),
    path('results/generate/', ElectionResultsViewSet.as_view({'post': 'generate'}), name='results-generate'),
    path('results/publish/', ElectionResultsViewSet.as_view({'post': 'publish'}), name='results-publish'),
    path('results/summary/', ElectionResultsViewSet.as_view({'get': 'summary'}), name='results-summary'),
    path('results/by-committee/', ElectionResultsViewSet.as_view({'get': 'by_committee'}), name='results-by-committee'),
]
