/**
 * Humanised labels for ChangeRequest enums + a generic humaniser for
 * free-form audit action strings.
 */

import type {
  CRChangeType,
  CRReviewerTeam,
  CRStatus,
  CRValidatorRole,
} from './change-request-types';

export const CR_CHANGE_TYPE_LABELS: Record<CRChangeType, string> = {
  AddNew: 'Add new',
  CascadeDown: 'Cascade down',
  Adjust: 'Adjust',
  Remove: 'Remove',
  Clarify: 'Clarify',
};

export const CR_CHANGE_TYPE_LONG_LABELS: Record<CRChangeType, string> = {
  AddNew: 'Add a new delegation',
  CascadeDown: 'Cascade down an existing delegation',
  Adjust: 'Adjust an existing delegation',
  Remove: 'Remove an existing delegation',
  Clarify: 'Clarify an existing delegation',
};

export const CR_REVIEWER_TEAM_LABELS: Record<CRReviewerTeam, string> = {
  RiskAndAudit: 'Risk & Audit',
  Legal: 'Legal',
  Finance: 'Finance',
  InvestmentGovernance: 'Investment Governance',
  Procurement: 'Procurement',
  HR: 'HR',
  Other: 'Other',
};

export const CR_VALIDATOR_ROLE_LABELS: Record<CRValidatorRole, string> = {
  CFO: 'CFO',
  SVP_General_Counsel: 'SVP General Counsel',
  Risk_Audit_Committee: 'Risk & Audit Committee',
};

export const CR_STATUS_LABELS: Record<CRStatus, string> = {
  Draft: 'Draft',
  PendingL1Endorsement: 'Pending L1 endorsement',
  L1Endorsed: 'In triage (R&A)',
  TriageRejected: 'Triage rejected',
  UnderReview: 'Under review',
  ReviewerRejected: 'Reviewer rejected',
  Validation: 'In validation',
  ValidationRejected: 'Validator rejected',
  PendingApproval: 'Awaiting CEO / Board',
  Approved: 'Approved — pending implementation',
  Implemented: 'Implemented',
  ApproverRejected: 'Approver rejected',
};

/**
 * Fallback humaniser for free-form action strings (audit trail).
 * Splits PascalCase and underscores; leaves acronyms (L1, R&A) intact.
 */
export function humanizeAction(s: string): string {
  return s
    .replace(/_/g, ' ')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
}
