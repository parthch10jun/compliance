'use client';

import { useState } from 'react';
import { Search, Shield, Plus, Calendar, ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { formatDateShort, formatDateRange } from '@/lib/utils';

interface Audit {
  id: string;
  title: string;
  framework: string;
  type: 'Internal' | 'External';
  status: 'Scheduled' | 'In Progress' | 'Complete' | 'Pending Review';
  startDate: string;
  endDate: string;
  auditor: string;
  findings: number;
}

const audits: Audit[] = [
  { id: '1', title: 'SOC 2 Type II Annual Audit', framework: 'SOC 2', type: 'External', status: 'In Progress', startDate: '2024-11-01', endDate: '2024-12-31', auditor: 'Deloitte', findings: 3 },
  { id: '2', title: 'ISO 27001:2022 Surveillance Audit', framework: 'ISO 27001', type: 'External', status: 'Scheduled', startDate: '2025-01-15', endDate: '2025-01-25', auditor: 'BSI', findings: 0 },
  { id: '3', title: 'Internal AML Controls Audit', framework: 'CBUAE', type: 'Internal', status: 'Complete', startDate: '2024-09-01', endDate: '2024-09-30', auditor: 'Internal Audit', findings: 5 },
  { id: '4', title: 'Data Privacy Assessment', framework: 'GDPR', type: 'Internal', status: 'Pending Review', startDate: '2024-10-15', endDate: '2024-11-15', auditor: 'Internal Audit', findings: 2 },
  { id: '5', title: 'HIPAA Compliance Audit', framework: 'HIPAA', type: 'External', status: 'Scheduled', startDate: '2025-02-01', endDate: '2025-02-28', auditor: 'KPMG', findings: 0 },
];

const statusColors = {
  Scheduled: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Complete: 'bg-green-100 text-green-700',
  'Pending Review': 'bg-purple-100 text-purple-700',
};

const typeColors = {
  Internal: 'bg-gray-100 text-gray-600',
  External: 'bg-orange-100 text-orange-700',
};

export default function AuditsLibrary() {
  const [search, setSearch] = useState('');

  const filteredAudits = audits.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.framework.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Audit Library</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            {audits.filter(a => a.status === 'In Progress').length} audits in progress
          </p>
        </div>
        <button className="px-4 py-2 text-sm bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] flex items-center gap-2">
          <Plus size={16} />
          Schedule Audit
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {(['Scheduled', 'In Progress', 'Pending Review', 'Complete'] as const).map((status) => (
          <div key={status} className={clsx("p-4 rounded-xl border border-[var(--border)] bg-white")}>
            <p className="text-sm text-[var(--foreground-muted)] mb-1">{status}</p>
            <p className="text-2xl font-bold text-[var(--foreground)]">{audits.filter(a => a.status === status).length}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
        <input
          type="text"
          placeholder="Search audits..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      {/* Audits List */}
      <div className="space-y-3">
        {filteredAudits.map((audit) => (
          <Link
            key={audit.id}
            href={`/library/audits/${audit.id}`}
            className="flex items-center gap-4 bg-white border border-[var(--border)] rounded-xl p-5 hover:border-[var(--primary)] hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-[var(--primary-lightest)] rounded-lg flex items-center justify-center">
              <Shield size={24} className="text-[var(--primary)]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 bg-[var(--primary-lightest)] text-[var(--primary)] rounded font-medium">
                  {audit.framework}
                </span>
                <span className={clsx("text-xs px-2 py-0.5 rounded", typeColors[audit.type])}>
                  {audit.type}
                </span>
                <span className={clsx("text-xs px-2 py-0.5 rounded", statusColors[audit.status])}>
                  {audit.status}
                </span>
              </div>
              <h3 className="font-semibold text-[var(--foreground)] mb-1">{audit.title}</h3>
              <div className="flex items-center gap-4 text-p3 text-[var(--foreground-muted)]">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {formatDateRange(audit.startDate, audit.endDate)}
                </span>
                <span>Auditor: {audit.auditor}</span>
                {audit.findings > 0 && (
                  <span className="text-orange-600">{audit.findings} findings</span>
                )}
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400 group-hover:text-[var(--primary)] transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}

