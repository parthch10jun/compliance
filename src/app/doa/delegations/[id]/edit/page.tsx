'use client';

/**
 * Edit Delegation — single-page form with live criticality routing.
 *
 * Non-critical edits (description, justification, dates) auto-apply on submit:
 *   version bumps, change is audit-logged, chain designees notified.
 * Critical edits (authority, scope, chain, compliance, type, approval authority)
 *   are stashed in pendingModification and routed to the approval authority for
 *   sign-off. The current Active rule keeps enforcing until the mod is approved.
 */

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, AlertTriangle, CheckCircle2, FileText, Send, Save, X, Activity,
} from 'lucide-react';
import { useCurrentUser } from '@/lib/doa/hooks/useCurrentUser';
import { mockUsers } from '@/lib/doa/data/mockUsers';
import {
  getDelegationRuleById, saveDelegationRule, generateAuditEntryId,
} from '@/lib/doa/utils/delegation-rule-store';
import { analyzeModification } from '@/lib/doa/utils/field-criticality';
import { formatNumber } from '@/lib/doa/utils/format';
import {
  MultiSelectField, ChainPicker, ComplianceLinksEditor,
  chainAddHelper, chainRemoveHelper, chainMoveHelper,
} from '@/components/doa/delegations/form-pieces';
import type {
  AuditEntry, ChainDesignee, ComplianceLink, DelegationCategory,
  DelegationLifecycleType, DelegationRule, DelegationScope, PendingModification,
  VersionSnapshot,
} from '@/lib/doa/types/delegation-rule-types';

const FINANCIAL_AUTHORITIES = [
  'Salary Increase Approval', 'Capital Expenditure Approval', 'Purchase Order Approval',
  'Vendor Contract Approval', 'Operating Expense Approval', 'Budget Reallocation',
  'Discount Authority', 'Investment Decision',
];
const NON_FINANCIAL_AUTHORITIES = [
  'Hiring Approval', 'Termination Approval', 'Leave Approval', 'IT Privileged Access Grant',
  'Policy Exception Approval', 'Travel Approval', 'External Communications Approval', 'Project Initiation',
];
const LIFECYCLE_TYPES: DelegationLifecycleType[] = ['Permanent', 'Temporary', 'Project-Based', 'OOO'];
const REGIONS = ['North America', 'EMEA', 'APAC', 'LATAM', 'GCC'];
const FUNCTIONS_LIST = ['Finance', 'HR', 'IT', 'Security', 'Legal', 'Operations', 'Procurement', 'Compliance', 'Risk', 'Sales'];
const BUSINESS_UNITS = ['Corporate', 'North America', 'EMEA', 'APAC', 'LATAM'];

interface EditState {
  name: string;
  category: DelegationCategory;
  authorityType: string;
  description: string;
  justification: string;
  scope: DelegationScope;
  scopeHasMonetaryCap: boolean;
  scopeMonetaryAmount: string;
  scopeCurrency: string;
  scopePercentageCap: string;
  scopeQuantityCap: string;
  chain: ChainDesignee[];
  complianceLinks: ComplianceLink[];
  type: DelegationLifecycleType;
  effectiveFrom: string;
  effectiveTo: string;
  approvalAuthorityUserId: string;
}

function ruleToState(rule: DelegationRule): EditState {
  return {
    name: rule.name,
    category: rule.category,
    authorityType: rule.authorityType,
    description: rule.description,
    justification: rule.justification,
    scope: rule.scope,
    scopeHasMonetaryCap: !!rule.scope.monetaryCap,
    scopeMonetaryAmount: rule.scope.monetaryCap ? String(rule.scope.monetaryCap.amount) : '',
    scopeCurrency: rule.scope.monetaryCap?.currency ?? 'AED',
    scopePercentageCap: rule.scope.percentageCap !== undefined ? String(rule.scope.percentageCap) : '',
    scopeQuantityCap: rule.scope.quantityCap !== undefined ? String(rule.scope.quantityCap) : '',
    chain: rule.chain,
    complianceLinks: rule.complianceLinks,
    type: rule.type,
    effectiveFrom: rule.effectiveFrom.slice(0, 10),
    effectiveTo: rule.effectiveTo?.slice(0, 10) ?? '',
    approvalAuthorityUserId: rule.approvalAuthorityUserId,
  };
}

