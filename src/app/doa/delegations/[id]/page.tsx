'use client';

/**
 * Delegation Detail — reads from the rule store, drives all lifecycle actions.
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, CheckCircle2, XCircle, Send, ShieldCheck, Users, Calendar, Clock,
  AlertTriangle, FileText, Activity, Trash2, Edit3, History, GitBranch, Bell,
  PencilLine, Sparkles, Pause, MessageSquarePlus, Layers,
} from 'lucide-react';
import {
  getDelegationRuleById, saveDelegationRule, appendAuditEntry, generateAuditEntryId,
} from '@/lib/doa/utils/delegation-rule-store';
import { useCurrentUser } from '@/lib/doa/hooks/useCurrentUser';
import { formatDate, formatDateTime, formatNumber } from '@/lib/doa/utils/format';
import { StatusBadge } from '../page';
import type { DelegationRule, AuditEntry, PendingModification, VersionSnapshot } from '@/lib/doa/types/delegation-rule-types';

const FIELD_LABELS: Record<string, string> = {
  name: 'Name',
  category: 'Category',
  authorityType: 'Authority type',
  description: 'Description',
  justification: 'Justification',
  chain: 'Approval chain',
  complianceLinks: 'Compliance links',
  type: 'Lifecycle type',
  effectiveFrom: 'Effective from',
  effectiveTo: 'Effective to',
  approvalAuthorityUserId: 'Approval authority',
  'scope.monetaryCap': 'Monetary cap',
  'scope.percentageCap': 'Percentage cap',
  'scope.quantityCap': 'Quantity cap',
  'scope.regions': 'Regions',
  'scope.functions': 'Functions',
  'scope.businessUnits': 'Business units',
  'scope.grades': 'Grades',
  'scope.notes': 'Scope notes',
};

// RACI metadata for the (discreet) RACI-model delegations. Chip colours match
// the SEC Authorization Matrix RACI grid for visual consistency.
const RACI_META: Record<'R' | 'A' | 'C' | 'I', { word: string; hint: string; chip: string }> = {
  R: { word: 'Responsible', hint: 'Carries out / approves the request', chip: 'bg-blue-100 text-blue-700' },
  A: { word: 'Accountable', hint: 'Owns the outcome', chip: 'bg-emerald-100 text-emerald-700' },
  C: { word: 'Consulted', hint: 'Gives input before the decision', chip: 'bg-amber-100 text-amber-700' },
  I: { word: 'Informed', hint: 'Kept up to date', chip: 'bg-gray-100 text-gray-600' },
};

export default function DelegationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ruleId = params.id as string;
  const { user: currentUser } = useCurrentUser();
  const [rule, setRule] = useState<DelegationRule | undefined>();
  const [actionComment, setActionComment] = useState('');
  const [activeAction, setActiveAction] = useState<'approve' | 'reject' | 'revoke' | 'submit' | 'approveMod' | 'rejectMod' | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setRule(getDelegationRuleById(ruleId));
  }, [ruleId, refreshKey]);

  const isCreator = rule?.createdByUserId === currentUser.id;
  const isApprovalAuthority = rule?.approvalAuthorityUserId === currentUser.id;
  const isChainMember = rule?.chain.some(c => c.userId === currentUser.id);

  const canSubmit = rule?.status === 'Draft' && isCreator;
  const canApproveReject = rule?.status === 'PendingApproval' && isApprovalAuthority;
  const canRevoke = rule?.status === 'Active' && currentUser.canCreateDelegations;
  const canEdit = rule?.status === 'Active' && currentUser.canCreateDelegations;
  const canApproveRejectMod =
    rule?.status === 'PendingModification' &&
    !!rule?.pendingModification &&
    (rule?.pendingModification.routedTo?.userId ?? rule?.approvalAuthorityUserId) === currentUser.id;

  if (!rule) {
    return (
      <div className="max-w-3xl mx-auto mt-12 bg-white border border-gray-200 rounded-lg p-8 text-center">
        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Delegation not found</h2>
        <p className="text-sm text-gray-500 mb-4">It may have been deleted or never existed.</p>
        <Link href="/doa/delegations" className="text-sm text-amber-700 hover:underline">← Back to delegations</Link>
      </div>
    );
  }

  // -- Lifecycle actions -------------------------------------------------
  const recordAndSave = (next: DelegationRule, entry: Omit<AuditEntry, 'id' | 'timestamp' | 'actorUserId' | 'actorUserName'>) => {
    const audit: AuditEntry = {
      id: generateAuditEntryId(),
      timestamp: new Date().toISOString(),
      actorUserId: currentUser.id,
      actorUserName: currentUser.name,
      ...entry,
    };
    saveDelegationRule({ ...next, auditTrail: [...next.auditTrail, audit] });
    setRefreshKey(k => k + 1);
    setActiveAction(null);
    setActionComment('');
  };

  const doSubmit = () => {
    if (!canSubmit) return;
    const now = new Date().toISOString();
    const next: DelegationRule = { ...rule, status: 'PendingApproval', submittedAt: now };
    const audit: AuditEntry[] = [
      { id: generateAuditEntryId(), timestamp: now, actorUserId: currentUser.id, actorUserName: currentUser.name, action: 'Submitted', comment: actionComment || undefined },
      { id: generateAuditEntryId(), timestamp: now, actorUserId: currentUser.id, actorUserName: currentUser.name, action: 'Notified', comment: `Chain designees notified: ${rule.chain.map(c => c.userName).join(', ') || 'none'}.` },
    ];
    saveDelegationRule({ ...next, auditTrail: [...next.auditTrail, ...audit] });
    setRefreshKey(k => k + 1);
    setActiveAction(null);
    setActionComment('');
  };
  const doApprove = () => {
    if (!canApproveReject) return;
    const now = new Date().toISOString();
    recordAndSave(
      { ...rule, status: 'Active', approvedAt: now, approvedComment: actionComment || undefined },
      { action: 'Approved', comment: actionComment || undefined },
    );
  };
  const doReject = () => {
    if (!canApproveReject) return;
    if (!actionComment.trim()) { alert('Rejection requires a comment.'); return; }
    const now = new Date().toISOString();
    recordAndSave(
      { ...rule, status: 'Rejected', rejectedAt: now, rejectedComment: actionComment },
      { action: 'Rejected', comment: actionComment },
    );
  };
  const doRevoke = () => {
    if (!canRevoke) return;
    if (!actionComment.trim()) { alert('Revocation requires a reason.'); return; }
    recordAndSave({ ...rule, status: 'Revoked' }, { action: 'Revoked', comment: actionComment });
  };

  const doApproveMod = () => {
    if (!canApproveRejectMod || !rule.pendingModification) return;
    const now = new Date().toISOString();
    const proposed = rule.pendingModification.proposedRule;
    const fieldLabels: Record<string, string> = {
      name: 'name', description: 'description', justification: 'justification',
      scope: 'scope', chain: 'chain', complianceLinks: 'compliance links',
      type: 'type', authorityType: 'authority type', category: 'category',
      effectiveFrom: 'effective from', effectiveTo: 'effective to',
      approvalAuthorityUserId: 'approval authority',
    };
    const changesSummary = rule.pendingModification.criticalFields
      .map(f => fieldLabels[f] ?? f).join(', ');

    // Freeze the current version into versionHistory before merging.
    const snapshot: VersionSnapshot = {
      version: rule.version,
      name: rule.name,
      description: rule.description,
      justification: rule.justification,
      scope: rule.scope,
      chain: rule.chain,
      complianceLinks: rule.complianceLinks,
      type: rule.type,
      effectiveFrom: rule.effectiveFrom,
      effectiveTo: rule.effectiveTo,
      approvalAuthorityUserId: rule.approvalAuthorityUserId,
      approvalAuthorityUserName: rule.approvalAuthorityUserName,
      approvalAuthorityTitle: rule.approvalAuthorityTitle,
      approvedAt: rule.approvedAt,
      supersededAt: now,
      supersededByVersion: rule.version + 1,
      changesSummary: `Superseded by v${rule.version + 1} — changed: ${changesSummary}.`,
      auditTrail: rule.auditTrail,
    };

    // Merge proposed fields into rule, increment version, clear pending slot, return to Active.
    const merged: DelegationRule = {
      ...proposed,
      id: rule.id,
      createdByUserId: rule.createdByUserId,
      createdByUserName: rule.createdByUserName,
      createdAt: rule.createdAt,
      submittedAt: rule.submittedAt,
      approvedAt: rule.approvedAt,
      version: rule.version + 1,
      status: 'Active',
      pendingModification: undefined,
      versionHistory: [...(rule.versionHistory ?? []), snapshot],
      auditTrail: [
        ...rule.auditTrail,
        {
          id: generateAuditEntryId(), timestamp: now,
          actorUserId: currentUser.id, actorUserName: currentUser.name,
          action: 'ModificationApproved',
          comment: actionComment || `Approved modification (changed: ${changesSummary}).`,
        },
      ],
    };
    saveDelegationRule(merged);
    setRefreshKey(k => k + 1);
    setActiveAction(null);
    setActionComment('');
  };

  const doRejectMod = () => {
    if (!canApproveRejectMod || !rule.pendingModification) return;
    if (!actionComment.trim()) { alert('Rejection requires a comment.'); return; }
    const now = new Date().toISOString();
    const reverted: DelegationRule = {
      ...rule,
      status: 'Active',
      pendingModification: undefined,
      auditTrail: [
        ...rule.auditTrail,
        {
          id: generateAuditEntryId(), timestamp: now,
          actorUserId: currentUser.id, actorUserName: currentUser.name,
          action: 'ModificationRejected',
          comment: actionComment,
        },
      ],
    };
    saveDelegationRule(reverted);
    setRefreshKey(k => k + 1);
    setActiveAction(null);
    setActionComment('');
  };

  const thresholdParts: string[] = [];
  if (rule.scope.monetaryCap) thresholdParts.push(`${formatNumber(rule.scope.monetaryCap.amount)} ${rule.scope.monetaryCap.currency}`);
  if (rule.scope.percentageCap !== undefined) thresholdParts.push(`${rule.scope.percentageCap}%`);
  if (rule.scope.quantityCap !== undefined) thresholdParts.push(`${rule.scope.quantityCap} units`);
  const thresholdLine = thresholdParts.length ? `Up to ${thresholdParts.join(' · ')}` : 'No cap';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Link href="/doa/delegations" className="p-2 hover:bg-gray-100 rounded">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-semibold text-gray-900">{rule.name}</h1>
              <StatusBadge status={rule.status} />
              <span className="text-xs text-gray-400">v{rule.version} · {rule.id}</span>
            </div>
            <p className="text-sm text-gray-600">{rule.authorityType} · {rule.category}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {canEdit && (
            <Link
              href={`/doa/delegations/${rule.id}/edit`}
              className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
            >
              <Edit3 className="w-4 h-4" />Edit
            </Link>
          )}
          {canSubmit && (
            <button
              onClick={() => setActiveAction('submit')}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 text-white rounded text-sm hover:bg-amber-600"
            >
              <Send className="w-4 h-4" />Submit for approval
            </button>
          )}
          {canApproveReject && (
            <>
              <button
                onClick={() => setActiveAction('reject')}
                className="flex items-center gap-1.5 px-3 py-2 border border-red-300 text-red-700 rounded text-sm hover:bg-red-50"
              >
                <XCircle className="w-4 h-4" />Reject
              </button>
              <button
                onClick={() => setActiveAction('approve')}
                className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                <CheckCircle2 className="w-4 h-4" />Approve
              </button>
            </>
          )}
          {canApproveRejectMod && (
            <>
              <button
                onClick={() => setActiveAction('rejectMod')}
                className="flex items-center gap-1.5 px-3 py-2 border border-red-300 text-red-700 rounded text-sm hover:bg-red-50"
              >
                <XCircle className="w-4 h-4" />Reject modification
              </button>
              <button
                onClick={() => setActiveAction('approveMod')}
                className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                <CheckCircle2 className="w-4 h-4" />Approve modification
              </button>
            </>
          )}
          {canRevoke && (
            <button
              onClick={() => setActiveAction('revoke')}
              className="flex items-center gap-1.5 px-3 py-2 border border-red-300 text-red-700 rounded text-sm hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />Revoke
            </button>
          )}
        </div>
      </div>

      {/* Banners by status / role */}
      {rule.status === 'PendingApproval' && (
        <Banner tone="amber" icon={<Clock className="w-5 h-5" />}>
          <strong>Pending approval</strong> from {rule.approvalAuthorityUserName} ({rule.approvalAuthorityTitle}).
          {isApprovalAuthority && ' You are the approval authority — use Approve or Reject above.'}
        </Banner>
      )}
      {rule.status === 'Active' && (
        <Banner tone="green" icon={<CheckCircle2 className="w-5 h-5" />}>
          <strong>Active &amp; enforced.</strong> Approved by {rule.approvalAuthorityUserName} on {formatDate(rule.approvedAt)}.
        </Banner>
      )}
      {rule.status === 'Draft' && isCreator && (
        <Banner tone="gray" icon={<FileText className="w-5 h-5" />}>
          <strong>Draft.</strong> Not yet submitted. Use the Submit button to send for approval.
        </Banner>
      )}
      {rule.status === 'Rejected' && (
        <Banner tone="red" icon={<XCircle className="w-5 h-5" />}>
          <strong>Rejected</strong> by {rule.approvalAuthorityUserName}. Reason: {rule.rejectedComment || '—'}
        </Banner>
      )}
      {rule.status === 'Revoked' && (
        <Banner tone="red" icon={<Trash2 className="w-5 h-5" />}>
          <strong>Revoked.</strong> Rule no longer enforced.
        </Banner>
      )}
      {rule.status === 'PendingModification' && rule.pendingModification && (
        <Banner tone="amber" icon={<AlertTriangle className="w-5 h-5" />}>
          <strong>Pending modification.</strong> {rule.pendingModification.proposedByUserName} submitted critical
          changes; routed to {rule.pendingModification.routedTo?.userName ?? rule.approvalAuthorityUserName} for re-approval.
          The Active rule (v{rule.version}) is still being enforced. See the diff below.
          {canApproveRejectMod && ' You are the approval authority for this modification.'}
        </Banner>
      )}

      {/* Action prompt */}
      {activeAction && (
        <div className="bg-white border-2 border-amber-300 rounded-lg p-4">
          <div className="text-sm font-semibold text-gray-900 mb-2">
            {activeAction === 'submit' && 'Submit this delegation for approval'}
            {activeAction === 'approve' && 'Approve this delegation'}
            {activeAction === 'reject' && 'Reject this delegation'}
            {activeAction === 'revoke' && 'Revoke this delegation'}
            {activeAction === 'approveMod' && 'Approve the pending modification'}
            {activeAction === 'rejectMod' && 'Reject the pending modification'}
          </div>
          <textarea
            rows={2}
            value={actionComment}
            onChange={e => setActionComment(e.target.value)}
            placeholder={activeAction === 'approve' ? 'Approval comment (optional)' : 'Reason (required)'}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 mb-2"
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => { setActiveAction(null); setActionComment(''); }}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50">Cancel</button>
            <button
              onClick={() => {
                if (activeAction === 'submit') doSubmit();
                if (activeAction === 'approve') doApprove();
                if (activeAction === 'reject') doReject();
                if (activeAction === 'revoke') doRevoke();
                if (activeAction === 'approveMod') doApproveMod();
                if (activeAction === 'rejectMod') doRejectMod();
              }}
              className={`px-4 py-1.5 rounded text-sm text-white ${
                activeAction === 'reject' || activeAction === 'revoke' || activeAction === 'rejectMod' ? 'bg-red-600 hover:bg-red-700' :
                activeAction === 'approve' || activeAction === 'approveMod' ? 'bg-green-600 hover:bg-green-700' :
                'bg-amber-500 hover:bg-amber-600'
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Two-column main */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          {/* Proposed modification diff (top of page if pending) */}
          {rule.pendingModification && (
            <PendingModificationCard pending={rule.pendingModification} />
          )}

          {/* Authority + scope */}
          <Card title="Authority & scope" icon={<ShieldCheck className="w-4 h-4" />}>
            <Row label="Description" value={rule.description} multiline />
            <Row label="Threshold" value={thresholdLine} />
            {(rule.scope.regions ?? []).length > 0 && <Row label="Regions" value={rule.scope.regions!.join(', ')} />}
            {(rule.scope.functions ?? []).length > 0 && <Row label="Functions" value={rule.scope.functions!.join(', ')} />}
            {(rule.scope.businessUnits ?? []).length > 0 && <Row label="Business units" value={rule.scope.businessUnits!.join(', ')} />}
            {(rule.scope.grades ?? []).length > 0 && <Row label="Grades" value={rule.scope.grades!.join(', ')} />}
            {rule.scope.notes && <Row label="Notes" value={rule.scope.notes} multiline />}
          </Card>

          {/* Approval workflow — RACI model (discreet exception) or runtime L1/L2/L3 chain */}
          {rule.raci && rule.raci.length > 0 ? (
            <Card title="RACI approval workflow" icon={<Users className="w-4 h-4" />}>
              <p className="text-xs text-gray-500 mb-3">
                This delegation follows the <strong>RACI model</strong> from the SEC Authorization
                Matrix — who is Responsible, Accountable, Consulted, and Informed for matching
                runtime requests — instead of a sequential L1/L2/L3 chain.
              </p>
              <div className="space-y-2">
                {rule.raci.map((a, idx) => {
                  const meta = RACI_META[a.code];
                  return (
                    <div key={idx} className="flex items-start gap-3 p-2.5 bg-gray-50 border border-gray-200 rounded">
                      <span className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold flex-shrink-0 ${meta.chip}`}>
                        {a.code}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">{a.userName}</div>
                        <div className="text-xs text-gray-500">{a.userTitle}</div>
                        {a.note && <div className="text-xs text-gray-500 mt-0.5">{a.note}</div>}
                      </div>
                      <span className="text-xs font-medium text-gray-600 flex-shrink-0 mt-1">{meta.word}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                {(['R', 'A', 'C', 'I'] as const).map(code => (
                  <span key={code} className="flex items-center gap-1.5">
                    <span className={`inline-flex items-center justify-center w-4 h-4 rounded text-[10px] font-bold ${RACI_META[code].chip}`}>
                      {code}
                    </span>
                    <strong>{RACI_META[code].word}</strong>
                    <span className="text-gray-400">— {RACI_META[code].hint}</span>
                  </span>
                ))}
              </div>
            </Card>
          ) : (
            <Card title="Approval chain (runtime)" icon={<Users className="w-4 h-4" />}>
              <p className="text-xs text-gray-500 mb-3">
                These designees approve <em>matching runtime requests</em> once the rule is active.
                They were notified at rule creation; they do not gate the rule's approval.
              </p>
              <div className="space-y-2">
                {rule.chain.map((c, idx) => (
                  <div key={c.userId} className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded">
                    <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-xs font-bold">
                      {c.position}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{c.userName}</div>
                      <div className="text-xs text-gray-500">{c.userTitle} · {c.label}</div>
                    </div>
                    {idx < rule.chain.length - 1 && <span className="text-gray-300">→</span>}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Compliance */}
          {rule.complianceLinks.length > 0 && (
            <Card title="Compliance links" icon={<ShieldCheck className="w-4 h-4" />}>
              <div className="space-y-2">
                {rule.complianceLinks.map((l, idx) => (
                  <div key={idx} className="p-2.5 bg-blue-50 border border-blue-200 rounded">
                    <div className="text-sm font-medium text-gray-900">
                      <span className="text-blue-700">{l.framework}</span> · {l.controlCode} — {l.controlName}
                    </div>
                    {l.rationale && <div className="text-xs text-gray-600 mt-0.5">{l.rationale}</div>}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Justification */}
          <Card title="Business justification" icon={<FileText className="w-4 h-4" />}>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{rule.justification}</p>
          </Card>

          {/* History timeline */}
          <Card title="History" icon={<History className="w-4 h-4" />}>
            <HistoryTimeline audit={rule.auditTrail} />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <VersionsPanel rule={rule} />

          <Card title="Approval authority" icon={<ShieldCheck className="w-4 h-4" />}>
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded">
              <div className="text-sm font-semibold text-gray-900">{rule.approvalAuthorityUserName}</div>
              <div className="text-xs text-gray-600">{rule.approvalAuthorityTitle}</div>
            </div>
            {rule.approvalAuthoritySuggestionRationale && (
              <p className="mt-2 text-xs text-gray-500 italic">{rule.approvalAuthoritySuggestionRationale}</p>
            )}
          </Card>

          <Card title="Lifecycle" icon={<Calendar className="w-4 h-4" />}>
            <Row label="Type" value={rule.type} />
            <Row label="Effective from" value={formatDate(rule.effectiveFrom)} />
            {rule.effectiveTo && <Row label="Effective to" value={formatDate(rule.effectiveTo)} />}
            <Row label="Created" value={`${formatDate(rule.createdAt)} by ${rule.createdByUserName}`} />
            {rule.submittedAt && <Row label="Submitted" value={formatDate(rule.submittedAt)} />}
            {rule.approvedAt && <Row label="Approved" value={formatDate(rule.approvedAt)} />}
          </Card>

          {(isCreator || isApprovalAuthority || isChainMember) && (
            <Card title="Your role here" icon={<Users className="w-4 h-4" />}>
              <div className="space-y-1.5 text-xs">
                {isCreator && <Tag color="blue">Creator</Tag>}
                {isApprovalAuthority && <Tag color="amber">Approval authority</Tag>}
                {isChainMember && <Tag color="green">Chain designee</Tag>}
              </div>
            </Card>
          )}
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

function Row({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className={multiline ? 'space-y-0.5' : 'flex justify-between gap-3'}>
      <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
      <span className={`text-sm text-gray-900 ${multiline ? 'block' : 'text-right'} break-words`}>{value}</span>
    </div>
  );
}

function Tag({ color, children }: { color: 'blue' | 'amber' | 'green'; children: React.ReactNode }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    green: 'bg-green-50 text-green-700 border-green-200',
  };
  return <span className={`inline-block px-2 py-0.5 text-xs rounded border ${colors[color]} mr-1`}>{children}</span>;
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

function PendingModificationCard({ pending }: { pending: PendingModification }) {
  return (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-amber-900 mb-1 flex items-center gap-1.5">
        <AlertTriangle className="w-4 h-4" />Proposed modification
      </h3>
      <p className="text-xs text-amber-800 mb-3">
        Submitted by <strong>{pending.proposedByUserName}</strong> on {formatDateTime(pending.proposedAt)}.
        Critical fields changed: <strong>{pending.criticalFields.map(f => FIELD_LABELS[f] ?? f).join(', ')}</strong>.
      </p>
      <ul className="space-y-2">
        {pending.changes.map(c => {
          const critical = pending.criticalFields.includes(c.field);
          return (
            <li key={c.field} className="bg-white border border-amber-200 rounded p-2.5 text-xs">
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${critical ? 'bg-red-500' : 'bg-green-500'}`} />
                <span className="font-semibold text-gray-900">{FIELD_LABELS[c.field] ?? c.field}</span>
                {critical && <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-medium rounded">critical</span>}
              </div>
              <div className="grid grid-cols-2 gap-3 ml-3">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">Current (v{pending.proposedRule.version})</div>
                  <DiffValue value={c.oldValue} />
                </div>
                <div>
                  <div className="text-[10px] text-amber-700 uppercase tracking-wide mb-0.5">Proposed</div>
                  <DiffValue value={c.newValue} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DiffValue({ value }: { value: unknown }) {
  if (value === undefined || value === null || value === '') return <em className="text-gray-400">empty</em>;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return <span className="text-gray-900">{String(value)}</span>;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return <em className="text-gray-400">empty list</em>;
    if (typeof value[0] === 'string') return <span className="text-gray-900">{(value as string[]).join(', ')}</span>;
    const items = value as Array<{ userName?: string; controlCode?: string; framework?: string }>;
    return (
      <ul className="space-y-0.5">
        {items.map((it, idx) => (
          <li key={idx} className="text-gray-900">
            {it.userName ?? (`${it.framework ?? ''} ${it.controlCode ?? ''}`.trim() || JSON.stringify(it))}
          </li>
        ))}
      </ul>
    );
  }
  if (typeof value === 'object') {
    const v = value as Record<string, unknown>;
    if (typeof v.amount === 'number' && typeof v.currency === 'string') {
      return <span className="text-gray-900">{formatNumber(v.amount as number)} {v.currency as string}</span>;
    }
    // Scope-like object — compact summary of present caps and scope hints.
    if ('monetaryCap' in v || 'percentageCap' in v || 'quantityCap' in v || 'regions' in v || 'businessUnits' in v || 'grades' in v) {
      const parts: string[] = [];
      const cap = v.monetaryCap as { amount?: number; currency?: string } | undefined;
      if (cap?.amount) parts.push(`cap ${formatNumber(cap.amount)} ${cap.currency ?? ''}`.trim());
      if (typeof v.percentageCap === 'number') parts.push(`${v.percentageCap}%`);
      if (typeof v.quantityCap === 'number') parts.push(`${v.quantityCap} units`);
      if (Array.isArray(v.regions) && v.regions.length) parts.push(`regions: ${(v.regions as string[]).join(', ')}`);
      if (Array.isArray(v.businessUnits) && v.businessUnits.length) parts.push(`BUs: ${(v.businessUnits as string[]).join(', ')}`);
      if (Array.isArray(v.functions) && v.functions.length) parts.push(`fns: ${(v.functions as string[]).join(', ')}`);
      if (Array.isArray(v.grades) && v.grades.length) parts.push(`grades: ${(v.grades as string[]).join(', ')}`);
      return <span className="text-gray-900">{parts.join(' · ') || '—'}</span>;
    }
    return <span className="text-gray-900 italic">{JSON.stringify(value).slice(0, 80)}</span>;
  }
  return null;
}

// ============================================================================
// Versions panel
// ============================================================================

function VersionsPanel({ rule }: { rule: DelegationRule }) {
  // Build a list ordered newest-first:
  //  - DRAFT (pending modification, future version)
  //  - ACTIVE (or whatever current status)
  //  - past versions from versionHistory (newest first)
  type Row = {
    version: number;
    status: 'DRAFT' | 'CURRENT' | 'SUPERSEDED';
    statusLabel: string;
    statusColor: string;
    date: string;
    summary: string;
  };

  const rows: Row[] = [];

  if (rule.pendingModification) {
    rows.push({
      version: rule.version + 1,
      status: 'DRAFT',
      statusLabel: 'DRAFT',
      statusColor: 'bg-blue-100 text-blue-700',
      date: formatDate(rule.pendingModification.proposedAt),
      summary: `Proposed by ${rule.pendingModification.proposedByUserName} — ${rule.pendingModification.criticalFields.join(', ')}.`,
    });
  }

  rows.push({
    version: rule.version,
    status: 'CURRENT',
    statusLabel: rule.status === 'Active' ? 'ACTIVE'
      : rule.status === 'PendingModification' ? 'ACTIVE (mod pending)'
      : rule.status.toUpperCase(),
    statusColor: rule.status === 'Active' || rule.status === 'PendingModification'
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-700',
    date: formatDate(rule.effectiveFrom),
    summary: rule.versionHistory && rule.versionHistory.length > 0
      ? `Current version. Effective from ${formatDate(rule.effectiveFrom)}.`
      : 'Initial version.',
  });

  (rule.versionHistory ?? [])
    .slice()
    .reverse()
    .forEach(snap => {
      rows.push({
        version: snap.version,
        status: 'SUPERSEDED',
        statusLabel: 'SUPERSEDED',
        statusColor: 'bg-gray-100 text-gray-600',
        date: formatDate(snap.effectiveFrom),
        summary: snap.changesSummary,
      });
    });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
          <Layers className="w-4 h-4" />Versions
        </h3>
        <span className="text-xs text-gray-400">{rows.length}</span>
      </div>
      <ul className="space-y-2">
        {rows.map((r, idx) => (
          <li key={`${r.version}-${r.status}`} className={`p-2.5 rounded border ${
            r.status === 'CURRENT' ? 'bg-amber-50 border-amber-300' :
            r.status === 'DRAFT' ? 'bg-blue-50 border-blue-200' :
            'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${
                  r.status === 'CURRENT' ? 'border-amber-500 bg-amber-500' :
                  r.status === 'DRAFT' ? 'border-blue-400 bg-white' :
                  'border-gray-300 bg-white'
                }`}>
                  {r.status === 'CURRENT' && (
                    <span className="block w-full h-full rounded-full ring-2 ring-amber-50 bg-white scale-50 origin-center"></span>
                  )}
                </span>
                <span className="text-sm font-semibold text-gray-900">v{r.version}.0</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-gray-500 whitespace-nowrap">{r.date}</span>
                <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${r.statusColor}`}>
                  {r.statusLabel}
                </span>
              </div>
            </div>
            <p className="mt-1 ml-5 text-xs text-gray-600">{r.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// History timeline
// ============================================================================

function HistoryTimeline({ audit }: { audit: AuditEntry[] }) {
  // Group entries by date (UTC).
  const grouped = new Map<string, AuditEntry[]>();
  audit.forEach(e => {
    const day = e.timestamp.slice(0, 10);
    if (!grouped.has(day)) grouped.set(day, []);
    grouped.get(day)!.push(e);
  });
  const dayKeys = Array.from(grouped.keys()).sort().reverse(); // newest day first

  if (audit.length === 0) {
    return <p className="text-xs text-gray-500 italic">No history yet.</p>;
  }

  return (
    <div>
      {dayKeys.map(day => {
        const entries = grouped.get(day)!.slice().sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        return (
          <div key={day} className="mb-5 last:mb-0">
            <div className="flex items-center gap-2 mb-3 ml-12">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-semibold text-gray-700">{formatHumanDate(day)}</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <ul className="space-y-3">
              {entries.map(e => (
                <TimelineEntry key={e.id} entry={e} />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function TimelineEntry({ entry }: { entry: AuditEntry }) {
  const { icon, color, verb } = getActionStyle(entry.action);
  const time = entry.timestamp.slice(11, 16);

  return (
    <li className="flex items-start gap-3">
      <div className="w-10 flex-shrink-0 text-[10px] text-gray-400 text-right pt-1.5">{time} UTC</div>
      <div className={`w-7 h-7 rounded-full ${color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="text-sm">
          <span className="font-medium text-gray-900">{entry.actorUserName}</span>{' '}
          <span className="text-gray-600">{verb}</span>
        </div>
        {entry.comment && (
          <div className="mt-1 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700">
            {entry.comment}
          </div>
        )}
        {entry.fieldChanges && entry.fieldChanges.length > 0 && (
          <div className="mt-1.5 space-y-1">
            {entry.fieldChanges.map((c, idx) => (
              <FieldDiff key={idx} field={c.field} oldValue={c.oldValue} newValue={c.newValue} />
            ))}
          </div>
        )}
      </div>
    </li>
  );
}

function FieldDiff({ field, oldValue, newValue }: { field: string; oldValue: unknown; newValue: unknown }) {
  return (
    <div className="text-xs text-gray-700 p-2 bg-gray-50 border border-gray-200 rounded">
      <span className="text-gray-500">Changed </span>
      <span className="font-medium text-gray-900">{FIELD_LABELS[field] ?? field}</span>
      <span className="text-gray-500"> from </span>
      <span className="line-through text-red-600 decoration-red-400">
        <DiffValue value={oldValue} />
      </span>
      <span className="text-gray-500"> to </span>
      <span className="text-green-700 font-medium">
        <DiffValue value={newValue} />
      </span>
    </div>
  );
}

function getActionStyle(action: AuditEntry['action']): { icon: React.ReactNode; color: string; verb: string } {
  const sized = 'w-3.5 h-3.5 text-white';
  switch (action) {
    case 'Created':
      return { icon: <Sparkles className={sized} />, color: 'bg-purple-500', verb: 'created the delegation' };
    case 'Submitted':
      return { icon: <Send className={sized} />, color: 'bg-blue-500', verb: 'submitted for approval' };
    case 'Approved':
      return { icon: <CheckCircle2 className={sized} />, color: 'bg-green-600', verb: 'approved the delegation' };
    case 'Rejected':
      return { icon: <XCircle className={sized} />, color: 'bg-red-600', verb: 'rejected the delegation' };
    case 'ModificationSubmitted':
      return { icon: <PencilLine className={sized} />, color: 'bg-blue-500', verb: 'submitted a critical modification' };
    case 'ModificationApproved':
      return { icon: <CheckCircle2 className={sized} />, color: 'bg-green-600', verb: 'approved the modification' };
    case 'ModificationRejected':
      return { icon: <XCircle className={sized} />, color: 'bg-red-600', verb: 'rejected the modification' };
    case 'AutoAppliedNonCritical':
      return { icon: <PencilLine className={sized} />, color: 'bg-amber-500', verb: 'made changes' };
    case 'Revoked':
      return { icon: <Trash2 className={sized} />, color: 'bg-red-600', verb: 'revoked the delegation' };
    case 'Suspended':
      return { icon: <Pause className={sized} />, color: 'bg-orange-500', verb: 'suspended the delegation' };
    case 'Expired':
      return { icon: <Clock className={sized} />, color: 'bg-gray-400', verb: 'expired' };
    case 'Notified':
      return { icon: <Bell className={sized} />, color: 'bg-gray-400', verb: 'notified chain designees' };
    default:
      return { icon: <GitBranch className={sized} />, color: 'bg-gray-500', verb: action };
  }
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function formatHumanDate(iso: string): string {
  // iso = YYYY-MM-DD
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[(m - 1) % 12]} ${d}, ${y}`;
}
