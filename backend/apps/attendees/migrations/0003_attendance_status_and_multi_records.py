from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('electors', '0008_alter_elector_department_alter_elector_team'),
        ('attendees', '0002_remove_walk_in_field'),
    ]

    operations = [
        migrations.AddField(
            model_name='attendance',
            name='status',
            field=models.CharField(
                choices=[('ATTENDED', 'Attended'), ('PENDING', 'Pending')],
                db_index=True,
                default='ATTENDED',
                max_length=20,
            ),
        ),
        migrations.AlterField(
            model_name='attendance',
            name='elector',
            field=models.ForeignKey(
                help_text='Elector attendance record (multiple entries allowed)',
                on_delete=django.db.models.deletion.CASCADE,
                related_name='attendance_records',
                to='electors.elector',
            ),
        ),
    ]

