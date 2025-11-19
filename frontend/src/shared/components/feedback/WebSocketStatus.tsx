/**
 * WebSocket Connection Status Indicator
 * Shows real-time connection status for WebSocket updates
 */

import React from 'react';
import { Box, Tooltip, IconButton, Badge, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconWifi, IconWifiOff } from '@tabler/icons-react';
import { getWebSocketClient } from 'helpers/websocket/websocketClient';

interface WebSocketStatusProps {
  /**
   * Show as icon button (default) or inline badge
   */
  variant?: 'icon' | 'badge';
  /**
   * Size of the indicator
   */
  size?: 'small' | 'medium' | 'large';
}

/**
 * WebSocket Connection Status Component
 * 
 * Displays the current WebSocket connection status with visual indicators:
 * - Green: Connected
 * - Red: Disconnected
 * - Yellow: Connecting
 * 
 * @example
 * ```tsx
 * <WebSocketStatus />
 * ```
 */
export const WebSocketStatus: React.FC<WebSocketStatusProps> = ({
  variant = 'icon',
  size = 'medium'
}) => {
  const theme = useTheme();
  const [isConnected, setIsConnected] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState(false);

  React.useEffect(() => {
    const wsClient = getWebSocketClient();
    
    // Check initial connection status
    setIsConnected(wsClient.isConnected());
    
    // Check health status
    const healthStatus = wsClient.getHealthStatus();
    if (!healthStatus.isHealthy && wsClient.isConnected()) {
      setIsConnecting(true);
    }

    // Subscribe to connection events
    const unsubscribeConnect = wsClient.onConnect(() => {
      setIsConnected(true);
      setIsConnecting(false);
    });

    const unsubscribeDisconnect = wsClient.onDisconnect(() => {
      setIsConnected(false);
      setIsConnecting(false);
    });

    // Poll connection status and health (fallback)
    const statusInterval = setInterval(() => {
      const connected = wsClient.isConnected();
      const health = wsClient.getHealthStatus();
      setIsConnected(connected);
      
      // Show connecting state if disconnected or unhealthy
      if (!connected || !health.isHealthy) {
        setIsConnecting(!connected);
      } else {
        setIsConnecting(false);
      }
    }, 2000);

    return () => {
      unsubscribeConnect();
      unsubscribeDisconnect();
      clearInterval(statusInterval);
    };
  }, [isConnecting]);

  const getStatusColor = () => {
    if (isConnecting) return theme.palette.warning.main;
    if (isConnected) return theme.palette.success.main;
    return theme.palette.error.main;
  };

  const getStatusText = () => {
    if (isConnecting) return 'Connecting to real-time updates...';
    if (isConnected) return 'Real-time updates connected';
    return 'Real-time updates disconnected';
  };

  const getIcon = () => {
    if (isConnecting) {
      return <CircularProgress size={16} sx={{ color: getStatusColor() }} />;
    }
    return isConnected ? (
      <IconWifi size={20} style={{ color: getStatusColor() }} />
    ) : (
      <IconWifiOff size={20} style={{ color: getStatusColor() }} />
    );
  };

  if (variant === 'badge') {
    return (
      <Tooltip title={getStatusText()}>
        <Badge
          variant="dot"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: getStatusColor(),
              color: getStatusColor()
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {getIcon()}
          </Box>
        </Badge>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={getStatusText()}>
      <IconButton size={size} sx={{ color: getStatusColor() }}>
        {getIcon()}
      </IconButton>
    </Tooltip>
  );
};

export default WebSocketStatus;

