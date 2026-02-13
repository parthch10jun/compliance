'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Target,
  FileText,
  ClipboardCheck,
  ChevronRight,
  Calendar,
  User,
  TrendingUp,
  AlertCircle,
  Clock,
  PlayCircle,
  CheckSquare
} from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

type MiddlePaneTab = 'controls' | 'assessments' | 'risks';
type RightPaneContent = 
  | { type: 'control'; data: any }
  | { type: 'assessment'; data: any }
  | { type: 'risk'; data: any }
  | null;

interface RequirementThreePaneViewProps {
  programRequirements: any[];
  selectedRequirementId: string;
  onRequirementSelect: (id: string) => void;
  linkedControls: any[];
  linkedAssessments: any[];
  linkedRisks: any[];
  controlTests: any[];
}

export function RequirementThreePaneView({
  programRequirements,
  selectedRequirementId,
  onRequirementSelect,
  linkedControls,
  linkedAssessments,
  linkedRisks,
  controlTests
}: RequirementThreePaneViewProps) {
  const router = useRouter();
  const [middlePaneTab, setMiddlePaneTab] = useState<MiddlePaneTab>('controls');
  const [rightPaneContent, setRightPaneContent] = useState<RightPaneContent>(null);

  const selectedRequirement = programRequirements.find(r => r.id === selectedRequirementId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant': return 'bg-emerald-50 border-emerald-500 text-emerald-700';
      case 'Partially Compliant': return 'bg-amber-50 border-amber-500 text-amber-700';
      case 'Non-Compliant': return 'bg-red-50 border-red-500 text-red-700';
      case 'Not Assessed': return 'bg-gray-50 border-gray-500 text-gray-700';
      default: return 'bg-gray-50 border-gray-500 text-gray-700';
    }
  };

  const getAssessmentStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Scheduled': return 'bg-gray-100 text-gray-700';
      case 'Overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAssessmentResultColor = (result?: string) => {
    switch (result) {
      case 'Compliant': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Partially Compliant': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Non-Compliant': return 'bg-red-50 text-red-700 border-red-200';
      case 'Not Applicable': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getRiskSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-700';
      case 'High': return 'bg-orange-100 text-orange-700';
      case 'Medium': return 'bg-amber-100 text-amber-700';
      case 'Low': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-400px)] min-h-[700px]">
      {/* LEFT PANE: Requirements List */}
      <div className="flex-[0_0_25%] bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <FileText size={16} className="text-blue-600" />
            Requirements ({programRequirements.length})
          </h3>
          {selectedRequirement && (
            <p className="text-xs text-gray-600 mt-1">{selectedRequirement.programName}</p>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {programRequirements.map((req) => (
            <button
              key={req.id}
              onClick={() => {
                onRequirementSelect(req.id);
                setRightPaneContent(null);
              }}
              className={clsx(
                'w-full text-left p-4 border-b border-gray-200 transition-all',
                selectedRequirementId === req.id
                  ? 'bg-blue-50 border-l-4 border-l-blue-500'
                  : 'hover:bg-gray-50'
              )}
            >
              <div className="mb-2">
                <span className="text-xs font-mono text-blue-600">{req.code}</span>
              </div>
              <h4 className={clsx(
                'text-sm font-semibold mb-1',
                selectedRequirementId === req.id ? 'text-blue-700' : 'text-gray-900'
              )}>
                {req.title}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {req.description}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={clsx('px-2 py-0.5 rounded text-xs font-medium', getStatusColor(req.status))}>
                  {req.status}
                </span>
                <span className="text-xs text-gray-500">{req.complianceScore}%</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* MIDDLE PANE: Tabs for Controls, Assessments, Risks */}
      <div className="flex-[0_0_35%] bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
        {/* Tab Headers */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex">
            <button
              onClick={() => {
                setMiddlePaneTab('controls');
                setRightPaneContent(null);
              }}
              className={clsx(
                'flex-1 px-4 py-3 text-sm font-medium transition-all border-b-2',
                middlePaneTab === 'controls'
                  ? 'border-green-500 text-green-700 bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <Shield size={16} />
                <span>Controls</span>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs">{linkedControls.length}</span>
              </div>
            </button>
            <button
              onClick={() => {
                setMiddlePaneTab('assessments');
                setRightPaneContent(null);
              }}
              className={clsx(
                'flex-1 px-4 py-3 text-sm font-medium transition-all border-b-2',
                middlePaneTab === 'assessments'
                  ? 'border-purple-500 text-purple-700 bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <ClipboardCheck size={16} />
                <span>Assessments</span>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs">{linkedAssessments.length}</span>
              </div>
            </button>
            <button
              onClick={() => {
                setMiddlePaneTab('risks');
                setRightPaneContent(null);
              }}
              className={clsx(
                'flex-1 px-4 py-3 text-sm font-medium transition-all border-b-2',
                middlePaneTab === 'risks'
                  ? 'border-red-500 text-red-700 bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle size={16} />
                <span>Risks</span>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs">{linkedRisks.length}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Controls Tab */}
          {middlePaneTab === 'controls' && (
            <>
              {linkedControls.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Shield size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No controls mapped</p>
                </div>
              ) : (
                linkedControls.map((ctrl) => (
                  <button
                    key={ctrl.id}
                    onClick={() => setRightPaneContent({ type: 'control', data: ctrl })}
                    className={clsx(
                      'w-full text-left p-4 border-b border-gray-200 transition-all',
                      rightPaneContent?.type === 'control' && rightPaneContent.data.id === ctrl.id
                        ? 'bg-green-50 border-l-4 border-l-green-500'
                        : 'hover:bg-gray-50'
                    )}
                  >
                    <div className="mb-2">
                      <span className="text-xs font-mono text-green-600">{ctrl.code}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">{ctrl.name}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">{ctrl.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={clsx(
                        'px-2 py-0.5 rounded text-xs font-medium',
                        ctrl.type === 'Preventive' ? 'bg-blue-100 text-blue-700' :
                        ctrl.type === 'Detective' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      )}>
                        {ctrl.type}
                      </span>
                      <span className={clsx(
                        'px-2 py-0.5 rounded text-xs font-medium',
                        ctrl.effectiveness === 'Effective' ? 'bg-emerald-100 text-emerald-700' :
                        ctrl.effectiveness === 'Partially Effective' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      )}>
                        {ctrl.effectiveness}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </>
          )}

          {/* Assessments Tab */}
          {middlePaneTab === 'assessments' && (
            <>
              {linkedAssessments.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <ClipboardCheck size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No assessments scheduled</p>
                </div>
              ) : (
                linkedAssessments.map((assessment) => (
                  <button
                    key={assessment.id}
                    onClick={() => setRightPaneContent({ type: 'assessment', data: assessment })}
                    className={clsx(
                      'w-full text-left p-4 border-b border-gray-200 transition-all',
                      rightPaneContent?.type === 'assessment' && rightPaneContent.data.id === assessment.id
                        ? 'bg-purple-50 border-l-4 border-l-purple-500'
                        : 'hover:bg-gray-50'
                    )}
                  >
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">{assessment.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">{assessment.description}</p>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={clsx('px-2 py-0.5 rounded text-xs font-medium', getAssessmentStatusColor(assessment.status))}>
                        {assessment.status}
                      </span>
                      <span className="text-xs text-gray-600">{assessment.assessmentType}</span>
                    </div>
                    {assessment.result && (
                      <div className="flex items-center gap-2">
                        <span className={clsx('px-2 py-0.5 rounded border text-xs font-medium', getAssessmentResultColor(assessment.result))}>
                          {assessment.result}
                        </span>
                        {assessment.score !== undefined && (
                          <span className="text-xs font-medium text-gray-700">{assessment.score}%</span>
                        )}
                      </div>
                    )}
                  </button>
                ))
              )}
            </>
          )}

          {/* Risks Tab */}
          {middlePaneTab === 'risks' && (
            <>
              {linkedRisks.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <AlertTriangle size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No risks identified</p>
                </div>
              ) : (
                linkedRisks.map((risk) => (
                  <button
                    key={risk.id}
                    onClick={() => setRightPaneContent({ type: 'risk', data: risk })}
                    className={clsx(
                      'w-full text-left p-4 border-b border-gray-200 transition-all',
                      rightPaneContent?.type === 'risk' && rightPaneContent.data.id === risk.id
                        ? 'bg-red-50 border-l-4 border-l-red-500'
                        : 'hover:bg-gray-50'
                    )}
                  >
                    <div className="mb-2">
                      <span className="text-xs font-mono text-red-600">{risk.code}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">{risk.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">{risk.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={clsx('px-2 py-0.5 rounded text-xs font-medium', getRiskSeverityColor(risk.inherentRisk))}>
                        Inherent: {risk.inherentRisk}
                      </span>
                      <span className={clsx('px-2 py-0.5 rounded text-xs font-medium', getRiskSeverityColor(risk.residualRisk))}>
                        Residual: {risk.residualRisk}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </>
          )}
        </div>
      </div>

      {/* RIGHT PANE: Detail View */}
      {rightPaneContent && (
        <div className="flex-[0_0_40%] bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
          {/* Control Detail */}
          {rightPaneContent.type === 'control' && (
            <>
              <div className="p-4 border-b border-gray-200 bg-green-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Shield size={16} className="text-green-600" />
                    Control Testing
                  </h3>
                  <button
                    onClick={() => setRightPaneContent(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs font-mono text-green-600">{rightPaneContent.data.code}</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{rightPaneContent.data.name}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Description</h4>
                  <p className="text-xs text-gray-600">{rightPaneContent.data.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Type</p>
                    <span className={clsx(
                      'inline-flex px-2 py-1 rounded text-xs font-medium',
                      rightPaneContent.data.type === 'Preventive' ? 'bg-blue-100 text-blue-700' :
                      rightPaneContent.data.type === 'Detective' ? 'bg-purple-100 text-purple-700' :
                      'bg-orange-100 text-orange-700'
                    )}>
                      {rightPaneContent.data.type}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Effectiveness</p>
                    <span className={clsx(
                      'inline-flex px-2 py-1 rounded text-xs font-medium',
                      rightPaneContent.data.effectiveness === 'Effective' ? 'bg-emerald-100 text-emerald-700' :
                      rightPaneContent.data.effectiveness === 'Partially Effective' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    )}>
                      {rightPaneContent.data.effectiveness}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Owner</p>
                    <p className="text-xs font-medium text-gray-900">{rightPaneContent.data.owner}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Frequency</p>
                    <p className="text-xs font-medium text-gray-900">{rightPaneContent.data.frequency}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <PlayCircle size={14} />
                    Recent Tests
                  </h4>
                  {controlTests.filter(t => t.controlId === rightPaneContent.data.id).length === 0 ? (
                    <p className="text-xs text-gray-500 italic">No tests recorded</p>
                  ) : (
                    <div className="space-y-2">
                      {controlTests
                        .filter(t => t.controlId === rightPaneContent.data.id)
                        .slice(0, 3)
                        .map((test) => (
                          <div key={test.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-900">{test.testName}</span>
                              <span className={clsx(
                                'px-2 py-0.5 rounded text-xs font-medium',
                                test.result === 'Pass' ? 'bg-emerald-100 text-emerald-700' :
                                test.result === 'Fail' ? 'bg-red-100 text-red-700' :
                                'bg-amber-100 text-amber-700'
                              )}>
                                {test.result}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Calendar size={12} />
                              <span>{test.testDate}</span>
                              <span>•</span>
                              <User size={12} />
                              <span>{test.tester}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <Link
                  href={`/controls/${rightPaneContent.data.id}`}
                  className="block w-full px-4 py-2 bg-green-600 text-white text-center text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  View Full Control Details
                </Link>
              </div>
            </>
          )}

          {/* Assessment Detail */}
          {rightPaneContent.type === 'assessment' && (
            <>
              <div className="p-4 border-b border-gray-200 bg-purple-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <ClipboardCheck size={16} className="text-purple-600" />
                    Assessment Details
                  </h3>
                  <button
                    onClick={() => setRightPaneContent(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm font-semibold text-gray-900">{rightPaneContent.data.title}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Description</h4>
                  <p className="text-xs text-gray-600">{rightPaneContent.data.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Type</p>
                    <p className="text-xs font-medium text-gray-900">{rightPaneContent.data.assessmentType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span className={clsx('inline-flex px-2 py-1 rounded text-xs font-medium', getAssessmentStatusColor(rightPaneContent.data.status))}>
                      {rightPaneContent.data.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Assessor</p>
                    <p className="text-xs font-medium text-gray-900">{rightPaneContent.data.assessor}</p>
                    <p className="text-xs text-gray-500">{rightPaneContent.data.assessorRole}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Priority</p>
                    <span className={clsx(
                      'inline-flex px-2 py-1 rounded text-xs font-medium',
                      rightPaneContent.data.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                      rightPaneContent.data.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                      rightPaneContent.data.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    )}>
                      {rightPaneContent.data.priority}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Scheduled Date</p>
                    <p className="text-xs font-medium text-gray-900">{rightPaneContent.data.scheduledDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Due Date</p>
                    <p className="text-xs font-medium text-gray-900">{rightPaneContent.data.dueDate}</p>
                  </div>
                  {rightPaneContent.data.completedDate && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Completed Date</p>
                      <p className="text-xs font-medium text-gray-900">{rightPaneContent.data.completedDate}</p>
                    </div>
                  )}
                  {rightPaneContent.data.score !== undefined && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Score</p>
                      <p className="text-xs font-medium text-gray-900">{rightPaneContent.data.score}%</p>
                    </div>
                  )}
                </div>

                {rightPaneContent.data.result && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Result</p>
                    <span className={clsx('inline-flex px-3 py-1 rounded border text-xs font-medium', getAssessmentResultColor(rightPaneContent.data.result))}>
                      {rightPaneContent.data.result}
                    </span>
                  </div>
                )}

                {rightPaneContent.data.findings && rightPaneContent.data.findings.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Findings</h4>
                    <ul className="space-y-1">
                      {rightPaneContent.data.findings.map((finding: string, idx: number) => (
                        <li key={idx} className="text-xs text-gray-600 flex gap-2">
                          <span className="text-blue-600">•</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {rightPaneContent.data.recommendations && rightPaneContent.data.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Recommendations</h4>
                    <ul className="space-y-1">
                      {rightPaneContent.data.recommendations.map((rec: string, idx: number) => (
                        <li key={idx} className="text-xs text-gray-600 flex gap-2">
                          <span className="text-amber-600">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Evidence Attached</span>
                    <span className="font-medium text-gray-900">{rightPaneContent.data.evidenceCount} files</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Risk Detail */}
          {rightPaneContent.type === 'risk' && (
            <>
              <div className="p-4 border-b border-gray-200 bg-red-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-red-600" />
                    Risk Details
                  </h3>
                  <button
                    onClick={() => setRightPaneContent(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs font-mono text-red-600">{rightPaneContent.data.code}</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{rightPaneContent.data.title}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Description</h4>
                  <p className="text-xs text-gray-600">{rightPaneContent.data.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Category</p>
                    <p className="text-xs font-medium text-gray-900">{rightPaneContent.data.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span className={clsx(
                      'inline-flex px-2 py-1 rounded text-xs font-medium',
                      rightPaneContent.data.status === 'Active' ? 'bg-red-100 text-red-700' :
                      rightPaneContent.data.status === 'Mitigated' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-gray-100 text-gray-700'
                    )}>
                      {rightPaneContent.data.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Risk Assessment</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-xs text-gray-600 mb-1">Inherent Risk</p>
                      <span className={clsx('inline-flex px-2 py-1 rounded text-xs font-medium', getRiskSeverityColor(rightPaneContent.data.inherentRisk))}>
                        {rightPaneContent.data.inherentRisk}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Score: {rightPaneContent.data.inherentScore}</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-xs text-gray-600 mb-1">Residual Risk</p>
                      <span className={clsx('inline-flex px-2 py-1 rounded text-xs font-medium', getRiskSeverityColor(rightPaneContent.data.residualRisk))}>
                        {rightPaneContent.data.residualRisk}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Score: {rightPaneContent.data.residualScore}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Owner</p>
                  <p className="text-xs font-medium text-gray-900">{rightPaneContent.data.owner}</p>
                </div>

                {rightPaneContent.data.mitigationStrategy && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Mitigation Strategy</h4>
                    <p className="text-xs text-gray-600">{rightPaneContent.data.mitigationStrategy}</p>
                  </div>
                )}

                <Link
                  href={`/risks/${rightPaneContent.data.id}`}
                  className="block w-full px-4 py-2 bg-red-600 text-white text-center text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  View Full Risk Details
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