function buildProposedRule(original: DelegationRule, state: EditState): DelegationRule {
  const scope: DelegationScope = {
    regions: state.scope.regions,
    functions: state.scope.functions,
    businessUnits: state.scope.businessUnits,
    grades: state.scope.grades,
    notes: state.scope.notes,
  };
  if (state.scopeHasMonetaryCap && state.scopeMonetaryAmount) {
    scope.monetaryCap = {
      amount: Number(state.scopeMonetaryAmount.replace(/[, ]/g, '')) || 0,
      currency: state.scopeCurrency,
    };
  }
  if (state.scopePercentageCap) scope.percentageCap = Number(state.scopePercentageCap);
  if (state.scopeQuantityCap) scope.quantityCap = Number(state.scopeQuantityCap);

  const approver = mockUsers.find(u => u.id === state.approvalAuthorityUserId);

  return {
    ...original,
    name: state.name.trim(),
    category: state.category,
    authorityType: state.authorityType.trim(),
    description: state.description.trim(),
    justification: state.justification.trim(),
    scope,
    chain: state.chain,
    complianceLinks: state.complianceLinks,
    type: state.type,
    effectiveFrom: state.effectiveFrom ? new Date(state.effectiveFrom).toISOString() : original.effectiveFrom,
    effectiveTo: state.effectiveTo ? new Date(state.effectiveTo).toISOString() : undefined,
    approvalAuthorityUserId: state.approvalAuthorityUserId,
    approvalAuthorityUserName: approver?.name ?? original.approvalAuthorityUserName,
    approvalAuthorityTitle: approver?.role ?? original.approvalAuthorityTitle,
  };
}

const FIELD_LABELS: Record<string, string> = {
  name: 'Name',
  category: 'Category',
  authorityType: 'Authority type',
  description: 'Description',
  justification: 'Justification',
  scope: 'Scope / threshold',
  chain: 'Approval chain',
  complianceLinks: 'Compliance links',
  type: 'Lifecycle type',
  effectiveFrom: 'Effective from',
  effectiveTo: 'Effective to',
  approvalAuthorityUserId: 'Approval authority',
};

