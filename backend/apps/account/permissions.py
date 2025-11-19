from rest_framework import permissions
from .models import User, RoleOptions


class IsAdminUser(permissions.BasePermission):
    """
    Custom permission to only allow admin users.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == RoleOptions.ADMIN


class IsManagerOrAdmin(permissions.BasePermission):
    """
    Custom permission to allow managers and admins.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in [RoleOptions.ADMIN, RoleOptions.MANAGER]


class IsStaffOrAdmin(permissions.BasePermission):
    """
    Custom permission to allow staff, managers, and admins.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in [
            RoleOptions.ADMIN, 
            RoleOptions.MANAGER, 
            RoleOptions.AGENT
        ]


class IsModeratorOrAdmin(permissions.BasePermission):
    """
    Custom permission to allow moderators and admins.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in [
            RoleOptions.ADMIN, 
            RoleOptions.MODERATOR
        ]


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to allow users to access their own data or admins to access any data.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Admin can access any object
        if request.user.role == RoleOptions.ADMIN:
            return True
        
        # Users can access their own data
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'created_by'):
            return obj.created_by == request.user
        elif hasattr(obj, 'id'):
            return obj.id == request.user.id
        
        return False


class IsOwnerOrStaff(permissions.BasePermission):
    """
    Custom permission to allow users to access their own data or staff to access any data.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Staff and above can access any object
        if request.user.role in [RoleOptions.ADMIN, RoleOptions.MANAGER, RoleOptions.AGENT]:
            return True
        
        # Users can access their own data
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'created_by'):
            return obj.created_by == request.user
        elif hasattr(obj, 'id'):
            return obj.id == request.user.id
        
        return False


class CanManageUsers(permissions.BasePermission):
    """
    Custom permission to manage users - only admins and managers can create/update/delete users.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        return request.user and request.user.is_authenticated and request.user.role in [
            RoleOptions.ADMIN, 
            RoleOptions.MANAGER
        ]


class CanManageAppointments(permissions.BasePermission):
    """
    Custom permission for appointment management.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        return request.user and request.user.is_authenticated and request.user.role in [
            RoleOptions.ADMIN, 
            RoleOptions.MANAGER, 
            RoleOptions.AGENT
        ]


class CanManageInvoices(permissions.BasePermission):
    """
    Custom permission for invoice management.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        return request.user and request.user.is_authenticated and request.user.role in [
            RoleOptions.ADMIN, 
            RoleOptions.MANAGER, 
            RoleOptions.AGENT
        ]


class CanManageProducts(permissions.BasePermission):
    """
    Custom permission for product management.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        return request.user and request.user.is_authenticated and request.user.role in [
            RoleOptions.ADMIN, 
            RoleOptions.MANAGER
        ]


class CanManageSettings(permissions.BasePermission):
    """
    Custom permission for settings management - only admins.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == RoleOptions.ADMIN


class IsActiveUser(permissions.BasePermission):
    """
    Custom permission to only allow active users.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_active 