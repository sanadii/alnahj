from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('guarantees', '0003_remove_guarantee_additional_mobile_and_more'),
    ]

    operations = [
        migrations.RemoveIndex(
            model_name='guarantee',
            name='guarantees_follow__d13a78_idx',
        ),
        migrations.AlterField(
            model_name='guarantee',
            name='status',
            field=models.CharField(
                choices=[
                    ('PENDING', 'Pending'),
                    ('MEDIUM', 'Medium'),
                    ('HIGH', 'High'),
                    ('NOT_AVAILABLE', 'Not Available'),
                ],
                default='MEDIUM',
                help_text='Status of the guarantee',
                max_length=20,
            ),
        ),
        migrations.RemoveField(
            model_name='guarantee',
            name='follow_up_required',
        ),
        migrations.RemoveField(
            model_name='guarantee',
            name='follow_up_date',
        ),
        migrations.RemoveField(
            model_name='guarantee',
            name='last_contact_date',
        ),
        migrations.RemoveField(
            model_name='guarantee',
            name='last_confirmation_date',
        ),
        migrations.RemoveField(
            model_name='guarantee',
            name='last_confirmed_by',
        ),
    ]

