// ==============================|| SELECTORS ||============================== //
// Election Management System - Redux Selectors

// Authentication & User
export {
  authSelector,
  selectAuthUser,
  selectIsLoggedIn,
  selectAuthLoading,
  selectAuthLoginLoading,
  selectAuthRegisterLoading,
  selectAuthForgotPasswordLoading,
  selectAuthProfileLoading,
  selectAuthError,
  selectAuthErrorMessage,
  selectAuthLoginError,
  selectAuthRegisterError,
  selectAuthForgotPasswordError,
  selectAuthProfileError,
  selectIsUserLogout,
  selectRegisterSuccess,
  selectRegisterMessage,
  selectForgotPasswordSuccess,
  selectForgotPasswordMessage,
  selectProfileSuccess,
  selectProfileMessage
} from 'store/auth/selectors';
export { userSelector } from './userSelector';

// Users Management
export { usersSelector, selectUsers, selectCurrentUser, selectUserStats, selectUsersLoading, selectUsersError, selectUsersTotalCount, selectUsersCurrentPage, selectUsersPageSize, selectUsersFilters } from 'store/users/selectors';

// Electors
export {
  electorsSelector,
  selectElectors,
  selectCurrentElector,
  selectElectorStats,
  selectElectorsLoading,
  selectElectorsError,
  selectElectorsTotalCount,
  selectElectorsFilters,
  electorsGroupsSelector,
  selectElectorsSortedByName,
  selectElectorsBySearch
} from './electorsSelector';

// Elections & Committees
export { electionsSelector, selectElections, selectCurrentElection, selectActiveElection, selectElectionsLoading, selectElectionsError, selectElectionsTotalCount, selectElectionsCurrentPage, selectElectionsPageSize, selectElectionsFilters } from 'store/elections/selectors';
export { committeesSelector, selectCommittees, selectCurrentCommittee, selectCommitteeStatistics, selectCommitteesLoading, selectCommitteesError, selectCommitteesTotalCount, selectCommitteesCurrentPage, selectCommitteesPageSize, selectCommitteesFilters } from 'store/committees/selectors';

// Guarantees & Attendance
export {
  guaranteesSelector,
  selectGuarantees,
  selectGuaranteeGroups,
  selectGuaranteeStatistics,
  selectGuaranteesLoading,
  selectGuaranteesError,
  selectGuaranteesTotalCount,
  selectGuaranteesCurrentPage,
  selectGuaranteesPageSize,
  selectGuaranteesFilters,
  selectGuaranteesByStatus,
  selectGuaranteesGroupedByCommittee
} from 'store/guarantees/selectors';
export { attendanceSelector, selectAttendanceItems, selectAttendanceItem, selectAttendanceSearchResult, selectAttendanceStatistics, selectAttendanceCommitteeList, selectAttendanceLoading, selectAttendanceSearchLoading, selectAttendanceMarkingLoading, selectAttendanceStatsLoading, selectAttendanceError, selectAttendanceSearchError, selectAttendanceTotalCount, selectAttendanceCurrentPage, selectAttendancePageSize, selectAttendanceHasMore } from 'store/attendance/selectors';

// Voting
export {
  votingSelector,
  selectVoteCounts,
  selectCandidates,
  selectParties,
  selectCommitteeEntries,
  selectElectionResults,
  selectVotingStatistics,
  selectVotingLoading,
  selectVotingError,
  selectVotingTotalCount,
  selectVotingCurrentPage,
  selectVotingPageSize,
  selectVotingFilters,
  selectVotingCompletionMetrics
} from 'store/voting/selectors';
