'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Layers, Activity, History } from 'lucide-react';
import clsx from 'clsx';
import { mockAggregatedRisks, calculateTrend, calculateTreatmentIntensity, type TreatmentIntensity, type RiskTrend } from '@/lib/data/risk-analysis';
import { mockRisks } from '@/lib/data/erm-risks';

export default function RiskAnalysisPage() {
  const router = useRouter();
  const [viewType, setViewType] = useState<'individual' | 'aggregated'>('individual');

  const getTrendColor = (trend: RiskTrend) => {
    if (trend === '↑') return 'text-red-600';
    if (trend === '↓') return 'text-green-600';
    return 'text-gray-600';
  };

  const getTreatmentIntensityColor = (intensity: TreatmentIntensity) => {
    switch (intensity) {
      case '++++': return 'bg-green-100 text-green-700';
      case '+++': return 'bg-blue-100 text-blue-700';
      case '++': return 'bg-yellow-100 text-yellow-700';
      case '+': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Critical': return 'bg-red-100 text-red-700';
      case 'High': return 'bg-orange-100 text-orange-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Calculate trends and intensity for each risk
  const risksWithAnalysis = mockRisks.map(risk => {
    // Calculate residual score
    const residualScore = risk.residualLikelihood * risk.residualConsequence;

    // Calculate previous score for trend (simulate historical data)
    const previousScore = residualScore + (Math.floor(Math.random() * 5) - 2);
    const trend = calculateTrend(residualScore, previousScore);

    // Calculate treatment intensity based on controls
    const controlsCount = risk.linkedControlIds?.length || 0;
    const effectivenessAvg = 75; // Mock average effectiveness
    const treatmentIntensity = calculateTreatmentIntensity(controlsCount, effectivenessAvg);

    return {
      ...risk,
      residualScore,
      trend,
      treatmentIntensity,
      previousScore: previousScore > 0 ? previousScore : residualScore + 2
    };
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Activity size={24} className="text-[var(--primary)]" />
            <h1 className="text-h2 font-bold text-[var(--foreground)]">Advanced Risk Analysis</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => router.push('/erm/analysis/version-history')}
              className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
            >
              <History size={18} />
              Version History
            </button>
            <button 
              onClick={() => router.push('/erm/analysis/matrix-conversion')}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium"
            >
              <Layers size={18} />
              Matrix Conversion
            </button>
          </div>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Trend analysis, treatment intensity, aggregation, and version tracking
        </p>
      </div>

      {/* View Toggle */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--foreground-muted)]">View:</span>
          <button
            onClick={() => setViewType('individual')}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              viewType === 'individual'
                ? 'bg-[var(--primary)] text-white'
                : 'bg-gray-100 text-[var(--foreground-muted)] hover:bg-gray-200'
            )}
          >
            Individual Risks
          </button>
          <button
            onClick={() => setViewType('aggregated')}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              viewType === 'aggregated'
                ? 'bg-[var(--primary)] text-white'
                : 'bg-gray-100 text-[var(--foreground-muted)] hover:bg-gray-200'
            )}
          >
            Aggregated Risks
          </button>
        </div>
      </div>

      {/* Individual Risks View */}
      {viewType === 'individual' && (
        <div className="bg-white border border-[var(--border)] rounded-lg overflow-hidden">
          <div className="p-6 border-b border-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Risk Trend & Treatment Analysis</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-[var(--border)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Risk</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Current Score</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Previous Score</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Trend</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Treatment Intensity</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {risksWithAnalysis.map(risk => (
                  <tr 
                    key={risk.id}
                    onClick={() => router.push(`/erm/risk-register/${risk.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-[var(--primary)]">{risk.id}</div>
                      <div className="text-xs text-[var(--foreground-muted)] mt-1">{risk.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-700">
                        {risk.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-lg font-bold">{risk.residualScore}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-lg font-medium text-gray-500">{risk.previousScore}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={clsx('text-3xl font-bold', getTrendColor(risk.trend))}>
                        {risk.trend}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx('px-2 py-1 text-xs font-medium rounded', getRatingColor(risk.residualRating))}>
                        {risk.residualRating}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx('px-3 py-1 text-sm font-bold rounded', getTreatmentIntensityColor(risk.treatmentIntensity))}>
                        {risk.treatmentIntensity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{risk.controls}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Aggregated Risks View */}
      {viewType === 'aggregated' && (
        <div className="space-y-6">
          {mockAggregatedRisks.map(agg => (
            <div key={agg.id} className="bg-white border border-[var(--border)] rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-[var(--primary)]">{agg.id}</span>
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-700">
                      {agg.aggregationType}
                    </span>
                    <span className={clsx('px-2 py-1 text-xs font-medium rounded', getRatingColor(agg.aggregatedRating))}>
                      {agg.aggregatedRating}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">{agg.name}</h3>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    {agg.riskCount} risks in {agg.aggregationValue}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-[var(--foreground-muted)] mb-1">Total Inherent</div>
                  <div className="text-xl font-bold">{agg.totalInherentScore}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-[var(--foreground-muted)] mb-1">Total Residual</div>
                  <div className="text-xl font-bold">{agg.totalResidualScore}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-[var(--foreground-muted)] mb-1">Average Score</div>
                  <div className="text-xl font-bold">{agg.averageResidualScore.toFixed(1)}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-[var(--foreground-muted)] mb-1">Max Score</div>
                  <div className="text-xl font-bold">{agg.maxResidualScore}</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-[var(--foreground)] mb-2">Breakdown by Rating:</div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-red-50 border border-red-200 rounded p-2 text-center">
                    <div className="text-xs text-red-700">Critical</div>
                    <div className="text-lg font-bold text-red-700">{agg.breakdown.critical}</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded p-2 text-center">
                    <div className="text-xs text-orange-700">High</div>
                    <div className="text-lg font-bold text-orange-700">{agg.breakdown.high}</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-center">
                    <div className="text-xs text-yellow-700">Medium</div>
                    <div className="text-lg font-bold text-yellow-700">{agg.breakdown.medium}</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded p-2 text-center">
                    <div className="text-xs text-green-700">Low</div>
                    <div className="text-lg font-bold text-green-700">{agg.breakdown.low}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
