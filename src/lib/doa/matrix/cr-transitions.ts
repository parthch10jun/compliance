/**
 * Change Request state-machine helpers.
 *
 * Each helper returns an updated ChangeRequest plus appended audit entries.
 * The pages call these and persist via change-request-store.saveChangeRequest.
 */

import type {
  CRAuditEntry,
  CRReviewerStep,
  CRReviewerTeam,
  CRValidatorRole,
  ChangeRequest,
} from './change-request-types';

const now = (): string => new Date().toISOString();

let counter = 0;
function genAuditId(): string {
  counter++;
  return `au-${Date.now().toString(36)}-${counter}`;
}

function appendAudit(cr: ChangeRequest, entry: Omit<CRAuditEntry, 'id'>): ChangeRequest {
  return {
    ...cr,
    auditTrail: [...cr.auditTrail, { id: genAuditId(), ...entry }],
  };
}

// ---------------------------------------------------------------------------
// L1 endorsement
// ---------------------------------------------------------------------------

export function endorseL1(
  cr: ChangeRequest,
  actor: { id: string; name: string },
  comment?: string,
): ChangeRequest {
  const t = now();
  return appendAudit(
    {
      ...cr,
      status: 'L1Endorsed',
      l1EndorserUserId: actor.id,
      l1EndorserUserName: actor.name,
      l1EndorsedAt: t,
      l1EndorsementComment: comment ?? null,
    },
    {
      timestamp: t,
      actorUserId: actor.id,
      actorUserName: actor.name,
      action: 'L1Endorsed',
      comment,
    },
  );
}

// ---------------------------------------------------------------------------
// Triage (Risk & Audit accepts/rejects after L1 endorsement)
// ---------------------------------------------------------------------------

export function triageAccept(
  cr: ChangeRequest,
  actor: { id: string; name: string },
  comment?: string,
): ChangeRequest {
  const t = now();
  // Also auto-mark the Risk & Audit reviewer step as approved (Priya is both lead + first reviewer).
  const reviewerSteps = cr.reviewerSteps.map(s =>
    s.team === 'RiskAndAudit' && !s.action
      ? { ...s, action: 'Approved' as const, actionDate: t, comment: comment ?? 'Triage accepted; R&A review complete.' }
      : s,
  );
  return appendAudit(
    { ...cr, status: 'UnderReview', reviewerSteps },
    { timestamp: t, actorUserId: actor.id, actorUserName: actor.name, action: 'TriageAccepted', comment },
  );
}

export function triageReject(
  cr: ChangeRequest,
  actor: { id: string; name: string },
  reason: string,
): ChangeRequest {
  const t = now();
  return appendAudit(
    {
      ...cr,
      status: 'TriageRejected',
      closedAt: t,
      rejectionStage: 'Triage',
      rejectionByUserId: actor.id,
      rejectionByUserName: actor.name,
      rejectionDate: t,
      rejectionReason: reason,
    },
    { timestamp: t, actorUserId: actor.id, actorUserName: actor.name, action: 'TriageRejected', comment: reason },
  );
}

// ---------------------------------------------------------------------------
// Reviewer cascade — required teams approve in order; ad-hoc are optional.
// ---------------------------------------------------------------------------

export function nextRequiredReviewerStepIndex(cr: ChangeRequest): number {
  for (let i = 0; i < cr.reviewerSteps.length; i++) {
    const s = cr.reviewerSteps[i];
    if (s.required && !s.action) return i;
  }
  return -1;
}

export function reviewerApprove(
  cr: ChangeRequest,
  team: CRReviewerTeam,
  actor: { id: string; name: string },
  comment?: string,
): ChangeRequest {
  const t = now();
  const reviewerSteps = cr.reviewerSteps.map(s =>
    s.team === team && !s.action
      ? { ...s, action: 'Approved' as const, actionDate: t, comment: comment ?? null,
          reviewerUserId: s.reviewerUserId ?? actor.id, reviewerUserName: s.reviewerUserName ?? actor.name }
      : s,
  );
  const updated: ChangeRequest = { ...cr, reviewerSteps };
  // If all required reviewers are done, advance to Validation.
  const stillPending = reviewerSteps.some(s => s.required && !s.action);
  const moveOn = !stillPending;
  return appendAudit(
    moveOn ? { ...updated, status: 'Validation' } : updated,
    {
      timestamp: t, actorUserId: actor.id, actorUserName: actor.name,
      action: 'ReviewerApproved',
      comment: comment ?? `${team} review complete.`,
    },
  );
}

export function reviewerReject(
  cr: ChangeRequest,
  team: CRReviewerTeam,
  actor: { id: string; name: string },
  reason: string,
): ChangeRequest {
  const t = now();
  const reviewerSteps = cr.reviewerSteps.map(s =>
    s.team === team && !s.action
      ? { ...s, action: 'Rejected' as const, actionDate: t, comment: reason,
          reviewerUserId: s.reviewerUserId ?? actor.id, reviewerUserName: s.reviewerUserName ?? actor.name }
      : s,
  );
  return appendAudit(
    {
      ...cr, reviewerSteps,
      status: 'ReviewerRejected', closedAt: t,
      rejectionStage: 'Reviewer',
      rejectionByUserId: actor.id, rejectionByUserName: actor.name,
      rejectionDate: t, rejectionReason: reason,
    },
    { timestamp: t, actorUserId: actor.id, actorUserName: actor.name, action: 'ReviewerRejected', comment: reason },
  );
}

// ---------------------------------------------------------------------------
// Validator chain (parallel — 3 sign-offs required)
// ---------------------------------------------------------------------------

