import { describe, it, expect, vi, afterEach } from 'vitest';
import * as api from 'helpers/api/voting';
import { recordSaga, getSnackbarActions } from 'store/testUtils';
import { getVoteCountsSaga, createVoteCountSaga } from '../saga';
import { getVoteCountsRequest, createVoteCountRequest } from '../actions';
import * as actionTypes from '../actionTypes';

describe('voting sagas', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads vote counts successfully', async () => {
    const mockResponse = {
      data: { results: [{ id: 1 }], count: 5 }
    };

    vi.spyOn(api, 'getVoteCounts').mockResolvedValue(mockResponse as any);

    const action = getVoteCountsRequest({ election: 1 });
    const dispatched = await recordSaga(getVoteCountsSaga, action);

    expect(dispatched).toContainEqual({
      type: actionTypes.GET_VOTE_COUNTS_SUCCESS,
      payload: {
        voteCounts: mockResponse.data.results,
        count: 5
      }
    });
    expect(getSnackbarActions(dispatched)).toHaveLength(0);
  });

  it('handles vote count load failures', async () => {
    vi.spyOn(api, 'getVoteCounts').mockRejectedValue(new Error('boom'));

    const dispatched = await recordSaga(getVoteCountsSaga, getVoteCountsRequest({}));

    expect(dispatched).toContainEqual({
      type: actionTypes.GET_VOTE_COUNTS_FAILURE,
      payload: 'boom'
    });

    const snackbars = getSnackbarActions(dispatched);
    expect(snackbars).toHaveLength(1);
    expect(snackbars[0].payload.message).toBe('boom');
  });

  it('creates vote count and triggers refreshes', async () => {
    vi.spyOn(api, 'createVoteCount').mockResolvedValue({ message: 'Vote counted' } as any);

    const dispatched = await recordSaga(createVoteCountSaga, createVoteCountRequest({ election: 1 } as any));

    expect(dispatched).toContainEqual({
      type: actionTypes.CREATE_VOTE_COUNT_SUCCESS,
      payload: 'Vote counted'
    });

    const refreshCounts = dispatched.find((action) => action.type === actionTypes.GET_VOTE_COUNTS_REQUEST);
    const refreshStats = dispatched.find((action) => action.type === actionTypes.GET_VOTING_STATISTICS_REQUEST);
    expect(refreshCounts).toBeTruthy();
    expect(refreshStats).toBeTruthy();

    const snackbars = getSnackbarActions(dispatched);
    expect(snackbars).toHaveLength(1);
    expect(snackbars[0].payload.message).toBe('Vote counted');
  });
});

