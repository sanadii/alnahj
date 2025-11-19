"""
Views for candidates and parties management.
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Sum

from .models import Party, Candidate
from .serializers import (
    PartySerializer,
    PartyListSerializer,
    PartyCreateSerializer,
    CandidateSerializer,
    CandidateListSerializer,
    CandidateCreateSerializer,
    CandidateUpdateSerializer,
)
from apps.utils.viewsets import StandardResponseMixin
from apps.utils.responses import APIResponse
from apps.utils.permissions import IsAdminOrAbove


class PartyViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    """
    Party management.
    
    Endpoints:
    - GET    /api/candidates/parties/          - List parties
    - POST   /api/candidates/parties/          - Create party (admin)
    - GET    /api/candidates/parties/{id}/     - Get party details
    - PUT    /api/candidates/parties/{id}/     - Update party (admin)
    - DELETE /api/candidates/parties/{id}/     - Delete party (admin)
    - GET    /api/candidates/parties/{id}/candidates/ - Get party candidates
    - GET    /api/candidates/parties/statistics/ - Get statistics
    """
    
    queryset = Party.objects.all()
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    # Filtering & Search
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_fields = ['election', 'is_active']
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    # Custom messages
    create_message = "Party created successfully"
    update_message = "Party updated successfully"
    delete_message = "Party deleted successfully"
    
    def get_serializer_class(self):
        """Use appropriate serializer based on action."""
        if self.action == 'list':
            return PartyListSerializer
        elif self.action == 'create':
            return PartyCreateSerializer
        return PartySerializer
    
    def get_permissions(self):
        """Only admins can create/update/delete parties."""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminOrAbove()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """Optimize queries."""
        # Don't use annotations for delete or update operations to avoid setter errors
        if self.action in ['destroy', 'update', 'partial_update', 'retrieve']:
            return Party.objects.all()
        
        from django.db import models as django_models
        # Use '_candidate_count' to avoid conflict with the @property candidate_count
        return Party.objects.annotate(
            _candidate_count=Count('candidates', filter=django_models.Q(candidates__is_active=True))
        )

    def create(self, request, *args, **kwargs):
        """Create party and return full representation including generated fields."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        party = serializer.save()

        response_serializer = PartySerializer(party, context=self.get_serializer_context())

        return APIResponse.created(
            data=response_serializer.data,
            message=self.create_message
        )
    
    @action(detail=True, methods=['get'])
    def candidates(self, request, pk=None):
        """
        Get all candidates for this party.
        
        GET /api/candidates/parties/{id}/candidates/
        """
        party = self.get_object()
        candidates = party.candidates.filter(is_active=True).order_by('candidate_number')
        
        serializer = CandidateListSerializer(candidates, many=True, context={'request': request})
        
        return APIResponse.success(
            data={
                'party': PartySerializer(party, context={'request': request}).data,
                'candidates': serializer.data
            }
        )
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        Get party statistics.
        
        GET /api/candidates/parties/statistics/
        """
        parties = self.get_queryset()
        
        stats = {
            'total_parties': parties.count(),
            'active_parties': parties.filter(is_active=True).count(),
            'by_party': []
        }
        
        for party in parties:
            stats['by_party'].append({
                'id': party.id,
                'name': party.name,
                'color': party.color,
                'candidate_count': party.candidate_count,
                'is_active': party.is_active,
            })
        
        return APIResponse.success(data=stats)


class CandidateViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    """
    Candidate management.
    
    Endpoints:
    - GET    /api/candidates/                  - List candidates
    - POST   /api/candidates/                  - Add candidate (admin)
    - GET    /api/candidates/{id}/             - Get candidate details
    - PUT    /api/candidates/{id}/             - Update candidate (admin)
    - PATCH  /api/candidates/{id}/             - Partial update (admin)
    - DELETE /api/candidates/{id}/             - Delete candidate (admin)
    - GET    /api/candidates/statistics/       - Get statistics
    - GET    /api/candidates/{id}/vote-counts/ - Get vote counts
    """
    
    queryset = Candidate.objects.all()
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    # Filtering & Search
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_fields = ['election', 'party', 'is_active']
    search_fields = [
        'candidate_number',
        'name'
    ]
    ordering_fields = ['candidate_number', 'created_at']
    ordering = ['candidate_number']
    
    # Custom messages
    create_message = "Candidate added successfully"
    update_message = "Candidate updated successfully"
    delete_message = "Candidate removed successfully"
    
    def get_serializer_class(self):
        """Use appropriate serializer based on action."""
        if self.action == 'list':
            return CandidateListSerializer
        elif self.action == 'create':
            return CandidateCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return CandidateUpdateSerializer
        return CandidateSerializer
    
    def get_permissions(self):
        """Only admins can create/update/delete candidates."""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminOrAbove()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """Optimize queries."""
        return Candidate.objects.select_related(
            'election',
            'party'
        )
    
    def update(self, request, *args, **kwargs):
        """Update candidate and return full object."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Use update serializer for validation
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Return full candidate object using CandidateSerializer
        full_serializer = CandidateSerializer(instance, context=self.get_serializer_context())
        
        return APIResponse.success(
            data=full_serializer.data,
            message=self.update_message
        )
    
    def partial_update(self, request, *args, **kwargs):
        """Partial update candidate and return full object."""
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        """Create candidate and return full candidate representation."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        candidate = serializer.save()

        response_serializer = CandidateSerializer(candidate, context=self.get_serializer_context())

        return APIResponse.created(
            data=response_serializer.data,
            message=self.create_message
        )
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        Get candidate statistics.
        
        GET /api/candidates/statistics/
        """
        candidates = self.get_queryset()
        
        total = candidates.count()
        active = candidates.filter(is_active=True).count()
        
        # By party
        by_party = list(candidates.filter(is_active=True).values(
            'party__name',
            'party__color'
        ).annotate(
            count=Count('id')
        ).order_by('-count'))
        
        # Independent candidates
        independent = candidates.filter(
            is_active=True,
            party__isnull=True
        ).count()
        
        # By election
        by_election = list(candidates.values(
            'election__name'
        ).annotate(
            count=Count('id')
        ).order_by('-count'))
        
        stats = {
            'total_candidates': total,
            'active_candidates': active,
            'inactive_candidates': total - active,
            'independent_candidates': independent,
            'by_party': by_party,
            'by_election': by_election,
        }
        
        return APIResponse.success(data=stats)
    
    @action(detail=True, methods=['get'])
    def vote_counts(self, request, pk=None):
        """
        Get vote counts for this candidate.
        
        GET /api/candidates/{id}/vote-counts/
        """
        from apps.voting.models import VoteCount
        from apps.voting.serializers import VoteCountSerializer
        
        candidate = self.get_object()
        
        vote_counts = VoteCount.objects.filter(
            candidate=candidate
        ).select_related(
            'committee',
            'entered_by',
            'verified_by'
        ).order_by('committee__code')
        
        serializer = VoteCountSerializer(vote_counts, many=True)
        
        # Calculate summary
        summary = {
            'total_votes': candidate.total_votes,
            'vote_percentage': candidate.vote_percentage,
            'committees_counted': vote_counts.filter(is_verified=True).count(),
            'pending_verification': vote_counts.filter(is_verified=False).count(),
        }
        
        return APIResponse.success(
            data={
                'candidate': CandidateSerializer(candidate).data,
                'summary': summary,
                'vote_counts': serializer.data
            }
        )

