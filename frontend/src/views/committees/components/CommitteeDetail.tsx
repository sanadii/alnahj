/**
 * Committee Detail Page
 * Election Management System - View committee details with electors and statistics
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Card, CardContent, Chip, Grid, Stack, Typography, CircularProgress } from '@mui/material';
import { People as PeopleIcon } from '@mui/icons-material';
import { PremiumCard } from 'shared/components';
import { IconEye, IconEdit } from '@tabler/icons-react';
import { getCommitteeRequest, getCommitteeStatisticsRequest } from 'store/committees';
import { CommitteeGenderLabels, getCommitteeGenderColor } from 'types/elections';

const CommitteeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentCommittee, committeeStatistics, loading } = useSelector((state: any) => state.committees);

  useEffect(() => {
    if (id) {
      dispatch(getCommitteeRequest(parseInt(id)));
      dispatch(getCommitteeStatisticsRequest(parseInt(id)));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <PremiumCard title="Committee Details" icon={<IconEye size={24} />} variant="elevated" color="primary">
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      </PremiumCard>
    );
  }

  if (!currentCommittee) {
    return (
      <PremiumCard title="Committee Details" icon={<IconEye size={24} />} variant="elevated" color="primary">
        <Typography>Committee not found</Typography>
      </PremiumCard>
    );
  }

  return (
    <PremiumCard
      title="Committee Details"
      icon={<IconEye size={24} />}
      variant="elevated"
      color="primary"
      secondary={
        <Button variant="contained" startIcon={<IconEdit size={20} />} onClick={() => navigate(`/committees/edit/${id}`)}>
          Edit Committee
        </Button>
      }
    >
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Basic Information
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Committee Code
                  </Typography>
                  <Typography variant="h6">{currentCommittee.code}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Committee Name
                  </Typography>
                  <Typography variant="body1">{currentCommittee.name}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Gender
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={CommitteeGenderLabels[currentCommittee.gender]}
                      sx={{
                        backgroundColor: getCommitteeGenderColor(currentCommittee.gender),
                        color: 'white',
                        fontWeight: 500
                      }}
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Location
                  </Typography>
                  <Typography variant="body1">{currentCommittee.location || 'Not specified'}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Statistics
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Total Electors
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {currentCommittee.electorCount || 0}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Attendance Count
                  </Typography>
                  <Typography variant="h5" color="success.main">
                    {currentCommittee.attendanceCount || 0}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Assigned Staff
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip icon={<PeopleIcon />} label={currentCommittee.assignedUsers?.length || 0} color="primary" variant="outlined" />
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Statistics */}
        {committeeStatistics && (
          <Grid size={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Detailed Statistics
                </Typography>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h3" color="primary">
                        {committeeStatistics.electorCount || 0}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Total Electors
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h3" color="success.main">
                        {committeeStatistics.attendanceCount || 0}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Attended
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h3" color="info.main">
                        {committeeStatistics.attendancePercentage?.toFixed(1) || 0}%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Attendance Rate
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h3" color="secondary.main">
                        {committeeStatistics.voteCount || 0}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Votes Cast
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Actions */}
        <Grid size={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate('/committees/list')}>
              Back to List
            </Button>
            <Button variant="contained" startIcon={<PeopleIcon />} onClick={() => navigate(`/electors?committee=${id}`)}>
              View Electors
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </PremiumCard>
  );
};

export default CommitteeDetail;
