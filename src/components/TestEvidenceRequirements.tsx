'use client';

import { CheckCircle2, XCircle, AlertCircle, FileText, FlaskConical, Calendar, User } from 'lucide-react';
import clsx from 'clsx';

interface TestRequirement {
  id: string;
  code: string;
  name: string;
  type: string;
  frequency: string;
  status: 'Passed' | 'Failed' | 'Pending' | 'In Progress' | 'Not Started';
  lastExecuted?: string;
  nextDue?: string;
  tester?: string;
  evidenceRequired: string[];
}

interface EvidenceRequirement {
  id: string;
  code: string;
  name: string;
  type: string;
  status: 'Approved' | 'Pending Review' | 'Rejected' | 'Expired' | 'Draft' | 'Missing';
  validationStatus?: string;
  expiresAt?: string;
  uploadedBy?: string;
  uploadedAt?: string;
}

interface TestEvidenceRequirementsProps {
  controlCode: string;
  controlName: string;
  tests: TestRequirement[];
  evidence: EvidenceRequirement[];
}

export function TestEvidenceRequirements({ controlCode, controlName, tests, evidence }: TestEvidenceRequirementsProps) {
  const getTestStatusIcon = (status: string) => {
    switch (status) {
      case 'Passed':
        return <CheckCircle2 size={16} className="text-emerald-600" />;
      case 'Failed':
        return <XCircle size={16} className="text-red-600" />;
      case 'Pending':
      case 'In Progress':
        return <AlertCircle size={16} className="text-amber-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-400" />;
    }
  };

  const getEvidenceStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle2 size={16} className="text-emerald-600" />;
      case 'Rejected':
      case 'Expired':
        return <XCircle size={16} className="text-red-600" />;
      case 'Pending Review':
        return <AlertCircle size={16} className="text-amber-600" />;
      case 'Missing':
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return <FileText size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Passed':
      case 'Approved':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Failed':
      case 'Rejected':
      case 'Expired':
      case 'Missing':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Pending':
      case 'In Progress':
      case 'Pending Review':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Draft':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const completedTests = tests.filter(t => t.status === 'Passed').length;
  const approvedEvidence = evidence.filter(e => e.status === 'Approved').length;
  const testCompletionRate = tests.length > 0 ? Math.round((completedTests / tests.length) * 100) : 0;
  const evidenceCompletionRate = evidence.length > 0 ? Math.round((approvedEvidence / evidence.length) * 100) : 0;

  return (
    <div className="p-6 rounded-xl bg-white border border-[var(--border)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
          <FlaskConical size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-h3 font-bold text-[var(--foreground)]">Test & Evidence Requirements</h3>
          <p className="text-p3 text-[var(--foreground-muted)]">{controlCode} - {controlName}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Test Completion</span>
            <FlaskConical size={18} className="text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-900">{testCompletionRate}%</span>
            <span className="text-sm text-blue-700">{completedTests}/{tests.length} passed</span>
          </div>
          <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${testCompletionRate}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-emerald-900">Evidence Approval</span>
            <FileText size={18} className="text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-900">{evidenceCompletionRate}%</span>
            <span className="text-sm text-emerald-700">{approvedEvidence}/{evidence.length} approved</span>
          </div>
          <div className="mt-2 h-2 bg-emerald-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-600 transition-all duration-500"
              style={{ width: `${evidenceCompletionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tests Section */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
          <FlaskConical size={16} />
          Required Tests ({tests.length})
        </h4>
        {tests.length === 0 ? (
          <div className="text-center py-8 bg-[var(--background-secondary)] rounded-lg">
            <p className="text-sm text-[var(--foreground-muted)]">No tests defined for this control</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tests.map(test => (
              <div key={test.id} className="p-3 rounded-lg border border-[var(--border)] hover:border-blue-300 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 flex-1">
                    {getTestStatusIcon(test.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-blue-600">{test.code}</span>
                        <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium border', getStatusColor(test.status))}>
                          {test.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-[var(--foreground)] mb-1">{test.name}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-[var(--foreground-muted)]">
                        <span className="flex items-center gap-1">
                          <FlaskConical size={12} />
                          {test.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {test.frequency}
                        </span>
                        {test.tester && (
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {test.tester}
                          </span>
                        )}
                      </div>
                      {test.evidenceRequired.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs font-medium text-[var(--foreground-muted)] mb-1">Evidence Required:</p>
                          <div className="flex flex-wrap gap-1">
                            {test.evidenceRequired.map((evd, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded text-xs">
                                {evd}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-[var(--foreground-muted)]">
                    {test.lastExecuted && <p>Last: {test.lastExecuted}</p>}
                    {test.nextDue && <p className="font-medium text-amber-600">Due: {test.nextDue}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Evidence Section */}
      <div>
        <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
          <FileText size={16} />
          Required Evidence ({evidence.length})
        </h4>
        {evidence.length === 0 ? (
          <div className="text-center py-8 bg-[var(--background-secondary)] rounded-lg">
            <p className="text-sm text-[var(--foreground-muted)]">No evidence required for this control</p>
          </div>
        ) : (
          <div className="space-y-2">
            {evidence.map(evd => (
              <div key={evd.id} className="p-3 rounded-lg border border-[var(--border)] hover:border-emerald-300 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 flex-1">
                    {getEvidenceStatusIcon(evd.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-emerald-600">{evd.code}</span>
                        <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium border', getStatusColor(evd.status))}>
                          {evd.status}
                        </span>
                        {evd.validationStatus && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {evd.validationStatus}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-[var(--foreground)] mb-1">{evd.name}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-[var(--foreground-muted)]">
                        <span className="flex items-center gap-1">
                          <FileText size={12} />
                          {evd.type}
                        </span>
                        {evd.uploadedBy && (
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {evd.uploadedBy}
                          </span>
                        )}
                        {evd.uploadedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            Uploaded: {evd.uploadedAt}
                          </span>
                        )}
                      </div>
                      {evd.expiresAt && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs">
                            <span className="text-[var(--foreground-muted)]">Expires: </span>
                            <span className={clsx(
                              'font-medium',
                              new Date(evd.expiresAt) < new Date() ? 'text-red-600' :
                              new Date(evd.expiresAt) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'text-amber-600' :
                              'text-emerald-600'
                            )}>
                              {evd.expiresAt}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


