# Backend Documentation

**Django REST API Backend** | Last Updated: October 24, 2025

## 🎯 Overview

This is a Django 4.2.3 + Django REST Framework backend implementing a comprehensive multi-tenant business management platform with JWT authentication, Redis caching, and OpenAPI documentation.

## 📍 Complete Documentation

**👉 For comprehensive backend documentation, see:**
- **[Architecture Documentation](../../architecture/backend/README.md)** - Complete backend architecture guide
- **[Backend Overview](../../architecture/backend/00-BACKEND-OVERVIEW.md)** - Technology stack, structure, patterns
- **[Building New App](../../architecture/backend/01-BUILDING-NEW-APP.md)** - Step-by-step app creation guide

## ⚡ Quick Start

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows
# source venv/bin/activate    # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

**Access Points**:
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:8000/admin
- API Docs (Swagger): http://localhost:8000/api/docs/
- API Docs (ReDoc): http://localhost:8000/api/redoc/

---

## 🛠️ Tech Stack

### Core Framework
- **Django**: 4.2.3 - Python web framework
- **Django REST Framework**: 3.14.0 - RESTful API toolkit
- **Python**: 3.8+ (3.12 recommended)

### Authentication & Security
- **SimpleJWT**: JWT token authentication
- **CORS Headers**: Cross-origin resource sharing
- **2FA Support**: Two-factor authentication (TOTP)
- **Rate Limiting**: Request throttling

### Database & Caching
- **Database**: PostgreSQL/MySQL (production), SQLite (development)
- **Redis**: Caching layer (django-redis)
- **Migrations**: Django ORM migrations

### API Documentation
- **drf-spectacular**: OpenAPI 3.0 schema generation
- **Swagger UI**: Interactive API documentation
- **ReDoc**: Alternative documentation UI

---

## 📁 Backend Structure

```
backend/
├── apps/                          # Django applications
│   ├── account/                  # ✅ User authentication & management
│   │   ├── models.py            # User model with roles, 2FA, audit
│   │   ├── serializers.py       # Auth serializers (login, register, etc.)
│   │   ├── views.py             # Auth endpoints (JWT-based)
│   │   ├── urls.py              # Auth routes
│   │   ├── permissions.py       # Role-based permissions
│   │   └── admin.py             # User admin interface
│   │
│   ├── config/                   # ✅ System configuration
│   │   ├── models.py            # App settings, integrations
│   │   ├── serializers.py       # Config serializers
│   │   ├── views.py             # Config API endpoints
│   │   └── urls.py              # Config routes
│   │
│   └── utils/                    # ✅ Shared utilities & mixins
│       ├── mixins.py            # ViewSet mixins (audit, permissions)
│       ├── responses.py         # Standard API response format
│       ├── viewsets.py          # Base viewsets with standard responses
│       └── models/              # Shared model utilities
│
├── core/                         # Django core configuration
│   ├── settings.py              # ✅ Main settings
│   ├── settingsprod.py          # Production settings
│   ├── urls.py                  # Root URL configuration
│   ├── views.py                 # Core views
│   └── wsgi.py                  # WSGI application
│
├── utils/                        # Backend-level utilities
│   ├── utils_functions.py       # Helper functions
│   └── utils_views.py           # Utility views
│
├── tests/                        # Test suites
│   ├── performance/             # Performance tests
│   ├── security/                # Security tests
│   └── templates/               # Test templates
│
├── scripts/                      # Utility scripts
├── manage.py                     # Django management script
├── requirements.txt              # Python dependencies
└── venv/                         # Virtual environment
```

---

## 🏗️ Architecture Patterns

### 1. Layered Architecture

```
API Layer (Views/ViewSets) → REST endpoints
       ↓
Serialization Layer → Data validation & transformation
       ↓
Business Logic Layer → Services & business rules
       ↓
Data Access Layer (Models) → ORM models
       ↓
Database → Data persistence
```

### 2. Simple & Scalable Structure

**Start simple, grow as needed:**

```python
# Core apps: account, config, utils
# Add new apps following the same pattern
class MyViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    queryset = MyModel.objects.all()
    serializer_class = MySerializer
```

### 3. Standard Response Format

**All API responses follow consistent format:**

```json
{
  "data": [...] or {...},
  "message": "Success message",
  "meta": {
    "pagination": {...}
  }
}
```

---

## 🔑 Key Features

### Authentication
- JWT token-based authentication
- Refresh token rotation
- Two-factor authentication (2FA)
- Email verification
- Password reset
- Account lockout after failed attempts

### Security
- Role-based permissions (Admin, Manager, Agent, etc.)
- Business-level data isolation
- Input validation
- CORS configuration
- Security headers (XSS, HSTS, CSP)
- Rate limiting

### Extensibility
- Simple base structure with 3 core apps
- Easy to add new apps as needed
- Reusable utilities and mixins
- Standard patterns for consistency

### Audit Trail
- Created by / Created at
- Updated by / Updated at
- Soft delete support
- Deleted by / Deleted at

### API Features
- RESTful endpoints
- Filtering, searching, ordering
- Pagination
- Bulk operations
- Export functionality
- OpenAPI documentation

---

## 📦 Standard App Structure

Each Django app follows this pattern:

```
app_name/
├── __init__.py              # Python package
├── models.py                # Data models (ORM)
├── serializers.py           # DRF serializers
├── views.py                 # API views/viewsets
├── urls.py                  # URL routing
├── admin.py                 # Django admin configuration
├── permissions.py           # Custom permissions (optional)
├── services.py              # Business logic (optional)
├── tests.py                 # Unit tests
└── migrations/              # Database migrations
```

