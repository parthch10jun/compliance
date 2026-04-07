'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components';
import {
  AlertTriangle, CheckCircle2, XCircle, Clock, Target, FileText,
  User, Calendar, Search, TrendingUp, ArrowRight, Flag, Activity,
  MessageSquare, Paperclip
} from 'lucide-react';
import clsx from 'clsx';

// Mock data
const mockIssues = [
  {
    id: 'iss-001',
    code: 'ISS-2025-001',
    title: 'MFA Not Enforced for Admin Accounts',
    description: 'Testing revealed that 3 out of 25 admin accounts do not have MFA enabled',
    category: 'Control Gap',
    severity: 'Critical',
    status: 'Open',
    source: 'Control Test TST-MFA-001',
    discoveredDate: '2025-01-15',
    dueDate: '2025-02-15',
    assignedTo: 'sarah.johnson@rblbank.com',
    owner: 'Michael Chen',
    program: 'SOC 2 Type II',
    hasActionPlan: true,
    actionStepsCompleted: 2,
    actionStepsTotal: 5
  },
  {
    id: 'iss-002',
    code: 'ISS-2025-002',
    title: 'DLP Policy Not Blocking Sensitive Data',
    description: 'Data loss prevention policy failed to block transmission of test PII data',
    category: 'Control Failure',
    severity: 'High',
    status: 'In Progress',
    source: 'Control Test TST-DLP-001',
    discoveredDate: '2025-01-10',
    dueDate: '2025-02-10',
    assignedTo: 'raj.kumar@rblbank.com',
    owner: 'Sarah Johnson',
    program: 'SOC 2 Type II',
    hasActionPlan: true,
    actionStepsCompleted: 1,
    actionStepsTotal: 4
  },
  {
    id: 'iss-003',
    code: 'ISS-2025-003',
    title: 'Access Review Not Completed on Time',
    description: 'Q4 2024 access review was completed 10 days after the deadline',
    category: 'Policy Violation',
    severity: 'Medium',
    status: 'Pending Review',
    source: 'Internal Audit',
    discoveredDate: '2025-01-05',
    dueDate: '2025-02-05',
    assignedTo: 'priya.sharma@rblbank.com',
    owner: 'Rahul Verma',
    program: 'RBI IT Governance',
    hasActionPlan: true,
    actionStepsCompleted: 4,
    actionStepsTotal: 4
  }
];

const mockActionPlans = {
  'iss-001': {
    id: 'ap-001',
    issueId: 'iss-001',
    rootCause: 'Admin accounts were provisioned using legacy process that bypassed MFA enforcement policy',
    steps: [
      {
        id: 'step-1',
        order: 1,
        description: 'Identify all admin accounts without MFA',
        assignedTo: 'sarah.johnson@rblbank.com',
        dueDate: '2025-01-20',
        status: 'Complete',
        completedDate: '2025-01-18',
        evidence: ['Admin Account List.xlsx']
      },
      {
        id: 'step-2',
        order: 2,
        description: 'Contact account owners and provide MFA enrollment instructions',
        assignedTo: 'sarah.johnson@rblbank.com',
        dueDate: '2025-01-25',
        status: 'Complete',
        completedDate: '2025-01-22',
        evidence: ['Email Communication.pdf']
      },
      {
        id: 'step-3',
        order: 3,
        description: 'Verify MFA enrollment for all affected accounts',
        assignedTo: 'michael.chen@rblbank.com',
        dueDate: '2025-02-01',
        status: 'In Progress',
        completedDate: null,
        evidence: []
      },
      {
        id: 'step-4',
        order: 4,
        description: 'Update provisioning process to enforce MFA for all admin accounts',
        assignedTo: 'raj.kumar@rblbank.com',
        dueDate: '2025-02-10',
        status: 'Pending',
        completedDate: null,
        evidence: []
      },
      {
        id: 'step-5',
        order: 5,
        description: 'Retest control to verify remediation effectiveness',
        assignedTo: 'sarah.johnson@rblbank.com',
        dueDate: '2025-02-15',
        status: 'Pending',
        completedDate: null,
        evidence: []
      }
    ]
  },
  'iss-002': {
    id: 'ap-002',
    issueId: 'iss-002',
    rootCause: 'DLP policy rules were not configured to detect new PII patterns introduced in recent regulation update',
    steps: [
      {
        id: 'step-1',
        order: 1,
        description: 'Review latest PII definitions from regulatory guidance',
        assignedTo: 'raj.kumar@rblbank.com',
        dueDate: '2025-01-15',
        status: 'Complete',
        completedDate: '2025-01-14',
        evidence: ['Regulatory Guidance.pdf']
      },
      {
        id: 'step-2',
        order: 2,
        description: 'Update DLP policy with new PII detection patterns',
        assignedTo: 'raj.kumar@rblbank.com',
        dueDate: '2025-01-25',
        status: 'In Progress',
        completedDate: null,
        evidence: []
      },
      {
        id: 'step-3',
        order: 3,
        description: 'Test updated DLP policy in lab environment',
        assignedTo: 'raj.kumar@rblbank.com',
        dueDate: '2025-02-01',
        status: 'Pending',
        completedDate: null,
        evidence: []
      },
      {
        id: 'step-4',
        order: 4,
        description: 'Deploy to production and retest control',
        assignedTo: 'sarah.johnson@rblbank.com',
        dueDate: '2025-02-10',
        status: 'Pending',
        completedDate: null,
        evidence: []
      }
    ]
  }
};

