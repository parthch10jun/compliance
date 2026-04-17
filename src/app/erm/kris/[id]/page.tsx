'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, TrendingUp, TrendingDown, Minus, Calendar, 
  User, Database, Clock, Link as LinkIcon, Edit, Plus,
  CheckCircle, AlertCircle, AlertTriangle 
} from 'lucide-react';
import clsx from 'clsx';
import { mockKRIs, type KRI } from '@/lib/data/kris';

// Mock historical data for trend chart
const generateHistoricalData = (kri: KRI) => {
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const data = [];
  
  let baseValue = kri.currentValue;
  for (let i = months.length - 1; i >= 0; i--) {
    const variance = (Math.random() - 0.5) * (baseValue * 0.2);
    const value = Math.max(0, baseValue + variance);
    data.unshift({
      month: months[i],
      value: Math.round(value * 100) / 100,
      date: new Date(2023, 9 + i, 1).toISOString()
    });
    baseValue = value;
  }
  
  return data;
};

// Mock measurement history
const generateMeasurementHistory = (kri: KRI) => {
  return [
    {
      id: 'M-001',
      value: kri.currentValue,
      date: kri.lastMeasured,
      status: kri.status,
      notes: 'Latest measurement',
      recordedBy: 'System Auto-Collection'
    },
    {
      id: 'M-002',
      value: kri.previousValue,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: kri.previousValue <= kri.yellowThreshold ? 'ok' : 'warning',
      notes: 'Weekly update',
      recordedBy: kri.owner
    },
    {
      id: 'M-003',
      value: kri.previousValue - 2,
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'ok',
      notes: 'Normal operations',
      recordedBy: 'System Auto-Collection'
    }
  ];
};

