'use client';

import { use, useState, useEffect } from 'react';
import {
  PageHeader, ComplianceScoreBreakdown, LinkFrameworkModal,
  AddRequirementModal, MapControlModal, AddTestModal, UploadEvidenceModal, ExecuteTestModal, EditProgramModal,
  ProgramElementsThreePaneView
} from '@/components';
import { ComplianceAreaModal } from '@/components/ComplianceAreaModal';
import { ControlSummaryModal } from '@/components/ControlSummaryModal';
import { ObligationSummaryModal } from '@/components/ObligationSummaryModal';
import { RequirementSummaryModal } from '@/components/RequirementSummaryModal';
import { AllRequirementsModal } from '@/components/AllRequirementsModal';
import { AllControlsModal } from '@/components/AllControlsModal';
import { AllObligationsModal } from '@/components/AllObligationsModal';
import { programs } from '@/lib/data/mock-data';
import { requirements, obligations } from '@/lib/data/requirements-obligations';
import { controls } from '@/lib/data/controls';
import { controlTests } from '@/lib/data/control-tests';
import rbiITGovernance from '@/lib/data/rbi-it-governance';
import { programTemplates } from '@/lib/data/program-library';
import { ComplianceCalculator } from '@/lib/utils/compliance-calculator';
import { DEFAULT_CALCULATION_CONFIGS } from '@/lib/types/compliance-calculations';
import {
  Shield, Calendar, FileText,
  CheckCircle2, Target, BookOpen,
  Sparkles, Edit, Download, Share2, Link2,
  Info, Layers, Building2, Tag, Globe, Award, ExternalLink
} from 'lucide-react';
import clsx from 'clsx';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils/date-formatter';
import { getProgramSpecifications } from '@/lib/data/program-specifications';
import { WorkflowStep } from '@/lib/types/program-specifications';
import ProcedureDetailModal from '@/components/modals/ProcedureDetailModal';
import WorkflowConfigModal from '@/components/modals/WorkflowConfigModal';

type TabType = 'info' | 'elements';

