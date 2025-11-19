import React from 'react';
import { Stack, CircularProgress, Typography, Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import GuaranteeCard from './GuaranteeCard';
import type { GuaranteeListItem, GuaranteeConfirmationStatus, GuaranteeStatus, GuaranteeGroup } from 'types/guarantees';

interface GuaranteeCardListProps {
  guarantees: GuaranteeListItem[];
  groups: GuaranteeGroup[];
  loading: boolean;
  inlineEdits: Record<number, { mobile?: string; quickNote?: string }>;
  onInlineFieldChange: (guarantee: GuaranteeListItem, field: 'mobile' | 'quickNote', value: string) => void;
  onInlineFieldSave: (guarantee: GuaranteeListItem, field: 'mobile' | 'quickNote') => void;
  onSyncMobileFromElector: (guarantee: GuaranteeListItem) => void;
  onQuickGroupChange: (guaranteeId: number, groupId: string | number) => void;
  onQuickConfirmationChange: (guaranteeId: number, confirmationStatus: GuaranteeConfirmationStatus) => void;
  onQuickGuaranteeStatusChange: (id: number, guaranteeStatus: GuaranteeStatus) => void;
  onViewGuarantee: (guarantee: GuaranteeListItem) => void;
  onDeleteGuarantee: (id: number, name: string) => void;
  onConfirmGuarantee: (guarantee: GuaranteeListItem) => void;
  getInlineFieldValue: (guarantee: GuaranteeListItem, field: 'mobile' | 'quickNote') => string;
  isFieldDirty: (guarantee: GuaranteeListItem, field: 'mobile' | 'quickNote') => boolean;
  getFieldSavedFlash: (guarantee: GuaranteeListItem, field: 'mobile' | 'quickNote') => boolean;
  filters?: { search?: string; guaranteeStatus?: string; group?: string | number };
  onAddGuarantee: () => void;
}

const GuaranteeCardList: React.FC<GuaranteeCardListProps> = ({
  guarantees,
  groups,
  loading,
  inlineEdits,
  onInlineFieldChange,
  onInlineFieldSave,
  onSyncMobileFromElector,
  onQuickGroupChange,
  onQuickConfirmationChange,
  onQuickGuaranteeStatusChange,
  onViewGuarantee,
  onDeleteGuarantee,
  onConfirmGuarantee,
  getInlineFieldValue,
  isFieldDirty,
  getFieldSavedFlash,
  filters,
  onAddGuarantee
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={40} />
          <Typography variant="body2">Loading guarantees...</Typography>
        </Stack>
      </Box>
    );
  }

  if (guarantees.length === 0) {
    return (
      <Box sx={{ py: 5, textAlign: 'center' }}>
        <Typography variant="h5" color="textSecondary" gutterBottom>
          No guarantees found
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          {filters?.search || filters?.guaranteeStatus || filters?.group
            ? 'Try adjusting your search filters'
            : 'Get started by adding guarantees from the list'}
        </Typography>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={onAddGuarantee}>
          Add Guarantee
        </Button>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {guarantees.map((guarantee) => (
        <GuaranteeCard
          key={guarantee.id}
          guarantee={guarantee}
          groups={groups}
          inlineEdits={inlineEdits}
          onInlineFieldChange={onInlineFieldChange}
          onInlineFieldSave={onInlineFieldSave}
          onSyncMobileFromElector={onSyncMobileFromElector}
          onQuickGroupChange={onQuickGroupChange}
          onQuickConfirmationChange={onQuickConfirmationChange}
          onQuickGuaranteeStatusChange={onQuickGuaranteeStatusChange}
          onViewGuarantee={onViewGuarantee}
          onDeleteGuarantee={onDeleteGuarantee}
          onConfirmGuarantee={onConfirmGuarantee}
          getInlineFieldValue={getInlineFieldValue}
          isFieldDirty={isFieldDirty}
          getFieldSavedFlash={getFieldSavedFlash}
        />
      ))}
    </Stack>
  );
};

export default GuaranteeCardList;

