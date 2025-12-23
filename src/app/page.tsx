'use client';

import { useState } from 'react';
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
import { PageHeader, SearchFilterBar } from '@/components';

// Business Units
const businessUnits = ['All Business Units', 'Retail Banking', 'Wealth Management', 'Corporate Banking', 'Operations'];

// Authorities/Regulators with their data
const authorities = [
  {
    id: 'rbi',
    name: 'RBI',
    fullName: 'Reserve Bank of India',
    type: 'Regulator',
    compliance: 91,
    programs: 4,
    citations: 156,
    citationsWithObligations: 24,
    controls: 142,
    tests: 186,
    evidence: 312,
    trend: 3.2,
  },
  {
    id: 'iso',
    name: 'ISO',
    fullName: 'International Organization for Standardization',
    type: 'Standards Body',
    compliance: 88,
    programs: 3,
    citations: 114,
    citationsWithObligations: 0,
    controls: 98,
    tests: 124,
    evidence: 198,
    trend: 2.1,
  },
  {
    id: 'gdpr',
    name: 'EU',
    fullName: 'European Commission',
    type: 'Regulator',
    compliance: 85,
    programs: 2,
    citations: 88,
    citationsWithObligations: 32,
    controls: 76,
    tests: 98,
    evidence: 156,
    trend: -1.4,
  },
  {
    id: 'sdaia',
    name: 'SDAIA',
    fullName: 'Saudi Data & AI Authority',
    type: 'Regulator',
    compliance: 78,
    programs: 1,
    citations: 45,
    citationsWithObligations: 12,
    controls: 52,
    tests: 68,
    evidence: 94,
    trend: 5.8,
  },
];

// Summary stats
const summaryStats = {
  overallCompliance: 87,
  totalAuthorities: authorities.length,
  totalPrograms: 10,
  totalCitations: 403,
  citationsRequirements: 335,
  citationsObligations: 68,
  totalControls: 368,
  totalTests: 476,
  totalEvidence: 760,
  testsPassed: 396,
  testsFailed: 42,
  testsPending: 38,
};

// Filter options
const statusOptions = ['All Status', 'Compliant', 'At Risk', 'Non-Compliant'];
const programOptions = ['All Programs', 'ISO 27001', 'GDPR', 'RBI CSF', 'PDPL'];