---

## 🔧 Key Patterns

### Standard ViewSet with Multi-Tenancy

```python
from rest_framework import viewsets
from apps.utils.viewsets import StandardResponseMixin
from .models import MyModel
from .serializers import MySerializer

class MyViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    """
    Provides:
    - Automatic business filtering
    - Standard {data, message} response format
    - Soft delete support
    - Audit tracking
    """
    queryset = MyModel.objects.all()
    serializer_class = MySerializer
    
    create_message = "Created successfully"
    update_message = "Updated successfully"
    delete_message = "Deleted successfully"
```

### Standard Model with Audit Trail

```python
from django.db import models

class MyModel(models.Model):
    # Primary fields
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # Audit fields (RECOMMENDED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'account.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_%(class)s_set'
    )
    
    # Soft delete (RECOMMENDED)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'my_table'
        indexes = [
            models.Index(fields=['created_at']),
            models.Index(fields=['is_deleted']),
        ]
```

### Standard Response Utilities

```python
from apps.utils.responses import APIResponse

# Success response
return APIResponse.success(
    data=[...],
    message="Data retrieved successfully"
)

# Created response
return APIResponse.created(
    data={...},
    message="Record created successfully"
)

# Error response
return APIResponse.error(
    message="Validation failed",
    errors={"field": ["Error message"]},
    status_code=400
)
```

---

## 🚀 Development Commands

```bash
# Create new app
python manage.py startapp app_name apps/app_name

# Make migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver

# Run tests
python manage.py test

# Run specific app tests
python manage.py test apps.app_name

# Django shell
python manage.py shell

# Show all URLs
python manage.py show_urls  # Requires django-extensions
```

---

## 📖 API Documentation

### Access Documentation

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **Schema JSON**: http://localhost:8000/api/schema/

### Documentation Standards

All endpoints are documented using `drf-spectacular`:

```python
from drf_spectacular.utils import extend_schema, OpenApiParameter

@extend_schema(
    summary="List clients",
    description="Get paginated list of clients",
    parameters=[
        OpenApiParameter(
            name='search',
            description='Search by name, email, phone',
            required=False,
            type=str
        )
    ],
    responses={200: ClientSerializer(many=True)}
)
def list(self, request):
    # Implementation
```

---

## 🧪 Testing

```bash
# Run all tests
python manage.py test

# Run specific app
python manage.py test apps.clients

# Run with coverage
coverage run --source='.' manage.py test
coverage report

# Run specific test class
python manage.py test apps.clients.tests.ClientTestCase

# Run specific test method
python manage.py test apps.clients.tests.ClientTestCase.test_create_client
```

---

## 🔒 Security Features

### Authentication
- JWT token with 30-day access token
- Refresh token rotation
- Token blacklisting on logout
- Two-factor authentication support

### Authorization
- Role-based permissions (Admin, Manager, Agent, etc.)
- Custom permission classes
- Object-level permissions
- Business-level data isolation

### Input Validation
- DRF serializer validation
- Django form validation
- Custom validators
- SQL injection prevention (ORM)

### Security Headers
- XSS protection
- Content type nosniff
- Frame options (X-Frame-Options)
- HSTS (HTTP Strict Transport Security)
- CSP (Content Security Policy)

---

## 🌍 Environment Variables

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

# Frontend URL
FRONTEND_URL=http://localhost:3000

# CORS
CORS_ALLOW_ALL_ORIGINS=False
CSRF_TRUSTED_ORIGINS=http://localhost:3000
```

---

## 📚 Additional Resources

### Internal Documentation
- **[Architecture Overview](../../architecture/backend/00-BACKEND-OVERVIEW.md)** - Complete backend guide
- **[Building New App](../../architecture/backend/01-BUILDING-NEW-APP.md)** - Step-by-step app creation
- **[Project Overview](../../01-PROJECT-OVERVIEW.md)** - Project-wide overview
- **[Installation Guide](../../02-INSTALLATION.md)** - Setup instructions

### External Resources
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [drf-spectacular](https://drf-spectacular.readthedocs.io/)
- [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/)

---

## 🆘 Common Issues

### "No such table" error
```bash
python manage.py makemigrations
python manage.py migrate
```

### Permission denied on API
```python
# Check permission classes in your ViewSet
permission_classes = [IsAuthenticated]  # Not AllowAny
```

### Business filtering not working
```python
# Use StandardResponseMixin for automatic filtering
class MyViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    # Business filtering is automatic
    pass
```

---

## 🎓 Best Practices

✅ **DO**:
- Follow standard app structure
- Use `StandardResponseMixin` for consistent responses
- Implement multi-tenancy (business field)
- Add audit fields (created_by, updated_by)
- Use soft delete instead of hard delete
- Write comprehensive tests
- Document APIs with OpenAPI decorators

❌ **DON'T**:
- Hard delete data (use soft delete)
- Skip business filtering (security risk!)
- Forget to add migrations
- Leave out audit trails
- Skip testing
- Use inconsistent response formats

---

## 📝 Next Steps

1. **Read**: [Backend Overview](../../architecture/backend/00-BACKEND-OVERVIEW.md)
2. **Learn**: [Building New App](../../architecture/backend/01-BUILDING-NEW-APP.md)
3. **Explore**: Check existing apps for patterns
4. **Build**: Create your first app
5. **Test**: Write comprehensive tests
6. **Document**: Add API documentation

---

**Ready to build? Check out the [Complete Backend Guide](../../architecture/backend/README.md)! 🚀**

