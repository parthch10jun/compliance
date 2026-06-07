'use client';

/**
 * Authority Matrix — landing page.
 *
 * Avoids the Excel-grid trap: section tiles + smart command bar + quick
 * personal views drive the user to the specific delegation or role they
 * need, instead of forcing them to scroll a 54-column matrix.
 */

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search, FileText, Users, History, Inbox, ChevronRight, ShieldCheck,
  Briefcase, Receipt, Building2, Wallet,
} from 'lucide-react';
import { getMatrix, getActiveVersion, getDelegationsForRole } from '@/lib/doa/matrix/store';
import { listChangeRequests } from '@/lib/doa/matrix/change-request-store';
import { CR_CHANGE_TYPE_LABELS } from '@/lib/doa/matrix/cr-labels';
import { getMatrixRoleIdForUser } from '@/lib/doa/matrix/user-mapping';
import { useCurrentUser } from '@/lib/doa/hooks/useCurrentUser';
import { useClientProfile } from '@/lib/doa/hooks/useClientProfile';
import { formatDate } from '@/lib/doa/utils/format';
import SECMatrixLanding from '@/components/doa/matrix/SECMatrixLanding';
import type { AuthorityMatrix, MatrixVersion } from '@/lib/doa/matrix/types';
import type { ChangeRequest } from '@/lib/doa/matrix/change-request-types';

/**
 * Profile-aware matrix landing: the SEC workspace renders the RACI grid,
 * the JNBP workspace renders the cap-tier card view. One route, two
 * fully isolated experiences.
 */
export default function MatrixLanding() {
  const { profileId } = useClientProfile();
  if (profileId === 'sec') return <SECMatrixLanding />;
  return <JNBPMatrixLanding />;
}

const SECTION_THEMES: Record<string, { color: string; icon: React.ReactNode; bg: string; border: string }> = {
  A: { color: 'text-indigo-700', icon: <ShieldCheck className="w-5 h-5" />, bg: 'bg-indigo-50', border: 'border-indigo-200' },
  B: { color: 'text-purple-700', icon: <Building2 className="w-5 h-5" />, bg: 'bg-purple-50', border: 'border-purple-200' },
  C: { color: 'text-emerald-700', icon: <Wallet className="w-5 h-5" />, bg: 'bg-emerald-50', border: 'border-emerald-200' },
  D: { color: 'text-amber-700', icon: <Briefcase className="w-5 h-5" />, bg: 'bg-amber-50', border: 'border-amber-200' },
};

