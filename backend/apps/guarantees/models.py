"""
Guarantee collection models.
Users collect guarantees from electors during the guarantee phase.
"""
import re

from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

KUWAIT_PHONE_PATTERN = re.compile(r'^(?:\+?965)?\d{8}$')


def normalize_kuwait_phone(value):
    """Normalize Kuwait phone numbers and validate format."""
    if not value:
        return ''

    raw = str(value).strip()
    if not raw:
        return ''

    digits_only = re.sub(r'\D', '', raw)

    normalized = ''
    if raw.startswith('+965') and len(digits_only) >= 11:
        normalized = '+965' + digits_only[-8:]
    elif raw.startswith('+') and digits_only.startswith('965') and len(digits_only) >= 11:
        normalized = '+965' + digits_only[-8:]
    elif digits_only.startswith('965') and len(digits_only) >= 11:
        normalized = '+965' + digits_only[-8:]
    elif len(digits_only) == 8:
        normalized = digits_only
    else:
        normalized = digits_only

    if normalized and not KUWAIT_PHONE_PATTERN.match(normalized):
        raise ValidationError(
            'Phone numbers must be 8 digits (optionally prefixed with +965).',
            code='invalid_kuwait_phone'
        )

    return normalized


class GuaranteeGroup(models.Model):
    """
    Custom groups for organizing guarantees.
    Users can create their own categories (e.g., "Close Friends", "Family", "Colleagues").
    """
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='guarantee_groups',
        help_text='User who created this group'
    )
    
    name = models.CharField(
        max_length=100,
        help_text='Group name (e.g., "Close Friends")'
    )
    
    color = models.CharField(
        max_length=7,
        default='#1976d2',
        help_text='Hex color for UI display (e.g., #FF5722)'
    )
    
    description = models.TextField(
        blank=True,
        help_text='Optional description'
    )
    
    order = models.IntegerField(
        default=0,
        help_text='Display order (lower = first)'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'guarantee_groups'
        ordering = ['order', 'name']
        verbose_name = 'Guarantee Group'
        verbose_name_plural = 'Guarantee Groups'
        unique_together = ['user', 'name']
        indexes = [
            models.Index(fields=['user', 'order']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.name}"
    
    @property
    def guarantee_count(self):
        """Get count of guarantees in this group."""
        return self.guarantees.count()


class Guarantee(models.Model):
    """
    Individual guarantee from an elector.
    Each user maintains their own list of guarantees.
    """
    
    GUARANTEE_STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('GUARANTEED', 'Guaranteed'),
    ]
    
    # Who collected this guarantee
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='guarantees',
        help_text='User who collected this guarantee'
    )
    
    # Which elector gave the guarantee
    elector = models.ForeignKey(
        'electors.Elector',
        on_delete=models.CASCADE,
        related_name='guarantees',
        help_text='Elector who gave the guarantee'
    )
    
    # Guarantee status
    guarantee_status = models.CharField(
        max_length=20,
        choices=GUARANTEE_STATUS_CHOICES,
        default='GUARANTEED',
        help_text='Guarantee status (pending or guaranteed)'
    )
    
    # Custom grouping
    group = models.ForeignKey(
        GuaranteeGroup,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='guarantees',
        help_text='Custom group (optional)'
    )
    
    # Contact information
    mobile = models.CharField(
        max_length=15,
        blank=True,
        help_text='Contact phone number for follow-ups'
    )
    
    # Quick notes (for display in list)
    quick_note = models.CharField(
        max_length=200,
        blank=True,
        help_text='Short note visible in list view'
    )
    
    CONFIRMATION_STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('NOT_AVAILABLE', 'Not Available'),
    ]
    
    # Confirmation tracking
    confirmation_status = models.CharField(
        max_length=20,
        choices=CONFIRMATION_STATUS_CHOICES,
        default='PENDING',
        db_index=True,
        help_text='Confirmation status of the guarantee'
    )
    
    # Timestamps
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text='When guarantee was collected'
    )
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'guarantees'
        ordering = ['-created_at']
        verbose_name = 'Guarantee'
        verbose_name_plural = 'Guarantees'
        unique_together = ['user', 'elector']
        indexes = [
            models.Index(fields=['user', 'guarantee_status']),
            models.Index(fields=['user', 'group']),
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['elector']),
            models.Index(fields=['confirmation_status', 'guarantee_status']),
            models.Index(fields=['user', 'confirmation_status']),
        ]
    
    def __str__(self):
        return f"{self.user.email} → {self.elector.full_name} ({self.guarantee_status})"
    
    def clean(self):
        """Validate guarantee data."""
        # Ensure group belongs to same user
        if self.group and self.group.user != self.user:
            raise ValidationError(
                'Group must belong to the same user'
            )
    
    def save(self, *args, **kwargs):
        """Override save to validate."""
        self.mobile = normalize_kuwait_phone(self.mobile)
        self.full_clean()
        super().save(*args, **kwargs)
    
    @property
    def has_notes(self):
        """Check if guarantee has any notes."""
        return self.notes.exists()
    
    @property
    def note_count(self):
        """Get count of notes."""
        return self.notes.count()
    
    @property
    def is_confirmed(self):
        """Compatibility helper for boolean confirmation."""
        return self.confirmation_status == 'CONFIRMED'
    
