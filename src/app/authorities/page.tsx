'use client';

import { useState } from 'react';
import { Building2, Search, Filter, ChevronRight, TrendingUp, TrendingDown, Plus, Grid3X3, List } from 'lucide-react';
import clsx from 'clsx';
import { authorities, dashboardMetrics } from '@/lib/data/mock-data';

type ViewMode = 'grid' | 'list';

export default function AuthoritiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const types = ['all', 'Regulator', 'Standards Body', 'Industry Body'];

  const filteredAuthorities = authorities.filter(auth => {
    const matchesSearch = auth.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         auth.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || auth.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Authorities & Regulators</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            Manage regulatory bodies, standards organizations, and their compliance programs
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors">
          <Plus size={18} />
          <span>Add Authority</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 animate-fade-in-up">
        <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
          <p className="text-sm text-[var(--foreground-muted)]">Total Authorities</p>
          <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{dashboardMetrics.totalAuthorities}</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
          <p className="text-sm text-[var(--foreground-muted)]">Active Programs</p>
          <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{dashboardMetrics.activePrograms}</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
          <p className="text-sm text-[var(--foreground-muted)]">Total Citations</p>
          <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{dashboardMetrics.totalCitations}</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
          <p className="text-sm text-[var(--foreground-muted)]">Overall Compliance</p>
          <p className="text-2xl font-bold text-[var(--primary)] mt-1">{dashboardMetrics.overallCompliance}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 animate-fade-in-up delay-1">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
          <input
            type="text"
            placeholder="Search authorities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[var(--foreground-muted)]" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            {types.map(type => (
              <option key={type} value={type}>{type === 'all' ? 'All Types' : type}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={clsx('p-2', viewMode === 'grid' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--card-bg)] text-[var(--foreground-muted)]')}
          >
            <Grid3X3 size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={clsx('p-2', viewMode === 'list' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--card-bg)] text-[var(--foreground-muted)]')}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-[var(--foreground-muted)]">
        Showing {filteredAuthorities.length} of {authorities.length} authorities
      </p>

      {/* Authorities Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up delay-2">
          {filteredAuthorities.map((auth, idx) => (
            <div
              key={auth.id}
              className="p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-lg transition-all cursor-pointer group"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary-lightest)] flex items-center justify-center">
                    <Building2 size={20} className="text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">{auth.name}</h3>
                    <p className="text-xs text-[var(--foreground-muted)]">{auth.type}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-[var(--foreground-muted)] group-hover:text-[var(--primary)] transition-colors" />
              </div>
              <p className="text-sm text-[var(--foreground-muted)] mb-4 line-clamp-2">{auth.fullName}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--foreground-muted)]">{auth.jurisdiction}</span>
                <div className="flex items-center gap-1">
                  <span className={clsx('font-semibold', auth.compliance >= 80 ? 'text-green-600' : auth.compliance >= 60 ? 'text-amber-600' : 'text-red-600')}>
                    {auth.compliance}%
                  </span>
                  {auth.trend > 0 ? (
                    <TrendingUp size={14} className="text-green-600" />
                  ) : (
                    <TrendingDown size={14} className="text-red-600" />
                  )}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[var(--border)] grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-semibold text-[var(--foreground)]">{auth.programs}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">Programs</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-[var(--foreground)]">{auth.citations}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">Citations</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-[var(--foreground)]">{auth.controls}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">Controls</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--border)] overflow-hidden animate-fade-in-up delay-2">
          {/* List view table will continue... */}
        </div>
      )}
    </div>
  );
}

