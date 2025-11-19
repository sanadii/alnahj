from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('guarantees', '0010_rename_guarantees_user_guarantee_idx_guarantees_user_id_4c9194_idx_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='guarantee',
            old_name='primary_phone',
            new_name='mobile',
        ),
        migrations.RemoveField(
            model_name='guarantee',
            name='alternate_phone',
        ),
        migrations.AlterField(
            model_name='guarantee',
            name='mobile',
            field=models.CharField(
                blank=True,
                help_text='Primary contact phone number for follow-ups',
                max_length=20,
            ),
        ),
    ]

