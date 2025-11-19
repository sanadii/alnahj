from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('candidates', '0003_remove_candidate_candidates_candida_79d0b1_idx_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='party',
            name='logo',
            field=models.ImageField(blank=True, help_text='Party logo or image used for identification', null=True, upload_to='party-logos/'),
        ),
    ]

