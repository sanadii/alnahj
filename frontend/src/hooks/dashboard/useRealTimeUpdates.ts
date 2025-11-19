/**
 * Real-time Updates Hook
 * WebSocket or polling-based real-time data updates
 */

import { useEffect, useRef, useCallback, useState } from 'react';

interface UseRealTimeUpdatesOptions {
  enabled?: boolean;
  interval?: number; // seconds
  onUpdate?: (data: any) => void;
}

/**
 * Hook for real-time dashboard updates
 * Falls back to polling if WebSocket not available
 */
export const useRealTimeUpdates = (fetchDataFn: () => Promise<any>, options: UseRealTimeUpdatesOptions = {}) => {
  const { enabled = true, interval = 30, onUpdate } = options;

  const [isLive, setIsLive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAndUpdate = useCallback(async () => {
    try {
      const data = await fetchDataFn();
      setLastUpdate(new Date());
      if (onUpdate) {
        onUpdate(data);
      }
      return data;
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      return null;
    }
  }, [fetchDataFn, onUpdate]);

  useEffect(() => {
    if (!enabled) {
      setIsLive(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Initial fetch
    fetchAndUpdate();
    setIsLive(true);

    // Setup polling interval
    intervalRef.current = setInterval(() => {
      fetchAndUpdate();
    }, interval * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsLive(false);
    };
  }, [enabled, interval, fetchAndUpdate]);

  const manualRefresh = useCallback(() => {
    return fetchAndUpdate();
  }, [fetchAndUpdate]);

  return {
    isLive,
    lastUpdate,
    manualRefresh
  };
};

/**
 * WebSocket hook for real-time updates (when WebSocket available)
 */
export const useWebSocket = (url: string, onMessage: (data: any) => void) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.current.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('Connection error');
      };

      ws.current.onclose = () => {
        setIsConnected(false);
      };
    } catch (err) {
      setError('Failed to connect');
      console.error('WebSocket initialization error:', err);
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url, onMessage]);

  const send = useCallback((data: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  }, []);

  return {
    isConnected,
    error,
    send
  };
};

export default useRealTimeUpdates;
