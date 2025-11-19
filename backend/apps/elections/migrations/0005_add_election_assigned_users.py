# Generated migration

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('elections', '0004_add_committee_location'),
    ]

    operations = [
        migrations.AddField(
            model_name='election',
            name='assigned_users',
            field=models.ManyToManyField(
                blank=True,
                db_table='election_users',
                help_text='Users assigned to work on this election',
                related_name='assigned_elections',
                to=settings.AUTH_USER_MODEL
            ),
        ),
    ]

