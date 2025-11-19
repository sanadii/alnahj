// ==============================|| USERS SAGA ||============================== //
// Election Management System - Users Management

import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as actions from './actions';
import * as types from './actionTypes';
import * as usersApi from 'helpers/api/users';
import type { APIResponse } from 'types/api';
import type { User, UserListResponse, UserStats } from 'types/users-management';
import { openSnackbar } from 'store/snackbar/actions';

type SnackbarColor = 'success' | 'error';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  const responseData = (error as { response?: { data?: { message?: string } } })?.response?.data;
  if (responseData?.message) {
    return typeof responseData.message === 'string' ? responseData.message : JSON.stringify(responseData.message);
  }
  const message = (error as { message?: string })?.message;
  return message || fallback;
};

function* showSnackbar(message: string, color: SnackbarColor) {
  yield put(
    openSnackbar({
      open: true,
      message,
      variant: 'alert',
      alert: { color },
      close: true
    })
  );
}

/**
 * Map backend user response to frontend User type
 * Backend uses snake_case, frontend uses camelCase
 */
function mapUserFromAPI(apiUser: any): User {
  const [firstName = '', lastName = ''] = (apiUser.full_name || '').split(' ');

  return {
    id: apiUser.id,
    email: apiUser.email,
    firstName,
    lastName,
    role: apiUser.role,
    roleDisplay: apiUser.role_display,
    isActive: apiUser.is_active,
    isSuperuser: apiUser.is_superuser || false,
    isStaff: apiUser.is_staff || false,
    supervisor: apiUser.supervisor,
    supervisorName: apiUser.supervisor_name,
    team: apiUser.team,
    committees: apiUser.committees,
    committeeNames: apiUser.committee_names,
    createdAt: apiUser.date_joined || apiUser.created_at,
    updatedAt: apiUser.updated_at,
    lastLogin: apiUser.last_login,
    fullName: apiUser.full_name
  };
}

/**
 * Saga: Get Users List
 */
type GetUsersAction = ReturnType<typeof actions.getUsersRequest>;
type GetUserAction = ReturnType<typeof actions.getUserRequest>;
type CreateUserAction = ReturnType<typeof actions.createUserRequest>;
type UpdateUserAction = ReturnType<typeof actions.updateUserRequest>;
type DeleteUserAction = ReturnType<typeof actions.deleteUserRequest>;
type ChangePasswordAction = ReturnType<typeof actions.changePasswordRequest>;
type GetUserStatsAction = ReturnType<typeof actions.getUserStatsRequest>;
type ActivateUserAction = ReturnType<typeof actions.activateUserRequest>;
type DeactivateUserAction = ReturnType<typeof actions.deactivateUserRequest>;
type BulkUserOperationAction = ReturnType<typeof actions.bulkUserOperationRequest>;

function* getUsersSaga({ payload }: GetUsersAction): Generator<any, void, APIResponse<UserListResponse>> {
  try {
    const response = yield call(usersApi.getUsers, payload.filters);

    // Backend returns: { data: User[], meta: { pagination: { count: number } } }
    const apiUsers = Array.isArray(response.data) ? response.data : [];
    const users = apiUsers.map(mapUserFromAPI);
    const totalCount = response.meta?.pagination?.count || 0;

    yield put(
      actions.getUsersSuccess({
        users,
        totalCount
      })
    );

    if (response.message) {
      yield* showSnackbar(response.message, 'success');
    }
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to fetch users');
    yield put(actions.getUsersError(message));
    yield* showSnackbar(message, 'error');
  }
}

/**
 * Saga: Get Single User
 */
function* getUserSaga({ payload }: GetUserAction): Generator<any, void, APIResponse<User>> {
  try {
    const response = yield call(usersApi.getUser, payload.id);

    const user = mapUserFromAPI(response.data);
    yield put(actions.getUserSuccess(user));

    if (response.message) {
      yield* showSnackbar(response.message, 'success');
    }
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to fetch user');
    yield put(actions.getUserError(message));
    yield* showSnackbar(message, 'error');
  }
}

/**
 * Saga: Create User
 */
function* createUserSaga({ payload }: CreateUserAction): Generator<any, void, APIResponse<User>> {
  try {
    const response = yield call(usersApi.createUser, payload);

    const user = mapUserFromAPI(response.data);
    yield put(actions.createUserSuccess(user));
    yield* showSnackbar(response.message || 'User created successfully', 'success');

    // Refresh the users list
    yield put(actions.getUsersRequest({}));
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to create user');
    yield put(actions.createUserError(message));
    yield* showSnackbar(message, 'error');
  }
}

/**
 * Saga: Update User
 */
function* updateUserSaga({ payload }: UpdateUserAction): Generator<any, void, APIResponse<User>> {
  try {
    const { id, data } = payload;
    const response = yield call(usersApi.updateUser, id, data);

    const user = mapUserFromAPI(response.data);
    yield put(actions.updateUserSuccess(user));
    yield* showSnackbar(response.message || 'User updated successfully', 'success');
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to update user');
    yield put(actions.updateUserError(message));
    yield* showSnackbar(message, 'error');
  }
}

