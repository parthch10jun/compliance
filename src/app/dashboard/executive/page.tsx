'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp, TrendingDown, ChevronRight, ArrowUpRight, Building2,
  AlertTriangle, CheckCircle2, Clock, XCircle, Shield, BookOpen,
  Calendar, FileText, Landmark, BarChart3, PieChart, Activity
} from 'lucide-react';
import { authorities, programs, issues, assessments, dashboardMetrics } from '@/lib/data/mock-data';
import { formatDate } from '@/lib/utils';

// Compliance trend data (last 6 months)
const complianceTrend = [
  { month: 'Jul', score: 82 }, { month: 'Aug', score: 84 }, { month: 'Sep', score: 83 },
  { month: 'Oct', score: 85 }, { month: 'Nov', score: 86 }, { month: 'Dec', score: 87 },
];

// Risk distribution
const riskDistribution = [
  { level: 'Critical', count: 2, color: 'bg-red-500' },
  { level: 'High', count: 5, color: 'bg-orange-500' },
  { level: 'Medium', count: 12, color: 'bg-amber-500' },
  { level: 'Low', count: 8, color: 'bg-emerald-500' },
];

export default function ExecutiveDashboard() {
  const criticalIssues = issues.filter(i => i.severity === 'Critical' && i.status !== 'Closed');
  const overdueAssessments = assessments.filter(a => a.status === 'Overdue');
  const upcomingAssessments = assessments.filter(a => a.status === 'Scheduled').slice(0, 3);

  return (
    <div>
      {/* Header */}
      <div className="animate-fade-in-up mb-8">
        <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-2">
          <Link href="/" className="hover:text-[var(--primary)]">Dashboard</Link>
          <ChevronRight size={14} />
          <span className="text-[var(--foreground)]">Executive View</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">Executive Dashboard</h1>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">Board-level compliance overview and key risk indicators</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
            <Calendar size={14} />
            <span>Last updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="animate-fade-in-up delay-1 grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Overall Compliance */}
        <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/70 text-sm font-medium">Overall Compliance</span>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
              <TrendingUp size={12} />
              +{dashboardMetrics.complianceTrend}%
            </div>
          </div>
          <p className="text-4xl font-bold tracking-tight">{dashboardMetrics.overallCompliance}%</p>
          <p className="text-white/60 text-xs mt-2">vs. 84.6% last quarter</p>
        </div>

        {/* Critical Issues */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[var(--foreground-muted)] text-sm font-medium">Critical Issues</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${criticalIssues.length > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {criticalIssues.length > 0 ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
            </div>
          </div>
          <p className={`text-4xl font-bold tracking-tight ${criticalIssues.length > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{criticalIssues.length}</p>
          <p className="text-[var(--foreground-muted)] text-xs mt-2">Requires immediate attention</p>
        </div>

        {/* Overdue Assessments */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[var(--foreground-muted)] text-sm font-medium">Overdue Assessments</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${overdueAssessments.length > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <Clock size={16} />
            </div>
          </div>
          <p className={`text-4xl font-bold tracking-tight ${overdueAssessments.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{overdueAssessments.length}</p>
          <p className="text-[var(--foreground-muted)] text-xs mt-2">Past due date</p>
        </div>

        {/* Control Effectiveness */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[var(--foreground-muted)] text-sm font-medium">Control Effectiveness</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--primary-lightest)] text-[var(--primary)]">
              <Shield size={16} />
            </div>
          </div>
          <p className="text-4xl font-bold tracking-tight text-[var(--foreground)]">{Math.round((dashboardMetrics.effectiveControls / dashboardMetrics.totalControls) * 100)}%</p>
          <p className="text-[var(--foreground-muted)] text-xs mt-2">{dashboardMetrics.effectiveControls} of {dashboardMetrics.totalControls} effective</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Compliance Trend Chart */}
        <div className="animate-fade-in-up delay-2 lg:col-span-2 bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-[var(--foreground)]">Compliance Trend</h2>
              <p className="text-sm text-[var(--foreground-muted)]">6-month compliance score progression</p>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-[var(--success-lightest)] text-[var(--success)] rounded-lg text-sm font-medium">
              <TrendingUp size={14} />
              +5% YTD
            </div>
          </div>
          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between h-48 gap-4">
            {complianceTrend.map((item, idx) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="relative w-full flex justify-center">
                  <div 
                    className={`w-12 rounded-t-lg transition-all duration-500 ${idx === complianceTrend.length - 1 ? 'bg-[var(--primary)]' : 'bg-[var(--primary-lightest)]'}`}
                    style={{ height: `${(item.score / 100) * 160}px` }}
                  >
                    <span className={`absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-semibold ${idx === complianceTrend.length - 1 ? 'text-[var(--primary)]' : 'text-[var(--foreground-muted)]'}`}>
                      {item.score}%
                    </span>
                  </div>
                </div>
                <span className="text-xs text-[var(--foreground-muted)]">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="animate-fade-in-up delay-3 bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-[var(--foreground)]">Risk Distribution</h2>
            <Link href="/issues" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {riskDistribution.map((risk) => (
              <div key={risk.level}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-[var(--foreground)]">{risk.level}</span>
                  <span className="text-sm text-[var(--foreground-muted)]">{risk.count} issues</span>
                </div>
                <div className="w-full h-2 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${risk.color}`} style={{ width: `${(risk.count / 27) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-[var(--border)]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--foreground-muted)]">Total Open Issues</span>
              <span className="font-semibold text-[var(--foreground)]">27</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance by Authority & Program Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Compliance by Authority */}
        <div className="animate-fade-in-up delay-4 bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-[var(--foreground)]">Compliance by Authority</h2>
            <Link href="/authorities" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {authorities.map((auth) => (
              <div key={auth.id} className="flex items-center gap-4">
                <div className="w-16 flex-shrink-0">
                  <span className="inline-block px-2 py-1 bg-[var(--primary-lightest)] text-[var(--primary)] rounded text-xs font-semibold">
                    {auth.name}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[var(--foreground-muted)]">{auth.fullName}</span>
                    <span className="text-sm font-semibold text-[var(--foreground)]">{auth.compliance}%</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${auth.compliance >= 90 ? 'bg-emerald-500' : auth.compliance >= 80 ? 'bg-[var(--primary)]' : auth.compliance >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${auth.compliance}%` }}
                    />
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${auth.trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {auth.trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {Math.abs(auth.trend)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Program Performance */}
        <div className="animate-fade-in-up delay-5 bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-[var(--foreground)]">Program Performance</h2>
            <Link href="/programs" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {programs.slice(0, 5).map((pgm) => (
              <Link key={pgm.id} href={`/programs/${pgm.id}`} className="block group">
                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-[var(--foreground)] truncate">{pgm.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        pgm.riskRating === 'Critical' ? 'bg-red-100 text-red-700' :
                        pgm.riskRating === 'High' ? 'bg-orange-100 text-orange-700' :
                        pgm.riskRating === 'Medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {pgm.riskRating}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--foreground-muted)]">
                      <span>{pgm.authorityName}</span>
                      <span>•</span>
                      <span>{pgm.controls} controls</span>
                      <span>•</span>
                      <span>{pgm.tests} tests</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${pgm.complianceScore >= 90 ? 'text-emerald-600' : pgm.complianceScore >= 80 ? 'text-[var(--primary)]' : pgm.complianceScore >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
                      {pgm.complianceScore}%
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-[var(--foreground-light)] group-hover:text-[var(--primary)] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Items & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Issues */}
        <div className="animate-fade-in-up delay-6 bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertTriangle size={16} className="text-red-600" />
              </div>
              <h2 className="text-base font-semibold text-[var(--foreground)]">Critical Issues</h2>
            </div>
            <Link href="/issues" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          {criticalIssues.length > 0 ? (
            <div className="space-y-3">
              {criticalIssues.map((issue) => (
                <div key={issue.id} className="p-4 bg-red-50 border border-red-100 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-medium text-[var(--foreground)]">{issue.title}</h3>
                    <span className="text-xs text-red-600 font-medium">Due: {new Date(issue.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <p className="text-xs text-[var(--foreground-muted)] mb-2">{issue.description}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-white rounded text-[var(--foreground-muted)]">{issue.programName}</span>
                    <span className="text-[var(--foreground-muted)]">•</span>
                    <span className="text-[var(--foreground-muted)]">Assigned: {issue.assignedTo}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                <CheckCircle2 size={24} className="text-emerald-600" />
              </div>
              <p className="text-sm font-medium text-[var(--foreground)]">No Critical Issues</p>
              <p className="text-xs text-[var(--foreground-muted)]">All critical items have been resolved</p>
            </div>
          )}
        </div>

        {/* Upcoming Assessments */}
        <div className="animate-fade-in-up delay-6 bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary-lightest)] flex items-center justify-center">
                <Calendar size={16} className="text-[var(--primary)]" />
              </div>
              <h2 className="text-base font-semibold text-[var(--foreground)]">Upcoming Assessments</h2>
            </div>
            <Link href="/assessments" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingAssessments.map((assessment) => (
              <div key={assessment.id} className="p-4 bg-[var(--background-secondary)] rounded-lg hover:bg-[var(--primary-lightest)] transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-medium text-[var(--foreground)]">{assessment.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    assessment.type === 'External Audit' ? 'bg-purple-100 text-purple-700' :
                    assessment.type === 'Internal Audit' ? 'bg-blue-100 text-blue-700' :
                    'bg-[var(--primary-lightest)] text-[var(--primary)]'
                  }`}>
                    {assessment.type}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-p3 text-[var(--foreground-muted)]">
                  <span>{assessment.programName}</span>
                  <span>•</span>
                  <span>Scheduled: {formatDate(assessment.scheduledDate)}</span>
                </div>
              </div>
            ))}
          </div>
          {overdueAssessments.length > 0 && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-amber-600" />
                <span className="text-sm font-medium text-amber-700">{overdueAssessments.length} assessment{overdueAssessments.length > 1 ? 's' : ''} overdue</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

