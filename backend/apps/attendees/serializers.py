"""
Serializers for attendance management.
"""
import re
from rest_framework import serializers
from django.utils import timezone
from django.utils.html import strip_tags
from .models import Attendance, AttendanceStatistics


class ElectorAttendanceSerializer(serializers.Serializer):
    """
    Serializer for displaying elector information when searching.
    Shows elector details and attendance status.
    Uses camelCase for frontend compatibility.
    """
    
    kocId = serializers.CharField(source='koc_id', read_only=True)
    fullName = serializers.CharField(source='full_name', read_only=True)
    nameFirst = serializers.CharField(source='name_first', read_only=True)
    familyName = serializers.CharField(source='family_name', read_only=True)
    section = serializers.CharField(read_only=True)
    location = serializers.CharField(read_only=True)
    committeeCode = serializers.SerializerMethodField()
    committeeName = serializers.SerializerMethodField()
    mobile = serializers.CharField(read_only=True)
    hasAttended = serializers.SerializerMethodField()
    attendedAt = serializers.SerializerMethodField()
    
    def get_committeeCode(self, obj):
        """Get committee code."""
        return obj.committee.code if obj.committee else None
    
    def get_committeeName(self, obj):
        """Get committee name."""
        return obj.committee.name if obj.committee else None
    
    def get_hasAttended(self, obj):
        """Check if elector has already attended."""
        return obj.attendance_records.filter(status=Attendance.Status.ATTENDED).exists()
    
    def get_attendedAt(self, obj):
        """Get attendance timestamp if attended."""
        record = obj.attendance_records.filter(status=Attendance.Status.ATTENDED).order_by('-attended_at').first()
        return record.attended_at if record else None


class AttendanceSerializer(serializers.ModelSerializer):
    """
    Full attendance serializer with all details.
    """
    
    elector_koc_id = serializers.CharField(source='elector.koc_id', read_only=True)
    elector_name = serializers.CharField(source='elector.full_name', read_only=True)
    elector_gender = serializers.CharField(source='elector.gender', read_only=True)
    elector_section = serializers.CharField(source='elector.section', read_only=True)
    committee_code = serializers.CharField(source='committee.code', read_only=True)
    committee_name = serializers.CharField(source='committee.name', read_only=True)
    marked_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Attendance
        fields = [
            'id',
            'elector',
            'elector_koc_id',
            'elector_name',
            'elector_gender',
            'elector_section',
            'committee',
            'committee_code',
            'committee_name',
            'marked_by',
            'marked_by_name',
            'attended_at',
            'notes',
            'device_info',
            'status'
        ]
        read_only_fields = ['id', 'attended_at', 'marked_by']
    
    def get_marked_by_name(self, obj):
        """Get name of user who marked attendance."""
        if obj.marked_by:
            return obj.marked_by.full_name
        return None


class AttendanceListSerializer(serializers.ModelSerializer):
    """
    Serializer for attendance list views with card display fields.
    """
    
    elector_koc_id = serializers.CharField(source='elector.koc_id', read_only=True)
    elector_name = serializers.CharField(source='elector.full_name', read_only=True)
    elector_gender = serializers.CharField(source='elector.gender', read_only=True)
    committee_code = serializers.CharField(source='committee.code', read_only=True)
    committee_name = serializers.CharField(source='committee.name', read_only=True)
    marked_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Attendance
        fields = [
            'id',
            'elector_koc_id',
            'elector_name',
            'elector_gender',
            'committee_code',
            'committee_name',
            'marked_by_name',
            'attended_at',
            'notes',
            'status'
        ]
    
    def get_marked_by_name(self, obj):
        """Get name of user who marked attendance."""
        if obj.marked_by:
            return obj.marked_by.full_name
        return None


