# Backend Structure - Simplified

**Date**: October 24, 2025  
**Status**: ✅ Simplified & Ready  
**Focus**: Core essentials - Users & Config

---

## 🎯 Overview

The backend has been simplified to focus on **essential functionality only**:

1. **account** - User authentication & management
2. **config** - System configuration & settings
3. **utils** - Shared utilities & helpers

This provides a **solid foundation** that's ready to grow as needed.

---

## 📁 Simplified Structure

```
backend/
├── apps/
│   ├── account/              # ✅ User authentication & management
│   │   ├── models.py        # User model with roles, 2FA, security
│   │   ├── serializers.py   # Auth serializers (login, register, etc.)
│   │   ├── views.py         # Auth endpoints (JWT-based)
│   │   ├── urls.py          # Auth routes
│   │   ├── permissions.py   # Role-based permissions
│   │   └── admin.py         # User admin interface
│   │
│   ├── config/               # ✅ System configuration
│   │   ├── models.py        # App settings, integrations
│   │   ├── serializers.py   # Config serializers
│   │   ├── views.py         # Config API endpoints
│   │   └── urls.py          # Config routes
│   │
│   └── utils/                # ✅ Shared utilities
│       ├── mixins.py        # ViewSet mixins
│       ├── responses.py     # Standard API responses
│       ├── viewsets.py      # Base viewsets
│       └── models/          # Shared model utilities
│
├── core/
│   ├── settings.py          # Django settings
│   ├── urls.py              # Root URL configuration
│   └── wsgi.py              # WSGI application
│
├── tests/                    # Test suites
├── utils/                    # Backend-level utilities
├── manage.py                 # Django management
├── requirements.txt          # Dependencies
└── venv/                     # Virtual environment
```

---

## ✅ What's Included

### 1. Account App (User Management)

**Purpose**: Complete user authentication and authorization

**Features**:
- ✅ JWT token authentication (30-day access, 60-day refresh)
- ✅ User registration with email verification
- ✅ Login with security features (account lockout, failed attempts tracking)
- ✅ Password reset with secure tokens
- ✅ Two-factor authentication (2FA) with TOTP
- ✅ Role-based permissions (Admin, Manager, Agent, Subscriber)
- ✅ User profile management
- ✅ Password change functionality
- ✅ Logout with token blacklisting

**User Model**:
```python
class User(AbstractBaseUser):
    # Basic info
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    
    # Role-based permissions
    role = models.CharField(
        max_length=20,
        choices=[
            ('admin', 'Admin'),
            ('manager', 'Manager'),
            ('agent', 'Agent'),
            ('subscriber', 'Subscriber')
        ]
    )
    
    # Security features
    email_verified = models.BooleanField(default=False)
    two_factor_enabled = models.BooleanField(default=False)
    failed_login_attempts = models.PositiveIntegerField(default=0)
    locked_until = models.DateTimeField(null=True, blank=True)
```

**API Endpoints**:
- `POST /api/account/login/` - User login
- `POST /api/account/register/` - User registration
- `POST /api/account/logout/` - User logout
- `POST /api/account/password/reset/` - Request password reset
- `POST /api/account/password/reset/confirm/` - Confirm password reset
- `PATCH /api/account/password/change/` - Change password
- `POST /api/account/email/verify/` - Verify email
- `POST /api/account/2fa/setup/` - Setup 2FA
- `POST /api/account/2fa/verify/` - Verify 2FA
- `GET /api/account/me/` - Get current user
- `PUT /api/account/profile/` - Update user profile
- `GET /api/account/users/` - List users (admin only)
- `POST /api/account/users/` - Create user (admin only)
- `PATCH /api/account/users/{id}/` - Update user (admin only)
- `DELETE /api/account/users/{id}/` - Delete user (admin only)

### 2. Config App (System Configuration)

**Purpose**: Manage application settings and configurations

**Features**:
- ✅ System-wide settings management
- ✅ Integration configurations
- ✅ Feature flags
- ✅ Application metadata
- ✅ RESTful API for CRUD operations

**Config Model**:
```python
class AppSetting(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    description = models.TextField(blank=True)
    is_public = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

**API Endpoints**:
- `GET /api/config/settings/` - List all settings
- `POST /api/config/settings/` - Create setting (admin only)
- `GET /api/config/settings/{key}/` - Get specific setting
- `PATCH /api/config/settings/{key}/` - Update setting (admin only)
- `DELETE /api/config/settings/{key}/` - Delete setting (admin only)
- `GET /api/config/public/` - Get public settings (no auth required)

### 3. Utils App (Shared Utilities)

**Purpose**: Reusable utilities for all apps

**Components**:
- ✅ **StandardResponseMixin** - Automatic response wrapping, audit tracking
- ✅ **APIResponse** - Consistent response formatting utilities
- ✅ **Mixins** - Business logic mixins (audit, soft delete, permissions)
- ✅ **Base Models** - Shared model utilities

**Standard Response Format**:
```json
{
  "data": [...] or {...},
  "message": "Success message",
  "meta": {
    "pagination": {...}
  }
}
```

**Usage**:
```python
from apps.utils.viewsets import StandardResponseMixin
from apps.utils.responses import APIResponse

class MyViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    queryset = MyModel.objects.all()
    serializer_class = MySerializer
    
    create_message = "Created successfully"
    update_message = "Updated successfully"
    delete_message = "Deleted successfully"
```

---

## 🔑 Key Features

### Authentication & Security
- JWT token-based authentication
- Refresh token rotation
- Two-factor authentication (2FA)
- Email verification required
- Password reset with secure tokens
- Account lockout after failed attempts
- Role-based permissions
- IP tracking for login attempts

### API Standards
- RESTful endpoints
- Consistent response format: `{data, message, meta}`
- Proper HTTP status codes
- OpenAPI/Swagger documentation
- Filtering, searching, ordering
- Pagination support

### Code Quality
- DRY principles with reusable utilities
- Standard patterns for consistency
- Audit trail (created_by, updated_by)
- Soft delete support
- Comprehensive error handling
- Input validation

---

## 🚀 Getting Started

### 1. Setup Environment

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1  # Windows
# source venv/bin/activate    # Linux/Mac

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Database

```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 3. Run Development Server

```bash
# Start server
python manage.py runserver

# Access points:
# Backend API: http://localhost:8000
# Admin Panel: http://localhost:8000/admin
# API Docs: http://localhost:8000/api/docs/
```

---

## 📖 API Documentation

### Access Documentation

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **Schema JSON**: http://localhost:8000/api/schema/

All endpoints are automatically documented using `drf-spectacular`.

---

## 🔧 Adding New Apps

When you need to add new functionality, create a new app:

```bash
# Create new app
python manage.py startapp my_app apps/my_app
```

### Standard App Structure

```python
# models.py
from django.db import models

class MyModel(models.Model):
    name = models.CharField(max_length=200)
    
    # Audit fields (RECOMMENDED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('account.User', on_delete=models.SET_NULL, null=True)
    
    # Soft delete (RECOMMENDED)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'my_table'
```

```python
# serializers.py
from rest_framework import serializers
from .models import MyModel

class MySerializer(serializers.ModelSerializer):
    class Meta:
        model = MyModel
        fields = ['id', 'name', 'created_at']
        read_only_fields = ['id', 'created_at']
```

```python
# views.py
from rest_framework import viewsets
from apps.utils.viewsets import StandardResponseMixin
from .models import MyModel
from .serializers import MySerializer

class MyViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    queryset = MyModel.objects.all()
    serializer_class = MySerializer
    
    create_message = "Created successfully"
    update_message = "Updated successfully"
    delete_message = "Deleted successfully"
```

```python
# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MyViewSet

router = DefaultRouter()
router.register(r'items', MyViewSet, basename='item')

urlpatterns = [
    path('', include(router.urls)),
]
```

Register in `core/settings.py`:
```python
INSTALLED_APPS = [
    # ... existing apps ...
    'apps.my_app',
]
```

Register in `core/urls.py`:
```python
urlpatterns = [
    # ... existing patterns ...
    path('api/my-app/', include('apps.my_app.urls')),
]
```

---

## ✅ Best Practices

### DO ✅
- Use `StandardResponseMixin` for all ViewSets
- Add audit fields (`created_by`, `updated_by`, timestamps)
- Implement soft delete instead of hard delete
- Follow consistent naming conventions
- Write comprehensive tests
- Document APIs with OpenAPI decorators
- Use serializer validation
- Implement proper permissions

### DON'T ❌
- Hard delete data (use soft delete)
- Skip audit trails
- Forget to run migrations
- Skip testing
- Use inconsistent response formats
- Hardcode sensitive values
- Bypass permission checks
- Ignore query optimization

---

## 📚 Documentation

### Internal Documentation
- **[Backend Overview](docs/architecture/backend/00-BACKEND-OVERVIEW.md)** - Complete backend guide
- **[Building New App](docs/architecture/backend/01-BUILDING-NEW-APP.md)** - Step-by-step app creation
- **[Backend Index](docs/architecture/backend/README.md)** - Quick reference

### External Resources
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [drf-spectacular](https://drf-spectacular.readthedocs.io/)
- [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/)

---

## 🎯 Summary

**Current State**: 
- ✅ 3 core apps (account, config, utils)
- ✅ Complete authentication system
- ✅ System configuration management
- ✅ Reusable utilities and patterns
- ✅ Production-ready foundation

**Ready For**:
- ✅ Adding new business logic apps
- ✅ Scaling as requirements grow
- ✅ Maintaining consistency across features
- ✅ Building complex applications

**Philosophy**:
- Start simple with essentials
- Add functionality as needed
- Follow consistent patterns
- Maintain code quality
- Scale intelligently

---

**The backend is now simplified and ready for development! 🚀**

**Next Steps**:
1. Review the existing apps (account, config, utils)
2. Test the authentication flow
3. Understand the utilities and patterns
4. Add new apps as your requirements grow
5. Follow the documentation for guidance

---

**Happy coding! 🎉**

