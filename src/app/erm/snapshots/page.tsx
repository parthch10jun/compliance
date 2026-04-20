'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Calendar, Download, Plus, GitCompare, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import clsx from 'clsx';

interface Snapshot {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  createdBy: string;
  metrics: {
    totalRisks: number;
    criticalRisks: number;
    highRisks: number;
    mediumRisks: number;
    lowRisks: number;
    avgResidualScore: number;
    treatmentsInProgress: number;
    completedTreatments: number;
    overdueTreatments: number;
  };
}

const mockSnapshots: Snapshot[] = [
  {
    id: 'SNAP-001',
    name: 'Q1 2024 End',
    description: 'End of Q1 2024 risk portfolio snapshot',
    createdDate: '2024-03-31T23:59:59',
    createdBy: 'Sarah Chen',
    metrics: {
      totalRisks: 45,
      criticalRisks: 5,
      highRisks: 12,
      mediumRisks: 18,
      lowRisks: 10,
      avgResidualScore: 8.5,
      treatmentsInProgress: 23,
      completedTreatments: 15,
      overdueTreatments: 3
    }
  },
  {
    id: 'SNAP-002',
    name: 'Current State',
    description: 'Current risk portfolio state - April 2024',
    createdDate: '2024-04-20T16:00:00',
    createdBy: 'System Auto',
    metrics: {
      totalRisks: 48,
      criticalRisks: 4,
      highRisks: 14,
      mediumRisks: 19,
      lowRisks: 11,
      avgResidualScore: 7.8,
      treatmentsInProgress: 28,
      completedTreatments: 18,
      overdueTreatments: 2
    }
  },
  {
    id: 'SNAP-003',
    name: 'Post-Assessment Q4 2023',
    description: 'After Q4 2023 enterprise risk assessment',
    createdDate: '2023-12-31T23:59:59',
    createdBy: 'Jennifer Walsh',
    metrics: {
      totalRisks: 42,
      criticalRisks: 7,
      highRisks: 11,
      mediumRisks: 15,
      lowRisks: 9,
      avgResidualScore: 9.2,
      treatmentsInProgress: 18,
      completedTreatments: 12,
      overdueTreatments: 5
    }
  }
];

