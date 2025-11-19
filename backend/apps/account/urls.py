"""
URL configuration for authentication endpoints.

All endpoints return standardized format:
{
    "status": "success" | "error",
    "data": {...},
    "message": "...",
    "meta": {
        "timestamp": "2025-10-25T12:00:00.000Z",
        "request_id": "uuid"
    }
}
"""
from django.urls import path
from .views import LoginView, LogoutView, TokenRefreshView

app_name = 'auth'

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # ✅ Now standardized
]
