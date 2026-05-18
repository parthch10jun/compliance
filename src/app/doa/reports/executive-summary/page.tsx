'use client';

/**
 * Executive Summary Report
 * High-level overview of DoA metrics for leadership
 */

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { getDoAKPIMetrics } from '@/lib/doa/data';

export default function ExecutiveSummaryReport() {
  const kpis = getDoAKPIMetrics();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doa/reports" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-h1 font-semibold text-gray-900">Executive Summary Report</h1>
            <p className="text-p2 text-gray-600 mt-1">
              High-level DoA performance metrics - Last 30 days
            </p>
          </div>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium">
          <Download className="w-5 h-5" />
          Export PDF
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="text-p3 text-gray-600 mb-2">Total Requests Processed</div>
          <div className="text-h1 font-bold text-gray-900">1,247</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-2">
            <TrendingUp className="w-4 h-4" />
            <span>+12% vs last month</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="text-p3 text-gray-600 mb-2">Approval Rate</div>
          <div className="text-h1 font-bold text-gray-900">94.3%</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-2">
            <TrendingUp className="w-4 h-4" />
            <span>+2.1% vs last month</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="text-p3 text-gray-600 mb-2">Avg Cycle Time</div>
          <div className="text-h1 font-bold text-gray-900">{kpis.avgApprovalTimeHours}h</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-2">
            <TrendingDown className="w-4 h-4" />
            <span>-0.8h vs last month</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="text-p3 text-gray-600 mb-2">Exception Rate</div>
          <div className="text-h1 font-bold text-gray-900">{kpis.exceptionRate}%</div>
          <div className="flex items-center gap-1 text-sm text-red-600 mt-2">
            <TrendingUp className="w-4 h-4" />
            <span>+0.3% vs last month</span>
          </div>
        </div>
      </div>
      
      {/* Key Insights */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Key Insights</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <div className="font-medium text-green-900">Approval Efficiency Improved</div>
              <p className="text-sm text-green-700 mt-1">
                Average approval cycle time decreased by 16% compared to previous quarter, indicating improved workflow efficiency.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <div className="font-medium text-amber-900">SoD Conflicts Require Attention</div>
              <p className="text-sm text-amber-700 mt-1">
                {kpis.sodConflictsDetected} segregation of duties conflicts detected. {Math.round(kpis.sodConflictsDetected * 0.4)} are critical severity.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-blue-900">Delegation Coverage Strong</div>
              <p className="text-sm text-blue-700 mt-1">
                {kpis.activeDelegations} active delegations ensuring continuity. All critical roles have backup coverage.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Authority Matrix Coverage */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Authority Matrix Coverage</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Financial Transactions</span>
            <div className="flex items-center gap-2">
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-600" style={{ width: '95%' }} />
              </div>
              <span className="text-sm font-medium text-gray-900 w-12">95%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">HR Decisions</span>
            <div className="flex items-center gap-2">
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-600" style={{ width: '88%' }} />
              </div>
              <span className="text-sm font-medium text-gray-900 w-12">88%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">IT Operations</span>
            <div className="flex items-center gap-2">
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-600" style={{ width: '92%' }} />
              </div>
              <span className="text-sm font-medium text-gray-900 w-12">92%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Recommendations</h2>
        <ol className="space-y-3 list-decimal list-inside">
          <li className="text-gray-700">
            Address {Math.round(kpis.sodConflictsDetected * 0.4)} critical SoD conflicts within next 30 days
          </li>
          <li className="text-gray-700">
            Review and update authority matrices for roles with &gt;5% exception rate
          </li>
          <li className="text-gray-700">
            Implement automated escalation for approvals pending &gt;48 hours
          </li>
          <li className="text-gray-700">
            Conduct quarterly review of permanent delegations
          </li>
        </ol>
      </div>
    </div>
  );
}
