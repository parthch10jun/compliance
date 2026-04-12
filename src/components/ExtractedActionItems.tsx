'use client';

import { AlertTriangle, Calendar, Target, TrendingUp, Hash } from 'lucide-react';
import { type ActionItem } from '@/lib/services/regulatory-ai';
import clsx from 'clsx';

interface ExtractedActionItemsProps {
  actionItems: ActionItem[];
  metadata?: {
    totalPages?: number;
    processingTime?: number;
  };
}

export function ExtractedActionItems({ actionItems, metadata }: ExtractedActionItemsProps) {
  const getCriticalityColor = (criticality: string) => {
    switch (criticality.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-green-700';
    if (score >= 70) return 'text-yellow-700';
    return 'text-orange-700';
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString || dateString === 'No deadline specified' || dateString.toLowerCase() === 'null') {
      return 'No deadline specified';
    }

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'No deadline specified';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'No deadline specified';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Metadata */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Extracted Action Items</h2>
            <p className="text-sm opacity-90">
              AI-powered analysis identified {actionItems.length} compliance action
              {actionItems.length !== 1 ? 's' : ''}
            </p>
          </div>
          {metadata && (
            <div className="text-right">
              {metadata.totalPages && (
                <p className="text-sm opacity-75">
                  {metadata.totalPages} pages analyzed
                </p>
              )}
              {metadata.processingTime && (
                <p className="text-xs opacity-75">
                  Processed in {metadata.processingTime}s
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Items List */}
      <div className="space-y-4">
        {actionItems.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-[var(--border)] rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={clsx(
                      'px-3 py-1 rounded-full text-xs font-bold uppercase border',
                      getCriticalityColor(item.criticality)
                    )}
                  >
                    {item.criticality}
                  </span>
                  <span className="text-xs text-[var(--foreground-muted)] flex items-center gap-1">
                    <TrendingUp size={14} />
                    {item.confidenceScore}% confidence
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                  {item.title}
                </h3>
              </div>
              <div
                className={clsx(
                  'w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold',
                  getCriticalityColor(item.criticality)
                )}
              >
                {index + 1}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-[var(--foreground-secondary)] mb-4 leading-relaxed">
              {item.description}
            </p>

            {/* Metadata Footer */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[var(--border)]">
              {item.deadline && item.deadline !== 'No deadline specified' && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-[var(--foreground-muted)]" />
                  <span className="text-[var(--foreground-muted)]">Deadline:</span>
                  <span className="font-medium text-[var(--foreground)]">
                    {formatDate(item.deadline)}
                  </span>
                </div>
              )}

              {item.referenceSection && (
                <div className="flex items-center gap-2 text-sm">
                  <Hash size={16} className="text-[var(--foreground-muted)]" />
                  <span className="text-[var(--foreground-muted)]">Section:</span>
                  <span className="font-medium text-[var(--foreground)]">
                    {item.referenceSection}
                  </span>
                </div>
              )}

              <div className="ml-auto flex items-center gap-2">
                <div className="w-24 bg-[var(--background-secondary)] rounded-full h-2 overflow-hidden">
                  <div
                    className={clsx(
                      'h-full rounded-full transition-all',
                      item.confidenceScore >= 90 ? 'bg-green-500' :
                      item.confidenceScore >= 70 ? 'bg-yellow-500' :
                      'bg-orange-500'
                    )}
                    style={{ width: `${item.confidenceScore}%` }}
                  ></div>
                </div>
                <span className={clsx('text-xs font-semibold', getConfidenceColor(item.confidenceScore))}>
                  {item.confidenceScore}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-xs text-red-700 font-semibold uppercase mb-1">Critical</p>
          <p className="text-2xl font-bold text-red-900">
            {actionItems.filter(i => i.criticality.toLowerCase() === 'critical').length}
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-xs text-orange-700 font-semibold uppercase mb-1">High</p>
          <p className="text-2xl font-bold text-orange-900">
            {actionItems.filter(i => i.criticality.toLowerCase() === 'high').length}
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-xs text-yellow-700 font-semibold uppercase mb-1">Medium</p>
          <p className="text-2xl font-bold text-yellow-900">
            {actionItems.filter(i => i.criticality.toLowerCase() === 'medium').length}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-700 font-semibold uppercase mb-1">Low</p>
          <p className="text-2xl font-bold text-blue-900">
            {actionItems.filter(i => i.criticality.toLowerCase() === 'low').length}
          </p>
        </div>
      </div>
    </div>
  );
}
