'use client';

/**
 * Create Delegation — wizard with real persistence.
 * 6 steps: Authority → Scope & Threshold → Chain → Compliance → Justification & Lifecycle → Review.
 * Submit creates a DelegationRule in localStorage with full audit trail.
 */

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Check, ChevronRight, ChevronLeft, AlertTriangle, Info, Plus, Trash2,
  ArrowUp, ArrowDown, Search, ShieldCheck, FileText, ScrollText, Save,
} from 'lucide-react';
import { useCurrentUser } from '@/lib/doa/hooks/useCurrentUser';
import { mockUsers } from '@/lib/doa/data/mockUsers';
import {
  saveDelegationRule,
  generateDelegationRuleId,
  generateAuditEntryId,
} from '@/lib/doa/utils/delegation-rule-store';
import { suggestApprovalAuthority } from '@/lib/doa/utils/approver-suggester';
import { formatNumber, todayIsoDate } from '@/lib/doa/utils/format';
import type {
  ChainDesignee, ComplianceLink, DelegationCategory,
  DelegationLifecycleType, DelegationRule, DelegationScope,
} from '@/lib/doa/types/delegation-rule-types';

type StepNum = 1 | 2 | 3 | 4 | 5 | 6;

const FINANCIAL_AUTHORITIES = [
  'Salary Increase Approval',
  'Capital Expenditure Approval',
  'Purchase Order Approval',
  'Vendor Contract Approval',
  'Operating Expense Approval',
  'Budget Reallocation',
  'Discount Authority',
  'Investment Decision',
];

const NON_FINANCIAL_AUTHORITIES = [
  'Hiring Approval',
  'Termination Approval',
  'Leave Approval',
  'IT Privileged Access Grant',
  'Policy Exception Approval',
  'Travel Approval',
  'External Communications Approval',
  'Project Initiation',
];

const FRAMEWORKS = ['ISO 27001', 'SOC 2', 'ISO 27701', 'PCI DSS', 'GDPR', 'DPDP', 'Internal', 'Other'];
const LIFECYCLE_TYPES: DelegationLifecycleType[] = ['Permanent', 'Temporary', 'Project-Based', 'OOO'];
const REGIONS = ['North America', 'EMEA', 'APAC', 'LATAM', 'GCC'];
const FUNCTIONS_LIST = ['Finance', 'HR', 'IT', 'Security', 'Legal', 'Operations', 'Procurement', 'Compliance', 'Risk', 'Sales'];
const BUSINESS_UNITS = ['Corporate', 'North America', 'EMEA', 'APAC', 'LATAM'];

interface FormState {
  name: string;
  category: DelegationCategory;
  authorityType: string;
  customAuthorityType: string;
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

const initialForm = (): FormState => ({
  name: '',
  category: 'Financial',
  authorityType: '',
  customAuthorityType: '',
  description: '',
  justification: '',
  scope: { businessUnits: [], regions: [], functions: [], grades: [] },
  scopeHasMonetaryCap: true,
  scopeMonetaryAmount: '',
  scopeCurrency: 'AED',
  scopePercentageCap: '',
  scopeQuantityCap: '',
  chain: [],
  complianceLinks: [],
  type: 'Permanent',
  // Initial value is set in a client-only useEffect to avoid SSR/CSR mismatch.
  effectiveFrom: '',
  effectiveTo: '',
  approvalAuthorityUserId: '',
});

export default function NewDelegationPage() {
  const router = useRouter();
  const { user: currentUser } = useCurrentUser();
  const [step, setStep] = useState<StepNum>(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [approverOverridden, setApproverOverridden] = useState(false);

  // Set effective-from to today on the client only, after hydration.
  useEffect(() => {
    setForm(f => (f.effectiveFrom ? f : { ...f, effectiveFrom: todayIsoDate() }));
  }, []);

  // -- Computed scope from form -----------------------------------------
  const computedScope: DelegationScope = useMemo(() => {
    const s: DelegationScope = { ...form.scope };
    if (form.scopeHasMonetaryCap && form.scopeMonetaryAmount) {
      s.monetaryCap = {
        amount: Number(form.scopeMonetaryAmount.replace(/[, ]/g, '')) || 0,
        currency: form.scopeCurrency,
      };
    } else {
      delete s.monetaryCap;
    }
    if (form.scopePercentageCap) s.percentageCap = Number(form.scopePercentageCap);
    if (form.scopeQuantityCap) s.quantityCap = Number(form.scopeQuantityCap);
    return s;
  }, [form]);

  // -- Auto-suggest approval authority -----------------------------------
  const suggestion = useMemo(() => suggestApprovalAuthority({
    category: form.category,
    scope: computedScope,
    chain: form.chain,
    authorityType: form.authorityType || form.customAuthorityType,
  }), [form.category, computedScope, form.chain, form.authorityType, form.customAuthorityType]);

  useEffect(() => {
    if (!approverOverridden && suggestion.suggestedUserId) {
      setForm(f => ({ ...f, approvalAuthorityUserId: suggestion.suggestedUserId }));
    }
  }, [suggestion.suggestedUserId, approverOverridden]);

  if (!currentUser.canCreateDelegations) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-amber-200 rounded-lg p-8 text-center mt-12">
        <ShieldCheck className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-gray-900 mb-1">No permission to create delegations</h2>
        <p className="text-sm text-gray-600 mb-4">
          You are currently acting as <strong>{currentUser.name}</strong> ({currentUser.role}). Switch to a user
          with delegation-authoring capability (e.g., Priya Nair) using the user switcher in the top bar.
        </p>
        <Link href="/doa/delegations" className="inline-flex items-center text-sm text-amber-700 hover:underline">
          ← Back to delegations
        </Link>
      </div>
    );
  }

