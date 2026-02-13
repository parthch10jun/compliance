'use client';

import { X, CheckCircle2, Clock, AlertCircle, User, Calendar, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { WorkflowStep } from '@/lib/types/program-specifications';

interface ProcedureDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  step: WorkflowStep;
  workflowType: 'assessment' | 'testing';
  onUpdateStatus?: (stepId: string, status: string) => void;
}

export default function ProcedureDetailModal({
  isOpen,
  onClose,
  step,
  workflowType,
  onUpdateStatus,
}: ProcedureDetailModalProps) {
  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-600 bg-emerald-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'blocked': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={16} />;
      case 'in-progress': return <Clock size={16} />;
      case 'blocked': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border)] bg-gradient-to-r from-cyan-50 to-blue-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center text-sm font-bold">
                  {step.order}
                </span>
                <h2 className="text-h2 font-bold text-[var(--foreground)]">{step.title}</h2>
              </div>
              <p className="text-p2 text-[var(--foreground-muted)] ml-11">{step.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Status and metadata */}
          <div className="flex items-center gap-4 mt-4 ml-11">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(step.status)}`}>
              {getStatusIcon(step.status)}
              <span className="capitalize">{step.status.replace('-', ' ')}</span>
            </div>
            {step.assignedTo && (
              <div className="flex items-center gap-2 text-p3 text-[var(--foreground-muted)]">
                <User size={14} />
                <span>{step.assignedTo}</span>
              </div>
            )}
            {step.dueDate && (
              <div className="flex items-center gap-2 text-p3 text-[var(--foreground-muted)]">
                <Calendar size={14} />
                <span>Due: {new Date(step.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Detailed Procedure */}
          <div className="mb-6 prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4 mt-6 first:mt-0" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3 mt-5" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2 mt-4" {...props} />,
                p: ({node, ...props}) => <p className="text-p2 text-[var(--foreground)] mb-3 leading-relaxed" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-3 space-y-1 text-[var(--foreground)]" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-3 space-y-1 text-[var(--foreground)]" {...props} />,
                li: ({node, ...props}) => <li className="text-p2 text-[var(--foreground)] ml-4" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-[var(--foreground)]" {...props} />,
                em: ({node, ...props}) => <em className="italic text-[var(--foreground-muted)]" {...props} />,
                code: ({node, ...props}) => <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-cyan-700" {...props} />,
                pre: ({node, ...props}) => <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-3" {...props} />,
              }}
            >
              {step.detailedProcedure}
            </ReactMarkdown>
          </div>

          {/* Evidence */}
          {step.evidence && step.evidence.length > 0 && (
            <div className="mb-6">
              <h3 className="text-h4 font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                <FileText size={18} />
                Evidence
              </h3>
              <div className="space-y-2">
                {step.evidence.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-[var(--background-secondary)] rounded-lg">
                    <FileText size={16} className="text-cyan-600" />
                    <span className="text-p2 text-[var(--foreground)]">{file}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {step.notes && (
            <div className="mb-6">
              <h3 className="text-h4 font-semibold text-[var(--foreground)] mb-3">Notes</h3>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-p2 text-[var(--foreground)]">{step.notes}</p>
              </div>
            </div>
          )}

          {/* Completion Info */}
          {step.status === 'completed' && step.completedDate && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center gap-2 text-emerald-700 mb-2">
                <CheckCircle2 size={18} />
                <span className="font-semibold">Completed</span>
              </div>
              <div className="text-p3 text-emerald-600">
                <p>Completed on: {new Date(step.completedDate).toLocaleDateString()}</p>
                {step.completedBy && <p>Completed by: {step.completedBy}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--border)] bg-[var(--background-secondary)]">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-p2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

