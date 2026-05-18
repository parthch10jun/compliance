/**
 * Advanced Workflow Types
 * Production-grade approval workflow system
 */

import type { HRMSUser } from './delegation-types';

// Workflow path types
export type RoutingType = 'sequential' | 'parallel' | 'conditional';
export type ApprovalPoolMode = 'any_of_n' | 'all_of_n' | 'majority';

// Approval actions
export type ApprovalAction = 'approve' | 'reject' | 'request_info' | 'delegate_step';

// SLA Configuration
export interface SLAConfig {
  stepSlaHours: number;
  reminderHours: number[]; // e.g., [24, 2] for reminders at 24hr and 2hr before deadline
  escalationEnabled: boolean;
  escalationTargetLevel: 'manager' | 'n_plus_1' | 'specific_user';
  escalationTargetUser?: string;
  autoEscalateOnBreach: boolean;
}

// Approval Pool
export interface ApprovalPool {
  id: string;
  name: string;
  mode: ApprovalPoolMode;
  members: string[]; // User IDs
  requiredApprovals?: number; // For majority mode
  activeMembers?: string[]; // Currently available (not on leave)
  firstApprover?: string; // For 'any_of_n' - who approved first
}

// Skip Rules
export interface SkipRule {
  id: string;
  condition: string; // e.g., "originator_level >= required_level"
  skipToStep?: number;
  skipLevels?: number;
  description: string;
}

// Conditional Routing
export interface ConditionalRoute {
  condition: string; // e.g., "amount > 1000000"
  routeToStep: number;
  routeToApprover?: string;
  routeToPool?: string;
  description: string;
}

// Workflow Step (Enhanced)
export interface WorkflowStep {
  stepNumber: number;
  stepName: string;
  approverType: 'user' | 'role' | 'pool' | 'conditional';
  
  // Standard approver
  approvers?: string[];
  
  // Pool-based approval
  approvalPool?: ApprovalPool;
  
  // Conditional routing
  conditionalRoutes?: ConditionalRoute[];
  
  // Skip rules
  skipRules?: SkipRule[];
  
  // Configuration
  routingType: RoutingType;
  requiredApprovals: number; // For parallel: all must approve
  allowDelegation: boolean;
  allowRejection: boolean;
  
  // SLA
  sla: SLAConfig;
  
  // Conditions
  conditions?: string;
}

// Workflow Definition
export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  decisionType: string;
  thresholdCondition?: string;
  
  steps: WorkflowStep[];
  
  routingType: RoutingType;
  overallSlaHours: number;
  
  isActive: boolean;
  version: string;
  effectiveDate: string;
  expiryDate?: string;
  
  createdBy: string;
  createdAt: string;
  modifiedBy?: string;
  modifiedAt?: string;
}

// Routing Result
export interface RoutingResult {
  requestId: string;
  workflowId: string;
  approvalChain: ApprovalChainStep[];
  estimatedCompletionHours: number;
  skipApplied: boolean;
  skippedSteps?: number[];
  routingReason: string;
}

export interface ApprovalChainStep {
  stepNumber: number;
  stepName: string;
  approvers: ApproverInfo[];
  routingType: RoutingType;
  requiredApprovals: number;
  slaHours: number;
  deadline?: string;
  canSkip: boolean;
  skipReason?: string;
}

export interface ApproverInfo {
  userId: string;
  userName: string;
  userRole: string;
  isPool: boolean;
  poolInfo?: ApprovalPool;
  isDelegated: boolean;
  originalApprover?: string;
  onLeave: boolean;
  estimatedResponseTime?: number;
}

// Request Recall
export interface RecallRequest {
  requestId: string;
  requestNumber: string;
  recalledBy: string;
  recalledAt: string;
  reason: string;
  currentStep: number;
  hasApprovals: boolean;
  requiresApproverConsent: boolean;
  approverConsentStatus?: 'pending' | 'approved' | 'rejected';
  approverConsentBy?: string;
  approverConsentAt?: string;
  status: 'recalled' | 'pending_consent' | 'rejected';
}

// Request for More Information
export interface InformationRequest {
  id: string;
  requestId: string;
  requestedBy: string;
  requestedByName: string;
  requestedAt: string;
  questions: string;
  requiredBy?: string; // Deadline for response
  responseBy?: string;
  responseAt?: string;
  response?: string;
  attachments?: string[];
  status: 'pending' | 'answered' | 'expired';
}

// Step Delegation (ad-hoc for one request)
export interface StepDelegation {
  id: string;
  requestId: string;
  stepNumber: number;
  originalApprover: string;
  delegate: string;
  delegateeName: string;
  reason: string;
  delegatedAt: string;
  expiresAt?: string;
}

// Mobile/Teams Approval
export interface MobileApproval {
  requestId: string;
  approver: string;
  action: ApprovalAction;
  deviceType: 'mobile' | 'teams' | 'outlook';
  location?: string;
  ipAddress?: string;
  requiresStepUp: boolean; // For high-value approvals
  stepUpCompleted?: boolean;
  stepUpMethod?: 'biometric' | 'mfa' | 'pin';
  timestamp: string;
}
