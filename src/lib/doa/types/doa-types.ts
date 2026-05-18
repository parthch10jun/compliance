/**
 * Delegation of Authority (DoA) Module - Type Definitions
 * 
 * This file contains all TypeScript interfaces and types for the DoA module.
 * Based on the complete BRD requirements (sections 3-7).
 */

// ============================================================================
// AUTHORITY MATRIX TYPES
// ============================================================================

export interface AuthorityMatrix {
  id: string;
  name: string;
  description: string;
  version: string;
  effectiveDate: string;
  expiryDate?: string;
  status: 'Draft' | 'Active' | 'Superseded' | 'Archived';
  
  // Organizational scope
  applicableEntities: string[]; // Legal entities, BUs, etc.
  function: 'Financial' | 'Procurement' | 'HR' | 'IT' | 'Legal' | 'Operations' | 'Sales' | 'Risk' | 'Compliance' | 'ESG';
  
  // Authority entries
  entries: AuthorityEntry[];
  
  // Approval & governance
  approvedBy: string;
  approvalDate: string;
  nextReviewDate: string;
  
  // Metadata
  createdBy: string;
  createdDate: string;
  modifiedBy?: string;
  modifiedDate?: string;
}

export interface AuthorityEntry {
  id: string;
  matrixId: string;
  
  // Decision type
  decisionType: string; // e.g., "Purchase Order", "Hiring", "Contract Approval"
  category: 'Monetary' | 'Non-Monetary';
  
  // Thresholds
  monetaryThreshold?: {
    min: number;
    max: number;
    currency: string;
  };
  nonMonetaryCondition?: string;
  
  // Authorization levels
  requiredRole: string;
  requiredGrade?: string;
  authorityLevel: 'Board' | 'Executive' | 'Senior Management' | 'Management' | 'Operational';
  
  // Approval workflow
  approvalType: 'Single' | 'Multi-Level' | 'Parallel' | 'Conditional';
  approvers: string[]; // Role IDs or specific users
  escalationPath?: string[];
  
  // Entity/jurisdiction overlay
  legalEntity?: string;
  country?: string;
  businessUnit?: string;
  costCenter?: string;
  
  // SoD rules
  sodRuleIds: string[];
  
  // Additional constraints
  additionalConditions?: string;
  requiresDocumentation?: boolean;
  requiresJustification?: boolean;
}

// ============================================================================
// DELEGATION TYPES
// ============================================================================

export interface DelegationRecord {
  id: string;
  type: 'Permanent' | 'Temporary' | 'Acting' | 'Interim' | 'Project-Based' | 'OOO';

  // Delegation details
  delegator: string; // Original authority holder
  delegatorName: string;
  delegate: string; // Person receiving authority
  delegateName: string;
  authorityType: string; // What authority is being delegated

  // Scope
  authorityEntryIds: string[]; // Which authority entries
  scope: string; // Description of delegated authority

  // Duration
  startDate: string;
  endDate?: string;
  isActive: boolean;

  // Limits
  monetaryLimit?: number;
  transactionLimit?: number; // Max transactions per period
  geographicScope?: string[];

  // Approval & tracking
  approvedBy: string;
  approvalDate: string;
  rationale: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Expired' | 'Revoked';

  // Metadata
  createdBy: string;
  createdDate: string;
  revokedBy?: string;
  revokedDate?: string;
  revokedReason?: string;
}

// ============================================================================
// APPROVAL WORKFLOW TYPES
// ============================================================================

export interface ApprovalWorkflow {
  id: string;
  name: string;
  description: string;

  // Trigger
  decisionType: string;
  thresholdCondition: string;

  // Workflow steps
  steps: ApprovalStep[];

  // Routing logic
  routingType: 'Sequential' | 'Parallel' | 'Conditional';

  // SLA
  slaHours: number;
  escalationAfterHours: number;
  escalationTo: string[];

  // Status
  isActive: boolean;
  version: string;
}

export interface ApprovalStep {
  stepNumber: number;
  stepName: string;
  approverType: 'Role' | 'User' | 'Group' | 'Dynamic';
  approvers: string[];

  // Step requirements
  requiredApprovals: number; // For parallel voting
  allowDelegation: boolean;
  allowRejection: boolean;

  // SLA for this step
  stepSlaHours: number;

  // Conditions
  conditions?: string; // When this step applies
  skipConditions?: string; // When to skip this step
}

export interface ApprovalRequest {
  id: string;
  requestNumber: string; // Auto-generated (APR-00001)

  // Request details
  requestType: string;
  description: string;
  requestedBy: string;
  requestedByName: string;
  requestedDate: string;

  // Business details
  businessUnit: string;
  costCenter?: string;
  project?: string;

  // Financial details
  monetaryAmount?: number;
  currency?: string;
  budgetCode?: string;

  // Workflow
  workflowId: string;
  currentStep: number;
  status: 'Draft' | 'Submitted' | 'Pending' | 'Approved' | 'Rejected' | 'Withdrawn' | 'Expired';

  // Approvals received
  approvalHistory: ApprovalAction[];

  // Documents
  attachments: string[];
  justification: string;

  // SoD check
  sodCheckPassed: boolean;
  sodConflicts?: SoDConflict[];

  // Exception handling
  isException: boolean;
  isEmergency: boolean;
  overrideReason?: string;
  compensatingControls?: string[];

