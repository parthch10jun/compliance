'use client';

import { useState } from 'react';
import { type Risk } from '@/lib/data/erm-risks';
import { X, Eye } from 'lucide-react';
import clsx from 'clsx';

interface RiskHeatMapProps {
  risks: Risk[];
  onRiskClick: (risk: Risk) => void;
}

export default function RiskHeatMap({ risks, onRiskClick }: RiskHeatMapProps) {
  const [selectedCell, setSelectedCell] = useState<{ likelihood: number; consequence: number } | null>(null);
  const [viewType, setViewType] = useState<'inherent' | 'residual'>('inherent');

  // Calculate risk distribution in 5x5 matrix
  const calculateHeatMap = () => {
    const matrix: Risk[][][] = Array(5).fill(null).map(() => Array(5).fill(null).map(() => []));
    
    risks.forEach(risk => {
      const likelihood = viewType === 'inherent' ? risk.inherentLikelihood : risk.residualLikelihood;
      const consequence = viewType === 'inherent' ? risk.inherentConsequence : risk.residualConsequence;
      
      if (likelihood >= 1 && likelihood <= 5 && consequence >= 1 && consequence <= 5) {
        matrix[5 - consequence][likelihood - 1].push(risk);
      }
    });
    
    return matrix;
  };

  const heatMap = calculateHeatMap();

  const getCellColor = (consequence: number, likelihood: number) => {
    const score = consequence * likelihood;
    if (score >= 20) return 'bg-red-500 hover:bg-red-600';
    if (score >= 15) return 'bg-red-400 hover:bg-red-500';
    if (score >= 12) return 'bg-orange-500 hover:bg-orange-600';
    if (score >= 8) return 'bg-orange-400 hover:bg-orange-500';
    if (score >= 6) return 'bg-yellow-500 hover:bg-yellow-600';
    if (score >= 4) return 'bg-yellow-400 hover:bg-yellow-500';
    if (score >= 3) return 'bg-green-400 hover:bg-green-500';
    return 'bg-green-500 hover:bg-green-600';
  };

  const getCellTextColor = (consequence: number, likelihood: number) => {
    const score = consequence * likelihood;
    return score >= 6 ? 'text-white' : 'text-gray-800';
  };

  const getRisksInCell = (consequence: number, likelihood: number) => {
    return heatMap[5 - consequence][likelihood - 1];
  };

  const handleCellClick = (consequence: number, likelihood: number) => {
    const cellRisks = getRisksInCell(consequence, likelihood);
    if (cellRisks.length > 0) {
      setSelectedCell({ likelihood, consequence });
    }
  };

  const selectedCellRisks = selectedCell 
    ? getRisksInCell(selectedCell.consequence, selectedCell.likelihood)
    : [];

  return (
    <div className="space-y-4">
      {/* Toggle View Type */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-[var(--background-secondary)] rounded-lg p-1">
          <button
            onClick={() => setViewType('inherent')}
            className={clsx(
              'px-3 py-1.5 rounded-md text-p3 font-medium transition-all',
              viewType === 'inherent'
                ? 'bg-white text-[var(--foreground)] shadow-sm'
                : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            )}
          >
            Inherent Risk
          </button>
          <button
            onClick={() => setViewType('residual')}
            className={clsx(
              'px-3 py-1.5 rounded-md text-p3 font-medium transition-all',
              viewType === 'residual'
                ? 'bg-white text-[var(--foreground)] shadow-sm'
                : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            )}
          >
            Residual Risk
          </button>
        </div>
        <span className="text-p3 text-[var(--foreground-muted)]">Click any cell to view risks</span>
      </div>

      {/* Heat Map Grid */}
      <div className="border border-[var(--border)] rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              {/* Top left corner - empty */}
              <td className="bg-[var(--background-secondary)] border-b border-r border-[var(--border)] p-2 w-24"></td>

              {/* Likelihood headers */}
              {[1, 2, 3, 4, 5].map(l => (
                <td key={l} className="bg-[var(--background-secondary)] border-b border-r border-[var(--border)] p-2 text-center min-h-[60px] w-[120px]">
                  <div className="text-p3 font-semibold text-[var(--foreground)]">{l}</div>
                  <div className="text-xs text-[var(--foreground-muted)] leading-tight">
                    {l === 1 ? 'Rare' : l === 2 ? 'Unlikely' : l === 3 ? 'Possible' : l === 4 ? 'Likely' : (
                      <>Almost<br/>Certain</>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Consequence rows */}
            {[5, 4, 3, 2, 1].map(c => (
              <tr key={c}>
                {/* Consequence header */}
                <td className="bg-[var(--background-secondary)] border-b border-r border-[var(--border)] p-2 min-h-[60px]">
                  <div className="text-p3 font-semibold text-[var(--foreground)]">{c}</div>
                  <div className="text-xs text-[var(--foreground-muted)] leading-tight">
                    {c === 1 ? 'Insignificant' : c === 2 ? 'Minor' : c === 3 ? 'Moderate' : c === 4 ? 'Major' : 'Catastrophic'}
                  </div>
                </td>

                {/* Risk cells */}
                {[1, 2, 3, 4, 5].map(l => {
                  const cellRisks = getRisksInCell(c, l);
                  const count = cellRisks.length;

                  return (
                    <td
                      key={`${c}-${l}`}
                      className="border-b border-r border-[var(--border)] p-0 min-h-[60px] h-[60px]"
                    >
                      <button
                        onClick={() => handleCellClick(c, l)}
                        className={clsx(
                          'w-full h-full p-4 transition-all flex items-center justify-center',
                          getCellColor(c, l),
                          getCellTextColor(c, l),
                          count > 0 ? 'cursor-pointer' : 'cursor-default opacity-50'
                        )}
                      >
                        <div className="text-xl font-bold">{count}</div>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cell Detail Slide-Out */}
      {selectedCell && selectedCellRisks.length > 0 && (
        <div className="fixed inset-0 z-50 overflow-hidden" onClick={() => setSelectedCell(null)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          
          <div 
            className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                <div>
                  <h3 className="text-lg font-bold text-[var(--foreground)]">
                    Risks in Cell ({selectedCell.likelihood}, {selectedCell.consequence})
                  </h3>
                  <p className="text-p3 text-[var(--foreground-muted)]">
                    {selectedCellRisks.length} risks • {viewType === 'inherent' ? 'Inherent' : 'Residual'} view
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCell(null)}
                  className="p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Risk List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {selectedCellRisks.map(risk => (
                  <button
                    key={risk.id}
                    onClick={() => {
                      onRiskClick(risk);
                      setSelectedCell(null);
                    }}
                    className="w-full p-4 bg-[var(--background-secondary)] hover:bg-[var(--background)] border border-[var(--border)] rounded-lg text-left transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-p3 font-semibold text-indigo-600">{risk.id}</span>
                      <Eye size={16} className="text-[var(--foreground-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h4 className="text-p2 font-semibold text-[var(--foreground)] mb-1">{risk.title}</h4>
                    <p className="text-p3 text-[var(--foreground-muted)] line-clamp-2 mb-2">{risk.description}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full font-semibold">
                        {risk.category}
                      </span>
                      <span className="text-[var(--foreground-muted)]">•</span>
                      <span className="text-[var(--foreground-muted)]">{risk.owner}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
