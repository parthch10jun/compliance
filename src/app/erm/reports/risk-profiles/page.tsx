'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, Shield, Target, Activity } from 'lucide-react';
import clsx from 'clsx';
import { mockRiskProfiles } from '@/lib/data/reports';

export default function RiskProfilesPage() {
  const router = useRouter();

  const getTrendColor = (trend: string) => {
    if (trend === '↑') return 'text-red-600';
    if (trend === '↓') return 'text-green-600';
    return 'text-gray-600';
  };

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
          <TrendingUp size={24} className="text-[var(--primary)]" />
          <h1 className="text-h2 font-bold text-[var(--foreground)]">Risk Profiles by Portfolio</h1>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Comprehensive risk analysis across business units, departments, and portfolios
        </p>
      </div>

      {/* Risk Profiles */}
      <div className="space-y-6">
        {mockRiskProfiles.map(profile => (
          <div key={profile.id} className="bg-white border border-[var(--border)] rounded-lg p-6">
            {/* Profile Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-[var(--primary)]">{profile.id}</span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-700">
                    {profile.portfolioType}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-1">{profile.name}</h3>
                <p className="text-sm text-[var(--foreground-muted)]">{profile.portfolioValue}</p>
              </div>

              <div className="text-right">
                <div className="text-sm text-[var(--foreground-muted)] mb-1">Generated</div>
                <div className="text-sm font-medium">{new Date(profile.generatedDate).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Risk Summary Cards */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Total Risks</div>
                <div className="text-2xl font-bold text-[var(--foreground)]">{profile.totalRisks}</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-xs text-red-700 mb-1">Critical</div>
                <div className="text-2xl font-bold text-red-700">{profile.criticalRisks}</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="text-xs text-orange-700 mb-1">High</div>
                <div className="text-2xl font-bold text-orange-700">{profile.highRisks}</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-xs text-yellow-700 mb-1">Medium</div>
                <div className="text-2xl font-bold text-yellow-700">{profile.mediumRisks}</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-xs text-green-700 mb-1">Low</div>
                <div className="text-2xl font-bold text-green-700">{profile.lowRisks}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              {/* Risk Scores */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-red-900 mb-3 flex items-center gap-2">
                  <Shield size={16} />
                  Risk Scores
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-red-700 mb-1">Inherent Risk</div>
                    <div className="text-3xl font-bold text-red-900">{profile.inherentRiskScore}</div>
                  </div>
                  <div>
                    <div className="text-xs text-orange-700 mb-1">Residual Risk</div>
                    <div className="text-3xl font-bold text-orange-900">{profile.residualRiskScore}</div>
                  </div>
                  <div className="pt-2 border-t border-red-200">
                    <div className="text-xs text-green-700 mb-1">Risk Reduction</div>
                    <div className="text-2xl font-bold text-green-700">{profile.riskReductionPercent}%</div>
                  </div>
                </div>
              </div>

              {/* Treatment Coverage */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Target size={16} />
                  Treatment Coverage
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-blue-700">Controls</span>
                      <span className="text-sm font-bold text-blue-900">{profile.controlsCoverage}%</span>
                    </div>
                    <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600" style={{ width: `${profile.controlsCoverage}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-purple-700">Treatment Plans</span>
                      <span className="text-sm font-bold text-purple-900">{profile.treatmentPlansCoverage}%</span>
                    </div>
                    <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600" style={{ width: `${profile.treatmentPlansCoverage}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Trend & KRIs */}
              <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <Activity size={16} />
                  Trend & KRIs
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-green-700 mb-2">Trend</div>
                    <div className="flex items-center gap-2">
                      <span className={clsx('text-5xl font-bold', getTrendColor(profile.trend))}>
                        {profile.trend}
                      </span>
                      <div className="text-xs text-green-700">{profile.trendPeriod}</div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-green-200">
                    <div className="text-xs text-teal-700 mb-1">KRIs</div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-teal-900">{profile.kriCount} total</span>
                      <span className="px-2 py-1 text-xs font-bold rounded bg-red-100 text-red-700">
                        {profile.kriticalKRIs} critical
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Risks */}
            <div>
              <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">Top Risks</h4>
              <div className="space-y-2">
                {profile.topRisks.map(risk => (
                  <div
                    key={risk.riskId}
                    onClick={() => router.push(`/erm/risk-register/${risk.riskId}`)}
                    className="flex items-center justify-between p-3 border border-[var(--border)] rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-[var(--primary)]">{risk.riskId}</span>
                      <span className="text-sm text-[var(--foreground)]">{risk.riskTitle}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-[var(--foreground)]">Score: {risk.score}</span>
                      <span className={clsx('px-2 py-1 text-xs font-medium rounded',
                        risk.rating === 'Critical' ? 'bg-red-100 text-red-700' :
                        risk.rating === 'High' ? 'bg-orange-100 text-orange-700' :
                        risk.rating === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      )}>
                        {risk.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
