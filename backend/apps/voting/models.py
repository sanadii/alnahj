"""
Voting operations models.
Vote counting, results aggregation, and final results.

Note: Party and Candidate models have been moved to apps.candidates
"""
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone

# Import Party and Candidate from candidates app
from apps.candidates.models import Party, Candidate


class VoteCount(models.Model):
    """
    Vote count per candidate per committee.
    Each committee reports votes for each candidate.
    """
    
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('SUBMITTED', 'Submitted'),
        ('VERIFIED', 'Verified'),
        ('REJECTED', 'Rejected'),
    ]
    
    election = models.ForeignKey(
        'elections.Election',
        on_delete=models.CASCADE,
        related_name='vote_counts',
        help_text='Election'
    )
    
    committee = models.ForeignKey(
        'elections.Committee',
        on_delete=models.CASCADE,
        related_name='vote_counts',
        help_text='Committee reporting votes'
    )
    
    candidate = models.ForeignKey(
        Candidate,
        on_delete=models.CASCADE,
        related_name='vote_counts',
        help_text='Candidate receiving votes'
    )
    
    vote_count = models.IntegerField(
        default=0,
        help_text='Number of votes received'
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='DRAFT',
        help_text='Vote count status'
    )
    
    is_verified = models.BooleanField(
        default=False,
        help_text='Has been verified by admin'
    )
    
    # Who entered and verified
    entered_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='vote_counts_entered',
        help_text='User who entered vote count'
    )
    
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='vote_counts_verified',
        help_text='User who verified vote count'
    )
    
    verified_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When vote count was verified'
    )
    
    notes = models.TextField(
        blank=True,
        help_text='Additional notes or issues'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'vote_counts'
        ordering = ['-created_at']
        verbose_name = 'Vote Count'
        verbose_name_plural = 'Vote Counts'
        unique_together = ['committee', 'candidate']
        indexes = [
            models.Index(fields=['election', 'status']),
            models.Index(fields=['committee', 'status']),
            models.Index(fields=['candidate']),
            models.Index(fields=['is_verified']),
        ]
    
    def __str__(self):
        return f"{self.committee.code} - {self.candidate} - {self.vote_count} votes"
    
    def clean(self):
        """Validate vote count data."""
        # Validate vote count is reasonable
        if self.vote_count < 0:
            raise ValidationError('Vote count cannot be negative')
        
        # Validate against committee size
        if self.vote_count > self.committee.elector_count:
            raise ValidationError(
                f'Vote count ({self.vote_count}) cannot exceed committee size ({self.committee.elector_count})'
            )
    
    def verify(self, user):
        """Verify this vote count."""
        self.is_verified = True
        self.status = 'VERIFIED'
        self.verified_by = user
        self.verified_at = timezone.now()
        self.save(update_fields=['is_verified', 'status', 'verified_by', 'verified_at'])


class CommitteeVoteEntry(models.Model):
    """
    Complete vote entry session for a committee.
    Groups all vote counts for a committee into one entry session.
    """
    
    STATUS_CHOICES = [
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('VERIFIED', 'Verified'),
    ]
    
    election = models.ForeignKey(
        'elections.Election',
        on_delete=models.CASCADE,
        related_name='committee_entries',
        help_text='Election'
    )
    
    committee = models.ForeignKey(
        'elections.Committee',
        on_delete=models.CASCADE,
        related_name='vote_entries',
        help_text='Committee'
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='IN_PROGRESS',
        help_text='Entry status'
    )
    
    total_ballots_cast = models.IntegerField(
        default=0,
        help_text='Total ballots cast in this committee'
    )
    
    invalid_ballots = models.IntegerField(
        default=0,
        help_text='Number of invalid/spoiled ballots'
    )
    
    valid_ballots = models.IntegerField(
        default=0,
        help_text='Number of valid ballots'
    )
    
    # Who entered
    entered_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='committee_entries',
        help_text='User who entered votes'
    )
    
    completed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When entry was completed'
    )
    
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='committee_entries_verified',
        help_text='User who verified'
    )
    
    verified_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When verified'
    )
    
    notes = models.TextField(
        blank=True,
        help_text='Notes about vote counting'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'committee_vote_entries'
        ordering = ['-created_at']
        verbose_name = 'Committee Vote Entry'
        verbose_name_plural = 'Committee Vote Entries'
        unique_together = ['election', 'committee']
        indexes = [
            models.Index(fields=['election', 'status']),
            models.Index(fields=['committee']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.committee.code} - {self.get_status_display()}"
    
    def complete(self):
        """Mark entry as completed."""
        self.status = 'COMPLETED'
        self.completed_at = timezone.now()
        self.save(update_fields=['status', 'completed_at'])
    
    def verify(self, user):
        """Verify this committee entry."""
        self.status = 'VERIFIED'
        self.verified_by = user
        self.verified_at = timezone.now()
        self.save(update_fields=['status', 'verified_by', 'verified_at'])
    
    @property
    def completion_percentage(self):
        """Calculate how many candidates have vote counts entered."""
        total_candidates = Candidate.objects.filter(
            election=self.election,
            is_active=True
        ).count()
        
        entered_candidates = VoteCount.objects.filter(
            election=self.election,
            committee=self.committee
        ).count()
        
        if total_candidates == 0:
            return 0
        
        return round((entered_candidates / total_candidates) * 100, 1)


class ElectionResults(models.Model):
    """
    Final aggregated results for the election.
    Generated after all votes are counted and verified.
    """
    
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('PRELIMINARY', 'Preliminary'),
        ('FINAL', 'Final'),
        ('PUBLISHED', 'Published'),
    ]
    
    election = models.OneToOneField(
        'elections.Election',
        on_delete=models.CASCADE,
        related_name='results',
        help_text='Election'
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='DRAFT',
        help_text='Results status'
    )
    
    total_registered_electors = models.IntegerField(
        default=0,
        help_text='Total electors registered'
    )
    
    total_attendance = models.IntegerField(
        default=0,
        help_text='Total electors who attended'
    )
    
    total_ballots_cast = models.IntegerField(
        default=0,
        help_text='Total ballots cast'
    )
    
    total_valid_ballots = models.IntegerField(
        default=0,
        help_text='Total valid ballots'
    )
    
    total_invalid_ballots = models.IntegerField(
        default=0,
        help_text='Total invalid/spoiled ballots'
    )
    
    turnout_percentage = models.FloatField(
        default=0.0,
        help_text='Turnout percentage'
    )
    
    results_data = models.JSONField(
        default=dict,
        help_text='Complete results data as JSON'
    )
    
    generated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='election_results_generated',
        help_text='User who generated results'
    )
    
    generated_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When results were generated'
    )
    
    published_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='election_results_published',
        help_text='User who published results'
    )
    
    published_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When results were published'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'election_results'
        verbose_name = 'Election Results'
        verbose_name_plural = 'Election Results'
    
    def __str__(self):
        return f"Results for {self.election.name} ({self.get_status_display()})"
    
    def generate_results(self):
        """
        Generate complete election results.
        Aggregates all verified vote counts.
        """
        from apps.electors.models import Elector
        from apps.attendees.models import Attendance
        
        # Get totals
        self.total_registered_electors = Elector.objects.filter(is_active=True).count()
        self.total_attendance = Attendance.objects.count()
        
        # Get ballot totals
        committee_entries = CommitteeVoteEntry.objects.filter(
            election=self.election,
            status='VERIFIED'
        )
        
        self.total_ballots_cast = sum(e.total_ballots_cast for e in committee_entries)
        self.total_valid_ballots = sum(e.valid_ballots for e in committee_entries)
        self.total_invalid_ballots = sum(e.invalid_ballots for e in committee_entries)
        
        # Calculate turnout
        if self.total_registered_electors > 0:
            self.turnout_percentage = round(
                (self.total_attendance / self.total_registered_electors) * 100,
                2
            )
        
        # Aggregate candidate results
        candidates = Candidate.objects.filter(
            election=self.election,
            is_active=True
        ).order_by('candidate_number')
        
        candidate_results = []
        for candidate in candidates:
            total_votes = VoteCount.objects.filter(
                candidate=candidate,
                is_verified=True
            ).aggregate(
                total=models.Sum('vote_count')
            )['total'] or 0
            
            vote_percentage = round(
                (total_votes / self.total_valid_ballots * 100) if self.total_valid_ballots > 0 else 0,
                2
            )
            
            candidate_results.append({
                'candidate_number': candidate.candidate_number,
                'candidate_name': candidate.name,
                'koc_id': '',  # No longer have KOC ID
                'party': candidate.party.name if candidate.party else 'Independent',
                'total_votes': total_votes,
                'vote_percentage': vote_percentage,
            })
        
        # Sort by votes descending
        candidate_results.sort(key=lambda x: x['total_votes'], reverse=True)
        
        # Add ranking
        for idx, result in enumerate(candidate_results, 1):
            result['rank'] = idx
        
        # Store in results_data
        self.results_data = {
            'candidates': candidate_results,
            'summary': {
                'total_candidates': len(candidate_results),
                'total_votes_cast': sum(r['total_votes'] for r in candidate_results),
            },
            'generated_at': timezone.now().isoformat(),
        }
        
        self.generated_at = timezone.now()
        self.status = 'PRELIMINARY'
        self.save()
    
    def publish(self, user):
        """Publish final results."""
        self.status = 'PUBLISHED'
        self.published_by = user
        self.published_at = timezone.now()
        self.save(update_fields=['status', 'published_by', 'published_at'])


