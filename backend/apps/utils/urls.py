"""
URL configuration for utility endpoints.
"""
from django.urls import path
from .views import websocket_health

urlpatterns = [
    path('websocket/health/', websocket_health, name='websocket-health'),
]

