'use client';

/**
 * Exception Rate Analysis Report
 * Analysis of authority exceptions and override patterns
 */

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

export default function ExceptionRateAnalysisReport() {
  const exceptionData = [
    { month: 'Jan 2026', total: 847, exceptions: 23, rate: 2.7 },
    { month: 'Feb 2026', total: 912, exceptions: 28, rate: 3.1 },
    { month: 'Mar 2026', total: 956, exceptions: 31, rate: 3.2 },
    { month: 'Apr 2026', total: 1023, exceptions: 35, rate: 3.4 },
    { month: 'May 2026', total: 1087, exceptions: 38, rate: 3.5 },
  ];
  
  const byCategory = [
    { category: 'Financial Limit Override', count: 58, percentage: 37.4, trend: +5 },
    { category: 'SoD Exception', count: 42, percentage: 27.1, trend: -3 },
    { category: 'Emergency Approval', count: 28, percentage: 18.1, trend: +8 },
    { category: 'Policy Deviation', count: 22, percentage: 14.2, trend: -2 },
    { category: 'Other', count: 5, percentage: 3.2, trend: 0 },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doa/reports" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-h1 font-semibold text-gray-900">Exception Rate Analysis</h1>
            <p className="text-p2 text-gray-600 mt-1">
              Authority exception and override pattern analysis - YTD 2026
            </p>
          </div>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-p3">Total Exceptions (YTD)</span>
          </div>
          <div className="text-h2 font-bold text-gray-900">155</div>
          <div className="flex items-center gap-1 text-sm text-red-600 mt-2">
            <TrendingUp className="w-4 h-4" />
            <span>+12% vs same period last year</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-p3 text-gray-600 mb-2">Current Exception Rate</div>
          <div className="text-h2 font-bold text-gray-900">3.5%</div>
          <div className="flex items-center gap-1 text-sm text-red-600 mt-2">
            <TrendingUp className="w-4 h-4" />
            <span>+0.8% from last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-p3 text-gray-600 mb-2">Avg Processing Time</div>
          <div className="text-h2 font-bold text-gray-900">8.3h</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-2">
            <TrendingDown className="w-4 h-4" />
            <span>-1.2h from last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-p3 text-gray-600 mb-2">Approval Rate</div>
          <div className="text-h2 font-bold text-gray-900">78.1%</div>
          <p className="text-sm text-gray-500 mt-2">Exceptions approved</p>
        </div>
      </div>
      
      {/* Trend Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-6">Exception Rate Trend (5 Months)</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Month</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Total Approvals</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Exceptions</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Exception Rate</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {exceptionData.map((row, idx) => (
                <tr key={row.month} className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{row.month}</td>
                  <td className="py-4 px-4 text-right text-gray-700">{row.total.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right text-gray-700">{row.exceptions}</td>
                  <td className="py-4 px-4 text-right">
                    <span className={`font-medium ${row.rate >= 3.5 ? 'text-red-600' : row.rate >= 3.0 ? 'text-amber-600' : 'text-green-600'}`}>
                      {row.rate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${row.rate >= 3.5 ? 'bg-red-600' : row.rate >= 3.0 ? 'bg-amber-600' : 'bg-green-600'}`}
                        style={{ width: `${(row.rate / 5) * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <div className="font-medium text-amber-900">Increasing Trend Detected</div>
              <p className="text-sm text-amber-700 mt-1">
                Exception rate has increased from 2.7% to 3.5% over the past 5 months, indicating potential issues with authority matrix alignment.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Exceptions by Category */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-6">Exceptions by Category</h2>
        
        <div className="space-y-4">
          {byCategory.map((cat) => (
            <div key={cat.category}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">{cat.category}</span>
                  <span className={`flex items-center gap-1 text-xs ${cat.trend > 0 ? 'text-red-600' : cat.trend < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                    {cat.trend !== 0 && (
                      <TrendingUp className={`w-3 h-3 ${cat.trend < 0 ? 'rotate-180' : ''}`} />
                    )}
                    {cat.trend !== 0 ? `${Math.abs(cat.trend)}%` : 'No change'}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">{cat.count} ({cat.percentage}%)</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#F59E0B]" 
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Root Cause Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Root Cause Analysis</h2>
        
        <div className="space-y-3">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="font-medium text-red-900 mb-2">High-Impact Issue: Financial Limit Overrides</div>
            <p className="text-sm text-red-700">
              37.4% of exceptions are financial limit overrides, with an 8% increase this month. Primary cause: Authority limits have not been adjusted for inflation and business growth.
            </p>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="font-medium text-amber-900 mb-2">Medium-Impact Issue: Emergency Approvals</div>
            <p className="text-sm text-amber-700">
              18.1% of exceptions are emergency approvals, up 8% this month. Indicates potential gaps in standard approval workflows for time-sensitive requests.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="font-medium text-green-900 mb-2">Positive Trend: SoD Exceptions Declining</div>
            <p className="text-sm text-green-700">
              SoD exceptions decreased by 3%, indicating improved role separation and conflict remediation efforts are working.
            </p>
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Recommendations</h2>
        <ol className="space-y-2 list-decimal list-inside text-gray-700">
          <li>Review and update financial authority limits to reflect current business volumes and inflation</li>
          <li>Create expedited approval workflow for time-sensitive requests to reduce emergency exceptions</li>
          <li>Target exception rate reduction to &lt;3% by end of Q3 2026</li>
          <li>Implement monthly exception review meetings with department heads</li>
          <li>Add exception pattern analysis to quarterly DoA governance reviews</li>
        </ol>
      </div>
    </div>
  );
}
