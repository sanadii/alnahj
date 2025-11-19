import { describe, it, expect, vi, afterEach } from 'vitest';
import * as api from 'helpers/api/electors';
import { recordSaga, getSnackbarActions } from 'store/testUtils';
import { getElectorsSaga, createElectorSaga } from '../saga';
import * as actions from '../actions';
import * as actionTypes from '../actionTypes';

describe('electors sagas', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads electors (simple list) successfully', async () => {
    const mockResponse = {
      data: { results: [{ kocId: '123' }], count: 10 }
    };

    const getElectorsSpy = vi.spyOn(api, 'getElectors').mockResolvedValue(mockResponse as any);

    const action = actions.getElectorsRequest({ search: 'Ali' }, false);
    const dispatched = await recordSaga(getElectorsSaga, action);

    expect(getElectorsSpy).toHaveBeenCalledWith({ search: 'Ali' });
    expect(dispatched).toContainEqual(
      actions.getElectorsSuccess({
        electors: mockResponse.data.results,
        totalCount: 10,
        groups: undefined
      })
    );
    expect(getSnackbarActions(dispatched)).toHaveLength(0);
  }
  );

  it('handles getElectors errors with snackbar', async () => {
    vi.spyOn(api, 'getElectors').mockRejectedValue(new Error('boom'));

    const dispatched = await recordSaga(getElectorsSaga, actions.getElectorsRequest());

    expect(dispatched).toContainEqual(actions.getElectorsError('boom'));
    const snackbars = getSnackbarActions(dispatched);
    expect(snackbars).toHaveLength(1);
    expect(snackbars[0].payload.message).toBe('boom');
  });

  it('creates elector and emits success + snackbar', async () => {
    const mockElector = { kocId: '777' } as any;
    vi.spyOn(api, 'createElector').mockResolvedValue({ data: mockElector } as any);

    const action = actions.createElectorRequest({ kocId: '777' } as any);
    const dispatched = await recordSaga(createElectorSaga, action);

    expect(dispatched).toContainEqual(actions.createElectorSuccess(mockElector));
    const snackbars = getSnackbarActions(dispatched);
    expect(snackbars).toHaveLength(1);
    expect(snackbars[0].payload.message).toBe('Elector created successfully');
  });
});