export default function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const program = programs.find(p => p.id === id);
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Elements tab state
  const [selectedRequirementId, setSelectedRequirementId] = useState<string>('');
  const [middlePaneTab, setMiddlePaneTab] = useState<'controls' | 'risks' | 'assessments'>('controls');
  const [rightPaneContent, setRightPaneContent] = useState<any>(null);

  // Local state for control-requirement mappings
  const [controlMappings, setControlMappings] = useState<Record<string, string[]>>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load mappings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('control-requirement-mappings');
    if (stored) {
      try {
        setControlMappings(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored mappings:', e);
      }
    }
  }, []);

  // Save mappings to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(controlMappings).length > 0) {
      localStorage.setItem('control-requirement-mappings', JSON.stringify(controlMappings));
    }
  }, [controlMappings]);

  // Function to handle control mapping
  const handleMapControls = (requirementId: string, controlIds: string[]) => {
    setControlMappings(prev => ({
      ...prev,
      [requirementId]: [...(prev[requirementId] || []), ...controlIds.filter(id => !prev[requirementId]?.includes(id))]
    }));
    setShowMapControlModal(false);
    setSelectedItem(null);

    // Show success message
    setSuccessMessage(`Successfully mapped ${controlIds.length} control${controlIds.length !== 1 ? 's' : ''}`);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Workflow modal states
  const [showAddReqModal, setShowAddReqModal] = useState(false);
  const [showMapControlModal, setShowMapControlModal] = useState(false);
  const [showAddTestModal, setShowAddTestModal] = useState(false);
  const [showUploadEvidenceModal, setShowUploadEvidenceModal] = useState(false);
  const [showExecuteTestModal, setShowExecuteTestModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ type: 'requirement' | 'control' | 'test'; id: string; name: string } | null>(null);

  // Program specifications modal states
  const [showProcedureModal, setShowProcedureModal] = useState(false);
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [selectedWorkflowType, setSelectedWorkflowType] = useState<'assessment' | 'testing'>('assessment');
  const [showAssessmentConfigModal, setShowAssessmentConfigModal] = useState(false);
  const [showTestingConfigModal, setShowTestingConfigModal] = useState(false);

  // Summary modal states
  const [showComplianceAreaModal, setShowComplianceAreaModal] = useState(false);
  const [selectedComplianceArea, setSelectedComplianceArea] = useState<any>(null);
  const [showControlSummaryModal, setShowControlSummaryModal] = useState(false);
  const [selectedControl, setSelectedControl] = useState<any>(null);
  const [showObligationSummaryModal, setShowObligationSummaryModal] = useState(false);
  const [selectedObligation, setSelectedObligation] = useState<any>(null);
  const [showRequirementSummaryModal, setShowRequirementSummaryModal] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<any>(null);

  // List modal states
  const [showAllRequirementsModal, setShowAllRequirementsModal] = useState(false);
  const [showAllControlsModal, setShowAllControlsModal] = useState(false);
  const [showAllObligationsModal, setShowAllObligationsModal] = useState(false);

  if (!program) {
    notFound();
  }

  // Get program requirements
  const programRequirements = requirements.filter(r => r.programId === program.id);

  // Get program obligations
  const programObligations = obligations.filter(o => o.programId === program.id);

  // Get program controls (for now, we'll use a subset based on program)
  const programControls = controls.slice(0, Math.min(10, program.controls));

  // Get program tests
  const programTests = controlTests.slice(0, Math.min(15, program.tests));

  // Get program specifications (for modals)
  const programSpecs = getProgramSpecifications(program.id);

  // Get source template for detailed program information
  const sourceTemplate = program.sourceTemplateId
    ? programTemplates.find(t => t.id === program.sourceTemplateId)
    : programTemplates.find(t => t.id === program.id);

  // Calculate compliance score breakdown
  const mockProgramData = {
    requirements: programRequirements.map(r => ({
      id: r.id,
      complianceScore: r.complianceScore ?? 0,
      priority: r.riskRating as 'Critical' | 'High' | 'Medium' | 'Low',
      status: r.status,
    })),
    controls: programControls.map(c => ({
      id: c.id,
      effectiveness: c.effectiveness as 'Effective' | 'Partially Effective' | 'Ineffective' | 'Not Tested',
      priority: 'Medium' as 'Critical' | 'High' | 'Medium' | 'Low',
    })),
    tests: programTests.map(t => ({
      id: t.id,
      result: t.result as 'Pass' | 'Fail' | 'Pending',
      controlId: t.controlId,
    })),
    obligations: programObligations.map(o => ({
      id: o.id,
      status: o.status,
      priority: o.riskRating as 'Critical' | 'High' | 'Medium' | 'Low',
    })),
    risks: [
      { id: 'risk-1', rating: 'Critical' as const, residualRisk: 0.3 },
      { id: 'risk-2', rating: 'High' as const, residualRisk: 0.4 },
      { id: 'risk-3', rating: 'Medium' as const, residualRisk: 0.2 },
    ],
  };

  // Use weighted average by default (can be made configurable)
  const calculationResult = ComplianceCalculator.calculate(
    DEFAULT_CALCULATION_CONFIGS['weighted-average'],
    mockProgramData
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Under Review': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Archived': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'text-red-600 bg-red-50';
      case 'High': return 'text-orange-600 bg-orange-50';
      case 'Medium': return 'text-amber-600 bg-amber-50';
      case 'Low': return 'text-emerald-600 bg-emerald-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={program.name}
        description={program.description}
        action={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLinkModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 border border-cyan-300 bg-cyan-50 text-cyan-700 rounded-xl hover:bg-cyan-100 transition-all duration-200 text-p2 font-medium"
            >
              <Link2 size={18} />
              Link Framework
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-[var(--border)] bg-[var(--background)] rounded-xl hover:bg-[var(--background-secondary)] transition-all duration-200 text-p2 font-medium">
              <Share2 size={18} />
              Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-[var(--border)] bg-[var(--background)] rounded-xl hover:bg-[var(--background-secondary)] transition-all duration-200 text-p2 font-medium">
              <Download size={18} />
              Export
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-dark)] transition-all duration-200 text-p2 font-medium shadow-sm hover:shadow-md"
            >
              <Edit size={18} />
              Edit Program
            </button>
          </div>
        }
      />

      {/* Source Badge */}
      <div className="flex items-center gap-2">
        <span className={clsx('text-xs px-3 py-1.5 rounded-full font-medium inline-flex items-center gap-1.5',
          program.isCustom 
            ? 'bg-violet-100 text-violet-700 border border-violet-200' 
            : 'bg-cyan-100 text-cyan-700 border border-cyan-200'
        )}>
          {program.isCustom ? (
            <><Sparkles size={12} /> Custom Created</>
          ) : (
            <><BookOpen size={12} /> Imported from Library</>
          )}
        </span>
        <span className={clsx('text-xs px-3 py-1.5 rounded-full font-medium border', getStatusColor(program.status))}>
          {program.status}
        </span>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-fade-in-up delay-1">
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1">Compliance Score</p>
          <p className="text-h2 font-bold text-emerald-600">{program.complianceScore}%</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1">Risk Rating</p>
          <p className={clsx('text-p1 font-semibold', getRiskColor(program.riskRating))}>{program.riskRating}</p>
        </div>
        <button
          onClick={() => setShowAllRequirementsModal(true)}
          className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md hover:border-cyan-500/30 transition-all text-left cursor-pointer group"
        >
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1 group-hover:text-cyan-600 transition-colors">Requirements</p>
          <p className="text-h2 font-bold text-[var(--foreground)] group-hover:text-cyan-600 transition-colors">{program.requirementCount}</p>
        </button>
        <button
          onClick={() => setShowAllObligationsModal(true)}
          className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md hover:border-purple-500/30 transition-all text-left cursor-pointer group"
        >
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1 group-hover:text-purple-600 transition-colors">Obligations</p>
          <p className="text-h2 font-bold text-[var(--foreground)] group-hover:text-purple-600 transition-colors">{program.obligationCount}</p>
          {program.overdueObligations > 0 && (
            <p className="text-p3 text-red-600 mt-1">{program.overdueObligations} overdue</p>
          )}
        </button>
        <button
          onClick={() => setShowAllControlsModal(true)}
          className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md hover:border-emerald-500/30 transition-all text-left cursor-pointer group"
        >
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1 group-hover:text-emerald-600 transition-colors">Controls</p>
          <p className="text-h2 font-bold text-[var(--foreground)] group-hover:text-emerald-600 transition-colors">{program.controls}</p>
        </button>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1">Tests</p>
          <p className="text-h2 font-bold text-[var(--foreground)]">{program.tests}</p>
          <p className="text-p3 text-emerald-600 mt-1">{program.testsPassed} passed</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="border-b border-[var(--border)] bg-white rounded-t-xl">
        <div className="flex gap-1 p-1">
          <button
            onClick={() => setActiveTab('info')}
            className={clsx(
              'flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-p2 transition-all',
              activeTab === 'info'
                ? 'bg-[var(--primary)] text-white shadow-sm'
                : 'text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]'
            )}
          >
            <Info size={18} />
            Info
          </button>
          <button
            onClick={() => setActiveTab('elements')}
            className={clsx(
              'flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-p2 transition-all',
              activeTab === 'elements'
                ? 'bg-[var(--primary)] text-white shadow-sm'
                : 'text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]'
            )}
          >
            <Layers size={18} />
            Elements
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <>
          {/* Compliance Score Breakdown */}
          <div className="animate-fade-in-up delay-2">
            <ComplianceScoreBreakdown breakdown={calculationResult.breakdown} />
          </div>

          {/* Program Details - Redesigned */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up delay-3">
            <div className="lg:col-span-2 space-y-6">
              {/* About This Program */}
              <div className="bg-white rounded-xl border border-[var(--border)] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <BookOpen className="text-white" size={20} />
                  </div>
                  <h3 className="text-h3 font-semibold text-[var(--foreground)]">About This Program</h3>
                </div>
                <p className="text-p2 text-[var(--foreground-muted)] leading-relaxed">
                  {sourceTemplate?.longDescription || program.description}
                </p>
              </div>

              {/* Key Features */}
              {sourceTemplate?.keyFeatures && sourceTemplate.keyFeatures.length > 0 && (
                <div className="bg-white rounded-xl border border-[var(--border)] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <Award className="text-white" size={20} />
                    </div>
                    <h3 className="text-h3 font-semibold text-[var(--foreground)]">Key Features</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sourceTemplate.keyFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                        <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-p2 text-[var(--foreground)]">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Applicability */}
              {sourceTemplate?.applicableTo && sourceTemplate.applicableTo.length > 0 && (
                <div className="bg-white rounded-xl border border-[var(--border)] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                      <Globe className="text-white" size={20} />
                    </div>
                    <h3 className="text-h3 font-semibold text-[var(--foreground)]">Applicability</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sourceTemplate.applicableTo.map((item, idx) => (
                      <span key={idx} className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-p2 font-medium border border-purple-100">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Program Overview */}
              <div className="bg-white rounded-xl border border-[var(--border)] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <Target className="text-white" size={20} />
                  </div>
                  <h3 className="text-h3 font-semibold text-[var(--foreground)]">Program Overview</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-p3 text-[var(--foreground-muted)] mb-1">Framework</p>
                    <p className="text-p2 font-semibold text-[var(--foreground)]">{program.framework}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-p3 text-[var(--foreground-muted)] mb-1">Owner</p>
                    <p className="text-p2 font-semibold text-[var(--foreground)]">{program.owner}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-p3 text-[var(--foreground-muted)] mb-1">Department</p>
                    <p className="text-p2 font-semibold text-[var(--foreground)]">{program.department}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-p3 text-[var(--foreground-muted)] mb-1">Priority</p>
                    <span className={clsx('inline-block px-2 py-0.5 text-xs rounded-full font-medium',
                      program.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                      program.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                      program.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    )}>
                      {program.priority}
                    </span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-p3 text-[var(--foreground-muted)] mb-1">Last Review</p>
                    <p className="text-p2 font-semibold text-[var(--foreground)]">{formatDate(program.lastReviewDate)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-p3 text-[var(--foreground-muted)] mb-1">Next Review</p>
                    <p className="text-p2 font-semibold text-[var(--foreground)]">{formatDate(program.nextReviewDate)}</p>
                  </div>
                </div>
              </div>

              {/* Compliance Areas Section - Only for RBI IT Governance */}
              {(program.id === 'tpl-rbi-itgov-2023' || program.sourceTemplateId === 'tpl-rbi-itgov-2023') && rbiITGovernance.complianceAreas && (
                <div className="bg-white rounded-xl border border-[var(--border)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-h3 font-semibold text-[var(--foreground)]">Compliance Areas</h3>
                    <span className="text-p3 text-[var(--foreground-muted)]">{rbiITGovernance.complianceAreas.length} Areas</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rbiITGovernance.complianceAreas.map((area) => {
                      const areaRequirements = programRequirements.filter(r => r.category === area.name);
                      const avgScore = areaRequirements.length > 0
                        ? Math.round(areaRequirements.reduce((sum, r) => sum + (r.complianceScore || 0), 0) / areaRequirements.length)
                        : 0;

                      return (
                        <button
                          key={area.id}
                          onClick={() => {
                            setSelectedComplianceArea({ ...area, requirements: areaRequirements });
                            setShowComplianceAreaModal(true);
                          }}
                          className="w-full text-left p-4 border border-[var(--border)] rounded-lg hover:border-cyan-500/30 hover:shadow-md transition-all group cursor-pointer"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-p2 font-semibold text-[var(--foreground)] group-hover:text-cyan-600 transition-colors">
                                  {area.name}
                                </h4>
                                <span className={clsx('px-2 py-0.5 text-xs rounded-full font-medium',
                                  area.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                                  area.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                                  'bg-blue-100 text-blue-700'
                                )}>
                                  {area.priority}
                                </span>
                              </div>
                              <p className="text-p3 text-[var(--foreground-muted)] mb-2">{area.description}</p>
                              <div className="flex items-center gap-3 text-p3 text-[var(--foreground-muted)]">
                                <span className="flex items-center gap-1">
                                  <FileText size={14} />
                                  {area.requirementsCount} Requirements
                                </span>
                                <span className="flex items-center gap-1">
                                  <Shield size={14} />
                                  {area.controlsCount} Controls
                                </span>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-h3 font-bold text-emerald-600">{avgScore}%</p>
                              <p className="text-p3 text-[var(--foreground-muted)]">{area.chapter}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publisher & Version Info */}
              {sourceTemplate && (
                <div className="bg-white rounded-xl border border-[var(--border)] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 size={20} className="text-[var(--foreground-muted)]" />
                    <h3 className="text-h3 font-semibold text-[var(--foreground)]">Publisher & Version</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-p3 text-[var(--foreground-muted)] mb-1">Publisher</p>
                      <p className="text-p2 font-semibold text-[var(--foreground)]">{sourceTemplate.publisher}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-p3 text-[var(--foreground-muted)] mb-1">Version</p>
                        <p className="text-p2 font-semibold text-[var(--foreground)]">{sourceTemplate.version}</p>
                      </div>
                      <div>
                        <p className="text-p3 text-[var(--foreground-muted)] mb-1">Category</p>
                        <p className="text-p2 font-semibold text-[var(--foreground)]">{sourceTemplate.category}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-p3 text-[var(--foreground-muted)] mb-1">Effective Date</p>
                        <p className="text-p2 font-medium text-[var(--foreground)]">{sourceTemplate.effectiveDate ? formatDate(sourceTemplate.effectiveDate) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-p3 text-[var(--foreground-muted)] mb-1">Last Updated</p>
                        <p className="text-p2 font-medium text-[var(--foreground)]">{sourceTemplate.lastUpdated ? formatDate(sourceTemplate.lastUpdated) : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="bg-white rounded-xl border border-[var(--border)] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Tag size={20} className="text-[var(--foreground-muted)]" />
                  <h3 className="text-h3 font-semibold text-[var(--foreground)]">Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {program.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1.5 text-p3 bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 rounded-lg border border-cyan-100 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl border border-[var(--border)] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Layers size={20} className="text-[var(--foreground-muted)]" />
                  <h3 className="text-h3 font-semibold text-[var(--foreground)]">Program Metrics</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-p2 text-blue-700 flex items-center gap-2">
                      <FileText size={16} />
                      Requirements
                    </span>
                    <span className="text-p2 font-bold text-blue-700">{program.requirementCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <span className="text-p2 text-emerald-700 flex items-center gap-2">
                      <Shield size={16} />
                      Controls
                    </span>
                    <span className="text-p2 font-bold text-emerald-700">{program.controls}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <span className="text-p2 text-amber-700 flex items-center gap-2">
                      <Calendar size={16} />
                      Obligations
                    </span>
                    <span className="text-p2 font-bold text-amber-700">{program.obligationCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Elements Tab - Three Pane View */}
      {activeTab === 'elements' && (
        <ProgramElementsThreePaneView
          programId={program.id}
          programRequirements={programRequirements}
          selectedRequirementId={selectedRequirementId}
          onRequirementSelect={setSelectedRequirementId}
          middlePaneTab={middlePaneTab}
          onMiddlePaneTabChange={setMiddlePaneTab}
          rightPaneContent={rightPaneContent}
          onRightPaneContentChange={setRightPaneContent}
        />
      )}

      {/* Link Framework Modal */}
      <LinkFrameworkModal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        programId={program.id}
        programName={program.name}
        onLink={(frameworkId, frameworkName, requirements) => {
          console.log(`Linked ${frameworkName} to ${program.name}`);
        }}
      />

      {/* Workflow Modals */}
      <AddRequirementModal
        isOpen={showAddReqModal}
        onClose={() => setShowAddReqModal(false)}
        programId={program.id}
        programName={program.name}
        onAdd={(req) => console.log('Added requirement:', req)}
      />

      <MapControlModal
        isOpen={showMapControlModal}
        onClose={() => { setShowMapControlModal(false); setSelectedItem(null); }}
        requirementId={selectedItem?.type === 'requirement' ? selectedItem.id : undefined}
        requirementTitle={selectedItem?.type === 'requirement' ? selectedItem.name : undefined}
        onMap={(controlIds) => {
          if (selectedItem?.type === 'requirement') {
            handleMapControls(selectedItem.id, controlIds);
          }
        }}
      />

      <AddTestModal
        isOpen={showAddTestModal}
        onClose={() => { setShowAddTestModal(false); setSelectedItem(null); }}
        controlId={selectedItem?.type === 'control' ? selectedItem.id : undefined}
        controlName={selectedItem?.type === 'control' ? selectedItem.name : undefined}
        onAdd={(test) => console.log('Added test:', test)}
      />

      <UploadEvidenceModal
        isOpen={showUploadEvidenceModal}
        onClose={() => { setShowUploadEvidenceModal(false); setSelectedItem(null); }}
        controlId={selectedItem?.type === 'control' ? selectedItem.id : undefined}
        controlName={selectedItem?.type === 'control' ? selectedItem.name : undefined}
        testId={selectedItem?.type === 'test' ? selectedItem.id : undefined}
        testName={selectedItem?.type === 'test' ? selectedItem.name : undefined}
        onUpload={(files) => console.log('Uploaded evidence:', files)}
      />

      <ExecuteTestModal
        isOpen={showExecuteTestModal}
        onClose={() => { setShowExecuteTestModal(false); setSelectedItem(null); }}
        test={selectedItem?.type === 'test' ? {
          id: selectedItem.id,
          name: selectedItem.name,
          procedure: 'Review the control implementation and verify all requirements are met according to the defined criteria.',
        } : undefined}
        onExecute={(result) => console.log('Test executed:', result)}
      />

      {/* Edit Program Modal */}
      <EditProgramModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        program={{
          id: program.id,
          name: program.name,
          description: program.description,
          owner: program.owner,
          department: program.department,
          priority: program.priority,
          tags: program.tags,
          frameworks: [{
            id: program.id,
            name: program.framework,
            authority: 'CBUAE'
          }],
          requirements: programRequirements.map(r => ({
            id: r.id,
            code: r.code,
            title: r.title
          })),
          obligations: programObligations.map(o => ({
            id: o.id,
            code: o.code,
            title: o.title
          })),
          controls: programControls.map(c => ({
            id: c.id,
            code: c.code,
            name: c.name
          }))
        }}
        onSave={(updatedProgram) => {
          console.log('Updated program:', updatedProgram);
          setShowEditModal(false);
        }}
      />

      {/* Program Specifications Modals */}
      {selectedStep && (
        <ProcedureDetailModal
          isOpen={showProcedureModal}
          onClose={() => {
            setShowProcedureModal(false);
            setSelectedStep(null);
          }}
          step={selectedStep}
          workflowType={selectedWorkflowType}
        />
      )}

      {programSpecs && (
        <>
          <WorkflowConfigModal
            isOpen={showAssessmentConfigModal}
            onClose={() => setShowAssessmentConfigModal(false)}
            workflowType="assessment"
            currentConfig={{
              frequency: programSpecs.assessmentLifecycle.frequency,
              notificationDays: programSpecs.assessmentLifecycle.notificationDays,
              automationEnabled: programSpecs.assessmentLifecycle.automationEnabled,
            }}
            onSave={(config) => {
              console.log('Assessment config updated:', config);
              // In a real app, this would update the backend
            }}
          />

          <WorkflowConfigModal
            isOpen={showTestingConfigModal}
            onClose={() => setShowTestingConfigModal(false)}
            workflowType="testing"
            currentConfig={{
              frequency: programSpecs.controlTesting.frequency,
              notificationDays: programSpecs.controlTesting.notificationDays,
              automationEnabled: programSpecs.controlTesting.automationEnabled,
            }}
            onSave={(config) => {
              console.log('Testing config updated:', config);
              // In a real app, this would update the backend
            }}
          />
        </>
      )}

      {/* Summary Modals */}
      {selectedComplianceArea && (
        <ComplianceAreaModal
          isOpen={showComplianceAreaModal}
          onClose={() => {
            setShowComplianceAreaModal(false);
            setSelectedComplianceArea(null);
          }}
          area={selectedComplianceArea}
          requirements={selectedComplianceArea.requirements || []}
        />
      )}

      {selectedControl && (
        <ControlSummaryModal
          isOpen={showControlSummaryModal}
          onClose={() => {
            setShowControlSummaryModal(false);
            setSelectedControl(null);
          }}
          control={selectedControl}
        />
      )}

      {selectedObligation && (
        <ObligationSummaryModal
          isOpen={showObligationSummaryModal}
          onClose={() => {
            setShowObligationSummaryModal(false);
            setSelectedObligation(null);
          }}
          obligation={selectedObligation}
        />
      )}

      {selectedRequirement && (
        <RequirementSummaryModal
          isOpen={showRequirementSummaryModal}
          onClose={() => {
            setShowRequirementSummaryModal(false);
            setSelectedRequirement(null);
          }}
          requirement={selectedRequirement}
        />
      )}

      {/* List Modals */}
      <AllRequirementsModal
        isOpen={showAllRequirementsModal}
        onClose={() => setShowAllRequirementsModal(false)}
        programName={program.name}
        requirements={programRequirements}
        onRequirementClick={(req) => {
          setSelectedRequirement({
            id: req.id,
            code: req.code,
            title: req.title,
            description: req.description,
            category: req.category,
            section: req.section,
            status: req.status,
            complianceScore: req.complianceScore,
            controlCount: req.controlCount,
            riskRating: req.riskRating,
          });
          setShowRequirementSummaryModal(true);
        }}
      />

      <AllControlsModal
        isOpen={showAllControlsModal}
        onClose={() => setShowAllControlsModal(false)}
        programName={program.name}
        controls={programControls}
        onControlClick={(control) => {
          setSelectedControl({
            id: control.id,
            code: control.code,
            title: control.name,
            description: control.description,
            category: control.category,
            status: control.status === 'Active' ? 'Implemented' : control.status,
            effectiveness: control.effectiveness === 'Effective' ? 100 : control.effectiveness === 'Partially Effective' ? 70 : 40,
            testStatus: 'Pending',
            lastTested: control.lastTestDate,
            nextTest: control.nextTestDate,
            owner: control.owner,
            frequency: control.frequency,
            linkedRequirements: control.linkedRequirementIds?.length || 0,
            linkedTests: 0,
            evidenceCount: 0,
          });
          setShowControlSummaryModal(true);
        }}
      />

      <AllObligationsModal
        isOpen={showAllObligationsModal}
        onClose={() => setShowAllObligationsModal(false)}
        programName={program.name}
        obligations={programObligations.map(o => ({
          ...o,
          authority: (o as any).programName || program.name,
          category: (o as any).obligationType || 'General',
          complianceScore: o.status === 'Completed' ? 100 : o.status === 'In Progress' ? 50 : 0,
        }))}
        onObligationClick={(obligation) => {
          setSelectedObligation({
            id: obligation.id,
            code: obligation.code,
            title: obligation.title,
            description: obligation.description,
            authority: obligation.authority || program.name,
            category: obligation.category || 'General',
            status: obligation.status,
            complianceScore: obligation.complianceScore || 0,
            dueDate: obligation.dueDate,
            priority: obligation.riskRating || obligation.priority,
          });
          setShowObligationSummaryModal(true);
        }}
      />

      {/* Success Message Toast */}
      {showSuccessMessage && (
        <div className="fixed bottom-8 right-8 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-up z-50">
          <CheckCircle2 size={20} />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}
    </div>
  );
}

