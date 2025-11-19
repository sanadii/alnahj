"""Serializers for elections and committee APIs."""

from typing import Any

from rest_framework import serializers

from .models import Committee, Election
from apps.account.models import CustomUser


class ElectionSerializer(serializers.ModelSerializer):
    """Serializer for election configuration data."""

    voting_mode_display = serializers.CharField(source='get_voting_mode_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    committee_count = serializers.SerializerMethodField()
    member_count = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()
    members = serializers.PrimaryKeyRelatedField(many=True, queryset=CustomUser.objects.filter(is_active=True))

    class Meta:
        model = Election
        fields = [
            'id',
            'name',
            'description',
            'voting_mode',
            'voting_mode_display',
            'max_candidates_per_ballot',
            'allow_partial_voting',
            'minimum_votes_required',
            'status',
            'status_display',
            'election_date',
            'committee_count',
            'member_count',
            'members',
            'created_by',
            'created_by_name',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'committee_count',
            'member_count',
            'members',
            'created_by',
            'created_by_name',
            'created_at',
            'updated_at',
        ]

    @staticmethod
    def get_committee_count(obj: Election) -> int:
        return obj.committees.count()

    @staticmethod
    def get_member_count(obj: Election) -> int:
        return obj.members.count()

    @staticmethod
    def get_created_by_name(obj: Election) -> str | None:
        if obj.created_by:
            return obj.created_by.full_name or obj.created_by.email
        return None


class CommitteeSerializer(serializers.ModelSerializer):
    """Detailed committee serializer."""

    gender_display = serializers.CharField(source='get_gender_display', read_only=True)
    election_name = serializers.CharField(source='election.name', read_only=True)
    assigned_users = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    assigned_user_names = serializers.SerializerMethodField()
    elector_count = serializers.IntegerField(read_only=True)
    attendance_count = serializers.IntegerField(read_only=True)
    attendance_percentage = serializers.FloatField(read_only=True)
    vote_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Committee
        fields = [
            'id',
            'election',
            'election_name',
            'code',
            'name',
            'gender',
            'gender_display',
            'location',
            'electors_from',
            'electors_to',
            'assigned_users',
            'assigned_user_names',
            'elector_count',
            'attendance_count',
            'attendance_percentage',
            'vote_count',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'election_name',
            'assigned_user_names',
            'elector_count',
            'attendance_count',
            'attendance_percentage',
            'vote_count',
            'created_at',
            'updated_at',
        ]

    @staticmethod
    def get_assigned_user_names(obj: Committee) -> list[str]:
        return [user.full_name or user.email for user in obj.assigned_users.all()]


class CommitteeListSerializer(CommitteeSerializer):
    """Lightweight list serializer for committees."""

    class Meta(CommitteeSerializer.Meta):
        fields = [
            'id',
            'election',
            'code',
            'name',
            'gender',
            'gender_display',
            'location',
            'electors_from',
            'electors_to',
            'elector_count',
            'attendance_count',
            'attendance_percentage',
            'vote_count',
            'created_at',
            'updated_at',
        ]


class CommitteeCreateSerializer(serializers.ModelSerializer):
    """Serializer used for creating/updating committees."""

    assigned_users = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(is_active=True), many=True, required=False
    )

    class Meta:
        model = Committee
        fields = [
            'id',
            'election',
            'code',
            'name',
            'gender',
            'location',
            'electors_from',
            'electors_to',
            'assigned_users',
        ]

    def create(self, validated_data: dict[str, Any]) -> Committee:
        assigned_users = validated_data.pop('assigned_users', [])
        committee = super().create(validated_data)
        if assigned_users:
            committee.assigned_users.set(assigned_users)
        return committee

    def update(self, instance: Committee, validated_data: dict[str, Any]) -> Committee:
        assigned_users = validated_data.pop('assigned_users', None)
        committee = super().update(instance, validated_data)
        if assigned_users is not None:
            committee.assigned_users.set(assigned_users)
        return committee


class AddElectionMembersSerializer(serializers.Serializer):
    """Serializer for adding existing users to an election."""

    user_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1), allow_empty=False, min_length=1
    )


class GuaranteeTrendSerializer(serializers.Serializer):
    date = serializers.DateField()
    pending = serializers.IntegerField()
    guaranteed = serializers.IntegerField()
    not_available = serializers.IntegerField()
    total = serializers.IntegerField()


class GroupPerformanceSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    leader = serializers.CharField()
    leader_id = serializers.IntegerField()
    members_count = serializers.IntegerField()
    guarantees_count = serializers.IntegerField()
    pending_count = serializers.IntegerField()
    guaranteed_count = serializers.IntegerField()
    not_available_count = serializers.IntegerField()
    attended_count = serializers.IntegerField()
    attendance_rate = serializers.FloatField()
    conversion_rate = serializers.FloatField()
    last_activity = serializers.DateTimeField(allow_null=True)
    status = serializers.CharField()


class HourlyAttendanceSerializer(serializers.Serializer):
    hour = serializers.CharField()
    attendance = serializers.IntegerField()
    votes = serializers.IntegerField()
    target = serializers.IntegerField()


class ElectorDemographicsSerializer(serializers.Serializer):
    by_gender = serializers.ListField(child=serializers.JSONField())
    by_area = serializers.ListField(child=serializers.JSONField())
    by_team = serializers.ListField(child=serializers.JSONField())
    by_department = serializers.ListField(child=serializers.JSONField())
    by_family = serializers.ListField(child=serializers.JSONField())


class ElectorDistributionSerializer(serializers.Serializer):
    primary = serializers.CharField()
    secondary = serializers.CharField(allow_null=True)
    categories = serializers.ListField(child=serializers.JSONField())
    secondary_categories = serializers.ListField(child=serializers.JSONField(), required=False)
    series = serializers.ListField(child=serializers.JSONField())
    totals = serializers.DictField()
    meta = serializers.DictField()


class GuaranteeDistributionSerializer(serializers.Serializer):
    available_dimensions = serializers.ListField(child=serializers.JSONField())
    x_dimension = serializers.DictField()
    y_dimension = serializers.DictField()
    categories = serializers.ListField(child=serializers.JSONField())
    series = serializers.ListField(child=serializers.JSONField())
    totals = serializers.DictField()
    limit = serializers.IntegerField()
    series_limit = serializers.IntegerField()


class AttendanceDashboardSerializer(serializers.Serializer):
    summary = serializers.DictField()
    committees = serializers.ListField(child=serializers.JSONField())
    guarantees_by_user = serializers.ListField(child=serializers.JSONField())
    guarantees_by_group = serializers.ListField(child=serializers.JSONField())
    guarantees_by_user_groups = serializers.ListField(child=serializers.JSONField())
    top_performers = serializers.ListField(child=serializers.JSONField())
    low_performers = serializers.ListField(child=serializers.JSONField())


class GuaranteeBreakdownSerializer(serializers.Serializer):
    by_user = serializers.ListField(child=serializers.JSONField())
    by_group = serializers.ListField(child=serializers.JSONField())
    by_user_groups = serializers.ListField(child=serializers.JSONField())


class DashboardOverviewSerializer(serializers.Serializer):
    summary = serializers.DictField()
    committees = serializers.ListField(child=serializers.JSONField())
    guarantee_breakdown = GuaranteeBreakdownSerializer()
    top_performers = serializers.ListField(child=serializers.JSONField())
    low_performers = serializers.ListField(child=serializers.JSONField())
    demographics = ElectorDemographicsSerializer()
