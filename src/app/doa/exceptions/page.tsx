'use client';

/**
 * Screen 10 — Exception Management
 * Time-boxed exceptions with compensating controls and ERM/Compliance linkage
 */

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertOctagon, Plus, Search, Filter, CheckCircle, XCircle, Clock,
  AlertTriangle, ExternalLink, RotateCcw, Ban, FileText, Calendar,
  TrendingUp, Shield
} from 'lucide-react';
import { usePersona } from '@/contexts/PersonaContext';

type ExceptionStatus = 'Active' | 'Pending' | 'Expired' | 'Rejected';
type ExceptionType = 'Threshold override' | 'SoD mitigation' | 'Emergency approval' | 'Break-glass' | 'Strategic JV' | 'Cumulative cap';

interface Exception {
  id: string;
  requestNumber: string;
  originatingRequest: string;
  type: ExceptionType;
  justificationSummary: string;
  justificationFull: string;
  authorizedBy: string;
  authorizedByRole: string;
  authorizationDate: string;
  expires: string;
  riskLink: string;
  complianceLink?: string;
  status: ExceptionStatus;
  compensatingControls: Array<{
    control: string;
    dueDate: string;
    status: 'Open' | 'Scheduled' | 'Complete';
    assignedTo: string;
  }>;
  lifecycle: {
    proposed: string;
    inReview?: string;
    approved?: string;
    active?: string;
    expires: string;
  };
  budgetConsumption: number; // in days or percentage
}

