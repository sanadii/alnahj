"""
Serializer coverage for voting domain.
"""
import pytest

from apps.voting.models import VoteCount, CommitteeVoteEntry, ElectionResults
from apps.voting.serializers import (
    VoteCountSerializer,
    VoteCountCreateSerializer,
    CommitteeVoteEntrySerializer,
    ElectionResultsSerializer,
)
from apps.candidates.models import Candidate


@pytest.fixture
def user(admin_user):
    return admin_user


@pytest.fixture
def candidate(election):
    return Candidate.objects.create(
        election=election,
        name='Serializer Candidate',
        candidate_number=10,
    )


@pytest.mark.unit
@pytest.mark.django_db
def test_vote_count_serializer_includes_metadata(user, election, committee, candidate):
    """VoteCountSerializer exposes derived fields."""
    vote = VoteCount.objects.create(
        election=election,
        committee=committee,
        candidate=candidate,
        vote_count=7,
        entered_by=user,
        verified_by=user,
        status='VERIFIED',
        is_verified=True,
    )

    data = VoteCountSerializer(vote).data

    assert data['committee_code'] == committee.code
    assert data['candidate_number'] == candidate.candidate_number
    assert data['entered_by_name'] == user.full_name
    assert data['verified_by_name'] == user.full_name
    assert data['status_display'] == 'Verified'


@pytest.mark.unit
@pytest.mark.django_db
def test_vote_count_create_serializer_validation(election, committee, candidate, elector_factory):
    """VoteCountCreateSerializer enforces vote limits."""
    elector_factory(committee=committee)

    valid_payload = {
        'election': election.pk,
        'committee': committee.pk,
        'candidate': candidate.pk,
        'vote_count': 1,
        'notes': '',
    }
    serializer = VoteCountCreateSerializer(data=valid_payload)
    assert serializer.is_valid(), serializer.errors

    invalid_payload = {**valid_payload, 'vote_count': 99}
    serializer = VoteCountCreateSerializer(data=invalid_payload)
    assert serializer.is_valid() is False
    assert 'vote_count' in serializer.errors


@pytest.mark.unit
@pytest.mark.django_db
def test_committee_vote_entry_serializer(user, election, committee, candidate, elector_factory):
    """CommitteeVoteEntrySerializer exposes names and completion rate."""
    elector_factory(committee=committee)
    VoteCount.objects.create(
        election=election,
        committee=committee,
        candidate=candidate,
        vote_count=3,
    )

    entry = CommitteeVoteEntry.objects.create(
        election=election,
        committee=committee,
        status='VERIFIED',
        entered_by=user,
        verified_by=user,
        total_ballots_cast=3,
        valid_ballots=3,
        invalid_ballots=0,
    )

    data = CommitteeVoteEntrySerializer(entry).data
    assert data['committee_code'] == committee.code
    assert data['entered_by_name'] == user.full_name
    assert data['verified_by_name'] == user.full_name
    assert isinstance(data['completion_percentage'], float)


@pytest.mark.unit
@pytest.mark.django_db
def test_election_results_serializer_labels(user, election):
    """ElectionResultsSerializer returns generated/published metadata."""
    results = ElectionResults.objects.create(
        election=election,
        status='PRELIMINARY',
        generated_by=user,
        published_by=user,
        total_registered_electors=5,
        total_attendance=3,
    )

    data = ElectionResultsSerializer(results).data
    assert data['election_name'] == election.name
    assert data['generated_by_name'] == user.full_name
    assert data['published_by_name'] == user.full_name
    assert data['status_display'] == 'Preliminary'

