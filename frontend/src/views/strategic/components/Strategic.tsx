import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';

// icons
import {
  IconRefresh,
  IconTargetArrow,
  IconCamera,
  IconShieldCheck,
  IconUsers,
  IconCalendarTime,
  IconRocket,
  IconCheck,
  IconAlertTriangle,
  IconClipboardList,
  IconSparkles,
  IconCircleDashed,
  IconArrowUpRight,
  IconArrowDownRight
} from '@tabler/icons-react';

// project imports
import { PremiumCard, PremiumPageHeader, StatCard, StatCardGradients } from 'shared/components';
import type { HeaderAction } from 'shared/components';
import { RootState } from 'store';
import {
  createStrategicSnapshotRequest,
  getStrategicDataRequest,
  selectStrategicCoverage,
  selectStrategicError,
  selectStrategicFilters,
  selectStrategicLastUpdated,
  selectStrategicLoading,
  selectStrategicOverview,
  selectStrategicRecommendations,
  selectStrategicTrends,
  selectStrategicCharts,
  setStrategicFilters
} from 'store/strategic';
import type { StrategicFocus, StrategicPlanDraft, StrategicTimeRange } from 'types/strategic';

// ========================================================================= //
// Utility Helpers
// ========================================================================= //

const formatNumber = (value?: number) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return '0';
  }

  if (value >= 1000) {
    return value.toLocaleString();
  }

  return Math.round(value).toString();
};

const formatPercentage = (value?: number) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return '0%';
  }

  return `${value.toFixed(1)}%`;
};

const strategicFocusOptions: Array<{ value: StrategicFocus; label: string }> = [
  { value: 'coverage', label: 'Guarantee Coverage' },
  { value: 'budget', label: 'Budget Discipline' },
  { value: 'resources', label: 'Resource Deployment' }
];

// ========================================================================= //
// Component
// ========================================================================= //

