import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Stack, alpha, useTheme } from '@mui/material';
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * ErrorBoundary - A React error boundary component with premium styling
 *
 * Features:
 * - Catches JavaScript errors anywhere in the child component tree
 * - Custom fallback UI
 * - Error reporting callback
 * - Optional error details
 * - Premium styling
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   onError={(error, errorInfo) => console.error('Error caught:', error, errorInfo)}
 *   showDetails={import.meta.env.DEV}
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to console in development
    if (import.meta.env.DEV) {
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          showDetails={this.props.showDetails}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  errorInfo?: ErrorInfo;
  showDetails?: boolean;
  onRetry: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, errorInfo, showDetails = false, onRetry }) => {
  const theme = useTheme();

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    p: 4,
    minHeight: 300,
    background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.05)} 0%, ${alpha(theme.palette.error.main, 0.02)} 100%)`,
    borderRadius: 3,
    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
  };

  const iconStyles = {
    color: 'error.main',
    mb: 2,
    width: 64,
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <Box sx={containerStyles}>
      <Box sx={iconStyles}>
        <IconAlertTriangle size={48} />
      </Box>

      <Typography variant="h5" sx={{ color: 'error.main', fontWeight: 600, mb: 1 }}>
        Something went wrong
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, maxWidth: 400 }}>
        An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
      </Typography>

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="error"
          startIcon={<IconRefresh size={16} />}
          onClick={onRetry}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`
          }}
        >
          Try Again
        </Button>

        <Button variant="outlined" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </Stack>

      {showDetails && error && (
        <Box
          sx={{ mt: 4, p: 2, backgroundColor: alpha(theme.palette.error.main, 0.1), borderRadius: 2, maxWidth: '100%', overflow: 'auto' }}
        >
          <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 600, display: 'block', mb: 1 }}>
            Error Details:
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {error.toString()}
          </Typography>
          {errorInfo && (
            <>
              <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 600, display: 'block', mb: 1, mt: 2 }}>
                Component Stack:
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {errorInfo.componentStack}
              </Typography>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ErrorBoundary;
