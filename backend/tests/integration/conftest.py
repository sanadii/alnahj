import pytest
from rest_framework.test import APIClient

from django.contrib.auth import get_user_model


User = get_user_model()


@pytest.fixture
def admin_user(django_user_model):
    return django_user_model.objects.create_user(
        email="admin.integration@example.com",
        password="adminpass123",
        role="ADMIN"
    )


@pytest.fixture
def regular_user(django_user_model):
    return django_user_model.objects.create_user(
        email="user.integration@example.com",
        password="userpass123",
        role="USER"
    )


@pytest.fixture
def admin_client(admin_user):
    client = APIClient()
    client.force_authenticate(user=admin_user)
    return client


@pytest.fixture
def regular_client(regular_user):
    client = APIClient()
    client.force_authenticate(user=regular_user)
    return client

