'use client';

import { useState } from 'react';
import { FlaskConical, Plus, Grid3X3, List, CheckCircle, XCircle, Clock, PlayCircle, Circle, Link2, Calendar, Search } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, SearchFilterBar, FilterButtonGroup } from '@/components';

// Mock Tests Data (Shared Library - can be linked to multiple controls)
const mockTests = [
  { id: 'TST-001', code: 'TST-001', name: 'Access Control Verification', type: 'Operating Effectiveness', frequency: 'Quarterly', linkedControls: ['CTRL-001', 'CTRL-005', 'CTRL-012'], status: 'Passed', scheduledDate: '2024-01-15', completedDate: '2024-01-15', tester: 'John Smith', evidenceCount: 3 },
  { id: 'TST-002', code: 'TST-002', name: 'Password Policy Compliance', type: 'Design', frequency: 'Annual', linkedControls: ['CTRL-002'], status: 'Passed', scheduledDate: '2024-01-10', completedDate: '2024-01-10', tester: 'Sarah Johnson', evidenceCount: 2 },
  { id: 'TST-003', code: 'TST-003', name: 'Data Backup Verification', type: 'Operating Effectiveness', frequency: 'Monthly', linkedControls: ['CTRL-003', 'CTRL-008'], status: 'Failed', scheduledDate: '2024-01-20', completedDate: '2024-01-20', tester: 'Mike Chen', evidenceCount: 4 },
  { id: 'TST-004', code: 'TST-004', name: 'Encryption Standards Check', type: 'Design', frequency: 'Quarterly', linkedControls: ['CTRL-004', 'CTRL-009', 'CTRL-015'], status: 'In Progress', scheduledDate: '2024-01-25', tester: 'Emily Davis', evidenceCount: 1 },
  { id: 'TST-005', code: 'TST-005', name: 'Incident Response Drill', type: 'Walkthrough', frequency: 'Annual', linkedControls: ['CTRL-006', 'CTRL-007'], status: 'Pending', scheduledDate: '2024-02-01', tester: 'Alex Wilson', evidenceCount: 0 },
  { id: 'TST-006', code: 'TST-006', name: 'Vendor Access Review', type: 'Operating Effectiveness', frequency: 'Quarterly', linkedControls: ['CTRL-010'], status: 'Not Started', scheduledDate: '2024-02-15', tester: 'Lisa Brown', evidenceCount: 0 },
  { id: 'TST-007', code: 'TST-007', name: 'Change Management Audit', type: 'Operating Effectiveness', frequency: 'Monthly', linkedControls: ['CTRL-011', 'CTRL-014'], status: 'Passed', scheduledDate: '2024-01-05', completedDate: '2024-01-05', tester: 'David Lee', evidenceCount: 5 },
  { id: 'TST-008', code: 'TST-008', name: 'Network Segmentation Test', type: 'Design', frequency: 'Annual', linkedControls: ['CTRL-013'], status: 'Passed', scheduledDate: '2024-01-08', completedDate: '2024-01-08', tester: 'Rachel Kim', evidenceCount: 2 },
];