class VoteCountAudit(models.Model):
    """
    Audit trail for vote count changes.
    Tracks all modifications for accountability.
    """
    
    ACTION_CHOICES = [
        ('CREATED', 'Created'),
        ('UPDATED', 'Updated'),
        ('VERIFIED', 'Verified'),
        ('REJECTED', 'Rejected'),
        ('DELETED', 'Deleted'),
    ]
    
    vote_count = models.ForeignKey(
        VoteCount,
        on_delete=models.CASCADE,
        related_name='audit_log',
        help_text='Associated vote count'
    )
    
    action = models.CharField(
        max_length=20,
        choices=ACTION_CHOICES,
        help_text='Action performed'
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='vote_audit_log',
        help_text='User who performed action'
    )
    
    old_value = models.IntegerField(
        null=True,
        blank=True,
        help_text='Previous vote count'
    )
    
    new_value = models.IntegerField(
        null=True,
        blank=True,
        help_text='New vote count'
    )
    
    notes = models.TextField(
        blank=True,
        help_text='Reason for change'
    )
    
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        help_text='IP address of user'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'vote_count_audit'
        ordering = ['-created_at']
        verbose_name = 'Vote Count Audit'
        verbose_name_plural = 'Vote Count Audit'
        indexes = [
            models.Index(fields=['vote_count', '-created_at']),
            models.Index(fields=['user']),
            models.Index(fields=['action']),
        ]
    
    def __str__(self):
        return f"{self.action} by {self.user.email if self.user else 'System'} at {self.created_at}"
    
    @staticmethod
    def log_action(vote_count, user, action, old_value=None, new_value=None, notes='', ip_address=None):
        """
        Log a vote count action.
        
        Args:
            vote_count: VoteCount instance
            user: User who performed action
            action: Action type (from ACTION_CHOICES)
            old_value: Previous vote count value
            new_value: New vote count value
            notes: Reason for change
            ip_address: User's IP address
        """
        VoteCountAudit.objects.create(
            vote_count=vote_count,
            action=action,
            user=user,
            old_value=old_value,
            new_value=new_value,
            notes=notes,
            ip_address=ip_address
        )
