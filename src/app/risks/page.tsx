'use client';

import { useState } from 'react';
import { PageHeader, SearchFilterBar, FilterButtonGroup, RiskMapping } from '@/components';
import { risks } from '@/lib/data/risks';
import { Shield, AlertTriangle, TrendingDown, Activity, ChevronRight, Target } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

type RatingFilter = 'all' | 'Critical' | 'High' | 'Medium' | 'Low';

export default function RiskRegisterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all');

  const filteredRisks = risks.filter(risk => {
    const matchesSearch = risk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          risk.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          risk.riskStatement.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = ratingFilter === 'all' || risk.residualRating === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const stats = {
    total: risks.length,
    critical: risks.filter(r => r.residualRating === 'Critical').length,
    high: risks.filter(r => r.residualRating === 'High').length,
    medium: risks.filter(r => r.residualRating === 'Medium').length,
    low: risks.filter(r => r.residualRating === 'Low').length,
    avgReduction: Math.round(risks.reduce((acc, r) => acc + r.riskReduction, 0) / risks.length),
    totalControls: risks.reduce((acc, r) => acc + r.linkedControlIds.length, 0),
  };

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
        title="Risk Register"
        description="Identify, assess, and manage organizational risks with linked controls and compliance requirements"
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-dark)] transition-all duration-200 text-p2 font-medium shadow-sm hover:shadow-md">
            <AlertTriangle size={18} />
            Add Risk
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-7 gap-4 animate-fade-in-up delay-1">
        <div className="p-5 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white shadow-md">
          <p className="text-white/70 text-p3 font-medium mb-1">Total Risks</p>
          <p className="text-h2 font-bold tracking-tight">{stats.total}</p>
          <p className="text-p3 text-white/60 mt-2">Active tracking</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-red-200 hover:shadow-md transition-shadow">
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1">Critical</p>
          <p className="text-h2 font-bold text-red-600">{stats.critical}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">Score 15-25</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-orange-200 hover:shadow-md transition-shadow">
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1">High</p>
          <p className="text-h2 font-bold text-orange-600">{stats.high}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">Score 8-14</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-amber-200 hover:shadow-md transition-shadow">
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1">Medium</p>
          <p className="text-h2 font-bold text-amber-600">{stats.medium}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">Score 3-7</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-emerald-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-p3 font-medium">Low</p>
            <span className="text-xl">⚪</span>
          </div>
          <p className="text-h2 font-bold text-emerald-600">{stats.low}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">Score 1-2</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-p3 font-medium">Avg Reduction</p>
            <TrendingDown size={16} className="text-emerald-500" />
          </div>
          <p className="text-h2 font-bold text-emerald-600">{stats.avgReduction}%</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">Risk mitigated</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-p3 font-medium">Controls</p>
            <Shield size={16} className="text-[var(--primary)]" />
          </div>
          <p className="text-h2 font-bold text-[var(--foreground)]">{stats.totalControls}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">Active</p>
        </div>
      </div>

      {/* Risk Mapping Section */}
      <div className="animate-fade-in-up delay-2">
        <div className="mb-4">
          <h2 className="text-h3 font-bold text-[var(--foreground)] mb-1">Risk Mapping</h2>
          <p className="text-p3 text-[var(--foreground-muted)]">
            Visualize risk distribution across organizational dimensions with color-coded spectrum from green (low) to red (critical)
          </p>
        </div>
        <RiskMapping risks={risks} />
      </div>

      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search risks by code, title, or statement..."
        filters={
          <FilterButtonGroup
            options={['all', 'Critical', 'High', 'Medium', 'Low']}
            value={ratingFilter}
            onChange={(value) => setRatingFilter(value as RatingFilter)}
            label="Risk Level"
          />
        }
      />

      {/* Risk Register Table */}
      <div className="animate-fade-in-up delay-3 bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[var(--background-secondary)]">
            <tr>
              <th className="text-left px-6 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Risk</th>
              <th className="text-center px-6 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Category</th>
              <th className="text-center px-6 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Inherent</th>
              <th className="text-center px-6 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Residual</th>
              <th className="text-center px-6 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Reduction</th>
              <th className="text-center px-6 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Controls</th>
              <th className="text-center px-6 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredRisks.map((risk) => (
              <tr key={risk.id} className="hover:bg-[var(--background-secondary)] transition-colors">
                <td className="px-6 py-4">
                  <p className="text-p2 font-medium text-[var(--foreground)]">{risk.title}</p>
                  <p className="text-p3 text-[var(--foreground-muted)] mt-0.5">{risk.code} • {risk.owner}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex px-2 py-1 bg-[var(--primary-lightest)] text-[var(--primary)] rounded-full text-p3 font-medium">
                    {risk.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className={clsx('inline-flex items-center gap-1 px-2 py-1 rounded-full text-p3 font-medium border', getRatingColor(risk.inherentRating))}>
                      {risk.inherentScore}
                    </span>
                    <span className="text-p3 text-[var(--foreground-muted)]">({risk.inherentLikelihood}×{risk.inherentImpact})</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className={clsx('inline-flex items-center gap-1 px-2 py-1 rounded-full text-p3 font-medium border', getRatingColor(risk.residualRating))}>
                      {risk.residualScore}
                    </span>
                    <span className="text-p3 text-[var(--foreground-muted)]">({risk.residualLikelihood}×{risk.residualImpact})</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-p2 font-semibold text-emerald-600">{risk.riskReduction}%</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-p2 font-medium text-[var(--foreground)]">{risk.linkedControlIds.length}</span>
                    <span className="text-p3 text-[var(--foreground-muted)]">controls</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={clsx('inline-flex px-2 py-1 rounded-full text-p3 font-medium',
                    risk.status === 'Active' && 'bg-blue-100 text-blue-700',
                    risk.status === 'Monitoring' && 'bg-amber-100 text-amber-700',
                    risk.status === 'Mitigated' && 'bg-emerald-100 text-emerald-700',
                    risk.status === 'Accepted' && 'bg-gray-100 text-gray-700',
                    risk.status === 'Transferred' && 'bg-purple-100 text-purple-700',
                    risk.status === 'Closed' && 'bg-slate-100 text-slate-700'
                  )}>
                    {risk.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/risks/${risk.id}`} className="text-[var(--foreground-muted)] hover:text-[var(--primary)]">
                    <ChevronRight size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="animate-fade-in-up delay-4 p-4 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)]">
        <p className="text-p3 font-semibold text-[var(--foreground)] mb-2">Risk Rating Legend</p>
        <div className="flex items-center gap-6 text-p3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-[var(--foreground-muted)]">Critical (15-25)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-[var(--foreground-muted)]">High (8-14)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-[var(--foreground-muted)]">Medium (3-7)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-[var(--foreground-muted)]">Low (1-2)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

