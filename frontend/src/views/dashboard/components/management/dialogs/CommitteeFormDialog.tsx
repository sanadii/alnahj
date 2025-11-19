import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, MenuItem } from '@mui/material';

interface Props {
  open: boolean;
  mode: 'add' | 'edit' | 'view';
  formData: any;
  onClose: () => void;
  onSave: () => void;
  onChange: (field: any, value: any) => void;
}

const CommitteeFormDialog: React.FC<Props> = ({ open, mode, formData, onClose, onSave, onChange }) => {
  const readOnly = mode === 'view';
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === 'add' ? 'Add Committee' : mode === 'edit' ? 'Edit Committee' : 'Committee Details'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField label="Code" value={formData?.code || ''} onChange={(e) => onChange('code', e.target.value)} disabled={readOnly} />
          <TextField label="Name" value={formData?.name || ''} onChange={(e) => onChange('name', e.target.value)} disabled={readOnly} />
          <TextField
            label="Gender"
            select
            value={formData?.gender || 'MALE'}
            onChange={(e) => onChange('gender', e.target.value)}
            disabled={readOnly}
          >
            <MenuItem value="MALE">MALE</MenuItem>
            <MenuItem value="FEMALE">FEMALE</MenuItem>
            <MenuItem value="MIXED">MIXED</MenuItem>
          </TextField>
          <TextField label="Location" value={formData?.location || ''} onChange={(e) => onChange('location', e.target.value)} disabled={readOnly} />
          <TextField
            label="Electors From"
            type="number"
            value={formData?.electorsFrom || ''}
            onChange={(e) => onChange('electorsFrom', e.target.value)}
            disabled={readOnly}
          />
          <TextField
            label="Electors To"
            type="number"
            value={formData?.electorsTo || ''}
            onChange={(e) => onChange('electorsTo', e.target.value)}
            disabled={readOnly}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {!readOnly && (
          <Button variant="contained" onClick={onSave}>
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CommitteeFormDialog;


