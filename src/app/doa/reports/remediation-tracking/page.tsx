'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function RemediationTracking() {
  const remediationItems = [
    {
      id: 'REM-001',
      type: 'SoD Conflict',
      issue: 'CONF-001 - Purchase requisition and approval conflict',
      severity: 'Critical',
      identifiedDate: '2026-05-01',
      targetDate: '2026-05-31',
      assignedTo: 'IT Security Team',
      status: 'In Progress',
      progress: 60,
      daysRemaining: 18,
    },
    {
      id: 'REM-002',
      type: 'Policy Gap',
      issue: 'Marketing collateral approval process undefined',
      severity: 'Medium',
      identifiedDate: '2026-04-15',
      targetDate: '2026-06-15',
      assignedTo: 'Policy Team',
      status: 'Planned',
      progress: 20,
      daysRemaining: 33,
    },
    {
      id: 'REM-003',
      type: 'SoD Conflict',
      issue: 'CONF-005 - Vendor setup and payment conflict',
      severity: 'Critical',
      identifiedDate: '2026-04-28',
      targetDate: '2026-05-28',
      assignedTo: 'Finance Team',
      status: 'In Progress',
      progress: 85,
      daysRemaining: 15,
    },
    {
      id: 'REM-004',
      type: 'Delegation Gap',
      issue: 'Marketing Director (APAC) lacks backup coverage',
      severity: 'High',
      identifiedDate: '2026-05-10',
      targetDate: '2026-05-24',
      assignedTo: 'HR',
      status: 'Not Started',
      progress: 0,
      daysRemaining: 11,
    },
  ];
  
  const stats = {
    total: 12,
    completed: 5,
    inProgress: 4,
    planned: 2,
    notStarted: 1,
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doa/reports" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-h1 font-semibold text-gray-900">Remediation Tracking Report</h1>
            <p className="text-p2 text-gray-600 mt-1">Status of all active remediation activities</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>
      
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-p3 text-gray-600 mb-2">Total Items</div>
          <div className="text-h2 font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-green-200 bg-green-50">
          <div className="text-p3 text-green-600 mb-2">Completed</div>
          <div className="text-h2 font-bold text-green-600">{stats.completed}</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-blue-200 bg-blue-50">
          <div className="text-p3 text-blue-600 mb-2">In Progress</div>
          <div className="text-h2 font-bold text-blue-600">{stats.inProgress}</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-purple-200 bg-purple-50">
          <div className="text-p3 text-purple-600 mb-2">Planned</div>
          <div className="text-h2 font-bold text-purple-600">{stats.planned}</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-p3 text-gray-600 mb-2">Not Started</div>
          <div className="text-h2 font-bold text-gray-900">{stats.notStarted}</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-h3 font-semibold text-gray-900">Active Remediation Items</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {remediationItems.map((item) => (
            <div key={item.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-gray-900">{item.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                      item.severity === 'High' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {item.severity}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      item.status === 'Planned' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{item.issue}</p>
                  <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Type:</span> {item.type}
                    </div>
                    <div>
                      <span className="font-medium">Assigned:</span> {item.assignedTo}
                    </div>
                    <div>
                      <span className="font-medium">Target:</span> {new Date(item.targetDate).toLocaleDateString()}
                    </div>
                    <div className={item.daysRemaining < 14 ? 'text-red-600 font-medium' : ''}>
                      <Clock className="w-3 h-3 inline mr-1" />
                      {item.daysRemaining} days remaining
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress: {item.progress}%</span>
                  {item.progress === 100 && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      item.progress === 100 ? 'bg-green-600' :
                      item.progress >= 50 ? 'bg-blue-600' :
                      'bg-amber-600'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Remediation Performance</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm text-green-600 mb-1">On-Time Completion Rate</div>
            <div className="text-h2 font-bold text-green-600">87.5%</div>
            <p className="text-sm text-green-700 mt-1">7 of 8 completed on or before target date</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-600 mb-1">Average Time to Remediate</div>
            <div className="text-h2 font-bold text-blue-600">23 days</div>
            <p className="text-sm text-blue-700 mt-1">From identification to resolution</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">At-Risk Items</h2>
        <div className="space-y-2">
          <div className="p-3 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-medium text-red-900">REM-004: Marketing Director backup coverage</div>
              <p className="text-sm text-red-700">Not started with only 11 days until target date. Immediate action required.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
