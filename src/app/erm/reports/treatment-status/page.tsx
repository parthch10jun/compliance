'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, BarChart3, TrendingUp, DollarSign } from 'lucide-react';
import clsx from 'clsx';
import { mockTreatmentStatusReport } from '@/lib/data/reports';

export default function TreatmentStatusReportPage() {
  const router = useRouter();
  const report = mockTreatmentStatusReport;

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Critical': return 'bg-red-100 text-red-700';
      case 'High': return 'bg-orange-100 text-orange-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const completionRate = Math.round((report.completed / report.totalPlans) * 100);
  const budgetUsed = Math.round((report.totalSpent / report.totalBudget) * 100);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/erm/reports')}
          className="flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Reports
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 size={24} className="text-[var(--primary)]" />
          <h1 className="text-h2 font-bold text-[var(--foreground)]">Treatment Plan Status Report</h1>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Report generated on {new Date(report.reportDate).toLocaleDateString()}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="text-sm text-[var(--foreground-muted)] mb-1">Total Plans</div>
          <div className="text-2xl font-bold text-[var(--foreground)]">{report.totalPlans}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-700 mb-1">Completed</div>
          <div className="text-2xl font-bold text-green-700">{report.completed}</div>
          <div className="text-xs text-green-600 mt-1">{completionRate}% complete</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-700 mb-1">In Progress</div>
          <div className="text-2xl font-bold text-blue-700">{report.inProgress}</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-700 mb-1">Not Started</div>
          <div className="text-2xl font-bold text-gray-700">{report.notStarted}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-700 mb-1">Overdue</div>
          <div className="text-2xl font-bold text-red-700">{report.overdue}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Financial Summary */}
        <div className="bg-white border border-[var(--border)] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <DollarSign size={20} />
            Financial Summary
          </h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--foreground-muted)]">Total Budget</span>
                <span className="text-lg font-bold">${report.totalBudget.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gray-400" style={{ width: '100%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--foreground-muted)]">Total Spent</span>
                <span className="text-lg font-bold text-blue-600">${report.totalSpent.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${budgetUsed}%` }} />
              </div>
              <div className="text-xs text-blue-600 mt-1">{budgetUsed}% of budget</div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--foreground-muted)]">Projected Cost</span>
                <span className="text-lg font-bold text-orange-600">${report.projectedCost.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-600" style={{ width: `${Math.round((report.projectedCost / report.totalBudget) * 100)}%` }} />
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border)]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Remaining Budget</span>
                <span className={clsx('text-lg font-bold', (report.totalBudget - report.projectedCost) >= 0 ? 'text-green-600' : 'text-red-600')}>
                  ${(report.totalBudget - report.projectedCost).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Effectiveness Metrics */}
        <div className="bg-white border border-[var(--border)] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Effectiveness Metrics
          </h2>
          
          <div className="space-y-6">
            <div>
              <div className="text-sm text-[var(--foreground-muted)] mb-2">Average Risk Reduction</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className="h-4 rounded-full bg-gradient-to-r from-red-500 to-green-500"
                    style={{ width: `${report.avgRiskReduction}%` }}
                  />
                </div>
                <span className="text-2xl font-bold text-green-600">{report.avgRiskReduction}%</span>
              </div>
            </div>

            <div>
              <div className="text-sm text-[var(--foreground-muted)] mb-2">Controls Coverage</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className="h-4 rounded-full bg-blue-600"
                    style={{ width: `${report.controlsCoverage}%` }}
                  />
                </div>
                <span className="text-2xl font-bold text-blue-600">{report.controlsCoverage}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <div className="text-xs text-green-700 mb-1">Completion Rate</div>
                <div className="text-xl font-bold text-green-700">{completionRate}%</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <div className="text-xs text-blue-700 mb-1">Budget Efficiency</div>
                <div className="text-xl font-bold text-blue-700">{budgetUsed}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* By Business Unit */}
      <div className="bg-white border border-[var(--border)] rounded-lg mb-6 overflow-hidden">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Status by Business Unit</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Business Unit</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Total</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Completed</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">In Progress</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Completion %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {report.byBusinessUnit.map(bu => (
                <tr key={bu.unit} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{bu.unit}</td>
                  <td className="px-6 py-4">{bu.total}</td>
                  <td className="px-6 py-4 text-green-600 font-medium">{bu.completed}</td>
                  <td className="px-6 py-4 text-blue-600 font-medium">{bu.inProgress}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-green-600"
                          style={{ width: `${bu.averageCompletion}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{bu.averageCompletion}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* By Risk Rating */}
      <div className="bg-white border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Status by Risk Rating</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Risk Rating</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Total Plans</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Completed</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Avg Days to Complete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {report.byRiskRating.map(rating => (
                <tr key={rating.rating} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className={clsx('px-2 py-1 text-xs font-medium rounded', getRatingColor(rating.rating))}>
                      {rating.rating}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{rating.total}</td>
                  <td className="px-6 py-4 text-green-600 font-medium">{rating.completed}</td>
                  <td className="px-6 py-4">{rating.avgDaysToComplete > 0 ? `${rating.avgDaysToComplete} days` : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
