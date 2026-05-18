/**
 * Enhanced Data Functions
 * Merge mock data with localStorage data for demo persistence
 */

import { ApprovalRequest, DelegationRecord, AuthorityMatrix, SoDRule } from '../types/doa-types';
import { mockApprovalRequests } from './mockApprovals';
import { mockDelegations } from './mockDelegations';
import { mockAuthorityMatrices } from './mockAuthorityMatrices';
import { mockSoDRules } from './mockSoDRules';
import {
  getApprovalsFromLocalStorage,
  getDelegationsFromLocalStorage,
  getMatricesFromLocalStorage,
  getSoDRulesFromLocalStorage,
} from '../utils/localStorage';

// ============================================================================
// APPROVALS
// ============================================================================

export const getAllApprovals = (): ApprovalRequest[] => {
  const localStorage = getApprovalsFromLocalStorage();
  return [...localStorage, ...mockApprovalRequests];
};

export const getApprovalById = (id: string): ApprovalRequest | undefined => {
  const all = getAllApprovals();
  return all.find(a => a.id === id);
};

export const getPendingApprovals = (): ApprovalRequest[] => {
  return getAllApprovals().filter(a => a.status === 'Pending');
};

export const getApprovedRequests = (): ApprovalRequest[] => {
  return getAllApprovals().filter(a => a.status === 'Approved');
};

export const getRejectedRequests = (): ApprovalRequest[] => {
  return getAllApprovals().filter(a => a.status === 'Rejected');
};

export const getApprovalsByStatus = (status: string): ApprovalRequest[] => {
  return getAllApprovals().filter(a => a.status === status);
};

// ============================================================================
// DELEGATIONS
// ============================================================================

export const getAllDelegations = (): DelegationRecord[] => {
  const localStorage = getDelegationsFromLocalStorage();
  return [...localStorage, ...mockDelegations];
};

export const getDelegationById = (id: string): DelegationRecord | undefined => {
  const all = getAllDelegations();
  return all.find(d => d.id === id);
};

export const getActiveDelegations = (): DelegationRecord[] => {
  return getAllDelegations().filter(d => d.isActive);
};

export const getDelegationsByType = (type: string): DelegationRecord[] => {
  return getAllDelegations().filter(d => d.type === type);
};

// ============================================================================
// AUTHORITY MATRICES
// ============================================================================

export const getAllMatrices = (): AuthorityMatrix[] => {
  const localStorage = getMatricesFromLocalStorage();
  return [...localStorage, ...mockAuthorityMatrices];
};

export const getMatrixById = (id: string): AuthorityMatrix | undefined => {
  const all = getAllMatrices();
  return all.find(m => m.id === id);
};

export const getActiveMatrices = (): AuthorityMatrix[] => {
  return getAllMatrices().filter(m => m.status === 'Active');
};

export const getMatrixByFunction = (func: string): AuthorityMatrix[] => {
  return getAllMatrices().filter(m => m.function === func);
};

// ============================================================================
// SOD RULES
// ============================================================================

export const getAllSoDRules = (): SoDRule[] => {
  const localStorage = getSoDRulesFromLocalStorage();
  return [...localStorage, ...mockSoDRules];
};

export const getSoDRuleById = (id: string): SoDRule | undefined => {
  const all = getAllSoDRules();
  return all.find(r => r.id === id);
};

export const getActiveSoDRules = (): SoDRule[] => {
  return getAllSoDRules().filter(r => r.isActive);
};

export const getSoDRulesBySeverity = (severity: 'Critical' | 'High' | 'Medium' | 'Low'): SoDRule[] => {
  return getAllSoDRules().filter(r => r.severity === severity);
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export {
  saveApprovalToLocalStorage,
  saveDelegationToLocalStorage,
  saveMatrixToLocalStorage,
  saveSoDRuleToLocalStorage,
  generateApprovalId,
  generateDelegationId,
  generateMatrixId,
  generateSoDRuleId,
  clearAllDemoData,
} from '../utils/localStorage';
