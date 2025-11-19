"""
Views for user authentication and management.
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView as BaseTokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models

from .models import CustomUser
from .serializers import (
    UserSerializer,
    UserListSerializer,
    UserCreateSerializer,
    LoginSerializer,
    PasswordChangeSerializer,
    AssignSupervisorSerializer,
    AssignTeamsSerializer,
    AssignCommitteesSerializer,
)
from apps.utils.permissions import IsAdminOrAbove, IsSupervisorOrAbove
from apps.utils.viewsets import StandardResponseMixin
from apps.utils.responses import APIResponse


class LoginView(TokenObtainPairView):
    """
    User login endpoint.
    
    POST /api/auth/login/
    Body: {email, password}
    Returns: {access, refresh, user}
    """
    
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        """Login and return tokens with user data."""
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        # Update last login
        from django.utils import timezone
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])
        
        # Return tokens and user data
        from apps.utils.responses import APIResponse
        return APIResponse.success(
            data={
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data,
            },
            message='Login successful'
        )


class LogoutView(TokenObtainPairView):
    """
    User logout endpoint.
    
    POST /api/auth/logout/
    Body: {refresh}
    """
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Logout by blacklisting refresh token."""
        from apps.utils.responses import APIResponse
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            return APIResponse.success(
                data=None,
                message='Successfully logged out'
            )
        except Exception as e:
            return APIResponse.error(
                message='Invalid token',
                status_code=status.HTTP_400_BAD_REQUEST
            )


class TokenRefreshView(BaseTokenRefreshView):
    """
    Refresh JWT access token.
    
    POST /api/auth/refresh/
    Body: {refresh: "refresh_token"}
    Returns: {access: "new_access_token"}
    
    ✅ STANDARDIZED: Wraps DRF Simple JWT response in standard format
    """
    
    def post(self, request, *args, **kwargs):
        """Refresh access token and return in standard format."""
        from apps.utils.responses import APIResponse
        
        try:
            # Call parent to get new tokens
            response = super().post(request, *args, **kwargs)
            
            # Wrap in standard format
            return APIResponse.success(
                data=response.data,
                message='Token refreshed successfully'
            )
        except Exception as e:
            return APIResponse.error(
                message=str(e),
                status_code=status.HTTP_401_UNAUTHORIZED
            )


class UserViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    """
    User CRUD operations.
    
    Endpoints:
    - GET    /api/users/          - List users (admin only)
    - POST   /api/users/          - Create user (admin only)
    - GET    /api/users/{id}/     - Get user details
    - PUT    /api/users/{id}/     - Update user
    - DELETE /api/users/{id}/     - Delete user (admin only)
    - GET    /api/users/me/       - Current user profile
    - GET    /api/users/supervised/ - Users I supervise
    - PATCH  /api/users/{id}/assign-supervisor/
    - PATCH  /api/users/{id}/assign-teams/
    - PATCH  /api/users/{id}/assign-committees/
    - POST   /api/users/{id}/change-password/
    """
    
    queryset = CustomUser.objects.all()
    permission_classes = [IsAuthenticated]
    
    # Filtering & Search
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_fields = ['role', 'is_active', 'supervisor']
    search_fields = ['email', 'first_name', 'last_name']
    ordering_fields = ['date_joined', 'email', 'first_name']
    ordering = ['-date_joined']
    
    def get_serializer_class(self):
        """Use appropriate serializer based on action."""
        if self.action == 'list':
            return UserListSerializer
        elif self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    def get_permissions(self):
        """Set permissions based on action."""
        if self.action in ['list', 'create', 'destroy']:
            # Only admins can list all users, create users, or delete users
            return [IsAuthenticated(), IsAdminOrAbove()]
        elif self.action in ['supervised']:
            return [IsAuthenticated(), IsSupervisorOrAbove()]
        elif self.action in ['assign_supervisor', 'assign_teams', 'assign_committees']:
            # Only admins can assign supervisors, teams, and committees
            return [IsAuthenticated(), IsAdminOrAbove()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """Filter queryset based on user role."""
        user = self.request.user
        queryset = CustomUser.objects.select_related('supervisor')
        
        # Admins see all users
        if user.is_admin_or_above():
            return queryset.all()
        
        # Supervisors see themselves and their supervised users
        if user.is_supervisor_or_above():
            return queryset.filter(
                models.Q(id=user.id) | models.Q(supervisor=user)
            )
        
        # Regular users only see themselves
        return queryset.filter(id=user.id)

    def create(self, request, *args, **kwargs):
        """Create user and return full representation."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        response_serializer = UserSerializer(user, context=self.get_serializer_context())

        return APIResponse.created(
            data=response_serializer.data,
            message=self.create_message
        )
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Get current user profile.
        
        GET /api/users/me/
        """
        from apps.utils.responses import APIResponse
        serializer = self.get_serializer(request.user)
        return APIResponse.success(data=serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated, IsSupervisorOrAbove])
    def supervised(self, request):
        """
        Get list of users supervised by current user.
        
        GET /api/users/supervised/
        """
        from apps.utils.responses import APIResponse
        supervised_users = request.user.get_supervised_users()
        serializer = UserListSerializer(supervised_users, many=True)
        return APIResponse.success(data=serializer.data)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated, IsAdminOrAbove])
    def assign_supervisor(self, request, pk=None):
        """
        Assign supervisor to a user.
        
        PATCH /api/users/{id}/assign-supervisor/
        Body: {supervisor_id}
        """
        user = self.get_object()
        serializer = AssignSupervisorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        supervisor = serializer.validated_data['supervisor_id']
        user.assign_supervisor(supervisor)
        
        from apps.utils.responses import APIResponse
        return APIResponse.success(
            data={'user': UserSerializer(user).data},
            message='Supervisor assigned successfully'
        )
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated, IsAdminOrAbove])
    def assign_teams(self, request, pk=None):
        """
        Assign teams to a user.
        
        PATCH /api/users/{id}/assign-teams/
        Body: {teams: []}
        """
        user = self.get_object()
        serializer = AssignTeamsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        teams = serializer.validated_data['teams']
        user.assign_teams(teams)
        
        from apps.utils.responses import APIResponse
        return APIResponse.success(
            data={'user': UserSerializer(user).data},
            message='Teams assigned successfully'
        )
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated, IsAdminOrAbove])
    def assign_committees(self, request, pk=None):
        """
        Assign committees to a user for voting day.
        
        PATCH /api/users/{id}/assign-committees/
        Body: {committees: []}
        """
        user = self.get_object()
        serializer = AssignCommitteesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        committees = serializer.validated_data['committees']
        user.assign_committees(committees)
        
        from apps.utils.responses import APIResponse
        return APIResponse.success(
            data={'user': UserSerializer(user).data},
            message='Committees assigned successfully'
        )
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """
        Change current user's password.
        
        POST /api/users/change-password/
        Body: {old_password, new_password, new_password_confirm}
        """
        serializer = PasswordChangeSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        from apps.utils.responses import APIResponse
        return APIResponse.success(
            data=None,
            message='Password changed successfully'
        )
