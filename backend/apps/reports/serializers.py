"""
Serializers for reports and analytics.
"""
from rest_framework import serializers
from .models import (
    ReportTemplate,
    GeneratedReport,
    DashboardWidget,
    AnalyticsSnapshot,
    CampaignFinanceSnapshot,
)


class ReportTemplateSerializer(serializers.ModelSerializer):
    """Serializer for report templates."""
    
    created_by_name = serializers.SerializerMethodField()
    report_type_display = serializers.CharField(
        source='get_report_type_display',
        read_only=True
    )
    
    class Meta:
        model = ReportTemplate
        fields = [
            'id',
            'name',
            'report_type',
            'report_type_display',
            'description',
            'parameters',
            'is_active',
            'created_by',
            'created_by_name',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by']
    
    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.full_name
        return None


class GeneratedReportSerializer(serializers.ModelSerializer):
    """Serializer for generated reports."""
    
    generated_by_name = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    format_display = serializers.CharField(source='get_format_display', read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = GeneratedReport
        fields = [
            'id',
            'template',
            'title',
            'report_type',
            'format',
            'format_display',
            'status',
            'status_display',
            'parameters',
            'data',
            'file',
            'error_message',
            'generated_by',
            'generated_by_name',
            'generated_at',
            'expires_at',
            'is_expired',
            'created_at',
        ]
        read_only_fields = ['id', 'status', 'generated_at', 'created_at']
    
    def get_generated_by_name(self, obj):
        if obj.generated_by:
            return obj.generated_by.full_name
        return None


class DashboardWidgetSerializer(serializers.ModelSerializer):
    """Serializer for dashboard widgets."""
    
    widget_type_display = serializers.CharField(
        source='get_widget_type_display',
        read_only=True
    )
    
    class Meta:
        model = DashboardWidget
        fields = [
            'id',
            'title',
            'widget_type',
            'widget_type_display',
            'data_source',
            'configuration',
            'position_x',
            'position_y',
            'width',
            'height',
            'is_visible',
            'order',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AnalyticsSnapshotSerializer(serializers.ModelSerializer):
    """Serializer for analytics snapshots."""
    
    snapshot_type_display = serializers.CharField(
        source='get_snapshot_type_display',
        read_only=True
    )
    
    class Meta:
        model = AnalyticsSnapshot
        fields = [
            'id',
            'snapshot_type',
            'snapshot_type_display',
            'snapshot_date',
            'metrics',
            'notes',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class CampaignFinanceSnapshotSerializer(serializers.ModelSerializer):
    """Serializer for campaign finance snapshots."""

    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = CampaignFinanceSnapshot
        fields = [
            'id',
            'total_budget',
            'committed_budget',
            'spent_budget',
            'available_budget',
            'burn_rate',
            'period_start',
            'period_end',
            'notes',
            'created_by',
            'created_by_name',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'created_by']

    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.full_name
        return None


# Dashboard Data Serializers


class AdminDashboardSerializer(serializers.Serializer):
    """Serializer for admin dashboard data."""

    overview = serializers.DictField()
    system_overview = serializers.DictField(required=False)
    guarantees = serializers.DictField()
    attendance = serializers.DictField()
    users = serializers.DictField()
    committees = serializers.ListField()
    recent_activity = serializers.ListField()
    trends = serializers.DictField()
    budget_overview = serializers.DictField(required=False)
    resource_overview = serializers.DictField(required=False)
    performance_forecast = serializers.DictField(required=False)


class SupervisorDashboardSerializer(serializers.Serializer):
    """Serializer for supervisor dashboard data."""
    
    team_overview = serializers.DictField()
    team_guarantees = serializers.DictField()
    team_members = serializers.ListField()
    team_progress = serializers.DictField()
    recent_activity = serializers.ListField()


class PersonalDashboardSerializer(serializers.Serializer):
    """Serializer for personal dashboard data."""
    
    my_guarantees = serializers.DictField()
    my_groups = serializers.ListField()
    recent_guarantees = serializers.ListField()
    quick_stats = serializers.DictField()


# Report Data Serializers

class CoverageReportSerializer(serializers.Serializer):
    """Serializer for coverage report data."""
    
    summary = serializers.DictField()
    by_committee = serializers.ListField()
    by_section = serializers.ListField()
    by_user = serializers.ListField()
    coverage_gaps = serializers.ListField()
    recommendations = serializers.ListField()


class AccuracyReportSerializer(serializers.Serializer):
    """Serializer for accuracy report data."""
    
    summary = serializers.DictField()
    by_status = serializers.DictField()
    by_user = serializers.ListField()
    accuracy_metrics = serializers.DictField()
    predictions_vs_actual = serializers.ListField()


class CommitteePerformanceSerializer(serializers.Serializer):
    """Serializer for committee performance data."""
    
    committee_stats = serializers.ListField()
    attendance_rates = serializers.DictField()
    guarantee_distribution = serializers.ListField()
    performance_comparison = serializers.DictField()


class UserActivitySerializer(serializers.Serializer):
    """Serializer for user activity data."""
    
    active_users = serializers.IntegerField()
    user_stats = serializers.ListField()
    activity_timeline = serializers.ListField()
    top_performers = serializers.ListField()


class ExportRequestSerializer(serializers.Serializer):
    """Serializer for export requests."""
    
    report_type = serializers.ChoiceField(
        choices=[
            'COVERAGE',
            'GUARANTEE_COVERAGE',
            'ACCURACY',
            'GUARANTEE_ACCURACY',
            'COMMITTEE_PERFORMANCE',
        ],
        required=True
    )
    
    format = serializers.ChoiceField(
        choices=['CSV', 'EXCEL', 'PDF'],
        required=True
    )
    
    parameters = serializers.DictField(
        required=False,
        default=dict
    )
    
    include_charts = serializers.BooleanField(
        default=False,
        help_text='Include charts in PDF export'
    )


class ChartDataSerializer(serializers.Serializer):
    """Serializer for chart data."""
    
    chart_type = serializers.ChoiceField(
        choices=['PIE', 'BAR', 'LINE', 'AREA', 'DONUT'],
        required=True
    )
    
    title = serializers.CharField(required=True)
    labels = serializers.ListField(child=serializers.CharField())
    datasets = serializers.ListField()
    options = serializers.DictField(required=False, default=dict)

