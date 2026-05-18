'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

export default function EmergencyApprovals() {
  const emergencyApprovals = [
    {
      id: 'EMRG-001',
      description: 'Emergency vendor payment - data center outage',
      amount: 250000,
      requestedBy: 'IT Director',
      status: 'Approved',
      approvedWithin: '15 minutes',
    },
    {
      id: 'EMRG-002',
      description: 'Critical security patch deployment authorization',
      requestedBy: 'CISO',
      status: 'Pending',
      timeRemaining: '45 minutes',
    },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-semibold text-gray-900">Emergency Approvals</h1>
        <p className="text-p2 text-gray-600 mt-1">
          Fast-track approvals for emergency situations
        </p>
      </div>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-900">Emergency Approval Protocol</h3>
            <p className="text-sm text-red-700 mt-1">
              Emergency approvals bypass standard workflow for time-critical decisions. All emergency approvals are subject to post-approval review.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-p3 text-gray-600">Total Emergency Approvals</div>
          <div className="text-h2 font-bold text-gray-900 mt-1">{emergencyApprovals.length}</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-p3 text-gray-600">Pending</div>
          <div className="text-h2 font-bold text-amber-600 mt-1">
            {emergencyApprovals.filter(a => a.status === 'Pending').length}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-p3 text-gray-600">Approved (Last 24h)</div>
          <div className="text-h2 font-bold text-green-600 mt-1">
            {emergencyApprovals.filter(a => a.status === 'Approved').length}
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {emergencyApprovals.map((approval) => (
          <div key={approval.id} className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-sm text-gray-500">{approval.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    approval.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {approval.status}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{approval.description}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Requested by: {approval.requestedBy}</span>
                  {approval.amount && (
                    <>
                      <span>•</span>
                      <span className="font-semibold">${approval.amount.toLocaleString()}</span>
                    </>
                  )}
                  {approval.approvedWithin && (
                    <>
                      <span>•</span>
                      <span className="text-green-600">Approved in {approval.approvedWithin}</span>
                    </>
                  )}
                  {approval.timeRemaining && (
                    <>
                      <span>•</span>
                      <span className="text-amber-600">Time remaining: {approval.timeRemaining}</span>
                    </>
                  )}
                </div>
              </div>
              {approval.status === 'Approved' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <Clock className="w-6 h-6 text-amber-600 animate-pulse" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
