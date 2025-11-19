/**
 * Vote Entry Tab Component
 * Enter and manage vote counts per committee
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack
} from '@mui/material';

// icons
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

// project imports
import { RootState } from 'store';
import { bulkVoteEntryRequest } from 'store/voting';
import { getCommitteesRequest } from 'store/committees';
import type { BulkVoteEntryData } from 'types/voting';

// ============================================================================
// VOTE ENTRY TAB COMPONENT
// ============================================================================

const VoteEntryTab: React.FC = () => {
  const dispatch = useDispatch();

  // Redux state
  const { candidates, parties } = useSelector((state: RootState) => state.voting);
  const { committees } = useSelector((state: RootState) => state.committees);
  const { currentElection } = useSelector((state: RootState) => state.elections);

  // Local state
  const [selectedCommittee, setSelectedCommittee] = useState<number | ''>('');
  const [totalBallots, setTotalBallots] = useState<number>(0);
  const [invalidBallots, setInvalidBallots] = useState<number>(0);
  const [voteCounts, setVoteCounts] = useState<Record<number, number>>({});
  const [notes, setNotes] = useState<string>('');

  // Fetch committees on mount
  useEffect(() => {
    if (currentElection) {
      dispatch(getCommitteesRequest({ election: currentElection.id }));
    }
  }, [dispatch, currentElection]);

  // Calculate totals
  const totalVotesEntered = Object.values(voteCounts).reduce((sum, count) => sum + (count || 0), 0);
  const validBallots = totalBallots - invalidBallots;

  // Handle vote count change for a candidate
  const handleVoteCountChange = (candidateId: number, value: string) => {
    const numValue = parseInt(value) || 0;
    setVoteCounts((prev) => ({
      ...prev,
      [candidateId]: numValue
    }));
  };

  // Handle submit
  const handleSubmit = () => {
    if (!selectedCommittee) {
      alert('Please select a committee');
      return;
    }

    if (totalBallots === 0) {
      alert('Please enter total ballots cast');
      return;
    }

    // Prepare vote counts data
    const voteCountsArray = Object.entries(voteCounts)
      .filter(([_, count]) => count > 0)
      .map(([candidateId, count]) => ({
        candidate_id: parseInt(candidateId),
        vote_count: count
      }));

    if (voteCountsArray.length === 0) {
      alert('Please enter at least one vote count');
      return;
    }

    const data: BulkVoteEntryData = {
      committee_id: selectedCommittee as number,
      total_ballots_cast: totalBallots,
      invalid_ballots: invalidBallots,
      vote_counts: voteCountsArray,
      notes
    };

    dispatch(bulkVoteEntryRequest(data));

    // Reset form
    setSelectedCommittee('');
    setTotalBallots(0);
    setInvalidBallots(0);
    setVoteCounts({});
    setNotes('');
  };

  // Handle reset
  const handleReset = () => {
    setSelectedCommittee('');
    setTotalBallots(0);
    setInvalidBallots(0);
    setVoteCounts({});
    setNotes('');
  };

  return (
    <Box>
      {/* Committee Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Committee Selection
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                label="Select Committee"
                value={selectedCommittee}
                onChange={(e) => setSelectedCommittee(e.target.value as number)}
              >
                <MenuItem value="">-- Select Committee --</MenuItem>
                {committees.map((committee) => (
                  <MenuItem key={committee.id} value={committee.id}>
                    {committee.code} - {committee.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Ballot Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Ballot Information
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                type="number"
                label="Total Ballots Cast"
                value={totalBallots || ''}
                onChange={(e) => setTotalBallots(parseInt(e.target.value) || 0)}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                type="number"
                label="Invalid Ballots"
                value={invalidBallots || ''}
                onChange={(e) => setInvalidBallots(parseInt(e.target.value) || 0)}
                inputProps={{ min: 0, max: totalBallots }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField fullWidth label="Valid Ballots" value={validBallots} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField fullWidth label="Votes Entered" value={totalVotesEntered} InputProps={{ readOnly: true }} />
            </Grid>
          </Grid>

          {validBallots > 0 && totalVotesEntered !== validBallots && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Vote count mismatch: Valid ballots ({validBallots}) ≠ Votes entered ({totalVotesEntered})
            </Alert>
          )}

          {validBallots > 0 && totalVotesEntered === validBallots && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Vote count matches! Ready to submit.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Vote Counts Entry */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Enter Vote Counts by Candidate
          </Typography>

          {candidates.length === 0 ? (
            <Alert severity="info">No candidates found for this election.</Alert>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Candidate #</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Party</TableCell>
                    <TableCell align="center" sx={{ width: 150 }}>
                      Vote Count
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {candidates.map((candidate) => {
                    const party = parties.find((p) => p.id === candidate.party);
                    return (
                      <TableRow key={candidate.id}>
                        <TableCell>{candidate.candidate_number}</TableCell>
                        <TableCell>{candidate.elector_name}</TableCell>
                        <TableCell>
                          {party ? (
                            <Chip
                              label={party.name}
                              size="small"
                              sx={{
                                backgroundColor: party.color,
                                color: '#fff'
                              }}
                            />
                          ) : (
                            <Typography variant="caption" color="textSecondary">
                              Independent
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            type="number"
                            size="small"
                            value={voteCounts[candidate.id] || ''}
                            onChange={(e) => handleVoteCountChange(candidate.id, e.target.value)}
                            inputProps={{ min: 0, style: { textAlign: 'center' } }}
                            sx={{ width: 100 }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Notes */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about this vote count entry..."
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button variant="outlined" onClick={handleReset} startIcon={<CancelIcon />}>
          Reset
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          startIcon={<SaveIcon />}
          disabled={loading || !selectedCommittee || totalBallots === 0}
        >
          Submit Vote Counts
        </Button>
      </Stack>
    </Box>
  );
};

export default VoteEntryTab;
