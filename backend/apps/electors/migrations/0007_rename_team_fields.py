from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('electors', '0006_elector_sub_team_elector_electors_sub_tea_b22b3e_idx'),
    ]

    operations = [
        # Rename indexes BEFORE renaming fields to avoid field lookup issues
        migrations.RenameIndex(
            model_name='elector',
            old_name='electors_team_b99939_idx',
            new_name='electors_department_b99939_idx',
        ),
        migrations.RenameIndex(
            model_name='elector',
            old_name='electors_sub_tea_b22b3e_idx',
            new_name='electors_team_b22b3e_idx',
        ),
        # Now rename the fields
        migrations.RenameField(
            model_name='elector',
            old_name='team',
            new_name='department',
        ),
        migrations.RenameField(
            model_name='elector',
            old_name='sub_team',
            new_name='team',
        ),
        migrations.AlterModelOptions(
            name='elector',
            options={
                'db_table': 'electors',
                'ordering': ['name_first', 'family_name'],
                'verbose_name': 'Elector',
                'verbose_name_plural': 'Electors',
                'indexes': [
                    models.Index(fields=['koc_id'], name='electors_koc_id_f82322_idx'),
                    models.Index(fields=['name_first', 'family_name'], name='electors_name_fi_82e61c_idx'),
                    models.Index(fields=['sub_family_name'], name='electors_sub_fam_cfd3fd_idx'),
                    models.Index(fields=['committee'], name='electors_committ_e1ca89_idx'),
                    models.Index(fields=['department'], name='electors_department_b99939_idx'),
                    models.Index(fields=['team'], name='electors_team_b22b3e_idx'),
                    models.Index(fields=['section'], name='electors_section_671228_idx'),
                    models.Index(fields=['mobile'], name='electors_mobile_eda9ec_idx'),
                    models.Index(fields=['gender'], name='electors_gender_929b88_idx'),
                    models.Index(fields=['is_active'], name='electors_is_acti_b6acfd_idx'),
                    models.Index(fields=['is_approved'], name='electors_is_appr_14b2ad_idx'),
                    models.Index(fields=['created_by'], name='electors_created_a8fec7_idx'),
                ]
            },
        ),
    ]
