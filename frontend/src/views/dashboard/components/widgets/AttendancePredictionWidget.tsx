/**
 * Attendance Prediction Widget
 * Predicts final attendance based on current trends
 */

import React from 'react';
import { Paper, Typography, Box, Stack, LinearProgress, Chip } from '@mui/material';
import { IconTrendingUp, IconAlertTriangle, IconCheck, IconClock } from '@tabler/icons-react';
import { useTheme } from '@mui/material/styles';
import { linearRegression } from 'utils/statistics/calculations';

interface AttendancePredictionWidgetProps {
  currentAttendance: number;
  totalElectors: number;
  targetPercentage?: number;
  timeData?: Array<{ minutesElapsed: number; attendanceCount: number }>;
  totalMinutes?: number;
}

export const AttendancePredictionWidget: React.FC<AttendancePredictionWidgetProps> = ({
  currentAttendance,
  totalElectors,
  targetPercentage = 75,
  timeData = [],
  totalMinutes = 480 // 8 hours default
}) => {
  const theme = useTheme();

  const targetCount = Math.round((totalElectors * targetPercentage) / 100);

  // Calculate prediction if we have time series data
  const prediction = React.useMemo(() => {
    if (timeData.length < 3) {
      // Not enough data for prediction
      return {
        predictedFinal: currentAttendance,
        confidence: 0,
        willMeetTarget: false,
        gap: targetCount - currentAttendance
      };
    }

    const xValues = timeData.map((d) => d.minutesElapsed);
    const yValues = timeData.map((d) => d.attendanceCount);

    const model = linearRegression(xValues, yValues);
    const predictedFinal = Math.min(totalElectors, Math.max(0, Math.round(model.predict(totalMinutes))));
    const confidence = Math.round(model.rSquared * 100);
    const willMeetTarget = predictedFinal >= targetCount;
    const gap = targetCount - predictedFinal;

    return {
      predictedFinal,
      confidence,
      willMeetTarget,
      gap
    };
  }, [timeData, totalMinutes, targetCount, currentAttendance, totalElectors]);

  const predictedPercentage = totalElectors > 0 ? (prediction.predictedFinal / totalElectors) * 100 : 0;

  const getStatusColor = () => {
    if (prediction.willMeetTarget) return 'success';
    if (Math.abs(prediction.gap) <= totalElectors * 0.05) return 'warning'; // Within 5%
    return 'error';
  };

  const statusColor = getStatusColor();

  const getRecommendation = () => {
    if (prediction.willMeetTarget) {
      return '🎉 On track! Maintain current pace to exceed target.';
    }

    if (prediction.gap > 0) {
      const required = prediction.gap;
      return `📊 Need ${required} more attendees to meet target. Increase pace by contacting guaranteed electors.`;
    }

    return '✅ Target will be exceeded!';
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        border: '2px solid',
        borderColor: `${statusColor}.main`,
        background: `linear-gradient(135deg, ${theme.palette[statusColor].light} 0%, ${theme.palette[statusColor].lighter} 100%)`
      }}
    >
      <Stack spacing={2.5}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <IconTrendingUp size={28} color={theme.palette[statusColor].main} />
          <Box>
            <Typography variant="h5" fontWeight={700} color={`${statusColor}.dark`}>
              Attendance Forecast
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Based on current trend analysis
            </Typography>
          </Box>
        </Stack>

        {/* Prediction Display */}
        <Box sx={{ textAlign: 'center', py: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h2" fontWeight={700} color={`${statusColor}.main`}>
            {prediction.predictedFinal.toLocaleString()}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 0.5 }}>
            Predicted Final Attendance ({predictedPercentage.toFixed(1)}%)
          </Typography>
          {prediction.confidence > 0 && (
            <Chip
              label={`${prediction.confidence}% Confidence`}
              size="small"
              sx={{ mt: 1 }}
              color={prediction.confidence >= 80 ? 'success' : prediction.confidence >= 60 ? 'warning' : 'default'}
            />
          )}
        </Box>

        {/* Progress Comparison */}
        <Box>
          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between" sx={{ px: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Current
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {currentAttendance.toLocaleString()} ({((currentAttendance / totalElectors) * 100).toFixed(1)}%)
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" sx={{ px: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Predicted
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {prediction.predictedFinal.toLocaleString()} ({predictedPercentage.toFixed(1)}%)
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" sx={{ px: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Target
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {targetCount.toLocaleString()} ({targetPercentage.toFixed(1)}%)
              </Typography>
            </Stack>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={Math.min(100, (prediction.predictedFinal / targetCount) * 100)}
            color={statusColor}
            sx={{ height: 10, borderRadius: 2, mt: 2 }}
          />
        </Box>

        {/* Status & Recommendation */}
        <Paper
          sx={{
            p: 2,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper'
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            {prediction.willMeetTarget ? (
              <IconCheck size={22} color={theme.palette.success.main} />
            ) : (
              <IconAlertTriangle size={22} color={theme.palette.warning.main} />
            )}
            <Box>
              <Typography variant="body2" fontWeight={700} color="text.primary">
                {prediction.willMeetTarget ? 'On Track!' : 'Action Needed'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {getRecommendation()}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Model Info */}
        {prediction.confidence > 0 && (
          <Stack direction="row" spacing={2} justifyContent="center">
            <Chip icon={<IconClock size={14} />} label={`Based on ${timeData.length} data points`} size="small" variant="outlined" />
            <Chip label={`Linear regression model`} size="small" variant="outlined" />
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export default AttendancePredictionWidget;
