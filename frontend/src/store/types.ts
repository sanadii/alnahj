// ==============================|| ROOT STATE TYPE ||============================== //
// Election Management System

// Define the root state type matching our actual reducers
export interface RootState {
  // Authentication
  auth: any;

  // User profile
  user: any;

  // Users management
  users: any;

  // Elections
  elections: any;

  // Committees
  committees: any;

  // Snackbar notifications
  snackbar: any;
}
