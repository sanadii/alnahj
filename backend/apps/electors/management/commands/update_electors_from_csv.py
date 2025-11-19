"""
Django management command to update electors from merged CSV file.
Updates existing records only, does not delete or re-insert data.
"""
import csv
import os
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.electors.models import Elector


def _get_first_value(row, *keys):
    for key in keys:
        if key in row and row[key] is not None:
            value = row[key].strip()
            if value:
                return value
    return ''


class Command(BaseCommand):
    help = 'Update electors from merged CSV file (updates only, no delete/re-insert)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            default='backend/files/merged_electors.csv',
            help='Path to the merged CSV file'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Perform a dry run without saving changes'
        )

    def handle(self, *args, **options):
        file_path = options['file']
        dry_run = options['dry_run']
        
        # Check if file exists
        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f'File not found: {file_path}'))
            return
        
        self.stdout.write(self.style.SUCCESS(f'Reading CSV file: {file_path}'))
        
        # Statistics
        stats = {
            'total_rows': 0,
            'updated': 0,
            'not_found': 0,
            'skipped_no_koc': 0,
            'errors': 0,
        }
        
        updates_detail = []
        not_found_kocs = []
        
        try:
            with open(file_path, 'r', encoding='utf-8-sig', errors='ignore') as f:
                reader = csv.DictReader(f)
                
                with transaction.atomic():
                    for row_num, row in enumerate(reader, start=2):
                        stats['total_rows'] += 1
                        
                        # Get KOC number
                        koc_id = row.get('KOC', '').strip() or row.get('internal_reference', '').strip()
                        
                        if not koc_id:
                            stats['skipped_no_koc'] += 1
                            continue
                        
                        try:
                            # Try to find the elector
                            elector = Elector.objects.get(koc_id=koc_id)
                            
                            # Track what fields were updated
                            updated_fields = []
                            
                            # Update work information
                            if row.get('Desgnation', '').strip():
                                old_value = elector.designation
                                new_value = row['Desgnation'].strip()
                                if old_value != new_value:
                                    elector.designation = new_value
                                    updated_fields.append(f'designation: "{old_value}" -> "{new_value}"')
                            
                            if row.get('Section', '').strip():
                                old_value = elector.section
                                new_value = row['Section'].strip()
                                if old_value != new_value:
                                    elector.section = new_value
                                    updated_fields.append(f'section: "{old_value}" -> "{new_value}"')
                            
                            if row.get('Ext.', '').strip():
                                old_value = elector.extension
                                new_value = row['Ext.'].strip()
                                if old_value != new_value:
                                    elector.extension = new_value
                                    updated_fields.append(f'extension: "{old_value}" -> "{new_value}"')
                            
                            # Update contact information
                            if row.get('Mobile', '').strip():
                                old_value = elector.mobile
                                new_value = row['Mobile'].strip()
                                if old_value != new_value:
                                    elector.mobile = new_value
                                    updated_fields.append(f'mobile: "{old_value}" -> "{new_value}"')
                            
                            # Update organizational
                            if row.get('Area', '').strip():
                                old_value = elector.area
                                new_value = row['Area'].strip()
                                if old_value != new_value:
                                    elector.area = new_value
                                    updated_fields.append(f'area: "{old_value}" -> "{new_value}"')
                            
                            department_value = _get_first_value(
                                row,
                                'department',
                                'Department',
                                'Team',
                                'team',
                                'sub_team',
                            )
                            if department_value:
                                old_value = elector.department
                                if old_value != department_value:
                                    elector.department = department_value
                                    updated_fields.append(f'department: "{old_value}" -> "{department_value}"')

                            team_value = _get_first_value(row, 'team', 'Team', 'sub_team')
                            if team_value:
                                old_value = elector.team
                                if old_value != team_value:
                                    elector.team = team_value
                                    updated_fields.append(f'team: "{old_value}" -> "{team_value}"')
                            
                            # Update family names if present in CSV
                            if row.get('family_name', '').strip():
                                old_value = elector.family_name
                                new_value = row['family_name'].strip()
                                if old_value != new_value:
                                    elector.family_name = new_value
                                    updated_fields.append(f'family_name: "{old_value}" -> "{new_value}"')
                            
                            if row.get('sub_family_name', '').strip():
                                old_value = elector.sub_family_name
                                new_value = row['sub_family_name'].strip()
                                if old_value != new_value:
                                    elector.sub_family_name = new_value
                                    updated_fields.append(f'sub_family_name: "{old_value}" -> "{new_value}"')
                            
                            # Update gender if present (mapping: 1=MALE, 2=FEMALE)
                            if row.get('gender', '').strip():
                                gender_value = row['gender'].strip()
                                gender_map = {'1': 'MALE', '2': 'FEMALE'}
                                if gender_value in gender_map:
                                    old_value = elector.gender
                                    new_value = gender_map[gender_value]
                                    if old_value != new_value:
                                        elector.gender = new_value
                                        updated_fields.append(f'gender: "{old_value}" -> "{new_value}"')
                            
                            # Parse and update fullname if present
                            if row.get('fullname', '').strip():
                                fullname = row['fullname'].strip()
                                name_parts = Elector.parse_full_name(fullname)
                                
                                # Only update name parts if they are different and not empty
                                for field, value in name_parts.items():
                                    if value:  # Only update if new value is not empty
                                        old_value = getattr(elector, field)
                                        if old_value != value:
                                            setattr(elector, field, value)
                                            updated_fields.append(f'{field}: "{old_value}" -> "{value}"')
                            
                            # Update alternative name if present
                            if row.get('Name', '').strip() and not row.get('fullname', '').strip():
                                fullname = row['Name'].strip()
                                name_parts = Elector.parse_full_name(fullname)
                                
                                for field, value in name_parts.items():
                                    if value:
                                        old_value = getattr(elector, field)
                                        if old_value != value:
                                            setattr(elector, field, value)
                                            updated_fields.append(f'{field}: "{old_value}" -> "{value}"')
                            
                            # Save if changes were made
                            if updated_fields:
                                if not dry_run:
                                    elector.save()
                                
                                stats['updated'] += 1
                                updates_detail.append({
                                    'koc_id': koc_id,
                                    'fields': updated_fields
                                })
                                
                                if stats['updated'] <= 10:  # Show first 10 updates
                                    self.stdout.write(
                                        self.style.SUCCESS(
                                            f'  Updated KOC {koc_id}: {len(updated_fields)} fields'
                                        )
                                    )
                        
                        except Elector.DoesNotExist:
                            stats['not_found'] += 1
                            not_found_kocs.append(koc_id)
                            if stats['not_found'] <= 10:
                                self.stdout.write(
                                    self.style.WARNING(f'  KOC {koc_id} not found in database')
                                )
                        
                        except Exception as e:
                            stats['errors'] += 1
                            self.stdout.write(
                                self.style.ERROR(f'  Error updating KOC {koc_id}: {str(e)}')
                            )
                    
                    if dry_run:
                        # Rollback transaction in dry run
                        raise Exception("Dry run - rolling back changes")
        
        except Exception as e:
            if not dry_run:
                self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
                return
            else:
                if "Dry run" not in str(e):
                    self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
                    return
        
        # Print summary
        self.stdout.write(self.style.SUCCESS('\n' + '='*60))
        self.stdout.write(self.style.SUCCESS('UPDATE SUMMARY'))
        self.stdout.write(self.style.SUCCESS('='*60))
        self.stdout.write(f'Total rows processed: {stats["total_rows"]}')
        self.stdout.write(self.style.SUCCESS(f'Records updated: {stats["updated"]}'))
        self.stdout.write(self.style.WARNING(f'Records not found in DB: {stats["not_found"]}'))
        self.stdout.write(f'Skipped (no KOC ID): {stats["skipped_no_koc"]}')
        self.stdout.write(self.style.ERROR(f'Errors: {stats["errors"]}'))
        
        if dry_run:
            self.stdout.write(self.style.WARNING('\n*** DRY RUN - No changes were saved ***'))
        
        if not_found_kocs and stats['not_found'] > 10:
            self.stdout.write(
                self.style.WARNING(
                    f'\n{stats["not_found"]} KOC IDs not found in database '
                    f'(showing first 10): {", ".join(not_found_kocs[:10])}'
                )
            )
        
        self.stdout.write(self.style.SUCCESS('\nUpdate complete!'))

