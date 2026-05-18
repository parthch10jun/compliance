'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Shield, TrendingUp, CheckCircle } from 'lucide-react';

export default function SoDRuleEffectiveness() {
  const ruleEffectiveness = [
    {
      rule: 'Requestor Cannot Approve Own Purchase',
      conflicts: 3,
      falsePositives: 0,
      remediated: 2,
      effectiveness: 100,
      status: 'Highly Effective',
    },
    {
      rule: 'Vendor Setup and Payment Separation',
      conflicts: 2,
      falsePositives: 0,
      remediated: 1,
      effectiveness: 100,
      status: 'Highly Effective',
    },
    {
      rule: 'Budget Creation and Approval Separation',
      conflicts: 4,
      falsePositives: 1,
      remediated: 2,
      effectiveness: 75,
      status: 'Effective',
    },
    {
      rule: 'Asset Write-off and Audit Separation',
      conflicts: 1,
      falsePositives: 0,
      remediated: 1,
      effectiveness: 100,
      status: 'Highly Effective',
    },
    {
      rule: 'System Access Provisioning and Approval',
      conflicts: 2,
      falsePositives: 1,
      remediated: 1,
      effectiveness: 50,
      status: 'Needs Review',
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doa/reports" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-h1 font-semibold text-gray-900">SoD Rule Effectiveness Report</h1>
            <p className="text-p2 text-gray-600 mt-1">Analysis of SoD rule performance and detection accuracy</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Shield className="w-5 h-5" />
            <span className="text-p3">Active Rules</span>
          </div>
          <div className="text-h2 font-bold text-gray-900">8</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-green-200 bg-green-50">
          <div className="text-p3 text-green-600 mb-2">Highly Effective</div>
          <div className="text-h2 font-bold text-green-600">6</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-blue-200 bg-blue-50">
          <div className="text-p3 text-blue-600 mb-2">Effective</div>
          <div className="text-h2 font-bold text-blue-600">1</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-amber-200 bg-amber-50">
          <div className="text-p3 text-amber-600 mb-2">Needs Review</div>
          <div className="text-h2 font-bold text-amber-600">1</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-6">Rule Performance Analysis</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Rule Name</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Conflicts Detected</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">False Positives</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Remediated</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Effectiveness</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ruleEffectiveness.map((rule, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{rule.rule}</td>
                  <td className="py-4 px-4 text-center text-gray-700">{rule.conflicts}</td>
                  <td className="py-4 px-4 text-center text-gray-700">{rule.falsePositives}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-green-600 font-medium">{rule.remediated}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            rule.effectiveness >= 90 ? 'bg-green-600' :
                            rule.effectiveness >= 70 ? 'bg-blue-600' :
                            'bg-amber-600'
                          }`}
                          style={{ width: `${rule.effectiveness}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{rule.effectiveness}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rule.status === 'Highly Effective' ? 'bg-green-100 text-green-800' :
                      rule.status === 'Effective' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {rule.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-h4 font-semibold text-gray-900 mb-4">Overall Effectiveness</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Detection Accuracy</span>
              <span className="text-sm font-bold text-green-600">92.3%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">False Positive Rate</span>
              <span className="text-sm font-bold text-green-600">7.7%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Avg Time to Remediate</span>
              <span className="text-sm font-bold text-blue-600">18 days</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-h4 font-semibold text-gray-900 mb-4">Impact Metrics</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">12 conflicts detected total</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">7 successfully remediated (58.3%)</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">Remediation rate improving +12% MoM</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Rule Optimization Recommendations</h2>
        <div className="space-y-3">
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="font-medium text-amber-900 mb-1">Review "System Access Provisioning" Rule</div>
            <p className="text-sm text-amber-700">
              50% effectiveness with 1 false positive out of 2 detections. Consider refining rule logic to reduce false positives while maintaining detection capability.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="font-medium text-green-900 mb-1">Maintain Current Configuration</div>
            <p className="text-sm text-green-700">
              6 rules showing 100% effectiveness with zero false positives. Current configuration is optimal - no changes recommended.
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="font-medium text-blue-900 mb-1">Monitor Budget Rule Performance</div>
            <p className="text-sm text-blue-700">
              "Budget Creation and Approval" rule at 75% effectiveness. Review the 1 false positive case to determine if rule refinement is needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
