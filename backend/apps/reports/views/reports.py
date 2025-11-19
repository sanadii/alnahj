"""Analytical report viewsets."""

from datetime import timedelta

from django.db.models import Count, Exists, OuterRef, Q
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from apps.account.models import CustomUser
from apps.attendees.models import Attendance
from apps.elections.models import Committee
from apps.electors.models import Elector
from apps.guarantees.models import Guarantee
from apps.utils.permissions import IsAdminOrAbove
from apps.utils.responses import APIResponse

from ..models import CampaignFinanceSnapshot, GeneratedReport
from ..serializers import (
    AccuracyReportSerializer,
    CommitteePerformanceSerializer,
    CoverageReportSerializer,
    ExportRequestSerializer,
    CampaignFinanceSnapshotSerializer,
)


class ReportsViewSet(viewsets.ViewSet):
    """Report generation endpoints."""

    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated, IsAdminOrAbove])
    def coverage(self, request):
        """Generate guarantee coverage report."""
        if not request.user.is_admin_or_above():
            return APIResponse.error("Permission denied", status_code=status.HTTP_403_FORBIDDEN)

        total_electors = Elector.objects.filter(is_active=True).count()
        electors_with_guarantees = Guarantee.objects.values("elector").distinct().count()
        electors_without = total_electors - electors_with_guarantees

        coverage_percentage = round(
            (electors_with_guarantees / total_electors * 100) if total_electors > 0 else 0, 1
        )

        committee_stats = (
            Committee.objects.annotate(
                total_electors=Count("electors", filter=Q(electors__is_active=True)),
                covered_electors=Count(
                    "electors",
                    filter=Q(electors__is_active=True, electors__guarantees__isnull=False),
                    distinct=True,
                ),
            )
            .values("code", "name", "total_electors", "covered_electors")
            .order_by("code")
        )

        by_committee = []
        for stat in committee_stats:
            total = stat["total_electors"]
            covered = stat["covered_electors"]
            uncovered = total - covered
            coverage_pct = round((covered / total * 100) if total > 0 else 0, 1)
            by_committee.append(
                {
                    "committee_code": stat["code"],
                    "committee_name": stat["name"],
                    "total_electors": total,
                    "covered": covered,
                    "uncovered": uncovered,
                    "coverage_percentage": coverage_pct,
                }
            )

        by_section = list(
            Elector.objects.filter(is_active=True)
            .values("section")
            .annotate(
                total=Count("koc_id"),
                covered=Count("koc_id", filter=Q(guarantees__isnull=False), distinct=True),
            )
            .order_by("-total")[:10]
        )
        for section in by_section:
            total = section["total"]
            covered = section["covered"]
            section["uncovered"] = total - covered
            section["coverage_percentage"] = round((covered / total * 100) if total else 0, 1)

        user_stats = (
            Guarantee.objects.filter(user__is_active=True)
            .values("user__id", "user__first_name", "user__last_name", "user__email")
            .annotate(
                total_guarantees=Count("id"),
                pending=Count("id", filter=Q(guarantee_status="PENDING")),
                guaranteed=Count("id", filter=Q(guarantee_status="GUARANTEED")),
                pending_confirmation=Count("id", filter=Q(confirmation_status="PENDING")),
                confirmed=Count("id", filter=Q(confirmation_status="CONFIRMED")),
                not_available=Count("id", filter=Q(confirmation_status="NOT_AVAILABLE")),
            )
            .filter(total_guarantees__gt=0)
            .order_by("-total_guarantees")[:10]
        )

        by_user = [
            {
                "user_name": f"{stat['user__first_name']} {stat['user__last_name']}".strip()
                or stat["user__email"],
                "user_email": stat["user__email"],
                "total_guarantees": stat["total_guarantees"],
                "pending": stat["pending"],
                "guaranteed": stat["guaranteed"],
                "pending_confirmation": stat["pending_confirmation"],
                "confirmed": stat["confirmed"],
                "not_available": stat["not_available"],
            }
            for stat in user_stats
        ]

        uncovered_electors = (
            Elector.objects.filter(is_active=True)
            .annotate(
                has_guarantee=Exists(
                    Guarantee.objects.filter(elector_id=OuterRef("koc_id"))
                )
            )
            .filter(has_guarantee=False)
            .select_related("committee")[:10]
        )
        coverage_gaps = [
            {
                "koc_id": elector.koc_id,
                "name": elector.full_name,
                "section": elector.section,
                "committee": elector.committee.code if elector.committee else None,
            }
            for elector in uncovered_electors
        ]

        recommendations = []
        if coverage_percentage < 50:
            recommendations.append(
                {
                    "priority": "HIGH",
                    "message": f"Coverage is only {coverage_percentage}%. Urgent action required.",
                }
            )
        elif coverage_percentage < 75:
            recommendations.append(
                {
                    "priority": "MEDIUM",
                    "message": f"Coverage at {coverage_percentage}%. Focus on high-priority electors.",
                }
            )

        for committee_data in by_committee:
            if committee_data["coverage_percentage"] < 50:
                recommendations.append(
                    {
                        "priority": "HIGH",
                        "message": (
                            f"Committee {committee_data['committee_code']} has only "
                            f"{committee_data['coverage_percentage']}% coverage."
                        ),
                    }
                )

        data = {
            "summary": {
                "total_electors": total_electors,
                "covered": electors_with_guarantees,
                "uncovered": electors_without,
                "coverage_percentage": coverage_percentage,
                "generated_at": timezone.now().isoformat(),
            },
            "by_committee": by_committee,
            "by_section": by_section,
            "by_user": by_user,
            "coverage_gaps": coverage_gaps,
            "recommendations": recommendations,
        }

        serializer = CoverageReportSerializer(data)
        return APIResponse.success(data=serializer.data)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated, IsAdminOrAbove])
    def accuracy(self, request):
        """Generate guarantee accuracy report (guarantees vs attendance)."""
        if not request.user.is_admin_or_above():
            return APIResponse.error("Permission denied", status_code=status.HTTP_403_FORBIDDEN)

        total_guarantees = Guarantee.objects.count()
        confirmed = Guarantee.objects.filter(confirmation_status="CONFIRMED").count()
        pending_confirmations = Guarantee.objects.filter(confirmation_status="PENDING").count()

        attendance = Attendance.objects.values("elector__guarantees").filter(
            elector__guarantees__isnull=False
        )
        attended = attendance.count()

        user_rows = (
            Guarantee.objects.values("user__email", "user__first_name", "user__last_name")
            .annotate(
                total=Count("id"),
                confirmed=Count("id", filter=Q(confirmation_status="CONFIRMED")),
            )
            .order_by("-total")[:50]
        )

        by_user = [
            {
                "user_name": f"{row['user__first_name']} {row['user__last_name']}".strip()
                or row["user__email"],
                "confirmed": row["confirmed"],
                "total": row["total"],
            }
            for row in user_rows
        ]

        payload = {
            "summary": {
                "total_guarantees": total_guarantees,
                "confirmed_guarantees": confirmed,
                "confirmation_rate": round(confirmed / total_guarantees * 100, 2)
                if total_guarantees
                else 0,
                "attendance_matches": attended,
            },
            "by_status": {
                "confirmed": confirmed,
                "pending": pending_confirmations,
                "not_available": total_guarantees - confirmed - pending_confirmations,
            },
            "by_user": by_user,
            "accuracy_metrics": {
                "attendance_match_percentage": round(attended / total_guarantees * 100, 2)
                if total_guarantees
                else 0,
            },
            "predictions_vs_actual": [],
        }

        serializer = AccuracyReportSerializer(payload)
        return APIResponse.success(data=serializer.data)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated, IsAdminOrAbove])
    def committee_performance(self, request):
        """Generate committee performance report."""
        if not request.user.is_admin_or_above():
            return APIResponse.error("Permission denied", status_code=status.HTTP_403_FORBIDDEN)

        committees = (
            Committee.objects.select_related("election")
            .annotate(
                total_electors=Count("electors", filter=Q(electors__is_active=True), distinct=True),
                total_attendance=Count("attendances", distinct=True),
                total_guarantees=Count("electors__guarantees", distinct=True),
                pending_guarantees=Count(
                    "electors__guarantees",
                    filter=Q(electors__guarantees__guarantee_status="PENDING"),
                    distinct=True,
                ),
                confirmed_guarantees=Count(
                    "electors__guarantees",
                    filter=Q(electors__guarantees__confirmation_status="CONFIRMED"),
                    distinct=True,
                ),
                not_available_guarantees=Count(
                    "electors__guarantees",
                    filter=Q(electors__guarantees__confirmation_status="NOT_AVAILABLE"),
                    distinct=True,
                ),
            )
            .order_by("code")[:100]
        )

        committee_stats = []
        for committee in committees:
            total_electors = committee.total_electors
            total_attendance = committee.total_attendance
            total_guarantees = committee.total_guarantees
            attendance_rate = round(
                (total_attendance / total_electors * 100) if total_electors else 0,
                1,
            )
            coverage = round((total_guarantees / total_electors * 100) if total_electors else 0, 1)

            committee_stats.append(
                {
                    "code": committee.code,
                    "name": committee.name,
                    "gender": committee.gender,
                    "total_electors": total_electors,
                    "total_attendance": total_attendance,
                    "attendance_rate": attendance_rate,
                    "total_guarantees": total_guarantees,
                    "pending": committee.pending_guarantees,
                    "confirmed": committee.confirmed_guarantees,
                    "not_available": committee.not_available_guarantees,
                    "coverage": coverage,
                }
            )

        committee_stats.sort(key=lambda item: item["attendance_rate"], reverse=True)

        total_attendance_count = sum(c["total_attendance"] for c in committee_stats)
        total_elector_count = sum(c["total_electors"] for c in committee_stats)
        overall_attendance = round(
            (total_attendance_count / total_elector_count * 100) if total_elector_count else 0, 1
        )

        guarantee_distribution = [
            {"committee": committee["code"], "total": committee["total_guarantees"]}
            for committee in committee_stats
        ]

        data = {
            "committee_stats": committee_stats,
            "attendance_rates": {
                "overall": overall_attendance,
                "highest": committee_stats[0] if committee_stats else None,
                "lowest": committee_stats[-1] if committee_stats else None,
            },
            "guarantee_distribution": guarantee_distribution,
            "performance_comparison": {
                "top_performing": committee_stats[:3],
                "needs_attention": [c for c in committee_stats if c["attendance_rate"] < 60],
            },
        }

        serializer = CommitteePerformanceSerializer(data)
        return APIResponse.success(data=serializer.data)

    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated, IsAdminOrAbove])
    def export(self, request):
        """Export report data."""
        if not request.user.is_admin_or_above():
            return APIResponse.error("Permission denied", status_code=status.HTTP_403_FORBIDDEN)

        serializer = ExportRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        report_type = serializer.validated_data["report_type"]
        export_format = serializer.validated_data["format"]

        normalized_type = report_type.upper()
        type_mapping = {
            "COVERAGE": "GUARANTEE_COVERAGE",
            "ACCURACY": "GUARANTEE_ACCURACY",
            "COMMITTEE_PERFORMANCE": "COMMITTEE_PERFORMANCE",
            "GUARANTEE_COVERAGE": "GUARANTEE_COVERAGE",
            "GUARANTEE_ACCURACY": "GUARANTEE_ACCURACY",
        }
        normalized_type = type_mapping.get(normalized_type)

        if normalized_type == "GUARANTEE_COVERAGE":
            response = self.coverage(request)
            report_data = response.data.get("data", response.data)
        elif normalized_type == "GUARANTEE_ACCURACY":
            response = self.accuracy(request)
            report_data = response.data.get("data", response.data)
        elif normalized_type == "COMMITTEE_PERFORMANCE":
            response = self.committee_performance(request)
            report_data = response.data.get("data", response.data)
        else:
            return APIResponse.error(
                message="Unsupported report type",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        generated_report = GeneratedReport.objects.create(
            title=f"{(normalized_type or report_type).replace('_', ' ').title()} Report",
            report_type=normalized_type or report_type,
            format=export_format,
            status="COMPLETED",
            parameters=serializer.validated_data.get("parameters", {}),
            data=report_data,
            generated_by=request.user,
            generated_at=timezone.now(),
            expires_at=timezone.now() + timedelta(days=7),
        )

        return APIResponse.success(
            data={
                "report_id": generated_report.id,
                "title": generated_report.title,
                "format": export_format,
                "status": "COMPLETED",
                "download_url": f"/api/reports/download/{generated_report.id}/",
            },
            message=f"Report generated successfully in {export_format} format",
        )

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated, IsAdminOrAbove])
    def campaign_performance(self, request):
        """Return campaign budget and resource readiness metrics."""
        if not request.user.is_admin_or_above():
            return APIResponse.error("Permission denied", status_code=status.HTTP_403_FORBIDDEN)

        latest_snapshot = CampaignFinanceSnapshot.objects.order_by("-period_end", "-created_at").first()
        finance_data = (
            CampaignFinanceSnapshotSerializer(latest_snapshot).data
            if latest_snapshot
            else {
                "total_budget": 0,
                "committed_budget": 0,
                "spent_budget": 0,
                "available_budget": 0,
                "burn_rate": 0,
            }
        )

        total_users = CustomUser.objects.filter(is_active=True).count()
        supervisors = CustomUser.objects.filter(is_active=True, role="SUPERVISOR").count()
        admins = CustomUser.objects.filter(is_active=True, role__in=["ADMIN", "SUPER_ADMIN"]).count()
        field_agents = max(total_users - supervisors - admins, 0)
        active_today = CustomUser.objects.filter(
            is_active=True, last_login__date=timezone.now().date()
        ).count()

        guarantee_count = Guarantee.objects.count()
        attendance_today = Attendance.objects.filter(attended_at__date=timezone.now().date()).count()

        payload = {
            "budget": finance_data,
            "resources": {
                "total_users": total_users,
                "admins": admins,
                "supervisors": supervisors,
                "field_agents": field_agents,
                "active_today": active_today,
                "active_ratio": round((active_today / total_users * 100) if total_users else 0, 1),
            },
            "forecast": {
                "daily_burn_rate": finance_data.get("burn_rate") or 0,
                "guarantees_total": guarantee_count,
                "attendance_today": attendance_today,
            },
        }

        return APIResponse.success(data=payload)

