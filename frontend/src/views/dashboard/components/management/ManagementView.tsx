import React from 'react';
import { Box, Stack, Tabs, Tab, Tooltip, IconButton } from '@mui/material';
import { IconEdit, IconFlag, IconUserCheck, IconUsersGroup, IconUser } from '@tabler/icons-react';
import TabPanel from '../shared/TabPanel';
import PartiesTab from './tabs/PartiesTab';
import CandidatesTab from './tabs/CandidatesTab';
import CommitteesTab from './tabs/CommitteesTab';
import UsersTab from './tabs/UsersTab';

interface ManagementViewProps {
  // state
  tabValue: number;
  parties: any[];
  candidates: any[];
  committees: any[];
  users: any[];
  loadingUsers: boolean;

  // actions
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  onOpenEditElectionDialog: () => void;

  // Parties
  onAddParty: () => void;
  onViewParty: (partyId: number) => void;
  onEditParty: (partyId: number) => void;
  onDeleteParty: (partyId: number, partyName: string) => void;

  // Candidates
  onAddCandidate: () => void;
  onViewCandidate: (candidateId: number) => void;
  onEditCandidate: (candidateId: number) => void;
  onDeleteCandidate: (candidateId: number, candidateName: string) => void;

  // Committees
  onAssignElectorsToCommittees: () => void;
  onOpenCommitteeDialog: () => void;
  onViewCommittee: (committeeId: number) => void;
  onEditCommittee: (committeeId: number) => void;
  onDeleteCommittee: (committeeId: number, committeeName: string) => void;

  // Users
  onOpenAssignUsersDialog: () => void;
  onEditUser: (user: any) => void;
  onRemoveUserFromElection: (userId: number, userName: string) => void;
}

const ManagementView: React.FC<ManagementViewProps> = ({
  tabValue,
  parties,
  candidates,
  committees,
  users,
  loadingUsers,
  onTabChange,
  onOpenEditElectionDialog,
  onAddParty,
  onViewParty,
  onEditParty,
  onDeleteParty,
  onAddCandidate,
  onViewCandidate,
  onEditCandidate,
  onDeleteCandidate,
  onAssignElectorsToCommittees,
  onOpenCommitteeDialog,
  onViewCommittee,
  onEditCommittee,
  onDeleteCommittee,
  onOpenAssignUsersDialog,
  onEditUser,
  onRemoveUserFromElection
}) => {
  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs
          value={tabValue}
          onChange={onTabChange}
          aria-label="election management tabs"
          sx={{
            flexGrow: 1,
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: '1rem',
              fontWeight: 600
            }
          }}
        >
          <Tab icon={<IconFlag size={20} />} iconPosition="start" label={`Parties (${parties.length})`} />
          <Tab icon={<IconUserCheck size={20} />} iconPosition="start" label={`Candidates (${candidates.length})`} />
          <Tab icon={<IconUsersGroup size={20} />} iconPosition="start" label={`Committees (${committees.length})`} />
          <Tab icon={<IconUser size={20} />} iconPosition="start" label={`Users (${users.length})`} />
        </Tabs>
        <Tooltip title="Edit Election Details">
          <IconButton color="primary" onClick={onOpenEditElectionDialog}>
            <IconEdit size={20} />
          </IconButton>
        </Tooltip>
      </Stack>

      <TabPanel value={tabValue} index={0}>
        <PartiesTab
          parties={parties}
          onAddParty={onAddParty}
          onViewParty={onViewParty}
          onEditParty={onEditParty}
          onDeleteParty={onDeleteParty}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <CandidatesTab
          candidates={candidates}
          onAddCandidate={onAddCandidate}
          onViewCandidate={onViewCandidate}
          onEditCandidate={onEditCandidate}
          onDeleteCandidate={onDeleteCandidate}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <CommitteesTab
          committees={committees}
          onAssignElectors={onAssignElectorsToCommittees}
          onAddCommittee={onOpenCommitteeDialog}
          onViewCommittee={onViewCommittee}
          onEditCommittee={onEditCommittee}
          onDeleteCommittee={onDeleteCommittee}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <UsersTab
          users={users}
          loadingUsers={loadingUsers}
          onOpenAddMembers={onOpenAssignUsersDialog}
            onEditUser={onEditUser}
          onRemoveFromElection={onRemoveUserFromElection}
        />
      </TabPanel>
    </Stack>
  );
};

export default ManagementView;


