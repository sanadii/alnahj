"""
Standard API Response Utilities - REVISED
==========================================

Consistent response format for ALL endpoints:

SUCCESS:
{
    "status": "success",
    "data": [...] or {...},
    "message": "Success",       # Optional
    "meta": {
        "timestamp": "2025-10-24T12:00:00Z",
        "request_id": "abc123"
    }
}

ERROR:
{
    "status": "error",
    "data": null,
    "message": "Error message",
    "errors": {...}             # Optional field-level errors
}

This provides:
- Consistent status checking
- User-friendly messages for toasts/notifications
- Request tracking with timestamp and ID
- Extensible with metadata when needed
"""

import uuid
from rest_framework.response import Response
from rest_framework import status
from typing import Any, Dict, Optional, List
from django.utils import timezone


def generate_request_id():
    """Generate unique request ID for tracking."""
    return str(uuid.uuid4())


class APIResponse:
    """
    Standard response wrapper for consistent API responses.
    
    All endpoints return:
    {
        "data": [...] or {...},
        "message": "Optional message",
        "meta": {...}  # Optional
    }
    
    Usage:
        # List endpoint
        return APIResponse.success(
            data=[...],
            message="Clients retrieved successfully"
        )
        
        # Detail endpoint
        return APIResponse.success(data={...})
        
        # With metadata (pagination, caching, etc.)
        return APIResponse.success(
            data=[...],
            message="Success",
            meta={
                "pagination": {
                    "count": 100,
                    "page": 1,
                    "page_size": 20
                }
            }
        )
        
        # Error response
        return APIResponse.error(
            message="Validation failed",
            errors={"field": ["Error message"]}
        )
    """
    
    @staticmethod
    def success(
        data: Any = None,
        message: Optional[str] = None,
        meta: Optional[Dict] = None,
        status_code: int = status.HTTP_200_OK
    ) -> Response:
        """
        Success response with consistent wrapper.
        
        Args:
            data: Response data (list, dict, or any serializable type)
            message: Optional success message for user feedback
            meta: Optional metadata (pagination, caching, timestamps, etc.)
            status_code: HTTP status code (default: 200)
            
        Returns:
            Response with format: {status, data, message?, meta}
        """
        # Build meta with required fields
        response_meta = {
            "timestamp": timezone.now().isoformat(),
            "request_id": generate_request_id()
        }
        
        # Merge with provided meta
        if meta:
            response_meta.update(meta)
        
        response_data: Dict[str, Any] = {
            "status": "success",
            "data": data if data is not None else None,
        }
        
        if message:
            response_data["message"] = message
            
        response_data["meta"] = response_meta
            
        return Response(response_data, status=status_code)
    
    @staticmethod
    def created(
        data: Any,
        message: str = "Created successfully",
        status_code: int = status.HTTP_201_CREATED
    ) -> Response:
        """
        Creation success response.
        
        Args:
            data: Created object data
            message: Success message (default: "Created successfully")
            status_code: HTTP status code (default: 201)
            
        Returns:
            Response with 201 status
        """
        return APIResponse.success(
            data=data,
            message=message,
            status_code=status_code
        )
    
    @staticmethod
    def updated(
        data: Any,
        message: str = "Updated successfully"
    ) -> Response:
        """
        Update success response.
        
        Args:
            data: Updated object data
            message: Success message (default: "Updated successfully")
            
        Returns:
            Response with updated data
        """
        return APIResponse.success(
            data=data,
            message=message,
            status_code=status.HTTP_200_OK
        )
    
    @staticmethod
    def deleted(
        message: str = "Deleted successfully"
    ) -> Response:
        """
        Deletion success response.
        
        Args:
            message: Success message (default: "Deleted successfully")
            
        Returns:
            Response with empty data and message
        """
        return APIResponse.success(
            data=None,
            message=message,
            status_code=status.HTTP_200_OK
        )
    
    @staticmethod
    def error(
        message: str,
        errors: Optional[Dict] = None,
        status_code: int = status.HTTP_400_BAD_REQUEST
    ) -> Response:
        """
        Error response with consistent format.
        
        Args:
            message: Error message for user
            errors: Optional field-level errors (DRF validation format)
            status_code: HTTP status code (default: 400)
            
        Returns:
            Response with format: {status, data, message, errors?}
        """
        response_data = {
            "status": "error",
            "data": None,
            "message": message
        }
        
        if errors:
            response_data["errors"] = errors
            
        return Response(response_data, status=status_code)
    
    @staticmethod
    def paginated(
        data: List,
        count: int,
        page: int = 1,
        page_size: int = 20,
        message: Optional[str] = None
    ) -> Response:
        """
        Paginated list response.
        
        Args:
            data: List of items for current page
            count: Total count of items
            page: Current page number
            page_size: Items per page
            message: Optional message
            
        Returns:
            Response with pagination metadata
        """
        return APIResponse.success(
            data=data,
            message=message,
            meta={
                "pagination": {
                    "count": count,
                    "page": page,
                    "page_size": page_size,
                    "total_pages": (count + page_size - 1) // page_size
                }
            }
        )


def success_response(data, message=None, meta=None, status_code=200):
    """
    Shorthand function for APIResponse.success()
    
    Usage:
        return success_response([...], "Success")
    """
    return APIResponse.success(data, message, meta, status_code)


def error_response(message, errors=None, status_code=400):
    """
    Shorthand function for APIResponse.error()
    
    Usage:
        return error_response("Invalid data", {"field": ["Error"]})
    """
    return APIResponse.error(message, errors, status_code)


def paginated_response(data, count, page=1, page_size=20, message=None):
    """
    Shorthand function for APIResponse.paginated()
    
    Usage:
        return paginated_response([...], count=100, page=1)
    """
    return APIResponse.paginated(data, count, page, page_size, message)
