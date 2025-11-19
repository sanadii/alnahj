# Building a New Django App

**Complete Step-by-Step Guide** | Last Updated: October 24, 2025

This guide walks you through creating a new Django app following our established patterns and best practices.

## Table of Contents

1. [Before You Start](#before-you-start)
2. [Create the App](#create-the-app)
3. [Define Models](#define-models)
4. [Create Serializers](#create-serializers)
5. [Build Views](#build-views)
6. [Configure URLs](#configure-urls)
7. [Setup Admin](#setup-admin)
8. [Add Permissions](#add-permissions)
9. [Register App](#register-app)
10. [Test Your App](#test-your-app)
11. [API Documentation](#api-documentation)
12. [Example: Complete App](#example-complete-app)

---

## Before You Start

### Planning Checklist

- [ ] **App Name**: Choose a clear, descriptive name (singular or plural based on convention)
- [ ] **Domain**: Define the business domain this app handles
- [ ] **Models**: List the data models you need
- [ ] **Relationships**: Map relationships with other apps
- [ ] **API Endpoints**: Plan your REST endpoints
- [ ] **Permissions**: Define who can access what
- [ ] **Multi-Tenancy**: Determine if business isolation is needed

### Naming Conventions

- **App Name**: `lowercase_with_underscores` or `lowercase`
  - Good: `bookings`, `client_portal`, `inventory`
  - Avoid: `MyApp`, `my-app`

- **Model Names**: `PascalCase`, singular
  - Good: `Client`, `Appointment`, `Invoice`
  - Avoid: `clients`, `appointment_model`

- **URLs**: `lowercase-with-hyphens`
  - Good: `/api/clients/`, `/api/booking-requests/`
  - Avoid: `/api/Clients/`, `/api/booking_requests/`

---

## Step 1: Create the App

### Using Django Management Command

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
.\venv\Scripts\Activate.ps1  # Windows
# source venv/bin/activate    # Linux/Mac

# Create the app
python manage.py startapp your_app_name apps/your_app_name
```

### Initial Structure

After creation, you'll have:

```
apps/your_app_name/
├── __init__.py
├── admin.py
├── apps.py
├── models.py
├── tests.py
└── views.py
```

### Add Additional Files

Create these files manually:

```bash
cd apps/your_app_name

# Create additional files
touch serializers.py
touch urls.py
touch permissions.py      # If needed
touch services.py         # If needed

# Create migrations directory if not present
mkdir migrations
touch migrations/__init__.py
```

Final structure:

```
apps/your_app_name/
├── __init__.py
├── admin.py
├── apps.py
├── models.py
├── serializers.py        # ✅ Added
├── views.py
├── urls.py               # ✅ Added
├── permissions.py        # ✅ Added (optional)
├── services.py           # ✅ Added (optional)
├── tests.py
└── migrations/
    └── __init__.py
```

---

## Step 2: Define Models

### Basic Model Template

```python
# apps/your_app_name/models.py

from django.db import models
from django.utils import timezone
from apps.account.models import User

class YourModel(models.Model):
    """
    Brief description of what this model represents.
    
    Example: Client model - stores customer information including
    contact details and preferences.
    """
    
    # ========================================
    # PRIMARY FIELDS
    # ========================================
    name = models.CharField(
        max_length=200,
        help_text="Full name of the entity"
    )
    
    description = models.TextField(
        blank=True,
        help_text="Optional description"
    )
    
    email = models.EmailField(
        unique=True,
        help_text="Primary email address"
    )
    
    phone = models.CharField(
        max_length=20,
        blank=True,
        help_text="Contact phone number"
    )
    
    # Status choices
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        INACTIVE = 'inactive', 'Inactive'
        PENDING = 'pending', 'Pending'
    
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE
    )
    
    # ========================================
    # MULTI-TENANCY (REQUIRED)
    # ========================================
    business = models.ForeignKey(
        'business.Business',
        on_delete=models.CASCADE,
        related_name='%(class)s_set',
        help_text="Business this record belongs to"
    )
    
    # Optional: Location-level filtering
    location = models.ForeignKey(
        'business.BusinessLocation',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='%(class)s_set',
        help_text="Specific location (optional)"
    )
    
    # ========================================
    # RELATIONSHIPS
    # ========================================
    # Example: Foreign key to another model
    related_model = models.ForeignKey(
        'otherapp.OtherModel',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_set'
    )
    
    # Example: Many-to-many relationship
    tags = models.ManyToManyField(
        'Tag',
        blank=True,
        related_name='%(class)s_set'
    )
    
    # ========================================
    # AUDIT FIELDS (RECOMMENDED)
    # ========================================
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when record was created"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when record was last updated"
    )
    
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_%(class)s_set',
        help_text="User who created this record"
    )
    
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='updated_%(class)s_set',
        help_text="User who last updated this record"
    )
    
    # ========================================
    # SOFT DELETE (RECOMMENDED)
    # ========================================
    is_deleted = models.BooleanField(
        default=False,
        help_text="Soft delete flag"
    )
    
    deleted_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Timestamp when record was deleted"
    )
    
    deleted_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='deleted_%(class)s_set',
        help_text="User who deleted this record"
    )
    
    # ========================================
    # META OPTIONS
    # ========================================
    class Meta:
        db_table = 'your_table_name'
        verbose_name = 'Your Model'
        verbose_name_plural = 'Your Models'
        ordering = ['-created_at']
        
        # IMPORTANT: Indexes for performance
        indexes = [
            models.Index(fields=['business', 'is_deleted']),
            models.Index(fields=['status']),
            models.Index(fields=['email']),
            models.Index(fields=['created_at']),
        ]
        
        # Unique constraints
        constraints = [
            models.UniqueConstraint(
                fields=['business', 'email'],
                condition=models.Q(is_deleted=False),
                name='unique_email_per_business'
            )
        ]
    
    # ========================================
    # STRING REPRESENTATION
    # ========================================
    def __str__(self):
        return f"{self.name} ({self.business.name})"
    
    # ========================================
    # CUSTOM METHODS
    # ========================================
    def get_full_details(self):
        """Return full details of the record"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'status': self.get_status_display()
        }
    
    def soft_delete(self, user):
        """Soft delete this record"""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.deleted_by = user
        self.save(update_fields=['is_deleted', 'deleted_at', 'deleted_by'])
    
    def restore(self):
        """Restore soft-deleted record"""
        self.is_deleted = False
        self.deleted_at = None
        self.deleted_by = None
        self.save(update_fields=['is_deleted', 'deleted_at', 'deleted_by'])
```

### Model Best Practices

1. **Always include multi-tenancy**: Add `business` foreign key
2. **Use audit fields**: Track who created/updated records
3. **Implement soft delete**: Don't hard delete data
4. **Add indexes**: For frequently queried fields
5. **Document everything**: Use docstrings and help_text
6. **Use choices for enums**: Define choices as inner classes
7. **Follow naming conventions**: Clear, descriptive names

---

## Step 3: Create Serializers

```python
# apps/your_app_name/serializers.py

from rest_framework import serializers
from django.core.exceptions import ValidationError
from .models import YourModel

class YourModelSerializer(serializers.ModelSerializer):
    """
    Full serializer for YourModel with all fields.
    Used for detail views and create/update operations.
    """
    
    # ========================================
    # READ-ONLY COMPUTED FIELDS
    # ========================================
    business_name = serializers.CharField(
        source='business.name',
        read_only=True
    )
    
    location_name = serializers.CharField(
        source='location.name',
        read_only=True
    )
    
    created_by_name = serializers.CharField(
        source='created_by.name',
        read_only=True
    )
    
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    
    # Custom computed field
    full_info = serializers.SerializerMethodField()
    
    # ========================================
    # META CONFIGURATION
    # ========================================
    class Meta:
        model = YourModel
        fields = [
            # Primary fields
            'id', 'name', 'description', 'email', 'phone', 'status',
            
            # Relationships
            'business', 'business_name',
            'location', 'location_name',
            'related_model', 'tags',
            
            # Audit fields
            'created_at', 'updated_at',
            'created_by', 'created_by_name',
            'updated_by',
            
            # Soft delete
            'is_deleted', 'deleted_at', 'deleted_by',
            
            # Computed fields
            'status_display', 'full_info'
        ]
        
        # Fields that cannot be modified
        read_only_fields = [
            'id', 'created_at', 'updated_at',
            'created_by', 'updated_by',
            'is_deleted', 'deleted_at', 'deleted_by',
            'business',  # Set automatically by viewset
        ]
        
        # Extra validation kwargs
        extra_kwargs = {
            'email': {
                'required': True,
                'allow_blank': False
            },
            'name': {
                'required': True,
                'max_length': 200
            }
        }
    
    # ========================================
    # COMPUTED FIELDS
    # ========================================
    def get_full_info(self, obj):
        """Return full formatted information"""
        return f"{obj.name} - {obj.email}"
    
    # ========================================
    # FIELD VALIDATION
    # ========================================
    def validate_email(self, value):
        """Validate email is unique within business"""
        # Get business from context (set by viewset)
        business = self.context.get('request').user.business
        
        # Check if email exists in same business (excluding current instance)
        queryset = YourModel.objects.filter(
            business=business,
            email=value,
            is_deleted=False
        )
        
        # Exclude current instance on update
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        
        if queryset.exists():
            raise serializers.ValidationError(
                "A record with this email already exists in your business."
            )
        
        return value.lower()  # Normalize to lowercase
    
    def validate_phone(self, value):
        """Validate phone number format"""
        # Add your phone validation logic
        if value and not value.replace('+', '').replace('-', '').replace(' ', '').isdigit():
            raise serializers.ValidationError("Invalid phone number format")
        return value
    
    # ========================================
    # OBJECT-LEVEL VALIDATION
    # ========================================
    def validate(self, attrs):
        """Cross-field validation"""
        # Example: Ensure certain fields are set together
        if attrs.get('status') == YourModel.Status.ACTIVE:
            if not attrs.get('email'):
                raise serializers.ValidationError({
                    'email': 'Email is required for active records'
                })
        
        return attrs
    
    # ========================================
    # CUSTOM CREATE/UPDATE
    # ========================================
    def create(self, validated_data):
        """Custom create logic if needed"""
        # Handle many-to-many fields
        tags = validated_data.pop('tags', [])
        
        instance = super().create(validated_data)
        
        if tags:
            instance.tags.set(tags)
        
        return instance
    
    def update(self, instance, validated_data):
        """Custom update logic if needed"""
        # Handle many-to-many fields
        tags = validated_data.pop('tags', None)
        
        instance = super().update(instance, validated_data)
        
        if tags is not None:
            instance.tags.set(tags)
        
        return instance


class YourModelListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for list views.
    Only includes essential fields for performance.
    """
    
    business_name = serializers.CharField(source='business.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = YourModel
        fields = [
            'id', 'name', 'email', 'phone',
            'status', 'status_display',
            'business_name', 'created_at'
        ]


class YourModelMinimalSerializer(serializers.ModelSerializer):
    """
    Minimal serializer for nested representations and dropdowns.
    """
    
    class Meta:
        model = YourModel
        fields = ['id', 'name']
```

---

## Step 4: Build Views

```python
# apps/your_app_name/views.py

from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, OpenApiParameter

from apps.utils.viewsets import StandardResponseMixin
from apps.utils.responses import APIResponse
from .models import YourModel
from .serializers import (
    YourModelSerializer,
    YourModelListSerializer,
    YourModelMinimalSerializer
)
from .permissions import CanManageYourModel  # If you created custom permissions

class YourModelViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    """
    ViewSet for YourModel CRUD operations.
    
    Provides standard REST endpoints:
    - GET    /api/your-models/          - List all records
    - POST   /api/your-models/          - Create new record
    - GET    /api/your-models/{id}/     - Retrieve specific record
    - PUT    /api/your-models/{id}/     - Full update
    - PATCH  /api/your-models/{id}/     - Partial update
    - DELETE /api/your-models/{id}/     - Soft delete record
    
    Features:
    - Automatic business filtering (multi-tenancy)
    - Soft delete support
    - Audit tracking
    - Standard response format: {data, message, meta}
    - Filtering, searching, and ordering
    """
    
    queryset = YourModel.objects.all()
    serializer_class = YourModelSerializer
    permission_classes = [IsAuthenticated]  # or [CanManageYourModel]
    
    # ========================================
    # FILTERING, SEARCHING, ORDERING
    # ========================================
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    
    # Exact match filters
    filterset_fields = {
        'status': ['exact', 'in'],
        'created_at': ['gte', 'lte', 'exact'],
        'location': ['exact'],
    }
    
    # Text search fields
    search_fields = [
        'name',
        'description',
        'email',
        'phone'
    ]
    
    # Sortable fields
    ordering_fields = [
        'created_at',
        'updated_at',
        'name',
        'email',
        'status'
    ]
    
    # Default ordering
    ordering = ['-created_at']
    
    # ========================================
    # CUSTOM MESSAGES
    # ========================================
    list_message = None  # No message for list (optional)
    retrieve_message = None  # No message for retrieve (optional)
    create_message = "Record created successfully"
    update_message = "Record updated successfully"
    delete_message = "Record deleted successfully"
    
    # ========================================
    # SERIALIZER SELECTION
    # ========================================
    def get_serializer_class(self):
        """
        Return appropriate serializer based on action.
        Use lighter serializers for list views for performance.
        """
        if self.action == 'list':
            return YourModelListSerializer
        elif self.action == 'minimal':
            return YourModelMinimalSerializer
        return YourModelSerializer
    
    # ========================================
    # QUERYSET CUSTOMIZATION
    # ========================================
    def get_queryset(self):
        """
        Customize queryset based on request parameters.
        Business filtering is automatic via StandardResponseMixin.
        """
        queryset = super().get_queryset()
        
        # Add select_related for foreign keys (performance)
        queryset = queryset.select_related(
            'business',
            'location',
            'created_by'
        )
        
        # Add prefetch_related for many-to-many (performance)
        queryset = queryset.prefetch_related('tags')
        
        # Custom filtering based on query params
        include_deleted = self.request.query_params.get('include_deleted', 'false')
        if include_deleted.lower() != 'true':
            queryset = queryset.filter(is_deleted=False)
        
        return queryset
    
    # ========================================
    # CUSTOM ACTIONS
    # ========================================
    
    @extend_schema(
        summary="Restore soft-deleted record",
        description="Restore a previously deleted record",
        responses={200: YourModelSerializer}
    )
    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        """
        Restore soft-deleted record.
        
        POST /api/your-models/{id}/restore/
        """
        instance = self.get_object()
        
        if not instance.is_deleted:
            return APIResponse.error(
                message="Record is not deleted",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        instance.restore()
        serializer = self.get_serializer(instance)
        
        return APIResponse.success(
            data=serializer.data,
            message="Record restored successfully"
        )
    
    @extend_schema(
        summary="Get deleted records",
        description="List all soft-deleted records",
        responses={200: YourModelListSerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def deleted(self, request):
        """
        List soft-deleted records.
        
        GET /api/your-models/deleted/
        """
        queryset = self.get_queryset().filter(is_deleted=True)
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return APIResponse.success(
            data=serializer.data,
            message="Deleted records retrieved"
        )
    
    @extend_schema(
        summary="Bulk delete records",
        description="Soft delete multiple records at once",
        request={'application/json': {'type': 'object', 'properties': {'ids': {'type': 'array', 'items': {'type': 'integer'}}}}},
        responses={200: {'type': 'object'}}
    )
    @action(detail=False, methods=['post'])
    def bulk_delete(self, request):
        """
        Bulk delete records.
        
        POST /api/your-models/bulk_delete/
        Body: {"ids": [1, 2, 3]}
        """
        ids = request.data.get('ids', [])
        
        if not ids:
            return APIResponse.error(
                message="No IDs provided",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Get records (automatically filtered by business)
        queryset = self.get_queryset().filter(id__in=ids, is_deleted=False)
        count = queryset.count()
        
        # Soft delete
        from django.utils import timezone
        queryset.update(
            is_deleted=True,
            deleted_at=timezone.now(),
            deleted_by=request.user
        )
        
        return APIResponse.success(
            data={'deleted_count': count},
            message=f"{count} record(s) deleted successfully"
        )
    
    @extend_schema(
        summary="Get minimal list for dropdowns",
        description="Get lightweight list of records for use in dropdowns",
        responses={200: YourModelMinimalSerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def minimal(self, request):
        """
        Get minimal list for dropdowns/select fields.
        
        GET /api/your-models/minimal/
        """
        queryset = self.get_queryset().filter(
            is_deleted=False,
            status=YourModel.Status.ACTIVE
        )
        serializer = YourModelMinimalSerializer(queryset, many=True)
        
        return APIResponse.success(
            data=serializer.data,
            message=None  # No message needed for utility endpoints
        )
    
    @extend_schema(
        summary="Export to CSV",
        description="Export records to CSV file",
        parameters=[
            OpenApiParameter('format', str, description='Export format (csv, xlsx)', required=False)
        ]
    )
    @action(detail=False, methods=['get'])
    def export(self, request):
        """
        Export records to CSV.
        
        GET /api/your-models/export/?format=csv
        """
        import csv
        from django.http import HttpResponse
        
        queryset = self.get_queryset().filter(is_deleted=False)
        
        # Create CSV response
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="your_models.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['ID', 'Name', 'Email', 'Phone', 'Status', 'Created At'])
        
        for obj in queryset:
            writer.writerow([
                obj.id,
                obj.name,
                obj.email,
                obj.phone,
                obj.get_status_display(),
                obj.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        return response
```

### Alternative: Simple APIView

If you don't need full CRUD, use APIView:

```python
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from apps.utils.responses import APIResponse

class YourCustomView(APIView):
    """
    Custom view for specific operation.
    """
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Handle GET request"""
        # Your logic here
        data = {'message': 'Hello'}
        return APIResponse.success(data=data)
    
    def post(self, request):
        """Handle POST request"""
        # Your logic here
        return APIResponse.created(
            data=request.data,
            message="Created successfully"
        )
```

---

## Step 5: Configure URLs

```python
# apps/your_app_name/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import YourModelViewSet, YourCustomView

# ========================================
# ROUTER FOR VIEWSETS (RECOMMENDED)
# ========================================
router = DefaultRouter()
router.register(r'your-models', YourModelViewSet, basename='yourmodel')

# ========================================
# URL PATTERNS
# ========================================
urlpatterns = [
    # ViewSet routes (CRUD + custom actions)
    path('', include(router.urls)),
    
    # Custom non-ViewSet routes (if needed)
    # path('custom/', YourCustomView.as_view(), name='custom-view'),
]

# Generated URLs from router:
# GET    /api/your-models/              → list
# POST   /api/your-models/              → create
# GET    /api/your-models/{id}/         → retrieve
# PUT    /api/your-models/{id}/         → update
# PATCH  /api/your-models/{id}/         → partial_update
# DELETE /api/your-models/{id}/         → destroy
# POST   /api/your-models/{id}/restore/ → custom action
# GET    /api/your-models/deleted/      → custom action
# POST   /api/your-models/bulk_delete/  → custom action
```

### Register URLs in Core

```python
# backend/core/urls.py

from django.urls import path, include

urlpatterns = [
    # ... existing patterns ...
    
    # Add your app's URLs
    path('api/your-app/', include('apps.your_app_name.urls')),
]
```

---

## Step 6: Setup Admin

```python
# apps/your_app_name/admin.py

from django.contrib import admin
from django.utils.html import format_html
from .models import YourModel

@admin.register(YourModel)
class YourModelAdmin(admin.ModelAdmin):
    """
    Django admin interface for YourModel.
    """
    
    # ========================================
    # LIST VIEW
    # ========================================
    list_display = [
        'id',
        'name',
        'email',
        'phone',
        'status_badge',
        'business',
        'created_at',
        'is_deleted_badge'
    ]
    
    list_filter = [
        'status',
        'business',
        'location',
        'is_deleted',
        'created_at',
        'updated_at'
    ]
    
    search_fields = [
        'name',
        'email',
        'phone',
        'description'
    ]
    
    list_per_page = 25
    
    # ========================================
    # FORM VIEW
    # ========================================
    readonly_fields = [
        'created_at',
        'updated_at',
        'created_by',
        'updated_by',
        'deleted_at',
        'deleted_by'
    ]
    
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'name',
                'description',
                'email',
                'phone',
                'status'
            )
        }),
        ('Business & Location', {
            'fields': (
                'business',
                'location'
            )
        }),
        ('Relationships', {
            'fields': (
                'related_model',
                'tags'
            ),
            'classes': ('collapse',)  # Collapsed by default
        }),
        ('Audit Information', {
            'fields': (
                'created_at',
                'created_by',
                'updated_at',
                'updated_by'
            ),
            'classes': ('collapse',)
        }),
        ('Deletion', {
            'fields': (
                'is_deleted',
                'deleted_at',
                'deleted_by'
            ),
            'classes': ('collapse',)
        })
    )
    
    # ========================================
    # FILTERS & ACTIONS
    # ========================================
    actions = [
        'mark_as_active',
        'mark_as_inactive',
        'soft_delete_selected',
        'restore_selected'
    ]
    
    def mark_as_active(self, request, queryset):
        """Mark selected records as active"""
        updated = queryset.update(status=YourModel.Status.ACTIVE)
        self.message_user(request, f"{updated} record(s) marked as active.")
    mark_as_active.short_description = "Mark selected as active"
    
    def mark_as_inactive(self, request, queryset):
        """Mark selected records as inactive"""
        updated = queryset.update(status=YourModel.Status.INACTIVE)
        self.message_user(request, f"{updated} record(s) marked as inactive.")
    mark_as_inactive.short_description = "Mark selected as inactive"
    
    def soft_delete_selected(self, request, queryset):
        """Soft delete selected records"""
        from django.utils import timezone
        updated = queryset.update(
            is_deleted=True,
            deleted_at=timezone.now(),
            deleted_by=request.user
        )
        self.message_user(request, f"{updated} record(s) deleted.")
    soft_delete_selected.short_description = "Soft delete selected"
    
    def restore_selected(self, request, queryset):
        """Restore soft-deleted records"""
        updated = queryset.update(
            is_deleted=False,
            deleted_at=None,
            deleted_by=None
        )
        self.message_user(request, f"{updated} record(s) restored.")
    restore_selected.short_description = "Restore selected"
    
    # ========================================
    # CUSTOM DISPLAY METHODS
    # ========================================
    def status_badge(self, obj):
        """Display status as colored badge"""
        colors = {
            'active': 'green',
            'inactive': 'gray',
            'pending': 'orange'
        }
        color = colors.get(obj.status, 'blue')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def is_deleted_badge(self, obj):
        """Display deletion status as badge"""
        if obj.is_deleted:
            return format_html(
                '<span style="background-color: red; color: white; padding: 3px 10px; border-radius: 3px;">Deleted</span>'
            )
        return format_html(
            '<span style="background-color: green; color: white; padding: 3px 10px; border-radius: 3px;">Active</span>'
        )
    is_deleted_badge.short_description = 'Record Status'
    
    # ========================================
    # QUERY OPTIMIZATION
    # ========================================
    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        queryset = super().get_queryset(request)
        return queryset.select_related(
            'business',
            'location',
            'created_by',
            'updated_by',
            'deleted_by'
        )
```

---

## Step 7: Add Permissions

```python
# apps/your_app_name/permissions.py

from rest_framework.permissions import BasePermission
from apps.account.models import RoleOptions

class CanManageYourModel(BasePermission):
    """
    Custom permission for YourModel management.
    
    Rules:
    - List/Retrieve: All authenticated users
    - Create/Update/Delete: Managers and Admins only
    """
    
    def has_permission(self, request, view):
        """Check if user has permission to perform action"""
        
        # Must be authenticated
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Must have a business
        if not request.user.business:
            return False
        
        # Read permissions (GET) for all authenticated users
        if view.action in ['list', 'retrieve', 'minimal']:
            return True
        
        # Write permissions (POST, PUT, PATCH, DELETE) only for managers/admins
        if view.action in ['create', 'update', 'partial_update', 'destroy']:
            return request.user.role in [RoleOptions.ADMIN, RoleOptions.MANAGER]
        
        # Custom actions - define as needed
        if view.action in ['restore', 'bulk_delete']:
            return request.user.role in [RoleOptions.ADMIN, RoleOptions.MANAGER]
        
        # Default: allow
        return True
    
    def has_object_permission(self, request, view, obj):
        """Check if user has permission to access specific object"""
        
        # Must belong to same business
        if hasattr(obj, 'business'):
            if obj.business != request.user.business:
                return False
        
        # Read permissions for all
        if view.action in ['retrieve']:
            return True
        
        # Write permissions for managers/admins
        return request.user.role in [RoleOptions.ADMIN, RoleOptions.MANAGER]


class IsAdminOrReadOnly(BasePermission):
    """
    Simpler permission: Admins can do anything, others can only read.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Read permissions for all
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        
        # Write permissions only for admins
        return request.user.role == RoleOptions.ADMIN
```

---

## Step 8: Register App

### 1. Add to INSTALLED_APPS

```python
# backend/core/settings.py

INSTALLED_APPS = [
    # ... existing apps ...
    
    # Your new app
    'apps.your_app_name',
]
```

### 2. Register URLs

```python
# backend/core/urls.py

from django.urls import path, include

urlpatterns = [
    # ... existing patterns ...
    
    # Your app URLs
    path('api/your-app/', include('apps.your_app_name.urls')),
]
```

### 3. Create Migrations

```bash
# Create migration files
python manage.py makemigrations your_app_name

# Apply migrations
python manage.py migrate your_app_name
```

### 4. Verify Installation

```bash
# Check if app is registered
python manage.py showmigrations your_app_name

# Test API endpoint
python manage.py runserver
# Visit: http://localhost:8000/api/your-app/your-models/
```

---

## Step 9: Test Your App

### Create Basic Tests

```python
# apps/your_app_name/tests.py

from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from apps.business.models import Business
from .models import YourModel

User = get_user_model()

class YourModelTestCase(APITestCase):
    """Test suite for YourModel"""
    
    def setUp(self):
        """Set up test data"""
        # Create business
        self.business = Business.objects.create(
            name="Test Business",
            email="test@business.com"
        )
        
        # Create user
        self.user = User.objects.create_user(
            email="test@example.com",
            name="Test User",
            password="testpass123"
        )
        self.user.primary_business = self.business
        self.user.save()
        self.user.businesses.add(self.business)
        
        # Authenticate
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        # Create test record
        self.test_record = YourModel.objects.create(
            name="Test Record",
            email="test@record.com",
            business=self.business,
            created_by=self.user
        )
    
    def test_list_records(self):
        """Test listing records"""
        url = '/api/your-app/your-models/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)
        self.assertTrue(len(response.data['data']) > 0)
    
    def test_create_record(self):
        """Test creating a new record"""
        url = '/api/your-app/your-models/'
        data = {
            'name': 'New Record',
            'email': 'new@record.com',
            'phone': '+1234567890'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('data', response.data)
        self.assertEqual(response.data['data']['name'], 'New Record')
    
    def test_retrieve_record(self):
        """Test retrieving a specific record"""
        url = f'/api/your-app/your-models/{self.test_record.id}/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['id'], self.test_record.id)
    
    def test_update_record(self):
        """Test updating a record"""
        url = f'/api/your-app/your-models/{self.test_record.id}/'
        data = {'name': 'Updated Name'}
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['name'], 'Updated Name')
    
    def test_delete_record(self):
        """Test soft deleting a record"""
        url = f'/api/your-app/your-models/{self.test_record.id}/'
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify soft delete
        self.test_record.refresh_from_db()
        self.assertTrue(self.test_record.is_deleted)
    
    def test_business_isolation(self):
        """Test that users can only access their business's data"""
        # Create another business
        other_business = Business.objects.create(
            name="Other Business",
            email="other@business.com"
        )
        
        # Create record in other business
        other_record = YourModel.objects.create(
            name="Other Record",
            email="other@record.com",
            business=other_business
        )
        
        # Try to access other business's record
        url = f'/api/your-app/your-models/{other_record.id}/'
        response = self.client.get(url)
        
        # Should get 404 (filtered out by business isolation)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

### Run Tests

```bash
# Run all tests
python manage.py test

# Run tests for specific app
python manage.py test apps.your_app_name

# Run with verbose output
python manage.py test apps.your_app_name --verbosity=2

# Run specific test class
python manage.py test apps.your_app_name.tests.YourModelTestCase

# Run specific test method
python manage.py test apps.your_app_name.tests.YourModelTestCase.test_create_record
```

---

## Step 10: API Documentation

### Add OpenAPI Schema Decorators

```python
from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiParameter,
    OpenApiExample,
    OpenApiResponse
)

@extend_schema_view(
    list=extend_schema(
        summary="List all records",
        description="Get paginated list of records filtered by business",
        parameters=[
            OpenApiParameter(
                name='search',
                description='Search in name, email, phone',
                required=False,
                type=str
            ),
            OpenApiParameter(
                name='status',
                description='Filter by status',
                required=False,
                type=str,
                enum=['active', 'inactive', 'pending']
            ),
        ],
        responses={200: YourModelListSerializer(many=True)}
    ),
    create=extend_schema(
        summary="Create new record",
        description="Create a new record in your business",
        request=YourModelSerializer,
        responses={
            201: YourModelSerializer,
            400: OpenApiResponse(description="Validation error")
        },
        examples=[
            OpenApiExample(
                'Create Record',
                value={
                    'name': 'John Doe',
                    'email': 'john@example.com',
                    'phone': '+1234567890',
                    'status': 'active'
                }
            )
        ]
    ),
    retrieve=extend_schema(
        summary="Get record details",
        description="Retrieve detailed information about a specific record",
        responses={
            200: YourModelSerializer,
            404: OpenApiResponse(description="Record not found")
        }
    ),
    update=extend_schema(
        summary="Update record",
        description="Update all fields of a record",
        request=YourModelSerializer,
        responses={
            200: YourModelSerializer,
            400: OpenApiResponse(description="Validation error"),
            404: OpenApiResponse(description="Record not found")
        }
    ),
    partial_update=extend_schema(
        summary="Partial update",
        description="Update specific fields of a record",
        request=YourModelSerializer,
        responses={
            200: YourModelSerializer,
            400: OpenApiResponse(description="Validation error"),
            404: OpenApiResponse(description="Record not found")
        }
    ),
    destroy=extend_schema(
        summary="Delete record",
        description="Soft delete a record",
        responses={
            200: OpenApiResponse(description="Record deleted successfully"),
            404: OpenApiResponse(description="Record not found")
        }
    )
)
class YourModelViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    # ... viewset code ...
```

### Test API Documentation

```bash
# Start server
python manage.py runserver

# View documentation:
# Swagger UI: http://localhost:8000/api/docs/
# ReDoc: http://localhost:8000/api/redoc/
# Schema JSON: http://localhost:8000/api/schema/
```

---

## Step 11: Example - Complete App

Here's a complete minimal app example:

### Models

```python
# apps/tasks/models.py
from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    
    # Multi-tenancy
    business = models.ForeignKey(
        'business.Business',
        on_delete=models.CASCADE,
        related_name='tasks'
    )
    
    # Audit
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        'account.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_tasks'
    )
    
    # Soft delete
    is_deleted = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'tasks'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
```

### Serializers

```python
# apps/tasks/serializers.py
from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'completed', 'created_at']
        read_only_fields = ['id', 'created_at']
```

### Views

```python
# apps/tasks/views.py
from rest_framework import viewsets
from apps.utils.viewsets import StandardResponseMixin
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    create_message = "Task created"
    update_message = "Task updated"
    delete_message = "Task deleted"
```

### URLs

```python
# apps/tasks/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
]
```

### Admin

```python
# apps/tasks/admin.py
from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'completed', 'business', 'created_at']
    list_filter = ['completed', 'business', 'created_at']
    search_fields = ['title', 'description']
```

### Register

```python
# core/settings.py - Add to INSTALLED_APPS
'apps.tasks',

# core/urls.py - Add URL pattern
path('api/tasks/', include('apps.tasks.urls')),
```

### Migrate

```bash
python manage.py makemigrations tasks
python manage.py migrate tasks
```

**Done! Your app is ready.**

---

## Best Practices Summary

✅ **DO**:
- Follow the standard app structure
- Use `StandardResponseMixin` for consistent responses
- Implement multi-tenancy (business field)
- Add audit fields (created_by, updated_by)
- Use soft delete (is_deleted field)
- Add proper indexes to models
- Write comprehensive tests
- Document your API with OpenAPI decorators
- Use meaningful variable names
- Add docstrings to classes and methods

❌ **DON'T**:
- Hard delete data (use soft delete)
- Skip business filtering (security risk!)
- Forget to add migrations
- Leave out audit trails
- Skip testing
- Ignore performance (N+1 queries)
- Use inconsistent response formats
- Hardcode values (use settings/environment variables)

---

## Troubleshooting

### Common Issues

**Issue: "No such table" error**
```bash
# Solution: Run migrations
python manage.py makemigrations
python manage.py migrate
```

**Issue: "Permission denied" on API**
```python
# Solution: Check permission classes
permission_classes = [IsAuthenticated]  # Not AllowAny
```

**Issue: "Business filtering not working"**
```python
# Solution: Use StandardResponseMixin or BusinessFilterMixin
class MyViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    # Business filtering automatic
```

**Issue: "Can't access other business's data"**
```
# This is correct behavior! Multi-tenancy working as intended.
# Each business should only see their own data.
```

---

## Next Steps

1. **Review existing apps**: Look at `apps/clients`, `apps/services` for examples
2. **Read API documentation**: http://localhost:8000/api/docs/
3. **Write comprehensive tests**: Ensure your app works correctly
4. **Optimize queries**: Use `select_related` and `prefetch_related`
5. **Add caching**: For frequently accessed data
6. **Monitor performance**: Use Django Debug Toolbar

---

**Happy coding! 🚀**

