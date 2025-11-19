/**
 * Current Election Page
 * Single page to manage the active election: details, committees, candidates, and parties
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { Box, Button, Typography, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { IconSettings, IconChecks, IconRefresh, IconLayoutDashboard, IconPlayerPlay } from '@tabler/icons-react';
import PremiumCard from 'shared/components/cards/PremiumCard';
import { DeleteConfirmationDialog, PremiumPageHeader } from 'shared/components';
import type { HeaderActionInput } from 'shared/components';
import PartyFormDialog from './management/dialogs/PartyFormDialog';
import CandidateFormDialog from './management/dialogs/CandidateFormDialog';
import CommitteeFormDialog from './management/dialogs/CommitteeFormDialog';
import AddMembersDialog from './management/dialogs/AddMembersDialog';
import EditElectionDialog from './shared/EditElectionDialog';
import DashboardView from './dashboard/DashboardView';
import ManagementView from './management/ManagementView';
import { DemoControlPanel } from './demo';
import { getCurrentElectionRequest, updateElectionRequest } from 'store/elections';
import { createCandidateRequest, updateCandidateRequest, deleteCandidateRequest } from 'store/elections';
import { createCommitteeRequest, updateCommitteeRequest, deleteCommitteeRequest } from 'store/committees/actions';
import type { ElectionFormData } from 'types/elections';
import { electionsSelector } from 'selectors/electionsSelector';
import { deleteParty, getCandidate } from 'helpers/api/voting';
import { autoAssignElectorsToCommittees } from 'helpers/api/committees';
import { getUsers, updateUser } from 'helpers/api/users';
import { addElectionMembers, createElectionMember, removeElectionMember } from 'helpers/api/elections';
import { UserRole } from 'types/users-management';
import { openSnackbar } from 'store/snackbar/actions';

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [viewMode, setViewMode] = useState<'dashboard' | 'management'>('dashboard');
  const [tabValue, setTabValue] = useState(0);
  const [openCommitteeDialog, setOpenCommitteeDialog] = useState(false);
  const [committeeDialogMode, setCommitteeDialogMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedCommitteeId, setSelectedCommitteeId] = useState<number | undefined>(undefined);
  const [openCandidateDialog, setOpenCandidateDialog] = useState(false);
  const [candidateDialogMode, setCandidateDialogMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | undefined>(undefined);
  const [openPartyDialog, setOpenPartyDialog] = useState(false);
  const [partyDialogMode, setPartyDialogMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedPartyId, setSelectedPartyId] = useState<number | undefined>(undefined);
  const [openEditElectionDialog, setOpenEditElectionDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [partyToDelete, setPartyToDelete] = useState<{ id: number; name: string } | null>(null);
  const [openDeleteCandidateDialog, setOpenDeleteCandidateDialog] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<{ id: number; name: string } | null>(null);
  const [openDeleteCommitteeDialog, setOpenDeleteCommitteeDialog] = useState(false);
  const [committeeToDelete, setCommitteeToDelete] = useState<{ id: number; name: string } | null>(null);
  const [openDeleteUserDialog, setOpenDeleteUserDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [autoAssignDialogOpen, setAutoAssignDialogOpen] = useState(false);
  const [autoAssignContext, setAutoAssignContext] = useState<{ committeeIds: number[]; count: number; skipped: number }>({
    committeeIds: [],
    count: 0,
    skipped: 0
  });
  const [isAutoAssigning, setIsAutoAssigning] = useState(false);
  const [demoPanelOpen, setDemoPanelOpen] = useState(false);

  // Candidate form state
  const initialCandidateFormData = {
    candidateNumber: '',
    name: '',
    party: '',
    image: null as File | string | null,
    removeImage: false
  };

  const [candidateFormData, setCandidateFormData] = useState<typeof initialCandidateFormData>(initialCandidateFormData);

  // Committee form state
  const [committeeFormData, setCommitteeFormData] = useState({
    code: '',
    name: '',
    gender: 'MALE', // Default to Male
    location: '',
    electorsFrom: '',
    electorsTo: ''
  });

  // Form state for edit dialog
  const [formData, setFormData] = useState<Partial<ElectionFormData>>({
    name: '',
    description: '',
    electionDate: null,
    votingMode: undefined,
    maxCandidatesPerBallot: 1,
    minimumVotesRequired: 1,
    allowPartialVoting: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  const { activeElection, loading } = useAppSelector(electionsSelector);

  // Extract election data and committees from activeElection
  // activeElection from /current/ endpoint has nested structure: { election, committees, parties, candidates, users }
  const election = (activeElection as any)?.election || activeElection || null;
  const committees = useMemo(() => (activeElection as any)?.committees || [], [activeElection]);
  const parties = (activeElection as any)?.parties || [];
  const candidates = (activeElection as any)?.candidates || [];
  const electionUsers = (activeElection as any)?.members || []; // Election members from backend

  // State for users
  const [users, setUsers] = useState<any[]>([]); // Users in THIS election
  const [allUsers, setAllUsers] = useState<any[]>([]); // ALL active users in system
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [hasLoadedAllUsers, setHasLoadedAllUsers] = useState(false);

  // State for assign users dialog
  const [openAssignUsersDialog, setOpenAssignUsersDialog] = useState(false);
  const [memberDialogMode, setMemberDialogMode] = useState<'add' | 'edit'>('add');
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [userCreationMode, setUserCreationMode] = useState<'select' | 'create'>('create');
  const [newUserData, setNewUserData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: UserRole;
    committeeId?: number;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: UserRole.USER,
    committeeId: undefined
  });

  useEffect(() => {
    dispatch(getCurrentElectionRequest());
  }, [dispatch]);

  // Load ALL users for the "Add Users" dialog and merge with election users
  const loadElectionUsers = useCallback(async () => {
    if (loadingUsers) return;
    setLoadingUsers(true);
    try {
      const response = await getUsers({ isActive: true });
      if (response.data) {
        // API returns array directly in data, not data.results
        const fetchedUsers = Array.isArray(response.data) ? response.data : response.data.results || [];

        // Get user IDs who are members of the election (from backend)
        const electionUserIds = election?.members || [];

        // Map ALL users with their committee assignments (committees already have assignedUsers from /current endpoint)
        const allUsersWithCommittees = fetchedUsers.map((user: any) => {
          const userCommittees = committees.filter((c: any) => {
            const users = c.assignedUsers || c.assigned_users || [];
            return Array.isArray(users) && users.includes(user.id);
          });
          return {
            ...user,
            assignedCommittees: userCommittees.map((c: any) => ({ id: c.id, code: c.code, name: c.name })),
            inElection: electionUserIds.includes(user.id)
          };
        });

        setAllUsers(allUsersWithCommittees); // ALL active users for dropdown
        setHasLoadedAllUsers(true);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoadingUsers(false);
    }
  }, [committees, election?.members, loadingUsers]);

  useEffect(() => {
    setAllUsers([]);
    setHasLoadedAllUsers(false);
  }, [election?.id]);

  // Update users when electionUsers from backend changes
  useEffect(() => {
    if (electionUsers.length > 0 && committees.length > 0) {
      // Add committee assignments to election users
      const usersWithCommittees = electionUsers.map((user: any) => {
        const userCommitteeIds = user.assignedCommittees || user.committees || [];
        const userCommittees = committees.filter((c: any) => userCommitteeIds.includes(c.id) || userCommitteeIds.includes(c.code));
        return {
          ...user,
          assignedCommittees: userCommittees.map((c: any) => ({ id: c.id, code: c.code, name: c.name })),
          inElection: true
        };
      });
      setUsers(usersWithCommittees);
    } else if (electionUsers.length === 0) {
      setUsers([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [electionUsers.length, committees.length]);

  useEffect(() => {
    if (!openAssignUsersDialog) {
      return;
    }
    if (hasLoadedAllUsers) {
      return;
    }
    if (committees.length === 0) {
      return;
    }
    loadElectionUsers();
  }, [openAssignUsersDialog, hasLoadedAllUsers, committees.length, loadElectionUsers]);

  const normalizeRole = (role?: string): UserRole => {
    const upper = (role || UserRole.USER).toUpperCase();
    if (upper === UserRole.SUPER_ADMIN) {
      return UserRole.SUPER_ADMIN;
    }
    if (upper === UserRole.ADMIN) {
      return UserRole.ADMIN;
    }
    if (upper === UserRole.SUPERVISOR) {
      return UserRole.SUPERVISOR;
    }
    return UserRole.USER;
  };

  const extractNameParts = (user: any) => {
    const fullName = (user.fullName || user.name || '').trim();
    let [fallbackFirstName, ...rest] = fullName ? fullName.split(' ') : [''];
    const fallbackLastName = rest.join(' ');

    return {
      firstName: user.first_name ?? user.firstName ?? fallbackFirstName ?? '',
      lastName: user.last_name ?? user.lastName ?? fallbackLastName ?? ''
    };
  };

  const handleOpenAssignUsersDialog = () => {
    setMemberDialogMode('add');
    setEditingUser(null);
    setSelectedUserIds([]);
    setUserCreationMode('create');
    setNewUserData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: UserRole.USER,
      committeeId: undefined
    });
    setOpenAssignUsersDialog(true);
  };

  const handleCloseAssignUsersDialog = () => {
    if (!isAssigning) {
      setOpenAssignUsersDialog(false);
      setSelectedUserIds([]);
      setEditingUser(null);
      setMemberDialogMode('add');
    }
  };

  const handleEditExistingUser = (user: any) => {
    const { firstName, lastName } = extractNameParts(user);
    setMemberDialogMode('edit');
    setEditingUser(user);
    setUserCreationMode('create');
    setNewUserData({
      firstName,
      lastName,
      email: user.email ?? '',
      phone: user.phone ?? '',
      role: normalizeRole(user.role ?? user.roleDisplay),
      committeeId: undefined
    });
    setOpenAssignUsersDialog(true);
  };

  const handleSaveEditedUser = async () => {
    if (!editingUser) {
      return;
    }

    setIsAssigning(true);
    try {
      const payload = {
        firstName: newUserData.firstName.trim(),
        lastName: newUserData.lastName.trim(),
        email: newUserData.email.trim(),
        phone: newUserData.phone.trim(),
        role: newUserData.role,
        password: newUserData.phone.trim()
      };

      const response = await updateUser(editingUser.id, payload);

      if (response.success) {
        const updated: any = response.data || {};
        const updatedFirstName = updated.first_name ?? updated.firstName ?? payload.firstName;
        const updatedLastName = updated.last_name ?? updated.lastName ?? payload.lastName;
        const updatedEmail = updated.email ?? payload.email;
        const updatedPhone = updated.phone ?? payload.phone;
        const updatedRole = normalizeRole(updated.role ?? payload.role);
        const fullName = `${updatedFirstName} ${updatedLastName}`.trim();

        const patchUser = (existing: any) => ({
          ...existing,
          ...updated,
          first_name: updated.first_name ?? existing.first_name,
          last_name: updated.last_name ?? existing.last_name,
          email: updatedEmail,
          phone: updatedPhone,
          role: updatedRole,
          roleDisplay: updated.roleDisplay ?? updatedRole,
          fullName: fullName || existing.fullName
        });

        setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? patchUser(u) : u)));
        setAllUsers((prev) => prev.map((u) => (u.id === editingUser.id ? patchUser(u) : u)));

        dispatch(
          openSnackbar({
            open: true,
            message: 'User updated successfully',
            variant: 'success'
          })
        );

        handleCloseAssignUsersDialog();
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: response.message || 'Failed to update user',
            variant: 'error'
          })
        );
      }
    } catch (error: any) {
      console.error('Failed to update user:', error);
      dispatch(
        openSnackbar({
          open: true,
          message: error.response?.data?.message || 'Failed to update user',
          variant: 'error'
        })
      );
    } finally {
      setIsAssigning(false);
    }
  };

  const handleAssignUsers = async () => {
    if (selectedUserIds.length === 0) {
      dispatch(openSnackbar({ open: true, message: 'Please select at least one user', variant: 'warning' }));
      return;
    }

    if (!election?.id) {
      dispatch(openSnackbar({ open: true, message: 'No active election found', variant: 'error' }));
      return;
    }

    setIsAssigning(true);
    try {
      const response = await addElectionMembers(election.id, selectedUserIds);
      if (response.status === 'success') {
        dispatch(openSnackbar({ open: true, message: response.message || 'Members added to election successfully', variant: 'success' }));

        // Update users state immediately instead of refreshing
        // Fetch the newly added users' full details
        const newlyAddedUsers = allUsers.filter((u: any) => selectedUserIds.includes(u.id));
        const updatedUsers = newlyAddedUsers.map((u: any) => ({ ...u, inElection: true }));

        // Add to users list and update allUsers
        setUsers([...users, ...updatedUsers]);
        setAllUsers(allUsers.map((u: any) => (selectedUserIds.includes(u.id) ? { ...u, inElection: true } : u)));

        handleCloseAssignUsersDialog();
      } else {
        dispatch(openSnackbar({ open: true, message: response.message || 'Failed to add users', variant: 'error' }));
      }
    } catch (error: any) {
      console.error('Failed to add users:', error);
      dispatch(openSnackbar({ open: true, message: error.response?.data?.message || 'Failed to add users', variant: 'error' }));
    } finally {
      setIsAssigning(false);
    }
  };

  const handleCreateAndAddUser = async () => {
    if (!election?.id) {
      dispatch(openSnackbar({ open: true, message: 'No active election found', variant: 'error' }));
      return;
    }

    // Validation
    if (!newUserData.firstName || !newUserData.lastName || !newUserData.email || !newUserData.phone) {
      dispatch(openSnackbar({ open: true, message: 'Please fill in all required fields', variant: 'error' }));
      return;
    }

    setIsAssigning(true);
    try {
      // Single API call: Create user + Add to election + Optionally assign to committee
      // Use phone number as both phone and password
      const response = await createElectionMember(election.id, {
        firstName: newUserData.firstName.trim(),
        lastName: newUserData.lastName.trim(),
        email: newUserData.email.trim(),
        password: newUserData.phone.trim(), // Phone is used as password
        phone: newUserData.phone.trim(),
        role: newUserData.role,
        committeeId: newUserData.committeeId
      });

      if (response.status === 'success') {
        const successMessage = newUserData.committeeId
          ? 'User created and added to election and committee successfully'
          : 'User created and added to election successfully';

        dispatch(
          openSnackbar({
            open: true,
            message: successMessage,
            variant: 'success'
          })
        );

        // Add new user directly to state (no refresh needed)
        const newUser = response.data.user;
        const committeeAssignments = newUserData.committeeId
          ? committees.filter((c: any) => c.id === newUserData.committeeId).map((c: any) => ({ id: c.id, code: c.code, name: c.name }))
          : [];

        const userWithCommittees = {
          ...newUser,
          assignedCommittees: committeeAssignments,
          inElection: true
        };

        // Update users state immediately
        setUsers([...users, userWithCommittees]);
        setAllUsers([...allUsers, userWithCommittees]);

        handleCloseAssignUsersDialog();
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: response.message || 'Failed to create user',
            variant: 'error'
          })
        );
      }
    } catch (error: any) {
      console.error('Failed to create user:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create user';
      dispatch(
        openSnackbar({
          open: true,
          message: errorMessage,
          variant: 'error'
        })
      );
    } finally {
      setIsAssigning(false);
    }
  };

  // Watch for election updates and close dialog on success
  useEffect(() => {
    if (isSaving && election?.updatedAt && election.updatedAt !== lastUpdatedAt) {
      setIsSaving(false);
      setOpenEditElectionDialog(false);
      setLastUpdatedAt(election.updatedAt);
    }
  }, [election?.updatedAt, isSaving, lastUpdatedAt]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRefreshElection = () => {
    dispatch(getCurrentElectionRequest());
  };

  const handleOpenEditElectionDialog = () => {
    if (election) {
      // Populate form with current election data
      setFormData({
        name: election.name || '',
        description: election.description || '',
        electionDate: election.electionDate || null,
        votingMode: election.votingMode || 'BOTH',
        maxCandidatesPerBallot: election.maxCandidatesPerBallot || 1,
        minimumVotesRequired: election.minimumVotesRequired || 1,
        allowPartialVoting: election.allowPartialVoting || false
      });
    }
    setOpenEditElectionDialog(true);
  };

  const handleCloseEditElectionDialog = () => {
    if (!isSaving) {
      // Only allow manual close if not currently saving
      setOpenEditElectionDialog(false);
    }
  };

  const handleFormChange = (field: keyof ElectionFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveElection = async () => {
    if (!election?.id) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Election ID not found',
          variant: 'alert',
          alert: { color: 'error' },
          close: true
        })
      );
      return;
    }

    // Validate required fields
    if (!formData.name || !formData.maxCandidatesPerBallot || !formData.minimumVotesRequired) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Please fill in all required fields',
          variant: 'alert',
          alert: { color: 'warning' },
          close: true
        })
      );
      return;
    }

    setIsSaving(true);

    // Dispatch update action - saga will handle success message and state update
    // Dialog will close automatically via useEffect when update completes
    dispatch(updateElectionRequest(election.id, formData as Partial<ElectionFormData>));
  };

  // Party handlers
  const handleAddParty = () => {
    setPartyDialogMode('add');
    setSelectedPartyId(undefined);
    setOpenPartyDialog(true);
  };

  const handleViewParty = (partyId: number) => {
    setPartyDialogMode('view');
    setSelectedPartyId(partyId);
    setOpenPartyDialog(true);
  };

  const handleEditParty = (partyId: number) => {
    setPartyDialogMode('edit');
    setSelectedPartyId(partyId);
    setOpenPartyDialog(true);
  };

  const handleDeleteParty = (partyId: number, partyName: string) => {
    setPartyToDelete({ id: partyId, name: partyName });
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!partyToDelete) return;

    setIsDeleting(true);

    try {
      const response = await deleteParty(partyToDelete.id);
      if (response.success) {
        // Dispatch Redux action to update store immediately
        dispatch({ type: 'elections/DELETE_PARTY_SUCCESS', payload: { id: partyToDelete.id } });

        dispatch(
          openSnackbar({
            open: true,
            message: 'Party deleted successfully',
            variant: 'success'
          })
        );
        setOpenDeleteDialog(false);
        setPartyToDelete(null);
      } else {
        throw new Error(response.message || 'Failed to delete party');
      }
    } catch (err: any) {
      console.error('Error deleting party:', err);
      dispatch(
        openSnackbar({
          open: true,
          message: err.response?.data?.message || 'Failed to delete party',
          variant: 'error'
        })
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setPartyToDelete(null);
  };

  // Candidate handlers
  const handleOpenCandidateDialog = () => {
    setCandidateDialogMode('add');
    setSelectedCandidateId(undefined);
    setCandidateFormData({ ...initialCandidateFormData });
    setOpenCandidateDialog(true);
  };

  const handleViewCandidate = async (candidateId: number) => {
    setCandidateDialogMode('view');
    setSelectedCandidateId(candidateId);
    try {
      const response = await getCandidate(candidateId);
      if (response.success && response.data) {
        const candidate: any = response.data;
        setCandidateFormData({
          candidateNumber: candidate.candidateNumber.toString(),
          name: candidate.name,
          party: candidate.party?.toString() || '',
          image: candidate.photo || null,
          removeImage: false
        });
        setOpenCandidateDialog(true);
      }
    } catch (error) {
      console.error('Failed to load candidate:', error);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to load candidate details',
          variant: 'alert',
          alert: { color: 'error' },
          close: true
        })
      );
    }
  };

  const handleEditCandidate = async (candidateId: number) => {
    setCandidateDialogMode('edit');
    setSelectedCandidateId(candidateId);
    try {
      const response = await getCandidate(candidateId);
      if (response.success && response.data) {
        const candidate: any = response.data;
        setCandidateFormData({
          candidateNumber: candidate.candidateNumber.toString(),
          name: candidate.name,
          party: candidate.party?.toString() || '',
          image: candidate.photo || null,
          removeImage: false
        });
        setOpenCandidateDialog(true);
      }
    } catch (error) {
      console.error('Failed to load candidate:', error);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to load candidate details',
          variant: 'alert',
          alert: { color: 'error' },
          close: true
        })
      );
    }
  };

  const handleDeleteCandidate = (candidateId: number, candidateName: string) => {
    setCandidateToDelete({ id: candidateId, name: candidateName });
    setOpenDeleteCandidateDialog(true);
  };

  const handleConfirmDeleteCandidate = () => {
    if (!candidateToDelete) return;

    dispatch(deleteCandidateRequest(candidateToDelete.id));

    // Close dialog immediately - saga will handle refresh
    setOpenDeleteCandidateDialog(false);
    setCandidateToDelete(null);
  };

  const handleCancelDeleteCandidate = () => {
    setOpenDeleteCandidateDialog(false);
    setCandidateToDelete(null);
  };

  const handleCloseCandidateDialog = () => {
    setOpenCandidateDialog(false);
    setSelectedCandidateId(undefined);
    // Reset form
    setCandidateFormData({ ...initialCandidateFormData });
  };

  const handleSaveCandidate = () => {
    if (!election?.id) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'No election selected',
          variant: 'alert',
          alert: { color: 'error' },
          close: true
        })
      );
      return;
    }

    // Validate
    if (!candidateFormData.candidateNumber || !candidateFormData.name) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Please fill in candidate number and name',
          variant: 'alert',
          alert: { color: 'warning' },
          close: true
        })
      );
      return;
    }

    const partyId = candidateFormData.party ? parseInt(candidateFormData.party, 10) : null;

    const formPayload = new FormData();
    formPayload.append('election', String(election.id));
    formPayload.append('name', candidateFormData.name.trim());
    formPayload.append('candidate_number', String(parseInt(candidateFormData.candidateNumber, 10)));
    if (partyId !== null) {
      formPayload.append('party', String(partyId));
    } else {
      formPayload.append('party', '');
    }
    if (candidateFormData.image instanceof File) {
      formPayload.append('photo', candidateFormData.image);
    }
    if (candidateFormData.removeImage) {
      formPayload.append('remove_photo', 'true');
    }

    if (candidateDialogMode === 'edit' && selectedCandidateId) {
      // Update existing candidate
      dispatch(updateCandidateRequest(selectedCandidateId, formPayload));
    } else {
      // Create new candidate
      dispatch(createCandidateRequest(formPayload));
    }

    // Close dialog - Redux reducer updates activeElection.candidates immediately
    handleCloseCandidateDialog();
  };

  const handlePartyDialogClose = () => {
    setOpenPartyDialog(false);
    setSelectedPartyId(undefined);
  };

  const handlePartySuccess = () => {
    dispatch(
      openSnackbar({
        open: true,
        message: partyDialogMode === 'add' ? 'Party created successfully' : 'Party updated successfully',
        variant: 'alert',
        alert: { color: 'success' },
        close: true
      })
    );
    // No need to refresh - Redux reducer handles the update immediately
  };

  // Committee handlers
  const handleCommitteeFormChange = (field: keyof typeof committeeFormData, value: string) => {
    setCommitteeFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCandidateFormChange = (field: keyof typeof initialCandidateFormData, value: string | File | null | boolean) => {
    if (field === 'image') {
      setCandidateFormData((prev) => ({
        ...prev,
        image: value as File | string | null,
        removeImage: value === null ? true : false
      }));
      return;
    }

    if (field === 'removeImage') {
      setCandidateFormData((prev) => ({
        ...prev,
        removeImage: Boolean(value)
      }));
      return;
    }

    setCandidateFormData((prev) => ({
      ...prev,
      [field]: (value as string) ?? ''
    }));
  };

  const handleAssignElectorsToCommittees = async () => {
    if (!election?.id) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'No active election found',
          variant: 'alert',
          alert: { color: 'error' },
          close: true
        })
      );
      return;
    }

    // Validate committees have ranges
    const committeesWithRanges = committees.filter((c: any) => c.electorsFrom && c.electorsTo);
    const committeesWithoutRanges = committees.filter((c: any) => !c.electorsFrom || !c.electorsTo);

    if (committeesWithRanges.length === 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'No committees have elector ranges set. Please configure at least one committee.',
          variant: 'alert',
          alert: { color: 'warning' },
          close: true
        })
      );
      return;
    }

    // Confirm action
    setAutoAssignContext({
      committeeIds: committeesWithRanges.map((c: any) => c.id),
      count: committeesWithRanges.length,
      skipped: committeesWithoutRanges.length
    });
    setAutoAssignDialogOpen(true);
  };

  const handleCloseAutoAssignDialog = () => {
    if (isAutoAssigning) return;
    setAutoAssignDialogOpen(false);
  };

  const handleConfirmAutoAssign = async () => {
    if (!election?.id) return;

    setIsAutoAssigning(true);

    dispatch(
      openSnackbar({
        open: true,
        message: 'Assigning electors to committees...',
        variant: 'alert',
        alert: { color: 'info' },
        close: false
      })
    );

    try {
      const response = await autoAssignElectorsToCommittees(election.id, autoAssignContext.committeeIds);

      if (response.status === 'success') {
        const data = (response.data || {}) as any;
        const committeesUpdates: any[] = data.committees || [];
        const processed = committeesUpdates.length || autoAssignContext.count;
        const assigned = data.assigned ?? processed;
        const skipped = data.skipped ?? autoAssignContext.skipped;

        if (committeesUpdates.length > 0) {
          dispatch({ type: 'elections/AUTO_ASSIGN_COMMITTEES_SUCCESS', payload: committeesUpdates });
          committeesUpdates.forEach((committeeUpdate) => {
            dispatch({ type: 'committees/UPDATE_COMMITTEE_SUCCESS', payload: committeeUpdate });
          });
        }

        const skippedText = skipped > 0 ? ` Skipped ${skipped} committee(s) without ranges.` : '';

        dispatch(
          openSnackbar({
            open: true,
            message: data.message || `Success! Assigned ${assigned} electors to ${processed} committee(s).${skippedText}`,
            variant: 'alert',
            alert: { color: 'success' },
            close: true
          })
        );

        setAutoAssignDialogOpen(false);
      } else {
        throw new Error(response.message || 'Assignment failed');
      }
    } catch (error: any) {
      console.error('Failed to assign electors:', error);
      dispatch(
        openSnackbar({
          open: true,
          message: error.response?.data?.message || error.message || 'Failed to assign electors to committees',
          variant: 'alert',
          alert: { color: 'error' },
          close: true
        })
      );
    } finally {
      setIsAutoAssigning(false);
    }
  };

  const handleOpenCommitteeDialog = () => {
    setCommitteeDialogMode('add');
    setSelectedCommitteeId(undefined);
    setCommitteeFormData({
      code: '',
      name: '',
      gender: 'MALE',
      location: '',
      electorsFrom: '',
      electorsTo: ''
    });
    setOpenCommitteeDialog(true);
  };

  const handleViewCommittee = (committeeId: number) => {
    setCommitteeDialogMode('view');
    setSelectedCommitteeId(committeeId);

    // Use data already available from current election endpoint
    const committee = committees.find((c: any) => c.id === committeeId);
    if (committee) {
      setCommitteeFormData({
        code: committee.code,
        name: committee.name,
        gender: committee.gender || 'MALE',
        location: committee.location || '',
        electorsFrom: committee.electorsFrom?.toString() || '',
        electorsTo: committee.electorsTo?.toString() || ''
      });
      setOpenCommitteeDialog(true);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Committee not found',
          variant: 'alert',
          alert: { color: 'error' },
          close: true
        })
      );
    }
  };

  const handleEditCommittee = (committeeId: number) => {
    setCommitteeDialogMode('edit');
    setSelectedCommitteeId(committeeId);

    // Use data already available from current election endpoint
    const committee = committees.find((c: any) => c.id === committeeId);
    if (committee) {
      setCommitteeFormData({
        code: committee.code,
        name: committee.name,
        gender: committee.gender || 'MALE',
        location: committee.location || '',
        electorsFrom: committee.electorsFrom?.toString() || '',
        electorsTo: committee.electorsTo?.toString() || ''
      });
      setOpenCommitteeDialog(true);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Committee not found',
          variant: 'alert',
          alert: { color: 'error' },
          close: true
        })
      );
    }
  };

  const handleDeleteCommittee = (committeeId: number, committeeName: string) => {
    setCommitteeToDelete({ id: committeeId, name: committeeName });
    setOpenDeleteCommitteeDialog(true);
  };

  const handleConfirmDeleteCommittee = () => {
    if (!committeeToDelete) return;

    dispatch(deleteCommitteeRequest(committeeToDelete.id));

    // Close dialog immediately - Redux reducer updates activeElection.committees
    setOpenDeleteCommitteeDialog(false);
    setCommitteeToDelete(null);
  };

  const handleCancelDeleteCommittee = () => {
    setOpenDeleteCommitteeDialog(false);
    setCommitteeToDelete(null);
  };

  // User delete handlers
  const handleDeleteUser = (userId: number, userName: string) => {
    setUserToDelete({ id: userId, name: userName });
    setOpenDeleteUserDialog(true);
  };

  const handleConfirmDeleteUser = async () => {
    if (!userToDelete || !election?.id) return;

    setIsDeleting(true);
    try {
      // Call API to remove user from election
      await removeElectionMember(election.id, userToDelete.id);

      dispatch(
        openSnackbar({
          open: true,
          message: 'User removed from election successfully',
          variant: 'success'
        })
      );

      // Update state immediately - remove user from lists
      setUsers(users.filter((u: any) => u.id !== userToDelete.id));
      setAllUsers(allUsers.map((u: any) => (u.id === userToDelete.id ? { ...u, inElection: false } : u)));

      setOpenDeleteUserDialog(false);
      setUserToDelete(null);
    } catch (error: any) {
      dispatch(
        openSnackbar({
          open: true,
          message: error?.response?.data?.message || 'Failed to remove user',
          variant: 'error'
        })
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDeleteUser = () => {
    setOpenDeleteUserDialog(false);
    setUserToDelete(null);
  };

  const handleCloseCommitteeDialog = () => {
    setOpenCommitteeDialog(false);
    setSelectedCommitteeId(undefined);
    setCommitteeFormData({
      code: '',
      name: '',
      gender: 'MALE',
      location: '',
      electorsFrom: '',
      electorsTo: ''
    });
  };

  const handleSaveCommittee = () => {
    if (!election?.id) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'No election selected',
          variant: 'alert',
          alert: { color: 'error' },
          close: true
        })
      );
      return;
    }

    // Validate
    if (!committeeFormData.code || !committeeFormData.name) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Please fill in committee code and name',
          variant: 'alert',
          alert: { color: 'warning' },
          close: true
        })
      );
      return;
    }

    const committeeData = {
      election: election.id,
      code: committeeFormData.code.trim(),
      name: committeeFormData.name.trim(),
      gender: committeeFormData.gender as any,
      location: committeeFormData.location.trim() || undefined,
      electorsFrom: committeeFormData.electorsFrom ? parseInt(committeeFormData.electorsFrom) : undefined,
      electorsTo: committeeFormData.electorsTo ? parseInt(committeeFormData.electorsTo) : undefined
    };

    if (committeeDialogMode === 'edit' && selectedCommitteeId) {
      // Update existing committee
      dispatch(updateCommitteeRequest(selectedCommitteeId, committeeData));
    } else {
      // Create new committee
      dispatch(createCommitteeRequest(committeeData));
    }

    // Close dialog - Redux reducer updates activeElection.committees immediately
    handleCloseCommitteeDialog();
  };

  if (loading) {
    return (
      <PremiumCard title="Current Election" icon={<IconChecks size={24} />} variant="elevated" color="primary">
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      </PremiumCard>
    );
  }

  if (!election) {
    return (
      <PremiumCard title="Current Election" icon={<IconChecks size={24} />} variant="elevated" color="primary">
        <Alert severity="info">No active election found. Please create an election first.</Alert>
      </PremiumCard>
    );
  }

  // Header actions configuration
  const headerActions: HeaderActionInput[] = [
    {
      icon: <IconRefresh />,
      onClick: handleRefreshElection,
      tooltip: 'Refresh election data',
      type: 'iconButton'
    },
    {
      label: 'Start Demo',
      icon: <IconPlayerPlay size={18} />,
      onClick: () => setDemoPanelOpen(true),
      variant: 'contained',
      tooltip: 'Start election demo'
    },
    {
      label: viewMode === 'dashboard' ? 'Manage' : 'Dashboard',
      icon: viewMode === 'dashboard' ? <IconSettings /> : <IconLayoutDashboard />,
      onClick: () => setViewMode(viewMode === 'dashboard' ? 'management' : 'dashboard'),
      variant: 'contained'
    }
  ];

  return (
    <PremiumCard variant="elevated" hover={false} padding={0}>
      {/* Premium Header */}
      <PremiumPageHeader title={election.name} subtitle={election.description} icon={<IconChecks />} actions={headerActions} />

      {/* Card Content */}
      <Box>
        {viewMode === 'dashboard' ? (
          // ========== DASHBOARD VIEW ==========
          <DashboardView
            election={election}
            parties={parties}
            candidates={candidates}
            committees={committees}
            onEditElection={handleOpenEditElectionDialog}
            onManageEntities={() => setViewMode('management')}
          />
        ) : (
          // ========== MANAGEMENT VIEW ==========
          <ManagementView
            tabValue={tabValue}
            parties={parties}
            candidates={candidates}
            committees={committees}
            users={users}
            loadingUsers={loadingUsers}
            onTabChange={handleTabChange}
            onOpenEditElectionDialog={handleOpenEditElectionDialog}
            onAddParty={handleAddParty}
            onViewParty={handleViewParty}
            onEditParty={handleEditParty}
            onDeleteParty={handleDeleteParty}
            onAddCandidate={handleOpenCandidateDialog}
            onViewCandidate={handleViewCandidate}
            onEditCandidate={handleEditCandidate}
            onDeleteCandidate={handleDeleteCandidate}
            onAssignElectorsToCommittees={handleAssignElectorsToCommittees}
            onOpenCommitteeDialog={handleOpenCommitteeDialog}
            onViewCommittee={handleViewCommittee}
            onEditCommittee={handleEditCommittee}
            onDeleteCommittee={handleDeleteCommittee}
            onOpenAssignUsersDialog={handleOpenAssignUsersDialog}
            onEditUser={handleEditExistingUser}
            onRemoveUserFromElection={handleDeleteUser}
          />
        )}
      </Box>

      {/* Add/Edit/View Committee Dialog */}
      <CommitteeFormDialog
        open={openCommitteeDialog}
        mode={committeeDialogMode}
        formData={committeeFormData}
        onClose={handleCloseCommitteeDialog}
        onSave={handleSaveCommittee}
        onChange={handleCommitteeFormChange}
      />

      {/* Add Members to Election Dialog */}
      <AddMembersDialog
        open={openAssignUsersDialog}
        onClose={handleCloseAssignUsersDialog}
        mode={memberDialogMode}
        allUsers={allUsers}
        users={users}
        committees={committees}
        loadingUsers={loadingUsers}
        isAssigning={isAssigning}
        userCreationMode={userCreationMode}
        onModeChange={setUserCreationMode}
        newUserData={newUserData}
        onNewUserDataChange={setNewUserData}
        onCreateAndAdd={handleCreateAndAddUser}
        selectedUserIds={selectedUserIds}
        onSelectedUsersChange={setSelectedUserIds}
        onAssignUsers={handleAssignUsers}
        onSaveEdit={handleSaveEditedUser}
      />

      {/* Delete Committee Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={openDeleteCommitteeDialog}
        title="Delete Committee"
        itemName={committeeToDelete?.name || ''}
        itemType="committee"
        warningMessage="This will permanently delete this committee. All associated data will be removed."
        isDeleting={isDeleting}
        onConfirm={handleConfirmDeleteCommittee}
        onCancel={handleCancelDeleteCommittee}
      />

      {/* Delete User from Election Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={openDeleteUserDialog}
        title="Remove User from Election"
        itemName={userToDelete?.name || ''}
        itemType="user"
        warningMessage="This will remove this user from the election. They will no longer be assigned to any committees in this election."
        isDeleting={isDeleting}
        onConfirm={handleConfirmDeleteUser}
        onCancel={handleCancelDeleteUser}
      />

      {/* Candidate Form Dialog */}
      <CandidateFormDialog
        open={openCandidateDialog}
        mode={candidateDialogMode}
        formData={candidateFormData}
        parties={parties}
        onClose={handleCloseCandidateDialog}
        onSave={handleSaveCandidate}
        onChange={handleCandidateFormChange}
      />

      <PartyFormDialog
        open={openPartyDialog}
        mode={partyDialogMode}
        partyId={selectedPartyId}
        electionId={election?.id}
        onClose={handlePartyDialogClose}
        onSuccess={handlePartySuccess}
      />

      {/* Delete Party Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        title="Delete Party"
        itemName={partyToDelete?.name || ''}
        itemType="party"
        warningMessage="This will permanently delete this party and all associated data."
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Delete Candidate Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={openDeleteCandidateDialog}
        title="Delete Candidate"
        itemName={candidateToDelete?.name || ''}
        itemType="candidate"
        warningMessage="This action cannot be undone. All candidate data will be permanently removed."
        isDeleting={isDeleting}
        onConfirm={handleConfirmDeleteCandidate}
        onCancel={handleCancelDeleteCandidate}
      />
      <Dialog open={autoAssignDialogOpen} onClose={handleCloseAutoAssignDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Electors to Committees</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body1">
            {`This will automatically assign electors to ${autoAssignContext.count} committee${autoAssignContext.count === 1 ? '' : 's'} based on their configured ranges and gender.`}
          </Typography>
          {autoAssignContext.skipped > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {`${autoAssignContext.skipped} committee${autoAssignContext.skipped === 1 ? '' : 's'} without ranges will be skipped.`}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseAutoAssignDialog} disabled={isAutoAssigning}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleConfirmAutoAssign} disabled={isAutoAssigning}>
            {isAutoAssigning ? <CircularProgress size={20} /> : 'Assign Electors'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Election Dialog */}
      <EditElectionDialog
        open={openEditElectionDialog}
        formData={formData}
        isSaving={isSaving}
        onClose={handleCloseEditElectionDialog}
        onSave={handleSaveElection}
        onChange={handleFormChange}
      />

      {/* Demo Control Panel */}
      <DemoControlPanel
        open={demoPanelOpen}
        electionId={election?.id || null}
        onClose={() => setDemoPanelOpen(false)}
      />
    </PremiumCard>
  );
};

export default DashboardPage;
