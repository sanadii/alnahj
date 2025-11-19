/**
 * Premium Elector Edit Dialog
 * Modern dialog for editing elector information
 */

import React, { useState, useEffect } from 'react';

// material-ui
import {
  Dialog,
  DialogContent,
  TextField,
  Grid,
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Alert,
  Chip,
  Paper,
  Divider,
  Stack,
  Fade,
  alpha,
  LinearProgress
} from '@mui/material';

// icons
import { Badge as BadgeIcon, Business as BusinessIcon, Save as SaveIcon } from '@mui/icons-material';
import { IconEdit } from '@tabler/icons-react';

// project imports
import { useAppDispatch } from 'store';
import { updateElectorRequest } from 'store/electors';
import { openSnackbar } from 'store/snackbar/actions';
import type { Elector } from 'types/electors';
import { PremiumDialogHeader, PremiumDialogFooter, EntityInfoCard } from 'shared/components';

// ============================================================================
// INTERFACES
// ============================================================================

interface ElectorEditDialogProps {
  open: boolean;
  elector: Elector | null;
  onClose: (success?: boolean) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

const ElectorEditDialog: React.FC<ElectorEditDialogProps> = ({ open, elector, onClose }) => {
  const dispatch = useAppDispatch();

  // Form state
  const [formData, setFormData] = useState({
    nameFirst: '',
    nameSecond: '',
    nameThird: '',
    nameFourth: '',
    nameFifth: '',
    nameSixth: '',
    fullName: '',
    subFamilyName: '',
    familyName: '',
    gender: 'MALE' as 'MALE' | 'FEMALE',
    mobile: '',
    designation: '',
    section: '',
    area: '',
    department: '',
    team: '',
    extension: '',
    isActive: true
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form when elector changes
  useEffect(() => {
    if (elector) {
      setFormData({
        nameFirst: elector.nameFirst || '',
        nameSecond: elector.nameSecond || '',
        nameThird: elector.nameThird || '',
        nameFourth: elector.nameFourth || '',
        nameFifth: elector.nameFifth || '',
        nameSixth: elector.nameSixth || '',
        fullName: elector.fullName || '',
        subFamilyName: elector.subFamilyName || '',
        familyName: elector.familyName || '',
        gender: elector.gender || 'MALE',
        mobile: elector.mobile || '',
        designation: elector.designation || '',
        section: elector.section || '',
        area: elector.area || '',
        department: elector.department || '',
        team: elector.team || '',
        extension: elector.extension || '',
        isActive: elector.isActive ?? true
      });
    }
  }, [elector]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!elector) return;

    setLoading(true);
    setError(null);

    try {
      // Dispatch update action
      dispatch(updateElectorRequest(elector.kocId, formData));

      // Show success message
      dispatch(
        openSnackbar({
          open: true,
          message: 'Elector updated successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: true
        })
      );

      handleClose(true);
    } catch (err: any) {
      console.error('Failed to update elector:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update elector');
    } finally {
      setLoading(false);
    }
  };

  // Handle close
  const handleClose = (success: boolean = false) => {
    setError(null);
    onClose(success);
  };

  if (!elector) return null;

  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'visible',
          background: 'transparent'
        }
      }}
    >
      <Box
        sx={{
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            animation: 'shimmer 3s ease-in-out infinite',
            '@keyframes shimmer': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.7 }
            }
          }
        }}
      >
        {/* PREMIUM HEADER */}
        <PremiumDialogHeader
          icon={<IconEdit size={32} color="white" />}
          title="Edit Elector"
          subtitle="Update elector information"
          onClose={() => handleClose(false)}
        />

        {loading && <LinearProgress sx={{ height: 3 }} />}

        <DialogContent sx={{ p: 4 }}>
          <Stack spacing={4}>
            {/* ELECTOR INFO CARD */}
            <Fade in={open} timeout={400}>
              <div>
                <EntityInfoCard primaryId={{ label: 'KOC ID', value: elector.kocId }} title={elector.fullName} />
              </div>
            </Fade>

            {error && (
              <Fade in={!!error}>
                <Alert
                  severity="error"
                  onClose={() => setError(null)}
                  sx={{
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
                    '& .MuiAlert-icon': { fontSize: '1.5rem' }
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            <Divider>
              <Chip icon={<BadgeIcon />} label="Name Details" size="small" sx={{ fontWeight: 600 }} />
            </Divider>

            {/* NAME DETAILS */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="Full name"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  label="Sub-Family Name"
                  value={formData.subFamilyName}
                  onChange={(e) => handleChange('subFamilyName', e.target.value)}
                  placeholder="Sub-family name"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  label="Family Name"
                  value={formData.familyName}
                  onChange={(e) => handleChange('familyName', e.target.value)}
                  placeholder="Family name"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  label="Mobile"
                  value={formData.mobile}
                  onChange={(e) => handleChange('mobile', e.target.value)}
                  placeholder="+965XXXXXXXX"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>

            <Divider>
              <Chip icon={<BusinessIcon />} label="Work & Contact Details" size="small" sx={{ fontWeight: 600 }} />
            </Divider>

            {/* CONTACT & WORK INFO */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                  <BusinessIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight={700}>
                    Designation
                  </Typography>
                </Stack>
                <TextField
                  fullWidth
                  value={formData.designation}
                  onChange={(e) => handleChange('designation', e.target.value)}
                  placeholder="Job title"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                  Extension
                </Typography>
                <TextField
                  fullWidth
                  value={formData.extension}
                  onChange={(e) => handleChange('extension', e.target.value)}
                  placeholder="Office extension"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                  Section
                </Typography>
                <TextField
                  fullWidth
                  value={formData.section}
                  onChange={(e) => handleChange('section', e.target.value)}
                  placeholder="Department/Section"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                  Area
                </Typography>
                <TextField
                  fullWidth
                  value={formData.area}
                  onChange={(e) => handleChange('area', e.target.value)}
                  placeholder="Geographic area"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                  Department
                </Typography>
                <TextField
                  fullWidth
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  placeholder="Department name"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                  Team
                </Typography>
                <TextField
                  fullWidth
                  value={formData.team}
                  onChange={(e) => handleChange('team', e.target.value)}
                  placeholder="Team name"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>

            {/* STATUS */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '2px solid',
                borderColor: formData.isActive ? 'success.main' : 'divider',
                borderRadius: 3,
                background: formData.isActive ? (theme) => alpha(theme.palette.success.main, 0.05) : 'transparent',
                transition: 'all 0.3s ease'
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-thumb': {
                        boxShadow: formData.isActive ? '0 0 12px rgba(76, 175, 80, 0.6)' : undefined
                      }
                    }}
                  />
                }
                label={
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box>
                      <Typography fontWeight={700}>Active Status</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formData.isActive ? 'Elector is active and can vote' : 'Elector is inactive'}
                      </Typography>
                    </Box>
                  </Stack>
                }
              />
            </Paper>

          </Stack>
        </DialogContent>

        {/* PREMIUM FOOTER */}
        <PremiumDialogFooter
          onCancel={() => handleClose(false)}
          onSubmit={handleSubmit}
          cancelLabel="Cancel"
          submitLabel="Save Changes"
          loading={loading}
          submitIcon={<SaveIcon />}
        />
      </Box>
    </Dialog>
  );
};

export default ElectorEditDialog;
