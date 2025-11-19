/**
 * WebSocket Client for Real-time Updates
 * Election Management System
 */

type MessageHandler = (data: any) => void;
type ConnectionHandler = () => void;
type ErrorHandler = (error: Event) => void;

export interface WebSocketMessage {
  type: string;
  action?: string;
  data?: any;
  timestamp?: string;
  dashboard_type?: string;
}

export interface ConnectionMetrics {
  connectedAt: number | null;
  lastMessageAt: number | null;
  reconnectCount: number;
  errorCount: number;
  messagesReceived: number;
  messagesSent: number;
}

class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private token: string | null = null;
  private tokenGetter: (() => Promise<string | null>) | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000; // 3 seconds
  private reconnectTimer: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  private connectionHandlers: ConnectionHandler[] = [];
  private disconnectionHandlers: ConnectionHandler[] = [];
  private errorHandlers: ErrorHandler[] = [];
  private isConnecting = false;
  private shouldReconnect = true;
  private metrics: ConnectionMetrics = {
    connectedAt: null,
    lastMessageAt: null,
    reconnectCount: 0,
    errorCount: 0,
    messagesReceived: 0,
    messagesSent: 0
  };

  constructor(baseUrl: string = '') {
    // Determine WebSocket URL
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = baseUrl || window.location.host.replace(':3000', ':8000');
    this.url = `${wsProtocol}//${wsHost}/ws/election-updates/`;
  }

  /**
   * Set token getter function for automatic token refresh
   */
  setTokenGetter(getter: () => Promise<string | null>): void {
    this.tokenGetter = getter;
  }

  /**
   * Connect to WebSocket server
   */
  async connect(token?: string): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('[WebSocket] Already connected');
      return;
    }

    if (this.isConnecting) {
      console.log('[WebSocket] Connection already in progress');
      return;
    }

    // Get token if not provided
    let connectionToken = token;
    if (!connectionToken && this.tokenGetter) {
      try {
        connectionToken = await this.tokenGetter();
        if (!connectionToken) {
          console.warn('[WebSocket] No token available, cannot connect');
          return;
        }
      } catch (error) {
        console.error('[WebSocket] Error getting token:', error);
        this.metrics.errorCount++;
        return;
      }
    }

    if (!connectionToken) {
      console.warn('[WebSocket] No token provided, cannot connect');
      return;
    }

    this.token = connectionToken;
    this.isConnecting = true;
    this.shouldReconnect = true;

    try {
      const wsUrl = `${this.url}?token=${encodeURIComponent(connectionToken)}`;
      console.log(`[WebSocket] Attempting to connect to: ${wsUrl.replace(/\?token=[^&]+/, '?token=***')}`);
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('[WebSocket] Connected successfully to:', this.url);
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.metrics.connectedAt = Date.now();
        this.metrics.reconnectCount = 0;
        this.startPingInterval();
        this.connectionHandlers.forEach((handler) => handler());
      };

      this.ws.onmessage = (event) => {
        try {
          this.metrics.messagesReceived++;
          this.metrics.lastMessageAt = Date.now();
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error, event.data);
          this.metrics.errorCount++;
        }
      };

      this.ws.onerror = (error) => {
        const errorMessage = this.getErrorMessage(error);
        console.error('[WebSocket] Connection error:', errorMessage, {
          url: this.url,
          readyState: this.ws?.readyState,
          error
        });
        this.metrics.errorCount++;
        this.errorHandlers.forEach((handler) => handler(error));
      };

      this.ws.onclose = async (event) => {
        const closeReason = this.getCloseReason(event.code);
        const errorMessage = event.code === 1006 
          ? 'Connection failed. Is the WebSocket server running?'
          : closeReason;
        
        console.warn(`[WebSocket] Disconnected (code: ${event.code}, reason: ${errorMessage})`, {
          url: this.url,
          reason: event.reason,
          wasClean: event.wasClean
        });
        
        this.isConnecting = false;
        this.stopPingInterval();
        this.disconnectionHandlers.forEach((handler) => handler());

        // Handle authentication errors - try to refresh token
        if (event.code === 4001 || event.code === 4003) {
          console.log('[WebSocket] Authentication error, attempting token refresh...');
          if (this.tokenGetter) {
            try {
              const newToken = await this.tokenGetter();
              if (newToken && this.shouldReconnect) {
                // Retry with new token immediately
                this.reconnectAttempts = 0;
                setTimeout(() => this.connect(newToken), 1000);
                return;
              }
            } catch (error) {
              console.error('[WebSocket] Token refresh failed:', error);
            }
          }
        }

        // Don't reconnect on 1006 (abnormal closure) if it's likely a server issue
        // Only reconnect if it's a network error or temporary issue
        if (
          this.shouldReconnect && 
          event.code !== 1000 && 
          event.code !== 1006 && // Don't auto-reconnect on abnormal closure (server likely down)
          this.reconnectAttempts < this.maxReconnectAttempts
        ) {
          this.metrics.reconnectCount++;
          this.scheduleReconnect();
        } else if (event.code === 1006) {
          console.warn('[WebSocket] Abnormal closure detected. Server may be down. Manual reconnection required.');
        }
      };
    } catch (error) {
      console.error('[WebSocket] Connection setup error:', error, {
        url: this.url,
        error: error instanceof Error ? error.message : String(error)
      });
      this.metrics.errorCount++;
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.shouldReconnect = false;
    this.isConnecting = false; // Reset connecting flag to prevent new connections
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.stopPingInterval();
    
    if (this.ws) {
      // Only close if WebSocket is in a valid state (not already closed)
      const readyState = this.ws.readyState;
      if (readyState === WebSocket.CONNECTING || readyState === WebSocket.OPEN) {
        try {
          this.ws.close(1000, 'Client disconnect');
        } catch (error) {
          // WebSocket might already be closing/closed, ignore error
          console.debug('[WebSocket] Error during disconnect (expected if already closed):', error);
        }
      }
      this.ws = null;
    }
  }

  /**
   * Send message to server
   */
  send(message: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        this.metrics.messagesSent++;
      } catch (error) {
        console.error('[WebSocket] Error sending message:', error);
        this.metrics.errorCount++;
      }
    } else {
      console.warn('[WebSocket] Cannot send message, not connected (state:', this.ws?.readyState, ')');
    }
  }

  /**
   * Subscribe to specific message types
   */
  on(type: string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type)!.push(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.messageHandlers.get(type);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  /**
   * Subscribe to connection events
   */
  onConnect(handler: ConnectionHandler): () => void {
    this.connectionHandlers.push(handler);
    return () => {
      const index = this.connectionHandlers.indexOf(handler);
      if (index > -1) {
        this.connectionHandlers.splice(index, 1);
      }
    };
  }

  /**
   * Subscribe to disconnection events
   */
  onDisconnect(handler: ConnectionHandler): () => void {
    this.disconnectionHandlers.push(handler);
    return () => {
      const index = this.disconnectionHandlers.indexOf(handler);
      if (index > -1) {
        this.disconnectionHandlers.splice(index, 1);
      }
    };
  }

  /**
   * Subscribe to error events
   */
  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.push(handler);
    return () => {
      const index = this.errorHandlers.indexOf(handler);
      if (index > -1) {
        this.errorHandlers.splice(index, 1);
      }
    };
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Get connection metrics
   */
  getMetrics(): ConnectionMetrics {
    return { ...this.metrics };
  }

  /**
   * Get connection health status
   */
  getHealthStatus(): {
    isHealthy: boolean;
    lastMessageAge: number | null;
    uptime: number | null;
  } {
    const now = Date.now();
    const lastMessageAge = this.metrics.lastMessageAt ? now - this.metrics.lastMessageAt : null;
    const uptime = this.metrics.connectedAt ? now - this.metrics.connectedAt : null;
    
    // Consider unhealthy if no message received in last 2 minutes (assuming 30s ping interval)
    const isHealthy = this.isConnected() && (lastMessageAge === null || lastMessageAge < 120000);
    
    return {
      isHealthy,
      lastMessageAge,
      uptime
    };
  }

  /**
   * Get error message from error event
   */
  private getErrorMessage(error: Event | Error): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (error instanceof Event) {
      const target = error.target as WebSocket;
      if (target?.readyState === WebSocket.CONNECTING) {
        return 'Connection failed. Check if WebSocket server is running.';
      }
      if (target?.readyState === WebSocket.CLOSED) {
        return 'Connection closed unexpectedly.';
      }
      return 'WebSocket error occurred.';
    }
    return 'Unknown error';
  }

  /**
   * Get close reason description
   */
  private getCloseReason(code: number): string {
    const reasons: Record<number, string> = {
      1000: 'Normal closure',
      1001: 'Going away',
      1002: 'Protocol error',
      1003: 'Unsupported data',
      1006: 'Abnormal closure',
      1007: 'Invalid data',
      1008: 'Policy violation',
      1009: 'Message too big',
      1010: 'Extension error',
      1011: 'Internal error',
      4001: 'Authentication failed',
      4003: 'Token expired'
    };
    return reasons[code] || `Unknown (${code})`;
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(message: WebSocketMessage): void {
    // Handle ping/pong
    if (message.type === 'pong') {
      return;
    }

    // Call all handlers for this message type
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach((handler) => handler(message));
    }

    // Also call wildcard handlers
    const wildcardHandlers = this.messageHandlers.get('*');
    if (wildcardHandlers) {
      wildcardHandlers.forEach((handler) => handler(message));
    }
  }

  /**
   * Start ping interval to keep connection alive
   */
  private startPingInterval(): void {
    this.stopPingInterval();
    this.pingInterval = setInterval(() => {
      if (this.isConnected()) {
        this.send({
          type: 'ping',
          timestamp: Date.now()
        });
      }
    }, 30000); // Ping every 30 seconds
  }

  /**
   * Stop ping interval
   */
  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private async scheduleReconnect(): Promise<void> {
    if (this.reconnectTimer) {
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      if (this.shouldReconnect) {
        // Try to get fresh token if token getter is available
        if (this.tokenGetter) {
          try {
            const newToken = await this.tokenGetter();
            if (newToken) {
              await this.connect(newToken);
              return;
            }
          } catch (error) {
            console.error('[WebSocket] Error refreshing token for reconnect:', error);
          }
        }
        // Fallback to existing token
        if (this.token) {
          await this.connect(this.token);
        }
      }
    }, delay);
  }
}

// Singleton instance
let wsClientInstance: WebSocketClient | null = null;

export const getWebSocketClient = (baseUrl?: string): WebSocketClient => {
  if (!wsClientInstance) {
    wsClientInstance = new WebSocketClient(baseUrl);
  }
  return wsClientInstance;
};

export default WebSocketClient;

