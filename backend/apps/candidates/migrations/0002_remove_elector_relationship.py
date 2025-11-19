# Generated manually to remove elector relationship

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('candidates', '0001_initial_candidates_models'),
        ('elections', '0001_initial'),
    ]

    operations = [
        # Delete all existing candidates (user doesn't need existing data)
        migrations.RunSQL(
            sql='DELETE FROM candidates;',
            reverse_sql=migrations.RunSQL.noop,
        ),
        
        # Remove elector field and related constraints
        migrations.RemoveIndex(
            model_name='candidate',
            name='candidates_elector_5ec778_idx',
        ),
        migrations.AlterUniqueTogether(
            name='candidate',
            unique_together=set(),
        ),
        migrations.RemoveField(
            model_name='candidate',
            name='elector',
        ),
        
        # Add name field
        migrations.AddField(
            model_name='candidate',
            name='name',
            field=models.CharField(help_text='Candidate name', max_length=200, default=''),
            preserve_default=False,
        ),
        
        # Update unique constraint to use candidate_number instead of elector
        migrations.AlterUniqueTogether(
            name='candidate',
            unique_together={('election', 'candidate_number')},
        ),
        
        # Add index for name
        migrations.AddIndex(
            model_name='candidate',
            index=models.Index(fields=['name'], name='candidates_name_e2ba76_idx'),
        ),
    ]

