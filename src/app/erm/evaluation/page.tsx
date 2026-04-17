'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Award, AlertTriangle, Shield } from 'lucide-react';
import clsx from 'clsx';
import { mockRiskRankings, getTopRisks, getRisksExceedingTolerance, type RiskRanking } from '@/lib/data/risk-evaluation';

export default function RiskEvaluationPage() {
  const router = useRouter();
  const [viewType, setViewType] = useState<'inherent' | 'residual'>('residual');
  const [showOnlyExceedingTolerance, setShowOnlyExceedingTolerance] = useState(false);

  const allRankings = [...mockRiskRankings].sort((a, b) => {
    if (viewType === 'inherent') {
      return a.inherentRank - b.inherentRank;
    }
    return a.residualRank - b.residualRank;
  });

  const displayedRankings = showOnlyExceedingTolerance 
    ? allRankings.filter(r => r.exceedsTolerance)
    : allRankings;

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Critical': return 'bg-red-100 text-red-700';
      case 'High': return 'bg-orange-100 text-orange-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-600 text-white';
      case 'High': return 'bg-orange-600 text-white';
      case 'Medium': return 'bg-yellow-600 text-white';
      case 'Low': return 'bg-green-600 text-white';
      case 'Monitor': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getAuthorityColor = (level: string) => {
    switch (level) {
      case 'Board': return 'bg-purple-100 text-purple-700';
      case 'Executive': return 'bg-blue-100 text-blue-700';
      case 'Management': return 'bg-green-100 text-green-700';
      case 'Operational': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const stats = {
    total: mockRiskRankings.length,
    exceedingTolerance: getRisksExceedingTolerance().length,
    critical: mockRiskRankings.filter(r => r.residualRating === 'Critical').length,
    requireNotification: mockRiskRankings.filter(r => r.notificationRequired).length,
    overridden: mockRiskRankings.filter(r => r.isOverridden).length
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <TrendingUp size={24} className="text-[var(--primary)]" />
            <h1 className="text-h2 font-bold text-[var(--foreground)]">Risk Evaluation & Prioritization</h1>
          </div>
          <button 
            onClick={() => router.push('/erm/evaluation/override')}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium"
          >
            <Shield size={18} />
            Override Risk Rating
          </button>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Rank risks, compare to tolerance, and assign treatment priorities
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="text-sm text-[var(--foreground-muted)] mb-1">Total Risks</div>
          <div className="text-2xl font-bold text-[var(--foreground)]">{stats.total}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-700 mb-1">Exceeds Tolerance</div>
          <div className="text-2xl font-bold text-red-700">{stats.exceedingTolerance}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-sm text-orange-700 mb-1">Critical Priority</div>
          <div className="text-2xl font-bold text-orange-700">{stats.critical}</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-sm text-purple-700 mb-1">Require Notification</div>
          <div className="text-2xl font-bold text-purple-700">{stats.requireNotification}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-700 mb-1">Overridden</div>
          <div className="text-2xl font-bold text-blue-700">{stats.overridden}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[var(--foreground-muted)]">View:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setViewType('residual')}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  viewType === 'residual'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-gray-100 text-[var(--foreground-muted)] hover:bg-gray-200'
                )}
              >
                Residual Risk
              </button>
              <button
                onClick={() => setViewType('inherent')}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  viewType === 'inherent'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-gray-100 text-[var(--foreground-muted)] hover:bg-gray-200'
                )}
              >
                Inherent Risk
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="exceedsTolerance"
              checked={showOnlyExceedingTolerance}
              onChange={(e) => setShowOnlyExceedingTolerance(e.target.checked)}
              className="w-4 h-4 text-[var(--primary)] border-gray-300 rounded focus:ring-[var(--primary)]"
            />
            <label htmlFor="exceedsTolerance" className="text-sm font-medium text-[var(--foreground)]">
              Show only risks exceeding tolerance
            </label>
          </div>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="bg-white border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Risk Rankings - {viewType === 'residual' ? 'Residual' : 'Inherent'} Risk
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Risk</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Score</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Tolerance</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Decision</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Authority</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {displayedRankings.map((ranking, index) => {
                const rank = viewType === 'inherent' ? ranking.inherentRank : ranking.residualRank;
                const score = viewType === 'inherent' ? ranking.inherentScore : ranking.residualScore;
                const rating = viewType === 'inherent' ? ranking.inherentRating : ranking.residualRating;

                return (
                  <tr 
                    key={ranking.riskId}
                    onClick={() => router.push(`/erm/risk-register/${ranking.riskId}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={clsx(
                          'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                          rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                          rank === 2 ? 'bg-gray-300 text-gray-900' :
                          rank === 3 ? 'bg-orange-300 text-orange-900' :
                          'bg-gray-100 text-gray-700'
                        )}>
                          {rank}
                        </div>
                        {rank <= 3 && <Award size={16} className="text-yellow-600" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-[var(--primary)]">{ranking.riskId}</div>
                      <div className="text-xs text-[var(--foreground-muted)] mt-1">{ranking.riskTitle}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-700">
                        {ranking.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold">{score}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx('px-2 py-1 text-xs font-medium rounded', getRatingColor(rating))}>
                        {rating}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium">{ranking.riskTolerance}</div>
                        {ranking.exceedsTolerance ? (
                          <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
                            <AlertTriangle size={12} />
                            +{ranking.toleranceDelta} over
                          </div>
                        ) : (
                          <div className="text-xs text-green-600 mt-1">
                            Within tolerance
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx('px-2 py-1 text-xs font-bold rounded', getPriorityColor(ranking.priority))}>
                        {ranking.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{ranking.treatmentDecision}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className={clsx('px-2 py-1 text-xs font-medium rounded', getAuthorityColor(ranking.authorityLevel))}>
                          {ranking.authorityLevel}
                        </span>
                        {ranking.notificationRequired && (
                          <div className="text-xs text-orange-600 mt-1">📧 Notify required</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {ranking.isOverridden && (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
                          Overridden
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {displayedRankings.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <TrendingUp size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-[var(--foreground-muted)]">No risks match your filters</p>
        </div>
      )}
    </div>
  );
}
