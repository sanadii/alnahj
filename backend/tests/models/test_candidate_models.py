"""
Unit tests for candidate and party models.
"""
import pytest
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

from apps.elections.models import Election, Committee
from apps.candidates.models import Party, Candidate
from apps.voting.models import VoteCount


User = get_user_model()


@pytest.mark.unit
@pytest.mark.django_db
class TestPartyModel:
    """Test Party model behaviour."""

    @pytest.fixture
    def user(self, django_user_model):
        return django_user_model.objects.create_user(
            email="admin@example.com",
            password="testpass123",
            role="ADMIN",
        )

    @pytest.fixture
    def election(self, user):
        return Election.objects.create(name="General Election", created_by=user)

    def test_create_party(self, election):
        party = Party.objects.create(
            election=election,
            name="Unity Party",
            color="#112233",
            description="Integration focused party",
        )

        assert party.election == election
        assert party.name == "Unity Party"
        assert party.color == "#112233"
        assert party.is_active is True
        assert str(party) == "Unity Party"

    def test_default_color(self, election):
        party = Party.objects.create(election=election, name="Independents")
        assert party.color == "#000000"

    def test_candidate_count_property(self, election):
        party = Party.objects.create(election=election, name="Growth Party")
        Candidate.objects.create(
            election=election,
            name="Candidate One",
            candidate_number=1,
            party=party,
        )
        Candidate.objects.create(
            election=election,
            name="Candidate Two",
            candidate_number=2,
            party=party,
            is_active=False,
        )

        assert party.candidate_count == 1  # only active candidates counted


@pytest.mark.unit
@pytest.mark.django_db
class TestCandidateModel:
    """Test Candidate model behaviour."""

    @pytest.fixture
    def user(self, django_user_model):
        return django_user_model.objects.create_user(
            email="admin@example.com",
            password="testpass123",
            role="ADMIN",
        )

    @pytest.fixture
    def election(self, user):
        return Election.objects.create(name="General Election", created_by=user)

    @pytest.fixture
    def committee(self, election):
        return Committee.objects.create(
            election=election,
            code="C001",
            name="Central Committee",
        )

    @pytest.fixture
    def party(self, election):
        return Party.objects.create(election=election, name="Unity Party")

    def test_create_candidate(self, election, party):
        candidate = Candidate.objects.create(
            election=election,
            name="Jane Doe",
            candidate_number=10,
            party=party,
        )

        assert candidate.election == election
        assert candidate.party == party
        assert str(candidate) == "#10 - Jane Doe"

    def test_candidate_number_must_be_positive(self, election):
        candidate = Candidate(
            election=election,
            name="Invalid Candidate",
            candidate_number=0,
        )
        with pytest.raises(ValidationError):
            candidate.full_clean()

    def test_total_votes_property_counts_verified_votes(self, election, committee, party, user):
        candidate = Candidate.objects.create(
            election=election,
            name="Vote Getter",
            candidate_number=7,
            party=party,
        )
        other_candidate = Candidate.objects.create(
            election=election,
            name="Opponent",
            candidate_number=8,
            party=party,
        )

        VoteCount.objects.create(
            election=election,
            committee=committee,
            candidate=candidate,
            vote_count=600,
            status="VERIFIED",
            is_verified=True,
            entered_by=user,
        )
        VoteCount.objects.create(
            election=election,
            committee=committee,
            candidate=other_candidate,
            vote_count=400,
            status="VERIFIED",
            is_verified=True,
            entered_by=user,
        )
        other_committee = Committee.objects.create(
            election=election,
            code="C002",
            name="Secondary Committee",
        )
        VoteCount.objects.create(  # unverified votes should be ignored
            election=election,
            committee=other_committee,
            candidate=candidate,
            vote_count=50,
            status="SUBMITTED",
            is_verified=False,
            entered_by=user,
        )

        assert candidate.total_votes == 600
        assert candidate.vote_percentage == 60.0
        assert other_candidate.vote_percentage == 40.0

