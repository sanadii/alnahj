"""
Tests for user authentication and management.
"""
from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import CustomUser


class UserModelTest(TestCase):
    """Test CustomUser model."""
    
    def test_create_user(self):
        """Test creating a regular user."""
        user = CustomUser.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.role, 'USER')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
    
    def test_create_superuser(self):
        """Test creating a superuser."""
        user = CustomUser.objects.create_superuser(
            email='admin@example.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User'
        )
        self.assertEqual(user.role, 'SUPER_ADMIN')
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)
    
    def test_full_name_property(self):
        """Test full_name property."""
        user = CustomUser.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='John',
            last_name='Doe'
        )
        self.assertEqual(user.full_name, 'John Doe')


class AuthenticationAPITest(APITestCase):
    """Test authentication endpoints."""
    
    def setUp(self):
        """Setup test data."""
        self.user = CustomUser.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
    
    def test_login_success(self):
        """Test successful login."""
        response = self.client.post('/api/auth/login/', {
            'email': 'test@example.com',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials."""
        response = self.client.post('/api/auth/login/', {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserAPITest(APITestCase):
    """Test user management endpoints."""
    
    def setUp(self):
        """Setup test data and authenticate."""
        self.admin = CustomUser.objects.create_user(
            email='admin@example.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User',
            role='ADMIN'
        )
        self.client.force_authenticate(user=self.admin)
    
    def test_list_users(self):
        """Test listing users (admin only)."""
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_get_current_user_profile(self):
        """Test getting current user profile."""
        response = self.client.get('/api/users/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'admin@example.com')
