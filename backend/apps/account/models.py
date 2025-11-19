"""
User models for Election Management System.
"""
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication."""
    
    def create_user(self, email, password=None, **extra_fields):
        """
        Create and save a regular user.
        
        Args:
            email (str): User's email address
            password (str): User's password
            **extra_fields: Additional user fields
        
        Returns:
            CustomUser: Created user instance
        """
        if not email:
            raise ValueError('Email is required')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and save a superuser.
        
        Args:
            email (str): Superuser's email address
            password (str): Superuser's password
            **extra_fields: Additional user fields
        
        Returns:
            CustomUser: Created superuser instance
        """
        extra_fields.setdefault('role', 'SUPER_ADMIN')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model for election system.
    
    Supports four roles:
    - SUPER_ADMIN: Full system access
    - ADMIN: Operational management
    - SUPERVISOR: Team oversight
    - USER: Guarantee collector
    """
    
    ROLE_CHOICES = [
        ('SUPER_ADMIN', 'Super Admin'),
        ('ADMIN', 'Admin'),
        ('SUPERVISOR', 'Supervisor'),
        ('USER', 'User'),
    ]
    
    # Basic Information
    email = models.EmailField(
        _('email address'),
        unique=True,
        help_text='User email address (used for login)'
    )
    first_name = models.CharField(_('first name'), max_length=100)
    last_name = models.CharField(_('last name'), max_length=100)
    phone = models.CharField(
        _('phone number'),
        max_length=15,
        blank=True,
        help_text='Kuwait phone number (8 digits)'
    )
    
    # Role & Hierarchy
    role = models.CharField(
        _('role'),
        max_length=20,
        choices=ROLE_CHOICES,
        default='USER',
        help_text='User role in the system'
    )
    supervisor = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='supervised_users',
        help_text='Supervisor of this user (for USER and SUPERVISOR roles)'
    )
    
    # Assignments
    teams = models.JSONField(
        _('teams'),
        default=list,
        blank=True,
        help_text='List of team names this user belongs to'
    )
    committees = models.JSONField(
        _('committees'),
        default=list,
        blank=True,
        help_text='List of committee codes assigned for voting day'
    )
    
    # Status
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text='User can login and use the system'
    )
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text='User can access Django admin'
    )
    
    # Timestamps
    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)
    last_login = models.DateTimeField(_('last login'), null=True, blank=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        db_table = 'users'
        verbose_name = _('user')
        verbose_name_plural = _('users')
        ordering = ['-date_joined']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
            models.Index(fields=['supervisor']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return self.email
    
    @property
    def full_name(self):
        """Get user's full name."""
        return f"{self.first_name} {self.last_name}".strip()
    
    def is_admin_or_above(self):
        """Check if user is admin or super admin."""
        return self.role in ['SUPER_ADMIN', 'ADMIN']
    
    def is_supervisor_or_above(self):
        """Check if user is supervisor or higher."""
        return self.role in ['SUPER_ADMIN', 'ADMIN', 'SUPERVISOR']
    
    def get_supervised_users(self):
        """
        Get all users supervised by this user.
        
        Returns:
            QuerySet: Active users supervised by this user
        """
        if not self.is_supervisor_or_above():
            return CustomUser.objects.none()
        return self.supervised_users.filter(is_active=True)
    
    def can_access_committee(self, committee_code):
        """
        Check if user can access a specific committee.
        
        Args:
            committee_code (str): Committee code to check
        
        Returns:
            bool: True if user can access the committee
        """
        # Admins can access all committees
        if self.is_admin_or_above():
            return True
        
        # Check if committee is in user's assigned committees
        return committee_code in self.committees
    
    def assign_supervisor(self, supervisor):
        """
        Assign a supervisor to this user.
        
        Args:
            supervisor (CustomUser): Supervisor user
        
        Raises:
            ValueError: If supervisor is not a supervisor or above
        """
        if not supervisor.is_supervisor_or_above():
            raise ValueError('Supervisor must have SUPERVISOR role or above')
        
        self.supervisor = supervisor
        self.save(update_fields=['supervisor'])
    
    def assign_teams(self, team_list):
        """
        Assign teams to this user.
        
        Args:
            team_list (list): List of team names
        """
        self.teams = team_list
        self.save(update_fields=['teams'])
    
    def assign_committees(self, committee_list):
        """
        Assign committees to this user for voting day.
        
        Args:
            committee_list (list): List of committee codes
        """
        self.committees = committee_list
        self.save(update_fields=['committees'])
