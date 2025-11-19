import { describe, it, expect, vi, afterEach } from 'vitest';
import * as api from 'helpers/api/guarantees';
import { getGuaranteesSaga } from '../saga';
import { recordSaga, getSnackbarActions } from 'store/testUtils';
import { getGuaranteesRequest } from '../actions';
import * as actionTypes from '../actionTypes';

describe('guarantees sagas', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches guarantees successfully', async () => {
    const mockPayload = {
      guarantees: [{ id: 1 }],
      statistics: { total_guarantees: 1 } as any,
      groups: [],
      pagination: { count: 1 }
    };

    vi.spyOn(api, 'getGuarantees').mockResolvedValue({
      data: mockPayload,
      meta: { pagination: { count: 1 } }
    } as any);

    const action = getGuaranteesRequest({});
    const dispatched = await recordSaga(getGuaranteesSaga, action);

    expect(dispatched).toContainEqual({
      type: actionTypes.GET_GUARANTEES_SUCCESS,
      payload: {
        guarantees: mockPayload.guarantees,
        count: 1,
        statistics: mockPayload.statistics,
        groups: mockPayload.groups,
        pagination: { count: 1 },
        skipMeta: false
      }
    });

    expect(getSnackbarActions(dispatched)).toHaveLength(0);
  });

  it('handles failures with snackbar', async () => {
    vi.spyOn(api, 'getGuarantees').mockRejectedValue(new Error('boom'));

    const dispatched = await recordSaga(getGuaranteesSaga, getGuaranteesRequest({}));

    expect(dispatched).toContainEqual({
      type: actionTypes.GET_GUARANTEES_FAILURE,
      payload: 'boom'
    });

    const snackbars = getSnackbarActions(dispatched);
    expect(snackbars).toHaveLength(1);
    expect(snackbars[0].payload.message).toBe('boom');
  });
});

