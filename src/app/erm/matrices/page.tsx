'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Grid3X3, Plus, Eye } from 'lucide-react';
import clsx from 'clsx';
import { mockRiskMatrices, type RiskMatrix } from '@/lib/data/categories-matrices';

export default function MatricesPage() {
  const router = useRouter();
  const [selectedMatrix, setSelectedMatrix] = useState(mockRiskMatrices[0]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Grid3X3 size={24} className="text-[var(--primary)]" />
            <h1 className="text-h2 font-bold text-[var(--foreground)]">Risk Matrices</h1>
          </div>
          <button
            onClick={() => router.push('/erm/matrices/new')}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium"
          >
            <Plus size={18} />
            Create Matrix
          </button>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Manage risk assessment matrices with likelihood and consequence scales
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Matrix List */}
        <div className="space-y-4">
          <div className="bg-white border border-[var(--border)] rounded-lg p-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Available Matrices</h2>

            <div className="space-y-3">
              {mockRiskMatrices.map(matrix => (
                <div
                  key={matrix.id}
                  onClick={() => setSelectedMatrix(matrix)}
                  className={clsx(
                    'p-4 border-2 rounded-lg cursor-pointer transition-all',
                    selectedMatrix.id === matrix.id
                      ? 'border-[var(--primary)] bg-blue-50'
                      : 'border-[var(--border)] hover:border-gray-300'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-[var(--primary)]">{matrix.id}</span>
                        {matrix.isDefault && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700">
                            Default
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-[var(--foreground)]">{matrix.name}</h3>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--foreground-muted)] mb-2">{matrix.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 font-medium">
                      {matrix.level}
                    </span>
                    <span className="text-[var(--foreground-muted)]">
                      {matrix.dimensions.likelihood}×{matrix.dimensions.consequence}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Matrix Info */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Matrix Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">Dimensions:</span>
                <span className="font-medium">{selectedMatrix.dimensions.likelihood} × {selectedMatrix.dimensions.consequence}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">Level:</span>
                <span className="font-medium">{selectedMatrix.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">Version:</span>
                <span className="font-medium">{selectedMatrix.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">Created:</span>
                <span className="font-medium">{new Date(selectedMatrix.createdDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Matrix Visualization */}
        <div className="col-span-2 bg-white border border-[var(--border)] rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              {selectedMatrix.name}
            </h2>
            <button
              onClick={() => router.push(`/erm/matrices/${selectedMatrix.id}`)}
              className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
            >
              <Eye size={16} />
              View Details
            </button>
          </div>

          {/* Risk Matrix Grid */}
          <div className="mb-6">
            <div className="inline-block border-2 border-gray-300 rounded-lg overflow-hidden">
              <table className="border-collapse">
                <thead>
                  <tr>
                    <th className="bg-gray-100 border border-gray-300 p-2 text-xs font-semibold w-24"></th>
                    {selectedMatrix.consequenceScale.map(level => (
                      <th key={level.value} className="bg-gray-100 border border-gray-300 p-2 text-xs font-semibold text-center min-w-[80px]">
                        <div>{level.label}</div>
                        <div className="font-normal text-gray-600">({level.value})</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedMatrix.cells.map((row, rowIndex) => {
                    const likelihoodLevel = selectedMatrix.likelihoodScale.find(
                      l => l.value === row[0].likelihood
                    );
                    return (
                      <tr key={rowIndex}>
                        <th className="bg-gray-100 border border-gray-300 p-2 text-xs font-semibold text-right">
                          <div>{likelihoodLevel?.label}</div>
                          <div className="font-normal text-gray-600">({row[0].likelihood})</div>
                        </th>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="border border-gray-300 p-3 text-center font-bold text-sm"
                            style={{ backgroundColor: cell.color, color: '#fff' }}
                            title={`Score: ${cell.score} | Rating: ${cell.rating}`}
                          >
                            {cell.score}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Axis Labels */}
            <div className="flex items-center justify-between mt-4 px-4">
              <div className="text-sm text-[var(--foreground-muted)]">
                ← <span className="font-medium">Consequence</span> →
              </div>
            </div>
            <div className="text-sm text-[var(--foreground-muted)] text-center mt-2">
              ↑ <span className="font-medium">Likelihood</span> ↑
            </div>
          </div>

          {/* Legend */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Risk Rating Legend</h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: selectedMatrix.thresholds.low.color }} />
                <div>
                  <div className="text-xs font-medium">Low</div>
                  <div className="text-xs text-[var(--foreground-muted)]">{selectedMatrix.thresholds.low.min}-{selectedMatrix.thresholds.low.max}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: selectedMatrix.thresholds.medium.color }} />
                <div>
                  <div className="text-xs font-medium">Medium</div>
                  <div className="text-xs text-[var(--foreground-muted)]">{selectedMatrix.thresholds.medium.min}-{selectedMatrix.thresholds.medium.max}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: selectedMatrix.thresholds.high.color }} />
                <div>
                  <div className="text-xs font-medium">High</div>
                  <div className="text-xs text-[var(--foreground-muted)]">{selectedMatrix.thresholds.high.min}-{selectedMatrix.thresholds.high.max}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: selectedMatrix.thresholds.critical.color }} />
                <div>
                  <div className="text-xs font-medium">Critical</div>
                  <div className="text-xs text-[var(--foreground-muted)]">{selectedMatrix.thresholds.critical.min}-{selectedMatrix.thresholds.critical.max}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
