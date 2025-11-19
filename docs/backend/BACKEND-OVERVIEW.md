# Backend Architecture Overview

**Last Updated**: October 31, 2025  
**Source**: Moved from `docs/architecture/backend/`

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Architecture Patterns](#architecture-patterns)
4. [App Structure](#app-structure)
5. [API Standards](#api-standards)
6. [Security](#security)
7. [Quick Start](#quick-start)

---

## Technology Stack

### Core Framework
- **Django**: 4.2+ - Python web framework
- **Django REST Framework**: 3.14+ - API toolkit
- **Python**: 3.11+ (3.12 recommended)

### Authentication & Security
- **SimpleJWT**: JWT token authentication
- **django-cors-headers**: CORS handling
- **Password Validation**: Django's robust password validators

### Database
- **Database**: PostgreSQL 15+ (production), SQLite (development)
- **Connection Pooling**: Optimized database connections

### API Documentation
- **drf-spectacular**: OpenAPI 3.0 schema generation  
- **Swagger UI**: Interactive API documentation
- **ReDoc**: Alternative API documentation interface

### Additional Tools
- **django-extensions**: Development utilities
- **django-filters**: Advanced filtering

---

## Project Structure

```
backend/
├── apps/                           # Django applications
│   ├── account/                   # ✅ User authentication & management
│   │   ├── models.py             # User model with roles, audit
│   │   ├── serializers.py        # Auth serializers (login, register, etc.)
│   │   ├── views.py              # Auth endpoints (JWT-based)
│   │   ├── urls.py               # Auth routes
│   │   ├── permissions.py        # Role-based permissions
│   │   └── admin.py              # User admin interface
│   │
│   ├── elections/                 # ✅ Election & committee management
│   ├── electors/                  # ✅ Voter database
│   ├── candidates/                # ✅ Parties & candidates
│   ├── guarantees/                # ✅ Guarantee collection
│   ├── attendees/                 # ✅ Attendance tracking
│   ├── voting/                    # ✅ Vote counting & results
│   ├── reports/                   # ✅ Analytics & dashboards
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
│   Database (PostgreSQL)        │  ← Data persistence
└─────────────────────────────────┘
```

### 2. **Modular App Architecture**

Each Django app follows a consistent structure and handles a specific domain:

- **Focused Responsibility**: Each app handles one domain
- **Loose Coupling**: Apps communicate through well-defined interfaces
- **High Cohesion**: Related functionality stays together
- **Reusable Components**: Shared utilities in `apps.utils`

### 3. **Standardized Pattern**

**Current Apps** (9 core apps):
- **account**: User authentication, roles, permissions
- **elections**: Election configuration & committees
- **electors**: Voter database with advanced search
- **candidates**: Parties & candidates management
- **guarantees**: Guarantee collection system
- **attendees**: Attendance tracking
- **voting**: Vote counting & results
- **reports**: Analytics & dashboards
- **utils**: Shared utilities, mixins, response formats

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

See [Building New App Guide](./BUILDING-NEW-APP.md) for detailed examples of each file.

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

📖 **See [API Conventions Guide](./API-CONVENTIONS.md) for complete details**

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
  "status": "success",
  "data": [
    {"id": 1, "name": "Item 1"},
    {"id": 2, "name": "Item 2"}
  ],
  "message": "Items retrieved successfully",
  "meta": {
    "pagination": {
      "count": 100,
      "page": 1,
      "page_size": 20,
      "total_pages": 5
    },
    "timestamp": "2025-10-31T12:00:00Z",
    "request_id": "abc123"
  }
}

// Create/Update Response
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "John Doe"
  },
  "message": "Created successfully"
}

// Delete Response
{
  "status": "success",
  "data": null,
  "message": "Deleted successfully"
}
```

#### Error Response Examples

```json
// Validation Error
{
  "status": "error",
  "data": null,
  "message": "Validation failed",
  "errors": {
    "email": ["This field is required."],
    "phone": ["Invalid phone number format."]
  }
}

// Not Found Error
{
  "status": "error",
  "data": null,
  "message": "Resource not found"
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
    - Transaction handling
    """
    
    queryset = MyModel.objects.all()
    serializer_class = MySerializer
    permission_classes = [IsAuthenticated]
    
    # Customize messages (optional)
    list_message = None  # No message for list
    create_message = "Created successfully"
    update_message = "Updated successfully"
    delete_message = "Deleted successfully"
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
2. **Password Security**: 
   - Minimum length validation
   - Complexity requirements
   - Account lockout after failed attempts
3. **CORS Configuration**: Controlled origins
4. **Security Headers**: XSS protection, Content type nosniff, Frame options, HSTS
5. **Email Verification**: Required for new accounts
6. **Password Reset**: Secure token-based reset
7. **Failed Login Tracking**: Automatic account locking

### Permission Classes

```python
# Built-in permissions
from rest_framework.permissions import (
    IsAuthenticated,      # Must be logged in
    IsAdminUser,         # Must be admin
    AllowAny,            # No authentication required
)

# Custom permissions
from apps.utils.permissions import (
    IsAdminOrAbove,       # Admin or Super Admin role
    IsSupervisorOrAbove,  # Supervisor, Admin, or Super Admin
    IsAssignedToCommittee,# For voting day operations
)

# Usage
class MyViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [IsAuthenticated(), IsAdminOrAbove()]
        return [IsAuthenticated()]
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
python manage.py create_demo_election
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

- **[API Conventions & Standards](./API-CONVENTIONS.md)** - Field naming, response format, best practices
- **[Building a New App](./BUILDING-NEW-APP.md)** - Step-by-step guide
- **[App Structure Guide](./APP-STRUCTURE.md)** - Detailed app documentation
- **[Backend Standardization Audit](./BACKEND-STANDARDIZATION-AUDIT-2025.md)** - Latest audit report

---

**For detailed patterns and examples, see the individual guides in this directory.**