/**
 * Saga: Delete User
 */
function* deleteUserSaga({ payload }: DeleteUserAction): Generator<any, void, APIResponse<null>> {
  try {
    const response = yield call(usersApi.deleteUser, payload.id);

    yield put(actions.deleteUserSuccess(payload.id));
    yield* showSnackbar(response.message || 'User deleted successfully', 'success');
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to delete user');
    yield put(actions.deleteUserError(message));
    yield* showSnackbar(message, 'error');
  }
}

/**
 * Saga: Change Password
 */
function* changePasswordSaga({ payload }: ChangePasswordAction): Generator<any, void, APIResponse<null>> {
  try {
    const { id, data } = payload;
    const response = yield call(usersApi.changeUserPassword, id, data);

    yield put(actions.changePasswordSuccess());
    yield* showSnackbar(response.message || 'Password changed successfully', 'success');
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to change password');
    yield put(actions.changePasswordError(message));
    yield* showSnackbar(message, 'error');
  }
}

/**
 * Saga: Get User Stats
 */
function* getUserStatsSaga({ payload }: GetUserStatsAction): Generator<any, void, APIResponse<UserStats>> {
  try {
    const response = yield call(usersApi.getUserStats, payload.id);

    yield put(actions.getUserStatsSuccess(response.data));
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to fetch user stats');
    yield put(actions.getUserStatsError(message));
    yield* showSnackbar(message, 'error');
  }
}

/**
 * Saga: Activate User
 */
function* activateUserSaga({ payload }: ActivateUserAction): Generator<any, void, APIResponse<User>> {
  try {
    const response = yield call(usersApi.activateUser, payload.id);

    const user = mapUserFromAPI(response.data);
    yield put(actions.activateUserSuccess(user));
    yield* showSnackbar(response.message || 'User activated successfully', 'success');
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to activate user');
    yield put(actions.getUsersError(message));
    yield* showSnackbar(message, 'error');
  }
}

/**
 * Saga: Deactivate User
 */
function* deactivateUserSaga({ payload }: DeactivateUserAction): Generator<any, void, APIResponse<User>> {
  try {
    const response = yield call(usersApi.deactivateUser, payload.id);

    const user = mapUserFromAPI(response.data);
    yield put(actions.deactivateUserSuccess(user));
    yield* showSnackbar(response.message || 'User deactivated successfully', 'success');
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to deactivate user');
    yield put(actions.getUsersError(message));
    yield* showSnackbar(message, 'error');
  }
}

/**
 * Saga: Bulk User Operation
 */
function* bulkUserOperationSaga({ payload }: BulkUserOperationAction): Generator<any, void, APIResponse<any>> {
  try {
    const response = yield call(usersApi.bulkUserOperation, payload);

    yield put(actions.bulkUserOperationSuccess(response.data));
    yield* showSnackbar(
      response.message || `Bulk operation completed: ${response.data.success} successful, ${response.data.failed} failed`,
      'success'
    );

    // Refresh the users list
    yield put(actions.getUsersRequest({}));
  } catch (error) {
    const message = getErrorMessage(error, 'Bulk operation failed');
    yield put(actions.bulkUserOperationError(message));
    yield* showSnackbar(message, 'error');
  }
}

export function* watchUsersList() {
  yield takeLatest(types.GET_USERS_REQUEST, getUsersSaga);
}

export function* watchUserDetails() {
  yield takeLatest(types.GET_USER_REQUEST, getUserSaga);
}

export function* watchUserCreate() {
  yield takeLatest(types.CREATE_USER_REQUEST, createUserSaga);
}

export function* watchUserUpdate() {
  yield takeLatest(types.UPDATE_USER_REQUEST, updateUserSaga);
}

export function* watchUserDelete() {
  yield takeLatest(types.DELETE_USER_REQUEST, deleteUserSaga);
}

export function* watchUserPasswordChange() {
  yield takeLatest(types.CHANGE_PASSWORD_REQUEST, changePasswordSaga);
}

export function* watchUserStats() {
  yield takeLatest(types.GET_USER_STATS_REQUEST, getUserStatsSaga);
}

export function* watchUserActivation() {
  yield takeLatest(types.ACTIVATE_USER_REQUEST, activateUserSaga);
  yield takeLatest(types.DEACTIVATE_USER_REQUEST, deactivateUserSaga);
}

export function* watchBulkUserOperations() {
  yield takeLatest(types.BULK_USER_OPERATION_REQUEST, bulkUserOperationSaga);
}

/**
 * Root Saga: Watch all user actions
 */
export default function* usersSaga(): Generator<any, void, any> {
  yield all([
    watchUsersList(),
    watchUserDetails(),
    watchUserCreate(),
    watchUserUpdate(),
    watchUserDelete(),
    watchUserPasswordChange(),
    watchUserStats(),
    watchUserActivation(),
    watchBulkUserOperations()
  ]);
}
