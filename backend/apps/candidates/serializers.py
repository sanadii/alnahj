"""Serializers for candidates and parties."""

from rest_framework import serializers

from .models import Candidate, Party


class PartySerializer(serializers.ModelSerializer):
    """Full serializer for political parties."""

    candidate_count = serializers.IntegerField(read_only=True, required=False)
    logo = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Party
        fields = [
            'id',
            'election',
            'name',
            'color',
            'logo',
            'description',
            'is_active',
            'candidate_count',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def update(self, instance, validated_data):
        request = self.context.get('request')
        remove_logo = False
        if request is not None:
            remove_logo = request.data.get('remove_logo') in {'true', '1', 'yes', True}

        if remove_logo and instance.logo:
            instance.logo.delete(save=False)
            instance.logo = None

        return super().update(instance, validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)

        request = self.context.get('request')
        logo = data.get('logo')
        if logo and request is not None:
            data['logo'] = request.build_absolute_uri(logo)

        if hasattr(instance, '_candidate_count'):
            data['candidate_count'] = instance._candidate_count
        elif data.get('candidate_count') is None:
            try:
                data['candidate_count'] = instance.candidates.filter(is_active=True).count()
            except (AttributeError, Exception):
                data['candidate_count'] = 0

        return data


class PartyListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for party listings."""

    candidate_count = serializers.IntegerField(read_only=True, required=False)
    logo = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Party
        fields = ['id', 'name', 'color', 'logo', 'is_active', 'candidate_count']
        read_only_fields = ['id']

    def to_representation(self, instance):
        data = super().to_representation(instance)

        request = self.context.get('request')
        logo = data.get('logo')
        if logo and request is not None:
            data['logo'] = request.build_absolute_uri(logo)

        if hasattr(instance, '_candidate_count'):
            data['candidate_count'] = instance._candidate_count
        elif data.get('candidate_count') is None:
            try:
                data['candidate_count'] = instance.candidates.filter(is_active=True).count()
            except (AttributeError, Exception):
                data['candidate_count'] = 0

        return data


class PartyCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating parties."""

    logo = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Party
        fields = ['election', 'name', 'color', 'logo', 'description']

    def validate_name(self, value):
        if len(value) < 2:
            raise serializers.ValidationError('Party name must be at least 2 characters')
        return value

    def validate_color(self, value):
        if value and not value.startswith('#'):
            value = f'#{value}'
        if len(value) not in [4, 7]:
            raise serializers.ValidationError('Color must be in hex format (#RGB or #RRGGBB)')
        return value


class CandidateSerializer(serializers.ModelSerializer):
    """Full serializer for candidates."""

    party_name = serializers.CharField(source='party.name', read_only=True, allow_null=True)
    party_color = serializers.CharField(source='party.color', read_only=True, allow_null=True)
    total_votes = serializers.IntegerField(read_only=True)
    vote_percentage = serializers.FloatField(read_only=True)
    photo = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Candidate
        fields = [
            'id',
            'election',
            'name',
            'candidate_number',
            'party',
            'party_name',
            'party_color',
            'photo',
            'is_active',
            'total_votes',
            'vote_percentage',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def update(self, instance, validated_data):
        request = self.context.get('request')
        remove_photo = False
        if request is not None:
            remove_photo = request.data.get('remove_photo') in {'true', '1', 'yes', True}

        if remove_photo and instance.photo:
            instance.photo.delete(save=False)
            instance.photo = None

        return super().update(instance, validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if data.get('photo') and request is not None:
            data['photo'] = request.build_absolute_uri(data['photo'])
        return data


class CandidateListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for candidate lists."""

    party_name = serializers.CharField(source='party.name', read_only=True, allow_null=True)
    photo = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Candidate
        fields = ['id', 'name', 'candidate_number', 'party', 'party_name', 'photo', 'is_active']
        read_only_fields = ['id']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if data.get('photo') and request is not None:
            data['photo'] = request.build_absolute_uri(data['photo'])
        return data


class CandidateCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating candidates."""

    class Meta:
        model = Candidate
        fields = ['election', 'name', 'candidate_number', 'party', 'photo']

    def validate_candidate_number(self, value):
        if value <= 0:
            raise serializers.ValidationError('Candidate number must be positive')
        return value

    def validate(self, attrs):
        election = attrs.get('election')
        candidate_number = attrs.get('candidate_number')
        if Candidate.objects.filter(election=election, candidate_number=candidate_number).exists():
            raise serializers.ValidationError(
                f'Candidate number {candidate_number} is already taken in this election'
            )
        return attrs


class CandidateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating candidates."""

    class Meta:
        model = Candidate
        fields = ['name', 'candidate_number', 'party', 'photo', 'is_active']

    def validate_candidate_number(self, value):
        if value <= 0:
            raise serializers.ValidationError('Candidate number must be positive')
        return value

    def validate(self, attrs):
        candidate_number = attrs.get('candidate_number')
        if candidate_number:
            election = self.instance.election
            existing = Candidate.objects.filter(
                election=election,
                candidate_number=candidate_number
            ).exclude(id=self.instance.id)
            if existing.exists():
                raise serializers.ValidationError({
                    'candidate_number': f'Candidate number {candidate_number} is already taken in this election'
                })
        return attrs

