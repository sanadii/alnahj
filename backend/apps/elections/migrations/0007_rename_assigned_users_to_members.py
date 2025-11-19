# Generated migration
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('elections', '0006_alter_committee_gender'),
    ]

    operations = [
        # Rename the Election field (model level only, table was never created)
        # The table will be created as 'election_members' when the field is added
        migrations.RemoveField(
            model_name='election',
            name='assigned_users',
        ),
        migrations.AddField(
            model_name='election',
            name='members',
            field=models.ManyToManyField(
                blank=True,
                db_table='election_members',
                help_text='Users who are members of this election',
                related_name='member_elections',
                to=settings.AUTH_USER_MODEL
            ),
        ),
    ]

