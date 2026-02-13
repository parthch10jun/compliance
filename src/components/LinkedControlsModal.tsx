'use client';

import { X, Shield, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

interface Control {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  status: string;
  effectiveness: string;
  owner: string;
  frequency: string;
  lastTestDate?: string;
  nextTestDate?: string;
  linkedRequirementIds?: string[];
}

interface LinkedControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirementTitle: string;
  controls: Control[];
  onControlClick: (control: Control) => void;
}

export function LinkedControlsModal({ 
  isOpen, 
  onClose, 
  requirementTitle, 
  controls,
  onControlClick 
}: LinkedControlsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[var(--border)]">
          <div className="flex-1">
            <h2 className="text-h2 font-bold text-[var(--foreground)] mb-2">Linked Controls</h2>
            <p className="text-p2 text-[var(--foreground-muted)]">
              {controls.length} control{controls.length !== 1 ? 's' : ''} linked to: <span className="font-medium text-[var(--foreground)]">{requirementTitle}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--background-secondary)] rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Controls List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {controls.map((control) => (
              <button
                key={control.id}
                onClick={() => {
                  onControlClick(control);
                  onClose();
                }}
                className="w-full text-left p-4 border border-[var(--border)] rounded-lg hover:border-emerald-500/30 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-emerald-600" />
                    <span className="text-p3 font-mono text-[var(--foreground-muted)]">{control.code}</span>
                  </div>
                  <span className={clsx('px-2 py-0.5 text-xs rounded-full font-medium',
                    control.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                    control.status === 'Draft' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  )}>
                    {control.status}
                  </span>
                </div>
                <p className="text-p2 font-medium text-[var(--foreground)] group-hover:text-emerald-600 transition-colors mb-2">
                  {control.name}
                </p>
                <p className="text-p3 text-[var(--foreground-muted)] line-clamp-2 mb-2">
                  {control.description}
                </p>
                <div className="flex items-center gap-4 text-p3 text-[var(--foreground-muted)]">
                  <span>{control.category}</span>
                  <span>•</span>
                  <span className={clsx('font-medium',
                    control.effectiveness === 'Effective' ? 'text-emerald-600' :
                    control.effectiveness === 'Partially Effective' ? 'text-amber-600' :
                    'text-red-600'
                  )}>
                    {control.effectiveness}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {controls.length === 0 && (
            <div className="text-center py-12">
              <Shield size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-p2 text-[var(--foreground-muted)]">No controls linked yet</p>
            </div>
          )}
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

