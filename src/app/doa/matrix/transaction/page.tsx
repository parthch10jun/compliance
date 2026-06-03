'use client';

/**
 * Transaction Lookup — describe a transaction → see who can approve it.
 *
 * Step 1: pick a matter (delegation) via search.
 * Step 2: enter the transaction's monetary amount (and optional currency).
 * Step 3: see the eligible approvers ranked by tightest fit (lowest cap that
 *         still accommodates), plus the roles excluded by cap and why.
 *
 * Pure read against the active matrix — no requests are created or routed.
 */

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Receipt, Search, ChevronRight, CheckCircle2, XCircle, ShieldCheck,
  AlertTriangle, Sparkles,
} from 'lucide-react';
import { getMatrix, getActiveVersion } from '@/lib/doa/matrix/store';
import { formatNumber } from '@/lib/doa/utils/format';
import type {
  AuthorityMatrix, Delegation, MatrixVersion, Role, RoleAuthority,
} from '@/lib/doa/matrix/types';

/**
 * Synonym dictionary — bridges colloquial business terms to JNBP's formal
 * matrix language. Keyed by what users actually type; values are the formal
 * tokens to match against in the haystack.
 */
const SYNONYMS: Record<string, string[]> = {
  vendor: ['supplier', 'procurement', 'project contract', 'goods or services', 'third party'],
  vendors: ['supplier', 'procurement', 'project contract', 'goods or services', 'third party'],
  supplier: ['supplier', 'vendor', 'procurement', 'goods or services'],
  contract: ['project contract', 'commitment', 'agreement', 'third party contracts'],
  contracts: ['project contract', 'commitment', 'agreement', 'third party contracts'],
  hire: ['hiring', 'people', 'employment', 'recruitment'],
  hiring: ['people', 'employment'],
  salary: ['compensation', 'remuneration', 'pay', 'people'],
  raise: ['compensation', 'salary increase', 'remuneration'],
  bonus: ['compensation', 'bonus'],
  purchase: ['purchase orders', 'pos', 'procurement', 'commitment'],
  po: ['purchase orders', 'pos', 'commitment'],
  pos: ['purchase orders', 'procurement'],
  payment: ['invoice and payment', 'payments', 'manual payment'],
  payments: ['invoice and payment', 'manual payment'],
  invoice: ['invoice', 'invoice and payment'],
  policy: ['policies'],
  policies: ['policies'],
  capex: ['capital expenditure', 'investment'],
  opex: ['operating expenditure', 'operational expenditure'],
  budget: ['business plan', 'annual budget'],
  tax: ['tax', 'tax returns', 'tax authority'],
  audit: ['external auditor', 'audit'],
  insurance: ['insurance programme', 'insurance'],
  bank: ['bank accounts', 'treasury'],
  loan: ['loans', 'borrowing', 'guarantee'],
  borrowing: ['indebtedness', 'borrowing', 'loans'],
  hedge: ['hedging', 'risk management'],
  hedging: ['hedging', 'risk management'],
  fx: ['hedging', 'fx'],
  comms: ['communications', 'press release'],
  media: ['external media', 'press', 'communications'],
  donate: ['donation', 'charitable'],
  donation: ['donation', 'charitable', 'community'],
  legal: ['legal', 'legal action'],
  litigation: ['legal action', 'commencement'],
  share: ['shares', 'share capital'],
  shares: ['shares', 'share capital'],
  dividend: ['distribution', 'distributions'],
  distribution: ['distribution', 'distributions'],
  ipo: ['initial public offering', 'public offering'],
  jv: ['joint venture', 'partnership'],
  merger: ['merger', 'consolidation'],
  acquisition: ['acquisition', 'acquire'],
};

function expandQuery(raw: string): string[] {
  const tokens = raw.toLowerCase().split(/\s+/).filter(Boolean);
  const expanded = new Set<string>();
  tokens.forEach(t => {
    expanded.add(t);
    (SYNONYMS[t] ?? []).forEach(s => expanded.add(s.toLowerCase()));
  });
  return Array.from(expanded);
}

type Fit =
  | { kind: 'monetary'; capAmount: number; currency: string }
  | { kind: 'unlimited' }
  | { kind: 'conditional' }
  | { kind: 'no-cap' };

