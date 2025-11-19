"""
Utility Mixins for Django REST Framework Views

These mixins provide common functionality across multiple views.
"""

from rest_framework.exceptions import PermissionDenied
from django.core.exceptions import ImproperlyConfigured


class SoftDeleteMixin:
    """
    Mixin to implement soft delete functionality.
    
    Instead of deleting records, marks them as deleted by setting
    is_deleted=True and deleted_at timestamp.
    
    Usage:
        class MyViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
            queryset = MyModel.objects.all()
            serializer_class = MySerializer
    
    Requirements:
        - Model must have 'is_deleted' BooleanField
        - Model should have 'deleted_at' DateTimeField (optional)
        - Model should have 'deleted_by' ForeignKey to User (optional)
    """
    
    def get_queryset(self):
        """
        Exclude soft-deleted records by default.
        """
        queryset = super().get_queryset()
        
        # Only filter if model has is_deleted field
        model = queryset.model
        if hasattr(model, 'is_deleted'):
            # Allow viewing deleted records with query param ?show_deleted=true
            show_deleted = self.request.query_params.get('show_deleted', 'false').lower() == 'true'
            if not show_deleted:
                queryset = queryset.filter(is_deleted=False)
        
        return queryset
    
    def perform_destroy(self, instance):
        """
        Soft delete instead of hard delete.
        """
        from django.utils import timezone
        
        if hasattr(instance, 'is_deleted'):
            # Soft delete
            instance.is_deleted = True
            
            if hasattr(instance, 'deleted_at'):
                instance.deleted_at = timezone.now()
            
            if hasattr(instance, 'deleted_by') and self.request.user:
                instance.deleted_by = self.request.user
            
            instance.save()
        else:
            # Hard delete if model doesn't support soft delete
            instance.delete()


class AuditMixin:
    """
    Mixin to automatically track created_by and updated_by.
    
    Usage:
        class MyViewSet(AuditMixin, viewsets.ModelViewSet):
            queryset = MyModel.objects.all()
            serializer_class = MySerializer
    
    Requirements:
        - Model should have 'created_by' ForeignKey to User (optional)
        - Model should have 'updated_by' ForeignKey to User (optional)
    """
    
    def perform_create(self, serializer):
        """
        Set created_by on create.
        """
        save_kwargs = {}
        
        if hasattr(serializer.Meta.model, 'created_by') and self.request.user:
            save_kwargs['created_by'] = self.request.user
        
        serializer.save(**save_kwargs)
    
    def perform_update(self, serializer):
        """
        Set updated_by on update.
        """
        save_kwargs = {}
        
        if hasattr(serializer.Meta.model, 'updated_by') and self.request.user:
            save_kwargs['updated_by'] = self.request.user
        
        serializer.save(**save_kwargs)
