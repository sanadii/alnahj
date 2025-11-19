// ========================================
// API Functions - Centralized Export
// Import all API functions from one place
// ========================================

// Re-export all EXISTING API modules
// Last updated: November 3, 2025
export * from './account';
export * from './attendance';
export * from './auth';
export * from './committees';
export * from './config';
export * from './dashboard';
export * from './elections';
export * from './electors';
export * from './guarantees';
export * from './parties';
export * from './results';
export * from './user';
export * from './users';
export * from './voting';

// ========================================
// REMOVED NON-EXISTENT MODULES (Previously causing import errors):
// ========================================
// - business, calendar, campaigns, clients, crm, customer
// - finance, hr, intelligence, inventory, kanban, mail
// - mobile, projects, sales, services, staff
//
// These were placeholder exports from a template and never existed in this project.
// If you need these modules, create them first before adding exports here.
// ========================================

// ========================================
// Usage Examples:
// ========================================
//
// Option 1: Import from specific module (RECOMMENDED)
// import { getClients, createClient } from '@/helpers/api/clients';
//
// Option 2: Import from index (all APIs)
// import { getClients, getSalesTransactions } from '@/helpers/api';
//
// Option 3: Import module as namespace
// import * as ClientsAPI from '@/helpers/api/clients';
// ClientsAPI.getClients()
//
// ========================================
// Module Structure:
// ========================================
//
// Each API module follows the same pattern:
// 1. Import APIClient from '../api_helper'
// 2. Import URLs from '../urls/{module}'
// 3. Create single api instance
// 4. Export type-safe functions
//
// Example:
// ```typescript
// import { APIClient } from '../api_helper';
// import * as URL from '../urls/clients';
//
// const api = new APIClient();
//
// export const getClients = (params) => api.get(URL.CLIENTS_LIST);
// export const createClient = (data) => api.post(URL.CLIENTS_ADD_CLIENT, data);
// ```
//
// ========================================
// API Client Features:
// ========================================
//
// - Automatic token management (Bearer auth)
// - CSRF token handling for Django
// - Automatic token refresh on 401
// - Error handling
// - Request/response interceptors
// - Type-safe methods: get, post, put, patch, delete
//
// ========================================
