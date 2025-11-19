"""
Unit tests for WebSocket signal handlers.
"""
import pytest
from unittest.mock import Mock, patch, MagicMock
from django.test import TestCase
from django.db.models.signals import post_save, post_delete
from apps.utils.signals import (
    guarantee_saved,
    guarantee_deleted,
    attendance_saved,
    vote_count_saved,
    election_results_saved
)


class TestGuaranteeSignals(TestCase):
    """Test guarantee signal handlers."""
    
    @patch('apps.utils.signals.broadcast_to_group')
    @patch('apps.utils.signals.invalidate_dashboard_cache')
    @patch('apps.guarantees.serializers.GuaranteeListSerializer')
    def test_guarantee_saved_created(self, mock_serializer_class, mock_invalidate, mock_broadcast):
        """Test guarantee_saved signal for created guarantee."""
        # Setup
        mock_instance = Mock()
        mock_instance.id = 1
        mock_serializer = Mock()
        mock_serializer.data = {'id': 1, 'elector_id': 1}
        mock_serializer_class.return_value = mock_serializer
        
        # Call signal handler
        guarantee_saved(
            sender='guarantees.Guarantee',
            instance=mock_instance,
            created=True,
            raw=False
        )
        
        # Verify
        mock_serializer_class.assert_called_once_with(mock_instance)
        mock_broadcast.assert_called_once()
        mock_invalidate.assert_called_once()
        
        # Check broadcast call
        call_args = mock_broadcast.call_args
        assert call_args[0][0] == 'election_updates'  # group_name
        assert call_args[0][1] == 'guarantee_update'  # message_type
        assert call_args[0][2]['action'] == 'created'
    
    @patch('apps.utils.signals.broadcast_to_group')
    @patch('apps.utils.signals.invalidate_dashboard_cache')
    @patch('apps.guarantees.serializers.GuaranteeListSerializer')
    def test_guarantee_saved_updated(self, mock_serializer_class, mock_invalidate, mock_broadcast):
        """Test guarantee_saved signal for updated guarantee."""
        # Setup
        mock_instance = Mock()
        mock_instance.id = 1
        mock_serializer = Mock()
        mock_serializer.data = {'id': 1, 'elector_id': 1}
        mock_serializer_class.return_value = mock_serializer
        
        # Call signal handler
        guarantee_saved(
            sender='guarantees.Guarantee',
            instance=mock_instance,
            created=False,
            raw=False
        )
        
        # Verify
        mock_serializer_class.assert_called_once_with(mock_instance)
        mock_broadcast.assert_called_once()
        
        # Check broadcast call
        call_args = mock_broadcast.call_args
        assert call_args[0][0] == 'election_updates'  # group_name
        assert call_args[0][1] == 'guarantee_update'  # message_type
        assert call_args[0][2]['action'] == 'updated'
    
    @patch('apps.utils.signals.broadcast_to_group')
    @patch('apps.utils.signals.invalidate_dashboard_cache')
    def test_guarantee_saved_skip_bulk(self, mock_invalidate, mock_broadcast):
        """Test guarantee_saved signal skips bulk operations."""
        # Setup
        mock_instance = Mock()
        
        # Call signal handler with raw=True (bulk operation)
        guarantee_saved(
            sender='guarantees.Guarantee',
            instance=mock_instance,
            created=True,
            raw=True
        )
        
        # Verify no broadcast or cache invalidation
        mock_broadcast.assert_not_called()
        mock_invalidate.assert_not_called()
    
    @patch('apps.utils.signals.broadcast_to_group')
    @patch('apps.utils.signals.invalidate_dashboard_cache')
    @patch('apps.utils.signals.logger')
    def test_guarantee_saved_error_handling(self, mock_logger, mock_invalidate, mock_broadcast):
        """Test guarantee_saved signal error handling."""
        # Setup
        mock_instance = Mock()
        mock_broadcast.side_effect = Exception("Broadcast error")
        
        # Call signal handler
        guarantee_saved(
            sender='guarantees.Guarantee',
            instance=mock_instance,
            created=True,
            raw=False
        )
        
        # Verify error is logged
        mock_logger.error.assert_called_once()
    
    @patch('apps.utils.signals.broadcast_to_group')
    @patch('apps.utils.signals.invalidate_dashboard_cache')
    def test_guarantee_deleted(self, mock_invalidate, mock_broadcast):
        """Test guarantee_deleted signal."""
        # Setup
        mock_instance = Mock()
        mock_instance.id = 1
        mock_instance.elector_id = 1
        mock_instance.user_id = 1
        
        # Call signal handler
        guarantee_deleted(
            sender='guarantees.Guarantee',
            instance=mock_instance
        )
        
        # Verify
        mock_broadcast.assert_called_once()
        mock_invalidate.assert_called_once()
        
        # Check broadcast call
        call_args = mock_broadcast.call_args
        assert call_args[0][0] == 'election_updates'  # group_name
        assert call_args[0][1] == 'guarantee_update'  # message_type
        assert call_args[0][2]['action'] == 'deleted'
        assert call_args[0][2]['data']['id'] == 1


