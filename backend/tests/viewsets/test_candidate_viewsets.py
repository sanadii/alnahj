"""
Unit tests for Candidate ViewSets.
"""
import pytest
from rest_framework.test import APIClient
from rest_framework import status

from apps.candidates.models import Party, Candidate
from apps.elections.models import Election
from apps.voting.models import VoteCount


@pytest.mark.unit
@pytest.mark.django_db
class TestPartyViewSet:
    """Test PartyViewSet CRUD and custom actions."""

    @pytest.fixture
    def admin_client(self, admin_user):
        client = APIClient()
        client.force_authenticate(user=admin_user)
        return client

    @pytest.fixture
    def user_client(self, regular_user):
        client = APIClient()
        client.force_authenticate(user=regular_user)
        return client

    @pytest.fixture
    def party(self, election):
        return Party.objects.create(
            election=election,
            name='Test Party',
            color='#FF5722',
            is_active=True,
        )

    def test_list_parties(self, admin_client, party):
        response = admin_client.get('/api/candidates/parties/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']) == 1

    def test_create_party_admin(self, admin_client, election):
        data = {
            'election': election.id,
            'name': 'New Party',
            'color': '#1976d2',
            'is_active': True,
        }
        response = admin_client.post('/api/candidates/parties/', data)
        assert response.status_code == status.HTTP_201_CREATED
        assert Party.objects.filter(name='New Party').exists()

    def test_create_party_regular_user_forbidden(self, user_client, election):
        data = {
            'election': election.id,
            'name': 'New Party',
            'color': '#1976d2',
        }
        response = user_client.post('/api/candidates/parties/', data)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_retrieve_party(self, admin_client, party):
        response = admin_client.get(f'/api/candidates/parties/{party.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['data']['name'] == 'Test Party'

    def test_update_party_admin(self, admin_client, party):
        data = {
            'election': party.election.id,
            'name': 'Updated Party',
            'color': '#FF5722',
            'is_active': True,
        }
        response = admin_client.put(f'/api/candidates/parties/{party.id}/', data)
        assert response.status_code == status.HTTP_200_OK
        party.refresh_from_db()
        assert party.name == 'Updated Party'

    def test_delete_party_admin(self, admin_client, party):
        response = admin_client.delete(f'/api/candidates/parties/{party.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert not Party.objects.filter(id=party.id).exists()

    def test_party_candidates_action(self, admin_client, party, candidate_factory):
        candidate_factory(election=party.election, party=party, candidate_number=1)
        candidate_factory(election=party.election, party=party, candidate_number=2)

        response = admin_client.get(f'/api/candidates/parties/{party.id}/candidates/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']['candidates']) == 2

    def test_party_statistics_action(self, admin_client, party, candidate_factory):
        candidate_factory(election=party.election, party=party, candidate_number=1)
        candidate_factory(election=party.election, candidate_number=2)

        response = admin_client.get('/api/candidates/parties/statistics/')
        assert response.status_code == status.HTTP_200_OK
        stats = response.data['data']
        assert stats['total_parties'] >= 1
        assert 'by_party' in stats

    def test_filter_parties_by_election(self, admin_client, election, party_factory):
        party_in_election = party_factory(election=election)
        other = Election.objects.create(
            name='Other Election',
            created_by=election.created_by,
            status='SETUP',
        )
        party_factory(election=other)

        response = admin_client.get(f'/api/candidates/parties/?election={election.id}')
        assert response.status_code == status.HTTP_200_OK
        ids = [p['id'] for p in response.data['data']]
        assert party_in_election.id in ids

    def test_search_parties_by_name(self, admin_client, party):
        response = admin_client.get('/api/candidates/parties/?search=Test')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']) == 1


@pytest.mark.unit
@pytest.mark.django_db
class TestCandidateViewSet:
    """Test CandidateViewSet CRUD and custom actions."""

    @pytest.fixture
    def admin_client(self, admin_user):
        client = APIClient()
        client.force_authenticate(user=admin_user)
        return client

    @pytest.fixture
    def user_client(self, regular_user):
        client = APIClient()
        client.force_authenticate(user=regular_user)
        return client

    @pytest.fixture
    def candidate(self, election, candidate_factory):
        return candidate_factory(election=election, candidate_number=1, name='Test Candidate')

    def test_list_candidates(self, admin_client, candidate):
        response = admin_client.get('/api/candidates/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']) == 1

    def test_create_candidate_admin(self, admin_client, election):
        data = {
            'election': election.id,
            'name': 'New Candidate',
            'candidate_number': 1,
            'is_active': True,
        }
        response = admin_client.post('/api/candidates/', data)
        assert response.status_code == status.HTTP_201_CREATED
        assert Candidate.objects.filter(name='New Candidate').exists()

    def test_create_candidate_regular_user_forbidden(self, user_client, election):
        data = {'election': election.id, 'name': 'New Candidate', 'candidate_number': 1}
        response = user_client.post('/api/candidates/', data)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_retrieve_candidate(self, admin_client, candidate):
        response = admin_client.get(f'/api/candidates/{candidate.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['data']['name'] == 'Test Candidate'

    def test_update_candidate_admin(self, admin_client, candidate):
        data = {
            'election': candidate.election.id,
            'name': 'Updated',
            'candidate_number': candidate.candidate_number,
            'is_active': True,
        }
        response = admin_client.put(f'/api/candidates/{candidate.id}/', data)
        assert response.status_code == status.HTTP_200_OK
        candidate.refresh_from_db()
        assert candidate.name == 'Updated'

    def test_partial_update_candidate_admin(self, admin_client, candidate):
        response = admin_client.patch(f'/api/candidates/{candidate.id}/', {'name': 'Partial'})
        assert response.status_code == status.HTTP_200_OK
        candidate.refresh_from_db()
        assert candidate.name == 'Partial'

    def test_delete_candidate_admin(self, admin_client, candidate):
        response = admin_client.delete(f'/api/candidates/{candidate.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert not Candidate.objects.filter(id=candidate.id).exists()

    def test_candidate_statistics_action(self, admin_client, election, candidate_factory, party_factory):
        party = party_factory(election=election)
        candidate_factory(election=election, party=party, candidate_number=1)
        candidate_factory(election=election, candidate_number=2)

        response = admin_client.get('/api/candidates/statistics/')
        assert response.status_code == status.HTTP_200_OK
        stats = response.data['data']
        assert 'total_candidates' in stats
        assert 'by_party' in stats

    def test_candidate_vote_counts_action(self, admin_client, candidate, supervisor_user, election, committee):
        VoteCount.objects.create(
            election=election,
            committee=committee,
            candidate=candidate,
            vote_count=100,
            entered_by=supervisor_user,
        )

        response = admin_client.get(f'/api/candidates/{candidate.id}/vote_counts/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']['vote_counts']) == 1
        assert response.data['data']['summary']['total_votes'] >= 100

    def test_filter_candidates_by_election(self, admin_client, election, candidate_factory):
        in_election = candidate_factory(election=election, candidate_number=1)
        other = Election.objects.create(
            name='Other Election',
            created_by=election.created_by,
            status='SETUP',
        )
        candidate_factory(election=other, candidate_number=1)

        response = admin_client.get(f'/api/candidates/?election={election.id}')
        assert response.status_code == status.HTTP_200_OK
        ids = [c['id'] for c in response.data['data']]
        assert in_election.id in ids

    def test_filter_candidates_by_party(self, admin_client, election, party_factory, candidate_factory):
        party = party_factory(election=election)
        in_party = candidate_factory(election=election, party=party, candidate_number=1)
        candidate_factory(election=election, candidate_number=2)

        response = admin_client.get(f'/api/candidates/?party={party.id}')
        assert response.status_code == status.HTTP_200_OK
        ids = [c['id'] for c in response.data['data']]
        assert in_party.id in ids

    def test_search_candidates_by_name(self, admin_client, candidate):
        response = admin_client.get('/api/candidates/?search=Test')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']) == 1

