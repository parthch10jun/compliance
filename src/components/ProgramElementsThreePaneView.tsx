'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield, CheckCircle2, AlertTriangle, XCircle, Target, FileText,
  ClipboardCheck, ChevronRight, Calendar, User, TrendingUp, AlertCircle,
  Clock, X, ExternalLink
} from 'lucide-react';
import clsx from 'clsx';
import { requirements } from '@/lib/data/requirements-obligations';
import { controls } from '@/lib/data/controls';
import { risks, riskRequirementLinks } from '@/lib/data/risks';
import { requirementAssessments } from '@/lib/data/requirement-assessments';
import { formatDate } from '@/lib/utils/date-formatter';

type MiddlePaneTab = 'controls' | 'risks' | 'assessments';
type RightPaneContent = 
  | { type: 'control'; data: any }
  | { type: 'risk'; data: any }
  | { type: 'assessment'; data: any }
  | null;

interface ProgramElementsThreePaneViewProps {
  programId: string;
  programRequirements: any[];
  selectedRequirementId: string;
  onRequirementSelect: (id: string) => void;
  middlePaneTab: MiddlePaneTab;
  onMiddlePaneTabChange: (tab: MiddlePaneTab) => void;
  rightPaneContent: RightPaneContent;
  onRightPaneContentChange: (content: RightPaneContent) => void;
  onViewAllRequirements?: () => void;
}

