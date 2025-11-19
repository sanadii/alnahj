from django.db import migrations


def drop_last_contact_date(apps, schema_editor):
    """
    Ensure the legacy last_contact_date column is removed even if earlier migrations were skipped.
    """
    guarantee_model = apps.get_model('guarantees', 'Guarantee')
    table_name = guarantee_model._meta.db_table

    with schema_editor.connection.cursor() as cursor:
        columns = [
            column.name
            for column in schema_editor.connection.introspection.get_table_description(cursor, table_name)
        ]

    if 'last_contact_date' not in columns:
        return

    quoted_table = schema_editor.quote_name(table_name)
    quoted_column = schema_editor.quote_name('last_contact_date')

    schema_editor.execute(f'ALTER TABLE {quoted_table} DROP COLUMN {quoted_column}')


class Migration(migrations.Migration):
    dependencies = [
        ('guarantees', '0004_update_status_remove_followup'),
    ]

    operations = [
        migrations.RunPython(drop_last_contact_date, migrations.RunPython.noop),
    ]

