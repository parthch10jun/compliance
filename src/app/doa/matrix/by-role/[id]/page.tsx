'use client';

/**
 * Role-first view — everything a given role can approve, grouped by section.
 */

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ChevronRight, FileText, Users } from 'lucide-react';
import { getMatrix, getActiveVersion, getDelegationsForRole } from '@/lib/doa/matrix/store';
import { formatNumber } from '@/lib/doa/utils/format';
import type {
  AuthorityMatrix, Delegation, MatrixVersion, RoleAuthority,
} from '@/lib/doa/matrix/types';

export default function RoleView() {
  const params = useParams();
  const roleId = decodeURIComponent(params.id as string);

  const [matrix, setMatrix] = useState<AuthorityMatrix | null>(null);
  const [active, setActive] = useState<MatrixVersion | null>(null);

  useEffect(() => {
    const m = getMatrix();
    setMatrix(m);
    setActive(getActiveVersion(m));
  }, []);

  const role = useMemo(() => matrix?.roles.find(r => r.id === roleId), [matrix, roleId]);
  const entries = useMemo(() => {
    if (!active) return [];
    return getDelegationsForRole(roleId, active);
  }, [active, roleId]);

  // Group by section
  const grouped = useMemo(() => {
    if (!active) return [];
    const bySection = new Map<string, { delegation: Delegation; authority: RoleAuthority }[]>();
    entries.forEach(e => {
      const sub = active.subsections.find(s => s.id === e.delegation.subsectionId);
      const key = sub?.sectionId ?? 'other';
      if (!bySection.has(key)) bySection.set(key, []);
      bySection.get(key)!.push(e);
    });
    return active.sections
      .filter(s => bySection.has(s.id))
      .map(s => ({ section: s, entries: bySection.get(s.id)! }));
  }, [active, entries]);

  if (!matrix || !active) return null;

  if (!role) {
    return (
      <div className="max-w-3xl mx-auto mt-12 bg-white border border-gray-200 rounded-lg p-8 text-center">
        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Role not found</h2>
        <Link href="/doa/matrix/by-role" className="text-sm text-amber-700 hover:underline">← Back to role list</Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <Link href="/doa/matrix/by-role" className="p-2 hover:bg-gray-100 rounded">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /><span>Authority for</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">{role.name}</h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Appears on <strong>{entries.length}</strong> delegations across {grouped.length} sections.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {grouped.map(({ section, entries }) => (
          <div key={section.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
              <div className="text-xs font-mono text-gray-500">{section.id}</div>
              <div className="text-sm font-semibold text-gray-900">{section.title}</div>
            </div>
            <ul className="divide-y divide-gray-100">
              {entries.map(({ delegation, authority }) => (
                <li key={delegation.id}>
                  <Link
                    href={`/doa/matrix/delegation/${encodeURIComponent(delegation.id)}`}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50"
                  >
                    <span className="text-xs font-mono font-medium text-amber-700 flex-shrink-0 w-16">{delegation.id}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900 line-clamp-1">{delegation.description.split('.')[0]}.</div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        {authority.hasUnlimitedAuthority ? (
                          <span className="text-red-700 font-medium">Unlimited authority</span>
                        ) : authority.monetaryCap ? (
                          <span><strong>{authority.monetaryCap.currency} {formatNumber(authority.monetaryCap.amount)}</strong>{authority.conditions ? ` · ${authority.conditions}` : ''}</span>
                        ) : (
                          <span className="italic">{authority.conditions ?? 'Conditional'}</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {grouped.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-sm text-gray-500">This role has no authorities on the matrix.</p>
          </div>
        )}
      </div>
    </div>
  );
}
