'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components';
import {
  PlayCircle, CheckCircle2, XCircle, Clock, AlertTriangle,
  Shield, FileText, Upload, User, Calendar, Filter, Search,
  ChevronRight, Activity, TrendingUp, Target
} from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

// Mock data - will be replaced with real data
const mockControls = [
  {
    id: 'ctrl-001',
    code: 'SOC2-AC-001',
    name: 'Multi-Factor Authentication',
    category: 'Access Control',
    type: 'Preventive',
    effectiveness: 'Effective',
    testsDue: 2,
    testsOverdue: 0,
    lastTestDate: '2024-12-15',
    nextTestDate: '2025-03-15'
  },
  {
    id: 'ctrl-002',
    code: 'SOC2-DLP-001',
    name: 'Data Loss Prevention',
    category: 'Data Protection',
    type: 'Detective',
    effectiveness: 'Partially Effective',
    testsDue: 1,
    testsOverdue: 1,
    lastTestDate: '2024-11-01',
    nextTestDate: '2025-02-01'
  },
  {
    id: 'ctrl-003',
    code: 'SOC2-CM-001',
    name: 'Change Management Process',
    category: 'Change Management',
    type: 'Preventive',
    effectiveness: 'Effective',
    testsDue: 0,
    testsOverdue: 0,
    lastTestDate: '2025-01-10',
    nextTestDate: '2025-04-10'
  }
];

const mockTests = [
  {
    id: 'test-001',
    controlId: 'ctrl-001',
    code: 'TST-MFA-001',
    name: 'MFA Enrollment Verification',
    type: 'Operating Effectiveness',
    status: 'Pending',
    assignedTo: 'sarah.johnson@rblbank.com',
    dueDate: '2025-03-15',
    priority: 'High'
  },
  {
    id: 'test-002',
    controlId: 'ctrl-001',
    code: 'TST-MFA-002',
    name: 'MFA Exception Review',
    type: 'Design',
    status: 'Pending',
    assignedTo: 'michael.chen@rblbank.com',
    dueDate: '2025-03-20',
    priority: 'Medium'
  },
  {
    id: 'test-003',
    controlId: 'ctrl-002',
    code: 'TST-DLP-001',
    name: 'DLP Policy Effectiveness',
    type: 'Operating Effectiveness',
    status: 'Overdue',
    assignedTo: 'sarah.johnson@rblbank.com',
    dueDate: '2025-02-01',
    priority: 'Critical'
  }
];

type LeftPaneTab = 'all' | 'pending' | 'overdue' | 'completed';
type MiddlePaneContent = { type: 'control'; data: any } | null;
type RightPaneContent = { type: 'test'; data: any } | null;