function JNBPMatrixLanding() {
  const { user } = useCurrentUser();
  const [matrix, setMatrix] = useState<AuthorityMatrix | null>(null);
  const [active, setActive] = useState<MatrixVersion | null>(null);
  const [crs, setCRs] = useState<ChangeRequest[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const m = getMatrix();
    setMatrix(m);
    setActive(getActiveVersion(m));
    setCRs(listChangeRequests());
  }, []);

  const myRoleId = useMemo(() => getMatrixRoleIdForUser(user), [user]);
  const myDelegations = useMemo(() => {
    if (!myRoleId || !active) return [];
    return getDelegationsForRole(myRoleId, active);
  }, [myRoleId, active]);

  const mostActionableCRs = useMemo(() => {
    return crs
      .filter(c => c.status !== 'Implemented' && c.status !== 'Draft')
      .slice(0, 3);
  }, [crs]);

  // Search across delegations (id, description, explanatory notes)
  const searchResults = useMemo(() => {
    if (!query.trim() || !active) return [];
    const q = query.toLowerCase();
    return active.delegations
      .filter(d => {
        const hay = `${d.id} ${d.description} ${d.explanatoryNotes}`.toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 8);
  }, [query, active]);

  if (!matrix || !active) {
    return (
      <div className="px-6 py-12 text-center text-gray-500 text-sm">
        Loading matrix…
      </div>
    );
  }

  const sectionCounts = (sectionId: string) => {
    const subsections = active.subsections.filter(s => s.sectionId === sectionId);
    const subIds = new Set(subsections.map(s => s.id));
    const delegations = active.delegations.filter(d => subIds.has(d.subsectionId));
    return { subs: subsections.length, delegations: delegations.length };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            Authority Matrix
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">{matrix.name}</h1>
          <p className="text-sm text-gray-600 mt-1">
            Version <strong className="text-gray-900">v{active.version}</strong> · approved by{' '}
            <strong className="text-gray-900">{active.approvedByLabel}</strong> ·{' '}
            effective {formatDate(active.effectiveFrom)}
          </p>
        </div>
        <Link
          href="/doa/change-request/new"
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
        >
          <FileText className="w-4 h-4" />Submit a CR
        </Link>
      </div>

      {/* Smart search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder='Search a matter, a role, or describe a transaction — e.g. "vendor contract", "CFO", "auditor"…'
            className="w-full pl-10 pr-3 py-3 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        {searchResults.length > 0 && (
          <ul className="mt-3 divide-y divide-gray-100 border-t border-gray-100">
            {searchResults.map(d => (
              <li key={d.id}>
                <Link
                  href={`/doa/matrix/delegation/${encodeURIComponent(d.id)}`}
                  className="flex items-start gap-3 py-2 hover:bg-gray-50 rounded px-2"
                >
                  <span className="text-xs font-mono text-gray-500 mt-0.5 flex-shrink-0">{d.id}</span>
                  <span className="text-sm text-gray-900 line-clamp-2">{d.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Section tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {active.sections.map(section => {
          const theme = SECTION_THEMES[section.id] ?? SECTION_THEMES.D;
          const counts = sectionCounts(section.id);
          return (
            <Link
              key={section.id}
              href={`/doa/matrix/section/${section.id}`}
              className={`group block border-2 ${theme.border} ${theme.bg} rounded-lg p-5 hover:shadow-md transition-all`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`${theme.color} ${theme.bg}`}>{theme.icon}</div>
                <span className={`text-xs font-bold tracking-wider ${theme.color}`}>{section.id}</span>
              </div>
              <h3 className="text-base font-semibold text-gray-900 leading-tight mb-3">
                {section.title}
              </h3>
              <div className="text-xs text-gray-700 space-y-0.5">
                <div>{counts.subs} subsections</div>
                <div>{counts.delegations} delegations</div>
              </div>
              <div className={`mt-4 flex items-center gap-1 text-xs font-medium ${theme.color}`}>
                Browse <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick views */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* My delegations */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5 mb-2">
            <Users className="w-4 h-4" />What can I approve?
          </h3>
          {myRoleId ? (
            <>
              <p className="text-xs text-gray-600 mb-3">
                As <strong className="text-gray-900">{user.name}</strong> ({user.role}), you appear on{' '}
                <strong className="text-amber-700">{myDelegations.length}</strong> delegations.
              </p>
              <Link
                href={`/doa/matrix/by-role/${myRoleId}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:underline"
              >
                View my authority <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </>
          ) : (
            <p className="text-xs text-gray-500 italic">
              Your current persona ({user.name} · {user.role}) doesn't map to a canonical matrix role.
              Switch personas in the top bar to see a role-specific view.
            </p>
          )}
        </div>

        {/* Open CRs */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5 mb-2">
            <Inbox className="w-4 h-4" />Open change requests
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            <strong className="text-amber-700">{mostActionableCRs.length}</strong>{' '}
            in flight across the review pipeline.
          </p>
          {mostActionableCRs.length > 0 && (
            <ul className="space-y-1 mb-2">
              {mostActionableCRs.map(cr => (
                <li key={cr.id}>
                  <Link
                    href={`/doa/change-request/${cr.id}`}
                    className="block text-xs px-2 py-1.5 hover:bg-gray-50 rounded -mx-2"
                  >
                    <span className="font-mono text-gray-500">{cr.number}</span>{' '}
                    <span className="text-gray-900">— {CR_CHANGE_TYPE_LABELS[cr.changeType] ?? cr.changeType}</span>
                    <div className="text-gray-500 truncate">{cr.proposedChange}</div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/doa/change-request"
            className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:underline"
          >
            View all CRs <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Versions */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5 mb-2">
            <History className="w-4 h-4" />Versions
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            Currently on <strong className="text-amber-700">v{active.version}</strong>.{' '}
            {matrix.versions.length - 1} prior versions in history.
          </p>
          <Link
            href="/doa/matrix/versions"
            className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:underline"
          >
            View version history <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Glossary quick link */}
      <Link
        href="/doa/matrix/glossary"
        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
      >
        <div>
          <div className="text-sm font-medium text-gray-900">Glossary</div>
          <div className="text-xs text-gray-500">{matrix.terms.length} defined terms</div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </Link>
    </div>
  );
}
