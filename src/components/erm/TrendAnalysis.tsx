'use client';

import { useState } from 'react';
import { type Risk } from '@/lib/data/erm-risks';
import { TrendingDown, TrendingUp, Minus, Calendar } from 'lucide-react';
import clsx from 'clsx';

interface TrendDataPoint {
  month: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

interface TrendAnalysisProps {
  currentRisks: Risk[];
}

export default function TrendAnalysis({ currentRisks }: TrendAnalysisProps) {
  const [timeRange, setTimeRange] = useState<'3M' | '6M' | '1Y'>('6M');
  const [selectedMetric, setSelectedMetric] = useState<'total' | 'critical' | 'high'>('critical');

  // Generate historical trend data (simulated)
  const generateTrendData = (): TrendDataPoint[] => {
    const months = timeRange === '3M' ? 3 : timeRange === '6M' ? 6 : 12;
    const data: TrendDataPoint[] = [];
    
    const currentCritical = currentRisks.filter(r => r.inherentRating === 'Critical').length;
    const currentHigh = currentRisks.filter(r => r.inherentRating === 'High').length;
    const currentMedium = currentRisks.filter(r => r.inherentRating === 'Medium').length;
    const currentLow = currentRisks.filter(r => r.inherentRating === 'Low').length;
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      // Simulate improvement over time
      const factor = 1 + (i / months) * 0.5;
      
      data.push({
        month: monthName,
        critical: Math.round(currentCritical * factor),
        high: Math.round(currentHigh * factor),
        medium: Math.round(currentMedium * (1 + (i / months) * 0.2)),
        low: Math.round(currentLow * (1 - (i / months) * 0.2)),
        total: Math.round(currentRisks.length * (1 + (i / months) * 0.15))
      });
    }
    
    return data;
  };

  const trendData = generateTrendData();
  const latestData = trendData[trendData.length - 1];
  const previousData = trendData[trendData.length - 2];

