"""
Unit tests for WebSocket utility functions.
"""
import pytest
from unittest.mock import Mock, patch, MagicMock
from django.test import TestCase
from apps.utils.websocket_utils import (
    get_channel_layer_safe,
    broadcast_to_group,
    invalidate_dashboard_cache,
    get_connection_count,
    send_to_user
)


class TestGetChannelLayerSafe(TestCase):
    """Test get_channel_layer_safe function."""
    
    @patch('apps.utils.websocket_utils.get_channel_layer')
    def test_get_channel_layer_success(self, mock_get_channel_layer):
        """Test successful channel layer retrieval."""
        mock_layer = MagicMock()
        mock_get_channel_layer.return_value = mock_layer
        
        result = get_channel_layer_safe()
        
        self.assertEqual(result, mock_layer)
        mock_get_channel_layer.assert_called_once()
    
    @patch('apps.utils.websocket_utils.get_channel_layer')
    @patch('apps.utils.websocket_utils.logger')
    def test_get_channel_layer_failure(self, mock_logger, mock_get_channel_layer):
        """Test channel layer retrieval failure."""
        mock_get_channel_layer.side_effect = Exception("Channel layer not configured")
        
        result = get_channel_layer_safe()
        
        self.assertIsNone(result)
        mock_logger.warning.assert_called_once()


class TestBroadcastToGroup(TestCase):
    """Test broadcast_to_group function."""
    
    @patch('apps.utils.websocket_utils.get_channel_layer_safe')
    @patch('apps.utils.websocket_utils.async_to_sync')
    def test_broadcast_success(self, mock_async_to_sync, mock_get_channel_layer):
        """Test successful broadcast."""
        mock_layer = MagicMock()
        mock_get_channel_layer.return_value = mock_layer
        mock_async_to_sync.return_value = MagicMock()
        
        event_data = {'data': {'id': 1}}
        result = broadcast_to_group('test_group', 'test_type', event_data, 'created')
        
        self.assertTrue(result)
        mock_get_channel_layer.assert_called_once()
        mock_async_to_sync.assert_called_once()
    
    @patch('apps.utils.websocket_utils.get_channel_layer_safe')
    def test_broadcast_no_channel_layer(self, mock_get_channel_layer):
        """Test broadcast when channel layer is not available."""
        mock_get_channel_layer.return_value = None
        
        event_data = {'data': {'id': 1}}
        result = broadcast_to_group('test_group', 'test_type', event_data)
        
        self.assertFalse(result)
    
    @patch('apps.utils.websocket_utils.get_channel_layer_safe')
    @patch('apps.utils.websocket_utils.async_to_sync')
    @patch('apps.utils.websocket_utils.logger')
    def test_broadcast_error(self, mock_logger, mock_async_to_sync, mock_get_channel_layer):
        """Test broadcast error handling."""
        mock_layer = MagicMock()
        mock_get_channel_layer.return_value = mock_layer
        mock_async_to_sync.side_effect = Exception("Broadcast failed")
        
        event_data = {'data': {'id': 1}}
        result = broadcast_to_group('test_group', 'test_type', event_data)
        
        self.assertFalse(result)
        mock_logger.error.assert_called_once()
    
    @patch('apps.utils.websocket_utils.get_channel_layer_safe')
    @patch('apps.utils.websocket_utils.async_to_sync')
    def test_broadcast_sets_type_and_action(self, mock_async_to_sync, mock_get_channel_layer):
        """Test that broadcast sets type and action correctly."""
        mock_layer = MagicMock()
        mock_get_channel_layer.return_value = mock_layer
        
        # Create a mock that captures the call
        captured_call = []
        def capture_call(*args, **kwargs):
            captured_call.append((args, kwargs))
            return None
        
        mock_async_to_sync.side_effect = capture_call
        
        event_data = {'data': {'id': 1}}
        broadcast_to_group('test_group', 'test_type', event_data, 'created')
        
        # Verify async_to_sync was called
        mock_async_to_sync.assert_called_once()
        # async_to_sync is called with a function that takes (group_name, event_data)
        # The actual call is: async_to_sync(channel_layer.group_send)(group_name, event_data)
        # So we need to check what function was passed and what it was called with
        # Since we're mocking async_to_sync, we check the event_data was modified correctly
        self.assertEqual(event_data['type'], 'test_type')
        self.assertEqual(event_data['action'], 'created')
        self.assertIn('timestamp', event_data)


class TestInvalidateDashboardCache(TestCase):
    """Test invalidate_dashboard_cache function."""
    
    @patch('apps.utils.websocket_utils.broadcast_to_group')
    def test_invalidate_all_dashboards(self, mock_broadcast):
        """Test invalidating all dashboard caches."""
        # When dashboard_type is None, broadcast_to_group is NOT called
        # It only logs the invalidation request
        invalidate_dashboard_cache()
        
        # Verify broadcast_to_group is not called (only called when dashboard_type is provided)
        mock_broadcast.assert_not_called()
    
    @patch('apps.utils.websocket_utils.broadcast_to_group')
    def test_invalidate_specific_dashboard(self, mock_broadcast):
        """Test invalidating specific dashboard cache."""
        invalidate_dashboard_cache('personal')
        
        mock_broadcast.assert_called_once()
        call_args = mock_broadcast.call_args
        self.assertEqual(call_args[0][0], 'election_updates')
        self.assertEqual(call_args[0][1], 'dashboard_update')


class TestGetConnectionCount(TestCase):
    """Test get_connection_count function."""
    
    def test_get_connection_count_placeholder(self):
        """Test that get_connection_count returns placeholder value."""
        # Currently returns 0 as placeholder
        result = get_connection_count()
        self.assertEqual(result, 0)


class TestSendToUser(TestCase):
    """Test send_to_user function."""
    
    @patch('apps.utils.websocket_utils.logger')
    def test_send_to_user_placeholder(self, mock_logger):
        """Test that send_to_user is a placeholder."""
        result = send_to_user(1, 'test_type', {'data': 'test'})
        
        self.assertFalse(result)
        mock_logger.debug.assert_called_once()

