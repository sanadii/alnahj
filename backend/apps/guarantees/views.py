"""
Views for guarantee management.
"""
import csv
import logging

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Q
from django.utils import timezone
from django.http import HttpResponse

from .models import GuaranteeGroup, Guarantee, GuaranteeNote, GuaranteeHistory
from .serializers import (
    GuaranteeGroupSerializer,
    GuaranteeSerializer,
    GuaranteeListSerializer,
    GuaranteeCreateSerializer,
    GuaranteeUpdateSerializer,
    GuaranteeQuickUpdateSerializer,
    GuaranteeBulkUpdateSerializer,
    GuaranteeNoteSerializer,
    GuaranteeNoteCreateSerializer,
    GuaranteeHistorySerializer,
    GuaranteeStatisticsSerializer,
    TeamStatisticsSerializer,
    GuaranteeConfirmSerializer,
    GuaranteeBulkConfirmSerializer,
)
from apps.utils.permissions import IsSupervisorOrAbove, IsAdminOrAbove
from apps.utils.viewsets import StandardResponseMixin


logger = logging.getLogger(__name__)


class GuaranteeGroupViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    """
    Guarantee Group management.
    
    Endpoints:
    - GET    /api/guarantees/groups/         - List user's groups
    - POST   /api/guarantees/groups/         - Create group
    - GET    /api/guarantees/groups/{id}/    - Get group
    - PUT    /api/guarantees/groups/{id}/    - Update group
    - DELETE /api/guarantees/groups/{id}/    - Delete group
    - PATCH  /api/guarantees/groups/{id}/reorder/ - Change order
    """
    
    serializer_class = GuaranteeGroupSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['order', 'name', 'created_at']
    ordering = ['order', 'name']
    
    def get_queryset(self):
        """Only return user's own groups."""
        return GuaranteeGroup.objects.filter(
            user=self.request.user
        ).annotate(
            annotated_guarantee_count=Count('guarantees')
        )
    
    def perform_create(self, serializer):
        """Set user to current user."""
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['patch'])
    def reorder(self, request, pk=None):
        """
        Change group order.
        
        PATCH /api/guarantees/groups/{id}/reorder/
        Body: {new_order: 5}
        """
        group = self.get_object()
        from apps.utils.responses import APIResponse
        new_order = request.data.get('new_order')
        
        if new_order is None:
            return APIResponse.error(
                message='new_order is required',
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            new_order = int(new_order)
        except ValueError:
            return APIResponse.error(
                message='new_order must be an integer',
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        group.order = new_order
        group.save(update_fields=['order'])
        
        serializer = self.get_serializer(group)
        return APIResponse.success(data=serializer.data, message='Group reordered successfully')


class GuaranteeViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    """
    Guarantee CRUD operations.
    
    Endpoints:
    - GET    /api/guarantees/                      - List user's guarantees
    - POST   /api/guarantees/                      - Create guarantee
    - GET    /api/guarantees/{id}/                 - Get guarantee details
    - PUT    /api/guarantees/{id}/                 - Update guarantee
    - DELETE /api/guarantees/{id}/                 - Delete guarantee
    - PATCH  /api/guarantees/{id}/quick-update/    - Quick status update
    - POST   /api/guarantees/bulk-update/          - Bulk update
    - GET    /api/guarantees/statistics/           - Get statistics
    - GET    /api/guarantees/{id}/history/         - Get history
    - POST   /api/guarantees/{id}/add-note/        - Add note
    - GET    /api/guarantees/{id}/notes/           - List notes
    - GET    /api/guarantees/search-elector/       - Search elector to add
    """
    
    permission_classes = [IsAuthenticated]
    
    # Filtering & Search
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_fields = ['guarantee_status', 'group', 'confirmation_status']
    search_fields = [
        'elector__koc_id',
        'elector__name_first',
        'elector__family_name',
        'elector__sub_family_name',
        'elector__mobile',
        'quick_note'
    ]
    ordering_fields = ['created_at', 'guarantee_status', 'elector__name_first']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Use appropriate serializer based on action."""
        if self.action == 'list':
            return GuaranteeListSerializer
        elif self.action == 'create':
            return GuaranteeCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return GuaranteeUpdateSerializer
        elif self.action == 'quick_update':
            return GuaranteeQuickUpdateSerializer
        elif self.action == 'bulk_update':
            return GuaranteeBulkUpdateSerializer
        return GuaranteeSerializer
    
    def get_queryset(self):
        """
        Return user's guarantees with optimizations.
        """
        return Guarantee.objects.filter(
            user=self.request.user
        ).select_related(
            'elector',
            'elector__committee',
            'group'
        ).prefetch_related(
            'notes'
        )
    
    def list(self, request, *args, **kwargs):
        """
        List guarantees with statistics and groups in one request.
        
        GET /api/guarantees/?page=1&page_size=10
        
        Returns:
        {
            "data": {
                "guarantees": {
                    "results": [...],
                    "count": 10,
                    "page": 1,
                    "page_size": 10
                },
                "statistics": {...},
                "groups": [...]
            },
            "message": "Success"
        }
        """
        from apps.utils.responses import APIResponse
        
        # Get filtered and paginated guarantees
        queryset = self.filter_queryset(self.get_queryset())
        
        # Get pagination params
        page_num = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 10))
        
        # Apply pagination
        start = (page_num - 1) * page_size
        end = start + page_size
        guarantees_list = queryset[start:end]
        total_count = queryset.count()
        
        # Serialize guarantees
        guarantees_serializer = GuaranteeListSerializer(guarantees_list, many=True)
        
        # Get statistics - use single aggregation query instead of multiple count() calls
        guarantees = self.get_queryset()
        
        # Use single aggregation for all status counts
        from django.db.models import Q
        stats = guarantees.aggregate(
            total=Count('id'),
            pending=Count('id', filter=Q(guarantee_status='PENDING')),
            guaranteed=Count('id', filter=Q(guarantee_status='GUARANTEED')),
            confirmed_count=Count('id', filter=Q(confirmation_status='CONFIRMED')),
            pending_confirmation_count=Count('id', filter=Q(confirmation_status='PENDING')),
            not_available_confirmation_count=Count('id', filter=Q(confirmation_status='NOT_AVAILABLE')),
        )
        
        total = stats['total']
        pending = stats['pending']
        guaranteed = stats['guaranteed']
        confirmed_count = stats['confirmed_count']
        pending_confirmation_count = stats['pending_confirmation_count']
        not_available_confirmation_count = stats['not_available_confirmation_count']
        unconfirmed_count = pending_confirmation_count + not_available_confirmation_count
        
        by_group = list(guarantees.values(
            'group__name',
            'group__color'
        ).annotate(
            count=Count('id')
        ).order_by('-count'))
        
        by_committee = list(guarantees.values(
            'elector__committee__code',
            'elector__committee__name'
        ).annotate(
            count=Count('id')
        ).order_by('-count'))
        
        recent = guarantees.order_by('-created_at')[:5]
        recent_guarantees = GuaranteeListSerializer(recent, many=True).data
        
        top_sections = list(guarantees.values(
            'elector__section'
        ).annotate(
            count=Count('id')
        ).order_by('-count')[:5])
        statistics = {
            'total_guarantees': total,
            'pending_count': pending,
            'guaranteed_count': guaranteed,
            'not_available_count': not_available_confirmation_count,
            'by_group': by_group,
            'by_committee': by_committee,
            'recent_guarantees': recent_guarantees,
            'top_sections': top_sections,
            # Confirmation statistics
            'confirmed_count': confirmed_count,
            'pending_confirmation_count': pending_confirmation_count,
            'not_available_confirmation_count': not_available_confirmation_count,
            'unconfirmed_count': unconfirmed_count,

            'confirmation_rate': round((confirmed_count / total) * 100, 1) if total > 0 else 0
        }
        
        # Get groups
        groups = GuaranteeGroup.objects.filter(
            user=request.user
        ).order_by('order', 'name')
        
        groups_serializer = GuaranteeGroupSerializer(groups, many=True)
        
        # Return combined response following standardized structure
        return APIResponse.success(
            data={
                'guarantees': guarantees_serializer.data,
                'statistics': statistics,
                'groups': groups_serializer.data
            },
            meta={
                'pagination': {
                    'count': total_count,
                    'page': page_num,
                    'page_size': page_size
                }
            },
            message='Guarantees retrieved successfully'
        )
    
    def perform_create(self, serializer):
        """Create guarantee and log action."""
        guarantee = serializer.save(user=self.request.user)
        
        # Log creation
        GuaranteeHistory.log_action(
            guarantee=guarantee,
            user=self.request.user,
            action='CREATED',
            description=f'Created guarantee from {guarantee.elector.full_name}'
        )
    
    @action(detail=True, methods=['get'], url_path='relatives')
    def get_relatives(self, request, pk=None):
        """
        Get family relations of the elector.
        
        Brothers: Share same 2nd, 3rd, 4th names (or family_name if 4th not available)
        Fathers: name_first matches person's 2nd or 3rd name, AND same family_name
        Sons: name_second matches person's name_first, AND same family_name
        Cousins: Share same 3rd, 4th, 5th names (if available, or family_name)
        """
        from apps.utils.responses import APIResponse
        from apps.electors.models import Elector
        from django.db.models import Q
        
        guarantee = self.get_object()
        elector = guarantee.elector
        
        def serialize_elector(e):
            return {
                'kocId': e.koc_id,
                'fullName': e.full_name,
                'mobile': e.mobile,
                'section': e.section,
                'committee': e.committee.name if e.committee else None
            }
        
        # ===== BROTHERS =====
        # Same 2nd, 3rd, 4th names (OR family_name if 4th not available)
        # Optimized: Uses select_related to prevent N+1 queries
        brothers = []
        if elector.name_second and elector.name_third:
            brothers_q = Q(
                name_second=elector.name_second,
                name_third=elector.name_third
            )
            
            # If 4th name exists, match it; otherwise match family_name
            if elector.name_fourth:
                brothers_q &= Q(name_fourth=elector.name_fourth)
            else:
                brothers_q &= Q(family_name=elector.family_name)
            
            brothers_qs = Elector.objects.select_related('committee').filter(brothers_q).exclude(
                koc_id=elector.koc_id
            )[:10]
            
            brothers = [serialize_elector(e) for e in brothers_qs]
        
        # ===== FATHERS =====
        # People whose name_first matches current person's name_second
        # AND whose name_second matches current person's name_third
        # AND must have the SAME family_name
        fathers = []
        if elector.name_second and elector.name_third and elector.family_name:
            fathers_qs = Elector.objects.select_related('committee').filter(
                name_first=elector.name_second,      # Father's given name = person's 2nd name
                name_second=elector.name_third,      # Grandfather's name = person's 3rd name
                family_name=elector.family_name      # ✅ MUST have same family name
            ).exclude(koc_id=elector.koc_id)[:10]
            
            fathers = [serialize_elector(e) for e in fathers_qs]
        
        # ===== SONS =====
        # People whose name_second matches current person's name_first
        # AND must have the SAME family_name
        sons = []
        if elector.name_first and elector.family_name:
            sons_qs = Elector.objects.select_related('committee').filter(
                name_second=elector.name_first,
                family_name=elector.family_name  # ✅ MUST have same family name
            ).exclude(koc_id=elector.koc_id)[:10]
            
            sons = [serialize_elector(e) for e in sons_qs]
        
        # ===== COUSINS =====
        # Same 3rd, 4th, 5th names (if available, or family_name)
        cousins = []
        if elector.name_third and elector.name_fourth:
            cousins_q = Q(
                name_third=elector.name_third,
                name_fourth=elector.name_fourth
            )
            
            # If 5th name exists, match it; otherwise match family_name
            if elector.name_fifth:
                cousins_q &= Q(name_fifth=elector.name_fifth)
            else:
                cousins_q &= Q(family_name=elector.family_name)
            
            cousins_qs = Elector.objects.select_related('committee').filter(cousins_q).exclude(
                koc_id=elector.koc_id
            )
            
            # Exclude brothers (same 2nd name means they're brothers, not cousins)
            if elector.name_second:
                cousins_qs = cousins_qs.exclude(name_second=elector.name_second)
            
            cousins_qs = cousins_qs[:10]
            
            cousins = [serialize_elector(e) for e in cousins_qs]
        
        return APIResponse.success(
            data={
                'brothers': brothers,
                'fathers': fathers,
                'sons': sons,
                'cousins': cousins
            },
            message='Relatives retrieved successfully'
        )
    
    def update(self, request, *args, **kwargs):
        """Update guarantee and return full object."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Use update serializer for validation
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        # Perform update with logging
        self.perform_update(serializer)
        
        # Return full object with GuaranteeListSerializer
        from apps.utils.responses import APIResponse
        updated_instance = self.get_object()  # Refresh from DB
        response_serializer = GuaranteeListSerializer(updated_instance)
        return APIResponse.success(
            data=response_serializer.data,
            message='Guarantee updated successfully'
        )
    
    def perform_update(self, serializer):
        """Update guarantee and log changes."""
        guarantee = self.get_object()
        old_status = guarantee.guarantee_status
        old_group = guarantee.group
        
        updated_guarantee = serializer.save()
        
        # Log status change
        if old_status != updated_guarantee.guarantee_status:
            GuaranteeHistory.log_action(
                guarantee=updated_guarantee,
                user=self.request.user,
                action='STATUS_CHANGED',
                old_value={'guarantee_status': old_status},
                new_value={'guarantee_status': updated_guarantee.guarantee_status},
                description=f'Status changed from {old_status} to {updated_guarantee.guarantee_status}'
            )
        
        # Log group change
        if old_group != updated_guarantee.group:
            old_group_name = old_group.name if old_group else 'None'
            new_group_name = updated_guarantee.group.name if updated_guarantee.group else 'None'
            GuaranteeHistory.log_action(
                guarantee=updated_guarantee,
                user=self.request.user,
                action='GROUP_CHANGED',
                old_value={'group': old_group_name},
                new_value={'group': new_group_name},
                description=f'Group changed from {old_group_name} to {new_group_name}'
            )
    
    def perform_destroy(self, instance):
        """Delete guarantee and log action."""
        GuaranteeHistory.log_action(
            guarantee=instance,
            user=self.request.user,
            action='DELETED',
            description=f'Deleted guarantee from {instance.elector.full_name}'
        )
        instance.delete()
    
    @action(detail=False, methods=['delete', 'patch'], url_path='by-elector/(?P<elector_koc_id>[^/.]+)')
    def manage_by_elector(self, request, elector_koc_id=None):
        """
        Delete or update guarantee by elector KOC ID.
        
        DELETE /api/guarantees/by-elector/{koc_id}/
        PATCH  /api/guarantees/by-elector/{koc_id}/ {"guarantee_status": "GUARANTEED"}
        """
        from apps.utils.responses import APIResponse
        
        # Find the guarantee for this user and elector
        try:
            guarantee = Guarantee.objects.get(
                user=request.user,
                elector__koc_id=elector_koc_id
            )
        except Guarantee.DoesNotExist:
            return APIResponse.error(
                message=f'No guarantee found for elector {elector_koc_id}',
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        if request.method == 'PATCH':
            serializer = GuaranteeQuickUpdateSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            new_status = serializer.validated_data['guarantee_status']
            old_status = guarantee.guarantee_status
            
            if old_status != new_status:
                guarantee.guarantee_status = new_status
                guarantee.save(update_fields=['guarantee_status'])
                
                GuaranteeHistory.log_action(
                    guarantee=guarantee,
                    user=request.user,
                    action='STATUS_CHANGED',
                    old_value={'guarantee_status': old_status},
                    new_value={'guarantee_status': new_status},
                    description=f'Status changed from {old_status} to {new_status}'
                )
            
            return APIResponse.success(
                data=GuaranteeSerializer(guarantee).data,
                message='Guarantee status updated successfully'
            )
        
        # DELETE flow
        elector_name = guarantee.elector.full_name
        
        GuaranteeHistory.log_action(
            guarantee=guarantee,
            user=request.user,
            action='DELETED',
            description=f'Deleted guarantee from {guarantee.elector.full_name}'
        )
        guarantee.delete()
        
        return APIResponse.success(message=f'{elector_name} removed from guarantees')
    
    @action(detail=True, methods=['patch'], url_path='quick-update')
    def quick_update(self, request, pk=None):
        """
        Quick guarantee status update without full form.
        
        PATCH /api/guarantees/{id}/quick-update/
        Body: {guarantee_status: "GUARANTEED"}
        """
        guarantee = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        old_status = guarantee.guarantee_status
        new_status = serializer.validated_data['guarantee_status']
        
        guarantee.guarantee_status = new_status
        guarantee.save(update_fields=['guarantee_status'])
        
        # Log change
        GuaranteeHistory.log_action(
            guarantee=guarantee,
            user=self.request.user,
            action='STATUS_CHANGED',
            old_value={'guarantee_status': old_status},
            new_value={'guarantee_status': new_status},
            description=f'Status changed from {old_status} to {new_status}'
        )
        
        from apps.utils.responses import APIResponse
        return APIResponse.success(data=GuaranteeSerializer(guarantee).data, message='Status updated successfully')
    
    @action(detail=False, methods=['post'], url_path='bulk-update')
    def bulk_update(self, request):
        """
        Bulk update multiple guarantees.
        
        POST /api/guarantees/bulk-update/
        Body: {
            guarantee_ids: [1, 2, 3],
            guarantee_status: "GUARANTEED",  // optional
            group_id: 5        // optional
        }
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        guarantee_ids = serializer.validated_data['guarantee_ids']
        guarantees = Guarantee.objects.filter(
            id__in=guarantee_ids,
            user=request.user
        )
        
        updated_count = 0
        update_fields = []
        
        # Update guarantee status
        if 'guarantee_status' in serializer.validated_data:
            new_status = serializer.validated_data['guarantee_status']
            guarantees.update(guarantee_status=new_status)
            update_fields.append('guarantee_status')
            updated_count = guarantees.count()
            
            # Log for each
            for guarantee in guarantees:
                GuaranteeHistory.log_action(
                    guarantee=guarantee,
                    user=request.user,
                    action='STATUS_CHANGED',
                    description=f'Bulk update: Status changed to {new_status}'
                )
        
        # Update group
        if 'group_id' in serializer.validated_data:
            group_id = serializer.validated_data['group_id']
            if group_id:
                group = GuaranteeGroup.objects.get(id=group_id, user=request.user)
                guarantees.update(group=group)
                update_fields.append('group')
            else:
                guarantees.update(group=None)
                update_fields.append('group')
            updated_count = guarantees.count()
        
        from apps.utils.responses import APIResponse
        return APIResponse.success(
            data={
                'updated_count': updated_count,
                'fields_updated': update_fields
            },
            message=f'Successfully updated {updated_count} guarantees'
        )
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """
        Confirm a guarantee.
        
        POST /api/guarantees/{id}/confirm/
        Body: { "confirmation_status": "CONFIRMED" }
        """
        from apps.utils.responses import APIResponse
        guarantee = self.get_object()
        serializer = GuaranteeConfirmSerializer(data=request.data, context={'request': request})
        
        if not serializer.is_valid():
            return APIResponse.error(
                message='Invalid data',
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Store old confirmation status for logging
        old_status = guarantee.confirmation_status
        
        # Update confirmation fields
        guarantee.confirmation_status = serializer.validated_data['confirmation_status']
        guarantee.save(update_fields=['confirmation_status'])
        
        # Log confirmation change
        GuaranteeHistory.log_action(
            guarantee=guarantee,
            user=request.user,
            action='CONFIRMATION_CHANGED',
            old_value={'confirmation_status': old_status},
            new_value={'confirmation_status': guarantee.confirmation_status},
            description=f'Confirmation status changed from {old_status} to {guarantee.confirmation_status}'
        )
        
        return APIResponse.success(
            data=GuaranteeListSerializer(guarantee).data,
            message='Guarantee confirmation updated successfully'
        )
    
    @action(detail=False, methods=['post'])
    def bulk_confirm(self, request):
        """
        Confirm multiple guarantees at once.
        
        POST /api/guarantees/bulk-confirm/
        Body: { "guarantee_ids": [1,2,3], "confirmation_status": "CONFIRMED" }
        """
        from apps.utils.responses import APIResponse
        serializer = GuaranteeBulkConfirmSerializer(data=request.data, context={'request': request})
        
        if not serializer.is_valid():
            return APIResponse.error(
                message='Invalid data',
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
        guarantee_ids = serializer.validated_data['guarantee_ids']
        confirmation_status = serializer.validated_data['confirmation_status']

        guarantees = Guarantee.objects.filter(
            id__in=guarantee_ids,
            user=request.user
        )
        
        updated_count = 0
        for guarantee in guarantees:
            old_status = guarantee.confirmation_status
            guarantee.confirmation_status = confirmation_status
            guarantee.save(update_fields=['confirmation_status'])
            
            # Log each confirmation
            GuaranteeHistory.log_action(
                guarantee=guarantee,
                user=request.user,
                action='CONFIRMATION_CHANGED',
                old_value={'confirmation_status': old_status},
                new_value={'confirmation_status': confirmation_status},
                description=f'Bulk confirmation: Status changed from {old_status} to {confirmation_status}'
            )
            
            updated_count += 1
        
        return APIResponse.success(
            data={'updated_count': updated_count},
            message=f'Successfully confirmed {updated_count} guarantees'
        )
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        Get personal guarantee statistics.
        
        GET /api/guarantees/statistics/
        """
        guarantees = self.get_queryset()
        
        # Use single aggregation query instead of multiple count() calls
        from django.db.models import Q
        stats = guarantees.aggregate(
            total=Count('id'),
            pending=Count('id', filter=Q(guarantee_status='PENDING')),
            guaranteed=Count('id', filter=Q(guarantee_status='GUARANTEED')),
            confirmed_count=Count('id', filter=Q(confirmation_status='CONFIRMED')),
            pending_confirmation_count=Count('id', filter=Q(confirmation_status='PENDING')),
            not_available_confirmation_count=Count('id', filter=Q(confirmation_status='NOT_AVAILABLE')),
        )
        
        total = stats['total']
        pending = stats['pending']
        guaranteed = stats['guaranteed']
        confirmed_count = stats['confirmed_count']
        pending_confirmation_count = stats['pending_confirmation_count']
        not_available_confirmation_count = stats['not_available_confirmation_count']
        unconfirmed_count = pending_confirmation_count + not_available_confirmation_count
        
        # By group
        by_group = list(guarantees.values(
            'group__name',
            'group__color'
        ).annotate(
            count=Count('id')
        ).order_by('-count'))
        
        # By committee
        by_committee = list(guarantees.values(
            'elector__committee__code',
            'elector__committee__name'
        ).annotate(
            count=Count('id')
        ).order_by('-count'))
        
        # Recent guarantees
        recent = guarantees.order_by('-created_at')[:5]
        recent_guarantees = GuaranteeListSerializer(recent, many=True).data
        
        # Top sections
        top_sections = list(guarantees.values(
            'elector__section'
        ).annotate(
            count=Count('id')
        ).order_by('-count')[:5])
        
        stats = {
            'total_guarantees': total,
            'pending_count': pending,
            'guaranteed_count': guaranteed,
            'not_available_count': not_available_confirmation_count,
            'confirmed_count': confirmed_count,
            'pending_confirmation_count': pending_confirmation_count,
            'not_available_confirmation_count': not_available_confirmation_count,
            'unconfirmed_count': unconfirmed_count,
            'confirmation_rate': round((confirmed_count / total) * 100, 1) if total > 0 else 0,
            'by_group': by_group,
            'by_committee': by_committee,
            'recent_guarantees': recent_guarantees,
            'top_sections': top_sections,
        }
        
        from apps.utils.responses import APIResponse
        serializer = GuaranteeStatisticsSerializer(stats)
        return APIResponse.success(data=serializer.data)
    
    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """
        Get guarantee history.
        
        GET /api/guarantees/{id}/history/
        """
        from apps.utils.responses import APIResponse
        guarantee = self.get_object()
        # Limit history to prevent unbounded queries (typically < 100 entries)
        history = guarantee.history.all()[:100]
        serializer = GuaranteeHistorySerializer(history, many=True)
        return APIResponse.success(data=serializer.data)
    
    @action(detail=True, methods=['post'], url_path='add-note')
    def add_note(self, request, pk=None):
        """
        Add note to guarantee.
        
        POST /api/guarantees/{id}/add-note/
        Body: {content: "...", is_important: false}
        """
        guarantee = self.get_object()
        
        serializer = GuaranteeNoteCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Override guarantee
        note = serializer.save(
            guarantee=guarantee,
            user=request.user
        )
        
        # Log action
        GuaranteeHistory.log_action(
            guarantee=guarantee,
            user=request.user,
            action='NOTE_ADDED',
            description='Added note'
        )
        
        from apps.utils.responses import APIResponse
        return APIResponse.created(
            data=GuaranteeNoteSerializer(note).data,
            message='Note added successfully'
        )
    
    @action(detail=True, methods=['get'])
    def notes(self, request, pk=None):
        """
        Get all notes for guarantee.
        
        GET /api/guarantees/{id}/notes/
        """
        from apps.utils.responses import APIResponse
        guarantee = self.get_object()
        # Limit notes to prevent unbounded queries (typically < 100 entries)
        notes = guarantee.notes.all()[:100]
        serializer = GuaranteeNoteSerializer(notes, many=True)
        return APIResponse.success(data=serializer.data)
    
    @action(detail=False, methods=['get'], url_path='search-elector')
    def search_elector(self, request):
        """
        Search for elector to add guarantee.
        Returns electors not yet in user's list.
        
        GET /api/guarantees/search-elector/?query=john
        """
        from apps.electors.models import Elector
        from apps.electors.serializers import ElectorListSerializer
        
        from apps.utils.responses import APIResponse
        query = request.query_params.get('query')
        if not query:
            query = request.query_params.get('q', '')
        query = query.strip()
        
        if not query:
            return APIResponse.error(
                message='Query parameter is required',
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Get electors already in user's guarantees
        existing_elector_ids = self.get_queryset().values_list('elector_id', flat=True)
        
        # Search electors not in user's list
        electors = Elector.objects.filter(
            is_active=True
        ).exclude(
            koc_id__in=existing_elector_ids
        ).filter(
            Q(koc_id__icontains=query) |
            Q(name_first__icontains=query) |
            Q(family_name__icontains=query) |
            Q(sub_family_name__icontains=query) |
            Q(mobile__icontains=query) |
            Q(section__icontains=query)
        ).select_related('committee')[:20]
        
        serializer = ElectorListSerializer(electors, many=True)
        return APIResponse.success(data=serializer.data)

    @action(detail=False, methods=['get'], url_path='export/csv')
    def export_csv(self, request):
        """
        Export filtered guarantees to CSV for the current user.
        """
        queryset = self.filter_queryset(self.get_queryset())

        response = HttpResponse(content_type='text/csv; charset=utf-8')
        filename = f'guarantees_export_{timezone.now().strftime("%Y%m%d_%H%M%S")}.csv'
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        response.write('\ufeff')  # BOM for Excel

        writer = csv.writer(response)
        writer.writerow([
            'Guarantee ID',
            'KOC ID',
            'Elector Name',
            'Elector Committee',
            'Guarantee Status',
            'Confirmation Status',
            'Group',
            'Collector',
            'Created At',
        ])

        row_count = 0
        for guarantee in queryset.iterator(chunk_size=1000):
            elector = guarantee.elector
            writer.writerow([
                guarantee.id,
                elector.koc_id if elector else '',
                elector.full_name if elector else '',
                elector.committee.code if elector and elector.committee else '',
                guarantee.guarantee_status,
                guarantee.confirmation_status,
                guarantee.group.name if guarantee.group else '',
                guarantee.user.email if guarantee.user else '',
                guarantee.created_at.strftime('%Y-%m-%d %H:%M:%S') if guarantee.created_at else '',
            ])
            row_count += 1

        logger.info(
            "Guarantee CSV export generated %s rows for user %s",
            row_count,
            request.user.id,
        )

        return response


class TeamDashboardViewSet(viewsets.ViewSet):
    """
    Team dashboard for supervisors.
    View guarantees collected by team members.
    """
    
    permission_classes = [IsAuthenticated, IsSupervisorOrAbove]
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        Get team statistics (supervisor view).
        
        Optimized version using database aggregations instead of Python loops.
        Reduces queries from O(m) to O(1) where m = number of team members.
        
        GET /api/guarantees/team/statistics/
        """
        from django.db.models import Count, Q
        
        # Get team members
        if request.user.role == 'SUPERVISOR':
            team_members = request.user.supervised_users.all()
            team_member_ids = list(team_members.values_list('id', flat=True))
        else:
            # Admins see all
            from apps.account.models import CustomUser
            team_members = CustomUser.objects.filter(is_active=True)
            team_member_ids = list(team_members.values_list('id', flat=True))
        
        # Get all team guarantees in a single query
        team_guarantees = Guarantee.objects.filter(user_id__in=team_member_ids)
        
        # Overall team stats using single aggregation query
        team_stats = team_guarantees.aggregate(
            total=Count('id'),
            pending=Count('id', filter=Q(guarantee_status='PENDING')),
            guaranteed=Count('id', filter=Q(guarantee_status='GUARANTEED')),
            not_available=Count('id', filter=Q(confirmation_status='NOT_AVAILABLE')),
            confirmed=Count('id', filter=Q(confirmation_status='CONFIRMED')),
            pending_confirmation=Count('id', filter=Q(confirmation_status='PENDING')),
        )
        
        total_team = team_stats['total']
        by_status = {
            'pending': team_stats['pending'],
            'guaranteed': team_stats['guaranteed'],
            'not_available': team_stats['not_available'],
            'confirmed': team_stats['confirmed'],
            'pending_confirmation': team_stats['pending_confirmation'],
        }
        
        # Get team member statistics using single aggregation query
        # This replaces the loop that made multiple queries per member
        member_stats = (
            Guarantee.objects
            .filter(user_id__in=team_member_ids)
            .values('user__id', 'user__first_name', 'user__last_name', 'user__email')
            .annotate(
                total_guarantees=Count('id'),
                pending=Count('id', filter=Q(guarantee_status='PENDING')),
                guaranteed=Count('id', filter=Q(guarantee_status='GUARANTEED')),
                not_available=Count('id', filter=Q(confirmation_status='NOT_AVAILABLE')),
                confirmed=Count('id', filter=Q(confirmation_status='CONFIRMED')),
                pending_confirmation=Count('id', filter=Q(confirmation_status='PENDING')),
            )
            .order_by('-total_guarantees')
        )
        
        # Build team_member_data from aggregated results
        team_member_data = []
        for stat in member_stats:
            team_member_data.append({
                'id': stat['user__id'],
                'name': f"{stat['user__first_name']} {stat['user__last_name']}".strip() or stat['user__email'],
                'email': stat['user__email'],
                'total_guarantees': stat['total_guarantees'],
                'pending': stat['pending'],
                'guaranteed': stat['guaranteed'],
                'not_available': stat['not_available'],
                'confirmed': stat['confirmed'],
                'pending_confirmation': stat['pending_confirmation'],
            })
        
        # Recent activity - optimized with select_related
        recent = team_guarantees.select_related(
            'user',
            'elector'
        ).order_by('-created_at')[:10]
        
        recent_activity = [
            {
                'user_name': g.user.full_name,
                'elector_name': g.elector.full_name,
                'status': g.guarantee_status,
                'created_at': g.created_at
            }
            for g in recent
        ]
        
        stats = {
            'team_members': team_member_data,
            'total_team_guarantees': total_team,
            'by_status': by_status,
            'by_member': team_member_data,
            'recent_activity': recent_activity,
        }
        
        from apps.utils.responses import APIResponse
        serializer = TeamStatisticsSerializer(stats)
        return APIResponse.success(data=serializer.data)

