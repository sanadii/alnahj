"""
Views for election and committee management.
"""
from datetime import datetime

from django.db.models import Count
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status as http_status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Election, Committee
from .serializers import (
    ElectionSerializer,
    CommitteeSerializer,
    CommitteeListSerializer,
    CommitteeCreateSerializer,
    AddElectionMembersSerializer,
    GuaranteeTrendSerializer,
    GroupPerformanceSerializer,
    HourlyAttendanceSerializer,
    ElectorDemographicsSerializer,
    ElectorDistributionSerializer,
    GuaranteeDistributionSerializer,
    AttendanceDashboardSerializer,
    DashboardOverviewSerializer,
)
from apps.utils.viewsets import StandardResponseMixin
from apps.utils.responses import APIResponse
from apps.utils.permissions import IsAdminOrAbove
from .utils.dashboard_queries import (
    get_guarantees_trend,
    get_group_performance,
    get_guarantee_distribution,
    get_hourly_attendance,
    get_elector_demographics,
    get_elector_distribution,
    get_attendance_dashboard,
    get_dashboard_overview,
)


class ElectionViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    """Election management viewset."""

    queryset = Election.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'election_date', 'created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        return ElectionSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'assign_users', 'create_member', 'remove_member']:
            return [IsAuthenticated(), IsAdminOrAbove()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['get'])
    def current(self, request):
        """Return the current active election with related data."""
        try:
            election = Election.objects.filter(status__in=['SETUP', 'ACTIVE']).order_by('-created_at').first()
            if not election:
                return APIResponse.error(message='No active election found', status_code=404)

            election_data = self.get_serializer(election).data
            election_data['members'] = list(election.members.values_list('id', flat=True))

            from apps.account.serializers import UserSerializer
            members = election.members.filter(is_active=True).order_by('first_name', 'last_name')
            users_data = UserSerializer(members, many=True).data

            committees = election.committees.annotate(_elector_count=Count('electors'))
            committees_data = CommitteeListSerializer(committees, many=True, context={'request': request}).data

            from apps.candidates.models import Party, Candidate
            from apps.candidates.serializers import PartyListSerializer, CandidateListSerializer

            parties = Party.objects.filter(election=election).annotate(_candidate_count=Count('candidates'))
            parties_data = PartyListSerializer(parties, many=True, context={'request': request}).data

            candidates = Candidate.objects.filter(election=election).select_related('party').order_by('candidate_number')
            candidates_data = CandidateListSerializer(candidates, many=True, context={'request': request}).data

            return APIResponse.success(
                data={
                    'election': election_data,
                    'committees': committees_data,
                    'parties': parties_data,
                    'candidates': candidates_data,
                    'members': users_data
                },
                message='Current election data retrieved successfully'
            )
        except Exception as exc:  # pragma: no cover - defensive
            import logging
            import traceback

            logger = logging.getLogger(__name__)
            logger.error('Error in current election endpoint: %s\n%s', exc, traceback.format_exc())
            return APIResponse.error(message=f'Failed to retrieve election data: {exc}', status_code=500)

    @action(detail=True, methods=['post'], url_path='assign-users', permission_classes=[IsAuthenticated, IsAdminOrAbove])
    def assign_users(self, request, pk=None):
        election = self.get_object()
        serializer = AddElectionMembersSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        from apps.account.models import CustomUser

        user_ids = serializer.validated_data['user_ids']
        users = CustomUser.objects.filter(id__in=user_ids, is_active=True)
        election.members.add(*users)

        return APIResponse.success(
            data={'election': self.get_serializer(election).data},
            message=f'Successfully added {len(users)} member{"s" if len(users) != 1 else ""} to election'
        )

    @action(detail=True, methods=['delete'], url_path='remove-member/(?P<user_id>[^/.]+)', permission_classes=[IsAuthenticated, IsAdminOrAbove])
    def remove_member(self, request, pk=None, user_id=None):
        election = self.get_object()
        if not user_id:
            return APIResponse.error(message='User ID is required', status_code=400)

        from apps.account.models import CustomUser

        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return APIResponse.error(message='User not found', status_code=404)

        election.members.remove(user)
        for committee in election.committees.all():
            committee.assigned_users.remove(user)

        return APIResponse.success(
            data={'election': self.get_serializer(election).data},
            message='User removed from election successfully'
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdminOrAbove])
    def create_member(self, request, pk=None):
        election = self.get_object()
        payload = dict(request.data) if hasattr(request.data, '__iter__') else request.data

        first_name = payload.get('firstName') or payload.get('first_name') or ''
        last_name = payload.get('lastName') or payload.get('last_name') or ''
        email = payload.get('email') or ''
        password = payload.get('password') or ''
        phone = payload.get('phone') or ''
        role = payload.get('role', 'USER')

        if not first_name.strip():
            return APIResponse.error(
                message='firstName: This field is required.',
                errors={'firstName': ['This field is required.']},
                status_code=http_status.HTTP_400_BAD_REQUEST
            )
        if not last_name.strip():
            return APIResponse.error(
                message='lastName: This field is required.',
                errors={'lastName': ['This field is required.']},
                status_code=http_status.HTTP_400_BAD_REQUEST
            )

        from apps.account.serializers import UserCreateSerializer, UserSerializer

        user_data = {
            'email': email.strip(),
            'first_name': first_name.strip(),
            'last_name': last_name.strip(),
            'password': password,
            'phone': phone.strip(),
            'role': role,
            'is_active': True
        }

        serializer = UserCreateSerializer(data=user_data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        election.members.add(user)

        committee_id = payload.get('committeeId')
        if committee_id:
            try:
                committee = Committee.objects.get(id=committee_id, election=election)
                committee.assigned_users.add(user)
            except Committee.DoesNotExist:
                pass

        return APIResponse.success(
            data={'user': UserSerializer(user).data},
            message='User created and added to election successfully'
        )

    @action(
        detail=True,
        methods=['post'],
        url_path='auto-assign-electors',
        permission_classes=[IsAuthenticated, IsAdminOrAbove]
    )
    def auto_assign_electors(self, request, pk=None):
        """
        Auto-assign electors to committees based on configured ranges.
        Placeholder implementation returning success metadata.
        """
        election = self.get_object()
        committee_ids = request.data.get('committeeIds') or request.data.get('committee_ids')

        committees = election.committees.all()
        if committee_ids:
            committees = committees.filter(id__in=committee_ids)

        total_committees = committees.count()

        serialized_committees = CommitteeListSerializer(
            committees, many=True, context={'request': request}
        ).data

        requested_total = len(committee_ids) if committee_ids else total_committees

        data = {
            'assigned': total_committees,
            'committees': serialized_committees,
            'skipped': max(requested_total - total_committees, 0),
            'message': 'Auto-assignment processed.'
        }

        return APIResponse.success(
            data=data,
            message=f'Processed {total_committees} committee{"s" if total_committees != 1 else ""}.'
        )


class CommitteeViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    """Committee management viewset."""

    queryset = Committee.objects.select_related('election').all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['election', 'gender']
    search_fields = ['code', 'name', 'location']
    ordering_fields = ['code', 'name', 'created_at']
    ordering = ['code']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CommitteeCreateSerializer
        if self.action == 'list':
            return CommitteeListSerializer
        return CommitteeSerializer

    def perform_create(self, serializer):
        serializer.save()

    def create(self, request, *args, **kwargs):
        """Create committee and return complete representation with generated ID."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        committee = serializer.save()

        response_serializer = CommitteeSerializer(committee, context=self.get_serializer_context())

        return APIResponse.created(
            data=response_serializer.data,
            message=self.create_message
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdminOrAbove])
    def assign_users(self, request, pk=None):
        committee = self.get_object()
        user_ids = request.data.get('userIds', [])
        if not user_ids:
            return APIResponse.error(message='No user IDs provided', status_code=400)

        from apps.account.models import CustomUser

        users = CustomUser.objects.filter(id__in=user_ids, is_active=True)
        committee.assigned_users.add(*users)

        return APIResponse.success(
            data={'committee': CommitteeSerializer(committee).data},
            message=f'Successfully assigned {len(users)} user{"s" if len(users) != 1 else ""} to committee'
        )


# ==============================|| DASHBOARD VIEWS ||============================== //


class GuaranteesTrendView(APIView):
    """GET /api/elections/{election_id}/dashboard/guarantees/trends"""
    permission_classes = [IsAuthenticated]

    def get(self, request, election_id):
        get_object_or_404(Election, id=election_id)
        period = request.query_params.get('period', '30days')
        if period not in ['7days', '30days', '90days', 'all']:
            return Response(
                {'status': 'error', 'error': 'Invalid period. Must be: 7days, 30days, 90days, or all'},
                status=http_status.HTTP_400_BAD_REQUEST
            )

        data = get_guarantees_trend(request.user, period)
        serializer = GuaranteeTrendSerializer(data, many=True)
        return Response({
            'status': 'success',
            'data': serializer.data,
            'meta': {
                'period': period,
                'election_id': election_id,
                'total_entries': len(serializer.data)
            }
        })


class GuaranteeDistributionView(APIView):
    """GET /api/elections/{election_id}/dashboard/guarantees/distribution"""
    permission_classes = [IsAuthenticated]

    def get(self, request, election_id):
        get_object_or_404(Election, id=election_id)
        dimension_x = request.query_params.get('dimension_x', 'family')
        dimension_y = request.query_params.get('dimension_y', 'area')
        limit_param = request.query_params.get('limit')

        limit_value = None
        if limit_param is not None:
            try:
                limit_value = int(limit_param)
            except (TypeError, ValueError):
                return Response(
                    {'status': 'error', 'error': 'limit must be an integer value'},
                    status=http_status.HTTP_400_BAD_REQUEST
                )

        try:
            data = get_guarantee_distribution(election_id, dimension_x, dimension_y, limit=limit_value)
        except ValueError as exc:
            return Response({'status': 'error', 'error': str(exc)}, status=http_status.HTTP_400_BAD_REQUEST)

        serializer = GuaranteeDistributionSerializer(data)
        payload = serializer.data

        return Response({
            'status': 'success',
            'data': payload,
            'meta': {
                'election_id': election_id,
                'dimension_x': payload['x_dimension']['id'],
                'dimension_y': payload['y_dimension']['id'],
                'limit': payload['limit'],
                'series_limit': payload['series_limit'],
                'auto_adjusted_y': payload['y_dimension'].get('adjusted', False)
            }
        })


class GroupPerformanceView(APIView):
    """GET /api/elections/{election_id}/dashboard/groups/performance"""
    permission_classes = [IsAuthenticated]

    def get(self, request, election_id):
        election = get_object_or_404(Election, id=election_id)
        status_filter = request.query_params.get('status', 'all')
        data = get_group_performance(election.created_by or request.user, status_filter)
        serializer = GroupPerformanceSerializer(data, many=True)

        status_counts = {'active': 0, 'inactive': 0, 'pending': 0}
        for entry in serializer.data:
            status_counts[entry['status']] = status_counts.get(entry['status'], 0) + 1

        return Response({
            'status': 'success',
            'data': serializer.data,
            'meta': {
                'election_id': election_id,
                'status_filter': status_filter,
                'total_groups': len(serializer.data),
                'status_counts': status_counts
            }
        })


class HourlyAttendanceView(APIView):
    """GET /api/elections/{election_id}/dashboard/attendance/hourly"""
    permission_classes = [IsAuthenticated]

    def get(self, request, election_id):
        get_object_or_404(Election, id=election_id)
        date_str = request.query_params.get('date')
        data = get_hourly_attendance(election_id, date_str)
        serializer = HourlyAttendanceSerializer(data, many=True)

        total_attendance = sum(item['attendance'] for item in serializer.data)
        total_votes = sum(item['votes'] for item in serializer.data)
        total_target = sum(item['target'] for item in serializer.data)
        attendance_pct = round((total_attendance / total_target * 100), 1) if total_target > 0 else 0
        voting_pct = round((total_votes / total_attendance * 100), 1) if total_attendance > 0 else 0
        peak_item = max(serializer.data, key=lambda x: x['attendance']) if serializer.data else None

        return Response({
            'status': 'success',
            'data': serializer.data,
            'meta': {
                'date': date_str or datetime.now().date().isoformat(),
                'total_attendance': total_attendance,
                'total_votes': total_votes,
                'total_target': total_target,
                'attendance_percentage': attendance_pct,
                'voting_percentage': voting_pct,
                'peak_hour': peak_item['hour'] if peak_item else None,
                'peak_attendance': peak_item['attendance'] if peak_item else 0
            }
        })


class ElectorDemographicsView(APIView):
    """GET /api/elections/{election_id}/dashboard/electors/demographics"""
    permission_classes = [IsAuthenticated]

    def get(self, request, election_id):
        get_object_or_404(Election, id=election_id)
        data = get_elector_demographics(election_id)
        serializer = ElectorDemographicsSerializer(data)
        return Response({
            'status': 'success',
            'data': serializer.data,
            'meta': {
                'election_id': election_id,
                'total_areas': len(data['by_area']),
                'total_teams': len(data['by_team']),
                'total_departments': len(data.get('by_department', [])),
                'total_families': len(data['by_family']),
                'last_updated': datetime.now().isoformat()
            }
        })


class ElectorDistributionView(APIView):
    """GET /api/elections/{election_id}/dashboard/electors/distribution"""
    permission_classes = [IsAuthenticated]

    def get(self, request, election_id):
        get_object_or_404(Election, id=election_id)

        primary = request.query_params.get('primary', 'family')
        secondary = request.query_params.get('secondary')
        limit = request.query_params.get('limit')

        try:
            data = get_elector_distribution(election_id, primary, secondary, limit)
        except ValueError as exc:
            return Response(
                {'status': 'error', 'message': str(exc)},
                status=http_status.HTTP_400_BAD_REQUEST
            )

        serializer = ElectorDistributionSerializer(data)
        return Response({
            'status': 'success',
            'data': serializer.data,
            'meta': {
                'election_id': election_id,
                'primary': serializer.data.get('primary'),
                'secondary': serializer.data.get('secondary'),
                'limit': serializer.data.get('meta', {}).get('limit')
            }
        })


class AttendanceDashboardView(APIView):
    """GET /api/elections/{election_id}/dashboard/attendance/summary"""
    permission_classes = [IsAuthenticated]

    def get(self, request, election_id):
        get_object_or_404(Election, id=election_id)
        data = get_attendance_dashboard(election_id)
        if data is None:
            return Response({'status': 'error', 'message': 'Election not found'}, status=http_status.HTTP_404_NOT_FOUND)

        serializer = AttendanceDashboardSerializer(data)
        return Response({
            'status': 'success',
            'data': serializer.data,
            'meta': {
                'election_id': election_id,
                'total_committees': len(data['committees']),
                'last_updated': datetime.now().isoformat()
            }
        })


class DashboardOverviewView(APIView):
    """GET /api/elections/{election_id}/dashboard/overview"""

    permission_classes = [IsAuthenticated]

    def get(self, request, election_id):
        get_object_or_404(Election, id=election_id)
        result = get_dashboard_overview(election_id)
        if result is None:
            return Response(
                {'status': 'error', 'message': 'Election not found'},
                status=http_status.HTTP_404_NOT_FOUND
            )

        overview, totals = result
        serializer = DashboardOverviewSerializer(overview)
        return Response({
            'status': 'success',
            'data': serializer.data,
            'meta': {
                'election_id': election_id,
                'totals': totals,
                'generated_at': datetime.now().isoformat()
            }
        })