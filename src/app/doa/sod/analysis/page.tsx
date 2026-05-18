'use client';

/**
 * SoD Analysis & Risk Assessment
 * Analytics and risk scoring for SoD compliance
 */

import React from 'react';
import Link from 'next/link';
import { TrendingUp, AlertTriangle, Shield, BarChart3, PieChart, Activity } from 'lucide-react';
import { mockSoDConflicts, mockSoDRules } from '@/lib/doa/data';

export default function SoDAnalysis() {
  const allConflicts = mockSoDConflicts;
  const allRules = mockSoDRules;
  
  // Calculate metrics
  const totalConflicts = allConflicts.length;
  const openConflicts = allConflicts.filter(c => c.status === 'Open').length;
  const criticalOpen = allConflicts.filter(c => c.severity === 'Critical' && c.status === 'Open').length;
  const remediationRate = Math.round((allConflicts.filter(c => c.status === 'Remediated').length / totalConflicts) * 100);
  
  // Risk score (simplified calculation)
  const riskScore = Math.round(((criticalOpen * 10) + (openConflicts * 5)) / (allRules.length || 1));
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-semibold text-gray-900">SoD Analysis & Risk Assessment</h1>
          <p className="text-p2 text-gray-600 mt-1">
            Comprehensive analysis of segregation of duties compliance and risk trends
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/doa/sod/rules" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
            View Rules
          </Link>
          <Link href="/doa/sod/conflicts" className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium">
            View Conflicts
          </Link>
        </div>
      </div>
      
      {/* Risk Score Banner */}
      <div className={`rounded-lg p-6 border-2 ${
        riskScore > 50 ? 'bg-red-50 border-red-300' :
        riskScore > 25 ? 'bg-orange-50 border-orange-300' :
        riskScore > 10 ? 'bg-yellow-50 border-yellow-300' :
        'bg-green-50 border-green-300'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-h3 font-semibold text-gray-900">Overall SoD Risk Score</h3>
            <p className="text-sm text-gray-700 mt-1">
              Calculated based on open conflicts, severity, and remediation rate
            </p>
          </div>
          <div className="text-center">
            <div className={`text-5xl font-bold ${
              riskScore > 50 ? 'text-red-600' :
              riskScore > 25 ? 'text-orange-600' :
              riskScore > 10 ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {riskScore}
            </div>
            <div className="text-sm text-gray-600 mt-1">/ 100</div>
          </div>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <div className="text-p3 text-gray-600">Open Conflicts</div>
              <div className="text-h2 font-bold text-gray-900">{openConflicts}</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {criticalOpen} critical severity
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-p3 text-gray-600">Remediation Rate</div>
              <div className="text-h2 font-bold text-gray-900">{remediationRate}%</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {allConflicts.filter(c => c.status === 'Remediated').length} of {totalConflicts} resolved
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-p3 text-gray-600">Active Rules</div>
              <div className="text-h2 font-bold text-gray-900">{allRules.filter(r => r.isActive).length}</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            of {allRules.length} total rules
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <Activity className="w-8 h-8 text-purple-600" />
            <div>
              <div className="text-p3 text-gray-600">Avg Resolution Time</div>
              <div className="text-h2 font-bold text-gray-900">4.2d</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Days to remediate
          </div>
        </div>
      </div>
      
      {/* Analysis Sections */}
      <div className="grid grid-cols-2 gap-6">
        {/* Conflicts by Severity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-[#F59E0B]" />
            <h2 className="text-h3 font-semibold text-gray-900">Conflicts by Severity</h2>
          </div>
          <div className="space-y-4">
            {['Critical', 'High', 'Medium', 'Low'].map((severity) => {
              const count = allConflicts.filter(c => c.severity === severity).length;
              const percentage = totalConflicts > 0 ? (count / totalConflicts) * 100 : 0;
              return (
                <div key={severity}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{severity}</span>
                    <span className="text-sm text-gray-600">{count} ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        severity === 'Critical' ? 'bg-red-600' :
                        severity === 'High' ? 'bg-orange-500' :
                        severity === 'Medium' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Status Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-[#F59E0B]" />
            <h2 className="text-h3 font-semibold text-gray-900">Status Distribution</h2>
          </div>
          <div className="space-y-3">
            {[
              { status: 'Open', color: 'red' },
              { status: 'Remediated', color: 'green' },
              { status: 'Accepted with Compensating Controls', color: 'blue' },
            ].map(({ status, color }) => {
              const count = allConflicts.filter(c => c.status === status).length;
              const percentage = totalConflicts > 0 ? (count / totalConflicts) * 100 : 0;
              return (
                <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-${color}-600`} />
                    <span className="text-sm text-gray-700">{status}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{count} ({Math.round(percentage)}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Trend Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Key Insights & Recommendations</h2>
        <div className="space-y-4">
          {criticalOpen > 0 && (
            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <div className="font-medium text-red-900">Critical Conflicts Require Immediate Attention</div>
                <p className="text-sm text-red-700 mt-1">
                  {criticalOpen} critical SoD conflict(s) detected. Recommend immediate remediation to reduce compliance risk.
                </p>
              </div>
            </div>
          )}
          
          {remediationRate < 80 && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <TrendingUp className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <div className="font-medium text-amber-900">Remediation Rate Below Target</div>
                <p className="text-sm text-amber-700 mt-1">
                  Current remediation rate is {remediationRate}%. Target is 80%+. Consider increasing resources for conflict resolution.
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-blue-900">SoD Framework Coverage</div>
              <p className="text-sm text-blue-700 mt-1">
                {allRules.filter(r => r.isActive).length} active rules covering critical business processes. Continue monitoring for new risk areas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
