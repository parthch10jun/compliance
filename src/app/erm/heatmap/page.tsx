'use client';

import { useState } from 'react';
import { Grid3X3, Filter, Download } from 'lucide-react';
import clsx from 'clsx';
import { RiskHeatmap } from '@/components/RiskHeatmap';
import { mockRisks } from '@/lib/data/erm-risks';
import { mockRiskMatrices } from '@/lib/data/categories-matrices';

type RiskType = 'inherent' | 'residual';
type FilterType = 'all' | 'category' | 'businessUnit';

export default function HeatmapPage() {
  const [riskType, setRiskType] = useState<RiskType>('residual');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('');

  const matrix = mockRiskMatrices[0];
  const likelihoodLabels = matrix.likelihoodScale.map(l => l.label);
  const consequenceLabels = matrix.consequenceScale.map(c => c.label);

  // Filter risks based on selection
  const filteredRisks = mockRisks.filter(risk => {
    if (filterType === 'category' && selectedFilter && risk.category !== selectedFilter) return false;
    if (filterType === 'businessUnit' && selectedFilter && risk.businessUnit !== selectedFilter) return false;
    return true;
  });

  // Build heatmap cells with risk counts
  const buildHeatmapCells = () => {
    const cells: any[][] = [];
    
    for (let l = matrix.dimensions.likelihood; l >= 1; l--) {
      const row: any[] = [];
      for (let c = 1; c <= matrix.dimensions.consequence; c++) {
        const score = l * c;
        let rating: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
        let color = matrix.thresholds.low.color;
        
        if (score >= matrix.thresholds.critical.min) {
          rating = 'Critical';
          color = matrix.thresholds.critical.color;
        } else if (score >= matrix.thresholds.high.min) {
          rating = 'High';
          color = matrix.thresholds.high.color;
        } else if (score >= matrix.thresholds.medium.min) {
          rating = 'Medium';
          color = matrix.thresholds.medium.color;
        }

        // Find risks in this cell
        const risksInCell = filteredRisks.filter(risk => {
          const likelihood = riskType === 'inherent' ? risk.inherentLikelihood : risk.residualLikelihood;
          const consequence = riskType === 'inherent' ? risk.inherentConsequence : risk.residualConsequence;
          return likelihood === l && consequence === c;
        });

        row.push({
          likelihood: l,
          consequence: c,
          score,
          rating,
          color,
          riskCount: risksInCell.length,
          risks: risksInCell.map(r => ({
            id: r.id,
            title: r.title,
            rating: r.residualRating
          }))
        });
      }
      cells.push(row);
    }
    
    return cells;
  };

  const heatmapCells = buildHeatmapCells();

  // Calculate statistics
  const totalRisks = filteredRisks.length;
  const criticalCount = filteredRisks.filter(r => {
    const score = riskType === 'inherent' 
      ? r.inherentLikelihood * r.inherentConsequence
      : r.residualLikelihood * r.residualConsequence;
    return score >= matrix.thresholds.critical.min;
  }).length;
  const highCount = filteredRisks.filter(r => {
    const score = riskType === 'inherent' 
      ? r.inherentLikelihood * r.inherentConsequence
      : r.residualLikelihood * r.residualConsequence;
    return score >= matrix.thresholds.high.min && score < matrix.thresholds.critical.min;
  }).length;
  const mediumCount = filteredRisks.filter(r => {
    const score = riskType === 'inherent' 
      ? r.inherentLikelihood * r.inherentConsequence
      : r.residualLikelihood * r.residualConsequence;
    return score >= matrix.thresholds.medium.min && score < matrix.thresholds.high.min;
  }).length;

  const categories = Array.from(new Set(mockRisks.map(r => r.category)));
  const businessUnits = Array.from(new Set(mockRisks.map(r => r.businessUnit)));

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Grid3X3 size={24} className="text-[var(--primary)]" />
            <h1 className="text-h2 font-bold text-[var(--foreground)]">Risk Heatmap</h1>
          </div>
          <button 
            onClick={() => alert('Export heatmap as PNG/PDF')}
            className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
          >
            <Download size={18} />
            Export
          </button>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Visual representation of risk distribution across likelihood and consequence
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="text-sm text-[var(--foreground-muted)] mb-1">Total Risks</div>
          <div className="text-2xl font-bold text-[var(--foreground)]">{totalRisks}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-700 mb-1">Critical</div>
          <div className="text-2xl font-bold text-red-700">{criticalCount}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-sm text-orange-700 mb-1">High</div>
          <div className="text-2xl font-bold text-orange-700">{highCount}</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-sm text-yellow-700 mb-1">Medium</div>
          <div className="text-2xl font-bold text-yellow-700">{mediumCount}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[var(--foreground-muted)] flex items-center gap-2">
              <Filter size={16} />
              View:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setRiskType('inherent')}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  riskType === 'inherent'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-gray-100 text-[var(--foreground-muted)] hover:bg-gray-200'
                )}
              >
                Inherent Risk
              </button>
              <button
                onClick={() => setRiskType('residual')}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  riskType === 'residual'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-gray-100 text-[var(--foreground-muted)] hover:bg-gray-200'
                )}
              >
                Residual Risk
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--foreground-muted)]">Filter by:</span>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value as FilterType);
                setSelectedFilter('');
              }}
              className="px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            >
              <option value="all">All Risks</option>
              <option value="category">Category</option>
              <option value="businessUnit">Business Unit</option>
            </select>

            {filterType !== 'all' && (
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              >
                <option value="">Select {filterType === 'category' ? 'Category' : 'Business Unit'}</option>
                {(filterType === 'category' ? categories : businessUnits).map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-8">
        <RiskHeatmap
          cells={heatmapCells}
          likelihoodLabels={likelihoodLabels}
          consequenceLabels={consequenceLabels}
          title={`${riskType === 'inherent' ? 'Inherent' : 'Residual'} Risk Heatmap${selectedFilter ? ` - ${selectedFilter}` : ''}`}
          showCounts={true}
          clickable={true}
        />
      </div>

      {/* Legend */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-6 mt-6">
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Risk Rating Legend</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded" style={{ backgroundColor: matrix.thresholds.low.color }} />
            <div>
              <div className="text-sm font-medium">Low</div>
              <div className="text-xs text-[var(--foreground-muted)]">
                Score: {matrix.thresholds.low.min}-{matrix.thresholds.low.max}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded" style={{ backgroundColor: matrix.thresholds.medium.color }} />
            <div>
              <div className="text-sm font-medium">Medium</div>
              <div className="text-xs text-[var(--foreground-muted)]">
                Score: {matrix.thresholds.medium.min}-{matrix.thresholds.medium.max}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded" style={{ backgroundColor: matrix.thresholds.high.color }} />
            <div>
              <div className="text-sm font-medium">High</div>
              <div className="text-xs text-[var(--foreground-muted)]">
                Score: {matrix.thresholds.high.min}-{matrix.thresholds.high.max}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded" style={{ backgroundColor: matrix.thresholds.critical.color }} />
            <div>
              <div className="text-sm font-medium">Critical</div>
              <div className="text-xs text-[var(--foreground-muted)]">
                Score: {matrix.thresholds.critical.min}-{matrix.thresholds.critical.max}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
