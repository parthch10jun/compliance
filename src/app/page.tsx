'use client';

import { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ChevronDown,
  Building2,
  Landmark,
  BookOpen,
  FileText,
  Shield,
  FlaskConical,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  Zap,
  Calendar,
  Filter,
  X
} from 'lucide-react';
import Link from 'next/link';
import { PageHeader, SearchFilterBar, ComplianceAreaCoverage3D } from '@/components';
import { ComplianceScoreModal } from '@/components/ComplianceScoreModal';
import { programs } from '@/lib/data/mock-data';
import { controls } from '@/lib/data/controls';
import { requirements, obligations } from '@/lib/data/requirements-obligations';
import { controlTests } from '@/lib/data/control-tests';
import { evidence } from '@/lib/data/evidence';

// Business Units
const businessUnits = ['All Business Units', 'Retail Banking', 'Wealth Management', 'Corporate Banking', 'Operations'];

// Top Authorities with their data (derived from programs, requirements, obligations, controls)
const topAuthorities = [
  {
    id: 'rbi',
    name: 'RBI',
    description: 'Reserve Bank of India regulations',
    category: 'Regulator',
    compliance: 91,
    programs: 2,
    requirements: 4,
    obligations: 3,
    controls: 8,
    trend: 3.2,
  },
  {
    id: 'iso',
    name: 'ISO',
    description: 'International standards organization',
    category: 'Standards Body',
    compliance: 88,
    programs: 1,
    requirements: 1,
    obligations: 0,
    controls: 2,
    trend: 2.1,
  },
  {
    id: 'eu',
    name: 'EU',
    description: 'European Union regulations',
    category: 'Regulator',
    compliance: 85,
    programs: 1,
    requirements: 2,
    obligations: 2,
    controls: 3,
    trend: -1.4,
  },
  {
    id: 'sdaia',
    name: 'SDAIA',
    description: 'Saudi Data & AI Authority',
    category: 'Regulator',
    compliance: 78,
    programs: 1,
    requirements: 0,
    obligations: 1,
    controls: 0,
    trend: 5.8,
  },
];

// Compliance Areas for 3D Visualization
const complianceAreas = [
  {
    name: 'IT Governance',
    coverage: 92,
    color: '#3b82f6',
    requirements: 15,
    controls: 28,
  },
  {
    name: 'Cybersecurity',
    coverage: 88,
    color: '#8b5cf6',
    requirements: 18,
    controls: 35,
  },
  {
    name: 'IT Risk Mgmt',
    coverage: 85,
    color: '#06b6d4',
    requirements: 12,
    controls: 22,
  },
  {
    name: 'Data Privacy',
    coverage: 90,
    color: '#10b981',
    requirements: 10,
    controls: 18,
  },
  {
    name: 'IT Audit',
    coverage: 94,
    color: '#f59e0b',
    requirements: 8,
    controls: 13,
  },
];

// Filter options
const statusOptions = ['All Status', 'Compliant', 'At Risk', 'Non-Compliant'];
const programOptions = ['All Programs', 'ISO 27001', 'GDPR', 'RBI CSF', 'PDPL'];

