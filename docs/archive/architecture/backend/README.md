# Backend Architecture Documentation

**Complete Guide to Django Backend** | Last Updated: October 24, 2025

## 📚 Documentation Index

### Core Documentation

1. **[Backend Overview](./00-BACKEND-OVERVIEW.md)** ⭐ **START HERE**
   - Technology stack
   - Project structure
   - Architecture patterns
   - App organization
   - API standards
   - Multi-tenancy
   - Security features
   - Quick start guide

2. **[Building a New App](./01-BUILDING-NEW-APP.md)** 🔧 **ESSENTIAL**
   - Step-by-step app creation
   - Models, serializers, views
   - URL configuration
   - Admin setup
   - Permissions
   - Testing
   - Complete examples

### Additional Guides

3. **API Documentation Standards** (Coming Soon)
   - OpenAPI/Swagger documentation
   - API versioning
   - Response standards
   - Error handling

4. **Testing Guide** (Coming Soon)
   - Unit tests
   - Integration tests
   - Test coverage
   - CI/CD integration

5. **Deployment Guide** (Coming Soon)
   - Production setup
   - Environment configuration
   - Database migrations
   - Monitoring & logging

---

## Quick Reference

### Technology Stack

- **Framework**: Django 4.2.3 + Django REST Framework 3.14.0
- **Authentication**: JWT (SimpleJWT)
- **Database**: PostgreSQL/MySQL (production), SQLite (development)
- **Cache**: Redis
- **API Docs**: drf-spectacular (OpenAPI 3.0)
- **Python**: 3.8+ (3.12 recommended)

### Standard App Structure

```
apps/your_app/
├── __init__.py
├── models.py           # Data models (ORM)
├── serializers.py      # DRF serializers
├── views.py            # API views/viewsets
├── urls.py             # URL routing
├── admin.py            # Django admin
├── permissions.py      # Custom permissions (optional)
├── tests.py            # Unit tests
└── migrations/         # Database migrations
```

### Standard Response Format

All APIs return consistent format:

```json
{
  "data": [...] or {...},
  "message": "Success message",
  "meta": {
    "pagination": {...}
  }
}
```

### Quick Commands

```bash
# Create new app
python manage.py startapp your_app apps/your_app

# Make migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Run tests
python manage.py test apps.your_app

# Run development server
python manage.py runserver

# Create superuser
python manage.py createsuperuser
```

---

## Key Patterns

### 1. Standard Response Format

All APIs return consistent format:

```python
from apps.utils.responses import APIResponse

return APIResponse.success(
    data=[...],
    message="Success"
)
```

Use `StandardResponseMixin` for automatic wrapping:

```python
class MyViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    queryset = MyModel.objects.all()
    serializer_class = MySerializer
```

### 2. Soft Delete

Add to your models for data preservation:

```python
is_deleted = models.BooleanField(default=False)
deleted_at = models.DateTimeField(null=True, blank=True)
deleted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
```

### 3. Audit Trail

Track who created/updated records:

```python
created_at = models.DateTimeField(auto_now_add=True)
updated_at = models.DateTimeField(auto_now=True)
created_by = models.ForeignKey('account.User', on_delete=models.SET_NULL, null=True)
updated_by = models.ForeignKey('account.User', on_delete=models.SET_NULL, null=True)
```

### 4. Standard Response Utilities

```python
from apps.utils.responses import APIResponse

# Success
return APIResponse.success(data=data, message="Success")

# Created
return APIResponse.created(data=data, message="Created")

# Error
return APIResponse.error(message="Error", errors={...})

# Paginated
return APIResponse.paginated(data=data, count=100, page=1)
```

---

## Project Structure Overview

```
backend/
├── apps/                          # Django applications
│   ├── account/                  # ✅ User authentication & management
│   │   ├── models.py            # User model with roles, 2FA
│   │   ├── serializers.py       # Auth serializers
│   │   ├── views.py             # Auth endpoints (JWT)
│   │   ├── urls.py              # Auth routes
│   │   ├── permissions.py       # Role-based permissions
│   │   └── admin.py             # User admin
│   │
│   ├── config/                   # ✅ System configuration
│   │   ├── models.py            # App settings
│   │   ├── serializers.py       # Config serializers
│   │   ├── views.py             # Config API
│   │   └── urls.py              # Config routes
│   │
│   └── utils/                    # ✅ Shared utilities
│       ├── mixins.py            # ViewSet mixins
│       ├── responses.py         # Standard responses
│       └── viewsets.py          # Base viewsets
│
├── core/                         # Django core
│   ├── settings.py              # ✅ Main settings
│   ├── urls.py                  # Root URLs
│   └── wsgi.py                  # WSGI application
│
├── utils/                        # Backend utilities
├── tests/                        # Test suites
├── manage.py                     # Django management
└── requirements.txt              # Dependencies
```

---

## Example: Minimal Working App

### 1. Create App

```bash
python manage.py startapp tasks apps/tasks
cd apps/tasks
touch serializers.py urls.py
```

### 2. Model

```python
# models.py
from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    business = models.ForeignKey('business.Business', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'tasks'
    
    def __str__(self):
        return self.title
```

### 3. Serializer

