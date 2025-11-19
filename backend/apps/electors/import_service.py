"""
CSV import service for electors.
"""
import csv
import io
from typing import Dict, List, Tuple
from django.db import transaction
from .models import Elector
from apps.elections.models import Committee


class ElectorImportService:
    """
    Service for importing electors from CSV file.
    Handles validation, parsing, and batch creation.
    """
    
    def __init__(self):
        self.errors = []
        self.warnings = []
        self.created_count = 0
        self.updated_count = 0
        self.skipped_count = 0
    
    def parse_csv(self, file_content: bytes) -> List[Dict]:
        """
        Parse CSV file content into list of dictionaries.
        
        Args:
            file_content: CSV file content as bytes
        
        Returns:
            List of dictionaries with elector data
        """
        # Decode bytes to string
        try:
            content = file_content.decode('utf-8')
        except UnicodeDecodeError:
            content = file_content.decode('utf-8-sig')  # Try with BOM
        
        # Parse CSV
        reader = csv.DictReader(io.StringIO(content))
        return list(reader)
    
    def validate_row(self, row: Dict, row_number: int) -> Tuple[bool, Dict, List[str]]:
        """
        Validate a single row from CSV.
        
        Args:
            row: Dictionary with elector data
            row_number: Row number for error reporting
        
        Returns:
            Tuple of (is_valid, cleaned_data, errors)
        """
        errors = []
        cleaned_data = {}
        
        # Required: KOC ID
        koc_id = row.get('KOC', '').strip()
        if not koc_id:
            errors.append(f"Row {row_number}: KOC ID is required")
            return False, cleaned_data, errors
        
        cleaned_data['koc_id'] = koc_id
        
        # Required: Name
        name = row.get('Name', '').strip()
        if not name:
            errors.append(f"Row {row_number}: Name is required")
            return False, cleaned_data, errors
        
        # Parse name into 7 components
        name_parts = Elector.parse_full_name(name)
        cleaned_data.update(name_parts)
        
        # Optional fields with exact CSV column names
        cleaned_data['designation'] = row.get('Desgnation', '').strip()  # Note: Typo in CSV
        cleaned_data['section'] = row.get('Section', '').strip()
        cleaned_data['location'] = row.get('Location', '').strip()
        cleaned_data['extension'] = row.get('Ext.', '').strip()
        cleaned_data['mobile'] = row.get('Mobile', '').strip()
        cleaned_data['area'] = row.get('Area', '').strip()
        cleaned_data['department'] = row.get('Department', row.get('Team', '')).strip()
        cleaned_data['team'] = row.get('Team', row.get('sub_team', '')).strip()
        committee_code = row.get('Code', '').strip()
        
        # Determine gender from committee code (if not explicitly provided)
        # You can implement logic based on committee naming or provide it separately
        # For now, we'll need to get it from somewhere or default
        cleaned_data['gender'] = 'MALE'  # Default, should be determined properly
        
        # Committee assignment
        if committee_code:
            try:
                committee = Committee.objects.get(code=committee_code)
                cleaned_data['committee'] = committee
                # Override gender based on committee
                cleaned_data['gender'] = committee.gender
            except Committee.DoesNotExist:
                errors.append(
                    f"Row {row_number}: Committee '{committee_code}' not found. "
                    "Please create committee first."
                )
                return False, cleaned_data, errors
        else:
            errors.append(f"Row {row_number}: Committee code is required")
            return False, cleaned_data, errors
        
        return True, cleaned_data, errors
    
    @transaction.atomic
    def import_electors(self, file_content: bytes, update_existing: bool = False) -> Dict:
        """
        Import electors from CSV file.
        
        Args:
            file_content: CSV file content as bytes
            update_existing: If True, update existing electors; if False, skip them
        
        Returns:
            Dictionary with import results
        """
        self.errors = []
        self.warnings = []
        self.created_count = 0
        self.updated_count = 0
        self.skipped_count = 0
        
        try:
            rows = self.parse_csv(file_content)
        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to parse CSV file: {str(e)}',
                'results': {}
            }
        
        if not rows:
            return {
                'success': False,
                'error': 'CSV file is empty or invalid',
                'results': {}
            }
        
        # Process each row
        electors_to_create = []
        electors_to_update = []
        
        for idx, row in enumerate(rows, start=2):  # Start at 2 (row 1 is header)
            is_valid, cleaned_data, row_errors = self.validate_row(row, idx)
            
            if not is_valid:
                self.errors.extend(row_errors)
                self.skipped_count += 1
                continue
            
            koc_id = cleaned_data['koc_id']
            
            # Check if elector exists
            try:
                elector = Elector.objects.get(koc_id=koc_id)
                
                if update_existing:
                    # Update existing elector
                    for key, value in cleaned_data.items():
                        setattr(elector, key, value)
                    electors_to_update.append(elector)
                else:
                    self.skipped_count += 1
                    self.warnings.append(
                        f"Row {idx}: Elector {koc_id} already exists (skipped)"
                    )
            
            except Elector.DoesNotExist:
                # Create new elector
                elector = Elector(**cleaned_data)
                electors_to_create.append(elector)
        
        # Bulk create new electors
        if electors_to_create:
            Elector.objects.bulk_create(electors_to_create, ignore_conflicts=True)
            self.created_count = len(electors_to_create)
        
        # Bulk update existing electors
        if electors_to_update:
            Elector.objects.bulk_update(
                electors_to_update,
                fields=[
                    'name_first', 'name_second', 'name_third', 'name_fourth',
                    'name_fifth', 'name_sixth', 'sub_family_name', 'family_name',
                    'designation', 'section', 'location', 'extension',
                    'mobile', 'area', 'department', 'team', 'committee', 'gender'
                ]
            )
            self.updated_count = len(electors_to_update)
        
        # Prepare result
        total_processed = self.created_count + self.updated_count + self.skipped_count
        success = len(self.errors) == 0 and total_processed > 0
        
        return {
            'success': success,
            'total_rows': len(rows),
            'created': self.created_count,
            'updated': self.updated_count,
            'skipped': self.skipped_count,
            'errors': self.errors,
            'warnings': self.warnings,
        }

