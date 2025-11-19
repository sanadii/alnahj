"""
URL configuration for elector endpoints.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ElectorViewSet

router = DefaultRouter()
router.register(r'', ElectorViewSet, basename='elector')

app_name = 'electors'

urlpatterns = [
    path('', include(router.urls)),
]