class TestAttendanceSignals(TestCase):
    """Test attendance signal handlers."""
    
    @patch('apps.utils.signals.broadcast_to_group')
    @patch('apps.utils.signals.invalidate_dashboard_cache')
    @patch('apps.attendees.serializers.AttendanceListSerializer')
    def test_attendance_saved_created(self, mock_serializer_class, mock_invalidate, mock_broadcast):
        """Test attendance_saved signal for created attendance."""
        # Setup
        mock_instance = Mock()
        mock_instance.id = 1
        mock_serializer = Mock()
        mock_serializer.data = {'id': 1, 'elector_id': 1}
        mock_serializer_class.return_value = mock_serializer
        
        # Call signal handler
        attendance_saved(
            sender='attendees.Attendance',
            instance=mock_instance,
            created=True,
            raw=False
        )
        
        # Verify
        mock_serializer_class.assert_called_once_with(mock_instance)
        mock_broadcast.assert_called_once()
        mock_invalidate.assert_called_once()
        
        # Check broadcast call
        call_args = mock_broadcast.call_args
        assert call_args[0][0] == 'election_updates'  # group_name
        assert call_args[0][1] == 'attendance_update'  # message_type
        assert call_args[0][2]['action'] == 'created'
    
    @patch('apps.utils.signals.broadcast_to_group')
    @patch('apps.utils.signals.invalidate_dashboard_cache')
    def test_attendance_saved_skip_bulk(self, mock_invalidate, mock_broadcast):
        """Test attendance_saved signal skips bulk operations."""
        # Setup
        mock_instance = Mock()
        
        # Call signal handler with raw=True (bulk operation)
        attendance_saved(
            sender='attendees.Attendance',
            instance=mock_instance,
            created=True,
            raw=True
        )
        
        # Verify no broadcast or cache invalidation
        mock_broadcast.assert_not_called()
        mock_invalidate.assert_not_called()


class TestVotingSignals(TestCase):
    """Test voting signal handlers."""
    
    @patch('apps.utils.signals.broadcast_to_group')
    @patch('apps.utils.signals.invalidate_dashboard_cache')
    @patch('apps.voting.serializers.VoteCountSerializer')
    def test_vote_count_saved_created(self, mock_serializer_class, mock_invalidate, mock_broadcast):
        """Test vote_count_saved signal for created vote count."""
        # Setup
        mock_instance = Mock()
        mock_instance.id = 1
        mock_instance.committee_entry = None
        mock_serializer = Mock()
        mock_serializer.data = {'id': 1}
        mock_serializer_class.return_value = mock_serializer
        
        # Call signal handler
        vote_count_saved(
            sender='voting.VoteCount',
            instance=mock_instance,
            created=True,
            raw=False
        )
        
        # Verify
        mock_serializer_class.assert_called_once_with(mock_instance)
        mock_broadcast.assert_called_once()
        mock_invalidate.assert_called_once()
        
        # Check broadcast call
        call_args = mock_broadcast.call_args
        assert call_args[0][0] == 'voting_update'
        assert call_args[0][1] == 'created'
    
    @patch('apps.utils.signals.broadcast_to_group')
    @patch('apps.utils.signals.invalidate_dashboard_cache')
    def test_vote_count_saved_skip_bulk(self, mock_invalidate, mock_broadcast):
        """Test vote_count_saved signal skips bulk operations."""
        # Setup
        mock_instance = Mock()
        
        # Call signal handler with raw=True (bulk operation)
        vote_count_saved(
            sender='voting.VoteCount',
            instance=mock_instance,
            created=True,
            raw=True
        )
        
        # Verify no broadcast or cache invalidation
        mock_broadcast.assert_not_called()
        mock_invalidate.assert_not_called()


class TestElectionResultsSignals(TestCase):
    """Test election results signal handlers."""
    
    @patch('apps.utils.signals.broadcast_to_group')
    @patch('apps.utils.signals.invalidate_dashboard_cache')
    @patch('apps.voting.serializers.ElectionResultsSerializer')
    def test_election_results_saved_created(self, mock_serializer_class, mock_invalidate, mock_broadcast):
        """Test election_results_saved signal for created results."""
        # Setup
        mock_instance = Mock()
        mock_instance.id = 1
        mock_instance.election_id = 1
        mock_serializer = Mock()
        mock_serializer.data = {'id': 1, 'election_id': 1}
        mock_serializer_class.return_value = mock_serializer
        
        # Call signal handler
        election_results_saved(
            sender='voting.ElectionResults',
            instance=mock_instance,
            created=True,
            raw=False
        )
        
        # Verify
        mock_serializer_class.assert_called_once_with(mock_instance)
        mock_broadcast.assert_called_once()
        mock_invalidate.assert_called_once()
        
        # Check broadcast call
        call_args = mock_broadcast.call_args
        assert call_args[0][0] == 'election_updates'  # group_name
        assert call_args[0][1] == 'voting_update'  # message_type
        # Check that election_id is in the data
        assert 'election_id' in call_args[0][2]
        assert call_args[0][2]['action_type'] == 'results_generated'

