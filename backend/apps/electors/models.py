"""
Elector models for managing voter database.
"""
from django.db import models
from django.contrib.postgres.search import SearchVectorField


class Elector(models.Model):
    """
    Elector (KOC employee) information.
    Name parsed into 8 components for advanced search.
    """
    
    GENDER_CHOICES = [
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
    ]
    
    # Primary Key
    koc_id = models.CharField(
        max_length=20,
        primary_key=True,
        help_text='KOC Employee Number (unique identifier)'
    )
    
    # Name Components (8 parts for advanced search)
    name_first = models.CharField(
        max_length=50,
        help_text='First name'
    )
    name_second = models.CharField(
        max_length=50,
        blank=True,
        help_text='Second name'
    )
    name_third = models.CharField(
        max_length=50,
        blank=True,
        help_text='Third name'
    )
    name_fourth = models.CharField(
        max_length=50,
        blank=True,
        help_text='Fourth name'
    )
    name_fifth = models.CharField(
        max_length=50,
        blank=True,
        help_text='Fifth name'
    )
    name_sixth = models.CharField(
        max_length=50,
        blank=True,
        help_text='Sixth name'
    )
    sub_family_name = models.CharField(
        max_length=50,
        blank=True,
        help_text='Sub-family name'
    )
    family_name = models.CharField(
        max_length=50,
        help_text='Family name (surname)'
    )
    
    # Work Information
    designation = models.CharField(
        max_length=100,
        blank=True,
        help_text='Job Title'
    )
    section = models.CharField(
        max_length=100,
        blank=True,
        help_text='Department'
    )
    extension = models.CharField(
        max_length=20,
        blank=True,
        help_text='Office Phone Extension'
    )
    
    # Contact Information
    mobile = models.CharField(
        max_length=15,
        blank=True,
        help_text='Mobile phone number'
    )
    
    # Organizational
    area = models.CharField(
        max_length=100,
        blank=True,
        help_text='Geographic area'
    )
    department = models.CharField(
        max_length=100,
        blank=True,
        help_text='Organizational department'
    )
    team = models.CharField(
        max_length=100,
        blank=True,
        help_text='Organizational team'
    )
    
    # Committee Assignment
    committee = models.ForeignKey(
        'elections.Committee',
        on_delete=models.PROTECT,
        related_name='electors',
        help_text='Assigned voting committee'
    )
    
    # Demographics
    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        help_text='Gender (for committee assignment)'
    )
    
    # Status
    is_active = models.BooleanField(
        default=True,
        help_text='Eligible to vote'
    )
    is_approved = models.BooleanField(
        default=True,
        help_text='Elector approved by admin (for newly added electors)'
    )
    
    # Audit
    created_by = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='electors_created',
        help_text='User who created this elector'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'electors'
        verbose_name = 'Elector'
        verbose_name_plural = 'Electors'
        ordering = ['name_first', 'family_name']
        indexes = [
            # Single field indexes
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
            # Composite indexes for common query patterns (performance optimization)
            models.Index(fields=['committee', 'is_active'], name='electors_committee_active_idx'),
            models.Index(fields=['department', 'is_active'], name='electors_dept_active_idx'),
            models.Index(fields=['team', 'is_active'], name='electors_team_active_idx'),
            models.Index(fields=['section', 'is_active'], name='electors_section_active_idx'),
            models.Index(fields=['is_active', 'is_approved'], name='electors_active_approved_idx'),
        ]
    
    def __str__(self):
        return f"{self.koc_id} - {self.full_name}"
    
    @property
    def full_name(self):
        """
        Get full name from name_first to name_sixth only.
        Does NOT include sub_family_name/family_name to avoid duplication.
        Those are kept separate for search/filtering purposes.
        """
        parts = [
            self.name_first,
            self.name_second,
            self.name_third,
            self.name_fourth,
            self.name_fifth,
            self.name_sixth,
        ]
        return ' '.join([p for p in parts if p]).strip()
    
    @staticmethod
    def parse_full_name(full_name):
        """
        Parse full name into 8 components.
        
        Logic:
        - First name: first part
        - Family name: last part
        - Sub-family name: second-to-last part
        - Remaining parts fill: second, third, fourth, fifth, sixth
        
        Args:
            full_name (str): Full name string
        
        Returns:
            dict: Dictionary with 8 name components
        """
        if not full_name:
            return {
                'name_first': '',
                'name_second': '',
                'name_third': '',
                'name_fourth': '',
                'name_fifth': '',
                'name_sixth': '',
                'sub_family_name': '',
                'family_name': '',
            }
        
        # Split name into parts
        parts = full_name.strip().split()
        
        # If only one part
        if len(parts) == 1:
            return {
                'name_first': parts[0],
                'name_second': '',
                'name_third': '',
                'name_fourth': '',
                'name_fifth': '',
                'name_sixth': '',
                'sub_family_name': '',
                'family_name': '',
            }
        
        # If two parts
        if len(parts) == 2:
            return {
                'name_first': parts[0],
                'name_second': '',
                'name_third': '',
                'name_fourth': '',
                'name_fifth': '',
                'name_sixth': '',
                'sub_family_name': '',
                'family_name': parts[1],
            }
        
        # Three or more parts
        name_dict = {
            'name_first': parts[0],
            'family_name': parts[-1],
            'sub_family_name': parts[-2] if len(parts) >= 3 else '',
            'name_second': '',
            'name_third': '',
            'name_fourth': '',
            'name_fifth': '',
            'name_sixth': '',
        }
        
        # Fill middle names (second, third, fourth, fifth, sixth)
        middle_parts = parts[1:-2] if len(parts) > 3 else []
        middle_slots = ['name_second', 'name_third', 'name_fourth', 'name_fifth', 'name_sixth']
        
        for i, part in enumerate(middle_parts):
            if i < len(middle_slots):
                name_dict[middle_slots[i]] = part
        
        return name_dict
    
    @property
    def has_attended(self):
        """Check if elector has attended."""
        return self.attendance_records.filter(status='ATTENDED').exists()