```python
# serializers.py
from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'completed', 'created_at']
        read_only_fields = ['id', 'created_at']
```

### 4. ViewSet

```python
# views.py
from rest_framework import viewsets
from apps.utils.viewsets import StandardResponseMixin
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
```

### 5. URLs

```python
# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
]
```

### 6. Register

```python
# core/settings.py - Add to INSTALLED_APPS
'apps.tasks',

# core/urls.py - Add URL
path('api/tasks/', include('apps.tasks.urls')),
```

### 7. Migrate & Test

```bash
python manage.py makemigrations tasks
python manage.py migrate tasks
python manage.py runserver

# Test: http://localhost:8000/api/tasks/tasks/
```

**Done! 🎉**

---

## Best Practices Checklist

### Models ✅
- [ ] Add `business` field for multi-tenancy
- [ ] Include audit fields (`created_by`, `updated_by`)
- [ ] Implement soft delete (`is_deleted`, `deleted_at`)
- [ ] Add appropriate indexes
- [ ] Use meaningful field names
- [ ] Add `help_text` to fields
- [ ] Define `__str__()` method
- [ ] Set proper `Meta` options

### Serializers ✅
- [ ] Use `ModelSerializer` when possible
- [ ] Define `read_only_fields`
- [ ] Add field-level validation
- [ ] Implement object-level validation
- [ ] Create separate serializers for list/detail views
- [ ] Include computed fields as needed

### Views ✅
- [ ] Use `StandardResponseMixin` for ViewSets
- [ ] Set proper `permission_classes`
- [ ] Add filtering, searching, ordering
- [ ] Optimize queries (`select_related`, `prefetch_related`)
- [ ] Implement custom actions as needed
- [ ] Add API documentation decorators

### URLs ✅
- [ ] Use REST router for ViewSets
- [ ] Follow naming conventions
- [ ] Register in core URLs

### Admin ✅
- [ ] Register model with `@admin.register`
- [ ] Configure `list_display`
- [ ] Add `list_filter` and `search_fields`
- [ ] Define `readonly_fields`
- [ ] Organize with `fieldsets`

### Testing ✅
- [ ] Write unit tests for models
- [ ] Test all CRUD operations
- [ ] Test business isolation
- [ ] Test permissions
- [ ] Test edge cases

### Security ✅
- [ ] Enforce authentication
- [ ] Implement proper permissions
- [ ] Validate all input
- [ ] Filter by business (multi-tenancy)
- [ ] Prevent SQL injection (use ORM)
- [ ] Sanitize output

---

## Common Patterns

### Standard ViewSet

```python
# With automatic response wrapping
from apps.utils.viewsets import StandardResponseMixin

class MyViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    queryset = MyModel.objects.all()
    serializer_class = MySerializer
    
    create_message = "Created successfully"
    update_message = "Updated successfully"
    delete_message = "Deleted successfully"
```

### Soft Delete

```python
# In ViewSet (automatic with StandardResponseMixin)
class MyViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    # Soft delete automatic
    pass

# Manual soft delete
def perform_destroy(self, instance):
    from django.utils import timezone
    instance.is_deleted = True
    instance.deleted_at = timezone.now()
    instance.deleted_by = self.request.user
    instance.save()
```

### Custom Actions

```python
from rest_framework.decorators import action

class MyViewSet(viewsets.ModelViewSet):
    
    @action(detail=True, methods=['post'])
    def custom_action(self, request, pk=None):
        """Custom action on single object"""
        obj = self.get_object()
        # Your logic here
        return APIResponse.success(data={...})
    
    @action(detail=False, methods=['get'])
    def list_action(self, request):
        """Custom action on collection"""
        # Your logic here
        return APIResponse.success(data=[...])
```

---

## Resources

### Internal Documentation
- [Backend Overview](./00-BACKEND-OVERVIEW.md) - Complete backend guide
- [Building New App](./01-BUILDING-NEW-APP.md) - Step-by-step app creation
- [Project Overview](../../01-PROJECT-OVERVIEW.md) - Project-wide overview
- [Installation](../../02-INSTALLATION.md) - Setup instructions

### External Resources
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [drf-spectacular](https://drf-spectacular.readthedocs.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### API Documentation
- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **Schema**: http://localhost:8000/api/schema/

---

## Need Help?

### Debugging Steps

1. **Check logs**: `python manage.py runserver` (terminal output)
2. **Check migrations**: `python manage.py showmigrations`
3. **Test queries**: Use Django shell: `python manage.py shell`
4. **Check permissions**: Verify `permission_classes`
5. **Inspect database**: Use Django admin or DB client
6. **Review code**: Compare with working examples

### Common Issues

**"No such table"**
```bash
python manage.py makemigrations
python manage.py migrate
```

**"Permission denied"**
```python
# Check permission_classes in your ViewSet
permission_classes = [IsAuthenticated]
```

**"Business filtering not working"**
```python
# Use StandardResponseMixin
class MyViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    pass
```

---

## Contributing

When adding new features:

1. Follow established patterns
2. Write tests
3. Add API documentation
4. Update relevant docs
5. Test thoroughly
6. Get code review

---

**Ready to build? Start with [Building a New App](./01-BUILDING-NEW-APP.md)! 🚀**

