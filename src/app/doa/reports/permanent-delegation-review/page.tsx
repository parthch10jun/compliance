'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, AlertTriangle } from 'lucide-react';

export default function PermanentDelegationReview() {
  const permanentDelegations = [
    {
      delegator: 'Michael Stevens',
      delegatorRole: 'VP Finance (Retired)',
      delegate: 'Jennifer Martinez',
      delegateRole: 'Acting VP Finance',
      startDate: '2025-08-15',
      duration: '9 months',
      scope: 'All financial approvals up to $2M',
      status: 'Review Required',
      recommendation: 'Convert to permanent role assignment',
    },
    {
      delegator: 'Sarah Johnson',
      delegatorRole: 'Regional Manager EMEA',
      delegate: 'David Chen',
      delegateRole: 'Acting Regional Manager EMEA',
      startDate: '2025-11-01',
      duration: '6 months',
      scope: 'Regional operational decisions',
      status: 'On Track',
      recommendation: 'Monitor - planned return May 2026',
    },
    {
      delegator: 'Robert Williams',
      delegatorRole: 'IT Security Director',
      delegate: 'Emily Zhang',
      delegateRole: 'Acting IT Security Director',
      startDate: '2024-12-15',
      duration: '17 months',
      scope: 'IT security approvals',
      status: 'Immediate Action Required',
      recommendation: 'Long-term delegation - convert to permanent promotion',
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
            <h1 className="text-h1 font-semibold text-gray-900">Permanent Delegation Review</h1>
            <p className="text-p2 text-gray-600 mt-1">Analysis of long-term delegations requiring review or conversion</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-p3 text-gray-600 mb-2">Total Permanent</div>
          <div className="text-h2 font-bold text-gray-900">8</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-red-200 bg-red-50">
          <div className="text-p3 text-red-600 mb-2">Action Required</div>
          <div className="text-h2 font-bold text-red-600">1</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-amber-200 bg-amber-50">
          <div className="text-p3 text-amber-600 mb-2">Review Needed</div>
          <div className="text-h2 font-bold text-amber-600">1</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-green-200 bg-green-50">
          <div className="text-p3 text-green-600 mb-2">On Track</div>
          <div className="text-h2 font-bold text-green-600">6</div>
        </div>
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <div className="font-medium text-amber-900">Policy Reminder</div>
            <p className="text-sm text-amber-700 mt-1">
              Permanent delegations active for &gt;6 months require quarterly review. Delegations &gt;12 months should be converted to permanent role assignments.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-h3 font-semibold text-gray-900">Long-Term Delegations Requiring Review</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {permanentDelegations.map((del, idx) => (
            <div key={idx} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-h4 font-semibold text-gray-900">
                      {del.delegator} → {del.delegate}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      del.status === 'Immediate Action Required' ? 'bg-red-100 text-red-800' :
                      del.status === 'Review Required' ? 'bg-amber-100 text-amber-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {del.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">Delegator:</span> {del.delegatorRole}
                    </div>
                    <div>
                      <span className="font-medium">Delegate:</span> {del.delegateRole}
                    </div>
                    <div>
                      <span className="font-medium">Start Date:</span> {new Date(del.startDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> {del.duration}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 mb-3">
                    <span className="font-medium">Scope:</span> {del.scope}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    del.status === 'Immediate Action Required' ? 'bg-red-50' :
                    del.status === 'Review Required' ? 'bg-amber-50' :
                    'bg-green-50'
                  }`}>
                    <div className="text-sm font-medium text-gray-900 mb-1">Recommendation:</div>
                    <p className="text-sm text-gray-700">{del.recommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Review Criteria</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="font-medium text-gray-900 mb-2">Immediate Action Required</div>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Delegation active &gt;12 months</li>
              <li>Original delegator not returning</li>
              <li>High-authority role (VP level+)</li>
            </ul>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="font-medium text-gray-900 mb-2">Review Required</div>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Delegation active 6-12 months</li>
              <li>Return date uncertain</li>
              <li>Scope covers critical functions</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Action Items</h2>
        <ol className="space-y-2 list-decimal list-inside text-gray-700">
          <li className="text-red-700 font-medium">
            <strong>Emily Zhang (IT Security):</strong> Convert 17-month acting delegation to permanent promotion by June 1, 2026
          </li>
          <li className="text-amber-700 font-medium">
            <strong>Jennifer Martinez (Finance):</strong> Review 9-month delegation - confirm retirement of Michael Stevens and initiate permanent role assignment
          </li>
          <li>Schedule quarterly reviews for all permanent delegations &gt;6 months</li>
          <li>Update delegation policy to include automatic escalation at 12-month mark</li>
        </ol>
      </div>
    </div>
  );
}
