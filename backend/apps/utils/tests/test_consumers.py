"""
Unit tests for WebSocket consumers.
"""
import pytest
import json
from channels.testing import WebsocketCommunicator
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from apps.utils.consumers import ElectionUpdatesConsumer

User = get_user_model()


@pytest.mark.asyncio
@pytest.mark.django_db
class TestElectionUpdatesConsumer:
    """Test ElectionUpdatesConsumer."""
    
    @pytest.fixture
    def user(self):
        """Create a test user."""
        return User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
    
    @pytest.fixture
    def token(self, user):
        """Create a JWT token for the test user."""
        return str(AccessToken.for_user(user))
    
    async def test_connect_with_valid_token(self, token):
        """Test connection with valid JWT token."""
        communicator = WebsocketCommunicator(
            ElectionUpdatesConsumer.as_asgi(),
            f"/ws/election-updates/?token={token}"
        )
        
        connected, subprotocol = await communicator.connect()
        
        assert connected is True
        
        # Check for connection success message
        response = await communicator.receive_json_from()
        assert response['type'] == 'connection_success'
        assert 'message' in response
        assert 'timestamp' in response
        
        await communicator.disconnect()
    
    async def test_connect_without_token(self):
        """Test connection rejection without token."""
        communicator = WebsocketCommunicator(
            ElectionUpdatesConsumer.as_asgi(),
            "/ws/election-updates/"
        )
        
        connected, subprotocol = await communicator.connect()
        
        assert connected is False
    
    async def test_connect_with_invalid_token(self):
        """Test connection rejection with invalid token."""
        communicator = WebsocketCommunicator(
            ElectionUpdatesConsumer.as_asgi(),
            "/ws/election-updates/?token=invalid_token_12345"
        )
        
        connected, subprotocol = await communicator.connect()
        
        assert connected is False
    
    async def test_guarantee_update_message(self, token):
        """Test guarantee_update message handler."""
        communicator = WebsocketCommunicator(
            ElectionUpdatesConsumer.as_asgi(),
            f"/ws/election-updates/?token={token}"
        )
        
        connected, subprotocol = await communicator.connect()
        assert connected is True
        
        # Consume connection success message
        await communicator.receive_json_from()
        
        # Send guarantee_update event
        await communicator.send_json_to({
            'type': 'guarantee_update',
            'action': 'created',
            'data': {'id': 1, 'elector_id': 1}
        })
        
        # Note: In real scenario, this would come from channel layer
        # For testing, we can directly call the handler
        await communicator.disconnect()
    
    async def test_ping_pong(self, token):
        """Test ping/pong mechanism."""
        communicator = WebsocketCommunicator(
            ElectionUpdatesConsumer.as_asgi(),
            f"/ws/election-updates/?token={token}"
        )
        
        connected, subprotocol = await communicator.connect()
        assert connected is True
        
        # Consume connection success message
        await communicator.receive_json_from()
        
        # Send ping
        ping_timestamp = "2024-01-01T00:00:00Z"
        await communicator.send_json_to({
            'type': 'ping',
            'timestamp': ping_timestamp
        })
        
        # Receive pong
        response = await communicator.receive_json_from()
        assert response['type'] == 'pong'
        assert response['timestamp'] == ping_timestamp
        
        await communicator.disconnect()
    
    async def test_subscribe_message(self, token):
        """Test subscribe message handler."""
        communicator = WebsocketCommunicator(
            ElectionUpdatesConsumer.as_asgi(),
            f"/ws/election-updates/?token={token}"
        )
        
        connected, subprotocol = await communicator.connect()
        assert connected is True
        
        # Consume connection success message
        await communicator.receive_json_from()
        
        # Send subscribe message
        await communicator.send_json_to({
            'type': 'subscribe',
            'channels': ['guarantees', 'attendance']
        })
        
        # Receive subscribed confirmation
        response = await communicator.receive_json_from()
        assert response['type'] == 'subscribed'
        assert 'channels' in response
        
        await communicator.disconnect()
    
    async def test_invalid_json_message(self, token):
        """Test handling of invalid JSON message."""
        communicator = WebsocketCommunicator(
            ElectionUpdatesConsumer.as_asgi(),
            f"/ws/election-updates/?token={token}"
        )
        
        connected, subprotocol = await communicator.connect()
        assert connected is True
        
        # Consume connection success message
        await communicator.receive_json_from()
        
        # Send invalid JSON
        await communicator.send_to(text_data="invalid json {")
        
        # Connection should remain open (error is logged but doesn't close connection)
        # No response expected for invalid JSON
        
        await communicator.disconnect()
    
    async def test_disconnect_handling(self, token):
        """Test disconnect handling."""
        communicator = WebsocketCommunicator(
            ElectionUpdatesConsumer.as_asgi(),
            f"/ws/election-updates/?token={token}"
        )
        
        connected, subprotocol = await communicator.connect()
        assert connected is True
        
        # Consume connection success message
        await communicator.receive_json_from()
        
        # Disconnect
        await communicator.disconnect()
        
        # Should disconnect cleanly without errors

