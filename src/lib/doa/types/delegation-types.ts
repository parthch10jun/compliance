/**
 * Advanced Delegation Types
 * Implements BR-DEL-01 through BR-DEL-10
 */

// BR-DEL-01: Role-based authority (HRMS integration mock)
export interface Role {
  id: string;
  name: string;
  grade: number; // 1-10, for grade comparison
  department: string;
  authorityLimit: number;
  currency: string;
}

export interface HRMSUser {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  manager?: HRMSUser;
  isOnLeave: boolean;
  leaveStartDate?: string;
  leaveEndDate?: string;
  grade: number;
}

// BR-DEL-02: Three delegation types
export type DelegationType = 'permanent' | 'temporary' | 'acting' | 'ooo';

export interface DelegationWorkflow {
  type: DelegationType;
  requiresApproval: boolean;
  approvers: string[];
  autoActivate: boolean;
}

// BR-DEL-03: Partial scope delegation
export interface DelegationScope {
  full: boolean; // If true, delegate entire role
  functions?: string[]; // Specific functions (e.g., ['IT', 'Procurement'])
  categories?: string[]; // Specific categories
  monetaryCap?: number; // Max amount delegate can approve
  currency?: string;
  entities?: string[]; // Legal entities
  regions?: string[];
}

// BR-DEL-04: Monetary cap enforcement
export interface MonetaryCap {
  amount: number;
  currency: string;
  delegatorLimit: number; // For validation: cap <= delegatorLimit
  validated: boolean;
}

// BR-DEL-05: Manager approval requirement
export interface ApprovalRequirement {
  required: boolean;
  reason: 'grade_difference' | 'monetary_threshold' | 'compliance' | 'none';
  gradeDifference?: number; // How many grades below
  approver?: string; // Manager or compliance officer
  status: 'pending' | 'approved' | 'rejected';
}

// BR-DEL-06: Circular delegation prevention
export interface CircularDelegationCheck {
  isCircular: boolean;
  detectedCycle?: string[]; // Path showing the cycle
  isSoDRelevant: boolean;
  preventionReason?: string;
}

// BR-DEL-07: Auto-expiry and revocation
export interface DelegationLifecycle {
  status: 'draft' | 'pending_approval' | 'active' | 'expired' | 'revoked';
  activationDate: string;
  expiryDate?: string;
  autoExpire: boolean;
  revocable: boolean;
  revokedBy?: string;
  revokedAt?: string;
  revocationReason?: string;
}

// BR-DEL-08: HRMS leave integration with fallback chain
export interface FallbackChain {
  primary: HRMSUser;
  delegate?: HRMSUser;
  delegatesDelegate?: HRMSUser;
  manager?: HRMSUser;
  activeApprover: HRMSUser; // Who should approve now
  reason: 'primary_available' | 'primary_on_leave' | 'delegate_on_leave' | 'escalated_to_manager';
}

// BR-DEL-09: Emergency delegation
export interface EmergencyDelegation {
  isEmergency: boolean;
  activationTimestamp?: string; // Must be within 60s
  activationSLA: number; // Seconds
  authorizingOfficer?: string; // Higher-level authorization
  complianceReviewRequired: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  justification?: string;
}

// BR-DEL-10: Delegation visibility and filtering
export interface DelegationFilter {
  status?: ('active' | 'scheduled' | 'expired' | 'revoked')[];
  type?: DelegationType[];
  delegator?: string;
  delegate?: string;
  dateFrom?: string;
  dateTo?: string;
  function?: string;
}

// Complete Delegation Record
export interface AdvancedDelegation {
  id: string;
  
  // BR-DEL-01: Role-based
  delegatorRole: Role;
  delegateRole: Role;
  delegatorUser: HRMSUser;
  delegateUser: HRMSUser;
  
  // BR-DEL-02: Type and workflow
  type: DelegationType;
  workflow: DelegationWorkflow;
  
  // BR-DEL-03: Scope
  scope: DelegationScope;
  
  // BR-DEL-04: Monetary cap
  monetaryCap?: MonetaryCap;
  
  // BR-DEL-05: Approval
  approval: ApprovalRequirement;
  
  // BR-DEL-06: Circular check
  circularCheck: CircularDelegationCheck;
  
  // BR-DEL-07: Lifecycle
  lifecycle: DelegationLifecycle;
  
  // BR-DEL-08: Fallback chain
  fallbackChain?: FallbackChain;
  
  // BR-DEL-09: Emergency
  emergency?: EmergencyDelegation;
  
  // Metadata
  createdBy: string;
  createdAt: string;
  modifiedBy?: string;
  modifiedAt?: string;
}

// Validation Result
export interface DelegationValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  circularDelegation?: CircularDelegationCheck;
  monetaryCapValid?: boolean;
  approvalRequired?: ApprovalRequirement;
}
