"""
Utility functions for WebSocket operations.
"""
import logging
from typing import Optional, Dict, Any
from django.core.cache import cache
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils import timezone

logger = logging.getLogger(__name__)


def get_channel_layer_safe():
    """
    Safely get channel layer, returning None if not configured.
    
    Returns:
        Channel layer instance or None
    """
    try:
        return get_channel_layer()
    except Exception as e:
        logger.warning(f"Channel layer not available: {e}")
        return None


def broadcast_to_group(
    group_name: str,
    message_type: str,
    event_data: Dict[str, Any],
    action: Optional[str] = None
) -> bool:
    """
    Broadcast a message to a WebSocket group.
    
    Args:
        group_name: Name of the channel group
        message_type: Type of message (e.g., 'guarantee_update')
        event_data: Event data dictionary (will be used as-is, with type set to message_type)
        action: Optional action (e.g., 'created', 'updated', 'deleted')
    
    Returns:
        True if broadcast was successful, False otherwise
    """
    channel_layer = get_channel_layer_safe()
    if not channel_layer:
        logger.debug(f"Channel layer not configured, skipping broadcast to {group_name}")
        return False
    
    try:
        # Ensure message_type is set correctly
        event_data['type'] = message_type
        
        # Add action if provided
        if action:
            event_data['action'] = action
        
        # Ensure timestamp is set
        if 'timestamp' not in event_data:
            event_data['timestamp'] = timezone.now().isoformat()
        
        async_to_sync(channel_layer.group_send)(
            group_name,
            event_data
        )
        logger.debug(f"Broadcasted {message_type}:{action} to {group_name}")
        return True
    except Exception as e:
        logger.error(f"Error broadcasting to {group_name}: {e}", exc_info=True)
        return False


def invalidate_dashboard_cache(dashboard_type: str = None):
    """
    Invalidate dashboard cache and optionally broadcast update.
    
    Args:
        dashboard_type: Type of dashboard ('personal', 'supervisor', 'admin') or None for all
    """
    from django.core.cache import cache
    
    cache_patterns = []
    if dashboard_type:
        cache_patterns.append(f"dashboard:{dashboard_type}:*")
    else:
        cache_patterns.extend([
            "dashboard:personal:*",
            "dashboard:supervisor:*",
            "dashboard:admin:*"
        ])
    
    # Note: Django cache doesn't support pattern deletion directly
    # This would need Redis-specific implementation or manual key tracking
    logger.info(f"Dashboard cache invalidation requested for: {dashboard_type or 'all'}")
    
    # Broadcast cache invalidation
    if dashboard_type:
        broadcast_to_group(
            'election_updates',
            'dashboard_update',
            {'cache_invalidated': True},
            'cache_invalidated'
        )


def get_connection_count() -> int:
    """
    Get approximate number of active WebSocket connections.
    
    Note: This is an approximation. For exact counts, you'd need to
    track connections in Redis or a database.
    
    Returns:
        Approximate connection count
    """
    # This is a placeholder - actual implementation would require
    # tracking connections in Redis or database
    return 0


def send_to_user(user_id: int, message_type: str, data: Dict[str, Any]) -> bool:
    """
    Send a message to a specific user's WebSocket connection.
    
    Args:
        user_id: ID of the user
        message_type: Type of message
        data: Data to send
    
    Returns:
        True if message was sent, False otherwise
    """
    # For user-specific channels, you'd need to implement user channel groups
    # This is a placeholder for future enhancement
    logger.debug(f"Send to user {user_id} not implemented yet")
    return False

