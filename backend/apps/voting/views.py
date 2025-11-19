"""
Views for voting operations.
Vote counting, results aggregation, and publication.
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction, models
from django.utils import timezone

from .models import (
    VoteCount,
    CommitteeVoteEntry,
    ElectionResults,
    VoteCountAudit
)
from .serializers import (
    VoteCountSerializer,
    VoteCountCreateSerializer,
    CommitteeVoteEntrySerializer,
    ElectionResultsSerializer,
    VoteCountAuditSerializer,
    BulkVoteEntrySerializer,
    ResultsSummarySerializer,
)
from apps.candidates.models import Candidate
from apps.candidates.serializers import CandidateSerializer
from apps.utils.permissions import IsAdminOrAbove, IsSupervisorOrAbove
from apps.utils.viewsets import StandardResponseMixin


# PartyViewSet and CandidateViewSet have been moved to apps.candidates.views
# They are now available at /api/candidates/parties/ and /api/candidates/


class VoteCountViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    """
    Vote count management.
    
    Endpoints:
    - GET    /api/voting/vote-counts/              - List vote counts
    - POST   /api/voting/vote-counts/              - Create vote count
    - GET    /api/voting/vote-counts/{id}/         - Get vote count
    - PUT    /api/voting/vote-counts/{id}/         - Update vote count
    - PATCH  /api/voting/vote-counts/{id}/verify/  - Verify vote count (admin)
    - GET    /api/voting/vote-counts/{id}/audit/   - Get audit log
    - POST   /api/voting/vote-counts/bulk-entry/   - Bulk vote entry
    """
    
    queryset = VoteCount.objects.all()
    permission_classes = [IsAuthenticated]
    
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter
    ]
    filterset_fields = ['election', 'committee', 'candidate', 'status', 'is_verified']
    ordering_fields = ['created_at', 'vote_count']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Use appropriate serializer."""
        if self.action == 'create':
            return VoteCountCreateSerializer
        elif self.action == 'bulk_entry':
            return BulkVoteEntrySerializer
        return VoteCountSerializer
    
    def get_permissions(self):
        """Supervisors can enter, admins can verify."""
        if self.action in ['verify']:
            return [IsAuthenticated(), IsAdminOrAbove()]
        elif self.action in ['create', 'update', 'partial_update']:
            return [IsAuthenticated(), IsSupervisorOrAbove()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """Optimize queries."""
        return VoteCount.objects.select_related(
            'committee',
            'candidate',
            'entered_by',
            'verified_by'
        )
    
    def perform_create(self, serializer):
        """Create vote count with audit log."""
        vote_count = serializer.save(
            entered_by=self.request.user,
            status='SUBMITTED'
        )
        
        # Log creation
        VoteCountAudit.log_action(
            vote_count=vote_count,
            user=self.request.user,
            action='CREATED',
            new_value=vote_count.vote_count,
            notes='Vote count created',
            ip_address=self.request.META.get('REMOTE_ADDR')
        )
    
    def perform_update(self, serializer):
        """Update vote count with audit log."""
        vote_count = self.get_object()
        old_value = vote_count.vote_count
        
        updated_vote_count = serializer.save()
        
        # Log update
        VoteCountAudit.log_action(
            vote_count=updated_vote_count,
            user=self.request.user,
            action='UPDATED',
            old_value=old_value,
            new_value=updated_vote_count.vote_count,
            notes='Vote count updated',
            ip_address=self.request.META.get('REMOTE_ADDR')
        )
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated, IsAdminOrAbove])
    def verify(self, request, pk=None):
        """
        Verify a vote count.
        
        PATCH /api/voting/vote-counts/{id}/verify/
        """
        from apps.utils.responses import APIResponse
        vote_count = self.get_object()
        
        if vote_count.is_verified:
            return APIResponse.error(
                message='Vote count is already verified',
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        vote_count.verify(request.user)
        
        # Log verification
        VoteCountAudit.log_action(
            vote_count=vote_count,
            user=request.user,
            action='VERIFIED',
            notes='Vote count verified',
            ip_address=request.META.get('REMOTE_ADDR')
        )
        
        serializer = self.get_serializer(vote_count)
        return APIResponse.success(data=serializer.data, message='Vote count verified')
    
    @action(detail=True, methods=['get'])
    def audit(self, request, pk=None):
        """
        Get audit log for vote count.
        
        GET /api/voting/vote-counts/{id}/audit/
        """
        from apps.utils.responses import APIResponse
        vote_count = self.get_object()
        audit_log = vote_count.audit_log.all()
        serializer = VoteCountAuditSerializer(audit_log, many=True)
        return APIResponse.success(data=serializer.data)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated, IsSupervisorOrAbove])
    @transaction.atomic
    def bulk_entry(self, request):
        """
        Bulk vote entry for a committee.
        
        POST /api/voting/vote-counts/bulk-entry/
        Body: {
            committee_id: 1,
            vote_counts: [
                {candidate_id: 1, vote_count: 150},
                {candidate_id: 2, vote_count: 120},
                ...
            ],
            total_ballots_cast: 500,
            invalid_ballots: 10,
            notes: "..."
        }
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        committee_id = serializer.validated_data['committee_id']
        vote_counts_data = serializer.validated_data['vote_counts']
        total_ballots = serializer.validated_data['total_ballots_cast']
        invalid_ballots = serializer.validated_data['invalid_ballots']
        notes = serializer.validated_data.get('notes', '')
        
        # Get or create committee vote entry
        from apps.elections.models import Committee, Election
        committee = Committee.objects.get(id=committee_id)
        election = Election.objects.first()  # Assuming single election
        
        entry, created = CommitteeVoteEntry.objects.get_or_create(
            election=election,
            committee=committee,
            defaults={
                'entered_by': request.user,
                'total_ballots_cast': total_ballots,
                'invalid_ballots': invalid_ballots,
                'valid_ballots': total_ballots - invalid_ballots,
                'notes': notes,
            }
        )
        
        if not created:
            # Update existing entry
            entry.total_ballots_cast = total_ballots
            entry.invalid_ballots = invalid_ballots
            entry.valid_ballots = total_ballots - invalid_ballots
            entry.notes = notes
            entry.save()
        
        # Create or update vote counts
        created_count = 0
        updated_count = 0
        
        for vote_data in vote_counts_data:
            candidate_id = vote_data['candidate_id']
            vote_count_value = vote_data['vote_count']
            
            candidate = Candidate.objects.get(id=candidate_id)
            
            vote_count, created = VoteCount.objects.update_or_create(
                election=election,
                committee=committee,
                candidate=candidate,
                defaults={
                    'vote_count': vote_count_value,
                    'status': 'SUBMITTED',
                    'entered_by': request.user,
                }
            )
            
            if created:
                created_count += 1
                # Log creation
                VoteCountAudit.log_action(
                    vote_count=vote_count,
                    user=request.user,
                    action='CREATED',
                    new_value=vote_count_value,
                    notes='Bulk entry',
                    ip_address=request.META.get('REMOTE_ADDR')
                )
            else:
                updated_count += 1
                # Log update
                VoteCountAudit.log_action(
                    vote_count=vote_count,
                    user=request.user,
                    action='UPDATED',
                    old_value=vote_count.vote_count,
                    new_value=vote_count_value,
                    notes='Bulk entry update',
                    ip_address=request.META.get('REMOTE_ADDR')
                )
        
        # Mark entry as completed
        entry.complete()
        
        from apps.utils.responses import APIResponse
        return APIResponse.created(
            data={
                'committee_entry_id': entry.id,
                'created': created_count,
                'updated': updated_count,
                'total': created_count + updated_count
            },
            message=f'Successfully entered votes for {committee.code}'
        )


class CommitteeVoteEntryViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    """
    Committee vote entry management.
    
    Endpoints:
    - GET    /api/voting/committee-entries/           - List entries
    - GET    /api/voting/committee-entries/{id}/      - Get entry
    - PATCH  /api/voting/committee-entries/{id}/verify/ - Verify entry (admin)
    - GET    /api/voting/committee-entries/progress/  - Get overall progress
    """
    
    queryset = CommitteeVoteEntry.objects.all()
    serializer_class = CommitteeVoteEntrySerializer
    permission_classes = [IsAuthenticated]
    
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter
    ]
    filterset_fields = ['election', 'committee', 'status']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Optimize queries."""
        return CommitteeVoteEntry.objects.select_related(
            'election',
            'committee',
            'entered_by',
            'verified_by'
        )
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated, IsAdminOrAbove])
    def verify(self, request, pk=None):
        """
        Verify a committee vote entry.
        
        PATCH /api/voting/committee-entries/{id}/verify/
        """
        from apps.utils.responses import APIResponse
        entry = self.get_object()
        
        if entry.status == 'VERIFIED':
            return APIResponse.error(
                message='Entry is already verified',
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify all vote counts for this committee
        vote_counts = VoteCount.objects.filter(
            committee=entry.committee,
            election=entry.election
        )
        
        for vc in vote_counts:
            if not vc.is_verified:
                vc.verify(request.user)
        
        # Verify entry
        entry.verify(request.user)
        
        serializer = self.get_serializer(entry)
        return APIResponse.success(data=serializer.data, message='Entry verified successfully')
    
    @action(detail=False, methods=['get'])
    def progress(self, request):
        """
        Get overall vote counting progress.
        
        GET /api/voting/committee-entries/progress/
        """
        from apps.elections.models import Committee, Election
        
        from apps.utils.responses import APIResponse
        election = Election.objects.first()  # Assuming single election
        if not election:
            return APIResponse.error(
                message='No election found',
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        committees = Committee.objects.all()
        total_committees = committees.count()
        
        entries = CommitteeVoteEntry.objects.filter(election=election)
        
        completed = entries.filter(status='COMPLETED').count()
        verified = entries.filter(status='VERIFIED').count()
        in_progress = entries.filter(status='IN_PROGRESS').count()
        
        progress_data = {
            'total_committees': total_committees,
            'entries_created': entries.count(),
            'in_progress': in_progress,
            'completed': completed,
            'verified': verified,
            'not_started': total_committees - entries.count(),
            'completion_percentage': round((verified / total_committees * 100) if total_committees > 0 else 0, 1),
        }
        
        # Committee details
        committee_progress = []
        for committee in committees:
            entry = entries.filter(committee=committee).first()
            if entry:
                committee_progress.append({
                    'committee_code': committee.code,
                    'committee_name': committee.name,
                    'status': entry.status,
                    'completion_percentage': entry.completion_percentage,
                    'verified': entry.status == 'VERIFIED',
                })
            else:
                committee_progress.append({
                    'committee_code': committee.code,
                    'committee_name': committee.name,
                    'status': 'NOT_STARTED',
                    'completion_percentage': 0,
                    'verified': False,
                })
        
        progress_data['committees'] = committee_progress
        
        return APIResponse.success(data=progress_data)


class ElectionResultsViewSet(viewsets.ViewSet):
    """
    Election results management.
    
    Endpoints:
    - GET    /api/voting/results/                - Get current results
    - POST   /api/voting/results/generate/       - Generate results (admin)
    - POST   /api/voting/results/publish/        - Publish results (admin)
    - GET    /api/voting/results/summary/        - Get results summary
    - GET    /api/voting/results/by-committee/   - Results by committee
    """
    
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """
        Get current election results (if generated).
        
        GET /api/voting/results/
        """
        from apps.elections.models import Election
        
        from apps.utils.responses import APIResponse
        election = Election.objects.first()
        if not election:
            return APIResponse.error(
                message='No election found',
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        try:
            results = ElectionResults.objects.get(election=election)
            serializer = ElectionResultsSerializer(results)
            return APIResponse.success(data=serializer.data)
        except ElectionResults.DoesNotExist:
            return APIResponse.error(
                message='Results not yet generated',
                errors={'election': election.name},
                status_code=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated, IsAdminOrAbove])
    @transaction.atomic
    def generate(self, request):
        """
        Generate election results from verified vote counts.
        
        POST /api/voting/results/generate/
        """
        from apps.elections.models import Election
        
        from apps.utils.responses import APIResponse
        election = Election.objects.first()
        if not election:
            return APIResponse.error(
                message='No election found',
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        # Check if all committees are verified
        total_committees = election.committees.count()
        verified_entries = CommitteeVoteEntry.objects.filter(
            election=election,
            status='VERIFIED'
        ).count()
        
        if verified_entries < total_committees:
            return APIResponse.error(
                message=f'Not all committees are verified ({verified_entries}/{total_committees})',
                errors={
                    'can_generate_preliminary': True,
                    'verified': verified_entries,
                    'total': total_committees
                },
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create results
        results, created = ElectionResults.objects.get_or_create(
            election=election,
            defaults={
                'generated_by': request.user
            }
        )
        
        # Generate results
        results.generate_results()
        results.generated_by = request.user
        results.save()
        
        serializer = ElectionResultsSerializer(results)
        if created:
            return APIResponse.created(
                data=serializer.data,
                message='Results generated successfully'
            )
        else:
            return APIResponse.success(
                data=serializer.data,
                message='Results regenerated successfully'
            )
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated, IsAdminOrAbove])
    def publish(self, request):
        """
        Publish final results.
        
        POST /api/voting/results/publish/
        """
        from apps.elections.models import Election
        
        from apps.utils.responses import APIResponse
        election = Election.objects.first()
        if not election:
            return APIResponse.error(
                message='No election found',
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        try:
            results = ElectionResults.objects.get(election=election)
        except ElectionResults.DoesNotExist:
            return APIResponse.error(
                message='Results not yet generated. Please generate results first.',
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        if results.status == 'PUBLISHED':
            return APIResponse.error(
                message='Results are already published',
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Publish results
        results.publish(request.user)
        
        serializer = ElectionResultsSerializer(results)
        return APIResponse.success(
            data=serializer.data,
            message='Results published successfully'
        )
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """
        Get results summary with winners.
        
        GET /api/voting/results/summary/
        """
        from apps.elections.models import Election
        
        from apps.utils.responses import APIResponse
        election = Election.objects.first()
        if not election:
            return APIResponse.error(
                message='No election found',
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        try:
            results = ElectionResults.objects.get(election=election)
        except ElectionResults.DoesNotExist:
            return APIResponse.error(
                message='Results not yet generated',
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        # Get top candidates (winners)
        candidates_data = results.results_data.get('candidates', [])
        winners = candidates_data[:19]  # Top 19 (or configured number)
        
        summary = {
            'election_name': election.name,
            'total_candidates': len(candidates_data),
            'total_registered_electors': results.total_registered_electors,
            'total_attendance': results.total_attendance,
            'total_ballots_cast': results.total_ballots_cast,
            'total_valid_ballots': results.total_valid_ballots,
            'turnout_percentage': results.turnout_percentage,
            'candidates': candidates_data,
            'winners': winners,
            'status': results.status,
        }
        
        serializer = ResultsSummarySerializer(summary)
        return APIResponse.success(data=serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_committee(self, request):
        """
        Get results breakdown by committee.
        
        GET /api/voting/results/by-committee/
        """
        from apps.elections.models import Election, Committee
        
        from apps.utils.responses import APIResponse
        election = Election.objects.first()
        if not election:
            return APIResponse.error(
                message='No election found',
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        committees = Committee.objects.all()
        committee_results = []
        
        for committee in committees:
            vote_counts = VoteCount.objects.filter(
                election=election,
                committee=committee,
                is_verified=True
            ).select_related('candidate')
            
            candidate_votes = []
            for vc in vote_counts:
                candidate_votes.append({
                    'candidate_number': vc.candidate.candidate_number,
                    'candidate_name': vc.candidate.name,
                    'vote_count': vc.vote_count,
                })
            
            # Sort by votes descending
            candidate_votes.sort(key=lambda x: x['vote_count'], reverse=True)
            
            entry = CommitteeVoteEntry.objects.filter(
                election=election,
                committee=committee
            ).first()
            
            committee_results.append({
                'committee_code': committee.code,
                'committee_name': committee.name,
                'total_ballots': entry.total_ballots_cast if entry else 0,
                'valid_ballots': entry.valid_ballots if entry else 0,
                'invalid_ballots': entry.invalid_ballots if entry else 0,
                'candidate_votes': candidate_votes,
                'status': entry.status if entry else 'NOT_STARTED',
            })
        
        return APIResponse.success(data=committee_results)


# Simple list view
list_view = ElectionResultsViewSet.as_view({'get': 'current'})

