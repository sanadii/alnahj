# Backend Standardization Guide
**Election Management System - Django REST Framework**

**Version:** 1.1  
**Last Updated:** October 27, 2025  
**Status:** ✅ Standardized & Documented

---

## 🆕 Recent Updates (v1.1)

**October 27, 2025** - Complete Standardization & Audit:
- ✅ **Comprehensive Audit**: Full backend standardization audit completed
  - **Score: 10/10** - Fully Standardized
  - 20 ViewSets audited across 9 apps
  - 112 APIResponse usages verified
  - 100% compliance across all modules
  - 📊 See [STANDARDIZATION-AUDIT-REPORT.md](./STANDARDIZATION-AUDIT-REPORT.md)

- ✅ **App Naming Standardization**:
  - Renamed `apps.election` → `apps.elections` (plural)
  - Renamed `apps.attendance` → `apps.attendees` (plural)
  - Created `apps.candidates` (separated from voting)
  - All apps follow Django plural naming convention
  - 📝 See [APPS-PLURALIZATION-SUMMARY.md](../APPS-PLURALIZATION-SUMMARY.md)

**Important**: All code examples in this guide use the **new pluralized app names**.

---

## Table of Contents
1. [Overview](#overview)
2. [API Response Format](#api-response-format)
3. [ViewSet Patterns](#viewset-patterns)
4. [URL Structure](#url-structure)
5. [Model Patterns](#model-patterns)
6. [Serializer Patterns](#serializer-patterns)
7. [Permission Patterns](#permission-patterns)
8. [Error Handling](#error-handling)
9. [Best Practices](#best-practices)
10. [Code Review Checklist](#code-review-checklist)

---

## Overview

This guide defines the standardized patterns used across the Election Management System backend. **All new code must follow these standards**.

### Core Principles
- ✅ **Consistency**: Same patterns across all modules
- ✅ **Predictability**: Frontend knows exactly what to expect
- ✅ **Maintainability**: Easy to understand and modify
- ✅ **Type Safety**: Clear data structures
- ✅ **Error Handling**: Consistent error responses
- ✅ **Documentation**: Self-documenting code

---

## API Response Format

### Standard Response Structure

**All API endpoints MUST use the `APIResponse` class** to ensure consistent response format.

#### Success Response
```json
{
  "status": "success",
  "data": { /* your data */ },
  "message": "Optional success message",
  "meta": {
    "timestamp": "2025-10-25T12:00:00Z",
    "request_id": "abc-123-def-456"
  }
}
```

#### Error Response
```json
{
  "status": "error",
  "data": null,
  "message": "Error description",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

#### Paginated Response
```json
{
  "status": "success",
  "data": [ /* array of items */ ],
  "message": null,
  "meta": {
    "timestamp": "2025-10-25T12:00:00Z",
    "request_id": "abc-123",
    "pagination": {
      "count": 100,
      "next": "http://...",
      "previous": "http://..."
    }
  }
}
```

### Using APIResponse

```python
from apps.utils.responses import APIResponse

# Success with data
return APIResponse.success(
    data=serializer.data,
    message="Operation successful"
)

# Created (201)
return APIResponse.created(
    data=serializer.data,
    message="Resource created successfully"
)

# Updated
return APIResponse.updated(
    data=serializer.data,
    message="Resource updated successfully"
)

# Deleted
return APIResponse.deleted(
    message="Resource deleted successfully"
)

# Error
return APIResponse.error(
    message="Validation failed",
    errors=serializer.errors,
    status_code=status.HTTP_400_BAD_REQUEST
)
```

---

## ViewSet Patterns

### Standard ViewSet Structure

**Use `StandardResponseMixin`** for automatic standardized responses:

```python
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from .models import MyModel
from .serializers import MySerializer, MyListSerializer, MyCreateSerializer
from apps.utils.viewsets import StandardResponseMixin
from apps.utils.permissions import IsAdminOrAbove


class MyModelViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    """
    MyModel CRUD operations.
    
    Endpoints:
    - GET    /api/my-models/              - List items
    - POST   /api/my-models/              - Create item (admin)
    - GET    /api/my-models/{id}/         - Get item details
    - PUT    /api/my-models/{id}/         - Update item (admin)
    - DELETE /api/my-models/{id}/         - Delete item (admin)
    - GET    /api/my-models/statistics/   - Get statistics
    """
    
    queryset = MyModel.objects.all()
    permission_classes = [IsAuthenticated]
    
    # Filtering & Search
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_fields = ['status', 'category']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']
    
    # Custom success messages (optional)
    create_message = "Item created successfully"
    update_message = "Item updated successfully"
    delete_message = "Item deleted successfully"
    
    def get_serializer_class(self):
        """Use appropriate serializer based on action."""
        if self.action == 'list':
            return MyListSerializer
        elif self.action == 'create':
            return MyCreateSerializer
        return MySerializer
    
    def get_permissions(self):
        """Set permissions based on action."""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminOrAbove()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """Optimize queries with select_related/prefetch_related."""
        return MyModel.objects.select_related(
            'related_model'
        ).prefetch_related(
            'many_to_many_relation'
        )
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        Get statistics.
        
        GET /api/my-models/statistics/
        """
        from apps.utils.responses import APIResponse
        
        # Calculate statistics
        stats = {
            'total': self.get_queryset().count(),
            # ... more stats
        }
        
        return APIResponse.success(data=stats)
```

### Benefits of StandardResponseMixin

The mixin automatically handles:
- ✅ Consistent response wrapping
- ✅ Transaction handling (@transaction.atomic)
- ✅ Pagination with metadata
- ✅ `created_by` and `updated_by` tracking
- ✅ Soft delete support
- ✅ User-friendly messages

---

## URL Structure

### URL Naming Conventions

**Follow RESTful conventions:**

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MyModelViewSet

router = DefaultRouter()
router.register(r'', MyModelViewSet, basename='my-model')

app_name = 'my_app'

urlpatterns = [
    path('', include(router.urls)),
]
```

### URL Patterns

```
# Standard CRUD
GET     /api/my-models/              - List (paginated)
POST    /api/my-models/              - Create
GET     /api/my-models/{id}/         - Retrieve
PUT     /api/my-models/{id}/         - Update (full)
PATCH   /api/my-models/{id}/         - Update (partial)
DELETE  /api/my-models/{id}/         - Delete

# Custom actions (detail=False)
GET     /api/my-models/statistics/   - Collection-level action
POST    /api/my-models/bulk-create/  - Bulk operation

# Custom actions (detail=True)
GET     /api/my-models/{id}/history/ - Item-level action
POST    /api/my-models/{id}/approve/ - Item action
```

### Core URL Structure

```
/api/
├── auth/
│   ├── login/                  - User login
│   ├── logout/                 - User logout
│   └── refresh/                - Refresh token
├── users/                      - User management
├── elections/                  - Elections (plural)
│   └── committees/             - Committees (nested)
├── candidates/                 - Candidates & parties (plural)
│   └── parties/                - Political parties (nested)
├── electors/                   - Electors
├── guarantees/                 - Guarantees
│   └── groups/                 - Guarantee groups (nested)
├── attendees/                  - Attendance tracking (plural)
├── voting/
│   ├── vote-counts/            - Vote counts
│   ├── committee-entries/      - Committee entries
│   └── results/                - Election results
└── reports/                    - Reports & analytics
```

---

## Model Patterns

### Base Model Structure

```python
from django.db import models
from django.conf import settings


class BaseModel(models.Model):
    """
    Abstract base model with common fields.
    All models should inherit from this.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True
        ordering = ['-created_at']


class MyModel(BaseModel):
    """
    Model description.
    
    Attributes:
        name: Human-readable name
        status: Current status (choices)
        created_by: User who created this
    """
    
    # Status choices
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
    ]
    
    # Fields
    name = models.CharField(
        max_length=200,
        help_text='Model name'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='ACTIVE',
        help_text='Current status'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='my_models_created',
        help_text='User who created this'
    )
    
    class Meta:
        db_table = 'my_models'
        verbose_name = 'My Model'
        verbose_name_plural = 'My Models'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return self.name
    
    def get_display_status(self):
        """Get human-readable status."""
        return dict(self.STATUS_CHOICES).get(self.status, self.status)
```

### Naming Conventions

- **Model names**: PascalCase, singular (`Election`, `Candidate`, `VoteCount`)
- **Field names**: snake_case (`created_at`, `is_active`, `vote_count`)
- **Choice fields**: UPPERCASE (`STATUS_CHOICES`, `GENDER_CHOICES`)
- **Choice values**: UPPERCASE (`'ACTIVE'`, `'PENDING'`, `'MALE'`)
- **Related names**: Plural, descriptive (`related_name='elections_created'`)

### Required Fields

Every model should have:
- ✅ `created_at` (auto_now_add=True)
- ✅ `updated_at` (auto_now=True)
- ✅ `__str__()` method
- ✅ Proper `Meta` class with `db_table`, `verbose_name`, `ordering`
- ✅ Docstring explaining purpose
- ✅ Help text on fields

---

## Serializer Patterns

### Serializer Structure

```python
from rest_framework import serializers
from .models import MyModel


class MySerializer(serializers.ModelSerializer):
    """
    Full serializer for MyModel.
    Used for retrieve/detail endpoints.
    """
    
    # Read-only computed fields
    display_status = serializers.CharField(
        source='get_display_status',
        read_only=True
    )
    created_by_name = serializers.CharField(
        source='created_by.full_name',
        read_only=True,
        allow_null=True
    )
    
    class Meta:
        model = MyModel
        fields = [
            'id',
            'name',
            'status',
            'display_status',
            'created_by',
            'created_by_name',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class MyListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for list endpoints.
    Only essential fields for performance.
    """
    
    display_status = serializers.CharField(
        source='get_display_status',
        read_only=True
    )
    
    class Meta:
        model = MyModel
        fields = ['id', 'name', 'status', 'display_status', 'created_at']
        read_only_fields = ['id', 'created_at']


class MyCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating MyModel.
    Excludes auto-generated fields.
    """
    
    class Meta:
        model = MyModel
        fields = ['name', 'status']
    
    def validate_name(self, value):
        """Validate name field."""
        if len(value) < 3:
            raise serializers.ValidationError(
                "Name must be at least 3 characters long"
            )
        return value
```

### Serializer Types

1. **Full Serializer** (`MySerializer`)
   - Used for: `retrieve`, `update` actions
   - Includes: All fields, computed fields, related data
   
2. **List Serializer** (`MyListSerializer`)
   - Used for: `list` action
   - Includes: Only essential fields for performance
   
3. **Create Serializer** (`MyCreateSerializer`)
   - Used for: `create` action
   - Includes: Only writable fields
   - Contains: Custom validation logic

4. **Update Serializer** (`MyUpdateSerializer`) - Optional
   - Used for: `update`, `partial_update` actions
   - Includes: Fields allowed to be updated

---

## Permission Patterns

### Custom Permissions

Located in `apps/utils/permissions.py`:

```python
from rest_framework import permissions


class IsAdminOrAbove(permissions.BasePermission):
    """
    Permission: User must be ADMIN or SUPER_ADMIN.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_admin_or_above()


class IsSupervisorOrAbove(permissions.BasePermission):
    """
    Permission: User must be SUPERVISOR, ADMIN, or SUPER_ADMIN.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_supervisor_or_above()


class IsAssignedToCommittee(permissions.BasePermission):
    """
    Permission: User must be assigned to the committee.
    """
    def has_permission(self, request, view):
        # Check committee assignment
        committee_code = view.kwargs.get('committee_code')
        return (
            request.user.is_admin_or_above() or
            committee_code in request.user.committees
        )
```

### Usage in ViewSets

```python
from apps.utils.permissions import IsAdminOrAbove, IsSupervisorOrAbove

class MyViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        """Dynamic permissions based on action."""
        if self.action in ['create', 'destroy']:
            # Only admins
            return [IsAuthenticated(), IsAdminOrAbove()]
        elif self.action in ['update', 'partial_update']:
            # Supervisors and above
            return [IsAuthenticated(), IsSupervisorOrAbove()]
        return [IsAuthenticated()]
```

---

## Error Handling

### Validation Errors

```python
from rest_framework import serializers
from apps.utils.responses import APIResponse

# In serializers
def validate_field(self, value):
    if not value:
        raise serializers.ValidationError(
            "Field is required"
        )
    return value

# In views
serializer.is_valid(raise_exception=True)  # Automatically handled by DRF
```

### Custom Error Responses

```python
from apps.utils.responses import APIResponse
from rest_framework import status

# Not found
if not item:
    return APIResponse.error(
        message="Item not found",
        status_code=status.HTTP_404_NOT_FOUND
    )

# Forbidden
if not has_permission:
    return APIResponse.error(
        message="You don't have permission to perform this action",
        status_code=status.HTTP_403_FORBIDDEN
    )

# Bad request with field errors
return APIResponse.error(
    message="Validation failed",
    errors={
        "field_name": ["Error message"],
        "another_field": ["Another error"]
    },
    status_code=status.HTTP_400_BAD_REQUEST
)
```

### Exception Handler

Global exception handler in `apps/utils/exceptions.py` automatically wraps all DRF exceptions in standard format.

---

## Best Practices

### 1. Query Optimization

**Always optimize database queries:**

```python
def get_queryset(self):
    """Optimize with select_related and prefetch_related."""
    return MyModel.objects.select_related(
        'foreign_key_field',
        'another_foreign_key'
    ).prefetch_related(
        'many_to_many_field',
        'reverse_foreign_key'
    )
```

### 2. Action Docstrings

**Document all custom actions:**

```python
@action(detail=False, methods=['get'])
def statistics(self, request):
    """
    Get statistics for MyModel.
    
    GET /api/my-models/statistics/
    
    Returns:
        Statistics including total count, status breakdown, etc.
    
    Example Response:
        {
            "status": "success",
            "data": {
                "total": 100,
                "by_status": {...}
            }
        }
    """
    # Implementation
```

### 3. Transaction Handling

**Use transactions for multi-step operations:**

```python
from django.db import transaction

@action(detail=False, methods=['post'])
@transaction.atomic
def bulk_operation(self, request):
    """Bulk operation with transaction."""
    # All operations in this function are atomic
    for item in items:
        item.save()
    return APIResponse.success(message="Bulk operation completed")
```

### 4. Audit Logging

**Log important actions:**

```python
def perform_create(self, serializer):
    """Create with audit log."""
    instance = serializer.save(created_by=self.request.user)
    
    # Log action
    AuditLog.log_action(
        instance=instance,
        user=self.request.user,
        action='CREATED',
        ip_address=self.request.META.get('REMOTE_ADDR')
    )
```

### 5. Pagination

**Use pagination for list endpoints:**

```python
# In settings.py
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50,
}

# StandardResponseMixin handles pagination automatically
```

### 6. Filtering & Search

**Enable filtering and search:**

```python
class MyViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_fields = ['status', 'category']  # ?status=ACTIVE
    search_fields = ['name', 'description']    # ?search=keyword
    ordering_fields = ['created_at', 'name']   # ?ordering=-created_at
```

---

## Code Review Checklist

### ✅ API Responses
- [ ] Uses `APIResponse` class for all responses
- [ ] Success responses have `data` and optional `message`
- [ ] Error responses have `message` and optional `errors`
- [ ] Pagination includes `meta.pagination`

### ✅ ViewSets
- [ ] Inherits from `StandardResponseMixin`
- [ ] Has comprehensive docstring with endpoints
- [ ] Uses appropriate serializer for each action
- [ ] Implements `get_permissions()` for permission control
- [ ] Optimizes queries in `get_queryset()`
- [ ] Custom actions have proper decorators and docs

### ✅ Models
- [ ] Inherits from `BaseModel` or has `created_at`/`updated_at`
- [ ] Has `__str__()` method
- [ ] Has proper `Meta` class with `db_table`, `verbose_name`, `ordering`
- [ ] Uses appropriate field types and constraints
- [ ] Has database indexes on frequently queried fields
- [ ] Has docstring explaining purpose

### ✅ Serializers
- [ ] Has separate serializers for list/create/update if needed
- [ ] Includes computed fields (e.g., `display_status`)
- [ ] Has proper field validation
- [ ] Uses `read_only_fields` appropriately
- [ ] Excludes sensitive fields from responses

### ✅ URLs
- [ ] Follows RESTful conventions
- [ ] Uses `DefaultRouter` for ViewSets
- [ ] Has `app_name` defined
- [ ] Uses descriptive `basename` for router

### ✅ Permissions
- [ ] All endpoints require authentication (unless public)
- [ ] Uses custom permissions (`IsAdminOrAbove`, etc.)
- [ ] Implements `get_permissions()` for action-based control
- [ ] Checks object-level permissions where needed

### ✅ Error Handling
- [ ] Validates input data properly
- [ ] Returns appropriate HTTP status codes
- [ ] Provides user-friendly error messages
- [ ] Handles edge cases (empty queryset, missing data, etc.)

### ✅ Performance
- [ ] Uses `select_related()` for foreign keys
- [ ] Uses `prefetch_related()` for many-to-many
- [ ] Avoids N+1 queries
- [ ] Uses pagination for large datasets
- [ ] Has database indexes on filtered/ordered fields

### ✅ Documentation
- [ ] ViewSet has comprehensive docstring
- [ ] Custom actions have docstrings with examples
- [ ] Models have field help text
- [ ] Serializers explain their purpose
- [ ] Complex logic has inline comments

---

## Examples

### Complete Working Example

See these implementations as reference:

1. **Election Module** (`apps/election/`)
   - Models: `Election`, `Committee`
   - ViewSets: `ElectionViewSet`, `CommitteeViewSet`
   - Custom actions: `current/`, `electors/`, `statistics/`

2. **Voting Module** (`apps/voting/`)
   - Complex operations with transactions
   - Audit logging
   - Bulk operations
   - Results generation

3. **Guarantees Module** (`apps/guarantees/`)
   - User-scoped data
   - Custom list response with embedded stats
   - History tracking
   - Group management

4. **Electors Module** (`apps/electors/`)
   - CSV import/export
   - Advanced search
   - Statistics dashboard
   - Optimized queries

---

## Quick Reference

### Import Statements
```python
# Views
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction

# Our utilities
from apps.utils.viewsets import StandardResponseMixin
from apps.utils.responses import APIResponse
from apps.utils.permissions import IsAdminOrAbove, IsSupervisorOrAbove

# Models & Serializers
from .models import MyModel
from .serializers import MySerializer
```

### Standard Response Examples
```python
# Success
return APIResponse.success(data=serializer.data)

# Created
return APIResponse.created(data=serializer.data, message="Created")

# Updated
return APIResponse.updated(data=serializer.data, message="Updated")

# Deleted
return APIResponse.deleted(message="Deleted successfully")

# Error
return APIResponse.error(
    message="Error message",
    errors={"field": ["Error"]},
    status_code=status.HTTP_400_BAD_REQUEST
)
```

---

## Conclusion

Following these standards ensures:
- ✅ Consistent API behavior across all endpoints
- ✅ Predictable responses for frontend integration
- ✅ Maintainable and scalable codebase
- ✅ Easy onboarding for new developers
- ✅ High code quality and reliability

**Questions or suggestions?** Contact the development team.

---

**Document Status:** ✅ Complete and Active  
**Next Review:** When adding new modules or patterns

