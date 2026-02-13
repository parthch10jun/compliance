'use client';

import { useState } from 'react';
import { X, FileCheck, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface ReviewEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidence?: {
    id: string;
    code: string;
    name: string;
    description: string;
    fileName: string;
    uploadedBy: string;
    uploadedAt: string;
  };
  onReview?: (review: {
    evidenceId: string;
    decision: 'Approve' | 'Reject';
    validationStatus: string;
    comments: string;
  }) => void;
}

export function ReviewEvidenceModal({ isOpen, onClose, evidence, onReview }: ReviewEvidenceModalProps) {
  const [decision, setDecision] = useState<'Approve' | 'Reject' | null>(null);
  const [validationStatus, setValidationStatus] = useState('Sufficient');
  const [comments, setComments] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen || !evidence) return null;

  const validationStatuses = ['Sufficient', 'Insufficient', 'Needs Update'];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!decision) newErrors.decision = 'Please select Approve or Reject';
    if (!comments.trim()) newErrors.comments = 'Comments are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate() || !decision) return;

    if (onReview) {
      onReview({
        evidenceId: evidence.id,
        decision,
        validationStatus: decision === 'Approve' ? validationStatus : 'Insufficient',
        comments,
      });
      console.log('Evidence reviewed:', { evidenceId: evidence.id, decision, validationStatus, comments });
    }
    
    setDecision(null);
    setValidationStatus('Sufficient');
    setComments('');
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setDecision(null);
    setValidationStatus('Sufficient');
    setComments('');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
              <FileCheck size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-h3 font-bold text-[var(--foreground)]">Review Evidence</h2>
              <p className="text-p3 text-[var(--foreground-muted)] mt-0.5">{evidence.code}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X size={20} className="text-[var(--foreground-muted)]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Evidence Summary */}
          <div className="p-4 bg-[var(--background-secondary)] rounded-lg mb-6">
            <h3 className="text-p2 font-semibold text-[var(--foreground)] mb-3">Evidence Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">Name:</span>
                <span className="font-medium text-[var(--foreground)]">{evidence.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">File:</span>
                <span className="font-medium text-[var(--foreground)]">{evidence.fileName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">Uploaded By:</span>
                <span className="font-medium text-[var(--foreground)]">{evidence.uploadedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">Uploaded:</span>
                <span className="font-medium text-[var(--foreground)]">
                  {new Date(evidence.uploadedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Decision */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[var(--foreground)] mb-3">
              Review Decision <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDecision('Approve')}
                className={clsx(
                  'p-4 rounded-lg border-2 transition-all flex items-center gap-3',
                  decision === 'Approve'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-[var(--border)] hover:border-emerald-300 hover:bg-emerald-50/50'
                )}
              >
                <div className={clsx(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  decision === 'Approve' ? 'bg-emerald-500' : 'bg-emerald-100'
                )}>
                  <CheckCircle size={20} className={decision === 'Approve' ? 'text-white' : 'text-emerald-600'} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-[var(--foreground)]">Approve</p>
                  <p className="text-xs text-[var(--foreground-muted)]">Evidence is valid</p>
                </div>
              </button>

              <button
                onClick={() => setDecision('Reject')}
                className={clsx(
                  'p-4 rounded-lg border-2 transition-all flex items-center gap-3',
                  decision === 'Reject'
                    ? 'border-red-500 bg-red-50'
                    : 'border-[var(--border)] hover:border-red-300 hover:bg-red-50/50'
                )}
              >
                <div className={clsx(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  decision === 'Reject' ? 'bg-red-500' : 'bg-red-100'
                )}>
                  <XCircle size={20} className={decision === 'Reject' ? 'text-white' : 'text-red-600'} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-[var(--foreground)]">Reject</p>
                  <p className="text-xs text-[var(--foreground-muted)]">Evidence needs revision</p>
                </div>
              </button>
            </div>
            {errors.decision && <p className="text-xs text-red-500 mt-2">{errors.decision}</p>}
          </div>

          {/* Validation Status (only for Approve) */}
          {decision === 'Approve' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                Validation Status
              </label>
              <select
                value={validationStatus}
                onChange={(e) => setValidationStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {validationStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          )}

          {/* Comments */}
          <div>
            <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
              Review Comments <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={decision === 'Approve' ? 'Provide approval comments...' : decision === 'Reject' ? 'Explain why the evidence is being rejected...' : 'Provide your review comments...'}
              rows={4}
              className={clsx(
                'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 resize-none',
                errors.comments ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)] focus:ring-emerald-500'
              )}
            />
            {errors.comments && <p className="text-xs text-red-500 mt-1">{errors.comments}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--border)] bg-[var(--background-secondary)] flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 text-sm font-medium text-[var(--foreground-muted)] hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!decision}
            className={clsx(
              'px-6 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm hover:shadow-md',
              decision === 'Approve' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' :
              decision === 'Reject' ? 'bg-red-600 hover:bg-red-700 text-white' :
              'bg-gray-300 text-gray-500 cursor-not-allowed'
            )}
          >
            {decision === 'Approve' ? <CheckCircle size={16} /> : decision === 'Reject' ? <XCircle size={16} /> : <AlertCircle size={16} />}
            {decision === 'Approve' ? 'Approve Evidence' : decision === 'Reject' ? 'Reject Evidence' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
}
