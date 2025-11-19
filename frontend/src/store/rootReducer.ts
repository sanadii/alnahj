// third party
import { combineReducers } from 'redux';

// project imports
import authReducer from './auth/reducer';
import snackbarReducer from './snackbar/reducer';
import usersReducer from './users/reducer';
import electionsReducer from './elections/reducer';
import committeesReducer from './committees/reducer';
import electorsReducer from './electors/reducer';
import guaranteesReducer from './guarantees/reducer';
import attendanceReducer from './attendance/reducer';
import votingReducer from './voting/reducer';
import strategicReducer from './strategic/reducer';

// ==============================|| ROOT REDUCER ||============================== //
// Election Management System
// Includes: Auth, Users, Elections, Committees, Electors, Guarantees, Attendance, Voting, Snackbar

export default combineReducers({
  auth: authReducer,
  users: usersReducer,
  elections: electionsReducer,
  committees: committeesReducer,
  electors: electorsReducer,
  guarantees: guaranteesReducer,
  attendance: attendanceReducer,
  voting: votingReducer,
  strategic: strategicReducer,
  snackbar: snackbarReducer
});
