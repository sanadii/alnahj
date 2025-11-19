/**
 * DemoProgressCard Component
 * Displays real-time progress for the demo
 */

import React from 'react';
import { Paper, Stack, Typography, LinearProgress, Box, Grid, Chip } from '@mui/material';
import { IconCheck, IconCircle } from '@tabler/icons-react';
import type { DemoState, DemoProgress } from 'types/demo';

interface DemoProgressCardProps {
  state: DemoState;
  progress: DemoProgress;
}

const DemoProgressCard: React.FC<DemoProgressCardProps> = ({ state, progress }) => {
  const phases = [
    { key: 'parties', label: 'Parties & Candidates', phase: progress.phases.parties },
    { key: 'committees', label: 'Committees', phase: progress.phases.committees },
    { key: 'users', label: 'Users', phase: progress.phases.users },
    { key: 'guarantees', label: 'Guarantees', phase: progress.phases.guarantees },
    { key: 'attendance', label: 'Attendance', phase: progress.phases.attendance }
  ];

  const currentPhaseIndex = phases.findIndex((p) => p.key === state.currentPhase);
  const completedPhases = phases.filter((p) => p.phase.completed).length;
  const overallProgress = (completedPhases / phases.length) * 100;

  return (
    <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
      <Stack spacing={3}>
        {/* Overall Progress */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" fontWeight={600}>
              Overall Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(overallProgress)}%
            </Typography>
          </Stack>
          <LinearProgress variant="determinate" value={overallProgress} sx={{ height: 8, borderRadius: 1 }} />
        </Box>

        {/* Phase Progress */}
        <Box>
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            Phase Progress
          </Typography>
          <Stack spacing={2}>
            {phases.map((phase, index) => {
              const isCurrent = state.currentPhase === phase.key;
              const isCompleted = phase.phase.completed;
              const isPending = index > currentPhaseIndex;

              return (
                <Box key={phase.key}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                    {isCompleted ? (
                      <IconCheck size={20} color="green" />
                    ) : isCurrent ? (
                      <IconCircle size={20} color="primary" />
                    ) : (
                      <IconCircle size={20} color="disabled" />
                    )}
                    <Typography variant="body2" fontWeight={isCurrent ? 600 : 400}>
                      {phase.label}
                    </Typography>
                    {isCurrent && (
                      <Chip label="Active" size="small" color="primary" />
                    )}
                  </Stack>
                  {phase.key === 'parties' && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 5 }}>
                      {phase.phase.count} parties, {phase.phase.candidates} candidates
                    </Typography>
                  )}
                  {phase.key === 'committees' && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 5 }}>
                      {phase.phase.count} committees
                    </Typography>
                  )}
                  {phase.key === 'users' && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 5 }}>
                      {phase.phase.count} users
                    </Typography>
                  )}
                  {phase.key === 'guarantees' && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 5 }}>
                      {phase.phase.total} guarantees ({phase.phase.batches} batches)
                    </Typography>
                  )}
                  {phase.key === 'attendance' && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 5 }}>
                      {phase.phase.total} records ({Math.round(phase.phase.rate * 100)}% rate)
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* Statistics Grid */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="caption" color="text.secondary">
                Guarantees Created
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {progress.guarantees.totalCreated.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {progress.guarantees.batchesCompleted} batches
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="caption" color="text.secondary">
                Attendance Records
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {progress.attendance.totalCreated.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {Math.round(progress.attendance.overallRate * 100)}% rate
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  );
};

export default DemoProgressCard;