class MarkAttendanceSerializer(serializers.Serializer):
    """
    Serializer for marking attendance.
    Validates KOC ID and creates attendance record.
    """
    
    koc_id = serializers.CharField(
        required=True,
        max_length=20,
        help_text='Elector KOC ID'
    )
    committee_code = serializers.CharField(
        required=True,
        max_length=20,
        help_text='Committee code where attendance is being marked'
    )
    notes = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=1000,
        help_text='Optional notes (max 1000 characters, HTML will be stripped)'
    )
    
    def validate_notes(self, value):
        """Sanitize notes to prevent XSS."""
        if value:
            # Remove HTML tags
            value = strip_tags(value)
            # Limit length
            if len(value) > 1000:
                value = value[:1000]
        return value
    
    def validate_koc_id(self, value):
        """Validate KOC ID exists."""
        from apps.electors.models import Elector
        from .models import Attendance
        
        try:
            elector = Elector.objects.get(koc_id=value, is_active=True)
            if Attendance.objects.filter(elector=elector, status=Attendance.Status.ATTENDED).exists():
                last_attendance = Attendance.objects.filter(
                    elector=elector,
                    status=Attendance.Status.ATTENDED
                ).order_by('-attended_at').first()
                timestamp = last_attendance.attended_at.strftime('%H:%M:%S') if last_attendance else ''
                raise serializers.ValidationError(
                    f"Elector {value} has already attended at {timestamp}"
                )
            return value
        except Elector.DoesNotExist:
            raise serializers.ValidationError(f"Elector with KOC ID {value} not found")
    
    def validate_committee_code(self, value):
        """Validate committee exists."""
        from apps.elections.models import Committee
        
        try:
            committee = Committee.objects.get(code=value)
            return value
        except Committee.DoesNotExist:
            raise serializers.ValidationError(f"Committee {value} not found")
    
    def validate(self, attrs):
        """Cross-field validation."""
        from apps.electors.models import Elector
        from apps.elections.models import Committee
        from .models import Attendance
        
        koc_id = attrs['koc_id']
        committee_code = attrs['committee_code']
        
        elector = Elector.objects.get(koc_id=koc_id)
        committee = Committee.objects.get(code=committee_code)
        
        # Check if elector is assigned to this committee
        if elector.committee != committee:
            raise serializers.ValidationError({
                'committee_code': f"Elector {koc_id} is assigned to committee "
                                 f"{elector.committee.code}, not {committee_code}"
            })
        
        return attrs
    
    def create(self, validated_data):
        """Create attendance record."""
        from apps.electors.models import Elector
        from apps.elections.models import Committee
        
        koc_id = validated_data['koc_id']
        committee_code = validated_data['committee_code']
        notes = validated_data.get('notes', '')
        
        elector = Elector.objects.get(koc_id=koc_id)
        committee = Committee.objects.get(code=committee_code)
        
        # Get device info from request context with validation
        request = self.context.get('request')
        device_info = {}
        if request:
            ip_address = request.META.get('REMOTE_ADDR') or request.META.get('HTTP_X_FORWARDED_FOR', '').split(',')[0].strip()
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            
            # Validate IP address format
            ip_pattern = re.compile(
                r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|'
                r'^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$'
            )
            
            if ip_address and ip_pattern.match(ip_address):
                device_info['ip_address'] = ip_address
            else:
                device_info['ip_address'] = None
            
            # Sanitize and limit user agent
            if user_agent:
                device_info['user_agent'] = strip_tags(user_agent)[:255]
            else:
                device_info['user_agent'] = None
        
        # Create attendance
        attendance = Attendance.objects.create(
            elector=elector,
            committee=committee,
            marked_by=request.user if request else None,
            notes=notes,
            device_info=device_info,
            status=Attendance.Status.ATTENDED
        )
        
        return attendance


class AttendanceStatisticsSerializer(serializers.ModelSerializer):
    """
    Serializer for attendance statistics.
    """
    
    committee_code = serializers.CharField(source='committee.code', read_only=True)
    committee_name = serializers.CharField(source='committee.name', read_only=True)
    attendance_percentage = serializers.FloatField(read_only=True)
    pending_count = serializers.SerializerMethodField()
    
    class Meta:
        model = AttendanceStatistics
        fields = [
            'committee_code',
            'committee_name',
            'total_electors',
            'total_attended',
            'pending_count',
            'attendance_percentage',
            'hourly_breakdown',
            'last_updated',
        ]
    
    def get_pending_count(self, obj):
        """Calculate pending electors."""
        return obj.total_electors - obj.total_attended

