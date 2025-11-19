/**
 * Election Results Page
 * Election Management System - View election results and statistics
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
  TableContainer
} from '@mui/material';
import { Download as DownloadIcon, Publish as PublishIcon } from '@mui/icons-material';
import { PremiumCard, DeleteConfirmationDialog } from 'shared/components';
import { IconChartBar } from '@tabler/icons-react';
import { openSnackbar } from 'store/snackbar/actions';
import type { RootState } from 'store';
import * as resultsApi from 'helpers/api/results';
import type { ElectionResults as ElectionResultsType, CandidateResult } from 'helpers/api/results';

const ElectionResults: React.FC = () => {
  const dispatch = useDispatch();
  const currentElection = useSelector((state: RootState) => state.auth.currentElection);

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [results, setResults] = useState<ElectionResultsType | null>(null);
  const [candidates, setCandidates] = useState<CandidateResult[]>([]);

  // Publish dialog state
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  // Load results on mount
  useEffect(() => {
    if (currentElection) {
      loadResults();
    }
  }, [currentElection]);

  const loadResults = async () => {
    try {
      setLoading(true);
      const response = await resultsApi.getCurrentResults();

      if (response.success && response.data) {
        setResults(response.data);
        setCandidates(response.data.results_data?.candidates || []);
      }
    } catch (error: any) {
      // If results don't exist yet (404), that's okay - user needs to generate them
      if (error?.response?.status !== 404) {
        dispatch(
          openSnackbar({
            open: true,
            message: error?.response?.data?.message || 'Failed to load results',
            variant: 'alert',
            alert: { color: 'error' }
          })
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateResults = async () => {
    if (!currentElection) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'No active election selected',
          variant: 'alert',
          alert: { color: 'warning' }
        })
      );
      return;
    }

    try {
      setGenerating(true);
      const response = await resultsApi.generateResults(currentElection.id);

      if (response.success && response.data) {
        setResults(response.data);
        setCandidates(response.data.results_data?.candidates || []);

        dispatch(
          openSnackbar({
            open: true,
            message: response.message || 'Results generated successfully',
            variant: 'alert',
            alert: { color: 'success' }
          })
        );
      }
    } catch (error: any) {
      dispatch(
        openSnackbar({
          open: true,
          message: error?.response?.data?.message || 'Failed to generate results',
          variant: 'alert',
          alert: { color: 'error' }
        })
      );
    } finally {
      setGenerating(false);
    }
  };

  const handlePublishResults = () => {
    setShowPublishDialog(true);
  };

  const handleConfirmPublish = async () => {
    if (!currentElection) {
      setShowPublishDialog(false);
      dispatch(
        openSnackbar({
          open: true,
          message: 'No active election selected',
          variant: 'alert',
          alert: { color: 'warning' }
        })
      );
      return;
    }

    try {
      setPublishing(true);
      const response = await resultsApi.publishResults(currentElection.id);

      if (response.success && response.data) {
        setResults(response.data);

        dispatch(
          openSnackbar({
            open: true,
            message: response.message || 'Results published successfully',
            variant: 'alert',
            alert: { color: 'success' }
          })
        );
        setShowPublishDialog(false);
      }
    } catch (error: any) {
      dispatch(
        openSnackbar({
          open: true,
          message: error?.response?.data?.message || 'Failed to publish results',
          variant: 'alert',
          alert: { color: 'error' }
        })
      );
    } finally {
      setPublishing(false);
    }
  };

  const handleCancelPublish = () => {
    setShowPublishDialog(false);
  };

  const handleExportResults = () => {
    // TODO: Implement CSV/PDF export functionality
    dispatch(
      openSnackbar({
        open: true,
        message: 'Export functionality coming soon',
        variant: 'alert',
        alert: { color: 'info' }
      })
    );
  };

  if (loading) {
    return (
      <PremiumCard title="Election Results" icon={<IconChartBar size={24} />} variant="elevated" color="primary">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </PremiumCard>
    );
  }

  return (
    <>
      <PremiumCard title="Election Results" icon={<IconChartBar size={24} />} variant="elevated" color="primary">
        <Grid container spacing={3}>
          {/* Generate Results Section */}
          <Grid size={12}>
            <Card>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h5" gutterBottom>
                      {currentElection ? currentElection.name : 'No active election'}
                    </Typography>
                    {results && (
                      <Chip
                        label={results.status_display}
                        color={results.status === 'PUBLISHED' ? 'success' : 'default'}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    )}
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Button variant="contained" onClick={handleGenerateResults} disabled={!currentElection || generating} fullWidth>
                      {generating ? <CircularProgress size={24} /> : results ? 'Regenerate Results' : 'Generate Results'}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Results Summary */}
          {results && (
            <>
              <Grid size={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h4" gutterBottom>
                      Results Summary
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h3" color="primary">
                            {results.total_ballots_cast.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Total Ballots Cast
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h3" color="success.main">
                            {results.total_valid_ballots.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Valid Ballots
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h3" color="info.main">
                            {candidates.length}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Total Candidates
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h3" color="secondary.main">
                            {results.turnout_percentage.toFixed(1)}%
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Turnout Rate
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Results Table */}
              <Grid size={12}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h4">Candidate Rankings</Typography>
                      <Box>
                        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExportResults} sx={{ mr: 1 }}>
                          Export
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<PublishIcon />}
                          onClick={handlePublishResults}
                          color="success"
                          disabled={results.status === 'PUBLISHED' || publishing}
                        >
                          {publishing ? <CircularProgress size={24} /> : 'Publish Results'}
                        </Button>
                      </Box>
                    </Box>
                    <Divider sx={{ mb: 2 }} />

                    <TableContainer component={Paper} variant="outlined">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Rank</TableCell>
                            <TableCell>Candidate #</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Party</TableCell>
                            <TableCell align="right">Votes</TableCell>
                            <TableCell>Percentage</TableCell>
                            <TableCell width="20%">Vote Share</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {candidates.length > 0 ? (
                            candidates.map((candidate) => (
                              <TableRow key={candidate.candidate_id}>
                                <TableCell>
                                  <Chip label={`#${candidate.rank}`} color={candidate.is_winner ? 'primary' : 'default'} size="small" />
                                </TableCell>
                                <TableCell>
                                  <Typography variant="subtitle2" fontWeight={600}>
                                    {candidate.candidate_number}
                                  </Typography>
                                </TableCell>
                                <TableCell>{candidate.name}</TableCell>
                                <TableCell>
                                  <Chip label={candidate.party_name || 'Independent'} size="small" variant="outlined" />
                                </TableCell>
                                <TableCell align="right">
                                  <Typography variant="subtitle2" fontWeight={600}>
                                    {candidate.total_votes.toLocaleString()}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">{candidate.percentage.toFixed(1)}%</Typography>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LinearProgress
                                      variant="determinate"
                                      value={candidate.percentage}
                                      sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                                    />
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} align="center">
                                <Typography variant="body2" color="textSecondary">
                                  No candidate results available
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Status */}
              <Grid size={12}>
                {results.status === 'PUBLISHED' ? (
                  <Alert severity="success">
                    <Typography variant="body2">
                      <strong>Results have been published.</strong> Published on {new Date(results.published_at!).toLocaleString()} by{' '}
                      {results.published_by_name}.
                    </Typography>
                  </Alert>
                ) : (
                  <Alert severity="info">
                    <Typography variant="body2">
                      Results are currently in draft status. Click "Publish Results" to make them publicly available.
                    </Typography>
                  </Alert>
                )}
              </Grid>
            </>
          )}

          {/* No Results Message */}
          {!loading && !results && (
            <Grid size={12}>
              <Alert severity="warning">
                <Typography variant="body2">
                  No results have been generated yet. Click "Generate Results" to calculate results from verified vote counts.
                </Typography>
              </Alert>
            </Grid>
          )}
        </Grid>
      </PremiumCard>

      {/* Publish Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showPublishDialog}
        title="Publish Results"
        itemName={currentElection?.name || 'these results'}
        itemType="results"
        warningMessage="Publishing these results will make them publicly visible and lock them. This action cannot be undone."
        isDeleting={publishing}
        onConfirm={handleConfirmPublish}
        onCancel={handleCancelPublish}
      />
    </>
  );
};

export default ElectionResults;
