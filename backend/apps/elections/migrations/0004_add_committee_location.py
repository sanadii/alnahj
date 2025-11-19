# Generated migration to add location field to Committee model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('elections', '0003_rename_voting_date_to_election_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='committee',
            name='location',
            field=models.CharField(blank=True, default='', help_text='Physical location of the committee', max_length=255),
        ),
    ]

