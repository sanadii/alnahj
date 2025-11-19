import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';

interface TableContainerHeaderProps {
  title?: string;
  HandlePrimaryButton?: () => void;
  HandleSecondaryButton?: () => void;
  HandleTertiaryButton?: () => void;
  PrimaryButtonText?: string;
  SecondaryButtonText?: string;
  TertiaryButtonText?: string;
  AddButtonText?: string;
  handleEntryClick?: () => void;
  handleAddButtonClick?: (modalType: string) => void;
  setDeleteModalMulti?: (value: boolean) => void;
}

const TableContainerHeader: React.FC<TableContainerHeaderProps> = ({
  title,
  HandlePrimaryButton,
  HandleSecondaryButton,
  HandleTertiaryButton,
  PrimaryButtonText,
  SecondaryButtonText,
  TertiaryButtonText,
  AddButtonText,
  handleEntryClick,
  handleAddButtonClick,
  setDeleteModalMulti
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h4">
          <strong>{title}</strong>
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {HandlePrimaryButton && (
            <Button
              variant="contained"
              color="primary"
              onClick={HandlePrimaryButton}
              startIcon={<i className="mdi mdi-plus-circle-outline" />}
            >
              {PrimaryButtonText}
            </Button>
          )}

          {HandleSecondaryButton && (
            <Button
              variant="contained"
              color="error"
              onClick={HandleSecondaryButton}
              startIcon={<i className="mdi mdi-plus-circle-outline" />}
            >
              {SecondaryButtonText}
            </Button>
          )}

          {HandleTertiaryButton && (
            <Button
              variant="contained"
              color="success"
              onClick={HandleTertiaryButton}
              startIcon={<i className="mdi mdi-plus-circle-outline" />}
            >
              {TertiaryButtonText}
            </Button>
          )}

          {handleEntryClick && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleEntryClick}
              startIcon={<i className="mdi mdi-plus-circle-outline" />}
            >
              {AddButtonText}
            </Button>
          )}

          {handleAddButtonClick && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAddButtonClick('AddModal')}
              startIcon={<i className="ri-add-line" />}
            >
              {AddButtonText}
            </Button>
          )}

          {setDeleteModalMulti && (
            <Button variant="outlined" color="error" onClick={() => setDeleteModalMulti(true)}>
              <i className="ri-delete-bin-2-line"></i>
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TableContainerHeader;
