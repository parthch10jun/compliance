'use client';

/**
 * Policy Change Workflow
 * Manage policy versioning and approval workflow for matrix changes
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Plus, Clock, CheckCircle2, XCircle, AlertCircle, User } from 'lucide-react';

export default function PolicyWorkflow() {
  const workflows = [
    {
      id: 'wf-001',
      policyName: 'Financial Authority Matrix v2.2',
      changeType: 'Major Revision',
      requestedBy: 'Sarah Chen - Finance Director',
      requestedDate: '2026-05-10',
      status: 'Pending Approval',
      currentStep: 2,
      totalSteps: 4,
      approvers: [
        { name: 'CFO', status: 'Approved', date: '2026-05-11' },
        { name: 'Compliance Officer', status: 'Pending', date: null },
        { name: 'CEO', status: 'Awaiting', date: null },
        { name: 'Board Secretary', status: 'Awaiting', date: null },
      ],
      changes: [
        'Increased Director approval limit from $500K to $750K',
        'Added new category: IT Infrastructure Capex',
        'Updated SoD rules for procurement approvals',
      ],
    },
    {
      id: 'wf-002',
      policyName: 'HR Authority Matrix v1.5',
      changeType: 'Minor Update',
      requestedBy: 'Michael Brown - HR Director',
      requestedDate: '2026-05-12',
      status: 'Approved',
      currentStep: 3,
      totalSteps: 3,
      approvers: [
        { name: 'CHRO', status: 'Approved', date: '2026-05-12' },
        { name: 'Legal Counsel', status: 'Approved', date: '2026-05-13' },
        { name: 'CEO', status: 'Approved', date: '2026-05-14' },
      ],
      changes: [
        'Updated salary grade thresholds for manager approval',
        'Clarified termination approval requirements',
      ],
    },
    {
      id: 'wf-003',
      policyName: 'IT Authority Matrix v1.4',
      changeType: 'Emergency Change',
      requestedBy: 'David Kim - CTO',
      requestedDate: '2026-05-14',
      status: 'Rejected',
      currentStep: 1,
      totalSteps: 2,
      approvers: [
        { name: 'CIO', status: 'Rejected', date: '2026-05-14' },
        { name: 'CFO', status: 'Awaiting', date: null },
      ],
      changes: [
        'Attempted to bypass approval for cloud infrastructure purchases',
      ],
      rejectionReason: 'Insufficient justification for emergency status. Please submit as standard revision.',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending Approval':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'Approved':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'Rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending Approval':
        return 'bg-amber-100 text-amber-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-semibold text-gray-900">Policy Change Workflow</h1>
          <p className="text-p2 text-gray-600 mt-1">
            All authority matrix changes require policy approval
          </p>
        </div>
        <Link
          href="/doa/policy-workflow/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Request Policy Change
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-amber-600" />
            <div>
              <div className="text-h2 font-bold text-gray-900">3</div>
              <div className="text-p3 text-gray-600">Pending</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-h2 font-bold text-gray-900">12</div>
              <div className="text-p3 text-gray-600">Approved</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <div className="text-h2 font-bold text-gray-900">2</div>
              <div className="text-p3 text-gray-600">Rejected</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-h2 font-bold text-gray-900">17</div>
              <div className="text-p3 text-gray-600">Total Changes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow List */}
      <div className="space-y-4">
        {workflows.map((workflow) => (
          <div key={workflow.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                {getStatusIcon(workflow.status)}
                <div>
                  <h3 className="text-h3 font-semibold text-gray-900">{workflow.policyName}</h3>
                  <div className="flex items-center gap-3 mt-1 text-p3 text-gray-600">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(workflow.changeType)}`}>
                      {workflow.changeType}
                    </span>
                    <span>Requested by {workflow.requestedBy}</span>
                    <span>•</span>
                    <span>{workflow.requestedDate}</span>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(workflow.status)}`}>
                {workflow.status}
              </span>
            </div>

            {/* Approval Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-700">Approval Progress</div>
                <div className="text-sm text-gray-600">Step {workflow.currentStep} of {workflow.totalSteps}</div>
              </div>
              <div className="flex items-center gap-2">
                {workflow.approvers.map((approver, idx) => (
                  <div key={idx} className="flex-1">
                    <div className={`h-2 rounded-full ${
                      approver.status === 'Approved' ? 'bg-green-500' :
                      approver.status === 'Rejected' ? 'bg-red-500' :
                      approver.status === 'Pending' ? 'bg-amber-500' :
                      'bg-gray-200'
                    }`} />
                    <div className="text-xs text-gray-600 mt-1">{approver.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Changes */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-900 mb-2">Proposed Changes:</div>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {workflow.changes.map((change, idx) => (
                  <li key={idx}>{change}</li>
                ))}
              </ul>
            </div>

            {/* Rejection Reason */}
            {workflow.rejectionReason && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-sm font-medium text-red-900">Rejection Reason:</div>
                <div className="text-sm text-red-700 mt-1">{workflow.rejectionReason}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
