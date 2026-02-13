'use client';

import { useState } from 'react';
import { X, FlaskConical, CheckCircle, XCircle, Clock, PlayCircle, Circle, Calendar, User, FileText, Upload, Download, Eye, Trash2, Plus } from 'lucide-react';
import clsx from 'clsx';

interface TestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  test?: {
    id: string;
    code: string;
    name: string;
    description?: string;
    type: string;
    procedure?: string;
    expectedResult?: string;
    actualResult?: string;
    frequency: string;
    status: string;
    result?: string;
    scheduledDate?: string;
    executedDate?: string;
    completedDate?: string;
    dueDate?: string;
    tester?: string;
    reviewer?: string;
    linkedControls?: string[];
    evidenceCount?: number;
    findings?: string;
  };
  onAttachEvidence?: () => void;
  onExecuteTest?: () => void;
}

const statusConfig = {
  'Passed': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  'Failed': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  'In Progress': { icon: PlayCircle, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  'Pending': { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  'Not Started': { icon: Circle, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' },
};

// Mock evidence data - in real app, this would come from props or API
const mockEvidence = [
  { id: 'evd-001', code: 'EVD-001', name: 'MFA Configuration Report', type: 'Report', status: 'Approved', uploadedBy: 'Priya Patel', uploadedAt: '2024-12-15', fileSize: '245 KB' },
  { id: 'evd-002', code: 'EVD-002', name: 'Access Control Screenshots', type: 'Screenshot', status: 'Approved', uploadedBy: 'Vikram Singh', uploadedAt: '2024-12-16', fileSize: '1.2 MB' },
  { id: 'evd-003', code: 'EVD-003', name: 'Test Execution Log', type: 'Log File', status: 'Pending Review', uploadedBy: 'Priya Patel', uploadedAt: '2024-12-17', fileSize: '89 KB' },
];

export function TestDetailModal({ isOpen, onClose, test, onAttachEvidence, onExecuteTest }: TestDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'evidence'>('details');

  if (!isOpen || !test) return null;

  const StatusIcon = statusConfig[test.status as keyof typeof statusConfig]?.icon || Circle;
  const statusStyle = statusConfig[test.status as keyof typeof statusConfig] || statusConfig['Not Started'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <FlaskConical size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-h3 font-bold text-[var(--foreground)]">{test.name}</h2>
              <p className="text-p3 text-[var(--foreground-muted)] mt-0.5">{test.code}</p>
            </div>
            <div className={clsx('flex items-center gap-2 px-3 py-1.5 rounded-full text-p3 font-medium', statusStyle.bg, statusStyle.color, statusStyle.border, 'border')}>
              <StatusIcon size={14} />
              {test.status}
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X size={20} className="text-[var(--foreground-muted)]" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border)] bg-[var(--background-secondary)]">
          <button
            onClick={() => setActiveTab('details')}
            className={clsx(
              'px-6 py-3 text-p2 font-medium transition-all relative',
              activeTab === 'details'
                ? 'text-[var(--primary)] bg-white'
                : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-white/50'
            )}
          >
            Test Details
            {activeTab === 'details' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={clsx(
              'px-6 py-3 text-p2 font-medium transition-all relative',
              activeTab === 'evidence'
                ? 'text-[var(--primary)] bg-white'
                : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-white/50'
            )}
          >
            Evidence ({test.evidenceCount || mockEvidence.length})
            {activeTab === 'evidence' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' ? (
            <div className="space-y-6">
              {/* Test Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-p3 font-medium text-[var(--foreground-muted)] block mb-1">Test Type</label>
                  <p className="text-p2 text-[var(--foreground)]">{test.type}</p>
                </div>
                <div>
                  <label className="text-p3 font-medium text-[var(--foreground-muted)] block mb-1">Frequency</label>
                  <p className="text-p2 text-[var(--foreground)]">{test.frequency}</p>
                </div>
                <div>
                  <label className="text-p3 font-medium text-[var(--foreground-muted)] block mb-1">Tester</label>
                  <p className="text-p2 text-[var(--foreground)] flex items-center gap-2">
                    <User size={14} className="text-[var(--foreground-muted)]" />
                    {test.tester || 'Not assigned'}
                  </p>
                </div>
                <div>
                  <label className="text-p3 font-medium text-[var(--foreground-muted)] block mb-1">Scheduled Date</label>
                  <p className="text-p2 text-[var(--foreground)] flex items-center gap-2">
                    <Calendar size={14} className="text-[var(--foreground-muted)]" />
                    {test.scheduledDate || 'Not scheduled'}
                  </p>
                </div>
                {test.executedDate && (
                  <div>
                    <label className="text-p3 font-medium text-[var(--foreground-muted)] block mb-1">Executed Date</label>
                    <p className="text-p2 text-[var(--foreground)] flex items-center gap-2">
                      <Calendar size={14} className="text-[var(--foreground-muted)]" />
                      {test.executedDate}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              {test.description && (
                <div>
                  <label className="text-p3 font-medium text-[var(--foreground-muted)] block mb-2">Description</label>
                  <p className="text-p2 text-[var(--foreground)] bg-[var(--background-secondary)] p-4 rounded-lg">
                    {test.description}
                  </p>
                </div>
              )}

              {/* Test Procedure */}
              {test.procedure && (
                <div>
                  <label className="text-p3 font-medium text-[var(--foreground-muted)] block mb-2">Test Procedure</label>
                  <div className="bg-[var(--background-secondary)] p-4 rounded-lg">
                    <pre className="text-p2 text-[var(--foreground)] whitespace-pre-wrap font-sans">
                      {test.procedure}
                    </pre>
                  </div>
                </div>
              )}

              {/* Expected Result */}
              {test.expectedResult && (
                <div>
                  <label className="text-p3 font-medium text-[var(--foreground-muted)] block mb-2">Expected Result</label>
                  <p className="text-p2 text-[var(--foreground)] bg-green-50 border border-green-200 p-4 rounded-lg">
                    {test.expectedResult}
                  </p>
                </div>
              )}

              {/* Actual Result */}
              {test.actualResult && (
                <div>
                  <label className="text-p3 font-medium text-[var(--foreground-muted)] block mb-2">Actual Result</label>
                  <p className={clsx(
                    'text-p2 p-4 rounded-lg border',
                    test.status === 'Passed' ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-900'
                  )}>
                    {test.actualResult}
                  </p>
                </div>
              )}

              {/* Findings */}
              {test.findings && (
                <div>
                  <label className="text-p3 font-medium text-[var(--foreground-muted)] block mb-2">Findings</label>
                  <p className="text-p2 text-[var(--foreground)] bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    {test.findings}
                  </p>
                </div>
              )}

              {/* Linked Controls */}
              {test.linkedControls && test.linkedControls.length > 0 && (
                <div>
                  <label className="text-p3 font-medium text-[var(--foreground-muted)] block mb-2">Linked Controls</label>
                  <div className="flex flex-wrap gap-2">
                    {test.linkedControls.map((control) => (
                      <span
                        key={control}
                        className="px-3 py-1.5 bg-[var(--primary-lightest)] text-[var(--primary)] rounded-lg text-p3 font-medium"
                      >
                        {control}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Evidence List */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-h4 font-bold text-[var(--foreground)]">Attached Evidence</h3>
                <button
                  onClick={onAttachEvidence}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-all text-p2 font-medium"
                >
                  <Plus size={16} />
                  Attach Evidence
                </button>
              </div>

              {mockEvidence.length === 0 ? (
                <div className="text-center py-12 bg-[var(--background-secondary)] rounded-xl">
                  <FileText size={48} className="mx-auto text-[var(--foreground-muted)] mb-3" />
                  <p className="text-p2 text-[var(--foreground-muted)] mb-4">No evidence attached yet</p>
                  <button
                    onClick={onAttachEvidence}
                    className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-all text-p2 font-medium"
                  >
                    Attach First Evidence
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {mockEvidence.map((evidence) => (
                    <div
                      key={evidence.id}
                      className="p-4 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all bg-white"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                            <FileText size={20} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-p2 font-semibold text-[var(--foreground)] mb-1">{evidence.name}</h4>
                            <p className="text-p3 text-[var(--foreground-muted)] mb-2">{evidence.code}</p>
                            <div className="flex items-center gap-4 text-p3 text-[var(--foreground-muted)]">
                              <span className="flex items-center gap-1">
                                <User size={12} />
                                {evidence.uploadedBy}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                {evidence.uploadedAt}
                              </span>
                              <span>{evidence.fileSize}</span>
                              <span className={clsx(
                                'px-2 py-0.5 rounded-full text-p3 font-medium',
                                evidence.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                              )}>
                                {evidence.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-[var(--background-secondary)] rounded-lg transition-colors" title="View">
                            <Eye size={16} className="text-[var(--foreground-muted)]" />
                          </button>
                          <button className="p-2 hover:bg-[var(--background-secondary)] rounded-lg transition-colors" title="Download">
                            <Download size={16} className="text-[var(--foreground-muted)]" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-[var(--border)] bg-[var(--background-secondary)]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-[var(--border)] rounded-xl text-p2 font-medium text-[var(--foreground)] hover:bg-white transition-all"
          >
            Close
          </button>
          <div className="flex items-center gap-3">
            {test.status !== 'Passed' && test.status !== 'Failed' && (
              <button
                onClick={onExecuteTest}
                className="flex items-center gap-2 px-6 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-dark)] transition-all text-p2 font-medium shadow-sm hover:shadow-md"
              >
                <PlayCircle size={18} />
                Execute Test
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