// Mock exception data matching the wireframe
const mockExceptions: Exception[] = [
  {
    id: 'EXC-241',
    requestNumber: 'EXC-241',
    originatingRequest: 'DOA-23491',
    type: 'Threshold override',
    justificationSummary: 'Renewal exceeded matrix cap due to FX swing; pre-negotiated',
    justificationFull: 'Annual software renewal for Salesforce exceeded the procurement authority matrix threshold due to unexpected FX fluctuation (USD to EUR). Contract was pre-negotiated 6 months ago with Board approval. Renewal must proceed to avoid service disruption affecting 450+ users globally.',
    authorizedBy: 'Alice Tan',
    authorizedByRole: 'CFO',
    authorizationDate: '2026-05-14',
    expires: '2026-06-12',
    riskLink: 'RR-2026-018',
    complianceLink: undefined,
    status: 'Active',
    compensatingControls: [
      { control: 'Post-fact review by Internal Audit (due 20-May)', dueDate: '2026-05-20', status: 'Open', assignedTo: 'Internal Audit' },
      { control: 'Board exception report (next ARC meeting 18-May)', dueDate: '2026-05-18', status: 'Scheduled', assignedTo: 'Compliance' },
    ],
    lifecycle: {
      proposed: '2026-05-14 13:00',
      inReview: '2026-05-14 13:06',
      approved: '2026-05-14 15:10',
      active: '2026-05-19 12:11',
      expires: '2026-06-12',
    },
    budgetConsumption: 30, // 30 days
  },
  {
    id: 'EXC-238',
    requestNumber: 'EXC-238',
    originatingRequest: 'DOA-23488',
    type: 'SoD mitigation',
    justificationSummary: 'Cat. mgr also approver — only qualified person; control: dual signature',
    justificationFull: 'Category Manager for Enterprise Software is also the designated approver due to unique expertise. Only individual in organization with necessary technical knowledge to evaluate vendor proposals. Compensating control: CFO co-signature required for all transactions.',
    authorizedBy: 'Alice Tan',
    authorizedByRole: 'CFO + Compliance',
    authorizationDate: '2026-04-22',
    expires: '2026-05-20',
    riskLink: 'RR-2026-022',
    complianceLink: 'COMP-FIND-1124',
    status: 'Active',
    compensatingControls: [
      { control: 'Dual signature: CFO must co-sign all transactions', dueDate: 'Ongoing', status: 'Complete', assignedTo: 'CFO Office' },
      { control: 'Monthly SoD exception review by Compliance', dueDate: '2026-05-31', status: 'Scheduled', assignedTo: 'Compliance' },
    ],
    lifecycle: {
      proposed: '2026-04-22 09:15',
      inReview: '2026-04-22 09:45',
      approved: '2026-04-22 14:30',
      active: '2026-04-23 08:00',
      expires: '2026-05-20',
    },
    budgetConsumption: 28,
  },
  {
    id: 'EXC-235',
    requestNumber: 'EXC-235',
    originatingRequest: 'DOA-23485',
    type: 'Emergency approval',
    justificationSummary: 'Critical talent retention; CHRO authorised',
    justificationFull: 'Emergency retention package for VP Engineering to prevent resignation amid competitive offers. Business-critical individual leading three major product initiatives. CHRO authorized emergency approval outside normal compensation review cycle.',
    authorizedBy: 'Board',
    authorizedByRole: 'CEO',
    authorizationDate: '2026-04-18',
    expires: '2026-05-31',
    riskLink: 'RR-2026-017',
    status: 'Active',
    compensatingControls: [
      { control: 'Compensation Committee ex-post ratification', dueDate: '2026-05-25', status: 'Scheduled', assignedTo: 'Board Committee' },
      { control: 'HR policy exception log updated', dueDate: '2026-04-19', status: 'Complete', assignedTo: 'CHRO Office' },
    ],
    lifecycle: {
      proposed: '2026-04-18 16:00',
      inReview: '2026-04-18 16:30',
      approved: '2026-04-18 18:45',
      active: '2026-04-19 09:00',
      expires: '2026-05-31',
    },
    budgetConsumption: 43,
  },
  {
    id: 'EXC-231',
    requestNumber: 'EXC-231',
    originatingRequest: 'DOA-23478',
    type: 'Break-glass',
    justificationSummary: 'Sev-1 production hot-fix; CISO token',
    justificationFull: 'Emergency production deployment to resolve Severity-1 incident affecting customer-facing services. Standard approval workflow bypassed using CISO break-glass token. Full post-incident review completed.',
    authorizedBy: 'Emily Carter',
    authorizedByRole: 'CIO',
    authorizationDate: '2026-04-10',
    expires: '2026-05-08',
    riskLink: 'RR-2026-021',
    status: 'Expired',
    compensatingControls: [
      { control: 'Post-incident review completed', dueDate: '2026-04-15', status: 'Complete', assignedTo: 'IT Operations' },
      { control: 'Change Advisory Board ex-post approval', dueDate: '2026-04-12', status: 'Complete', assignedTo: 'CAB' },
    ],
    lifecycle: {
      proposed: '2026-04-10 22:15',
      inReview: '2026-04-10 22:18',
      approved: '2026-04-10 22:25',
      active: '2026-04-10 22:30',
      expires: '2026-05-08',
    },
    budgetConsumption: 28,
  },
  {
    id: 'EXC-229',
    requestNumber: 'EXC-229',
    originatingRequest: 'DOA-23470',
    type: 'Strategic JV',
    justificationSummary: 'Board pre-approval; routed for record only',
    justificationFull: 'Strategic joint venture with pre-approved Board resolution. Routing through DoA system for audit trail and record-keeping purposes only. No additional approval required.',
    authorizedBy: 'Board',
    authorizedByRole: 'Board',
    authorizationDate: '2026-03-15',
    expires: '2026-09-30',
    riskLink: 'RR-2026-009',
    status: 'Active',
    compensatingControls: [
      { control: 'Quarterly Board update on JV performance', dueDate: '2026-06-30', status: 'Scheduled', assignedTo: 'Corp Dev' },
      { control: 'Legal compliance review', dueDate: '2026-05-30', status: 'Scheduled', assignedTo: 'Legal' },
    ],
    lifecycle: {
      proposed: '2026-03-15 10:00',
      inReview: '2026-03-15 10:05',
      approved: '2026-03-15 10:10',
      active: '2026-03-16 00:00',
      expires: '2026-09-30',
    },
    budgetConsumption: 198, // days
  },
  {
    id: 'EXC-225',
    requestNumber: 'EXC-225',
    originatingRequest: 'DOA-23461',
    type: 'Cumulative cap',
    justificationSummary: 'Vendor cum. limit exceeded; consolidated renewals',
    justificationFull: 'Annual cumulative vendor spend limit exceeded due to consolidation of three separate renewal contracts into single agreement. CFO approved consolidation for better pricing terms. Total savings of 18% compared to individual renewals.',
    authorizedBy: 'Alice Tan',
    authorizedByRole: 'CFO',
    authorizationDate: '2026-03-01',
    expires: '2026-06-15',
    riskLink: 'RR-2026-012',
    status: 'Active',
    compensatingControls: [
      { control: 'Vendor performance quarterly review', dueDate: '2026-06-01', status: 'Scheduled', assignedTo: 'Procurement' },
      { control: 'Contract value tracking dashboard', dueDate: 'Ongoing', status: 'Complete', assignedTo: 'Finance' },
    ],
    lifecycle: {
      proposed: '2026-03-01 08:00',
      inReview: '2026-03-01 09:30',
      approved: '2026-03-01 16:00',
      active: '2026-03-02 00:00',
      expires: '2026-06-15',
    },
    budgetConsumption: 106,
  },
];

