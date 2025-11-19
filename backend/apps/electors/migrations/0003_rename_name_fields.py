# Generated manually for field renaming

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('electors', '0002_elector_name_sixth_alter_elector_name_before_last_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='elector',
            old_name='name_before_last',
            new_name='sub_family_name',
        ),
        migrations.RenameField(
            model_name='elector',
            old_name='name_last',
            new_name='family_name',
        ),
        migrations.AlterModelOptions(
            name='elector',
            options={'ordering': ['name_first', 'family_name'], 'verbose_name': 'Elector', 'verbose_name_plural': 'Electors'},
        ),
        migrations.AlterField(
            model_name='elector',
            name='sub_family_name',
            field=models.CharField(blank=True, help_text='Sub-family name', max_length=50),
        ),
        migrations.AlterField(
            model_name='elector',
            name='family_name',
            field=models.CharField(help_text='Family name (surname)', max_length=50),
        ),
    ]

