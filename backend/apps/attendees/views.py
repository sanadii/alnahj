"""
Views for attendance management.
"""
import csv
import logging
import re
from datetime import datetime, timedelta
from io import BytesIO

from django.db import transaction
from django.db.models import Q
from django.http import FileResponse, HttpResponse
from django.utils import timezone
from django.utils.html import strip_tags
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Attendance, AttendanceStatistics
from .serializers import (
    AttendanceSerializer,
    AttendanceListSerializer,
    MarkAttendanceSerializer,
    ElectorAttendanceSerializer,
    AttendanceStatisticsSerializer,
)
from apps.utils.permissions import IsAssignedToCommittee, IsAdminOrAbove
from apps.utils.viewsets import StandardResponseMixin
from apps.utils.responses import APIResponse
from apps.electors.models import Elector
from apps.elections.models import Committee
from apps.electors.serializers import ElectorSerializer

logger = logging.getLogger(__name__)


class AttendanceViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    """
    Attendance CRUD operations.
    
    Endpoints:
    - GET    /api/attendance/                    - List attendance records
    - POST   /api/attendance/mark/               - Mark attendance (KOC ID)
    - GET    /api/attendance/{id}/               - Get attendance details
    - GET    /api/attendance/search-elector/     - Search elector by KOC ID
    - GET    /api/attendance/committee/{code}/   - Get committee attendance
    - GET    /api/attendance/statistics/{code}/  - Get committee statistics
    - POST   /api/attendance/statistics/{code}/refresh/ - Refresh statistics
    """
    
    queryset = Attendance.objects.all()
    permission_classes = [IsAuthenticated]
    
    # Filtering & Search
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_fields = {
        'committee': ['exact'],
        'committee__code': ['exact'],  # Allow filtering by committee code
        'marked_by': ['exact']
    }
    search_fields = ['elector__koc_id', 'elector__name_first', 'elector__family_name']
    ordering_fields = ['attended_at']
    ordering = ['-attended_at']
    
    def _get_user_committees(self, user):
        """Get (and cache) user's assigned committees."""
        assigned_committees = getattr(user, '_cached_committees', None)
        if assigned_committees is None:
            assigned_committees = user.committees or []
            user._cached_committees = assigned_committees
        return assigned_committees
    
    def _user_can_access_committee(self, user, committee_code):
        """Check whether user can access the given committee."""
        if user.is_admin_or_above():
            return True
        if not committee_code:
            return False
        assigned_committees = self._get_user_committees(user)
        return committee_code in assigned_committees
    
    def get_serializer_class(self):
        """Use appropriate serializer based on action."""
        if self.action == 'list':
            return AttendanceListSerializer
        elif self.action == 'mark':
            return MarkAttendanceSerializer
        elif self.action == 'search_elector':
            return ElectorAttendanceSerializer
        return AttendanceSerializer
    
    def get_queryset(self):
        """
        Filter attendance based on user's committee assignments.
        Admins see all, users see only their assigned committees.
        """
        user = self.request.user
        queryset = Attendance.objects.select_related(
            'elector',
            'committee',
            'marked_by'
        )
        
        # Admins see all attendance
        if user.is_admin_or_above():
            return queryset.all()
        
        # Users see only attendance from their assigned committees
        # Cache committees to avoid repeated property access
        assigned_committees = self._get_user_committees(user)
        
        if assigned_committees:
            return queryset.filter(committee__code__in=assigned_committees)
        
        # If no committees assigned, return empty queryset
        return queryset.none()
    
    def destroy(self, request, *args, **kwargs):
        """
        Override destroy to add permission checks.
        Only admins or users assigned to the committee can delete attendance.
        """
        instance = self.get_object()
        user = request.user
        
        # Admins can delete any attendance
        if user.is_admin_or_above():
            return super().destroy(request, *args, **kwargs)
        
        # Regular users can only delete attendance from their assigned committees
        assigned_committees = self._get_user_committees(user)
        
        if instance.committee.code not in (assigned_committees or []):
            return APIResponse.error(
                message='You are not authorized to delete attendance from this committee',
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=False, methods=['post'], url_path='mark')
    def mark(self, request):
        """
        Mark attendance for an elector.
        
        POST /api/attendance/mark/
        Body: {
            "koc_id": "12345",
            "committee_code": "EK-II",
            "notes": "Optional notes"
        }
        """
        serializer = MarkAttendanceSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        committee_code = serializer.validated_data['committee_code']
        if not self._user_can_access_committee(request.user, committee_code):
            return APIResponse.error(
                message='You are not authorized to mark attendance for this committee',
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        attendance = serializer.save()
        
        # Return full attendance details
        response_serializer = AttendanceSerializer(attendance)
        
        return APIResponse.created(
            data=response_serializer.data,
            message='Attendance marked successfully'
        )
    
    @action(detail=False, methods=['get'], url_path='search-elector')
    def search_elector(self, request):
        """
        Search for an elector by KOC ID before marking attendance.
        
        GET /api/attendance/search-elector/?koc_id=12345&committee=EK-II
        
        Returns elector details and attendance status.
        """
        koc_id = request.query_params.get('koc_id')
        committee_code = request.query_params.get('committee')
        
        if not koc_id:
            return APIResponse.error(
                message='koc_id parameter is required',
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Search for elector
            elector = Elector.objects.select_related('committee').prefetch_related('attendance_records').get(
                koc_id=koc_id,
                is_active=True
            )
            
            # Check committee match if provided
            if committee_code and elector.committee.code != committee_code:
                return APIResponse.error(
                    message=f"Elector {koc_id} is assigned to committee {elector.committee.code}, not {committee_code}",
                    errors={
                        'elector_committee': elector.committee.code,
                        'requested_committee': committee_code
                    },
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            # Serialize elector data
            serializer = ElectorAttendanceSerializer(elector)
            
            # Return elector data directly in 'data' field (following standards)
            return APIResponse.success(
                data=serializer.data,
                message='Elector found'
            )
        
        except Elector.DoesNotExist:
            return APIResponse.error(
                message=f"Elector with KOC ID {koc_id} not found",
                errors={'can_add': True},  # Flag that elector can be added
                status_code=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'], url_path='committee/(?P<committee_code>[^/.]+)')
    def committee_attendance(self, request, committee_code=None):
        """
        Get all attendance records for a specific committee.
        
        GET /api/attendance/committee/EK-II/
        """
        try:
            committee = Committee.objects.get(code=committee_code)
            
            # Check permission
            if not request.user.is_admin_or_above():
                if committee_code not in request.user.committees:
                    return APIResponse.error(
                        message='You are not assigned to this committee',
                        status_code=status.HTTP_403_FORBIDDEN
                    )
            
            # Get attendance records with optimized queries
            attendances = Attendance.objects.filter(
                committee=committee
            ).select_related('elector', 'elector__committee', 'marked_by').prefetch_related(
                'elector__attendance_records'
            ).order_by('-attended_at')
            
            serializer = AttendanceListSerializer(attendances, many=True)
            
            # Get basic statistics (attended only)
            total_electors = committee.electors.filter(is_active=True).count()
            total_attended = attendances.filter(status=Attendance.Status.ATTENDED).count()
            attendance_percentage = round((total_attended / total_electors * 100), 2) if total_electors > 0 else 0
            
            return APIResponse.success(
                data={
                    'committee': {
                        'code': committee.code,
                        'name': committee.name,
                    },
                    'statistics': {
                        'total_electors': total_electors,
                        'total_attended': total_attended,
                        'pending': total_electors - total_attended,
                        'percentage': attendance_percentage,
                    },
                    'attendance': serializer.data
                }
            )
        
        except Committee.DoesNotExist:
            return APIResponse.error(
                message=f"Committee {committee_code} not found",
                status_code=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'], url_path='statistics/(?P<committee_code>[^/.]+)')
    def statistics(self, request, committee_code=None):
        """
        Get detailed statistics for a committee.
        
        GET /api/attendance/statistics/EK-II/
        """
        try:
            committee = Committee.objects.get(code=committee_code)
            
            # Check permission with improved validation
            if not self._user_can_access_committee(request.user, committee_code):
                return APIResponse.error(
                    message='You are not assigned to this committee',
                    status_code=status.HTTP_403_FORBIDDEN
                )
            
            # Get or create statistics with select_for_update to prevent race conditions
            # Cache duration is configurable via settings (default: 5 minutes)
            from django.conf import settings
            cache_minutes = getattr(settings, 'ATTENDANCE_STATISTICS_CACHE_MINUTES', 5)
            
            with transaction.atomic():
                stats, created = AttendanceStatistics.objects.select_for_update().get_or_create(
                    committee=committee
                )
                
                # Update if stale (configurable cache duration)
                # Use select_for_update to prevent concurrent updates
                if timezone.now() - stats.last_updated > timedelta(minutes=cache_minutes):
                    stats.update_statistics()
            
            serializer = AttendanceStatisticsSerializer(stats)
            return APIResponse.success(data=serializer.data)
        
        except Committee.DoesNotExist:
            return APIResponse.error(
                message=f"Committee {committee_code} not found",
                status_code=status.HTTP_404_NOT_FOUND
            )
    
    @action(
        detail=False,
        methods=['post'],
        url_path='statistics/(?P<committee_code>[^/.]+)/refresh',
        permission_classes=[IsAuthenticated, IsAdminOrAbove]
    )
    def refresh_statistics(self, request, committee_code=None):
        """
        Manually refresh statistics for a committee (admin only).
        
        POST /api/attendance/statistics/EK-II/refresh/
        """
        try:
            committee = Committee.objects.get(code=committee_code)
            
            # Get or create statistics
            stats, created = AttendanceStatistics.objects.get_or_create(
                committee=committee
            )
            
            # Update statistics
            stats.update_statistics()
            
            serializer = AttendanceStatisticsSerializer(stats)
            return APIResponse.success(
                data=serializer.data,
                message='Statistics refreshed successfully'
            )
        
        except Committee.DoesNotExist:
            return APIResponse.error(
                message=f"Committee {committee_code} not found",
                status_code=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'], url_path='add-pending-elector')
    def add_pending_elector(self, request):
        """
        Add a new elector as pending (awaiting admin approval).
        Simplified: only requires KOC ID and full name.
        Committee is taken from user's assignment, gender from committee.
        
        POST /api/attendees/add-pending-elector/
        Body: {
            "koc_id": "12345",
            "full_name": "أحمد محمد علي الخالدي",
            "notes": "Optional notes"
        }
        """
        # Extract data
        koc_id = request.data.get('koc_id')
        full_name = request.data.get('full_name')
        committee_code = request.data.get('committee_code')
        notes = request.data.get('notes', '')
        
        # Validate required fields
        if not koc_id or not committee_code:
            return APIResponse.error(
                message='KOC ID and committee code are required',
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Get committee from request
            committee = Committee.objects.get(code=committee_code)
            
            # Validate user has permission to add to this committee
            # Admin can add to any committee, members only to their assigned committees
            if not self._user_can_access_committee(request.user, committee_code):
                return APIResponse.error(
                    message=f'You are not authorized to add electors to committee {committee_code}',
                    status_code=status.HTTP_403_FORBIDDEN
                )
            
            # If elector already exists, create attendance (override committee constraint)
            existing_elector = Elector.objects.filter(koc_id=koc_id).select_related('committee').first()
            if existing_elector:
                if not full_name:
                    full_name = existing_elector.full_name
                # Prepare device info
                device_info = {}
                if request:
                    ip_address = request.META.get('REMOTE_ADDR') or request.META.get('HTTP_X_FORWARDED_FOR', '').split(',')[0].strip()
                    user_agent = request.META.get('HTTP_USER_AGENT', '')
                    
                    ip_pattern = re.compile(
                        r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|'
                        r'^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$'
                    )
                    if ip_address and ip_pattern.match(ip_address):
                        device_info['ip_address'] = ip_address
                    if user_agent:
                        device_info['user_agent'] = strip_tags(user_agent)[:255]
                
                attendance = Attendance(
                    elector=existing_elector,
                    committee=committee,
                    marked_by=request.user if request else None,
                    notes=notes or '',
                    device_info=device_info,
                    status=Attendance.Status.PENDING
                )
                attendance._skip_committee_validation = True
                attendance.save()
                
                serializer = AttendanceSerializer(attendance)
                return APIResponse.created(
                    data=serializer.data,
                    message=f'Pending attendance recorded for elector {koc_id} (originally assigned to {existing_elector.committee.code})'
                )
            
            if not full_name:
                return APIResponse.error(
                    message='Full name is required for new electors',
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            # Parse full name (extract family name from last word)
            # Improved parsing: handle edge cases and validate
            name_parts = [part.strip() for part in full_name.strip().split() if part.strip()]
            
            if not name_parts:
                return APIResponse.error(
                    message='Full name cannot be empty',
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            # If only one word, use it as both first and family name
            if len(name_parts) == 1:
                name_first = name_parts[0]
                family_name = name_parts[0]
            else:
                # Last word is family name, rest is first name
                family_name = name_parts[-1]
                name_first = ' '.join(name_parts[:-1])
            
            # Validate name length
            if len(name_first) < 2 or len(family_name) < 2:
                return APIResponse.error(
                    message='Name parts must be at least 2 characters long',
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            # Get gender from committee
            gender = committee.gender
            
            # Create elector as pending (not approved)
            elector = Elector.objects.create(
                koc_id=koc_id,
                name_first=name_first,
                family_name=family_name,
                gender=gender,
                committee=committee,
                is_active=True,
                is_approved=False,  # Pending admin approval
                created_by=request.user
            )
            
            # Notes are stored in the elector model if needed
            # For now, notes are passed but not stored (can be added to elector model later)
            
            # Serialize elector data
            serializer = ElectorSerializer(elector)
            
            return APIResponse.created(
                data=serializer.data,
                message=f'Elector {full_name} added successfully (pending approval)'
            )
        
        except Committee.DoesNotExist:
            return APIResponse.error(
                message=f"Committee not found",
                status_code=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return APIResponse.error(
                message=f"Failed to create elector: {str(e)}",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _get_filtered_queryset(self, request):
        """
        Get filtered queryset for exports with date range and committee filtering.
        """
        queryset = self.get_queryset()
        
        # Filter by committee code if provided
        committee_code = request.query_params.get('committee_code')
        if committee_code:
            queryset = queryset.filter(committee__code=committee_code)
        
        # Filter by date range if provided
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        
        if date_from:
            try:
                date_from_obj = datetime.strptime(date_from, '%Y-%m-%d').date()
                queryset = queryset.filter(attended_at__date__gte=date_from_obj)
            except ValueError:
                pass  # Invalid date format, ignore
        
        if date_to:
            try:
                date_to_obj = datetime.strptime(date_to, '%Y-%m-%d').date()
                queryset = queryset.filter(attended_at__date__lte=date_to_obj)
            except ValueError:
                pass  # Invalid date format, ignore
        
        return queryset.select_related('elector', 'committee', 'marked_by').order_by('-attended_at')
    
    @action(detail=False, methods=['get'], url_path='export/csv')
    def export_csv(self, request):
        """
        Export attendance data to CSV.
        
        GET /api/attendees/export/csv/?committee_code=CMT-001&date_from=2024-01-01&date_to=2024-12-31
        
        Query Parameters:
        - committee_code: Filter by committee code (optional)
        - date_from: Start date (YYYY-MM-DD, optional)
        - date_to: End date (YYYY-MM-DD, optional)
        """
        queryset = self._get_filtered_queryset(request)
        
        # Create CSV response
        response = HttpResponse(content_type='text/csv; charset=utf-8')
        filename = f'attendance_export_{timezone.now().strftime("%Y%m%d_%H%M%S")}.csv'
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        
        # Add BOM for Excel UTF-8 compatibility
        response.write('\ufeff')
        
        writer = csv.writer(response)
        
        # Write header row
        writer.writerow([
            'KOC ID',
            'Full Name',
            'First Name',
            'Family Name',
            'Committee Code',
            'Committee Name',
            'Attended At',
            'Marked By',
            'Notes',
            'IP Address',
            'User Agent'
        ])
        
        # Write data rows
        row_count = 0
        for attendance in queryset.iterator(chunk_size=1000):
            device_info = attendance.device_info or {}
            writer.writerow([
                attendance.elector.koc_id,
                attendance.elector.full_name,
                attendance.elector.name_first,
                attendance.elector.family_name,
                attendance.committee.code,
                attendance.committee.name,
                attendance.attended_at.strftime('%Y-%m-%d %H:%M:%S') if attendance.attended_at else '',
                attendance.marked_by.get_full_name() if attendance.marked_by else '',
                attendance.notes or '',
                device_info.get('ip_address', ''),
                device_info.get('user_agent', '')
            ])
            row_count += 1

        logger.info(
            "Attendance CSV export generated %s rows (filters: committee=%s, date_from=%s, date_to=%s)",
            row_count,
            request.query_params.get('committee_code'),
            request.query_params.get('date_from'),
            request.query_params.get('date_to'),
        )
        
        return response
    
    @action(detail=False, methods=['get'], url_path='export/pdf')
    def export_pdf(self, request):
        """
        Export attendance data to PDF.
        
        GET /api/attendees/export/pdf/?committee_code=CMT-001&date_from=2024-01-01&date_to=2024-12-31
        
        Query Parameters:
        - committee_code: Filter by committee code (optional)
        - date_from: Start date (YYYY-MM-DD, optional)
        - date_to: End date (YYYY-MM-DD, optional)
        """
        try:
            from reportlab.lib import colors
            from reportlab.lib.pagesizes import A4
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
            from reportlab.lib.units import inch
            from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
            from reportlab.lib.enums import TA_CENTER
        except ImportError:
            return APIResponse.error(
                message='PDF export requires reportlab package. Please install it: pip install reportlab',
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        
        queryset = self._get_filtered_queryset(request)
        
        # Create PDF buffer
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=30)
        
        # Container for PDF elements
        elements = []
        
        # Styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=16,
            textColor=colors.HexColor('#1a1a1a'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        # Title
        title = Paragraph('Attendance Report', title_style)
        elements.append(title)
        elements.append(Spacer(1, 0.2*inch))
        
        # Report metadata
        metadata = [
            f'Generated: {timezone.now().strftime("%Y-%m-%d %H:%M:%S")}',
            f'Total Records: {queryset.count()}',
        ]
        
        committee_code = request.query_params.get('committee_code')
        if committee_code:
            metadata.append(f'Committee: {committee_code}')
        
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        if date_from or date_to:
            date_range = f"Date Range: {date_from or 'Start'} to {date_to or 'End'}"
            metadata.append(date_range)
        
        for meta in metadata:
            elements.append(Paragraph(meta, styles['Normal']))
        
        elements.append(Spacer(1, 0.3*inch))
        
        # Prepare table data
        table_data = [['KOC ID', 'Name', 'Committee', 'Attended At', 'Marked By']]
        
        for attendance in queryset:
            table_data.append([
                attendance.elector.koc_id,
                attendance.elector.full_name,
                attendance.committee.code,
                attendance.attended_at.strftime('%Y-%m-%d %H:%M') if attendance.attended_at else '',
                attendance.marked_by.get_full_name() if attendance.marked_by else 'N/A'
            ])
        
        # Create table
        table = Table(table_data, colWidths=[1*inch, 2*inch, 1*inch, 1.2*inch, 1.5*inch])
        table.setStyle(TableStyle([
            # Header row
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4CAF50')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('TOPPADDING', (0, 0), (-1, 0), 12),
            # Data rows
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f5f5f5')]),
        ]))
        
        elements.append(table)
        
        # Build PDF
        doc.build(elements)
        
        # Get PDF content
        buffer.seek(0)
        filename = f'attendance_export_{timezone.now().strftime("%Y%m%d_%H%M%S")}.pdf'
        
        return FileResponse(
            buffer,
            as_attachment=True,
            filename=filename,
            content_type='application/pdf'
        )

