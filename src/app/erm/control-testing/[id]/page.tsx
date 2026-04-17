'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, Clock, Shield, Calendar, User, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

type TestStatus = 'Effective' | 'Partially Effective' | 'Ineffective' | 'Not Tested' | 'In Progress';

interface TestDetail {
  id: string;
  controlId: string;
  controlTitle: string;
  controlDescription: string;
  category: string;
  testDate: string;
  tester: string;
  status: TestStatus;
  effectiveness: number;
  findings: string[];
  recommendations: string[];
  nextTestDate: string;
  risksCovered: Array<{ id: string; name: string; rating: string }>;
  testProcedure: string;
  testEvidence: string[];
  testNotes: string;
}

// Mock data - in real app, fetch by ID
const mockTestDetails: Record<string, TestDetail> = {
  'CT-001': {
    id: 'CT-001',
    controlId: 'CTRL-001',
    controlTitle: 'Multi-factor Authentication (MFA)',
    controlDescription: 'All users must authenticate using multi-factor authentication when accessing critical systems.',
    category: 'Cybersecurity',
    testDate: '2024-04-15',
    tester: 'Sarah Chen',
    status: 'Effective',
    effectiveness: 95,
    findings: [],
    recommendations: ['Continue monitoring MFA adoption rates', 'Consider hardware tokens for executives'],
    nextTestDate: '2024-07-15',
    risksCovered: [
      { id: 'RSK-001', name: 'Unauthorized access to systems', rating: 'High' },
      { id: 'RSK-002', name: 'Data breach risk', rating: 'Critical' },
      { id: 'RSK-003', name: 'Identity theft', rating: 'Medium' }
    ],
    testProcedure: 'Reviewed MFA configuration across all critical systems. Tested login flows for 50 random users. Verified backup authentication methods.',
    testEvidence: [
      'MFA configuration screenshots',
      'Login audit logs',
      'User authentication reports',
      'System access logs'
    ],
    testNotes: 'Control is working effectively. 98% of users have MFA enabled. Remaining 2% are service accounts with approved exceptions.'
  },
  'CT-002': {
    id: 'CT-002',
    controlId: 'CTRL-002',
    controlTitle: 'Security Awareness Training',
    controlDescription: 'All employees must complete quarterly security awareness training.',
    category: 'Cybersecurity',
    testDate: '2024-04-10',
    tester: 'Michael Rodriguez',
    status: 'Effective',
    effectiveness: 88,
    findings: ['12% of employees missed Q1 training deadline'],
    recommendations: ['Implement automated reminders', 'Add training to onboarding checklist'],
    nextTestDate: '2024-07-10',
    risksCovered: [
      { id: 'RSK-004', name: 'Phishing attacks', rating: 'High' },
      { id: 'RSK-005', name: 'Social engineering', rating: 'Medium' }
    ],
    testProcedure: 'Reviewed training completion reports. Verified training content quality. Conducted spot checks with employees.',
    testEvidence: [
      'Training completion reports',
      'Quiz results',
      'Employee feedback surveys'
    ],
    testNotes: 'Overall effective but completion rate needs improvement. Training content is up to date and relevant.'
  }
};

