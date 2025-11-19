# Backend Implementation Plan - Election System

**Version**: 1.0  
**Framework**: Django 4.2+ | Django REST Framework  
**Database**: PostgreSQL 15+  
**Last Updated**: October 2025

---

## 📋 Table of Contents
1. [Project Structure](#project-structure)
2. [Django Apps Architecture](#django-apps-architecture)
3. [Database Models](#database-models)
4. [API Endpoints](#api-endpoints)
5. [Authentication & Permissions](#authentication--permissions)
6. [Implementation Phases](#implementation-phases)
7. [Code Standards](#code-standards)
8. [Testing Strategy](#testing-strategy)

---

## Project Structure

### Backend Directory Layout
```
backend/
├── core/                          # Django project settings
│   ├── __init__.py
│   ├── settings.py               # Main settings
│   ├── settings_prod.py          # Production settings
│   ├── urls.py                   # Root URL configuration
│   ├── wsgi.py                   # WSGI entry point
│   └── asgi.py                   # ASGI for WebSockets
│
├── apps/                          # All Django apps
│   ├── account/                  # User management & authentication
│   │   ├── models.py            # CustomUser model
│   │   ├── serializers.py       # User serializers
│   │   ├── views.py             # Auth views
│   │   ├── permissions.py       # Custom permissions
│   │   ├── urls.py              # Account URLs
│   │   └── tests.py             # User tests
│   │
│   ├── election/                 # Election configuration
│   │   ├── models.py            # Election, Committee models
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── tests.py
│   │
│   ├── electors/                 # Elector management
│   │   ├── models.py            # Elector model
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── import_service.py    # CSV import logic
│   │   └── tests.py
│   │
│   ├── guarantees/               # Guarantee collection
│   │   ├── models.py            # Guarantee, Group models
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── tests.py
│   │
│   ├── voting/                   # Voting day operations
│   │   ├── models.py            # Attendance, VoteCount models
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── attendance_service.py # Attendance logic
│   │   └── tests.py
│   │
│   ├── reports/                  # Reporting & analytics
│   │   ├── views.py             # Report views
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── generators.py        # PDF/Excel generators
│   │   └── tests.py
│   │
│   └── utils/                    # Shared utilities
│       ├── mixins.py            # Reusable mixins
│       ├── responses.py         # Standard response format
│       ├── permissions.py       # Common permissions
│       └── validators.py        # Custom validators
│
├── static/                        # Static files
├── media/                         # Uploaded files
├── requirements.txt              # Python dependencies
├── pytest.ini                    # Pytest configuration
├── manage.py                     # Django management
└── README.md                     # Backend README
```

---

## Django Apps Architecture

### App: `account` (User Management)

**Purpose**: User authentication, authorization, and profile management

**Models**:
- `CustomUser` - Extended user model with roles

**Key Features**:
- JWT authentication
- Role-based permissions (SuperAdmin, Admin, Supervisor, User)
- User profile management
- Password change/reset

---

### App: `election` (Election Configuration)

**Purpose**: Election settings and committee management

**Models**:
- `Election` - Election configuration
- `Committee` - Voting committees
- `ElectionSettings` - System settings (voting mode, limits, etc.)

**Key Features**:
- Configure voting mode (full party, mixed, both)
- Manage committees
- Election lifecycle management (setup → voting → closed)

---

### App: `electors` (Elector Management)

**Purpose**: Elector database and CSV import

**Models**:
- `Elector` - Elector information with 7-part name

**Key Features**:
- CSV import with validation
- Advanced multi-field search
- Name parsing (7 components)
- Elector CRUD operations

---

### App: `guarantees` (Guarantee Collection)

**Purpose**: Guarantee collection and tracking

**Models**:
- `Guarantee` - User's guarantee for an elector
- `GuaranteeGroup` - Custom grouping
- `GuaranteeNote` - Notes with history
- `GuaranteeHistory` - Audit trail

**Key Features**:
- Personal guarantee lists (user-isolated)
- Status tracking (Strong/Medium/Weak)
- Custom groups
- Notes and additional contacts
- Supervisor can view team's guarantees

---

### App: `voting` (Voting Day Operations)

**Purpose**: Attendance tracking and vote counting

**Models**:
- `Attendance` - Elector attendance records
- `VoteCount` - Committee vote counts
- `VotingSession` - Voting day session tracking

**Key Features**:
- Fast KOC ID-based attendance marking
- Walk-in elector addition
- Real-time statistics
- Vote count entry and validation

---

### App: `reports` (Reporting & Analytics)

**Purpose**: Generate reports and analytics

**Key Features**:
- Guarantee statistics (personal, supervisor, admin)
- Attendance reports
- Results compilation
- Guarantee accuracy analysis
- Export to Excel/PDF

---

## Database Models

### 1. Account App

#### CustomUser Model
```python
# apps/account/models.py
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    """Custom user manager"""
    
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('role', 'SUPER_ADMIN')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model for election system.
    
    Roles: SUPER_ADMIN, ADMIN, SUPERVISOR, USER
    """
    
    ROLE_CHOICES = [
        ('SUPER_ADMIN', 'Super Admin'),
        ('ADMIN', 'Admin'),
        ('SUPERVISOR', 'Supervisor'),
        ('USER', 'User'),
    ]
    
    # Basic Information
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=100)
    last_name = models.CharField(_('last name'), max_length=100)
    phone = models.CharField(_('phone number'), max_length=15, blank=True)
    
    # Role & Hierarchy
    role = models.CharField(
        _('role'),
        max_length=20,
        choices=ROLE_CHOICES,
        default='USER'
    )
    supervisor = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='supervised_users',
        help_text='Supervisor of this user'
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
    is_active = models.BooleanField(_('active'), default=True)
    is_staff = models.BooleanField(_('staff status'), default=False)
    
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
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
            models.Index(fields=['supervisor']),
        ]
    
    def __str__(self):
        return self.email
    
    @property
    def full_name(self):
        """Get full name"""
        return f"{self.first_name} {self.last_name}".strip()
    
    def is_admin_or_above(self):
        """Check if user is admin or super admin"""
        return self.role in ['SUPER_ADMIN', 'ADMIN']
    
    def is_supervisor_or_above(self):
        """Check if user is supervisor or higher"""
        return self.role in ['SUPER_ADMIN', 'ADMIN', 'SUPERVISOR']
    
    def get_supervised_users(self):
        """Get all users supervised by this user"""
        if not self.is_supervisor_or_above():
            return CustomUser.objects.none()
        return self.supervised_users.filter(is_active=True)
```

---

### 2. Election App

#### Election Model
```python
# apps/election/models.py
from django.db import models
from django.conf import settings

class Election(models.Model):
    """
    Election configuration and settings.
    Single election instance per deployment.
    """
    
    VOTING_MODE_CHOICES = [
        ('FULL_PARTY', 'Full Party Ticket'),
        ('MIXED', 'Mixed Ticket'),
        ('BOTH', 'Both Options'),
    ]
    
    STATUS_CHOICES = [
        ('SETUP', 'Setup'),
        ('GUARANTEE_PHASE', 'Guarantee Collection Phase'),
        ('VOTING_DAY', 'Voting Day'),
        ('COUNTING', 'Counting in Progress'),
        ('CLOSED', 'Closed'),
    ]
    
    # Basic Information
    name = models.CharField(max_length=255, help_text='Election name')
    description = models.TextField(blank=True)
    
    # Voting Configuration
    voting_mode = models.CharField(
        max_length=20,
        choices=VOTING_MODE_CHOICES,
        default='BOTH'
    )
    max_candidates_per_ballot = models.IntegerField(
        default=19,
        help_text='Maximum candidates a voter can select'
    )
    allow_partial_voting = models.BooleanField(
        default=True,
        help_text='Allow voting for less than max candidates'
    )
    minimum_votes_required = models.IntegerField(
        default=1,
        help_text='Minimum candidates required per ballot'
    )
    
    # Election Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='SETUP'
    )
    
    # Important Dates
    guarantee_start_date = models.DateField(null=True, blank=True)
    guarantee_end_date = models.DateField(null=True, blank=True)
    voting_date = models.DateField(null=True, blank=True)
    
    # Audit
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='elections_created'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'elections'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class Committee(models.Model):
    """
    Voting committee (male/female separation).
    """
    
    GENDER_CHOICES = [
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
    ]
    
    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
        related_name='committees'
    )
    
    # Committee Details
    code = models.CharField(
        max_length=20,
        unique=True,
        help_text='Committee code (e.g., EK-II, FC#28)'
    )
    name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    location = models.CharField(max_length=255, blank=True)
    
    # Staff Assignment
    assigned_users = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='assigned_committees',
        blank=True,
        help_text='Users assigned to this committee for voting day'
    )
    
    # Audit
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'committees'
        ordering = ['code']
        indexes = [
            models.Index(fields=['election', 'code']),
            models.Index(fields=['gender']),
        ]
    
    def __str__(self):
        return f"{self.code} - {self.name}"
    
    @property
    def elector_count(self):
        """Get total electors assigned to this committee"""
        return self.electors.count()
    
    @property
    def attendance_count(self):
        """Get total attendance for this committee"""
        return self.attendances.count()
    
    @property
    def attendance_percentage(self):
        """Calculate attendance percentage"""
        total = self.elector_count
        if total == 0:
            return 0
        attended = self.attendance_count
        return round((attended / total) * 100, 2)
```

---

### 3. Electors App

#### Elector Model
```python
# apps/electors/models.py
from django.db import models
from django.contrib.postgres.indexes import GinIndex
from django.contrib.postgres.search import SearchVectorField, SearchVector

class Elector(models.Model):
    """
    Elector (KOC employee) information.
    Name parsed into 7 components for advanced search.
    """
    
    GENDER_CHOICES = [
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
    ]
    
    # Primary Key
    koc_id = models.CharField(
        max_length=20,
        primary_key=True,
        help_text='KOC Employee Number'
    )
    
    # Name Components (7 parts)
    name_first = models.CharField(max_length=50)
    name_second = models.CharField(max_length=50, blank=True)
    name_third = models.CharField(max_length=50, blank=True)
    name_fourth = models.CharField(max_length=50, blank=True)
    name_fifth = models.CharField(max_length=50, blank=True)
    name_before_last = models.CharField(
        max_length=50,
        blank=True,
        help_text='Family/Tribe name'
    )
    name_last = models.CharField(max_length=50, help_text='Surname')
    
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
    location = models.CharField(
        max_length=100,
        blank=True,
        help_text='Work Location'
    )
    extension = models.CharField(
        max_length=20,
        blank=True,
        help_text='Office Phone Extension'
    )
    
    # Contact Information
    mobile = models.CharField(max_length=15, blank=True)
    
    # Organizational
    area = models.CharField(max_length=100, blank=True)
    team = models.CharField(max_length=100, blank=True)
    
    # Committee Assignment
    committee = models.ForeignKey(
        'election.Committee',
        on_delete=models.PROTECT,
        related_name='electors',
        help_text='Assigned voting committee'
    )
    
    # Demographics
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    
    # Status
    is_active = models.BooleanField(
        default=True,
        help_text='Eligible to vote'
    )
    is_walk_in = models.BooleanField(
        default=False,
        help_text='Added on voting day (not in original import)'
    )
    
    # Full-text search
    search_vector = SearchVectorField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'electors'
        ordering = ['name_first', 'name_last']
        indexes = [
            models.Index(fields=['koc_id']),
            models.Index(fields=['name_first', 'name_last']),
            models.Index(fields=['name_before_last']),
            models.Index(fields=['committee']),
            models.Index(fields=['team']),
            models.Index(fields=['section']),
            models.Index(fields=['mobile']),
            models.Index(fields=['gender']),
            GinIndex(fields=['search_vector']),
        ]
    
    def __str__(self):
        return f"{self.koc_id} - {self.full_name}"
    
    @property
    def full_name(self):
        """Get full name from components"""
        parts = [
            self.name_first,
            self.name_second,
            self.name_third,
            self.name_fourth,
            self.name_fifth,
            self.name_before_last,
            self.name_last,
        ]
        return ' '.join([p for p in parts if p]).strip()
    
    def update_search_vector(self):
        """Update full-text search vector"""
        self.search_vector = SearchVector(
            'name_first', 'name_second', 'name_third', 'name_fourth',
            'name_fifth', 'name_before_last', 'name_last',
            'koc_id', 'designation', 'section', 'mobile'
        )
        self.save(update_fields=['search_vector'])
    
    def save(self, *args, **kwargs):
        """Override save to update search vector"""
        super().save(*args, **kwargs)
        if not self.search_vector:
            self.update_search_vector()
```

---

### 4. Guarantees App

#### Guarantee Models
```python
# apps/guarantees/models.py
from django.db import models
from django.conf import settings

class GuaranteeGroup(models.Model):
    """
    Custom groups created by users to organize guarantees.
    """
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='guarantee_groups'
    )
    name = models.CharField(max_length=100)
    color = models.CharField(
        max_length=7,
        default='#1976d2',
        help_text='Hex color code for UI'
    )
    description = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'guarantee_groups'
        ordering = ['name']
        unique_together = [['user', 'name']]
        indexes = [
            models.Index(fields=['user']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.name}"
    
    @property
    def guarantee_count(self):
        """Get count of guarantees in this group"""
        return self.guarantees.count()


class Guarantee(models.Model):
    """
    Guarantee collected by user for an elector.
    Each user has their own isolated guarantee list.
    """
    
    STATUS_CHOICES = [
        ('STRONG', 'Strong'),
        ('MEDIUM', 'Medium'),
        ('WEAK', 'Weak'),
    ]
    
    # Ownership
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='guarantees',
        help_text='User who collected this guarantee'
    )
    elector = models.ForeignKey(
        'electors.Elector',
        on_delete=models.CASCADE,
        related_name='guarantees'
    )
    
    # Guarantee Details
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='MEDIUM'
    )
    
    # Organization
    groups = models.ManyToManyField(
        GuaranteeGroup,
        related_name='guarantees',
        blank=True,
        help_text='Custom groups this guarantee belongs to'
    )
    
    # Additional Information
    additional_contacts = models.JSONField(
        default=list,
        blank=True,
        help_text='Additional phone numbers: [{type, number, label}]'
    )
    
    # Follow-up
    follow_up_date = models.DateField(null=True, blank=True)
    follow_up_done = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'guarantees'
        ordering = ['-created_at']
        unique_together = [['user', 'elector']]
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['elector']),
        ]
    
    def __str__(self):
        return f"{self.user.email} → {self.elector.full_name}"
    
    @property
    def status_display_color(self):
        """Get color for status in UI"""
        colors = {
            'STRONG': '#4caf50',  # Green
            'MEDIUM': '#ff9800',  # Orange
            'WEAK': '#f44336',    # Red
        }
        return colors.get(self.status, '#9e9e9e')


class GuaranteeNote(models.Model):
    """
    Notes attached to guarantees with edit history.
    """
    
    guarantee = models.ForeignKey(
        Guarantee,
        on_delete=models.CASCADE,
        related_name='notes'
    )
    content = models.TextField()
    is_pinned = models.BooleanField(default=False)
    
    # Audit
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='guarantee_notes_created'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'guarantee_notes'
        ordering = ['-is_pinned', '-created_at']
        indexes = [
            models.Index(fields=['guarantee', '-created_at']),
        ]
    
    def __str__(self):
        return f"Note for {self.guarantee}"


class GuaranteeHistory(models.Model):
    """
    Audit trail for guarantee changes.
    """
    
    guarantee = models.ForeignKey(
        Guarantee,
        on_delete=models.CASCADE,
        related_name='history'
    )
    field_name = models.CharField(max_length=50)
    old_value = models.TextField(blank=True)
    new_value = models.TextField(blank=True)
    
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )
    changed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'guarantee_history'
        ordering = ['-changed_at']
        indexes = [
            models.Index(fields=['guarantee', '-changed_at']),
        ]
    
    def __str__(self):
        return f"{self.guarantee} - {self.field_name} changed"
```

---

### 5. Voting App

#### Voting Models
```python
# apps/voting/models.py
from django.db import models
from django.conf import settings

class Attendance(models.Model):
    """
    Elector attendance record for voting day.
    """
    
    elector = models.OneToOneField(
        'electors.Elector',
        on_delete=models.CASCADE,
        related_name='attendance',
        help_text='Elector who attended'
    )
    committee = models.ForeignKey(
        'election.Committee',
        on_delete=models.CASCADE,
        related_name='attendances'
    )
    
    # Who recorded this
    marked_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='attendances_marked'
    )
    
    # When
    attended_at = models.DateTimeField(auto_now_add=True)
    
    # Additional Info
    is_walk_in = models.BooleanField(
        default=False,
        help_text='Elector was added on voting day'
    )
    notes = models.TextField(blank=True)
    device_info = models.JSONField(
        default=dict,
        blank=True,
        help_text='Device and location info (if available)'
    )
    
    class Meta:
        db_table = 'attendance'
        ordering = ['-attended_at']
        indexes = [
            models.Index(fields=['committee', '-attended_at']),
            models.Index(fields=['marked_by']),
            models.Index(fields=['-attended_at']),
        ]
    
    def __str__(self):
        return f"{self.elector.koc_id} attended at {self.attended_at}"


class VoteCount(models.Model):
    """
    Vote counts entered by committee staff after manual counting.
    Stores aggregate results, not individual votes (maintains anonymity).
    """
    
    committee = models.OneToOneField(
        'election.Committee',
        on_delete=models.CASCADE,
        related_name='vote_count'
    )
    
    # Vote Data
    party_candidate_votes = models.JSONField(
        help_text='Vote counts: {party_id: count} or {candidate_id: count}'
    )
    total_valid_votes = models.IntegerField()
    total_invalid_votes = models.IntegerField(default=0)
    
    # Verification
    entered_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='vote_counts_entered'
    )
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='vote_counts_verified',
        help_text='Second user who verified the count'
    )
    
    # Status
    is_final = models.BooleanField(
        default=False,
        help_text='Finalized and locked'
    )
    notes = models.TextField(blank=True)
    
    # Timestamps
    submitted_at = models.DateTimeField(auto_now_add=True)
    finalized_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'vote_counts'
        indexes = [
            models.Index(fields=['committee']),
            models.Index(fields=['is_final']),
        ]
    
    def __str__(self):
        return f"Vote Count - {self.committee.code}"
    
    @property
    def total_votes(self):
        """Get total votes (valid + invalid)"""
        return self.total_valid_votes + self.total_invalid_votes
    
    def finalize(self, user):
        """Finalize and lock the vote count"""
        from django.utils import timezone
        self.is_final = True
        self.finalized_at = timezone.now()
        self.verified_by = user
        self.save(update_fields=['is_final', 'finalized_at', 'verified_by'])
```

---

## API Endpoints

### Complete API Structure

```
/api/
├── auth/
│   ├── login/                      POST   - Login with email/password
│   ├── logout/                     POST   - Logout
│   ├── refresh/                    POST   - Refresh JWT token
│   ├── change-password/            POST   - Change password
│   └── profile/                    GET    - Current user profile
│
├── users/
│   ├── /                           GET    - List users (admin only)
│   ├── /                           POST   - Create user (admin only)
│   ├── {id}/                       GET    - Get user details
│   ├── {id}/                       PUT    - Update user
│   ├── {id}/                       DELETE - Delete user (admin only)
│   ├── {id}/assign-supervisor/     PATCH  - Assign supervisor
│   ├── {id}/assign-teams/          PATCH  - Assign teams
│   ├── {id}/assign-committees/     PATCH  - Assign committees
│   ├── me/                         GET    - Current user details
│   └── supervised/                 GET    - Users I supervise
│
├── election/
│   ├── /                           GET    - Get current election
│   ├── /                           PUT    - Update election settings (admin)
│   ├── committees/                 GET    - List committees
│   ├── committees/                 POST   - Create committee (admin)
│   ├── committees/{id}/            GET    - Get committee details
│   ├── committees/{id}/            PUT    - Update committee
│   ├── committees/{id}/electors/   GET    - List electors in committee
│   └── committees/{id}/stats/      GET    - Committee statistics
│
├── electors/
│   ├── /                           GET    - List electors (paginated)
│   ├── /                           POST   - Create elector (admin/voting day)
│   ├── {koc_id}/                   GET    - Get elector details
│   ├── {koc_id}/                   PUT    - Update elector
│   ├── {koc_id}/                   DELETE - Delete elector (admin)
│   ├── search/                     GET    - Advanced multi-field search
│   ├── import/                     POST   - Import from CSV (admin)
│   ├── export/                     GET    - Export to Excel
│   └── stats/                      GET    - Elector statistics
│
├── guarantees/
│   ├── /                           GET    - List my guarantees
│   ├── /                           POST   - Create guarantee
│   ├── {id}/                       GET    - Get guarantee details
│   ├── {id}/                       PUT    - Update guarantee
│   ├── {id}/                       PATCH  - Partial update
│   ├── {id}/                       DELETE - Delete guarantee
│   ├── {id}/notes/                 GET    - List notes
│   ├── {id}/notes/                 POST   - Add note
│   ├── {id}/history/               GET    - Change history
│   ├── groups/                     GET    - List my groups
│   ├── groups/                     POST   - Create group
│   ├── groups/{id}/                DELETE - Delete group
│   ├── by-group/{group_id}/        GET    - Guarantees in group
│   ├── by-status/{status}/         GET    - Guarantees by status
│   ├── stats/                      GET    - My statistics
│   ├── export/                     GET    - Export my guarantees
│   └── bulk-import/                POST   - Bulk import guarantees
│
├── admin/
│   ├── guarantees/all/             GET    - All guarantees (admin)
│   ├── guarantees/by-user/{id}/    GET    - User's guarantees
│   ├── statistics/system/          GET    - System-wide stats
│   ├── statistics/coverage/        GET    - Coverage analysis
│   ├── users/performance/          GET    - User rankings
│   └── reports/guarantee-summary/  GET    - Admin guarantee report
│
├── supervisor/
│   ├── team/guarantees/            GET    - Team guarantees
│   ├── team/statistics/            GET    - Team statistics
│   ├── team/performance/           GET    - Team performance comparison
│   └── team/users/                 GET    - Supervised users
│
├── voting/
│   ├── attendance/                 GET    - List attendance (my committees)
│   ├── attendance/mark/            POST   - Mark attendance
│   ├── attendance/check/{koc_id}/  GET    - Check if attended
│   ├── attendance/committee/{code}/ GET   - Committee attendance list
│   ├── attendance/stats/{code}/    GET    - Committee attendance stats
│   ├── attendance/export/{code}/   GET    - Export attendance
│   ├── vote-count/{committee}/     GET    - Get vote count
│   ├── vote-count/{committee}/     POST   - Enter vote count
│   ├── vote-count/{committee}/     PUT    - Update vote count
│   ├── vote-count/{committee}/finalize/ POST - Finalize vote count
│   └── my-committees/              GET    - My assigned committees
│
└── reports/
    ├── guarantee-accuracy/         GET    - Guarantee vs actual turnout
    ├── results/summary/            GET    - Election results summary
    ├── results/by-committee/       GET    - Results by committee
    ├── results/export/             GET    - Export results (PDF/Excel)
    ├── attendance/summary/         GET    - Attendance summary
    └── audit-trail/                GET    - Complete audit log (admin)
```

---

## Authentication & Permissions

### JWT Authentication Setup

```python
# core/settings.py
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
}
```

### Custom Permissions

```python
# apps/utils/permissions.py
from rest_framework.permissions import BasePermission

class IsSuperAdmin(BasePermission):
    """Only super admins"""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'SUPER_ADMIN'


class IsAdminOrAbove(BasePermission):
    """Admin or Super Admin"""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin_or_above()


class IsSupervisorOrAbove(BasePermission):
    """Supervisor, Admin, or Super Admin"""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_supervisor_or_above()


class IsOwnerOrSupervisor(BasePermission):
    """Owner of the resource or their supervisor"""
    
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        
        # Admins can access anything
        if request.user.is_admin_or_above():
            return True
        
        # Owner can access
        if hasattr(obj, 'user') and obj.user == request.user:
            return True
        
        # Supervisor can access their team's data
        if request.user.is_supervisor_or_above():
            if hasattr(obj, 'user') and obj.user.supervisor == request.user:
                return True
        
        return False


class IsAssignedToCommittee(BasePermission):
    """User is assigned to the committee"""
    
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        
        # Admins can access any committee
        if request.user.is_admin_or_above():
            return True
        
        # Check if committee code is in user's assigned committees
        committee_code = None
        if hasattr(obj, 'code'):
            committee_code = obj.code
        elif hasattr(obj, 'committee'):
            committee_code = obj.committee.code
        
        if committee_code:
            return committee_code in request.user.committees
        
        return False
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2) ✅ COMPLETE

#### Week 1: Project Setup ✅
```bash
# Create Django project
django-admin startproject core .

# Create apps
python manage.py startapp account
python manage.py startapp election
python manage.py startapp electors
python manage.py startapp guarantees
python manage.py startapp voting
python manage.py startapp reports
python manage.py startapp utils

# Install dependencies
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install django-filter
pip install django-cors-headers
pip install psycopg2-binary
pip install python-decouple
pip install pandas
pip install openpyxl
pip install reportlab
pip install celery
pip install redis
pip install django-channels
```

**Deliverables**:
- [x] Django project initialized
- [ ] All apps created
- [ ] Settings configured (dev/prod split)
- [ ] PostgreSQL database created
- [ ] Git repository initialized
- [ ] Requirements.txt created
- [ ] README.md with setup instructions

#### Week 2: User Management & Auth
**Models**:
- [ ] CustomUser model
- [ ] User migrations

**Serializers**:
- [ ] UserSerializer (full)
- [ ] UserListSerializer (lightweight)
- [ ] LoginSerializer
- [ ] PasswordChangeSerializer

**Views**:
- [ ] UserViewSet (CRUD)
- [ ] Login/Logout views
- [ ] Profile view
- [ ] Assign supervisor endpoint
- [ ] Assign teams/committees endpoints

**Tests**:
- [ ] User creation tests
- [ ] Authentication tests
- [ ] Permission tests

---

### Phase 2: Election & Electors (Week 3-4) ✅ COMPLETE

#### Week 3: Election Configuration
**Models**:
- [ ] Election model
- [ ] Committee model
- [ ] Migrations

**Views**:
- [ ] ElectionViewSet
- [ ] CommitteeViewSet
- [ ] Committee statistics endpoint

**Admin**:
- [ ] Django admin for Election
- [ ] Django admin for Committee

#### Week 4: Elector Management
**Models**:
- [ ] Elector model with 7-part name
- [ ] Full-text search configuration
- [ ] Migrations

**Serializers**:
- [ ] ElectorSerializer (full)
- [ ] ElectorListSerializer
- [ ] ElectorImportSerializer

**Views**:
- [ ] ElectorViewSet (CRUD)
- [ ] Advanced search endpoint
- [ ] CSV import endpoint
- [ ] Export endpoint

**Services**:
- [ ] `import_service.py` - CSV parsing and validation
- [ ] Name parsing logic (7 components)
- [ ] Duplicate detection

**Tests**:
- [ ] Elector CRUD tests
- [ ] Search tests (all 13 fields)
- [ ] Import tests (CSV validation)
- [ ] Export tests

---

### Phase 3: Guarantee System (Week 5-6) ✅ COMPLETE

#### Week 5: Core Guarantee Features
**Models**:
- [ ] GuaranteeGroup model
- [ ] Guarantee model
- [ ] Migrations

**Serializers**:
- [ ] GuaranteeSerializer (full with nested data)
- [ ] GuaranteeListSerializer
- [ ] GuaranteeGroupSerializer

**Views**:
- [ ] GuaranteeViewSet (CRUD)
- [ ] GuaranteeGroupViewSet
- [ ] Filter by status endpoint
- [ ] Filter by group endpoint
- [ ] My statistics endpoint

**Permissions**:
- [ ] IsOwnerOrSupervisor permission
- [ ] Guarantee isolation enforcement

**Tests**:
- [ ] Guarantee creation tests
- [ ] User isolation tests
- [ ] Supervisor access tests
- [ ] Group management tests

#### Week 6: Notes, History & Reporting
**Models**:
- [ ] GuaranteeNote model
- [ ] GuaranteeHistory model
- [ ] Migrations

**Views**:
- [ ] GuaranteeNote endpoints
- [ ] History tracking
- [ ] Personal statistics
- [ ] Export personal guarantees

**Signals**:
- [ ] Auto-create history on guarantee changes
- [ ] Auto-update timestamps

**Admin Views**:
- [ ] All guarantees view (admin)
- [ ] System statistics
- [ ] Coverage analysis
- [ ] User performance rankings

**Supervisor Views**:
- [ ] Team guarantees
- [ ] Team statistics
- [ ] Team performance

---

### Phase 4: Dashboard & Reports (Week 7-8)

#### Week 7: Statistics & Analytics
**Views**:
- [ ] Personal dashboard data
- [ ] Supervisor dashboard data
- [ ] Admin dashboard data
- [ ] Coverage analysis
- [ ] User rankings

**Optimizations**:
- [ ] Redis caching for statistics
- [ ] Denormalized counts for performance
- [ ] Database query optimization

#### Week 8: Export & Reporting
**Services**:
- [ ] `generators.py` - PDF/Excel generation
- [ ] Report templates

**Endpoints**:
- [ ] Export personal guarantees (Excel/PDF)
- [ ] Export team report (supervisor)
- [ ] Export system report (admin)
- [ ] Print-friendly views

---

### Phase 5: Voting Day Operations (Week 9-10)

#### Week 9: Attendance System
**Models**:
- [ ] Attendance model
- [ ] Migrations

**Serializers**:
- [ ] AttendanceSerializer
- [ ] AttendanceMarkSerializer

**Views**:
- [ ] Mark attendance endpoint (KOC ID search)
- [ ] Check attendance status
- [ ] Committee attendance list
- [ ] Real-time statistics
- [ ] Walk-in elector addition

**Permissions**:
- [ ] IsAssignedToCommittee permission
- [ ] Committee-based data filtering

**Tests**:
- [ ] Attendance marking tests
- [ ] Duplicate prevention tests
- [ ] Walk-in tests
- [ ] Statistics tests

#### Week 10: WebSocket & Real-time
**WebSocket Consumers**:
- [ ] Attendance statistics consumer
- [ ] Live attendance updates

**Channels Configuration**:
- [ ] Redis channel layer
- [ ] WebSocket routing
- [ ] Authentication for WebSocket

---

### Phase 6: Vote Counting & Results (Week 11-12)

#### Week 11: Vote Count Entry
**Models**:
- [ ] VoteCount model
- [ ] Migrations

**Views**:
- [ ] Enter vote count
- [ ] Update vote count
- [ ] Finalize vote count
- [ ] Verification workflow

**Validation**:
- [ ] Vote count validation (≤ attendance)
- [ ] Dual-entry verification

#### Week 12: Results Compilation
**Services**:
- [ ] Results aggregation service
- [ ] Guarantee accuracy calculation

**Views**:
- [ ] Results summary
- [ ] Results by committee
- [ ] Guarantee accuracy report
- [ ] Export results

**Reports**:
- [ ] Official results PDF
- [ ] Committee breakdown
- [ ] Guarantee analysis
- [ ] Audit trail

---

### Phase 7: Testing & Deployment (Week 13-15)

#### Week 13: Comprehensive Testing
- [ ] Unit tests (80%+ coverage)
- [ ] Integration tests (all workflows)
- [ ] API tests (all endpoints)
- [ ] Performance tests (load testing)
- [ ] Security tests (OWASP top 10)

#### Week 14: Documentation & Polish
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Code documentation (docstrings)
- [ ] User documentation
- [ ] Admin documentation
- [ ] Deployment guide

#### Week 15: Deployment
- [ ] Production settings configuration
- [ ] Database optimization (indexes, etc.)
- [ ] Caching setup (Redis)
- [ ] Monitoring setup (Sentry)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Staging deployment
- [ ] Production deployment

---

## Code Standards

### Django Best Practices

#### 1. Model Design
```python
# ✅ GOOD: Complete model with all best practices
class MyModel(models.Model):
    """
    Clear docstring explaining the model.
    """
    
    # Fields
    name = models.CharField(max_length=255)
    
    # Audit fields (ALWAYS)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, ...)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'my_models'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return self.name
```

#### 2. Serializer Design
```python
# ✅ GOOD: Two serializers (full + list)
class MyModelSerializer(serializers.ModelSerializer):
    """Full serializer with computed fields"""
    
    computed_field = serializers.SerializerMethodField()
    
    class Meta:
        model = MyModel
        fields = '__all__'
    
    def get_computed_field(self, obj):
        return obj.calculate_something()


class MyModelListSerializer(serializers.ModelSerializer):
    """Lightweight for list views"""
    
    class Meta:
        model = MyModel
        fields = ['id', 'name', 'created_at']
```

#### 3. ViewSet Design
```python
# ✅ GOOD: Complete ViewSet with optimizations
class MyModelViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for MyModel.
    """
    
    queryset = MyModel.objects.all()
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status']
    search_fields = ['name']
    ordering_fields = ['created_at']
    
    def get_serializer_class(self):
        """Use list serializer for list action"""
        if self.action == 'list':
            return MyModelListSerializer
        return MyModelSerializer
    
    def get_queryset(self):
        """Optimize queries with select_related"""
        return MyModel.objects.select_related(
            'created_by'
        ).filter(
            # Add any filtering here
        )
    
    def perform_create(self, serializer):
        """Auto-set created_by"""
        serializer.save(created_by=self.request.user)
```

#### 4. URL Configuration
```python
# ✅ GOOD: Use router for ViewSets
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'my-models', MyModelViewSet, basename='mymodel')

urlpatterns = [
    path('', include(router.urls)),
]
```

### Naming Conventions

**Models**: PascalCase (e.g., `CustomUser`, `GuaranteeGroup`)  
**Variables**: snake_case (e.g., `user_id`, `created_at`)  
**Functions**: snake_case (e.g., `get_queryset`, `perform_create`)  
**Constants**: UPPER_SNAKE_CASE (e.g., `MAX_LENGTH`, `STATUS_CHOICES`)  
**URLs**: kebab-case (e.g., `/api/my-models/`)  
**Database tables**: snake_case (e.g., `guarantee_groups`)

### Docstrings

```python
def complex_function(param1, param2):
    """
    One-line summary.
    
    Longer description if needed.
    
    Args:
        param1 (str): Description
        param2 (int): Description
    
    Returns:
        dict: Description of return value
    
    Raises:
        ValueError: When param1 is invalid
    """
    pass
```

### Comments

```python
# ✅ GOOD: Explain WHY, not WHAT
# Calculate using formula from requirement doc v2.1
result = (value * 0.85) + offset

# ❌ BAD: States the obvious
# Multiply value by 0.85 and add offset
result = (value * 0.85) + offset
```

---

## Testing Strategy

### Test Structure
```
backend/
├── apps/
│   └── {app}/
│       ├── tests/
│       │   ├── __init__.py
│       │   ├── test_models.py
│       │   ├── test_serializers.py
│       │   ├── test_views.py
│       │   └── test_permissions.py
│       └── ...
```

### Model Tests
```python
# apps/guarantees/tests/test_models.py
from django.test import TestCase
from apps.guarantees.models import Guarantee

class GuaranteeModelTest(TestCase):
    
    def setUp(self):
        """Setup test data"""
        self.user = CustomUser.objects.create_user(
            email='test@test.com',
            password='password123'
        )
        self.elector = Elector.objects.create(...)
    
    def test_create_guarantee(self):
        """Test guarantee creation"""
        guarantee = Guarantee.objects.create(
            user=self.user,
            elector=self.elector,
            status='STRONG'
        )
        self.assertEqual(guarantee.status, 'STRONG')
    
    def test_unique_constraint(self):
        """Test user cannot guarantee same elector twice"""
        Guarantee.objects.create(user=self.user, elector=self.elector)
        
        with self.assertRaises(IntegrityError):
            Guarantee.objects.create(user=self.user, elector=self.elector)
```

### API Tests
```python
# apps/guarantees/tests/test_views.py
from rest_framework.test import APITestCase
from rest_framework import status

class GuaranteeAPITest(APITestCase):
    
    def setUp(self):
        """Setup test data and authenticate"""
        self.user = CustomUser.objects.create_user(
            email='test@test.com',
            password='password123'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_list_my_guarantees(self):
        """Test listing user's own guarantees"""
        response = self.client.get('/api/guarantees/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_create_guarantee(self):
        """Test creating a guarantee"""
        data = {
            'elector': 'KOC123',
            'status': 'STRONG'
        }
        response = self.client.post('/api/guarantees/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_cannot_see_other_user_guarantees(self):
        """Test user isolation"""
        other_user = CustomUser.objects.create_user(...)
        other_guarantee = Guarantee.objects.create(
            user=other_user,
            elector=self.elector
        )
        
        response = self.client.get(f'/api/guarantees/{other_guarantee.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
```

### Coverage Target
```bash
# Run tests with coverage
pytest --cov=apps --cov-report=html

# Target: 80%+ coverage
```

---

## Environment Configuration

### Development Settings
```python
# core/settings.py
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'election_dev',
        'USER': 'postgres',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Logging
LOGGING = {
    'version': 1,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}
```

### Production Settings
```python
# core/settings_prod.py
from .settings import *
import os

DEBUG = False
ALLOWED_HOSTS = [os.getenv('ALLOWED_HOST')]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}

# Security
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

---

## Quick Start Commands

### Development
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Create database
createdb election_dev

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

### Testing
```bash
# Run all tests
pytest

# Run specific app tests
pytest apps/guarantees/tests/

# Run with coverage
pytest --cov=apps --cov-report=html

# View coverage report
open htmlcov/index.html
```

### Production Deployment
```bash
# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate --noinput

# Start gunicorn
gunicorn core.wsgi:application --bind 0.0.0.0:8000
```

---

## Dependencies (requirements.txt)

```txt
# Django
Django==4.2.7
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.0
django-filter==23.3
django-cors-headers==4.3.0

# Database
psycopg2-binary==2.9.9

# Utilities
python-decouple==3.8
python-dateutil==2.8.2

# Excel/CSV
pandas==2.1.3
openpyxl==3.1.2

# PDF Generation
reportlab==4.0.7

# Async/WebSocket
channels==4.0.0
channels-redis==4.1.0
redis==5.0.1

# Background Tasks
celery==5.3.4

# Testing
pytest==7.4.3
pytest-django==4.7.0
pytest-cov==4.1.0
factory-boy==3.3.0

# Production
gunicorn==21.2.0
whitenoise==6.6.0

# Monitoring
sentry-sdk==1.38.0
```

---

## Summary Checklist

### Phase 1: Foundation ✅
- [ ] Django project setup
- [ ] Custom user model
- [ ] JWT authentication
- [ ] Permission system
- [ ] Basic admin panel

### Phase 2: Core Features 🔄
- [ ] Election configuration
- [ ] Committee management
- [ ] Elector database with CSV import
- [ ] Advanced search (13 fields)
- [ ] Guarantee collection system

### Phase 3: Advanced Features 🔄
- [ ] Notes and history tracking
- [ ] Dashboard (3 levels)
- [ ] Reports and exports
- [ ] Supervisor team views
- [ ] Admin analytics

### Phase 4: Voting Day 📅
- [ ] Attendance marking
- [ ] Real-time statistics
- [ ] Walk-in handling
- [ ] Vote count entry

### Phase 5: Results 📅
- [ ] Results aggregation
- [ ] Final reports
- [ ] Guarantee accuracy
- [ ] Archive system

### Phase 6: Production Ready 🎯
- [ ] Comprehensive testing
- [ ] API documentation
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Deployment setup

---

**Next Steps**: Start with Phase 1 (Foundation) and follow the implementation order strictly. Each phase builds on the previous one.

**Reference Documents**:
- Main Specification: `docs/project/idea.md`
- Frontend Architecture: `docs/core/frontend/README.md`
- Backend Patterns: `.cursor/rules/backend-api-patterns.mdc`

---

**Document Version**: 1.0  
**Last Updated**: October 2025  
**Status**: Ready for implementation

