import json

import pytest
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate
from django.http import QueryDict
from django.utils import timezone
from django.urls import reverse

from apps.electors.models import Elector
from apps.guarantees.models import Guarantee
from apps.elections.models import Election, Committee
from apps.elections.views import CommitteeViewSet
from apps.voting.models import ElectionResults
from apps.candidates.models import Party, Candidate


pytestmark = pytest.mark.django_db


def _create_election(admin_client, name="Integration Election"):
    payload = {
        "name": name,
        "description": "Integration test election",
        "voting_mode": "BOTH",
        "status": "SETUP"
    }
    response = admin_client.post("/api/elections/", payload)
    assert response.status_code == status.HTTP_201_CREATED
    return response.data["data"]["id"]


def _create_committee(admin_client, election_id, code="C001", name="Integration Committee"):
    payload = {
        "election": election_id,
        "code": code,
        "name": name,
        "gender": "MALE"
    }
    response = admin_client.post("/api/elections/committees/", payload)
    assert response.status_code == status.HTTP_201_CREATED
    return response.data["data"]["id"]


def _create_elector(admin_client, committee_id, koc_id="900001"):
    payload = {
        "koc_id": koc_id,
        "name_first": "Integration",
        "family_name": "Tester",
        "gender": "MALE",
        "committee": committee_id,
        "mobile": "99999999"
    }
    response = admin_client.post("/api/electors/", payload)
    assert response.status_code == status.HTTP_201_CREATED
    return koc_id


def test_guarantee_collection_flow(admin_client, regular_client):
    """Validate the end-to-end guarantee creation flow across apps."""
    election_id = _create_election(admin_client)
    committee_id = _create_committee(admin_client, election_id, code="C-INTEG")
    koc_id = _create_elector(admin_client, committee_id, koc_id="900001")
    assert Elector.objects.filter(koc_id=koc_id).exists()

    guarantee_resp = regular_client.post(
        "/api/guarantees/",
        {
            "elector": koc_id,
            "guarantee_status": "GUARANTEED",
            "mobile": "12345678"
        }
    )
    assert guarantee_resp.status_code == status.HTTP_201_CREATED
    assert Guarantee.objects.filter(user__email="user.integration@example.com").count() == 1

    guarantee_list_resp = regular_client.get("/api/guarantees/")
    assert guarantee_list_resp.status_code == status.HTTP_200_OK
    list_data = guarantee_list_resp.data["data"]
    assert len(list_data["guarantees"]) == 1
    assert list_data["statistics"]["total_guarantees"] == 1

    stats_resp = regular_client.get("/api/guarantees/statistics/")
    assert stats_resp.status_code == status.HTTP_200_OK
    assert stats_resp.data["data"]["total_guarantees"] == 1

    search_resp = regular_client.get("/api/guarantees/search-elector/", {"query": "Tester"})
    assert search_resp.status_code == status.HTTP_200_OK
    assert "data" in search_resp.data


def test_committee_user_assignment_flow(admin_client, admin_user, regular_user):
    election_id = _create_election(admin_client, name="Assignment Election")
    committee_id = _create_committee(admin_client, election_id, code="C-ASSIGN", name="Assignment Committee")

    election_assign_url = reverse("elections:election-assign-users", kwargs={"pk": election_id})
    assign_payload = {"user_ids": [regular_user.id], "userIds": [regular_user.id]}
    assign_resp = admin_client.post(election_assign_url, assign_payload, format="json")
    assert assign_resp.status_code == status.HTTP_200_OK, assign_resp.data
    election = Election.objects.get(id=election_id)
    assert election.members.filter(id=regular_user.id).exists()

    committee_assign_url = reverse("elections:election-committee-assign-users", kwargs={"pk": committee_id})
    factory = APIRequestFactory()
    from django.http import QueryDict

    committee_payload = QueryDict(mutable=True)
    committee_payload.setlist("userIds", [str(regular_user.id)])
    committee_request = factory.post(
        committee_assign_url,
        committee_payload,
        format="multipart"
    )
    force_authenticate(committee_request, user=admin_user)
    committee_view = CommitteeViewSet.as_view({"post": "assign_users"})
    committee_response = committee_view(committee_request, pk=committee_id)
    assert committee_response.status_code == status.HTTP_200_OK
    committee = Committee.objects.get(id=committee_id)
    assert committee.assigned_users.filter(id=regular_user.id).exists()


def test_elector_approval_flow(admin_client):
    election_id = _create_election(admin_client, name="Approval Election")
    committee_id = _create_committee(admin_client, election_id, code="C-APPROVE", name="Approval Committee")

    koc_primary = _create_elector(admin_client, committee_id, koc_id="910001")
    assert Elector.objects.filter(koc_id=koc_primary).exists()
    assert list(Elector.objects.values_list("koc_id", flat=True)) == [koc_primary]
    Elector.objects.filter(koc_id=koc_primary).update(is_active=True, is_approved=False)
    elector = Elector.objects.get(koc_id=koc_primary)
    assert elector.is_active is True

    bulk_url = reverse("electors:elector-bulk-approve")
    approve_resp = admin_client.post(bulk_url, {"koc_ids": [koc_primary]}, format="json")
    assert approve_resp.status_code == status.HTTP_200_OK, approve_resp.data
    assert Elector.objects.get(koc_id=koc_primary).is_approved

    bulk_ids = []
    for idx in range(2, 4):
        koc_id = f"91000{idx}"
        _create_elector(admin_client, committee_id, koc_id=koc_id)
        Elector.objects.filter(koc_id=koc_id).update(is_active=True, is_approved=False)
        bulk_ids.append(koc_id)

    bulk_resp = admin_client.post(bulk_url, {"koc_ids": bulk_ids}, format="json")
    assert bulk_resp.status_code == status.HTTP_200_OK, bulk_resp.data
    assert Elector.objects.filter(koc_id__in=bulk_ids, is_approved=True).count() == len(bulk_ids)


def test_voting_results_summary_flow(admin_client, admin_user):
    election_id = _create_election(admin_client, name="Results Election")
    election = Election.objects.get(id=election_id)

    party = Party.objects.create(election=election, name="Unity Party")
    candidate_one = Candidate.objects.create(
        election=election,
        name="Candidate One",
        candidate_number=1,
        party=party
    )
    candidate_two = Candidate.objects.create(
        election=election,
        name="Candidate Two",
        candidate_number=2,
        party=party
    )

    ElectionResults.objects.create(
        election=election,
        status="PUBLISHED",
        total_registered_electors=2000,
        total_attendance=1500,
        total_ballots_cast=1500,
        total_valid_ballots=1400,
        total_invalid_ballots=100,
        turnout_percentage=75.0,
        results_data={
            "candidates": [
                {"name": candidate_one.name, "candidate_number": candidate_one.candidate_number, "votes": 800},
                {"name": candidate_two.name, "candidate_number": candidate_two.candidate_number, "votes": 600},
            ]
        },
        generated_by=admin_user,
        generated_at=timezone.now(),
        published_by=admin_user,
        published_at=timezone.now(),
    )

    summary_resp = admin_client.get("/api/voting/results/summary/")
    assert summary_resp.status_code == status.HTTP_200_OK
    summary_data = summary_resp.data["data"]
    assert summary_data["total_candidates"] == 2
    assert summary_data["winners"][0]["votes"] == 800

