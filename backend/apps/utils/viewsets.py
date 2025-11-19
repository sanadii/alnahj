"""
Standard ViewSet Mixins - REVISED
==================================

Provides consistent behavior across all ViewSets with {data, message} wrapper.
"""

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from django.db import transaction

from .responses import APIResponse


class StandardResponseMixin:
    """
    Mixin that overrides standard DRF CRUD methods to use consistent response format.
    
    All responses use: {data, message, meta?}
    
    Features:
    - Consistent {data, message} wrapper
    - Transaction handling
    - User-friendly messages
    - Automatic created_by/updated_by tracking
    
    Usage:
        class MyViewSet(StandardResponseMixin, viewsets.ModelViewSet):
            queryset = MyModel.objects.all()
            serializer_class = MySerializer
    """
    
    permission_classes = [IsAuthenticated]
    
    # Customize these messages in your ViewSet
    list_message = None  # None = no message
    retrieve_message = None
    create_message = "Created successfully"
    update_message = "Updated successfully"
    delete_message = "Deleted successfully"
    
    def get_queryset(self):
        """
        Get base queryset. Override this method to add filtering logic.
        """
        queryset = super().get_queryset()
        return queryset
    
    def perform_create(self, serializer):
        """
        Auto-set created_by on creation. Override this method to add custom logic.
        """
        save_kwargs = {}
        
        # Set created_by if model has it
        if hasattr(serializer.Meta.model, 'created_by'):
            save_kwargs['created_by'] = self.request.user
        
        serializer.save(**save_kwargs)
    
    def perform_update(self, serializer):
        """
        Update with optional updated_by tracking.
        Override this method to add custom logic.
        """
        save_kwargs = {}
        
        # Set updated_by if model has it
        if hasattr(serializer.Meta.model, 'updated_by'):
            save_kwargs['updated_by'] = self.request.user
        
        serializer.save(**save_kwargs)
    
    def perform_destroy(self, instance):
        """
        Soft delete if model supports it, otherwise hard delete.
        Override this method to add custom logic.
        """
        # Check if model has soft delete capability
        if hasattr(instance, 'deleted') and hasattr(instance, 'deleted_at'):
            # Soft delete
            instance.deleted = True
            from django.utils import timezone
            instance.deleted_at = timezone.now()
            
            if hasattr(instance, 'deleted_by'):
                instance.deleted_by = self.request.user
            
            instance.save()
        else:
            # Hard delete
            instance.delete()
    
    def list(self, request, *args, **kwargs):
        """
        List response with consistent {data: [...], message?, meta?} format
        """
        queryset = self.filter_queryset(self.get_queryset())
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            # Use paginator's response but wrap in our format
            paginated_data = self.get_paginated_response(serializer.data).data
            
            return APIResponse.success(
                data=serializer.data,
                message=self.list_message,
                meta={
                    "pagination": {
                        "count": paginated_data.get('count'),
                        "next": paginated_data.get('next'),
                        "previous": paginated_data.get('previous')
                    }
                }
            )
        
        serializer = self.get_serializer(queryset, many=True)
        return APIResponse.success(
            data=serializer.data,
            message=self.list_message
        )
    
    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve response with consistent {data: {...}, message?} format
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return APIResponse.success(
            data=serializer.data,
            message=self.retrieve_message
        )
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """
        Create response with consistent {data: {...}, message} format
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return APIResponse.created(
            data=serializer.data,
            message=self.create_message
        )
    
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        """
        Update response with consistent {data: {...}, message} format
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
        
        return APIResponse.updated(
            data=serializer.data,
            message=self.update_message
        )
    
    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        """
        Delete response with consistent {data: null, message} format
        """
        instance = self.get_object()
        self.perform_destroy(instance)
        
        return APIResponse.deleted(
            message=self.delete_message
        )


class ReadOnlyStandardResponseMixin(StandardResponseMixin):
    """
    Read-only version of StandardResponseMixin.
    Only provides list and retrieve actions with consistent responses.
    """
    
    http_method_names = ['get', 'head', 'options']