class GuaranteeNote(models.Model):
    """
    Notes attached to guarantees.
    Full history tracking with timestamps.
    """
    
    guarantee = models.ForeignKey(
        Guarantee,
        on_delete=models.CASCADE,
        related_name='notes',
        help_text='Associated guarantee'
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='guarantee_notes',
        help_text='User who created this note'
    )
    
    content = models.TextField(
        help_text='Note content'
    )
    
    is_important = models.BooleanField(
        default=False,
        help_text='Flag as important'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'guarantee_notes'
        ordering = ['-created_at']
        verbose_name = 'Guarantee Note'
        verbose_name_plural = 'Guarantee Notes'
        indexes = [
            models.Index(fields=['guarantee', '-created_at']),
            models.Index(fields=['user']),
            models.Index(fields=['is_important']),
        ]
    
    def __str__(self):
        return f"Note by {self.user.email if self.user else 'Unknown'} on {self.guarantee}"


class GuaranteeHistory(models.Model):
    """
    Audit trail for guarantee changes.
    Tracks all modifications for accountability.
    """
    
    ACTION_CHOICES = [
        ('CREATED', 'Created'),
        ('UPDATED', 'Updated'),
        ('STATUS_CHANGED', 'Status Changed'),
        ('GROUP_CHANGED', 'Group Changed'),
        ('NOTE_ADDED', 'Note Added'),
        ('CONTACT_UPDATED', 'Contact Updated'),
        ('CONFIRMATION_CHANGED', 'Confirmation Changed'),
        ('DELETED', 'Deleted'),
    ]
    
    guarantee = models.ForeignKey(
        Guarantee,
        on_delete=models.CASCADE,
        related_name='history',
        help_text='Associated guarantee'
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='guarantee_history',
        help_text='User who made the change'
    )
    
    action = models.CharField(
        max_length=20,
        choices=ACTION_CHOICES,
        help_text='Type of action'
    )
    
    old_value = models.TextField(
        blank=True,
        help_text='Previous value (JSON)'
    )
    
    new_value = models.TextField(
        blank=True,
        help_text='New value (JSON)'
    )
    
    description = models.TextField(
        blank=True,
        help_text='Human-readable description'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'guarantee_history'
        ordering = ['-created_at']
        verbose_name = 'Guarantee History'
        verbose_name_plural = 'Guarantee History'
        indexes = [
            models.Index(fields=['guarantee', '-created_at']),
            models.Index(fields=['user']),
            models.Index(fields=['action']),
        ]
    
    def __str__(self):
        return f"{self.action} by {self.user.email if self.user else 'System'} at {self.created_at}"
    
    @staticmethod
    def log_action(guarantee, user, action, old_value=None, new_value=None, description=''):
        """
        Helper method to log guarantee actions.
        
        Args:
            guarantee: Guarantee instance
            user: User who performed action
            action: Action type (from ACTION_CHOICES)
            old_value: Previous value (will be JSON serialized)
            new_value: New value (will be JSON serialized)
            description: Human-readable description
        """
        import json
        
        GuaranteeHistory.objects.create(
            guarantee=guarantee,
            user=user,
            action=action,
            old_value=json.dumps(old_value) if old_value else '',
            new_value=json.dumps(new_value) if new_value else '',
            description=description
        )


