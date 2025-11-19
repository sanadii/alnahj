/**
 * URL Constants - Centralized Export
 * Election Management System - All API Endpoint Constants
 */

// ============================================================================
// RE-EXPORT ALL URL MODULES
// ============================================================================

export * from './account';
export * from './attendance';
export * from './committees';
export * from './config';
export * from './electors';
export * from './elections';
export * from './guarantees';
export * from './users';
export * from './voting';

// ============================================================================
// USAGE EXAMPLES
// ============================================================================
//
// Option 1: Import from specific module (RECOMMENDED)
// import { ELECTORS_LIST, electorDetail } from 'helpers/urls/electors';
//
// Option 2: Import from index (all URLs)
// import { ELECTORS_LIST, GUARANTEES_LIST } from 'helpers/urls';
//
// Option 3: Import module as namespace
// import * as ElectorURLs from 'helpers/urls/electors';
// ElectorURLs.ELECTORS_LIST
// ElectorURLs.electorDetail('KOC123')
//
// ============================================================================
