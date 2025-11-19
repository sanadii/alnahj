"""
Models for candidates and political parties.
"""
from django.db import models
from django.core.exceptions import ValidationError


class Party(models.Model):
    """
    Political party in the election.
    
    Attributes:
        election: Election this party is participating in
        name: Party name
        color: Party color in hex format
        description: Party description
        is_active: Is party active in election?
    """
    
    election = models.ForeignKey(
        'elections.Election',
        on_delete=models.CASCADE,
        related_name='parties',
        help_text='Election this party is participating in'
    )
    
    name = models.CharField(
        max_length=200,
        help_text='Party name'
    )
    
    color = models.CharField(
        max_length=7,
        default='#000000',
        help_text='Party color in hex format'
    )
    
    logo = models.ImageField(
        upload_to='party-logos/',
        blank=True,
        null=True,
        help_text='Party logo or image used for identification'
    )

    description = models.TextField(
        blank=True,
        help_text='Party description'
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text='Is party active in election?'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'parties'
        ordering = ['name']
        verbose_name = 'Party'
        verbose_name_plural = 'Parties'
        unique_together = ['election', 'name']
        indexes = [
            models.Index(fields=['election', 'is_active']),
            models.Index(fields=['name']),
        ]
    
    def __str__(self):
        return self.name
    
    @property
    def candidate_count(self):
        """Get total candidates in this party."""
        return self.candidates.filter(is_active=True).count()


class Candidate(models.Model):
    """
    Candidate in the election.
    
    Attributes:
        election: Election this candidate is running in
        name: Candidate name
        candidate_number: Candidate number on ballot
        party: Party affiliation (null for independent)
        is_active: Is candidate still in race?
    """
    
    election = models.ForeignKey(
        'elections.Election',
        on_delete=models.CASCADE,
        related_name='candidates',
        help_text='Election this candidate is running in'
    )
    
    name = models.CharField(
        max_length=200,
        help_text='Candidate name'
    )
    
    candidate_number = models.IntegerField(
        help_text='Candidate number on ballot'
    )
    
    # Party affiliation - can be linked to a party or independent
    party = models.ForeignKey(
        Party,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='candidates',
        help_text='Party affiliation (null for independent)'
    )
    
    photo = models.ImageField(
        upload_to='candidate-photos/',
        blank=True,
        null=True,
        help_text='Candidate profile photo used across the dashboard'
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text='Is candidate still in race?'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'candidates'
        ordering = ['candidate_number']
        verbose_name = 'Candidate'
        verbose_name_plural = 'Candidates'
        unique_together = ['election', 'candidate_number']
        indexes = [
            models.Index(fields=['election', 'candidate_number']),
            models.Index(fields=['election', 'is_active']),
            models.Index(fields=['name']),
        ]
    
    def __str__(self):
        return f"#{self.candidate_number} - {self.name}"
    
    def clean(self):
        """Validate candidate data."""
        # Ensure candidate number is positive
        if self.candidate_number <= 0:
            raise ValidationError('Candidate number must be positive')
    
    @property
    def total_votes(self):
        """
        Get total votes received across all committees.
        
        Returns:
            int: Total verified votes
        """
        from apps.voting.models import VoteCount
        
        return VoteCount.objects.filter(
            candidate=self,
            is_verified=True
        ).aggregate(
            total=models.Sum('vote_count')
        )['total'] or 0
    
    @property
    def vote_percentage(self):
        """
        Get vote percentage in the election.
        
        Returns:
            float: Percentage of votes received
        """
        from apps.voting.models import VoteCount
        
        # Get total valid votes in election
        total_votes = VoteCount.objects.filter(
            election=self.election,
            is_verified=True
        ).aggregate(
            total=models.Sum('vote_count')
        )['total'] or 0
        
        if total_votes == 0:
            return 0.0
        
        return round((self.total_votes / total_votes) * 100, 2)

