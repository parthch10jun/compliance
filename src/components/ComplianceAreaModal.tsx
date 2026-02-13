'use client';

import { X, Shield, FileText, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

interface ComplianceArea {
  id: string;
  name: string;
  description: string;
  chapter: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  requirementsCount: number;
  controlsCount: number;
}

interface Requirement {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  status: string;
  complianceScore: number;
  controlCount: number;
}

interface ComplianceAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  area: ComplianceArea;
  requirements: Requirement[];
}

export function ComplianceAreaModal({ isOpen, onClose, area, requirements }: ComplianceAreaModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[var(--border)]">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-h2 font-bold text-[var(--foreground)]">{area.name}</h2>
              <span className={clsx('px-3 py-1 text-xs rounded-full font-medium',
                area.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                area.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                'bg-blue-100 text-blue-700'
              )}>
                {area.priority}
              </span>
            </div>
            <p className="text-p2 text-[var(--foreground-muted)] mb-3">{area.description}</p>
            <div className="flex items-center gap-4 text-p3 text-[var(--foreground-muted)]">
              <span className="flex items-center gap-1">
                <FileText size={14} />
                {area.requirementsCount} Requirements
              </span>
              <span className="flex items-center gap-1">
                <Shield size={14} />
                {area.controlsCount} Controls
              </span>
              <span>{area.chapter}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--background-secondary)] rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Requirements List */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-h3 font-semibold text-[var(--foreground)] mb-4">
            Requirements ({requirements.length})
          </h3>
          <div className="space-y-3">
            {requirements.map((req) => (
              <div
                key={req.id}
                className="p-4 border border-[var(--border)] rounded-lg hover:border-cyan-500/30 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-p3 font-mono text-[var(--foreground-muted)]">{req.code}</span>
                      <span className={clsx('px-2 py-0.5 text-xs rounded-full font-medium',
                        req.status === 'Compliant' ? 'bg-emerald-100 text-emerald-700' :
                        req.status === 'Partially Compliant' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      )}>
                        {req.status}
                      </span>
                    </div>
                    <h4 className="text-p2 font-medium text-[var(--foreground)] mb-1">
                      {req.title}
                    </h4>
                    <p className="text-p3 text-[var(--foreground-muted)] line-clamp-2 mb-2">
                      {req.description}
                    </p>
                    <div className="flex items-center gap-3 text-p3 text-[var(--foreground-muted)]">
                      <span className="flex items-center gap-1">
                        <Shield size={14} />
                        {req.controlCount} Controls
                      </span>
                      <span className="text-emerald-600 font-semibold">{req.complianceScore}%</span>
                    </div>
                  </div>
                  <Link
                    href={`/requirements/${req.id}`}
                    className="ml-4 p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-p2 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

