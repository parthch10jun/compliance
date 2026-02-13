'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search, ChevronRight, Plus, Calendar, Clock, CheckCircle2, AlertTriangle,
  PlayCircle, FileText, Users, Building2, Filter, LayoutGrid, List
} from 'lucide-react';
import { assessments, programs } from '@/lib/data/mock-data';
import { formatDate, isOverdue } from '@/lib/utils';

type StatusFilter = 'all' | 'Scheduled' | 'In Progress' | 'Under Review' | 'Completed' | 'Overdue';
type TypeFilter = 'all' | 'Self-Assessment' | 'Internal Audit' | 'External Audit' | 'Regulatory Exam';

export default function AssessmentsDashboard() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssessments = assessments.filter(a => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesType = typeFilter === 'all' || a.type === typeFilter;
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.programName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const statusStats = {
    scheduled: assessments.filter(a => a.status === 'Scheduled').length,
    inProgress: assessments.filter(a => a.status === 'In Progress').length,
    underReview: assessments.filter(a => a.status === 'Under Review').length,
    completed: assessments.filter(a => a.status === 'Completed').length,
    overdue: assessments.filter(a => a.status === 'Overdue').length,
  };

  const totalFindings = assessments.reduce((acc, a) => acc + a.findings, 0);
  const criticalFindings = assessments.reduce((acc, a) => acc + a.criticalFindings, 0);

  // Group assessments by month for calendar view
  const upcomingAssessments = assessments.filter(a => a.status === 'Scheduled' || a.status === 'In Progress');
  const overdueAssessments = assessments.filter(a => a.status === 'Overdue');

  return (
    <div>
      {/* Header */}
      <div className="animate-fade-in-up mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">Assessments Dashboard</h1>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">Schedule and track compliance assessments</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors text-sm font-medium">
            <Plus size={16} />
            Schedule Assessment
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="animate-fade-in-up delay-1 grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-xl p-5 text-white">
          <p className="text-white/70 text-xs font-medium mb-1">Total Assessments</p>
          <p className="text-3xl font-bold tracking-tight">{assessments.length}</p>
          <p className="text-xs text-white/60 mt-2">This year</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-xs font-medium">Scheduled</p>
            <Calendar size={14} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold tracking-tight text-blue-600">{statusStats.scheduled}</p>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">Upcoming</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-xs font-medium">In Progress</p>
            <PlayCircle size={14} className="text-[var(--primary)]" />
          </div>
          <p className="text-3xl font-bold tracking-tight text-[var(--primary)]">{statusStats.inProgress}</p>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">Active now</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-xs font-medium">Completed</p>
            <CheckCircle2 size={14} className="text-emerald-500" />
          </div>
          <p className="text-3xl font-bold tracking-tight text-emerald-600">{statusStats.completed}</p>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">This year</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-xs font-medium">Overdue</p>
            <AlertTriangle size={14} className="text-red-500" />
          </div>
          <p className="text-3xl font-bold tracking-tight text-red-600">{statusStats.overdue}</p>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">Needs attention</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-xs font-medium">Findings</p>
            <FileText size={14} className="text-amber-500" />
          </div>
          <p className="text-3xl font-bold tracking-tight text-amber-600">{totalFindings}</p>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">{criticalFindings} critical</p>
        </div>
      </div>

      {/* Overdue Alert */}
      {overdueAssessments.length > 0 && (
        <div className="animate-fade-in-up delay-2 mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={16} className="text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 mb-1">{overdueAssessments.length} Overdue Assessment{overdueAssessments.length > 1 ? 's' : ''}</h3>
              <div className="space-y-2">
                {overdueAssessments.map(a => (
                  <div key={a.id} className="flex items-center justify-between text-sm">
                    <span className="text-red-700">{a.name}</span>
                    <span className="text-red-600 text-xs">Due: {new Date(a.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="animate-fade-in-up delay-3 flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
          <input
            type="text"
            placeholder="Search assessments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="px-3 py-2 bg-white border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="all">All Status</option>
          <option value="Scheduled">Scheduled</option>
          <option value="In Progress">In Progress</option>
          <option value="Under Review">Under Review</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
          className="px-3 py-2 bg-white border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="all">All Types</option>
          <option value="Self-Assessment">Self-Assessment</option>
          <option value="Internal Audit">Internal Audit</option>
          <option value="External Audit">External Audit</option>
          <option value="Regulatory Exam">Regulatory Exam</option>
        </select>
      </div>

      {/* Assessments Grid */}
      <div className="animate-fade-in-up delay-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssessments.map((assessment) => (
          <div key={assessment.id} className="bg-white rounded-xl border border-[var(--border)] p-6 hover:shadow-lg hover:border-[var(--primary-light)] transition-all cursor-pointer">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                assessment.type === 'External Audit' ? 'bg-purple-100 text-purple-700' :
                assessment.type === 'Internal Audit' ? 'bg-blue-100 text-blue-700' :
                assessment.type === 'Regulatory Exam' ? 'bg-red-100 text-red-700' :
                'bg-[var(--primary-lightest)] text-[var(--primary)]'
              }`}>
                {assessment.type}
              </span>
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                assessment.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                assessment.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                assessment.status === 'Scheduled' ? 'bg-gray-100 text-gray-700' :
                assessment.status === 'Under Review' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {assessment.status === 'Completed' && <CheckCircle2 size={10} />}
                {assessment.status === 'In Progress' && <PlayCircle size={10} />}
                {assessment.status === 'Overdue' && <AlertTriangle size={10} />}
                {assessment.status}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-base font-semibold text-[var(--foreground)] mb-2">{assessment.name}</h3>
            <p className="text-xs text-[var(--foreground-muted)] mb-4">{assessment.programName}</p>

            {/* Dates */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-p3">
                <span className="text-[var(--foreground-muted)]">Scheduled</span>
                <span className="text-[var(--foreground)]">{formatDate(assessment.scheduledDate)}</span>
              </div>
              <div className="flex items-center justify-between text-p3">
                <span className="text-[var(--foreground-muted)]">Due Date</span>
                <span className={`font-medium ${isOverdue(assessment.dueDate) ? 'text-red-600' : 'text-[var(--foreground)]'}`}>
                  {formatDate(assessment.dueDate)}
                </span>
              </div>
              {assessment.completedDate && (
                <div className="flex items-center justify-between text-p3">
                  <span className="text-[var(--foreground-muted)]">Completed</span>
                  <span className="text-emerald-600">{formatDate(assessment.completedDate)}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 pt-4 border-t border-[var(--border)]">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-[var(--foreground-muted)]" />
                <span className="text-xs text-[var(--foreground-muted)]">{assessment.assessor}</span>
              </div>
              {assessment.findings > 0 && (
                <div className="flex items-center gap-1 ml-auto">
                  <span className={`text-xs font-medium ${assessment.criticalFindings > 0 ? 'text-red-600' : 'text-amber-600'}`}>
                    {assessment.findings} finding{assessment.findings > 1 ? 's' : ''}
                  </span>
                  {assessment.criticalFindings > 0 && (
                    <span className="text-xs text-red-600">({assessment.criticalFindings} critical)</span>
                  )}
                </div>
              )}
              {assessment.complianceScore && (
                <div className="ml-auto">
                  <span className={`text-sm font-semibold ${
                    assessment.complianceScore >= 90 ? 'text-emerald-600' :
                    assessment.complianceScore >= 80 ? 'text-[var(--primary)]' :
                    assessment.complianceScore >= 70 ? 'text-amber-600' : 'text-red-600'
                  }`}>{assessment.complianceScore}%</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAssessments.length === 0 && (
        <div className="animate-fade-in-up delay-4 flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-4">
            <Calendar size={32} className="text-[var(--foreground-muted)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">No assessments found</h3>
          <p className="text-sm text-[var(--foreground-muted)]">Try adjusting your filters or schedule a new assessment</p>
        </div>
      )}
    </div>
  );
}

