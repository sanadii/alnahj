/**
 * Results View Tab Component
 * Display election results and candidate rankings
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// icons
import { EmojiEvents as TrophyIcon, Refresh as RefreshIcon, Star as StarIcon } from '@mui/icons-material';

// project imports
import { DeleteConfirmationDialog } from 'shared/components';
import { RootState } from 'store';
import { getElectionResultsRequest, generateResultsRequest } from 'store/voting';
import { formatVoteCount, formatPercentage, getResultsStatusBadgeProps } from 'types/voting';

// ============================================================================
// RESULTS VIEW TAB COMPONENT
// ============================================================================

const ResultsViewTab: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  // Redux state
  const { electionResults, loading } = useSelector((state: RootState) => state.voting);
  const { currentElection } = useSelector((state: RootState) => state.elections);

  // Generate dialog state
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch results on mount
  useEffect(() => {
    if (currentElection) {
      dispatch(getElectionResultsRequest(currentElection.id));
    }
  }, [dispatch, currentElection]);

  // Handle generate results
  const handleGenerateResults = () => {
    if (currentElection) {
      setShowGenerateDialog(true);
    }
  };

  const handleConfirmGenerate = async () => {
    if (!currentElection) return;

    setIsGenerating(true);
    try {
      dispatch(generateResultsRequest(currentElection.id));
      setShowGenerateDialog(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCancelGenerate = () => {
    setShowGenerateDialog(false);
  };

  // Handle refresh
  const handleRefresh = () => {
    if (currentElection) {
      dispatch(getElectionResultsRequest(currentElection.id));
    }
  };

  if (!electionResults) {
    return (
      <Box>
        <Alert severity="info" sx={{ mb: 3 }}>
          No results available yet. Results will be generated once vote counting is complete.
        </Alert>
        <Button variant="contained" color="primary" onClick={handleGenerateResults} startIcon={<RefreshIcon />} disabled={loading}>
          Generate Results
        </Button>
      </Box>
    );
  }

  const statusProps = getResultsStatusBadgeProps(electionResults.status);

  return (
    <Box>
      {/* Results Overview */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4">Election Results Overview</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label={statusProps.label} color={statusProps.color} />
              <Button variant="outlined" size="small" startIcon={<RefreshIcon />} onClick={handleRefresh} disabled={loading}>
                Refresh
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Total Registered Electors
                </Typography>
                <Typography variant="h3">{formatVoteCount(electionResults.total_registered_electors)}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Total Attendance
                </Typography>
                <Typography variant="h3">{formatVoteCount(electionResults.total_attendance)}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {formatPercentage(electionResults.turnout_percentage)} turnout
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Total Ballots Cast
                </Typography>
                <Typography variant="h3">{formatVoteCount(electionResults.total_ballots_cast)}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Valid Ballots
                </Typography>
                <Typography variant="h3" color="success.main">
                  {formatVoteCount(electionResults.total_valid_ballots)}
                </Typography>
                <Typography variant="caption" color="error.main">
                  {formatVoteCount(electionResults.total_invalid_ballots)} invalid
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Candidate Results */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Candidate Rankings
          </Typography>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ width: 80 }}>
                    Rank
                  </TableCell>
                  <TableCell>Candidate</TableCell>
                  <TableCell>Party</TableCell>
                  <TableCell align="right">Total Votes</TableCell>
                  <TableCell align="right" sx={{ width: 200 }}>
                    Vote %
                  </TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {electionResults.candidate_results.map((result) => (
                  <TableRow
                    key={result.candidate_id}
                    sx={{
                      backgroundColor: result.is_winner ? theme.palette.success.lighter : 'inherit'
                    }}
                  >
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        {result.rank <= 3 && (
                          <TrophyIcon
                            sx={{
                              fontSize: 20,
                              color:
                                result.rank === 1
                                  ? theme.palette.warning.main
                                  : result.rank === 2
                                    ? theme.palette.grey[400]
                                    : theme.palette.warning.light
                            }}
                          />
                        )}
                        <Typography variant="h6">{result.rank}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          #{result.candidate_number} - {result.candidate_name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {result.party_name ? (
                        <Chip
                          label={result.party_name}
                          size="small"
                          sx={{
                            backgroundColor: result.party_color || theme.palette.primary.main,
                            color: '#fff'
                          }}
                        />
                      ) : (
                        <Typography variant="caption" color="textSecondary">
                          Independent
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">{formatVoteCount(result.total_votes)}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(result.vote_percentage, 100)}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ minWidth: 50 }}>
                          {formatPercentage(result.vote_percentage)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {result.is_winner && <Chip icon={<StarIcon />} label="Winner" color="success" size="small" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Committee Breakdown */}
      {electionResults.committee_results && electionResults.committee_results.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Committee Breakdown
            </Typography>

            {electionResults.committee_results.map((committeeResult) => (
              <Box key={committeeResult.committee_id} sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {committeeResult.committee_code} - {committeeResult.committee_name}
                </Typography>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="textSecondary">
                      Total Ballots
                    </Typography>
                    <Typography variant="h6">{formatVoteCount(committeeResult.total_ballots)}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="textSecondary">
                      Valid Ballots
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {formatVoteCount(committeeResult.valid_ballots)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="textSecondary">
                      Invalid Ballots
                    </Typography>
                    <Typography variant="h6" color="error.main">
                      {formatVoteCount(committeeResult.invalid_ballots)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="textSecondary">
                      Turnout
                    </Typography>
                    <Typography variant="h6">{formatPercentage(committeeResult.turnout_percentage)}</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Generate Results Button */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outlined" color="primary" onClick={handleGenerateResults} startIcon={<RefreshIcon />} disabled={loading}>
          Regenerate Results
        </Button>
      </Box>

      {/* Generate Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showGenerateDialog}
        title="Generate Results"
        itemName={currentElection?.name || 'election results'}
        itemType="results"
        warningMessage="This will generate/regenerate election results. This may take a few moments and will update all result data."
        isDeleting={isGenerating}
        onConfirm={handleConfirmGenerate}
        onCancel={handleCancelGenerate}
      />
    </Box>
  );
};

export default ResultsViewTab;
