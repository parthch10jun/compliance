'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { requirements } from '@/lib/data/requirements-obligations';
import { controls } from '@/lib/data/mock-data';
import { risks, riskRequirementLinks } from '@/lib/data/risks';
import { requirementAssessments } from '@/lib/data/requirement-assessments';
import { controlTests } from '@/lib/data/control-tests';
import { PageHeader, MapControlModal, RequirementThreePaneView, AIControlMappingAssistant } from '@/components';
import { ControlSummaryModal } from '@/components/ControlSummaryModal';
import { LinkedControlsModal } from '@/components/LinkedControlsModal';
import { Shield, CheckCircle2, AlertTriangle, XCircle, Building2, User, ArrowLeft, ExternalLink, FileText, Target, Plus, LayoutGrid, Columns3, ClipboardCheck, Calendar, TrendingUp, AlertCircle, Clock, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { formatDateShort } from '@/lib/utils';

type ViewMode = 'standard' | 'three-pane';
type MiddlePaneTab = 'controls' | 'assessments' | 'risks';
type RightPaneContent =
  | { type: 'control'; data: any }
  | { type: 'assessment'; data: any }
  | { type: 'risk'; data: any }
  | null;

export default function RequirementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requirementId = params.id as string;

  const [viewMode, setViewMode] = useState<ViewMode>('standard');
  const [showMapControlModal, setShowMapControlModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showControlSummaryModal, setShowControlSummaryModal] = useState(false);
  const [showAllControlsModal, setShowAllControlsModal] = useState(false);
  const [selectedControl, setSelectedControl] = useState<any>(null);
  const [controlMappings, setControlMappings] = useState<Record<string, string[]>>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Three-pane view state
  const [selectedRequirementId, setSelectedRequirementId] = useState<string>(requirementId);
  const [middlePaneTab, setMiddlePaneTab] = useState<MiddlePaneTab>('controls');
  const [rightPaneContent, setRightPaneContent] = useState<RightPaneContent>(null);

  const requirement = requirements.find(r => r.id === requirementId);
  const selectedRequirement = requirements.find(r => r.id === selectedRequirementId);

  // Load mappings from localStorage
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

  // Update selected requirement when route changes
  useEffect(() => {
    setSelectedRequirementId(requirementId);
    setRightPaneContent(null);
  }, [requirementId]);

  // Calculate actual control count and get linked controls
  const baseLinkedControls = requirement
    ? controls.filter(c => c.linkedRequirementIds?.includes(requirement.id))
    : [];

  // Add mapped controls
  const mappedControlIds = controlMappings[requirementId] || [];
  const mappedControls = controls.filter(c => mappedControlIds.includes(c.id));
  const linkedControls = [...baseLinkedControls, ...mappedControls];
  const linkedControlsCount = linkedControls.length;

  // Get linked risks
  const linkedRiskIds = requirement
    ? riskRequirementLinks
        .filter(link => link.requirementId === requirement.id)
        .map(link => link.riskId)
    : [];

  const linkedRisks = risks.filter(r => linkedRiskIds.includes(r.id));

  // Get risk links with relationship types
  const riskLinks = requirement
    ? riskRequirementLinks.filter(link => link.requirementId === requirement.id)
    : [];

  // Three-pane view data
  const programRequirements = requirements.filter(r => r.programId === requirement?.programId);
  const selectedLinkedControls = selectedRequirement
    ? controls.filter(c => c.linkedRequirementIds?.includes(selectedRequirementId) || (controlMappings[selectedRequirementId] || []).includes(c.id))
    : [];
  const selectedLinkedAssessments = selectedRequirement
    ? requirementAssessments.filter(a => a.requirementId === selectedRequirementId)
    : [];
  const selectedLinkedRiskIds = selectedRequirement
    ? riskRequirementLinks.filter(link => link.requirementId === selectedRequirementId).map(link => link.riskId)
    : [];
  const selectedLinkedRisks = risks.filter(r => selectedLinkedRiskIds.includes(r.id));

  if (!requirement) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Requirement Not Found"
          description="The requested requirement could not be found."
        />
        <div className="bg-white rounded-xl border border-[var(--border)] p-8 text-center">
          <p className="text-[var(--foreground-muted)] mb-4">Requirement ID: {requirementId}</p>
          <button
            onClick={() => router.push('/requirements')}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)]"
          >
            Back to Requirements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
      >
        <ArrowLeft size={16} />
        <span className="text-p2">Back</span>
      </button>

      {/* Page Header with View Toggle */}
      <div className="flex items-start justify-between gap-4" data-tour="requirement-detail-header">
        <PageHeader
          title={requirement.title}
          description={requirement.description}
        />
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg border border-gray-200">
          <button
            onClick={() => setViewMode('standard')}
            className={clsx(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all',
              viewMode === 'standard'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            <LayoutGrid size={16} />
            Standard
          </button>
          <button
            onClick={() => setViewMode('three-pane')}
            className={clsx(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all',
              viewMode === 'three-pane'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            <Columns3 size={16} />
            Three-Pane
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className={clsx('p-4 rounded-xl border-l-4 flex items-center justify-between',
        requirement.status === 'Compliant' && 'bg-emerald-50 border-emerald-500',
        requirement.status === 'Partially Compliant' && 'bg-amber-50 border-amber-500',
        requirement.status === 'Non-Compliant' && 'bg-red-50 border-red-500',
        requirement.status === 'Not Assessed' && 'bg-gray-50 border-gray-500'
      )}>
        <div className="flex items-center gap-3">
          {requirement.status === 'Compliant' && <CheckCircle2 className="text-emerald-600" size={24} />}
          {requirement.status === 'Non-Compliant' && <XCircle className="text-red-600" size={24} />}
          {requirement.status === 'Partially Compliant' && <AlertTriangle className="text-amber-600" size={24} />}
          {requirement.status === 'Not Assessed' && <Shield className="text-gray-600" size={24} />}
          <div>
            <p className="text-p2 font-semibold text-[var(--foreground)]">Status: {requirement.status}</p>
            <p className="text-p3 text-[var(--foreground-muted)]">Compliance Score: {requirement.complianceScore}%</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-p3 text-[var(--foreground-muted)]">Risk Rating</p>
          <span className={clsx('inline-flex px-3 py-1 rounded-full text-p2 font-medium',
            requirement.riskRating === 'Critical' && 'bg-red-100 text-red-700',
            requirement.riskRating === 'High' && 'bg-orange-100 text-orange-700',
            requirement.riskRating === 'Medium' && 'bg-amber-100 text-amber-700',
            requirement.riskRating === 'Low' && 'bg-emerald-100 text-emerald-700'
          )}>
            {requirement.riskRating}
          </span>
        </div>
      </div>

      {/* Conditional View Rendering */}
      {viewMode === 'standard' ? (
        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
          {/* Details Card */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <h2 className="text-h3 font-bold text-[var(--foreground)] mb-4">Requirement Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-p3 text-[var(--foreground-muted)] mb-1">Code</p>
                <p className="text-p2 font-medium text-[var(--foreground)]">{requirement.code}</p>
              </div>
              <div>
                <p className="text-p3 text-[var(--foreground-muted)] mb-1">Section</p>
                <p className="text-p2 font-medium text-[var(--foreground)]">{requirement.section}</p>
              </div>
              <div>
                <p className="text-p3 text-[var(--foreground-muted)] mb-1">Category</p>
                <p className="text-p2 font-medium text-[var(--foreground)]">{requirement.category}</p>
              </div>
              <div>
                <p className="text-p3 text-[var(--foreground-muted)] mb-1">Controls</p>
                <p className="text-p2 font-medium text-[var(--foreground)]">{requirement.controlCount} linked</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <h2 className="text-h3 font-bold text-[var(--foreground)] mb-4">Description</h2>
            <p className="text-p2 text-[var(--foreground)] leading-relaxed">{requirement.description}</p>
          </div>

          {/* Linked Controls */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-h3 font-bold text-[var(--foreground)]">Linked Controls</h2>
                <p className="text-p3 text-[var(--foreground-muted)] mt-1">
                  {linkedControlsCount} control{linkedControlsCount !== 1 ? 's' : ''} linked to this requirement
                </p>
              </div>
              <div className="flex items-center gap-2">
                {linkedControlsCount > 10 && (
                  <button
                    onClick={() => setShowAllControlsModal(true)}
                    className="px-3 py-1.5 text-cyan-600 hover:bg-cyan-50 rounded-lg font-medium flex items-center gap-1 transition-colors text-p2"
                  >
                    View All ({linkedControlsCount})
                  </button>
                )}
                <button
                  onClick={() => setShowAIAssistant(true)}
                  className="px-3 py-1.5 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg font-medium flex items-center gap-1 transition-colors text-p2"
                >
                  <Sparkles size={14} />
                  AI Assistant
                </button>
                <button
                  onClick={() => setShowMapControlModal(true)}
                  className="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg font-medium flex items-center gap-1 transition-colors text-p2"
                  data-tour="map-control-button"
                >
                  <Plus size={14} />
                  Link Control
                </button>
              </div>
            </div>

            {linkedControlsCount > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {linkedControls.slice(0, 10).map((control) => (
                  <button
                    key={control.id}
                    onClick={() => {
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
                    className="w-full text-left p-4 border border-[var(--border)] rounded-lg hover:border-emerald-500/30 hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Shield size={16} className="text-emerald-600" />
                        <span className="text-p3 font-mono text-[var(--foreground-muted)]">{control.code}</span>
                      </div>
                      <span className={clsx('px-2 py-0.5 text-xs rounded-full font-medium',
                        control.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                        control.status === 'Draft' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      )}>
                        {control.status}
                      </span>
                    </div>
                    <p className="text-p2 font-medium text-[var(--foreground)] group-hover:text-emerald-600 transition-colors mb-2">
                      {control.name}
                    </p>
                    <p className="text-p3 text-[var(--foreground-muted)] line-clamp-2 mb-2">
                      {control.description}
                    </p>
                    <div className="flex items-center gap-4 text-p3 text-[var(--foreground-muted)]">
                      <span>{control.category}</span>
                      <span>•</span>
                      <span className={clsx('font-medium',
                        control.effectiveness === 'Effective' ? 'text-emerald-600' :
                        control.effectiveness === 'Partially Effective' ? 'text-amber-600' :
                        'text-red-600'
                      )}>
                        {control.effectiveness}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-[var(--border)] rounded-lg">
                <Shield size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-p2 text-[var(--foreground-muted)] mb-2">No controls linked yet</p>
                <p className="text-p3 text-[var(--foreground-muted)]">Click "Link Control" to add controls to this requirement</p>
              </div>
            )}
          </div>

          {/* Risk Mapping */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <Target className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-h3 font-bold text-[var(--foreground)]">Risk Mapping</h2>
                  <p className="text-p3 text-[var(--foreground-muted)]">
                    {linkedRisks.length} risk{linkedRisks.length !== 1 ? 's' : ''} linked to this requirement
                  </p>
                </div>
              </div>
              <button className="px-3 py-1.5 border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-colors text-p2 font-medium">
                Link Risk
              </button>
            </div>

            {linkedRisks.length > 0 ? (
              <div className="space-y-3">
                {linkedRisks.map((risk) => {
                  const riskLink = riskLinks.find(link => link.riskId === risk.id);
                  const getRiskColor = (rating: string) => {
                    switch (rating) {
                      case 'Critical': return 'border-red-300 bg-red-50';
                      case 'High': return 'border-orange-300 bg-orange-50';
                      case 'Medium': return 'border-amber-300 bg-amber-50';
                      default: return 'border-emerald-300 bg-emerald-50';
                    }
                  };

                  return (
                    <Link
                      key={risk.id}
                      href={`/dashboard/risk-register?risk=${risk.id}`}
                      className={clsx(
                        'block p-4 rounded-lg border-l-4 hover:shadow-md transition-all',
                        getRiskColor(risk.residualRating)
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-p2 font-semibold text-[var(--foreground)]">
                              {risk.code}
                            </span>
                            <span className={clsx(
                              'px-2 py-0.5 rounded-full text-p3 font-medium',
                              risk.residualRating === 'Critical' && 'bg-red-100 text-red-700',
                              risk.residualRating === 'High' && 'bg-orange-100 text-orange-700',
                              risk.residualRating === 'Medium' && 'bg-amber-100 text-amber-700',
                              risk.residualRating === 'Low' && 'bg-emerald-100 text-emerald-700'
                            )}>
                              {risk.residualRating}
                            </span>
                            {riskLink && (
                              <span className="px-2 py-0.5 rounded-full text-p3 font-medium bg-blue-100 text-blue-700">
                                {riskLink.relationshipType}
                              </span>
                            )}
                          </div>
                          <p className="text-p2 text-[var(--foreground)] mb-2">{risk.title}</p>
                          <p className="text-p3 text-[var(--foreground-muted)] line-clamp-2">
                            {risk.riskStatement}
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-p3">
                            <div>
                              <span className="text-[var(--foreground-muted)]">Inherent: </span>
                              <span className="font-semibold text-red-600">{risk.inherentScore}</span>
                            </div>
                            <div>
                              <span className="text-[var(--foreground-muted)]">Residual: </span>
                              <span className="font-semibold text-amber-600">{risk.residualScore}</span>
                            </div>
                            <div>
                              <span className="text-[var(--foreground-muted)]">Reduction: </span>
                              <span className="font-semibold text-emerald-600">{risk.riskReduction}%</span>
                            </div>
                          </div>
                        </div>
                        <ExternalLink size={16} className="text-[var(--foreground-muted)] flex-shrink-0 ml-3" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-[var(--background-secondary)] rounded-lg">
                <Target size={48} className="mx-auto text-[var(--foreground-muted)] opacity-30 mb-3" />
                <p className="text-p2 text-[var(--foreground-muted)] mb-2">No risks linked yet</p>
                <p className="text-p3 text-[var(--foreground-muted)]">
                  Link risks to understand what this requirement addresses
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Program Info */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6" data-tour="requirement-program-link">
            <h3 className="text-h4 font-bold text-[var(--foreground)] mb-4">Program</h3>
            <Link
              href={`/programs/${requirement.programId}`}
              className="flex items-center gap-2 text-[var(--primary)] hover:underline mb-2"
            >
              <Building2 size={16} />
              <span className="text-p2 font-medium">{requirement.programName}</span>
              <ExternalLink size={14} />
            </Link>
            <div className="flex flex-wrap gap-2 mt-3">
              {requirement.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-[var(--background-secondary)] text-[var(--foreground-muted)] rounded text-p3">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Owner Info */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <h3 className="text-h4 font-bold text-[var(--foreground)] mb-4">Ownership</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User size={16} className="text-[var(--foreground-muted)]" />
                <div>
                  <p className="text-p3 text-[var(--foreground-muted)]">Owner</p>
                  <p className="text-p2 font-medium text-[var(--foreground)]">{requirement.owner}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-[var(--foreground-muted)]" />
                <div>
                  <p className="text-p3 text-[var(--foreground-muted)]">Department</p>
                  <p className="text-p2 font-medium text-[var(--foreground)]">{requirement.department}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Review Dates */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <h3 className="text-h4 font-bold text-[var(--foreground)] mb-4">Review Schedule</h3>
            <div className="space-y-3">
              {requirement.lastReviewDate && (
                <div>
                  <p className="text-p3 text-[var(--foreground-muted)] mb-1">Last Review</p>
                  <p className="text-p2 text-[var(--foreground)]">{formatDateShort(requirement.lastReviewDate)}</p>
                </div>
              )}
              {requirement.nextReviewDate && (
                <div>
                  <p className="text-p3 text-[var(--foreground-muted)] mb-1">Next Review</p>
                  <p className="text-p2 text-[var(--foreground)]">{formatDateShort(requirement.nextReviewDate)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <h3 className="text-h4 font-bold text-[var(--foreground)] mb-4">Timeline</h3>
            <div className="space-y-3">
              <div>
                <p className="text-p3 text-[var(--foreground-muted)] mb-1">Created</p>
                <p className="text-p2 text-[var(--foreground)]">{formatDateShort(requirement.createdAt)}</p>
              </div>
              <div>
                <p className="text-p3 text-[var(--foreground-muted)] mb-1">Last Updated</p>
                <p className="text-p2 text-[var(--foreground)]">{formatDateShort(requirement.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      ) : (
        // Two-Pane View: Associated Entities
        <RequirementThreePaneView
          requirement={requirement}
          linkedControls={selectedLinkedControls}
          linkedAssessments={selectedLinkedAssessments}
          linkedRisks={selectedLinkedRisks}
          controlTests={controlTests}
        />
      )}

      {/* Map Control Modal */}
      <MapControlModal
        isOpen={showMapControlModal}
        onClose={() => setShowMapControlModal(false)}
        requirementId={requirement.id}
        requirementTitle={requirement.title}
        onMap={(controlIds) => {
          const newMappings = {
            ...controlMappings,
            [requirementId]: [...(controlMappings[requirementId] || []), ...controlIds.filter(id => !controlMappings[requirementId]?.includes(id))]
          };
          setControlMappings(newMappings);
          localStorage.setItem('control-requirement-mappings', JSON.stringify(newMappings));
          setShowMapControlModal(false);
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 3000);
        }}
      />

      {/* Control Summary Modal */}
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

      {/* All Linked Controls Modal */}
      <LinkedControlsModal
        isOpen={showAllControlsModal}
        onClose={() => setShowAllControlsModal(false)}
        requirementTitle={requirement.title}
        controls={linkedControls}
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

      {/* AI Mapping Assistant */}
      <AIControlMappingAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        requirementId={requirement.id}
        onApplyMapping={(mapping) => {
          if ('controlIds' in mapping) {
            const newMappings = {
              ...controlMappings,
              [requirementId]: [...(controlMappings[requirementId] || []), ...mapping.controlIds.filter(id => !controlMappings[requirementId]?.includes(id))]
            };
            setControlMappings(newMappings);
            localStorage.setItem('control-requirement-mappings', JSON.stringify(newMappings));
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
          }
          setShowAIAssistant(false);
        }}
      />

      {/* Success Message Toast */}
      {showSuccessMessage && (
        <div className="fixed bottom-8 right-8 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-up z-50">
          <CheckCircle2 size={20} />
          <span className="font-medium">Controls mapped successfully!</span>
        </div>
      )}
    </div>
  );
}