const Strategic: React.FC = () => {
  const dispatch = useDispatch();

  const authUser = useSelector((state: RootState) => state.auth?.user);
  const loading = useSelector(selectStrategicLoading);
  const overview = useSelector(selectStrategicOverview);
  const coverage = useSelector(selectStrategicCoverage);
  const trends = useSelector(selectStrategicTrends);
  const charts = useSelector(selectStrategicCharts);
  const filters = useSelector(selectStrategicFilters);
  const recommendations = useSelector(selectStrategicRecommendations);
  const error = useSelector(selectStrategicError);
  const lastUpdated = useSelector(selectStrategicLastUpdated);

  const [planDraft, setPlanDraft] = useState<StrategicPlanDraft>({
    objective: '',
    timeframe: '7 days',
    targetGuarantees: 60,
    budgetAllocation: 10000,
    focusArea: 'coverage',
    notes: '',
    owners: []
  });
  const [planSummary, setPlanSummary] = useState<string[]>([]);

  useEffect(() => {
    dispatch(getStrategicDataRequest());
  }, [dispatch]);

  const guaranteeCoverage = coverage?.summary.coveragePercentage ?? 0;
  const totalGuarantees = overview?.guarantees.total ?? 0;
  const confirmedStrong = overview?.guarantees.strong ?? 0;
  const attendance24h = overview?.attendance.recent24h ?? 0;
  const supervisorCount = overview?.users.supervisors ?? 0;
  const totalUsers = overview?.users.total ?? 0;

  const guaranteeTrend = overview?.trends.guaranteeTrend ?? 0;
  const guaranteeTrendLabel = `${guaranteeTrend >= 0 ? '+' : ''}${guaranteeTrend}`;

  const coverageTrend = trends?.coverage.slice(-2) ?? [];
  const coverageDelta = coverageTrend.length === 2 ? coverageTrend[1] - coverageTrend[0] : 0;
  const coverageDeltaLabel = `${coverageDelta >= 0 ? '+' : ''}${coverageDelta.toFixed(1)}%`;

  const resourceUtilization = useMemo(() => {
    if (!overview) {
      return 0;
    }
    const theoreticalCapacity = Math.max(totalUsers * 75, 1);
    return Math.min(100, (totalGuarantees / theoreticalCapacity) * 100);
  }, [overview, totalGuarantees, totalUsers]);

  const headerActions: HeaderAction[] = useMemo(
    () => [
      {
        icon: <IconRefresh />,
        onClick: () => dispatch(getStrategicDataRequest()),
        tooltip: 'Refresh strategic intelligence',
        type: 'iconButton',
        disabled: loading
      },
      {
        label: 'Capture Snapshot',
        icon: <IconCamera />,
        onClick: () => dispatch(createStrategicSnapshotRequest()),
        variant: 'outlined',
        disabled: loading
      }
    ],
    [dispatch, loading]
  );

  const chips = useMemo(
    () => [
      {
        label: `Coverage ${formatPercentage(guaranteeCoverage)}`,
        background: 'rgba(255, 255, 255, 0.25)'
      },
      {
        label: `Strong ${formatNumber(confirmedStrong)}`,
        background: 'rgba(76, 175, 80, 0.3)'
      },
      {
        label: `24h Momentum ${guaranteeTrendLabel}`,
        background: 'rgba(255, 255, 255, 0.15)'
      }
    ],
    [guaranteeCoverage, confirmedStrong, guaranteeTrendLabel]
  );

  const guaranteeDistributionData = useMemo(() => {
    if (!charts.guaranteeDistribution || !charts.guaranteeDistribution.datasets?.length) {
      return [];
    }
    const dataset = charts.guaranteeDistribution.datasets[0];
    return charts.guaranteeDistribution.labels.map((label: string, index: number) => {
      const value = dataset.data?.[index] ?? 0;
      const percentage = charts.guaranteeDistribution.options?.percentages?.[index] ?? 0;
      return {
        label,
        value,
        percentage: typeof percentage === 'number' ? percentage : 0
      };
    });
  }, [charts.guaranteeDistribution]);

  const committeeInsights = useMemo(() => {
    if (!coverage?.byCommittee?.length) {
      return [];
    }

    return [...coverage.byCommittee].sort((a, b) => a.coveragePercentage - b.coveragePercentage).slice(0, 5);
  }, [coverage?.byCommittee]);

  const handleTimeRangeChange = (value: StrategicTimeRange) => {
    dispatch(setStrategicFilters({ timeRange: value }));
    dispatch(getStrategicDataRequest({ timeRange: value }));
  };

  const handleFocusChange = (value: StrategicFocus) => {
    dispatch(setStrategicFilters({ focus: value }));
  };

  const handlePlanFieldChange = (field: keyof StrategicPlanDraft, value: any) => {
    setPlanDraft((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGeneratePlan = () => {
    const summary: string[] = [];
    summary.push(`Objective: ${planDraft.objective || 'Increase guarantees'}`);
    summary.push(`Focus: ${strategicFocusOptions.find((option) => option.value === planDraft.focusArea)?.label}`);
    summary.push(`Timeframe: ${planDraft.timeframe}`);
    summary.push(`Target Guarantees: ${planDraft.targetGuarantees.toLocaleString()}`);
    summary.push(`Budget Allocation: ${planDraft.budgetAllocation.toLocaleString()} KWD`);

    if (planDraft.focusArea === 'coverage' && committeeInsights.length) {
      summary.push(`Priority Committees: ${committeeInsights.map((item) => item.committeeCode).join(', ')}`);
    }
    if (planDraft.focusArea === 'resources') {
      summary.push('Action: Reassign supervisors to high impact teams and activate volunteer reserve.');
    }
    if (planDraft.focusArea === 'budget') {
      summary.push('Action: Track spend daily and trigger variance alerts beyond ±5%.');
    }

    if (planDraft.notes) {
      summary.push(`Notes: ${planDraft.notes}`);
    }

    setPlanSummary(summary);
  };

  const renderLoadingState = () => (
    <PremiumCard title="Strategic Command Center" variant="elevated" color="primary">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 4 }}>
        <LinearProgress sx={{ width: '60%' }} />
        <Typography variant="h6" color="textSecondary">
          Building strategic intelligence...
        </Typography>
      </Box>
    </PremiumCard>
  );

  if (loading && !overview) {
    return renderLoadingState();
  }

  const role = authUser?.role || authUser?.user?.role;
  const isAuthorized = !role || role === 'ADMIN' || role === 'SUPER_ADMIN';

  if (!isAuthorized) {
    return (
      <PremiumCard variant="elevated" hover={false} padding={0}>
        <PremiumPageHeader
          title="Strategic Command Center"
          subtitle="Restricted to executive leadership"
          icon={<IconTargetArrow />}
          actions={[]}
          chips={[{ label: 'Access Denied', background: 'rgba(244, 67, 54, 0.25)' }]}
        />
        <Box sx={{ p: 4 }}>
          <Alert severity="warning" icon={<IconAlertTriangle size={20} />}>
            <Typography variant="h6" gutterBottom>
              Elevated permissions required
            </Typography>
            <Typography variant="body2">
              The Strategic Command Center is reserved for system administrators. Contact leadership to obtain the necessary permissions.
            </Typography>
          </Alert>
        </Box>
      </PremiumCard>
    );
  }

  return (
    <Box>
      <PremiumCard variant="elevated" hover={false} padding={0}>
        <PremiumPageHeader
          title="Strategic Command Center"
          subtitle="Executive mission control for guarantees, resources, and decisive campaign outcomes"
          icon={<IconTargetArrow />}
          actions={headerActions}
          chips={chips}
        />

        <Box sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                variant="outlined"
                icon={<IconCalendarTime size={16} />}
                label={`Last updated ${lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : '—'}`}
              />
              <Chip variant="outlined" icon={<IconCircleDashed size={16} />} label={`Time Horizon: ${filters.timeRange}`} />
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField
                select
                size="small"
                label="Time Range"
                value={filters.timeRange}
                onChange={(event) => handleTimeRangeChange(event.target.value as StrategicTimeRange)}
              >
                <MenuItem value="7days">Last 7 days</MenuItem>
                <MenuItem value="30days">Last 30 days</MenuItem>
                <MenuItem value="90days">Last 90 days</MenuItem>
              </TextField>
              <TextField
                select
                size="small"
                label="Focus"
                value={filters.focus}
                onChange={(event) => handleFocusChange(event.target.value as StrategicFocus)}
              >
                {strategicFocusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Stack>

          {/* KPI Section */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <StatCard
                icon={<IconTargetArrow size={26} />}
                value={formatPercentage(guaranteeCoverage)}
                label="Guarantee Coverage"
                gradient={StatCardGradients.info}
                trend={{ value: coverageDeltaLabel, isPositive: coverageDelta >= 0 }}
                subtitle="Target ≥ 80%"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard
                icon={<IconShieldCheck size={26} />}
                value={formatNumber(confirmedStrong)}
                label="Confirmed Strong Guarantees"
                gradient={StatCardGradients.success}
                trend={{ value: guaranteeTrendLabel, isPositive: guaranteeTrend >= 0 }}
                subtitle="Net gain last 24h"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard
                icon={<IconCalendarTime size={26} />}
                value={formatNumber(attendance24h)}
                label="Attendance Touchpoints (24h)"
                gradient={StatCardGradients.primary}
                subtitle="Follow-up conversions"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard
                icon={<IconUsers size={26} />}
                value={`${resourceUtilization.toFixed(0)}%`}
                label="Resource Utilization"
                gradient={StatCardGradients.warning}
                subtitle={`${formatNumber(supervisorCount)} supervisors active`}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Coverage Intelligence */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight={700}>
                      Coverage Intelligence
                    </Typography>
                    <Chip
                      size="small"
                      label={`Overall ${formatPercentage(guaranteeCoverage)}`}
                      color={guaranteeCoverage >= 80 ? 'success' : 'warning'}
                    />
                  </Stack>

                  <List disablePadding>
                    {guaranteeDistributionData.map((item) => (
                      <ListItem key={item.label} disableGutters sx={{ alignItems: 'center' }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <IconShieldCheck size={18} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" fontWeight={600}>
                              {item.label}
                            </Typography>
                          }
                          secondary={`${formatNumber(item.value)} • ${item.percentage.toFixed(1)}%`}
                        />
                        <Box sx={{ width: 120, ml: 2 }}>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(item.percentage, 100)}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      </ListItem>
                    ))}
                    {!guaranteeDistributionData.length && (
                      <Typography variant="body2" color="textSecondary">
                        Distribution data not available yet.
                      </Typography>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Risk Radar */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight={700}>
                      Risk Radar
                    </Typography>
                    <Chip
                      size="small"
                      color={committeeInsights.length ? 'warning' : 'success'}
                      label={committeeInsights.length ? `${committeeInsights.length} gaps` : 'Healthy'}
                    />
                  </Stack>

                  {committeeInsights.length ? (
                    <List disablePadding>
                      {committeeInsights.map((item) => (
                        <ListItem key={item.committeeCode} disableGutters sx={{ alignItems: 'flex-start', pb: 1.5 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <IconAlertTriangle size={18} color="#ff9800" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2" fontWeight={700}>
                                {item.committeeCode} • {formatPercentage(item.coveragePercentage)}
                              </Typography>
                            }
                            secondary={`Covered ${formatNumber(item.covered)} of ${formatNumber(item.totalElectors)} electors • Uncovered ${formatNumber(
                              item.uncovered
                            )}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No committees are currently below the strategic threshold.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Momentum Tracker */}
            <Grid item xs={12} md={8}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="h6" fontWeight={700}>
                      Momentum Tracker
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        size="small"
                        icon={coverageDelta >= 0 ? <IconArrowUpRight size={14} /> : <IconArrowDownRight size={14} />}
                        label={`Coverage Δ ${coverageDeltaLabel}`}
                        color={coverageDelta >= 0 ? 'success' : 'error'}
                      />
                      <Chip
                        size="small"
                        icon={<IconRocket size={14} />}
                        label={`24h Net ${guaranteeTrendLabel}`}
                        color={guaranteeTrend >= 0 ? 'success' : 'error'}
                      />
                    </Stack>
                  </Stack>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Track guarantee and attendance momentum across the selected time horizon. Use these deltas to decide deployment timing.
                  </Typography>
                  {trends && trends.dates.length ? (
                    <Box sx={{ maxHeight: 260, overflow: 'hidden' }}>
                      <Stack spacing={1.5}>
                        {trends.dates.slice(-10).map((date, index) => (
                          <Box key={date} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="caption" sx={{ minWidth: 80, color: 'text.secondary' }}>
                              {new Date(date).toLocaleDateString()}
                            </Typography>
                            <Box sx={{ flex: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min((trends.guarantees.slice(-10)[index] / Math.max(totalGuarantees, 1)) * 100, 100)}
                                sx={{
                                  height: 6,
                                  borderRadius: 999,
                                  backgroundColor: 'rgba(102, 126, 234, 0.15)',
                                  '& .MuiLinearProgress-bar': { backgroundColor: '#667eea' }
                                }}
                              />
                            </Box>
                            <Typography variant="caption" sx={{ width: 90, textAlign: 'right' }}>
                              {formatNumber(trends.guarantees.slice(-10)[index])} guarantees
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Trend analytics not available yet.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Strategic Recommendations */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="h6" fontWeight={700}>
                      Strategic Recommendations
                    </Typography>
                    <Tooltip title="Recommendations adapt to focus filters and live data">
                      <Chip size="small" icon={<IconSparkles size={14} />} label="Auto" />
                    </Tooltip>
                  </Stack>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={2}>
                    {recommendations.length ? (
                      recommendations.map((item) => (
                        <Box
                          key={item.id}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: 'rgba(102, 126, 234, 0.08)',
                            border: '1px solid rgba(102, 126, 234, 0.15)'
                          }}
                        >
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <Chip
                              size="small"
                              color={item.priority === 'critical' ? 'error' : item.priority === 'high' ? 'warning' : 'default'}
                              label={item.priority.toUpperCase()}
                            />
                            <Typography variant="subtitle1" fontWeight={700}>
                              {item.title}
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                            {item.description}
                          </Typography>
                          <List dense sx={{ pl: 1 }}>
                            {item.actions.map((action) => (
                              <ListItem key={action} disableGutters sx={{ alignItems: 'flex-start', py: 0.25 }}>
                                <ListItemIcon sx={{ minWidth: 28, mt: 0.3 }}>
                                  <IconCheck size={16} />
                                </ListItemIcon>
                                <ListItemText primary={<Typography variant="body2">{action}</Typography>} />
                              </ListItem>
                            ))}
                          </List>
                          {item.targetCommittees && (
                            <Chip size="small" variant="outlined" label={`Target: ${item.targetCommittees.join(', ')}`} sx={{ mt: 1 }} />
                          )}
                          {item.expectedImpact && (
                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                              Expected Impact: {item.expectedImpact}
                            </Typography>
                          )}
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Awaiting data to generate mission-critical recommendations.
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Strategic Planner */}
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6" fontWeight={700}>
                    Custom Strategic Plan Builder
                  </Typography>
                  <Button variant="contained" startIcon={<IconClipboardList />} onClick={handleGeneratePlan}>
                    Generate Action Outline
                  </Button>
                </Stack>
                <Typography variant="body2" color="textSecondary">
                  Draft a tailored plan for rapid execution. Adjust objectives, timelines, and resource allocation—then push to teams via
                  existing modules.
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Strategic Objective"
                      value={planDraft.objective}
                      onChange={(event) => handlePlanFieldChange('objective', event.target.value)}
                      placeholder="E.g. Secure 1200 confirmed guarantees"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Timeframe"
                      value={planDraft.timeframe}
                      onChange={(event) => handlePlanFieldChange('timeframe', event.target.value)}
                      placeholder="E.g. 10 days"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      select
                      label="Focus Area"
                      value={planDraft.focusArea}
                      onChange={(event) => handlePlanFieldChange('focusArea', event.target.value as StrategicFocus)}
                      fullWidth
                    >
                      {strategicFocusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Target Guarantees"
                      type="number"
                      value={planDraft.targetGuarantees}
                      onChange={(event) => handlePlanFieldChange('targetGuarantees', Number(event.target.value))}
                      InputProps={{ inputProps: { min: 10, step: 10 } }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Budget Allocation (KWD)"
                      type="number"
                      value={planDraft.budgetAllocation}
                      onChange={(event) => handlePlanFieldChange('budgetAllocation', Number(event.target.value))}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconTargetArrow size={16} />
                          </InputAdornment>
                        ),
                        inputProps: { min: 0, step: 1000 }
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Key Stakeholders"
                      placeholder="Comma separated names"
                      value={planDraft.owners.join(', ')}
                      onChange={(event) =>
                        handlePlanFieldChange(
                          'owners',
                          event.target.value
                            .split(',')
                            .map((item) => item.trim())
                            .filter(Boolean)
                        )
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Notes & Risks"
                      value={planDraft.notes}
                      onChange={(event) => handlePlanFieldChange('notes', event.target.value)}
                      placeholder="Add context, risks, or key dependencies..."
                      fullWidth
                      multiline
                      rows={3}
                    />
                  </Grid>
                </Grid>

                {planSummary.length > 0 && (
                  <Box
                    sx={{ mt: 1, p: 2, borderRadius: 2, bgcolor: 'rgba(76, 175, 80, 0.08)', border: '1px solid rgba(76, 175, 80, 0.2)' }}
                  >
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                      Action Outline
                    </Typography>
                    <List dense>
                      {planSummary.map((line) => (
                        <ListItem key={line} disableGutters sx={{ py: 0.25 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <IconCheck size={16} />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">{line}</Typography>} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button variant="outlined" color="secondary" href="/guarantees">
                    Open Guarantees
                  </Button>
                  <Button variant="outlined" color="secondary" href="/attendance">
                    Monitor Attendance
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => dispatch(createStrategicSnapshotRequest())}
                    startIcon={<IconCamera size={16} />}
                  >
                    Export Snapshot
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </PremiumCard>
    </Box>
  );
};

export default Strategic;
