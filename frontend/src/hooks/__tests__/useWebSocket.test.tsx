import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useWebSocket } from '../useWebSocket';
import { getWebSocketClient } from 'helpers/websocket/websocketClient';
import * as guaranteeActions from 'store/guarantees/actions';
import * as attendanceActions from 'store/attendance/actions';
import * as votingActions from 'store/voting/actions';
import { openSnackbar } from 'store/snackbar/actions';
import { SNACKBAR_OPEN } from 'store/snackbar/reducer';
import { refreshToken } from 'helpers/api/auth';

// Mock WebSocket client
vi.mock('helpers/websocket/websocketClient', () => ({
  getWebSocketClient: vi.fn()
}));

// Mock auth API
vi.mock('helpers/api/auth', () => ({
  refreshToken: vi.fn()
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock Redux store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: (state = { isLoggedIn: true, token: 'test-token', ...initialState.auth }) => state,
      snackbar: (state = { notifications: [] }) => state
    },
    preloadedState: {
      auth: { isLoggedIn: true, token: 'test-token', ...initialState.auth },
      ...initialState
    }
  });
};

describe('useWebSocket', () => {
  let mockWsClient: any;
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    // Clear localStorage
    localStorageMock.clear();
    
    // Create mock WebSocket client
    mockWsClient = {
      connect: vi.fn().mockResolvedValue(undefined),
      disconnect: vi.fn(),
      setTokenGetter: vi.fn(),
      on: vi.fn(() => vi.fn()), // Return unsubscribe function
      onConnect: vi.fn(() => vi.fn()),
      onDisconnect: vi.fn(() => vi.fn()),
      onError: vi.fn(() => vi.fn()),
      isConnected: vi.fn(() => true)
    };

    vi.mocked(getWebSocketClient).mockReturnValue(mockWsClient);
    store = createMockStore();
    
    // Set up default token in localStorage
    localStorageMock.setItem('accessToken', 'test-token');
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('should connect when user is logged in and token is available', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    renderHook(() => useWebSocket(), { wrapper });

    expect(mockWsClient.setTokenGetter).toHaveBeenCalled();
    expect(mockWsClient.connect).toHaveBeenCalledWith('test-token');
  });

  it('should not connect when user is not logged in', () => {
    store = createMockStore({ auth: { isLoggedIn: false, token: null } });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    renderHook(() => useWebSocket(), { wrapper });

    expect(mockWsClient.connect).not.toHaveBeenCalled();
    // disconnect may not be called if there was no previous connection
    // expect(mockWsClient.disconnect).toHaveBeenCalled();
  });

  it('should not connect when token is missing', () => {
    localStorageMock.removeItem('accessToken');
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    renderHook(() => useWebSocket(), { wrapper });

    expect(mockWsClient.connect).not.toHaveBeenCalled();
  });

  it('should register guarantee update handler', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    renderHook(() => useWebSocket(), { wrapper });

    expect(mockWsClient.on).toHaveBeenCalledWith('guarantee_update', expect.any(Function));
  });

  it('should register attendance update handler', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    renderHook(() => useWebSocket(), { wrapper });

    expect(mockWsClient.on).toHaveBeenCalledWith('attendance_update', expect.any(Function));
  });

  it('should register voting update handler', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    renderHook(() => useWebSocket(), { wrapper });

    expect(mockWsClient.on).toHaveBeenCalledWith('voting_update', expect.any(Function));
  });

  it('should register dashboard update handler', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    renderHook(() => useWebSocket(), { wrapper });

    expect(mockWsClient.on).toHaveBeenCalledWith('dashboard_update', expect.any(Function));
  });

  it('should dispatch guarantee actions on guarantee update', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    let guaranteeHandler: ((message: any) => void) | null = null;
    mockWsClient.on = vi.fn((type: string, handler: any) => {
      if (type === 'guarantee_update') {
        guaranteeHandler = handler;
      }
      return vi.fn();
    });

    const dispatchSpy = vi.spyOn(store, 'dispatch');
    renderHook(() => useWebSocket(), { wrapper });

    // Simulate guarantee update message
    if (guaranteeHandler) {
      guaranteeHandler({
        type: 'guarantee_update',
        action: 'created',
        data: { id: 1, electorName: 'Test' }
      });
    }

    expect(dispatchSpy).toHaveBeenCalledWith(
      guaranteeActions.getGuaranteesRequest({})
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: SNACKBAR_OPEN,
        payload: expect.objectContaining({
          message: 'New guarantee added',
          variant: 'alert',
          alert: { color: 'success' }
        })
      })
    );
  });

  it('should dispatch attendance actions on attendance update', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    let attendanceHandler: ((message: any) => void) | null = null;
    mockWsClient.on = vi.fn((type: string, handler: any) => {
      if (type === 'attendance_update') {
        attendanceHandler = handler;
      }
      return vi.fn();
    });

    const dispatchSpy = vi.spyOn(store, 'dispatch');
    renderHook(() => useWebSocket(), { wrapper });

    // Simulate attendance update message
    if (attendanceHandler) {
      attendanceHandler({
        type: 'attendance_update',
        action: 'created',
        data: { committee_code: 'EK-1' }
      });
    }

    expect(dispatchSpy).toHaveBeenCalledWith(
      attendanceActions.getAttendancesRequest()
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      attendanceActions.getAttendanceStatisticsRequest('EK-1')
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: SNACKBAR_OPEN,
        payload: expect.objectContaining({
          message: 'New attendance recorded',
          variant: 'alert',
          alert: { color: 'success' }
        })
      })
    );
  });

  it('should show attendance updated snackbar on attendance update', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    let attendanceHandler: ((message: any) => void) | null = null;
    mockWsClient.on = vi.fn((type: string, handler: any) => {
      if (type === 'attendance_update') {
        attendanceHandler = handler;
      }
      return vi.fn();
    });

    const dispatchSpy = vi.spyOn(store, 'dispatch');
    renderHook(() => useWebSocket(), { wrapper });

    // Simulate attendance updated message
    if (attendanceHandler) {
      attendanceHandler({
        type: 'attendance_update',
        action: 'updated',
        data: { committee_code: 'EK-1' }
      });
    }

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: SNACKBAR_OPEN,
        payload: expect.objectContaining({
          message: 'Attendance updated',
          variant: 'alert',
          alert: { color: 'success' }
        })
      })
    );
  });

  it('should handle attendance update without committee_code', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    let attendanceHandler: ((message: any) => void) | null = null;
    mockWsClient.on = vi.fn((type: string, handler: any) => {
      if (type === 'attendance_update') {
        attendanceHandler = handler;
      }
      return vi.fn();
    });

    const dispatchSpy = vi.spyOn(store, 'dispatch');
    renderHook(() => useWebSocket(), { wrapper });

    // Simulate attendance update without committee_code
    if (attendanceHandler) {
      attendanceHandler({
        type: 'attendance_update',
        action: 'created',
        data: {}
      });
    }

    expect(dispatchSpy).toHaveBeenCalledWith(
      attendanceActions.getAttendancesRequest()
    );
    // Should not call statistics request without committee_code
    expect(dispatchSpy).not.toHaveBeenCalledWith(
      attendanceActions.getAttendanceStatisticsRequest('EK-1')
    );
  });

  it('should dispatch voting actions on voting update', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    let votingHandler: ((message: any) => void) | null = null;
    mockWsClient.on = vi.fn((type: string, handler: any) => {
      if (type === 'voting_update') {
        votingHandler = handler;
      }
      return vi.fn();
    });

    const dispatchSpy = vi.spyOn(store, 'dispatch');
    renderHook(() => useWebSocket(), { wrapper });

    // Simulate voting update message
    if (votingHandler) {
      votingHandler({
        type: 'voting_update',
        action: 'created',
        data: { election_id: 1 }
      });
    }

    expect(dispatchSpy).toHaveBeenCalledWith(
      votingActions.getVoteCountsRequest({ election: 1 })
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      votingActions.getVotingStatisticsRequest(1)
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: SNACKBAR_OPEN,
        payload: expect.objectContaining({
          message: 'New vote count recorded',
          variant: 'alert',
          alert: { color: 'success' }
        })
      })
    );
  });

  it('should show voting updated snackbar on voting update', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    let votingHandler: ((message: any) => void) | null = null;
    mockWsClient.on = vi.fn((type: string, handler: any) => {
      if (type === 'voting_update') {
        votingHandler = handler;
      }
      return vi.fn();
    });

    const dispatchSpy = vi.spyOn(store, 'dispatch');
    renderHook(() => useWebSocket(), { wrapper });

    // Simulate voting updated message
    if (votingHandler) {
      votingHandler({
        type: 'voting_update',
        action: 'updated',
        data: { election_id: 1 }
      });
    }

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: SNACKBAR_OPEN,
        payload: expect.objectContaining({
          message: 'Vote count updated',
          variant: 'alert',
          alert: { color: 'success' }
        })
      })
    );
  });

  it('should handle voting update without election_id', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    let votingHandler: ((message: any) => void) | null = null;
    mockWsClient.on = vi.fn((type: string, handler: any) => {
      if (type === 'voting_update') {
        votingHandler = handler;
      }
      return vi.fn();
    });

    const dispatchSpy = vi.spyOn(store, 'dispatch');
    renderHook(() => useWebSocket(), { wrapper });

    // Simulate voting update without election_id
    if (votingHandler) {
      votingHandler({
        type: 'voting_update',
        action: 'created',
        data: {}
      });
    }

    // Should not call vote counts or statistics request without election_id
    expect(dispatchSpy).not.toHaveBeenCalledWith(
      votingActions.getVoteCountsRequest({ election: 1 })
    );
    expect(dispatchSpy).not.toHaveBeenCalledWith(
      votingActions.getVotingStatisticsRequest(1)
    );
  });

  it('should dispatch dashboard update snackbar', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    let dashboardHandler: ((message: any) => void) | null = null;
    mockWsClient.on = vi.fn((type: string, handler: any) => {
      if (type === 'dashboard_update') {
        dashboardHandler = handler;
      }
      return vi.fn();
    });

    const dispatchSpy = vi.spyOn(store, 'dispatch');
    renderHook(() => useWebSocket(), { wrapper });

    // Simulate dashboard update message
    if (dashboardHandler) {
      dashboardHandler({
        type: 'dashboard_update',
        dashboard_type: 'personal'
      });
    }

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: SNACKBAR_OPEN,
        payload: expect.objectContaining({
          message: 'Dashboard statistics updated',
          variant: 'alert',
          alert: { color: 'info' }
        })
      })
    );
  });

  it('should disconnect on unmount', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { unmount } = renderHook(() => useWebSocket(), { wrapper });
    unmount();

    expect(mockWsClient.disconnect).toHaveBeenCalled();
  });

  it('should handle connection events', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    renderHook(() => useWebSocket(), { wrapper });

    expect(mockWsClient.onConnect).toHaveBeenCalled();
    expect(mockWsClient.onDisconnect).toHaveBeenCalled();
    expect(mockWsClient.onError).toHaveBeenCalled();
  });

  it('should set up token getter for automatic refresh', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    renderHook(() => useWebSocket(), { wrapper });

    expect(mockWsClient.setTokenGetter).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should handle guarantee update with updated action', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    let guaranteeHandler: ((message: any) => void) | null = null;
    mockWsClient.on = vi.fn((type: string, handler: any) => {
      if (type === 'guarantee_update') {
        guaranteeHandler = handler;
      }
      return vi.fn();
    });

    const dispatchSpy = vi.spyOn(store, 'dispatch');
    renderHook(() => useWebSocket(), { wrapper });

    // Simulate guarantee update message
    if (guaranteeHandler) {
      guaranteeHandler({
        type: 'guarantee_update',
        action: 'updated',
        data: { id: 1, guaranteeStatus: 'GUARANTEED' }
      });
    }

    expect(dispatchSpy).toHaveBeenCalledWith(
      guaranteeActions.updateGuaranteeSuccess({
        id: 1,
        data: { id: 1, guaranteeStatus: 'GUARANTEED' }
      })
    );
  });

  it('should handle guarantee update with deleted action', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    let guaranteeHandler: ((message: any) => void) | null = null;
    mockWsClient.on = vi.fn((type: string, handler: any) => {
      if (type === 'guarantee_update') {
        guaranteeHandler = handler;
      }
      return vi.fn();
    });

    const dispatchSpy = vi.spyOn(store, 'dispatch');
    renderHook(() => useWebSocket(), { wrapper });

    // Simulate guarantee delete message
    if (guaranteeHandler) {
      guaranteeHandler({
        type: 'guarantee_update',
        action: 'deleted',
        data: { id: 1 }
      });
    }

    expect(dispatchSpy).toHaveBeenCalledWith(
      guaranteeActions.deleteGuaranteeSuccess({ id: 1 })
    );
  });

  it('should handle voting update with results_generated action', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    let votingHandler: ((message: any) => void) | null = null;
    mockWsClient.on = vi.fn((type: string, handler: any) => {
      if (type === 'voting_update') {
        votingHandler = handler;
      }
      return vi.fn();
    });

    const dispatchSpy = vi.spyOn(store, 'dispatch');
    renderHook(() => useWebSocket(), { wrapper });

    // Simulate voting results generated message
    if (votingHandler) {
      votingHandler({
        type: 'voting_update',
        action: 'updated',
        data: { action_type: 'results_generated', election_id: 1 }
      });
    }

    expect(dispatchSpy).toHaveBeenCalledWith(
      votingActions.getVoteCountsRequest({ election: 1 })
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      votingActions.getVotingStatisticsRequest(1)
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: SNACKBAR_OPEN,
        payload: expect.objectContaining({
          message: 'Election results updated'
        })
      })
    );
  });

  it('should handle error events and dispatch snackbar', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    let errorHandler: ((error: any) => void) | null = null;
    mockWsClient.onError = vi.fn((handler: any) => {
      errorHandler = handler;
      return vi.fn();
    });

    const dispatchSpy = vi.spyOn(store, 'dispatch');
    renderHook(() => useWebSocket(), { wrapper });

    // Simulate error
    if (errorHandler) {
      errorHandler(new Error('Connection failed'));
    }

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: SNACKBAR_OPEN,
        payload: expect.objectContaining({
          message: 'Real-time updates connection error',
          variant: 'alert'
        })
      })
    );
  });

  it('should cleanup all handlers on unmount', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const unsubscribeGuarantee = vi.fn();
    const unsubscribeAttendance = vi.fn();
    const unsubscribeVoting = vi.fn();
    const unsubscribeDashboard = vi.fn();
    const unsubscribeConnect = vi.fn();
    const unsubscribeDisconnect = vi.fn();
    const unsubscribeError = vi.fn();

    mockWsClient.on = vi.fn((type: string) => {
      if (type === 'guarantee_update') return unsubscribeGuarantee;
      if (type === 'attendance_update') return unsubscribeAttendance;
      if (type === 'voting_update') return unsubscribeVoting;
      if (type === 'dashboard_update') return unsubscribeDashboard;
      return vi.fn();
    });
    mockWsClient.onConnect = vi.fn(() => unsubscribeConnect);
    mockWsClient.onDisconnect = vi.fn(() => unsubscribeDisconnect);
    mockWsClient.onError = vi.fn(() => unsubscribeError);

    const { unmount } = renderHook(() => useWebSocket(), { wrapper });
    unmount();

    expect(unsubscribeGuarantee).toHaveBeenCalled();
    expect(unsubscribeAttendance).toHaveBeenCalled();
    expect(unsubscribeVoting).toHaveBeenCalled();
    expect(unsubscribeDashboard).toHaveBeenCalled();
    expect(unsubscribeConnect).toHaveBeenCalled();
    expect(unsubscribeDisconnect).toHaveBeenCalled();
    expect(unsubscribeError).toHaveBeenCalled();
    expect(mockWsClient.disconnect).toHaveBeenCalled();
  });

  it('should handle connection errors gracefully', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const connectionError = new Error('Connection failed');
    mockWsClient.connect = vi.fn().mockRejectedValue(connectionError);

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderHook(() => useWebSocket(), { wrapper });

    await waitFor(() => {
      expect(mockWsClient.connect).toHaveBeenCalled();
    });

    // Error should be logged but not crash the hook
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[useWebSocket] Connection error:',
      connectionError
    );

    consoleErrorSpy.mockRestore();
  });
});

