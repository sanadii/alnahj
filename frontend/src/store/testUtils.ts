import { configureStore } from '@reduxjs/toolkit';
import type { AnyAction, Reducer } from '@reduxjs/toolkit';
import { runSaga, type Saga } from 'redux-saga';
import { vi } from 'vitest';
import http from 'utils/axios';
import rootReducer from './rootReducer';
import type { RootState } from './index';
import { SNACKBAR_OPEN } from './snackbar/reducer';

/**
 * Create a Redux store for reducer tests.
 * Saga middleware is omitted by default—use recordSaga for saga-only tests.
 */
export const createTestStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer as Reducer,
    preloadedState: preloadedState as RootState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: false,
        serializableCheck: false
      })
  });
};

export type TestStore = ReturnType<typeof createTestStore>;

interface RecordSagaOptions {
  state?: Partial<RootState>;
}

/**
 * Executes a saga and returns the dispatched actions for assertions.
 */
export const recordSaga = async <T extends AnyAction>(
  saga: Saga,
  initialAction?: T,
  options: RecordSagaOptions = {}
) => {
  const dispatched: AnyAction[] = [];

  await runSaga(
    {
      dispatch: (action: AnyAction) => {
        dispatched.push(action);
      },
      getState: () => options.state || {}
    },
    saga,
    initialAction
  ).toPromise();

  return dispatched;
};

type HttpMock = {
  get: ReturnType<typeof vi.spyOn>;
  post: ReturnType<typeof vi.spyOn>;
  put: ReturnType<typeof vi.spyOn>;
  patch: ReturnType<typeof vi.spyOn>;
  delete: ReturnType<typeof vi.spyOn>;
  restore: () => void;
};

/**
 * Helper to mock the shared HTTP client (utils/axios).
 * Returns spies for each verb plus a restore function.
 */
export const mockHttpClient = (): HttpMock => {
  const spies = {
    get: vi.spyOn(http.axios, 'get'),
    post: vi.spyOn(http.axios, 'post'),
    put: vi.spyOn(http.axios, 'put'),
    patch: vi.spyOn(http.axios, 'patch'),
    delete: vi.spyOn(http.axios, 'delete')
  };

  const restore = () => {
    Object.values(spies).forEach((spy) => spy.mockRestore());
  };

  return { ...spies, restore };
};

/**
 * Filters SNACKBAR_OPEN actions from a recorded saga run.
 */
export const getSnackbarActions = (actions: AnyAction[]) =>
  actions.filter((action) => action.type === SNACKBAR_OPEN);

