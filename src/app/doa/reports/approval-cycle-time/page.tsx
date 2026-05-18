'use client';

/**
 * Approval Cycle Time Analysis Report
 * Analyze approval processing times and identify bottlenecks
 */

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Clock, TrendingDown, AlertCircle } from 'lucide-react';

export default function ApprovalCycleTimeReport() {
  const cycleTimeData = [
    { level: 'Operational', avgTime: '4.2h', target: '6h', performance: 'excellent', trend: -8 },
    { level: 'Management', avgTime: '8.5h', target: '12h', performance: 'good', trend: -5 },
    { level: 'Senior Management', avgTime: '18.3h', target: '24h', performance: 'good', trend: -12 },
    { level: 'Executive', avgTime: '26.7h', target: '24h', performance: 'warning', trend: +3 },
    { level: 'Board', avgTime: '45.2h', target: '48h', performance: 'good', trend: -2 },
  ];
  
  const performanceColor = (perf: string) => {
    if (perf === 'excellent') return 'bg-green-100 text-green-800';
    if (perf === 'good') return 'bg-blue-100 text-blue-800';
    return 'bg-amber-100 text-amber-800';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doa/reports" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-h1 font-semibold text-gray-900">Approval Cycle Time Analysis</h1>
            <p className="text-p2 text-gray-600 mt-1">
              Processing time analysis by authority level - Last 90 days
            </p>
          </div>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>
      
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-p3">Overall Avg Time</span>
          </div>
          <div className="text-h2 font-bold text-gray-900">14.2h</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-2">
            <TrendingDown className="w-4 h-4" />
            <span>-16% from last quarter</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-p3 text-gray-600 mb-2">Fastest Approval</div>
          <div className="text-h2 font-bold text-gray-900">0.3h</div>
          <p className="text-sm text-gray-500 mt-2">Operational level purchase</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-p3 text-gray-600 mb-2">Slowest Approval</div>
          <div className="text-h2 font-bold text-gray-900">96.5h</div>
          <p className="text-sm text-gray-500 mt-2">Board strategic decision</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-p3 text-gray-600 mb-2">SLA Compliance</div>
          <div className="text-h2 font-bold text-gray-900">87.3%</div>
          <p className="text-sm text-gray-500 mt-2">Within target timeframes</p>
        </div>
      </div>
      
      {/* Cycle Time by Authority Level */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-6">Cycle Time by Authority Level</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Authority Level</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Avg Time</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Target SLA</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Performance</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cycleTimeData.map((row) => (
                <tr key={row.level} className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{row.level}</td>
                  <td className="py-4 px-4 text-gray-700">{row.avgTime}</td>
                  <td className="py-4 px-4 text-gray-700">{row.target}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${performanceColor(row.performance)}`}>
                      {row.performance === 'excellent' ? 'Excellent' : row.performance === 'good' ? 'Good' : 'Needs Attention'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`flex items-center gap-1 text-sm ${row.trend < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <TrendingDown className={`w-4 h-4 ${row.trend > 0 ? 'rotate-180' : ''}`} />
                      {Math.abs(row.trend)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Bottleneck Alerts */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Identified Bottlenecks</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <div className="font-medium text-amber-900">Executive Level Delays</div>
              <p className="text-sm text-amber-700 mt-1">
                Executive approvals averaging 2.7h above target. Recommend delegating routine approvals under $100K.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <div className="font-medium text-blue-900">Multi-Level Approval Chains</div>
              <p className="text-sm text-blue-700 mt-1">
                Approvals requiring 4+ levels take 3.2x longer. Consider parallel approval workflows for time-sensitive requests.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Recommendations</h2>
        <ul className="space-y-2 list-disc list-inside text-gray-700">
          <li>Implement automated escalation for requests pending &gt;80% of SLA target</li>
          <li>Review Executive-level delegation limits to reduce burden</li>
          <li>Enable parallel approvals for non-interdependent approval steps</li>
          <li>Schedule bi-weekly reviews of pending requests approaching SLA limits</li>
        </ul>
      </div>
    </div>
  );
}
