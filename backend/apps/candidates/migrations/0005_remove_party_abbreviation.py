from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('candidates', '0004_party_logo'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='party',
            name='abbreviation',
        ),
    ]

