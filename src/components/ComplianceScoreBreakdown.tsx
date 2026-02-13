'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator, TrendingUp, Info, AlertCircle } from 'lucide-react';
import { ComplianceScoreBreakdown as BreakdownType } from '@/lib/types/compliance-calculations';
import clsx from 'clsx';
import { formatDate } from '@/lib/utils/date-formatter';

interface ComplianceScoreBreakdownProps {
  breakdown: BreakdownType;
  showDetails?: boolean;
}

const methodLabels: Record<string, string> = {
  'simple-average': 'Simple Average',
  'weighted-average': 'Weighted Average',
  'control-based': 'Control-Based',
  'risk-weighted': 'Risk-Weighted',
  'maturity-based': 'Maturity-Based',
  'custom-formula': 'Custom Formula',
};

export function ComplianceScoreBreakdown({ breakdown, showDetails = true }: ComplianceScoreBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-100';
    if (score >= 60) return 'bg-amber-100';
    return 'bg-red-100';
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center">
              <Calculator size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-h3 font-semibold text-[var(--foreground)]">Compliance Score Breakdown</h3>
              <p className="text-p3 text-[var(--foreground-muted)]">
                Method: {methodLabels[breakdown.method] || breakdown.method}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={clsx('text-4xl font-bold', getScoreColor(breakdown.overallScore))}>
              {breakdown.overallScore}%
            </div>
            <p className="text-p3 text-[var(--foreground-muted)] mt-1">
              {formatDate(breakdown.calculatedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Components */}
      <div className="p-6">
        <div className="space-y-4">
          {breakdown.components.map((component, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-p2 font-medium text-[var(--foreground)]">{component.name}</span>
                  {component.details && (
                    <button className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
                      <Info size={14} />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-p3 text-[var(--foreground-muted)]">
                    Weight: {(component.weight * 100).toFixed(0)}%
                  </span>
                  <span className={clsx('text-p2 font-semibold', getScoreColor(component.score))}>
                    {component.score.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={clsx(
                    'absolute inset-y-0 left-0 rounded-full transition-all duration-500',
                    component.score >= 80 ? 'bg-emerald-500' :
                    component.score >= 60 ? 'bg-amber-500' :
                    'bg-red-500'
                  )}
                  style={{ width: `${Math.min(component.score, 100)}%` }}
                />
              </div>

              {/* Weighted Score */}
              <div className="flex items-center justify-between text-p3 text-[var(--foreground-muted)]">
                <span>Weighted Contribution</span>
                <span className="font-medium">{component.weightedScore.toFixed(1)}%</span>
              </div>

              {/* Details */}
              {component.details && showDetails && (
                <div className="mt-2 p-3 bg-[var(--background-secondary)] rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-p3">
                    {Object.entries(component.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-[var(--foreground-muted)] capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="font-medium text-[var(--foreground)]">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Metadata Toggle */}
      {Object.keys(breakdown.metadata).length > 0 && (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-6 py-3 flex items-center justify-between border-t border-[var(--border)] hover:bg-[var(--background-secondary)] transition-colors"
          >
            <span className="text-p2 font-medium text-[var(--foreground)]">Additional Metrics</span>
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {isExpanded && (
            <div className="px-6 pb-6 border-t border-[var(--border)] bg-[var(--background-secondary)]">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {Object.entries(breakdown.metadata).map(([key, value]) => (
                  <div key={key} className="p-3 bg-white rounded-lg border border-[var(--border)]">
                    <p className="text-p3 text-[var(--foreground-muted)] mb-1 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-p1 font-semibold text-[var(--foreground)]">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

