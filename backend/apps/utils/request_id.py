"""
Request ID Generator Utility
Generates unique request IDs for tracking and debugging
"""
import uuid
from django.utils import timezone


def generate_request_id():
    """
    Generate a unique request ID for tracking.
    
    Returns:
        str: UUID4 string for unique request identification
    
    Example:
        >>> generate_request_id()
        'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    """
    return str(uuid.uuid4())


def generate_request_meta(request_id=None, extra_meta=None):
    """
    Generate meta object with timestamp and request ID.
    
    Args:
        request_id (str, optional): Existing request ID or generate new one
        extra_meta (dict, optional): Additional metadata to include
    
    Returns:
        dict: Meta object with timestamp, request_id, and optional extras
    
    Example:
        >>> generate_request_meta()
        {
            'timestamp': '2025-10-25T12:00:00.000Z',
            'request_id': 'a1b2c3d4-...'
        }
    """
    meta = {
        'timestamp': timezone.now().isoformat(),
        'request_id': request_id or generate_request_id()
    }
    
    if extra_meta and isinstance(extra_meta, dict):
        meta.update(extra_meta)
    
    return meta



























