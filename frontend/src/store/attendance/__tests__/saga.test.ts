import { describe, it, expect, vi, afterEach } from 'vitest';
import * as api from 'helpers/api/attendance';
import * as actions from '../actions';
import { getAttendancesSaga, markAttendanceSaga } from '../saga';
import { recordSaga, getSnackbarActions } from 'store/testUtils';

describe('attendance sagas', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('handles attendance list fetch (paginated) successfully', async () => {
    const mockResponse = {
      data: {
        results: [{ id: 1 }],
        count: 5
      }
    };

    const getAttendancesSpy = vi.spyOn(api, 'getAttendances').mockResolvedValue(mockResponse as any);

    const action = actions.getAttendancesRequest({ committee__code: 'EK-1' }, 2, 50);
    const dispatched = await recordSaga(getAttendancesSaga, action);

    expect(getAttendancesSpy).toHaveBeenCalledWith({ committee__code: 'EK-1', page: 2, page_size: 50 });
    expect(dispatched).toContainEqual(
      actions.getAttendancesSuccess({
        results: mockResponse.data.results,
        count: mockResponse.data.count,
        currentPage: 2,
        pageSize: 50
      })
    );
    expect(getSnackbarActions(dispatched)).toHaveLength(0);
  });

  it('dispatches error + snackbar on attendance fetch failure', async () => {
    vi.spyOn(api, 'getAttendances').mockRejectedValue(new Error('boom'));

    const dispatched = await recordSaga(getAttendancesSaga, actions.getAttendancesRequest());

    expect(dispatched).toContainEqual(actions.getAttendancesError('boom'));
    const snackbars = getSnackbarActions(dispatched);
    expect(snackbars).toHaveLength(1);
    expect(snackbars[0].payload.message).toBe('boom');
  });

  it('marks attendance and refreshes committee list', async () => {
    const mockAttendance = { id: 1, electorKocId: '123456', committeeCode: 'EK-1' } as any;
    vi.spyOn(api, 'markAttendance').mockResolvedValue({
      data: mockAttendance,
      message: 'Marked'
    } as any);

    const payload = { koc_id: '123456', committee_code: 'EK-1' } as any;
    const dispatched = await recordSaga(markAttendanceSaga, actions.markAttendanceRequest(payload));

    expect(dispatched).toContainEqual(actions.markAttendanceSuccess(mockAttendance));
    expect(dispatched).toContainEqual(actions.getAttendancesRequest({ committee__code: 'EK-1' }));
    const snackbars = getSnackbarActions(dispatched);
    expect(snackbars).toHaveLength(1);
    expect(snackbars[0].payload.message).toBe('Marked');
  });
});

