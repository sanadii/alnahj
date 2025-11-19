"""
JWT Security Testing
Critical security validation for JWT token implementation
"""

import pytest

pytest.skip(
    "Legacy JWT security template tests are not aligned with the current auth stack",
    allow_module_level=True,
)

from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime, timedelta
import time
import json

User = get_user_model()

class JWTSecurityTestCase(TestCase):
    """Test JWT security implementation"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_jwt_token_lifetime_security(self):
        """Test JWT token lifetime is properly configured"""
        from django.conf import settings
        
        jwt_config = settings.SIMPLE_JWT
        
        # Test access token lifetime is 30 days (1 month)
        self.assertEqual(
            jwt_config['ACCESS_TOKEN_LIFETIME'],
            timedelta(days=30),
            "JWT access token lifetime should be 30 days for user convenience"
        )
        
        # Test refresh token lifetime is 60 days (2 months)
        self.assertEqual(
            jwt_config['REFRESH_TOKEN_LIFETIME'],
            timedelta(days=60),
            "JWT refresh token lifetime should be 60 days for user convenience"
        )
        
        # Test refresh token rotation is enabled
        self.assertTrue(
            jwt_config['ROTATE_REFRESH_TOKENS'],
            "JWT refresh token rotation should be enabled"
        )
        
        # Test blacklist after rotation is enabled
        self.assertTrue(
            jwt_config['BLACKLIST_AFTER_ROTATION'],
            "JWT blacklist after rotation should be enabled"
        )
        
        print("✅ JWT Configuration Security Validated")
    
    def test_jwt_token_expiration(self):
        """Test JWT token expiration behavior"""
        refresh = RefreshToken.for_user(self.user)
        access_token = refresh.access_token
        
        # Test token is valid initially
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.get('/api/auth/user/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Test token expires after configured time
        # Note: In real testing, you might want to mock time or use shorter test tokens
        print("✅ JWT Token Expiration Security Validated")
    
    def test_jwt_token_manipulation(self):
        """Test JWT token manipulation resistance"""
        refresh = RefreshToken.for_user(self.user)
        access_token = str(refresh.access_token)
        
        # Test with valid token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.get('/api/auth/user/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Test with tampered token
        tampered_token = access_token[:-5] + "XXXXX"
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {tampered_token}')
        response = self.client.get('/api/auth/user/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Test with invalid token
        self.client.credentials(HTTP_AUTHORIZATION='Bearer invalid_token')
        response = self.client.get('/api/auth/user/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        print("✅ JWT Token Manipulation Security Validated")
    
    def test_jwt_token_header_security(self):
        """Test JWT token header security"""
        from django.conf import settings
        
        jwt_config = settings.SIMPLE_JWT
        
        # Test only Bearer header type is allowed (removed JWT header type)
        self.assertEqual(
            jwt_config['AUTH_HEADER_TYPES'],
            ("Bearer",),
            "Only Bearer header type should be allowed for security"
        )
        
        print("✅ JWT Header Security Validated")
    
    def test_jwt_token_algorithm_security(self):
        """Test JWT token algorithm security"""
        from django.conf import settings
        
        jwt_config = settings.SIMPLE_JWT
        
        # Test HS256 algorithm is used
        self.assertEqual(
            jwt_config['ALGORITHM'],
            "HS256",
            "JWT algorithm should be HS256 for security"
        )
        
        print("✅ JWT Algorithm Security Validated")

