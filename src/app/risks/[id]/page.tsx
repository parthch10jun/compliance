'use client';

import { use } from 'react';
import { PageHeader } from '@/components';
import { risks, riskControlLinks, riskRequirementLinks, riskObligationLinks } from '@/lib/data/risks';
import { controls } from '@/lib/data/mock-data';
import { requirements, obligations } from '@/lib/data/requirements-obligations';
import { Shield, AlertTriangle, TrendingDown, Calendar, User, Building2, FileText, CheckCircle2, Target, Activity } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { notFound } from 'next/navigation';

export default function RiskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const risk = risks.find(r => r.id === id);

  if (!risk) {
    notFound();
  }

  // Get linked controls with effectiveness data
  const linkedControls = riskControlLinks
    .filter(link => link.riskId === risk.id)
    .map(link => ({
      ...controls.find(c => c.id === link.controlId)!,
      effectiveness: link.controlEffectiveness,
      effectivenessScore: link.effectivenessScore,
      isKeyControl: link.isKeyControl,
      likelihoodReduction: link.likelihoodReduction,
      impactReduction: link.impactReduction,
      notes: link.notes
    }));

  // Get linked requirements
  const linkedRequirements = riskRequirementLinks
    .filter(link => link.riskId === risk.id)
    .map(link => ({
      ...requirements.find(r => r.id === link.requirementId)!,
      relationshipType: link.relationshipType,
      notes: link.notes
    }));

  // Get linked obligations
  const linkedObligations = riskObligationLinks
    .filter(link => link.riskId === risk.id)
    .map(link => ({
      ...obligations.find(o => o.id === link.obligationId)!,
      relationshipType: link.relationshipType,
      notes: link.notes
    }));

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };



  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={risk.title}
        description={risk.code}
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-dark)] transition-all duration-200 text-p2 font-medium shadow-sm hover:shadow-md">
            <FileText size={18} />
            Edit Risk
          </button>
        }
      />

      {/* Risk Statement */}
      <div className="animate-fade-in-up delay-1 p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
        <p className="text-p3 font-semibold text-amber-900 mb-2">Risk Statement</p>
        <p className="text-p1 text-amber-900">{risk.riskStatement}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-5 gap-4 animate-fade-in-up delay-2">
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1">Category</p>
          <p className="text-p1 font-semibold text-[var(--foreground)]">{risk.category}</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1">Owner</p>
          <p className="text-p1 font-semibold text-[var(--foreground)]">{risk.owner}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-1">{risk.department}</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1">Status</p>
          <span className={clsx('inline-flex px-3 py-1 rounded-full text-p2 font-medium mt-1',
            risk.status === 'Active' && 'bg-blue-100 text-blue-700',
            risk.status === 'Monitoring' && 'bg-amber-100 text-amber-700',
            risk.status === 'Mitigated' && 'bg-emerald-100 text-emerald-700'
          )}>
            {risk.status}
          </span>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1">Last Assessment</p>
          <p className="text-p1 font-semibold text-[var(--foreground)]">{risk.lastAssessmentDate}</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1">Next Review</p>
          <p className="text-p1 font-semibold text-[var(--foreground)]">{risk.nextReviewDate}</p>
        </div>
      </div>

      {/* Risk Scores */}
      <div className="grid grid-cols-3 gap-6 animate-fade-in-up delay-3">
        {/* Inherent Risk */}
        <div className="p-6 rounded-xl bg-white border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-red-500" />
            <h3 className="text-h3 font-semibold text-[var(--foreground)]">Inherent Risk</h3>
          </div>
          <div className="flex items-center justify-center mb-4">
            <span className={clsx('inline-flex items-center gap-2 px-4 py-2 rounded-xl text-h2 font-bold border-2', getRatingColor(risk.inherentRating))}>
              {risk.inherentScore}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-p3 text-[var(--foreground-muted)] mb-1">Likelihood</p>
              <p className="text-h3 font-bold text-[var(--foreground)]">{risk.inherentLikelihood}</p>
            </div>
            <div>
              <p className="text-p3 text-[var(--foreground-muted)] mb-1">Impact</p>
              <p className="text-h3 font-bold text-[var(--foreground)]">{risk.inherentImpact}</p>
            </div>
          </div>
        </div>

        {/* Risk Reduction */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown size={20} className="text-emerald-600" />
            <h3 className="text-h3 font-semibold text-emerald-900">Risk Reduction</h3>
          </div>
          <div className="flex items-center justify-center mb-2">
            <p className="text-[64px] font-bold text-emerald-600 leading-none">{risk.riskReduction}%</p>
          </div>
          <p className="text-center text-p2 text-emerald-700 font-medium">
            {linkedControls.length} controls active
          </p>
        </div>

        {/* Residual Risk */}
        <div className="p-6 rounded-xl bg-white border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={20} className="text-[var(--primary)]" />
            <h3 className="text-h3 font-semibold text-[var(--foreground)]">Residual Risk</h3>
          </div>
          <div className="flex items-center justify-center mb-4">
            <span className={clsx('inline-flex items-center gap-2 px-4 py-2 rounded-xl text-h2 font-bold border-2', getRatingColor(risk.residualRating))}>
              {risk.residualScore}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-p3 text-[var(--foreground-muted)] mb-1">Likelihood</p>
              <p className="text-h3 font-bold text-[var(--foreground)]">{risk.residualLikelihood}</p>
            </div>
            <div>
              <p className="text-p3 text-[var(--foreground-muted)] mb-1">Impact</p>
              <p className="text-h3 font-bold text-[var(--foreground)]">{risk.residualImpact}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mitigating Controls */}
      <div className="animate-fade-in-up delay-4 bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="px-6 py-4 bg-[var(--background-secondary)] border-b border-[var(--border)]">
          <h3 className="text-h3 font-semibold text-[var(--foreground)] flex items-center gap-2">
            <Shield size={20} />
            Mitigating Controls ({linkedControls.length})
          </h3>
        </div>
        <div className="p-6">
          {linkedControls.length === 0 ? (
            <p className="text-p2 text-[var(--foreground-muted)] text-center py-8">No controls linked to this risk</p>
          ) : (
            <div className="space-y-4">
              {linkedControls.map((control) => (
                <Link
                  key={control.id}
                  href={`/controls/${control.id}`}
                  className="block p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-p1 font-semibold text-[var(--foreground)]">{control.name}</p>
                        {control.isKeyControl && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                            Key Control
                          </span>
                        )}
                      </div>
                      <p className="text-p3 text-[var(--foreground-muted)]">{control.code}</p>
                    </div>
                    <span className={clsx('px-3 py-1 rounded-full text-p3 font-medium',
                      control.effectiveness === 'Fully Effective' && 'bg-emerald-100 text-emerald-700',
                      control.effectiveness === 'Largely Effective' && 'bg-blue-100 text-blue-700',
                      control.effectiveness === 'Partially Effective' && 'bg-amber-100 text-amber-700',
                      control.effectiveness === 'Ineffective' && 'bg-red-100 text-red-700'
                    )}>
                      {control.effectiveness}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    {control.likelihoodReduction && (
                      <div className="flex items-center gap-2 text-p3">
                        <TrendingDown size={14} className="text-emerald-500" />
                        <span className="text-[var(--foreground-muted)]">Likelihood reduction:</span>
                        <span className="font-semibold text-emerald-600">-{control.likelihoodReduction}</span>
                      </div>
                    )}
                    {control.impactReduction && (
                      <div className="flex items-center gap-2 text-p3">
                        <Shield size={14} className="text-blue-500" />
                        <span className="text-[var(--foreground-muted)]">Impact reduction:</span>
                        <span className="font-semibold text-blue-600">-{control.impactReduction}</span>
                      </div>
                    )}
                  </div>
                  {control.notes && (
                    <p className="text-p3 text-[var(--foreground-muted)] mt-2 italic">{control.notes}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Linked Requirements */}
      <div className="animate-fade-in-up delay-5 bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="px-6 py-4 bg-[var(--background-secondary)] border-b border-[var(--border)]">
          <h3 className="text-h3 font-semibold text-[var(--foreground)] flex items-center gap-2">
            <CheckCircle2 size={20} />
            Linked Requirements ({linkedRequirements.length})
          </h3>
        </div>
        <div className="p-6">
          {linkedRequirements.length === 0 ? (
            <p className="text-p2 text-[var(--foreground-muted)] text-center py-8">No requirements linked to this risk</p>
          ) : (
            <div className="space-y-3">
              {linkedRequirements.map((req) => (
                <Link
                  key={req.id}
                  href={`/requirements/${req.id}`}
                  className="block p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-p1 font-semibold text-[var(--foreground)] mb-1">{req.title}</p>
                      <p className="text-p3 text-[var(--foreground-muted)]">{req.code}</p>
                    </div>
                    <span className="px-3 py-1 bg-[var(--primary-lightest)] text-[var(--primary)] rounded-full text-p3 font-medium">
                      {req.relationshipType}
                    </span>
                  </div>
                  {req.notes && (
                    <p className="text-p3 text-[var(--foreground-muted)] mt-2 italic">{req.notes}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Linked Obligations */}
      <div className="animate-fade-in-up delay-6 bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="px-6 py-4 bg-[var(--background-secondary)] border-b border-[var(--border)]">
          <h3 className="text-h3 font-semibold text-[var(--foreground)] flex items-center gap-2">
            <Calendar size={20} />
            Linked Obligations ({linkedObligations.length})
          </h3>
        </div>
        <div className="p-6">
          {linkedObligations.length === 0 ? (
            <p className="text-p2 text-[var(--foreground-muted)] text-center py-8">No obligations linked to this risk</p>
          ) : (
            <div className="space-y-3">
              {linkedObligations.map((obl) => (
                <Link
                  key={obl.id}
                  href={`/obligations/${obl.id}`}
                  className="block p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-p1 font-semibold text-[var(--foreground)] mb-1">{obl.title}</p>
                      <p className="text-p3 text-[var(--foreground-muted)]">{obl.code} • Due: {obl.dueDate}</p>
                    </div>
                    <span className="px-3 py-1 bg-[var(--primary-lightest)] text-[var(--primary)] rounded-full text-p3 font-medium">
                      {obl.relationshipType}
                    </span>
                  </div>
                  {obl.notes && (
                    <p className="text-p3 text-[var(--foreground-muted)] mt-2 italic">{obl.notes}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

