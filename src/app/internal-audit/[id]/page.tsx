'use client';

import { use } from 'react';
import { 
  ArrowLeft, Calendar, Users, Shield, AlertTriangle, CheckCircle2, 
  Clock, FileText, Target, TrendingUp, Download, Edit
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { formatDateShort, formatDateRange } from '@/lib/utils';
import { internalAudits, auditFindings, gapAnalyses } from '@/lib/data/internal-audits';

const statusColors = {
  Planning: 'bg-blue-100 text-blue-700 border-blue-200',
  'In Progress': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Review: 'bg-purple-100 text-purple-700 border-purple-200',
  Completed: 'bg-green-100 text-green-700 border-green-200',
  Cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
};

const severityColors = {
  Critical: 'bg-red-100 text-red-800 border-red-300',
  High: 'bg-orange-100 text-orange-800 border-orange-300',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Low: 'bg-blue-100 text-blue-800 border-blue-300',
};

const ratingColors = {
  Satisfactory: 'bg-green-100 text-green-800',
  'Needs Improvement': 'bg-yellow-100 text-yellow-800',
  Unsatisfactory: 'bg-red-100 text-red-800',
};

export default function AuditDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const audit = internalAudits.find(a => a.id === id);
  const findings = auditFindings.filter(f => f.auditId === id);
  const gapAnalysis = gapAnalyses.find(g => g.auditId === id);

  if (!audit) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Audit Not Found</h2>
          <p className="text-gray-600 mb-4">The audit you're looking for doesn't exist.</p>
          <Link href="/internal-audit" className="text-blue-600 hover:text-blue-700">
            ← Back to Audits
          </Link>
        </div>
      </div>
    );
  }

  const criticalFindings = findings.filter(f => f.severity === 'Critical');
  const highFindings = findings.filter(f => f.severity === 'High');
  const openFindings = findings.filter(f => f.status === 'Open' || f.status === 'In Progress');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link 
          href="/internal-audit" 
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} />
          Back to Audits
        </Link>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={clsx('text-sm px-3 py-1 rounded border font-medium', statusColors[audit.status])}>
                {audit.status}
              </span>
              {audit.overallRating && (
                <span className={clsx('text-sm px-3 py-1 rounded font-medium', ratingColors[audit.overallRating])}>
                  {audit.overallRating}
                </span>
              )}
              {audit.complianceScore && (
                <span className="text-sm px-3 py-1 rounded bg-blue-100 text-blue-800 font-medium">
                  {audit.complianceScore}% Compliant
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{audit.title}</h1>
            <p className="text-gray-600">{audit.description}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Download size={16} />
              Export Report
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <Edit size={16} />
              Edit Audit
            </button>
          </div>
        </div>
      </div>

      {/* Key Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Framework</p>
              <p className="text-sm font-semibold text-gray-900">{audit.framework}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Timeline</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDateRange(audit.plannedStartDate, audit.plannedEndDate)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Lead Auditor</p>
              <p className="text-sm font-semibold text-gray-900">{audit.leadAuditor}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Findings</p>
              <p className="text-sm font-semibold text-gray-900">{audit.totalFindings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Audit Details & Findings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Audit Scope & Objectives */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Audit Scope & Objectives</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Scope</h3>
                <p className="text-sm text-gray-600">{audit.scope}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Objectives</h3>
                <ul className="space-y-2">
                  {audit.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Progress Metrics */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Testing Progress</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Requirements Tested</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {audit.requirementsTested} / {audit.requirementsInScope}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${(audit.requirementsTested / audit.requirementsInScope) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((audit.requirementsTested / audit.requirementsInScope) * 100)}% Complete
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Controls Tested</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {audit.controlsTested} / {audit.controlsInScope}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${(audit.controlsTested / audit.controlsInScope) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((audit.controlsTested / audit.controlsInScope) * 100)}% Complete
                </p>
              </div>
            </div>
          </div>

          {/* Findings */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Findings ({findings.length})</h2>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 font-medium">
                  {criticalFindings.length} Critical
                </span>
                <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700 font-medium">
                  {highFindings.length} High
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {findings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText size={48} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No findings recorded yet</p>
                </div>
              ) : (
                findings.map((finding) => (
                  <div
                    key={finding.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={clsx('text-xs px-2 py-1 rounded border font-medium', severityColors[finding.severity])}>
                          {finding.severity}
                        </span>
                        <span className="text-xs text-gray-500">{finding.findingNumber}</span>
                      </div>
                      <span className={clsx(
                        'text-xs px-2 py-1 rounded font-medium',
                        finding.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                        finding.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      )}>
                        {finding.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-gray-900 mb-2">{finding.title}</h3>

                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Observation: </span>
                        <span className="text-gray-600">{finding.observation}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Impact: </span>
                        <span className="text-gray-600">{finding.impact}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Recommendation: </span>
                        <span className="text-gray-600">{finding.recommendation}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-gray-600">Owner: <span className="font-medium text-gray-900">{finding.owner}</span></span>
                      <span className="text-gray-600">Due: <span className="font-medium text-gray-900">{formatDateShort(finding.dueDate)}</span></span>
                    </div>

                    {finding.remediationStatus && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
                        <span className="font-medium">Remediation: </span>{finding.remediationStatus}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Audit Team */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Audit Team</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 mb-1">Lead Auditor</p>
                <p className="text-sm font-medium text-gray-900">{audit.leadAuditor}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Audit Team</p>
                <div className="space-y-1">
                  {audit.auditTeam.map((member, index) => (
                    <p key={index} className="text-sm text-gray-700">{member}</p>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Auditee</p>
                <p className="text-sm font-medium text-gray-900">{audit.auditee}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Department</p>
                <p className="text-sm text-gray-700">{audit.department}</p>
              </div>
            </div>
          </div>

          {/* Gap Analysis */}
          {gapAnalysis && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Gap Analysis</h2>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Overall Compliance</span>
                  <span className="text-lg font-bold text-green-600">{gapAnalysis.compliancePercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full"
                    style={{ width: `${gapAnalysis.compliancePercentage}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{gapAnalysis.compliantRequirements}</p>
                  <p className="text-xs text-gray-600">Compliant</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{gapAnalysis.nonCompliantRequirements}</p>
                  <p className="text-xs text-gray-600">Non-Compliant</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <h3 className="text-sm font-medium text-gray-700">By Category</h3>
                {gapAnalysis.categoryBreakdown.map((cat, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{cat.category}</span>
                    <span className="font-medium text-gray-900">{cat.percentage}%</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-600 mb-1">Estimated Remediation</p>
                <p className="text-sm font-medium text-gray-900">{gapAnalysis.estimatedRemediationEffort}</p>
                {gapAnalysis.estimatedCost && (
                  <p className="text-sm text-gray-700 mt-1">{gapAnalysis.estimatedCost}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

