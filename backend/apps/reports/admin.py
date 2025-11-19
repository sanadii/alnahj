"""
Admin configuration for reports management.
"""
from django.contrib import admin
from .models import (
    ReportTemplate,
    GeneratedReport,
    DashboardWidget,
    AnalyticsSnapshot,
    CampaignFinanceSnapshot
)


@admin.register(ReportTemplate)
class ReportTemplateAdmin(admin.ModelAdmin):
    """Admin for ReportTemplate model."""
    
    list_display = [
        'name',
        'report_type',
        'is_active',
        'created_by',
        'created_at'
    ]
    list_filter = ['report_type', 'is_active', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'report_type', 'description', 'is_active')
        }),
        ('Configuration', {
            'fields': ('parameters',)
        }),
        ('Audit', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(GeneratedReport)
class GeneratedReportAdmin(admin.ModelAdmin):
    """Admin for GeneratedReport model."""
    
    list_display = [
        'title',
        'report_type',
        'format',
        'status',
        'generated_by',
        'generated_at',
        'is_expired'
    ]
    list_filter = ['report_type', 'format', 'status', 'generated_at']
    search_fields = ['title', 'report_type']
    readonly_fields = ['generated_at', 'created_at', 'is_expired']
    date_hierarchy = 'generated_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('template', 'title', 'report_type', 'format', 'status')
        }),
        ('Parameters', {
            'fields': ('parameters',),
            'classes': ('collapse',)
        }),
        ('Data', {
            'fields': ('data', 'file'),
            'classes': ('collapse',)
        }),
        ('Error Info', {
            'fields': ('error_message',),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': (
                'generated_by',
                'generated_at',
                'expires_at',
                'is_expired',
                'created_at'
            ),
            'classes': ('collapse',)
        }),
    )
    
    def is_expired(self, obj):
        return obj.is_expired
    is_expired.boolean = True
    is_expired.short_description = 'Expired'


@admin.register(DashboardWidget)
class DashboardWidgetAdmin(admin.ModelAdmin):
    """Admin for DashboardWidget model."""
    
    list_display = [
        'title',
        'user',
        'widget_type',
        'is_visible',
        'order',
        'created_at'
    ]
    list_filter = ['widget_type', 'is_visible', 'user']
    search_fields = ['title', 'user__email']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'title', 'widget_type', 'data_source')
        }),
        ('Configuration', {
            'fields': ('configuration',)
        }),
        ('Layout', {
            'fields': (
                'position_x',
                'position_y',
                'width',
                'height',
                'order',
                'is_visible'
            )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(AnalyticsSnapshot)
class AnalyticsSnapshotAdmin(admin.ModelAdmin):
    """Admin for AnalyticsSnapshot model."""
    
    list_display = [
        'snapshot_type',
        'snapshot_date',
        'created_at',
        'metrics_preview'
    ]
    list_filter = ['snapshot_type', 'snapshot_date']
    search_fields = ['notes']
    readonly_fields = ['created_at']
    date_hierarchy = 'snapshot_date'
    
    fieldsets = (
        ('Snapshot Info', {
            'fields': ('snapshot_type', 'snapshot_date', 'notes')
        }),
        ('Metrics', {
            'fields': ('metrics',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def metrics_preview(self, obj):
        """Display key metrics preview."""
        metrics = obj.metrics
        return f"Users: {metrics.get('total_users', 0)}, Guarantees: {metrics.get('total_guarantees', 0)}, Coverage: {metrics.get('elector_coverage', 0)}%"
    metrics_preview.short_description = 'Metrics Preview'
    
    actions = ['create_new_snapshot']
    
    def create_new_snapshot(self, request, queryset):
        """Admin action to create new snapshot."""
        snapshot = AnalyticsSnapshot.create_snapshot('ON_DEMAND')
        self.message_user(request, f'Successfully created snapshot for {snapshot.snapshot_date}')
    create_new_snapshot.short_description = 'Create new analytics snapshot'


@admin.register(CampaignFinanceSnapshot)
class CampaignFinanceSnapshotAdmin(admin.ModelAdmin):
    """Admin configuration for finance snapshots."""

    list_display = [
        'period_start',
        'period_end',
        'total_budget',
        'committed_budget',
        'spent_budget',
        'available_budget',
        'burn_rate',
        'created_at',
        'created_by'
    ]
    list_filter = ['period_start', 'period_end', 'created_by']
    search_fields = ['notes']
    readonly_fields = ['created_at']

    fieldsets = (
        ('Reporting Period', {
            'fields': ('period_start', 'period_end')
        }),
        ('Budget Summary', {
            'fields': (
                'total_budget',
                'committed_budget',
                'spent_budget',
                'available_budget',
                'burn_rate'
            )
        }),
        ('Additional Information', {
            'fields': ('notes',)
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at'),
            'classes': ('collapse',)
        })
    )

