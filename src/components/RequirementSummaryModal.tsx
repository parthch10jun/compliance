'use client';

import { X, Shield, FileText, ArrowRight, Folder } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

interface Requirement {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  section: string;
  status: string;
  complianceScore: number;
  controlCount: number;
  riskRating?: string;
  linkedPrograms?: number;
  programNames?: string[];
}

interface RequirementSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirement: Requirement;
}

export function RequirementSummaryModal({ isOpen, onClose, requirement }: RequirementSummaryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[var(--border)]">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                <FileText size={20} className="text-cyan-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-p3 font-mono text-[var(--foreground-muted)]">{requirement.code}</span>
                  <span className={clsx('px-2 py-0.5 text-xs rounded-full font-medium',
                    requirement.status === 'Compliant' ? 'bg-emerald-100 text-emerald-700' :
                    requirement.status === 'Partially Compliant' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  )}>
                    {requirement.status}
                  </span>
                </div>
                <h2 className="text-h3 font-bold text-[var(--foreground)] mt-1">{requirement.title}</h2>
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
            <p className="text-p2 text-[var(--foreground-muted)]">{requirement.description}</p>
          </div>

          {/* Compliance Score */}
          <div className="mb-6 p-4 bg-[var(--background-secondary)] rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-emerald-600" />
              <span className="text-p3 text-[var(--foreground-muted)]">Compliance Score</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 rounded-full transition-all"
                  style={{ width: `${requirement.complianceScore}%` }}
                />
              </div>
              <span className="text-h3 font-bold text-emerald-600">{requirement.complianceScore}%</span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="text-p2 text-[var(--foreground-muted)]">Category</span>
              <span className="text-p2 font-medium text-[var(--foreground)]">{requirement.category}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="text-p2 text-[var(--foreground-muted)]">Section</span>
              <span className="text-p2 font-medium text-[var(--foreground)]">{requirement.section}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="text-p2 text-[var(--foreground-muted)]">Linked Controls</span>
              <span className="text-p2 font-medium text-[var(--foreground)]">{requirement.controlCount}</span>
            </div>
            {requirement.linkedPrograms !== undefined && (
              <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                <span className="text-p2 text-[var(--foreground-muted)]">Linked Programs</span>
                <span className="text-p2 font-medium text-[var(--foreground)]">{requirement.linkedPrograms}</span>
              </div>
            )}
            {requirement.riskRating && (
              <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                <span className="text-p2 text-[var(--foreground-muted)]">Risk Rating</span>
                <span className={clsx('px-2 py-0.5 text-xs rounded-full font-medium',
                  requirement.riskRating === 'Critical' ? 'bg-red-100 text-red-700' :
                  requirement.riskRating === 'High' ? 'bg-orange-100 text-orange-700' :
                  requirement.riskRating === 'Medium' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                )}>
                  {requirement.riskRating}
                </span>
              </div>
            )}
          </div>

          {/* Program Names */}
          {requirement.programNames && requirement.programNames.length > 0 && (
            <div className="mt-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <div className="flex items-center gap-2 mb-3">
                <Folder size={16} className="text-cyan-600" />
                <h4 className="text-p2 font-semibold text-cyan-900">Programs</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {requirement.programNames.map((name, idx) => (
                  <span key={idx} className="px-2 py-1 bg-white text-cyan-700 rounded text-p3 font-medium">
                    {name}
                  </span>
                ))}
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
            href={`/requirements/${requirement.id}`}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium flex items-center gap-2"
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

