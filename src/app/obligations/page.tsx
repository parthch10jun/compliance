'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageHeader, SearchFilterBar, FilterButtonGroup, AddObligationModal } from '@/components';
import { obligations } from '@/lib/data/requirements-obligations';
import { programs } from '@/lib/data/mock-data';
import { Clock, Calendar, AlertTriangle, CheckCircle2, FileText, Bell, ChevronRight, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { formatDateShort, getDaysBetween, isOverdue } from '@/lib/utils';

type StatusFilter = 'all' | 'Upcoming' | 'In Progress' | 'Submitted' | 'Overdue' | 'Completed';

function ObligationsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const programId = searchParams.get('program');
  const selectedProgram = programId ? programs.find(p => p.id === programId) : null;

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredObligations = obligations.filter(obl => {
    const matchesSearch = obl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          obl.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          obl.obligationType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || obl.status === statusFilter;
    const matchesProgram = !programId || obl.programId === programId;
    return matchesSearch && matchesStatus && matchesProgram;
  });

  const displayObligations = programId
    ? obligations.filter(o => o.programId === programId)
    : obligations;

  const stats = {
    total: displayObligations.length,
    upcoming: displayObligations.filter(o => o.status === 'Upcoming').length,
    inProgress: displayObligations.filter(o => o.status === 'In Progress').length,
    overdue: displayObligations.filter(o => o.status === 'Overdue' || isOverdue(o.nextDueDate)).length,
    completed: displayObligations.filter(o => o.status === 'Completed').length,
    dueThisMonth: displayObligations.filter(o => {
      const daysUntilDue = getDaysBetween(o.nextDueDate);
      return daysUntilDue >= 0 && daysUntilDue <= 30;
    }).length,
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
              href="/obligations"
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
        title="Obligation Citations"
        description="Event-driven, time-bound compliance obligations with deadlines and triggers"
        action={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-dark)] transition-all duration-200 text-p2 font-medium shadow-sm hover:shadow-md"
          >
            <Calendar size={18} />
            Add Obligation
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-6 gap-4 animate-fade-in-up delay-1">
        <div className="p-5 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white shadow-md">
          <p className="text-white/70 text-p3 font-medium mb-1">Total Obligations</p>
          <p className="text-h2 font-bold tracking-tight">{stats.total}</p>
          <p className="text-p3 text-white/60 mt-2">Active tracking</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-p3 font-medium">Due This Month</p>
            <Calendar size={16} className="text-[var(--primary)]" />
          </div>
          <p className="text-h2 font-bold text-[var(--primary)]">{stats.dueThisMonth}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">Next 30 days</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-p3 font-medium">In Progress</p>
            <Clock size={16} className="text-blue-500" />
          </div>
          <p className="text-h2 font-bold text-blue-600">{stats.inProgress}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">Being prepared</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-p3 font-medium">Overdue</p>
            <AlertTriangle size={16} className="text-red-500" />
          </div>
          <p className="text-h2 font-bold text-red-600">{stats.overdue}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">Immediate action</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-p3 font-medium">Upcoming</p>
            <Bell size={16} className="text-amber-500" />
          </div>
          <p className="text-h2 font-bold text-amber-600">{stats.upcoming}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">Scheduled</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-p3 font-medium">Completed</p>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <p className="text-h2 font-bold text-emerald-600">{stats.completed}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">This period</p>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search obligations by code, title, or type..."
        filters={
          <FilterButtonGroup
            options={['all', 'Upcoming', 'In Progress', 'Submitted', 'Overdue', 'Completed']}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as StatusFilter)}
            label="Status"
          />
        }
      />

      {/* Obligations Table */}
      <div className="animate-fade-in-up delay-3 bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[var(--background-secondary)]">
            <tr>
              <th className="text-left px-6 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Obligation</th>
              <th className="text-left px-6 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Program</th>
              <th className="text-center px-6 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Type</th>
              <th className="text-center px-6 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Frequency</th>
              <th className="text-center px-6 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Due Date</th>
              <th className="text-center px-6 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Status</th>
              <th className="text-center px-6 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Risk</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredObligations.map((obl) => {
              const daysUntilDue = getDaysBetween(obl.nextDueDate);
              const isDueOverdue = isOverdue(obl.nextDueDate);
              const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 7;

              return (
                <tr key={obl.id} className="hover:bg-[var(--background-secondary)] transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/obligations/${obl.id}`} className="block group">
                      <p className="text-p2 font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">{obl.title}</p>
                      <p className="text-p3 text-[var(--foreground-muted)] mt-0.5">{obl.code} • {obl.section}</p>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/programs/${obl.programId}`} className="text-p2 text-[var(--primary)] hover:underline">
                      {obl.programName}
                    </Link>
                    <p className="text-p3 text-[var(--foreground-muted)] mt-0.5">{obl.tags[0] || 'Untagged'}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--primary-lightest)] text-[var(--primary)] rounded-full text-p3 font-medium">
                      <FileText size={12} />
                      {obl.obligationType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-p2 text-[var(--foreground)]">{obl.frequency}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className={clsx('text-p2 font-medium',
                      isDueOverdue && 'text-red-600',
                      isDueSoon && !isDueOverdue && 'text-amber-600',
                      !isDueSoon && !isDueOverdue && 'text-[var(--foreground)]'
                    )}>
                      {formatDateShort(obl.nextDueDate)}
                    </p>
                    <p className="text-p3 text-[var(--foreground-muted)] mt-0.5">
                      {isDueOverdue ? `${Math.abs(daysUntilDue)}d overdue` : `${daysUntilDue}d remaining`}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={clsx('inline-flex items-center gap-1 px-2 py-1 rounded-full text-p3 font-medium',
                      obl.status === 'Completed' && 'bg-emerald-100 text-emerald-700',
                      obl.status === 'Submitted' && 'bg-blue-100 text-blue-700',
                      obl.status === 'In Progress' && 'bg-amber-100 text-amber-700',
                      obl.status === 'Upcoming' && 'bg-gray-100 text-gray-700',
                      obl.status === 'Overdue' && 'bg-red-100 text-red-700'
                    )}>
                      {obl.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={clsx('inline-flex px-2 py-1 rounded-full text-p3 font-medium',
                      obl.riskRating === 'Critical' && 'bg-red-100 text-red-700',
                      obl.riskRating === 'High' && 'bg-orange-100 text-orange-700',
                      obl.riskRating === 'Medium' && 'bg-amber-100 text-amber-700',
                      obl.riskRating === 'Low' && 'bg-emerald-100 text-emerald-700'
                    )}>
                      {obl.riskRating}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/obligations/${obl.id}`}
                      className="text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
                    >
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Obligation Modal */}
      <AddObligationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(obligation) => {
          console.log('New obligation created:', obligation);
          // TODO: Add to obligations list
        }}
      />
    </div>
  );
}

export default function ObligationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    }>
      <ObligationsPageContent />
    </Suspense>
  );
}
