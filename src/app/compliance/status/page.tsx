'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock, Building2, FolderKanban } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

interface ComplianceStatus {
  authority: string;
  program: string;
  totalCitations: number;
  compliant: number;
  inProgress: number;
  nonCompliant: number;
  trend: 'up' | 'down' | 'stable';
  lastAssessment: string;
}

const complianceData: ComplianceStatus[] = [
  { authority: 'ISO', program: 'ISO 27001', totalCitations: 114, compliant: 98, inProgress: 12, nonCompliant: 4, trend: 'up', lastAssessment: '2024-12-15' },
  { authority: 'EU', program: 'GDPR', totalCitations: 99, compliant: 87, inProgress: 8, nonCompliant: 4, trend: 'stable', lastAssessment: '2024-12-10' },
  { authority: 'RBI', program: 'RBI IT Governance', totalCitations: 156, compliant: 142, inProgress: 10, nonCompliant: 4, trend: 'up', lastAssessment: '2024-12-12' },
  { authority: 'SDAIA', program: 'PDPL', totalCitations: 78, compliant: 65, inProgress: 9, nonCompliant: 4, trend: 'down', lastAssessment: '2024-12-08' },
  { authority: 'SAMA', program: 'Cybersecurity Framework', totalCitations: 134, compliant: 118, inProgress: 12, nonCompliant: 4, trend: 'up', lastAssessment: '2024-12-14' },
];

export default function ComplianceStatusPage() {
  const [filter, setFilter] = useState<'all' | 'compliant' | 'issues'>('all');

  const totalCitations = complianceData.reduce((sum, item) => sum + item.totalCitations, 0);
  const totalCompliant = complianceData.reduce((sum, item) => sum + item.compliant, 0);
  const totalInProgress = complianceData.reduce((sum, item) => sum + item.inProgress, 0);
  const totalNonCompliant = complianceData.reduce((sum, item) => sum + item.nonCompliant, 0);

  const complianceRate = Math.round((totalCompliant / totalCitations) * 100);

  const filteredData = complianceData.filter(item => {
    if (filter === 'compliant') return item.nonCompliant === 0;
    if (filter === 'issues') return item.nonCompliant > 0;
    return true;
  });

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-h1 font-bold text-[var(--foreground)] mb-2">Compliance Status</h1>
        <p className="text-p1 text-[var(--foreground-muted)]">
          Citation compliance tracker across all programs
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-p3 text-[var(--foreground-muted)] font-medium">Overall Compliance</div>
            <TrendingUp size={18} className="text-green-600" />
          </div>
          <div className="text-h2 font-bold text-[var(--foreground)] mb-1">{complianceRate}%</div>
          <div className="text-p3 text-green-600 font-medium">+2.3% from last month</div>
        </div>

        <div className="bg-white border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-p3 text-[var(--foreground-muted)] font-medium">Compliant</div>
            <CheckCircle2 size={18} className="text-green-600" />
          </div>
          <div className="text-h2 font-bold text-green-600 mb-1">{totalCompliant}</div>
          <div className="text-p3 text-[var(--foreground-muted)]">of {totalCitations} citations</div>
        </div>

        <div className="bg-white border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-p3 text-[var(--foreground-muted)] font-medium">In Progress</div>
            <Clock size={18} className="text-yellow-600" />
          </div>
          <div className="text-h2 font-bold text-yellow-600 mb-1">{totalInProgress}</div>
          <div className="text-p3 text-[var(--foreground-muted)]">being addressed</div>
        </div>

        <div className="bg-white border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-p3 text-[var(--foreground-muted)] font-medium">Non-Compliant</div>
            <AlertTriangle size={18} className="text-red-600" />
          </div>
          <div className="text-h2 font-bold text-red-600 mb-1">{totalNonCompliant}</div>
          <div className="text-p3 text-[var(--foreground-muted)]">require attention</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={clsx(
            'px-4 py-2 rounded-lg text-p2 font-medium transition-all',
            filter === 'all'
              ? 'bg-[var(--primary)] text-white'
              : 'bg-white border border-[var(--border)] text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]'
          )}
        >
          All Programs
        </button>
        <button
          onClick={() => setFilter('compliant')}
          className={clsx(
            'px-4 py-2 rounded-lg text-p2 font-medium transition-all',
            filter === 'compliant'
              ? 'bg-green-600 text-white'
              : 'bg-white border border-[var(--border)] text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]'
          )}
        >
          Fully Compliant
        </button>
        <button
          onClick={() => setFilter('issues')}
          className={clsx(
            'px-4 py-2 rounded-lg text-p2 font-medium transition-all',
            filter === 'issues'
              ? 'bg-red-600 text-white'
              : 'bg-white border border-[var(--border)] text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]'
          )}
        >
          With Issues
        </button>
      </div>

      {/* Compliance Table */}
      <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[var(--background-secondary)] border-b border-[var(--border)]">
            <tr>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wide">Program</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wide">Total Citations</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wide">Compliant</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wide">In Progress</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wide">Non-Compliant</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wide">Compliance Rate</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wide">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredData.map((item, index) => {
              const rate = Math.round((item.compliant / item.totalCitations) * 100);
              return (
                <tr key={index} className="hover:bg-[var(--background-secondary)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[var(--primary-lightest)] rounded-lg flex items-center justify-center flex-shrink-0">
                        <FolderKanban size={18} className="text-[var(--primary)]" />
                      </div>
                      <div>
                        <Link href={`/programs?filter=${item.program}`} className="text-p2 font-semibold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">
                          {item.program}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Building2 size={12} className="text-[var(--foreground-muted)]" />
                          <span className="text-p3 text-[var(--foreground-muted)]">{item.authority}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-p2 font-medium text-[var(--foreground)]">{item.totalCitations}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-p3 font-medium">
                      <CheckCircle2 size={14} />
                      {item.compliant}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-p3 font-medium">
                      <Clock size={14} />
                      {item.inProgress}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-p3 font-medium">
                      <AlertTriangle size={14} />
                      {item.nonCompliant}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="w-full h-2 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
                          <div
                            className={clsx(
                              'h-full rounded-full transition-all',
                              rate >= 90 ? 'bg-green-600' : rate >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                            )}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-p2 font-semibold text-[var(--foreground)] min-w-[45px]">{rate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {item.trend === 'up' && <TrendingUp size={18} className="text-green-600" />}
                    {item.trend === 'down' && <TrendingDown size={18} className="text-red-600" />}
                    {item.trend === 'stable' && <div className="w-4 h-0.5 bg-gray-400 rounded" />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

