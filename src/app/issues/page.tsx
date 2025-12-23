'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search, ChevronRight, Plus, AlertTriangle, CheckCircle2, Clock,
  XCircle, Filter, Users, Calendar, ArrowUpRight, TrendingUp, TrendingDown
} from 'lucide-react';
import { issues, programs } from '@/lib/data/mock-data';
import { formatDateShort, getDaysBetween, isOverdue } from '@/lib/utils';

type SeverityFilter = 'all' | 'Critical' | 'High' | 'Medium' | 'Low';
type StatusFilter = 'all' | 'Open' | 'In Progress' | 'Pending Review' | 'Resolved' | 'Closed';

export default function IssuesDashboard() {
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIssues = issues.filter(i => {
    const matchesSeverity = severityFilter === 'all' || i.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    const matchesSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          i.programName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  const severityStats = {
    critical: issues.filter(i => i.severity === 'Critical').length,
    high: issues.filter(i => i.severity === 'High').length,
    medium: issues.filter(i => i.severity === 'Medium').length,
    low: issues.filter(i => i.severity === 'Low').length,
  };

  const statusStats = {
    open: issues.filter(i => i.status === 'Open').length,
    inProgress: issues.filter(i => i.status === 'In Progress').length,
    pendingReview: issues.filter(i => i.status === 'Pending Review').length,
    resolved: issues.filter(i => i.status === 'Resolved').length,
    closed: issues.filter(i => i.status === 'Closed').length,
  };

  const openIssues = issues.filter(i => i.status !== 'Closed' && i.status !== 'Resolved');
  const overdueIssues = openIssues.filter(i => isOverdue(i.dueDate));

  return (
    <div>
      {/* Header */}
      <div className="animate-fade-in-up mb-8">
        <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-2">
          <Link href="/" className="hover:text-[var(--primary)]">Dashboard</Link>
          <ChevronRight size={14} />
          <span className="text-[var(--foreground)]">Issues</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">Issues Dashboard</h1>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">Track and manage compliance issues and findings</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors text-sm font-medium">
            <Plus size={16} />
            Report Issue
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="animate-fade-in-up delay-1 grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-xl p-5 text-white">
          <p className="text-white/70 text-xs font-medium mb-1">Total Issues</p>
          <p className="text-3xl font-bold tracking-tight">{issues.length}</p>
          <p className="text-xs text-white/60 mt-2">{openIssues.length} open</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-xs font-medium">Critical</p>
            <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center">
              <AlertTriangle size={12} className="text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold tracking-tight text-red-600">{severityStats.critical}</p>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">Immediate action</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-xs font-medium">High</p>
            <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center">
              <AlertTriangle size={12} className="text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold tracking-tight text-orange-600">{severityStats.high}</p>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">Priority attention</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-xs font-medium">Medium</p>
            <div className="w-6 h-6 rounded bg-amber-100 flex items-center justify-center">
              <Clock size={12} className="text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-bold tracking-tight text-amber-600">{severityStats.medium}</p>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">Monitor closely</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-xs font-medium">Overdue</p>
            <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center">
              <Clock size={12} className="text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold tracking-tight text-red-600">{overdueIssues.length}</p>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">Past due date</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-xs font-medium">Resolved</p>
            <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 size={12} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-bold tracking-tight text-emerald-600">{statusStats.resolved + statusStats.closed}</p>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">This quarter</p>
        </div>
      </div>

      {/* Status Pipeline */}
      <div className="animate-fade-in-up delay-2 bg-white rounded-xl border border-[var(--border)] p-6 mb-8">
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Issue Pipeline</h3>
        <div className="flex items-center gap-2">
          {[
            { label: 'Open', count: statusStats.open, color: 'bg-red-500' },
            { label: 'In Progress', count: statusStats.inProgress, color: 'bg-blue-500' },
            { label: 'Pending Review', count: statusStats.pendingReview, color: 'bg-amber-500' },
            { label: 'Resolved', count: statusStats.resolved, color: 'bg-emerald-500' },
          ].map((stage, idx) => (
            <div key={stage.label} className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                <span className="text-xs text-[var(--foreground-muted)]">{stage.label}</span>
                <span className="text-xs font-semibold text-[var(--foreground)]">{stage.count}</span>
              </div>
              <div className="h-2 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
                <div className={`h-full ${stage.color} rounded-full transition-all`} style={{ width: `${(stage.count / issues.length) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="animate-fade-in-up delay-3 flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
          <input
            type="text"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          />
        </div>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value as SeverityFilter)}
          className="px-3 py-2 bg-white border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="all">All Severity</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="px-3 py-2 bg-white border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="all">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Issues Table */}
      <div className="animate-fade-in-up delay-4 bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[var(--background-secondary)]">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Issue</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Program</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Severity</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Status</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Category</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Age</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredIssues.map((issue) => {
              const ageDays = getDaysBetween(issue.discoveredDate);
              const isIssueOverdue = isOverdue(issue.dueDate) && issue.status !== 'Closed' && issue.status !== 'Resolved';
              return (
                <tr key={issue.id} className="hover:bg-[var(--background-secondary)] transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-[var(--foreground)]">{issue.title}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">Assigned: {issue.assignedTo}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-0.5 bg-[var(--primary-lightest)] text-[var(--primary)] rounded text-xs font-semibold">
                      {issue.programName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                      issue.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                      issue.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                      issue.severity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {(issue.severity === 'Critical' || issue.severity === 'High') && <AlertTriangle size={10} />}
                      {issue.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                      issue.status === 'Open' ? 'bg-red-100 text-red-700' :
                      issue.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      issue.status === 'Pending Review' ? 'bg-amber-100 text-amber-700' :
                      issue.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {issue.status === 'Resolved' && <CheckCircle2 size={10} />}
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs text-[var(--foreground-muted)]">{issue.category}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-medium ${ageDays > 30 ? 'text-red-600' : ageDays > 14 ? 'text-amber-600' : 'text-[var(--foreground)]'}`}>
                      {ageDays}d
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-p3 ${isIssueOverdue ? 'text-red-600 font-medium' : 'text-[var(--foreground-muted)]'}`}>
                      {formatDateShort(issue.dueDate)}
                      {isIssueOverdue && ' ⚠'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-[var(--foreground-muted)] hover:text-[var(--primary)]">
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredIssues.length === 0 && (
        <div className="animate-fade-in-up delay-4 flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">No issues found</h3>
          <p className="text-sm text-[var(--foreground-muted)]">Great job! No issues match your current filters.</p>
        </div>
      )}
    </div>
  );
}