  // Timestamps
  submittedDate?: string;
  completedDate?: string;
  expiryDate?: string;

  // SLA tracking
  slaDeadline?: string;
  slaStatus?: 'On Time' | 'At Risk' | 'Breached';
}

export interface ApprovalAction {
  id: string;
  approver: string;
  approverName: string;
  action: 'Approved' | 'Rejected' | 'Delegated' | 'Returned for Clarification';
  actionDate: string;
  comments?: string;
  stepNumber: number;
}

// ============================================================================
// SEGREGATION OF DUTIES (SOD) TYPES
// ============================================================================

export interface SoDRule {
  id: string;
  name: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';

  // Conflicting functions
  function1: string;
  function2: string;

  // Rule details
  conflictType: 'Same User' | 'Same Role' | 'Reporting Line' | 'Same Department';
  riskDescription: string;

  // Remediation
  allowOverride: boolean;
  requiresApproval: boolean;
  compensatingControls: string[];

  // Scope
  applicableEntities: string[];

  // Status
  isActive: boolean;

  // Metadata
  regulatoryReference?: string; // e.g., "SOX §404", "MiFID II"
  createdBy: string;
  createdDate: string;
}

export interface SoDConflict {
  id: string;
  ruleId: string;
  ruleName: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  conflictDescription: string;
  affectedUsers: string[];
  affectedUserNames: string[];
  detectedDate: string;

  // Resolution
  status: 'Open' | 'Remediated' | 'Accepted with Compensating Controls' | 'Override Approved';
  resolution?: string;
  compensatingControls?: string[];
  approvedBy?: string;
  approvedByName?: string;
  approvalDate?: string;
  resolvedDate?: string;
}

// ============================================================================
// EXCEPTION & OVERRIDE TYPES
// ============================================================================

export interface ExceptionRequest {
  id: string;
  exceptionNumber: string; // EXC-00001

  // Exception details
  exceptionType: 'Threshold Override' | 'SoD Conflict Override' | 'Emergency Approval' | 'Policy Exception';
  authorityRuleId?: string;
  authorityRuleName?: string;

  // Request info
  requestedBy: string;
  requestedByName: string;
  requestedDate: string;

  // Justification
  justification: string;
  riskAssessment: string;

  // Duration
  isTemporary: boolean;
  startDate?: string;
  endDate?: string;

  // Compensating controls
  compensatingControls: string[];

  // Approval
  approvers: string[];
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  approvedByName?: string;
  approvalDate?: string;
  rejectionReason?: string;

  // Related items
  relatedApprovalId?: string;
  relatedSoDConflictId?: string;
}

// ============================================================================
// USER & ROLE TYPES
// ============================================================================

export interface DoAUser {
  id: string;
  name: string;
  email: string;
  role: string;
  grade?: string;
  department: string;
  businessUnit: string;
  manager?: string;
  managerName?: string;
  isActive: boolean;
}

// ============================================================================
// DASHBOARD & REPORTING TYPES
// ============================================================================

export interface DoAKPIMetrics {
  totalActiveAuthorities: number;
  pendingApprovals: number;
  activeDelegations: number;
  sodConflictsDetected: number;
  avgApprovalTimeHours: number;
  exceptionRate: number; // Percentage
}

export interface ApprovalTrendData {
  month: string;
  submitted: number;
  approved: number;
  rejected: number;
}

export interface AuthorityUsageData {
  function: string;
  usageCount: number;
  percentage: number;
}

export interface DelegationTimelineData {
  delegationId: string;
  delegator: string;
  delegate: string;
  startDate: string;
  endDate: string;
  type: string;
}

// ============================================================================
// AUDIT TRAIL TYPES
// ============================================================================

export interface AuditTrailEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entityType: 'Authority Matrix' | 'Delegation' | 'Approval Request' | 'SoD Rule' | 'Exception' | 'Workflow';
  entityId: string;
  entityName?: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  ipAddress?: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface NotificationSettings {
  userId: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  teamsNotifications: boolean;
  slackNotifications: boolean;
  inAppNotifications: boolean;
  mobilePushNotifications: boolean;

  // Reminder cadence (percentage of SLA)
  reminderAt50Percent: boolean;
  reminderAt80Percent: boolean;
  reminderAt100Percent: boolean;

  // Quiet hours
  quietHoursEnabled: boolean;
  quietHoursStart?: string; // HH:MM
  quietHoursEnd?: string; // HH:MM
  timezone?: string;
}

// ============================================================================
// FILTER & SEARCH TYPES
// ============================================================================

export interface ApprovalFilters {
  status?: ('Draft' | 'Submitted' | 'Pending' | 'Approved' | 'Rejected' | 'Withdrawn' | 'Expired')[];
  requestType?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  businessUnit?: string[];
  requestedBy?: string[];
}

export interface DelegationFilters {
  type?: ('Permanent' | 'Temporary' | 'Acting' | 'Interim' | 'Project-Based' | 'OOO')[];
  status?: ('Pending' | 'Approved' | 'Rejected' | 'Expired' | 'Revoked')[];
  delegator?: string[];
  delegate?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface SoDConflictFilters {
  severity?: ('Critical' | 'High' | 'Medium' | 'Low')[];
  status?: ('Open' | 'Remediated' | 'Accepted with Compensating Controls' | 'Override Approved')[];
  affectedUser?: string[];
  ruleId?: string[];
}