export default function ControlTestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;

  const test = mockTestDetails[testId] || mockTestDetails['CT-001'];

  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case 'Effective': return <CheckCircle size={20} className="text-green-600" />;
      case 'Partially Effective': return <AlertTriangle size={20} className="text-yellow-600" />;
      case 'Ineffective': return <XCircle size={20} className="text-red-600" />;
      case 'In Progress': return <Clock size={20} className="text-blue-600" />;
      default: return <Clock size={20} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: TestStatus) => {
    switch (status) {
      case 'Effective': return 'bg-green-100 text-green-700 border-green-200';
      case 'Partially Effective': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Ineffective': return 'bg-red-100 text-red-700 border-red-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/erm/control-testing')}
          className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] mb-4"
        >
          <ArrowLeft size={16} />
          Back to Control Testing
        </button>
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-h2 font-bold text-[var(--foreground)]">{test.controlTitle}</h1>
              <div className={clsx('flex items-center gap-2 px-3 py-1.5 rounded-lg border', getStatusColor(test.status))}>
                {getStatusIcon(test.status)}
                <span className="font-medium text-sm">{test.status}</span>
              </div>
            </div>
            <p className="text-p2 text-[var(--foreground-muted)]">{test.controlDescription}</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-2">
            <Calendar size={16} />
            Test Date
          </div>
          <div className="text-lg font-semibold text-[var(--foreground)]">
            {new Date(test.testDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
        
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-2">
            <User size={16} />
            Tester
          </div>
          <div className="text-lg font-semibold text-[var(--foreground)]">{test.tester}</div>
        </div>

        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-2">
            <TrendingUp size={16} />
            Effectiveness
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={clsx('h-2 rounded-full',
                  test.effectiveness >= 80 ? 'bg-green-500' :
                  test.effectiveness >= 60 ? 'bg-orange-500' : 'bg-red-500'
                )}
                style={{ width: `${test.effectiveness}%` }}
              />
            </div>
            <span className="text-lg font-semibold text-[var(--foreground)]">{test.effectiveness}%</span>
          </div>
        </div>

        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-2">
            <Shield size={16} />
            Risks Covered
          </div>
          <div className="text-lg font-semibold text-[var(--foreground)]">{test.risksCovered.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Test Procedure */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <FileText size={18} />
              Test Procedure
            </h3>
            <p className="text-sm text-[var(--foreground)] leading-relaxed">{test.testProcedure}</p>
          </div>

          {/* Test Evidence */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Test Evidence</h3>
            <ul className="space-y-2">
              {test.testEvidence.map((evidence, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full mt-2" />
                  <span className="text-sm text-[var(--foreground)]">{evidence}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Findings */}
          {test.findings.length > 0 && (
            <div className="bg-white border border-[var(--border)] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
                <AlertTriangle size={18} className="text-yellow-600" />
                Findings
              </h3>
              <ul className="space-y-2">
                {test.findings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2" />
                    <span className="text-sm text-[var(--foreground)]">{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Recommendations</h3>
            <ul className="space-y-2">
              {test.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2" />
                  <span className="text-sm text-[var(--foreground)]">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Test Notes */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Test Notes</h3>
            <p className="text-sm text-[var(--foreground)] leading-relaxed">{test.testNotes}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Control Info */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wide mb-4">Control Details</h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Control ID</div>
                <div className="text-sm font-medium text-[var(--foreground)]">{test.controlId}</div>
              </div>
              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Category</div>
                <div className="text-sm font-medium text-[var(--foreground)]">{test.category}</div>
              </div>
              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Next Test Date</div>
                <div className="text-sm font-medium text-[var(--foreground)]">
                  {new Date(test.nextTestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          {/* Risks Covered */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wide mb-4">Risks Covered</h3>
            <div className="space-y-3">
              {test.risksCovered.map((risk) => (
                <div key={risk.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-[var(--foreground-muted)] mb-1">{risk.id}</div>
                  <div className="text-sm font-medium text-[var(--foreground)] mb-2">{risk.name}</div>
                  <span className={clsx(
                    'inline-block px-2 py-1 text-xs font-medium rounded',
                    risk.rating === 'Critical' ? 'bg-red-100 text-red-700' :
                    risk.rating === 'High' ? 'bg-orange-100 text-orange-700' :
                    risk.rating === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  )}>
                    {risk.rating}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wide mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors text-sm font-medium">
                Re-test Control
              </button>
              <button className="w-full px-4 py-2 border border-[var(--border)] text-[var(--foreground)] rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                Export Report
              </button>
              <button className="w-full px-4 py-2 border border-[var(--border)] text-[var(--foreground)] rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                View History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

