from django.db import migrations, models


def map_guarantee_statuses(apps, schema_editor):
    Guarantee = apps.get_model('guarantees', 'Guarantee')
    # Map legacy strength values to new guarantee status
    Guarantee.objects.filter(guarantee_status__in=['MEDIUM', 'HIGH']).update(guarantee_status='GUARANTEED')
    Guarantee.objects.filter(guarantee_status='NOT_AVAILABLE').update(
        guarantee_status='PENDING',
        confirmation_status='NOT_AVAILABLE'
    )


def reverse_guarantee_statuses(apps, schema_editor):
    Guarantee = apps.get_model('guarantees', 'Guarantee')
    Guarantee.objects.filter(guarantee_status='GUARANTEED').update(guarantee_status='MEDIUM')
    Guarantee.objects.filter(confirmation_status='NOT_AVAILABLE').update(confirmation_status='PENDING')


class Migration(migrations.Migration):

    dependencies = [
        ('guarantees', '0007_confirmation_status_reintroduce'),
    ]

    operations = [
        migrations.RemoveIndex(
            model_name='guarantee',
            name='guarantees_conf_status_idx',
        ),
        migrations.RemoveIndex(
            model_name='guarantee',
            name='guarantees_user_id_428238_idx',
        ),
        migrations.RenameField(
            model_name='guarantee',
            old_name='status',
            new_name='guarantee_status',
        ),
        migrations.AlterField(
            model_name='guarantee',
            name='guarantee_status',
            field=models.CharField(
                choices=[('PENDING', 'Pending'), ('GUARANTEED', 'Guaranteed')],
                default='GUARANTEED',
                help_text='Guarantee status (pending or guaranteed)',
                max_length=20,
            ),
        ),
        migrations.RunPython(map_guarantee_statuses, reverse_guarantee_statuses),
        migrations.AddIndex(
            model_name='guarantee',
            index=models.Index(fields=['user', 'guarantee_status'], name='guarantees_user_guarantee_idx'),
        ),
        migrations.AddIndex(
            model_name='guarantee',
            index=models.Index(fields=['confirmation_status', 'guarantee_status'], name='guarantees_conf_status_idx'),
        ),
    ]
