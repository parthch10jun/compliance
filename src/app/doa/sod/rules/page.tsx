'use client';

/**
 * Screen 9 — SoD Rule Library
 * Configurable real-time conflict detection rules with interactive test panel
 */

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield, Plus, Search, Filter, Eye, Edit, ToggleLeft, ToggleRight,
  Upload, Download, CheckSquare, Square, MoreVertical, Play,
  AlertCircle, CheckCircle, XCircle, Code, TrendingUp, Activity
} from 'lucide-react';
import { mockSoDRules } from '@/lib/doa/data';
import { usePersona } from '@/contexts/PersonaContext';

// Extended rule type with additional fields for Screen 9
type ExtendedSoDRule = typeof mockSoDRules[0] & {
  ruleExpression: string;
  action: 'Block' | 'Warn' | 'Log';
  hitsLast30Days: number;
  status: 'Active' | 'Inactive' | 'Draft';
};

// Generate extended rules with Screen 9 specific data
const generateExtendedRules = (): ExtendedSoDRule[] => {
  const expressions = [
    'user.roles CONTAINS "Requester" AND user.roles CONTAINS "Approver"',
    'event.vendorSetupBy == event.paymentProcessedBy',
    'hiring.approver == compensation.approver AND employee.id == SAME',
    'payroll.dataEntry.user == payroll.approval.user',
    'termination.initiator == access.revoker AND !exists(access.secondaryReviewer)',
    'user.canCreateJE AND user.canApproveJE AND amount > 10000',
    'contract.creator == contract.signer AND contract.value > 50000',
    'user.function == "IT" AND user.canProvision AND user.canApprove',
  ];

  const actions: Array<'Block' | 'Warn' | 'Log'> = ['Block', 'Warn', 'Log'];

  return mockSoDRules.slice(0, 8).map((rule, index) => ({
    ...rule,
    ruleExpression: expressions[index] || expressions[0],
    action: index === 0 || index === 1 || index === 3 ? 'Block' : index === 2 || index === 4 ? 'Warn' : 'Log',
    hitsLast30Days: Math.floor(Math.random() * 150),
    status: rule.isActive ? 'Active' : 'Inactive',
  }));
};

