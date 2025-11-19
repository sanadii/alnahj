"""
WebSocket consumers for real-time updates.
"""
import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)
User = get_user_model()


class ElectionUpdatesConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for broadcasting election system updates.
    
    Handles:
    - Guarantee updates (create, update, delete)
    - Attendance updates (mark attendance)
    - Voting updates (vote entry, results)
    - Dashboard statistics updates
    """
    
    async def connect(self):
        """Handle WebSocket connection with JWT authentication."""
        self.user = None
        self.room_group_name = 'election_updates'
        self.connected_at = None
        
        try:
            # Get token from query string
            query_string = self.scope.get('query_string', b'').decode()
            token = None
            
            if 'token=' in query_string:
                token = query_string.split('token=')[-1].split('&')[0]
            
            if not token:
                # Try to get from headers
                headers = dict(self.scope.get('headers', []))
                auth_header = headers.get(b'authorization', b'').decode()
                if auth_header.startswith('Bearer '):
                    token = auth_header.split(' ', 1)[1]
            
            if not token:
                logger.warning("WebSocket connection rejected: No token provided")
                await self.close(code=4001)
                return
            
            # Validate JWT token
            try:
                validated_data = await self.validate_token(token)
                user_id = validated_data.get('user_id')
                
                if not user_id:
                    logger.warning("WebSocket connection rejected: No user_id in token")
                    await self.close(code=4001)
                    return
                
                # Get user
                self.user = await self.get_user(user_id)
                
                if not self.user:
                    logger.warning(f"WebSocket connection rejected: User {user_id} not found or inactive")
                    await self.close(code=4001)
                    return
                
                # Add to channel group
                await self.channel_layer.group_add(
                    self.room_group_name,
                    self.channel_name
                )
                
                # Accept connection
                await self.accept()
                
                from django.utils import timezone
                self.connected_at = timezone.now()
                
                logger.info(
                    f"WebSocket connected: User {self.user.email} ({self.user.id}) "
                    f"from {self.scope.get('client', ['unknown'])[0]}"
                )
                
                # Send connection confirmation
                await self.send(text_data=json.dumps({
                    'type': 'connection_success',
                    'message': 'Connected to real-time updates',
                    'timestamp': self.connected_at.isoformat()
                }))
                
            except (InvalidToken, TokenError) as e:
                logger.warning(f"WebSocket connection rejected: Invalid token - {e}")
                await self.close(code=4001)
            except Exception as e:
                logger.error(f"WebSocket connection error: {e}", exc_info=True)
                await self.close(code=4002)
                
        except Exception as e:
            logger.error(f"WebSocket connection setup error: {e}", exc_info=True)
            await self.close(code=4002)
    
    async def disconnect(self, close_code):
        """Handle WebSocket disconnection."""
        if self.user:
            try:
                await self.channel_layer.group_discard(
                    self.room_group_name,
                    self.channel_name
                )
                
                duration = None
                if self.connected_at:
                    from django.utils import timezone
                    duration = (timezone.now() - self.connected_at).total_seconds()
                
                logger.info(
                    f"WebSocket disconnected: User {self.user.email} ({self.user.id}) "
                    f"code={close_code} duration={duration:.1f}s" if duration else f"code={close_code}"
                )
            except Exception as e:
                logger.error(f"Error during WebSocket disconnect: {e}", exc_info=True)
    
    async def receive(self, text_data):
        """Handle messages received from WebSocket client."""
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'ping':
                # Respond to ping with pong
                await self.send(text_data=json.dumps({
                    'type': 'pong',
                    'timestamp': data.get('timestamp')
                }))
            elif message_type == 'subscribe':
                # Handle subscription to specific channels (future enhancement)
                await self.send(text_data=json.dumps({
                    'type': 'subscribed',
                    'channels': data.get('channels', [])
                }))
        except json.JSONDecodeError:
            logger.warning(f"Invalid JSON received: {text_data}")
    
    # Handler methods for different message types
    async def guarantee_update(self, event):
        """Send guarantee update to WebSocket."""
        try:
            await self.send(text_data=json.dumps({
                'type': 'guarantee_update',
                'action': event.get('action'),  # 'created', 'updated', 'deleted'
                'data': event.get('data'),
                'timestamp': event.get('timestamp'),
            }))
        except Exception as e:
            logger.error(f"Error sending guarantee_update to {self.user}: {e}", exc_info=True)
    
    async def attendance_update(self, event):
        """Send attendance update to WebSocket."""
        try:
            await self.send(text_data=json.dumps({
                'type': 'attendance_update',
                'action': event.get('action'),
                'data': event.get('data'),
                'timestamp': event.get('timestamp'),
            }))
        except Exception as e:
            logger.error(f"Error sending attendance_update to {self.user}: {e}", exc_info=True)
    
    async def voting_update(self, event):
        """Send voting update to WebSocket."""
        try:
            await self.send(text_data=json.dumps({
                'type': 'voting_update',
                'action': event.get('action'),
                'data': event.get('data'),
                'timestamp': event.get('timestamp'),
            }))
        except Exception as e:
            logger.error(f"Error sending voting_update to {self.user}: {e}", exc_info=True)
    
    async def dashboard_update(self, event):
        """Send dashboard statistics update to WebSocket."""
        try:
            await self.send(text_data=json.dumps({
                'type': 'dashboard_update',
                'dashboard_type': event.get('dashboard_type'),  # 'personal', 'supervisor', 'admin'
                'data': event.get('data'),
                'timestamp': event.get('timestamp'),
            }))
        except Exception as e:
            logger.error(f"Error sending dashboard_update to {self.user}: {e}", exc_info=True)
    
    @database_sync_to_async
    def validate_token(self, token):
        """Validate JWT token and return payload."""
        try:
            untyped_token = UntypedToken(token)
            from rest_framework_simplejwt.settings import api_settings
            from rest_framework_simplejwt.tokens import AccessToken
            
            access_token = AccessToken(token)
            return access_token
        except (InvalidToken, TokenError) as e:
            raise e
    
    @database_sync_to_async
    def get_user(self, user_id):
        """Get user by ID."""
        try:
            return User.objects.get(id=user_id, is_active=True)
        except User.DoesNotExist:
            return None

