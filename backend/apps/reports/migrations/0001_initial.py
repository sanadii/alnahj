from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings
import django.contrib.postgres.fields


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ReportTemplate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='Report template name', max_length=200)),
                ('report_type', models.CharField(choices=[('GUARANTEE_COVERAGE', 'Guarantee Coverage Report'), ('GUARANTEE_ACCURACY', 'Guarantee Accuracy Report'), ('COMMITTEE_PERFORMANCE', 'Committee Performance Report'), ('USER_ACTIVITY', 'User Activity Report'), ('ATTENDANCE_ANALYSIS', 'Attendance Analysis Report'), ('ELECTOR_DISTRIBUTION', 'Elector Distribution Report'), ('TEAM_COMPARISON', 'Team Comparison Report'), ('CUSTOM', 'Custom Report')], help_text='Type of report', max_length=50)),
                ('description', models.TextField(blank=True, help_text='Report description')),
                ('parameters', models.JSONField(default=dict, help_text='Report parameters as JSON')),
                ('is_active', models.BooleanField(default=True, help_text='Is this template active?')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(help_text='User who created this template', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='report_templates', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Report Template',
                'verbose_name_plural': 'Report Templates',
                'ordering': ['name'],
                'db_table': 'report_templates',
            },
        ),
        migrations.CreateModel(
            name='GeneratedReport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(help_text='Report title', max_length=200)),
                ('report_type', models.CharField(help_text='Type of report', max_length=50)),
                ('format', models.CharField(choices=[('JSON', 'JSON'), ('CSV', 'CSV'), ('EXCEL', 'Excel'), ('PDF', 'PDF')], default='JSON', help_text='Report format', max_length=10)),
                ('status', models.CharField(choices=[('PENDING', 'Pending'), ('GENERATING', 'Generating'), ('COMPLETED', 'Completed'), ('FAILED', 'Failed')], default='PENDING', help_text='Generation status', max_length=20)),
                ('parameters', models.JSONField(default=dict, help_text='Parameters used to generate report')),
                ('data', models.JSONField(default=dict, help_text='Report data (for JSON format)')),
                ('file', models.FileField(blank=True, help_text='Generated file (CSV, Excel, PDF)', null=True, upload_to='reports/%Y/%m/')),
                ('error_message', models.TextField(blank=True, help_text='Error message if generation failed')),
                ('generated_at', models.DateTimeField(blank=True, help_text='When report was generated', null=True)),
                ('expires_at', models.DateTimeField(blank=True, help_text='When report cache expires', null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('generated_by', models.ForeignKey(help_text='User who generated this report', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='generated_reports', to=settings.AUTH_USER_MODEL)),
                ('template', models.ForeignKey(blank=True, help_text='Report template used (optional)', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='generated_reports', to='reports.reporttemplate')),
            ],
            options={
                'verbose_name': 'Generated Report',
                'verbose_name_plural': 'Generated Reports',
                'ordering': ['-created_at'],
                'db_table': 'generated_reports',
            },
        ),
        migrations.CreateModel(
            name='DashboardWidget',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(help_text='Widget title', max_length=100)),
                ('widget_type', models.CharField(choices=[('STAT_CARD', 'Statistic Card'), ('PIE_CHART', 'Pie Chart'), ('BAR_CHART', 'Bar Chart'), ('LINE_CHART', 'Line Chart'), ('TABLE', 'Data Table'), ('RECENT_ACTIVITY', 'Recent Activity'), ('PROGRESS_BAR', 'Progress Bar')], help_text='Type of widget', max_length=20)),
                ('data_source', models.CharField(help_text='Data source endpoint', max_length=100)),
                ('configuration', models.JSONField(default=dict, help_text='Widget configuration (colors, size, etc.)')),
                ('position_x', models.IntegerField(default=0, help_text='X position on dashboard grid')),
                ('position_y', models.IntegerField(default=0, help_text='Y position on dashboard grid')),
                ('width', models.IntegerField(default=4, help_text='Widget width (grid units)')),
                ('height', models.IntegerField(default=2, help_text='Widget height (grid units)')),
                ('is_visible', models.BooleanField(default=True, help_text='Is widget visible?')),
                ('order', models.IntegerField(default=0, help_text='Display order')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(help_text='Widget owner', on_delete=django.db.models.deletion.CASCADE, related_name='dashboard_widgets', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Dashboard Widget',
                'verbose_name_plural': 'Dashboard Widgets',
                'ordering': ['order', 'position_y', 'position_x'],
                'db_table': 'dashboard_widgets',
            },
        ),
        migrations.CreateModel(
            name='AnalyticsSnapshot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('snapshot_type', models.CharField(choices=[('DAILY', 'Daily Snapshot'), ('WEEKLY', 'Weekly Snapshot'), ('MONTHLY', 'Monthly Snapshot'), ('ON_DEMAND', 'On-Demand Snapshot')], help_text='Type of snapshot', max_length=20)),
                ('snapshot_date', models.DateField(help_text='Date of snapshot')),
                ('metrics', models.JSONField(default=dict, help_text='Snapshot metrics as JSON')),
                ('notes', models.TextField(blank=True, help_text='Optional notes')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Analytics Snapshot',
                'verbose_name_plural': 'Analytics Snapshots',
                'ordering': ['-snapshot_date'],
                'db_table': 'analytics_snapshots',
                'unique_together': {('snapshot_type', 'snapshot_date')},
            },
        ),
        migrations.CreateModel(
            name='CampaignFinanceSnapshot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_budget', models.DecimalField(decimal_places=2, help_text='Total allocated campaign budget', max_digits=14)),
                ('committed_budget', models.DecimalField(decimal_places=2, default=0, help_text='Budget committed to planned initiatives', max_digits=14)),
                ('spent_budget', models.DecimalField(decimal_places=2, default=0, help_text='Actual spend to date', max_digits=14)),
                ('available_budget', models.DecimalField(blank=True, decimal_places=2, help_text='Budget remaining (auto-calculated when empty)', max_digits=14, null=True)),
                ('burn_rate', models.DecimalField(decimal_places=2, default=0, help_text='Average daily burn rate', max_digits=8)),
                ('period_start', models.DateField(help_text='Start date for this reporting period')),
                ('period_end', models.DateField(help_text='End date for this reporting period')),
                ('notes', models.TextField(blank=True, help_text='Supporting context for this snapshot')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='campaign_finance_snapshots', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Campaign Finance Snapshot',
                'verbose_name_plural': 'Campaign Finance Snapshots',
                'ordering': ['-period_end', '-created_at'],
                'db_table': 'campaign_finance_snapshots',
            },
        ),
    ]
