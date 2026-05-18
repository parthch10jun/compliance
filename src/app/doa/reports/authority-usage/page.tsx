'use client';

/**
 * Authority Usage Report
 * Track how authority limits are being utilized across the organization
 */

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function AuthorityUsageReport() {
  const usageData = [
    { role: 'Chief Executive Officer', limit: '$5,000,000', used: '$3,750,000', utilization: 75, count: 12 },
    { role: 'Chief Financial Officer', limit: '$2,000,000', used: '$1,680,000', utilization: 84, count: 28 },
    { role: 'VP Operations', limit: '$500,000', used: '$285,000', utilization: 57, count: 45 },
    { role: 'VP Sales', limit: '$500,000', used: '$420,000', utilization: 84, count: 52 },
    { role: 'Regional Manager', limit: '$100,000', used: '$78,500', utilization: 78.5, count: 89 },
    { role: 'Department Manager', limit: '$25,000', used: '$18,900', utilization: 75.6, count: 156 },
  ];
  
  const getUtilizationColor = (util: number) => {
    if (util >= 90) return 'text-red-600';
    if (util >= 70) return 'text-amber-600';
    return 'text-green-600';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doa/reports" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-h1 font-semibold text-gray-900">Authority Usage Report</h1>
            <p className="text-p2 text-gray-600 mt-1">
              Analysis of authority limit utilization - Current fiscal year
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
            <DollarSign className="w-5 h-5" />
            <span className="text-p3">Total Authority Limit</span>
          </div>
          <div className="text-h2 font-bold text-gray-900">$8.13M</div>
          <p className="text-sm text-gray-500 mt-2">Across all roles</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-p3">Total Utilized</span>
          </div>
          <div className="text-h2 font-bold text-gray-900">$6.23M</div>
          <p className="text-sm text-gray-500 mt-2">76.6% of total limit</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-p3">Active Approvers</span>
          </div>
          <div className="text-h2 font-bold text-gray-900">382</div>
          <p className="text-sm text-gray-500 mt-2">With delegated authority</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-p3 text-gray-600 mb-2">Avg Utilization</div>
          <div className="text-h2 font-bold text-gray-900">75.8%</div>
          <p className="text-sm text-gray-500 mt-2">Optimal range: 60-80%</p>
        </div>
      </div>
      
      {/* Usage by Role */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-6">Authority Utilization by Role</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Role</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Authority Limit</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Amount Used</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Utilization</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Approvals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usageData.map((row) => (
                <tr key={row.role} className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{row.role}</td>
                  <td className="py-4 px-4 text-right text-gray-700">{row.limit}</td>
                  <td className="py-4 px-4 text-right text-gray-700">{row.used}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${row.utilization >= 90 ? 'bg-red-600' : row.utilization >= 70 ? 'bg-amber-600' : 'bg-green-600'}`}
                          style={{ width: `${row.utilization}%` }}
                        />
                      </div>
                      <span className={`font-medium ${getUtilizationColor(row.utilization)}`}>
                        {row.utilization.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-gray-700">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Analysis */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-h4 font-semibold text-gray-900 mb-4">High Utilization Roles</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">CFO</span>
              <span className="text-sm font-bold text-red-600">84%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">VP Sales</span>
              <span className="text-sm font-bold text-amber-600">84%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Regional Manager</span>
              <span className="text-sm font-bold text-amber-600">78.5%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Consider increasing limits or delegating authority to reduce bottlenecks.
          </p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-h4 font-semibold text-gray-900 mb-4">Low Utilization Roles</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">VP Operations</span>
              <span className="text-sm font-bold text-green-600">57%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Well-balanced authority usage. No immediate action required.
          </p>
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Recommendations</h2>
        <ul className="space-y-2 list-disc list-inside text-gray-700">
          <li>Review and potentially increase authority limits for CFO and VP Sales (both at 84% utilization)</li>
          <li>Monitor CEO authority usage - approaching concerning threshold (75%)</li>
          <li>Regional Manager limits are well-utilized - maintain current levels</li>
          <li>Consider delegating more routine approvals from executive level to senior management</li>
        </ul>
      </div>
    </div>
  );
}
