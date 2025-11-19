/**
 * React Hook for WebSocket Real-time Updates
 * Election Management System
 */

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWebSocketClient, type WebSocketMessage } from 'helpers/websocket/websocketClient';
import { selectIsLoggedIn } from 'store/auth/selectors';
import { openSnackbar } from 'store/snackbar/actions';
import { refreshToken } from 'helpers/api/auth';

// Import action creators for real-time updates
import * as guaranteeActions from 'store/guarantees/actions';
import * as attendanceActions from 'store/attendance/actions';
import * as votingActions from 'store/voting/actions';

/**
 * Hook to manage WebSocket connection and handle real-time updates
 */
export const useWebSocket = (): void => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const wsClientRef = useRef<ReturnType<typeof getWebSocketClient> | null>(null);
  const handlersRef = useRef<Array<() => void>>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      // Disconnect if not logged in
      if (wsClientRef.current) {
        wsClientRef.current.disconnect();
        wsClientRef.current = null;
      }
      return;
    }

    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    if (!token) {
      // No token available, disconnect if connected
      if (wsClientRef.current) {
        wsClientRef.current.disconnect();
        wsClientRef.current = null;
      }
      return;
    }

    // Get or create WebSocket client
    const wsClient = getWebSocketClient();
    wsClientRef.current = wsClient;

    // Set up token getter for automatic refresh
    wsClient.setTokenGetter(async () => {
      const currentToken = localStorage.getItem('accessToken');
      if (currentToken) return currentToken;
      
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (refreshTokenValue) {
        try {
          const response = await refreshToken({ refresh: refreshTokenValue });
          if (response?.data?.access) {
            localStorage.setItem('accessToken', response.data.access);
            return response.data.access;
          }
        } catch (error) {
          console.error('[useWebSocket] Token refresh failed:', error);
        }
      }
      return null;
    });

    // Cleanup handlers array
    const cleanupHandlers: Array<() => void> = [];
    
    // Connect (fire and forget - errors handled internally)
    wsClient.connect(token).catch((error) => {
      console.error('[useWebSocket] Connection error:', error);
    });

    // Handle guarantee updates
    const unsubscribeGuarantee = wsClient.on('guarantee_update', (message: WebSocketMessage) => {
      const { action, data } = message;

      if (action === 'created') {
        // New guarantee created - refresh list
        dispatch(guaranteeActions.getGuaranteesRequest({}));
        dispatch(
          openSnackbar({
            open: true,
            message: 'New guarantee added',
            variant: 'alert',
            alert: { color: 'success' }
          })
        );
      } else if (action === 'updated') {
        // Guarantee updated - update in Redux
        if (data?.id) {
          dispatch(
            guaranteeActions.updateGuaranteeSuccess({
              id: data.id,
              data: data
            })
          );
        }
      } else if (action === 'deleted') {
        // Guarantee deleted - remove from Redux
        if (data?.id) {
          dispatch(guaranteeActions.deleteGuaranteeSuccess({ id: data.id }));
        }
      }
    });
    cleanupHandlers.push(unsubscribeGuarantee);

    // Handle attendance updates
    const unsubscribeAttendance = wsClient.on('attendance_update', (message: WebSocketMessage) => {
      const { action, data } = message;

      if (action === 'created' || action === 'updated') {
        // Refresh attendance list if we have committee context
        // The attendance view will handle filtering based on selected committee
        dispatch(attendanceActions.getAttendancesRequest());
        
        // Refresh statistics if we have committee code
        if (data?.committee_code) {
          dispatch(attendanceActions.getAttendanceStatisticsRequest(data.committee_code));
        }
        
        dispatch(
          openSnackbar({
            open: true,
            message: action === 'created' ? 'New attendance recorded' : 'Attendance updated',
            variant: 'alert',
            alert: { color: 'success' }
          })
        );
      }
    });
    cleanupHandlers.push(unsubscribeAttendance);

    // Handle voting updates
    const unsubscribeVoting = wsClient.on('voting_update', (message: WebSocketMessage) => {
      const { action, data } = message;

      if (data?.action_type === 'results_generated' || data?.action_type === 'results_updated') {
        // Election results updated - refresh vote counts and statistics
        if (data?.election_id) {
          dispatch(votingActions.getVoteCountsRequest({ election: data.election_id }));
          dispatch(votingActions.getVotingStatisticsRequest(data.election_id));
        }
        dispatch(
          openSnackbar({
            open: true,
            message: 'Election results updated',
            variant: 'alert',
            alert: { color: 'success' }
          })
        );
      } else if (action === 'created' || action === 'updated') {
        // Vote count updated - refresh vote counts and statistics
        if (data?.election_id) {
          dispatch(votingActions.getVoteCountsRequest({ election: data.election_id }));
          dispatch(votingActions.getVotingStatisticsRequest(data.election_id));
        }
        dispatch(
          openSnackbar({
            open: true,
            message: action === 'created' ? 'New vote count recorded' : 'Vote count updated',
            variant: 'alert',
            alert: { color: 'success' }
          })
        );
      }
    });
    cleanupHandlers.push(unsubscribeVoting);

    // Handle dashboard updates
    const unsubscribeDashboard = wsClient.on('dashboard_update', (message: WebSocketMessage) => {
      const { dashboard_type } = message;

      // Refresh dashboard data based on type
      // This will trigger a refetch when user navigates to dashboard
      dispatch(
        openSnackbar({
          open: true,
          message: 'Dashboard statistics updated',
          variant: 'alert',
          alert: { color: 'info' }
        })
      );
    });
    cleanupHandlers.push(unsubscribeDashboard);

    // Handle connection events
    const unsubscribeConnect = wsClient.onConnect(() => {
      console.log('[useWebSocket] Connected to real-time updates');
    });
    cleanupHandlers.push(unsubscribeConnect);

    const unsubscribeDisconnect = wsClient.onDisconnect(() => {
      console.log('[useWebSocket] Disconnected from real-time updates');
    });
    cleanupHandlers.push(unsubscribeDisconnect);

    const unsubscribeError = wsClient.onError((error) => {
      console.error('[useWebSocket] WebSocket error:', error);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Real-time updates connection error',
          variant: 'alert',
          alert: { color: 'error' }
        })
      );
    });
    cleanupHandlers.push(unsubscribeError);

    handlersRef.current = cleanupHandlers;

    // Cleanup on unmount or when dependencies change
    return () => {
      // Clean up all event handlers first
      cleanupHandlers.forEach((cleanup) => cleanup());
      
      // Then disconnect the client
      if (wsClientRef.current) {
        // Disconnect will handle closing the connection properly
        wsClientRef.current.disconnect();
        wsClientRef.current = null;
      }
    };
  }, [isLoggedIn, dispatch]);
};

