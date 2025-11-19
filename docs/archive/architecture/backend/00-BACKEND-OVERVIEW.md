# Backend Architecture Overview

**Last Updated**: October 24, 2025

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Architecture Patterns](#architecture-patterns)
4. [App Structure](#app-structure)
5. [API Standards](#api-standards)
6. [Multi-Tenancy](#multi-tenancy)
7. [Security](#security)
8. [Quick Start](#quick-start)

---

## Technology Stack

### Core Framework
- **Django**: 4.2.3 - Python web framework
- **Django REST Framework**: 3.14.0 - API toolkit
- **Python**: 3.8+ (3.12 recommended)

### Authentication & Security
- **SimpleJWT**: JWT token authentication
- **django-cors-headers**: CORS handling
- **Two-Factor Authentication**: TOTP-based 2FA
- **Rate Limiting**: Built-in request throttling
- **Password Validation**: Django's robust password validators

### Database & Caching
- **Database**: PostgreSQL/MySQL (production), SQLite (development)
- **Redis**: Caching layer via django-redis
- **Connection Pooling**: Optimized database connections

### API Documentation
- **drf-spectacular**: OpenAPI 3.0 schema generation
- **Swagger UI**: Interactive API documentation
- **ReDoc**: Alternative API documentation interface

### Additional Tools
- **django-extensions**: Development utilities
- **django-filters**: Advanced filtering
- **Channels**: WebSocket support (configured)

---

## Project Structure

```
backend/
├── apps/                           # Django applications
│   ├── account/                   # ✅ User authentication & management
│   │   ├── models.py             # User model with roles, 2FA, audit
│   │   ├── serializers.py        # Auth serializers (login, register, etc.)
│   │   ├── views.py              # Auth endpoints (JWT-based)
│   │   ├── urls.py               # Auth routes
│   │   ├── permissions.py        # Role-based permissions
│   │   └── admin.py              # User admin interface
│   │
│   ├── config/                    # ✅ System configuration
│   │   ├── models.py             # App settings, integrations
│   │   ├── serializers.py        # Config serializers
│   │   ├── views.py              # Config API endpoints
│   │   └── urls.py               # Config routes
│   │
│   └── utils/                     # ✅ Shared utilities & mixins
│       ├── mixins.py             # ViewSet mixins (audit, permissions)
│       ├── responses.py          # Standard API response format
│       ├── viewsets.py           # Base viewsets with standard responses
│       └── models/               # Shared model utilities
│
├── core/                          # Django core settings
│   ├── settings.py               # ✅ Main settings file
│   ├── settingsprod.py           # Production settings
│   ├── urls.py                   # Root URL configuration
│   ├── views.py                  # Core views
│   └── wsgi.py                   # WSGI application
│
├── utils/                         # Backend-level utilities
│   ├── utils_functions.py        # Helper functions
│   └── utils_views.py            # Utility views
│
├── tests/                         # Test suites
│   ├── performance/              # Performance tests
│   ├── security/                 # Security tests
│   └── templates/                # Test templates
│
├── scripts/                       # Utility scripts
├── manage.py                      # Django management script
├── requirements.txt               # Python dependencies
└── venv/                          # Virtual environment
```

---

## Architecture Patterns

### 1. **Layered Architecture**

```
┌─────────────────────────────────┐
│   API Layer (Views/ViewSets)   │  ← REST endpoints
├─────────────────────────────────┤
│   Serialization Layer          │  ← Data validation & transformation
├─────────────────────────────────┤
│   Business Logic Layer         │  ← Services & business rules
├─────────────────────────────────┤
│   Data Access Layer (Models)   │  ← ORM models
├─────────────────────────────────┤
│   Database (PostgreSQL/MySQL)  │  ← Data persistence
└─────────────────────────────────┘
```

### 2. **Modular App Architecture**

Each Django app follows a consistent structure and handles a specific domain:

- **Focused Responsibility**: Each app handles one domain (users, config)
- **Loose Coupling**: Apps communicate through well-defined interfaces
- **High Cohesion**: Related functionality stays together
- **Reusable Components**: Shared utilities in `apps.utils`

### 3. **Simple & Scalable Pattern**

**Current Apps**:
- **account**: User authentication, roles, permissions, 2FA
- **config**: System settings, application configuration
- **utils**: Shared utilities, mixins, response formats

**Ready for Growth**:
- Add new apps as needed following the same pattern
- Each new app follows the standard structure
- Utilities are ready for reuse

---

## App Structure

### Standard Django App Layout

```
app_name/
├── __init__.py                 # Python package
├── admin.py                    # Django admin configuration
├── apps.py                     # App configuration
├── models.py                   # Data models (ORM)
├── serializers.py              # DRF serializers
├── views.py                    # API views/viewsets
├── urls.py                     # URL routing
├── permissions.py              # Custom permissions (optional)
├── services.py                 # Business logic layer (optional)
├── tests.py                    # Unit tests
├── migrations/                 # Database migrations
│   ├── __init__.py
│   └── 0001_initial.py
└── management/                 # Custom management commands (optional)
    ├── __init__.py
    └── commands/
        ├── __init__.py
        └── custom_command.py
```

### File Responsibilities

#### 1. **models.py** - Data Models

```python
from django.db import models
from django.utils import timezone

class Client(models.Model):
    """Client model - customer information"""
    
    # Primary Fields
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    
    # Multi-tenancy
    business = models.ForeignKey(
        'business.Business',
        on_delete=models.CASCADE,
        related_name='clients'
    )
    
    # Audit Fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'account.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_clients'
    )
    
    # Soft Delete
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    deleted_by = models.ForeignKey(
        'account.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='deleted_clients'
    )
    
    class Meta:
        db_table = 'clients'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['business', 'is_deleted']),
            models.Index(fields=['email']),
        ]
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
```

#### 2. **serializers.py** - Data Validation & Transformation

```python
from rest_framework import serializers
from .models import Client

class ClientSerializer(serializers.ModelSerializer):
    """Serializer for Client model"""
    
    full_name = serializers.SerializerMethodField()
    business_name = serializers.CharField(source='business.name', read_only=True)
    
    class Meta:
        model = Client
        fields = [
            'id', 'first_name', 'last_name', 'full_name',
            'email', 'phone', 'business', 'business_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'business']
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    
    def validate_email(self, value):
        """Custom email validation"""
        if Client.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value.lower()

class ClientListSerializer(serializers.ModelSerializer):
    """Minimal serializer for list views"""
    
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Client
        fields = ['id', 'full_name', 'email', 'phone']
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
```

#### 3. **views.py** - API Endpoints

```python
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from apps.utils.viewsets import StandardResponseMixin
from apps.utils.responses import APIResponse
from .models import Client
from .serializers import ClientSerializer, ClientListSerializer

class ClientViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    """
    ViewSet for Client operations.
    
    Provides: list, create, retrieve, update, partial_update, destroy
    
    Features:
    - Automatic business filtering (multi-tenancy)
    - Soft delete support
    - Audit tracking (created_by, updated_by)
    - Standard {data, message} response format
    """
    
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]
    
    # Filtering & Search
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_fields = ['email', 'phone']
    search_fields = ['first_name', 'last_name', 'email', 'phone']
    ordering_fields = ['created_at', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    # Custom messages
    create_message = "Client created successfully"
    update_message = "Client updated successfully"
    delete_message = "Client deleted successfully"
    
    def get_serializer_class(self):
        """Use lighter serializer for list view"""
        if self.action == 'list':
            return ClientListSerializer
        return ClientSerializer
    
    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        """
        Custom action to restore soft-deleted client.
        
        POST /api/clients/{id}/restore/
        """
        client = self.get_object()
        
        if not client.is_deleted:
            return APIResponse.error(
                message="Client is not deleted",
                status_code=400
            )
        
        client.is_deleted = False
        client.deleted_at = None
        client.deleted_by = None
        client.save()
        
        return APIResponse.success(
            data=self.get_serializer(client).data,
            message="Client restored successfully"
        )
    
    @action(detail=False, methods=['get'])
    def deleted(self, request):
        """
        List soft-deleted clients.
        
        GET /api/clients/deleted/
        """
        queryset = self.get_queryset().filter(is_deleted=True)
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return APIResponse.success(
            data=serializer.data,
            message="Deleted clients retrieved"
        )
```

#### 4. **urls.py** - URL Routing

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet

# ViewSet Router (RESTful)
router = DefaultRouter()
router.register(r'clients', ClientViewSet, basename='client')

urlpatterns = [
    # ViewSet routes
    path('', include(router.urls)),
    
    # Custom routes (if needed)
    # path('clients/export/', ClientExportView.as_view(), name='client-export'),
]
```

#### 5. **admin.py** - Django Admin

```python
from django.contrib import admin
from .models import Client

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    """Admin interface for Client model"""
    
    list_display = [
        'id', 'first_name', 'last_name', 'email', 
        'phone', 'business', 'created_at', 'is_deleted'
    ]
    list_filter = ['business', 'is_deleted', 'created_at']
    search_fields = ['first_name', 'last_name', 'email', 'phone']
    readonly_fields = ['created_at', 'updated_at', 'created_by', 'deleted_at', 'deleted_by']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('first_name', 'last_name', 'email', 'phone')
        }),
        ('Business', {
            'fields': ('business',)
        }),
        ('Audit Information', {
            'fields': ('created_at', 'updated_at', 'created_by'),
            'classes': ('collapse',)
        }),
        ('Deletion', {
            'fields': ('is_deleted', 'deleted_at', 'deleted_by'),
            'classes': ('collapse',)
        }),
    )
```

#### 6. **permissions.py** - Custom Permissions

```python
from rest_framework.permissions import BasePermission

class IsManagerOrAdmin(BasePermission):
    """
    Custom permission to only allow managers and admins.
    """
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['admin', 'manager']
        )

class CanManageClients(BasePermission):
    """
    Custom permission for client management.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Read permissions for all authenticated users
        if view.action in ['list', 'retrieve']:
            return True
        
        # Write permissions only for managers and admins
        return request.user.role in ['admin', 'manager']
    
    def has_object_permission(self, request, view, obj):
        # Check business ownership
        if hasattr(obj, 'business'):
            return obj.business == request.user.business
        return True
```

#### 7. **services.py** - Business Logic (Optional)

```python
from django.db import transaction
from django.utils import timezone
from .models import Client

class ClientService:
    """
    Business logic for Client operations.
    Use this for complex operations that don't fit in views.
    """
    
    @staticmethod
    @transaction.atomic
    def bulk_import_clients(business, clients_data, created_by):
        """
        Bulk import clients from CSV/Excel.
        
        Args:
            business: Business instance
            clients_data: List of client dictionaries
            created_by: User performing the import
        
        Returns:
            dict with success count and errors
        """
        created_count = 0
        errors = []
        
        for idx, client_data in enumerate(clients_data):
            try:
                Client.objects.create(
                    business=business,
                    created_by=created_by,
                    **client_data
                )
                created_count += 1
            except Exception as e:
                errors.append({
                    'row': idx + 1,
                    'error': str(e),
                    'data': client_data
                })
        
        return {
            'created': created_count,
            'errors': errors,
            'total': len(clients_data)
        }
    
    @staticmethod
    def merge_clients(primary_client, duplicate_client, user):
        """
        Merge duplicate client records.
        
        Args:
            primary_client: Client to keep
            duplicate_client: Client to merge and delete
            user: User performing the merge
        """
        # Transfer related records
        # (appointments, invoices, etc.)
        duplicate_client.appointments.update(client=primary_client)
        duplicate_client.invoices.update(client=primary_client)
        
        # Soft delete duplicate
        duplicate_client.is_deleted = True
        duplicate_client.deleted_at = timezone.now()
        duplicate_client.deleted_by = user
        duplicate_client.save()
        
        return primary_client
```

---

## API Standards

### Field Naming Convention

**The API uses camelCase for JavaScript/TypeScript integration:**

- **API Layer** (Frontend ↔ Backend): `camelCase` (e.g., `electionDate`, `votingMode`)
- **Backend/Database**: `snake_case` (e.g., `election_date`, `voting_mode`)

Automatic conversion is handled by `djangorestframework-camel-case` package.

**Example**:
```json
// Frontend sends
{
  "electionDate": "2025-10-31",
  "maxCandidatesPerBallot": 15
}

// Backend responds
{
  "status": "success",
  "data": {
    "electionDate": "2025-10-31",
    "maxCandidatesPerBallot": 15,
    "createdAt": "2025-10-28T10:00:00Z"
  }
}
```

📖 **See [API Conventions Guide](./02-API-CONVENTIONS.md) for complete details**

### Standard Response Format

**All API responses follow this consistent format:**

```json
{
  "status": "success",       // Status indicator
  "data": [...] or {...},    // Response data
  "message": "Success",      // Optional user message
  "meta": {...}              // Optional metadata
}
```

#### Success Response Examples

```json
// List Response
{
  "data": [
    {"id": 1, "name": "Client 1"},
    {"id": 2, "name": "Client 2"}
  ],
  "message": "Clients retrieved successfully",
  "meta": {
    "pagination": {
      "count": 100,
      "page": 1,
      "page_size": 20,
      "total_pages": 5
    }
  }
}

// Detail Response
{
  "data": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com"
  },
  "message": "Client retrieved successfully"
}

// Create/Update Response
{
  "data": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe"
  },
  "message": "Client created successfully"
}

// Delete Response
{
  "data": null,
  "message": "Client deleted successfully"
}
```

#### Error Response Examples

```json
// Validation Error
{
  "data": null,
  "message": "Validation failed",
  "errors": {
    "email": ["This field is required."],
    "phone": ["Invalid phone number format."]
  }
}

// Not Found Error
{
  "data": null,
  "message": "Client not found"
}

// Permission Error
{
  "data": null,
  "message": "You don't have permission to perform this action"
}
```

### Using Standard Response Utilities

```python
from apps.utils.responses import APIResponse

# Success
return APIResponse.success(
    data=[...],
    message="Data retrieved successfully"
)

# Create
return APIResponse.created(
    data={...},
    message="Record created successfully"
)

# Update
return APIResponse.updated(
    data={...},
    message="Record updated successfully"
)

# Delete
return APIResponse.deleted(
    message="Record deleted successfully"
)

# Error
return APIResponse.error(
    message="Validation failed",
    errors={"field": ["Error message"]},
    status_code=400
)

# Paginated
return APIResponse.paginated(
    data=[...],
    count=100,
    page=1,
    page_size=20,
    message="Data retrieved"
)
```

### Standard ViewSet with Automatic Response Wrapping

```python
from apps.utils.viewsets import StandardResponseMixin

class MyViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    """
    ViewSet with automatic:
    - Standard response wrapping
    - Audit tracking
    - Soft delete support
    """
    
    queryset = MyModel.objects.all()
    serializer_class = MySerializer
    
    # Customize messages (optional)
    list_message = None  # No message for list
    create_message = "Created successfully"
    update_message = "Updated successfully"
    delete_message = "Deleted successfully"
```

---

## Core Apps

### Account App - User Management

**Authentication & Authorization:**

```python
# User model with roles and security features
class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    
    # Role-based permissions
    class RoleOptions(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        MANAGER = 'manager', 'Manager'
        AGENT = 'agent', 'Agent'
        SUBSCRIBER = 'subscriber', 'Subscriber'
    
    role = models.CharField(max_length=20, choices=RoleOptions.choices)
    
    # Security features
    email_verified = models.BooleanField(default=False)
    two_factor_enabled = models.BooleanField(default=False)
    failed_login_attempts = models.PositiveIntegerField(default=0)
    locked_until = models.DateTimeField(null=True, blank=True)
```

**Key Features**:
- JWT token authentication
- Two-factor authentication (2FA)
- Email verification
- Password reset
- Account lockout after failed attempts
- Role-based permissions

### Config App - System Configuration

**Application Settings:**

```python
# Simple configuration management
class AppSetting(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    description = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

**Key Features**:
- System-wide settings
- Integration configurations
- Feature flags
- Application metadata

### Model Best Practices

```python
class MyModel(models.Model):
    """
    Standard model with audit trail and soft delete
    """
    
    # Your primary fields
    name = models.CharField(max_length=200)
    
    # RECOMMENDED for audit trail
    created_by = models.ForeignKey(
        'account.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_%(class)s_set'
    )
    
    updated_by = models.ForeignKey(
        'account.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='updated_%(class)s_set'
    )
    
    # RECOMMENDED for soft delete
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    deleted_by = models.ForeignKey(
        'account.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='deleted_%(class)s_set'
    )
    
    # RECOMMENDED for timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'my_table'
        indexes = [
            models.Index(fields=['created_at']),
            models.Index(fields=['is_deleted']),
        ]
```

---

## Security

### Authentication

**JWT Token-Based Authentication**:

```python
# settings.py
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=60),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
}
```

### Security Features

1. **JWT Authentication**: Secure token-based auth
2. **Two-Factor Authentication (2FA)**: TOTP-based
3. **Password Security**: 
   - Minimum length validation
   - Complexity requirements
   - Password history (optional)
   - Account lockout after failed attempts
4. **Rate Limiting**: Request throttling
5. **CORS Configuration**: Controlled origins
6. **Security Headers**: 
   - XSS protection
   - Content type nosniff
   - Frame options
   - HSTS
7. **Email Verification**: Required for new accounts
8. **Password Reset**: Secure token-based reset
9. **IP Tracking**: Last login IP tracking
10. **Failed Login Tracking**: Automatic account locking

### Permission Classes

```python
# Built-in permissions
from rest_framework.permissions import (
    IsAuthenticated,      # Must be logged in
    IsAdminUser,         # Must be admin
    AllowAny,            # No authentication required
)

# Custom permissions
from apps.account.permissions import (
    IsManagerOrAdmin,     # Manager or admin role
    IsAdminUser,         # Admin only
    CanManageUsers,      # User management permission
)

# Usage
class MyViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
# Admin only
class AdminViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
```

---

## Quick Start

### 1. Environment Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
.\venv\Scripts\Activate.ps1
# Linux/Mac
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Database Setup

```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load demo data (optional)
python manage.py setup_demo
```

### 3. Run Development Server

```bash
# Start server
python manage.py runserver

# Server runs at: http://localhost:8000
# Admin panel: http://localhost:8000/admin
# API docs: http://localhost:8000/api/docs/
```

### 4. Environment Variables

Create `.env` file in backend directory:

```env
# Django
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (Production)
DB_ENGINE=django.db.backends.postgresql
DB_NAME=your_database
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# Redis Cache
REDIS_URL=redis://127.0.0.1:6379/1

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
EMAIL_USE_TLS=True

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000

# CORS
CORS_ALLOW_ALL_ORIGINS=False
CSRF_TRUSTED_ORIGINS=http://localhost:3000

# Security (Production)
SECURE_SSL_REDIRECT=False
SESSION_COOKIE_SECURE=False
CSRF_COOKIE_SECURE=False
```

---

## Next Steps

- **[API Conventions & Standards](./02-API-CONVENTIONS.md)** - Field naming, response format, best practices
- **[Building a New App](./01-BUILDING-NEW-APP.md)** - Step-by-step guide
- **[Testing Guide](./03-TESTING-GUIDE.md)** - Writing tests (Coming Soon)
- **[Deployment Guide](./04-DEPLOYMENT.md)** - Production deployment (Coming Soon)

---

**For detailed patterns and examples, see the individual guides in this directory.**

