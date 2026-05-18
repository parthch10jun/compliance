/**
 * DoA Module - Mock Data Index
 * Central export for all mock data
 */

// Users
export {
  mockUsers,
  getUserById,
  getUsersByRole,
  getUsersByDepartment,
  getUsersByBusinessUnit,
} from './mockUsers';

// Authority Matrices
export {
  mockAuthorityMatrices,
  getMatrixById,
  getMatrixByFunction,
  getActiveMatrices,
  getTotalAuthorityEntries,
} from './mockAuthorityMatrices';

// SoD Rules and Conflicts
export {
  mockSoDRules,
  mockSoDConflicts,
  getSoDRuleById,
  getSoDRulesBySeverity,
  getActiveSoDRules,
  getSoDConflictById,
  getOpenSoDConflicts,
  getSoDConflictsBySeverity,
} from './mockSoDRules';

// Delegations
export {
  mockDelegations,
  getDelegationById,
  getActiveDelegations,
  getDelegationsByType,
  getDelegationsByDelegator,
  getDelegationsByDelegate,
  getExpiringDelegations,
} from './mockDelegations';

// Workflows
export {
  mockWorkflows,
  getWorkflowById,
  getWorkflowByDecisionType,
  getActiveWorkflows,
} from './mockWorkflows';

// Approval Requests
export {
  mockApprovalRequests,
  getApprovalById,
  getApprovalByRequestNumber,
  getPendingApprovals,
  getApprovedRequests,
  getRejectedRequests,
  getEmergencyApprovals,
  getApprovalsByRequestedBy,
  getApprovalsByStatus,
} from './mockApprovals';

// Dashboard KPIs (computed from mock data)
import { DoAKPIMetrics } from '../types/doa-types';

export const getDoAKPIMetrics = (): DoAKPIMetrics => {
  const { mockAuthorityMatrices } = require('./mockAuthorityMatrices');
  const { getPendingApprovals } = require('./mockApprovals');
  const { getActiveDelegations } = require('./mockDelegations');
  const { getOpenSoDConflicts } = require('./mockSoDRules');
  const { mockApprovalRequests } = require('./mockApprovals');
  
  // Calculate total active authorities
  const totalActiveAuthorities = mockAuthorityMatrices
    .filter((m: any) => m.status === 'Active')
    .reduce((sum: number, m: any) => sum + m.entries.length, 0);
  
  // Get pending approvals count
  const pendingApprovals = getPendingApprovals().length;
  
  // Get active delegations count
  const activeDelegations = getActiveDelegations().length;
  
  // Get open SoD conflicts count
  const sodConflictsDetected = getOpenSoDConflicts().length;
  
  // Calculate average approval time (in hours) from completed approvals
  const completedApprovals = mockApprovalRequests.filter((apr: any) => 
    apr.status === 'Approved' && apr.submittedDate && apr.completedDate
  );
  
  let avgApprovalTimeHours = 0;
  if (completedApprovals.length > 0) {
    const totalHours = completedApprovals.reduce((sum: number, apr: any) => {
      const submitted = new Date(apr.submittedDate).getTime();
      const completed = new Date(apr.completedDate).getTime();
      const hours = (completed - submitted) / (1000 * 60 * 60);
      return sum + hours;
    }, 0);
    avgApprovalTimeHours = Math.round(totalHours / completedApprovals.length * 10) / 10;
  }
  
  // Calculate exception rate (emergency approvals / total approvals * 100)
  const emergencyCount = mockApprovalRequests.filter((apr: any) => apr.isEmergency).length;
  const exceptionRate = Math.round((emergencyCount / mockApprovalRequests.length) * 1000) / 10;
  
  return {
    totalActiveAuthorities,
    pendingApprovals,
    activeDelegations,
    sodConflictsDetected,
    avgApprovalTimeHours,
    exceptionRate,
  };
};