export default function ExceptionManagement() {
  const { hasPermission } = usePersona();
  const [activeTab, setActiveTab] = useState<'Active' | 'Pending' | 'Expired' | 'Rejected' | 'All'>('Active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExceptionId, setSelectedExceptionId] = useState<string | null>('EXC-241');
  // Filter exceptions
  const filteredExceptions = mockExceptions.filter(exc => {
    const matchesTab = activeTab === 'All' || exc.status === activeTab;
    const matchesSearch = exc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exc.originatingRequest.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exc.justificationSummary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const selectedException = mockExceptions.find(e => e.id === selectedExceptionId);

  // Exception budget calculation (FR-EXC-05)
  // Function's exception consumption - assuming 90 days total budget per fiscal year
  const EXCEPTION_BUDGET_DAYS = 90;
  const totalConsumed = mockExceptions
    .filter(e => e.status === 'Active')
    .reduce((sum, e) => sum + e.budgetConsumption, 0);
  const budgetPercentage = Math.min((totalConsumed / EXCEPTION_BUDGET_DAYS) * 100, 100);
  const isWarning = budgetPercentage >= 75;
  const isCritical = budgetPercentage >= 100;

  // Tab counts
  const tabCounts = {
    Active: mockExceptions.filter(e => e.status === 'Active').length,
    Pending: mockExceptions.filter(e => e.status === 'Pending').length,
    Expired: mockExceptions.filter(e => e.status === 'Expired').length,
    Rejected: mockExceptions.filter(e => e.status === 'Rejected').length,
    All: mockExceptions.length,
  };

  const getStatusColor = (status: ExceptionStatus) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Active': return 'bg-green-100 text-green-800 border-green-300';
      case 'Expired': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  const getLifecycleStepStatus = (exception: Exception, step: keyof Exception['lifecycle']): 'complete' | 'active' | 'pending' => {
    const lifecycle = exception.lifecycle;
    if (lifecycle[step]) return 'complete';
    if (step === 'proposed') return 'complete'; // Always complete
    if (step === 'inReview' && !lifecycle.inReview && lifecycle.proposed) return 'pending';
    if (step === 'approved' && !lifecycle.approved && lifecycle.inReview) return 'pending';
    if (step === 'active' && !lifecycle.active && lifecycle.approved) return 'active';
    if (step === 'expires') return 'pending';
    return 'pending';
  };
  
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exceptions & Overrides</h1>
          <p className="text-sm text-gray-600 mt-1">
            Exception budget & procurement function (FY2026) · {filteredExceptions.length} of {mockExceptions.length} shown
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
            <FileText className="w-4 h-4" />
            Export
          </button>
          {hasPermission('requestException') && (
            <Link
              href="/doa/exceptions/new"
              className="flex items-center gap-2 px-3 py-1.5 bg-[#F59E0B] hover:bg-amber-600 text-white rounded text-sm transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Request Exception
            </Link>
          )}
        </div>
      </div>
      
      {/* Exception Budget Bar (FR-EXC-05) */}
      <div className={`rounded border-2 p-4 ${
        isCritical ? 'bg-red-50 border-red-500' :
        isWarning ? 'bg-amber-50 border-amber-500' :
        'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Shield className={`w-5 h-5 ${
              isCritical ? 'text-red-600' :
              isWarning ? 'text-amber-600' :
              'text-green-600'
            }`} />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Exception Budget — Procurement Function (FY2026)
              </h3>
              <p className="text-xs text-gray-600">
                {totalConsumed} of {EXCEPTION_BUDGET_DAYS} exception days used; {tabCounts.Active} active exception{tabCounts.Active !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${
              isCritical ? 'text-red-600' :
              isWarning ? 'text-amber-600' :
              'text-green-600'
            }`}>
              {budgetPercentage.toFixed(0)}%
            </div>
            <div className="text-xs text-gray-600">consumed</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 transition-all duration-500 ${
              isCritical ? 'bg-red-600' :
              isWarning ? 'bg-amber-500' :
              'bg-green-500'
            }`}
            style={{ width: `${budgetPercentage}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white mix-blend-difference">
            {totalConsumed} / {EXCEPTION_BUDGET_DAYS} days
          </div>
          {/* 75% Warning Marker */}
          <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-amber-800 opacity-50" />
        </div>

        {/* Warning Messages */}
        {isCritical && (
          <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-red-800">
              <strong>Board notification required (FR-EXC-05):</strong> Exception budget at 100%. All further exceptions require Board pre-approval.
            </div>
          </div>
        )}
        {isWarning && !isCritical && (
          <div className="mt-3 p-2 bg-amber-100 border border-amber-300 rounded flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-800">
              <strong>Warning:</strong> Exception budget approaching breach state. CFO review required for new exceptions.
            </div>
          </div>
        )}
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded border border-gray-200">
        <div className="flex items-center border-b border-gray-200">
          {(['Active', 'Pending', 'Expired', 'Rejected', 'All'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-amber-600 text-amber-600 bg-amber-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab} ({tabCounts[tab]})
            </button>
          ))}
        </div>

        {/* Exception Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium">ID</th>
                <th className="px-3 py-2 text-left text-xs font-medium">Request</th>
                <th className="px-3 py-2 text-left text-xs font-medium">Type</th>
                <th className="px-3 py-2 text-left text-xs font-medium">Justification (summary)</th>
                <th className="px-3 py-2 text-left text-xs font-medium">Authorized by</th>
                <th className="px-3 py-2 text-left text-xs font-medium">Expires</th>
                <th className="px-3 py-2 text-left text-xs font-medium">Risk link</th>
              </tr>
            </thead>
            <tbody>
              {filteredExceptions.map((exc) => (
                <tr
                  key={exc.id}
                  onClick={() => setSelectedExceptionId(exc.id)}
                  className={`border-b border-gray-100 cursor-pointer transition-colors ${
                    selectedExceptionId === exc.id
                      ? 'bg-amber-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-3 py-2.5">
                    <span className="text-xs font-mono font-semibold text-gray-900">{exc.id}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-xs text-gray-700">{exc.originatingRequest}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-xs text-gray-700">{exc.type}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-xs text-gray-700">{exc.justificationSummary}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="text-xs">
                      <div className="font-medium text-gray-900">{exc.authorizedBy}</div>
                      <div className="text-gray-600">({exc.authorizedByRole})</div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-700">
                        {new Date(exc.expires).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <a
                      href={`#${exc.riskLink}`}
                      className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {exc.riskLink}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Exception Detail Panel */}
      {selectedException && (
        <div className="bg-white rounded border-2 border-amber-300 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 border-b border-amber-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {selectedException.id} · {selectedException.type} on {selectedException.originatingRequest}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Authorised by {selectedException.authorizedBy} ({selectedException.authorizedByRole}) · {new Date(selectedException.authorizationDate).toLocaleDateString()}  · time-boxed {Math.floor((new Date(selectedException.expires).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-white transition-colors">
                <RotateCcw className="w-3 h-3" />
                Renew
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-red-300 text-red-700 rounded hover:bg-red-50 transition-colors">
                <Ban className="w-3 h-3" />
                Revoke
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Full Justification */}
              <div className="col-span-2">
                <div className="text-xs font-medium text-gray-700 mb-2">Full Justification</div>
                <p className="text-sm text-gray-900 leading-relaxed">{selectedException.justificationFull}</p>
              </div>

              {/* Lifecycle Visualization */}
              <div>
                <div className="text-xs font-medium text-gray-700 mb-2">Lifecycle</div>
                <div className="space-y-2">
                  {[
                    { key: 'proposed' as const, label: 'Proposed', date: selectedException.lifecycle.proposed },
                    { key: 'inReview' as const, label: 'In Review', date: selectedException.lifecycle.inReview },
                    { key: 'approved' as const, label: 'Approved', date: selectedException.lifecycle.approved },
                    { key: 'active' as const, label: 'Active', date: selectedException.lifecycle.active },
                    { key: 'expires' as const, label: 'Expires', date: selectedException.lifecycle.expires },
                  ].map((step) => {
                    const status = getLifecycleStepStatus(selectedException, step.key);
                    return (
                      <div key={step.key} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          status === 'complete' ? 'bg-green-600' :
                          status === 'active' ? 'bg-amber-600 animate-pulse' :
                          'bg-gray-300'
                        }`} />
                        <div className="flex-1">
                          <div className={`text-xs font-medium ${
                            status === 'complete' ? 'text-green-900' :
                            status === 'active' ? 'text-amber-900' :
                            'text-gray-600'
                          }`}>
                            {step.label}
                          </div>
                          {step.date && (
                            <div className="text-xs text-gray-600">
                              {new Date(step.date).toLocaleString('en-GB', {
                                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Compensating Controls */}
            <div>
              <div className="text-xs font-medium text-gray-700 mb-2">
                Compensating controls ({selectedException.compensatingControls.length})
              </div>
              <div className="space-y-2">
                {selectedException.compensatingControls.map((control, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded border border-blue-200">
                    <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      control.status === 'Complete' ? 'text-green-600' :
                      control.status === 'Scheduled' ? 'text-amber-600' :
                      'text-gray-400'
                    }`} />
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{control.control}</div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                        <span>Due: {control.dueDate}</span>
                        <span>•</span>
                        <span>Assigned: {control.assignedTo}</span>
                        <span>•</span>
                        <span className={`px-2 py-0.5 rounded font-medium ${
                          control.status === 'Complete' ? 'bg-green-100 text-green-800' :
                          control.status === 'Scheduled' ? 'bg-amber-100 text-amber-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {control.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded flex items-center justify-between">
              <div className="text-xs text-gray-700">
                <strong>Linked:</strong> Risk register entry and compliance finding
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`#${selectedException.riskLink}`}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  {selectedException.riskLink} (ERM)
                  <ExternalLink className="w-3 h-3" />
                </a>
                {selectedException.complianceLink && (
                  <a
                    href={`#${selectedException.complianceLink}`}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    {selectedException.complianceLink} (Compliance)
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Budget bar surface approaching breach note */}
            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
              <strong>Note:</strong> Budget bar surfaces approaching breach state for Board-visible escalation (FR-EXC-05).
              Each exception links to a risk register entry and compliance finding. Auto-expiry runs daily; reminders fire at T-7, T-3, T-1 days (FR-EXC-03).
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
