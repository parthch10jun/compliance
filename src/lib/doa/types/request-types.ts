/**
 * Delegation Request — runtime request matched against an Active DelegationRule.
 *
 * When a request is submitted, the matcher finds the tightest-fitting Active
 * rule whose authorityType matches and whose caps accommodate the request.
 * The request snapshots the rule's chain at match time and walks through it
 * step-by-step. Each chain designee approves or rejects their step.
 */

import type { ChainDesignee } from './delegation-rule-types';

export type DelegationRequestStatus =
  | 'PendingDecision'
  | 'Approved'
  | 'Rejected'
  | 'Withdrawn';

export type StepActionKind = 'Approved' | 'Rejected';

export interface StepAction {
  stepIndex: number;
  approverUserId: string;
  approverUserName: string;
  action: StepActionKind;
  timestamp: string;
  comment?: string;
}

export interface DelegationRequest {
  id: string;

  // What's being requested
  title: string;
  authorityType: string;
  description: string;
  justification: string;

  // Quantitative parameters (matched against rule scope)
  monetaryAmount?: number;
  currency?: string;
  percentageAmount?: number;
  quantityAmount?: number;

  // Context
  affectedEntity?: string;
  region?: string;
  businessUnit?: string;

  // Matched rule (snapshot at match time)
  matchedRuleId: string;
  matchedRuleName: string;
  matchedRuleVersion: number;
  matchedRuleChain: ChainDesignee[];

  // Lifecycle
  status: DelegationRequestStatus;
  // -1 once terminal (Approved / Rejected / Withdrawn)
  currentStepIndex: number;

  // Audit
  stepActions: StepAction[];

  // Metadata
  requestedByUserId: string;
  requestedByUserName: string;
  requestedAt: string;
  finalizedAt?: string;
}