  // -- Step validation ---------------------------------------------------
  const validateStep = (s: StepNum): string | null => {
    if (s === 1) {
      if (!form.name.trim()) return 'Name is required.';
      const authority = form.authorityType === '__custom' ? form.customAuthorityType.trim() : form.authorityType;
      if (!authority) return 'Authority type is required.';
    }
    if (s === 2) {
      if (form.category === 'Financial' && form.scopeHasMonetaryCap && !form.scopeMonetaryAmount.trim()) {
        return 'Monetary cap is required for financial delegations (or uncheck the monetary cap option).';
      }
    }
    if (s === 3) {
      if (form.chain.length === 0) return 'At least one chain designee is required.';
    }
    if (s === 5) {
      if (!form.description.trim()) return 'Description is required.';
      if (!form.justification.trim()) return 'Justification is required.';
      if (!form.effectiveFrom) return 'Effective-from date is required.';
    }
    if (s === 6) {
      if (!form.approvalAuthorityUserId) return 'Approval authority must be selected.';
    }
    return null;
  };

  const goNext = () => {
    const err = validateStep(step);
    if (err) { setError(err); return; }
    setError(null);
    if (step < 6) setStep((step + 1) as StepNum);
  };
  const goBack = () => { setError(null); if (step > 1) setStep((step - 1) as StepNum); };

  // -- Build & submit ----------------------------------------------------
  const buildRule = (status: 'Draft' | 'PendingApproval'): DelegationRule => {
    const authority = mockUsers.find(u => u.id === form.approvalAuthorityUserId);
    const finalAuthority = form.authorityType === '__custom' ? form.customAuthorityType : form.authorityType;
    const now = new Date().toISOString();
    const id = generateDelegationRuleId();
    const baseAudit = [{
      id: generateAuditEntryId(),
      timestamp: now,
      actorUserId: currentUser.id,
      actorUserName: currentUser.name,
      action: 'Created' as const,
    }];
    const submitAudit = status === 'PendingApproval' ? [
      ...baseAudit,
      { id: generateAuditEntryId(), timestamp: now, actorUserId: currentUser.id, actorUserName: currentUser.name, action: 'Submitted' as const, comment: 'Submitted for approval.' },
      ...(form.chain.length > 0 ? [{
        id: generateAuditEntryId(), timestamp: now, actorUserId: currentUser.id, actorUserName: currentUser.name, action: 'Notified' as const,
        comment: `Chain designees notified: ${form.chain.map(c => c.userName).join(', ')}.`,
      }] : []),
    ] : baseAudit;

    return {
      id, version: 1,
      name: form.name.trim(),
      category: form.category,
      authorityType: finalAuthority.trim(),
      description: form.description.trim(),
      justification: form.justification.trim(),
      scope: computedScope,
      chain: form.chain,
      complianceLinks: form.complianceLinks,
      type: form.type,
      effectiveFrom: new Date(form.effectiveFrom).toISOString(),
      effectiveTo: form.effectiveTo ? new Date(form.effectiveTo).toISOString() : undefined,
      status,
      createdByUserId: currentUser.id,
      createdByUserName: currentUser.name,
      createdAt: now,
      approvalAuthorityUserId: form.approvalAuthorityUserId,
      approvalAuthorityUserName: authority?.name ?? '',
      approvalAuthorityTitle: authority?.role ?? '',
      approvalAuthoritySuggestionRationale: suggestion.rationale,
      submittedAt: status === 'PendingApproval' ? now : undefined,
      auditTrail: submitAudit,
    };
  };