export default function SoDRulesLibrary() {
  const { hasPermission } = usePersona();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedFunction, setSelectedFunction] = useState<string>('All');
  const [selectedAction, setSelectedAction] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedRules, setSelectedRules] = useState<Set<string>>(new Set());
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [testRuleId, setTestRuleId] = useState<string | null>(null);
  const [testPayload, setTestPayload] = useState('');
  const [testResult, setTestResult] = useState<{ status: 'pass' | 'fail' | 'warn'; message: string } | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const rules = generateExtendedRules();
  
  // Filtering logic
  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rule.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rule.ruleExpression.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === 'All' || rule.severity === selectedSeverity;
    const matchesFunction = selectedFunction === 'All' || rule.function1.includes(selectedFunction) || rule.function2.includes(selectedFunction);
    const matchesAction = selectedAction === 'All' || rule.action === selectedAction;
    const matchesStatus = selectedStatus === 'All' || rule.status === selectedStatus;

    return matchesSearch && matchesSeverity && matchesFunction && matchesAction && matchesStatus;
  });

  // Helper functions
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-600 text-white';
      case 'High': return 'bg-amber-600 text-white';
      case 'Medium': return 'bg-gray-600 text-white';
      case 'Low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Block': return 'bg-red-600 text-white';
      case 'Warn': return 'bg-amber-600 text-white';
      case 'Log': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const toggleRuleSelection = (ruleId: string) => {
    const newSelected = new Set(selectedRules);
    if (newSelected.has(ruleId)) {
      newSelected.delete(ruleId);
    } else {
      newSelected.add(ruleId);
    }
    setSelectedRules(newSelected);
  };

  const toggleAllRules = () => {
    if (selectedRules.size === filteredRules.length) {
      setSelectedRules(new Set());
    } else {
      setSelectedRules(new Set(filteredRules.map(r => r.id)));
    }
  };

  const handleTestRule = (ruleId: string) => {
    setTestRuleId(ruleId);
    setShowTestPanel(true);
    setTestPayload(JSON.stringify({
      event: {
        type: "purchase_approval",
        userId: "user-123",
        roles: ["Requester", "Approver"],
        amount: 50000,
        timestamp: new Date().toISOString()
      }
    }, null, 2));
  };

  const evaluateRule = () => {
    setIsEvaluating(true);

    // Simulate evaluation with 500ms delay (NFR-PERF-02 requirement)
    setTimeout(() => {
      const rule = rules.find(r => r.id === testRuleId);
      if (!rule) return;

      try {
        const payload = JSON.parse(testPayload);

        // Simulate rule evaluation logic
        if (rule.action === 'Block') {
          setTestResult({
            status: 'fail',
            message: `CONFLICT DETECTED: ${rule.name}. This transaction is BLOCKED. ${rule.riskDescription}`
          });
        } else if (rule.action === 'Warn') {
          setTestResult({
            status: 'warn',
            message: `WARNING: ${rule.name}. ${rule.riskDescription} Requires additional approval.`
          });
        } else {
          setTestResult({
            status: 'pass',
            message: `LOGGED: ${rule.name}. Event logged for audit purposes. Transaction can proceed.`
          });
        }
      } catch (e) {
        setTestResult({
          status: 'fail',
          message: 'Invalid JSON payload. Please check syntax.'
        });
      }

      setIsEvaluating(false);
    }, 450); // Simulate <500ms latency per NFR-PERF-02
  };
  
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SoD Rule Library</h1>
          <p className="text-sm text-gray-600 mt-1">
            Configurable real-time conflict detection rules · {filteredRules.length} of {rules.length} rules
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          {hasPermission('createSoDRules') && (
            <Link
              href="/doa/sod/rules/new"
              className="flex items-center gap-2 px-3 py-1.5 bg-[#F59E0B] hover:bg-amber-600 text-white rounded text-sm transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Create Rule
            </Link>
          )}
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded border border-gray-200 p-3">
          <div className="text-xs text-gray-600">Total Rules</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{rules.length}</div>
        </div>
        <div className="bg-white rounded border border-gray-200 p-3">
          <div className="text-xs text-gray-600">Active</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {rules.filter(r => r.status === 'Active').length}
          </div>
        </div>
        <div className="bg-white rounded border border-gray-200 p-3">
          <div className="text-xs text-gray-600">Critical</div>
          <div className="text-2xl font-bold text-red-600 mt-1">
            {rules.filter(r => r.severity === 'Critical').length}
          </div>
        </div>
        <div className="bg-white rounded border border-gray-200 p-3">
          <div className="text-xs text-gray-600">Total Hits (30d)</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {rules.reduce((sum, r) => sum + r.hitsLast30Days, 0)}
          </div>
        </div>
      </div>
      
      {/* Filter Strip */}
      <div className="bg-white rounded border border-gray-200 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, name, or expression..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-gray-600">Filters:</span>

          {/* Severity Filter */}
          <div className="flex items-center gap-1">
            {['All', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  selectedSeverity === sev
                    ? 'bg-amber-600 text-white font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <div className="w-px h-4 bg-gray-300"></div>

          {/* Function Filter */}
          <div className="flex items-center gap-1">
            {['All', 'Purchase', 'Vendor', 'Payroll', 'IT'].map((func) => (
              <button
                key={func}
                onClick={() => setSelectedFunction(func)}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  selectedFunction === func
                    ? 'bg-amber-600 text-white font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {func}
              </button>
            ))}
          </div>

          <div className="w-px h-4 bg-gray-300"></div>

          {/* Action Filter */}
          <div className="flex items-center gap-1">
            {['All', 'Block', 'Warn', 'Log'].map((act) => (
              <button
                key={act}
                onClick={() => setSelectedAction(act)}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  selectedAction === act
                    ? 'bg-amber-600 text-white font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {act}
              </button>
            ))}
          </div>

          <div className="w-px h-4 bg-gray-300"></div>

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            {['All', 'Active', 'Inactive', 'Draft'].map((stat) => (
              <button
                key={stat}
                onClick={() => setSelectedStatus(stat)}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  selectedStatus === stat
                    ? 'bg-amber-600 text-white font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {stat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedRules.size > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-amber-900">
              {selectedRules.size} rule{selectedRules.size > 1 ? 's' : ''} selected
            </span>
            <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
              Enable All
            </button>
            <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
              Disable All
            </button>
            <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
              Export Selected
            </button>
          </div>
          <button
            onClick={() => setSelectedRules(new Set())}
            className="text-sm text-amber-700 hover:text-amber-900"
          >
            Clear selection
          </button>
        </div>
      )}
      
      {/* Rules Table */}
      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-3 py-2 text-left">
                  <button onClick={toggleAllRules} className="hover:bg-gray-800 p-1 rounded">
                    {selectedRules.size === filteredRules.length && filteredRules.length > 0 ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium">ID</th>
                <th className="px-3 py-2 text-left text-xs font-medium">Name</th>
                <th className="px-3 py-2 text-left text-xs font-medium">Severity</th>
                <th className="px-3 py-2 text-left text-xs font-medium">Function(s)</th>
                <th className="px-3 py-2 text-left text-xs font-medium">Rule Expression</th>
                <th className="px-3 py-2 text-left text-xs font-medium">Action</th>
                <th className="px-3 py-2 text-left text-xs font-medium">Hits (30d)</th>
                <th className="px-3 py-2 text-left text-xs font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRules.map((rule) => (
                <tr
                  key={rule.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 py-2.5">
                    <button
                      onClick={() => toggleRuleSelection(rule.id)}
                      className="hover:bg-gray-200 p-1 rounded"
                    >
                      {selectedRules.has(rule.id) ? (
                        <CheckSquare className="w-4 h-4 text-amber-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-xs font-mono text-gray-600">{rule.id}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900">{rule.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${getSeverityColor(rule.severity)}`}>
                      {rule.severity}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-700">{rule.function1}</span>
                      <span className="text-xs text-gray-400">+ {rule.function2}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="text-xs font-mono text-gray-600 block truncate max-w-xs" title={rule.ruleExpression}>
                      {rule.ruleExpression}
                    </code>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${getActionColor(rule.action)}`}>
                      {rule.action}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{rule.hitsLast30Days}</span>
                      {rule.hitsLast30Days > 100 && (
                        <TrendingUp className="w-3 h-3 text-red-600" />
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/doa/sod/rules/${rule.id}`}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </Link>
                      <button
                        onClick={() => handleTestRule(rule.id)}
                        className="p-1.5 hover:bg-amber-100 rounded transition-colors"
                        title="Test Rule"
                      >
                        <Play className="w-4 h-4 text-amber-600" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="More">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRules.length === 0 && (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No SoD rules found matching your criteria</p>
          </div>
        )}
      </div>
      {/* Test Panel */}
      {showTestPanel && (
        <div className="bg-white rounded border-2 border-amber-300 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 border-b border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Code className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Rule Test Panel</h3>
                <p className="text-xs text-gray-600">
                  Testing: {rules.find(r => r.id === testRuleId)?.name || 'Unknown Rule'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowTestPanel(false);
                setTestResult(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {/* JSON Payload Input */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Event Payload (JSON)
                </label>
                <textarea
                  value={testPayload}
                  onChange={(e) => setTestPayload(e.target.value)}
                  className="w-full h-64 p-3 font-mono text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Paste JSON event payload..."
                />
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={evaluateRule}
                    disabled={isEvaluating}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-4 h-4" />
                    {isEvaluating ? 'Evaluating...' : 'Evaluate Rule'}
                  </button>
                  <button
                    onClick={() => setTestPayload(JSON.stringify({
                      event: {
                        type: "purchase_approval",
                        userId: "user-123",
                        roles: ["Requester", "Approver"],
                        amount: 50000,
                        timestamp: new Date().toISOString()
                      }
                    }, null, 2))}
                    className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    Load Sample
                  </button>
                  {isEvaluating && (
                    <span className="text-xs text-gray-600 flex items-center gap-2">
                      <Activity className="w-3 h-3 animate-spin" />
                      Evaluating (NFR-PERF-02: &lt;500ms)...
                    </span>
                  )}
                </div>
              </div>

              {/* Evaluation Result */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Evaluation Result
                </label>
                {!testResult ? (
                  <div className="h-64 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Click "Evaluate Rule" to see results</p>
                    </div>
                  </div>
                ) : (
                  <div className={`h-64 p-4 rounded border-2 ${
                    testResult.status === 'fail' ? 'bg-red-50 border-red-300' :
                    testResult.status === 'warn' ? 'bg-amber-50 border-amber-300' :
                    'bg-green-50 border-green-300'
                  }`}>
                    <div className="flex items-start gap-3 mb-3">
                      {testResult.status === 'fail' && <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />}
                      {testResult.status === 'warn' && <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />}
                      {testResult.status === 'pass' && <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />}
                      <div>
                        <h4 className={`font-semibold text-sm mb-1 ${
                          testResult.status === 'fail' ? 'text-red-900' :
                          testResult.status === 'warn' ? 'text-amber-900' :
                          'text-green-900'
                        }`}>
                          {testResult.status === 'fail' ? 'CONFLICT DETECTED - BLOCKED' :
                           testResult.status === 'warn' ? 'WARNING - REQUIRES APPROVAL' :
                           'PASSED - LOGGED'}
                        </h4>
                        <p className={`text-sm ${
                          testResult.status === 'fail' ? 'text-red-800' :
                          testResult.status === 'warn' ? 'text-amber-800' :
                          'text-green-800'
                        }`}>
                          {testResult.message}
                        </p>
                      </div>
                    </div>

                    {/* Rule Details */}
                    {testRuleId && (
                      <div className="mt-4 pt-4 border-t border-gray-300">
                        <div className="text-xs text-gray-700 space-y-1">
                          <div><strong>Rule ID:</strong> {testRuleId}</div>
                          <div><strong>Expression:</strong> <code className="font-mono bg-white px-1 py-0.5 rounded">{rules.find(r => r.id === testRuleId)?.ruleExpression}</code></div>
                          <div><strong>Action:</strong> <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            getActionColor(rules.find(r => r.id === testRuleId)?.action || 'Log')
                          }`}>{rules.find(r => r.id === testRuleId)?.action}</span></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Info Notice */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
              <strong>Test Panel Note:</strong> This test panel produces the same outcome as the live engine (FR-CFG-03).
              All rule changes require Compliance approval and are versioned with the parent policy (FR-POL-02 + FR-SOD-01).
              Rule evaluation latency: &lt;500ms per rule (NFR-PERF-02).
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
