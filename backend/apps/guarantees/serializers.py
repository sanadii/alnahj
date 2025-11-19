"""
Serializers for guarantee management.
"""
from rest_framework import serializers
from django.utils import timezone
from .models import (
    GuaranteeGroup,
    Guarantee,
    GuaranteeNote,
    GuaranteeHistory,
    normalize_kuwait_phone,
)


class GuaranteeGroupSerializer(serializers.ModelSerializer):
    """
    Full guarantee group serializer.
    """
    
    guarantee_count = serializers.SerializerMethodField()
    
    class Meta:
        model = GuaranteeGroup
        fields = [
            'id',
            'name',
            'color',
            'description',
            'order',
            'guarantee_count',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_guarantee_count(self, obj):
        """Get guarantee count from annotation or property."""
        # Check if annotation exists (from queryset)
        if hasattr(obj, 'annotated_guarantee_count'):
            return obj.annotated_guarantee_count
        # Fall back to property
        return obj.guarantee_count
    
    def validate_color(self, value):
        """Validate hex color format."""
        if not value.startswith('#') or len(value) != 7:
            raise serializers.ValidationError(
                'Color must be in hex format (e.g., #FF5722)'
            )
        return value


class GuaranteeNoteSerializer(serializers.ModelSerializer):
    """
    Serializer for guarantee notes.
    """
    
    user_name = serializers.SerializerMethodField()
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = GuaranteeNote
        fields = [
            'id',
            'guarantee',
            'user',
            'user_name',
            'user_email',
            'content',
            'is_important',
            'created_at',
        ]
        read_only_fields = ['id', 'user', 'created_at']
    
    def get_user_name(self, obj):
        """Get user's full name."""
        if obj.user:
            return obj.user.full_name
        return 'Unknown'


class GuaranteeNoteCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating notes.
    """
    
    class Meta:
        model = GuaranteeNote
        fields = [
            'content',
            'is_important',
        ]


class GuaranteeHistorySerializer(serializers.ModelSerializer):
    """
    Serializer for guarantee history.
    """
    
    user_name = serializers.SerializerMethodField()
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    
    class Meta:
        model = GuaranteeHistory
        fields = [
            'id',
            'action',
            'action_display',
            'user_name',
            'description',
            'old_value',
            'new_value',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_user_name(self, obj):
        """Get user's full name."""
        if obj.user:
            return obj.user.full_name
        return 'System'


class GuaranteeSerializer(serializers.ModelSerializer):
    """
    Full guarantee serializer with related data.
    """
    
    # Elector details
    elector_koc_id = serializers.CharField(source='elector.koc_id', read_only=True)
    elector_name = serializers.CharField(source='elector.full_name', read_only=True)
    elector_mobile = serializers.CharField(source='elector.mobile', read_only=True)
    elector_section = serializers.CharField(source='elector.section', read_only=True)
    elector_committee = serializers.CharField(source='elector.committee.code', read_only=True)
    
    # Group details
    group_name = serializers.CharField(source='group.name', read_only=True, allow_null=True)
    group_color = serializers.CharField(source='group.color', read_only=True, allow_null=True)
    
    # Status display
    guarantee_status_display = serializers.CharField(source='get_guarantee_status_display', read_only=True)
    
    # Computed fields
    has_notes = serializers.BooleanField(read_only=True)
    note_count = serializers.IntegerField(read_only=True)
    
    # Recent notes (last 3)
    recent_notes = serializers.SerializerMethodField()
    confirmation_status = serializers.CharField(read_only=True)
    confirmation_status_display = serializers.CharField(source='get_confirmation_status_display', read_only=True)
    isConfirmed = serializers.SerializerMethodField()
    
    class Meta:
        model = Guarantee
        fields = [
            'id',
            'user',
            'elector',
            'elector_koc_id',
            'elector_name',
            'elector_mobile',
            'elector_section',
            'elector_committee',
            'guarantee_status',
            'guarantee_status_display',
            'group',
            'group_name',
            'group_color',
            'mobile',
            'quick_note',
            'confirmation_status',
            'confirmation_status_display',
            'isConfirmed',
            'has_notes',
            'note_count',
            'recent_notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def get_recent_notes(self, obj):
        """Get last 3 notes."""
        recent = obj.notes.all()[:3]
        return GuaranteeNoteSerializer(recent, many=True).data
    
    def get_isConfirmed(self, obj):
        return obj.is_confirmed
    
class GuaranteeListSerializer(serializers.ModelSerializer):
    """
    Lightweight guarantee serializer for list views.
    """
    
    elector_koc_id = serializers.SerializerMethodField()
    elector_name = serializers.CharField(source='elector.full_name', read_only=True)
    elector_mobile = serializers.CharField(source='elector.mobile', read_only=True)
    elector_section = serializers.CharField(source='elector.section', read_only=True, allow_null=True)
    elector_department = serializers.CharField(source='elector.department', read_only=True, allow_null=True)
    elector_team = serializers.CharField(source='elector.team', read_only=True, allow_null=True)
    elector_committee_name = serializers.CharField(source='elector.committee.name', read_only=True, allow_null=True)
    guarantee_status_display = serializers.CharField(source='get_guarantee_status_display', read_only=True)
    group_name = serializers.CharField(source='group.name', read_only=True, allow_null=True)
    group_color = serializers.CharField(source='group.color', read_only=True, allow_null=True)
    has_notes = serializers.BooleanField(read_only=True)
    confirmation_status = serializers.CharField(read_only=True)
    confirmation_status_display = serializers.CharField(source='get_confirmation_status_display', read_only=True)
    isConfirmed = serializers.SerializerMethodField()
    
    class Meta:
        model = Guarantee
        fields = [
            'id',
            'elector',
            'elector_koc_id',
            'elector_name',
            'elector_mobile',
            'elector_section',
            'elector_department',
            'elector_team',
            'elector_committee_name',
            'guarantee_status',
            'guarantee_status_display',
            'group',
            'group_name',
            'group_color',
            'quick_note',
            'mobile',
            'confirmation_status',
            'confirmation_status_display',
            'isConfirmed',
            'has_notes',
            'created_at',
        ]

    def get_elector_koc_id(self, obj):
        return getattr(obj.elector, 'koc_id', None)

    def get_isConfirmed(self, obj):
        return obj.is_confirmed


class GuaranteeCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating guarantees.
    """
    
    class Meta:
        model = Guarantee
        fields = [
            'elector',
            'guarantee_status',
            'group',
            'mobile',
            'quick_note',
        ]
    
    def validate_mobile(self, value):
        return normalize_kuwait_phone(value)

    def validate(self, attrs):
        """Validate guarantee data."""
        # Check if user already has guarantee for this elector
        user = self.context['request'].user
        elector = attrs.get('elector')
        
        if Guarantee.objects.filter(user=user, elector=elector).exists():
            raise serializers.ValidationError(
                f'You already have a guarantee from {elector.full_name}'
            )
        
        # Validate group belongs to user
        group = attrs.get('group')
        if group and group.user != user:
            raise serializers.ValidationError({
                'group': 'Selected group does not belong to you'
            })
        
        return attrs


class GuaranteeUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating guarantees.
    """
    
    class Meta:
        model = Guarantee
        fields = [
            'guarantee_status',
            'group',
            'mobile',
            'quick_note',
        ]
    
    def validate_mobile(self, value):
        return normalize_kuwait_phone(value)

    def validate_group(self, value):
        """Validate group belongs to user."""
        if value:
            user = self.context['request'].user
            if value.user != user:
                raise serializers.ValidationError(
                    'Selected group does not belong to you'
                )
        return value


class GuaranteeQuickUpdateSerializer(serializers.Serializer):
    """
    Serializer for quick guarantee status updates.
    """
    
    guarantee_status = serializers.ChoiceField(
        choices=Guarantee.GUARANTEE_STATUS_CHOICES,
        required=True
    )


class GuaranteeBulkUpdateSerializer(serializers.Serializer):
    """
    Serializer for bulk operations.
    """
    
    guarantee_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=True,
        allow_empty=False
    )
    
    # Optional fields to update
    guarantee_status = serializers.ChoiceField(
        choices=Guarantee.GUARANTEE_STATUS_CHOICES,
        required=False
    )
    
    group_id = serializers.IntegerField(
        required=False,
        allow_null=True
    )
    
    def validate_guarantee_ids(self, value):
        """Validate all guarantees exist and belong to user."""
        user = self.context['request'].user
        
        # Check if all guarantees exist
        existing_ids = Guarantee.objects.filter(
            id__in=value,
            user=user
        ).values_list('id', flat=True)
        
        existing_ids = set(existing_ids)
        provided_ids = set(value)
        
        invalid_ids = provided_ids - existing_ids
        if invalid_ids:
            raise serializers.ValidationError(
                f'Invalid guarantee IDs or not owned by you: {", ".join(map(str, invalid_ids))}'
            )
        
        return value
    
    def validate_group_id(self, value):
        """Validate group exists and belongs to user."""
        if value:
            user = self.context['request'].user
            try:
                group = GuaranteeGroup.objects.get(id=value, user=user)
            except GuaranteeGroup.DoesNotExist:
                raise serializers.ValidationError(
                    'Invalid group ID or not owned by you'
                )
        return value


class GuaranteeStatisticsSerializer(serializers.Serializer):
    """
    Serializer for guarantee statistics.
    """
    
    total_guarantees = serializers.IntegerField()
    pending_count = serializers.IntegerField()
    guaranteed_count = serializers.IntegerField()
    not_available_count = serializers.IntegerField()
    confirmed_count = serializers.IntegerField()
    pending_confirmation_count = serializers.IntegerField()
    not_available_confirmation_count = serializers.IntegerField()
    unconfirmed_count = serializers.IntegerField()
    confirmation_rate = serializers.FloatField()
    by_group = serializers.ListField()
    by_committee = serializers.ListField()
    recent_guarantees = serializers.ListField()
    top_sections = serializers.ListField()


class TeamStatisticsSerializer(serializers.Serializer):
    """
    Serializer for supervisor team statistics.
    """
    
    team_members = serializers.ListField()
    total_team_guarantees = serializers.IntegerField()
    by_status = serializers.DictField()
    by_member = serializers.ListField()
    recent_activity = serializers.ListField()


class GuaranteeConfirmSerializer(serializers.Serializer):
    """
    Serializer for confirming guarantees.
    """
    
    confirmation_status = serializers.ChoiceField(
        choices=['PENDING', 'CONFIRMED', 'NOT_AVAILABLE'],
        required=True
    )


class GuaranteeBulkConfirmSerializer(serializers.Serializer):
    """
    Serializer for bulk confirmation operations.
    """
    
    guarantee_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=True,
        allow_empty=False
    )
    
    confirmation_status = serializers.ChoiceField(
        choices=['PENDING', 'CONFIRMED', 'NOT_AVAILABLE'],
        required=True
    )
    
    def validate_guarantee_ids(self, value):
        """Validate all guarantees exist and belong to user."""
        user = self.context['request'].user
        
        existing_ids = Guarantee.objects.filter(
            id__in=value,
            user=user
        ).values_list('id', flat=True)
        
        existing_ids = set(existing_ids)
        provided_ids = set(value)
        
        invalid_ids = provided_ids - existing_ids
        if invalid_ids:
            raise serializers.ValidationError(
                f'Invalid guarantee IDs or not owned by you: {", ".join(map(str, invalid_ids))}'
            )
        
        return value