export default function Home() {
  // Calculate dynamic summary stats
  const summaryStats = useMemo(() => {
    // Calculate overall compliance from programs
    const overallCompliance = programs.length > 0
      ? Math.round(programs.reduce((acc, p) => acc + p.complianceScore, 0) / programs.length)
      : 0;

    // Count unique authorities from programs, requirements, obligations, and controls
    const authoritiesSet = new Set<string>();
    programs.forEach(p => p.tags.forEach(tag => authoritiesSet.add(tag)));
    requirements.forEach(r => r.tags.forEach(tag => authoritiesSet.add(tag)));
    obligations.forEach(o => o.tags.forEach(tag => authoritiesSet.add(tag)));
    controls.forEach(c => c.tags.forEach(tag => authoritiesSet.add(tag)));

    // Count tests by status
    const testsPassed = controlTests.filter(t => t.status === 'Passed').length;
    const testsFailed = controlTests.filter(t => t.status === 'Failed').length;
    const testsPending = controlTests.filter(t => t.status === 'In Progress' || t.status === 'Pending' || t.status === 'Not Started').length;

    return {
      overallCompliance,
      totalAuthorities: authoritiesSet.size,
      totalPrograms: programs.length,
      totalCitations: requirements.length + obligations.length,
      citationsRequirements: requirements.length,
      citationsObligations: obligations.length,
      totalControls: controls.length,
      totalTests: controlTests.length,
      totalEvidence: evidence.length,
      testsPassed,
      testsFailed,
      testsPending,
    };
  }, []);

  const [selectedBU, setSelectedBU] = useState('All Business Units');
  const [buDropdownOpen, setBuDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedProgram, setSelectedProgram] = useState('All Programs');
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScoreModal, setShowScoreModal] = useState(false);

  // Active filters count
  const activeFiltersCount = [selectedStatus, selectedProgram, dateRange].filter(
    f => !f.includes('All') && f !== 'Last 30 days'
  ).length;

  // Filter data based on selected business unit (department)
  const filteredData = useMemo(() => {
    const departmentFilter = selectedBU === 'All Business Units' ? null : selectedBU;

    const filteredPrograms = departmentFilter
      ? programs.filter(p => p.department === departmentFilter)
      : programs;

    const filteredControls = departmentFilter
      ? controls.filter(c => c.department === departmentFilter)
      : controls;

    const filteredRequirements = departmentFilter
      ? requirements.filter(r => r.department === departmentFilter)
      : requirements;

    // Calculate stats from filtered data
    const totalPrograms = filteredPrograms.length;
    const totalControls = filteredControls.length;
    const totalRequirements = filteredRequirements.length;

    const totalTests = filteredPrograms.reduce((sum, p) => sum + p.tests, 0);
    const testsPassed = filteredPrograms.reduce((sum, p) => sum + p.testsPassed, 0);
    const testsFailed = filteredPrograms.reduce((sum, p) => sum + p.testsFailed, 0);
    const testsPending = filteredPrograms.reduce((sum, p) => sum + p.testsPending, 0);

    const totalObligations = filteredPrograms.reduce((sum, p) => sum + p.obligationCount, 0);
    const upcomingObligations = filteredPrograms.reduce((sum, p) => sum + p.upcomingObligations, 0);

    // Calculate overall compliance from filtered programs
    const avgCompliance = filteredPrograms.length > 0
      ? Math.round(filteredPrograms.reduce((sum, p) => sum + p.complianceScore, 0) / filteredPrograms.length)
      : summaryStats.overallCompliance;

    return {
      programs: filteredPrograms,
      controls: filteredControls,
      requirements: filteredRequirements,
      stats: {
        overallCompliance: avgCompliance,
        totalPrograms,
        totalControls,
        totalRequirements,
        totalCitations: totalRequirements + totalObligations,
        citationsRequirements: totalRequirements,
        citationsObligations: totalObligations,
        totalTests,
        testsPassed,
        testsFailed,
        testsPending,
        totalEvidence: Math.floor(totalControls * 2.5),
      }
    };
  }, [selectedBU]);

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Compliance Dashboard"
        description="Real-time compliance posture across your organization"
        action={
          <div className="relative z-[100]">
            <button
              onClick={() => setBuDropdownOpen(!buDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[var(--border)] rounded-xl text-p2 font-medium hover:border-[var(--primary)] hover:shadow-sm transition-all"
            >
              <Building2 size={18} className="text-[var(--primary)]" />
              <span>{selectedBU}</span>
              <ChevronDown size={16} className={`text-[var(--foreground-muted)] transition-transform ${buDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {buDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-[var(--border)] rounded-xl shadow-lg z-[100] overflow-hidden">
                {businessUnits.map((bu) => (
                  <button
                    key={bu}
                    onClick={() => { setSelectedBU(bu); setBuDropdownOpen(false); }}
                    className={`w-full px-4 py-2.5 text-left text-p2 hover:bg-[var(--background-secondary)] transition-colors ${
                      selectedBU === bu ? 'bg-[var(--primary-lightest)] text-[var(--primary)] font-medium' : ''
                    }`}
                  >
                    {bu}
                  </button>
                ))}
              </div>
            )}
          </div>
        }
      />

      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search authorities, programs, controls..."
        actions={
          <>
            {/* Date Range */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[var(--border)] rounded-xl text-p2 hover:border-[var(--primary)] hover:shadow-sm transition-all whitespace-nowrap"
              >
                <Calendar size={16} className="text-[var(--foreground-muted)]" />
                <span>{dateRange}</span>
                <ChevronDown size={14} className="text-[var(--foreground-muted)]" />
              </button>
            </div>

            {/* Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-p2 font-medium transition-all whitespace-nowrap ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-sm'
                  : 'bg-white border-[var(--border)] hover:border-[var(--primary)] hover:shadow-sm'
              }`}
            >
              <Filter size={16} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-p3">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </>
        }
      />

      {/* Expanded Filters Panel */}
      {showFilters && (
        <div className="mt-4 p-4 bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl animate-fade-in-up mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Status Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-p3 font-medium text-[var(--foreground-muted)] uppercase tracking-wide">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-white border border-[var(--border)] rounded-lg text-p2 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
              >
                {statusOptions.map(opt => <option key={opt}>{opt}</option>)}
              </select>
            </div>

            {/* Program Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-p3 font-medium text-[var(--foreground-muted)] uppercase tracking-wide">Program</label>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="px-3 py-2 bg-white border border-[var(--border)] rounded-lg text-p2 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
                >
                  {programOptions.map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={() => {
                  setSelectedStatus('All Status');
                  setSelectedProgram('All Programs');
                  setDateRange('Last 30 days');
                }}
                className="flex items-center gap-1 px-3 py-2 text-p2 text-[var(--error)] hover:bg-[var(--error-lightest)] rounded-lg transition-colors mt-auto"
              >
                <X size={14} />
                <span>Clear filters</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Overall Compliance Score - Hero Card (Clickable) */}
      <button
        onClick={() => setShowScoreModal(true)}
        className="animate-fade-in-up delay-1 relative z-10 overflow-hidden bg-gradient-to-r from-[var(--primary-dark)] via-[var(--primary)] to-[var(--primary-light)] rounded-xl p-8 mb-8 shadow-lg hover:shadow-xl transition-all w-full text-left group cursor-pointer hover:scale-[1.01]"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern id=%22grid%22 width=%2220%22 height=%2220%22 patternUnits=%22userSpaceOnUse%22%3E%3Cpath d=%22M 20 0 L 0 0 0 20%22 fill=%22none%22 stroke=%22rgba(255,255,255,0.05)%22 stroke-width=%221%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22url(%23grid)%22/%3E%3C/svg%3E')] opacity-50" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-white/70 text-p2 font-medium uppercase tracking-wider mb-2">
              Overall Compliance Score {selectedBU !== 'All Business Units' && `- ${selectedBU}`}
            </p>
            <div className="flex items-baseline gap-4">
              <span className="text-6xl font-bold text-white tracking-tight group-hover:scale-105 transition-transform">{filteredData.stats.overallCompliance}%</span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/15 backdrop-blur-sm rounded-full">
                <TrendingUp size={14} className="text-emerald-300" />
                <span className="text-emerald-300 text-p2 font-semibold">+2.4%</span>
              </div>
            </div>
            <p className="text-white/60 text-p2 mt-3">Click to view breakdown</p>
          </div>

          {/* Compliance Ring */}
          <div className="hidden md:flex items-center gap-8">
            <div className="text-center">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.15)" strokeWidth="6" fill="none" />
                  <circle
                    cx="48" cy="48" r="40"
                    stroke="white"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${filteredData.stats.totalTests > 0 ? (filteredData.stats.testsPassed / filteredData.stats.totalTests) * 251 : 0} 251`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-white text-h4 font-bold">
                  {filteredData.stats.totalTests > 0 ? Math.round((filteredData.stats.testsPassed / filteredData.stats.totalTests) * 100) : 0}%
                </span>
              </div>
              <p className="text-white/60 text-p3 mt-2 font-medium">Tests Passed</p>
            </div>
          </div>
        </div>
      </button>

      {/* Hierarchy Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { href: '/authorities', icon: Landmark, label: 'Authorities', value: summaryStats.totalAuthorities, color: 'teal', delay: 'delay-2' },
          { href: '/programs', icon: BookOpen, label: 'Programs', value: filteredData.stats.totalPrograms, color: 'cyan', delay: 'delay-2' },
          { href: '/citations', icon: FileText, label: 'Citations', value: filteredData.stats.totalCitations, color: 'slate', delay: 'delay-3', badge: { value: filteredData.stats.citationsObligations, label: 'obligations' } },
          { href: '/controls', icon: Shield, label: 'Controls', value: filteredData.stats.totalControls, color: 'emerald', delay: 'delay-3' },
          { href: '/tests', icon: FlaskConical, label: 'Tests', value: filteredData.stats.totalTests, color: 'amber', delay: 'delay-4', pending: filteredData.stats.testsPending },
          { href: '/evidence', icon: FileCheck, label: 'Evidence', value: filteredData.stats.totalEvidence, color: 'stone', delay: 'delay-4' },
        ].map((item) => (
          <Link key={item.href} href={item.href} className={`group animate-fade-in-up ${item.delay}`}>
            <div className="card-hover bg-white rounded-lg border border-[var(--border)] p-4 h-full">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  item.color === 'teal' ? 'bg-teal-50 text-teal-600' :
                  item.color === 'cyan' ? 'bg-cyan-50 text-cyan-600' :
                  item.color === 'slate' ? 'bg-slate-100 text-slate-600' :
                  item.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                  item.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                  'bg-stone-100 text-stone-600'
                }`}>
                  <item.icon size={18} />
                </div>
                <ArrowUpRight size={14} className="text-[var(--foreground-light)] opacity-0 group-hover:opacity-100 group-hover:text-[var(--primary)] transition-all" />
              </div>
              <p className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">{item.value}</p>
              <p className="text-sm text-[var(--foreground-muted)]">{item.label}</p>
              {item.badge && (
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-xs text-[var(--foreground-muted)]">{item.badge.value}</span>
                  <Zap size={10} className="text-[var(--accent)]" />
                  <span className="text-xs text-[var(--accent)]">{item.badge.label}</span>
                </div>
              )}
              {item.pending && (
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full" />
                  <span className="text-xs text-[var(--foreground-muted)]">{item.pending} pending</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Top Authorities Cards */}
      <div className="animate-fade-in-up delay-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--foreground)]">Top Authorities</h2>
          <Link href="/authorities" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1 font-medium">
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topAuthorities.map((tag) => (
            <div key={tag.id} className="group">
              <div className="card-hover bg-white rounded-lg border border-[var(--border)] p-5 flex flex-col">
                {/* Header - Fixed Height */}
                <div className="flex items-start justify-between mb-4 h-[52px]">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="inline-block px-2 py-0.5 bg-[var(--primary-lightest)] text-[var(--primary)] rounded text-xs font-semibold">
                        {tag.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-[var(--background-tertiary)] text-[var(--foreground-muted)] rounded whitespace-nowrap">
                        {tag.category}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--foreground-muted)] leading-snug line-clamp-2">{tag.description}</p>
                  </div>
                  <div className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                    tag.trend > 0 ? 'bg-[var(--success-lightest)] text-[var(--success)]' : 'bg-[var(--error-lightest)] text-[var(--error)]'
                  }`}>
                    {tag.trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(tag.trend)}%
                  </div>
                </div>

                {/* Compliance Score */}
                <div className="mb-4">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-3xl font-semibold text-[var(--foreground)] tracking-tight">{tag.compliance}%</span>
                    <span className="text-xs text-[var(--foreground-muted)]">Compliance</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out bg-[var(--primary)]"
                      style={{ width: `${tag.compliance}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-1.5">
                  <div className="bg-[var(--background-secondary)] rounded-lg p-2 text-center">
                    <p className="text-base font-semibold text-[var(--foreground)]">{tag.programs}</p>
                    <p className="text-[10px] text-[var(--foreground-muted)]">Programs</p>
                  </div>
                  <div className="bg-[var(--background-secondary)] rounded-lg p-2 text-center">
                    <p className="text-base font-semibold text-[var(--foreground)]">{tag.requirements}</p>
                    <p className="text-[10px] text-[var(--foreground-muted)]">Reqs</p>
                  </div>
                  <div className="bg-[var(--background-secondary)] rounded-lg p-2 text-center relative">
                    <p className="text-base font-semibold text-[var(--foreground)]">{tag.obligations}</p>
                    <p className="text-[10px] text-[var(--foreground-muted)]">Obls</p>
                    {tag.obligations > 0 && (
                      <Zap size={8} className="absolute top-1 right-1 text-[var(--accent)]" />
                    )}
                  </div>
                  <div className="bg-[var(--background-secondary)] rounded-lg p-2 text-center">
                    <p className="text-base font-semibold text-[var(--foreground)]">{tag.controls}</p>
                    <p className="text-[10px] text-[var(--foreground-muted)]">Controls</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3D Compliance Area Coverage */}
      <div className="animate-fade-in-up delay-6 mb-8">
        <ComplianceAreaCoverage3D areas={complianceAreas} />
      </div>

      {/* Test Status Row */}
      <div className="animate-fade-in-up delay-7 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Test Results Card */}
        <div className="bg-white rounded-lg border border-[var(--border)] p-6">
          <h2 className="text-h4 font-semibold text-[var(--foreground)] mb-5">Test & Procedure Results</h2>

          {/* Test Status Bars */}
          <div className="space-y-5">
            {[
              { label: 'Passed', icon: CheckCircle2, value: summaryStats.testsPassed, color: 'success' },
              { label: 'Failed', icon: AlertCircle, value: summaryStats.testsFailed, color: 'error' },
              { label: 'Pending', icon: Clock, value: summaryStats.testsPending, color: 'warning' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <item.icon size={18} className={`text-[var(--${item.color})]`} />
                    <span className="text-p2 font-medium text-[var(--foreground)]">{item.label}</span>
                  </div>
                  <span className="text-p2 font-semibold text-[var(--foreground)]">{item.value} tests</span>
                </div>
                <div className="w-full h-3 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 bg-[var(--${item.color})]`}
                    style={{ width: `${(item.value / summaryStats.totalTests) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-p3 text-[var(--foreground-muted)]">
                    {Math.round((item.value / summaryStats.totalTests) * 100)}% of total
                  </span>
                  <span className="text-p3 font-medium text-[var(--foreground-muted)]">
                    {summaryStats.totalTests} total
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Pills */}
          <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-[var(--border)]">
            <div className="flex items-center gap-2 px-3 py-2 bg-[var(--success-lightest)] text-[var(--success)] rounded-lg">
              <span className="w-1.5 h-1.5 bg-[var(--success)] rounded-full" />
              <span className="text-p2 font-medium">{Math.round((summaryStats.testsPassed / summaryStats.totalTests) * 100)}% Pass Rate</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-[var(--error-lightest)] text-[var(--error)] rounded-lg">
              <span className="w-1.5 h-1.5 bg-[var(--error)] rounded-full" />
              <span className="text-p2 font-medium">{summaryStats.testsFailed} Need Attention</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-[var(--warning-lightest)] text-[var(--warning)] rounded-lg">
              <span className="w-1.5 h-1.5 bg-[var(--warning)] rounded-full" />
              <span className="text-p2 font-medium">{summaryStats.testsPending} Scheduled</span>
            </div>
          </div>
        </div>

        {/* Upcoming Tests */}
        <div className="bg-white rounded-lg border border-[var(--border)] p-6">
          <h2 className="text-h4 font-semibold text-[var(--foreground)] mb-5">Upcoming Tests</h2>
          <div className="space-y-3">
            {[
              { name: 'ISMS Access Control Audit', date: 'Dec 24', authority: 'ISO', program: 'ISO 27001' },
              { name: 'Breach Notification Test', date: 'Dec 26', authority: 'EU', program: 'GDPR', isObligation: true },
              { name: 'Outsourcing Risk Review', date: 'Dec 28', authority: 'RBI', program: 'RBI IT Gov' },
            ].map((test, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-[var(--background-secondary)] rounded-xl hover:bg-[var(--primary-lightest)] hover:shadow-sm transition-all cursor-pointer group">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-[var(--border)] relative flex-shrink-0">
                  <FlaskConical size={18} className="text-[var(--primary)]" />
                  {test.isObligation && (
                    <Zap size={11} className="absolute -top-1 -right-1 text-[var(--accent)]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-p2 font-medium text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors">{test.name}</p>
                  <p className="text-p3 text-[var(--foreground-muted)] mt-0.5">{test.date} • {test.authority}</p>
                </div>
                <ChevronRight size={16} className="text-[var(--foreground-muted)] group-hover:text-[var(--primary)] transition-colors flex-shrink-0" />
              </div>
            ))}
          </div>
          <Link href="/tests" className="block w-full mt-5 py-2.5 text-p2 font-medium text-center text-[var(--primary)] bg-[var(--primary-lightest)] rounded-xl hover:bg-[var(--primary)] hover:text-white transition-all">
            View All Tests
          </Link>
        </div>
      </div>

      {/* Compliance Score Modal */}
      <ComplianceScoreModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        title="Organization"
        data={{
          overallScore: summaryStats.overallCompliance,
          trend: 2.4,
          programs: summaryStats.totalPrograms,
          requirements: {
            total: summaryStats.citationsRequirements,
            compliant: Math.round(summaryStats.citationsRequirements * 0.86),
            atRisk: Math.round(summaryStats.citationsRequirements * 0.10),
            nonCompliant: Math.round(summaryStats.citationsRequirements * 0.04)
          },
          controls: {
            total: summaryStats.totalControls,
            effective: Math.round(summaryStats.totalControls * 0.85),
            partiallyEffective: Math.round(summaryStats.totalControls * 0.11),
            ineffective: Math.round(summaryStats.totalControls * 0.04)
          },
          tests: {
            total: summaryStats.totalTests,
            passed: summaryStats.testsPassed,
            failed: summaryStats.testsFailed,
            pending: summaryStats.testsPending
          },
          obligations: {
            total: summaryStats.citationsObligations,
            completed: Math.round(summaryStats.citationsObligations * 0.76),
            inProgress: Math.round(summaryStats.citationsObligations * 0.18),
            overdue: Math.round(summaryStats.citationsObligations * 0.06)
          },
        }}
      />
    </div>
  );
}
