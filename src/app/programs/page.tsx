'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search, Filter, ChevronRight, ChevronDown, Plus, LayoutGrid, List,
  TrendingUp, TrendingDown, Shield, AlertTriangle, CheckCircle2, Clock,
  Building2, Users, Calendar, MoreHorizontal, ArrowUpRight, Download,
  BookOpen, Sparkles, FolderKanban, X, Layers, FileText, Target
} from 'lucide-react';
import { programs, dashboardMetrics } from '@/lib/data/mock-data';
import { requirements } from '@/lib/data/requirements-obligations';
import { controls } from '@/lib/data/controls';
import { PageHeader, SearchFilterBar, FilterButtonGroup } from '@/components';
import { ProgramCreationWizard } from '@/components/ProgramCreationWizard';
import clsx from 'clsx';

type ViewMode = 'grid' | 'list' | 'hierarchy';
type StatusFilter = 'all' | 'Active' | 'Draft' | 'Under Review' | 'Archived';

function ProgramsDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [authorityFilter, setAuthorityFilter] = useState<string | null>(null);

  // Three-pane hierarchy view state
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [selectedRequirementId, setSelectedRequirementId] = useState<string | null>(null);

  // Read authority from query params on mount
  useEffect(() => {
    const authority = searchParams.get('authority');
    if (authority) {
      setAuthorityFilter(authority);
    }
  }, [searchParams]);

  const filteredPrograms = programs.filter(pgm => {
    const matchesStatus = statusFilter === 'all' || pgm.status === statusFilter;
    const matchesSearch = pgm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pgm.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAuthority = !authorityFilter || pgm.tags.some(tag =>
      tag.toLowerCase() === authorityFilter.toLowerCase()
    );
    return matchesStatus && matchesSearch && matchesAuthority;
  });

  const clearAuthorityFilter = () => {
    setAuthorityFilter(null);
    router.push('/programs');
  };

  const statusCounts = {
    all: programs.length,
    Active: programs.filter(p => p.status === 'Active').length,
    Draft: programs.filter(p => p.status === 'Draft').length,
    'Under Review': programs.filter(p => p.status === 'Under Review').length,
    Archived: programs.filter(p => p.status === 'Archived').length,
  };

  const avgCompliance = Math.round(programs.reduce((acc, p) => acc + p.complianceScore, 0) / programs.length);

  // Separate custom vs imported programs
  const customPrograms = programs.filter(p => p.isCustom);
  const importedPrograms = programs.filter(p => !p.isCustom);

  const handleCreateProgram = (programData: any) => {
    // In a real app, this would make an API call to create the program
    console.log('Creating program:', programData);

    // For now, we'll just simulate success and redirect
    // You could also add the program to local state or show a success message
    setTimeout(() => {
      // Redirect to the new program (in real app, use the actual ID from API)
      router.push('/programs/pgm-new');
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="My Programs"
        description="Your active compliance programs - imported from library or custom created"
        action={
          <div className="flex items-center gap-3">
            <Link
              href="/library/programs"
              className="flex items-center gap-2 px-4 py-2.5 border border-[var(--border)] bg-[var(--background)] rounded-xl hover:bg-[var(--background-secondary)] hover:border-cyan-500/30 transition-all duration-200 text-p2 font-medium"
            >
              <Download size={18} className="text-cyan-600" />
              Import from Library
            </Link>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all duration-200 text-p2 font-medium shadow-sm hover:shadow-md"
            >
              <Sparkles size={18} />
              Create Custom
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="animate-fade-in-up delay-1 grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-xl p-5 text-white shadow-md">
          <p className="text-white/70 text-p3 font-medium mb-1">Avg. Compliance</p>
          <p className="text-h2 font-bold tracking-tight">{avgCompliance}%</p>
          <div className="flex items-center gap-1 mt-2 text-p3 text-white/80">
            <TrendingUp size={12} />
            <span>+2.4% from last month</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5 hover:shadow-md transition-shadow">
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1">Total Programs</p>
          <p className="text-h2 font-bold tracking-tight text-[var(--foreground)]">{programs.length}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">{statusCounts.Active} active</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5 hover:shadow-md transition-shadow">
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1">Total Controls</p>
          <p className="text-h2 font-bold tracking-tight text-[var(--foreground)]">{programs.reduce((acc, p) => acc + p.controls, 0)}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">Across all programs</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5 hover:shadow-md transition-shadow">
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1">Tests Passed</p>
          <p className="text-h2 font-bold tracking-tight text-emerald-600">{programs.reduce((acc, p) => acc + p.testsPassed, 0)}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">of {programs.reduce((acc, p) => acc + p.tests, 0)} total</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5 hover:shadow-md transition-shadow">
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1">Tests Failed</p>
          <p className="text-h2 font-bold tracking-tight text-red-600">{programs.reduce((acc, p) => acc + p.testsFailed, 0)}</p>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">Requires attention</p>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search programs by name or authority..."
        filters={
          <FilterButtonGroup
            options={['all', 'Active', 'Draft', 'Under Review', 'Archived']}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as StatusFilter)}
            label="Status"
          />
        }
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showHierarchyView={true}
      />

      {/* Authority Filter Indicator */}
      {authorityFilter && (
        <div className="animate-fade-in-up flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl">
          <div className="flex items-center gap-2 flex-1">
            <Filter size={18} className="text-cyan-600" />
            <span className="text-p2 text-[var(--foreground-muted)]">Filtered by authority:</span>
            <span className="px-3 py-1 bg-white border border-cyan-300 rounded-lg text-p2 font-semibold text-cyan-700">
              {authorityFilter}
            </span>
            <span className="text-p3 text-[var(--foreground-muted)]">
              ({filteredPrograms.length} {filteredPrograms.length === 1 ? 'program' : 'programs'})
            </span>
          </div>
          <button
            onClick={clearAuthorityFilter}
            className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-red-50 border border-gray-300 hover:border-red-300 rounded-lg transition-all text-p2 text-[var(--foreground-muted)] hover:text-red-600"
          >
            <X size={16} />
            Clear Filter
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredPrograms.length === 0 && (
        <div className="animate-fade-in-up bg-white rounded-xl border border-[var(--border)] p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderKanban size={32} className="text-gray-400" />
            </div>
            <h3 className="text-h3 font-semibold text-[var(--foreground)] mb-2">
              {authorityFilter ? `No programs found for ${authorityFilter}` : 'No programs found'}
            </h3>
            <p className="text-p2 text-[var(--foreground-muted)] mb-6">
              {authorityFilter
                ? `There are no programs matching the authority "${authorityFilter}". Try clearing the filter or importing programs from the library.`
                : searchQuery
                  ? 'Try adjusting your search or filters to find what you\'re looking for.'
                  : 'Get started by importing a program from the library or creating a custom program.'
              }
            </p>
            <div className="flex items-center justify-center gap-3">
              {authorityFilter && (
                <button
                  onClick={clearAuthorityFilter}
                  className="px-4 py-2 border border-[var(--border)] bg-white rounded-lg hover:bg-[var(--background-secondary)] transition-all text-p2 font-medium"
                >
                  Clear Filter
                </button>
              )}
              <Link
                href="/library/programs"
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all text-p2 font-medium"
              >
                Browse Library
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Three-Pane Hierarchy View */}
      {filteredPrograms.length > 0 && viewMode === 'hierarchy' ? (
        <div className="animate-fade-in-up delay-3 flex gap-4 h-[calc(100vh-500px)] min-h-[600px]">
          {/* Pane 1: Programs List */}
          <div className="flex-[0_0_30%] bg-white rounded-xl border border-[var(--border)] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[var(--border)] bg-[var(--background-secondary)]">
              <h3 className="text-p1 font-semibold text-[var(--foreground)] flex items-center gap-2">
                <FolderKanban size={18} className="text-[var(--primary)]" />
                Programs ({filteredPrograms.length})
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredPrograms.map((pgm) => (
                <button
                  key={pgm.id}
                  onClick={() => {
                    setSelectedProgramId(pgm.id);
                    setSelectedRequirementId(null);
                  }}
                  className={clsx(
                    'w-full text-left p-4 border-b border-[var(--border)] transition-all',
                    selectedProgramId === pgm.id
                      ? 'bg-cyan-50 border-l-4 border-l-cyan-500'
                      : 'hover:bg-[var(--background-secondary)]'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={clsx(
                      'text-p2 font-semibold',
                      selectedProgramId === pgm.id ? 'text-cyan-700' : 'text-[var(--foreground)]'
                    )}>
                      {pgm.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3 text-p3 text-[var(--foreground-muted)]">
                    <span className="flex items-center gap-1">
                      <FileText size={12} />
                      {pgm.requirementCount} Req
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield size={12} />
                      {pgm.controls} Ctrl
                    </span>
                    <span className={clsx(
                      'px-2 py-0.5 rounded text-p4 font-medium',
                      pgm.complianceScore >= 90 ? 'bg-emerald-100 text-emerald-700' :
                      pgm.complianceScore >= 80 ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    )}>
                      {pgm.complianceScore}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Pane 2: Requirements */}
          {selectedProgramId && (() => {
            const programRequirements = requirements.filter(r => r.programId === selectedProgramId);
            return (
              <div className="flex-[0_0_35%] bg-white rounded-xl border border-[var(--border)] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-[var(--border)] bg-[var(--background-secondary)]">
                  <h3 className="text-p1 font-semibold text-[var(--foreground)] flex items-center gap-2">
                    <Target size={18} className="text-blue-600" />
                    Requirements ({programRequirements.length})
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {programRequirements.length === 0 ? (
                    <div className="p-8 text-center text-[var(--foreground-muted)]">
                      <FileText size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="text-p2">No requirements found</p>
                    </div>
                  ) : (
                    programRequirements.map((req) => (
                      <button
                        key={req.id}
                        onClick={() => setSelectedRequirementId(req.id)}
                        className={clsx(
                          'w-full text-left p-4 border-b border-[var(--border)] transition-all',
                          selectedRequirementId === req.id
                            ? 'bg-blue-50 border-l-4 border-l-blue-500'
                            : 'hover:bg-[var(--background-secondary)]'
                        )}
                      >
                        <div className="mb-2">
                          <span className="text-p3 font-mono text-blue-600">{req.code}</span>
                        </div>
                        <h4 className={clsx(
                          'text-p2 font-semibold mb-1',
                          selectedRequirementId === req.id ? 'text-blue-700' : 'text-[var(--foreground)]'
                        )}>
                          {req.title}
                        </h4>
                        <p className="text-p3 text-[var(--foreground-muted)] line-clamp-2 mb-2">
                          {req.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={clsx(
                            'px-2 py-0.5 rounded text-p4 font-medium',
                            req.riskRating === 'Critical' ? 'bg-red-100 text-red-700' :
                            req.riskRating === 'High' ? 'bg-orange-100 text-orange-700' :
                            req.riskRating === 'Medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-emerald-100 text-emerald-700'
                          )}>
                            {req.riskRating}
                          </span>
                          <span className="text-p3 text-[var(--foreground-muted)]">
                            {req.controlCount || 0} controls
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            );
          })()}

          {/* Pane 3: Controls */}
          {selectedRequirementId && (() => {
            // Get the selected requirement to find its program
            const selectedRequirement = requirements.find(r => r.id === selectedRequirementId);
            // Filter controls that are specifically linked to this requirement
            // If no controls are linked to the specific requirement, this will show an empty state
            const requirementControls = controls.filter(c =>
              c.linkedRequirementIds?.includes(selectedRequirementId)
            );
            return (
              <div className="flex-[0_0_35%] bg-white rounded-xl border border-[var(--border)] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-[var(--border)] bg-[var(--background-secondary)]">
                  <h3 className="text-p1 font-semibold text-[var(--foreground)] flex items-center gap-2">
                    <Shield size={18} className="text-green-600" />
                    Controls ({requirementControls.length})
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {requirementControls.length === 0 ? (
                    <div className="p-8 text-center text-[var(--foreground-muted)]">
                      <Shield size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="text-p2">No controls mapped</p>
                    </div>
                  ) : (
                    requirementControls.map((ctrl) => (
                      <Link
                        key={ctrl.id}
                        href={`/controls/${ctrl.id}`}
                        className="block p-4 border-b border-[var(--border)] hover:bg-green-50 transition-all"
                      >
                        <div className="mb-2">
                          <span className="text-p3 font-mono text-green-600">{ctrl.code}</span>
                        </div>
                        <h4 className="text-p2 font-semibold text-[var(--foreground)] mb-1">
                          {ctrl.name}
                        </h4>
                        <p className="text-p3 text-[var(--foreground-muted)] line-clamp-2 mb-3">
                          {ctrl.description}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={clsx(
                            'px-2 py-0.5 rounded text-p4 font-medium',
                            ctrl.type === 'Preventive' ? 'bg-blue-100 text-blue-700' :
                            ctrl.type === 'Detective' ? 'bg-purple-100 text-purple-700' :
                            'bg-orange-100 text-orange-700'
                          )}>
                            {ctrl.type}
                          </span>
                          <span className={clsx(
                            'px-2 py-0.5 rounded text-p4 font-medium',
                            ctrl.automationLevel === 'Fully Automated' ? 'bg-emerald-100 text-emerald-700' :
                            ctrl.automationLevel === 'Semi-Automated' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-700'
                          )}>
                            {ctrl.automationLevel}
                          </span>
                          <span className={clsx(
                            'px-2 py-0.5 rounded text-p4 font-medium',
                            ctrl.effectiveness === 'Effective' ? 'bg-emerald-100 text-emerald-700' :
                            ctrl.effectiveness === 'Partially Effective' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          )}>
                            {ctrl.effectiveness}
                          </span>
                        </div>
                        <div className="mt-2 text-p3 text-[var(--foreground-muted)]">
                          <span>{ctrl.testCount || 0} tests</span>
                          {ctrl.testCount && ctrl.testCount > 0 && (
                            <>
                              <span className="mx-1">•</span>
                              <span className="text-emerald-600">{ctrl.testsPassed || 0} passed</span>
                              {ctrl.testsFailed && ctrl.testsFailed > 0 && (
                                <>
                                  <span className="mx-1">•</span>
                                  <span className="text-red-600">{ctrl.testsFailed} failed</span>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      ) : filteredPrograms.length > 0 && viewMode === 'grid' ? (
        <div className="animate-fade-in-up delay-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrograms.map((pgm, idx) => (
            <Link key={pgm.id} href={`/programs/${pgm.id}`} className="group">
              <div className="bg-white rounded-xl border border-[var(--border)] p-6 hover:shadow-lg hover:border-[var(--primary)] transition-all relative">
                {/* Source Badge */}
                <div className="absolute top-3 right-3">
                  <span className={clsx('text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1',
                    pgm.isCustom
                      ? 'bg-violet-100 text-violet-700 border border-violet-200'
                      : 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                  )}>
                    {pgm.isCustom ? (
                      <><Sparkles size={10} /> Custom</>
                    ) : (
                      <><BookOpen size={10} /> Imported</>
                    )}
                  </span>
                </div>

                <div className="flex items-start justify-between mb-4">
                  <div className="pr-16">
                    <span className="inline-block px-2 py-0.5 bg-[var(--primary-lightest)] text-[var(--primary)] rounded text-p3 font-semibold mb-2">
                      {pgm.tags[0] || 'Untagged'}
                    </span>
                    <h3 className="text-p2 font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">{pgm.name}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className={clsx('text-p3 px-2 py-1 rounded-full font-medium',
                    pgm.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                    pgm.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                    pgm.status === 'Under Review' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-500'
                  )}>
                    {pgm.status}
                  </span>
                </div>

                {/* Compliance Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-p3 text-[var(--foreground-muted)]">Compliance Score</span>
                    <span className={clsx('text-p2 font-semibold',
                      pgm.complianceScore >= 90 ? 'text-emerald-600' :
                      pgm.complianceScore >= 80 ? 'text-[var(--primary)]' :
                      pgm.complianceScore >= 70 ? 'text-amber-600' : 'text-red-600'
                    )}>{pgm.complianceScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
                    <div
                      className={clsx('h-full rounded-full transition-all',
                        pgm.complianceScore >= 90 ? 'bg-emerald-500' :
                        pgm.complianceScore >= 80 ? 'bg-[var(--primary)]' :
                        pgm.complianceScore >= 70 ? 'bg-amber-500' : 'bg-red-500'
                      )}
                      style={{ width: `${pgm.complianceScore}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 bg-[var(--background-secondary)] rounded-lg">
                    <p className="text-p1 font-semibold text-[var(--foreground)]">{pgm.requirementCount + pgm.obligationCount}</p>
                    <p className="text-p3 text-[var(--foreground-muted)]">Citations</p>
                  </div>
                  <div className="text-center p-2 bg-[var(--background-secondary)] rounded-lg">
                    <p className="text-p1 font-semibold text-[var(--foreground)]">{pgm.controls}</p>
                    <p className="text-p3 text-[var(--foreground-muted)]">Controls</p>
                  </div>
                  <div className="text-center p-2 bg-[var(--background-secondary)] rounded-lg">
                    <p className="text-p1 font-semibold text-[var(--foreground)]">{pgm.tests}</p>
                    <p className="text-p3 text-[var(--foreground-muted)]">Tests</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[var(--primary-lightest)] flex items-center justify-center">
                      <Users size={12} className="text-[var(--primary)]" />
                    </div>
                    <span className="text-p3 text-[var(--foreground-muted)]">{pgm.owner}</span>
                  </div>
                  <span className={clsx('text-p3 px-2 py-0.5 rounded font-medium',
                    pgm.riskRating === 'Critical' ? 'bg-red-100 text-red-700' :
                    pgm.riskRating === 'High' ? 'bg-orange-100 text-orange-700' :
                    pgm.riskRating === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  )}>
                    {pgm.riskRating} Risk
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : filteredPrograms.length > 0 ? (
        /* List View */
        <div className="animate-fade-in-up delay-3 bg-white rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-[var(--background-secondary)]">
              <tr>
                <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Program</th>
                <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Source</th>
                <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Authority</th>
                <th className="text-center px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Compliance</th>
                <th className="text-center px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Controls</th>
                <th className="text-center px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Tests</th>
                <th className="text-center px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Risk</th>
                <th className="text-center px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] bg-white">
              {filteredPrograms.map((pgm) => (
                <tr key={pgm.id} className="hover:bg-[var(--background-secondary)] transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <Link href={`/programs/${pgm.id}`} className="text-p2 font-medium text-[var(--foreground)] hover:text-[var(--primary)]">
                      {pgm.name}
                    </Link>
                    <p className="text-p3 text-[var(--foreground-muted)]">{pgm.owner}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx('text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1',
                      pgm.isCustom
                        ? 'bg-violet-100 text-violet-700 border border-violet-200'
                        : 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                    )}>
                      {pgm.isCustom ? (
                        <><Sparkles size={10} /> Custom</>
                      ) : (
                        <><BookOpen size={10} /> Imported</>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-0.5 bg-[var(--primary-lightest)] text-[var(--primary)] rounded text-p3 font-semibold">
                      {pgm.tags[0] || 'Untagged'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={clsx('text-p2 font-semibold',
                      pgm.complianceScore >= 90 ? 'text-emerald-600' :
                      pgm.complianceScore >= 80 ? 'text-[var(--primary)]' :
                      pgm.complianceScore >= 70 ? 'text-amber-600' : 'text-red-600'
                    )}>{pgm.complianceScore}%</span>
                  </td>
                  <td className="px-6 py-4 text-center text-p2 font-medium text-[var(--foreground)]">{pgm.controls}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-p3">
                      <span className="text-emerald-600 font-medium">{pgm.testsPassed}✓</span>
                      <span className="text-red-600 font-medium">{pgm.testsFailed}✗</span>
                      <span className="text-amber-600 font-medium">{pgm.testsPending}○</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={clsx('text-p3 px-2 py-0.5 rounded font-medium',
                      pgm.riskRating === 'Critical' ? 'bg-red-100 text-red-700' :
                      pgm.riskRating === 'High' ? 'bg-orange-100 text-orange-700' :
                      pgm.riskRating === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    )}>{pgm.riskRating}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={clsx('text-p3 px-2 py-1 rounded-full font-medium',
                      pgm.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                      pgm.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                      pgm.status === 'Under Review' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-500'
                    )}>{pgm.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/programs/${pgm.id}`} className="text-[var(--primary)] hover:text-[var(--primary-dark)]">
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* Create Program Wizard */}
      <ProgramCreationWizard
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onComplete={handleCreateProgram}
      />
    </div>
  );
}

export default function ProgramsDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    }>
      <ProgramsDashboardContent />
    </Suspense>
  );
}