export default function SnapshotsPage() {
  const router = useRouter();
  const [selectedSnapshot1, setSelectedSnapshot1] = useState('SNAP-003');
  const [selectedSnapshot2, setSelectedSnapshot2] = useState('SNAP-002');
  const [compareMode, setCompareMode] = useState(true);

  const snapshot1 = mockSnapshots.find(s => s.id === selectedSnapshot1);
  const snapshot2 = mockSnapshots.find(s => s.id === selectedSnapshot2);

  const calculateChange = (metric: keyof Snapshot['metrics']) => {
    if (!snapshot1 || !snapshot2) return { value: 0, percentage: 0, trend: 'neutral' as const };
    
    const val1 = snapshot1.metrics[metric] as number;
    const val2 = snapshot2.metrics[metric] as number;
    const change = val2 - val1;
    const percentage = val1 !== 0 ? ((change / val1) * 100) : 0;
    
    return {
      value: change,
      percentage,
      trend: change > 0 ? 'up' as const : change < 0 ? 'down' as const : 'neutral' as const
    };
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral', inverse = false) => {
    if (trend === 'neutral') return <Minus size={16} className="text-gray-500" />;
    if (trend === 'up') {
      return inverse 
        ? <TrendingDown size={16} className="text-green-600" />
        : <TrendingUp size={16} className="text-red-600" />;
    }
    return inverse
      ? <TrendingUp size={16} className="text-red-600" />
      : <TrendingDown size={16} className="text-green-600" />;
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral', inverse = false) => {
    if (trend === 'neutral') return 'text-gray-600';
    if (trend === 'up') {
      return inverse ? 'text-green-600' : 'text-red-600';
    }
    return inverse ? 'text-red-600' : 'text-green-600';
  };

  const handleCreateSnapshot = () => {
    const name = prompt('Enter snapshot name:');
    if (name) {
      alert(`Snapshot "${name}" created successfully!`);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Camera size={24} className="text-[var(--primary)]" />
            <h1 className="text-h2 font-bold text-[var(--foreground)]">Dashboard Snapshots</h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setCompareMode(!compareMode)}
              className={clsx(
                'px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium',
                compareMode
                  ? 'bg-[var(--primary)] text-white'
                  : 'border border-[var(--border)] hover:bg-gray-50'
              )}
            >
              <GitCompare size={18} />
              Compare Mode
            </button>
            <button 
              onClick={handleCreateSnapshot}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium"
            >
              <Plus size={18} />
              Create Snapshot
            </button>
          </div>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Capture and compare risk portfolio states over time
        </p>
      </div>

      {compareMode ? (
        <>
          {/* Snapshot Selectors */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-[var(--border)] rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Baseline Snapshot</label>
              <select
                value={selectedSnapshot1}
                onChange={(e) => setSelectedSnapshot1(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                {mockSnapshots.map(snap => (
                  <option key={snap.id} value={snap.id}>
                    {snap.name} - {new Date(snap.createdDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-white border border-[var(--border)] rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Comparison Snapshot</label>
              <select
                value={selectedSnapshot2}
                onChange={(e) => setSelectedSnapshot2(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                {mockSnapshots.map(snap => (
                  <option key={snap.id} value={snap.id}>
                    {snap.name} - {new Date(snap.createdDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Metrics */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">Risk Portfolio Comparison</h3>

            <div className="grid grid-cols-3 gap-6">
              {/* Total Risks */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">Total Risks</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{snapshot2?.metrics.totalRisks}</div>
                    <div className="text-xs text-gray-500">was {snapshot1?.metrics.totalRisks}</div>
                  </div>
                  <div className={clsx('flex items-center gap-1', getTrendColor(calculateChange('totalRisks').trend))}>
                    {getTrendIcon(calculateChange('totalRisks').trend)}
                    <span className="text-sm font-semibold">
                      {Math.abs(calculateChange('totalRisks').value)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Critical Risks */}
              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="text-sm text-red-700 mb-2">Critical Risks</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-700">{snapshot2?.metrics.criticalRisks}</div>
                    <div className="text-xs text-red-600">was {snapshot1?.metrics.criticalRisks}</div>
                  </div>
                  <div className={clsx('flex items-center gap-1', getTrendColor(calculateChange('criticalRisks').trend, true))}>
                    {getTrendIcon(calculateChange('criticalRisks').trend, true)}
                    <span className="text-sm font-semibold">
                      {Math.abs(calculateChange('criticalRisks').value)}
                    </span>
                  </div>
                </div>
              </div>

              {/* High Risks */}
              <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <div className="text-sm text-orange-700 mb-2">High Risks</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-orange-700">{snapshot2?.metrics.highRisks}</div>
                    <div className="text-xs text-orange-600">was {snapshot1?.metrics.highRisks}</div>
                  </div>
                  <div className={clsx('flex items-center gap-1', getTrendColor(calculateChange('highRisks').trend, true))}>
                    {getTrendIcon(calculateChange('highRisks').trend, true)}
                    <span className="text-sm font-semibold">
                      {Math.abs(calculateChange('highRisks').value)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Medium Risks */}
              <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                <div className="text-sm text-yellow-700 mb-2">Medium Risks</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-yellow-700">{snapshot2?.metrics.mediumRisks}</div>
                    <div className="text-xs text-yellow-600">was {snapshot1?.metrics.mediumRisks}</div>
                  </div>
                  <div className={clsx('flex items-center gap-1', getTrendColor(calculateChange('mediumRisks').trend))}>
                    {getTrendIcon(calculateChange('mediumRisks').trend)}
                    <span className="text-sm font-semibold">
                      {Math.abs(calculateChange('mediumRisks').value)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Avg Residual Score */}
              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <div className="text-sm text-purple-700 mb-2">Avg Residual Score</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-700">{snapshot2?.metrics.avgResidualScore.toFixed(1)}</div>
                    <div className="text-xs text-purple-600">was {snapshot1?.metrics.avgResidualScore.toFixed(1)}</div>
                  </div>
                  <div className={clsx('flex items-center gap-1', getTrendColor(calculateChange('avgResidualScore').trend, true))}>
                    {getTrendIcon(calculateChange('avgResidualScore').trend, true)}
                    <span className="text-sm font-semibold">
                      {Math.abs(calculateChange('avgResidualScore').value).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Overdue Treatments */}
              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="text-sm text-red-700 mb-2">Overdue Treatments</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-700">{snapshot2?.metrics.overdueTreatments}</div>
                    <div className="text-xs text-red-600">was {snapshot1?.metrics.overdueTreatments}</div>
                  </div>
                  <div className={clsx('flex items-center gap-1', getTrendColor(calculateChange('overdueTreatments').trend, true))}>
                    {getTrendIcon(calculateChange('overdueTreatments').trend, true)}
                    <span className="text-sm font-semibold">
                      {Math.abs(calculateChange('overdueTreatments').value)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Treatment Progress Comparison */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-[var(--border)] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                {snapshot1?.name} - Treatments
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="text-lg font-bold text-blue-600">{snapshot1?.metrics.treatmentsInProgress}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="text-lg font-bold text-green-600">{snapshot1?.metrics.completedTreatments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Overdue</span>
                  <span className="text-lg font-bold text-red-600">{snapshot1?.metrics.overdueTreatments}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[var(--border)] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                {snapshot2?.name} - Treatments
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="text-lg font-bold text-blue-600">{snapshot2?.metrics.treatmentsInProgress}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="text-lg font-bold text-green-600">{snapshot2?.metrics.completedTreatments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Overdue</span>
                  <span className="text-lg font-bold text-red-600">{snapshot2?.metrics.overdueTreatments}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* All Snapshots List */
        <div className="bg-white border border-[var(--border)] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Created</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Total Risks</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Critical</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockSnapshots.map(snap => (
                <tr key={snap.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 text-sm">{snap.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">{snap.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">{new Date(snap.createdDate).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">by {snap.createdBy}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-gray-900">{snap.metrics.totalRisks}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-red-700">{snap.metrics.criticalRisks}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/erm/snapshots/${snap.id}`)}
                        className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50"
                      >
                        View Details
                      </button>
                      <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50 flex items-center gap-1">
                        <Download size={12} />
                        Export
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

