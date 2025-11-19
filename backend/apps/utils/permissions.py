"""
Custom permission classes for API access control.
"""
from rest_framework.permissions import BasePermission


class IsSuperAdmin(BasePermission):
    """
    Permission class: Only super admins.
    """
    
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.role == 'SUPER_ADMIN'
        )


class IsAdminOrAbove(BasePermission):
    """
    Permission class: Admin or Super Admin.
    """
    
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.is_admin_or_above()
        )


class IsSupervisorOrAbove(BasePermission):
    """
    Permission class: Supervisor, Admin, or Super Admin.
    """
    
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.is_supervisor_or_above()
        )


class IsOwnerOrSupervisor(BasePermission):
    """
    Permission class: Owner of the resource or their supervisor.
    Admins can access anything.
    """
    
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Admins can access anything
        if request.user.is_admin_or_above():
            return True
        
        # Owner can access their own data
        if hasattr(obj, 'user') and obj.user == request.user:
            return True
        
        # Supervisor can access their supervised users' data
        if request.user.is_supervisor_or_above():
            if hasattr(obj, 'user') and obj.user.supervisor == request.user:
                return True
        
        return False


class IsAssignedToCommittee(BasePermission):
    """
    Permission class: User is assigned to the committee.
    Admins can access any committee.
    """
    
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Admins can access any committee
        if request.user.is_admin_or_above():
            return True
        
        # Get committee code from object
        committee_code = None
        if hasattr(obj, 'code'):
            committee_code = obj.code
        elif hasattr(obj, 'committee'):
            committee_code = obj.committee.code
        
        # Check if user is assigned to this committee
        if committee_code:
            return request.user.can_access_committee(committee_code)
        
        return False

