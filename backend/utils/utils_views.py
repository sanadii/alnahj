"""
Legacy pagination utility.

NOTE: This CustomPagination class is not currently used in the project.
DRF pagination is configured in settings.py.

This file can be removed if not needed, or kept for reference.
"""

# from rest_framework.pagination import PageNumberPagination
# from rest_framework.response import Response

# class CustomPagination(PageNumberPagination):
#     """
#     Custom pagination class (not currently used).
#     DRF default pagination is configured in core/settings.py
#     """
#     page_size = 50
#
#     def get_paginated_response(self, data):
#         return Response({
#             "count": self.page.paginator.count,
#             "next": self.get_next_link(),
#             "previous": self.get_previous_link(),
#             "data": data,
#         })
