"""
Attendance tracking models for election voting day.
"""
import re
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils.html import strip_tags
from django.utils.safestring import mark_safe


class Attendance(models.Model):
    """
    Elector attendance record for voting day.
    
    Records when an elector arrives to vote, who marked their attendance,
    and which committee they voted at.
    """
    
    # Who attended
    class Status(models.TextChoices):
        ATTENDED = 'ATTENDED', 'Attended'
        PENDING = 'PENDING', 'Pending'
    
    elector = models.ForeignKey(
        'electors.Elector',
        on_delete=models.CASCADE,
        related_name='attendance_records',
        help_text='Elector attendance record (multiple entries allowed)'
    )
    
    # Which committee
    committee = models.ForeignKey(
        'elections.Committee',
        on_delete=models.CASCADE,
        related_name='attendances',
        help_text='Committee where elector attended'
    )
    
    # Who recorded this attendance
    marked_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='attendances_marked',
        help_text='User who marked this attendance'
    )
    
    # When they attended
    attended_at = models.DateTimeField(
        auto_now_add=True,
        help_text='Timestamp when attendance was marked'
    )
    
    # Optional notes
    notes = models.TextField(
        blank=True,
        help_text='Any special notes or issues during attendance'
    )
    
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ATTENDED,
        db_index=True,
        help_text='Attendance status (attended or pending)'
    )
    
    # Device tracking (optional)
    device_info = models.JSONField(
        default=dict,
        blank=True,
        help_text='Device info (mobile/desktop, IP, location if available)'
    )
    
    class Meta:
        db_table = 'attendance'
        verbose_name = 'Attendance'
        verbose_name_plural = 'Attendances'
        ordering = ['-attended_at']
        indexes = [
            models.Index(fields=['committee', '-attended_at']),
            models.Index(fields=['marked_by']),
            models.Index(fields=['-attended_at']),
            models.Index(fields=['elector']),
        ]
    
    def __str__(self):
        return f"{self.elector.koc_id} - {self.elector.full_name} attended at {self.attended_at}"
    
    def clean(self):
        """Validate attendance record."""
        skip_committee_validation = getattr(self, '_skip_committee_validation', False)
        
        # Ensure elector is assigned to the committee
        if (
            not skip_committee_validation
            and self.status == self.Status.ATTENDED
            and self.elector.committee != self.committee
        ):
            raise ValidationError(
                f"Elector {self.elector.koc_id} is assigned to committee "
                f"{self.elector.committee.code}, not {self.committee.code}"
            )
        
        # Validate and sanitize notes
        if self.notes:
            # Remove HTML tags and limit length
            self.notes = strip_tags(self.notes)[:1000]
        
        # Validate device_info structure
        if self.device_info:
            # Ensure device_info is a dict
            if not isinstance(self.device_info, dict):
                self.device_info = {}
            
            # Validate and sanitize IP address
            if 'ip_address' in self.device_info:
                ip = self.device_info['ip_address']
                # Basic IP validation (IPv4 or IPv6)
                if ip and isinstance(ip, str):
                    ip_pattern = re.compile(
                        r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|'
                        r'^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$'
                    )
                    if not ip_pattern.match(ip):
                        self.device_info['ip_address'] = None
                elif ip is None:
                    # Keep None if already None
                    pass
                else:
                    # Invalid type, set to None
                    self.device_info['ip_address'] = None
            
            # Validate and sanitize user agent
            if 'user_agent' in self.device_info:
                ua = self.device_info['user_agent']
                if ua and len(ua) > 255:
                    self.device_info['user_agent'] = ua[:255]
    
    def save(self, *args, **kwargs):
        """Override save to validate before saving."""
        self.full_clean()
        super().save(*args, **kwargs)


class AttendanceStatistics(models.Model):
    """
    Cached statistics for committee attendance.
    Updated periodically for performance.
    """
    
    committee = models.OneToOneField(
        'elections.Committee',
        on_delete=models.CASCADE,
        related_name='attendance_stats',
        primary_key=True
    )
    
    total_electors = models.IntegerField(
        default=0,
        help_text='Total electors assigned to this committee'
    )
    total_attended = models.IntegerField(
        default=0,
        help_text='Total electors who have attended'
    )
    
    # Hourly breakdown
    hourly_breakdown = models.JSONField(
        default=dict,
        help_text='Attendance count by hour: {hour: count}'
    )
    
    # Last update
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'attendance_statistics'
        verbose_name = 'Attendance Statistics'
        verbose_name_plural = 'Attendance Statistics'
    
    def __str__(self):
        return f"Stats for {self.committee.code}: {self.total_attended}/{self.total_electors}"
    
    @property
    def attendance_percentage(self):
        """Calculate attendance percentage."""
        if self.total_electors == 0:
            return 0
        return round((self.total_attended / self.total_electors) * 100, 2)
    
    def update_statistics(self):
        """Refresh statistics from database with optimized queries."""
        from django.db.models import Count
        from django.db.models.functions import ExtractHour
        
        # Optimized: Get total electors for this committee (single query)
        self.total_electors = self.committee.electors.filter(is_active=True).count()
        
        # Optimized: Get attendance counts with select_related to avoid N+1
        attendances = Attendance.objects.filter(
            committee=self.committee,
            status=Attendance.Status.ATTENDED
        ).select_related('elector', 'committee')
        
        # Use single aggregation query for both count and hourly breakdown
        attendance_data = attendances.aggregate(
            total_count=Count('id')
        )
        self.total_attended = attendance_data['total_count']
        
        # Calculate hourly breakdown in single query
        hourly = attendances.annotate(
            hour=ExtractHour('attended_at')
        ).values('hour').annotate(count=Count('id')).order_by('hour')
        
        self.hourly_breakdown = {
            str(item['hour']): item['count'] for item in hourly
        }
        
        self.save(update_fields=['total_electors', 'total_attended', 'hourly_breakdown', 'last_updated'])

