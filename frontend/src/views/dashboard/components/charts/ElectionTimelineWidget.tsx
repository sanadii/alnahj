/**
 * Election Timeline Widget
 * Visual timeline showing election phases and progress
 */

import React from 'react';
import { Paper, Typography, Box, Stack, Stepper, Step, StepLabel, Chip, LinearProgress } from '@mui/material';
import { IconCheck, IconClock } from '@tabler/icons-react';
import { useTheme } from '@mui/material/styles';

interface ElectionTimelineWidgetProps {
  currentStatus: 'SETUP' | 'GUARANTEE_PHASE' | 'VOTING_DAY' | 'COUNTING' | 'CLOSED';
  electionDate?: string | null;
}

const statusSteps = [
  { key: 'SETUP', label: 'Setup', description: 'Configuration and preparation' },
  { key: 'GUARANTEE_PHASE', label: 'Guarantee Collection', description: 'Collecting guarantees from electors' },
  { key: 'VOTING_DAY', label: 'Voting Day', description: 'Election in progress' },
  { key: 'COUNTING', label: 'Counting', description: 'Vote counting and verification' },
  { key: 'CLOSED', label: 'Closed', description: 'Election completed' }
];

export const ElectionTimelineWidget: React.FC<ElectionTimelineWidgetProps> = ({ currentStatus, electionDate }) => {
  const theme = useTheme();

  const activeStep = statusSteps.findIndex((step) => step.key === currentStatus);
  const progress = activeStep >= 0 ? ((activeStep + 1) / statusSteps.length) * 100 : 0;

  const getStepIcon = (stepKey: string) => {
    const stepIndex = statusSteps.findIndex((s) => s.key === stepKey);
    if (stepIndex < activeStep) {
      return <IconCheck size={20} color={theme.palette.success.main} />;
    }
    if (stepIndex === activeStep) {
      return <IconClock size={20} color={theme.palette.primary.main} />;
    }
    return null;
  };

  const daysUntilElection = React.useMemo(() => {
    if (!electionDate) return null;
    const today = new Date();
    const election = new Date(electionDate);
    const diffTime = election.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [electionDate]);

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Election Timeline
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Current phase and progress tracking
          </Typography>
        </Box>

        {/* Progress Bar */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Overall Progress
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {progress.toFixed(0)}%
            </Typography>
          </Stack>
          <LinearProgress variant="determinate" value={progress} color="primary" sx={{ height: 8, borderRadius: 2 }} />
        </Box>

        {/* Timeline Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel>
          {statusSteps.map((step, index) => (
            <Step key={step.key} completed={index < activeStep}>
              <StepLabel
                icon={getStepIcon(step.key)}
                sx={{
                  '& .MuiStepLabel-label': {
                    fontSize: '0.875rem',
                    fontWeight: index === activeStep ? 700 : 400,
                    color: index === activeStep ? 'primary.main' : index < activeStep ? 'success.main' : 'text.secondary'
                  }
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Current Status */}
        <Box sx={{ bgcolor: 'primary.lighter', p: 2, borderRadius: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="body2" color="primary.dark" fontWeight={600}>
                Current Phase
              </Typography>
              <Typography variant="h6" color="primary.dark" fontWeight={700}>
                {statusSteps[activeStep]?.label || 'Unknown'}
              </Typography>
              <Typography variant="caption" color="primary.dark">
                {statusSteps[activeStep]?.description}
              </Typography>
            </Box>
            {electionDate && (
              <Stack alignItems="flex-end">
                <Typography variant="body2" color="primary.dark">
                  Election Date
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary.dark">
                  {new Date(electionDate).toLocaleDateString()}
                </Typography>
                {daysUntilElection !== null && daysUntilElection >= 0 && (
                  <Chip
                    label={daysUntilElection === 0 ? 'Today!' : `${daysUntilElection} days`}
                    size="small"
                    color={daysUntilElection <= 3 ? 'error' : daysUntilElection <= 7 ? 'warning' : 'success'}
                  />
                )}
              </Stack>
            )}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

export default ElectionTimelineWidget;
