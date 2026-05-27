'use client';

/**
 * Delegations List — backed by DelegationRule store.
 * Tabs filter by status; search + category filter narrow further.
 */

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, ShieldCheck, AlertCircle, Calendar as CalendarIcon, ChevronRight, FileText, Inbox } from 'lucide-react';
import { listDelegationRules } from '@/lib/doa/utils/delegation-rule-store';
import { useCurrentUser } from '@/lib/doa/hooks/useCurrentUser';
import { formatDate, formatNumber } from '@/lib/doa/utils/format';
import type { DelegationCategory, DelegationRule, DelegationStatus } from '@/lib/doa/types/delegation-rule-types';

type Tab = 'all' | 'active' | 'pendingApproval' | 'draft' | 'other';

const TAB_STATUSES: Record<Tab, DelegationStatus[]> = {
  all: ['Draft', 'PendingApproval', 'Active', 'PendingModification', 'Rejected', 'Suspended', 'Revoked', 'Expired'],
  active: ['Active', 'PendingModification'],
  pendingApproval: ['PendingApproval'],
  draft: ['Draft'],
  other: ['Rejected', 'Suspended', 'Revoked', 'Expired'],
};

export default function DelegationsList() {
  const { user } = useCurrentUser();
  const [rules, setRules] = useState<DelegationRule[]>([]);
  const [tab, setTab] = useState<Tab>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | DelegationCategory>('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    setRules(listDelegationRules());
    const onStorage = () => setRules(listDelegationRules());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const counts = useMemo(() => {
    const c: Record<Tab, number> = { all: 0, active: 0, pendingApproval: 0, draft: 0, other: 0 };
    rules.forEach(r => {
      c.all++;
      (Object.keys(TAB_STATUSES) as Tab[]).forEach(t => {
        if (t !== 'all' && TAB_STATUSES[t].includes(r.status)) c[t]++;
      });
    });
    return c;
  }, [rules]);

  const filtered = useMemo(() => {
    return rules.filter(r => {
      if (!TAB_STATUSES[tab].includes(r.status)) return false;
      if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        const haystack = `${r.name} ${r.authorityType} ${r.description} ${r.createdByUserName}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [rules, tab, categoryFilter, query]);

  // Delegations pending the current user's approval (the inbox slice).
  // Includes both initial PendingApproval and PendingModification routed here.
  const myPendingApprovals = useMemo(() => {
    if (!user.canApproveDelegations) return [];
    return rules.filter(r => {
      if (r.status === 'PendingApproval' && r.approvalAuthorityUserId === user.id) return true;
      if (r.status === 'PendingModification' && r.pendingModification) {
        const routedToId = r.pendingModification.routedTo?.userId ?? r.approvalAuthorityUserId;
        return routedToId === user.id;
      }
      return false;
    });
  }, [rules, user.id, user.canApproveDelegations]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Delegations</h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Authority rules that govern who can approve what — and how those rules themselves are approved.
          </p>
        </div>
        {user.canCreateDelegations && (
          <Link href="/doa/delegations/new"
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded text-sm font-medium hover:bg-amber-600">
            <Plus className="w-4 h-4" />New delegation
          </Link>
        )}
      </div>

      {/* My pending approvals (inbox slice) */}
      {myPendingApprovals.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Inbox className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-amber-900 mb-1">
                {myPendingApprovals.length} delegation{myPendingApprovals.length === 1 ? '' : 's'} need your approval
              </div>
              <p className="text-xs text-amber-800 mb-3">
                As <strong>{user.name}</strong> ({user.role}), you are the approval authority on these.
              </p>
              <div className="space-y-1.5">
                {myPendingApprovals.map(r => {
                  const isMod = r.status === 'PendingModification';
                  const submitter = isMod ? r.pendingModification?.proposedByUserName : r.createdByUserName;
                  return (
                    <Link
                      key={r.id}
                      href={`/doa/delegations/${r.id}`}
                      className="flex items-center justify-between gap-3 px-3 py-2 bg-white border border-amber-200 rounded hover:border-amber-400 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-gray-900 truncate">{r.name}</span>
                          {isMod && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-blue-100 text-blue-700">
                              modification
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {r.category} · {r.authorityType} · {isMod ? 'modification proposed' : 'submitted'} by {submitter}
                        </div>
                      </div>
                      <span className="text-xs text-amber-700 font-medium whitespace-nowrap">Review →</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-100 px-4">
          <div className="flex gap-1">
            {([
              ['all', 'All'],
              ['active', 'Active'],
              ['pendingApproval', 'Pending Approval'],
              ['draft', 'Drafts'],
              ['other', 'Terminal'],
            ] as [Tab, string][]).map(([t, label]) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-3 text-sm border-b-2 transition-colors ${
                  tab === t ? 'border-amber-500 text-amber-700 font-medium' : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}<span className="ml-1.5 text-xs text-gray-400">({counts[t]})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sub-filters */}
        <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-700">Category:</span>
            <div className="flex gap-1">
              {(['all', 'Financial', 'Non-Financial'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(c)}
                  className={`px-2.5 py-1 text-xs rounded ${
                    categoryFilter === c ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {c === 'all' ? 'All' : c}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 max-w-xs ml-auto relative">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, authority, creator…"
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-100">
          {filtered.length === 0 && (
            <div className="px-4 py-16 text-center">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No delegations match your filters.</p>
            </div>
          )}
          {filtered.map(rule => (
            <DelegationRow key={rule.id} rule={rule} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DelegationRow({ rule }: { rule: DelegationRule }) {
  const thresholdLine = (() => {
    const parts: string[] = [];
    if (rule.scope.monetaryCap) parts.push(`${formatNumber(rule.scope.monetaryCap.amount)} ${rule.scope.monetaryCap.currency}`);
    if (rule.scope.percentageCap !== undefined) parts.push(`${rule.scope.percentageCap}%`);
    if (rule.scope.quantityCap !== undefined) parts.push(`${rule.scope.quantityCap} units`);
    return parts.length ? `up to ${parts.join(' · ')}` : 'no cap';
  })();

  const chainStr = rule.chain.length === 0 ? '—' : rule.chain.map(c => c.userName).join(' → ');

  return (
    <Link href={`/doa/delegations/${rule.id}`}
      className="block px-4 py-3 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900 truncate">{rule.name}</span>
            <StatusBadge status={rule.status} />
            <CategoryBadge category={rule.category} />
            <span className="text-xs text-gray-500">v{rule.version}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-gray-400" />{rule.authorityType}
            </span>
            <span>•</span>
            <span>{thresholdLine}</span>
            <span>•</span>
            <span className="truncate">Chain: {chainStr}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
            <span>Approval authority: <span className="text-gray-700">{rule.approvalAuthorityUserName}</span> ({rule.approvalAuthorityTitle})</span>
            <span>•</span>
            <span>Created by {rule.createdByUserName}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              {formatDate(rule.createdAt)}
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300" />
      </div>
    </Link>
  );
}

export function StatusBadge({ status }: { status: DelegationStatus }) {
  const styles: Record<DelegationStatus, string> = {
    Draft: 'bg-gray-100 text-gray-700',
    PendingApproval: 'bg-amber-100 text-amber-700',
    Active: 'bg-green-100 text-green-700',
    PendingModification: 'bg-blue-100 text-blue-700',
    Rejected: 'bg-red-100 text-red-700',
    Suspended: 'bg-orange-100 text-orange-700',
    Revoked: 'bg-red-100 text-red-700',
    Expired: 'bg-gray-100 text-gray-500',
  };
  const labels: Record<DelegationStatus, string> = {
    Draft: 'Draft',
    PendingApproval: 'Pending Approval',
    Active: 'Active',
    PendingModification: 'Pending Modification',
    Rejected: 'Rejected',
    Suspended: 'Suspended',
    Revoked: 'Revoked',
    Expired: 'Expired',
  };
  return <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${styles[status]}`}>{labels[status]}</span>;
}

function CategoryBadge({ category }: { category: DelegationCategory }) {
  const styles = category === 'Financial' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700';
  return <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${styles}`}>{category}</span>;
}
