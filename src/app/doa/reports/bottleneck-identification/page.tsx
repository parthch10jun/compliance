'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, AlertTriangle, Clock, Users } from 'lucide-react';

export default function BottleneckIdentification() {
  const bottlenecks = [
    {
      location: 'Executive Level Approvals',
      avgDelay: '26.7h',
      targetSLA: '24h',
      variance: '+2.7h',
      impactedRequests: 18,
      severity: 'High',
      cause: 'Limited executive availability due to travel schedule',
    },
    {
      location: 'CFO Approvals (>$500K)',
      avgDelay: '31.2h',
      targetSLA: '24h',
      variance: '+7.2h',
      impactedRequests: 12,
      severity: 'Critical',
      cause: 'Single point of failure - no backup delegation',
    },
    {
      location: 'Legal Review (Contracts)',
      avgDelay: '48.5h',
      targetSLA: '48h',
      variance: '+0.5h',
      impactedRequests: 24,
      severity: 'Medium',
      cause: 'Resource constraint - only 2 legal reviewers',
    },
    {
      location: 'Board Approvals',
      avgDelay: '96h',
      targetSLA: '120h',
      variance: '-24h',
      impactedRequests: 5,
      severity: 'Low',
      cause: 'Monthly board meeting schedule (performing well)',
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
            <h1 className="text-h1 font-semibold text-gray-900">Bottleneck Identification Report</h1>
            <p className="text-p2 text-gray-600 mt-1">Analysis of approval process bottlenecks and delays</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-red-200 bg-red-50">
          <div className="text-p3 text-red-600 mb-2">Critical Bottlenecks</div>
          <div className="text-h2 font-bold text-red-600">1</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-amber-200 bg-amber-50">
          <div className="text-p3 text-amber-600 mb-2">High Severity</div>
          <div className="text-h2 font-bold text-amber-600">1</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-blue-200 bg-blue-50">
          <div className="text-p3 text-blue-600 mb-2">Medium Severity</div>
          <div className="text-h2 font-bold text-blue-600">1</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-p3 text-gray-600 mb-2">Total Impacted</div>
          <div className="text-h2 font-bold text-gray-900">59</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-h3 font-semibold text-gray-900">Identified Bottlenecks</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {bottlenecks.map((bottleneck, idx) => (
            <div key={idx} className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  bottleneck.severity === 'Critical' ? 'bg-red-100' :
                  bottleneck.severity === 'High' ? 'bg-amber-100' :
                  bottleneck.severity === 'Medium' ? 'bg-blue-100' :
                  'bg-green-100'
                }`}>
                  <AlertTriangle className={`w-5 h-5 ${
                    bottleneck.severity === 'Critical' ? 'text-red-600' :
                    bottleneck.severity === 'High' ? 'text-amber-600' :
                    bottleneck.severity === 'Medium' ? 'text-blue-600' :
                    'text-green-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-h4 font-semibold text-gray-900">{bottleneck.location}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      bottleneck.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                      bottleneck.severity === 'High' ? 'bg-amber-100 text-amber-800' :
                      bottleneck.severity === 'Medium' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {bottleneck.severity} Severity
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-4">{bottleneck.cause}</p>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                        <Clock className="w-3 h-3" />
                        Avg Delay
                      </div>
                      <div className="text-sm font-semibold text-gray-900">{bottleneck.avgDelay}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Target SLA</div>
                      <div className="text-sm font-semibold text-gray-900">{bottleneck.targetSLA}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Variance</div>
                      <div className={`text-sm font-semibold ${
                        bottleneck.variance.startsWith('+') ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {bottleneck.variance}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                        <Users className="w-3 h-3" />
                        Impacted
                      </div>
                      <div className="text-sm font-semibold text-gray-900">{bottleneck.impactedRequests} requests</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Recommended Actions</h2>
        <div className="space-y-3">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="font-medium text-red-900 mb-1">Critical: CFO Approval Bottleneck</div>
            <p className="text-sm text-red-700">Implement backup delegation for CFO approvals &gt;$500K to VP Finance. Estimated impact: Reduce delay by 50%.</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="font-medium text-amber-900 mb-1">High: Executive Availability</div>
            <p className="text-sm text-amber-700">Enable mobile approval capability for executives. Add automated escalation after &gt;20 hours.</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="font-medium text-blue-900 mb-1">Medium: Legal Resource Constraint</div>
            <p className="text-sm text-blue-700">Consider adding 1 additional legal reviewer or implementing AI-assisted contract review for standard templates.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
