import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, MenuItem, Checkbox, FormControlLabel } from '@mui/material';

interface Props {
  open: boolean;
  formData: any;
  isSaving: boolean;
  onClose: () => void;
  onSave: () => void;
  onChange: (field: any, value: any) => void;
}

const EditElectionDialog: React.FC<Props> = ({ open, formData, isSaving, onClose, onSave, onChange }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Election</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField label="Name" value={formData?.name || ''} onChange={(e) => onChange('name', e.target.value)} fullWidth />
          <TextField label="Description" value={formData?.description || ''} onChange={(e) => onChange('description', e.target.value)} fullWidth />
          <TextField label="Election Date" type="date" value={formData?.electionDate || ''} onChange={(e) => onChange('electionDate', e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField select label="Voting Mode" value={formData?.votingMode || ''} onChange={(e) => onChange('votingMode', e.target.value)}>
            <MenuItem value="BOTH">BOTH</MenuItem>
            <MenuItem value="CANDIDATE_ONLY">CANDIDATE_ONLY</MenuItem>
            <MenuItem value="PARTY_ONLY">PARTY_ONLY</MenuItem>
          </TextField>
          <TextField label="Max Candidates Per Ballot" type="number" value={formData?.maxCandidatesPerBallot ?? ''} onChange={(e) => onChange('maxCandidatesPerBallot', Number(e.target.value))} />
          <TextField label="Minimum Votes Required" type="number" value={formData?.minimumVotesRequired ?? ''} onChange={(e) => onChange('minimumVotesRequired', Number(e.target.value))} />
          <FormControlLabel control={<Checkbox checked={!!formData?.allowPartialVoting} onChange={(e) => onChange('allowPartialVoting', e.target.checked)} />} label="Allow Partial Voting" />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={ () => onClose() }>Cancel</Button>
        <Button variant="contained" onClick={onSave} disabled={isSaving}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditElectionDialog;


