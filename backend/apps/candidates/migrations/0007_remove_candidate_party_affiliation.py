from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('candidates', '0006_candidate_photo'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='candidate',
            name='party_affiliation',
        ),
    ]

