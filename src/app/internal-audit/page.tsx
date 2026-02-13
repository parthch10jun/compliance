'use client';

import { useState } from 'react';
import {
  Search, Shield, Plus, Calendar, AlertTriangle, CheckCircle2,
  Clock, TrendingUp, FileText, Users, BarChart3, Target
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { formatDateShort, formatDateRange } from '@/lib/utils';
import { internalAudits, auditFindings, gapAnalyses } from '@/lib/data/internal-audits';
import NewAuditModal from '@/components/NewAuditModal';

const statusColors = {
  Planning: 'bg-blue-100 text-blue-700 border-blue-200',
  'In Progress': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Review: 'bg-purple-100 text-purple-700 border-purple-200',
  Completed: 'bg-green-100 text-green-700 border-green-200',
  Cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
};

const auditTypeColors = {
  'Compliance Audit': 'bg-blue-50 text-blue-700',
  'Control Testing': 'bg-green-50 text-green-700',
  'Gap Analysis': 'bg-orange-50 text-orange-700',
  'Risk Assessment': 'bg-red-50 text-red-700',
  'Process Review': 'bg-purple-50 text-purple-700',
};

const severityColors = {
  Critical: 'bg-red-100 text-red-800 border-red-300',
  High: 'bg-orange-100 text-orange-800 border-orange-300',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Low: 'bg-blue-100 text-blue-800 border-blue-300',
};

export default function InternalAuditDashboard() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isNewAuditModalOpen, setIsNewAuditModalOpen] = useState(false);

  const handleCreateAudit = (auditData: any) => {
    console.log('Creating new audit:', auditData);
    // In a real app, this would make an API call to create the audit
    // For now, we'll just log it and show a success message
    alert(`Audit "${auditData.title}" created successfully!`);
  };

  // Calculate metrics
  const totalAudits = internalAudits.length;
  const activeAudits = internalAudits.filter(a => a.status === 'In Progress').length;
  const totalFindings = auditFindings.length;
  const openFindings = auditFindings.filter(f => f.status === 'Open' || f.status === 'In Progress').length;
  const criticalFindings = auditFindings.filter(f => f.severity === 'Critical').length;
  const avgComplianceScore = Math.round(
    internalAudits.filter(a => a.complianceScore).reduce((sum, a) => sum + (a.complianceScore || 0), 0) / 
    internalAudits.filter(a => a.complianceScore).length
  );

  // Filter audits
  const filteredAudits = internalAudits.filter(audit => {
    const matchesSearch = audit.title.toLowerCase().includes(search.toLowerCase()) ||
                         audit.framework.toLowerCase().includes(search.toLowerCase()) ||
                         audit.programName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || audit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Recent findings
  const recentFindings = auditFindings.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Internal Audit</h1>
          <p className="text-sm text-gray-600 mt-1">
            Conduct compliance audits, test controls, and identify gaps
          </p>
        </div>
        <button
          onClick={() => setIsNewAuditModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          New Audit
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield size={24} className="text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              Active
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{activeAudits}</p>
          <p className="text-sm text-gray-600 mt-1">Audits in Progress</p>
          <p className="text-xs text-gray-500 mt-2">of {totalAudits} total audits</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={24} className="text-orange-600" />
            </div>
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
              {criticalFindings} Critical
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{openFindings}</p>
          <p className="text-sm text-gray-600 mt-1">Open Findings</p>
          <p className="text-xs text-gray-500 mt-2">of {totalFindings} total findings</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
              Avg Score
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{avgComplianceScore}%</p>
          <p className="text-sm text-gray-600 mt-1">Compliance Score</p>
          <p className="text-xs text-gray-500 mt-2">across all audits</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target size={24} className="text-purple-600" />
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
              Gap Analysis
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{gapAnalyses.length}</p>
          <p className="text-sm text-gray-600 mt-1">Gap Assessments</p>
          <p className="text-xs text-gray-500 mt-2">completed</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search audits by title, framework, or program..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Audits - 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Active Audits</h2>
            <span className="text-sm text-gray-600">{filteredAudits.length} audits</span>
          </div>

          <div className="space-y-3">
            {filteredAudits.map((audit) => (
              <Link
                key={audit.id}
                href={`/internal-audit/${audit.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={clsx('text-xs px-2 py-1 rounded font-medium', auditTypeColors[audit.auditType])}>
                        {audit.auditType}
                      </span>
                      <span className={clsx('text-xs px-2 py-1 rounded border font-medium', statusColors[audit.status])}>
                        {audit.status}
                      </span>
                      {audit.complianceScore && (
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 font-medium">
                          {audit.complianceScore}% Compliant
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {audit.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{audit.description}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Shield size={12} />
                        {audit.framework}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDateRange(audit.plannedStartDate, audit.plannedEndDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {audit.leadAuditor}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">Requirements Tested</span>
                      <span className="font-medium text-gray-900">
                        {audit.requirementsTested}/{audit.requirementsInScope}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${(audit.requirementsTested / audit.requirementsInScope) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">Controls Tested</span>
                      <span className="font-medium text-gray-900">
                        {audit.controlsTested}/{audit.controlsInScope}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${(audit.controlsTested / audit.controlsInScope) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Findings Summary */}
                {audit.totalFindings > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-600">Findings:</span>
                      {audit.criticalFindings > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 font-medium">
                          {audit.criticalFindings} Critical
                        </span>
                      )}
                      {audit.highFindings > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded bg-orange-100 text-orange-700 font-medium">
                          {audit.highFindings} High
                        </span>
                      )}
                      {audit.mediumFindings > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 font-medium">
                          {audit.mediumFindings} Medium
                        </span>
                      )}
                      {audit.lowFindings > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
                          {audit.lowFindings} Low
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar - Recent Findings */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Findings</h2>
            <div className="space-y-3">
              {recentFindings.map((finding) => (
                <div
                  key={finding.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={clsx('text-xs px-2 py-1 rounded border font-medium', severityColors[finding.severity])}>
                      {finding.severity}
                    </span>
                    <span className="text-xs text-gray-500">{finding.findingNumber}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{finding.title}</h4>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{finding.observation}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Due: {formatDateShort(finding.dueDate)}</span>
                    <span className={clsx(
                      'px-2 py-0.5 rounded font-medium',
                      finding.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                      finding.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    )}>
                      {finding.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gap Analysis Summary */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Gap Analysis</h2>
            <div className="space-y-3">
              {gapAnalyses.map((gap) => (
                <div
                  key={gap.id}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">{gap.programName}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Compliance</span>
                      <span className="font-semibold text-green-600">{gap.compliancePercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${gap.compliancePercentage}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100">
                      <div className="text-center">
                        <p className="text-lg font-bold text-red-600">{gap.criticalGaps}</p>
                        <p className="text-xs text-gray-600">Critical Gaps</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-orange-600">{gap.highPriorityGaps}</p>
                        <p className="text-xs text-gray-600">High Priority</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Audit Modal */}
      <NewAuditModal
        isOpen={isNewAuditModalOpen}
        onClose={() => setIsNewAuditModalOpen(false)}
        onSubmit={handleCreateAudit}
      />
    </div>
  );
}

