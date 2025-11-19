# Backend Quick Reference Card

**Election Management System - Django REST Framework**

---

## 📋 Standardized Response Format

```python
{
    "status": "success",
    "data": { /* your data */ },
    "message": "Optional message",
    "meta": {
        "timestamp": "2025-10-25T12:00:00Z",
        "request_id": "uuid"
    }
}
```

---

## 🔥 Quick Imports

```python
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from apps.utils.viewsets import StandardResponseMixin
from apps.utils.responses import APIResponse
from apps.utils.permissions import IsAdminOrAbove, IsSupervisorOrAbove
```

---

## 🎯 ViewSet Template

```python
class MyViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    """
    Description.
    
    Endpoints:
    - GET    /api/items/       - List
    - POST   /api/items/       - Create
    - GET    /api/items/{id}/  - Retrieve
    - PUT    /api/items/{id}/  - Update
    - DELETE /api/items/{id}/  - Delete
    """
    
    queryset = MyModel.objects.all()
    serializer_class = MySerializer
    permission_classes = [IsAuthenticated]
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['name']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return MyListSerializer
        return MySerializer
    
    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            return [IsAuthenticated(), IsAdminOrAbove()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        return MyModel.objects.select_related('fk').prefetch_related('m2m')
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """GET /api/items/statistics/"""
        return APIResponse.success(data={'total': 10})
```

---

## 📦 Response Helpers

```python
# Success
APIResponse.success(data=serializer.data, message="Success")

# Created (201)
APIResponse.created(data=serializer.data, message="Created")

# Updated
APIResponse.updated(data=serializer.data, message="Updated")

# Deleted
APIResponse.deleted(message="Deleted")

# Error
APIResponse.error(
    message="Error message",
    errors={"field": ["Error"]},
    status_code=status.HTTP_400_BAD_REQUEST
)
```

---

## 🔐 Permission Classes

```python
from apps.utils.permissions import (
    IsAdminOrAbove,        # ADMIN or SUPER_ADMIN
    IsSupervisorOrAbove,   # SUPERVISOR, ADMIN, or SUPER_ADMIN
    IsAssignedToCommittee  # Assigned to committee
)

# Usage
permission_classes = [IsAuthenticated, IsAdminOrAbove]

# Dynamic
def get_permissions(self):
    if self.action in ['create', 'destroy']:
        return [IsAuthenticated(), IsAdminOrAbove()]
    return [IsAuthenticated()]
```

---

## 🗄️ Model Template

```python
class MyModel(models.Model):
    """Model description."""
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
    ]
    
    name = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='my_models_created'
    )
    
    class Meta:
        db_table = 'my_models'
        verbose_name = 'My Model'
        verbose_name_plural = 'My Models'
        ordering = ['-created_at']
        indexes = [models.Index(fields=['status'])]
    
    def __str__(self):
        return self.name
```

---

## 📄 Serializer Template

```python
class MySerializer(serializers.ModelSerializer):
    """Full serializer."""
    
    display_status = serializers.CharField(source='get_status_display', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    
    class Meta:
        model = MyModel
        fields = ['id', 'name', 'status', 'display_status', 'created_at', 'created_by_name']
        read_only_fields = ['id', 'created_at']


class MyListSerializer(serializers.ModelSerializer):
    """List serializer (lightweight)."""
    
    class Meta:
        model = MyModel
        fields = ['id', 'name', 'status', 'created_at']


class MyCreateSerializer(serializers.ModelSerializer):
    """Create serializer."""
    
    class Meta:
        model = MyModel
        fields = ['name', 'status']
    
    def validate_name(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("Name too short")
        return value
```

---

## 🔗 URL Template

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MyViewSet

router = DefaultRouter()
router.register(r'', MyViewSet, basename='my-model')

app_name = 'my_app'

urlpatterns = [
    path('', include(router.urls)),
]
```

---

## 🔍 Query Optimization

```python
# select_related (foreign keys)
queryset = MyModel.objects.select_related('fk1', 'fk2')

# prefetch_related (many-to-many, reverse FKs)
queryset = MyModel.objects.prefetch_related('m2m', 'reverse_fk')

# Combined
queryset = MyModel.objects.select_related('fk').prefetch_related('m2m')
```

---

## 🎬 Custom Actions

```python
# Collection action (detail=False)
@action(detail=False, methods=['get'])
def statistics(self, request):
    """GET /api/items/statistics/"""
    return APIResponse.success(data={...})

# Item action (detail=True)
@action(detail=True, methods=['post'])
def approve(self, request, pk=None):
    """POST /api/items/{id}/approve/"""
    item = self.get_object()
    item.approve()
    return APIResponse.success(data=serializer.data, message="Approved")

# With permissions
@action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated, IsAdminOrAbove])
def verify(self, request, pk=None):
    """PATCH /api/items/{id}/verify/"""
    # ...
```

---

## 🔒 Transaction Handling

```python
from django.db import transaction

@action(detail=False, methods=['post'])
@transaction.atomic
def bulk_operation(self, request):
    """All operations are atomic."""
    for item in items:
        item.save()
    return APIResponse.success(message="Done")
```

---

## 🚨 Error Handling

```python
# Not found
if not item:
    return APIResponse.error(
        message="Item not found",
        status_code=status.HTTP_404_NOT_FOUND
    )

# Forbidden
if not has_permission:
    return APIResponse.error(
        message="Permission denied",
        status_code=status.HTTP_403_FORBIDDEN
    )

# Bad request
return APIResponse.error(
    message="Validation failed",
    errors={"field": ["Error message"]},
    status_code=status.HTTP_400_BAD_REQUEST
)
```

---

## 📊 Common Patterns

### Filtering by User
```python
def get_queryset(self):
    if self.request.user.is_admin_or_above():
        return MyModel.objects.all()
    return MyModel.objects.filter(user=self.request.user)
```

### Statistics Endpoint
```python
@action(detail=False, methods=['get'])
def statistics(self, request):
    """GET /api/items/statistics/"""
    from django.db.models import Count
    
    queryset = self.get_queryset()
    stats = {
        'total': queryset.count(),
        'by_status': list(queryset.values('status').annotate(count=Count('id')))
    }
    return APIResponse.success(data=stats)
```

### Bulk Update
```python
@action(detail=False, methods=['post'])
@transaction.atomic
def bulk_update(self, request):
    """POST /api/items/bulk-update/"""
    ids = request.data.get('ids', [])
    status = request.data.get('status')
    
    items = MyModel.objects.filter(id__in=ids)
    items.update(status=status)
    
    return APIResponse.success(
        data={'updated': len(ids)},
        message=f"Updated {len(ids)} items"
    )
```

---

## ✅ Pre-Commit Checklist

- [ ] Uses `StandardResponseMixin`
- [ ] Uses `APIResponse` for all responses
- [ ] Has comprehensive docstring with endpoints
- [ ] Implements `get_permissions()` if needed
- [ ] Optimizes queries with select_related/prefetch_related
- [ ] Has proper filtering/search/ordering
- [ ] Custom actions have decorators and docs
- [ ] No linting errors
- [ ] Tested manually

---

## 📚 Full Documentation

See `BACKEND-STANDARDIZATION-GUIDE.md` for complete details.

---

**Quick Tips:**
- Always use `APIResponse` for consistent responses
- Inherit from `StandardResponseMixin` for automatic handling
- Optimize queries to prevent N+1 problems
- Document all custom actions
- Use transactions for multi-step operations
- Test all endpoints manually before committing

