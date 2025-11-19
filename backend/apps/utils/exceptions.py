"""
Custom exception handler for standardized API responses.
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """
    Custom exception handler for DRF.
    Returns consistent error response format.
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)
    
    if response is not None:
        # Flatten error details
        error_details = response.data
        
        # Extract message
        if isinstance(error_details, dict):
            # Get first error message
            if 'detail' in error_details:
                message = str(error_details['detail'])
                errors = None
            elif 'non_field_errors' in error_details:
                message = str(error_details['non_field_errors'][0])
                errors = error_details
            else:
                # Field-level errors
                first_key = list(error_details.keys())[0]
                message = f"{first_key}: {error_details[first_key][0]}" if isinstance(error_details[first_key], list) else str(error_details[first_key])
                errors = error_details
        else:
            message = str(error_details)
            errors = None
        
        # Standardize error response format
        custom_response_data = {
            'status': 'error',
            'data': None,
            'message': message,
        }
        
        if errors:
            custom_response_data['errors'] = errors
        
        response.data = custom_response_data
    
    return response


# NOTE: success_response function removed - use APIResponse class instead
# from apps.utils.responses import APIResponse
# Example: return APIResponse.success(data=data, message=message)

