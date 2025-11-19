"""
Model tests for voting-related aggregates.
"""
import pytest
from django.core.exceptions import ValidationError

from apps.voting.models import VoteCount, CommitteeVoteEntry, ElectionResults
from apps.candidates.models import Candidate
from apps.attendees.models import Attendance


@pytest.mark.unit
@pytest.mark.django_db
def test_vote_count_str_and_defaults(admin_user, election, committee, candidate_factory, elector_factory):
    """VoteCount stores defaults and string repr."""
    elector_factory()
    candidate = candidate_factory(1)

    vote = VoteCount.objects.create(
        election=election,
        committee=committee,
        candidate=candidate,
        vote_count=42,
        entered_by=admin_user,
    )

    assert str(committee.code) in str(vote)
    assert vote.status == 'DRAFT'
    assert vote.is_verified is False


@pytest.mark.unit
@pytest.mark.django_db
def test_vote_count_clean_validations(election, committee, candidate_factory, elector_factory):
    """VoteCount.clean enforces non-negative values and committee cap."""
    candidate = candidate_factory(1)
    elector_factory()

    negative_vote = VoteCount(
        election=election,
        committee=committee,
        candidate=candidate,
        vote_count=-1,
    )
    with pytest.raises(ValidationError):
        negative_vote.clean()

    # Committee has only one active elector; vote count above that should fail.
    too_many_votes = VoteCount(
        election=election,
        committee=committee,
        candidate=candidate,
        vote_count=5,
    )
    with pytest.raises(ValidationError):
        too_many_votes.clean()


@pytest.mark.unit
@pytest.mark.django_db
def test_vote_count_verify_sets_metadata(admin_user, election, committee, candidate_factory, elector_factory):
    """verify() should mark records as verified with metadata."""
    elector_factory()
    candidate = candidate_factory(2)
    vote = VoteCount.objects.create(
        election=election,
        committee=committee,
        candidate=candidate,
        vote_count=10,
        entered_by=admin_user,
    )

    vote.verify(admin_user)
    vote.refresh_from_db()

    assert vote.is_verified is True
    assert vote.status == 'VERIFIED'
    assert vote.verified_by == admin_user
    assert vote.verified_at is not None


@pytest.mark.unit
@pytest.mark.django_db
def test_committee_vote_entry_completion_percentage(admin_user, election, committee, candidate_factory, elector_factory):
    """Completion percentage divides entered vote counts by active candidates."""
    elector_factory()
    candidate_one = candidate_factory(1)
    candidate_two = candidate_factory(2)

    entry = CommitteeVoteEntry.objects.create(
        election=election,
        committee=committee,
        entered_by=admin_user,
    )

    VoteCount.objects.create(
        election=election,
        committee=committee,
        candidate=candidate_one,
        vote_count=5,
    )

    assert entry.completion_percentage == 50.0  # 1 of 2 candidates recorded


@pytest.mark.unit
@pytest.mark.django_db
def test_committee_vote_entry_complete_and_verify(admin_user, election, committee):
    """CommitteeVoteEntry transitions set timestamps."""
    entry = CommitteeVoteEntry.objects.create(
        election=election,
        committee=committee,
        entered_by=admin_user,
        total_ballots_cast=100,
        valid_ballots=95,
        invalid_ballots=5,
    )

    entry.complete()
    entry.refresh_from_db()
    assert entry.status == 'COMPLETED'
    assert entry.completed_at is not None

    entry.verify(admin_user)
    entry.refresh_from_db()
    assert entry.status == 'VERIFIED'
    assert entry.verified_by == admin_user
    assert entry.verified_at is not None


@pytest.mark.unit
@pytest.mark.django_db
def test_election_results_generate_results(admin_user, election, committee, candidate_factory, elector_factory):
    """ElectionResults.generate_results aggregates verified data."""
    elector_one = elector_factory()
    elector_two = elector_factory()
    elector_three = elector_factory()

    Attendance.objects.create(
        elector=elector_one,
        committee=committee,
        marked_by=admin_user,
    )
    Attendance.objects.create(
        elector=elector_two,
        committee=committee,
        marked_by=admin_user,
    )
    Attendance.objects.create(
        elector=elector_three,
        committee=committee,
        marked_by=admin_user,
    )

    entry = CommitteeVoteEntry.objects.create(
        election=election,
        committee=committee,
        status='VERIFIED',
        total_ballots_cast=3,
        valid_ballots=3,
        invalid_ballots=0,
        entered_by=admin_user,
    )

    candidate_one = candidate_factory(1, 'Alice')
    candidate_two = candidate_factory(2, 'Bob')

    VoteCount.objects.create(
        election=election,
        committee=committee,
        candidate=candidate_one,
        vote_count=2,
        status='VERIFIED',
        is_verified=True,
    )
    VoteCount.objects.create(
        election=election,
        committee=committee,
        candidate=candidate_two,
        vote_count=1,
        status='VERIFIED',
        is_verified=True,
    )

    results = ElectionResults.objects.create(
        election=election,
        generated_by=admin_user,
        status='DRAFT',
    )

    results.generate_results()
    results.refresh_from_db()

    assert results.status == 'PRELIMINARY'
    assert results.total_registered_electors == 3
    assert results.total_attendance == 3
    assert results.total_ballots_cast == entry.total_ballots_cast
    assert results.total_valid_ballots == entry.valid_ballots
    assert results.turnout_percentage == 100.0
    assert results.results_data['summary']['total_candidates'] == 2
    assert results.results_data['candidates'][0]['candidate_name'] == 'Alice'

