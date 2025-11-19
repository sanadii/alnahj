"""
Admin configuration for voting management.

Note: Candidate and Party models have been moved to apps.candidates
and are registered in that app's admin.
"""
from django.contrib import admin
from .models import VoteCount, CommitteeVoteEntry, ElectionResults, VoteCountAudit


@admin.register(VoteCount)
class VoteCountAdmin(admin.ModelAdmin):
    """Admin for VoteCount model."""
    
    list_display = [
        'committee',
        'candidate',
        'vote_count',
        'status',
        'is_verified',
        'entered_by',
        'verified_by',
        'created_at'
    ]
    list_filter = ['election', 'committee', 'status', 'is_verified', 'created_at']
    search_fields = [
        'candidate__name',
        'committee__code',
        'notes'
    ]
    readonly_fields = ['created_at', 'updated_at', 'verified_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Vote Information', {
            'fields': ('election', 'committee', 'candidate', 'vote_count', 'status')
        }),
        ('Verification', {
            'fields': ('is_verified', 'verified_by', 'verified_at')
        }),
        ('Entry Information', {
            'fields': ('entered_by', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['verify_vote_counts']
    
    def verify_vote_counts(self, request, queryset):
        """Admin action to verify vote counts."""
        count = 0
        for vote_count in queryset:
            if not vote_count.is_verified:
                vote_count.verify(request.user)
                count += 1
        
        self.message_user(request, f'Successfully verified {count} vote counts')
    verify_vote_counts.short_description = 'Verify selected vote counts'


@admin.register(CommitteeVoteEntry)
class CommitteeVoteEntryAdmin(admin.ModelAdmin):
    """Admin for CommitteeVoteEntry model."""
    
    list_display = [
        'committee',
        'election',
        'status',
        'total_ballots_cast',
        'valid_ballots',
        'invalid_ballots',
        'completion_percentage',
        'entered_by',
        'verified_by',
        'created_at'
    ]
    list_filter = ['election', 'status', 'created_at']
    search_fields = ['committee__code', 'committee__name', 'notes']
    readonly_fields = ['created_at', 'updated_at', 'completed_at', 'verified_at', 'completion_percentage']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('election', 'committee', 'status')
        }),
        ('Ballot Information', {
            'fields': ('total_ballots_cast', 'valid_ballots', 'invalid_ballots')
        }),
        ('Entry Details', {
            'fields': ('entered_by', 'completed_at', 'completion_percentage')
        }),
        ('Verification', {
            'fields': ('verified_by', 'verified_at')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['verify_entries']
    
    def verify_entries(self, request, queryset):
        """Admin action to verify entries."""
        count = 0
        for entry in queryset:
            if entry.status != 'VERIFIED':
                entry.verify(request.user)
                count += 1
        
        self.message_user(request, f'Successfully verified {count} entries')
    verify_entries.short_description = 'Verify selected entries'


@admin.register(ElectionResults)
class ElectionResultsAdmin(admin.ModelAdmin):
    """Admin for ElectionResults model."""
    
    list_display = [
        'election',
        'status',
        'total_ballots_cast',
        'total_valid_ballots',
        'turnout_percentage',
        'generated_by',
        'generated_at',
        'published_at'
    ]
    list_filter = ['status', 'generated_at', 'published_at']
    search_fields = ['election__name']
    readonly_fields = [
        'total_registered_electors',
        'total_attendance',
        'total_ballots_cast',
        'total_valid_ballots',
        'total_invalid_ballots',
        'turnout_percentage',
        'generated_by',
        'generated_at',
        'published_by',
        'published_at',
        'created_at',
        'updated_at'
    ]
    
    fieldsets = (
        ('Election', {
            'fields': ('election', 'status')
        }),
        ('Totals', {
            'fields': (
                'total_registered_electors',
                'total_attendance',
                'total_ballots_cast',
                'total_valid_ballots',
                'total_invalid_ballots',
                'turnout_percentage'
            )
        }),
        ('Results Data', {
            'fields': ('results_data',),
            'classes': ('collapse',)
        }),
        ('Generation', {
            'fields': ('generated_by', 'generated_at')
        }),
        ('Publication', {
            'fields': ('published_by', 'published_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['generate_results', 'publish_results']
    
    def generate_results(self, request, queryset):
        """Admin action to generate results."""
        for results in queryset:
            results.generate_results()
        
        self.message_user(request, 'Successfully generated results')
    generate_results.short_description = 'Generate results'
    
    def publish_results(self, request, queryset):
        """Admin action to publish results."""
        count = 0
        for results in queryset:
            if results.status != 'PUBLISHED':
                results.publish(request.user)
                count += 1
        
        self.message_user(request, f'Successfully published {count} results')
    publish_results.short_description = 'Publish results'


@admin.register(VoteCountAudit)
class VoteCountAuditAdmin(admin.ModelAdmin):
    """Admin for VoteCountAudit model."""
    
    list_display = [
        'vote_count',
        'action',
        'user',
        'old_value',
        'new_value',
        'created_at'
    ]
    list_filter = ['action', 'created_at']
    search_fields = [
        'vote_count__candidate__name',
        'vote_count__committee__code',
        'notes'
    ]
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Audit Information', {
            'fields': ('vote_count', 'action', 'user')
        }),
        ('Changes', {
            'fields': ('old_value', 'new_value', 'notes')
        }),
        ('Metadata', {
            'fields': ('ip_address', 'created_at')
        }),
    )
    
    def has_add_permission(self, request):
        """Prevent manual creation."""
        return False
    
    def has_change_permission(self, request, obj=None):
        """Prevent editing."""
        return False
    
    def has_delete_permission(self, request, obj=None):
        """Prevent deletion."""
        return False

