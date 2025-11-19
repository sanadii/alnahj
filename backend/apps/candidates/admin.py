"""
Django admin configuration for candidates and parties.
"""
from django.contrib import admin
from .models import Party, Candidate


@admin.register(Party)
class PartyAdmin(admin.ModelAdmin):
    """Admin for Party model."""
    
    list_display = [
        'name',
        'election',
        'color',
        'candidate_count',
        'is_active',
        'created_at'
    ]
    list_filter = ['election', 'is_active']
    search_fields = ['name']
    readonly_fields = ['created_at', 'updated_at', 'candidate_count']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('election', 'name', 'color')
        }),
        ('Details', {
            'fields': ('description', 'is_active')
        }),
        ('Statistics', {
            'fields': ('candidate_count',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    """Admin for Candidate model."""
    
    list_display = [
        'candidate_number',
        'name',
        'election',
        'party',
        'is_active',
        'total_votes',
        'created_at'
    ]
    list_filter = ['election', 'party', 'is_active']
    search_fields = [
        'candidate_number',
        'name'
    ]
    readonly_fields = ['created_at', 'updated_at', 'total_votes', 'vote_percentage']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('election', 'name', 'candidate_number')
        }),
        ('Party Affiliation', {
            'fields': ('party',)
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Vote Statistics', {
            'fields': ('total_votes', 'vote_percentage'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Optimize queryset."""
        return super().get_queryset(request).select_related(
            'election',
            'party'
        )

