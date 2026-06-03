'use client';

/**
 * Role picker — pick a role to see what they can approve.
 */

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Search, ChevronRight } from 'lucide-react';
import { getMatrix, getActiveVersion } from '@/lib/doa/matrix/store';
import type { AuthorityMatrix } from '@/lib/doa/matrix/types';

export default function RolePicker() {
  const [matrix, setMatrix] = useState<AuthorityMatrix | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => { setMatrix(getMatrix()); }, []);

  const rolesWithCounts = useMemo(() => {
    if (!matrix) return [];
    const active = getActiveVersion(matrix);
    return matrix.roles
      .map(r => ({
        role: r,
        count: active.authorities.filter(a => a.roleId === r.id).length,
      }))
      .sort((a, b) => a.role.sortOrder - b.role.sortOrder);
  }, [matrix]);

  const filtered = useMemo(() => {
    if (!query.trim()) return rolesWithCounts;
    const q = query.toLowerCase();
    return rolesWithCounts.filter(r => r.role.name.toLowerCase().includes(q));
  }, [rolesWithCounts, query]);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Link href="/doa/matrix" className="p-2 hover:bg-gray-100 rounded">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5" />By Role
          </h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Pick a role to see all delegations they appear on.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search roles…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      <ul className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {filtered.map(({ role, count }) => (
          <li key={role.id}>
            <Link
              href={`/doa/matrix/by-role/${encodeURIComponent(role.id)}`}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50"
            >
              <span className="text-sm text-gray-900">{role.name}</span>
              <span className="flex items-center gap-2 text-xs text-gray-500">
                <span>{count} delegation{count === 1 ? '' : 's'}</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
