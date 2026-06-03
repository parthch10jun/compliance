'use client';

/**
 * Change Request detail — read-only view of all four CR sections.
 *
 * Action buttons surface based on (current user × CR status). Phase-1 scope:
 * Risk & Audit triage accept/reject. Reviewer cascade and approver actions
 * land here in a follow-up.
 */

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, CheckCircle2, XCircle, Send, FileText, Clock, ShieldCheck,
  Users, Activity, AlertTriangle,
} from 'lucide-react';
import {
  getChangeRequestById, saveChangeRequest, generateCRAuditId,
} from '@/lib/doa/matrix/change-request-store';
import { useCurrentUser } from '@/lib/doa/hooks/useCurrentUser';
import { formatDate, formatDateTime } from '@/lib/doa/utils/format';
import type { ChangeRequest } from '@/lib/doa/matrix/change-request-types';

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

const CHANGE_TYPE_LABELS: Record<string, string> = {
  AddNew: 'Add a new delegation',
  CascadeDown: 'Cascade down an existing delegation',
  Adjust: 'Adjust an existing delegation',
  Remove: 'Remove an existing delegation',
  Clarify: 'Clarify an existing delegation',
};

export default function CRDetail() {
  const params = useParams();
  const crId = params.id as string;
  const { user } = useCurrentUser();
  const [cr, setCR] = useState<ChangeRequest | undefined>();
  const [actionMode, setActionMode] = useState<'triage-accept' | 'triage-reject' | null>(null);
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

  // Capability gates
  const isRiskAndAuditLead = user.id === 'user-107'; // Priya
  const canTriage = cr.status === 'L1Endorsed' && isRiskAndAuditLead;

  // Actions
  const doTriageAccept = () => {
    const now = new Date().toISOString();
    const updated: ChangeRequest = {
      ...cr,
      status: 'UnderReview',
      auditTrail: [
        ...cr.auditTrail,
        {
          id: generateCRAuditId(), timestamp: now,
          actorUserId: user.id, actorUserName: user.name,
          action: 'TriageAccepted',
          comment: actionComment || 'Accepted for review.',
        },
      ],
    };
    saveChangeRequest(updated);
    setRefreshKey(k => k + 1);
    setActionMode(null);
    setActionComment('');
  };

  const doTriageReject = () => {
    if (!actionComment.trim()) { alert('Triage rejection requires a reason.'); return; }
    const now = new Date().toISOString();
    const updated: ChangeRequest = {
      ...cr,
      status: 'TriageRejected',
      closedAt: now,
      rejectionStage: 'Triage',
      rejectionByUserId: user.id,
      rejectionByUserName: user.name,
      rejectionDate: now,
      rejectionReason: actionComment,
      auditTrail: [
        ...cr.auditTrail,
        {
          id: generateCRAuditId(), timestamp: now,
          actorUserId: user.id, actorUserName: user.name,
          action: 'TriageRejected',
          comment: actionComment,
        },
      ],
    };
    saveChangeRequest(updated);
    setRefreshKey(k => k + 1);
    setActionMode(null);
    setActionComment('');
  };

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
                {CHANGE_TYPE_LABELS[cr.changeType] ?? cr.changeType}
              </h1>
              <span className={`px-2 py-0.5 text-xs font-medium rounded ${STATUS_TONES[cr.status] ?? 'bg-gray-100 text-gray-700'}`}>
                {cr.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              by {cr.requestorUserName} ({cr.requestorRole}) · submitted {formatDate(cr.requestDate)}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {canTriage && (
            <>
              <button
                onClick={() => setActionMode('triage-reject')}
                className="flex items-center gap-1.5 px-3 py-2 border border-red-300 text-red-700 rounded text-sm hover:bg-red-50"
              >
                <XCircle className="w-4 h-4" />Reject triage
              </button>
              <button
                onClick={() => setActionMode('triage-accept')}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 text-white rounded text-sm hover:bg-amber-600"
              >
                <CheckCircle2 className="w-4 h-4" />Accept &amp; route to reviewers
              </button>
            </>
          )}
        </div>
      </div>

      {actionMode && (
        <div className="bg-white border-2 border-amber-300 rounded-lg p-4">
          <div className="text-sm font-semibold text-gray-900 mb-2">
            {actionMode === 'triage-accept' && 'Accept this CR for the reviewer cascade'}
            {actionMode === 'triage-reject' && 'Reject this CR at triage'}
          </div>
          <textarea
            rows={2}
            value={actionComment}
            onChange={e => setActionComment(e.target.value)}
            placeholder={actionMode === 'triage-accept' ? 'Comment (optional)' : 'Reason for triage rejection (required)'}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 mb-2"
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => { setActionMode(null); setActionComment(''); }}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50">Cancel</button>
            <button
              onClick={() => actionMode === 'triage-accept' ? doTriageAccept() : doTriageReject()}
              className={`px-4 py-1.5 rounded text-sm text-white ${
                actionMode === 'triage-reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-500 hover:bg-amber-600'
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {cr.status === 'TriageRejected' && (
        <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-900 flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Rejected at triage</strong> by {cr.rejectionByUserName} on {formatDate(cr.rejectionDate)}.
            Reason: {cr.rejectionReason}
          </div>
        </div>
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
            <Row label="Type of change" value={CHANGE_TYPE_LABELS[cr.changeType]} />
            {cr.targetDelegationId && (
              <Row label="DoA reference" value={
                <Link href={`/doa/matrix/delegation/${encodeURIComponent(cr.targetDelegationId)}`} className="text-amber-700 hover:underline font-mono">
                  {cr.targetDelegationId}
                </Link>
              } />
            )}
            <Row label="Proposed change" value={cr.proposedChange} multiline />
            <Row label="Justification" value={cr.justification} multiline />
            <Row label="Impact assessment" value={cr.impactAssessment} multiline />
            {cr.effectiveDate && <Row label="Effective date" value={formatDate(cr.effectiveDate)} />}
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
                          <span className="font-medium text-gray-900">{step.team}</span>
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
                <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Validators</div>
                <ul className="space-y-1.5">
                  {cr.validatorSteps.map((step, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 ${
                        step.action === 'Approved' ? 'bg-green-500' :
                        step.action === 'Rejected' ? 'bg-red-500' :
                        'bg-gray-300'
                      }`} />
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{step.role.replace(/_/g, ' ')}</span>
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
                    <span className="font-medium text-gray-900">{e.action}</span>
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
