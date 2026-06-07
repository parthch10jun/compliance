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

/**
 * Optional RACI approval model — a discreet alternative to the numbered
 * L1/L2/L3 chain, mirroring the RACI grid used in the SEC Authorization
 * Matrix. When a delegation carries `raci`, the detail view renders the RACI
 * workflow (Responsible / Accountable / Consulted / Informed) in place of the
 * runtime chain. The core L1/L2/L3 workflow is otherwise unchanged.
 */
export type DelegationRaciCode = 'R' | 'A' | 'C' | 'I';

export interface DelegationRaciAssignee {
  code: DelegationRaciCode;
  userName: string;
  userTitle: string;
  note?: string;
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

/**
 * Snapshot of a rule's state at a previous version. Pushed onto
 * versionHistory whenever a critical modification is approved and supersedes
 * the previous version.
 */
export interface VersionSnapshot {
  version: number;
  name: string;
  description: string;
  justification: string;
  scope: DelegationScope;
  chain: ChainDesignee[];
  complianceLinks: ComplianceLink[];
  type: DelegationLifecycleType;
  effectiveFrom: string;
  effectiveTo?: string;
  approvalAuthorityUserId: string;
  approvalAuthorityUserName: string;
  approvalAuthorityTitle: string;
  approvedAt?: string;
  // When this version stopped being current.
  supersededAt: string;
  supersededByVersion: number;
  // One-line summary of what changed when this version was superseded
  // (e.g. "Cap raised from 1M AED to 1.5M AED + ISO 27701 A.6.1 linked").
  changesSummary: string;
  // Audit trail entries that occurred during this version's active life.
  auditTrail: AuditEntry[];
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

  // Optional RACI approval model (discreet, SEC-style). When set, the detail
  // view renders a RACI workflow instead of the numbered L1/L2/L3 chain.
  raci?: DelegationRaciAssignee[];

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

  // Frozen snapshots of previous versions, oldest first.
  versionHistory?: VersionSnapshot[];

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
