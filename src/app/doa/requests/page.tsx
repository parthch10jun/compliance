'use client';

/**
 * Approval Requests List — runtime requests routed by Active delegation rules.
 *
 * Inbox banner surfaces requests where the current user is the active
 * chain-step designee.
 */

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Plus, Search, ChevronRight, FileText, Inbox, Calendar as CalendarIcon,
  CheckCircle2, XCircle, Clock,
} from 'lucide-react';
import { listDelegationRequests } from '@/lib/doa/utils/request-store';
import { useCurrentUser } from '@/lib/doa/hooks/useCurrentUser';
import { formatDate, formatNumber } from '@/lib/doa/utils/format';
import type { DelegationRequest, DelegationRequestStatus } from '@/lib/doa/types/request-types';

type Tab = 'all' | 'pending' | 'approved' | 'rejected';

const TAB_STATUSES: Record<Tab, DelegationRequestStatus[]> = {
  all: ['PendingDecision', 'Approved', 'Rejected', 'Withdrawn'],
  pending: ['PendingDecision'],
  approved: ['Approved'],
  rejected: ['Rejected', 'Withdrawn'],
};

export default function RequestsList() {
  const { user } = useCurrentUser();
  const [requests, setRequests] = useState<DelegationRequest[]>([]);
  const [tab, setTab] = useState<Tab>('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    setRequests(listDelegationRequests());
    const onStorage = () => setRequests(listDelegationRequests());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const counts = useMemo(() => {
    const c: Record<Tab, number> = { all: 0, pending: 0, approved: 0, rejected: 0 };
    requests.forEach(r => {
      c.all++;
      (Object.keys(TAB_STATUSES) as Tab[]).forEach(t => {
        if (t !== 'all' && TAB_STATUSES[t].includes(r.status)) c[t]++;
      });
    });
    return c;
  }, [requests]);

  const filtered = useMemo(() => {
    return requests.filter(r => {
      if (!TAB_STATUSES[tab].includes(r.status)) return false;
      if (query) {
        const q = query.toLowerCase();
        const haystack = `${r.title} ${r.authorityType} ${r.description} ${r.requestedByUserName} ${r.matchedRuleName}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [requests, tab, query]);

  // Requests where I'm the current chain-step designee.
  const myStepActions = useMemo(() => {
    return requests.filter(r => {
      if (r.status !== 'PendingDecision') return false;
      const step = r.matchedRuleChain[r.currentStepIndex];
      return step?.userId === user.id;
    });
  }, [requests, user.id]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Approval Requests</h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Runtime requests routed through Active delegation rules.
          </p>
        </div>
        <Link href="/doa/requests/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded text-sm font-medium hover:bg-amber-600">
          <Plus className="w-4 h-4" />New request
        </Link>
      </div>

      {/* My step actions (designee inbox) */}
      {myStepActions.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Inbox className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-amber-900 mb-1">
                {myStepActions.length} request{myStepActions.length === 1 ? '' : 's'} need your decision
              </div>
              <p className="text-xs text-amber-800 mb-3">
                As <strong>{user.name}</strong> ({user.role}), you are the current chain step on these.
              </p>
              <div className="space-y-1.5">
                {myStepActions.map(r => {
                  const step = r.matchedRuleChain[r.currentStepIndex];
                  return (
                    <Link key={r.id} href={`/doa/requests/${r.id}`}
                      className="flex items-center justify-between gap-3 px-3 py-2 bg-white border border-amber-200 rounded hover:border-amber-400 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{r.title}</div>
                        <div className="text-xs text-gray-600 truncate">
                          {r.authorityType} · step {step.label} · requested by {r.requestedByUserName}
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
              ['pending', 'Pending'],
              ['approved', 'Approved'],
              ['rejected', 'Rejected'],
            ] as [Tab, string][]).map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-3 text-sm border-b-2 transition-colors ${
                  tab === t ? 'border-amber-500 text-amber-700 font-medium' : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}>
                {label}<span className="ml-1.5 text-xs text-gray-400">({counts[t]})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100 bg-gray-50">
          <div className="flex-1 max-w-xs ml-auto relative">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by title, authority, requester, rule…"
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filtered.length === 0 && (
            <div className="px-4 py-16 text-center">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No requests match your filters.</p>
            </div>
          )}
          {filtered.map(req => (
            <RequestRow key={req.id} req={req} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RequestRow({ req }: { req: DelegationRequest }) {
  const amountLine = (() => {
    const parts: string[] = [];
    if (req.monetaryAmount !== undefined) parts.push(`${formatNumber(req.monetaryAmount)} ${req.currency ?? ''}`.trim());
    if (req.percentageAmount !== undefined) parts.push(`${req.percentageAmount}%`);
    if (req.quantityAmount !== undefined) parts.push(`${req.quantityAmount} units`);
    return parts.length ? parts.join(' · ') : '—';
  })();

  const stepLine = (() => {
    if (req.status !== 'PendingDecision') return null;
    const step = req.matchedRuleChain[req.currentStepIndex];
    if (!step) return null;
    return `At ${step.label}: ${step.userName}`;
  })();

  return (
    <Link href={`/doa/requests/${req.id}`}
      className="block px-4 py-3 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900 truncate">{req.title}</span>
            <RequestStatusBadge status={req.status} />
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span>{req.authorityType}</span>
            <span>•</span>
            <span>{amountLine}</span>
            <span>•</span>
            <span className="truncate">Rule: {req.matchedRuleName}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
            <span>Requested by {req.requestedByUserName}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              {formatDate(req.requestedAt)}
            </span>
            {stepLine && (
              <>
                <span>•</span>
                <span className="text-amber-700 font-medium">{stepLine}</span>
              </>
            )}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300" />
      </div>
    </Link>
  );
}

export function RequestStatusBadge({ status }: { status: DelegationRequestStatus }) {
  const styles: Record<DelegationRequestStatus, { cls: string; icon: React.ReactNode; label: string }> = {
    PendingDecision: { cls: 'bg-amber-100 text-amber-700', icon: <Clock className="w-3 h-3" />, label: 'Pending' },
    Approved: { cls: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Approved' },
    Rejected: { cls: 'bg-red-100 text-red-700', icon: <XCircle className="w-3 h-3" />, label: 'Rejected' },
    Withdrawn: { cls: 'bg-gray-100 text-gray-700', icon: <XCircle className="w-3 h-3" />, label: 'Withdrawn' },
  };
  const s = styles[status];
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded ${s.cls}`}>
      {s.icon}{s.label}
    </span>
  );
}
