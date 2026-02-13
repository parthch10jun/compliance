'use client';

import { X, Shield, CheckCircle2, AlertTriangle, Clock, FileText, ArrowRight, Calendar, Folder } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

interface Control {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  status: string;
  effectiveness: number;
  testStatus: string;
  lastTested?: string;
  nextTest?: string;
  owner: string;
  frequency: string;
  linkedRequirements?: number;
  linkedTests?: number;
  evidenceCount?: number;
  linkedPrograms?: number;
  programNames?: string[];
}

interface ControlSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  control: Control;
}

export function ControlSummaryModal({ isOpen, onClose, control }: ControlSummaryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[var(--border)]">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Shield size={20} className="text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-p3 font-mono text-[var(--foreground-muted)]">{control.code}</span>
                  <span className={clsx('px-2 py-0.5 text-xs rounded-full font-medium',
                    control.status === 'Implemented' ? 'bg-emerald-100 text-emerald-700' :
                    control.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-700'
                  )}>
                    {control.status}
                  </span>
                </div>
                <h2 className="text-h3 font-bold text-[var(--foreground)] mt-1">{control.title}</h2>
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
            <p className="text-p2 text-[var(--foreground-muted)]">{control.description}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-[var(--background-secondary)] rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Shield size={16} className="text-emerald-600" />
                <span className="text-p3 text-[var(--foreground-muted)]">Effectiveness</span>
              </div>
              <p className="text-h3 font-bold text-emerald-600">{control.effectiveness}%</p>
            </div>
            <div className="p-4 bg-[var(--background-secondary)] rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 size={16} className={
                  control.testStatus === 'Passed' ? 'text-emerald-600' :
                  control.testStatus === 'Failed' ? 'text-red-600' :
                  'text-amber-600'
                } />
                <span className="text-p3 text-[var(--foreground-muted)]">Test Status</span>
              </div>
              <p className={clsx('text-p2 font-semibold',
                control.testStatus === 'Passed' ? 'text-emerald-600' :
                control.testStatus === 'Failed' ? 'text-red-600' :
                'text-amber-600'
              )}>
                {control.testStatus}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="text-p2 text-[var(--foreground-muted)]">Category</span>
              <span className="text-p2 font-medium text-[var(--foreground)]">{control.category}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="text-p2 text-[var(--foreground-muted)]">Owner</span>
              <span className="text-p2 font-medium text-[var(--foreground)]">{control.owner}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="text-p2 text-[var(--foreground-muted)]">Test Frequency</span>
              <span className="text-p2 font-medium text-[var(--foreground)]">{control.frequency}</span>
            </div>
            {control.lastTested && (
              <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                <span className="text-p2 text-[var(--foreground-muted)]">Last Tested</span>
                <span className="text-p2 font-medium text-[var(--foreground)]">{control.lastTested}</span>
              </div>
            )}
            {control.nextTest && (
              <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                <span className="text-p2 text-[var(--foreground-muted)]">Next Test</span>
                <span className="text-p2 font-medium text-[var(--foreground)]">{control.nextTest}</span>
              </div>
            )}
          </div>

          {/* Linked Items */}
          {(control.linkedRequirements || control.linkedTests || control.evidenceCount || control.linkedPrograms) && (
            <div className="mt-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <h4 className="text-p2 font-semibold text-cyan-900 mb-3">Linked Items</h4>
              <div className="flex items-center gap-4 text-p3 text-cyan-800 flex-wrap">
                {control.linkedPrograms !== undefined && (
                  <span className="flex items-center gap-1">
                    <Folder size={14} />
                    {control.linkedPrograms} Program{control.linkedPrograms !== 1 ? 's' : ''}
                  </span>
                )}
                {control.linkedRequirements !== undefined && (
                  <span className="flex items-center gap-1">
                    <FileText size={14} />
                    {control.linkedRequirements} Requirements
                  </span>
                )}
                {control.linkedTests !== undefined && (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    {control.linkedTests} Tests
                  </span>
                )}
                {control.evidenceCount !== undefined && (
                  <span className="flex items-center gap-1">
                    <FileText size={14} />
                    {control.evidenceCount} Evidence
                  </span>
                )}
              </div>
              {control.programNames && control.programNames.length > 0 && (
                <div className="mt-3 pt-3 border-t border-cyan-300">
                  <p className="text-p3 text-cyan-800 mb-2">Programs:</p>
                  <div className="flex flex-wrap gap-2">
                    {control.programNames.map((name, idx) => (
                      <span key={idx} className="px-2 py-1 bg-white text-cyan-700 rounded text-p3 font-medium">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
            href={`/controls/${control.id}`}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2"
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

