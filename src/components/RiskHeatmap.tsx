'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

interface HeatmapCell {
  likelihood: number;
  consequence: number;
  score: number;
  rating: 'Low' | 'Medium' | 'High' | 'Critical';
  color: string;
  riskCount: number;
  risks: {
    id: string;
    title: string;
    rating: string;
  }[];
}

interface RiskHeatmapProps {
  cells: HeatmapCell[][];
  likelihoodLabels: string[];
  consequenceLabels: string[];
  title?: string;
  showCounts?: boolean;
  clickable?: boolean;
}

export function RiskHeatmap({
  cells,
  likelihoodLabels,
  consequenceLabels,
  title = 'Risk Heatmap',
  showCounts = true,
  clickable = true
}: RiskHeatmapProps) {
  const router = useRouter();
  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(null);

  const handleCellClick = (cell: HeatmapCell) => {
    if (!clickable) return;
    setSelectedCell(selectedCell?.likelihood === cell.likelihood && selectedCell?.consequence === cell.consequence ? null : cell);
  };

  return (
    <div>
      {title && <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">{title}</h3>}

      <div className="flex gap-6 items-start">
        {/* Y-Axis Label (Likelihood) - Vertical */}
        <div className="flex items-center justify-center" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>
          <div className="text-sm font-semibold text-[var(--foreground)] whitespace-nowrap">
            ← Likelihood →
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="flex-1">
          <div className="w-full border-2 border-gray-300 rounded-lg overflow-hidden">
            <table className="border-collapse w-full">
              <thead>
                <tr>
                  <th className="bg-gray-100 border border-gray-300 p-3 text-xs font-semibold w-32"></th>
                  {consequenceLabels.map((label, idx) => (
                    <th key={idx} className="bg-gray-100 border border-gray-300 p-3 text-xs font-semibold text-center">
                      <div className="font-bold text-sm">{label}</div>
                      <div className="font-normal text-gray-600 text-xs">({idx + 1})</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cells.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <th className="bg-gray-100 border border-gray-300 p-3 text-xs font-semibold text-right">
                      <div className="font-bold text-sm">{likelihoodLabels[cells.length - 1 - rowIndex]}</div>
                      <div className="font-normal text-gray-600 text-xs">({row[0].likelihood})</div>
                    </th>
                    {row.map((cell, cellIndex) => {
                      const isSelected = selectedCell?.likelihood === cell.likelihood && selectedCell?.consequence === cell.consequence;
                      return (
                        <td
                          key={cellIndex}
                          onClick={() => handleCellClick(cell)}
                          className={clsx(
                            'border border-gray-300 text-center font-bold relative h-24',
                            clickable && 'cursor-pointer hover:opacity-90 transition-all'
                          )}
                          style={{
                            backgroundColor: cell.color,
                            color: '#fff',
                            boxShadow: isSelected ? 'inset 0 0 0 4px #3b82f6' : undefined
                          }}
                          title={`Score: ${cell.score} | Rating: ${cell.rating} | ${cell.riskCount} risks`}
                        >
                          <div className="text-3xl font-bold">{cell.score}</div>
                          {showCounts && cell.riskCount > 0 && (
                            <div className="absolute top-2 right-2 bg-white text-gray-900 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-md">
                              {cell.riskCount}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* X-Axis Label (Consequence) - Horizontal */}
          <div className="text-center mt-4 text-sm font-semibold text-[var(--foreground)]">
            ← Consequence →
          </div>
        </div>

        {/* Selected Cell Details */}
        {selectedCell && selectedCell.riskCount > 0 && (
          <div className="w-80 bg-white border border-[var(--border)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-[var(--foreground)]">
                Cell Details
              </h4>
              <button
                onClick={() => setSelectedCell(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--foreground-muted)]">Score:</span>
                <span className="text-lg font-bold">{selectedCell.score}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--foreground-muted)]">Rating:</span>
                <span className={clsx(
                  'px-2 py-1 text-xs font-medium rounded',
                  selectedCell.rating === 'Critical' ? 'bg-red-100 text-red-700' :
                  selectedCell.rating === 'High' ? 'bg-orange-100 text-orange-700' :
                  selectedCell.rating === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                )}>
                  {selectedCell.rating}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--foreground-muted)]">Likelihood:</span>
                <span className="font-medium">{likelihoodLabels[selectedCell.likelihood - 1]} ({selectedCell.likelihood})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--foreground-muted)]">Consequence:</span>
                <span className="font-medium">{consequenceLabels[selectedCell.consequence - 1]} ({selectedCell.consequence})</span>
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-4">
              <h5 className="text-sm font-semibold text-[var(--foreground)] mb-3">
                Risks in this Cell ({selectedCell.riskCount})
              </h5>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedCell.risks.map(risk => (
                  <div
                    key={risk.id}
                    onClick={() => router.push(`/erm/risk-register/${risk.id}`)}
                    className="p-3 border border-[var(--border)] rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="text-xs font-medium text-[var(--primary)] mb-1">{risk.id}</div>
                    <div className="text-sm text-[var(--foreground)]">{risk.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
