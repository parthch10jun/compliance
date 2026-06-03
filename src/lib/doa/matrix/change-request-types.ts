/**
 * DoA Change Request — type definitions.
 *
 * The governed process by which the Authority Matrix mutates. A CR moves
 * through a state machine — drafted by anyone, L1-endorsed, triaged by
 * Risk & Audit, reviewed by a cascade of teams, validated by executives,
 * approved by CEO or Board, and finally implemented (which mints a new
 * matrix version).
 */

export type CRChangeType =
  | 'AddNew'         // add a new delegation row
  | 'CascadeDown'    // delegate down to a lower role
  | 'Adjust'         // adjust an existing cell (cap, conditions)
  | 'Remove'         // remove a delegation or role authority
  | 'Clarify';       // clarify description, notes, references

export type CRStatus =
  | 'Draft'
  | 'PendingL1Endorsement'
  | 'L1Endorsed'           // in Risk & Audit triage queue
  | 'TriageRejected'
  | 'UnderReview'          // R&A accepted; reviewer cascade in progress
  | 'ReviewerRejected'
  | 'Validation'           // reviewers complete; validator chain
  | 'ValidationRejected'
  | 'PendingApproval'      // validators complete; CEO/Board sign-off
  | 'Approved'             // approver signed off; pending implementation
  | 'Implemented'          // matrix version published
  | 'ApproverRejected';

export type CRReviewerTeam =
  | 'RiskAndAudit'         // always the lead
  | 'Legal'
  | 'Finance'
  | 'InvestmentGovernance'
  | 'Procurement'          // ad hoc
  | 'HR'                   // ad hoc
  | 'Other';

export type CRReviewerAction = 'Approved' | 'Rejected' | 'RequestedChanges';

export interface CRReviewerStep {
  team: CRReviewerTeam;
  required: boolean;       // false for ad-hoc teams that may be skipped
  reviewerUserId?: string | null;
  reviewerUserName?: string | null;
  action?: CRReviewerAction | null;
  actionDate?: string | null;
  comment?: string | null;
}

export type CRValidatorRole =
  | 'CFO'
  | 'SVP_General_Counsel'
  | 'Risk_Audit_Committee';

export interface CRValidatorStep {
  role: CRValidatorRole;
  validatorUserId?: string | null;
  validatorUserName?: string | null;
  action?: 'Approved' | 'Rejected' | null;
  actionDate?: string | null;
  comment?: string | null;
}

export interface CRAuditEntry {
  id: string;
  timestamp: string;
  actorUserId: string;
  actorUserName: string;
  action: string;            // 'Created', 'Submitted', 'L1Endorsed', 'TriageAccepted', etc.
  comment?: string;
}

export interface ChangeRequest {
  id: string;                                  // 'CR-001'
  number: string;                              // human-friendly 'CR-2026-001'

  // Section 1 — Requestor identification
  requestorUserId: string;
  requestorUserName: string;
  requestorRole: string;                       // free-text job title at request time
  requestDate: string;                         // ISO
  contactPersonUserId?: string | null;
  contactPersonUserName?: string | null;

  // Section 2 — Requested change details
  changeType: CRChangeType;
  targetDelegationId?: string | null;          // for Adjust / Remove / Cascade / Clarify
  targetRoleId?: string | null;                // for cell-level changes
  proposedDescription?: string | null;         // for AddNew or for editing description
  proposedChange: string;                      // free-text summary of what's changing
  justification: string;
  impactAssessment: string;
  effectiveDate?: string | null;

  // L1 endorsement
  l1EndorserUserId?: string | null;
  l1EndorserUserName?: string | null;
  l1EndorsedAt?: string | null;
  l1EndorsementComment?: string | null;

  // Section 3 — Approval flow
  reviewerSteps: CRReviewerStep[];
  validatorSteps: CRValidatorStep[];
  approverUserId?: string | null;
  approverUserName?: string | null;
  approverScope?: 'CEO' | 'Board' | null;
  approverDecision?: 'Approved' | 'Rejected' | null;
  approverDate?: string | null;
  approverComment?: string | null;

  // Section 4 — Implementation & Tracking
  implementedByUserId?: string | null;
  implementedByUserName?: string | null;
  implementedDate?: string | null;
  resultingMatrixVersion?: string | null;      // e.g., '1.5'
  communicationsNotes?: string | null;

  // Lifecycle
  status: CRStatus;
  createdAt: string;
  submittedAt?: string | null;
  closedAt?: string | null;

  // Rejection / closure
  rejectionStage?: 'L1' | 'Triage' | 'Reviewer' | 'Validator' | 'Approver' | null;
  rejectionByUserId?: string | null;
  rejectionByUserName?: string | null;
  rejectionDate?: string | null;
  rejectionReason?: string | null;

  auditTrail: CRAuditEntry[];
}
