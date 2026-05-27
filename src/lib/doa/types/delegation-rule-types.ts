/**
 * Delegation Rule — unified DoA object
 *
 * One record captures: what authority is delegated, the threshold,
 * the runtime approval chain that handles matching requests, the
 * compliance link, and the lifecycle/versioning of the rule itself.
 *
 * Distinct from the legacy DelegationRecord (OOO-only). Lives alongside it.
 */

export type DelegationCategory = 'Financial' | 'Non-Financial';

export type DelegationLifecycleType =
  | 'Permanent'
  | 'Temporary'
  | 'Project-Based'
  | 'OOO';

export type DelegationStatus =
  | 'Draft'
  | 'PendingApproval'
  | 'Active'
  | 'PendingModification'
  | 'Rejected'
  | 'Suspended'
  | 'Revoked'
  | 'Expired';

export interface DelegationScope {
  monetaryCap?: {
    amount: number;
    currency: string;
  };
  percentageCap?: number;
  quantityCap?: number;
  regions?: string[];
  functions?: string[];
  businessUnits?: string[];
  grades?: string[];
  notes?: string;
}

export interface ChainDesignee {
  userId: string;
  userName: string;
  userTitle: string;
  position: number;
  label: string;
}

export interface ComplianceLink {
  framework: string;
  controlCode: string;
  controlName: string;
  rationale?: string;
}

export type AuditAction =
  | 'Created'
  | 'Submitted'
  | 'Approved'
  | 'Rejected'
  | 'ModificationSubmitted'
  | 'ModificationApproved'
  | 'ModificationRejected'
  | 'AutoAppliedNonCritical'
  | 'Revoked'
  | 'Suspended'
  | 'Expired'
  | 'Notified';

export interface AuditEntry {
  id: string;
  timestamp: string;
  actorUserId: string;
  actorUserName: string;
  action: AuditAction;
  comment?: string;
  fieldChanges?: { field: string; oldValue: unknown; newValue: unknown }[];
  metadata?: Record<string, unknown>;
}

export interface PendingModification {
  proposedAt: string;
  proposedByUserId: string;
  proposedByUserName: string;
  isCritical: boolean;
  criticalFields: string[];
  changes: { field: string; oldValue: unknown; newValue: unknown }[];
  proposedRule: DelegationRule;
  routedTo?: { userId: string; userName: string };
  status: 'PendingApproval' | 'Approved' | 'Rejected';
  resolvedAt?: string;
  resolvedByUserId?: string;
  resolvedByUserName?: string;
  resolutionComment?: string;
}

export interface DelegationRule {
  id: string;
  version: number;

  name: string;
  category: DelegationCategory;
  authorityType: string;
  description: string;
  justification: string;

  scope: DelegationScope;

  chain: ChainDesignee[];

  complianceLinks: ComplianceLink[];

  type: DelegationLifecycleType;
  effectiveFrom: string;
  effectiveTo?: string;

  status: DelegationStatus;

  createdByUserId: string;
  createdByUserName: string;
  createdAt: string;

  approvalAuthorityUserId: string;
  approvalAuthorityUserName: string;
  approvalAuthorityTitle: string;
  approvalAuthoritySuggestionRationale?: string;

  submittedAt?: string;
  approvedAt?: string;
  approvedComment?: string;
  rejectedAt?: string;
  rejectedComment?: string;

  pendingModification?: PendingModification;

  auditTrail: AuditEntry[];
}

export const CRITICAL_FIELDS: ReadonlyArray<keyof DelegationRule> = [
  'authorityType',
  'category',
  'scope',
  'chain',
  'complianceLinks',
  'type',
  'approvalAuthorityUserId',
] as const;

export const NON_CRITICAL_FIELDS: ReadonlyArray<keyof DelegationRule> = [
  'name',
  'description',
  'justification',
  'effectiveFrom',
  'effectiveTo',
] as const;
