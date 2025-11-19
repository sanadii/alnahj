import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getWebSocketClient, WebSocketClient } from '../websocketClient';

// Mock WebSocket
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState = MockWebSocket.CONNECTING;
  url = '';
  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;

  constructor(url: string) {
    this.url = url;
    // Simulate connection after a short delay
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      if (this.onopen) {
        this.onopen(new Event('open'));
      }
    }, 10);
  }

  send(data: string) {
    // Mock send
  }

  close(code?: number, reason?: string) {
    this.readyState = MockWebSocket.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close', { code, reason }));
    }
  }
}

describe('WebSocketClient', () => {
  let originalWebSocket: typeof WebSocket;
  let mockWs: MockWebSocket;

  beforeEach(() => {
    // Store original WebSocket
    originalWebSocket = global.WebSocket;
    // Replace with mock
    global.WebSocket = MockWebSocket as any;
    // Reset singleton
    (getWebSocketClient as any).wsClientInstance = null;
  });

  afterEach(() => {
    // Restore original WebSocket
    global.WebSocket = originalWebSocket;
    // Clean up
    const client = getWebSocketClient();
    client.disconnect();
    (getWebSocketClient as any).wsClientInstance = null;
  });

  it('should create singleton instance', () => {
    const client1 = getWebSocketClient();
    const client2 = getWebSocketClient();
    expect(client1).toBe(client2);
  });

  it('should connect with token', async () => {
    const client = getWebSocketClient();
    const connectSpy = vi.spyOn(client, 'connect');
    
    client.connect('test-token');
    
    expect(connectSpy).toHaveBeenCalledWith('test-token');
    
    // Wait for connection
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(client.isConnected()).toBe(true);
  });

  it('should handle messages', async () => {
    const client = getWebSocketClient();
    const handler = vi.fn();
    
    client.connect('test-token');
    const unsubscribe = client.on('test_message', handler);
    
    await new Promise((resolve) => setTimeout(resolve, 20));
    
    // Simulate message
    const mockEvent = new MessageEvent('message', {
      data: JSON.stringify({ type: 'test_message', data: { test: 'data' } })
    });
    
    // Access internal WebSocket and trigger message
    const ws = (client as any).ws;
    if (ws && ws.onmessage) {
      ws.onmessage(mockEvent);
    }
    
    expect(handler).toHaveBeenCalledWith({
      type: 'test_message',
      data: { test: 'data' }
    });
    
    unsubscribe();
  });

  it('should handle connection events', async () => {
    const client = getWebSocketClient();
    const onConnectHandler = vi.fn();
    const onDisconnectHandler = vi.fn();
    
    client.onConnect(onConnectHandler);
    client.onDisconnect(onDisconnectHandler);
    
    client.connect('test-token');
    
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(onConnectHandler).toHaveBeenCalled();
    
    client.disconnect();
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(onDisconnectHandler).toHaveBeenCalled();
  });

  it('should handle errors', async () => {
    const client = getWebSocketClient();
    const errorHandler = vi.fn();
    
    client.onError(errorHandler);
    client.connect('test-token');
    
    await new Promise((resolve) => setTimeout(resolve, 20));
    
    // Simulate error
    const ws = (client as any).ws;
    if (ws && ws.onerror) {
      ws.onerror(new Event('error'));
    }
    
    expect(errorHandler).toHaveBeenCalled();
  });

  it('should send messages when connected', async () => {
    const client = getWebSocketClient();
    client.connect('test-token');
    
    await new Promise((resolve) => setTimeout(resolve, 20));
    
    const sendSpy = vi.spyOn((client as any).ws, 'send');
    client.send({ type: 'test', data: 'test' });
    
    expect(sendSpy).toHaveBeenCalledWith(JSON.stringify({ type: 'test', data: 'test' }));
  });

  it('should not send messages when not connected', () => {
    const client = getWebSocketClient();
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    client.send({ type: 'test' });
    
    expect(consoleSpy).toHaveBeenCalledWith('[WebSocket] Cannot send message, not connected');
    
    consoleSpy.mockRestore();
  });

  it('should handle ping/pong messages', async () => {
    const client = getWebSocketClient();
    const handler = vi.fn();
    
    client.connect('test-token');
    client.on('pong', handler);
    
    await new Promise((resolve) => setTimeout(resolve, 20));
    
    // Simulate pong message
    const mockEvent = new MessageEvent('message', {
      data: JSON.stringify({ type: 'pong' })
    });
    
    const ws = (client as any).ws;
    if (ws && ws.onmessage) {
      ws.onmessage(mockEvent);
    }
    
    // Pong messages should not trigger handlers
    expect(handler).not.toHaveBeenCalled();
  });

  it('should unsubscribe handlers', async () => {
    const client = getWebSocketClient();
    const handler = vi.fn();
    
    client.connect('test-token');
    const unsubscribe = client.on('test_message', handler);
    unsubscribe();
    
    await new Promise((resolve) => setTimeout(resolve, 20));
    
    // Simulate message after unsubscribe
    const mockEvent = new MessageEvent('message', {
      data: JSON.stringify({ type: 'test_message', data: {} })
    });
    
    const ws = (client as any).ws;
    if (ws && ws.onmessage) {
      ws.onmessage(mockEvent);
    }
    
    // Handler should not be called after unsubscribe
    expect(handler).not.toHaveBeenCalled();
  });
});

