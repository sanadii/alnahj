"""
WebSocket URL routing for real-time updates.
"""
from django.urls import path
from apps.utils.consumers import ElectionUpdatesConsumer

websocket_urlpatterns = [
    path('ws/election-updates/', ElectionUpdatesConsumer.as_asgi()),
]

