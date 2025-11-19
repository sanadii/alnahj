"""Analytics viewsets."""

from datetime import timedelta

from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from apps.utils.permissions import IsAdminOrAbove
from apps.utils.responses import APIResponse

from ..models import AnalyticsSnapshot
from ..serializers import AnalyticsSnapshotSerializer


class AnalyticsViewSet(viewsets.ViewSet):
    """Analytics snapshots."""

    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["get"])
    def trends(self, request):
        """Return analytics trend data."""
        days = int(request.query_params.get("days", 30))
        start_date = timezone.now().date() - timedelta(days=days)

        snapshots = AnalyticsSnapshot.objects.filter(
            snapshot_date__gte=start_date
        ).order_by("snapshot_date")

        trend_data = {
            "dates": [str(snapshot.snapshot_date) for snapshot in snapshots],
            "guarantees": [snapshot.metrics.get("total_guarantees", 0) for snapshot in snapshots],
            "attendance": [snapshot.metrics.get("total_attendance", 0) for snapshot in snapshots],
            "coverage": [snapshot.metrics.get("elector_coverage", 0) for snapshot in snapshots],
        }

        return APIResponse.success(data=trend_data)

    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated, IsAdminOrAbove])
    def create_snapshot(self, request):
        """Create a new analytics snapshot."""
        if not request.user.is_admin_or_above():
            return APIResponse.error("Permission denied", status_code=status.HTTP_403_FORBIDDEN)

        snapshot = AnalyticsSnapshot.create_snapshot("ON_DEMAND")
        serializer = AnalyticsSnapshotSerializer(snapshot)
        return APIResponse.created(data=serializer.data, message="Snapshot created successfully")