export function validatorApprove(
  cr: ChangeRequest,
  role: CRValidatorRole,
  actor: { id: string; name: string },
  comment?: string,
): ChangeRequest {
  const t = now();
  const validatorSteps = cr.validatorSteps.map(s =>
    s.role === role && !s.action
      ? { ...s, action: 'Approved' as const, actionDate: t, comment: comment ?? null,
          validatorUserId: s.validatorUserId ?? actor.id, validatorUserName: s.validatorUserName ?? actor.name }
      : s,
  );
  const updated: ChangeRequest = { ...cr, validatorSteps };
  // All three validators done → move to PendingApproval.
  const stillPending = validatorSteps.some(s => !s.action);
  return appendAudit(
    stillPending ? updated : { ...updated, status: 'PendingApproval' },
    {
      timestamp: t, actorUserId: actor.id, actorUserName: actor.name,
      action: 'ValidatorApproved',
      comment: comment ?? `${role} validation complete.`,
    },
  );
}

export function validatorReject(
  cr: ChangeRequest,
  role: CRValidatorRole,
  actor: { id: string; name: string },
  reason: string,
): ChangeRequest {
  const t = now();
  const validatorSteps = cr.validatorSteps.map(s =>
    s.role === role && !s.action
      ? { ...s, action: 'Rejected' as const, actionDate: t, comment: reason,
          validatorUserId: s.validatorUserId ?? actor.id, validatorUserName: s.validatorUserName ?? actor.name }
      : s,
  );
  return appendAudit(
    {
      ...cr, validatorSteps,
      status: 'ValidationRejected', closedAt: t,
      rejectionStage: 'Validator',
      rejectionByUserId: actor.id, rejectionByUserName: actor.name,
      rejectionDate: t, rejectionReason: reason,
    },
    { timestamp: t, actorUserId: actor.id, actorUserName: actor.name, action: 'ValidatorRejected', comment: reason },
  );
}

// ---------------------------------------------------------------------------
// Final approver (CEO or Board)
// ---------------------------------------------------------------------------

export function approverApprove(
  cr: ChangeRequest,
  actor: { id: string; name: string },
  scope: 'CEO' | 'Board',
  comment?: string,
): ChangeRequest {
  const t = now();
  return appendAudit(
    {
      ...cr,
      status: 'Approved',
      approverUserId: actor.id,
      approverUserName: actor.name,
      approverScope: scope,
      approverDecision: 'Approved',
      approverDate: t,
      approverComment: comment ?? null,
    },
    {
      timestamp: t, actorUserId: actor.id, actorUserName: actor.name,
      action: 'ApproverApproved',
      comment: comment ?? `Approved (${scope}).`,
    },
  );
}

export function approverReject(
  cr: ChangeRequest,
  actor: { id: string; name: string },
  reason: string,
): ChangeRequest {
  const t = now();
  return appendAudit(
    {
      ...cr,
      status: 'ApproverRejected',
      closedAt: t,
      approverUserId: actor.id,
      approverUserName: actor.name,
      approverDecision: 'Rejected',
      approverDate: t,
      approverComment: reason,
      rejectionStage: 'Approver',
      rejectionByUserId: actor.id, rejectionByUserName: actor.name,
      rejectionDate: t, rejectionReason: reason,
    },
    { timestamp: t, actorUserId: actor.id, actorUserName: actor.name, action: 'ApproverRejected', comment: reason },
  );
}

// ---------------------------------------------------------------------------
// Implementation — Risk & Audit applies the change after approval.
// ---------------------------------------------------------------------------

export function markImplemented(
  cr: ChangeRequest,
  actor: { id: string; name: string },
  resultingMatrixVersion: string,
  communicationsNotes?: string,
): ChangeRequest {
  const t = now();
  return appendAudit(
    {
      ...cr,
      status: 'Implemented',
      implementedByUserId: actor.id,
      implementedByUserName: actor.name,
      implementedDate: t,
      resultingMatrixVersion,
      communicationsNotes: communicationsNotes ?? null,
      closedAt: t,
    },
    {
      timestamp: t, actorUserId: actor.id, actorUserName: actor.name,
      action: 'Implemented',
      comment: `Matrix updated to v${resultingMatrixVersion}.`,
    },
  );
}

// ---------------------------------------------------------------------------
// Helpers for the UI: who acts at each stage?
// ---------------------------------------------------------------------------

export function nextActionableStep(cr: ChangeRequest):
  | { kind: 'l1'; }
  | { kind: 'triage'; userId: string }
  | { kind: 'reviewer'; team: CRReviewerTeam; userId?: string | null }
  | { kind: 'validator'; role: CRValidatorRole; userId?: string | null }
  | { kind: 'approver'; }
  | { kind: 'implement'; }
  | null
{
  if (cr.status === 'Draft' || cr.status === 'PendingL1Endorsement') return { kind: 'l1' };
  if (cr.status === 'L1Endorsed') return { kind: 'triage', userId: 'user-107' /* Priya */ };
  if (cr.status === 'UnderReview') {
    const idx = nextRequiredReviewerStepIndex(cr);
    if (idx === -1) return null;
    const s = cr.reviewerSteps[idx];
    return { kind: 'reviewer', team: s.team, userId: s.reviewerUserId };
  }
  if (cr.status === 'Validation') {
    const pending = cr.validatorSteps.find(v => !v.action);
    if (!pending) return null;
    return { kind: 'validator', role: pending.role, userId: pending.validatorUserId };
  }
  if (cr.status === 'PendingApproval') return { kind: 'approver' };
  if (cr.status === 'Approved') return { kind: 'implement' };
  return null;
}
