"""
Django signals for broadcasting real-time updates via WebSocket.
"""
import logging
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from apps.utils.websocket_utils import broadcast_to_group, invalidate_dashboard_cache

logger = logging.getLogger(__name__)


def broadcast_update(message_type, action, data, dashboard_type=None):
    """
    Broadcast update to all connected WebSocket clients.
    
    Args:
        message_type: 'guarantee_update', 'attendance_update', 'voting_update', 'dashboard_update'
        action: 'created', 'updated', 'deleted'
        data: Serialized data to send
        dashboard_type: Optional, for dashboard updates ('personal', 'supervisor', 'admin')
    """
    group_name = 'election_updates'
    
    event_data = {
        'type': message_type,
        'action': action,
        'data': data,
        'timestamp': timezone.now().isoformat(),
    }
    
    if dashboard_type:
        event_data['dashboard_type'] = dashboard_type
    
    success = broadcast_to_group(
        group_name,
        message_type,
        event_data,
        action
    )
    
    if not success:
        logger.debug(f"Failed to broadcast {message_type}:{action}")


# Guarantee signals
@receiver(post_save, sender='guarantees.Guarantee')
def guarantee_saved(sender, instance, created, **kwargs):
    """Broadcast guarantee create/update."""
    from apps.guarantees.serializers import GuaranteeListSerializer
    
    try:
        # Only broadcast if not a bulk operation
        if kwargs.get('raw', False):
            return
        
        serializer = GuaranteeListSerializer(instance)
        action = 'created' if created else 'updated'
        
        broadcast_update(
            'guarantee_update',
            action,
            serializer.data
        )
        
        # Invalidate dashboard cache
        invalidate_dashboard_cache()
        
    except Exception as e:
        logger.error(f"Error broadcasting guarantee update: {e}", exc_info=True)


@receiver(post_delete, sender='guarantees.Guarantee')
def guarantee_deleted(sender, instance, **kwargs):
    """Broadcast guarantee delete."""
    try:
        broadcast_update(
            'guarantee_update',
            'deleted',
            {
                'id': instance.id,
                'elector_id': instance.elector_id,
                'user_id': instance.user_id if hasattr(instance, 'user_id') else None
            }
        )
        
        # Invalidate dashboard cache
        invalidate_dashboard_cache()
        
    except Exception as e:
        logger.error(f"Error broadcasting guarantee delete: {e}", exc_info=True)


# Attendance signals
@receiver(post_save, sender='attendees.Attendance')
def attendance_saved(sender, instance, created, **kwargs):
    """Broadcast attendance mark."""
    from apps.attendees.serializers import AttendanceListSerializer
    
    try:
        # Only broadcast if not a bulk operation
        if kwargs.get('raw', False):
            return
        
        serializer = AttendanceListSerializer(instance)
        action = 'created' if created else 'updated'
        
        broadcast_update(
            'attendance_update',
            action,
            serializer.data
        )
        
        # Invalidate dashboard cache
        invalidate_dashboard_cache()
        
    except Exception as e:
        logger.error(f"Error broadcasting attendance update: {e}", exc_info=True)


# Voting signals
@receiver(post_save, sender='voting.VoteCount')
def vote_count_saved(sender, instance, created, **kwargs):
    """Broadcast vote count update."""
    try:
        # Only broadcast if not a bulk operation
        if kwargs.get('raw', False):
            return
        
        from apps.voting.serializers import VoteCountSerializer
        serializer = VoteCountSerializer(instance)
        action = 'created' if created else 'updated'
        
        committee_id = None
        if hasattr(instance, 'committee_entry') and instance.committee_entry:
            committee_id = instance.committee_entry.committee_id
        
        broadcast_update(
            'voting_update',
            action,
            {
                'vote_count': serializer.data,
                'committee_id': committee_id,
            }
        )
        
        # Invalidate dashboard cache
        invalidate_dashboard_cache()
        
    except Exception as e:
        logger.error(f"Error broadcasting vote count update: {e}", exc_info=True)


@receiver(post_save, sender='voting.ElectionResults')
def election_results_saved(sender, instance, created, **kwargs):
    """Broadcast election results update."""
    try:
        # Only broadcast if not a bulk operation
        if kwargs.get('raw', False):
            return
        
        from apps.voting.serializers import ElectionResultsSerializer
        serializer = ElectionResultsSerializer(instance)
        action = 'created' if created else 'updated'
        
        broadcast_update(
            'voting_update',
            action,
            {
                'results': serializer.data,
                'action_type': 'results_generated' if created else 'results_updated',
                'election_id': instance.election_id if hasattr(instance, 'election_id') else None,
            }
        )
        
        # Invalidate dashboard cache
        invalidate_dashboard_cache()
        
    except Exception as e:
        logger.error(f"Error broadcasting election results update: {e}", exc_info=True)

