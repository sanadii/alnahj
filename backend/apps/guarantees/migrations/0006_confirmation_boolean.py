from django.db import migrations, models


def migrate_confirmation_status(apps, schema_editor):
    Guarantee = apps.get_model('guarantees', 'Guarantee')
    for guarantee in Guarantee.objects.only('id', 'confirmation_status'):
        guarantee.is_confirmed = guarantee.confirmation_status == 'CONFIRMED'
        guarantee.save(update_fields=['is_confirmed'])


class Migration(migrations.Migration):
    dependencies = [
        ('guarantees', '0005_remove_last_contact_date_column'),
    ]

    operations = [
        migrations.AddField(
            model_name='guarantee',
            name='is_confirmed',
            field=models.BooleanField(
                db_index=True,
                default=False,
                help_text='Whether the guarantee has been confirmed'
            ),
        ),
        migrations.RunPython(migrate_confirmation_status, migrations.RunPython.noop),
        migrations.RemoveIndex(
            model_name='guarantee',
            name='guarantees_confirm_c5ec71_idx',
        ),
        migrations.RemoveIndex(
            model_name='guarantee',
            name='guarantees_user_id_fa56d1_idx',
        ),
        migrations.RemoveField(
            model_name='guarantee',
            name='confirmation_note',
        ),
        migrations.RemoveField(
            model_name='guarantee',
            name='confirmation_status',
        ),
        migrations.AddIndex(
            model_name='guarantee',
            index=models.Index(fields=['is_confirmed', 'status'], name='guarantees_is_conf_status_idx'),
        ),
        migrations.AddIndex(
            model_name='guarantee',
            index=models.Index(fields=['user', 'is_confirmed'], name='guarantees_user_conf_idx'),
        ),
    ]

