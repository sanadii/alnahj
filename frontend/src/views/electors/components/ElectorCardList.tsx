import React from 'react';
import { Stack } from '@mui/material';
import ElectorCard from './ElectorCard';
import type { Elector } from 'types/electors';
import type { GuaranteeStatus } from 'types/guarantees';

interface ElectorCardListProps {
  electors: Elector[];
  addingGuarantee: string | null;
  removingGuarantee: string | null;
  mobileSyncingId?: string | null;
  onAddToGuarantees: (elector: Elector, status: GuaranteeStatus) => void;
  onRemoveFromGuarantees: (elector: Elector) => void;
  onViewElector: (kocId: string) => void;
  onEditElector: (kocId: string) => void;
  onDeleteElector: (kocId: string, name: string) => void;
  onMobileSync?: (elector: Elector) => void;
}

const ElectorCardList: React.FC<ElectorCardListProps> = ({
  electors,
  addingGuarantee,
  removingGuarantee,
  mobileSyncingId,
  onAddToGuarantees,
  onRemoveFromGuarantees,
  onViewElector,
  onEditElector,
  onDeleteElector,
  onMobileSync
}) => {
  return (
    <Stack spacing={2}>
      {electors.map((elector) => (
        <ElectorCard
          key={elector.kocId}
          elector={elector}
          showEditDelete={true}
          onEdit={onEditElector}
          onDelete={onDeleteElector}
          onMobileSync={onMobileSync}
          mobileSyncingId={mobileSyncingId}
          addingGuarantee={addingGuarantee}
          removingGuarantee={removingGuarantee}
          onAddToGuarantees={onAddToGuarantees}
          onRemoveFromGuarantees={onRemoveFromGuarantees}
          onViewElector={onViewElector}
        />
      ))}
    </Stack>
  );
};

export default ElectorCardList;