  const getChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(Math.round(change)),
      direction: change < 0 ? 'down' : change > 0 ? 'up' : 'stable'
    };
  };

  const criticalChange = getChange(latestData.critical, previousData.critical);
  const highChange = getChange(latestData.high, previousData.high);
  const totalChange = getChange(latestData.total, previousData.total);

  // Calculate max value for scaling
  const maxValue = Math.max(...trendData.map(d =>
    selectedMetric === 'total' ? d.total :
    selectedMetric === 'critical' ? d.critical : d.high
  ));

  const getPointY = (value: number) => {
    return 100 - (value / maxValue) * 100;
  };

  const metricData = trendData.map(d =>
    selectedMetric === 'total' ? d.total :
    selectedMetric === 'critical' ? d.critical : d.high
  );

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-[var(--background-secondary)] rounded-lg p-1">
          {(['3M', '6M', '1Y'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={clsx(
                'px-3 py-1.5 rounded-md text-p3 font-medium transition-all',
                timeRange === range
                  ? 'bg-white text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
              )}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-[var(--background-secondary)] rounded-lg p-1">
          <button
            onClick={() => setSelectedMetric('critical')}
            className={clsx(
              'px-3 py-1.5 rounded-md text-p3 font-medium transition-all',
              selectedMetric === 'critical'
                ? 'bg-red-100 text-red-700 border border-red-200'
                : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            )}
          >
            Critical
          </button>
          <button
            onClick={() => setSelectedMetric('high')}
            className={clsx(
              'px-3 py-1.5 rounded-md text-p3 font-medium transition-all',
              selectedMetric === 'high'
                ? 'bg-orange-100 text-orange-700 border border-orange-200'
                : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            )}
          >
            High
          </button>
          <button
            onClick={() => setSelectedMetric('total')}
            className={clsx(
              'px-3 py-1.5 rounded-md text-p3 font-medium transition-all',
              selectedMetric === 'total'
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            )}
          >
            Total
          </button>
        </div>
      </div>

      {/* Trend Cards - Refined */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-red-700 font-medium">Critical</span>
            {criticalChange.direction === 'down' && (
              <TrendingDown size={14} className="text-green-600" />
            )}
            {criticalChange.direction === 'up' && (
              <TrendingUp size={14} className="text-red-600" />
            )}
          </div>
          <div className="text-lg font-semibold text-red-700">{latestData.critical}</div>
          <div className={clsx(
            'text-xs mt-0.5',
            criticalChange.direction === 'down' ? 'text-green-600' : 'text-red-600'
          )}>
            {criticalChange.direction === 'down' ? '↓' : '↑'} {criticalChange.value}% vs last month
          </div>
        </div>

        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-orange-700 font-medium">High</span>
            {highChange.direction === 'down' && (
              <TrendingDown size={14} className="text-green-600" />
            )}
            {highChange.direction === 'up' && (
              <TrendingUp size={14} className="text-orange-600" />
            )}
          </div>
          <div className="text-lg font-semibold text-orange-700">{latestData.high}</div>
          <div className={clsx(
            'text-xs mt-0.5',
            highChange.direction === 'down' ? 'text-green-600' : 'text-orange-600'
          )}>
            {highChange.direction === 'down' ? '↓' : '↑'} {highChange.value}% vs last month
          </div>
        </div>

        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-indigo-700 font-medium">Total</span>
            {totalChange.direction === 'down' && (
              <TrendingDown size={14} className="text-green-600" />
            )}
            {totalChange.direction === 'up' && (
              <TrendingUp size={14} className="text-indigo-600" />
            )}
          </div>
          <div className="text-lg font-semibold text-indigo-700">{latestData.total}</div>
          <div className={clsx(
            'text-xs mt-0.5',
            totalChange.direction === 'down' ? 'text-green-600' : 'text-indigo-600'
          )}>
            {totalChange.direction === 'down' ? '↓' : '↑'} {totalChange.value}% vs last month
          </div>
        </div>
      </div>

      {/* Chart - STUNNING */}
      <div className="border border-[var(--border)] rounded-lg p-6 bg-white">
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

          {/* Y-axis */}
          <line x1="60" y1="40" x2="60" y2="200" stroke="#9ca3af" strokeWidth="2" />
          {/* X-axis */}
          <line x1="60" y1="200" x2="760" y2="200" stroke="#9ca3af" strokeWidth="2" />

          {/* Area fill under line */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={
                selectedMetric === 'critical' ? '#dc2626' :
                selectedMetric === 'high' ? '#f97316' : '#6366f1'
              } stopOpacity="0.2" />
              <stop offset="100%" stopColor={
                selectedMetric === 'critical' ? '#dc2626' :
                selectedMetric === 'high' ? '#f97316' : '#6366f1'
              } stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Area */}
          <path
            d={`M 60 200 ${metricData.map((value, i) => {
              const x = 60 + (i / (metricData.length - 1)) * 700;
              const y = 200 - (value / maxValue) * 160;
              return `L ${x} ${y}`;
            }).join(' ')} L 760 200 Z`}
            fill="url(#areaGradient)"
          />

          {/* Line - Thinner */}
          <path
            d={`M ${metricData.map((value, i) => {
              const x = 60 + (i / (metricData.length - 1)) * 700;
              const y = 200 - (value / maxValue) * 160;
              return `${x} ${y}`;
            }).join(' L ')}`}
            fill="none"
            stroke={
              selectedMetric === 'critical' ? '#dc2626' :
              selectedMetric === 'high' ? '#f97316' : '#6366f1'
            }
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points - Smaller, refined */}
          {metricData.map((value, i) => {
            const x = 60 + (i / (metricData.length - 1)) * 700;
            const y = 200 - (value / maxValue) * 160;
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="white"
                  stroke={
                    selectedMetric === 'critical' ? '#dc2626' :
                    selectedMetric === 'high' ? '#f97316' : '#6366f1'
                  }
                  strokeWidth="2"
                />
                <circle
                  cx={x}
                  cy={y}
                  r="2"
                  fill={
                    selectedMetric === 'critical' ? '#dc2626' :
                    selectedMetric === 'high' ? '#f97316' : '#6366f1'
                  }
                />
              </g>
            );
          })}

          {/* X-axis labels - Smaller */}
          {trendData.map((d, i) => {
            const x = 60 + (i / (trendData.length - 1)) * 700;
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

          {/* Y-axis labels - Smaller */}
          {[0, 1, 2, 3, 4, 5].map(i => {
            const value = Math.round((i / 5) * maxValue);
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
                {value}
              </text>
            );
          })}

          {/* Chart title - Smaller */}
          <text x="60" y="25" fontSize="12" fontWeight="500" fill="#6b7280">
            {selectedMetric === 'critical' ? 'Critical Risks' :
             selectedMetric === 'high' ? 'High Risks' : 'Total Risks'} Over Time
          </text>
        </svg>
      </div>
    </div>
  );
}
