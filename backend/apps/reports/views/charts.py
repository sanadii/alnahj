"""Chart viewsets."""

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from apps.elections.models import Committee
from apps.guarantees.models import Guarantee
from apps.utils.responses import APIResponse

from ..serializers import ChartDataSerializer


class ChartViewSet(viewsets.ViewSet):
    """Chart data endpoints."""

    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["get"])
    def guarantee_distribution(self, request):
        """Pie chart data for guarantee status distribution."""
        total = Guarantee.objects.count()
        pending = Guarantee.objects.filter(guarantee_status="PENDING").count()
        guaranteed = Guarantee.objects.filter(guarantee_status="GUARANTEED").count()
        not_available = Guarantee.objects.filter(confirmation_status="NOT_AVAILABLE").count()
        confirmed = Guarantee.objects.filter(confirmation_status="CONFIRMED").count()

        data = {
            "chart_type": "PIE",
            "title": "Guarantee Status Distribution",
            "labels": ["Pending", "Guaranteed", "Not Available", "Confirmed"],
            "datasets": [
                {
                    "data": [pending, guaranteed, not_available, confirmed],
                    "backgroundColor": ["#FFC107", "#4CAF50", "#FF9800", "#2196F3"],
                }
            ],
            "options": {
                "total": total,
                "percentages": [
                    round((pending / total * 100) if total else 0, 1),
                    round((guaranteed / total * 100) if total else 0, 1),
                    round((not_available / total * 100) if total else 0, 1),
                    round((confirmed / total * 100) if total else 0, 1),
                ],
            },
        }

        serializer = ChartDataSerializer(data)
        return APIResponse.success(data=serializer.data)

    @action(detail=False, methods=["get"])
    def committee_comparison(self, request):
        """Bar chart data for committee comparison."""
        committees = Committee.objects.all().order_by("code")[:100]

        labels = [committee.code for committee in committees]
        electors = [committee.elector_count for committee in committees]
        attendance = [committee.attendance_count for committee in committees]

        data = {
            "chart_type": "BAR",
            "title": "Committee Comparison",
            "labels": labels,
            "datasets": [
                {"label": "Total Electors", "data": electors, "backgroundColor": "#2196F3"},
                {"label": "Attendance", "data": attendance, "backgroundColor": "#4CAF50"},
            ],
            "options": {},
        }

        serializer = ChartDataSerializer(data)
        return APIResponse.success(data=serializer.data)

