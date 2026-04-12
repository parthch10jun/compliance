'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Plus, LayoutGrid, List,
  Shield, CheckCircle2, XCircle, Clock, AlertTriangle, AlertCircle,
  Zap, Eye, Wrench, Calendar, MoreHorizontal, TrendingUp, Settings, ChevronRight, FlaskConical, Upload, X, ArrowLeft,
  Building2, FileText, Target, Sparkles
} from 'lucide-react';
import { controls, programs } from '@/lib/data/mock-data';
import { requirements } from '@/lib/data/requirements-obligations';
import { controlTests } from '@/lib/data/control-tests';
import { PageHeader, SearchFilterBar, FilterButtonGroup, AddTestModal, UploadEvidenceModal, ExecuteTestModal, CreateControlModal, EditControlModal, AIControlMappingAssistant } from '@/components';
import { formatDateShort } from '@/lib/utils';
import Link from 'next/link';
import clsx from 'clsx';

type EffectivenessFilter = 'all' | 'Effective' | 'Partially Effective' | 'Ineffective' | 'Not Tested';
type TypeFilter = 'all' | 'Preventive' | 'Detective' | 'Corrective';

function ControlsDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const requirementId = searchParams.get('requirement');
  const programId = searchParams.get('program');
  const selectedRequirement = requirementId ? requirements.find(r => r.id === requirementId) : null;
  const selectedProgram = programId ? programs.find(p => p.id === programId) : null;

  const [effectivenessFilter, setEffectivenessFilter] = useState<EffectivenessFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddTestModal, setShowAddTestModal] = useState(false);
  const [showUploadEvidenceModal, setShowUploadEvidenceModal] = useState(false);
  const [showExecuteTestModal, setShowExecuteTestModal] = useState(false);
  const [showCreateControlModal, setShowCreateControlModal] = useState(false);
  const [showEditControlModal, setShowEditControlModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [selectedControl, setSelectedControl] = useState<typeof controls[0] | null>(null);

  const filteredControls = controls.filter(ctl => {
    const matchesEffectiveness = effectivenessFilter === 'all' || ctl.effectiveness === effectivenessFilter;
    const matchesType = typeFilter === 'all' || ctl.type === typeFilter;
    const matchesSearch = ctl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ctl.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRequirement = !requirementId || ctl.linkedRequirementIds?.includes(requirementId);
    const matchesProgram = !programId || ctl.linkedProgramIds?.includes(programId);
    return matchesEffectiveness && matchesType && matchesSearch && matchesRequirement && matchesProgram;
  });

  // Calculate stats based on filtered controls
  const effectivenessStats = {
    effective: filteredControls.filter(c => c.effectiveness === 'Effective').length,
    partial: filteredControls.filter(c => c.effectiveness === 'Partially Effective').length,
    ineffective: filteredControls.filter(c => c.effectiveness === 'Ineffective').length,
    notTested: filteredControls.filter(c => c.effectiveness === 'Not Tested').length,
  };

  const typeStats = {
    preventive: filteredControls.filter(c => c.type === 'Preventive').length,
    detective: filteredControls.filter(c => c.type === 'Detective').length,
    corrective: filteredControls.filter(c => c.type === 'Corrective').length,
  };

  const automationStats = {
    manual: filteredControls.filter(c => c.automationLevel === 'Manual').length,
    semiAuto: filteredControls.filter(c => c.automationLevel === 'Semi-Automated').length,
    fullyAuto: filteredControls.filter(c => c.automationLevel === 'Fully Automated').length,
  };

  const totalTests = filteredControls.reduce((acc, c) => acc + c.testCount, 0);
  const passedTests = filteredControls.reduce((acc, c) => acc + c.testsPassed, 0);
  const testPassRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  // Calculate insights
  const insights = useMemo(() => {
    // Department distribution
    const deptMap = new Map<string, number>();
    filteredControls.forEach(c => {
      deptMap.set(c.department, (deptMap.get(c.department) || 0) + 1);
    });

    // Program/Regulation distribution
    const programMap = new Map<string, number>();
    filteredControls.forEach(c => {
      c.linkedProgramIds.forEach(pid => {
        const program = programs.find(p => p.id === pid);
        if (program) {
          programMap.set(program.name, (programMap.get(program.name) || 0) + 1);
        }
      });
    });

    // Orphan controls (not linked to any requirements)
    const orphanControls = filteredControls.filter(c =>
      c.linkedRequirementIds.length === 0 && c.linkedObligationIds.length === 0
    );

    // Test issues
    const controlIds = filteredControls.map(c => c.id);
    const relevantTests = controlTests.filter(t => controlIds.includes(t.controlId));
    const openIssues = relevantTests.filter(t => t.status === 'Failed' || (t.status === 'In Progress' && t.findings));
    const closedIssues = relevantTests.filter(t => t.status === 'Passed' && t.result === 'Pass');

    return {
      departmentDistribution: Array.from(deptMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      programDistribution: Array.from(programMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10), // Top 10
      orphanControls,
      openIssues,
      closedIssues,
      totalTests: relevantTests.length,
    };
  }, [filteredControls]);

  return (
    <div>
      {/* Header */}
      <PageHeader
        data-tour="controls-header"
        title="Controls Dashboard"
        description="Monitor control effectiveness and testing coverage"
        action={
          <button
            onClick={() => setShowCreateControlModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-dark)] transition-all duration-200 text-p2 font-medium shadow-sm hover:shadow-md"
          >
            <Plus size={18} />
            New Control
          </button>
        }
      />

      {/* Filter Banner */}
      {(selectedRequirement || selectedProgram) && (
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-4 flex items-center justify-between mb-6">
          <div>
            {selectedRequirement && (
              <>
                <p className="text-p3 text-cyan-700 font-medium">Filtered by Requirement</p>
                <p className="text-p1 font-semibold text-cyan-900 mt-1">{selectedRequirement.title}</p>
                <p className="text-p3 text-cyan-600 mt-0.5">{selectedRequirement.code}</p>
              </>
            )}
            {!selectedRequirement && selectedProgram && (
              <>
                <p className="text-p3 text-cyan-700 font-medium">Filtered by Program</p>
                <p className="text-p1 font-semibold text-cyan-900 mt-1">{selectedProgram.name}</p>
                <p className="text-p3 text-cyan-600 mt-0.5">{selectedProgram.description}</p>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-p3 font-medium"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <Link
              href="/controls"
              className="flex items-center gap-2 px-3 py-2 bg-white text-cyan-700 rounded-lg hover:bg-cyan-50 transition-colors text-p3 font-medium border border-cyan-200"
            >
              <X size={16} />
              Clear Filter
            </Link>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="animate-fade-in-up delay-1 grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-xl p-5 text-white shadow-md">
          <p className="text-white/70 text-p3 font-medium mb-1">Total Controls</p>
          <p className="text-h2 font-bold tracking-tight">{filteredControls.length}</p>
          <p className="text-p3 text-white/60 mt-2">{filteredControls.length === controls.length ? `All controls` : 'Filtered'}</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-p3 font-medium">Effective</p>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <p className="text-h2 font-bold tracking-tight text-emerald-600">{effectivenessStats.effective}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">{filteredControls.length > 0 ? Math.round((effectivenessStats.effective / filteredControls.length) * 100) : 0}% rate</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-p3 font-medium">Orphan Controls</p>
            <AlertTriangle size={16} className="text-amber-500" />
          </div>
          <p className="text-h2 font-bold tracking-tight text-amber-600">{insights.orphanControls.length}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">Not linked</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-p3 font-medium">Open Issues</p>
            <XCircle size={16} className="text-red-500" />
          </div>
          <p className="text-h2 font-bold tracking-tight text-red-600">{insights.openIssues.length}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">From tests</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-p3 font-medium">Closed Issues</p>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <p className="text-h2 font-bold tracking-tight text-emerald-600">{insights.closedIssues.length}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">Resolved</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-p3 font-medium">Test Pass Rate</p>
            <TrendingUp size={16} className="text-[var(--primary)]" />
          </div>
          <p className="text-h2 font-bold tracking-tight text-[var(--primary)]">{testPassRate}%</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">{passedTests} of {totalTests}</p>
        </div>
      </div>

      {/* Distribution Charts - Control Characteristics */}
      <div className="animate-fade-in-up delay-2 grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Control Type Distribution */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-6 hover:shadow-md transition-shadow">
          <h3 className="text-h4 text-[var(--foreground)] mb-4 font-semibold">Control Types</h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-blue-500" />
                  <span className="text-p2 text-[var(--foreground)]">Preventive</span>
                </div>
                <span className="text-p2 font-semibold text-[var(--foreground)]">{typeStats.preventive}</span>
              </div>
              <div className="w-full h-2 bg-[var(--background-secondary)] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${filteredControls.length > 0 ? (typeStats.preventive / filteredControls.length) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Eye size={14} className="text-purple-500" />
                  <span className="text-p2 text-[var(--foreground)]">Detective</span>
                </div>
                <span className="text-p2 font-semibold text-[var(--foreground)]">{typeStats.detective}</span>
              </div>
              <div className="w-full h-2 bg-[var(--background-secondary)] rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${filteredControls.length > 0 ? (typeStats.detective / filteredControls.length) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Wrench size={14} className="text-orange-500" />
                  <span className="text-p2 text-[var(--foreground)]">Corrective</span>
                </div>
                <span className="text-p2 font-semibold text-[var(--foreground)]">{typeStats.corrective}</span>
              </div>
              <div className="w-full h-2 bg-[var(--background-secondary)] rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${filteredControls.length > 0 ? (typeStats.corrective / filteredControls.length) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Automation Level */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-6 hover:shadow-md transition-shadow">
          <h3 className="text-h4 text-[var(--foreground)] mb-4 font-semibold">Automation Level</h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-emerald-500" />
                  <span className="text-p2 text-[var(--foreground)]">Fully Automated</span>
                </div>
                <span className="text-p2 font-semibold text-[var(--foreground)]">{automationStats.fullyAuto}</span>
              </div>
              <div className="w-full h-2 bg-[var(--background-secondary)] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${filteredControls.length > 0 ? (automationStats.fullyAuto / filteredControls.length) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Settings size={14} className="text-[var(--primary)]" />
                  <span className="text-p2 text-[var(--foreground)]">Semi-Automated</span>
                </div>
                <span className="text-p2 font-semibold text-[var(--foreground)]">{automationStats.semiAuto}</span>
              </div>
              <div className="w-full h-2 bg-[var(--background-secondary)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--primary)] rounded-full transition-all duration-500" style={{ width: `${filteredControls.length > 0 ? (automationStats.semiAuto / filteredControls.length) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-500" />
                  <span className="text-p2 text-[var(--foreground)]">Manual</span>
                </div>
                <span className="text-p2 font-semibold text-[var(--foreground)]">{automationStats.manual}</span>
              </div>
              <div className="w-full h-2 bg-[var(--background-secondary)] rounded-full overflow-hidden">
                <div className="h-full bg-gray-500 rounded-full transition-all duration-500" style={{ width: `${filteredControls.length > 0 ? (automationStats.manual / filteredControls.length) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Effectiveness Distribution */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-6 hover:shadow-md transition-shadow">
          <h3 className="text-h4 text-[var(--foreground)] mb-4 font-semibold">Effectiveness</h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="text-p2 text-[var(--foreground)]">Effective</span>
                </div>
                <span className="text-p2 font-semibold text-[var(--foreground)]">{effectivenessStats.effective}</span>
              </div>
              <div className="w-full h-2 bg-[var(--background-secondary)] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${filteredControls.length > 0 ? (effectivenessStats.effective / filteredControls.length) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-amber-500" />
                  <span className="text-p2 text-[var(--foreground)]">Partially Effective</span>
                </div>
                <span className="text-p2 font-semibold text-[var(--foreground)]">{effectivenessStats.partial}</span>
              </div>
              <div className="w-full h-2 bg-[var(--background-secondary)] rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${filteredControls.length > 0 ? (effectivenessStats.partial / filteredControls.length) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <XCircle size={14} className="text-red-500" />
                  <span className="text-p2 text-[var(--foreground)]">Ineffective</span>
                </div>
                <span className="text-p2 font-semibold text-[var(--foreground)]">{effectivenessStats.ineffective}</span>
              </div>
              <div className="w-full h-2 bg-[var(--background-secondary)] rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: `${filteredControls.length > 0 ? (effectivenessStats.ineffective / filteredControls.length) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Charts - Organizational View */}
      <div className="animate-fade-in-up delay-2 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Department Distribution */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Building2 className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-h4 font-bold text-[var(--foreground)]">Department Distribution</h3>
              <p className="text-p3 text-[var(--foreground-muted)]">Controls by department</p>
            </div>
          </div>
          <div className="space-y-3">
            {insights.departmentDistribution.slice(0, 8).map((dept) => {
              const percentage = filteredControls.length > 0 ? (dept.count / filteredControls.length) * 100 : 0;
              return (
                <div key={dept.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-p2 text-[var(--foreground)]">{dept.name}</span>
                    <span className="text-p2 font-semibold text-[var(--foreground)]">{dept.count}</span>
                  </div>
                  <div className="h-2 bg-[var(--background-secondary)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Program/Regulation Distribution */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <FileText className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-h4 font-bold text-[var(--foreground)]">Program Distribution</h3>
              <p className="text-p3 text-[var(--foreground-muted)]">Top 10 programs by control count</p>
            </div>
          </div>
          <div className="space-y-3">
            {insights.programDistribution.map((prog) => {
              const maxCount = insights.programDistribution[0]?.count || 1;
              const percentage = (prog.count / maxCount) * 100;
              return (
                <div key={prog.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-p2 text-[var(--foreground)] truncate">{prog.name}</span>
                    <span className="text-p2 font-semibold text-[var(--foreground)]">{prog.count}</span>
                  </div>
                  <div className="h-2 bg-[var(--background-secondary)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Orphan Controls Section */}
      {insights.orphanControls.length > 0 && (
        <div className="bg-white rounded-xl border border-[var(--border)] p-6 mb-8 animate-fade-in-up delay-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <AlertTriangle className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-h4 font-bold text-[var(--foreground)]">Orphan Controls</h3>
                <p className="text-p3 text-[var(--foreground-muted)]">
                  {insights.orphanControls.length} control{insights.orphanControls.length !== 1 ? 's' : ''} not linked to requirements or obligations
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {insights.orphanControls.slice(0, 6).map((control) => (
              <div
                key={control.id}
                className="p-4 rounded-lg border border-amber-200 bg-amber-50 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-p2 font-semibold text-[var(--foreground)]">{control.code}</span>
                      <span className={clsx(
                        'px-2 py-0.5 rounded-full text-p3 font-medium',
                        control.type === 'Preventive' && 'bg-blue-100 text-blue-700',
                        control.type === 'Detective' && 'bg-purple-100 text-purple-700',
                        control.type === 'Corrective' && 'bg-orange-100 text-orange-700'
                      )}>
                        {control.type}
                      </span>
                    </div>
                    <p className="text-p2 text-[var(--foreground)] mb-1 line-clamp-2">{control.name}</p>
                    <p className="text-p3 text-[var(--foreground-muted)]">{control.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 text-p3">
                  <Building2 size={14} className="text-[var(--foreground-muted)]" />
                  <span className="text-[var(--foreground-muted)]">{control.department}</span>
                </div>
              </div>
            ))}
          </div>
          {insights.orphanControls.length > 6 && (
            <p className="text-p3 text-[var(--foreground-muted)] text-center mt-4">
              And {insights.orphanControls.length - 6} more orphan control{insights.orphanControls.length - 6 !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}

      {/* Testing Issues Section */}
      {(insights.openIssues.length > 0 || insights.closedIssues.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in-up delay-4">
          {/* Open Issues */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                <XCircle className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-h4 font-bold text-[var(--foreground)]">Open Issues</h3>
                <p className="text-p3 text-[var(--foreground-muted)]">
                  {insights.openIssues.length} issue{insights.openIssues.length !== 1 ? 's' : ''} from control testing
                </p>
              </div>
            </div>
            {insights.openIssues.length > 0 ? (
              <div className="space-y-3">
                {insights.openIssues.slice(0, 3).map((test) => {
                  const control = controls.find(c => c.id === test.controlId);
                  return (
                    <div
                      key={test.id}
                      className="p-3 rounded-lg border border-red-200 bg-red-50"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-p3 font-semibold text-[var(--foreground)]">{test.code}</span>
                        <span className="px-2 py-0.5 rounded-full text-p3 font-medium bg-red-100 text-red-700">
                          {test.status}
                        </span>
                      </div>
                      <p className="text-p3 text-[var(--foreground)] mb-1">{test.name}</p>
                      {control && (
                        <p className="text-p3 text-[var(--foreground-muted)]">
                          {control.code} - {control.name}
                        </p>
                      )}
                    </div>
                  );
                })}
                {insights.openIssues.length > 3 && (
                  <p className="text-p3 text-[var(--foreground-muted)] text-center">
                    +{insights.openIssues.length - 3} more
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-6 bg-[var(--background-secondary)] rounded-lg">
                <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                <p className="text-p3 text-[var(--foreground-muted)]">No open issues</p>
              </div>
            )}
          </div>

          {/* Closed Issues */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                <CheckCircle2 className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-h4 font-bold text-[var(--foreground)]">Closed Issues</h3>
                <p className="text-p3 text-[var(--foreground-muted)]">
                  {insights.closedIssues.length} resolved issue{insights.closedIssues.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            {insights.closedIssues.length > 0 ? (
              <div className="space-y-3">
                {insights.closedIssues.slice(0, 3).map((test) => {
                  const control = controls.find(c => c.id === test.controlId);
                  return (
                    <div
                      key={test.id}
                      className="p-3 rounded-lg border border-emerald-200 bg-emerald-50"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-p3 font-semibold text-[var(--foreground)]">{test.code}</span>
                        <span className="px-2 py-0.5 rounded-full text-p3 font-medium bg-emerald-100 text-emerald-700">
                          {test.status}
                        </span>
                      </div>
                      <p className="text-p3 text-[var(--foreground)] mb-1">{test.name}</p>
                      {control && (
                        <p className="text-p3 text-[var(--foreground-muted)]">
                          {control.code} - {control.name}
                        </p>
                      )}
                    </div>
                  );
                })}
                {insights.closedIssues.length > 3 && (
                  <p className="text-p3 text-[var(--foreground-muted)] text-center">
                    +{insights.closedIssues.length - 3} more
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-6 bg-[var(--background-secondary)] rounded-lg">
                <AlertCircle size={32} className="mx-auto text-[var(--foreground-muted)] opacity-30 mb-2" />
                <p className="text-p3 text-[var(--foreground-muted)]">No closed issues</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search controls by name or category..."
        filters={
          <>
            <FilterButtonGroup
              options={['all', 'Effective', 'Partially Effective', 'Ineffective', 'Not Tested']}
              value={effectivenessFilter}
              onChange={(value) => setEffectivenessFilter(value as EffectivenessFilter)}
              capitalize={false}
            />
            <FilterButtonGroup
              options={['all', 'Preventive', 'Detective', 'Corrective']}
              value={typeFilter}
              onChange={(value) => setTypeFilter(value as TypeFilter)}
              capitalize={false}
            />
          </>
        }
      />

      {/* Controls Table */}
      <div className="animate-fade-in-up delay-4 bg-white rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-[30%]" /> {/* Control */}
            <col className="w-[15%]" /> {/* Category */}
            <col className="w-[12%]" /> {/* Type */}
            <col className="w-[12%]" /> {/* Automation */}
            <col className="w-[12%]" /> {/* Effectiveness */}
            <col className="w-[8%]" /> {/* Tests */}
            <col className="w-[8%]" /> {/* Next Test */}
            <col className="w-[3%]" /> {/* Actions */}
          </colgroup>
          <thead className="bg-[var(--background-secondary)] border-b-2 border-[var(--border)]">
            <tr>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Control</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Category</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Type</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Automation</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Effectiveness</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Tests</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Next Test</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredControls.map((ctl) => (
              <tr key={ctl.id} className="hover:bg-[var(--background-secondary)] transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-[var(--foreground)]">{ctl.name}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">{ctl.owner}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-[var(--foreground)]">{ctl.category}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded font-medium ${
                    ctl.type === 'Preventive' ? 'bg-blue-100 text-blue-700' :
                    ctl.type === 'Detective' ? 'bg-purple-100 text-purple-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {ctl.type === 'Preventive' && <Shield size={10} />}
                    {ctl.type === 'Detective' && <Eye size={10} />}
                    {ctl.type === 'Corrective' && <Wrench size={10} />}
                    {ctl.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    ctl.automationLevel === 'Fully Automated' ? 'bg-emerald-100 text-emerald-700' :
                    ctl.automationLevel === 'Semi-Automated' ? 'bg-[var(--primary-lightest)] text-[var(--primary)]' :
                    'bg-gray-100 text-gray-700'
                  }`}>{ctl.automationLevel}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                    ctl.effectiveness === 'Effective' ? 'bg-emerald-100 text-emerald-700' :
                    ctl.effectiveness === 'Partially Effective' ? 'bg-amber-100 text-amber-700' :
                    ctl.effectiveness === 'Ineffective' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {ctl.effectiveness === 'Effective' && <CheckCircle2 size={10} />}
                    {ctl.effectiveness === 'Partially Effective' && <AlertTriangle size={10} />}
                    {ctl.effectiveness === 'Ineffective' && <XCircle size={10} />}
                    {ctl.effectiveness}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-[var(--foreground)]">{ctl.testsPassed}/{ctl.testCount}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-p3 text-[var(--foreground-muted)]">
                    {formatDateShort(ctl.nextTestDate)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setSelectedControl(ctl); setShowAIAssistant(true); }}
                      className="p-1.5 rounded hover:bg-purple-100 text-[var(--foreground-muted)] hover:text-purple-600 transition-colors"
                      title="AI Mapping Assistant"
                    >
                      <Sparkles size={14} />
                    </button>
                    <button
                      onClick={() => { setSelectedControl(ctl); setShowAddTestModal(true); }}
                      className="p-1.5 rounded hover:bg-indigo-100 text-[var(--foreground-muted)] hover:text-indigo-600 transition-colors"
                      title="Add Test"
                    >
                      <FlaskConical size={14} />
                    </button>
                    <button
                      onClick={() => { setSelectedControl(ctl); setShowUploadEvidenceModal(true); }}
                      className="p-1.5 rounded hover:bg-rose-100 text-[var(--foreground-muted)] hover:text-rose-600 transition-colors"
                      title="Upload Evidence"
                    >
                      <Upload size={14} />
                    </button>
                    <button
                      onClick={() => { setSelectedControl(ctl); setShowEditControlModal(true); }}
                      className="p-1.5 rounded hover:bg-violet-100 text-[var(--foreground-muted)] hover:text-violet-600 transition-colors"
                      title="Edit Control"
                    >
                      <Settings size={14} />
                    </button>
                    <Link
                      href={`/controls/${ctl.id}`}
                      className="p-1.5 rounded text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-lightest)] transition-colors"
                      title="View Details"
                    >
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Workflow Modals */}
      <AddTestModal
        isOpen={showAddTestModal}
        onClose={() => { setShowAddTestModal(false); setSelectedControl(null); }}
        controlId={selectedControl?.id}
        controlName={selectedControl?.name}
        onAdd={(test) => console.log('Added test:', test)}
      />

      <UploadEvidenceModal
        isOpen={showUploadEvidenceModal}
        onClose={() => { setShowUploadEvidenceModal(false); setSelectedControl(null); }}
        controlId={selectedControl?.id}
        controlName={selectedControl?.name}
        onUpload={(files) => console.log('Uploaded evidence:', files)}
      />

      <ExecuteTestModal
        isOpen={showExecuteTestModal}
        onClose={() => { setShowExecuteTestModal(false); setSelectedControl(null); }}
        test={selectedControl ? {
          id: `test-${selectedControl.id}`,
          name: `Test for ${selectedControl.name}`,
          procedure: 'Verify the control is operating effectively by reviewing logs, configurations, and evidence.',
          controlName: selectedControl.name,
        } : undefined}
        onExecute={(result) => console.log('Test executed:', result)}
      />

      <CreateControlModal
        isOpen={showCreateControlModal}
        onClose={() => setShowCreateControlModal(false)}
        onCreate={(control) => console.log('Created control:', control)}
      />

      <EditControlModal
        isOpen={showEditControlModal}
        onClose={() => { setShowEditControlModal(false); setSelectedControl(null); }}
        control={selectedControl || undefined}
        onSave={(control) => console.log('Updated control:', control)}
      />

      <AIControlMappingAssistant
        isOpen={showAIAssistant}
        onClose={() => { setShowAIAssistant(false); setSelectedControl(null); }}
        controlId={selectedControl?.id}
        onApplyMapping={(mapping) => {
          console.log('AI suggested mapping:', mapping);
          alert(`Successfully mapped control to ${('requirementIds' in mapping) ? mapping.requirementIds.length : 0} requirements!`);
          setShowAIAssistant(false);
          setSelectedControl(null);
        }}
      />
    </div>
  );
}

export default function ControlsDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    }>
      <ControlsDashboardContent />
    </Suspense>
  );
}
