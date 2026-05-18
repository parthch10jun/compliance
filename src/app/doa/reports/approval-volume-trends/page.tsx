'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, TrendingUp, TrendingDown } from 'lucide-react';

export default function ApprovalVolumeTrends() {
  const monthlyData = [
    { month: 'Nov 2025', total: 847, approved: 798, rejected: 38, avgPerDay: 28.2 },
    { month: 'Dec 2025', total: 756, approved: 712, rejected: 32, avgPerDay: 24.4 },
    { month: 'Jan 2026', total: 912, approved: 861, rejected: 39, avgPerDay: 29.4 },
    { month: 'Feb 2026', total: 956, approved: 903, rejected: 41, avgPerDay: 34.1 },
    { month: 'Mar 2026', total: 1023, approved: 967, rejected: 44, avgPerDay: 33.0 },
    { month: 'Apr 2026', total: 1087, approved: 1025, rejected: 48, avgPerDay: 36.2 },
    { month: 'May 2026', total: 892, approved: 841, rejected: 38, avgPerDay: 68.6, partial: true },
  ];
  
  const byCategory = [
    { category: 'Purchase Orders', volume: 412, change: +12.3, trend: 'up' },
    { category: 'Contract Approvals', volume: 186, change: +8.5, trend: 'up' },
    { category: 'Budget Variances', volume: 92, change: -3.2, trend: 'down' },
    { category: 'HR Decisions', volume: 78, change: +15.7, trend: 'up' },
    { category: 'Capital Expenditures', volume: 64, change: +5.1, trend: 'up' },
    { category: 'Other', volume: 60, change: -1.8, trend: 'down' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doa/reports" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-h1 font-semibold text-gray-900">Approval Volume Trends</h1>
            <p className="text-p2 text-gray-600 mt-1">Historical approval volume analysis - Last 7 months</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-p3 text-gray-600 mb-2">MTD Volume</div>
          <div className="text-h2 font-bold text-gray-900">892</div>
          <div className="flex items-center gap-1 text-sm text-gray-600 mt-2">
            <span>(13 days into May)</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-p3 text-gray-600 mb-2">Avg Daily Volume</div>
          <div className="text-h2 font-bold text-gray-900">32.4</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-2">
            <TrendingUp className="w-4 h-4" />
            +8.2% vs last month
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-p3 text-gray-600 mb-2">6-Month Total</div>
          <div className="text-h2 font-bold text-gray-900">5,581</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-p3 text-gray-600 mb-2">Approval Rate</div>
          <div className="text-h2 font-bold text-gray-900">94.3%</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-6">Monthly Volume Trend</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Month</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Total</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Approved</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Rejected</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Avg/Day</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {monthlyData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {row.month}
                    {row.partial && <span className="text-xs text-gray-500 ml-2">(Partial)</span>}
                  </td>
                  <td className="py-4 px-4 text-right text-gray-700">{row.total.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right text-green-600">{row.approved.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right text-red-600">{row.rejected}</td>
                  <td className="py-4 px-4 text-right text-gray-700">{row.avgPerDay.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-6">Volume by Category (Last 30 Days)</h2>
        <div className="space-y-4">
          {byCategory.map((cat, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">{cat.category}</span>
                  <span className={`flex items-center gap-1 text-xs ${
                    cat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {cat.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(cat.change)}%
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">{cat.volume}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#F59E0B]" 
                  style={{ width: `${(cat.volume / 500) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Key Insights</h2>
        <ul className="space-y-2 list-disc list-inside text-gray-700">
          <li>Overall approval volume trending up (+28% vs 6 months ago)</li>
          <li>Purchase order volume increased 12.3% - driven by Q2 budget releases</li>
          <li>HR decisions up 15.7% - correlates with seasonal hiring campaign</li>
          <li>Budget variance approvals down 3.2% - improved budget accuracy</li>
          <li>Peak days: Mondays (avg 42/day) and Thursdays (avg 38/day)</li>
        </ul>
      </div>
    </div>
  );
}
