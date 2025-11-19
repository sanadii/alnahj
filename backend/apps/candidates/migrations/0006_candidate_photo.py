from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('candidates', '0005_remove_party_abbreviation'),
    ]

    operations = [
        migrations.AddField(
            model_name='candidate',
            name='photo',
            field=models.ImageField(blank=True, help_text='Candidate profile photo used across the dashboard', null=True, upload_to='candidate-photos/'),
        ),
    ]

