"""
Serializers for elector management.
"""
from rest_framework import serializers
from .models import Elector


class ElectorSerializer(serializers.ModelSerializer):
    """
    Full elector serializer with all details.
    """
    
    full_name = serializers.CharField(read_only=True)
    committee_code = serializers.CharField(source='committee.code', read_only=True)
    committee_name = serializers.CharField(source='committee.name', read_only=True)
    gender_display = serializers.CharField(source='get_gender_display', read_only=True)
    has_attended = serializers.BooleanField(read_only=True)
    created_by_email = serializers.EmailField(source='created_by.email', read_only=True)
    
    class Meta:
        model = Elector
        fields = [
            'koc_id',
            'full_name',
            'name_first',
            'name_second',
            'name_third',
            'name_fourth',
            'name_fifth',
            'name_sixth',
            'sub_family_name',
            'family_name',
            'designation',
            'section',
            'extension',
            'mobile',
            'area',
            'department',
            'team',
            'committee',
            'committee_code',
            'committee_name',
            'gender',
            'gender_display',
            'is_active',
            'is_approved',
            'created_by',
            'created_by_email',
            'has_attended',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['koc_id', 'created_at', 'updated_at', 'created_by']


class ElectorListSerializer(serializers.ModelSerializer):
    """
    Lightweight elector serializer for list views.
    Returns camelCase field names for frontend compatibility.
    """
    
    kocId = serializers.CharField(source='koc_id', read_only=True)
    fullName = serializers.CharField(source='full_name', read_only=True)
    gender = serializers.SerializerMethodField()
    department = serializers.CharField(read_only=True, allow_blank=True, default='')
    team = serializers.CharField(read_only=True, allow_blank=True, default='')
    committeeCode = serializers.CharField(source='committee.code', read_only=True)
    committeeName = serializers.CharField(source='committee.name', read_only=True)
    isActive = serializers.BooleanField(source='is_active', read_only=True)
    isApproved = serializers.BooleanField(source='is_approved', read_only=True)
    isGuarantee = serializers.SerializerMethodField()
    guaranteeStatus = serializers.SerializerMethodField()
    guaranteeId = serializers.SerializerMethodField()
    guaranteeGroup = serializers.SerializerMethodField()
    guaranteeConfirmationStatus = serializers.SerializerMethodField()
    guaranteeMobile = serializers.SerializerMethodField()
    
    def get_gender(self, obj):
        """
        Return human-readable gender value.
        """
        return obj.get_gender_display()
    
    def _get_first_guarantee(self, obj):
        from apps.guarantees.models import Guarantee
        request = self.context.get('request')
        user = getattr(request, 'user', None)

        if not hasattr(self, '_guarantee_cache'):
            self._guarantee_cache = {}

        cache_key = (obj.pk, user.pk if user and user.is_authenticated else None)

        if cache_key not in self._guarantee_cache:
            qs = Guarantee.objects.filter(elector=obj)
            if user and user.is_authenticated:
                qs = qs.filter(user=user)

            guarantee = (
                qs.select_related('group', 'elector')
                .values(
                    'id',
                    'guarantee_status',
                    'confirmation_status',
                    'group_id',
                    'group__name',
                    'group__color',
                    'mobile',
                )
                .first()
            )

            self._guarantee_cache[cache_key] = guarantee

        return self._guarantee_cache[cache_key]

    def get_isGuarantee(self, obj):
        """
        Check if the elector has been added to any guarantee list.
        """
        return self._get_first_guarantee(obj) is not None

    def get_guaranteeStatus(self, obj):
        """
        Return guarantee status if elector is in guarantees.
        """
        guarantee = self._get_first_guarantee(obj)
        return guarantee['guarantee_status'] if guarantee else None

    def get_guaranteeId(self, obj):
        """
        Return the guarantee ID for the current user.
        """
        guarantee = self._get_first_guarantee(obj)
        return guarantee['id'] if guarantee else None

    def get_guaranteeGroup(self, obj):
        """
        Return basic guarantee group info for the current user.
        """
        guarantee = self._get_first_guarantee(obj)
        if not guarantee or not guarantee.get('group_id'):
            return None

        return {
            'id': guarantee['group_id'],
            'name': guarantee.get('group__name'),
            'color': guarantee.get('group__color'),
        }

    def get_guaranteeConfirmationStatus(self, obj):
        """
        Return confirmation status for the current user's guarantee.
        """
        guarantee = self._get_first_guarantee(obj)
        return guarantee['confirmation_status'] if guarantee else None

    def get_guaranteeMobile(self, obj):
        """
        Return the elector mobile captured with the guarantee.
        """
        guarantee = self._get_first_guarantee(obj)
        if guarantee:
            mobile = guarantee.get('mobile')
            if mobile:
                return mobile
        # Do NOT default to elector mobile; absence means no guarantee-specific mobile captured
        return None
    
    class Meta:
        model = Elector
        fields = [
            'kocId',
            'fullName',
            'gender',
            'department',
            'team',
            'committee',
            'committeeCode',
            'committeeName',
            'mobile',
            'isActive',
            'isApproved',
            'isGuarantee',
            'guaranteeStatus',
            'guaranteeId',
            'guaranteeGroup',
            'guaranteeConfirmationStatus',
            'guaranteeMobile',
        ]


class ElectorCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating electors.
    Can accept full_name which will be parsed into 8 components.
    """
    
    full_name = serializers.CharField(
        write_only=True,
        required=False,
        help_text='Full name to parse into components (alternative to individual fields)'
    )
    
    # Override required fields to make them optional when full_name is provided
    name_first = serializers.CharField(required=False, allow_blank=True)
    family_name = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = Elector
        fields = [
            'koc_id',
            'full_name',
            'name_first',
            'name_second',
            'name_third',
            'name_fourth',
            'name_fifth',
            'name_sixth',
            'sub_family_name',
            'family_name',
            'designation',
            'section',
            'extension',
            'mobile',
            'area',
            'department',
            'team',
            'committee',
            'gender',
            'is_active',
            'is_approved',
        ]
    
    def validate(self, attrs):
        """
        Parse full_name if provided, otherwise require name_first and family_name.
        """
        full_name = attrs.pop('full_name', None)
        
        if full_name:
            # Parse full name into components
            name_parts = Elector.parse_full_name(full_name)
            attrs.update(name_parts)
        else:
            # Ensure at least first and family names are provided
            if not attrs.get('name_first'):
                raise serializers.ValidationError({
                    'name_first': 'First name is required if full_name is not provided'
                })
            if not attrs.get('family_name'):
                raise serializers.ValidationError({
                    'family_name': 'Family name is required if full_name is not provided'
                })
        
        return attrs


class ElectorImportSerializer(serializers.Serializer):
    """
    Serializer for CSV import validation.
    """
    
    koc_id = serializers.CharField(max_length=20)
    name = serializers.CharField(required=False, allow_blank=True)
    designation = serializers.CharField(required=False, allow_blank=True)
    section = serializers.CharField(required=False, allow_blank=True)
    extension = serializers.CharField(required=False, allow_blank=True)
    mobile = serializers.CharField(required=False, allow_blank=True)
    area = serializers.CharField(required=False, allow_blank=True)
    team = serializers.CharField(required=False, allow_blank=True)
    committee_code = serializers.CharField(required=False, allow_blank=True)
    
    def validate_koc_id(self, value):
        """Validate KOC ID format."""
        if not value or not value.strip():
            raise serializers.ValidationError('KOC ID cannot be empty')
        return value.strip()


class ElectorSearchSerializer(serializers.Serializer):
    """
    Serializer for advanced search parameters.
    """
    
    query = serializers.CharField(
        required=False,
        allow_blank=True,
        help_text='General search query'
    )
    koc_id = serializers.CharField(required=False, allow_blank=True)
    name = serializers.CharField(required=False, allow_blank=True)
    sub_family_name = serializers.CharField(
        required=False,
        allow_blank=True,
        help_text='Search by sub-family name'
    )
    designation = serializers.CharField(required=False, allow_blank=True)
    section = serializers.CharField(required=False, allow_blank=True)
    mobile = serializers.CharField(required=False, allow_blank=True)
    area = serializers.CharField(required=False, allow_blank=True)
    team = serializers.CharField(required=False, allow_blank=True)
    committee = serializers.CharField(required=False, allow_blank=True)
    gender = serializers.ChoiceField(
        choices=[('MALE', 'Male'), ('FEMALE', 'Female')],
        required=False,
        allow_blank=True
    )

