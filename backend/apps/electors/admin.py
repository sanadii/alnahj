"""
Admin configuration for elector management.
"""
from django.contrib import admin
from .models import Elector


@admin.register(Elector)
class ElectorAdmin(admin.ModelAdmin):
    """Admin for Elector model."""
    
    list_display = [
        'koc_id',
        'full_name',
        'section',
        'committee',
        'mobile',
        'gender',
        'is_active',
        'is_approved',
        'created_by'
    ]
    list_filter = [
        'committee',
        'gender',
        'is_active',
        'is_approved',
        'created_by',
        'department',
        'team',
        'created_at'
    ]
    search_fields = [
        'koc_id',
        'name_first',
        'family_name',
        'sub_family_name',
        'mobile',
        'section',
        'designation',
        'department',
        'team'
    ]
    readonly_fields = ['created_at', 'updated_at', 'full_name', 'created_by']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('koc_id', 'full_name', 'gender')
        }),
        ('Name Components', {
            'fields': (
                'name_first',
                'name_second',
                'name_third',
                'name_fourth',
                'name_fifth',
                'sub_family_name',
                'family_name'
            ),
            'classes': ('collapse',)
        }),
        ('Work Information', {
            'fields': (
                'designation',
                'section',
                'extension'
            )
        }),
        ('Contact Information', {
            'fields': ('mobile',)
        }),
        ('Organizational', {
            'fields': ('area', 'department', 'team', 'committee')
        }),
        ('Status', {
            'fields': ('is_active', 'is_approved', 'created_by')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def full_name(self, obj):
        """Display full name."""
        return obj.full_name
    full_name.short_description = 'Full Name'

