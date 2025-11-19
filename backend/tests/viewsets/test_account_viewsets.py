"""
Unit tests for Account/User ViewSets.
"""
import pytest
from rest_framework.test import APIClient
from rest_framework import status

from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.unit
@pytest.mark.django_db
class TestUserViewSet:
    """Test UserViewSet CRUD and custom actions."""

    @pytest.fixture
    def admin_client(self, admin_user):
        client = APIClient()
        client.force_authenticate(user=admin_user)
        return client

    @pytest.fixture
    def supervisor_client(self, supervisor_user):
        client = APIClient()
        client.force_authenticate(user=supervisor_user)
        return client

    @pytest.fixture
    def user_client(self, regular_user):
        client = APIClient()
        client.force_authenticate(user=regular_user)
        return client

    @pytest.fixture
    def test_user(self, django_user_model):
        return django_user_model.objects.create_user(
            email='testuser@example.com',
            password='testpass123',
            role='USER',
            first_name='Test',
            last_name='User',
        )

    def test_list_users_admin(self, admin_client, test_user, admin_user):
        response = admin_client.get('/api/users/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']) >= 2  # admin + test user

    def test_list_users_supervisor_forbidden(self, supervisor_client):
        response = supervisor_client.get('/api/users/')
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_list_users_regular_user_forbidden(self, user_client):
        response = user_client.get('/api/users/')
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_create_user_admin(self, admin_client):
        data = {
            'email': 'newuser@example.com',
            'password': 'testpass123',
            'first_name': 'New',
            'last_name': 'User',
            'role': 'USER',
        }
        response = admin_client.post('/api/users/', data)
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(email='newuser@example.com').exists()

    def test_create_user_regular_forbidden(self, user_client):
        data = {'email': 'newuser@example.com', 'password': 'testpass123', 'role': 'USER'}
        response = user_client.post('/api/users/', data)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_retrieve_user(self, admin_client, test_user):
        response = admin_client.get(f'/api/users/{test_user.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['data']['email'] == 'testuser@example.com'

    def test_update_user(self, admin_client, test_user):
        data = {
            'email': test_user.email,
            'first_name': 'Updated',
            'last_name': 'Name',
            'role': test_user.role,
        }
        response = admin_client.put(f'/api/users/{test_user.id}/', data)
        assert response.status_code == status.HTTP_200_OK
        test_user.refresh_from_db()
        assert test_user.first_name == 'Updated'

    def test_delete_user_admin(self, admin_client, test_user):
        response = admin_client.delete(f'/api/users/{test_user.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert not User.objects.filter(id=test_user.id).exists()

    def test_delete_user_regular_forbidden(self, user_client, test_user):
        response = user_client.delete(f'/api/users/{test_user.id}/')
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_me_action(self, user_client, regular_user):
        response = user_client.get('/api/users/me/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['data']['id'] == regular_user.id

    def test_supervised_action_supervisor(self, supervisor_client, supervisor_user, test_user):
        test_user.supervisor = supervisor_user
        test_user.save()

        response = supervisor_client.get('/api/users/supervised/')
        assert response.status_code == status.HTTP_200_OK
        ids = [u['id'] for u in response.data['data']]
        assert test_user.id in ids

    def test_supervised_action_regular_forbidden(self, user_client):
        response = user_client.get('/api/users/supervised/')
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_assign_supervisor_admin(self, admin_client, supervisor_user, test_user):
        data = {'supervisor_id': supervisor_user.id}
        response = admin_client.patch(f'/api/users/{test_user.id}/assign_supervisor/', data)
        assert response.status_code == status.HTTP_200_OK
        test_user.refresh_from_db()
        assert test_user.supervisor == supervisor_user

    def test_assign_supervisor_regular_forbidden(self, user_client, supervisor_user, test_user):
        data = {'supervisor_id': supervisor_user.id}
        response = user_client.patch(f'/api/users/{test_user.id}/assign_supervisor/', data)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_assign_teams_admin(self, admin_client, test_user):
        data = {'teams': ['Team A', 'Team B']}
        response = admin_client.patch(f'/api/users/{test_user.id}/assign_teams/', data)
        assert response.status_code == status.HTTP_200_OK

    def test_assign_committees_admin(self, admin_client, test_user, committee):
        data = {'committees': [committee.id]}
        response = admin_client.patch(f'/api/users/{test_user.id}/assign_committees/', data)
        assert response.status_code == status.HTTP_200_OK

    def test_change_password(self, user_client, regular_user):
        data = {
            'old_password': 'testpass123',
            'new_password': 'newpass123',
            'new_password_confirm': 'newpass123',
        }
        response = user_client.post('/api/users/change_password/', data)
        assert response.status_code == status.HTTP_200_OK
        regular_user.refresh_from_db()
        assert regular_user.check_password('newpass123')

    def test_filter_users_by_role(self, admin_client):
        response = admin_client.get('/api/users/?role=USER')
        assert response.status_code == status.HTTP_200_OK
        assert all(user['role'] == 'USER' for user in response.data['data'])

    def test_search_users_by_email(self, admin_client, test_user):
        response = admin_client.get('/api/users/?search=testuser')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']) == 1
        assert response.data['data'][0]['email'] == 'testuser@example.com'

