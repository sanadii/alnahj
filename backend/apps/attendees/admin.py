"""
Admin configuration for attendance management.
"""
from django.contrib import admin
from .models import Attendance, AttendanceStatistics


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    """Admin for Attendance model."""
    
    list_display = [
        'elector_koc_id',
        'elector_name',
        'committee_code',
        'attended_at',
        'marked_by_name'
    ]
    list_filter = ['committee', 'attended_at', 'marked_by']
    search_fields = [
        'elector__koc_id',
        'elector__name_first',
        'elector__family_name',
        'committee__code'
    ]
    readonly_fields = ['attended_at']
    date_hierarchy = 'attended_at'
    
    def elector_koc_id(self, obj):
        """Display elector KOC ID."""
        return obj.elector.koc_id
    elector_koc_id.short_description = 'KOC ID'
    
    def elector_name(self, obj):
        """Display elector name."""
        return obj.elector.full_name
    elector_name.short_description = 'Elector Name'
    
    def committee_code(self, obj):
        """Display committee code."""
        return obj.committee.code
    committee_code.short_description = 'Committee'
    
    def marked_by_name(self, obj):
        """Display user who marked attendance."""
        return obj.marked_by.full_name if obj.marked_by else '-'
    marked_by_name.short_description = 'Marked By'


@admin.register(AttendanceStatistics)
class AttendanceStatisticsAdmin(admin.ModelAdmin):
    """Admin for Attendance Statistics."""
    
    list_display = [
        'committee_code',
        'total_electors',
        'total_attended',
        'attendance_percentage',
        'last_updated'
    ]
    readonly_fields = [
        'total_electors',
        'total_attended',
        'hourly_breakdown',
        'last_updated',
        'attendance_percentage'
    ]
    
    def committee_code(self, obj):
        """Display committee code."""
        return obj.committee.code
    committee_code.short_description = 'Committee'
    
    def attendance_percentage(self, obj):
        """Display attendance percentage."""
        return f"{obj.attendance_percentage}%"
    attendance_percentage.short_description = 'Attendance %'

