'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileBarChart, Plus, TrendingUp, PieChart, BarChart3, Download } from 'lucide-react';
import clsx from 'clsx';
import { mockCustomCharts, mockReportTemplates, type ReportTemplate } from '@/lib/data/reports';

export default function ReportsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<'all' | ReportTemplate['category']>('all');

  const filteredReports = mockReportTemplates.filter(report => {
    if (selectedCategory !== 'all' && report.category !== selectedCategory) return false;
    return true;
  });

  const getCategoryColor = (category: ReportTemplate['category']) => {
    switch (category) {
      case 'Executive': return 'bg-purple-100 text-purple-700';
      case 'Board': return 'bg-red-100 text-red-700';
      case 'Risk': return 'bg-orange-100 text-orange-700';
      case 'Control': return 'bg-blue-100 text-blue-700';
      case 'Treatment': return 'bg-green-100 text-green-700';
      case 'Compliance': return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <FileBarChart size={24} className="text-[var(--primary)]" />
            <h1 className="text-h2 font-bold text-[var(--foreground)]">Reports & Analytics</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/erm/reports/custom-chart')}
              className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
            >
              <PieChart size={18} />
              Create Chart
            </button>
            <button
              onClick={() => router.push('/erm/reports/new')}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium"
            >
              <Plus size={18} />
              Create Report
            </button>
          </div>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Custom dashboards, charts, and comprehensive reporting
        </p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div
          onClick={() => router.push('/erm/reports/treatment-status')}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white cursor-pointer hover:shadow-lg transition-all"
        >
          <BarChart3 size={32} className="mb-3" />
          <h3 className="text-lg font-semibold mb-1">Treatment Status</h3>
          <p className="text-sm text-blue-100">View treatment plan progress and metrics</p>
        </div>

        <div
          onClick={() => router.push('/erm/reports/risk-profiles')}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white cursor-pointer hover:shadow-lg transition-all"
        >
          <TrendingUp size={32} className="mb-3" />
          <h3 className="text-lg font-semibold mb-1">Risk Profiles</h3>
          <p className="text-sm text-purple-100">Portfolio-level risk analysis</p>
        </div>

        <div
          onClick={() => router.push('/erm/reports/metrics')}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white cursor-pointer hover:shadow-lg transition-all"
        >
          <PieChart size={32} className="mb-3" />
          <h3 className="text-lg font-semibold mb-1">Key Metrics</h3>
          <p className="text-sm text-green-100">Condensed metrics dashboard</p>
        </div>

        <div
          onClick={() => router.push('/erm/reports/charts')}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white cursor-pointer hover:shadow-lg transition-all"
        >
          <BarChart3 size={32} className="mb-3" />
          <h3 className="text-lg font-semibold mb-1">Custom Charts</h3>
          <p className="text-sm text-orange-100">{mockCustomCharts.length} user-defined charts</p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--foreground-muted)]">Filter by category:</span>
          {['all', 'Executive', 'Board', 'Risk', 'Control', 'Treatment', 'Compliance'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                selectedCategory === cat
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-gray-100 text-[var(--foreground-muted)] hover:bg-gray-200'
              )}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-white border border-[var(--border)] rounded-lg">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Report Library</h2>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {filteredReports.map(report => (
              <div
                key={report.id}
                className="border border-[var(--border)] rounded-lg p-6 hover:shadow-md transition-all cursor-pointer"
                onClick={() => router.push(`/erm/reports/${report.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-[var(--primary)]">{report.id}</span>
                      <span className={clsx('px-2 py-0.5 text-xs font-medium rounded', getCategoryColor(report.category))}>
                        {report.category}
                      </span>
                      {report.frequency && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-700">
                          {report.frequency}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">{report.name}</h3>
                    <p className="text-sm text-[var(--foreground-muted)] mb-3">{report.description}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Generating report...');
                    }}
                    className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2"
                  >
                    <Download size={16} />
                    Generate
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-[var(--foreground-muted)] mb-1">Sections</div>
                    <div className="text-sm font-medium">{report.sections.length}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-[var(--foreground-muted)] mb-1">Recipients</div>
                    <div className="text-sm font-medium">{report.recipients?.length || 0}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-[var(--foreground-muted)] mb-1">Last Generated</div>
                    <div className="text-sm font-medium">
                      {report.lastGenerated ? new Date(report.lastGenerated).toLocaleDateString() : 'Never'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
