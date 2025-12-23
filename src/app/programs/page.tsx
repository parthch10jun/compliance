'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search, Filter, ChevronRight, ChevronDown, Plus, LayoutGrid, List,
  TrendingUp, TrendingDown, Shield, AlertTriangle, CheckCircle2, Clock,
  Building2, Users, Calendar, MoreHorizontal, ArrowUpRight
} from 'lucide-react';
import { programs, dashboardMetrics } from '@/lib/data/mock-data';

type ViewMode = 'grid' | 'list';
type StatusFilter = 'all' | 'Active' | 'Draft' | 'Under Review' | 'Archived';

export default function ProgramsDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrograms = programs.filter(pgm => {
    const matchesStatus = statusFilter === 'all' || pgm.status === statusFilter;
    const matchesSearch = pgm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pgm.authorityName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    all: programs.length,
    Active: programs.filter(p => p.status === 'Active').length,
    Draft: programs.filter(p => p.status === 'Draft').length,
    'Under Review': programs.filter(p => p.status === 'Under Review').length,
    Archived: programs.filter(p => p.status === 'Archived').length,
  };

  const avgCompliance = Math.round(programs.reduce((acc, p) => acc + p.complianceScore, 0) / programs.length);

  return (
    <div>
      {/* Header */}
      <div className="animate-fade-in-up mb-8">
        <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-2">
          <Link href="/" className="hover:text-[var(--primary)]">Dashboard</Link>
          <ChevronRight size={14} />
          <span className="text-[var(--foreground)]">Programs</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">Compliance Programs</h1>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">Manage and monitor all compliance programs</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors text-sm font-medium">
            <Plus size={16} />
            New Program
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="animate-fade-in-up delay-1 grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-xl p-5 text-white">
          <p className="text-white/70 text-xs font-medium mb-1">Avg. Compliance</p>
          <p className="text-3xl font-bold tracking-tight">{avgCompliance}%</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-white/80">
            <TrendingUp size={12} />
            <span>+2.4% from last month</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5">
          <p className="text-[var(--foreground-muted)] text-xs font-medium mb-1">Total Programs</p>
          <p className="text-3xl font-bold tracking-tight text-[var(--foreground)]">{programs.length}</p>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">{statusCounts.Active} active</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5">
          <p className="text-[var(--foreground-muted)] text-xs font-medium mb-1">Total Controls</p>
          <p className="text-3xl font-bold tracking-tight text-[var(--foreground)]">{programs.reduce((acc, p) => acc + p.controls, 0)}</p>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">Across all programs</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5">
          <p className="text-[var(--foreground-muted)] text-xs font-medium mb-1">Tests Passed</p>
          <p className="text-3xl font-bold tracking-tight text-emerald-600">{programs.reduce((acc, p) => acc + p.testsPassed, 0)}</p>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">of {programs.reduce((acc, p) => acc + p.tests, 0)} total</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5">
          <p className="text-[var(--foreground-muted)] text-xs font-medium mb-1">Tests Failed</p>
          <p className="text-3xl font-bold tracking-tight text-red-600">{programs.reduce((acc, p) => acc + p.testsFailed, 0)}</p>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">Requires attention</p>
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="animate-fade-in-up delay-2 flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            />
          </div>
          {/* Status Filter */}
          <div className="flex items-center bg-white border border-[var(--border)] rounded-lg overflow-hidden">
            {(['all', 'Active', 'Draft', 'Under Review'] as StatusFilter[]).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]'
                }`}
              >
                {status === 'all' ? 'All' : status} ({statusCounts[status]})
              </button>
            ))}
          </div>
        </div>
        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white border border-[var(--border)] rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[var(--primary-lightest)] text-[var(--primary)]' : 'text-[var(--foreground-muted)]'}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-[var(--primary-lightest)] text-[var(--primary)]' : 'text-[var(--foreground-muted)]'}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Programs Grid/List */}
      {viewMode === 'grid' ? (
        <div className="animate-fade-in-up delay-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrograms.map((pgm, idx) => (
            <Link key={pgm.id} href={`/programs/${pgm.id}`} className="group">
              <div className="bg-white rounded-xl border border-[var(--border)] p-6 hover:shadow-lg hover:border-[var(--primary-light)] transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-[var(--primary-lightest)] text-[var(--primary)] rounded text-xs font-semibold mb-2">
                      {pgm.authorityName}
                    </span>
                    <h3 className="text-base font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">{pgm.name}</h3>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    pgm.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                    pgm.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                    pgm.status === 'Under Review' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {pgm.status}
                  </span>
                </div>

                {/* Compliance Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-[var(--foreground-muted)]">Compliance Score</span>
                    <span className={`text-sm font-semibold ${
                      pgm.complianceScore >= 90 ? 'text-emerald-600' :
                      pgm.complianceScore >= 80 ? 'text-[var(--primary)]' :
                      pgm.complianceScore >= 70 ? 'text-amber-600' : 'text-red-600'
                    }`}>{pgm.complianceScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pgm.complianceScore >= 90 ? 'bg-emerald-500' :
                        pgm.complianceScore >= 80 ? 'bg-[var(--primary)]' :
                        pgm.complianceScore >= 70 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${pgm.complianceScore}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 bg-[var(--background-secondary)] rounded-lg">
                    <p className="text-lg font-semibold text-[var(--foreground)]">{pgm.citations}</p>
                    <p className="text-[10px] text-[var(--foreground-muted)]">Citations</p>
                  </div>
                  <div className="text-center p-2 bg-[var(--background-secondary)] rounded-lg">
                    <p className="text-lg font-semibold text-[var(--foreground)]">{pgm.controls}</p>
                    <p className="text-[10px] text-[var(--foreground-muted)]">Controls</p>
                  </div>
                  <div className="text-center p-2 bg-[var(--background-secondary)] rounded-lg">
                    <p className="text-lg font-semibold text-[var(--foreground)]">{pgm.tests}</p>
                    <p className="text-[10px] text-[var(--foreground-muted)]">Tests</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[var(--primary-lightest)] flex items-center justify-center">
                      <Users size={12} className="text-[var(--primary)]" />
                    </div>
                    <span className="text-xs text-[var(--foreground-muted)]">{pgm.owner}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    pgm.riskRating === 'Critical' ? 'bg-red-100 text-red-700' :
                    pgm.riskRating === 'High' ? 'bg-orange-100 text-orange-700' :
                    pgm.riskRating === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {pgm.riskRating} Risk
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="animate-fade-in-up delay-3 bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--background-secondary)]">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Program</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Authority</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Compliance</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Controls</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Tests</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Risk</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredPrograms.map((pgm) => (
                <tr key={pgm.id} className="hover:bg-[var(--background-secondary)] transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/programs/${pgm.id}`} className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)]">
                      {pgm.name}
                    </Link>
                    <p className="text-xs text-[var(--foreground-muted)]">{pgm.owner}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-0.5 bg-[var(--primary-lightest)] text-[var(--primary)] rounded text-xs font-semibold">
                      {pgm.authorityName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-semibold ${
                      pgm.complianceScore >= 90 ? 'text-emerald-600' :
                      pgm.complianceScore >= 80 ? 'text-[var(--primary)]' :
                      pgm.complianceScore >= 70 ? 'text-amber-600' : 'text-red-600'
                    }`}>{pgm.complianceScore}%</span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-[var(--foreground)]">{pgm.controls}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <span className="text-emerald-600">{pgm.testsPassed}✓</span>
                      <span className="text-red-600">{pgm.testsFailed}✗</span>
                      <span className="text-amber-600">{pgm.testsPending}○</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      pgm.riskRating === 'Critical' ? 'bg-red-100 text-red-700' :
                      pgm.riskRating === 'High' ? 'bg-orange-100 text-orange-700' :
                      pgm.riskRating === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>{pgm.riskRating}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      pgm.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                      pgm.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                      pgm.status === 'Under Review' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>{pgm.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/programs/${pgm.id}`} className="text-[var(--primary)] hover:text-[var(--primary-dark)]">
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

