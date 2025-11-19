import PropTypes from 'prop-types';
import React from 'react';
import { Dialog, DialogContent, Button, Box, Typography } from '@mui/material';

interface DeleteModalProps {
  show: boolean;
  onDeleteClick: () => void;
  onCloseClick: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ show, onDeleteClick, onCloseClick }) => {
  return (
    <Dialog open={show} onClose={onCloseClick} maxWidth="sm" fullWidth>
      <DialogContent sx={{ py: 3, px: 5 }}>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <i className="ri-delete-bin-line display-5 text-danger"></i>
          <Box sx={{ mt: 4, pt: 2, fontSize: 15, mx: { xs: 4, sm: 5 } }}>
            <Typography variant="h6" component="h4">
              Are you sure?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mx: 4, mb: 0 }}>
              Are you sure you want to remove this record?
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4, mb: 2 }}>
          <Button variant="outlined" onClick={onCloseClick} sx={{ minWidth: 100 }}>
            Close
          </Button>
          <Button variant="contained" color="error" onClick={onDeleteClick} sx={{ minWidth: 100 }}>
            Yes, Delete It!
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

DeleteModal.propTypes = {
  onCloseClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  show: PropTypes.any
};

export default DeleteModal;
