/**
 * QuickAddElectorDialog
 * Quick form to add a new elector when not found during attendance
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, TextField, Stack, Alert, Typography } from '@mui/material';
import { IconUserPlus } from '@tabler/icons-react';
import { PremiumDialogHeader, PremiumDialogFooter } from 'shared/components';

interface QuickAddElectorDialogProps {
  open: boolean;
  kocId: string;
  committeeCode: string;
  onClose: () => void;
  onAdd: (electorData: any) => void;
  loading?: boolean;
}

const QuickAddElectorDialog: React.FC<QuickAddElectorDialogProps> = ({
  open,
  kocId,
  committeeCode,
  onClose,
  onAdd,
  loading = false
}) => {
  const [fullName, setFullName] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    onAdd({
      koc_id: kocId,
      full_name: fullName.trim(),
      committee_code: committeeCode,
      notes: notes.trim()
    });
  };

  const isValid = fullName.trim().length >= 2;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <PremiumDialogHeader
        icon={<IconUserPlus size={32} color="white" />}
        title="Add New Elector"
        subtitle={`Pending approval • Committee: ${committeeCode}`}
        onClose={onClose}
        gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
      />

      <DialogContent sx={{ pt: 3 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            This elector will be added as <strong>pending</strong> and requires admin approval.
            <br />
            Will be assigned to committee: <strong>{committeeCode}</strong>
          </Typography>
        </Alert>

        <Stack spacing={2.5}>
          {/* KOC ID (Read-only) */}
          <TextField label="KOC ID" value={kocId} disabled fullWidth helperText="Automatically filled from search" />

          {/* Committee (Read-only) */}
          <TextField label="Committee" value={committeeCode} disabled fullWidth helperText="Will be assigned to this committee" />

          {/* Full Name */}
          <TextField
            label="Full Name *"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter full name (e.g., أحمد محمد علي الخالدي)"
            fullWidth
            autoFocus
            required
            helperText="Family name will be extracted from the last word"
          />

          {/* Notes */}
          <TextField
            label="Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special notes or observations..."
            fullWidth
            multiline
            rows={3}
          />
        </Stack>

        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="caption">
            <strong>Note:</strong> This elector will be assigned to committee <strong>{committeeCode}</strong> and marked as{' '}
            <strong>pending approval</strong>. An admin must approve before they can vote.
          </Typography>
        </Alert>
      </DialogContent>

      <PremiumDialogFooter
        onCancel={onClose}
        onSubmit={handleSubmit}
        cancelLabel="Cancel"
        submitLabel={loading ? 'Adding Elector...' : 'Add Elector'}
        loading={loading}
        submitDisabled={!isValid || loading}
        submitIcon={<IconUserPlus />}
        submitGradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
      />
    </Dialog>
  );
};

export default QuickAddElectorDialog;
