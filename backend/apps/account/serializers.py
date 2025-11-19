"""
Serializers for user authentication and management.
"""
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    """
    Full user serializer with all details.
    Used for user profile and detail views.
    """
    
    full_name = serializers.CharField(read_only=True)
    supervised_users_count = serializers.SerializerMethodField()
    supervisor_name = serializers.SerializerMethodField()
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    
    class Meta:
        model = CustomUser
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'full_name',
            'phone',
            'role',
            'role_display',
            'supervisor',
            'supervisor_name',
            'teams',
            'committees',
            'is_active',
            'date_joined',
            'last_login',
            'supervised_users_count',
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']
    
    def get_supervised_users_count(self, obj):
        """Get count of users supervised by this user."""
        if obj.is_supervisor_or_above():
            return obj.supervised_users.filter(is_active=True).count()
        return 0
    
    def get_supervisor_name(self, obj):
        """Get supervisor's full name."""
        if obj.supervisor:
            return obj.supervisor.full_name
        return None


class UserListSerializer(serializers.ModelSerializer):
    """
    Lightweight user serializer for list views.
    Only includes essential fields for performance.
    """
    
    full_name = serializers.CharField(read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    
    class Meta:
        model = CustomUser
        fields = [
            'id',
            'email',
            'full_name',
            'role',
            'role_display',
            'is_active',
            'date_joined',
        ]


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new users.
    Includes password field with validation.
    """
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=4,
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=False,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = CustomUser
        fields = [
            'email',
            'password',
            'password_confirm',
            'first_name',
            'last_name',
            'phone',
            'role',
            'supervisor',
            'teams',
            'committees',
        ]
    
    def validate(self, attrs):
        """Validate passwords match if password_confirm is provided."""
        password_confirm = attrs.get('password_confirm')
        if password_confirm and attrs['password'] != password_confirm:
            raise serializers.ValidationError({
                'password_confirm': 'Passwords do not match'
            })
        return attrs
    
    def validate_supervisor(self, value):
        """Validate supervisor has appropriate role."""
        if value and not value.is_supervisor_or_above():
            raise serializers.ValidationError(
                'Supervisor must have SUPERVISOR role or above'
            )
        return value
    
    def create(self, validated_data):
        """Create user with hashed password."""
        validated_data.pop('password_confirm', None)  # Remove if present
        password = validated_data.pop('password')
        user = CustomUser.objects.create_user(password=password, **validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    Validates credentials and returns user data.
    """
    
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    
    def validate(self, attrs):
        """Authenticate user credentials."""
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(
                request=self.context.get('request'),
                username=email,
                password=password
            )
            
            if not user:
                raise serializers.ValidationError(
                    'Invalid email or password',
                    code='authorization'
                )
            
            if not user.is_active:
                raise serializers.ValidationError(
                    'User account is inactive',
                    code='authorization'
                )
        else:
            raise serializers.ValidationError(
                'Must include "email" and "password"',
                code='authorization'
            )
        
        attrs['user'] = user
        return attrs


class PasswordChangeSerializer(serializers.Serializer):
    """
    Serializer for changing user password.
    Requires old password for verification.
    """
    
    old_password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    new_password_confirm = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    
    def validate_old_password(self, value):
        """Validate old password is correct."""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect')
        return value
    
    def validate(self, attrs):
        """Validate new passwords match."""
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': 'New passwords do not match'
            })
        return attrs
    
    def save(self):
        """Update user password."""
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save(update_fields=['password'])
        return user


class AssignSupervisorSerializer(serializers.Serializer):
    """Serializer for assigning supervisor to user."""
    
    supervisor_id = serializers.IntegerField(required=True)
    
    def validate_supervisor_id(self, value):
        """Validate supervisor exists and has appropriate role."""
        try:
            supervisor = CustomUser.objects.get(id=value, is_active=True)
            if not supervisor.is_supervisor_or_above():
                raise serializers.ValidationError(
                    'User must have SUPERVISOR role or above'
                )
            return supervisor
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError('Supervisor not found')


class AssignTeamsSerializer(serializers.Serializer):
    """Serializer for assigning teams to user."""
    
    teams = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=True,
        allow_empty=True
    )


class AssignCommitteesSerializer(serializers.Serializer):
    """Serializer for assigning committees to user for voting day."""
    
    committees = serializers.ListField(
        child=serializers.CharField(max_length=20),
        required=True,
        allow_empty=True
    )
