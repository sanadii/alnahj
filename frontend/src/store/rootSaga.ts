// third party
import { all } from 'redux-saga/effects';

// project imports
import authSaga from './auth/saga';
import usersSaga from './users/saga';
import electionsSaga from './elections/saga';
import committeesSaga from './committees/saga';
import electorsSaga from './electors/saga';
import guaranteesSaga from './guarantees/saga';
import attendanceSaga from './attendance/saga';
import votingSaga from './voting/saga';
import strategicSaga from './strategic/saga';

// ==============================|| ROOT SAGA ||============================== //
// Election Management System
// Includes: Auth, Users, Elections, Committees, Electors, Guarantees, Attendance, Voting

export default function* rootSaga() {

  yield all([
    authSaga(),
    usersSaga(),
    electionsSaga(),
    committeesSaga(),
    electorsSaga(),
    guaranteesSaga(),
    attendanceSaga(),
    votingSaga(),
    strategicSaga()
  ]);

}