export default function ControlTestingPage() {
  const [leftPaneTab, setLeftPaneTab] = useState<LeftPaneTab>('all');
  const [selectedControl, setSelectedControl] = useState<any>(mockControls[0]);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-select first control
  useEffect(() => {
    if (!selectedControl && mockControls.length > 0) {
      setSelectedControl(mockControls[0]);
    }
  }, [selectedControl]);

  // Filter controls based on tab
  const filteredControls = mockControls.filter(control => {
    if (leftPaneTab === 'pending') return control.testsDue > 0;
    if (leftPaneTab === 'overdue') return control.testsOverdue > 0;
    if (leftPaneTab === 'completed') return control.testsDue === 0 && control.testsOverdue === 0;
    return true;
  }).filter(control => {
    if (searchQuery) {
      return control.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             control.code.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Get tests for selected control
  const controlTests = selectedControl
    ? mockTests.filter(test => test.controlId === selectedControl.id)
    : [];

  // Stats
  const stats = {
    totalTests: mockTests.length,
    pendingTests: mockTests.filter(t => t.status === 'Pending').length,
    overdueTests: mockTests.filter(t => t.status === 'Overdue').length,
    passRate: 85
  };

  return (
    <div className="max-w-full">
      <PageHeader
        title="Control Testing Workflow"
        description="Execute, track, and manage control testing activities"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTests}</p>
              <p className="text-xs text-gray-500">Total Tests</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingTests}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.overdueTests}</p>
              <p className="text-xs text-gray-500">Overdue</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.passRate}%</p>
              <p className="text-xs text-gray-500">Pass Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Pane Layout */}
      <div className="flex gap-4 h-[calc(100vh-340px)] min-h-[700px]">
        {/* LEFT PANE: Controls List with Tabs */}
        <div className="flex-[0_0_28%] bg-white rounded-xl border overflow-hidden flex flex-col shadow-sm">
          {/* Tab Headers */}
          <div className="border-b bg-gray-50">
            <div className="flex">
              {(['all', 'pending', 'overdue', 'completed'] as LeftPaneTab[]).map((tab) => {
                const count = tab === 'all' ? mockControls.length
                  : tab === 'pending' ? mockControls.filter(c => c.testsDue > 0).length
                  : tab === 'overdue' ? mockControls.filter(c => c.testsOverdue > 0).length
                  : mockControls.filter(c => c.testsDue === 0 && c.testsOverdue === 0).length;

                return (
                  <button
                    key={tab}
                    onClick={() => setLeftPaneTab(tab)}
                    className={clsx(
                      'flex-1 px-3 py-3 text-xs font-medium transition-all border-b-2',
                      leftPaneTab === tab
                        ? 'border-blue-500 text-blue-700 bg-white'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    )}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="capitalize">{tab}</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-xs">{count}</span>
                    </div>
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
                placeholder="Search controls..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Controls List */}
          <div className="flex-1 overflow-y-auto">
            {filteredControls.map((control) => (
              <button
                key={control.id}
                onClick={() => {
                  setSelectedControl(control);
                  setSelectedTest(null);
                }}
                className={clsx(
                  'w-full text-left p-4 border-b transition-all',
                  selectedControl?.id === control.id
                    ? 'bg-blue-50 border-l-4 border-l-blue-500'
                    : 'hover:bg-gray-50'
                )}
              >
                <div className="mb-2">
                  <span className="text-xs font-mono text-blue-600">{control.code}</span>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">{control.name}</h4>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                    {control.category}
                  </span>
                  <span className={clsx(
                    'px-2 py-0.5 rounded text-xs font-medium',
                    control.effectiveness === 'Effective' ? 'bg-green-100 text-green-700' :
                    'bg-amber-100 text-amber-700'
                  )}>
                    {control.effectiveness}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {control.testsOverdue > 0 && (
                    <span className="flex items-center gap-1 text-red-600 font-medium">
                      <AlertTriangle size={12} />
                      {control.testsOverdue} Overdue
                    </span>
                  )}
                  {control.testsDue > 0 && (
                    <span className="flex items-center gap-1 text-amber-600">
                      <Clock size={12} />
                      {control.testsDue} Due
                    </span>
                  )}
                  {control.testsDue === 0 && control.testsOverdue === 0 && (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 size={12} />
                      Up to date
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* MIDDLE PANE: Tests for Selected Control */}
        <div className="flex-[0_0_36%] bg-white rounded-xl border overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b bg-blue-50">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-1">
              <Shield size={16} className="text-blue-600" />
              {selectedControl?.name || 'Select a Control'}
            </h3>
            {selectedControl && (
              <p className="text-xs text-gray-600">
                {controlTests.length} test{controlTests.length !== 1 ? 's' : ''} scheduled
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {!selectedControl ? (
              <div className="p-8 text-center text-gray-500">
                <Shield size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Select a control to view tests</p>
              </div>
            ) : controlTests.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FileText size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No tests scheduled for this control</p>
              </div>
            ) : (
              controlTests.map((test) => (
                <button
                  key={test.id}
                  onClick={() => setSelectedTest(test)}
                  className={clsx(
                    'w-full text-left p-4 border-b transition-all',
                    selectedTest?.id === test.id
                      ? 'bg-green-50 border-l-4 border-l-green-500'
                      : 'hover:bg-gray-50'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-mono text-green-600">{test.code}</span>
                    <span className={clsx(
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      test.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      test.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                      test.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    )}>
                      {test.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{test.name}</h4>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">
                      {test.type}
                    </span>
                    <span className={clsx(
                      'px-2 py-0.5 rounded text-xs font-medium',
                      test.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                      test.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                      test.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    )}>
                      {test.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {test.assignedTo.split('@')[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {test.dueDate}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANE: Test Execution Detail */}
        {selectedTest && (
          <div className="flex-[0_0_36%] bg-white rounded-xl border overflow-hidden flex flex-col shadow-sm">
            <div className="p-4 border-b bg-green-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <PlayCircle size={16} className="text-green-600" />
                  Test Execution
                </h3>
                <button
                  onClick={() => setSelectedTest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs font-mono text-green-600">{selectedTest.code}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Test Info */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-900 mb-3">{selectedTest.name}</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-500 mb-1">Type</p>
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 font-medium">
                      {selectedTest.type}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Priority</p>
                    <span className={clsx(
                      'px-2 py-1 rounded font-medium',
                      selectedTest.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                      selectedTest.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                      'bg-amber-100 text-amber-700'
                    )}>
                      {selectedTest.priority}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Assigned To</p>
                    <p className="font-medium text-gray-900">{selectedTest.assignedTo}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Due Date</p>
                    <p className="font-medium text-gray-900">{selectedTest.dueDate}</p>
                  </div>
                </div>
              </div>

              {/* Test Procedure */}
              <div className="mb-6">
                <h5 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Test Procedure</h5>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 font-medium mb-1">Review MFA enrollment records</p>
                      <p className="text-xs text-gray-600">Extract user list from identity provider</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 font-medium mb-1">Sample 25 users randomly</p>
                      <p className="text-xs text-gray-600">Use statistical sampling method</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 font-medium mb-1">Verify MFA enforcement</p>
                      <p className="text-xs text-gray-600">Check authentication logs for each sampled user</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                      4
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 font-medium mb-1">Document results</p>
                      <p className="text-xs text-gray-600">Record pass/fail and upload evidence</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Test Execution Form */}
              <div className="border-t pt-4">
                <h5 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Execute Test</h5>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Test Result</label>
                    <select className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select result...</option>
                      <option value="pass">Pass</option>
                      <option value="fail">Fail</option>
                      <option value="partial">Partial Pass</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Actual Results</label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Describe what you observed during testing..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Upload Evidence</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-400">PDF, Excel, Screenshots</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Submit Test
                    </button>
                    <button className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                      Save Draft
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
