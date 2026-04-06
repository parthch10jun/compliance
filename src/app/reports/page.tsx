'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import {
  FileText,
  Download,
  Calendar,
  Building2,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  FileBarChart,
  Plus,
  Filter,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { programs } from '@/lib/data/mock-data';

type ReportType = 'executive-summary' | 'compliance-status' | 'gaps-remediation' | 'control-effectiveness' | 'evidence-status' | 'risk-assessment';
type ReportStatus = 'generated' | 'scheduled' | 'draft';

interface SavedReport {
  id: string;
  name: string;
  type: ReportType;
  programs: string[];
  generatedDate: string;
  generatedBy: string;
  status: ReportStatus;
  complianceScore: number;
  criticalFindings: number;
  trend: 'up' | 'down' | 'stable';
}

const reportTypes = [
  {
    type: 'executive-summary' as ReportType,
    name: 'Executive Summary',
    description: 'Board-ready compliance overview with key metrics and risks',
    icon: FileBarChart,
    color: 'indigo',
    audience: 'CEO/Board',
    features: ['Compliance Score', 'Critical Risks', 'Top Gaps', 'Evidence Status', 'Regulatory Overview']
  },
  {
    type: 'compliance-status' as ReportType,
    name: 'Compliance Status Report',
    description: 'Detailed requirements and obligations tracking',
    icon: CheckCircle2,
    color: 'emerald',
    audience: 'CISO/Compliance Officer',
    features: ['Requirements Status', 'Obligations Timeline', 'Control Mapping', 'Assessment Results']
  },
  {
    type: 'gaps-remediation' as ReportType,
    name: 'Gaps & Remediation',
    description: 'Control gaps, deficiencies, and remediation plans',
    icon: AlertTriangle,
    color: 'amber',
    audience: 'Control Owners',
    features: ['Open Gaps', 'Remediation Progress', 'Target Dates', 'Owner Assignments']
  },
  {
    type: 'control-effectiveness' as ReportType,
    name: 'Control Effectiveness',
    description: 'Testing results and control performance analysis',
    icon: Shield,
    color: 'blue',
    audience: 'Internal Audit',
    features: ['Test Results', 'Pass Rates', 'Effectiveness Trends', 'Testing Coverage']
  },
  {
    type: 'evidence-status' as ReportType,
    name: 'Evidence Status',
    description: 'Evidence collection status and upcoming due dates',
    icon: FileText,
    color: 'purple',
    audience: 'Doers/Control Owners',
    features: ['Evidence Inventory', 'Due Dates', 'Missing Evidence', 'Collection Status']
  },
  {
    type: 'risk-assessment' as ReportType,
    name: 'Risk Assessment Report',
    description: 'Risk landscape, heat maps, and mitigation status',
    icon: TrendingDown,
    color: 'red',
    audience: 'CRO/Risk Committee',
    features: ['Risk Heat Map', 'Inherent vs Residual', 'Mitigation Plans', 'Risk Trends']
  }
];

const savedReports: SavedReport[] = [
  {
    id: 'rpt-001',
    name: 'Q4 2024 Executive Summary',
    type: 'executive-summary',
    programs: ['ISO 27001', 'SOC 2 Type II', 'GDPR'],
    generatedDate: '2024-12-20',
    generatedBy: 'Sarah Johnson',
    status: 'generated',
    complianceScore: 87,
    criticalFindings: 3,
    trend: 'up'
  },
  {
    id: 'rpt-002',
    name: 'December Control Testing Report',
    type: 'control-effectiveness',
    programs: ['All Programs'],
    generatedDate: '2024-12-15',
    generatedBy: 'Michael Chen',
    status: 'generated',
    complianceScore: 92,
    criticalFindings: 1,
    trend: 'stable'
  },
  {
    id: 'rpt-003',
    name: 'January Evidence Collection',
    type: 'evidence-status',
    programs: ['SOC 2 Type II'],
    generatedDate: '2025-01-05',
    generatedBy: 'System',
    status: 'scheduled',
    complianceScore: 78,
    criticalFindings: 5,
    trend: 'down'
  }
];

export default function ReportsPage() {
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<ReportType | null>(null);

  const toggleProgram = (programId: string) => {
    setSelectedPrograms(prev =>
      prev.includes(programId)
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Compliance Reports"
        description="Generate executive reports consolidating requirements, controls, gaps, and compliance scores"
        action={
          <Link
            href="/reports/generate"
            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
          >
            <Plus size={18} />
            Generate Report
          </Link>
        }
      />

      {/* Report Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Link
              key={report.type}
              href="/reports/generate"
              className="bg-white rounded-xl border border-gray-200 p-6 text-left hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={clsx(
                  'p-3 rounded-lg',
                  report.color === 'indigo' && 'bg-indigo-100',
                  report.color === 'emerald' && 'bg-emerald-100',
                  report.color === 'amber' && 'bg-amber-100',
                  report.color === 'blue' && 'bg-blue-100',
                  report.color === 'purple' && 'bg-purple-100',
                  report.color === 'red' && 'bg-red-100'
                )}>
                  <Icon size={24} className={clsx(
                    report.color === 'indigo' && 'text-indigo-600',
                    report.color === 'emerald' && 'text-emerald-600',
                    report.color === 'amber' && 'text-amber-600',
                    report.color === 'blue' && 'text-blue-600',
                    report.color === 'purple' && 'text-purple-600',
                    report.color === 'red' && 'text-red-600'
                  )} />
                </div>
                <ChevronRight size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{report.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{report.description}</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                  {report.audience}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-medium mb-2">Includes:</p>
                <div className="flex flex-wrap gap-1">
                  {report.features.slice(0, 3).map((feature, idx) => (
                    <span key={idx} className="text-xs text-gray-600">
                      • {feature}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
              <p className="text-sm text-gray-600 mt-1">Previously generated compliance reports</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {savedReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-semibold text-gray-900">{report.name}</h3>
                    <span className={clsx(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      report.status === 'generated' && 'bg-emerald-100 text-emerald-700',
                      report.status === 'scheduled' && 'bg-blue-100 text-blue-700',
                      report.status === 'draft' && 'bg-gray-100 text-gray-700'
                    )}>
                      {report.status === 'generated' ? 'Generated' : report.status === 'scheduled' ? 'Scheduled' : 'Draft'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(report.generatedDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 size={14} />
                      {report.programs.join(', ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Compliance:</span>
                      <span className={clsx(
                        'text-sm font-semibold',
                        report.complianceScore >= 90 ? 'text-emerald-600' :
                        report.complianceScore >= 70 ? 'text-amber-600' :
                        'text-red-600'
                      )}>{report.complianceScore}%</span>
                      {report.trend === 'up' && <TrendingUp size={14} className="text-emerald-600" />}
                      {report.trend === 'down' && <TrendingDown size={14} className="text-red-600" />}
                    </div>
                    {report.criticalFindings > 0 && (
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={14} className="text-amber-600" />
                        <span className="text-sm text-amber-600 font-medium">
                          {report.criticalFindings} critical finding{report.criticalFindings > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/reports/${report.id}`}
                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    View Report
                  </Link>
                  <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

