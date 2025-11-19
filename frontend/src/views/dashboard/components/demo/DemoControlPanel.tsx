/**
 * DemoControlPanel Component
 * Main control panel for the election demo feature
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControlLabel,
  Switch,
  Slider,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Alert
} from '@mui/material';
import { IconPlayerPlay, IconPlayerStop, IconX } from '@tabler/icons-react';
import { useElectionDemo } from '../hooks/useElectionDemo';
import { DEFAULT_DEMO_CONFIG, type DemoConfig } from 'types/demo';
import DemoProgressCard from './DemoProgressCard';

interface DemoControlPanelProps {
  open: boolean;
  electionId: number | null;
  onClose: () => void;
}

const DemoControlPanel: React.FC<DemoControlPanelProps> = ({ open, electionId, onClose }) => {
  const [config, setConfig] = useState<DemoConfig>(DEFAULT_DEMO_CONFIG);
  const [tabValue, setTabValue] = useState(0);
  const { state, progress, start, stop, reset } = useElectionDemo();

  const handleConfigChange = (path: string[], value: any) => {
    setConfig((prev) => {
      const newConfig = { ...prev };
      let current: any = newConfig;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]] = { ...current[path[i]] };
      }
      current[path[path.length - 1]] = value;
      return newConfig;
    });
  };

  const handleStart = async () => {
    if (!electionId) {
      return;
    }
    try {
      await start(electionId, config);
    } catch (error) {
      console.error('Failed to start demo:', error);
    }
  };

  const handleReset = () => {
    stop();
  };

  const handleClose = () => {
    if (!state.isRunning) {
      reset();
      onClose();
    }
  };

  // Reset when dialog closes
  useEffect(() => {
    if (!open && !state.isRunning) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, state.isRunning]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={600}>
            Election Demo Control Panel
          </Typography>
          <Button onClick={handleClose} disabled={state.isRunning} startIcon={<IconX size={18} />}>
            Close
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Progress Display */}
          {(state.isRunning || state.currentPhase === 'complete') && (
            <DemoProgressCard state={state} progress={progress} />
          )}

          {/* Configuration Tabs */}
          {!state.isRunning && (
            <Box>
              {/* Phase Selection Checkboxes */}
              <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                  Select Phases to Run
                </Typography>
                <Stack spacing={1}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.enabledPhases.parties}
                        onChange={(e) => handleConfigChange(['enabledPhases', 'parties'], e.target.checked)}
                      />
                    }
                    label="Create Parties"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.enabledPhases.candidates}
                        onChange={(e) => handleConfigChange(['enabledPhases', 'candidates'], e.target.checked)}
                      />
                    }
                    label="Create Candidates (includes independent candidates)"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.enabledPhases.committees}
                        onChange={(e) => handleConfigChange(['enabledPhases', 'committees'], e.target.checked)}
                      />
                    }
                    label="Create Committees"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.enabledPhases.users}
                        onChange={(e) => handleConfigChange(['enabledPhases', 'users'], e.target.checked)}
                      />
                    }
                    label="Create Users"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.enabledPhases.guarantees}
                        onChange={(e) => handleConfigChange(['enabledPhases', 'guarantees'], e.target.checked)}
                      />
                    }
                    label="Generate Guarantees"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.enabledPhases.attendance}
                        onChange={(e) => handleConfigChange(['enabledPhases', 'attendance'], e.target.checked)}
                      />
                    }
                    label="Simulate Attendance"
                  />
                </Stack>
              </Paper>

              <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                <Tab label="Election Setup" />
                <Tab label="Users & Guarantees" />
                <Tab label="Attendance" />
              </Tabs>

              <Box sx={{ mt: 3 }}>
                {/* Election Setup Tab */}
                {tabValue === 0 && (
                  <Stack spacing={3}>
                    <Typography variant="h6">Parties</Typography>
                    <TextField
                      label="Number of Parties"
                      type="number"
                      value={config.parties.count}
                      onChange={(e) => handleConfigChange(['parties', 'count'], parseInt(e.target.value) || 4)}
                      inputProps={{ min: 2, max: 10 }}
                      fullWidth
                      disabled={!config.enabledPhases.parties}
                    />

                    <Typography variant="h6" sx={{ mt: 2 }}>Candidates</Typography>
                    <TextField
                      label="Candidates per Party"
                      type="number"
                      value={config.candidates.candidatesPerParty}
                      onChange={(e) => handleConfigChange(['candidates', 'candidatesPerParty'], parseInt(e.target.value) || 3)}
                      inputProps={{ min: 1, max: 8 }}
                      fullWidth
                      disabled={!config.enabledPhases.candidates || !config.enabledPhases.parties}
                      helperText={!config.enabledPhases.parties ? 'Enable parties to create party candidates' : 'Only created if parties are enabled'}
                    />
                    <TextField
                      label="Independent Candidates"
                      type="number"
                      value={config.candidates.independentCandidates}
                      onChange={(e) => handleConfigChange(['candidates', 'independentCandidates'], parseInt(e.target.value) || 3)}
                      inputProps={{ min: 0, max: 10 }}
                      fullWidth
                      disabled={!config.enabledPhases.candidates}
                      helperText="Candidates without party affiliation"
                    />

                    <Typography variant="h6" sx={{ mt: 2 }}>Committees</Typography>
                    <TextField
                      label="Number of Committees"
                      type="number"
                      value={config.committees.count}
                      onChange={(e) => handleConfigChange(['committees', 'count'], parseInt(e.target.value) || 8)}
                      inputProps={{ min: 3, max: 20 }}
                      fullWidth
                      disabled={!config.enabledPhases.committees}
                    />
                  </Stack>
                )}

                {/* Users & Guarantees Tab */}
                {tabValue === 1 && (
                  <Stack spacing={3}>
                    <Typography variant="h6">Users</Typography>
                    <TextField
                      label="Number of Users"
                      type="number"
                      value={config.users.count}
                      onChange={(e) => handleConfigChange(['users', 'count'], parseInt(e.target.value) || 15)}
                      inputProps={{ min: 5, max: 50 }}
                      fullWidth
                      disabled={!config.enabledPhases.users}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={config.users.assignToCommittees}
                          onChange={(e) => handleConfigChange(['users', 'assignToCommittees'], e.target.checked)}
                          disabled={!config.enabledPhases.users}
                        />
                      }
                      label="Assign Users to Committees"
                    />

                    <Typography variant="h6" sx={{ mt: 2 }}>Guarantees</Typography>
                    <Box>
                      <Typography gutterBottom>Batch Size: {config.guarantees.batchSize}</Typography>
                      <Slider
                        value={config.guarantees.batchSize}
                        onChange={(_, value) => handleConfigChange(['guarantees', 'batchSize'], value)}
                        min={10}
                        max={500}
                        step={10}
                        disabled={!config.enabledPhases.guarantees}
                        marks={[
                          { value: 50, label: '50' },
                          { value: 100, label: '100' },
                          { value: 250, label: '250' },
                          { value: 500, label: '500' }
                        ]}
                      />
                    </Box>
                    <Box>
                      <Typography gutterBottom>Interval: {config.guarantees.intervalMs}ms</Typography>
                      <Slider
                        value={config.guarantees.intervalMs}
                        onChange={(_, value) => handleConfigChange(['guarantees', 'intervalMs'], value)}
                        min={100}
                        max={10000}
                        step={100}
                        disabled={!config.enabledPhases.guarantees}
                        marks={[
                          { value: 1000, label: '1s' },
                          { value: 2000, label: '2s' },
                          { value: 5000, label: '5s' },
                          { value: 10000, label: '10s' }
                        ]}
                      />
                    </Box>
                    <TextField
                      select
                      label="Group Distribution"
                      value={config.guarantees.groupDistribution}
                      onChange={(e) => handleConfigChange(['guarantees', 'groupDistribution'], e.target.value)}
                      fullWidth
                      disabled={!config.enabledPhases.guarantees}
                      SelectProps={{ native: true }}
                    >
                      <option value="random">Random</option>
                      <option value="round-robin">Round-Robin</option>
                      <option value="equal">Equal</option>
                    </TextField>
                    <TextField
                      label="Total Limit (Optional)"
                      type="number"
                      value={config.guarantees.totalLimit || ''}
                      onChange={(e) => handleConfigChange(['guarantees', 'totalLimit'], e.target.value ? parseInt(e.target.value) : undefined)}
                      helperText="Leave empty for unlimited"
                      fullWidth
                      disabled={!config.enabledPhases.guarantees}
                    />
                  </Stack>
                )}

                {/* Attendance Tab */}
                {tabValue === 2 && (
                  <Stack spacing={3}>
                    {config.enabledPhases.attendance ? (
                      <>
                        <Box>
                          <Typography gutterBottom>Attendance Rate: {Math.round(config.attendance.rate * 100)}%</Typography>
                          <Slider
                            value={config.attendance.rate}
                            onChange={(_, value) => handleConfigChange(['attendance', 'rate'], value)}
                            min={0.5}
                            max={0.95}
                            step={0.05}
                            marks={[
                              { value: 0.7, label: '70%' },
                              { value: 0.75, label: '75%' },
                              { value: 0.8, label: '80%' },
                              { value: 0.85, label: '85%' }
                            ]}
                          />
                        </Box>
                        <Box>
                          <Typography gutterBottom>Batch Size: {config.attendance.batchSize}</Typography>
                          <Slider
                            value={config.attendance.batchSize}
                            onChange={(_, value) => handleConfigChange(['attendance', 'batchSize'], value)}
                            min={10}
                            max={200}
                            step={10}
                          />
                        </Box>
                        <Box>
                          <Typography gutterBottom>Interval: {config.attendance.intervalMs}ms</Typography>
                          <Slider
                            value={config.attendance.intervalMs}
                            onChange={(_, value) => handleConfigChange(['attendance', 'intervalMs'], value)}
                            min={500}
                            max={10000}
                            step={100}
                            marks={[
                              { value: 1000, label: '1s' },
                              { value: 2000, label: '2s' },
                              { value: 5000, label: '5s' }
                            ]}
                          />
                        </Box>
                      </>
                    ) : (
                      <Alert severity="info">
                        Enable "Simulate Attendance" in the phase selection above to configure attendance settings.
                      </Alert>
                    )}
                  </Stack>
                )}
              </Box>
            </Box>
          )}

          {/* Error Display */}
          {progress.errors.length > 0 && (
            <Alert severity="error">
              <Typography variant="subtitle2">Errors ({progress.errors.length})</Typography>
              {progress.errors.slice(-5).map((err, idx) => (
                <Typography key={idx} variant="body2">
                  {err.phase}: {err.error}
                </Typography>
              ))}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Stack direction="row" spacing={2} width="100%" justifyContent="space-between">
          <Box>
            {state.isRunning && (
              <Typography variant="body2" color="text.secondary">
                Phase: {state.currentPhase} | Errors: {state.errors}
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={2}>
            {!state.isRunning && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleStart}
                disabled={!electionId}
                startIcon={<IconPlayerPlay size={18} />}
              >
                Start Demo
              </Button>
            )}
            {(state.isRunning || state.currentPhase === 'complete') && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleReset}
                startIcon={<IconPlayerStop size={18} />}
              >
                Clear
              </Button>
            )}
            <Button onClick={handleClose} disabled={state.isRunning}>
              Close
            </Button>
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default DemoControlPanel;

