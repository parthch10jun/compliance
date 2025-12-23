'use client';

import { useState } from 'react';
import { FileStack, Search, Filter, ChevronRight, Plus, Grid3X3, List, AlertCircle, CheckCircle, MinusCircle, HelpCircle } from 'lucide-react';
import clsx from 'clsx';

// Mock Citations Data
const mockCitations = [
  { id: 'CIT-001', title: 'Capital Adequacy Requirements', section: 'Section 3.1', programId: 'PRG-001', programName: 'RBI Master Directions', authorityName: 'RBI', category: 'Capital', status: 'Compliant', hasObligation: true, obligationType: 'Reporting', controls: 5, riskRating: 3 },
  { id: 'CIT-002', title: 'Asset Classification Norms', section: 'Section 4.2', programId: 'PRG-001', programName: 'RBI Master Directions', authorityName: 'RBI', category: 'Assets', status: 'Partially Compliant', hasObligation: true, obligationType: 'Disclosure', controls: 8, riskRating: 4 },
  { id: 'CIT-003', title: 'KYC/AML Compliance', section: 'Section 5.1', programId: 'PRG-002', programName: 'PMLA Compliance', authorityName: 'RBI', category: 'AML', status: 'Compliant', hasObligation: true, obligationType: 'Filing', controls: 12, riskRating: 5 },
  { id: 'CIT-004', title: 'Information Security Controls', section: 'A.5-A.8', programId: 'PRG-003', programName: 'ISO 27001:2022', authorityName: 'ISO', category: 'Security', status: 'Compliant', hasObligation: false, controls: 15, riskRating: 4 },
  { id: 'CIT-005', title: 'Access Control Requirements', section: 'A.9', programId: 'PRG-003', programName: 'ISO 27001:2022', authorityName: 'ISO', category: 'Access', status: 'Partially Compliant', hasObligation: false, controls: 7, riskRating: 3 },
  { id: 'CIT-006', title: 'Data Subject Rights', section: 'Article 15-22', programId: 'PRG-004', programName: 'GDPR Compliance', authorityName: 'EU', category: 'Privacy', status: 'Non-Compliant', hasObligation: true, obligationType: 'Notification', controls: 10, riskRating: 5 },
  { id: 'CIT-007', title: 'Data Processing Principles', section: 'Article 5-6', programId: 'PRG-004', programName: 'GDPR Compliance', authorityName: 'EU', category: 'Privacy', status: 'Compliant', hasObligation: true, obligationType: 'Disclosure', controls: 6, riskRating: 4 },
  { id: 'CIT-008', title: 'Data Localization', section: 'Article 29', programId: 'PRG-005', programName: 'PDPL Compliance', authorityName: 'SDAIA', category: 'Data', status: 'Not Assessed', hasObligation: true, obligationType: 'Filing', controls: 3, riskRating: 4 },
];

const statusConfig = {
  'Compliant': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  'Partially Compliant': { icon: MinusCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
  'Non-Compliant': { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  'Not Assessed': { icon: HelpCircle, color: 'text-gray-500', bg: 'bg-gray-50' },
};

export default function CitationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [programFilter, setProgramFilter] = useState<string>('all');

  const programs = ['all', ...new Set(mockCitations.map(c => c.programName))];
  const statuses = ['all', 'Compliant', 'Partially Compliant', 'Non-Compliant', 'Not Assessed'];

  const filteredCitations = mockCitations.filter(cit => {
    const matchesSearch = cit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cit.section.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cit.status === statusFilter;
    const matchesProgram = programFilter === 'all' || cit.programName === programFilter;
    return matchesSearch && matchesStatus && matchesProgram;
  });

  const stats = {
    total: mockCitations.length,
    compliant: mockCitations.filter(c => c.status === 'Compliant').length,
    partial: mockCitations.filter(c => c.status === 'Partially Compliant').length,
    nonCompliant: mockCitations.filter(c => c.status === 'Non-Compliant').length,
    withObligations: mockCitations.filter(c => c.hasObligation).length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Citations & Requirements</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            Regulatory requirements, clauses, and compliance areas linked to programs
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors">
          <Plus size={18} />
          <span>Add Citation</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4 animate-fade-in-up">
        <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
          <p className="text-sm text-[var(--foreground-muted)]">Total Citations</p>
          <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{stats.total}</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
          <p className="text-sm text-[var(--foreground-muted)]">Compliant</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.compliant}</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
          <p className="text-sm text-[var(--foreground-muted)]">Partially Compliant</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.partial}</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
          <p className="text-sm text-[var(--foreground-muted)]">Non-Compliant</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.nonCompliant}</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
          <p className="text-sm text-[var(--foreground-muted)]">With Obligations</p>
          <p className="text-2xl font-bold text-[var(--primary)] mt-1">{stats.withObligations}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 animate-fade-in-up delay-1">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
          <input
            type="text"
            placeholder="Search citations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <select
          value={programFilter}
          onChange={(e) => setProgramFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--foreground)] focus:outline-none"
        >
          {programs.map(p => (
            <option key={p} value={p}>{p === 'all' ? 'All Programs' : p}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--foreground)] focus:outline-none"
        >
          {statuses.map(s => (
            <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</option>
          ))}
        </select>
        <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
          <button onClick={() => setViewMode('grid')} className={clsx('p-2', viewMode === 'grid' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--card-bg)] text-[var(--foreground-muted)]')}>
            <Grid3X3 size={18} />
          </button>
          <button onClick={() => setViewMode('list')} className={clsx('p-2', viewMode === 'list' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--card-bg)] text-[var(--foreground-muted)]')}>
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Results */}
      <p className="text-sm text-[var(--foreground-muted)]">Showing {filteredCitations.length} citations</p>

      {/* Citations Table */}
      <div className="rounded-xl border border-[var(--border)] overflow-hidden animate-fade-in-up delay-2">
        <table className="w-full">
          <thead className="bg-[var(--sidebar-bg)]">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-[var(--foreground-muted)]">Citation</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[var(--foreground-muted)]">Program</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[var(--foreground-muted)]">Category</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[var(--foreground-muted)]">Status</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-[var(--foreground-muted)]">Obligation</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-[var(--foreground-muted)]">Controls</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-[var(--foreground-muted)]">Risk</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredCitations.map(cit => {
              const StatusIcon = statusConfig[cit.status as keyof typeof statusConfig].icon;
              return (
                <tr key={cit.id} className="hover:bg-[var(--sidebar-hover)] cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileStack size={18} className="text-[var(--primary)]" />
                      <div>
                        <p className="font-medium text-[var(--foreground)]">{cit.title}</p>
                        <p className="text-xs text-[var(--foreground-muted)]">{cit.section}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-[var(--foreground)]">{cit.programName}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">{cit.authorityName}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--foreground)]">{cit.category}</td>
                  <td className="px-4 py-3">
                    <span className={clsx('inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', statusConfig[cit.status as keyof typeof statusConfig].bg, statusConfig[cit.status as keyof typeof statusConfig].color)}>
                      <StatusIcon size={12} />
                      {cit.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {cit.hasObligation ? (
                      <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-medium">{cit.obligationType}</span>
                    ) : (
                      <span className="text-[var(--foreground-muted)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-medium text-[var(--foreground)]">{cit.controls}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={clsx('w-2 h-2 rounded-full', i <= cit.riskRating ? 'bg-red-500' : 'bg-gray-200')} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3"><ChevronRight size={18} className="text-[var(--foreground-muted)]" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

