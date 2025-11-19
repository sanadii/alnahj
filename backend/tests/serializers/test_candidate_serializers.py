"""
Unit tests for candidate and party serializers.
"""
import pytest
from rest_framework import status
from rest_framework.test import APIRequestFactory

from apps.candidates.models import Party, Candidate
from apps.candidates.serializers import (
    PartySerializer,
    PartyListSerializer,
    PartyCreateSerializer,
    CandidateSerializer,
    CandidateListSerializer,
    CandidateCreateSerializer,
)
from apps.elections.models import Election
from apps.voting.models import VoteCount


@pytest.mark.unit
@pytest.mark.django_db
class TestPartySerializers:
    """Test party serializer behaviours."""

    @pytest.fixture
    def election(self, django_user_model):
        user = django_user_model.objects.create_user(
            email="admin@example.com",
            password="testpass123",
            role="ADMIN",
        )
        return Election.objects.create(name="Serializer Election", created_by=user)

    @pytest.fixture
    def party(self, election):
        return Party.objects.create(
            election=election,
            name="Unity Party",
            color="#123456",
            description="Unit tests",
        )

    def test_party_serializer_representation_includes_candidate_count(self, party):
        factory = APIRequestFactory()
        request = factory.get("/")
        party._candidate_count = 5  # annotation simulation

        serializer = PartySerializer(party, context={"request": request})
        data = serializer.data

        assert data["candidate_count"] == 5
        assert data["name"] == "Unity Party"

    def test_party_list_serializer_fallback_candidate_count(self, party):
        serializer = PartyListSerializer(party, context={"request": None})
        data = serializer.data
        # No candidates exist, expect count fallback to zero
        assert data["candidate_count"] == 0

    def test_party_create_serializer_normalizes_color(self, election):
        serializer = PartyCreateSerializer(
            data={
                "election": election.id,
                "name": "Growth Party",
                "color": "ABC",
            }
        )
        assert serializer.is_valid(), serializer.errors
        party = serializer.save()
        assert party.color == "#ABC"

    def test_party_create_serializer_invalid_color_length(self, election):
        serializer = PartyCreateSerializer(
            data={
                "election": election.id,
                "name": "Invalid Party",
                "color": "#12",
            }
        )
        assert not serializer.is_valid()
        assert "color" in serializer.errors


@pytest.mark.unit
@pytest.mark.django_db
class TestCandidateSerializers:
    """Test candidate serializer behaviours."""

    @pytest.fixture
    def election(self, django_user_model):
        user = django_user_model.objects.create_user(
            email="admin@example.com",
            password="testpass123",
            role="ADMIN",
        )
        return Election.objects.create(name="Serializer Election", created_by=user)

    @pytest.fixture
    def party(self, election):
        return Party.objects.create(election=election, name="Unity Party")

    def test_candidate_serializer_includes_party_metadata(self, election, party, django_user_model):
        candidate = Candidate.objects.create(
            election=election,
            name="Jane Candidate",
            candidate_number=5,
            party=party,
        )
        other_candidate = Candidate.objects.create(
            election=election,
            name="Opponent",
            candidate_number=6,
            party=party,
        )
        committee_count = 1
        factory = APIRequestFactory()
        request = factory.get("/")

        # Add verified vote counts
        VoteCount.objects.create(
            election=election,
            committee=election.committees.create(code="C001", name="Central Committee"),
            candidate=candidate,
            vote_count=300,
            status="VERIFIED",
            is_verified=True,
            entered_by=django_user_model.objects.create_user(email="clerk@example.com", password="pass123", role="SUPERVISOR"),
        )
        VoteCount.objects.create(
            election=election,
            committee=election.committees.first(),
            candidate=other_candidate,
            vote_count=200,
            status="VERIFIED",
            is_verified=True,
        )

        serializer = CandidateSerializer(candidate, context={"request": request})
        data = serializer.data

        assert data["party_name"] == "Unity Party"
        assert data["total_votes"] == candidate.total_votes
        assert data["vote_percentage"] == candidate.vote_percentage
        assert data["is_active"] is True

    def test_candidate_list_serializer_party_name(self, election, party):
        candidate = Candidate.objects.create(
            election=election,
            name="List Candidate",
            candidate_number=10,
            party=party,
        )
        serializer = CandidateListSerializer(candidate, context={"request": None})
        data = serializer.data
        assert data["party_name"] == "Unity Party"

    def test_candidate_create_serializer_validates_positive_number(self, election):
        serializer = CandidateCreateSerializer(
            data={
                "election": election.id,
                "name": "Invalid",
                "candidate_number": 0,
            }
        )
        assert not serializer.is_valid()
        assert "candidate_number" in serializer.errors

    def test_candidate_create_serializer_unique_number_per_election(self, election):
        Candidate.objects.create(
            election=election,
            name="Original",
            candidate_number=3,
        )
        serializer = CandidateCreateSerializer(
            data={
                "election": election.id,
                "name": "Duplicate",
                "candidate_number": 3,
            }
        )
        assert not serializer.is_valid()
        assert "non_field_errors" in serializer.errors