export function ProgramElementsThreePaneView({
  programId,
  programRequirements,
  selectedRequirementId,
  onRequirementSelect,
  middlePaneTab,
  onMiddlePaneTabChange,
  rightPaneContent,
  onRightPaneContentChange,
  onViewAllRequirements
}: ProgramElementsThreePaneViewProps) {
  
  // Auto-select first requirement if none selected
  useEffect(() => {
    if (!selectedRequirementId && programRequirements.length > 0) {
      onRequirementSelect(programRequirements[0].id);
    }
  }, [selectedRequirementId, programRequirements, onRequirementSelect]);

  const selectedRequirement = programRequirements.find(r => r.id === selectedRequirementId);

  // Get linked entities for selected requirement
  const linkedControls = selectedRequirementId
    ? controls.filter(c => c.linkedRequirementIds?.includes(selectedRequirementId))
    : [];
  
  const linkedRiskIds = riskRequirementLinks
    .filter(link => link.requirementId === selectedRequirementId)
    .map(link => link.riskId);
  const linkedRisks = risks.filter(r => linkedRiskIds.includes(r.id) || r.linkedRequirementIds?.includes(selectedRequirementId));
  
  const linkedAssessments = requirementAssessments.filter(a => a.requirementId === selectedRequirementId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant': return 'bg-emerald-50 border-emerald-500 text-emerald-700';
      case 'Partially Compliant': return 'bg-amber-50 border-amber-500 text-amber-700';
      case 'Non-Compliant': return 'bg-red-50 border-red-500 text-red-700';
      case 'Not Assessed': return 'bg-gray-50 border-gray-500 text-gray-700';
      default: return 'bg-gray-50 border-gray-500 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Compliant': return <CheckCircle2 size={14} className="text-emerald-600" />;
      case 'Partially Compliant': return <AlertTriangle size={14} className="text-amber-600" />;
      case 'Non-Compliant': return <XCircle size={14} className="text-red-600" />;
      default: return <Clock size={14} className="text-gray-500" />;
    }
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-340px)] min-h-[600px] animate-fade-in-up">
      {/* LEFT PANE: Requirements List */}
      <div className="flex-[0_0_28%] bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={16} className="text-blue-600" />
              Requirements ({programRequirements.length})
            </h3>
            {onViewAllRequirements && (
              <button
                onClick={onViewAllRequirements}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                title="View all requirements in a modal"
              >
                View All
                <ExternalLink size={12} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {programRequirements.map((req) => (
            <div
              key={req.id}
              className={clsx(
                'w-full border-b border-gray-100 transition-all',
                selectedRequirementId === req.id && 'bg-blue-50 border-l-4 border-l-blue-500'
              )}
            >
              <button
                onClick={() => {
                  onRequirementSelect(req.id);
                  onRightPaneContentChange(null);
                }}
                className="w-full text-left p-3 hover:bg-gray-50/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-blue-600">{req.code}</span>
                      {getStatusIcon(req.status)}
                    </div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{req.title}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                      <Shield size={12} />
                      <span>{req.controlCount || 0} controls</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-semibold text-emerald-600">{req.complianceScore || 0}%</span>
                  </div>
                </div>
              </button>
              <div className="px-3 pb-2 flex justify-end">
                <Link
                  href={`/requirements/${req.id}`}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                >
                  <ExternalLink size={12} />
                  View
                </Link>
              </div>
            </div>
          ))}

          {programRequirements.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <FileText size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No requirements found</p>
            </div>
          )}
        </div>
      </div>

      {/* MIDDLE PANE: Controls/Risks/Assessments Tabs */}
      <div className="flex-[0_0_36%] bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
        {/* Tab Headers */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {(['controls', 'risks', 'assessments'] as MiddlePaneTab[]).map((tab) => {
            const count = tab === 'controls' ? linkedControls.length
              : tab === 'risks' ? linkedRisks.length
              : linkedAssessments.length;
            const Icon = tab === 'controls' ? Shield : tab === 'risks' ? AlertCircle : ClipboardCheck;
            const activeColor = tab === 'controls' ? 'border-green-500 text-green-700'
              : tab === 'risks' ? 'border-orange-500 text-orange-700'
              : 'border-purple-500 text-purple-700';

            return (
              <button
                key={tab}
                onClick={() => onMiddlePaneTabChange(tab)}
                className={clsx(
                  'flex-1 px-3 py-2.5 text-sm font-medium capitalize flex items-center justify-center gap-1.5 transition-all border-b-2',
                  middlePaneTab === tab
                    ? `bg-white ${activeColor}`
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon size={14} />
                {tab}
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Controls Tab */}
          {middlePaneTab === 'controls' && (
            <>
              {linkedControls.map((control) => (
                <button
                  key={control.id}
                  onClick={() => onRightPaneContentChange({ type: 'control', data: control })}
                  className={clsx(
                    'w-full text-left p-3 border-b border-gray-100 transition-all',
                    rightPaneContent?.type === 'control' && rightPaneContent.data.id === control.id
                      ? 'bg-green-50 border-l-4 border-l-green-500'
                      : 'hover:bg-gray-50'
                  )}
                >
                  <div className="mb-1">
                    <span className="text-xs font-mono text-green-600">{control.code}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">{control.name}</p>
                  <p className="text-xs text-gray-500 line-clamp-1 mb-2">{control.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={clsx('px-2 py-0.5 text-xs rounded font-medium',
                      control.type === 'Preventive' ? 'bg-blue-100 text-blue-700' :
                      control.type === 'Detective' ? 'bg-purple-100 text-purple-700' :
                      'bg-orange-100 text-orange-700'
                    )}>
                      {control.type}
                    </span>
                    <span className={clsx('px-2 py-0.5 text-xs rounded font-medium',
                      control.effectiveness === 'Effective' ? 'bg-emerald-100 text-emerald-700' :
                      control.effectiveness === 'Partially Effective' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    )}>
                      {control.effectiveness}
                    </span>
                  </div>
                </button>
              ))}
              {linkedControls.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <Shield size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No controls linked</p>
                </div>
              )}
            </>
          )}

          {/* Risks Tab */}
          {middlePaneTab === 'risks' && (
            <>
              {linkedRisks.map((risk) => (
                <button
                  key={risk.id}
                  onClick={() => onRightPaneContentChange({ type: 'risk', data: risk })}
                  className={clsx(
                    'w-full text-left p-3 border-b border-gray-100 transition-all',
                    rightPaneContent?.type === 'risk' && rightPaneContent.data.id === risk.id
                      ? 'bg-orange-50 border-l-4 border-l-orange-500'
                      : 'hover:bg-gray-50'
                  )}
                >
                  <div className="mb-1">
                    <span className="text-xs font-mono text-orange-600">{risk.code}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">{risk.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-1 mb-2">{risk.riskStatement}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={clsx('px-2 py-0.5 text-xs rounded font-medium',
                      risk.inherentRating === 'Critical' ? 'bg-red-100 text-red-700' :
                      risk.inherentRating === 'High' ? 'bg-orange-100 text-orange-700' :
                      risk.inherentRating === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    )}>
                      Inherent: {risk.inherentRating}
                    </span>
                    <span className={clsx('px-2 py-0.5 text-xs rounded font-medium',
                      risk.residualRating === 'Critical' ? 'bg-red-100 text-red-700' :
                      risk.residualRating === 'High' ? 'bg-orange-100 text-orange-700' :
                      risk.residualRating === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    )}>
                      Residual: {risk.residualRating}
                    </span>
                  </div>
                </button>
              ))}
              {linkedRisks.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <AlertCircle size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No risks linked</p>
                </div>
              )}
            </>
          )}

          {/* Assessments Tab */}
          {middlePaneTab === 'assessments' && (
            <>
              {linkedAssessments.map((assessment) => (
                <button
                  key={assessment.id}
                  onClick={() => onRightPaneContentChange({ type: 'assessment', data: assessment })}
                  className={clsx(
                    'w-full text-left p-3 border-b border-gray-100 transition-all',
                    rightPaneContent?.type === 'assessment' && rightPaneContent.data.id === assessment.id
                      ? 'bg-purple-50 border-l-4 border-l-purple-500'
                      : 'hover:bg-gray-50'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={clsx('px-2 py-0.5 text-xs rounded font-medium',
                      assessment.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      assessment.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      assessment.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    )}>
                      {assessment.status}
                    </span>
                    <span className="text-xs text-gray-500">{assessment.assessmentType}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">{assessment.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-1 mb-2">{assessment.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <User size={10} />
                      {assessment.assessor}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {formatDate(assessment.dueDate)}
                    </span>
                  </div>
                </button>
              ))}
              {linkedAssessments.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <ClipboardCheck size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No assessments found</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* RIGHT PANE: Detail View */}
      {rightPaneContent && (
        <div className="flex-[0_0_36%] bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
          {/* Control Detail */}
          {rightPaneContent.type === 'control' && (
            <ControlDetailPane
              control={rightPaneContent.data}
              onClose={() => onRightPaneContentChange(null)}
            />
          )}

          {/* Risk Detail */}
          {rightPaneContent.type === 'risk' && (
            <RiskDetailPane
              risk={rightPaneContent.data}
              onClose={() => onRightPaneContentChange(null)}
            />
          )}

          {/* Assessment Detail */}
          {rightPaneContent.type === 'assessment' && (
            <AssessmentDetailPane
              assessment={rightPaneContent.data}
              onClose={() => onRightPaneContentChange(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}

// Control Detail Pane Component
function ControlDetailPane({ control, onClose }: { control: any; onClose: () => void }) {
  return (
    <>
      <div className="p-3 border-b border-gray-200 bg-green-50 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-green-600">{control.code}</span>
          <h3 className="text-sm font-semibold text-gray-900 mt-0.5">{control.name}</h3>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-green-100 rounded transition-colors">
          <X size={16} className="text-gray-500" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Description</p>
          <p className="text-sm text-gray-700">{control.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Type</p>
            <p className="text-sm font-medium text-gray-900">{control.type}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Category</p>
            <p className="text-sm font-medium text-gray-900">{control.category}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Effectiveness</p>
            <span className={clsx('px-2 py-0.5 text-xs rounded font-medium',
              control.effectiveness === 'Effective' ? 'bg-emerald-100 text-emerald-700' :
              control.effectiveness === 'Partially Effective' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            )}>
              {control.effectiveness}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Automation</p>
            <p className="text-sm font-medium text-gray-900">{control.automationLevel}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Frequency</p>
            <p className="text-sm font-medium text-gray-900">{control.frequency}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Owner</p>
            <p className="text-sm font-medium text-gray-900">{control.owner}</p>
          </div>
        </div>
        {control.lastTestDate && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1.5">Testing</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400">Last Tested</p>
                <p className="text-sm text-gray-900">{formatDate(control.lastTestDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Next Test</p>
                <p className="text-sm text-gray-900">{formatDate(control.nextTestDate)}</p>
              </div>
            </div>
          </div>
        )}
        <div className="pt-3 border-t border-gray-100">
          <Link
            href={`/controls/${control.id}`}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
          >
            <ExternalLink size={14} />
            View Full Details
          </Link>
        </div>
      </div>
    </>
  );
}

// Risk Detail Pane Component
function RiskDetailPane({ risk, onClose }: { risk: any; onClose: () => void }) {
  return (
    <>
      <div className="p-3 border-b border-gray-200 bg-orange-50 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-orange-600">{risk.code}</span>
          <h3 className="text-sm font-semibold text-gray-900 mt-0.5">{risk.title}</h3>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-orange-100 rounded transition-colors">
          <X size={16} className="text-gray-500" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Risk Statement</p>
          <p className="text-sm text-gray-700">{risk.riskStatement}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Category</p>
            <p className="text-sm font-medium text-gray-900">{risk.category}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Owner</p>
            <p className="text-sm font-medium text-gray-900">{risk.owner}</p>
          </div>
        </div>

        {/* Inherent Risk */}
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1.5">Inherent Risk</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-gray-50 rounded text-center">
              <p className="text-xs text-gray-400">Likelihood</p>
              <p className="text-sm font-semibold text-gray-900">{risk.inherentLikelihood}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded text-center">
              <p className="text-xs text-gray-400">Impact</p>
              <p className="text-sm font-semibold text-gray-900">{risk.inherentImpact}</p>
            </div>
            <div className={clsx('p-2 rounded text-center',
              risk.inherentRating === 'Critical' ? 'bg-red-100' :
              risk.inherentRating === 'High' ? 'bg-orange-100' :
              risk.inherentRating === 'Medium' ? 'bg-amber-100' : 'bg-emerald-100'
            )}>
              <p className="text-xs text-gray-500">Rating</p>
              <p className={clsx('text-sm font-semibold',
                risk.inherentRating === 'Critical' ? 'text-red-700' :
                risk.inherentRating === 'High' ? 'text-orange-700' :
                risk.inherentRating === 'Medium' ? 'text-amber-700' : 'text-emerald-700'
              )}>{risk.inherentRating}</p>
            </div>
          </div>
        </div>

        {/* Residual Risk */}
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1.5">Residual Risk</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-gray-50 rounded text-center">
              <p className="text-xs text-gray-400">Likelihood</p>
              <p className="text-sm font-semibold text-gray-900">{risk.residualLikelihood}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded text-center">
              <p className="text-xs text-gray-400">Impact</p>
              <p className="text-sm font-semibold text-gray-900">{risk.residualImpact}</p>
            </div>
            <div className={clsx('p-2 rounded text-center',
              risk.residualRating === 'Critical' ? 'bg-red-100' :
              risk.residualRating === 'High' ? 'bg-orange-100' :
              risk.residualRating === 'Medium' ? 'bg-amber-100' : 'bg-emerald-100'
            )}>
              <p className="text-xs text-gray-500">Rating</p>
              <p className={clsx('text-sm font-semibold',
                risk.residualRating === 'Critical' ? 'text-red-700' :
                risk.residualRating === 'High' ? 'text-orange-700' :
                risk.residualRating === 'Medium' ? 'text-amber-700' : 'text-emerald-700'
              )}>{risk.residualRating}</p>
            </div>
          </div>
        </div>

        {/* Risk Reduction */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500">Risk Reduction</p>
            <p className="text-sm font-semibold text-emerald-600">{risk.riskReduction}%</p>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${risk.riskReduction}%` }}
            />
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <Link
            href={`/risks/${risk.id}`}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-orange-600 text-white text-sm font-medium rounded hover:bg-orange-700 transition-colors"
          >
            <ExternalLink size={14} />
            View Full Details
          </Link>
        </div>
      </div>
    </>
  );
}

// Assessment Detail Pane Component
function AssessmentDetailPane({ assessment, onClose }: { assessment: any; onClose: () => void }) {
  return (
    <>
      <div className="p-3 border-b border-gray-200 bg-purple-50 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className={clsx('px-2 py-0.5 text-xs rounded font-medium',
              assessment.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
              assessment.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
              assessment.status === 'Overdue' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            )}>
              {assessment.status}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900">{assessment.title}</h3>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-purple-100 rounded transition-colors">
          <X size={16} className="text-gray-500" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Description</p>
          <p className="text-sm text-gray-700">{assessment.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Assessment Type</p>
            <p className="text-sm font-medium text-gray-900">{assessment.assessmentType}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Priority</p>
            <span className={clsx('px-2 py-0.5 text-xs rounded font-medium',
              assessment.priority === 'Critical' ? 'bg-red-100 text-red-700' :
              assessment.priority === 'High' ? 'bg-orange-100 text-orange-700' :
              assessment.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
              'bg-gray-100 text-gray-700'
            )}>
              {assessment.priority}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Assessor</p>
            <p className="text-sm font-medium text-gray-900">{assessment.assessor}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Role</p>
            <p className="text-sm font-medium text-gray-900">{assessment.assessorRole}</p>
          </div>
        </div>

        {/* Dates */}
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1.5">Timeline</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-400">Scheduled</p>
              <p className="text-sm text-gray-900">{formatDate(assessment.scheduledDate)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Due Date</p>
              <p className="text-sm text-gray-900">{formatDate(assessment.dueDate)}</p>
            </div>
            {assessment.completedDate && (
              <div>
                <p className="text-xs text-gray-400">Completed</p>
                <p className="text-sm text-gray-900">{formatDate(assessment.completedDate)}</p>
              </div>
            )}
            {assessment.score !== undefined && (
              <div>
                <p className="text-xs text-gray-400">Score</p>
                <p className="text-sm font-semibold text-emerald-600">{assessment.score}%</p>
              </div>
            )}
          </div>
        </div>

        {/* Result */}
        {assessment.result && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1.5">Result</p>
            <span className={clsx('px-2 py-0.5 text-xs rounded font-medium',
              assessment.result === 'Compliant' ? 'bg-emerald-100 text-emerald-700' :
              assessment.result === 'Partially Compliant' ? 'bg-amber-100 text-amber-700' :
              assessment.result === 'Non-Compliant' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            )}>
              {assessment.result}
            </span>
          </div>
        )}

        {/* Findings */}
        {assessment.findings && assessment.findings.length > 0 && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1.5">Findings</p>
            <ul className="space-y-1.5">
              {assessment.findings.map((finding: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  {finding}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {assessment.recommendations && assessment.recommendations.length > 0 && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1.5">Recommendations</p>
            <ul className="space-y-1.5">
              {assessment.recommendations.map((rec: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={14} className="text-purple-500 flex-shrink-0 mt-0.5" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* View Full Details Button */}
        <div className="pt-3 border-t border-gray-100">
          <Link
            href={`/assessments/${assessment.id}`}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700 transition-colors"
          >
            <ExternalLink size={14} />
            View Full Details
          </Link>
        </div>
      </div>
    </>
  );
}

