import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';

interface Props {
  open: boolean;
  committees: any[];
  selectedCommittee: number | null;
  isAssigning: boolean;
  onCommitteeChange: (id: number | null) => void;
  onAssign: () => void;
  onClose: () => void;
}

const AssignToCommitteeDialog: React.FC<Props> = ({ open, committees, selectedCommittee, isAssigning, onCommitteeChange, onAssign, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Assign to Committee</DialogTitle>
      <DialogContent dividers>
        <TextField
          select
          fullWidth
          label="Committee"
          value={selectedCommittee ?? ''}
          onChange={(e) => onCommitteeChange(e.target.value ? Number(e.target.value) : null)}
        >
          <MenuItem value="">Select…</MenuItem>
          {committees?.map((c: any) => (
            <MenuItem key={c.id} value={c.id}>
              {c.code} — {c.name}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isAssigning}>
          Cancel
        </Button>
        <Button onClick={onAssign} variant="contained" disabled={isAssigning || !selectedCommittee}>
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignToCommitteeDialog;


