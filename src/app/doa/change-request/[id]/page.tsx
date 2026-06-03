'use client';

/**
 * Change Request detail.
 *
 * Surfaces the full four-section CR data + a structured before/after diff of
 * the proposal + a single contextual action surface gated on
 * (current user × CR status). Drives the entire approval flow.
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, CheckCircle2, XCircle, FileText, ShieldCheck,
  Users, Activity, AlertTriangle, Send, Zap, GitBranch,
} from 'lucide-react';
import {
  getChangeRequestById, saveChangeRequest,
} from '@/lib/doa/matrix/change-request-store';
import { getMatrix, saveMatrix } from '@/lib/doa/matrix/store';
import { applyProposalToMatrix } from '@/lib/doa/matrix/apply-proposal';
import {
  triageAccept, triageReject,
  reviewerApprove, reviewerReject,
  validatorApprove, validatorReject,
  approverApprove, approverReject,
  markImplemented,
  nextActionableStep,
  nextRequiredReviewerStepIndex,
} from '@/lib/doa/matrix/cr-transitions';
import { useCurrentUser } from '@/lib/doa/hooks/useCurrentUser';
import { formatDate, formatDateTime } from '@/lib/doa/utils/format';
import {
  CR_CHANGE_TYPE_LONG_LABELS, CR_REVIEWER_TEAM_LABELS,
  CR_STATUS_LABELS, CR_VALIDATOR_ROLE_LABELS, humanizeAction,
} from '@/lib/doa/matrix/cr-labels';
import CRProposalDiff from '@/components/doa/matrix/CRProposalDiff';
import type {
  ChangeRequest, CRReviewerTeam, CRValidatorRole,
} from '@/lib/doa/matrix/change-request-types';

const STATUS_TONES: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-700',
  PendingL1Endorsement: 'bg-blue-100 text-blue-700',
  L1Endorsed: 'bg-amber-100 text-amber-700',
  TriageRejected: 'bg-red-100 text-red-700',
  UnderReview: 'bg-purple-100 text-purple-700',
  ReviewerRejected: 'bg-red-100 text-red-700',
  Validation: 'bg-indigo-100 text-indigo-700',
  ValidationRejected: 'bg-red-100 text-red-700',
  PendingApproval: 'bg-orange-100 text-orange-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  Implemented: 'bg-green-100 text-green-700',
  ApproverRejected: 'bg-red-100 text-red-700',
};

type ActionMode =
  | { kind: 'triage'; decision: 'accept' | 'reject' }
  | { kind: 'reviewer'; team: CRReviewerTeam; decision: 'approve' | 'reject' }
  | { kind: 'validator'; role: CRValidatorRole; decision: 'approve' | 'reject' }
  | { kind: 'approver'; decision: 'approve' | 'reject'; scope: 'CEO' | 'Board' }
  | { kind: 'implement' };

export default function CRDetail() {
  const params = useParams();
  const crId = params.id as string;
  const { user } = useCurrentUser();
  const [cr, setCR] = useState<ChangeRequest | undefined>();
  const [actionMode, setActionMode] = useState<ActionMode | null>(null);
  const [actionComment, setActionComment] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setCR(getChangeRequestById(crId));
  }, [crId, refreshKey]);

  if (!cr) {
    return (
      <div className="max-w-3xl mx-auto mt-12 bg-white border border-gray-200 rounded-lg p-8 text-center">
        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Change request not found</h2>
        <Link href="/doa/change-request" className="text-sm text-amber-700 hover:underline">← Back to CR inbox</Link>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Capability gates
  // -----------------------------------------------------------------------
  const next = nextActionableStep(cr);
  const isRiskAndAuditLead = user.id === 'user-107'; // Priya

  const canTriage = next?.kind === 'triage' && isRiskAndAuditLead;
  const canImplement = next?.kind === 'implement' && isRiskAndAuditLead;
  const canApprove = next?.kind === 'approver' && user.id === 'user-101'; // Kundan

  // For reviewers: only the next required reviewer can act, and only if
  // it's their userId on the step.
  const nextReviewerStepIdx = nextRequiredReviewerStepIndex(cr);
  const nextReviewerStep = nextReviewerStepIdx >= 0 ? cr.reviewerSteps[nextReviewerStepIdx] : undefined;
  const canReview =
    cr.status === 'UnderReview' &&
    nextReviewerStep !== undefined &&
    nextReviewerStep.reviewerUserId === user.id;

  // For validators: any pending validator whose userId matches can act.
  const myPendingValidator = cr.validatorSteps.find(
    v => v.validatorUserId === user.id && !v.action,
  );
  const canValidate = cr.status === 'Validation' && myPendingValidator !== undefined;

  // -----------------------------------------------------------------------
  // Action handlers
  // -----------------------------------------------------------------------
  const applyAndSave = (updated: ChangeRequest) => {
    saveChangeRequest(updated);
    setRefreshKey(k => k + 1);
    setActionMode(null);
    setActionComment('');
  };

  const doAction = () => {
    if (!actionMode) return;
    const actor = { id: user.id, name: user.name };
    if (actionMode.kind === 'triage') {
      if (actionMode.decision === 'accept') {
        applyAndSave(triageAccept(cr, actor, actionComment || undefined));
      } else {
        if (!actionComment.trim()) { alert('Triage rejection requires a reason.'); return; }
        applyAndSave(triageReject(cr, actor, actionComment));
      }
      return;
    }
    if (actionMode.kind === 'reviewer') {
      if (actionMode.decision === 'approve') {
        applyAndSave(reviewerApprove(cr, actionMode.team, actor, actionComment || undefined));
      } else {
        if (!actionComment.trim()) { alert('Rejection requires a reason.'); return; }
        applyAndSave(reviewerReject(cr, actionMode.team, actor, actionComment));
      }
      return;
    }
    if (actionMode.kind === 'validator') {
      if (actionMode.decision === 'approve') {
        applyAndSave(validatorApprove(cr, actionMode.role, actor, actionComment || undefined));
      } else {
        if (!actionComment.trim()) { alert('Rejection requires a reason.'); return; }
        applyAndSave(validatorReject(cr, actionMode.role, actor, actionComment));
      }
      return;
    }
    if (actionMode.kind === 'approver') {
      if (actionMode.decision === 'approve') {
        applyAndSave(approverApprove(cr, actor, actionMode.scope, actionComment || undefined));
      } else {
        if (!actionComment.trim()) { alert('Rejection requires a reason.'); return; }
        applyAndSave(approverReject(cr, actor, actionComment));
      }
      return;
    }
    if (actionMode.kind === 'implement') {
      if (!cr.proposal) {
        alert('This CR has no structured proposal — cannot auto-apply. Implement manually.');
        return;
      }
      const matrix = getMatrix();
      const { matrix: nextMatrix, newVersion } = applyProposalToMatrix(
        matrix,
        cr.proposal,
        `CR ${cr.number}: ${cr.proposedChange.slice(0, 80)}`,
        cr.approverUserName ?? 'CEO',
      );
      saveMatrix(nextMatrix);
      applyAndSave(markImplemented(cr, actor, newVersion.version, actionComment || undefined));
      return;
    }
  };

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Link href="/doa/change-request" className="p-2 hover:bg-gray-100 rounded">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <div className="text-xs font-mono text-gray-500 mb-1">{cr.number}</div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-semibold text-gray-900">
                {CR_CHANGE_TYPE_LONG_LABELS[cr.changeType] ?? cr.changeType}
              </h1>
              <span className={`px-2 py-0.5 text-xs font-medium rounded ${STATUS_TONES[cr.status] ?? 'bg-gray-100 text-gray-700'}`}>
                {CR_STATUS_LABELS[cr.status] ?? cr.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              by {cr.requestorUserName} ({cr.requestorRole}) · submitted {formatDate(cr.requestDate)}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap justify-end max-w-md">
          {canTriage && (
            <>
              <ActionBtn kind="reject" onClick={() => setActionMode({ kind: 'triage', decision: 'reject' })}>
                Reject triage
              </ActionBtn>
              <ActionBtn kind="primary" onClick={() => setActionMode({ kind: 'triage', decision: 'accept' })}>
                Accept &amp; route to reviewers
              </ActionBtn>
            </>
          )}
          {canReview && nextReviewerStep && (
            <>
              <ActionBtn kind="reject" onClick={() => setActionMode({ kind: 'reviewer', team: nextReviewerStep.team, decision: 'reject' })}>
                Reject as {CR_REVIEWER_TEAM_LABELS[nextReviewerStep.team]}
              </ActionBtn>
              <ActionBtn kind="approve" onClick={() => setActionMode({ kind: 'reviewer', team: nextReviewerStep.team, decision: 'approve' })}>
                Approve as {CR_REVIEWER_TEAM_LABELS[nextReviewerStep.team]}
              </ActionBtn>
            </>
          )}
          {canValidate && myPendingValidator && (
            <>
              <ActionBtn kind="reject" onClick={() => setActionMode({ kind: 'validator', role: myPendingValidator.role, decision: 'reject' })}>
                Reject as {CR_VALIDATOR_ROLE_LABELS[myPendingValidator.role]}
              </ActionBtn>
              <ActionBtn kind="approve" onClick={() => setActionMode({ kind: 'validator', role: myPendingValidator.role, decision: 'approve' })}>
                Validate as {CR_VALIDATOR_ROLE_LABELS[myPendingValidator.role]}
              </ActionBtn>
            </>
          )}
          {canApprove && (
            <>
              <ActionBtn kind="reject" onClick={() => setActionMode({ kind: 'approver', decision: 'reject', scope: 'CEO' })}>
                Reject
              </ActionBtn>
              <ActionBtn kind="approve" onClick={() => setActionMode({ kind: 'approver', decision: 'approve', scope: 'CEO' })}>
                Approve as CEO
              </ActionBtn>
            </>
          )}
          {canImplement && (
            <ActionBtn kind="primary" onClick={() => setActionMode({ kind: 'implement' })}>
              <Zap className="w-4 h-4" />Implement &amp; publish new matrix version
            </ActionBtn>
          )}
        </div>
      </div>

      {/* Action prompt */}
      {actionMode && (
        <div className="bg-white border-2 border-amber-300 rounded-lg p-4">
          <div className="text-sm font-semibold text-gray-900 mb-2">
            {actionMode.kind === 'triage' && (actionMode.decision === 'accept' ? 'Accept this CR for the reviewer cascade' : 'Reject this CR at triage')}
            {actionMode.kind === 'reviewer' && (actionMode.decision === 'approve'
              ? `Approve as ${CR_REVIEWER_TEAM_LABELS[actionMode.team]}`
              : `Reject as ${CR_REVIEWER_TEAM_LABELS[actionMode.team]}`)}
            {actionMode.kind === 'validator' && (actionMode.decision === 'approve'
              ? `Validate as ${CR_VALIDATOR_ROLE_LABELS[actionMode.role]}`
              : `Reject as ${CR_VALIDATOR_ROLE_LABELS[actionMode.role]}`)}
            {actionMode.kind === 'approver' && (actionMode.decision === 'approve' ? 'Approve as CEO' : 'Reject final approval')}
            {actionMode.kind === 'implement' && 'Implement — apply the structured proposal to the matrix and publish a new version'}
          </div>
          <textarea
            rows={2}
            value={actionComment}
            onChange={e => setActionComment(e.target.value)}
            placeholder={(() => {
              if (actionMode.kind === 'implement') return 'Communications notes (optional)';
              const isApprove = 'decision' in actionMode && actionMode.decision === 'approve';
              return isApprove ? 'Comment (optional)' : 'Reason (required)';
            })()}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 mb-2"
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => { setActionMode(null); setActionComment(''); }}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50">Cancel</button>
            <button
              onClick={doAction}
              className={`px-4 py-1.5 rounded text-sm text-white ${
                'decision' in actionMode && actionMode.decision === 'reject'
                  ? 'bg-red-600 hover:bg-red-700'
                  : actionMode.kind === 'implement'
                  ? 'bg-amber-500 hover:bg-amber-600'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >Confirm</button>
          </div>
        </div>
      )}

      {/* Terminal state banners */}
      {cr.status === 'TriageRejected' && (
        <Banner tone="red">
          <strong>Rejected at triage</strong> by {cr.rejectionByUserName} on {formatDate(cr.rejectionDate)}. Reason: {cr.rejectionReason}
        </Banner>
      )}
      {cr.status === 'ReviewerRejected' && (
        <Banner tone="red">
          <strong>Rejected by reviewer</strong> {cr.rejectionByUserName} on {formatDate(cr.rejectionDate)}. Reason: {cr.rejectionReason}
        </Banner>
      )}
      {cr.status === 'ValidationRejected' && (
        <Banner tone="red">
          <strong>Rejected by validator</strong> {cr.rejectionByUserName} on {formatDate(cr.rejectionDate)}. Reason: {cr.rejectionReason}
        </Banner>
      )}
      {cr.status === 'ApproverRejected' && (
        <Banner tone="red">
          <strong>Rejected by approver</strong> {cr.approverUserName} on {formatDate(cr.approverDate)}. Reason: {cr.approverComment}
        </Banner>
      )}
      {cr.status === 'Implemented' && cr.resultingMatrixVersion && (
        <Banner tone="green">
          <strong>Implemented.</strong> Matrix advanced to{' '}
          <Link href="/doa/matrix/versions" className="underline font-semibold">v{cr.resultingMatrixVersion}</Link>
          {' '}on {formatDate(cr.implementedDate)}.
        </Banner>
      )}

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          <Card title="Section 1 — Requestor" icon={<Users className="w-4 h-4" />}>
            <Row label="Requestor" value={`${cr.requestorUserName} (${cr.requestorRole})`} />
            <Row label="Date of request" value={formatDate(cr.requestDate)} />
            {cr.contactPersonUserName && (
              <Row label="Contact person" value={cr.contactPersonUserName} />
            )}
          </Card>

          <Card title="Section 2 — Requested change" icon={<FileText className="w-4 h-4" />}>
            <Row label="Type of change" value={CR_CHANGE_TYPE_LONG_LABELS[cr.changeType]} />
            {cr.targetDelegationId && (
              <Row label="DoA reference" value={
                <Link href={`/doa/matrix/delegation/${encodeURIComponent(cr.targetDelegationId)}`} className="text-amber-700 hover:underline font-mono">
                  {cr.targetDelegationId}
                </Link>
              } />
            )}
            <Row label="Summary" value={cr.proposedChange} multiline />
            <Row label="Justification" value={cr.justification} multiline />
            <Row label="Impact assessment" value={cr.impactAssessment} multiline />
            {cr.effectiveDate && <Row label="Effective date" value={formatDate(cr.effectiveDate)} />}
          </Card>

          <Card title="Proposed change (structured diff)" icon={<GitBranch className="w-4 h-4" />}>
            <CRProposalDiff proposal={cr.proposal} />
          </Card>

          <Card title="Section 3 — Approval flow" icon={<ShieldCheck className="w-4 h-4" />}>
            <div className="space-y-3">
              <div>
                <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">L1 endorsement</div>
                {cr.l1EndorserUserName ? (
                  <div className="text-sm text-gray-900">
                    ✓ {cr.l1EndorserUserName} on {formatDate(cr.l1EndorsedAt)}
                    {cr.l1EndorsementComment && <div className="text-xs text-gray-600 italic mt-0.5">"{cr.l1EndorsementComment}"</div>}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 italic">Pending</div>
                )}
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Reviewer cascade</div>
                <ul className="space-y-1.5">
                  {cr.reviewerSteps.map((step, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 ${
                        step.action === 'Approved' ? 'bg-green-500' :
                        step.action === 'Rejected' ? 'bg-red-500' :
                        step.required ? 'bg-amber-400' : 'bg-gray-300'
                      }`} />
                      <div className="flex-1">
                        <div>
                          <span className="font-medium text-gray-900">{CR_REVIEWER_TEAM_LABELS[step.team] ?? step.team}</span>
                          {!step.required && <span className="text-xs text-gray-500 ml-1.5">(ad hoc)</span>}
                          {step.reviewerUserName && <span className="text-xs text-gray-600 ml-1.5">— {step.reviewerUserName}</span>}
                        </div>
                        {step.action && (
                          <div className="text-xs text-gray-600 mt-0.5">
                            <strong>{step.action}</strong> on {formatDate(step.actionDate)}
                            {step.comment && <span className="italic"> — "{step.comment}"</span>}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Validators (parallel, all required)</div>
                <ul className="space-y-1.5">
                  {cr.validatorSteps.map((step, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 ${
                        step.action === 'Approved' ? 'bg-green-500' :
                        step.action === 'Rejected' ? 'bg-red-500' :
                        'bg-gray-300'
                      }`} />
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{CR_VALIDATOR_ROLE_LABELS[step.role] ?? step.role}</span>
                        {step.validatorUserName && <span className="text-xs text-gray-600 ml-1.5">— {step.validatorUserName}</span>}
                        {step.action && (
                          <div className="text-xs text-gray-600">
                            <strong>{step.action}</strong> on {formatDate(step.actionDate)}
                            {step.comment && <span className="italic"> — "{step.comment}"</span>}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Final approver</div>
                {cr.approverUserName ? (
                  <div className="text-sm text-gray-900">
                    {cr.approverDecision === 'Approved' ? '✓' : '✗'} {cr.approverUserName} ({cr.approverScope})
                    {cr.approverDate && <span className="text-xs text-gray-600 ml-1.5">on {formatDate(cr.approverDate)}</span>}
                    {cr.approverComment && <div className="text-xs text-gray-600 italic mt-0.5">"{cr.approverComment}"</div>}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 italic">Pending (CEO or Board, per A.3.5)</div>
                )}
              </div>
            </div>
          </Card>

          {cr.status === 'Implemented' && (
            <Card title="Section 4 — Implementation" icon={<CheckCircle2 className="w-4 h-4" />}>
              <Row label="Implemented by" value={cr.implementedByUserName ?? '—'} />
              <Row label="Date" value={formatDate(cr.implementedDate)} />
              <Row label="Matrix version" value={cr.resultingMatrixVersion ? `v${cr.resultingMatrixVersion}` : '—'} />
              {cr.communicationsNotes && <Row label="Communications" value={cr.communicationsNotes} multiline />}
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card title="Audit trail" icon={<Activity className="w-4 h-4" />}>
            <ul className="space-y-2.5">
              {[...cr.auditTrail].reverse().map(e => (
                <li key={e.id} className="text-xs">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-medium text-gray-900">{humanizeAction(e.action)}</span>
                    <span className="text-gray-500">by {e.actorUserName}</span>
                  </div>
                  <div className="text-gray-400">{formatDateTime(e.timestamp)}</div>
                  {e.comment && <div className="text-gray-700 italic mt-0.5">"{e.comment}"</div>}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
        {icon}{title}
      </h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ label, value, multiline = false }: { label: string; value: React.ReactNode; multiline?: boolean }) {
  return (
    <div className={multiline ? 'space-y-0.5' : 'flex justify-between items-start gap-3'}>
      <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
      <span className={`text-sm text-gray-900 ${multiline ? 'block whitespace-pre-wrap' : 'text-right break-words'}`}>{value}</span>
    </div>
  );
}

function Banner({ tone, children }: { tone: 'amber' | 'green' | 'red' | 'gray'; children: React.ReactNode }) {
  const styles = {
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    red: 'bg-red-50 border-red-200 text-red-900',
    gray: 'bg-gray-50 border-gray-200 text-gray-900',
  }[tone];
  return (
    <div className={`flex items-start gap-2 p-3 border rounded text-sm ${styles}`}>
      <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" /><div className="flex-1">{children}</div>
    </div>
  );
}

function ActionBtn({
  kind, onClick, children,
}: { kind: 'primary' | 'approve' | 'reject'; onClick: () => void; children: React.ReactNode }) {
  const cls = kind === 'primary'
    ? 'bg-amber-500 text-white hover:bg-amber-600'
    : kind === 'approve'
    ? 'bg-green-600 text-white hover:bg-green-700'
    : 'border border-red-300 text-red-700 hover:bg-red-50';
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium ${cls}`}>
      {kind === 'approve' && <CheckCircle2 className="w-4 h-4" />}
      {kind === 'reject' && <XCircle className="w-4 h-4" />}
      {kind === 'primary' && <Send className="w-4 h-4" />}
      {children}
    </button>
  );
}