type LeftPaneTab = 'all' | 'critical' | 'open' | 'in-progress' | 'overdue';
type MiddlePaneContent = { type: 'issue'; data: any } | null;
type RightPaneContent = { type: 'actionPlan'; data: any } | null;

export default function IssueManagementPage() {
  const [leftPaneTab, setLeftPaneTab] = useState<LeftPaneTab>('all');
  const [selectedIssue, setSelectedIssue] = useState<any>(mockIssues[0]);
  const [showActionPlan, setShowActionPlan] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-select first issue
  useEffect(() => {
    if (!selectedIssue && mockIssues.length > 0) {
      setSelectedIssue(mockIssues[0]);
    }
  }, [selectedIssue]);

  // Filter issues based on tab
  const filteredIssues = mockIssues.filter(issue => {
    if (leftPaneTab === 'critical') return issue.severity === 'Critical';
    if (leftPaneTab === 'open') return issue.status === 'Open';
    if (leftPaneTab === 'in-progress') return issue.status === 'In Progress';
    if (leftPaneTab === 'overdue') {
      const dueDate = new Date(issue.dueDate);
      return dueDate < new Date() && issue.status !== 'Resolved' && issue.status !== 'Closed';
    }
    return true;
  }).filter(issue => {
    if (searchQuery) {
      return issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             issue.code.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Get action plan for selected issue
  const actionPlan = selectedIssue ? mockActionPlans[selectedIssue.id as keyof typeof mockActionPlans] : null;

  // Stats
  const stats = {
    totalIssues: mockIssues.length,
    criticalIssues: mockIssues.filter(i => i.severity === 'Critical').length,
    openIssues: mockIssues.filter(i => i.status === 'Open').length,
    resolvedThisMonth: 12
  };

  return (
    <div className="max-w-full">
      <PageHeader
        title="Issue Management & Action Plans"
        description="Track compliance issues and manage remediation activities"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalIssues}</p>
              <p className="text-xs text-gray-500">Total Issues</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.criticalIssues}</p>
              <p className="text-xs text-gray-500">Critical</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.openIssues}</p>
              <p className="text-xs text-gray-500">Open</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.resolvedThisMonth}</p>
              <p className="text-xs text-gray-500">Resolved (MTD)</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Pane Layout */}
      <div className="flex gap-4 h-[calc(100vh-340px)] min-h-[700px]">
        {/* LEFT PANE: Issues List with Tabs */}
        <div className="flex-[0_0_28%] bg-white rounded-xl border overflow-hidden flex flex-col shadow-sm">
          {/* Tab Headers */}
          <div className="border-b bg-gray-50">
            <div className="flex flex-col">
              {(['all', 'critical', 'open', 'in-progress', 'overdue'] as LeftPaneTab[]).map((tab, idx) => {
                const count = tab === 'all' ? mockIssues.length
                  : tab === 'critical' ? mockIssues.filter(i => i.severity === 'Critical').length
                  : tab === 'open' ? mockIssues.filter(i => i.status === 'Open').length
                  : tab === 'in-progress' ? mockIssues.filter(i => i.status === 'In Progress').length
                  : mockIssues.filter(i => new Date(i.dueDate) < new Date() && i.status !== 'Resolved').length;

                return (
                  <button
                    key={tab}
                    onClick={() => setLeftPaneTab(tab)}
                    className={clsx(
                      'w-full px-4 py-2.5 text-sm font-medium transition-all text-left flex items-center justify-between',
                      idx < 4 && 'border-b',
                      leftPaneTab === tab
                        ? 'bg-red-50 text-red-700 border-l-4 border-l-red-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    <span className="capitalize">{tab.replace('-', ' ')}</span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-200 text-xs font-semibold">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search */}
          <div className="p-3 border-b bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Issues List */}
          <div className="flex-1 overflow-y-auto">
            {filteredIssues.map((issue) => (
              <button
                key={issue.id}
                onClick={() => {
                  setSelectedIssue(issue);
                  setShowActionPlan(false);
                }}
                className={clsx(
                  'w-full text-left p-4 border-b transition-all',
                  selectedIssue?.id === issue.id
                    ? 'bg-red-50 border-l-4 border-l-red-500'
                    : 'hover:bg-gray-50'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-mono text-red-600">{issue.code}</span>
                  <span className={clsx(
                    'px-2 py-0.5 rounded-full text-xs font-medium',
                    issue.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                    issue.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                    issue.severity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-700'
                  )}>
                    {issue.severity}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{issue.title}</h4>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700">
                    {issue.category}
                  </span>
                  <span className={clsx(
                    'px-2 py-0.5 rounded text-xs font-medium',
                    issue.status === 'Open' ? 'bg-red-100 text-red-700' :
                    issue.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    issue.status === 'Pending Review' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  )}>
                    {issue.status}
                  </span>
                </div>
                {issue.hasActionPlan && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
                    <Target size={12} />
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${(issue.actionStepsCompleted / issue.actionStepsTotal) * 100}%` }}
                      />
                    </div>
                    <span>{issue.actionStepsCompleted}/{issue.actionStepsTotal}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* MIDDLE PANE: Issue Detail */}
        <div className="flex-[0_0_36%] bg-white rounded-xl border overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b bg-red-50">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-1">
              <AlertTriangle size={16} className="text-red-600" />
              {selectedIssue?.code || 'Select an Issue'}
            </h3>
            {selectedIssue && (
              <p className="text-xs text-gray-600">{selectedIssue.category}</p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {!selectedIssue ? (
              <div className="p-8 text-center text-gray-500">
                <AlertTriangle size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Select an issue to view details</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-2">{selectedIssue.title}</h4>
                  <p className="text-sm text-gray-700">{selectedIssue.description}</p>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t">
                  <div>
                    <p className="text-gray-500 mb-1">Severity</p>
                    <span className={clsx(
                      'px-2 py-1 rounded font-medium',
                      selectedIssue.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                      selectedIssue.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                      'bg-amber-100 text-amber-700'
                    )}>
                      {selectedIssue.severity}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Status</p>
                    <span className={clsx(
                      'px-2 py-1 rounded font-medium',
                      selectedIssue.status === 'Open' ? 'bg-red-100 text-red-700' :
                      selectedIssue.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    )}>
                      {selectedIssue.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Program</p>
                    <p className="font-medium text-gray-900">{selectedIssue.program}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Source</p>
                    <p className="font-medium text-gray-900">{selectedIssue.source}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Discovered</p>
                    <p className="font-medium text-gray-900">{selectedIssue.discoveredDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Due Date</p>
                    <p className="font-medium text-gray-900">{selectedIssue.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Owner</p>
                    <p className="font-medium text-gray-900">{selectedIssue.owner}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Assigned To</p>
                    <p className="font-medium text-gray-900 text-xs">{selectedIssue.assignedTo.split('@')[0]}</p>
                  </div>
                </div>

                {/* Action Plan Button */}
                {selectedIssue.hasActionPlan && actionPlan && (
                  <button
                    onClick={() => setShowActionPlan(true)}
                    className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Target size={16} />
                    View Action Plan ({actionPlan.steps.length} steps)
                    <ArrowRight size={16} />
                  </button>
                )}

                {/* Discussion */}
                <div className="pt-4 border-t">
                  <h5 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                    <MessageSquare size={14} />
                    Discussion
                  </h5>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                          SC
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-900">Sarah Johnson</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">I've identified the 3 admin accounts. Working with account owners to enable MFA by end of week.</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
                          MC
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-900">Michael Chen</p>
                          <p className="text-xs text-gray-500">Yesterday</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">Priority should be on the production admin accounts first. Dev accounts can wait.</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <textarea
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Add a comment..."
                    />
                    <button className="mt-2 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700">
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Action Plan */}
        {showActionPlan && actionPlan && (
          <div className="flex-[0_0_36%] bg-white rounded-xl border overflow-hidden flex flex-col shadow-sm">
            <div className="p-4 border-b bg-blue-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Target size={16} className="text-blue-600" />
                  Remediation Action Plan
                </h3>
                <button
                  onClick={() => setShowActionPlan(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-gray-600">
                {actionPlan.steps.filter(s => s.status === 'Complete').length} of {actionPlan.steps.length} steps completed
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Root Cause */}
              <div className="mb-6 pb-4 border-b">
                <h5 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Root Cause Analysis</h5>
                <p className="text-sm text-gray-700">{actionPlan.rootCause}</p>
              </div>

              {/* Action Steps */}
              <div className="space-y-4">
                <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Remediation Steps</h5>

                {actionPlan.steps.map((step) => (
                  <div
                    key={step.id}
                    className={clsx(
                      'border rounded-lg p-3',
                      step.status === 'Complete' ? 'bg-green-50 border-green-200' :
                      step.status === 'In Progress' ? 'bg-blue-50 border-blue-200' :
                      'bg-gray-50 border-gray-200'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={clsx(
                        'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                        step.status === 'Complete' ? 'bg-green-600 text-white' :
                        step.status === 'In Progress' ? 'bg-blue-600 text-white' :
                        'bg-gray-300 text-gray-700'
                      )}>
                        {step.status === 'Complete' ? '✓' : step.order}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">{step.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {step.assignedTo.split('@')[0]}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {step.dueDate}
                          </span>
                        </div>
                        {step.evidence.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-blue-600">
                            <Paperclip size={12} />
                            {step.evidence.length} file{step.evidence.length > 1 ? 's' : ''}
                          </div>
                        )}
                        {step.status === 'Complete' && step.completedDate && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle2 size={12} />
                            Completed on {step.completedDate}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-4 border-t space-y-2">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Update Progress
                </button>
                <button className="w-full px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Request Extension
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
