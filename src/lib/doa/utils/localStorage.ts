/**
 * LocalStorage Persistence Utility
 * Manages storing and retrieving user-created items that persist during demo
 */

import { ApprovalRequest, DelegationRecord, AuthorityMatrix, SoDRule } from '../types/doa-types';

// Storage keys
const STORAGE_KEYS = {
  APPROVALS: 'doa_approvals',
  DELEGATIONS: 'doa_delegations',
  MATRICES: 'doa_matrices',
  SOD_RULES: 'doa_sod_rules',
};

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// ============================================================================
// APPROVALS
// ============================================================================

export const saveApprovalToLocalStorage = (approval: ApprovalRequest): void => {
  if (!isBrowser) return;
  
  const stored = localStorage.getItem(STORAGE_KEYS.APPROVALS);
  const approvals: ApprovalRequest[] = stored ? JSON.parse(stored) : [];
  
  approvals.unshift(approval); // Add to beginning
  localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(approvals));
};

export const getApprovalsFromLocalStorage = (): ApprovalRequest[] => {
  if (!isBrowser) return [];
  
  const stored = localStorage.getItem(STORAGE_KEYS.APPROVALS);
  return stored ? JSON.parse(stored) : [];
};

export const clearApprovalsFromLocalStorage = (): void => {
  if (!isBrowser) return;
  localStorage.removeItem(STORAGE_KEYS.APPROVALS);
};

// ============================================================================
// DELEGATIONS
// ============================================================================

export const saveDelegationToLocalStorage = (delegation: DelegationRecord): void => {
  if (!isBrowser) return;
  
  const stored = localStorage.getItem(STORAGE_KEYS.DELEGATIONS);
  const delegations: DelegationRecord[] = stored ? JSON.parse(stored) : [];
  
  delegations.unshift(delegation);
  localStorage.setItem(STORAGE_KEYS.DELEGATIONS, JSON.stringify(delegations));
};

export const getDelegationsFromLocalStorage = (): DelegationRecord[] => {
  if (!isBrowser) return [];
  
  const stored = localStorage.getItem(STORAGE_KEYS.DELEGATIONS);
  return stored ? JSON.parse(stored) : [];
};

export const clearDelegationsFromLocalStorage = (): void => {
  if (!isBrowser) return;
  localStorage.removeItem(STORAGE_KEYS.DELEGATIONS);
};

// ============================================================================
// AUTHORITY MATRICES
// ============================================================================

export const saveMatrixToLocalStorage = (matrix: AuthorityMatrix): void => {
  if (!isBrowser) return;
  
  const stored = localStorage.getItem(STORAGE_KEYS.MATRICES);
  const matrices: AuthorityMatrix[] = stored ? JSON.parse(stored) : [];
  
  matrices.unshift(matrix);
  localStorage.setItem(STORAGE_KEYS.MATRICES, JSON.stringify(matrices));
};

export const getMatricesFromLocalStorage = (): AuthorityMatrix[] => {
  if (!isBrowser) return [];
  
  const stored = localStorage.getItem(STORAGE_KEYS.MATRICES);
  return stored ? JSON.parse(stored) : [];
};

export const clearMatricesFromLocalStorage = (): void => {
  if (!isBrowser) return;
  localStorage.removeItem(STORAGE_KEYS.MATRICES);
};

// ============================================================================
// SOD RULES
// ============================================================================

export const saveSoDRuleToLocalStorage = (rule: SoDRule): void => {
  if (!isBrowser) return;
  
  const stored = localStorage.getItem(STORAGE_KEYS.SOD_RULES);
  const rules: SoDRule[] = stored ? JSON.parse(stored) : [];
  
  rules.unshift(rule);
  localStorage.setItem(STORAGE_KEYS.SOD_RULES, JSON.stringify(rules));
};

export const getSoDRulesFromLocalStorage = (): SoDRule[] => {
  if (!isBrowser) return [];
  
  const stored = localStorage.getItem(STORAGE_KEYS.SOD_RULES);
  return stored ? JSON.parse(stored) : [];
};

export const clearSoDRulesFromLocalStorage = (): void => {
  if (!isBrowser) return;
  localStorage.removeItem(STORAGE_KEYS.SOD_RULES);
};

// ============================================================================
// UTILITY: Clear all demo data
// ============================================================================

export const clearAllDemoData = (): void => {
  if (!isBrowser) return;
  
  clearApprovalsFromLocalStorage();
  clearDelegationsFromLocalStorage();
  clearMatricesFromLocalStorage();
  clearSoDRulesFromLocalStorage();
};

// ============================================================================
// UTILITY: Generate unique IDs
// ============================================================================

export const generateApprovalId = (): string => {
  const count = getApprovalsFromLocalStorage().length;
  return `apr-demo-${String(count + 100).padStart(3, '0')}`;
};

export const generateDelegationId = (): string => {
  const count = getDelegationsFromLocalStorage().length;
  return `del-demo-${String(count + 100).padStart(3, '0')}`;
};

export const generateMatrixId = (): string => {
  const count = getMatricesFromLocalStorage().length;
  return `matrix-demo-${String(count + 100).padStart(3, '0')}`;
};

export const generateSoDRuleId = (): string => {
  const count = getSoDRulesFromLocalStorage().length;
  return `sod-demo-${String(count + 100).padStart(3, '0')}`;
};
