'use client';

/**
 * Submit Approval Request — runtime form.
 *
 * The primary flow: search for an Active delegation rule by name (tabular
 * picker), then fill in request details. The picked rule's caps validate
 * the amounts as the user types; a right-side sticky panel shows the picked
 * rule + cap utilization + routing chain.
 */

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Send, AlertTriangle, CheckCircle2, ShieldCheck, Users, Search, X,
} from 'lucide-react';
import { useCurrentUser } from '@/lib/doa/hooks/useCurrentUser';
import { listDelegationRules } from '@/lib/doa/utils/delegation-rule-store';
import { validateAgainstRule } from '@/lib/doa/utils/rule-matcher';
import { saveDelegationRequest, generateRequestId } from '@/lib/doa/utils/request-store';
import { formatNumber } from '@/lib/doa/utils/format';
import type { DelegationRequest } from '@/lib/doa/types/request-types';
import type { DelegationRule } from '@/lib/doa/types/delegation-rule-types';

interface FormState {
  selectedRuleId: string;
  title: string;
  description: string;
  justification: string;
  monetaryAmount: string;
  currency: string;
  percentageAmount: string;
  quantityAmount: string;
  affectedEntity: string;
  region: string;
  businessUnit: string;
}

const REGIONS = ['', 'North America', 'EMEA', 'APAC', 'LATAM', 'GCC'];
const BUSINESS_UNITS = ['', 'Corporate', 'North America', 'EMEA', 'APAC', 'LATAM'];

const initialForm = (): FormState => ({
  selectedRuleId: '',
  title: '',
  description: '',
  justification: '',
  monetaryAmount: '',
  currency: 'AED',
  percentageAmount: '',
  quantityAmount: '',
  affectedEntity: '',
  region: '',
  businessUnit: '',
});

