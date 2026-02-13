'use client';

import { useState } from 'react';
import { PageHeader } from '@/components';
import { risks } from '@/lib/data/risks';
import { Shield, TrendingDown, AlertTriangle, Activity } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

export default function RiskHeatMapPage() {
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'inherent' | 'residual'>('residual');

  // Create heat map grid (5x5)
  const heatMapGrid: (typeof risks)[][] = Array(5).fill(null).map(() => Array(5).fill([]));

  // Populate grid with risks based on selected view
  risks.forEach(risk => {
    const likelihood = viewMode === 'inherent' ? risk.inherentLikelihood : risk.residualLikelihood;
    const impact = viewMode === 'inherent' ? risk.inherentImpact : risk.residualImpact;
    
    // Grid is indexed from 0, but likelihood/impact are 1-5
    const row = 5 - impact; // Invert so high impact is at top
    const col = likelihood - 1;
    
    if (!heatMapGrid[row][col]) {
      heatMapGrid[row][col] = [];
    }
    heatMapGrid[row][col].push(risk);
  });

  const getCellColor = (row: number, col: number) => {
    const impact = 5 - row;
    const likelihood = col + 1;
    const score = impact * likelihood;
    
    if (score >= 15) return 'bg-red-100 border-red-300 hover:bg-red-200';
    if (score >= 8) return 'bg-orange-100 border-orange-300 hover:bg-orange-200';
    if (score >= 3) return 'bg-amber-100 border-amber-300 hover:bg-amber-200';
    return 'bg-emerald-100 border-emerald-300 hover:bg-emerald-200';
  };

  const stats = {
    critical: risks.filter(r => (viewMode === 'inherent' ? r.inherentRating : r.residualRating) === 'Critical').length,
    high: risks.filter(r => (viewMode === 'inherent' ? r.inherentRating : r.residualRating) === 'High').length,
    medium: risks.filter(r => (viewMode === 'inherent' ? r.inherentRating : r.residualRating) === 'Medium').length,
    low: risks.filter(r => (viewMode === 'inherent' ? r.inherentRating : r.residualRating) === 'Low').length,
    totalControls: risks.reduce((acc, r) => acc + r.linkedControlIds.length, 0),
  };

  const selectedRiskData = selectedRisk ? risks.find(r => r.id === selectedRisk) : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Risk Heat Map"
        description="Visual representation of organizational risks by likelihood and impact"
        action={
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-[var(--border)] rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => setViewMode('inherent')}
                className={clsx('px-4 py-2 text-p2 font-medium transition-colors',
                  viewMode === 'inherent' ? 'bg-[var(--primary)] text-white' : 'bg-white text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]'
                )}
              >
                Inherent Risk
              </button>
              <button
                onClick={() => setViewMode('residual')}
                className={clsx('px-4 py-2 text-p2 font-medium transition-colors',
                  viewMode === 'residual' ? 'bg-[var(--primary)] text-white' : 'bg-white text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]'
                )}
              >
                Residual Risk
              </button>
            </div>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4 animate-fade-in-up delay-1">
        <div className="p-5 rounded-xl bg-white border border-red-200 hover:shadow-md transition-shadow">
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1">Critical</p>
          <p className="text-h2 font-bold text-red-600">{stats.critical}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">Score 15-25</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-orange-200 hover:shadow-md transition-shadow">
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1">High</p>
          <p className="text-h2 font-bold text-orange-600">{stats.high}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">Score 8-14</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-amber-200 hover:shadow-md transition-shadow">
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1">Medium</p>
          <p className="text-h2 font-bold text-amber-600">{stats.medium}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">Score 3-7</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-emerald-200 hover:shadow-md transition-shadow">
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1">Low</p>
          <p className="text-h2 font-bold text-emerald-600">{stats.low}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">Score 1-2</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-p3 font-medium">Controls</p>
            <Shield size={16} className="text-[var(--primary)]" />
          </div>
          <p className="text-h2 font-bold text-[var(--foreground)]">{stats.totalControls}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">Active</p>
        </div>
      </div>

      {/* Heat Map */}
      <div className="animate-fade-in-up delay-2 bg-white rounded-xl border border-[var(--border)] p-6">
        <div className="flex items-start gap-6 justify-center">
          {/* Y-axis label */}
          <div className="flex flex-col items-center justify-center h-full pt-8">
            <div className="writing-mode-vertical text-p2 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
              Impact →
            </div>
          </div>

          {/* Grid */}
          <div className="w-full max-w-5xl">
            <div className="grid grid-cols-5 gap-3">
              {heatMapGrid.map((row, rowIndex) => (
                row.map((cell, colIndex) => {
                  const impact = 5 - rowIndex;
                  const likelihood = colIndex + 1;
                  const score = impact * likelihood;

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={clsx(
                        'relative aspect-square border-2 rounded-lg p-3 transition-all cursor-pointer min-h-[120px]',
                        getCellColor(rowIndex, colIndex),
                        cell.length > 0 && 'shadow-sm'
                      )}
                      onClick={() => cell.length > 0 && setSelectedRisk(cell[0].id)}
                    >
                      {/* Score indicator */}
                      <div className="absolute top-2 right-2 text-p3 font-semibold opacity-40">
                        {score}
                      </div>

                      {/* Risk codes */}
                      <div className="flex flex-col gap-1 text-p2 font-medium">
                        {cell.map((risk, idx) => (
                          <div key={risk.id} className="truncate">
                            {risk.code}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              ))}
            </div>

            {/* X-axis label */}
            <div className="mt-4 text-center">
              <div className="text-p2 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
                Likelihood →
              </div>
              <div className="flex justify-around mt-2 text-p3 text-[var(--foreground-muted)]">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>
          </div>

          {/* Y-axis numbers */}
          <div className="flex flex-col justify-around h-full pt-8 pb-16 text-p3 text-[var(--foreground-muted)]">
            <span>5</span>
            <span>4</span>
            <span>3</span>
            <span>2</span>
            <span>1</span>
          </div>
        </div>

        <p className="text-p3 text-[var(--foreground-muted)] mt-4 text-center">
          Click any risk to view details
        </p>
      </div>

      {/* Selected Risk Details */}
      {selectedRiskData && (
        <div className="animate-fade-in-up delay-3 bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-h3 font-semibold text-[var(--foreground)]">{selectedRiskData.title}</h3>
              <p className="text-p2 text-[var(--foreground-muted)] mt-1">{selectedRiskData.code}</p>
            </div>
            <Link
              href={`/risks/${selectedRiskData.id}`}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors text-p2 font-medium"
            >
              View Full Details
            </Link>
          </div>
          
          <p className="text-p2 text-[var(--foreground)] mb-4">{selectedRiskData.riskStatement}</p>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-[var(--background-secondary)] rounded-lg">
              <p className="text-p3 text-[var(--foreground-muted)] mb-1">Category</p>
              <p className="text-p2 font-medium text-[var(--foreground)]">{selectedRiskData.category}</p>
            </div>
            <div className="p-4 bg-[var(--background-secondary)] rounded-lg">
              <p className="text-p3 text-[var(--foreground-muted)] mb-1">Owner</p>
              <p className="text-p2 font-medium text-[var(--foreground)]">{selectedRiskData.owner}</p>
            </div>
            <div className="p-4 bg-[var(--background-secondary)] rounded-lg">
              <p className="text-p3 text-[var(--foreground-muted)] mb-1">Controls</p>
              <p className="text-p2 font-medium text-[var(--foreground)]">{selectedRiskData.linkedControlIds.length} active</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