const statusConfig = {
  'Passed': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  'Failed': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  'In Progress': { icon: PlayCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
  'Pending': { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  'Not Started': { icon: Circle, color: 'text-gray-500', bg: 'bg-gray-50' },
};

export default function TestsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const types = ['all', 'Design', 'Operating Effectiveness', 'Walkthrough'];
  const statuses = ['all', 'Passed', 'Failed', 'In Progress', 'Pending', 'Not Started'];

  const filteredTests = mockTests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) || test.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
    const matchesType = typeFilter === 'all' || test.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: mockTests.length,
    passed: mockTests.filter(t => t.status === 'Passed').length,
    failed: mockTests.filter(t => t.status === 'Failed').length,
    inProgress: mockTests.filter(t => t.status === 'In Progress').length,
    pending: mockTests.filter(t => t.status === 'Pending' || t.status === 'Not Started').length,
    reusedAcrossControls: mockTests.filter(t => t.linkedControls.length > 1).length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Test Library"
        description="Reusable tests that can be linked to multiple controls across programs"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Tests' }
        ]}
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-dark)] transition-all duration-200 text-p2 font-medium shadow-sm hover:shadow-md">
            <Plus size={18} />
            <span>Add Test</span>
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-6 gap-4 animate-fade-in-up delay-1">
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-p3 text-[var(--foreground-muted)] font-medium">Total Tests</p>
          <p className="text-h2 font-bold text-[var(--foreground)] mt-1">{stats.total}</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-p3 text-[var(--foreground-muted)] font-medium">Passed</p>
          <p className="text-h2 font-bold text-green-600 mt-1">{stats.passed}</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-p3 text-[var(--foreground-muted)] font-medium">Failed</p>
          <p className="text-h2 font-bold text-red-600 mt-1">{stats.failed}</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-p3 text-[var(--foreground-muted)] font-medium">In Progress</p>
          <p className="text-h2 font-bold text-blue-600 mt-1">{stats.inProgress}</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-p3 text-[var(--foreground-muted)] font-medium">Pending</p>
          <p className="text-h2 font-bold text-amber-600 mt-1">{stats.pending}</p>
        </div>
        <div className="p-5 rounded-xl bg-[var(--primary-lightest)] border border-[var(--primary)] hover:shadow-md transition-shadow">
          <p className="text-p3 text-[var(--primary)] font-medium">Reused Tests</p>
          <p className="text-h2 font-bold text-[var(--primary)] mt-1">{stats.reusedAcrossControls}</p>
          <p className="text-p3 text-[var(--primary)] mt-0.5">Linked to 2+ controls</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 animate-fade-in-up delay-1">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
          <input type="text" placeholder="Search tests..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--foreground)] focus:outline-none">
          {types.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--foreground)] focus:outline-none">
          {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</option>)}
        </select>
        <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
          <button onClick={() => setViewMode('grid')} className={clsx('p-2', viewMode === 'grid' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--card-bg)] text-[var(--foreground-muted)]')}><Grid3X3 size={18} /></button>
          <button onClick={() => setViewMode('list')} className={clsx('p-2', viewMode === 'list' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--card-bg)] text-[var(--foreground-muted)]')}><List size={18} /></button>
        </div>
      </div>

      <p className="text-sm text-[var(--foreground-muted)]">Showing {filteredTests.length} tests</p>

      {/* Tests Table */}
      <div className="rounded-xl border border-[var(--border)] overflow-hidden animate-fade-in-up delay-2 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-[var(--background-secondary)]">
            <tr>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Test</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Type</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Frequency</th>
              <th className="text-center px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Linked Controls</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Scheduled</th>
              <th className="text-center px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Evidence</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Tester</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] bg-white">
            {filteredTests.map(test => {
              const StatusIcon = statusConfig[test.status as keyof typeof statusConfig].icon;
              return (
                <tr key={test.id} className="hover:bg-[var(--background-secondary)] cursor-pointer transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FlaskConical size={18} className="text-[var(--primary)]" />
                      <div>
                        <p className="text-p2 font-medium text-[var(--foreground)]">{test.name}</p>
                        <p className="text-p3 text-[var(--foreground-muted)]">{test.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-p2 text-[var(--foreground)]">{test.type}</td>
                  <td className="px-6 py-4 text-p2 text-[var(--foreground)]">{test.frequency}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={clsx('inline-flex items-center gap-1 px-2 py-1 rounded-full text-p3 font-medium', test.linkedControls.length > 1 ? 'bg-[var(--primary-lightest)] text-[var(--primary)]' : 'bg-gray-100 text-gray-600')}>
                      <Link2 size={12} />
                      {test.linkedControls.length}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx('inline-flex items-center gap-1 px-2 py-1 rounded-full text-p3 font-medium', statusConfig[test.status as keyof typeof statusConfig].bg, statusConfig[test.status as keyof typeof statusConfig].color)}>
                      <StatusIcon size={12} />{test.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-p2 text-[var(--foreground)]">
                    <div className="flex items-center gap-1"><Calendar size={14} className="text-[var(--foreground-muted)]" />{test.scheduledDate}</div>
                  </td>
                  <td className="px-6 py-4 text-center text-p2 font-medium text-[var(--foreground)]">{test.evidenceCount}</td>
                  <td className="px-6 py-4 text-p2 text-[var(--foreground)]">{test.tester}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

