"""Elector viewset and supporting endpoints."""
from __future__ import annotations

import logging
from typing import Any, Dict, List

from django.db import transaction
from django.db.models import Count, Q
from django.http import HttpResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated

from apps.utils.permissions import IsAdminOrAbove
from apps.utils.responses import APIResponse
from apps.utils.viewsets import StandardResponseMixin

from .import_service import ElectorImportService
from .models import Elector
from .serializers import (
    ElectorCreateSerializer,
    ElectorListSerializer,
    ElectorSearchSerializer,
    ElectorSerializer,
)


logger = logging.getLogger(__name__)


class ElectorViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    """
    Elector CRUD operations plus helper endpoints.

    Includes:
      * list / create / retrieve / update / delete
      * search, statistics, filter options
      * import_csv / export
      * relationships (family + work)
    """

    queryset = Elector.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = "koc_id"

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = [
        "committee",
        "gender",
        "is_active",
        "is_approved",
        "area",
        "department",
        "team",
        "section",
        "name_first",
        "name_second",
        "name_third",
        "name_fourth",
        "sub_family_name",
        "family_name",
    ]
    search_fields = [
        "koc_id",
        "name_first",
        "name_second",
        "name_third",
        "family_name",
        "sub_family_name",
        "mobile",
        "section",
        "designation",
        "department",
        "team",
    ]
    ordering_fields = ["koc_id", "name_first", "family_name", "created_at"]
    ordering = ["name_first", "family_name"]

    def get_serializer_class(self):
        if self.action == "list":
            return ElectorListSerializer
        if self.action == "create":
            return ElectorCreateSerializer
        if self.action == "search":
            return ElectorSearchSerializer
        return ElectorSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy", "import_csv", "export", "approve", "bulk_approve"]:
            return [IsAuthenticated(), IsAdminOrAbove()]
        return [IsAuthenticated()]

    def get_queryset(self):
        return Elector.objects.select_related("committee", "created_by").filter(is_active=True)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, is_approved=False)

    # ------------------------------------------------------------------
    # List endpoint with include support
    # ------------------------------------------------------------------
    def list(self, request, *args, **kwargs):
        include_params = [p.strip() for p in request.query_params.get("include", "").split(",") if p.strip()]
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page if page is not None else queryset, many=True)

        data: Dict[str, Any] = {"electors": serializer.data}
        if "groups" in include_params:
            from apps.guarantees.models import GuaranteeGroup
            from apps.guarantees.serializers import GuaranteeGroupSerializer

            groups = GuaranteeGroup.objects.filter(user=request.user).order_by("order")
            data["groups"] = GuaranteeGroupSerializer(groups, many=True).data

        if "committees" in include_params:
            from apps.elections.models import Committee
            from apps.elections.serializers import CommitteeSerializer

            # Limit to prevent unbounded queries (committees are typically < 100)
            committees = Committee.objects.all().order_by("code")[:100]
            data["committees"] = CommitteeSerializer(committees, many=True).data

        meta = {"includes": include_params}
        if page is not None:
            meta["pagination"] = {
                "count": self.paginator.page.paginator.count,
                "next": self.paginator.get_next_link(),
                "previous": self.paginator.get_previous_link(),
            }
        return APIResponse.success(data=data, meta=meta)

    # ------------------------------------------------------------------
    # Relationship helpers
    # ------------------------------------------------------------------
    @staticmethod
    def _serialize_person(elector: Elector, guarantee_status: str = None) -> Dict[str, Any]:
        """
        Serialize elector person data.
        
        Args:
            elector: Elector instance (should have committee prefetched via select_related)
            guarantee_status: Optional pre-fetched guarantee status to avoid N+1 query
        """
        # Only query guarantee if not provided (backward compatibility)
        if guarantee_status is None:
            from apps.guarantees.models import Guarantee
            guarantee_status = Guarantee.objects.filter(elector=elector).values_list("guarantee_status", flat=True).first()
        
        return {
            "kocId": elector.koc_id,
            "fullName": elector.full_name,
            "mobile": elector.mobile,
            "section": elector.section,
            "department": elector.department,
            "team": elector.team,
            "committee": elector.committee.code if elector.committee else None,
            "isGuarantee": guarantee_status is not None,
            "guaranteeStatus": guarantee_status,
        }

    def _build_family_relations(self, elector: Elector) -> List[Dict[str, Any]]:
        """
        Build family relations with optimized queries.
        Uses select_related to prevent N+1 queries when accessing committee.
        Prefetches guarantees to avoid N+1 queries in _serialize_person.
        """
        from apps.guarantees.models import Guarantee
        
        relations: List[Dict[str, Any]] = []
        all_related_electors = []

        if elector.name_second and elector.name_third:
            brothers_q = Q(name_second=elector.name_second, name_third=elector.name_third)
            brothers_q &= Q(name_fourth=elector.name_fourth) if elector.name_fourth else Q(family_name=elector.family_name)
            brothers = list(Elector.objects.select_related('committee').filter(brothers_q).exclude(koc_id=elector.koc_id)[:10])
            all_related_electors.extend([(e, "BROTHER") for e in brothers])

        if elector.name_second and elector.name_third and elector.family_name:
            fathers = list(Elector.objects.select_related('committee').filter(
                name_first=elector.name_second,
                name_second=elector.name_third,
                family_name=elector.family_name,
            ).exclude(koc_id=elector.koc_id))
            all_related_electors.extend([(e, "FATHER") for e in fathers])

        if elector.name_first and elector.name_second and elector.family_name:
            sons = list(Elector.objects.select_related('committee').filter(
                name_second=elector.name_first,
                name_third=elector.name_second,
                family_name=elector.family_name,
            ).exclude(koc_id=elector.koc_id))
            all_related_electors.extend([(e, "SON") for e in sons])

        if elector.name_third and elector.name_fourth:
            cousins_q = Q(name_third=elector.name_third, name_fourth=elector.name_fourth)
            cousins_q &= Q(name_fifth=elector.name_fifth) if elector.name_fifth else Q(family_name=elector.family_name)
            cousins_qs = Elector.objects.select_related('committee').filter(cousins_q).exclude(koc_id=elector.koc_id)
            if elector.name_second:
                cousins_qs = cousins_qs.exclude(name_second=elector.name_second)
            cousins = list(cousins_qs[:10])
            all_related_electors.extend([(e, "COUSIN") for e in cousins])

        # Prefetch guarantees for all related electors in a single query
        if all_related_electors:
            related_elector_ids = [e.koc_id for e, _ in all_related_electors]
            guarantees_map = {
                g.elector_id: g.guarantee_status
                for g in Guarantee.objects.filter(elector_id__in=related_elector_ids).only('elector_id', 'guarantee_status')
            }
            
            # Build relations with prefetched guarantee data
            for related_elector, relationship in all_related_electors:
                guarantee_status = guarantees_map.get(related_elector.koc_id)
                relations.append({
                    **self._serialize_person(related_elector, guarantee_status=guarantee_status),
                    "relationship": relationship
                })

        return relations

    @staticmethod
    def _paginate_queryset(queryset, request, prefix: str):
        """
        Paginate queryset and serialize results.
        Optimized: Prefetches guarantees to avoid N+1 queries.
        """
        from apps.guarantees.models import Guarantee
        
        try:
            page = int(request.query_params.get(f"{prefix}_page", 1))
        except (TypeError, ValueError):
            page = 1
        try:
            page_size = int(request.query_params.get(f"{prefix}_page_size", 10))
        except (TypeError, ValueError):
            page_size = 10

        page = max(page, 1)
        page_size = min(max(page_size, 1), 100)

        total = queryset.count()
        start = (page - 1) * page_size
        end = start + page_size
        
        # Get paginated electors
        electors = list(queryset.order_by("koc_id")[start:end])
        
        # Prefetch guarantees for all electors in a single query
        if electors:
            elector_ids = [e.koc_id for e in electors]
            guarantees_map = {
                g.elector_id: g.guarantee_status
                for g in Guarantee.objects.filter(elector_id__in=elector_ids).only('elector_id', 'guarantee_status')
            }
            
            # Serialize with prefetched guarantee data
            results = [
                ElectorViewSet._serialize_person(e, guarantee_status=guarantees_map.get(e.koc_id))
                for e in electors
            ]
        else:
            results = []

        return {
            "results": results,
            "pagination": {
                "count": total,
                "page": page,
                "pageSize": page_size,
                "hasNext": end < total,
                "hasPrevious": start > 0,
            },
        }

    @action(detail=True, methods=["get"], url_path="relationships")
    def get_relationships(self, request, koc_id=None):
        """
        New combined relationships response:
        data.relationships.{family,sameDepartment,sameTeam}
        """
        elector = self.get_object()
        same_department = (
            self._paginate_queryset(
                Elector.objects.select_related('committee').filter(department=elector.department, is_active=True).exclude(koc_id=elector.koc_id),
                request,
                "department",
            )
            if elector.department
            else {"results": [], "pagination": {"count": 0, "page": 1, "pageSize": 10, "hasNext": False, "hasPrevious": False}}
        )

        same_team = (
            self._paginate_queryset(
                Elector.objects.select_related('committee').filter(team=elector.team, is_active=True).exclude(koc_id=elector.koc_id),
                request,
                "team",
            )
            if elector.team
            else {"results": [], "pagination": {"count": 0, "page": 1, "pageSize": 10, "hasNext": False, "hasPrevious": False}}
        )

        return APIResponse.success(
            data={
                "family": self._build_family_relations(elector),
                "sameDepartment": same_department,
                "sameTeam": same_team,
            },
            message="Relationships retrieved successfully",
        )

    @action(detail=True, methods=["get"], url_path="relatives")
    def get_relatives(self, request, koc_id=None):
        """Legacy family-only response used by older screens."""
        elector = self.get_object()
        return APIResponse.success(data=self._build_family_relations(elector), message="Relatives retrieved successfully")

    @action(detail=True, methods=["get"], url_path="work_colleagues")
    def get_work_colleagues(self, request, koc_id=None):
        elector = self.get_object()

        def serialize_with_area(e):
            data = self._serialize_person(e)
            data["area"] = e.area
            return data

        same_area = []
        if elector.area:
            qs = Elector.objects.select_related('committee').filter(area=elector.area, is_active=True).exclude(koc_id=elector.koc_id)
            same_area = [serialize_with_area(e) for e in qs[:100]]  # Add limit to prevent memory issues

        same_department = []
        if elector.department:
            qs = Elector.objects.select_related('committee').filter(department=elector.department, is_active=True).exclude(koc_id=elector.koc_id)
            same_department = [serialize_with_area(e) for e in qs[:100]]  # Add limit to prevent memory issues

        same_team = []
        if elector.team:
            qs = Elector.objects.select_related('committee').filter(team=elector.team, is_active=True).exclude(koc_id=elector.koc_id)
            same_team = [serialize_with_area(e) for e in qs[:100]]  # Add limit to prevent memory issues

        return APIResponse.success(
            data={"same_area": same_area, "same_department": same_department, "same_team": same_team},
            message="Work colleagues retrieved successfully",
        )

    # ------------------------------------------------------------------
    # Admin helpers
    # ------------------------------------------------------------------
    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsAdminOrAbove])
    def approve(self, request, koc_id=None):
        elector = self.get_object()
        elector.is_approved = True
        elector.save(update_fields=["is_approved"])
        return APIResponse.success(data=self.get_serializer(elector).data, message=f"{elector.full_name} approved")

    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated, IsAdminOrAbove])
    def bulk_approve(self, request):
        koc_ids = request.data.get("koc_ids", [])
        if not koc_ids:
            return APIResponse.error(message="koc_ids required", status_code=status.HTTP_400_BAD_REQUEST)
        updated = Elector.objects.filter(koc_id__in=koc_ids).update(is_approved=True)
        return APIResponse.success(data={"approved_count": updated}, message=f"{updated} approved")

    @action(detail=False, methods=["get"])
    def pending(self, request):
        queryset = self.get_queryset().filter(is_approved=False)
        page = self.paginate_queryset(self.filter_queryset(queryset))
        if page is not None:
            return self.get_paginated_response(ElectorListSerializer(page, many=True).data)
        return APIResponse.success(data=ElectorListSerializer(queryset, many=True).data)

    @action(detail=False, methods=["get"])
    def search(self, request):
        queryset = self.get_queryset()
        params = request.query_params

        if params.get("koc_id"):
            queryset = queryset.filter(koc_id__icontains=params["koc_id"])

        if params.get("name"):
            name_query = params["name"]
            queryset = queryset.filter(
                Q(name_first__icontains=name_query)
                | Q(name_second__icontains=name_query)
                | Q(name_third__icontains=name_query)
                | Q(name_fourth__icontains=name_query)
                | Q(name_fifth__icontains=name_query)
                | Q(name_sixth__icontains=name_query)
                | Q(sub_family_name__icontains=name_query)
                | Q(family_name__icontains=name_query)
            )

        optional_filters = [
            "family_name",
            "designation",
            "section",
            "location",
            "mobile",
            "area",
            "department",
            "team",
        ]
        for field in optional_filters:
            value = params.get(field)
            if value:
                queryset = queryset.filter(**{f"{field}__icontains": value})

        committee_value = params.get("committee")
        if committee_value:
            queryset = queryset.filter(committee__code__icontains=committee_value)

        gender_value = params.get("gender")
        if gender_value:
            queryset = queryset.filter(gender=gender_value)

        page = self.paginate_queryset(queryset)
        serializer = ElectorSerializer(page if page is not None else queryset, many=True)
        meta = None
        if page is not None:
            paginated_response = self.get_paginated_response(serializer.data)
            meta = {
                "pagination": {
                    "count": paginated_response.data.get("count"),
                    "next": paginated_response.data.get("next"),
                    "previous": paginated_response.data.get("previous"),
                }
            }
        return APIResponse.success(data=serializer.data, meta=meta)

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[IsAuthenticated, IsAdminOrAbove],
        parser_classes=[MultiPartParser, FormParser],
    )
    @transaction.atomic
    def import_csv(self, request):
        csv_file = request.FILES.get("file")
        if not csv_file:
            return APIResponse.error(message="No file provided. Please upload a CSV file.", status_code=status.HTTP_400_BAD_REQUEST)
        if not csv_file.name.endswith(".csv"):
            return APIResponse.error(message="Invalid file type. Please upload a CSV file.", status_code=status.HTTP_400_BAD_REQUEST)

        update_existing = request.data.get("update_existing", "false").lower() == "true"
        file_content = csv_file.read()

        import_service = ElectorImportService()
        results = import_service.import_electors(file_content, update_existing)

        if results.get("success"):
            return APIResponse.success(data={"results": results}, message="Import completed successfully")
        return APIResponse.error(
            message="Import completed with errors",
            errors={"results": results},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    @action(detail=False, methods=["get"])
    def filter_options(self, request):
        areas = (
            Elector.objects.filter(is_active=True, area__isnull=False)
            .exclude(area="")
            .values_list("area", flat=True)
            .distinct()
            .order_by("area")
        )
        departments = (
            Elector.objects.filter(is_active=True, department__isnull=False)
            .exclude(department="")
            .values_list("department", flat=True)
            .distinct()
            .order_by("department")
        )
        teams = (
            Elector.objects.filter(is_active=True, team__isnull=False)
            .exclude(team="")
            .values_list("team", flat=True)
            .distinct()
            .order_by("team")
        )
        return APIResponse.success(data={"areas": list(areas), "departments": list(departments), "teams": list(teams)})

    @action(detail=False, methods=["get"])
    def statistics(self, request):
        total = Elector.objects.filter(is_active=True).count()
        gender_stats = Elector.objects.filter(is_active=True).values("gender").annotate(count=Count("koc_id"))
        committee_stats = (
            Elector.objects.filter(is_active=True)
            .values("committee__code", "committee__name")
            .annotate(count=Count("koc_id"))
            .order_by("-count")
        )
        department_stats = (
            Elector.objects.filter(is_active=True, department__isnull=False)
            .exclude(department="")
            .values("department")
            .annotate(count=Count("koc_id"))
            .order_by("-count")[:10]
        )
        team_stats = (
            Elector.objects.filter(is_active=True, team__isnull=False)
            .exclude(team="")
            .values("team")
            .annotate(count=Count("koc_id"))
            .order_by("-count")[:10]
        )

        return APIResponse.success(
            data={
                "total_electors": total,
                "by_gender": list(gender_stats),
                "by_committee": list(committee_stats),
                "top_departments": list(department_stats),
                "top_teams": list(team_stats),
            }
        )

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated, IsAdminOrAbove])
    def export(self, request):
        import csv

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="electors.csv"'
        writer = csv.writer(response)
        writer.writerow(
            [
                "KOC ID",
                "Full Name",
                "First Name",
                "Last Name",
                "Family Name",
                "Designation",
                "Section",
                "Location",
                "Extension",
                "Mobile",
                "Area",
                "Department",
                "Team",
                "Committee Code",
                "Gender",
                "Active",
            ]
        )

        row_count = 0
        electors = (
            Elector.objects.select_related("committee")
            .filter(is_active=True)
            .iterator(chunk_size=1000)
        )
        for elector in electors:
            writer.writerow(
                [
                    elector.koc_id,
                    elector.full_name,
                    elector.name_first,
                    elector.family_name,
                    elector.sub_family_name,
                    elector.designation,
                    elector.section,
                    elector.location,
                    elector.extension,
                    elector.mobile,
                    elector.area,
                    elector.department,
                    elector.team,
                    elector.committee.code if elector.committee else "",
                    elector.gender,
                    "Yes" if elector.is_active else "No",
                ]
            )
            row_count += 1

        logger.info("Elector CSV export completed with %s active electors.", row_count)

        return response
