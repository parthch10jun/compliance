'use client';

import { X, Scale } from 'lucide-react';
import clsx from 'clsx';

interface Obligation {
  id: string;
  code: string;
  title: string;
  description: string;
  authority?: string;
  category?: string;
  status: string;
  complianceScore?: number;
  dueDate?: string;
  priority?: string;
  riskRating?: string;
}

interface AllObligationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  programName: string;
  obligations: Obligation[];
  onObligationClick: (obligation: Obligation) => void;
}

export function AllObligationsModal({ 
  isOpen, 
  onClose, 
  programName, 
  obligations,
  onObligationClick 
}: AllObligationsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[var(--border)]">
          <div className="flex-1">
            <h2 className="text-h2 font-bold text-[var(--foreground)] mb-2">All Obligations</h2>
            <p className="text-p2 text-[var(--foreground-muted)]">
              {obligations.length} obligation{obligations.length !== 1 ? 's' : ''} in <span className="font-medium text-[var(--foreground)]">{programName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--background-secondary)] rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Obligations List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {obligations.map((obligation) => (
              <button
                key={obligation.id}
                onClick={() => {
                  onObligationClick(obligation);
                  onClose();
                }}
                className="w-full text-left p-4 border border-[var(--border)] rounded-lg hover:border-purple-500/30 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Scale size={16} className="text-purple-600" />
                    <span className="text-p3 font-mono text-[var(--foreground-muted)]">{obligation.code}</span>
                  </div>
                  <span className={clsx('px-2 py-0.5 text-xs rounded-full font-medium',
                    obligation.status === 'Compliant' ? 'bg-emerald-100 text-emerald-700' :
                    obligation.status === 'Partially Compliant' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  )}>
                    {obligation.status}
                  </span>
                </div>
                <p className="text-p2 font-medium text-[var(--foreground)] group-hover:text-purple-600 transition-colors mb-2">
                  {obligation.title}
                </p>
                <p className="text-p3 text-[var(--foreground-muted)] line-clamp-2 mb-3">
                  {obligation.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-p3 text-[var(--foreground-muted)]">
                    {obligation.authority && <span>{obligation.authority}</span>}
                    {(obligation.priority || obligation.riskRating) && (
                      <>
                        {obligation.authority && <span>•</span>}
                        <span className={clsx('font-medium',
                          (obligation.priority || obligation.riskRating) === 'Critical' ? 'text-red-600' :
                          (obligation.priority || obligation.riskRating) === 'High' ? 'text-orange-600' :
                          'text-blue-600'
                        )}>
                          {obligation.priority || obligation.riskRating}
                        </span>
                      </>
                    )}
                  </div>
                  {obligation.complianceScore !== undefined && (
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${obligation.complianceScore}%` }}
                        />
                      </div>
                      <span className="text-p3 font-bold text-emerald-600">{obligation.complianceScore}%</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {obligations.length === 0 && (
            <div className="text-center py-12">
              <Scale size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-p2 text-[var(--foreground-muted)]">No obligations found</p>
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