export default function NewRequestPage() {
  const router = useRouter();
  const { user: currentUser } = useCurrentUser();
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [rules, setRules] = useState<DelegationRule[]>([]);

  useEffect(() => {
    setRules(listDelegationRules());
  }, []);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm(f => ({ ...f, [k]: v }));

  const selectedRule = useMemo(
    () => rules.find(r => r.id === form.selectedRuleId),
    [rules, form.selectedRuleId],
  );

  // Use selected rule's currency for the amount input when picked.
  useEffect(() => {
    if (selectedRule?.scope.monetaryCap) {
      setForm(f => ({ ...f, currency: selectedRule.scope.monetaryCap!.currency }));
    }
  }, [selectedRule?.id, selectedRule?.scope.monetaryCap]);

  const validation = useMemo(() => {
    if (!selectedRule) return undefined;
    return validateAgainstRule(selectedRule, {
      authorityType: selectedRule.authorityType,
      monetaryAmount: form.monetaryAmount ? Number(form.monetaryAmount.replace(/[, ]/g, '')) : undefined,
      currency: form.currency,
      percentageAmount: form.percentageAmount ? Number(form.percentageAmount) : undefined,
      quantityAmount: form.quantityAmount ? Number(form.quantityAmount) : undefined,
      region: form.region || undefined,
      businessUnit: form.businessUnit || undefined,
    });
  }, [selectedRule, form]);

  const canSubmit =
    !!selectedRule &&
    !!validation?.ok &&
    form.title.trim() !== '' &&
    form.description.trim() !== '' &&
    form.justification.trim() !== '';

  const submit = () => {
    if (!selectedRule) { setError('Pick a delegation rule first.'); return; }
    if (!validation?.ok) { setError(`Request does not fit the picked rule: ${validation?.reason}.`); return; }
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.description.trim()) { setError('Description is required.'); return; }
    if (!form.justification.trim()) { setError('Justification is required.'); return; }

    const id = generateRequestId();
    const now = new Date().toISOString();
    const req: DelegationRequest = {
      id,
      title: form.title.trim(),
      authorityType: selectedRule.authorityType,
      description: form.description.trim(),
      justification: form.justification.trim(),
      monetaryAmount: form.monetaryAmount ? Number(form.monetaryAmount.replace(/[, ]/g, '')) : undefined,
      currency: form.monetaryAmount ? form.currency : undefined,
      percentageAmount: form.percentageAmount ? Number(form.percentageAmount) : undefined,
      quantityAmount: form.quantityAmount ? Number(form.quantityAmount) : undefined,
      affectedEntity: form.affectedEntity.trim() || undefined,
      region: form.region || undefined,
      businessUnit: form.businessUnit || undefined,
      matchedRuleId: selectedRule.id,
      matchedRuleName: selectedRule.name,
      matchedRuleVersion: selectedRule.version,
      matchedRuleChain: selectedRule.chain,
      status: 'PendingDecision',
      currentStepIndex: 0,
      stepActions: [],
      requestedByUserId: currentUser.id,
      requestedByUserName: currentUser.name,
      requestedAt: now,
    };
    saveDelegationRequest(req);
    router.push(`/doa/requests/${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Link href="/doa/requests" className="p-2 hover:bg-gray-100 rounded">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Submit approval request</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Requesting as <span className="font-medium text-gray-700">{currentUser.name}</span> · {currentUser.role}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Form */}
        <div className="col-span-2 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}
            </div>
          )}

          <Section title="Pick a delegation rule">
            <DelegationPicker
              rules={rules}
              selectedRuleId={form.selectedRuleId}
              onSelect={id => set('selectedRuleId', id)}
            />
          </Section>

          <Section title="Request details">
            <Field label="Title" required>
              <input type="text" value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="e.g. Pay hike: Sanjana Iyer, 8%"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </Field>
            <Field label="Description" required>
              <textarea rows={2} value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="What is being requested?"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </Field>
            <Field label="Justification" required>
              <textarea rows={3} value={form.justification}
                onChange={e => set('justification', e.target.value)}
                placeholder="Why is this needed? Provide business context."
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </Field>
          </Section>

          <Section title="Quantitative parameters">
            {!selectedRule && (
              <p className="text-xs text-gray-500 italic">Pick a delegation rule above; this section will indicate which parameters that rule caps.</p>
            )}
            {selectedRule && (
              <p className="text-xs text-gray-500">
                <strong>Picked rule caps:</strong>{' '}
                {selectedRule.scope.monetaryCap ? `${formatNumber(selectedRule.scope.monetaryCap.amount)} ${selectedRule.scope.monetaryCap.currency}` : '—'}
                {selectedRule.scope.percentageCap !== undefined && ` · ${selectedRule.scope.percentageCap}%`}
                {selectedRule.scope.quantityCap !== undefined && ` · ${selectedRule.scope.quantityCap} units`}
              </p>
            )}
            <div className="grid grid-cols-3 gap-3">
              <Field label="Monetary amount">
                <input type="text" inputMode="numeric" value={form.monetaryAmount}
                  onChange={e => set('monetaryAmount', e.target.value)}
                  placeholder={selectedRule?.scope.monetaryCap ? `≤ ${formatNumber(selectedRule.scope.monetaryCap.amount)}` : 'e.g. 80000'}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </Field>
              <Field label="Currency">
                <select value={form.currency}
                  onChange={e => set('currency', e.target.value)}
                  disabled={!!selectedRule?.scope.monetaryCap}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-50">
                  {['AED', 'USD', 'EUR', 'GBP', 'INR'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Percentage">
                <input type="text" inputMode="numeric" value={form.percentageAmount}
                  onChange={e => set('percentageAmount', e.target.value)}
                  placeholder={selectedRule?.scope.percentageCap !== undefined ? `≤ ${selectedRule.scope.percentageCap}` : 'e.g. 8'}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </Field>
            </div>
            <Field label="Quantity (e.g. days for leave)">
              <input type="text" inputMode="numeric" value={form.quantityAmount}
                onChange={e => set('quantityAmount', e.target.value)}
                placeholder={selectedRule?.scope.quantityCap !== undefined ? `≤ ${selectedRule.scope.quantityCap}` : 'e.g. 14'}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </Field>
          </Section>

          <Section title="Context (optional)">
            <Field label="Affected entity">
              <input type="text" value={form.affectedEntity}
                onChange={e => set('affectedEntity', e.target.value)}
                placeholder="Person, project, or vendor this request relates to"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Region">
                <select value={form.region}
                  onChange={e => set('region', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                  {REGIONS.map(r => <option key={r} value={r}>{r || '— None —'}</option>)}
                </select>
              </Field>
              <Field label="Business unit">
                <select value={form.businessUnit}
                  onChange={e => set('businessUnit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                  {BUSINESS_UNITS.map(b => <option key={b} value={b}>{b || '— None —'}</option>)}
                </select>
              </Field>
            </div>
          </Section>
        </div>

        {/* Sticky right panel */}
        <div className="space-y-3">
          <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />Routing
            </h3>

            {!selectedRule && (
              <div className="text-xs text-gray-500 italic py-2">
                Pick a delegation rule from the table to see routing.
              </div>
            )}

            {selectedRule && (
              <PickedRulePanel rule={selectedRule} input={form} validation={validation} />
            )}

            <button onClick={submit} disabled={!canSubmit}
              className={`mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded text-sm font-medium ${
                canSubmit ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}>
              <Send className="w-4 h-4" />Submit request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// Delegation picker — tabular search
// ===========================================================================

function DelegationPicker({
  rules, selectedRuleId, onSelect,
}: {
  rules: DelegationRule[];
  selectedRuleId: string;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState('');

  // Eligible: Active or PendingModification (the v-current keeps enforcing).
  const eligible = useMemo(
    () => rules.filter(r => r.status === 'Active' || r.status === 'PendingModification'),
    [rules],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return eligible;
    const q = query.toLowerCase();
    return eligible.filter(r => {
      const haystack = `${r.name} ${r.authorityType} ${r.category} ${r.description}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [eligible, query]);

  const selected = rules.find(r => r.id === selectedRuleId);

  return (
    <div className="space-y-3">
      {/* Search box */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name, authority type, category…"
          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      {/* Selection banner */}
      {selected && (
        <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-300 rounded">
          <CheckCircle2 className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900">Selected: {selected.name}</div>
            <div className="text-xs text-gray-600">{selected.authorityType} · {selected.category} · v{selected.version}</div>
          </div>
          <button type="button" onClick={() => onSelect('')}
            className="p-1 hover:bg-amber-100 rounded">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}

      {/* Tabular results */}
      <div className="border border-gray-200 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Name</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700 hidden md:table-cell">Category</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Threshold</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700 hidden lg:table-cell">Chain</th>
              <th className="px-3 py-2 text-right font-medium text-gray-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-xs text-gray-500 italic">
                  No delegation rules match your search.
                </td>
              </tr>
            )}
            {filtered.map(rule => {
              const isSelected = rule.id === selectedRuleId;
              const thresholdParts: string[] = [];
              if (rule.scope.monetaryCap) thresholdParts.push(`${formatNumber(rule.scope.monetaryCap.amount)} ${rule.scope.monetaryCap.currency}`);
              if (rule.scope.percentageCap !== undefined) thresholdParts.push(`${rule.scope.percentageCap}%`);
              if (rule.scope.quantityCap !== undefined) thresholdParts.push(`${rule.scope.quantityCap}`);
              const threshold = thresholdParts.length ? thresholdParts.join(' · ') : '—';
              const chainStr = rule.chain.length > 0 ? rule.chain.map(c => c.userName.split(' ')[0]).join(' → ') : '—';

              return (
                <tr
                  key={rule.id}
                  onClick={() => onSelect(rule.id)}
                  className={`cursor-pointer transition-colors ${isSelected ? 'bg-amber-50' : 'hover:bg-gray-50'}`}
                >
                  <td className="px-3 py-2.5">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{rule.name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{rule.authorityType}</div>
                  </td>
                  <td className="px-3 py-2.5 hidden md:table-cell">
                    <span className={`inline-block px-1.5 py-0.5 text-[10px] font-medium rounded ${
                      rule.category === 'Financial' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'
                    }`}>{rule.category}</span>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-gray-700">{threshold}</td>
                  <td className="px-3 py-2.5 text-xs text-gray-600 hidden lg:table-cell truncate max-w-xs">{chainStr}</td>
                  <td className="px-3 py-2.5 text-right">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />Selected
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Click to select</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500">
        Showing {filtered.length} of {eligible.length} Active rule{eligible.length === 1 ? '' : 's'}.
      </p>
    </div>
  );
}

// ===========================================================================
// Routing panel — shown once a rule is picked
// ===========================================================================

function PickedRulePanel({
  rule, input, validation,
}: {
  rule: DelegationRule;
  input: FormState;
  validation: { ok: boolean; reason: string } | undefined;
}) {
  const utilization = (() => {
    if (input.monetaryAmount && rule.scope.monetaryCap) {
      const used = Number(input.monetaryAmount.replace(/[, ]/g, ''));
      return Math.min(100, Math.round((used / rule.scope.monetaryCap.amount) * 100));
    }
    if (input.percentageAmount && rule.scope.percentageCap !== undefined) {
      return Math.min(100, Math.round((Number(input.percentageAmount) / rule.scope.percentageCap) * 100));
    }
    if (input.quantityAmount && rule.scope.quantityCap !== undefined) {
      return Math.min(100, Math.round((Number(input.quantityAmount) / rule.scope.quantityCap) * 100));
    }
    return undefined;
  })();

  return (
    <>
      <div className={`p-2.5 rounded border text-xs ${
        validation?.ok
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-start gap-1.5 mb-1">
          {validation?.ok
            ? <CheckCircle2 className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" />
            : <AlertTriangle className="w-4 h-4 text-red-700 flex-shrink-0 mt-0.5" />}
          <strong className={validation?.ok ? 'text-green-900' : 'text-red-900'}>
            {validation?.ok ? 'Fits this rule' : 'Does not fit'}
          </strong>
        </div>
        <Link href={`/doa/delegations/${rule.id}`}
          className="block ml-5 text-sm font-medium text-gray-900 hover:underline">{rule.name}</Link>
        <div className="ml-5 text-[11px] text-gray-700 mt-0.5">v{rule.version} · {rule.category}</div>
        {!validation?.ok && (
          <div className="ml-5 mt-1.5 text-[11px] text-red-800">{validation?.reason}</div>
        )}
      </div>

      {utilization !== undefined && validation?.ok && (
        <div className="mt-3">
          <div className="flex items-baseline justify-between text-xs mb-1">
            <span className="text-gray-700">Cap utilization</span>
            <span className="font-semibold text-gray-900">{utilization}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className={`h-full rounded-full ${utilization >= 80 ? 'bg-amber-500' : 'bg-green-500'}`}
              style={{ width: `${utilization}%` }} />
          </div>
        </div>
      )}

      <div className="mt-3">
        <div className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />Will route through
        </div>
        <ol className="space-y-1">
          {rule.chain.map((c, idx) => (
            <li key={c.userId} className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                {c.position}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-900 truncate">{c.userName}</div>
                <div className="text-[10px] text-gray-500 truncate">{c.userTitle} · {c.label}</div>
              </div>
              {idx < rule.chain.length - 1 && <span className="text-gray-300 text-xs">↓</span>}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

// ===========================================================================
// Layout helpers
// ===========================================================================

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
