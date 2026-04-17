'use client';

import { X, User, Building2, Target, Calendar, Shield, TrendingUp, FileText } from 'lucide-react';
import { type Risk } from '@/lib/data/erm-risks';
import clsx from 'clsx';

interface RiskDetailModalProps {
  risk: Risk | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RiskDetailModal({ risk, isOpen, onClose }: RiskDetailModalProps) {
  if (!isOpen || !risk) return null;

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Closed': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Identified': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Assessed': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Treated': return 'bg-green-100 text-green-700 border-green-200';
      case 'Monitored': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="min-h-screen px-4 flex items-center justify-center">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

        {/* Modal */}
        <div 
          className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-[var(--border)]">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-p2 font-semibold text-indigo-600">{risk.id}</span>
                <span className={clsx(
                  'px-2 py-0.5 rounded-full text-p3 font-semibold border',
                  getRatingColor(risk.inherentRating)
                )}>
                  {risk.inherentRating}
                </span>
                <span className={clsx(
                  'px-2 py-0.5 rounded-full text-p3 font-semibold border',
                  getStatusColor(risk.status)
                )}>
                  {risk.status}
                </span>
              </div>
              <h2 className="text-xl font-bold text-[var(--foreground)]">{risk.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Description */}
            <div>
              <h3 className="text-base font-semibold text-[var(--foreground)] mb-2 flex items-center gap-2">
                <FileText size={16} className="text-[var(--foreground-muted)]" />
                Description
              </h3>
              <p className="text-p2 text-[var(--foreground-secondary)] leading-relaxed">
                {risk.description}
              </p>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Owner */}
              <div className="p-4 bg-[var(--background-secondary)] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User size={16} className="text-[var(--foreground-muted)]" />
                  <span className="text-p3 font-semibold text-[var(--foreground-muted)]">Risk Owner</span>
                </div>
                <p className="text-p2 font-medium text-[var(--foreground)]">{risk.owner}</p>
              </div>

              {/* Business Unit */}
              <div className="p-4 bg-[var(--background-secondary)] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 size={16} className="text-[var(--foreground-muted)]" />
                  <span className="text-p3 font-semibold text-[var(--foreground-muted)]">Business Unit</span>
                </div>
                <p className="text-p2 font-medium text-[var(--foreground)]">{risk.businessUnit}</p>
              </div>

              {/* Category */}
              <div className="p-4 bg-[var(--background-secondary)] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={16} className="text-[var(--foreground-muted)]" />
                  <span className="text-p3 font-semibold text-[var(--foreground-muted)]">Category</span>
                </div>
                <p className="text-p2 font-medium text-[var(--foreground)]">{risk.category}</p>
              </div>

              {/* Treatment */}
              <div className="p-4 bg-[var(--background-secondary)] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-[var(--foreground-muted)]" />
                  <span className="text-p3 font-semibold text-[var(--foreground-muted)]">Treatment Strategy</span>
                </div>
                <p className="text-p2 font-medium text-[var(--foreground)]">{risk.treatment}</p>
              </div>
            </div>

            {/* Risk Assessment */}
            <div>
              <h3 className="text-base font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-[var(--foreground-muted)]" />
                Risk Assessment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Inherent Risk */}
                <div className="p-4 border border-[var(--border)] rounded-lg">
                  <div className="text-p3 text-[var(--foreground-muted)] mb-2">Inherent Risk</div>
                  <div className={clsx(
                    'inline-flex px-3 py-1.5 rounded-lg text-base font-bold border-2',
                    getRatingColor(risk.inherentRating)
                  )}>
                    {risk.inherentRating}
                  </div>
                  <p className="text-p3 text-[var(--foreground-muted)] mt-2">Before treatment</p>
                </div>

                {/* Residual Risk */}
                <div className="p-4 border border-[var(--border)] rounded-lg">
                  <div className="text-p3 text-[var(--foreground-muted)] mb-2">Residual Risk</div>
                  <div className={clsx(
                    'inline-flex px-3 py-1.5 rounded-lg text-base font-bold border-2',
                    getRatingColor(risk.residualRating)
                  )}>
                    {risk.residualRating}
                  </div>
                  <p className="text-p3 text-[var(--foreground-muted)] mt-2">After {risk.controlsCount} controls</p>
                </div>
              </div>
            </div>

            {/* Review Dates */}
            <div>
              <h3 className="text-base font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-[var(--foreground-muted)]" />
                Review Schedule
              </h3>
              <div className="flex items-center gap-6 text-p2">
                <div>
                  <span className="text-[var(--foreground-muted)]">Last Review:</span>
                  <span className="ml-2 font-medium text-[var(--foreground)]">{risk.lastReviewDate}</span>
                </div>
                <div>
                  <span className="text-[var(--foreground-muted)]">Next Review:</span>
                  <span className="ml-2 font-medium text-indigo-600">{risk.nextReviewDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border)] bg-[var(--background)]">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[var(--border)] rounded-lg text-p2 font-medium text-[var(--foreground)] hover:bg-white transition-colors"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg text-p2 font-medium hover:shadow-lg transition-all">
              Edit Risk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
