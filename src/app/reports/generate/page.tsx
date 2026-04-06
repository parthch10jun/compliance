'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Shield,
  FileText,
  BarChart3,
  Download,
  Mail,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { programs } from '@/lib/data/mock-data';
import { controls } from '@/lib/data/controls';
import { controlTests } from '@/lib/data/control-tests';

export default function GenerateReportPage() {
  const router = useRouter();
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const [showProgramDropdown, setShowProgramDropdown] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['compliant', 'non-compliant', 'gaps', 'tests']));

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  // Get selected program
  const selectedProgram = programs.find(p => p.id === selectedProgramId);

  // Filter controls by program
  const programControls = selectedProgramId
    ? controls.filter(c => c.linkedProgramIds.includes(selectedProgramId))
    : [];

  // Categorize controls
  const compliantControls = programControls.filter(c => c.complianceStatus === 'Compliant');
  const nonCompliantControls = programControls.filter(c => 
    c.complianceStatus === 'Non-Compliant' || c.complianceStatus === 'Partially Compliant'
  );

  // Get gaps (controls with failed tests or ineffective status)
  const controlsWithGaps = programControls.filter(c => 
    c.testsFailed > 0 || c.effectiveness === 'Ineffective' || c.effectiveness === 'Partially Effective'
  );

  // Get tests for program controls
  const programTests = selectedProgramId
    ? controlTests.filter(t => programControls.some(c => c.id === t.controlId))
    : [];

  const passedTests = programTests.filter(t => t.result === 'Pass');
  const failedTests = programTests.filter(t => t.result === 'Fail');
  const pendingTests = programTests.filter(t => t.status === 'Pending' || !t.result);

  // Calculate compliance score
  const complianceScore = selectedProgram?.complianceScore || 0;
  const testPassRate = programTests.length > 0 
    ? Math.round((passedTests.length / programTests.length) * 100)
    : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <PageHeader
        title="Generate Compliance Report"
        description="Select a program to generate an instant detailed compliance report"
        action={
          <button
            onClick={() => router.push('/reports')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Reports
          </button>
        }
      />

      {/* Program Selection */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Compliance Program
        </label>
        <div className="relative">
          <button
            onClick={() => setShowProgramDropdown(!showProgramDropdown)}
            className="w-full md:w-96 flex items-center justify-between gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:border-blue-400 transition-colors bg-white"
          >
            {selectedProgram ? (
              <div className="flex items-center gap-3">
                <Building2 size={20} className="text-blue-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{selectedProgram.name}</p>
                  <p className="text-xs text-gray-500">{selectedProgram.framework}</p>
                </div>
              </div>
            ) : (
              <span className="text-gray-500">Choose a program...</span>
            )}
            <ChevronDown size={20} className="text-gray-400" />
          </button>

          {showProgramDropdown && (
            <div className="absolute z-10 w-full md:w-96 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
              {programs.map((program) => (
                <button
                  key={program.id}
                  onClick={() => {
                    setSelectedProgramId(program.id);
                    setShowProgramDropdown(false);
                  }}
                  className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-0"
                >
                  <Building2 size={18} className="text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{program.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{program.framework}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-600">Score: {program.complianceScore}%</span>
                      <span className={clsx(
                        'px-2 py-0.5 rounded text-xs font-medium',
                        program.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                        program.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                        'bg-amber-100 text-amber-700'
                      )}>
                        {program.status}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report Content - Only show if program selected */}
      {selectedProgram && (
        <>
          {/* Executive Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 size={24} className="text-indigo-600" />
              Executive Summary - {selectedProgram.name}
            </h2>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Compliance Score</span>
                  <BarChart3 size={18} className="text-indigo-600" />
                </div>
                <p className="text-3xl font-bold text-indigo-600 mb-1">{complianceScore}%</p>
                <p className="text-xs text-gray-600">Overall compliance</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Total Controls</span>
                  <Shield size={18} className="text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{programControls.length}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-emerald-600 font-medium">{compliantControls.length} Compliant</span>
                  <span className="text-red-600 font-medium">{nonCompliantControls.length} Issues</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Gaps Identified</span>
                  <AlertTriangle size={18} className="text-amber-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{controlsWithGaps.length}</p>
                <p className="text-xs text-gray-600">Controls with deficiencies</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Test Pass Rate</span>
                  <FileText size={18} className="text-emerald-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{testPassRate}%</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-emerald-600 font-medium">{passedTests.length} Passed</span>
                  <span className="text-red-600 font-medium">{failedTests.length} Failed</span>
                </div>
              </div>
            </div>

            {/* Export Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <button className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors">
                <Download size={18} />
                Download PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Mail size={18} />
                Email Report
              </button>
            </div>
          </div>

          {/* Compliant Controls Section */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection('compliant')}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} className="text-emerald-600" />
                <div className="text-left">
                  <h2 className="text-xl font-bold text-gray-900">Compliant Controls</h2>
                  <p className="text-sm text-gray-600 mt-1">{compliantControls.length} controls operating effectively</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                  {compliantControls.length}
                </span>
                {expandedSections.has('compliant') ? (
                  <ChevronDown size={20} className="text-gray-400" />
                ) : (
                  <ChevronRight size={20} className="text-gray-400" />
                )}
              </div>
            </button>

            {expandedSections.has('compliant') && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                {compliantControls.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">No compliant controls found</p>
                ) : (
                  <div className="space-y-3">
                    {compliantControls.map((control) => (
                      <div key={control.id} className="bg-white border border-emerald-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-mono">
                                {control.code}
                              </span>
                              <span className={clsx(
                                'px-2 py-1 rounded text-xs font-medium',
                                control.type === 'Preventive' ? 'bg-blue-100 text-blue-700' :
                                control.type === 'Detective' ? 'bg-purple-100 text-purple-700' :
                                'bg-amber-100 text-amber-700'
                              )}>
                                {control.type}
                              </span>
                              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                                {control.effectiveness}
                              </span>
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">{control.name}</h3>
                            <p className="text-xs text-gray-600 mb-3">{control.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Owner: {control.owner}</span>
                              <span>Tests: {control.testsPassed}/{control.testCount} passed</span>
                              <span>Score: {control.complianceScore}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Non-Compliant Controls Section */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection('non-compliant')}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <XCircle size={24} className="text-red-600" />
                <div className="text-left">
                  <h2 className="text-xl font-bold text-gray-900">Non-Compliant Controls</h2>
                  <p className="text-sm text-gray-600 mt-1">{nonCompliantControls.length} controls requiring attention</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  {nonCompliantControls.length}
                </span>
                {expandedSections.has('non-compliant') ? (
                  <ChevronDown size={20} className="text-gray-400" />
                ) : (
                  <ChevronRight size={20} className="text-gray-400" />
                )}
              </div>
            </button>

            {expandedSections.has('non-compliant') && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                {nonCompliantControls.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 size={48} className="mx-auto mb-3 text-emerald-500 opacity-30" />
                    <p className="text-sm text-emerald-600 font-medium">All controls are compliant!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {nonCompliantControls.map((control) => (
                      <div key={control.id} className="bg-white border border-red-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-mono">
                                {control.code}
                              </span>
                              <span className={clsx(
                                'px-2 py-1 rounded text-xs font-medium',
                                control.complianceStatus === 'Non-Compliant' ? 'bg-red-100 text-red-700' :
                                'bg-amber-100 text-amber-700'
                              )}>
                                {control.complianceStatus}
                              </span>
                              <span className={clsx(
                                'px-2 py-1 rounded text-xs font-medium',
                                control.effectiveness === 'Ineffective' ? 'bg-red-100 text-red-700' :
                                'bg-amber-100 text-amber-700'
                              )}>
                                {control.effectiveness}
                              </span>
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">{control.name}</h3>
                            <p className="text-xs text-gray-600 mb-3">{control.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                              <span>Owner: {control.owner}</span>
                              <span className="text-red-600 font-medium">
                                Failed Tests: {control.testsFailed}/{control.testCount}
                              </span>
                              <span>Score: {control.complianceScore}%</span>
                            </div>
                            {control.testsFailed > 0 && (
                              <div className="bg-red-50 border border-red-200 rounded p-3 mt-2">
                                <p className="text-xs font-medium text-red-700 mb-1">Action Required:</p>
                                <p className="text-xs text-red-600">
                                  Review failed tests and implement remediation plan
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Gaps & Deficiencies Section */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection('gaps')}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle size={24} className="text-amber-600" />
                <div className="text-left">
                  <h2 className="text-xl font-bold text-gray-900">Gaps & Deficiencies</h2>
                  <p className="text-sm text-gray-600 mt-1">{controlsWithGaps.length} controls with identified gaps</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                  {controlsWithGaps.length}
                </span>
                {expandedSections.has('gaps') ? (
                  <ChevronDown size={20} className="text-gray-400" />
                ) : (
                  <ChevronRight size={20} className="text-gray-400" />
                )}
              </div>
            </button>

            {expandedSections.has('gaps') && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                {controlsWithGaps.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 size={48} className="mx-auto mb-3 text-emerald-500 opacity-30" />
                    <p className="text-sm text-emerald-600 font-medium">No gaps identified!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {controlsWithGaps.map((control) => (
                      <div key={control.id} className="bg-white border border-amber-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-mono">
                                {control.code}
                              </span>
                              {control.testsFailed > 0 && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                                  {control.testsFailed} Failed Tests
                                </span>
                              )}
                              {control.effectiveness !== 'Effective' && (
                                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                                  {control.effectiveness}
                                </span>
                              )}
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">{control.name}</h3>
                            <p className="text-xs text-gray-600 mb-3">{control.description}</p>

                            <div className="bg-amber-50 border border-amber-200 rounded p-3">
                              <p className="text-xs font-medium text-amber-800 mb-2">Gap Details:</p>
                              <ul className="space-y-1 text-xs text-amber-700">
                                {control.testsFailed > 0 && (
                                  <li>• {control.testsFailed} test{control.testsFailed > 1 ? 's' : ''} failed validation</li>
                                )}
                                {control.effectiveness === 'Ineffective' && (
                                  <li>• Control marked as ineffective - requires redesign</li>
                                )}
                                {control.effectiveness === 'Partially Effective' && (
                                  <li>• Control partially effective - needs improvement</li>
                                )}
                              </ul>
                              <div className="mt-3 pt-3 border-t border-amber-200">
                                <p className="text-xs font-medium text-amber-800 mb-1">Recommended Actions:</p>
                                <p className="text-xs text-amber-700">
                                  Review control design, analyze root causes, and implement remediation plan
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Test Results Section */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection('tests')}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText size={24} className="text-blue-600" />
                <div className="text-left">
                  <h2 className="text-xl font-bold text-gray-900">Test Results</h2>
                  <p className="text-sm text-gray-600 mt-1">{programTests.length} tests executed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                    {passedTests.length} Passed
                  </span>
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                    {failedTests.length} Failed
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                    {pendingTests.length} Pending
                  </span>
                </div>
                {expandedSections.has('tests') ? (
                  <ChevronDown size={20} className="text-gray-400" />
                ) : (
                  <ChevronRight size={20} className="text-gray-400" />
                )}
              </div>
            </button>

            {expandedSections.has('tests') && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                {programTests.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">No tests available for this program</p>
                ) : (
                  <div className="space-y-6">
                    {/* Passed Tests */}
                    {passedTests.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-emerald-700 mb-3 flex items-center gap-2">
                          <CheckCircle2 size={16} />
                          Passed Tests ({passedTests.length})
                        </h3>
                        <div className="space-y-2">
                          {passedTests.map((test) => (
                            <div key={test.id} className="bg-white border border-emerald-200 rounded-lg p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-mono">
                                      {test.code}
                                    </span>
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                                      {test.result}
                                    </span>
                                  </div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-1">{test.name}</h4>
                                  <p className="text-xs text-gray-600 mb-2">{test.description}</p>
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span>Tester: {test.tester}</span>
                                    <span>Executed: {new Date(test.executedDate || test.scheduledDate).toLocaleDateString()}</span>
                                    <span>Type: {test.type}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Failed Tests */}
                    {failedTests.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                          <XCircle size={16} />
                          Failed Tests ({failedTests.length})
                        </h3>
                        <div className="space-y-2">
                          {failedTests.map((test) => (
                            <div key={test.id} className="bg-white border border-red-200 rounded-lg p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-mono">
                                      {test.code}
                                    </span>
                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                                      {test.result}
                                    </span>
                                  </div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-1">{test.name}</h4>
                                  <p className="text-xs text-gray-600 mb-2">{test.description}</p>
                                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                    <span>Tester: {test.tester}</span>
                                    <span>Executed: {new Date(test.executedDate || test.scheduledDate).toLocaleDateString()}</span>
                                  </div>
                                  {test.actualResult && (
                                    <div className="bg-red-50 border border-red-200 rounded p-2 mt-2">
                                      <p className="text-xs font-medium text-red-700 mb-1">Failure Details:</p>
                                      <p className="text-xs text-red-600">{test.actualResult}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pending Tests */}
                    {pendingTests.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Clock size={16} />
                          Pending Tests ({pendingTests.length})
                        </h3>
                        <div className="space-y-2">
                          {pendingTests.map((test) => (
                            <div key={test.id} className="bg-white border border-gray-200 rounded-lg p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-mono">
                                      {test.code}
                                    </span>
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                      Pending
                                    </span>
                                  </div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-1">{test.name}</h4>
                                  <p className="text-xs text-gray-600 mb-2">{test.description}</p>
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span>Scheduled: {new Date(test.scheduledDate).toLocaleDateString()}</span>
                                    <span>Tester: {test.tester}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Empty State */}
      {!selectedProgram && (
        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <Building2 size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Program to Generate Report</h3>
          <p className="text-sm text-gray-600">
            Choose a compliance program from the dropdown above to instantly generate a detailed report
          </p>
        </div>
      )}
    </div>
  );
}

