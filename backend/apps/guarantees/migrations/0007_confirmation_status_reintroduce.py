from django.db import migrations, models


def migrate_is_confirmed_to_status(apps, schema_editor):
    Guarantee = apps.get_model('guarantees', 'Guarantee')
    for guarantee in Guarantee.objects.iterator():
        guarantee.confirmation_status = 'CONFIRMED' if getattr(guarantee, 'is_confirmed', False) else 'PENDING'
        guarantee.save(update_fields=['confirmation_status'])


class Migration(migrations.Migration):
    dependencies = [
        ('guarantees', '0006_confirmation_boolean'),
    ]

    operations = [
        migrations.AddField(
            model_name='guarantee',
            name='confirmation_status',
            field=models.CharField(
                choices=[('PENDING', 'Pending'), ('CONFIRMED', 'Confirmed'), ('NOT_AVAILABLE', 'Not Available')],
                db_index=True,
                default='PENDING',
                help_text='Confirmation status of the guarantee',
                max_length=20,
            ),
        ),
        migrations.RunPython(migrate_is_confirmed_to_status, migrations.RunPython.noop),
        migrations.RemoveIndex(
            model_name='guarantee',
            name='guarantees_is_conf_status_idx',
        ),
        migrations.RemoveIndex(
            model_name='guarantee',
            name='guarantees_user_conf_idx',
        ),
        migrations.RemoveField(
            model_name='guarantee',
            name='is_confirmed',
        ),
        migrations.AddIndex(
            model_name='guarantee',
            index=models.Index(fields=['confirmation_status', 'status'], name='guarantees_conf_status_idx'),
        ),
        migrations.AddIndex(
            model_name='guarantee',
            index=models.Index(fields=['user', 'confirmation_status'], name='guarantees_user_confirm_idx'),
        ),
    ]

