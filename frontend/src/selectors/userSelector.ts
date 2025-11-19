// Selectors/userSelectors.ts
import { createSelector } from 'reselect';

const selectUsersState = (state: any) => state.Users;

export const userSelector = createSelector(selectUsersState, (usersState: any) => ({
  // User Selectors
  isUserSuccess: usersState.isUserSuccess,
  error: usersState.error,
  users: usersState.users,
  moderators: usersState.moderators,

  user: usersState.currentUser,
  userId: usersState.currentUser.id,
  currentUser: usersState.currentUser,
  userCampaigns: usersState.currentUser.campaigns,
  currentUserCampaigns: usersState.currentUser.campaigns,
  campaignModerators: usersState.campaignModerators
}));