  const saveDraft = () => {
    const err = validateStep(1);
    if (err) { setError(err); return; }
    const rule = buildRule('Draft');
    saveDelegationRule(rule);
    router.push(`/doa/delegations/${rule.id}`);
  };
  const submit = () => {
    for (const s of [1, 2, 3, 5, 6] as StepNum[]) {
      const err = validateStep(s);
      if (err) { setError(err); setStep(s); return; }
    }
    const rule = buildRule('PendingApproval');
    saveDelegationRule(rule);
    router.push(`/doa/delegations/${rule.id}`);
  };

  // -- Chain helpers -----------------------------------------------------
  const addChainMember = (userId: string) => {
    const u = mockUsers.find(x => x.id === userId);
    if (!u || form.chain.some(c => c.userId === userId)) return;
    const position = form.chain.length + 1;
    setForm(f => ({
      ...f,
      chain: [...f.chain, { userId: u.id, userName: u.name, userTitle: u.role, position, label: `L${position}` }],
    }));
  };
  const removeChainMember = (userId: string) => {
    setForm(f => ({
      ...f,
      chain: f.chain.filter(c => c.userId !== userId).map((c, i) => ({ ...c, position: i + 1, label: `L${i + 1}` })),
    }));
  };
  const moveChain = (userId: string, dir: -1 | 1) => {
    setForm(f => {
      const i = f.chain.findIndex(c => c.userId === userId);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= f.chain.length) return f;
      const next = [...f.chain];
      [next[i], next[j]] = [next[j], next[i]];
      return { ...f, chain: next.map((c, k) => ({ ...c, position: k + 1, label: `L${k + 1}` })) };
    });
  };

  const steps = [
    { n: 1, label: 'Authority' },
    { n: 2, label: 'Scope & Threshold' },
    { n: 3, label: 'Approval Chain' },
    { n: 4, label: 'Compliance Link' },
    { n: 5, label: 'Justification & Lifecycle' },
    { n: 6, label: 'Review & Submit' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">New Delegation Rule</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Authoring as <span className="font-medium text-gray-700">{currentUser.name}</span> · {currentUser.role}
          </p>
        </div>
        <Link href="/doa/delegations" className="text-sm text-gray-600 hover:text-gray-900">Cancel</Link>
      </div>

      {/* Stepper */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          {steps.map((s, idx) => (
            <React.Fragment key={s.n}>
              <button
                onClick={() => setStep(s.n)}
                className="flex items-center gap-2"
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  s.n < step ? 'bg-green-500 text-white' :
                  s.n === step ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {s.n < step ? <Check className="w-4 h-4" /> : s.n}
                </div>
                <span className={`text-xs ${s.n === step ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>{s.label}</span>
              </button>
              {idx < steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6">
        <div className="flex gap-6 max-w-7xl mx-auto">
          {/* Form */}
          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}
              </div>
            )}

            {/* Step 1 — Authority */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-base font-semibold text-gray-900">What authority is being delegated?</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Name<span className="text-red-500">*</span></label>
                  <input
                    type="text" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Salary Increase Approval — up to 10%"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Category<span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    {(['Financial', 'Non-Financial'] as DelegationCategory[]).map(c => (
                      <button
                        key={c}
                        onClick={() => setForm(f => ({ ...f, category: c, authorityType: '' }))}
                        className={`px-4 py-2 text-sm rounded border ${form.category === c ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Authority type<span className="text-red-500">*</span></label>
                  <select
                    value={form.authorityType}
                    onChange={e => setForm(f => ({ ...f, authorityType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="">— Pick an authority —</option>
                    {(form.category === 'Financial' ? FINANCIAL_AUTHORITIES : NON_FINANCIAL_AUTHORITIES).map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                    <option value="__custom">Custom (specify)</option>
                  </select>
                  {form.authorityType === '__custom' && (
                    <input
                      type="text" value={form.customAuthorityType}
                      onChange={e => setForm(f => ({ ...f, customAuthorityType: e.target.value }))}
                      placeholder="Custom authority type"
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Step 2 — Scope */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-base font-semibold text-gray-900">Scope &amp; threshold</h2>

                {form.category === 'Financial' && (
                  <div className="border border-gray-200 rounded p-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
                      <input type="checkbox" checked={form.scopeHasMonetaryCap}
                        onChange={e => setForm(f => ({ ...f, scopeHasMonetaryCap: e.target.checked }))} />
                      Monetary cap
                    </label>
                    {form.scopeHasMonetaryCap && (
                      <div className="grid grid-cols-3 gap-2">
                        <input type="text" inputMode="numeric" value={form.scopeMonetaryAmount}
                          onChange={e => setForm(f => ({ ...f, scopeMonetaryAmount: e.target.value }))}
                          placeholder="Amount" className="col-span-2 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                        <select value={form.scopeCurrency}
                          onChange={e => setForm(f => ({ ...f, scopeCurrency: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                          {['AED', 'USD', 'EUR', 'GBP', 'INR'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Percentage cap (optional)</label>
                    <input type="text" inputMode="numeric" value={form.scopePercentageCap}
                      onChange={e => setForm(f => ({ ...f, scopePercentageCap: e.target.value }))}
                      placeholder="e.g. 10" className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Quantity cap (optional)</label>
                    <input type="text" inputMode="numeric" value={form.scopeQuantityCap}
                      onChange={e => setForm(f => ({ ...f, scopeQuantityCap: e.target.value }))}
                      placeholder="e.g. 30 (days)" className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                  </div>
                </div>

                <MultiSelectField label="Regions" options={REGIONS}
                  values={form.scope.regions ?? []}
                  onChange={v => setForm(f => ({ ...f, scope: { ...f.scope, regions: v } }))} />
                <MultiSelectField label="Functions" options={FUNCTIONS_LIST}
                  values={form.scope.functions ?? []}
                  onChange={v => setForm(f => ({ ...f, scope: { ...f.scope, functions: v } }))} />
                <MultiSelectField label="Business units" options={BUSINESS_UNITS}
                  values={form.scope.businessUnits ?? []}
                  onChange={v => setForm(f => ({ ...f, scope: { ...f.scope, businessUnits: v } }))} />

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Notes (optional)</label>
                  <textarea rows={2} value={form.scope.notes ?? ''}
                    onChange={e => setForm(f => ({ ...f, scope: { ...f.scope, notes: e.target.value } }))}
                    placeholder="Any scope qualifiers, exclusions, or measurement details."
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>
              </div>
            )}

            {/* Step 3 — Chain */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Approval chain</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    These are the designees who'll approve matching <em>runtime</em> requests once the rule is active.
                    They will be <strong>notified</strong> when this rule is submitted — they do not gate the rule's approval.
                  </p>
                </div>

                <ChainPicker chain={form.chain} onAdd={addChainMember} onRemove={removeChainMember} onMove={moveChain} />
              </div>
            )}

            {/* Step 4 — Compliance */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Compliance linkage</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Link this delegation to one or more controls, policies, or regulations. Optional, but recommended for audit traceability.
                  </p>
                </div>

                <ComplianceLinksEditor
                  links={form.complianceLinks}
                  onChange={links => setForm(f => ({ ...f, complianceLinks: links }))}
                />
              </div>
            )}

            {/* Step 5 — Justification & Lifecycle */}
            {step === 5 && (
              <div className="space-y-5">
                <h2 className="text-base font-semibold text-gray-900">Justification &amp; lifecycle</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Description<span className="text-red-500">*</span></label>
                  <textarea rows={2} value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="What is being delegated, and to whom does the rule apply?"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Business justification<span className="text-red-500">*</span></label>
                  <textarea rows={3} value={form.justification}
                    onChange={e => setForm(f => ({ ...f, justification: e.target.value }))}
                    placeholder="Why is this delegation needed? What problem does it solve?"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Type</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as DelegationLifecycleType }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                      {LIFECYCLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Effective from<span className="text-red-500">*</span></label>
                    <input type="date" value={form.effectiveFrom}
                      onChange={e => setForm(f => ({ ...f, effectiveFrom: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Effective to (optional)</label>
                    <input type="date" value={form.effectiveTo}
                      onChange={e => setForm(f => ({ ...f, effectiveTo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 6 — Review */}
            {step === 6 && (
              <div className="space-y-5">
                <h2 className="text-base font-semibold text-gray-900">Review &amp; submit</h2>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded text-sm">
                  <div className="flex items-start gap-2 mb-2">
                    <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div className="font-semibold text-amber-900">Suggested approval authority</div>
                  </div>
                  <p className="text-xs text-amber-800 mb-3 ml-6">{suggestion.rationale}</p>

                  <div className="ml-6">
                    <label className="block text-xs font-medium text-amber-900 mb-1">Approve this rule</label>
                    <select
                      value={form.approvalAuthorityUserId}
                      onChange={e => { setForm(f => ({ ...f, approvalAuthorityUserId: e.target.value })); setApproverOverridden(true); }}
                      className="w-full px-3 py-2 border border-amber-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      {mockUsers.filter(u => u.canApproveDelegations).map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} · {u.role} {u.id === suggestion.suggestedUserId ? '(suggested)' : ''}
                        </option>
                      ))}
                    </select>
                    {approverOverridden && form.approvalAuthorityUserId !== suggestion.suggestedUserId && (
                      <p className="mt-1.5 text-xs text-amber-700">Suggestion overridden. Reason will be saved in the audit trail.</p>
                    )}
                  </div>
                </div>

                <ReviewSummary form={form} computedScope={computedScope} />
              </div>
            )}

            {/* Buttons */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex gap-2">
                <button onClick={saveDraft}
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  <Save className="w-4 h-4" />Save draft
                </button>
              </div>
              <div className="flex gap-2">
                {step > 1 && (
                  <button onClick={goBack} className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    <ChevronLeft className="w-4 h-4" />Back
                  </button>
                )}
                {step < 6 && (
                  <button onClick={goNext} className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded text-sm hover:bg-amber-600">
                    Next<ChevronRight className="w-4 h-4" />
                  </button>
                )}
                {step === 6 && (
                  <button onClick={submit} className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded text-sm font-medium hover:bg-amber-600">
                    Submit for approval
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Live preview */}
          <div className="w-80 flex-shrink-0 space-y-3">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />Live preview
              </h3>
              <div className="space-y-1.5 text-xs">
                <PreviewRow label="Name" value={form.name || '—'} />
                <PreviewRow label="Category" value={form.category} />
                <PreviewRow label="Authority" value={
                  (form.authorityType === '__custom' ? form.customAuthorityType : form.authorityType) || '—'
                } />
                <PreviewRow label="Cap" value={
                  computedScope.monetaryCap
                    ? `${formatNumber(computedScope.monetaryCap.amount)} ${computedScope.monetaryCap.currency}`
                    : form.scopePercentageCap ? `${form.scopePercentageCap}%`
                    : form.scopeQuantityCap ? `${form.scopeQuantityCap} units`
                    : '—'
                } />
                <PreviewRow label="Chain" value={
                  form.chain.length === 0
                    ? '—'
                    : form.chain.map(c => `${c.label}: ${c.userName}`).join(' → ')
                } />
                <PreviewRow label="Compliance links" value={
                  form.complianceLinks.length === 0
                    ? '—'
                    : `${form.complianceLinks.length} linked`
                } />
                <PreviewRow label="Type" value={form.type} />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                <ScrollText className="w-4 h-4" />Approval routing
              </h3>
              {form.approvalAuthorityUserId ? (() => {
                const u = mockUsers.find(x => x.id === form.approvalAuthorityUserId);
                return (
                  <div className="text-xs">
                    <div className="text-gray-700">Rule activates after approval by:</div>
                    <div className="mt-1 px-2.5 py-2 bg-gray-50 border border-gray-200 rounded">
                      <div className="font-medium text-gray-900">{u?.name}</div>
                      <div className="text-gray-500">{u?.role}</div>
                    </div>
                  </div>
                ) ;
              })() : (
                <p className="text-xs text-gray-500">Filling in the suggested approver…</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Sub-components (kept in same file for proximity)
// ============================================================================

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-2">
      <span className="text-gray-500 flex-shrink-0">{label}:</span>
      <span className="text-gray-900 text-right break-words">{value}</span>
    </div>
  );
}

function MultiSelectField({
  label, options, values, onChange,
}: { label: string; options: string[]; values: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => {
    onChange(values.includes(opt) ? values.filter(v => v !== opt) : [...values, opt]);
  };
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={`px-2.5 py-1 text-xs rounded-full border ${
              values.includes(opt)
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChainPicker({
  chain, onAdd, onRemove, onMove,
}: {
  chain: ChainDesignee[];
  onAdd: (userId: string) => void;
  onRemove: (userId: string) => void;
  onMove: (userId: string, dir: -1 | 1) => void;
}) {
  const [query, setQuery] = useState('');
  const filtered = mockUsers.filter(u =>
    !chain.some(c => c.userId === u.id) &&
    u.isActive &&
    (`${u.name} ${u.role} ${u.department}`.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 8);

  return (
    <div className="space-y-3">
      {/* Selected chain */}
      <div className="space-y-2">
        {chain.length === 0 && (
          <div className="text-xs text-gray-500 italic py-4 text-center border border-dashed border-gray-300 rounded">
            No chain designees yet. Add at least one below.
          </div>
        )}
        {chain.map((c, idx) => (
          <div key={c.userId} className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded">
            <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {c.position}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{c.userName}</div>
              <div className="text-xs text-gray-600 truncate">{c.userTitle} · {c.label}</div>
            </div>
            <button onClick={() => onMove(c.userId, -1)} disabled={idx === 0}
              className="p-1 hover:bg-amber-100 rounded disabled:opacity-30 disabled:cursor-not-allowed">
              <ArrowUp className="w-4 h-4 text-gray-700" />
            </button>
            <button onClick={() => onMove(c.userId, 1)} disabled={idx === chain.length - 1}
              className="p-1 hover:bg-amber-100 rounded disabled:opacity-30 disabled:cursor-not-allowed">
              <ArrowDown className="w-4 h-4 text-gray-700" />
            </button>
            <button onClick={() => onRemove(c.userId)} className="p-1 hover:bg-red-100 rounded">
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        ))}
      </div>

      {/* Picker */}
      <div className="border border-gray-200 rounded p-3">
        <div className="text-xs font-medium text-gray-700 mb-2">Add designee</div>
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, title, or department"
            className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {filtered.map(u => (
            <button
              key={u.id}
              onClick={() => onAdd(u.id)}
              className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded text-left"
            >
              <Plus className="w-3.5 h-3.5 text-gray-400" />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-900 truncate">{u.name}</div>
                <div className="text-xs text-gray-500 truncate">{u.role} · {u.department}</div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-xs text-gray-500 italic py-2 text-center">No matches.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ComplianceLinksEditor({
  links, onChange,
}: { links: ComplianceLink[]; onChange: (l: ComplianceLink[]) => void }) {
  const [draft, setDraft] = useState<ComplianceLink>({
    framework: 'ISO 27001', controlCode: '', controlName: '', rationale: '',
  });
  const addLink = () => {
    if (!draft.controlCode.trim() || !draft.controlName.trim()) return;
    onChange([...links, { ...draft }]);
    setDraft({ framework: draft.framework, controlCode: '', controlName: '', rationale: '' });
  };
  const removeLink = (idx: number) => onChange(links.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      {/* Existing links */}
      <div className="space-y-2">
        {links.length === 0 && (
          <div className="text-xs text-gray-500 italic py-4 text-center border border-dashed border-gray-300 rounded">
            No compliance links yet.
          </div>
        )}
        {links.map((l, idx) => (
          <div key={idx} className="flex items-start gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded">
            <ShieldCheck className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">
                <span className="text-blue-700">{l.framework}</span> · {l.controlCode} — {l.controlName}
              </div>
              {l.rationale && <div className="text-xs text-gray-600 mt-0.5">{l.rationale}</div>}
            </div>
            <button onClick={() => removeLink(idx)} className="p-1 hover:bg-red-100 rounded">
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        ))}
      </div>

      {/* Add new */}
      <div className="border border-gray-200 rounded p-3 space-y-2">
        <div className="text-xs font-medium text-gray-700">Add a compliance link</div>
        <div className="grid grid-cols-3 gap-2">
          <select value={draft.framework}
            onChange={e => setDraft(d => ({ ...d, framework: e.target.value }))}
            className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
            {FRAMEWORKS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <input value={draft.controlCode}
            onChange={e => setDraft(d => ({ ...d, controlCode: e.target.value }))}
            placeholder="Code (e.g. A.9.1)"
            className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          <input value={draft.controlName}
            onChange={e => setDraft(d => ({ ...d, controlName: e.target.value }))}
            placeholder="Control name"
            className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>
        <textarea rows={2} value={draft.rationale}
          onChange={e => setDraft(d => ({ ...d, rationale: e.target.value }))}
          placeholder="Why is this delegation linked to this control? (optional)"
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
        <button onClick={addLink}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white rounded text-sm hover:bg-amber-600">
          <Plus className="w-4 h-4" />Add link
        </button>
      </div>
    </div>
  );
}

function ReviewSummary({ form, computedScope }: { form: FormState; computedScope: DelegationScope }) {
  return (
    <div className="space-y-3 text-sm">
      <SummarySection title="Authority">
        <SumRow label="Name" value={form.name} />
        <SumRow label="Category" value={form.category} />
        <SumRow label="Type" value={form.authorityType === '__custom' ? form.customAuthorityType : form.authorityType} />
      </SummarySection>
      <SummarySection title="Scope & threshold">
        {computedScope.monetaryCap && (
          <SumRow label="Monetary cap" value={`${formatNumber(computedScope.monetaryCap.amount)} ${computedScope.monetaryCap.currency}`} />
        )}
        {computedScope.percentageCap !== undefined && <SumRow label="Percentage cap" value={`${computedScope.percentageCap}%`} />}
        {computedScope.quantityCap !== undefined && <SumRow label="Quantity cap" value={String(computedScope.quantityCap)} />}
        {(computedScope.regions ?? []).length > 0 && <SumRow label="Regions" value={computedScope.regions!.join(', ')} />}
        {(computedScope.functions ?? []).length > 0 && <SumRow label="Functions" value={computedScope.functions!.join(', ')} />}
        {(computedScope.businessUnits ?? []).length > 0 && <SumRow label="Business units" value={computedScope.businessUnits!.join(', ')} />}
      </SummarySection>
      <SummarySection title="Approval chain (runtime)">
        {form.chain.map(c => (
          <SumRow key={c.userId} label={c.label} value={`${c.userName} · ${c.userTitle}`} />
        ))}
      </SummarySection>
      <SummarySection title="Compliance">
        {form.complianceLinks.length === 0 && <p className="text-xs text-gray-500">None.</p>}
        {form.complianceLinks.map((l, idx) => (
          <SumRow key={idx} label={l.framework} value={`${l.controlCode} — ${l.controlName}`} />
        ))}
      </SummarySection>
      <SummarySection title="Lifecycle">
        <SumRow label="Type" value={form.type} />
        <SumRow label="Effective from" value={form.effectiveFrom} />
        {form.effectiveTo && <SumRow label="Effective to" value={form.effectiveTo} />}
      </SummarySection>
      <SummarySection title="Justification">
        <p className="text-xs text-gray-700">{form.justification}</p>
      </SummarySection>
    </div>
  );
}

function SummarySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-200 rounded p-3">
      <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function SumRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-3 text-xs">
      <span className="text-gray-500 flex-shrink-0">{label}:</span>
      <span className="text-gray-900 text-right break-words">{value}</span>
    </div>
  );
}
