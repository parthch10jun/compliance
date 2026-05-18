/**
 * Policy Management Types
 * Implements BR-POL-01 through BR-POL-08
 */

// BR-POL-02: Policy lifecycle states
export type PolicyState = 
  | 'draft' 
  | 'in_review' 
  | 'approved' 
  | 'effective' 
  | 'superseded' 
  | 'archived';

// BR-POL-01: Policy metadata
export interface PolicyMetadata {
  policyId: string;
  policyNumber: string; // e.g., "DOA-2026-001"
  title: string;
  description: string;
  owner: string; // Policy owner
  department: string;
  category: 'authority_matrix' | 'delegation' | 'workflow' | 'general';
  
  // Versioning
  version: string; // e.g., "1.0", "2.0", "2.1-hotfix"
  versionHistory: PolicyVersion[];
  
  // Dates
  createdDate: string;
  lastModifiedDate: string;
  effectiveDate: string;
  endDate?: string;
  
  // Authorship
  author: string;
  authorEmail: string;
  
  // Governance
  state: PolicyState;
  isHotfix: boolean;
  hotfixExpiryDate?: string;
  
  // Rationale
  changeRationale: string;
  businessJustification: string;
}

// BR-POL-03: Approver sign-off
export interface PolicyApprover {
  role: 'compliance' | 'risk' | 'legal' | 'function_head' | 'ceo' | 'cfo';
  name: string;
  email: string;
  required: boolean;
  signedDate?: string;
  signature?: string; // Digital signature
  comments?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface PolicyApprovalWorkflow {
  workflowId: string;
  requiredApprovers: PolicyApprover[];
  currentStep: number;
  totalSteps: number;
  startedDate: string;
  completedDate?: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Policy version record
export interface PolicyVersion {
  versionNumber: string;
  state: PolicyState;
  effectiveDate: string;
  endDate?: string;
  createdBy: string;
  createdDate: string;
  approvedDate?: string;
  matrixSnapshotId?: string; // Reference to authority matrix version
  changeLog: string;
  pdfArtifactUrl?: string;
  pdfSignature?: string;
}

// BR-POL-04: Diff comparison
export interface PolicyDiff {
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  field: string;
  oldValue?: any;
  newValue?: any;
  path: string; // JSON path to changed field
  annotation?: string;
}

export interface PolicyComparison {
  policyId: string;
  versionA: string;
  versionB: string;
  comparedDate: string;
  differences: PolicyDiff[];
  summary: {
    added: number;
    removed: number;
    modified: number;
    unchanged: number;
  };
}

// BR-POL-07: Hot-fix policy
export interface HotfixPolicy {
  isHotfix: true;
  hotfixReason: string;
  hotfixRequestedBy: string;
  hotfixApprovedBy: string; // Must be C-suite
  hotfixExpiryDate: string; // Mandatory
  hotfixCreatedDate: string;
  permanentReplacementDue?: string;
}

// BR-POL-08: PDF artifact
export interface PolicyPDFArtifact {
  policyId: string;
  version: string;
  generatedDate: string;
  generatedBy: string;
  pdfUrl: string;
  fileSize: number;
  checksum: string; // For tamper detection
  digitalSignatures: {
    signer: string;
    role: string;
    signedDate: string;
    signature: string;
  }[];
  watermark: string;
  metadata: {
    author: string;
    title: string;
    subject: string;
    keywords: string[];
  };
}

// Complete policy object
export interface DoAPolicy {
  // BR-POL-01: Core metadata
  metadata: PolicyMetadata;
  
  // BR-POL-02: State management
  state: PolicyState;
  stateHistory: {
    fromState: PolicyState;
    toState: PolicyState;
    changedBy: string;
    changedDate: string;
    reason: string;
  }[];
  
  // BR-POL-03: Approval workflow
  approvalWorkflow?: PolicyApprovalWorkflow;
  
  // BR-POL-05: Policy management integration
  policyManagementId?: string; // Link to broader policy system
  relatedPolicies: string[]; // Related policy IDs
  
  // BR-POL-06: Future-dated versions
  futureVersions: PolicyVersion[];
  activeVersion: string; // Currently effective version
  
  // BR-POL-07: Hot-fix support
  hotfix?: HotfixPolicy;
  
  // BR-POL-08: PDF artifacts
  pdfArtifacts: PolicyPDFArtifact[];
  
  // Content
  matrixData?: any; // Reference to authority matrix data
  attachments: string[];
  
  // Audit
  auditTrail: {
    action: string;
    performedBy: string;
    performedDate: string;
    details: string;
  }[];
}

// State transition validation
export interface StateTransition {
  from: PolicyState;
  to: PolicyState;
  allowed: boolean;
  requiresApproval: boolean;
  requiredRoles: string[];
}

// Valid state transitions
export const VALID_STATE_TRANSITIONS: StateTransition[] = [
  { from: 'draft', to: 'in_review', allowed: true, requiresApproval: false, requiredRoles: ['author', 'policy_owner'] },
  { from: 'draft', to: 'archived', allowed: true, requiresApproval: false, requiredRoles: ['author'] },
  { from: 'in_review', to: 'draft', allowed: true, requiresApproval: false, requiredRoles: ['author'] },
  { from: 'in_review', to: 'approved', allowed: true, requiresApproval: true, requiredRoles: ['compliance', 'risk', 'legal'] },
  { from: 'approved', to: 'effective', allowed: true, requiresApproval: false, requiredRoles: ['system'] },
  { from: 'effective', to: 'superseded', allowed: true, requiresApproval: false, requiredRoles: ['system'] },
  { from: 'superseded', to: 'archived', allowed: true, requiresApproval: false, requiredRoles: ['policy_admin'] },
];

export function canTransitionState(from: PolicyState, to: PolicyState): StateTransition | null {
  return VALID_STATE_TRANSITIONS.find(t => t.from === from && t.to === to) || null;
}
