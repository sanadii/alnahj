"""
Election and Committee models.
"""
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError


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
    name = models.CharField(
        max_length=255,
        help_text='Election name'
    )
    description = models.TextField(blank=True)
    
    # Voting Configuration
    voting_mode = models.CharField(
        max_length=20,
        choices=VOTING_MODE_CHOICES,
        default='BOTH',
        help_text='Voting mode: full party, mixed, or both'
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
        default='SETUP',
        help_text='Current election phase'
    )
    
    # Important Dates
    election_date = models.DateField(
        null=True,
        blank=True,
        help_text='Election day date'
    )
    
    # Staff Assignment
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='member_elections',
        blank=True,
        db_table='election_members',
        help_text='Users who are members of this election'
    )
    
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
        verbose_name = 'Election'
        verbose_name_plural = 'Elections'
    
    def __str__(self):
        return self.name
    
    def clean(self):
        """Validate election dates."""
        pass
    
    def save(self, *args, **kwargs):
        """Override save to validate."""
        self.full_clean()
        super().save(*args, **kwargs)


class Committee(models.Model):
    """
    Voting committee (male/female separation).
    Each committee has assigned electors and staff.
    """
    
    GENDER_CHOICES = [
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
        ('MIXED', 'Mixed'),
    ]
    
    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
        related_name='committees',
        help_text='Election this committee belongs to'
    )
    
    # Committee Details
    code = models.CharField(
        max_length=20,
        help_text='Committee code (e.g., EK-II, FC#28)'
    )
    name = models.CharField(
        max_length=255,
        help_text='Committee name'
    )
    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        default='MIXED',
        help_text='Gender segregation'
    )
    location = models.CharField(
        max_length=255,
        blank=True,
        default='',
        help_text='Physical location of the committee'
    )
    
    # Elector Range
    electors_from = models.IntegerField(
        null=True,
        blank=True,
        help_text='Starting elector number for this committee'
    )
    electors_to = models.IntegerField(
        null=True,
        blank=True,
        help_text='Ending elector number for this committee'
    )
    
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
        verbose_name = 'Committee'
        verbose_name_plural = 'Committees'
        indexes = [
            models.Index(fields=['election', 'code']),
            models.Index(fields=['gender']),
            models.Index(fields=['code']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['election', 'code'],
                name='unique_committee_code_per_election'
            ),
        ]
    
    def __str__(self):
        return f"{self.code} - {self.name}"
    
    @property
    def elector_count(self):
        """Get total electors assigned to this committee."""
        return self.electors.filter(is_active=True).count()
    
    @property
    def attendance_count(self):
        """Get total attendance for this committee."""
        return self.attendances.filter(status='ATTENDED').count()
    
    @property
    def attendance_percentage(self):
        """Calculate attendance percentage."""
        total = self.elector_count
        if total == 0:
            return 0
        attended = self.attendance_count
        return round((attended / total) * 100, 2)
    
    @property
    def vote_count(self):
        """Get total votes cast for this committee."""
        from apps.voting.models import VoteCount
        return VoteCount.objects.filter(committee=self).aggregate(
            total=models.Sum('vote_count')
        )['total'] or 0
    
    @property
    def guarantee_count(self):
        """Get total guarantees for this committee."""
        from apps.guarantees.models import Guarantee
        return Guarantee.objects.filter(
            elector__committee=self,
            elector__is_active=True
        ).count()
    
    @property
    def guarantee_attendance_count(self):
        """Get total guarantee attendance for this committee."""
        from apps.guarantees.models import Guarantee
        from apps.attendees.models import Attendance
        # Get guarantees with attendance
        guarantees = Guarantee.objects.filter(
            elector__committee=self,
            elector__is_active=True
        ).values_list('elector__koc_id', flat=True)
        
        return Attendance.objects.filter(
            elector__koc_id__in=guarantees,
            committee=self,
            status=Attendance.Status.ATTENDED
        ).count()
    
    def get_statistics(self):
        """
        Get committee statistics.
        
        Returns:
            dict: Statistics including totals, attendance, votes, etc.
        """
        total_electors = self.elector_count
        total_attended = self.attendance_count
        total_votes = self.vote_count
        pending = total_electors - total_attended
        
        return {
            'total_electors': total_electors,
            'total_attended': total_attended,
            'total_votes': total_votes,
            'pending': pending,
            'attendance_percentage': self.attendance_percentage,
            'voting_percentage': round((total_votes / total_attended * 100), 2) if total_attended > 0 else 0,
            'participation_rate': round((total_votes / total_electors * 100), 2) if total_electors > 0 else 0,
        }
