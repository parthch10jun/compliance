'use client';

/**
 * Matrix versions — full version history.
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, History, ShieldCheck } from 'lucide-react';
import { getMatrix } from '@/lib/doa/matrix/store';
import { formatDate } from '@/lib/doa/utils/format';
import type { AuthorityMatrix } from '@/lib/doa/matrix/types';

export default function VersionsPage() {
  const [matrix, setMatrix] = useState<AuthorityMatrix | null>(null);
  useEffect(() => { setMatrix(getMatrix()); }, []);

  if (!matrix) return null;

  const sorted = [...matrix.versions].sort((a, b) =>
    b.version.localeCompare(a.version, undefined, { numeric: true }),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Link href="/doa/matrix" className="p-2 hover:bg-gray-100 rounded">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <History className="w-5 h-5" />Version History
          </h1>
          <p className="text-sm text-gray-600 mt-0.5">
            {matrix.versions.length} versions of the {matrix.name}.
          </p>
        </div>
      </div>

      <ol className="space-y-3">
        {sorted.map(v => (
          <li
            key={v.version}
            className={`bg-white border-2 rounded-lg p-4 ${
              v.status === 'Active' ? 'border-amber-300 bg-amber-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-gray-900 font-mono">v{v.version}</span>
                {v.status === 'Active' ? (
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-200 text-amber-900">
                    ACTIVE
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-gray-100 text-gray-600">
                    SUPERSEDED
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 text-right">
                <div>{formatDate(v.effectiveFrom)}</div>
                {v.effectiveTo && <div className="text-gray-400">→ {formatDate(v.effectiveTo)}</div>}
              </div>
            </div>
            <div className="text-sm text-gray-900 font-medium mb-1">{v.changelogTitle}</div>
            {v.changelogDetail && v.changelogDetail !== v.changelogTitle && (
              <div className="text-xs text-gray-700 mt-1">{v.changelogDetail}</div>
            )}
            <div className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" />Approved by {v.approvedByLabel ?? '—'}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
