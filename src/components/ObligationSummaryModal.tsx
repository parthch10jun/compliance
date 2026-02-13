'use client';

import { X, Calendar, AlertTriangle, CheckCircle2, Clock, FileText, Shield, ArrowRight, Building2 } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

interface Obligation {
  id: string;
  code: string;
  title: string;
  description: string;
  type: string;
  status: string;
  dueDate: string;
  frequency: string;
  authority: string;
  program: string;
  owner: string;
  priority: string;
  linkedControls?: number;
  linkedEvidence?: number;
  completionRate?: number;
}

interface ObligationSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  obligation: Obligation;
}

export function ObligationSummaryModal({ isOpen, onClose, obligation }: ObligationSummaryModalProps) {
  if (!isOpen) return null;

  const isOverdue = new Date(obligation.dueDate) < new Date() && obligation.status !== 'Completed';
  const daysUntilDue = Math.ceil((new Date(obligation.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[var(--border)]">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center',
                isOverdue ? 'bg-red-100' : 'bg-blue-100'
              )}>
                <Calendar size={20} className={isOverdue ? 'text-red-600' : 'text-blue-600'} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-p3 font-mono text-[var(--foreground-muted)]">{obligation.code}</span>
                  <span className={clsx('px-2 py-0.5 text-xs rounded-full font-medium',
                    obligation.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    obligation.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                    isOverdue ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  )}>
                    {obligation.status}
                  </span>
                  {isOverdue && (
                    <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-red-100 text-red-700">
                      Overdue
                    </span>
                  )}
                </div>
                <h2 className="text-h3 font-bold text-[var(--foreground)] mt-1">{obligation.title}</h2>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--background-secondary)] rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-p2 font-semibold text-[var(--foreground)] mb-2">Description</h3>
            <p className="text-p2 text-[var(--foreground-muted)]">{obligation.description}</p>
          </div>

          {/* Due Date Alert */}
          {!isOverdue && daysUntilDue <= 30 && obligation.status !== 'Completed' && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle size={20} className="text-amber-600 mt-0.5" />
              <div>
                <p className="text-p2 font-semibold text-amber-900">Due Soon</p>
                <p className="text-p3 text-amber-800">This obligation is due in {daysUntilDue} days</p>
              </div>
            </div>
          )}

          {isOverdue && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-600 mt-0.5" />
              <div>
                <p className="text-p2 font-semibold text-red-900">Overdue</p>
                <p className="text-p3 text-red-800">This obligation is {Math.abs(daysUntilDue)} days overdue</p>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          {obligation.completionRate !== undefined && (
            <div className="mb-6 p-4 bg-[var(--background-secondary)] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span className="text-p3 text-[var(--foreground-muted)]">Completion Rate</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full transition-all"
                    style={{ width: `${obligation.completionRate}%` }}
                  />
                </div>
                <span className="text-h3 font-bold text-emerald-600">{obligation.completionRate}%</span>
              </div>
            </div>
          )}

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="text-p2 text-[var(--foreground-muted)]">Type</span>
              <span className="text-p2 font-medium text-[var(--foreground)]">{obligation.type}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="text-p2 text-[var(--foreground-muted)]">Authority</span>
              <span className="text-p2 font-medium text-[var(--foreground)]">{obligation.authority}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="text-p2 text-[var(--foreground-muted)]">Program</span>
              <span className="text-p2 font-medium text-[var(--foreground)]">{obligation.program}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="text-p2 text-[var(--foreground-muted)]">Owner</span>
              <span className="text-p2 font-medium text-[var(--foreground)]">{obligation.owner}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="text-p2 text-[var(--foreground-muted)]">Due Date</span>
              <span className={clsx('text-p2 font-medium', isOverdue ? 'text-red-600' : 'text-[var(--foreground)]')}>
                {obligation.dueDate}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="text-p2 text-[var(--foreground-muted)]">Frequency</span>
              <span className="text-p2 font-medium text-[var(--foreground)]">{obligation.frequency}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="text-p2 text-[var(--foreground-muted)]">Priority</span>
              <span className={clsx('px-2 py-0.5 text-xs rounded-full font-medium',
                obligation.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                obligation.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                obligation.priority === 'Medium' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              )}>
                {obligation.priority}
              </span>
            </div>
          </div>

          {/* Linked Items */}
          {(obligation.linkedControls || obligation.linkedEvidence) && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-p2 font-semibold text-blue-900 mb-3">Linked Items</h4>
              <div className="flex items-center gap-4 text-p3 text-blue-800">
                {obligation.linkedControls !== undefined && (
                  <span className="flex items-center gap-1">
                    <Shield size={14} />
                    {obligation.linkedControls} Controls
                  </span>
                )}
                {obligation.linkedEvidence !== undefined && (
                  <span className="flex items-center gap-1">
                    <FileText size={14} />
                    {obligation.linkedEvidence} Evidence
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-p2 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] rounded-lg transition-colors"
          >
            Close
          </button>
          <Link
            href={`/obligations/${obligation.id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            onClick={onClose}
          >
            View Full Details
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

