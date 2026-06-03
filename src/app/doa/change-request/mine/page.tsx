'use client';

/**
 * My Change Requests — filter to the current user's submissions.
 */

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, FileText } from 'lucide-react';
import { listChangeRequests } from '@/lib/doa/matrix/change-request-store';
import { useCurrentUser } from '@/lib/doa/hooks/useCurrentUser';
import { formatDate } from '@/lib/doa/utils/format';
import type { ChangeRequest } from '@/lib/doa/matrix/change-request-types';

export default function MyCRsPage() {
  const { user } = useCurrentUser();
  const [crs, setCRs] = useState<ChangeRequest[]>([]);

  useEffect(() => { setCRs(listChangeRequests()); }, []);

  const mine = useMemo(
    () => crs.filter(cr => cr.requestorUserId === user.id),
    [crs, user.id],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Change Requests</h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Requests submitted by <strong>{user.name}</strong>.
          </p>
        </div>
        <Link href="/doa/change-request/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded text-sm font-medium hover:bg-amber-600">
          <Plus className="w-4 h-4" />New CR
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <ul className="divide-y divide-gray-100">
          {mine.length === 0 && (
            <li className="px-4 py-16 text-center">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">You haven't submitted any change requests.</p>
            </li>
          )}
          {mine.map(cr => (
            <li key={cr.id}>
              <Link href={`/doa/change-request/${cr.id}`} className="block px-4 py-3 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-amber-700">{cr.number}</span>
                      <span className="text-xs text-gray-600">{cr.changeType}</span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-500">{cr.status}</span>
                    </div>
                    <div className="text-sm text-gray-900 line-clamp-2 mt-0.5">{cr.proposedChange}</div>
                    <div className="text-xs text-gray-500 mt-0.5">submitted {formatDate(cr.requestDate)}</div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