export default function Home() {
  const [selectedBU, setSelectedBU] = useState('All Business Units');
  const [buDropdownOpen, setBuDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedProgram, setSelectedProgram] = useState('All Programs');
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Active filters count
  const activeFiltersCount = [selectedStatus, selectedProgram, dateRange].filter(
    f => !f.includes('All') && f !== 'Last 30 days'
  ).length;

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Compliance Dashboard"
        description="Real-time compliance posture across your organization"
        action={
          <div className="relative z-50">
            <button
              onClick={() => setBuDropdownOpen(!buDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[var(--border)] rounded-xl text-p2 font-medium hover:border-[var(--primary)] hover:shadow-sm transition-all"
            >
              <Building2 size={18} className="text-[var(--primary)]" />
              <span>{selectedBU}</span>
              <ChevronDown size={16} className={`text-[var(--foreground-muted)] transition-transform ${buDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {buDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-[var(--border)] rounded-xl shadow-lg z-50 overflow-hidden">
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

      {/* Overall Compliance Score - Hero Card */}
      <div className="animate-fade-in-up delay-1 relative z-10 overflow-hidden bg-gradient-to-r from-[var(--primary-dark)] via-[var(--primary)] to-[var(--primary-light)] rounded-xl p-8 mb-8 shadow-lg hover:shadow-xl transition-shadow">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern id=%22grid%22 width=%2220%22 height=%2220%22 patternUnits=%22userSpaceOnUse%22%3E%3Cpath d=%22M 20 0 L 0 0 0 20%22 fill=%22none%22 stroke=%22rgba(255,255,255,0.05)%22 stroke-width=%221%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22url(%23grid)%22/%3E%3C/svg%3E')] opacity-50" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-white/70 text-p2 font-medium uppercase tracking-wider mb-2">Overall Compliance Score</p>
            <div className="flex items-baseline gap-4">
              <span className="text-6xl font-bold text-white tracking-tight">{summaryStats.overallCompliance}%</span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/15 backdrop-blur-sm rounded-full">
                <TrendingUp size={14} className="text-emerald-300" />
                <span className="text-emerald-300 text-p2 font-semibold">+2.4%</span>
              </div>
            </div>
            <p className="text-white/60 text-p2 mt-3">Compared to previous period</p>
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
                    strokeDasharray={`${(summaryStats.testsPassed / summaryStats.totalTests) * 251} 251`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-white text-h4 font-bold">
                  {Math.round((summaryStats.testsPassed / summaryStats.totalTests) * 100)}%
                </span>
              </div>
              <p className="text-white/60 text-p3 mt-2 font-medium">Tests Passed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hierarchy Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { href: '/authorities', icon: Landmark, label: 'Authorities', value: authorities.length, color: 'teal', delay: 'delay-2' },
          { href: '/programs', icon: BookOpen, label: 'Programs', value: summaryStats.totalPrograms, color: 'cyan', delay: 'delay-2' },
          { href: '/citations', icon: FileText, label: 'Citations', value: summaryStats.totalCitations, color: 'slate', delay: 'delay-3', badge: { value: summaryStats.citationsObligations, label: 'obligations' } },
          { href: '/controls', icon: Shield, label: 'Controls', value: summaryStats.totalControls, color: 'emerald', delay: 'delay-3' },
          { href: '/tests', icon: FlaskConical, label: 'Tests', value: summaryStats.totalTests, color: 'amber', delay: 'delay-4', pending: summaryStats.testsPending },
          { href: '/evidence', icon: FileCheck, label: 'Evidence', value: summaryStats.totalEvidence, color: 'stone', delay: 'delay-4' },
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

      {/* Authorities / Regulators Cards */}
      <div className="animate-fade-in-up delay-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--foreground)]">Authorities & Regulators</h2>
          <Link href="/authorities" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1 font-medium">
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {authorities.map((auth) => (
            <Link key={auth.id} href={`/authorities/${auth.id}`} className="group">
              <div className="card-hover bg-white rounded-lg border border-[var(--border)] p-5 flex flex-col">
                {/* Header - Fixed Height */}
                <div className="flex items-start justify-between mb-4 h-[52px]">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="inline-block px-2 py-0.5 bg-[var(--primary-lightest)] text-[var(--primary)] rounded text-xs font-semibold">
                        {auth.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-[var(--background-tertiary)] text-[var(--foreground-muted)] rounded whitespace-nowrap">
                        {auth.type}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--foreground-muted)] leading-snug line-clamp-2">{auth.fullName}</p>
                  </div>
                  <div className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                    auth.trend > 0 ? 'bg-[var(--success-lightest)] text-[var(--success)]' : 'bg-[var(--error-lightest)] text-[var(--error)]'
                  }`}>
                    {auth.trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(auth.trend)}%
                  </div>
                </div>

                {/* Compliance Score */}
                <div className="mb-4">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-3xl font-semibold text-[var(--foreground)] tracking-tight">{auth.compliance}%</span>
                    <span className="text-xs text-[var(--foreground-muted)]">Compliance</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out bg-[var(--primary)]"
                      style={{ width: `${auth.compliance}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="bg-[var(--background-secondary)] rounded-lg p-2 text-center">
                    <p className="text-base font-semibold text-[var(--foreground)]">{auth.programs}</p>
                    <p className="text-[10px] text-[var(--foreground-muted)]">Programs</p>
                  </div>
                  <div className="bg-[var(--background-secondary)] rounded-lg p-2 text-center">
                    <p className="text-base font-semibold text-[var(--foreground)]">{auth.citations}</p>
                    <p className="text-[10px] text-[var(--foreground-muted)]">Citations</p>
                  </div>
                  <div className="bg-[var(--background-secondary)] rounded-lg p-2 text-center relative">
                    <p className="text-base font-semibold text-[var(--foreground)]">{auth.citationsWithObligations}</p>
                    <p className="text-[10px] text-[var(--foreground-muted)]">Obligations</p>
                    {auth.citationsWithObligations > 0 && (
                      <Zap size={8} className="absolute top-1 right-1 text-[var(--accent)]" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                  <div className="bg-[var(--background-secondary)] rounded-lg p-2 text-center">
                    <p className="text-base font-semibold text-[var(--foreground)]">{auth.controls}</p>
                    <p className="text-[10px] text-[var(--foreground-muted)]">Controls</p>
                  </div>
                  <div className="bg-[var(--background-secondary)] rounded-lg p-2 text-center">
                    <p className="text-base font-semibold text-[var(--foreground)]">{auth.tests}</p>
                    <p className="text-[10px] text-[var(--foreground-muted)]">Tests</p>
                  </div>
                  <div className="bg-[var(--background-secondary)] rounded-lg p-2 text-center">
                    <p className="text-base font-semibold text-[var(--foreground)]">{auth.evidence}</p>
                    <p className="text-[10px] text-[var(--foreground-muted)]">Evidence</p>
                  </div>
                </div>

                {/* Hover action */}
                <div className="mt-4 flex items-center justify-center gap-1.5 text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">View Details</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Test Status Row */}
      <div className="animate-fade-in-up delay-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
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
    </div>
  );
}
