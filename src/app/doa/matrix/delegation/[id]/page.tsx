'use client';

/**
 * Delegation detail — the centrepiece of the matrix module.
 *
 * Renders one matter (e.g. D.1.3) with its description (glossary-aware),
 * explanatory notes, reference doc, and a tier-based view of authorised
 * roles. No grid; cards grouped by cap tier.
 */

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, FileText, BookOpen, Users, Send, ChevronRight, ShieldCheck,
} from 'lucide-react';
import {
  getMatrix, getActiveVersion, getDelegationById, getAuthoritiesForDelegation,
} from '@/lib/doa/matrix/store';
import { formatNumber } from '@/lib/doa/utils/format';
import GlossaryAwareText from '@/components/doa/matrix/GlossaryAwareText';
import type {
  AuthorityMatrix, Delegation, MatrixVersion, RoleAuthority, Role,
} from '@/lib/doa/matrix/types';

export default function DelegationDetail() {
  const params = useParams();
  const delegationId = decodeURIComponent(params.id as string);

  const [matrix, setMatrix] = useState<AuthorityMatrix | null>(null);
  const [active, setActive] = useState<MatrixVersion | null>(null);

  useEffect(() => {
    const m = getMatrix();
    setMatrix(m);
    setActive(getActiveVersion(m));
  }, []);

  const delegation: Delegation | undefined = useMemo(() => {
    if (!active) return undefined;
    return getDelegationById(delegationId, active);
  }, [active, delegationId]);

  const authorities: RoleAuthority[] = useMemo(() => {
    if (!active) return [];
    return getAuthoritiesForDelegation(delegationId, active);
  }, [active, delegationId]);

  const subsection = useMemo(
    () => active?.subsections.find(s => s.id === delegation?.subsectionId),
    [active, delegation],
  );
  const section = useMemo(
    () => active?.sections.find(s => s.id === subsection?.sectionId),
    [active, subsection],
  );

  if (!matrix || !active) return null;

  if (!delegation) {
    return (
      <div className="max-w-3xl mx-auto mt-12 bg-white border border-gray-200 rounded-lg p-8 text-center">
        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Delegation not found</h2>
        <Link href="/doa/matrix" className="text-sm text-amber-700 hover:underline">← Back to matrix</Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Link
            href={section ? `/doa/matrix/section/${section.id}` : '/doa/matrix'}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <div className="text-xs font-mono text-gray-500 mb-1">
              Matrix
              {section && (
                <>
                  {' › '}
                  <Link href={`/doa/matrix/section/${section.id}`} className="hover:text-amber-700">
                    {section.id}. {section.title}
                  </Link>
                </>
              )}
              {subsection && <> {' › '} <span className="text-gray-700">{subsection.id}. {subsection.title}</span></>}
            </div>
            <h1 className="text-xl font-semibold text-gray-900 flex items-baseline gap-3">
              <span className="font-mono text-amber-700 text-lg">{delegation.id}</span>
              <span className="text-base text-gray-700 leading-tight">
                {delegation.description.split('.')[0]}.
              </span>
            </h1>
          </div>
        </div>
        <Link
          href={`/doa/change-request/new?delegation=${encodeURIComponent(delegation.id)}`}
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
        >
          <Send className="w-4 h-4" />Propose change
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          {/* Description */}
          <Card title="Delegation" icon={<FileText className="w-4 h-4" />}>
            <p className="text-sm text-gray-800 leading-relaxed">
              <GlossaryAwareText text={delegation.description} terms={matrix.terms} />
            </p>
          </Card>

          {/* Explanatory notes */}
          {delegation.explanatoryNotes && (
            <Card title="Explanatory notes & conditions" icon={<BookOpen className="w-4 h-4" />}>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                <GlossaryAwareText text={delegation.explanatoryNotes} terms={matrix.terms} />
              </p>
            </Card>
          )}

          {/* Authority tiers */}
          <Card
            title={`Who can approve (${authorities.length} roles)`}
            icon={<Users className="w-4 h-4" />}
          >
            <AuthorityTiers authorities={authorities} roles={matrix.roles} />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {delegation.referenceDocText && (
            <Card title="Reference" icon={<ShieldCheck className="w-4 h-4" />}>
              <div className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
                {delegation.referenceDocText}
              </div>
            </Card>
          )}

          <Card title="Matrix" icon={<ShieldCheck className="w-4 h-4" />}>
            <div className="text-xs text-gray-700 space-y-1.5">
              <div>
                Effective version: <strong className="text-amber-700">v{active.version}</strong>
              </div>
              <div>
                Approved by {active.approvedByLabel}
              </div>
              <Link
                href="/doa/matrix/versions"
                className="inline-flex items-center gap-1 text-amber-700 hover:underline mt-1"
              >
                View version history <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Authority tiers (the no-grid view of authorised roles)
// ============================================================================

interface Tier {
  label: string;
  // Sort key for cap comparison; 'unlimited' uses Infinity, 'conditional' uses -1.
  weight: number;
  entries: { role: Role; auth: RoleAuthority }[];
}

function AuthorityTiers({
  authorities, roles,
}: { authorities: RoleAuthority[]; roles: Role[] }) {
  const tiers: Tier[] = useMemo(() => {
    const roleById = new Map(roles.map(r => [r.id, r] as const));
    const buckets = new Map<string, Tier>();

    const tierKeyForAuth = (a: RoleAuthority): { key: string; label: string; weight: number } => {
      if (a.hasUnlimitedAuthority) {
        return { key: 'unlimited', label: 'Unlimited authority', weight: Number.POSITIVE_INFINITY };
      }
      if (a.monetaryCap) {
        const amt = a.monetaryCap.amount;
        return {
          key: `${a.monetaryCap.currency}-${amt}`,
          label: `${a.monetaryCap.currency} ${formatNumber(amt)}`,
          weight: amt,
        };
      }
      return { key: 'conditional', label: 'Conditional (no monetary cap)', weight: -1 };
    };

    authorities.forEach(a => {
      const { key, label, weight } = tierKeyForAuth(a);
      if (!buckets.has(key)) buckets.set(key, { label, weight, entries: [] });
      const role = roleById.get(a.roleId);
      if (role) buckets.get(key)!.entries.push({ role, auth: a });
    });

    return Array.from(buckets.values()).sort((a, b) => b.weight - a.weight);
  }, [authorities, roles]);

  if (authorities.length === 0) {
    return <p className="text-xs text-gray-500 italic">No role authorities recorded for this delegation.</p>;
  }

  return (
    <div className="space-y-4">
      {/* Visual ladder: dots at each tier on a horizontal axis */}
      <div className="hidden md:block">
        <div className="relative h-12 bg-gradient-to-r from-emerald-50 via-amber-50 to-red-50 rounded border border-gray-200">
          <div className="absolute inset-x-3 inset-y-2 flex items-end justify-between">
            {tiers.map((t, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1 text-[10px] text-gray-700 font-medium"
                style={{ minWidth: 48 }}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                    t.weight === Number.POSITIVE_INFINITY
                      ? 'bg-red-600'
                      : t.weight === -1
                      ? 'bg-gray-500'
                      : t.weight >= 100_000_000
                      ? 'bg-amber-600'
                      : t.weight >= 10_000_000
                      ? 'bg-amber-400'
                      : 'bg-emerald-500'
                  }`}
                />
                <span className="whitespace-nowrap">{t.label}</span>
                <span className="text-gray-400">{t.entries.length}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {tiers.map((t, i) => (
          <TierCard key={i} tier={t} />
        ))}
      </div>
    </div>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  const isUnlimited = tier.weight === Number.POSITIVE_INFINITY;
  const isConditional = tier.weight === -1;
  return (
    <div
      className={`border rounded p-3 ${
        isUnlimited
          ? 'border-red-200 bg-red-50'
          : isConditional
          ? 'border-gray-200 bg-gray-50'
          : tier.weight >= 100_000_000
          ? 'border-amber-300 bg-amber-50'
          : tier.weight >= 10_000_000
          ? 'border-amber-200 bg-amber-50/40'
          : 'border-emerald-200 bg-emerald-50/40'
      }`}
    >
      <div className="flex items-baseline justify-between mb-2">
        <div className="text-sm font-semibold text-gray-900">{tier.label}</div>
        <div className="text-xs text-gray-500">{tier.entries.length} role{tier.entries.length === 1 ? '' : 's'}</div>
      </div>
      <ul className="space-y-1.5">
        {tier.entries.map(({ role, auth }) => (
          <li key={role.id} className="text-xs">
            <Link
              href={`/doa/matrix/by-role/${role.id}`}
              className="font-medium text-gray-900 hover:text-amber-700"
            >
              {role.name}
            </Link>
            {auth.conditions && (
              <span className="ml-2 text-gray-600 italic">{auth.conditions}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// Layout helper
// ============================================================================

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
        {icon}{title}
      </h3>
      {children}
    </div>
  );
}
