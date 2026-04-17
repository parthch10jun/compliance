'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, History, GitBranch, User, Calendar } from 'lucide-react';
import clsx from 'clsx';
import { mockRiskVersions, type RiskVersion } from '@/lib/data/risk-analysis';
import { mockRisks } from '@/lib/data/erm-risks';

export default function VersionHistoryPage() {
  const router = useRouter();
  const [selectedRisk, setSelectedRisk] = useState('RSK-001');

  const versions = mockRiskVersions[selectedRisk] || [];
  const risk = mockRisks.find(r => r.id === selectedRisk);

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Critical': return 'bg-red-100 text-red-700';
      case 'High': return 'bg-orange-100 text-orange-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/erm/analysis')}
          className="flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Risk Analysis
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <History size={24} className="text-[var(--primary)]" />
          <h1 className="text-h2 font-bold text-[var(--foreground)]">Risk Version History</h1>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          View complete change history with who, when, and why
        </p>
      </div>

      {/* Risk Selector */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-6 mb-6">
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Select Risk
        </label>
        <select
          value={selectedRisk}
          onChange={(e) => setSelectedRisk(e.target.value)}
          className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
        >
          {Object.keys(mockRiskVersions).map(riskId => {
            const r = mockRisks.find(risk => risk.id === riskId);
            return (
              <option key={riskId} value={riskId}>
                {riskId} - {r?.title}
              </option>
            );
          })}
        </select>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6 flex items-center gap-2">
          <GitBranch size={20} />
          Version Timeline ({versions.length} versions)
        </h2>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

          {/* Versions */}
          <div className="space-y-8">
            {versions.map((version, index) => {
              const isLatest = index === versions.length - 1;
              
              return (
                <div key={version.versionNumber} className="relative pl-20">
                  {/* Timeline Dot */}
                  <div className={clsx(
                    'absolute left-6 w-5 h-5 rounded-full border-4',
                    isLatest 
                      ? 'bg-[var(--primary)] border-[var(--primary)]' 
                      : 'bg-white border-gray-300'
                  )} />

                  {/* Version Card */}
                  <div className={clsx(
                    'border-2 rounded-lg p-6',
                    isLatest 
                      ? 'border-[var(--primary)] bg-blue-50' 
                      : 'border-[var(--border)] bg-white'
                  )}>
                    {/* Version Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-[var(--foreground)]">
                            Version {version.versionNumber}
                          </h3>
                          {isLatest && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded bg-[var(--primary)] text-white">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-[var(--foreground-muted)]">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(version.versionDate).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            {version.modifiedBy}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Change Rationale */}
                    <div className="mb-4">
                      <div className="text-sm font-medium text-[var(--foreground)] mb-1">Change Rationale:</div>
                      <div className="text-sm text-[var(--foreground-muted)] bg-white border border-[var(--border)] rounded p-3">
                        {version.changeRationale}
                      </div>
                    </div>

                    {/* Risk Scores */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white border border-[var(--border)] rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">Inherent Risk</h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-[var(--foreground-muted)]">Likelihood × Consequence</span>
                          <span className="text-sm font-medium">{version.inherentLikelihood} × {version.inherentConsequence}</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-[var(--foreground-muted)]">Score</span>
                          <span className="text-lg font-bold">{version.inherentScore}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[var(--foreground-muted)]">Rating</span>
                          <span className={clsx('px-2 py-1 text-xs font-medium rounded', getRatingColor(version.inherentRating))}>
                            {version.inherentRating}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white border border-[var(--border)] rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">Residual Risk</h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-[var(--foreground-muted)]">Likelihood × Consequence</span>
                          <span className="text-sm font-medium">{version.residualLikelihood} × {version.residualConsequence}</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-[var(--foreground-muted)]">Score</span>
                          <span className="text-lg font-bold">{version.residualScore}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[var(--foreground-muted)]">Rating</span>
                          <span className={clsx('px-2 py-1 text-xs font-medium rounded', getRatingColor(version.residualRating))}>
                            {version.residualRating}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Field Changes */}
                    {version.fieldChanges.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-[var(--foreground)] mb-2">Changes:</div>
                        <div className="space-y-2">
                          {version.fieldChanges.map((change, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm bg-yellow-50 border border-yellow-200 rounded p-2">
                              <span className="font-medium text-[var(--foreground)]">{change.field}:</span>
                              <span className="text-red-600 line-through">{change.oldValue}</span>
                              <span className="text-[var(--foreground-muted)]">→</span>
                              <span className="text-green-600 font-medium">{change.newValue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
