"""Dashboard viewsets for reports app."""

from urllib.parse import urlencode
from datetime import timedelta

from django.core.cache import cache
from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from apps.account.models import CustomUser
from apps.attendees.models import Attendance
from apps.elections.models import Committee
from apps.electors.models import Elector
from apps.guarantees.models import Guarantee
from apps.utils.permissions import IsAdminOrAbove, IsSupervisorOrAbove
from apps.utils.responses import APIResponse

from ..models import CampaignFinanceSnapshot
from ..serializers import (
    AdminDashboardSerializer,
    CampaignFinanceSnapshotSerializer,
    PersonalDashboardSerializer,
    SupervisorDashboardSerializer,
)


def committee_overview_queryset(limit: int = 100, order_by: str = "code"):
    """Optimized queryset for committee summaries with precomputed counts."""
    queryset = (
        Committee.objects.select_related("election")
        .annotate(
            total_electors=Count(
                "electors",
                filter=Q(electors__is_active=True),
                distinct=True,
            ),
            total_attendance=Count("attendances", distinct=True),
        )
        .order_by(order_by)
    )
    if limit is not None:
        queryset = queryset[:limit]
    return queryset


class DashboardViewSet(viewsets.ViewSet):
    """Dashboard endpoints for different user roles."""

    permission_classes = [IsAuthenticated]
    CACHE_TIMEOUTS = {
        "personal": 300,  # 5 minutes
        "supervisor": 300,  # 5 minutes
        "admin": 120,  # 2 minutes
    }

    def _should_refresh_cache(self, request):
        refresh_value = request.query_params.get("refresh")
        return refresh_value in {"1", "true", "True"}

    def _build_cache_key(self, prefix, request, include_user=False):
        components = [f"dashboard:{prefix}"]
        if include_user:
            components.append(f"user:{request.user.pk}")
        if request.query_params:
            query_items = []
            for key in sorted(request.query_params.keys()):
                for value in request.query_params.getlist(key):
                    query_items.append((key, value))
            if query_items:
                components.append(urlencode(query_items))
        return ":".join(components)

    @action(detail=False, methods=["get"])
    def personal(self, request):
        """
        Personal dashboard for regular users.

        GET /api/reports/dashboard/personal/
        """
        cache_key = self._build_cache_key("personal", request, include_user=True)
        bypass_cache = self._should_refresh_cache(request)
        if not bypass_cache:
            cached_payload = cache.get(cache_key)
            if cached_payload is not None:
                return APIResponse.success(data=cached_payload)

        guarantees = Guarantee.objects.filter(user=request.user)

        stats = guarantees.aggregate(
            total=Count("id"),
            pending=Count("id", filter=Q(guarantee_status="PENDING")),
            guaranteed=Count("id", filter=Q(guarantee_status="GUARANTEED")),
            not_available=Count("id", filter=Q(confirmation_status="NOT_AVAILABLE")),
            confirmed=Count("id", filter=Q(confirmation_status="CONFIRMED")),
        )

        total = stats["total"]
        pending = stats["pending"]
        guaranteed = stats["guaranteed"]
        not_available = stats["not_available"]
        confirmed = stats["confirmed"]

        groups = (
            guarantees.values("group__name", "group__color")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        recent = guarantees.select_related("elector").order_by("-created_at")[:5]
        from apps.guarantees.serializers import GuaranteeListSerializer

        data = {
            "my_guarantees": {
                "total": total,
                "pending": pending,
                "not_available": not_available,
                "confirmed": confirmed,
                "guaranteed": guaranteed,
                "guaranteed_percentage": round((guaranteed / total * 100), 1) if total else 0,
            },
            "my_groups": list(groups),
            "recent_guarantees": GuaranteeListSerializer(recent, many=True).data,
            "quick_stats": {
                "coverage_rate": round((total / 979 * 100), 1) if total else 0,
                "confidence_score": round((confirmed / total), 2) if total else 0,
            },
        }

        serializer = PersonalDashboardSerializer(data)
        response_data = serializer.data
        cache.set(cache_key, response_data, self.CACHE_TIMEOUTS["personal"])
        return APIResponse.success(data=response_data)

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[IsAuthenticated, IsSupervisorOrAbove],
    )
    def supervisor(self, request):
        """
        Supervisor dashboard for team monitoring.

        GET /api/reports/dashboard/supervisor/
        """
        if not request.user.is_supervisor_or_above():
            return APIResponse.error("Permission denied", status_code=status.HTTP_403_FORBIDDEN)

        cache_key = self._build_cache_key("supervisor", request, include_user=True)
        bypass_cache = self._should_refresh_cache(request)
        if not bypass_cache:
            cached_payload = cache.get(cache_key)
            if cached_payload is not None:
                return APIResponse.success(data=cached_payload)

        if request.user.role == "SUPERVISOR":
            team_members = request.user.supervised_users.filter(is_active=True)
        else:
            team_members = CustomUser.objects.filter(is_active=True)

        team_member_ids = list(team_members.values_list("id", flat=True))
        total_members = len(team_member_ids)
        active_today = team_members.filter(last_login__date=timezone.now().date()).count()

        team_guarantees = Guarantee.objects.filter(user_id__in=team_member_ids)
        team_stats = team_guarantees.aggregate(
            total=Count("id"),
            pending=Count("id", filter=Q(guarantee_status="PENDING")),
            guaranteed=Count("id", filter=Q(guarantee_status="GUARANTEED")),
            not_available=Count("id", filter=Q(confirmation_status="NOT_AVAILABLE")),
            confirmed=Count("id", filter=Q(confirmation_status="CONFIRMED")),
        )

        total_guarantees = team_stats["total"]
        pending = team_stats["pending"]
        guaranteed = team_stats["guaranteed"]
        not_available = team_stats["not_available"]
        confirmed = team_stats["confirmed"]

        member_stats = (
            Guarantee.objects.filter(user_id__in=team_member_ids)
            .values("user__id", "user__first_name", "user__last_name", "user__email")
            .annotate(
                total=Count("id"),
                pending=Count("id", filter=Q(guarantee_status="PENDING")),
                guaranteed=Count("id", filter=Q(guarantee_status="GUARANTEED")),
                not_available=Count("id", filter=Q(confirmation_status="NOT_AVAILABLE")),
                confirmed=Count("id", filter=Q(confirmation_status="CONFIRMED")),
            )
            .order_by("-total")
        )

        member_stats_list = [
            {
                "id": stat["user__id"],
                "name": f"{stat['user__first_name']} {stat['user__last_name']}".strip()
                or stat["user__email"],
                "email": stat["user__email"],
                "total": stat["total"],
                "pending": stat["pending"],
                "guaranteed": stat["guaranteed"],
                "not_available": stat["not_available"],
                "confirmed": stat["confirmed"],
            }
            for stat in member_stats
        ]

        recent_activity = [
            {
                "user_name": guarantee.user.full_name,
                "elector_name": guarantee.elector.full_name,
                "status": guarantee.guarantee_status,
                "confirmation_status": guarantee.confirmation_status,
                "created_at": guarantee.created_at,
            }
            for guarantee in team_guarantees.select_related("user", "elector").order_by("-created_at")[:10]
        ]

        payload = {
            "team_overview": {
                "total_members": total_members,
                "active_today": active_today,
                "total_guarantees": total_guarantees,
            },
            "team_guarantees": {
                "total": total_guarantees,
                "pending": pending,
                "guaranteed": guaranteed,
                "not_available": not_available,
                "confirmed": confirmed,
            },
            "team_members": member_stats_list,
            "team_progress": {
                "average_per_member": round(total_guarantees / total_members, 1) if total_members else 0,
                "top_performer": member_stats_list[0] if member_stats_list else None,
            },
            "recent_activity": recent_activity,
        }

        serializer = SupervisorDashboardSerializer(payload)
        response_data = serializer.data
        cache.set(cache_key, response_data, self.CACHE_TIMEOUTS["supervisor"])
        return APIResponse.success(data=response_data)

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[IsAuthenticated, IsAdminOrAbove],
    )
    def admin(self, request):
        """
        Admin dashboard with complete overview.

        GET /api/reports/dashboard/admin/
        """
        if not request.user.is_admin_or_above():
            return APIResponse.error("Permission denied", status_code=status.HTTP_403_FORBIDDEN)

        cache_key = self._build_cache_key("admin", request, include_user=False)
        bypass_cache = self._should_refresh_cache(request)
        if not bypass_cache:
            cached_payload = cache.get(cache_key)
            if cached_payload is not None:
                return APIResponse.success(data=cached_payload)

        total_users = CustomUser.objects.filter(is_active=True).count()
        total_electors = Elector.objects.filter(is_active=True).count()
        total_attendance = Attendance.objects.count()

        guarantee_stats = Guarantee.objects.aggregate(
            total=Count("id"),
            pending=Count("id", filter=Q(guarantee_status="PENDING")),
            guaranteed=Count("id", filter=Q(guarantee_status="GUARANTEED")),
            not_available=Count("id", filter=Q(confirmation_status="NOT_AVAILABLE")),
            confirmed=Count("id", filter=Q(confirmation_status="CONFIRMED")),
        )

        total_guarantees = guarantee_stats["total"]
        pending = guarantee_stats["pending"]
        guaranteed = guarantee_stats["guaranteed"]
        not_available = guarantee_stats["not_available"]
        confirmed = guarantee_stats["confirmed"]

        electors_with_guarantees = Guarantee.objects.values("elector").distinct().count()
        coverage_percentage = (
            round(electors_with_guarantees / total_electors * 100, 1) if total_electors else 0
        )
        attendance_percentage = (
            round(total_attendance / total_electors * 100, 1) if total_electors else 0
        )

        committees = committee_overview_queryset(limit=100, order_by="code")
        committee_data = [
            {
                "code": committee.code,
                "name": committee.name,
                "total_electors": committee.total_electors,
                "total_attendance": committee.total_attendance,
                "attendance_percentage": round(
                    (committee.total_attendance / committee.total_electors * 100)
                    if committee.total_electors
                    else 0,
                    2,
                ),
            }
            for committee in committees
        ]

        yesterday = timezone.now() - timedelta(days=1)
        recent_guarantees = Guarantee.objects.filter(created_at__gte=yesterday).count()
        recent_attendance = Attendance.objects.filter(attended_at__gte=yesterday).count()

        recent_items = Guarantee.objects.select_related("user", "elector").order_by("-created_at")[:10]
        recent_activity = [
            {
                "type": "guarantee",
                "user": item.user.full_name,
                "description": f"Added guarantee from {item.elector.full_name}",
                "timestamp": item.created_at,
            }
            for item in recent_items
        ]

        yesterday_start = timezone.now() - timedelta(days=2)
        yesterday_end = timezone.now() - timedelta(days=1)
        yesterday_guarantees = Guarantee.objects.filter(
            created_at__gte=yesterday_start, created_at__lt=yesterday_end
        ).count()

        latest_finance = CampaignFinanceSnapshot.objects.order_by("-period_end", "-created_at").first()
        budget_overview = (
            CampaignFinanceSnapshotSerializer(latest_finance).data if latest_finance else None
        )

        active_today = CustomUser.objects.filter(
            is_active=True, last_login__date=timezone.now().date()
        ).count()

        user_role_stats = CustomUser.objects.filter(is_active=True).aggregate(
            supervisors=Count("id", filter=Q(role="SUPERVISOR")),
            admins=Count("id", filter=Q(role="ADMIN")),
            regular=Count("id", filter=Q(role="USER")),
        )

        payload = {
            "overview": {
                "total_users": total_users,
                "total_electors": total_electors,
                "total_guarantees": total_guarantees,
                "total_attendance": total_attendance,
                "coverage_percentage": coverage_percentage,
                "attendance_percentage": attendance_percentage,
            },
            "guarantees": {
                "total": total_guarantees,
                "pending": pending,
                "guaranteed": guaranteed,
                "not_available": not_available,
                "confirmed": confirmed,
                "guaranteed_percentage": round(
                    (guaranteed / total_guarantees * 100), 1
                )
                if total_guarantees
                else 0,
                "electors_covered": electors_with_guarantees,
            },
            "attendance": {
                "total": total_attendance,
                "percentage": attendance_percentage,
                "recent_24h": recent_attendance,
            },
            "users": {
                "total": total_users,
                "admins": user_role_stats["admins"],
                "supervisors": user_role_stats["supervisors"],
                "regular": user_role_stats["regular"],
            },
            "committees": committee_data,
            "recent_activity": recent_activity,
            "trends": {
                "guarantees_24h": recent_guarantees,
                "guarantee_trend": recent_guarantees - yesterday_guarantees,
                "attendance_24h": recent_attendance,
            },
        }

        if budget_overview:
            payload["budget_overview"] = budget_overview

        payload["resource_overview"] = {
            "total_users": total_users,
            "active_today": active_today,
            "active_ratio": round((active_today / total_users * 100) if total_users else 0, 1),
            "supervisors": user_role_stats["supervisors"],
            "admins": user_role_stats["admins"],
            "field_agents": max(total_users - user_role_stats["supervisors"] - user_role_stats["admins"], 0),
        }

        payload["performance_forecast"] = {
            "daily_burn_rate": budget_overview.get("burn_rate") if budget_overview else 0,
            "guarantees_total": total_guarantees,
            "attendance_recent": recent_attendance,
        }

        payload["system_overview"] = payload["overview"]

        serializer = AdminDashboardSerializer(payload)
        response_data = serializer.data
        cache.set(cache_key, response_data, self.CACHE_TIMEOUTS["admin"])
        return APIResponse.success(data=response_data)

