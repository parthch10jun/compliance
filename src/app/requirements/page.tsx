'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageHeader, SearchFilterBar, FilterButtonGroup, AddRequirementModal } from '@/components';
import { requirements } from '@/lib/data/requirements-obligations';
import { programs } from '@/lib/data/mock-data';
import { Shield, TrendingUp, CheckCircle2, AlertTriangle, XCircle, ChevronRight, Plus, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

type StatusFilter = 'all' | 'Compliant' | 'Partially Compliant' | 'Non-Compliant' | 'Not Assessed';

function RequirementsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const programId = searchParams.get('program');
  const selectedProgram = programId ? programs.find(p => p.id === programId) : null;

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredRequirements = requirements.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesProgram = !programId || req.programId === programId;
    return matchesSearch && matchesStatus && matchesProgram;
  });

  const displayRequirements = programId
    ? requirements.filter(r => r.programId === programId)
    : requirements;

  const stats = {
    total: displayRequirements.length,
    compliant: displayRequirements.filter(r => r.status === 'Compliant').length,
    partiallyCompliant: displayRequirements.filter(r => r.status === 'Partially Compliant').length,
    nonCompliant: displayRequirements.filter(r => r.status === 'Non-Compliant').length,
    avgScore: displayRequirements.length > 0 ? Math.round(displayRequirements.reduce((acc, r) => acc + (r.complianceScore || 0), 0) / displayRequirements.length) : 0,
  };

  return (
    <div className="space-y-6">
      {/* Program Filter Banner */}
      {selectedProgram && (
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-p3 text-cyan-700 font-medium">Filtered by Program</p>
            <p className="text-p1 font-semibold text-cyan-900 mt-1">{selectedProgram.name}</p>
            <p className="text-p3 text-cyan-600 mt-0.5">{selectedProgram.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-p3 font-medium"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <Link
              href="/requirements"
              className="flex items-center gap-2 px-3 py-2 bg-white text-cyan-700 rounded-lg hover:bg-cyan-50 transition-colors text-p3 font-medium border border-cyan-200"
            >
              <X size={16} />
              Clear Filter
            </Link>
          </div>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Requirement Citations"
        description={selectedProgram ? `Requirements mandated by ${selectedProgram.framework}` : "Continuous-state compliance requirements from regulatory authorities"}
        data-tour="requirements-header"
        action={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-dark)] transition-all duration-200 text-p2 font-medium shadow-sm hover:shadow-md"
          >
            <Plus size={18} />
            Add Requirement
          </button>
        }
      />

      {/* Add Requirement Modal */}
      <AddRequirementModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(req) => console.log('Added requirement:', req)}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4 animate-fade-in-up delay-1" data-tour="requirements-kpis">
        <div className="p-5 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white shadow-md">
          <p className="text-white/70 text-p3 font-medium mb-1">Total Requirements</p>
          <p className="text-h2 font-bold tracking-tight">{stats.total}</p>
          <p className="text-p3 text-white/60 mt-2">Continuous monitoring</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-p3 font-medium">Compliant</p>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <p className="text-h2 font-bold text-emerald-600">{stats.compliant}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">{Math.round((stats.compliant / stats.total) * 100)}% of total</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-p3 font-medium">Partially Compliant</p>
            <AlertTriangle size={16} className="text-amber-500" />
          </div>
          <p className="text-h2 font-bold text-amber-600">{stats.partiallyCompliant}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">Needs attention</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-p3 font-medium">Non-Compliant</p>
            <XCircle size={16} className="text-red-500" />
          </div>
          <p className="text-h2 font-bold text-red-600">{stats.nonCompliant}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">Immediate action</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-p3 font-medium">Avg Score</p>
            <TrendingUp size={16} className="text-[var(--primary)]" />
          </div>
          <p className="text-h2 font-bold text-[var(--foreground)]">{stats.avgScore}%</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">Overall compliance</p>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search requirements by code, title, or category..."
        filters={
          <FilterButtonGroup
            options={['all', 'Compliant', 'Partially Compliant', 'Non-Compliant', 'Not Assessed']}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as StatusFilter)}
            label="Status"
          />
        }
      />

      {/* Requirements Table */}
      <div className="animate-fade-in-up delay-3 bg-white rounded-xl border border-[var(--border)] overflow-hidden" data-tour="requirements-table">
        <table className="w-full">
          <thead className="bg-[var(--background-secondary)]">
            <tr>
              <th className="text-left px-6 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Requirement</th>
              <th className="text-left px-6 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Program</th>
              <th className="text-center px-6 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Category</th>
              <th className="text-center px-6 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Risk</th>
              <th className="text-center px-6 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Status</th>
              <th className="text-center px-6 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Score</th>
              <th className="text-center px-6 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Controls</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredRequirements.map((req) => (
              <tr key={req.id} className="hover:bg-[var(--background-secondary)] transition-colors">
                <td className="px-6 py-4">
                  <Link href={`/requirements/${req.id}`} className="block group">
                    <p className="text-p2 font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">{req.title}</p>
                    <p className="text-p3 text-[var(--foreground-muted)] mt-0.5">{req.code} • {req.section}</p>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/programs/${req.programId}`} className="text-p2 text-[var(--primary)] hover:underline">
                    {req.programName}
                  </Link>
                  <p className="text-p3 text-[var(--foreground-muted)] mt-0.5">{req.tags[0] || 'Untagged'}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-p2 text-[var(--foreground)]">{req.category}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={clsx('inline-flex px-2 py-1 rounded-full text-p3 font-medium',
                    req.riskRating === 'Critical' && 'bg-red-100 text-red-700',
                    req.riskRating === 'High' && 'bg-orange-100 text-orange-700',
                    req.riskRating === 'Medium' && 'bg-amber-100 text-amber-700',
                    req.riskRating === 'Low' && 'bg-emerald-100 text-emerald-700'
                  )}>
                    {req.riskRating}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={clsx('inline-flex items-center gap-1 px-2 py-1 rounded-full text-p3 font-medium',
                    req.status === 'Compliant' && 'bg-emerald-100 text-emerald-700',
                    req.status === 'Partially Compliant' && 'bg-amber-100 text-amber-700',
                    req.status === 'Non-Compliant' && 'bg-red-100 text-red-700',
                    req.status === 'Not Assessed' && 'bg-gray-100 text-gray-700'
                  )}>
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-p2 font-semibold text-[var(--foreground)]">{req.complianceScore}%</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-p2 text-[var(--foreground)]">{req.controlCount}</span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/requirements/${req.id}`}
                    className="text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
                  >
                    <ChevronRight size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function RequirementsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    }>
      <RequirementsPageContent />
    </Suspense>
  );
}
