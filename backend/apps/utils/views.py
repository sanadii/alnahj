"""
Utility views for WebSocket and real-time updates.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from apps.utils.permissions import IsAdminOrAbove
from rest_framework.response import Response
from rest_framework import status
from apps.utils.responses import APIResponse
from apps.utils.websocket_utils import get_connection_count, get_channel_layer_safe


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminOrAbove])
def websocket_health(request):
    """
    Health check endpoint for WebSocket infrastructure.
    
    GET /api/utils/websocket/health/
    """
    channel_layer = get_channel_layer_safe()
    
    health_data = {
        'channel_layer_configured': channel_layer is not None,
        'channel_layer_type': type(channel_layer).__name__ if channel_layer else None,
        'connection_count': get_connection_count(),
    }
    
    if channel_layer:
        return APIResponse.success(
            data=health_data,
            message='WebSocket infrastructure is healthy'
        )
    else:
        return APIResponse.error(
            message='WebSocket channel layer not configured',
            errors=health_data,
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE
        )

