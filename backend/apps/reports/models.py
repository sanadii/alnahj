"""
Reports and analytics models.
Stores report configurations and cached report data.
"""
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ValidationError
from decimal import Decimal
import json


class ReportTemplate(models.Model):
    """
    Report template configurations.
    Defines report types and their parameters.
    """
    
    REPORT_TYPE_CHOICES = [
        ('GUARANTEE_COVERAGE', 'Guarantee Coverage Report'),
        ('GUARANTEE_ACCURACY', 'Guarantee Accuracy Report'),
        ('COMMITTEE_PERFORMANCE', 'Committee Performance Report'),
        ('USER_ACTIVITY', 'User Activity Report'),
        ('ATTENDANCE_ANALYSIS', 'Attendance Analysis Report'),
        ('ELECTOR_DISTRIBUTION', 'Elector Distribution Report'),
        ('TEAM_COMPARISON', 'Team Comparison Report'),
        ('CUSTOM', 'Custom Report'),
    ]
    
    name = models.CharField(
        max_length=200,
        help_text='Report template name'
    )
    
    report_type = models.CharField(
        max_length=50,
        choices=REPORT_TYPE_CHOICES,
        help_text='Type of report'
    )
    
    description = models.TextField(
        blank=True,
        help_text='Report description'
    )
    
    parameters = models.JSONField(
        default=dict,
        help_text='Report parameters as JSON'
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text='Is this template active?'
    )
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='report_templates',
        help_text='User who created this template'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'report_templates'
        ordering = ['name']
        verbose_name = 'Report Template'
        verbose_name_plural = 'Report Templates'
        indexes = [
            models.Index(fields=['report_type']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.get_report_type_display()})"


class GeneratedReport(models.Model):
    """
    Store generated reports for caching and history.
    """
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('GENERATING', 'Generating'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ]
    
    FORMAT_CHOICES = [
        ('JSON', 'JSON'),
        ('CSV', 'CSV'),
        ('EXCEL', 'Excel'),
        ('PDF', 'PDF'),
    ]
    
    template = models.ForeignKey(
        ReportTemplate,
        on_delete=models.CASCADE,
        related_name='generated_reports',
        null=True,
        blank=True,
        help_text='Report template used (optional)'
    )
    
    title = models.CharField(
        max_length=200,
        help_text='Report title'
    )
    
    report_type = models.CharField(
        max_length=50,
        help_text='Type of report'
    )
    
    format = models.CharField(
        max_length=10,
        choices=FORMAT_CHOICES,
        default='JSON',
        help_text='Report format'
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING',
        help_text='Generation status'
    )
    
    parameters = models.JSONField(
        default=dict,
        help_text='Parameters used to generate report'
    )
    
    data = models.JSONField(
        default=dict,
        help_text='Report data (for JSON format)'
    )
    
    file = models.FileField(
        upload_to='reports/%Y/%m/',
        null=True,
        blank=True,
        help_text='Generated file (CSV, Excel, PDF)'
    )
    
    error_message = models.TextField(
        blank=True,
        help_text='Error message if generation failed'
    )
    
    generated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='generated_reports',
        help_text='User who generated this report'
    )
    
    generated_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When report was generated'
    )
    
    expires_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When report cache expires'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'generated_reports'
        ordering = ['-created_at']
        verbose_name = 'Generated Report'
        verbose_name_plural = 'Generated Reports'
        indexes = [
            models.Index(fields=['report_type']),
            models.Index(fields=['status']),
            models.Index(fields=['generated_by']),
            models.Index(fields=['-created_at']),
            models.Index(fields=['expires_at']),
        ]
    
    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"
    
    @property
    def is_expired(self):
        """Check if report cache is expired."""
        if not self.expires_at:
            return False
        return timezone.now() > self.expires_at
    
    def set_data(self, data_dict):
        """Set report data and mark as completed."""
        self.data = data_dict
        self.status = 'COMPLETED'
        self.generated_at = timezone.now()
        self.save(update_fields=['data', 'status', 'generated_at'])


