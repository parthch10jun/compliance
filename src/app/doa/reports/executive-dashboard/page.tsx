'use client';

/**
 * Screen 11 — Executive Dashboard
 * Continuously updated view of DoA health with interactive charts and drill-down
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, TrendingDown, Download, Calendar, Send,
  ArrowUpRight, ArrowDownRight, Clock, Shield, AlertTriangle,
  BarChart3, Users, FileText, ExternalLink
} from 'lucide-react';

// Generate mock data for charts
const generateDailyVolume = () => {
  const data = [];
  const baseDate = new Date('2026-04-14');
  for (let i = 0; i < 30; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.floor(Math.random() * 150) + 200,
    });
  }
  return data;
};

const cycleTimeByFunction = [
  { function: 'Finance', p50: 36, p95: 48 },
  { function: 'Procurement', p50: 30, p95: 42 },
  { function: 'HR', p50: 27, p95: 38 },
  { function: 'IT', p50: 37, p95: 52 },
  { function: 'Legal', p50: 37, p95: 51 },
  { function: 'Risk', p50: 27, p95: 39 },
];

const topBottlenecks = [
  { name: 'Pierre G. (VP Proc.)', avgTime: 58, count: 47 },
  { name: 'CFO Office', avgTime: 31, count: 132 },
  { name: 'CHRO', avgTime: 29, count: 89 },
  { name: 'Legal Council', avgTime: 21, count: 64 },
  { name: 'CISO', avgTime: 18, count: 52 },
];

// Exception heatmap data - function × type
const exceptionHeatmap = {
  functions: ['Finance', 'Procurement', 'HR', 'IT', 'Risk'],
  types: ['Threshold', 'SoD mitig.', 'Emergency', 'Break-glass', 'Cumul.'],
  data: [
    [6, 8, 2, 1, 6],  // Finance
    [4, 3, 0, 2, 1],  // Procurement
    [5, 12, 1, 0, 0], // HR
    [8, 15, 6, 12, 3], // IT
    [8, 7, 8, 5, 9],  // Risk
  ],
};

// Okabe-Ito color-blind safe palette
const getHeatmapColor = (value: number) => {
  if (value === 0) return 'bg-gray-100 text-gray-400';
  if (value <= 3) return 'bg-green-200 text-green-900'; // Tolerance
  if (value <= 7) return 'bg-yellow-200 text-yellow-900'; // Warning
  return 'bg-red-600 text-white'; // Breach
};

export default function ExecutiveDashboard() {
  const [period, setPeriod] = useState('30d');
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);
  
  const dailyVolumeData = generateDailyVolume();
  const maxVolume = Math.max(...dailyVolumeData.map(d => d.value));
  
  // KPI data
  const kpis = [
    { 
      label: 'Total approval requests', 
      value: '8,247', 
      delta: '+12%',
      vs: 'vs prior 30d',
      trend: 'up',
      note: '▲ 3.4pp',
      target: 'target 90%',
    },
    { 
      label: 'Avg cycle time', 
      value: '11.3 hrs', 
      delta: '▼ 42%',
      vs: 'vs baseline',
      trend: 'down',
      note: '',
      target: '',
    },
    { 
      label: 'SLA compliance', 
      value: '94.1%', 
      delta: '▲ 3.4pp',
      vs: 'target 90%',
      trend: 'up',
      note: '',
      target: '',
    },
    { 
      label: 'Exceptions raised', 
      value: '23', 
      delta: '▼ 18%',
      vs: 'of total 0.28%',
      trend: 'down',
      note: '',
      target: '',
    },
    { 
      label: 'SoD violations blocked', 
      value: '47', 
      delta: '▲ 6',
      vs: '100% caught',
      trend: 'up',
      note: '',
      target: '',
    },
  ];
  
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Executive Dashboard — DoA</h1>
          <p className="text-sm text-gray-600 mt-1">
            Last 30 days · refreshed 2 min ago
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => setShowScheduler(!showScheduler)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors font-medium"
          >
            <Send className="w-4 h-4" />
            Schedule
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-5 gap-3">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white rounded border border-gray-200 p-4 cursor-pointer hover:border-amber-500 hover:shadow-sm transition-all"
            onClick={() => setSelectedChart(`kpi-${idx}`)}
          >
            <div className="text-xs text-gray-600 mb-1">{kpi.label}</div>
            <div className="flex items-baseline gap-2 mb-1">
              <div className="text-3xl font-bold text-gray-900">{kpi.value}</div>
              {kpi.delta && (
                <div className={`flex items-center gap-0.5 text-sm font-semibold ${
                  kpi.trend === 'up' ? (kpi.label.includes('SoD') ? 'text-red-600' : 'text-green-600') :
                  kpi.trend === 'down' ? (kpi.label.includes('cycle') || kpi.label.includes('Exceptions') ? 'text-green-600' : 'text-red-600') :
                  'text-gray-600'
                }`}>
                  {kpi.trend === 'up' && <ArrowUpRight className="w-4 h-4" />}
                  {kpi.trend === 'down' && <ArrowDownRight className="w-4 h-4" />}
                  {kpi.delta}
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500">{kpi.vs}</div>
            {kpi.note && <div className="text-xs text-gray-600 mt-1">{kpi.note} {kpi.target}</div>}
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Chart 1: Approvals Daily Volume */}
        <div
          className="bg-white rounded border border-gray-200 p-4 cursor-pointer hover:border-amber-500 transition-all"
          onClick={() => setSelectedChart('daily-volume')}
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Approvals — daily volume</h3>
          <div className="relative h-48 flex items-end justify-between gap-0.5">
            {dailyVolumeData.map((day, idx) => {
              const heightPercent = (day.value / maxVolume) * 100;
              return (
                <div
                  key={idx}
                  className="flex-1 bg-gray-800 rounded-t hover:bg-amber-600 transition-colors cursor-pointer relative group"
                  style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                  title={`${day.date}: ${day.value} requests`}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                    {day.date}: {day.value}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Apr 14</span>
            <span>May 13</span>
          </div>
        </div>

        {/* Chart 2: Cycle Time by Function */}
        <div
          className="bg-white rounded border border-gray-200 p-4 cursor-pointer hover:border-amber-500 transition-all"
          onClick={() => setSelectedChart('cycle-time')}
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Cycle time by function (p50 / p95)</h3>
          <div className="space-y-2.5">
            {cycleTimeByFunction.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-24 text-xs text-gray-700 text-right">{item.function}</div>
                <div className="flex-1 flex items-center gap-1">
                  {/* p50 bar */}
                  <div
                    className="h-5 bg-gray-700 rounded-l"
                    style={{ width: `${(item.p50 / 60) * 100}%` }}
                  />
                  {/* p95 bar */}
                  <div
                    className="h-5 bg-gray-400 rounded-r"
                    style={{ width: `${((item.p95 - item.p50) / 60) * 100}%` }}
                  />
                </div>
                <div className="w-12 text-xs text-gray-600 text-right">{item.p50}h</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Top Bottlenecks */}
        <div
          className="bg-white rounded border border-gray-200 p-4 cursor-pointer hover:border-amber-500 transition-all"
          onClick={() => setSelectedChart('bottlenecks')}
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Top bottlenecks (longest decision time)</h3>
          <div className="space-y-2.5">
            {topBottlenecks.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-32 text-xs text-gray-700 text-right truncate">{item.name}</div>
                <div className="flex-1">
                  <div
                    className="h-5 bg-gray-700 rounded"
                    style={{ width: `${(item.avgTime / 60) * 100}%` }}
                  />
                </div>
                <div className="w-12 text-xs text-gray-600 text-right">{item.avgTime}h</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Exception Heatmap */}
        <div
          className="bg-white rounded border border-gray-200 p-4 cursor-pointer hover:border-amber-500 transition-all"
          onClick={() => setSelectedChart('heatmap')}
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Exception heatmap — function × type</h3>
          <div>
            {/* Header row */}
            <div className="flex items-center mb-1">
              <div className="w-24" />
              {exceptionHeatmap.types.map((type, idx) => (
                <div key={idx} className="flex-1 text-xs text-gray-600 text-center font-medium px-1">
                  {type}
                </div>
              ))}
            </div>

            {/* Data rows */}
            {exceptionHeatmap.functions.map((func, funcIdx) => (
              <div key={funcIdx} className="flex items-center gap-1 mb-1">
                <div className="w-24 text-xs text-gray-700 text-right pr-2">{func}</div>
                {exceptionHeatmap.data[funcIdx].map((value, typeIdx) => (
                  <div
                    key={typeIdx}
                    className={`flex-1 h-8 rounded flex items-center justify-center text-sm font-bold ${getHeatmapColor(value)}`}
                    title={`${func} - ${exceptionHeatmap.types[typeIdx]}: ${value}`}
                  >
                    {value > 0 ? value : ''}
                  </div>
                ))}
              </div>
            ))}

            {/* Legend */}
            <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-gray-700">
              <strong>Heatmap colours:</strong> green ≤ tolerance, amber = warning, red = breach
            </div>
          </div>
        </div>
      </div>

      {/* Click-through Info Notice */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded p-3 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="text-sm font-semibold text-amber-900 mb-1">
            KPI cards — drill down to filtered request list with one click
          </div>
          <div className="text-xs text-amber-800">
            Click any chart segment to view underlying transactions. Dashboard refreshes in ≤1s end-to-end with 30d data window.
            All tiles filterable by function, entity, region, role, and time period.
          </div>
        </div>
      </div>

      {/* Scheduler Modal */}
      {showScheduler && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Schedule Recurring Delivery</h3>
              <button
                onClick={() => setShowScheduler(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Recipients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipients
                </label>
                <input
                  type="text"
                  placeholder="email@example.com, alice@company.com"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option>Daily (08:00 UTC)</option>
                  <option>Weekly (Monday 08:00 UTC)</option>
                  <option>Monthly (1st of month, 08:00 UTC)</option>
                  <option>Quarterly</option>
                </select>
              </div>

              {/* Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="format" value="pdf" defaultChecked />
                    <span className="text-sm">Signed PDF</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="format" value="xlsx" />
                    <span className="text-sm">XLSX</span>
                  </label>
                </div>
              </div>

              {/* Time Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Window
                </label>
                <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>Month-to-date</option>
                  <option>Quarter-to-date</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowScheduler(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Recurring delivery scheduled!');
                  setShowScheduler(false);
                }}
                className="px-4 py-2 text-sm bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors font-medium"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Chart Drill-down */}
      {selectedChart && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                Drill-down: {selectedChart}
              </h3>
              <p className="text-xs text-blue-800">
                Click-through activated. Showing filtered transaction list below.
              </p>
            </div>
            <button
              onClick={() => setSelectedChart(null)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear filter
            </button>
          </div>

          {/* Sample drill-down table */}
          <div className="bg-white rounded border border-blue-200 overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-blue-100 text-blue-900">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Request ID</th>
                  <th className="px-3 py-2 text-left font-medium">Type</th>
                  <th className="px-3 py-2 text-left font-medium">Amount</th>
                  <th className="px-3 py-2 text-left font-medium">Function</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                  <th className="px-3 py-2 text-left font-medium">Cycle Time</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'APR-23491', type: 'Purchase Order', amount: '$125,000', function: 'Procurement', status: 'Approved', cycleTime: '8h' },
                  { id: 'APR-23488', type: 'Contract Approval', amount: '$87,500', function: 'Legal', status: 'Approved', cycleTime: '12h' },
                  { id: 'APR-23485', type: 'Hiring Decision', amount: '$180,000', function: 'HR', status: 'Approved', cycleTime: '6h' },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-blue-100 hover:bg-blue-50">
                    <td className="px-3 py-2 font-mono">{row.id}</td>
                    <td className="px-3 py-2">{row.type}</td>
                    <td className="px-3 py-2 font-semibold">{row.amount}</td>
                    <td className="px-3 py-2">{row.function}</td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-medium">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">{row.cycleTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
