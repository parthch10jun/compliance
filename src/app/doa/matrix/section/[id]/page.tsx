'use client';

/**
 * Section view — drill from a section tile to its subsections and delegations.
 */

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ChevronRight, FileText } from 'lucide-react';
import { getMatrix, getActiveVersion, getAuthoritiesForDelegation } from '@/lib/doa/matrix/store';
import type { AuthorityMatrix, MatrixVersion, Section } from '@/lib/doa/matrix/types';

export default function SectionPage() {
  const params = useParams();
  const sectionId = decodeURIComponent(params.id as string);

  const [matrix, setMatrix] = useState<AuthorityMatrix | null>(null);
  const [active, setActive] = useState<MatrixVersion | null>(null);

  useEffect(() => {
    const m = getMatrix();
    setMatrix(m);
    setActive(getActiveVersion(m));
  }, []);

  const section: Section | undefined = useMemo(() => {
    return active?.sections.find(s => s.id === sectionId);
  }, [active, sectionId]);

  const subsections = useMemo(() => {
    return (active?.subsections ?? []).filter(s => s.sectionId === sectionId);
  }, [active, sectionId]);

  if (!matrix || !active) return null;

  if (!section) {
    return (
      <div className="max-w-3xl mx-auto mt-12 bg-white border border-gray-200 rounded-lg p-8 text-center">
        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Section not found</h2>
        <Link href="/doa/matrix" className="text-sm text-amber-700 hover:underline">← Back to matrix</Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <Link href="/doa/matrix" className="p-2 hover:bg-gray-100 rounded">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <div className="text-xs font-mono text-gray-500 mb-1">
            Matrix › Section {section.id}
          </div>
          <h1 className="text-xl font-semibold text-gray-900">{section.title}</h1>
        </div>
      </div>

      <div className="space-y-4">
        {subsections.map(sub => {
          const delegations = active.delegations.filter(d => d.subsectionId === sub.id);
          const subSubs = (active.subSubsections ?? []).filter(ss => ss.subsectionId === sub.id);
          return (
            <div key={sub.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <div className="text-xs font-mono text-gray-500">{sub.id}</div>
                <h2 className="text-sm font-semibold text-gray-900">{sub.title}</h2>
              </div>

              {subSubs.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {subSubs.map(ss => {
                    const ssDelegations = active.delegations.filter(d => d.subSubsectionId === ss.id);
                    return (
                      <div key={ss.id} className="px-4 py-2 bg-gray-25">
                        <div className="text-xs font-mono text-gray-500 mb-1 pl-2 border-l-2 border-gray-200">
                          {ss.id} · {ss.title}
                        </div>
                        <DelegationRows delegations={ssDelegations} version={active} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <DelegationRows delegations={delegations} version={active} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DelegationRows({
  delegations, version,
}: { delegations: AuthorityMatrix['versions'][number]['delegations']; version: MatrixVersion }) {
  return (
    <ul className="divide-y divide-gray-100">
      {delegations.map(d => {
        const authCount = getAuthoritiesForDelegation(d.id, version).length;
        const firstLine = d.description.split('.')[0].trim();
        return (
          <li key={d.id}>
            <Link
              href={`/doa/matrix/delegation/${encodeURIComponent(d.id)}`}
              className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50"
            >
              <span className="text-xs font-mono font-medium text-amber-700 flex-shrink-0 w-16">{d.id}</span>
              <span className="flex-1 text-sm text-gray-900 line-clamp-2">{firstLine}.</span>
              <span className="text-xs text-gray-500 flex-shrink-0 whitespace-nowrap">
                {authCount} role{authCount === 1 ? '' : 's'}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