export default function KRIDetailPage() {
  const params = useParams();
  const router = useRouter();
  const kriId = params.id as string;
  
  const kri = mockKRIs.find(k => k.id === kriId);
  
  const [showDataEntry, setShowDataEntry] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [newNotes, setNewNotes] = useState('');
  
  if (!kri) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertTriangle size={48} className="mx-auto mb-4 text-red-600" />
          <h2 className="text-xl font-semibold mb-2">KRI Not Found</h2>
          <p className="text-[var(--foreground-muted)] mb-4">The KRI you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/erm/kris')}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)]"
          >
            Back to KRIs
          </button>
        </div>
      </div>
    );
  }
  
  const historicalData = generateHistoricalData(kri);
  const measurementHistory = generateMeasurementHistory(kri);
  
  const getStatusBadge = (status: KRI['status']) => {
    switch (status) {
      case 'ok':
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full flex items-center gap-1"><CheckCircle size={14} /> OK</span>;
      case 'warning':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full flex items-center gap-1"><AlertCircle size={14} /> Warning</span>;
      case 'breach':
        return <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full flex items-center gap-1"><AlertTriangle size={14} /> Breach</span>;
    }
  };
  
  const getTrendIcon = (trend: KRI['trend'], direction: KRI['direction']) => {
    if (trend === 'stable') return <Minus size={20} className="text-gray-600" />;
    
    const isGood = (trend === 'up' && direction === 'higher_better') || (trend === 'down' && direction === 'lower_better');
    
    if (trend === 'up') {
      return <TrendingUp size={20} className={isGood ? 'text-green-600' : 'text-red-600'} />;
    } else {
      return <TrendingDown size={20} className={isGood ? 'text-green-600' : 'text-red-600'} />;
    }
  };
  
  const formatValue = (value: number) => {
    if (kri.unit === '%') return `${value}%`;
    if (kri.unit === 'USD') return `$${value.toLocaleString()}`;
    if (kri.unit === 'minutes') return `${value} min`;
    if (kri.unit === 'days') return `${value} days`;
    return value.toString();
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const handleDataEntry = () => {
    // In real app, this would save to backend
    alert(`New value ${newValue} recorded for ${kri.name}`);
    setShowDataEntry(false);
    setNewValue('');
    setNewNotes('');
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/erm/kris')}
          className="flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to KRIs
        </button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-h2 font-bold text-[var(--foreground)]">{kri.name}</h1>
              {getStatusBadge(kri.status)}
              {getTrendIcon(kri.trend, kri.direction)}
            </div>
            <p className="text-p1 text-[var(--foreground-muted)] mb-4">{kri.description}</p>
            <div className="flex items-center gap-4 text-sm text-[var(--foreground-muted)]">
              <span className="flex items-center gap-1">
                <User size={14} />
                {kri.owner}
              </span>
              <span className="flex items-center gap-1">
                <Database size={14} />
                {kri.dataSource}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {kri.frequency}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDataEntry(!showDataEntry)}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium"
            >
              <Plus size={18} />
              Record Value
            </button>
            <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
              <Edit size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Data Entry Form */}
      {showDataEntry && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-[var(--foreground)] mb-3">Record New Measurement</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Value ({kri.unit})</label>
              <input
                type="number"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder={`Enter value in ${kri.unit}`}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
            <textarea
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Add any relevant notes..."
              rows={2}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDataEntry}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)]"
            >
              Save Measurement
            </button>
            <button
              onClick={() => setShowDataEntry(false)}
              className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Current Value Card */}
        <div className="bg-white border border-[var(--border)] rounded-lg p-6">
          <div className="text-sm text-[var(--foreground-muted)] mb-1">Current Value</div>
          <div className="text-3xl font-bold text-[var(--foreground)] mb-1">{formatValue(kri.currentValue)}</div>
          <div className="text-sm text-[var(--foreground-muted)]">
            Previous: {formatValue(kri.previousValue)}
          </div>
        </div>

        {/* Target Threshold Card */}
        <div className="bg-white border border-[var(--border)] rounded-lg p-6">
          <div className="text-sm text-[var(--foreground-muted)] mb-1">Target Threshold</div>
          <div className="text-3xl font-bold text-[var(--foreground)] mb-1">
            {formatValue(kri.direction === 'lower_better' ? kri.greenThreshold : kri.greenThreshold)}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">
            {kri.direction === 'higher_better' ? '≥' : '≤'} Green zone
          </div>
        </div>

        {/* Last Measured Card */}
        <div className="bg-white border border-[var(--border)] rounded-lg p-6">
          <div className="text-sm text-[var(--foreground-muted)] mb-1">Last Measured</div>
          <div className="text-xl font-semibold text-[var(--foreground)] mb-1">{formatDate(kri.lastMeasured)}</div>
          <div className="text-sm text-[var(--foreground-muted)]">
            Next: {formatDate(kri.nextMeasurement)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Threshold Visualization & Trend */}
        <div className="col-span-2 space-y-6">
          {/* Threshold Visualization */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Threshold Configuration</h2>

            <div className="space-y-4">
              {/* Visual Bar */}
              <div className="relative h-12 rounded-lg overflow-hidden bg-gradient-to-r from-green-200 via-yellow-200 to-red-200">
                {/* Current Value Indicator */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-blue-600"
                  style={{
                    left: kri.direction === 'lower_better'
                      ? `${Math.min(100, (kri.currentValue / kri.redThreshold) * 100)}%`
                      : `${Math.min(100, (kri.currentValue / (kri.greenThreshold * 1.2)) * 100)}%`
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {formatValue(kri.currentValue)}
                  </div>
                </div>
              </div>

              {/* Threshold Legend */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 rounded"></div>
                  <div>
                    <div className="text-sm font-medium">Green Zone</div>
                    <div className="text-xs text-[var(--foreground-muted)]">
                      {kri.direction === 'lower_better' ? '≤' : '≥'} {formatValue(kri.greenThreshold)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                  <div>
                    <div className="text-sm font-medium">Yellow Zone</div>
                    <div className="text-xs text-[var(--foreground-muted)]">
                      {kri.direction === 'lower_better' ? '≤' : '≥'} {formatValue(kri.yellowThreshold)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-200 rounded"></div>
                  <div>
                    <div className="text-sm font-medium">Red Zone</div>
                    <div className="text-xs text-[var(--foreground-muted)]">
                      {kri.direction === 'lower_better' ? '>' : '<'} {formatValue(kri.redThreshold)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Trend Chart */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Historical Trend (9 Months)</h2>

            <svg viewBox="0 0 800 280" className="w-full h-auto">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4, 5].map(i => {
                const y = 40 + (i * 160 / 5);
                return (
                  <line
                    key={i}
                    x1="60"
                    y1={y}
                    x2="760"
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Threshold zones */}
              <defs>
                <linearGradient id="thresholdGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fecaca" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#fef08a" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              <rect x="60" y="40" width="700" height="160" fill="url(#thresholdGradient)" />

              {/* Y-axis */}
              <line x1="60" y1="40" x2="60" y2="200" stroke="#9ca3af" strokeWidth="2" />
              {/* X-axis */}
              <line x1="60" y1="200" x2="760" y2="200" stroke="#9ca3af" strokeWidth="2" />

              {/* Line and points */}
              <path
                d={`M ${historicalData.map((d, i) => {
                  const x = 60 + (i / (historicalData.length - 1)) * 700;
                  const maxValue = Math.max(...historicalData.map(h => h.value), kri.redThreshold);
                  const y = 200 - (d.value / maxValue) * 160;
                  return `${x} ${y}`;
                }).join(' L ')}`}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {historicalData.map((d, i) => {
                const x = 60 + (i / (historicalData.length - 1)) * 700;
                const maxValue = Math.max(...historicalData.map(h => h.value), kri.redThreshold);
                const y = 200 - (d.value / maxValue) * 160;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill="white" stroke="#6366f1" strokeWidth="2" />
                    <circle cx={x} cy={y} r="2" fill="#6366f1" />
                  </g>
                );
              })}

              {/* X-axis labels */}
              {historicalData.map((d, i) => {
                const x = 60 + (i / (historicalData.length - 1)) * 700;
                return (
                  <text
                    key={i}
                    x={x}
                    y="225"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="400"
                    fill="#9ca3af"
                  >
                    {d.month}
                  </text>
                );
              })}

              {/* Y-axis labels */}
              {[0, 1, 2, 3, 4, 5].map(i => {
                const maxValue = Math.max(...historicalData.map(h => h.value), kri.redThreshold);
                const value = Math.round((i / 5) * maxValue * 100) / 100;
                const y = 200 - (i * 160 / 5);
                return (
                  <text
                    key={i}
                    x="45"
                    y={y + 4}
                    textAnchor="end"
                    fontSize="11"
                    fontWeight="400"
                    fill="#9ca3af"
                  >
                    {formatValue(value)}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Measurement History */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Recent Measurements</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-[var(--border)]">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--foreground)]">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--foreground)]">Value</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--foreground)]">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--foreground)]">Notes</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--foreground)]">Recorded By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {measurementHistory.map(measurement => (
                    <tr key={measurement.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{formatDate(measurement.date)}</td>
                      <td className="px-4 py-3 text-sm font-semibold">{formatValue(measurement.value)}</td>
                      <td className="px-4 py-3">{getStatusBadge(measurement.status as any)}</td>
                      <td className="px-4 py-3 text-sm text-[var(--foreground-muted)]">{measurement.notes}</td>
                      <td className="px-4 py-3 text-sm text-[var(--foreground-muted)]">{measurement.recordedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Info & Links */}
        <div className="space-y-6">
          {/* KRI Information */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">KRI Information</h2>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">ID</div>
                <div className="text-sm font-medium">{kri.id}</div>
              </div>

              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Category</div>
                <div className="text-sm font-medium">{kri.category}</div>
              </div>

              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Owner</div>
                <div className="text-sm font-medium">{kri.owner}</div>
              </div>

              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Measurement Frequency</div>
                <div className="text-sm font-medium capitalize">{kri.frequency}</div>
              </div>

              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Data Source</div>
                <div className="text-sm font-medium">{kri.dataSource}</div>
              </div>

              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Direction</div>
                <div className="text-sm font-medium capitalize">{kri.direction.replace('_', ' ')}</div>
              </div>
            </div>
          </div>

          {/* Linked Risks */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <LinkIcon size={18} />
              Linked Risks
            </h2>

            <div className="space-y-2">
              {kri.linkedRisks.map(riskId => (
                <button
                  key={riskId}
                  onClick={() => router.push(`/erm/risk-register?id=${riskId}`)}
                  className="w-full px-3 py-2 text-left border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-colors"
                >
                  <div className="text-sm font-medium text-[var(--primary)]">{riskId}</div>
                  <div className="text-xs text-[var(--foreground-muted)]">View risk details →</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