export default function EditDelegationPage() {
  const params = useParams();
  const router = useRouter();
  const ruleId = params.id as string;
  const { user: currentUser } = useCurrentUser();

  const [rule, setRule] = useState<DelegationRule | undefined>();
  const [state, setState] = useState<EditState | undefined>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const r = getDelegationRuleById(ruleId);
    setRule(r);
    if (r) setState(ruleToState(r));
  }, [ruleId]);

  const analysis = useMemo(() => {
    if (!rule || !state) return undefined;
    const proposed = buildProposedRule(rule, state);
    return analyzeModification(rule, proposed);
  }, [rule, state]);

  if (!rule || !state) {
    return (
      <div className="max-w-3xl mx-auto mt-12 bg-white border border-gray-200 rounded-lg p-8 text-center">
        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Delegation not found</h2>
        <Link href="/doa/delegations" className="text-sm text-amber-700 hover:underline">← Back to delegations</Link>
      </div>
    );
  }

  if (rule.pendingModification) {
    return (
      <div className="max-w-3xl mx-auto mt-12 bg-amber-50 border-2 border-amber-300 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-amber-900 mb-1">Modification already pending</h2>
            <p className="text-sm text-amber-800 mb-3">
              A critical modification is currently awaiting approval by{' '}
              <strong>{rule.pendingModification.routedTo?.userName ?? rule.approvalAuthorityUserName}</strong>.
              Resolve that before submitting further edits.
            </p>
            <Link href={`/doa/delegations/${rule.id}`}
              className="inline-flex items-center gap-1.5 text-sm text-amber-900 hover:underline">
              <ArrowLeft className="w-4 h-4" />Back to delegation
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (rule.status !== 'Active') {
    return (
      <div className="max-w-3xl mx-auto mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Only Active rules can be edited</h2>
        <p className="text-sm text-gray-600 mb-3">
          This rule is in status <strong>{rule.status}</strong>. Edit is only available for Active rules.
        </p>
        <Link href={`/doa/delegations/${rule.id}`} className="text-sm text-amber-700 hover:underline">← Back to delegation</Link>
      </div>
    );
  }

  if (!currentUser.canCreateDelegations) {
    return (
      <div className="max-w-3xl mx-auto mt-12 bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">No permission to modify delegations</h2>
        <p className="text-sm text-gray-600">Switch to a user with delegation-authoring capability.</p>
      </div>
    );
  }

  const set = <K extends keyof EditState>(k: K, v: EditState[K]) =>
    setState(s => (s ? { ...s, [k]: v } : s));

  const onChainAdd = (uid: string) => setState(s => s ? { ...s, chain: chainAddHelper(s.chain, uid) } : s);
  const onChainRemove = (uid: string) => setState(s => s ? { ...s, chain: chainRemoveHelper(s.chain, uid) } : s);
  const onChainMove = (uid: string, dir: -1 | 1) => setState(s => s ? { ...s, chain: chainMoveHelper(s.chain, uid, dir) } : s);

  const proposed = buildProposedRule(rule, state);
  const changes = analysis?.changes ?? [];
  const hasChanges = changes.length > 0;
  const isCritical = analysis?.isCritical ?? false;

  const submit = () => {
    if (!hasChanges) { setError('No changes to submit.'); return; }
    if (!state.name.trim()) { setError('Name is required.'); return; }
    if (!state.authorityType.trim()) { setError('Authority type is required.'); return; }
    if (state.chain.length === 0) { setError('At least one chain designee is required.'); return; }

    const now = new Date().toISOString();

    if (isCritical) {
      const pending: PendingModification = {
        proposedAt: now,
        proposedByUserId: currentUser.id,
        proposedByUserName: currentUser.name,
        isCritical: true,
        criticalFields: analysis?.criticalFields ?? [],
        changes: (analysis?.changes ?? []).map(c => ({ field: c.field, oldValue: c.oldValue, newValue: c.newValue })),
        proposedRule: proposed,
        routedTo: { userId: rule.approvalAuthorityUserId, userName: rule.approvalAuthorityUserName },
        status: 'PendingApproval',
      };
      const audit: AuditEntry = {
        id: generateAuditEntryId(), timestamp: now,
        actorUserId: currentUser.id, actorUserName: currentUser.name,
        action: 'ModificationSubmitted',
        comment: `Critical modification submitted. Changed: ${(analysis?.criticalFields ?? []).map(f => FIELD_LABELS[f] ?? f).join(', ')}. Routed to ${rule.approvalAuthorityUserName} for re-approval.`,
        fieldChanges: analysis?.changes.map(c => ({ field: c.field, oldValue: c.oldValue, newValue: c.newValue })),
      };
      const updated: DelegationRule = {
        ...rule,
        status: 'PendingModification',
        pendingModification: pending,
        auditTrail: [...rule.auditTrail, audit],
      };
      saveDelegationRule(updated);
      router.push(`/doa/delegations/${rule.id}`);
    } else {
      // Snapshot the current version before applying the auto-applied edit.
      const changedNonCritical = (analysis?.nonCriticalFields ?? []).map(f => FIELD_LABELS[f] ?? f).join(', ');
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
        changesSummary: `Superseded by v${rule.version + 1} — non-critical update to ${changedNonCritical}.`,
        auditTrail: rule.auditTrail,
      };
      const applied: DelegationRule = {
        ...proposed,
        version: rule.version + 1,
        versionHistory: [...(rule.versionHistory ?? []), snapshot],
        auditTrail: [
          ...rule.auditTrail,
          {
            id: generateAuditEntryId(), timestamp: now,
            actorUserId: currentUser.id, actorUserName: currentUser.name,
            action: 'AutoAppliedNonCritical',
            comment: `Non-critical edit auto-applied. Changed: ${changedNonCritical}.`,
            fieldChanges: analysis?.changes.map(c => ({ field: c.field, oldValue: c.oldValue, newValue: c.newValue })),
          },
          {
            id: generateAuditEntryId(), timestamp: now,
            actorUserId: currentUser.id, actorUserName: currentUser.name,
            action: 'Notified',
            comment: `Chain designees notified of update: ${rule.chain.map(c => c.userName).join(', ') || 'none'}.`,
          },
        ],
      };
      saveDelegationRule(applied);
      router.push(`/doa/delegations/${rule.id}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Link href={`/doa/delegations/${rule.id}`} className="p-2 hover:bg-gray-100 rounded">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Edit · {rule.name}</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Editing as <span className="font-medium text-gray-700">{currentUser.name}</span> · v{rule.version} active
            </p>
          </div>
        </div>
        <Link href={`/doa/delegations/${rule.id}`} className="text-sm text-gray-600 hover:text-gray-900">Cancel</Link>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}
            </div>
          )}

          <Section title="Identity & authority">
            <Field label="Name" required>
              <input type="text" value={state.name}
                onChange={e => set('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </Field>
            <Field label="Category" required>
              <div className="flex gap-2">
                {(['Financial', 'Non-Financial'] as DelegationCategory[]).map(c => (
                  <button key={c} type="button"
                    onClick={() => set('category', c)}
                    className={`px-4 py-2 text-sm rounded border ${state.category === c ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >{c}</button>
                ))}
              </div>
            </Field>
            <Field label="Authority type" required>
              <select value={(state.category === 'Financial' ? FINANCIAL_AUTHORITIES : NON_FINANCIAL_AUTHORITIES).includes(state.authorityType) ? state.authorityType : '__custom'}
                onChange={e => {
                  if (e.target.value === '__custom') return;
                  set('authorityType', e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                {(state.category === 'Financial' ? FINANCIAL_AUTHORITIES : NON_FINANCIAL_AUTHORITIES).map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
                <option value="__custom">Custom (type below)</option>
              </select>
              <input type="text" value={state.authorityType}
                onChange={e => set('authorityType', e.target.value)}
                placeholder="Authority type"
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </Field>
            <Field label="Description" required>
              <textarea rows={2} value={state.description}
                onChange={e => set('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </Field>
            <Field label="Justification" required>
              <textarea rows={3} value={state.justification}
                onChange={e => set('justification', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </Field>
          </Section>

          <Section title="Scope & threshold">
            {state.category === 'Financial' && (
              <div className="border border-gray-200 rounded p-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
                  <input type="checkbox" checked={state.scopeHasMonetaryCap}
                    onChange={e => set('scopeHasMonetaryCap', e.target.checked)} />
                  Monetary cap
                </label>
                {state.scopeHasMonetaryCap && (
                  <div className="grid grid-cols-3 gap-2">
                    <input type="text" inputMode="numeric" value={state.scopeMonetaryAmount}
                      onChange={e => set('scopeMonetaryAmount', e.target.value)}
                      placeholder="Amount"
                      className="col-span-2 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                    <select value={state.scopeCurrency}
                      onChange={e => set('scopeCurrency', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                      {['AED', 'USD', 'EUR', 'GBP', 'INR'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Percentage cap (optional)">
                <input type="text" inputMode="numeric" value={state.scopePercentageCap}
                  onChange={e => set('scopePercentageCap', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </Field>
              <Field label="Quantity cap (optional)">
                <input type="text" inputMode="numeric" value={state.scopeQuantityCap}
                  onChange={e => set('scopeQuantityCap', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </Field>
            </div>
            <MultiSelectField label="Regions" options={REGIONS}
              values={state.scope.regions ?? []}
              onChange={v => set('scope', { ...state.scope, regions: v })} />
            <MultiSelectField label="Functions" options={FUNCTIONS_LIST}
              values={state.scope.functions ?? []}
              onChange={v => set('scope', { ...state.scope, functions: v })} />
            <MultiSelectField label="Business units" options={BUSINESS_UNITS}
              values={state.scope.businessUnits ?? []}
              onChange={v => set('scope', { ...state.scope, businessUnits: v })} />
            <Field label="Notes">
              <textarea rows={2} value={state.scope.notes ?? ''}
                onChange={e => set('scope', { ...state.scope, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </Field>
          </Section>

          <Section title="Approval chain (runtime)">
            <ChainPicker chain={state.chain} onAdd={onChainAdd} onRemove={onChainRemove} onMove={onChainMove} />
          </Section>

          <Section title="Compliance links">
            <ComplianceLinksEditor links={state.complianceLinks} onChange={v => set('complianceLinks', v)} />
          </Section>

          <Section title="Lifecycle">
            <div className="grid grid-cols-3 gap-3">
              <Field label="Type">
                <select value={state.type}
                  onChange={e => set('type', e.target.value as DelegationLifecycleType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                  {LIFECYCLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Effective from">
                <input type="date" value={state.effectiveFrom}
                  onChange={e => set('effectiveFrom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </Field>
              <Field label="Effective to (optional)">
                <input type="date" value={state.effectiveTo}
                  onChange={e => set('effectiveTo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </Field>
            </div>
          </Section>

          <Section title="Approval authority (re-approval routing)">
            <Field label="Who would approve this rule (and any future critical changes)">
              <select value={state.approvalAuthorityUserId}
                onChange={e => set('approvalAuthorityUserId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                {mockUsers.filter(u => u.canApproveDelegations).map(u => (
                  <option key={u.id} value={u.id}>{u.name} · {u.role}</option>
                ))}
              </select>
            </Field>
          </Section>
        </div>

        <div className="space-y-3">
          <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
              <Activity className="w-4 h-4" />Proposed changes
            </h3>

            {!hasChanges && (
              <div className="text-xs text-gray-500 italic py-2">No changes yet.</div>
            )}

            {hasChanges && (
              <>
                <div className={`mb-3 p-2.5 rounded border text-xs ${
                  isCritical
                    ? 'bg-red-50 border-red-200 text-red-900'
                    : 'bg-green-50 border-green-200 text-green-900'
                }`}>
                  <div className="flex items-start gap-1.5 mb-1">
                    {isCritical
                      ? <AlertTriangle className="w-4 h-4 text-red-700 flex-shrink-0 mt-0.5" />
                      : <CheckCircle2 className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" />}
                    <strong>{isCritical ? 'Critical changes detected' : 'Non-critical changes only'}</strong>
                  </div>
                  <div className="ml-5">
                    {isCritical
                      ? <>Routes to <strong>{rule.approvalAuthorityUserName}</strong> ({rule.approvalAuthorityTitle}) for re-approval. Active rule keeps enforcing until then.</>
                      : <>Will auto-apply on submit. Chain designees will be notified. Version bumps to v{rule.version + 1}.</>}
                  </div>
                </div>

                <ul className="space-y-2 mb-3 max-h-64 overflow-y-auto">
                  {changes.map(c => {
                    const critical = (analysis?.criticalFields ?? []).includes(c.field);
                    return (
                      <li key={c.field} className="text-xs">
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${critical ? 'bg-red-500' : 'bg-green-500'}`} />
                          <span className="font-medium text-gray-900">{FIELD_LABELS[c.field] ?? c.field}</span>
                        </div>
                        <div className="ml-3 text-gray-600 text-[11px]">
                          <DiffValue value={c.oldValue} />
                          {' → '}
                          <DiffValue value={c.newValue} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}

            <button onClick={submit}
              disabled={!hasChanges}
              className={`w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded text-sm font-medium ${
                !hasChanges
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isCritical
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isCritical ? <Send className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {isCritical ? 'Submit for re-approval' : 'Apply changes'}
            </button>

            <Link href={`/doa/delegations/${rule.id}`}
              className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 text-gray-700">
              <X className="w-4 h-4" />Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, required = false, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-1.5">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      {children}
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
    return <span className="text-gray-900">{value.length} item{value.length === 1 ? '' : 's'}</span>;
  }
  if (typeof value === 'object') {
    const v = value as { amount?: number; currency?: string };
    if (typeof v.amount === 'number' && typeof v.currency === 'string') {
      return <span className="text-gray-900">{formatNumber(v.amount)} {v.currency}</span>;
    }
    return <span className="text-gray-900 italic">[object]</span>;
  }
  return null;
}
