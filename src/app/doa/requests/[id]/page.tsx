'use client';

/**
 * Request Detail — runtime request showing chain progression.
 *
 * The active chain-step designee (computed by currentStepIndex) sees
 * Approve / Reject controls. Each action advances the step or terminates
 * the request, recording a StepAction.
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, CheckCircle2, XCircle, Clock, ShieldCheck, FileText, Activity,
  Users, ChevronRight, AlertTriangle,
} from 'lucide-react';
import { useCurrentUser } from '@/lib/doa/hooks/useCurrentUser';
import { getDelegationRequestById, saveDelegationRequest } from '@/lib/doa/utils/request-store';
import { getDelegationRuleById } from '@/lib/doa/utils/delegation-rule-store';
import { formatDate, formatDateTime, formatNumber } from '@/lib/doa/utils/format';
import { RequestStatusBadge } from '../page';
import type { DelegationRequest, StepAction } from '@/lib/doa/types/request-types';

export default function RequestDetailPage() {
  const params = useParams();
  const requestId = params.id as string;
  const { user: currentUser } = useCurrentUser();

  const [req, setReq] = useState<DelegationRequest | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);
  const [actionMode, setActionMode] = useState<'approve' | 'reject' | null>(null);
  const [actionComment, setActionComment] = useState('');

  useEffect(() => {
    setReq(getDelegationRequestById(requestId));
  }, [requestId, refreshKey]);

  if (!req) {
    return (
      <div className="max-w-3xl mx-auto mt-12 bg-white border border-gray-200 rounded-lg p-8 text-center">
        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Request not found</h2>
        <Link href="/doa/requests" className="text-sm text-amber-700 hover:underline">← Back to requests</Link>
      </div>
    );
  }

  const currentStep = req.status === 'PendingDecision' ? req.matchedRuleChain[req.currentStepIndex] : undefined;
  const isCurrentStepDesignee = currentStep?.userId === currentUser.id;
  const linkedRule = getDelegationRuleById(req.matchedRuleId);

  const recordStep = (action: 'Approved' | 'Rejected', comment: string) => {
    const stepIndex = req.currentStepIndex;
    const now = new Date().toISOString();
    const stepAction: StepAction = {
      stepIndex,
      approverUserId: currentUser.id,
      approverUserName: currentUser.name,
      action,
      timestamp: now,
      comment: comment || undefined,
    };
    let nextStatus = req.status;
    let nextIndex = req.currentStepIndex;
    let finalizedAt = req.finalizedAt;

    if (action === 'Rejected') {
      nextStatus = 'Rejected';
      nextIndex = -1;
      finalizedAt = now;
    } else {
      // Approved — advance or terminate.
      const last = stepIndex >= req.matchedRuleChain.length - 1;
      if (last) {
        nextStatus = 'Approved';
        nextIndex = -1;
        finalizedAt = now;
      } else {
        nextIndex = stepIndex + 1;
      }
    }

    saveDelegationRequest({
      ...req,
      status: nextStatus,
      currentStepIndex: nextIndex,
      stepActions: [...req.stepActions, stepAction],
      finalizedAt,
    });
    setRefreshKey(k => k + 1);
    setActionMode(null);
    setActionComment('');
  };

  const doApprove = () => {
    if (!isCurrentStepDesignee || req.status !== 'PendingDecision') return;
    recordStep('Approved', actionComment);
  };
  const doReject = () => {
    if (!isCurrentStepDesignee || req.status !== 'PendingDecision') return;
    if (!actionComment.trim()) { alert('Rejection requires a comment.'); return; }
    recordStep('Rejected', actionComment);
  };

  const amountLine = (() => {
    const parts: string[] = [];
    if (req.monetaryAmount !== undefined) parts.push(`${formatNumber(req.monetaryAmount)} ${req.currency ?? ''}`.trim());
    if (req.percentageAmount !== undefined) parts.push(`${req.percentageAmount}%`);
    if (req.quantityAmount !== undefined) parts.push(`${req.quantityAmount} units`);
    return parts.length ? parts.join(' · ') : '—';
  })();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Link href="/doa/requests" className="p-2 hover:bg-gray-100 rounded">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-semibold text-gray-900">{req.title}</h1>
              <RequestStatusBadge status={req.status} />
              <span className="text-xs text-gray-400">{req.id}</span>
            </div>
            <p className="text-sm text-gray-600">{req.authorityType} · {amountLine}</p>
          </div>
        </div>

        {/* Action buttons */}
        {isCurrentStepDesignee && req.status === 'PendingDecision' && (
          <div className="flex gap-2">
            <button onClick={() => setActionMode('reject')}
              className="flex items-center gap-1.5 px-3 py-2 border border-red-300 text-red-700 rounded text-sm hover:bg-red-50">
              <XCircle className="w-4 h-4" />Reject
            </button>
            <button onClick={() => setActionMode('approve')}
              className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">
              <CheckCircle2 className="w-4 h-4" />Approve
            </button>
          </div>
        )}
      </div>

      {/* Status banners */}
      {req.status === 'PendingDecision' && currentStep && (
        <Banner tone="amber" icon={<Clock className="w-5 h-5" />}>
          <strong>Pending {currentStep.label}:</strong> {currentStep.userName} ({currentStep.userTitle}).
          {isCurrentStepDesignee && ' You are the current chain-step designee.'}
        </Banner>
      )}
      {req.status === 'Approved' && (
        <Banner tone="green" icon={<CheckCircle2 className="w-5 h-5" />}>
          <strong>Approved.</strong> Cleared all chain steps on {formatDate(req.finalizedAt)}.
        </Banner>
      )}
      {req.status === 'Rejected' && (
        <Banner tone="red" icon={<XCircle className="w-5 h-5" />}>
          <strong>Rejected</strong> at step {req.stepActions[req.stepActions.length - 1]?.stepIndex + 1} by{' '}
          {req.stepActions[req.stepActions.length - 1]?.approverUserName}.
          {' '}Reason: {req.stepActions[req.stepActions.length - 1]?.comment || '—'}
        </Banner>
      )}

      {/* Action prompt */}
      {actionMode && (
        <div className="bg-white border-2 border-amber-300 rounded-lg p-4">
          <div className="text-sm font-semibold text-gray-900 mb-2">
            {actionMode === 'approve' && `Approve this request at step ${currentStep?.label}`}
            {actionMode === 'reject' && `Reject this request at step ${currentStep?.label}`}
          </div>
          <textarea
            rows={2}
            value={actionComment}
            onChange={e => setActionComment(e.target.value)}
            placeholder={actionMode === 'approve' ? 'Comment (optional)' : 'Reason (required)'}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 mb-2"
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => { setActionMode(null); setActionComment(''); }}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50">Cancel</button>
            <button
              onClick={() => actionMode === 'approve' ? doApprove() : doReject()}
              className={`px-4 py-1.5 rounded text-sm text-white ${
                actionMode === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >Confirm</button>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          {/* Chain progression */}
          <Card title="Chain progression" icon={<Users className="w-4 h-4" />}>
            <ol className="space-y-3">
              {req.matchedRuleChain.map((step, idx) => {
                const action = req.stepActions.find(a => a.stepIndex === idx);
                const isCurrent = req.status === 'PendingDecision' && idx === req.currentStepIndex;
                const isPast = !!action;
                const isFuture = !action && !isCurrent;
                return (
                  <li key={step.userId} className={`flex items-start gap-3 p-3 rounded border ${
                    isCurrent ? 'bg-amber-50 border-amber-300' :
                    isPast && action?.action === 'Approved' ? 'bg-green-50 border-green-200' :
                    isPast && action?.action === 'Rejected' ? 'bg-red-50 border-red-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCurrent ? 'bg-amber-500 text-white' :
                      isPast && action?.action === 'Approved' ? 'bg-green-600 text-white' :
                      isPast && action?.action === 'Rejected' ? 'bg-red-600 text-white' :
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {isPast && action?.action === 'Approved' && <CheckCircle2 className="w-4 h-4" />}
                      {isPast && action?.action === 'Rejected' && <XCircle className="w-4 h-4" />}
                      {(isCurrent || isFuture) && <span className="text-xs font-bold">{step.position}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium text-gray-900">{step.userName}</span>
                        <span className="text-xs text-gray-500">{step.userTitle} · {step.label}</span>
                      </div>
                      {action && (
                        <div className="text-xs text-gray-600 mt-0.5">
                          {action.action} on {formatDateTime(action.timestamp)}
                          {action.comment && <div className="text-gray-700 mt-1 italic">"{action.comment}"</div>}
                        </div>
                      )}
                      {isCurrent && (
                        <div className="text-xs text-amber-700 mt-0.5 font-medium">
                          ← awaiting decision
                        </div>
                      )}
                      {isFuture && (
                        <div className="text-xs text-gray-500 mt-0.5">awaiting earlier steps</div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>

          {/* Description / Justification */}
          <Card title="Description" icon={<FileText className="w-4 h-4" />}>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{req.description}</p>
          </Card>

          <Card title="Business justification" icon={<Activity className="w-4 h-4" />}>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{req.justification}</p>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card title="Routed via" icon={<ShieldCheck className="w-4 h-4" />}>
            {linkedRule ? (
              <Link href={`/doa/delegations/${linkedRule.id}`}
                className="block p-2.5 bg-amber-50 border border-amber-200 rounded hover:border-amber-400 transition-colors">
                <div className="text-sm font-medium text-gray-900">{linkedRule.name}</div>
                <div className="text-xs text-gray-600 mt-0.5">{linkedRule.category} · v{req.matchedRuleVersion}</div>
                <div className="text-xs text-amber-700 mt-1 flex items-center gap-1">View rule<ChevronRight className="w-3 h-3" /></div>
              </Link>
            ) : (
              <div className="text-xs text-gray-500 italic">Linked rule no longer exists.</div>
            )}
          </Card>

          <Card title="Parameters" icon={<Activity className="w-4 h-4" />}>
            {req.monetaryAmount !== undefined && (
              <Row label="Amount" value={`${formatNumber(req.monetaryAmount)} ${req.currency ?? ''}`} />
            )}
            {req.percentageAmount !== undefined && <Row label="Percentage" value={`${req.percentageAmount}%`} />}
            {req.quantityAmount !== undefined && <Row label="Quantity" value={String(req.quantityAmount)} />}
            {req.affectedEntity && <Row label="Affected" value={req.affectedEntity} multiline />}
            {req.region && <Row label="Region" value={req.region} />}
            {req.businessUnit && <Row label="Business unit" value={req.businessUnit} />}
          </Card>

          <Card title="Requester" icon={<Users className="w-4 h-4" />}>
            <Row label="Submitted by" value={req.requestedByUserName} />
            <Row label="Submitted on" value={formatDate(req.requestedAt)} />
            {req.finalizedAt && <Row label="Finalized" value={formatDate(req.finalizedAt)} />}
          </Card>

          {isCurrentStepDesignee && req.status === 'PendingDecision' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
              <strong>Your decision is needed.</strong> Use the Approve / Reject buttons at the top.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">{icon}{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className={multiline ? 'space-y-0.5' : 'flex justify-between gap-3'}>
      <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
      <span className={`text-sm text-gray-900 ${multiline ? 'block' : 'text-right'} break-words`}>{value}</span>
    </div>
  );
}

function Banner({ tone, icon, children }: { tone: 'amber' | 'green' | 'red' | 'gray'; icon: React.ReactNode; children: React.ReactNode }) {
  const styles = {
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    red: 'bg-red-50 border-red-200 text-red-900',
    gray: 'bg-gray-50 border-gray-200 text-gray-900',
  }[tone];
  return (
    <div className={`flex items-start gap-2 p-3 border rounded text-sm ${styles}`}>
      {icon}<div>{children}</div>
    </div>
  );
}
