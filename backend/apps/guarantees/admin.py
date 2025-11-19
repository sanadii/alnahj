"""
Admin configuration for guarantee management.
"""
from django.contrib import admin
from .models import GuaranteeGroup, Guarantee, GuaranteeNote, GuaranteeHistory


@admin.register(GuaranteeGroup)
class GuaranteeGroupAdmin(admin.ModelAdmin):
    """Admin for GuaranteeGroup model."""
    
    list_display = [
        'name',
        'user',
        'color',
        'order',
        'guarantee_count',
        'created_at'
    ]
    list_filter = ['user', 'created_at']
    search_fields = ['name', 'user__email', 'description']
    readonly_fields = ['created_at', 'updated_at', 'guarantee_count']
    ordering = ['user', 'order', 'name']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'name', 'color', 'description')
        }),
        ('Display', {
            'fields': ('order',)
        }),
        ('Statistics', {
            'fields': ('guarantee_count',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def guarantee_count(self, obj):
        """Display guarantee count."""
        return obj.guarantees.count()
    guarantee_count.short_description = 'Guarantees'


@admin.register(Guarantee)
class GuaranteeAdmin(admin.ModelAdmin):
    """Admin for Guarantee model."""
    
    list_display = [
        'user',
        'elector',
        'guarantee_status',
        'confirmation_status',
        'group',
        'created_at'
    ]
    list_filter = [
        'guarantee_status',
        'confirmation_status',
        'group',
        'user',
        'created_at'
    ]
    search_fields = [
        'user__email',
        'elector__koc_id',
        'elector__name_first',
        'elector__family_name',
        'quick_note'
    ]
    readonly_fields = [
        'created_at',
        'updated_at',
        'has_notes',
        'note_count'
    ]
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'elector', 'guarantee_status', 'confirmation_status', 'group')
        }),
        ('Contact Information', {
            'fields': ('mobile',)
        }),
        ('Notes', {
            'fields': (
                'quick_note',
            )
        }),
        ('Statistics', {
            'fields': ('has_notes', 'note_count'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
@admin.register(GuaranteeNote)
class GuaranteeNoteAdmin(admin.ModelAdmin):
    """Admin for GuaranteeNote model."""
    
    list_display = [
        'guarantee',
        'user',
        'content_preview',
        'is_important',
        'created_at'
    ]
    list_filter = ['is_important', 'created_at', 'user']
    search_fields = [
        'content',
        'guarantee__elector__koc_id',
        'guarantee__elector__name_first',
        'user__email'
    ]
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Note Information', {
            'fields': ('guarantee', 'user', 'content', 'is_important')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def content_preview(self, obj):
        """Display content preview."""
        return obj.content[:100] + '...' if len(obj.content) > 100 else obj.content
    content_preview.short_description = 'Content'


@admin.register(GuaranteeHistory)
class GuaranteeHistoryAdmin(admin.ModelAdmin):
    """Admin for GuaranteeHistory model."""
    
    list_display = [
        'guarantee',
        'user',
        'action',
        'description_preview',
        'created_at'
    ]
    list_filter = ['action', 'created_at', 'user']
    search_fields = [
        'guarantee__elector__koc_id',
        'guarantee__elector__name_first',
        'user__email',
        'description'
    ]
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('History Information', {
            'fields': ('guarantee', 'user', 'action', 'description')
        }),
        ('Changes', {
            'fields': ('old_value', 'new_value'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def description_preview(self, obj):
        """Display description preview."""
        return obj.description[:100] + '...' if len(obj.description) > 100 else obj.description
    description_preview.short_description = 'Description'
    
    def has_add_permission(self, request):
        """Prevent manual creation."""
        return False
    
    def has_change_permission(self, request, obj=None):
        """Prevent editing."""
        return False



