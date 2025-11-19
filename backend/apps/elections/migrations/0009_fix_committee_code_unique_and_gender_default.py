# Generated manually to fix Committee model constraints

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('elections', '0008_committee_electors_from_committee_electors_to'),
    ]

    operations = [
        # Remove unique constraint from code field (drops unique index)
        migrations.AlterField(
            model_name='committee',
            name='code',
            field=models.CharField(
                help_text='Committee code (e.g., EK-II, FC#28)',
                max_length=20
            ),
        ),
        # Add default value to gender field
        migrations.AlterField(
            model_name='committee',
            name='gender',
            field=models.CharField(
                choices=[('MALE', 'Male'), ('FEMALE', 'Female'), ('MIXED', 'Mixed')],
                default='MIXED',
                help_text='Gender segregation',
                max_length=10
            ),
        ),
        # Add unique constraint on (election, code) - allows same code in different elections
        migrations.AddConstraint(
            model_name='committee',
            constraint=models.UniqueConstraint(
                fields=['election', 'code'],
                name='unique_committee_code_per_election'
            ),
        ),
    ]

