import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Box,
  Typography,
  Autocomplete,
  CircularProgress,
  Alert
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { createGuaranteeRequest } from 'store/guarantees';
import { searchElectors } from 'helpers/api/guarantees';
import type { Elector } from 'types/electors';
import type { GuaranteeStatus } from 'types/guarantees';

interface AddGuaranteeDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddGuaranteeDialog: React.FC<AddGuaranteeDialogProps> = ({ open, onClose, onSuccess }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const groups = useAppSelector((state) => state.guarantees?.groups || []);

  const [selectedElector, setSelectedElector] = useState<Elector | null>(null);
  const [guaranteeStatus, setGuaranteeStatus] = useState<GuaranteeStatus>('PENDING');
  const [groupId, setGroupId] = useState<number | null>(null);
  const [mobile, setMobile] = useState('');
  const [quickNote, setQuickNote] = useState('');

  const [electorSearchQuery, setElectorSearchQuery] = useState('');
  const [electorOptions, setElectorOptions] = useState<Elector[]>([]);
  const [electorLoading, setElectorLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setGroupId(null);
      setQuickNote('');
      setMobile(selectedElector?.mobile || '');
    } else {
      setSelectedElector(null);
      setElectorOptions([]);
      setElectorSearchQuery('');
      setMobile('');
    }
  }, [open, selectedElector]);

  const handleElectorSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setElectorOptions([]);
      return;
    }

    setElectorLoading(true);
    try {
      const response = await searchElectors(query);
      setElectorOptions(response.data);
    } catch (error) {
      console.error('Failed to search electors', error);
      setElectorOptions([]);
    } finally {
      setElectorLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedElector(null);
    setElectorOptions([]);
    setElectorSearchQuery('');
    setQuickNote('');
    setMobile('');
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedElector) {
      return;
    }

    dispatch(
      createGuaranteeRequest({
        elector: selectedElector.kocId || selectedElector.id,
        guaranteeStatus,
        group: groupId,
        quick_note: quickNote || undefined,
        mobile: mobile || undefined
      })
    );

    onSuccess();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: '#fff',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)'
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h4" fontWeight={700}>
          Add Guarantee
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Search for an elector and capture their guarantee details.
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2.5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              fullWidth
              options={electorOptions}
              getOptionLabel={(option) => `${option.fullName} (${option.kocId})`}
              value={selectedElector}
              loading={electorLoading}
              onChange={(_event, value) => setSelectedElector(value)}
              inputValue={electorSearchQuery}
              onInputChange={(_event, newValue) => {
                setElectorSearchQuery(newValue);
                handleElectorSearch(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Elector"
                  placeholder="Type name, mobile, or KOC ID"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {electorLoading ? <CircularProgress size={18} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Guarantee Status"
              value={guaranteeStatus}
              onChange={(event) => setGuaranteeStatus(event.target.value as GuaranteeStatus)}
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="GUARANTEED">Guaranteed</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Group (Optional)"
              value={groupId ?? ''}
              onChange={(event) => setGroupId(event.target.value ? Number(event.target.value) : null)}
            >
              <MenuItem value="">None</MenuItem>
              {groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: group.color
                      }}
                    />
                    {group.name}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Quick Note"
              value={quickNote}
              onChange={(event) => setQuickNote(event.target.value)}
              placeholder="Optional reminder or context for this guarantee"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Contact Phone"
              value={mobile}
              onChange={(event) => setMobile(event.target.value)}
              placeholder="Phone number for follow-ups"
            />
          </Grid>

          <Grid item xs={12}>
            <Alert severity="info" sx={{ borderRadius: 2, backgroundColor: alpha(theme.palette.info.light, 0.12) }}>
              Only electors not already in your guarantee list can be added.
            </Alert>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!selectedElector}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)'
            }
          }}
        >
          Add Guarantee
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddGuaranteeDialog;

