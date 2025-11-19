"""
Admin configuration for election management.
"""
from django.contrib import admin
from .models import Election, Committee


@admin.register(Election)
class ElectionAdmin(admin.ModelAdmin):
    """Admin for Election model."""
    
    list_display = [
        'name',
        'status',
        'voting_mode',
        'election_date',
        'created_by',
        'created_at'
    ]
    list_filter = ['status', 'voting_mode', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at', 'created_by']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'status')
        }),
        ('Voting Configuration', {
            'fields': (
                'voting_mode',
                'max_candidates_per_ballot',
                'allow_partial_voting',
                'minimum_votes_required'
            )
        }),
        ('Important Dates', {
            'fields': ('election_date',)
        }),
        ('Audit Information', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Committee)
class CommitteeAdmin(admin.ModelAdmin):
    """Admin for Committee model."""
    
    list_display = [
        'code',
        'name',
        'gender',
        'elector_count',
        'attendance_count',
        'attendance_percentage'
    ]
    list_filter = ['election', 'gender', 'created_at']
    search_fields = ['code', 'name']
    readonly_fields = [
        'created_at',
        'updated_at',
        'elector_count',
        'attendance_count',
        'attendance_percentage'
    ]
    filter_horizontal = ['assigned_users']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('election', 'code', 'name', 'gender', 'location')
        }),
        ('Staff Assignment', {
            'fields': ('assigned_users',)
        }),
        ('Statistics', {
            'fields': (
                'elector_count',
                'attendance_count',
                'attendance_percentage'
            ),
            'classes': ('collapse',)
        }),
        ('Audit Information', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def attendance_percentage(self, obj):
        """Display attendance percentage."""
        return f"{obj.attendance_percentage}%"
    attendance_percentage.short_description = 'Attendance %'

