"""
Serializers for voting operations.

Note: PartySerializer and CandidateSerializer have been moved to apps.candidates.serializers
"""
from rest_framework import serializers
from .models import VoteCount, CommitteeVoteEntry, ElectionResults, VoteCountAudit
from apps.candidates.models import Candidate

# Import for backward compatibility
from apps.candidates.serializers import PartySerializer, CandidateSerializer


class VoteCountSerializer(serializers.ModelSerializer):
    """Serializer for vote counts."""
    
    committee_code = serializers.CharField(source='committee.code', read_only=True)
    committee_name = serializers.CharField(source='committee.name', read_only=True)
    candidate_number = serializers.IntegerField(source='candidate.candidate_number', read_only=True)
    candidate_name = serializers.CharField(source='candidate.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    entered_by_name = serializers.SerializerMethodField()
    verified_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = VoteCount
        fields = [
            'id',
            'election',
            'committee',
            'committee_code',
            'committee_name',
            'candidate',
            'candidate_number',
            'candidate_name',
            'vote_count',
            'status',
            'status_display',
            'is_verified',
            'entered_by',
            'entered_by_name',
            'verified_by',
            'verified_by_name',
            'verified_at',
            'notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'entered_by', 'verified_by', 'verified_at', 'created_at', 'updated_at']
    
    def get_entered_by_name(self, obj):
        if obj.entered_by:
            return obj.entered_by.full_name
        return None
    
    def get_verified_by_name(self, obj):
        if obj.verified_by:
            return obj.verified_by.full_name
        return None


class VoteCountCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating vote counts."""
    
    class Meta:
        model = VoteCount
        fields = [
            'election',
            'committee',
            'candidate',
            'vote_count',
            'notes',
        ]
    
    def validate(self, attrs):
        """Validate vote count data."""
        vote_count = attrs.get('vote_count', 0)
        committee = attrs.get('committee')
        
        if vote_count < 0:
            raise serializers.ValidationError({
                'vote_count': 'Vote count cannot be negative'
            })
        
        if vote_count > committee.elector_count:
            raise serializers.ValidationError({
                'vote_count': f'Vote count ({vote_count}) cannot exceed committee size ({committee.elector_count})'
            })
        
        return attrs


class CommitteeVoteEntrySerializer(serializers.ModelSerializer):
    """Serializer for committee vote entries."""
    
    committee_code = serializers.CharField(source='committee.code', read_only=True)
    committee_name = serializers.CharField(source='committee.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    entered_by_name = serializers.SerializerMethodField()
    verified_by_name = serializers.SerializerMethodField()
    completion_percentage = serializers.FloatField(read_only=True)
    
    class Meta:
        model = CommitteeVoteEntry
        fields = [
            'id',
            'election',
            'committee',
            'committee_code',
            'committee_name',
            'status',
            'status_display',
            'total_ballots_cast',
            'invalid_ballots',
            'valid_ballots',
            'entered_by',
            'entered_by_name',
            'completed_at',
            'verified_by',
            'verified_by_name',
            'verified_at',
            'completion_percentage',
            'notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'entered_by', 'completed_at', 'verified_by', 'verified_at', 'created_at', 'updated_at']
    
    def get_entered_by_name(self, obj):
        if obj.entered_by:
            return obj.entered_by.full_name
        return None
    
    def get_verified_by_name(self, obj):
        if obj.verified_by:
            return obj.verified_by.full_name
        return None


class ElectionResultsSerializer(serializers.ModelSerializer):
    """Serializer for election results."""
    
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    generated_by_name = serializers.SerializerMethodField()
    published_by_name = serializers.SerializerMethodField()
    election_name = serializers.CharField(source='election.name', read_only=True)
    
    class Meta:
        model = ElectionResults
        fields = [
            'id',
            'election',
            'election_name',
            'status',
            'status_display',
            'total_registered_electors',
            'total_attendance',
            'total_ballots_cast',
            'total_valid_ballots',
            'total_invalid_ballots',
            'turnout_percentage',
            'results_data',
            'generated_by',
            'generated_by_name',
            'generated_at',
            'published_by',
            'published_by_name',
            'published_at',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'generated_by', 'generated_at', 'published_by', 'published_at', 'created_at', 'updated_at']
    
    def get_generated_by_name(self, obj):
        if obj.generated_by:
            return obj.generated_by.full_name
        return None
    
    def get_published_by_name(self, obj):
        if obj.published_by:
            return obj.published_by.full_name
        return None


class VoteCountAuditSerializer(serializers.ModelSerializer):
    """Serializer for vote count audit log."""
    
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = VoteCountAudit
        fields = [
            'id',
            'vote_count',
            'action',
            'action_display',
            'user',
            'user_name',
            'old_value',
            'new_value',
            'notes',
            'ip_address',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_user_name(self, obj):
        if obj.user:
            return obj.user.full_name
        return 'System'


class BulkVoteEntrySerializer(serializers.Serializer):
    """Serializer for bulk vote entry."""
    
    committee_id = serializers.IntegerField(required=True)
    vote_counts = serializers.ListField(
        child=serializers.DictField(),
        required=True,
        allow_empty=False
    )
    total_ballots_cast = serializers.IntegerField(required=True)
    invalid_ballots = serializers.IntegerField(default=0)
    notes = serializers.CharField(required=False, allow_blank=True)
    
    def validate_vote_counts(self, value):
        """Validate vote counts list."""
        for item in value:
            if 'candidate_id' not in item or 'vote_count' not in item:
                raise serializers.ValidationError(
                    'Each vote count must have candidate_id and vote_count'
                )
            
            if item['vote_count'] < 0:
                raise serializers.ValidationError(
                    'Vote count cannot be negative'
                )
        
        return value


class ResultsSummarySerializer(serializers.Serializer):
    """Serializer for results summary."""
    
    election_name = serializers.CharField()
    total_candidates = serializers.IntegerField()
    total_registered_electors = serializers.IntegerField()
    total_attendance = serializers.IntegerField()
    total_ballots_cast = serializers.IntegerField()
    total_valid_ballots = serializers.IntegerField()
    turnout_percentage = serializers.FloatField()
    candidates = serializers.ListField()
    winners = serializers.ListField()
    status = serializers.CharField()