interface Candidate {
  role: Role;
  auth: RoleAuthority;
  fit: Fit;
}

interface Rejected {
  role: Role;
  auth: RoleAuthority;
  reason: string;
}

export default function TransactionLookup() {
  const [matrix, setMatrix] = useState<AuthorityMatrix | null>(null);
  const [active, setActive] = useState<MatrixVersion | null>(null);

  const [search, setSearch] = useState('');
  const [selectedDelegationId, setSelectedDelegationId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [conditionFilter, setConditionFilter] = useState('');

  useEffect(() => {
    const m = getMatrix();
    setMatrix(m);
    setActive(getActiveVersion(m));
  }, []);

  // -- Matter search ------------------------------------------------------
  // Tokenise the query, expand each token through the synonym dictionary,
  // and rank each delegation by the count of matching tokens — across its
  // ID, description, explanatory notes, subsection title, and section title.
  // When the search is empty, fall back to a curated set of common matters
  // so the user has something to click without knowing what to type.
  const matchingDelegations = useMemo<Delegation[]>(() => {
    if (!active) return [];

    const subById = new Map(active.subsections.map(s => [s.id, s] as const));
    const sectionById = new Map(active.sections.map(s => [s.id, s] as const));

    // Empty search → curated common matters (procurement / hiring / contracts /
    // capex / payment / policy / merger / tax / hedging / IPO).
    if (!search.trim()) {
      const COMMON_IDS = [
        'D.1.3', 'D.2.5', 'D.2.6', 'D.2.4',  // contracts / commitment / payment / sourcing
        'D.5.4', 'D.5.6',                     // hiring / compensation
        'A.2.1', 'A.3.2',                     // business plan / policy
        'D.3.1.2', 'D.3.3.4',                 // insurance / tax filings
        'C.1.1', 'B.2.2',                     // borrowing / share acquisition
      ];
      return COMMON_IDS
        .map(id => active.delegations.find(d => d.id === id))
        .filter((d): d is Delegation => d !== undefined);
    }

    const tokens = expandQuery(search);
    type Scored = { d: Delegation; score: number };
    const scored: Scored[] = active.delegations.map(d => {
      const sub = subById.get(d.subsectionId);
      const section = sub ? sectionById.get(sub.sectionId) : undefined;
      const haystack = [
        d.id,
        d.description,
        d.explanatoryNotes,
        sub?.title ?? '',
        section?.title ?? '',
      ].join(' ').toLowerCase();
      const score = tokens.reduce((acc, t) => acc + (haystack.includes(t) ? 1 : 0), 0);
      return { d, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(s => s.d);
  }, [active, search]);

  const selectedDelegation = useMemo<Delegation | undefined>(() => {
    return active?.delegations.find(d => d.id === selectedDelegationId);
  }, [active, selectedDelegationId]);

  // -- Eligibility computation --------------------------------------------
  const { eligible, rejected } = useMemo<{ eligible: Candidate[]; rejected: Rejected[] }>(() => {
    if (!active || !selectedDelegationId || !matrix) {
      return { eligible: [], rejected: [] };
    }
    const authsAll = active.authorities.filter(a => a.delegationId === selectedDelegationId);
    const roleById = new Map(matrix.roles.map(r => [r.id, r] as const));
    const amountNum = amount ? Number(amount.replace(/[, ]/g, '')) || 0 : 0;
    const condQ = conditionFilter.trim().toLowerCase();

    const eligible: Candidate[] = [];
    const rejected: Rejected[] = [];

    authsAll.forEach(auth => {
      const role = roleById.get(auth.roleId);
      if (!role) return;

      // Conditions filter (substring match — non-blocking unless set)
      if (condQ && auth.conditions && !auth.conditions.toLowerCase().includes(condQ)) {
        rejected.push({
          role, auth,
          reason: `conditions filter "${conditionFilter}" not present`,
        });
        return;
      }

      // Cap check
      if (amountNum > 0) {
        if (auth.hasUnlimitedAuthority) {
          eligible.push({ role, auth, fit: { kind: 'unlimited' } });
          return;
        }
        if (auth.monetaryCap) {
          if (auth.monetaryCap.amount >= amountNum) {
            eligible.push({
              role, auth,
              fit: { kind: 'monetary', capAmount: auth.monetaryCap.amount, currency: auth.monetaryCap.currency },
            });
          } else {
            rejected.push({
              role, auth,
              reason: `${auth.monetaryCap.currency} ${formatNumber(auth.monetaryCap.amount)} cap below the ${currency} ${formatNumber(amountNum)} request`,
            });
          }
          return;
        }
        // No monetary cap but no unlimited flag → conditional cell
        eligible.push({ role, auth, fit: { kind: 'conditional' } });
      } else {
        // No amount specified — every authorized role is eligible
        if (auth.hasUnlimitedAuthority) {
          eligible.push({ role, auth, fit: { kind: 'unlimited' } });
        } else if (auth.monetaryCap) {
          eligible.push({
            role, auth,
            fit: { kind: 'monetary', capAmount: auth.monetaryCap.amount, currency: auth.monetaryCap.currency },
          });
        } else {
          eligible.push({ role, auth, fit: { kind: 'conditional' } });
        }
      }
    });

    // Sort eligible: tightest monetary fit first (lowest cap), then conditional,
    // then unlimited last (apex authorities).
    eligible.sort((a, b) => {
      const ak = a.fit.kind === 'monetary' ? 0 : a.fit.kind === 'conditional' ? 1 : 2;
      const bk = b.fit.kind === 'monetary' ? 0 : b.fit.kind === 'conditional' ? 1 : 2;
      if (ak !== bk) return ak - bk;
      if (a.fit.kind === 'monetary' && b.fit.kind === 'monetary') {
        return a.fit.capAmount - b.fit.capAmount;
      }
      return 0;
    });

    return { eligible, rejected };
  }, [active, matrix, selectedDelegationId, amount, currency, conditionFilter]);

  if (!matrix || !active) {
    return <div className="px-6 py-12 text-center text-sm text-gray-500">Loading matrix…</div>;
  }

  // -----------------------------------------------------------------------

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link href="/doa/matrix" className="p-2 hover:bg-gray-100 rounded">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Receipt className="w-5 h-5" />Transaction Lookup
          </h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Describe what you need to approve — we'll show the roles that can sign, ranked by tightest fit.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left: form (amount always visible) */}
        <div className="col-span-1 space-y-4">
          {/* Transaction parameters — always visible so the user can fill in
              any order. Pair with a matter on the right. */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900">Transaction amount</h2>
            <div className="grid grid-cols-3 gap-2">
              <label className="col-span-2 text-xs">
                <span className="block text-gray-600 mb-1">Monetary amount</span>
                <input
                  type="text" inputMode="numeric"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="e.g. 40000000"
                  className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <span className="block text-[10px] text-gray-500 mt-1">
                  Leave blank to see every role authorised on the matter.
                </span>
              </label>
              <label className="text-xs">
                <span className="block text-gray-600 mb-1">Currency</span>
                <select value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                  {['USD', 'EUR', 'GBP', 'JPY', 'AED'].map(c => <option key={c}>{c}</option>)}
                </select>
              </label>
            </div>
            <label className="block text-xs">
              <span className="block text-gray-600 mb-1">Conditions filter (optional)</span>
              <input
                type="text" value={conditionFilter}
                onChange={e => setConditionFilter(e.target.value)}
                placeholder='e.g. "COD", "Offtake"'
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </label>
          </div>

          {/* Matter picker */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900">
              {selectedDelegation ? 'Selected matter' : 'Pick a matter'}
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder='Search — vendor, hiring, capex, tax…'
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {selectedDelegation ? (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono text-amber-700 mb-0.5">{selectedDelegation.id}</div>
                    <div className="text-xs text-gray-900 line-clamp-3">{selectedDelegation.description}</div>
                  </div>
                  <button onClick={() => setSelectedDelegationId('')}
                    className="text-gray-500 hover:text-gray-700 p-0.5">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
                <Link href={`/doa/matrix/delegation/${encodeURIComponent(selectedDelegation.id)}`}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-amber-700 hover:underline">
                  Open delegation <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            ) : matchingDelegations.length > 0 ? (
              <>
                {!search.trim() && (
                  <p className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">
                    Common matters · click to pick
                  </p>
                )}
                <ul className="space-y-1 max-h-72 overflow-y-auto">
                  {matchingDelegations.map(d => (
                    <li key={d.id}>
                      <button
                        onClick={() => { setSelectedDelegationId(d.id); setSearch(''); }}
                        className="w-full text-left flex items-start gap-2 px-2 py-1.5 hover:bg-gray-50 rounded"
                      >
                        <span className="text-xs font-mono text-amber-700 flex-shrink-0 w-14">{d.id}</span>
                        <span className="text-xs text-gray-900 line-clamp-2">
                          {d.description.split('.')[0]}.
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="text-xs italic text-gray-500 space-y-2">
                <p>No matters match.</p>
                <p className="not-italic text-gray-600">
                  Try{' '}
                  <button onClick={() => setSearch('procurement')} className="underline hover:text-amber-700">procurement</button>,{' '}
                  <button onClick={() => setSearch('contract')} className="underline hover:text-amber-700">contract</button>,{' '}
                  <button onClick={() => setSearch('hiring')} className="underline hover:text-amber-700">hiring</button>,{' '}
                  <button onClick={() => setSearch('payment')} className="underline hover:text-amber-700">payment</button>, or{' '}
                  <button onClick={() => setSearch('tax')} className="underline hover:text-amber-700">tax</button>.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: results */}
        <div className="col-span-2 space-y-4">
          {!selectedDelegation && (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Pick a matter on the left to see who can sign.
              </p>
            </div>
          )}

          {selectedDelegation && (
            <>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-baseline justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Eligible approvers
                    <span className="text-xs font-normal text-gray-500">
                      ({eligible.length} of {eligible.length + rejected.length})
                    </span>
                  </h2>
                  {amount && Number(amount) > 0 && (
                    <span className="text-xs text-gray-600">
                      Request: <strong className="text-gray-900">{currency} {formatNumber(Number(amount.replace(/[, ]/g, '')))}</strong>
                    </span>
                  )}
                </div>
                {eligible.length === 0 ? (
                  <p className="text-xs italic text-gray-500">
                    {amount && Number(amount) > 0
                      ? `No role on ${selectedDelegation.id} can approve at this amount. Escalate.`
                      : 'No authorities on this delegation.'}
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {eligible.map((c, i) => (
                      <li key={c.role.id} className="py-2.5 flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 text-center">
                          {i === 0 && c.fit.kind === 'monetary' && (
                            <span title="Tightest fit"
                              className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700">
                              <Sparkles className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/doa/matrix/by-role/${c.role.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-amber-700">
                            {c.role.name}
                          </Link>
                          {c.auth.conditions && (
                            <div className="text-xs italic text-gray-600 mt-0.5">{c.auth.conditions}</div>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-medium text-gray-900">
                            {c.fit.kind === 'monetary'
                              ? `${c.fit.currency} ${formatNumber(c.fit.capAmount)}`
                              : c.fit.kind === 'unlimited'
                              ? 'Approval rights'
                              : 'Conditional'}
                          </div>
                          {i === 0 && c.fit.kind === 'monetary' && (
                            <div className="text-[10px] text-amber-700 font-medium uppercase tracking-wide">
                              Tightest fit
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {rejected.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Not eligible
                    <span className="text-xs font-normal text-gray-500">({rejected.length})</span>
                  </h2>
                  <ul className="divide-y divide-gray-100">
                    {rejected.slice(0, 10).map(r => (
                      <li key={r.role.id} className="py-2 text-xs">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-gray-700">{r.role.name}</span>
                          <span className="text-gray-500 text-right">{r.reason}</span>
                        </div>
                      </li>
                    ))}
                    {rejected.length > 10 && (
                      <li className="py-2 text-xs text-gray-500 italic">
                        … and {rejected.length - 10} more
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {amount && Number(amount) > 0 && eligible.length === 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-2 text-sm text-red-900">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Out of scope.</strong> No role on {selectedDelegation.id} can approve a{' '}
                      {currency} {formatNumber(Number(amount.replace(/[, ]/g, '')))} transaction. This either escalates
                      to a more senior matter or requires a Change Request to expand the matrix.
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