class DashboardWidget(models.Model):
    """
    Dashboard widget configurations.
    Users can customize their dashboard.
    """
    
    WIDGET_TYPE_CHOICES = [
        ('STAT_CARD', 'Statistic Card'),
        ('PIE_CHART', 'Pie Chart'),
        ('BAR_CHART', 'Bar Chart'),
        ('LINE_CHART', 'Line Chart'),
        ('TABLE', 'Data Table'),
        ('RECENT_ACTIVITY', 'Recent Activity'),
        ('PROGRESS_BAR', 'Progress Bar'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='dashboard_widgets',
        help_text='Widget owner'
    )
    
    title = models.CharField(
        max_length=100,
        help_text='Widget title'
    )
    
    widget_type = models.CharField(
        max_length=20,
        choices=WIDGET_TYPE_CHOICES,
        help_text='Type of widget'
    )
    
    data_source = models.CharField(
        max_length=100,
        help_text='Data source endpoint'
    )
    
    configuration = models.JSONField(
        default=dict,
        help_text='Widget configuration (colors, size, etc.)'
    )
    
    position_x = models.IntegerField(
        default=0,
        help_text='X position on dashboard grid'
    )
    
    position_y = models.IntegerField(
        default=0,
        help_text='Y position on dashboard grid'
    )
    
    width = models.IntegerField(
        default=4,
        help_text='Widget width (grid units)'
    )
    
    height = models.IntegerField(
        default=2,
        help_text='Widget height (grid units)'
    )
    
    is_visible = models.BooleanField(
        default=True,
        help_text='Is widget visible?'
    )
    
    order = models.IntegerField(
        default=0,
        help_text='Display order'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'dashboard_widgets'
        ordering = ['order', 'position_y', 'position_x']
        verbose_name = 'Dashboard Widget'
        verbose_name_plural = 'Dashboard Widgets'
        indexes = [
            models.Index(fields=['user', 'order']),
            models.Index(fields=['user', 'is_visible']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.title}"


class AnalyticsSnapshot(models.Model):
    """
    Periodic snapshots of key metrics.
    Used for historical trending and comparisons.
    """
    
    SNAPSHOT_TYPE_CHOICES = [
        ('DAILY', 'Daily Snapshot'),
        ('WEEKLY', 'Weekly Snapshot'),
        ('MONTHLY', 'Monthly Snapshot'),
        ('ON_DEMAND', 'On-Demand Snapshot'),
    ]
    
    snapshot_type = models.CharField(
        max_length=20,
        choices=SNAPSHOT_TYPE_CHOICES,
        help_text='Type of snapshot'
    )
    
    snapshot_date = models.DateField(
        help_text='Date of snapshot'
    )
    
    metrics = models.JSONField(
        default=dict,
        help_text='Snapshot metrics as JSON'
    )
    
    notes = models.TextField(
        blank=True,
        help_text='Optional notes'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'analytics_snapshots'
        ordering = ['-snapshot_date']
        verbose_name = 'Analytics Snapshot'
        verbose_name_plural = 'Analytics Snapshots'
        unique_together = ['snapshot_type', 'snapshot_date']
        indexes = [
            models.Index(fields=['snapshot_type', '-snapshot_date']),
        ]
    
    def __str__(self):
        return f"{self.get_snapshot_type_display()} - {self.snapshot_date}"
    
    @staticmethod
    def create_snapshot(snapshot_type='DAILY'):
        """
        Create a new analytics snapshot with current metrics.
        """
        from apps.guarantees.models import Guarantee
        from apps.electors.models import Elector
        from apps.attendees.models import Attendance
        from apps.account.models import CustomUser
        
        today = timezone.now().date()
        
        metrics = {
            # User metrics
            'total_users': CustomUser.objects.filter(is_active=True).count(),
            'active_users_today': CustomUser.objects.filter(
                last_login__date=today
            ).count(),
            
            # Elector metrics
            'total_electors': Elector.objects.filter(is_active=True).count(),
            
            # Guarantee metrics (current schema uses guarantee_status + confirmation_status)
            'total_guarantees': Guarantee.objects.count(),
            'pending_guarantees': Guarantee.objects.filter(guarantee_status='PENDING').count(),
            # legacy field names kept for backward compatibility
            'medium_guarantees': Guarantee.objects.filter(confirmation_status='PENDING').count(),
            'high_guarantees': Guarantee.objects.filter(confirmation_status='CONFIRMED').count(),
            'not_available_guarantees': Guarantee.objects.filter(confirmation_status='NOT_AVAILABLE').count(),
            
            # Attendance metrics
            'total_attendance': Attendance.objects.count(),
            
            # Percentages
            'elector_coverage': 0,  # Calculated below
            'attendance_rate': 0,   # Calculated below
        }
        
        # Calculate coverage percentage
        total_electors = metrics['total_electors']
        if total_electors > 0:
            # Count unique electors with guarantees
            unique_electors_with_guarantees = Guarantee.objects.values(
                'elector'
            ).distinct().count()
            metrics['elector_coverage'] = round(
                (unique_electors_with_guarantees / total_electors) * 100,
                2
            )
            
            # Calculate attendance rate
            metrics['attendance_rate'] = round(
                (metrics['total_attendance'] / total_electors) * 100,
                2
            )
        
        # Create or update snapshot
        snapshot, _created = AnalyticsSnapshot.objects.update_or_create(
            snapshot_type=snapshot_type,
            snapshot_date=today,
            defaults={'metrics': metrics}
        )
        
        return snapshot


class CampaignFinanceSnapshot(models.Model):
    """Finance and resource snapshot supporting strategic planning."""

    total_budget = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        help_text='Total allocated campaign budget'
    )
    committed_budget = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text='Budget committed to planned initiatives'
    )
    spent_budget = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text='Actual spend to date'
    )
    available_budget = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Budget remaining (auto-calculated when empty)'
    )
    burn_rate = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text='Average daily burn rate'
    )
    period_start = models.DateField(
        help_text='Start date for this reporting period'
    )
    period_end = models.DateField(
        help_text='End date for this reporting period'
    )
    notes = models.TextField(
        blank=True,
        help_text='Supporting context for this snapshot'
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='campaign_finance_snapshots'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'campaign_finance_snapshots'
        ordering = ['-period_end', '-created_at']
        verbose_name = 'Campaign Finance Snapshot'
        verbose_name_plural = 'Campaign Finance Snapshots'
        indexes = [
            models.Index(fields=['period_start', 'period_end'])
        ]

    def __str__(self):
        return f"Campaign Finance {self.period_start} → {self.period_end}"

    def clean(self):
        """Ensure budget figures remain consistent."""
        if self.available_budget is None and self.total_budget is not None:
            available = Decimal(self.total_budget) - Decimal(self.spent_budget)
            if available < Decimal('0.00'):
                available = Decimal('0.00')
            self.available_budget = available
        if self.spent_budget > self.total_budget:
            raise ValidationError('Spent budget cannot exceed total budget.')
        if self.committed_budget > self.total_budget:
            raise ValidationError('Committed budget cannot exceed total budget.')

