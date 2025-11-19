import React from 'react';

// material-ui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import EntityMetrics, { MetricItem } from '../metrics/EntityMetrics';

// ==============================|| PRIMARY CARD ||============================== //

interface PrimaryCardProps {
  isLoading?: boolean;
  children?: React.ReactNode;
  header?: React.ReactNode;
  title?: string;
  headerSx?: object;
  metrics?: MetricItem[];
}

export default function PrimaryCard({ isLoading, children, header, title = 'Analytics Summary', headerSx, metrics }: PrimaryCardProps) {
  if (isLoading) {
    return (
      <MainCard title={title}>
        <Typography>Loading...</Typography>
      </MainCard>
    );
  }

  return (
    <MainCard
      title={header ? undefined : title}
      contentSX={{
        '&:last-child': { pb: 0 },
        ...(header ? { p: 0 } : {}) // Remove padding when custom header is used
      }}
    >
      {header && (
        <Box
          sx={{
            m: 0,
            p: 3,
            borderBottom: 1,
            borderColor: 'divider',
            ...headerSx
          }}
        >
          {header}
        </Box>
      )}
      <Stack sx={{ p: header ? 3 : 0 }}>
        {/* Metrics Section */}
        {metrics && (
          <Box sx={{ mb: 2 }}>
            <EntityMetrics metrics={metrics} columns={{ xs: 12, sm: 6, md: 3, lg: 3 }} />
          </Box>
        )}

        {/* Content area */}
        {children ? (
          <Box>{children}</Box>
        ) : (
          <Box sx={{ py: 2 }}>
            <Typography variant="body1" color="text.secondary" align="center">
              the content
            </Typography>
          </Box>
        )}
      </Stack>
    </MainCard>
  );
}
