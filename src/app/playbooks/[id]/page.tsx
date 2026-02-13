/**
 * [DEMO] Playbook Detail Page
 * 
 * Shows detailed view of a compliance playbook with all steps
 */

'use client';

import { use } from 'react';
import PageHeader from '@/components/PageHeader';
import {
  BookOpen, CheckCircle2, Clock, AlertCircle, ChevronLeft,
  Calendar, User, TrendingUp, Zap, FileText, ArrowLeft, Shield, Target, FlaskConical, ChevronDown, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { demoPlaybooks, type Playbook, type PlaybookStep } from '@/lib/demo';
import { requirements, obligations } from '@/lib/data/requirements-obligations';
import { controls } from '@/lib/data/controls';
import { controlTests } from '@/lib/data/control-tests';
import { useState } from 'react';

export default function PlaybookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const playbook = demoPlaybooks.find(p => p.id === id);

  if (!playbook) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <BookOpen size={48} className="mx-auto text-[var(--foreground-muted)] mb-4" />
          <p className="text-p1 text-[var(--foreground-muted)]">Playbook not found</p>
          <Link href="/playbooks" className="text-[var(--primary)] hover:underline mt-4 inline-block">
            ← Back to Playbooks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Back Button */}
      <Link 
        href="/playbooks"
        className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline mb-6"
      >
        <ArrowLeft size={16} />
        Back to Playbooks
      </Link>

      <PageHeader
        title={playbook.name}
        description={playbook.description}
        icon={<BookOpen className="text-[var(--primary)]" size={32} />}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-p2 text-[var(--foreground-muted)]">Progress</span>
            <TrendingUp size={20} className="text-[var(--primary)]" />
          </div>
          <div className="text-h2 font-bold text-[var(--foreground)]">{playbook.progress}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-[var(--primary)] h-2 rounded-full transition-all"
              style={{ width: `${playbook.progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-p2 text-[var(--foreground-muted)]">Total Steps</span>
            <FileText size={20} className="text-blue-600" />
          </div>
          <div className="text-h2 font-bold text-[var(--foreground)]">{playbook.totalSteps}</div>
          <p className="text-p3 text-[var(--foreground-muted)] mt-1">
            {playbook.completedSteps} completed
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-p2 text-[var(--foreground-muted)]">Duration</span>
            <Clock size={20} className="text-orange-600" />
          </div>
          <div className="text-h3 font-bold text-[var(--foreground)]">{playbook.estimatedDuration}</div>
        </div>

        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-p2 text-[var(--foreground-muted)]">Status</span>
            <Zap size={20} className="text-green-600" />
          </div>
          <div className={clsx(
            'text-h3 font-bold',
            playbook.status === 'Active' ? 'text-green-600' :
            playbook.status === 'Draft' ? 'text-yellow-600' :
            'text-gray-600'
          )}>
            {playbook.status}
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-6 mb-8">
        <h3 className="text-h3 font-semibold text-[var(--foreground)] mb-4">Playbook Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <span className="text-p3 text-[var(--foreground-muted)]">Category</span>
            <p className="text-p2 font-medium text-[var(--foreground)] mt-1">{playbook.category}</p>
          </div>
          <div>
            <span className="text-p3 text-[var(--foreground-muted)]">Framework</span>
            <p className="text-p2 font-medium text-[var(--foreground)] mt-1">{playbook.framework}</p>
          </div>
          <div>
            <span className="text-p3 text-[var(--foreground-muted)]">Owner</span>
            <p className="text-p2 font-medium text-[var(--foreground)] mt-1">{playbook.owner}</p>
          </div>
          <div>
            <span className="text-p3 text-[var(--foreground-muted)]">Created</span>
            <p className="text-p2 font-medium text-[var(--foreground)] mt-1">
              {new Date(playbook.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="text-p3 text-[var(--foreground-muted)]">Last Updated</span>
            <p className="text-p2 font-medium text-[var(--foreground)] mt-1">
              {new Date(playbook.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="text-p3 text-[var(--foreground-muted)]">Tags</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {playbook.tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="px-2 py-1 text-p3 bg-[var(--background-secondary)] text-[var(--foreground-muted)] rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-6">
        <h3 className="text-h3 font-semibold text-[var(--foreground)] mb-6">Implementation Steps</h3>
        <div className="space-y-4">
          {playbook.steps.map((step, index) => (
            <StepCard key={step.id} step={step} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StepCard({ step, index }: { step: PlaybookStep; index: number }) {
  const [showHierarchy, setShowHierarchy] = useState(false);

  const statusColors = {
    'Completed': 'bg-green-100 text-green-700 border-green-200',
    'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
    'Not Started': 'bg-gray-100 text-gray-700 border-gray-200',
    'Blocked': 'bg-red-100 text-red-700 border-red-200'
  };

  const statusIcons = {
    'Completed': <CheckCircle2 size={20} className="text-green-600" />,
    'In Progress': <Clock size={20} className="text-blue-600" />,
    'Not Started': <FileText size={20} className="text-gray-600" />,
    'Blocked': <AlertCircle size={20} className="text-red-600" />
  };

  // Resolve linked entities
  const linkedRequirements = step.linkedRequirements?.map(id =>
    requirements.find(r => r.id === id)
  ).filter(Boolean) || [];

  const linkedObligations = step.linkedRequirements?.flatMap(reqId =>
    obligations.filter(o => o.programId === requirements.find(r => r.id === reqId)?.programId)
  ) || [];

  const linkedControls = step.linkedControls?.map(id =>
    controls.find(c => c.id === id)
  ).filter(Boolean) || [];

  const linkedTests = linkedControls.flatMap(control =>
    controlTests.filter(t => t.controlId === control?.id)
  );

  const hasHierarchy = linkedRequirements.length > 0 || linkedControls.length > 0 || linkedTests.length > 0;

  return (
    <div className={clsx(
      'border rounded-lg p-4 transition-all',
      statusColors[step.status]
    )}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-[var(--foreground)]">
            {index + 1}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-p1 font-semibold text-[var(--foreground)]">{step.title}</h4>
            <div className="flex items-center gap-2">
              {statusIcons[step.status]}
              <span className="text-p3 font-medium">{step.status}</span>
            </div>
          </div>

          <p className="text-p2 text-[var(--foreground-muted)] mb-3">{step.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-p3 mb-3">
            <div>
              <span className="text-[var(--foreground-muted)]">Owner:</span>
              <p className="font-medium text-[var(--foreground)]">{step.owner}</p>
            </div>
            {step.dueDate && (
              <div>
                <span className="text-[var(--foreground-muted)]">Due Date:</span>
                <p className="font-medium text-[var(--foreground)]">
                  {new Date(step.dueDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {step.automationLevel && (
              <div>
                <span className="text-[var(--foreground-muted)]">Automation:</span>
                <p className="font-medium text-[var(--foreground)]">{step.automationLevel}</p>
              </div>
            )}
            {step.estimatedHours && (
              <div>
                <span className="text-[var(--foreground-muted)]">Est. Hours:</span>
                <p className="font-medium text-[var(--foreground)]">{step.estimatedHours}h</p>
              </div>
            )}
          </div>

          {/* Compliance Hierarchy Toggle */}
          {hasHierarchy && (
            <div className="mt-4 border-t border-white/50 pt-3">
              <button
                onClick={() => setShowHierarchy(!showHierarchy)}
                className="flex items-center gap-2 text-p2 font-medium text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
              >
                {showHierarchy ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <span>Compliance Hierarchy ({linkedRequirements.length} Requirements, {linkedControls.length} Controls, {linkedTests.length} Tests)</span>
              </button>

              {showHierarchy && (
                <div className="mt-4 space-y-4 bg-white/50 rounded-lg p-4">
                  {/* Requirements */}
                  {linkedRequirements.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Target size={16} className="text-blue-600" />
                        <h5 className="text-p2 font-semibold text-[var(--foreground)]">Requirements</h5>
                      </div>
                      <div className="space-y-2 ml-6">
                        {linkedRequirements.map(req => (
                          <Link
                            key={req?.id}
                            href={`/requirements/${req?.id}`}
                            className="block p-3 bg-white rounded border border-blue-200 hover:border-blue-400 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-p3 font-mono text-blue-600">{req?.code}</p>
                                <p className="text-p2 font-medium text-[var(--foreground)] mt-1">{req?.title}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Controls */}
                  {linkedControls.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Shield size={16} className="text-green-600" />
                        <h5 className="text-p2 font-semibold text-[var(--foreground)]">Controls</h5>
                      </div>
                      <div className="space-y-2 ml-6">
                        {linkedControls.map(control => {
                          const controlTestsForControl = controlTests.filter(t => t.controlId === control?.id);
                          return (
                            <div key={control?.id} className="bg-white rounded border border-green-200">
                              <Link
                                href={`/controls/${control?.id}`}
                                className="block p-3 hover:bg-green-50 transition-colors"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className="text-p3 font-mono text-green-600">{control?.code}</p>
                                    <p className="text-p2 font-medium text-[var(--foreground)] mt-1">{control?.name}</p>
                                  </div>
                                </div>
                              </Link>

                              {/* Tests for this control */}
                              {controlTestsForControl.length > 0 && (
                                <div className="border-t border-green-100 p-3 bg-green-50/50">
                                  <div className="flex items-center gap-2 mb-2">
                                    <FlaskConical size={14} className="text-purple-600" />
                                    <h6 className="text-p3 font-semibold text-[var(--foreground)]">Tests ({controlTestsForControl.length})</h6>
                                  </div>
                                  <div className="space-y-1 ml-5">
                                    {controlTestsForControl.map(test => (
                                      <div key={test.id} className="text-p3 text-[var(--foreground-muted)]">
                                        <span className="font-mono text-purple-600">{test.code}</span> - {test.name}
                                        <span className={clsx(
                                          'ml-2 px-2 py-0.5 rounded text-p4',
                                          test.status === 'Passed' ? 'bg-green-100 text-green-700' :
                                          test.status === 'Failed' ? 'bg-red-100 text-red-700' :
                                          'bg-gray-100 text-gray-700'
                                        )}>
                                          {test.status}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

