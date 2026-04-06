'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  Mail,
  Calendar,
  Building2,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  FileText,
  Target,
  Users,
  BarChart3,
  AlertCircle,
  Minus,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

interface ReportParams {
  params: {
    id: string;
  };
}

export default function ReportDetailPage({ params }: ReportParams) {
  const router = useRouter();
  const reportId = params.id;

  // Mock data - would come from API/database
  const report = {
    id: reportId,
    name: 'Q4 2024 Executive Summary',
    type: 'Executive Summary',
    generatedDate: '2024-12-20T10:30:00Z',
    generatedBy: 'Sarah Johnson',
    programs: [
      { id: 'prog-001', name: 'ISO 27001:2022', complianceScore: 89 },
      { id: 'prog-002', name: 'SOC 2 Type II', complianceScore: 92 },
      { id: 'prog-003', name: 'GDPR', complianceScore: 81 }
    ],
    overallCompliance: 87,
    trend: 'up' as const,
    period: 'Q4 2024 (Oct 1 - Dec 31, 2024)',
    
    // Executive Summary Metrics
    totalRequirements: 456,
    compliantRequirements: 398,
    partiallyCompliant: 42,
    nonCompliantRequirements: 16,
    
    totalControls: 523,
    effectiveControls: 467,
    partiallyEffectiveControls: 42,
    ineffectiveControls: 14,
    
    totalGaps: 28,
    criticalGaps: 3,
    highGaps: 8,
    mediumGaps: 12,
    lowGaps: 5,
    
    evidenceDue: [
      { name: 'Q1 Access Review Evidence', dueDate: '2025-01-15', program: 'SOC 2', status: 'upcoming' },
      { name: 'Annual Penetration Test Report', dueDate: '2025-01-20', program: 'ISO 27001', status: 'upcoming' },
      { name: 'Data Processing Agreements', dueDate: '2024-12-31', program: 'GDPR', status: 'overdue' },
    ],
    
    topRisks: [
      { id: 'risk-001', name: 'Inadequate MFA Coverage', severity: 'Critical', residualRisk: 'High', mitigation: 'In Progress' },
      { id: 'risk-002', name: 'Third-Party Vendor Risk', severity: 'High', residualRisk: 'Medium', mitigation: 'Planned' },
      { id: 'risk-003', name: 'Data Retention Policy Gaps', severity: 'High', residualRisk: 'Medium', mitigation: 'In Progress' },
    ],
    
    criticalGapsList: [
      { id: 'gap-001', control: 'CTL-IAM-001', description: 'MFA not enforced for 15 service accounts', targetDate: '2025-01-15', owner: 'IT Security', progress: 60 },
      { id: 'gap-002', control: 'CTL-DR-003', description: 'Disaster recovery plan not tested in 12 months', targetDate: '2025-01-10', owner: 'Infrastructure', progress: 30 },
      { id: 'gap-003', control: 'CTL-DATA-007', description: 'Data classification incomplete for 3 systems', targetDate: '2025-01-20', owner: 'Data Governance', progress: 45 },
    ],
    
    testingResults: {
      total: 486,
      passed: 422,
      failed: 38,
      pending: 26,
      passRate: 92
    },
    
    recommendations: [
      'Prioritize remediation of 3 critical gaps before Q1 2025 audit',
      'Complete pending MFA rollout to service accounts by Jan 15',
      'Schedule and execute overdue disaster recovery test',
      'Collect overdue GDPR evidence (Data Processing Agreements)',
      'Review and update third-party vendor risk assessments'
    ]
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <button
              onClick={() => router.push('/reports')}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-3"
            >
              <ArrowLeft size={16} />
              Back to Reports
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{report.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                Generated {new Date(report.generatedDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Users size={14} />
                by {report.generatedBy}
              </span>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                {report.type}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Mail size={18} />
              <span className="text-sm font-medium">Share</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors">
              <Download size={18} />
              <span className="text-sm font-medium">Download PDF</span>
            </button>
          </div>
        </div>

        {/* Report Period */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Reporting Period</p>
          <p className="text-base text-gray-900">{report.period}</p>
        </div>

        {/* Programs Covered */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Programs Covered</p>
          <div className="flex flex-wrap gap-2">
            {report.programs.map((program) => (
              <Link
                key={program.id}
                href={`/programs/${program.id}`}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors group"
              >
                <Building2 size={14} className="text-gray-600 group-hover:text-blue-600" />
                <span className="text-sm font-medium text-gray-900">{program.name}</span>
                <span className={clsx(
                  'text-xs font-semibold',
                  program.complianceScore >= 90 ? 'text-emerald-600' :
                  program.complianceScore >= 70 ? 'text-amber-600' :
                  'text-red-600'
                )}>{program.complianceScore}%</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Executive Summary Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BarChart3 size={24} className="text-indigo-600" />
          Executive Summary
        </h2>

        {/* Overall Compliance Score */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Overall Compliance Score</p>
              <div className="flex items-center gap-3">
                <span className="text-5xl font-bold text-indigo-600">{report.overallCompliance}%</span>
                {report.trend === 'up' && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                    <TrendingUp size={16} />
                    <span className="text-sm font-medium">+5% from Q3</span>
                  </div>
                )}
              </div>
            </div>
            <div className="w-32 h-32">
              {/* Circular progress indicator */}
              <svg className="transform -rotate-90" width="128" height="128">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#4f46e5"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - report.overallCompliance / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Requirements</span>
              <FileText size={18} className="text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{report.totalRequirements}</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-600 font-medium">{report.compliantRequirements} Compliant</span>
              <span className="text-red-600 font-medium">{report.nonCompliantRequirements} Non-Compliant</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Controls</span>
              <Shield size={18} className="text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{report.totalControls}</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-600 font-medium">{report.effectiveControls} Effective</span>
              <span className="text-red-600 font-medium">{report.ineffectiveControls} Ineffective</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Open Gaps</span>
              <AlertTriangle size={18} className="text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{report.totalGaps}</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-red-600 font-medium">{report.criticalGaps} Critical</span>
              <span className="text-orange-600 font-medium">{report.highGaps} High</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Test Pass Rate</span>
              <Target size={18} className="text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{report.testingResults.passRate}%</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-600 font-medium">{report.testingResults.passed}/{report.testingResults.total}</span>
              <span className="text-red-600 font-medium">{report.testingResults.failed} Failed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Gaps & Deficiencies */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle size={24} className="text-red-600" />
            Critical Gaps & Deficiencies
          </h2>
          <Link
            href="/controls?filter=gaps"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All Gaps
            <ChevronRight size={14} />
          </Link>
        </div>

        {report.criticalGapsList.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle2 size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No critical gaps identified</p>
          </div>
        ) : (
          <div className="space-y-4">
            {report.criticalGapsList.map((gap) => (
              <div key={gap.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-white border border-red-300 rounded text-xs font-mono text-red-700">
                        {gap.control}
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium border border-red-200">
                        Critical
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-2">{gap.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {gap.owner}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        Target: {new Date(gap.targetDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">Remediation Progress</span>
                    <span className="text-xs font-semibold text-gray-900">{gap.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={clsx(
                        'h-2 rounded-full transition-all',
                        gap.progress < 50 ? 'bg-red-500' :
                        gap.progress < 80 ? 'bg-amber-500' :
                        'bg-emerald-500'
                      )}
                      style={{ width: `${gap.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Risks */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <AlertCircle size={24} className="text-orange-600" />
            Top Compliance Risks
          </h2>
          <Link
            href="/risks"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View Risk Register
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="space-y-3">
          {report.topRisks.map((risk) => (
            <div key={risk.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">{risk.name}</h3>
                <div className="flex items-center gap-2">
                  <span className={clsx(
                    'px-2 py-1 rounded text-xs font-medium border',
                    getSeverityColor(risk.severity)
                  )}>
                    {risk.severity}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Residual Risk</p>
                  <span className={clsx(
                    'inline-flex px-2 py-1 rounded text-xs font-medium',
                    risk.residualRisk === 'Critical' || risk.residualRisk === 'High' ? 'bg-red-100 text-red-700' :
                    risk.residualRisk === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  )}>
                    {risk.residualRisk}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Mitigation Status</p>
                  <span className={clsx(
                    'inline-flex px-2 py-1 rounded text-xs font-medium',
                    risk.mitigation === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    risk.mitigation === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  )}>
                    {risk.mitigation}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Due Dates */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Clock size={24} className="text-blue-600" />
            Upcoming Evidence Due Dates
          </h2>
          <Link
            href="/evidence"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Manage Evidence
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="space-y-3">
          {report.evidenceDue.map((evidence, idx) => (
            <div key={idx} className={clsx(
              'border rounded-lg p-4',
              evidence.status === 'overdue' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
            )}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-medium text-gray-900">{evidence.name}</h3>
                    <span className={clsx(
                      'px-2 py-1 rounded text-xs font-medium',
                      evidence.status === 'overdue' ? 'bg-red-100 text-red-700 border border-red-200' :
                      'bg-blue-100 text-blue-700'
                    )}>
                      {evidence.status === 'overdue' ? 'Overdue' : 'Upcoming'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Building2 size={12} />
                      {evidence.program}
                    </span>
                    <span className={clsx(
                      'flex items-center gap-1 font-medium',
                      evidence.status === 'overdue' ? 'text-red-600' : 'text-gray-900'
                    )}>
                      <Calendar size={12} />
                      Due: {new Date(evidence.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Executive Recommendations */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target size={24} className="text-indigo-600" />
          Executive Recommendations
        </h2>
        <ul className="space-y-3">
          {report.recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                {idx + 1}
              </div>
              <p className="text-sm text-gray-800 leading-relaxed">{rec}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
