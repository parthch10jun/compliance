'use client';

/**
 * Change Request Inbox — the DoA Admin's home screen.
 *
 * Status tabs filter the list; the Admin (Priya) primarily lives in the
 * L1Endorsed / UnderReview tabs.
 */

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, ChevronRight, FileText, Inbox } from 'lucide-react';
import { listChangeRequests } from '@/lib/doa/matrix/change-request-store';
import { useCurrentUser } from '@/lib/doa/hooks/useCurrentUser';
import { formatDate } from '@/lib/doa/utils/format';
import type { ChangeRequest, CRStatus } from '@/lib/doa/matrix/change-request-types';

type Tab = 'all' | 'open' | 'triage' | 'review' | 'pending-approval' | 'closed';

const TAB_STATUSES: Record<Tab, CRStatus[]> = {
  all: ['Draft', 'PendingL1Endorsement', 'L1Endorsed', 'TriageRejected', 'UnderReview', 'ReviewerRejected', 'Validation', 'ValidationRejected', 'PendingApproval', 'Approved', 'Implemented', 'ApproverRejected'],
  open: ['Draft', 'PendingL1Endorsement', 'L1Endorsed', 'UnderReview', 'Validation', 'PendingApproval', 'Approved'],
  triage: ['L1Endorsed'],
  review: ['UnderReview', 'Validation'],
  'pending-approval': ['PendingApproval'],
  closed: ['Implemented', 'TriageRejected', 'ReviewerRejected', 'ValidationRejected', 'ApproverRejected'],
};

const STATUS_LABELS: Record<CRStatus, { label: string; cls: string }> = {
  Draft: { label: 'Draft', cls: 'bg-gray-100 text-gray-700' },
  PendingL1Endorsement: { label: 'Pending L1 endorsement', cls: 'bg-blue-100 text-blue-700' },
  L1Endorsed: { label: 'In triage (R&A)', cls: 'bg-amber-100 text-amber-700' },
  TriageRejected: { label: 'Triage rejected', cls: 'bg-red-100 text-red-700' },
  UnderReview: { label: 'Under review', cls: 'bg-purple-100 text-purple-700' },
  ReviewerRejected: { label: 'Reviewer rejected', cls: 'bg-red-100 text-red-700' },
  Validation: { label: 'In validation', cls: 'bg-indigo-100 text-indigo-700' },
  ValidationRejected: { label: 'Validator rejected', cls: 'bg-red-100 text-red-700' },
  PendingApproval: { label: 'Awaiting CEO/Board', cls: 'bg-orange-100 text-orange-700' },
  Approved: { label: 'Approved — pending impl', cls: 'bg-emerald-100 text-emerald-700' },
  Implemented: { label: 'Implemented', cls: 'bg-green-100 text-green-700' },
  ApproverRejected: { label: 'Approver rejected', cls: 'bg-red-100 text-red-700' },
};

export default function CRInbox() {
  const { user } = useCurrentUser();
  const [crs, setCRs] = useState<ChangeRequest[]>([]);
  const [tab, setTab] = useState<Tab>('open');
  const [query, setQuery] = useState('');

  useEffect(() => {
    setCRs(listChangeRequests());
    const onStorage = () => setCRs(listChangeRequests());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const counts = useMemo(() => {
    const c: Record<Tab, number> = { all: 0, open: 0, triage: 0, review: 0, 'pending-approval': 0, closed: 0 };
    crs.forEach(cr => {
      c.all++;
      (Object.keys(TAB_STATUSES) as Tab[]).forEach(t => {
        if (t !== 'all' && TAB_STATUSES[t].includes(cr.status)) c[t]++;
      });
    });
    return c;
  }, [crs]);

  const filtered = useMemo(() => {
    return crs.filter(cr => {
      if (!TAB_STATUSES[tab].includes(cr.status)) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = `${cr.number} ${cr.proposedChange} ${cr.requestorUserName} ${cr.targetDelegationId ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [crs, tab, query]);

  // Admin alert
  const inMyTriage = useMemo(() => {
    if (user.id !== 'user-107') return [];
    return crs.filter(cr => cr.status === 'L1Endorsed');
  }, [crs, user.id]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            DoA Change Requests
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Inbox</h1>
          <p className="text-sm text-gray-600 mt-0.5">
            All change requests against the Authority Matrix.
          </p>
        </div>
        <Link
          href="/doa/change-request/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded text-sm font-medium hover:bg-amber-600"
        >
          <Plus className="w-4 h-4" />Submit a CR
        </Link>
      </div>

      {inMyTriage.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Inbox className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-amber-900 mb-1">
                {inMyTriage.length} CR{inMyTriage.length === 1 ? '' : 's'} awaiting your triage
              </div>
              <p className="text-xs text-amber-800 mb-3">
                As <strong>{user.name}</strong> (Risk &amp; Audit lead), L1-endorsed CRs land here for triage.
              </p>
              <div className="space-y-1.5">
                {inMyTriage.map(cr => (
                  <Link
                    key={cr.id}
                    href={`/doa/change-request/${cr.id}`}
                    className="flex items-center justify-between gap-3 px-3 py-2 bg-white border border-amber-200 rounded hover:border-amber-400 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        <span className="font-mono text-amber-700">{cr.number}</span> · {cr.changeType}
                        {cr.targetDelegationId && (
                          <span className="text-gray-500"> · {cr.targetDelegationId}</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 truncate">{cr.proposedChange}</div>
                    </div>
                    <span className="text-xs text-amber-700 font-medium whitespace-nowrap">Review →</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-100 px-4">
          <div className="flex gap-1 overflow-x-auto">
            {([
              ['open', 'Open'],
              ['triage', 'Triage'],
              ['review', 'Review'],
              ['pending-approval', 'CEO/Board'],
              ['closed', 'Closed'],
              ['all', 'All'],
            ] as [Tab, string][]).map(([t, label]) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-3 text-sm border-b-2 transition-colors whitespace-nowrap ${
                  tab === t ? 'border-amber-500 text-amber-700 font-medium' : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}<span className="ml-1.5 text-xs text-gray-400">({counts[t]})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100 bg-gray-50">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search number, target, requester, change…"
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        <ul className="divide-y divide-gray-100">
          {filtered.length === 0 && (
            <li className="px-4 py-16 text-center">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No change requests match.</p>
            </li>
          )}
          {filtered.map(cr => (
            <CRRow key={cr.id} cr={cr} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function CRRow({ cr }: { cr: ChangeRequest }) {
  const status = STATUS_LABELS[cr.status];
  return (
    <li>
      <Link href={`/doa/change-request/${cr.id}`} className="block px-4 py-3 hover:bg-gray-50">
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-medium text-amber-700">{cr.number}</span>
              <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${status.cls}`}>{status.label}</span>
              <span className="text-xs text-gray-500">· {cr.changeType}</span>
              {cr.targetDelegationId && (
                <span className="text-xs text-gray-500">· target {cr.targetDelegationId}</span>
              )}
            </div>
            <div className="text-sm text-gray-900 line-clamp-2 mb-0.5">{cr.proposedChange}</div>
            <div className="text-xs text-gray-500">
              by {cr.requestorUserName} ({cr.requestorRole}) · {formatDate(cr.requestDate)}
              {cr.resultingMatrixVersion && (
                <span className="ml-2 text-emerald-700">→ produced v{cr.resultingMatrixVersion}</span>
              )}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
        </div>
      </Link>
    </li>
  );
}
