'use client';

import { type Risk } from '@/lib/data/erm-risks';
import { AlertTriangle, CheckCircle, Eye, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface ToleranceTrackingProps {
  risks: Risk[];
  toleranceThreshold: 'Low' | 'Medium' | 'High' | 'Critical';
  onRiskClick: (risk: Risk) => void;
  onViewAll: () => void;
}

export default function ToleranceTracking({ 
  risks, 
  toleranceThreshold, 
  onRiskClick,
  onViewAll 
}: ToleranceTrackingProps) {
  
  // Determine which risks exceed tolerance
  const exceedsThreshold = (rating: string) => {
    const hierarchy = ['Low', 'Medium', 'High', 'Critical'];
    const ratingIndex = hierarchy.indexOf(rating);
    const thresholdIndex = hierarchy.indexOf(toleranceThreshold);
    return ratingIndex > thresholdIndex;
  };

  const overToleranceRisks = risks.filter(risk => exceedsThreshold(risk.residualRating));
  const withinToleranceRisks = risks.filter(risk => !exceedsThreshold(risk.residualRating));

  const getStatusColor = (rating: string) => {
    switch (rating) {
      case 'Critical': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
      case 'High': return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
      case 'Medium': return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
      case 'Low': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Over Tolerance */}
        <button
          onClick={onViewAll}
          className="p-4 border-2 border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition-all group text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle size={20} className="text-red-600" />
            <ChevronRight size={16} className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-2xl font-bold text-red-700 mb-1">{overToleranceRisks.length}</div>
          <div className="text-p3 text-red-700 font-medium">Exceeding Tolerance</div>
        </button>

        {/* Within Tolerance */}
        <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle size={20} className="text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-700 mb-1">{withinToleranceRisks.length}</div>
          <div className="text-p3 text-green-700 font-medium">Within Tolerance</div>
        </div>
      </div>

      {/* Tolerance Threshold Indicator */}
      <div className="p-4 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-p3 text-[var(--foreground-muted)] mb-1">Risk Tolerance Threshold</div>
            <div className="text-p2 font-semibold text-[var(--foreground)]">
              {toleranceThreshold} or below
            </div>
          </div>
          <div className={clsx(
            'px-3 py-1.5 rounded-lg border-2 font-semibold text-p2',
            getStatusColor(toleranceThreshold).bg,
            getStatusColor(toleranceThreshold).text,
            getStatusColor(toleranceThreshold).border
          )}>
            {toleranceThreshold}
          </div>
        </div>
      </div>

      {/* Risks Exceeding Tolerance */}
      {overToleranceRisks.length > 0 && (
        <div className="border border-red-200 rounded-lg overflow-hidden">
          <div className="bg-red-50 px-4 py-3 border-b border-red-200">
            <h3 className="text-p2 font-semibold text-red-700">
              Risks Requiring Attention ({overToleranceRisks.length})
            </h3>
          </div>
          
          <div className="divide-y divide-red-100">
            {overToleranceRisks.slice(0, 5).map(risk => {
              const colors = getStatusColor(risk.residualRating);
              
              return (
                <button
                  key={risk.id}
                  onClick={() => onRiskClick(risk)}
                  className="w-full p-4 hover:bg-red-50 transition-colors text-left group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-p3 font-semibold text-indigo-600">{risk.id}</span>
                      <span className={clsx(
                        'px-2 py-0.5 rounded-full text-xs font-semibold border',
                        colors.bg,
                        colors.text,
                        colors.border
                      )}>
                        {risk.residualRating}
                      </span>
                    </div>
                    <Eye size={16} className="text-[var(--foreground-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="text-p2 font-medium text-[var(--foreground)] mb-1">{risk.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-[var(--foreground-muted)]">
                    <span>{risk.category}</span>
                    <span>•</span>
                    <span>{risk.owner}</span>
                    <span>•</span>
                    <span>{risk.controlsCount} controls</span>
                  </div>
                </button>
              );
            })}

            {overToleranceRisks.length > 5 && (
              <button
                onClick={onViewAll}
                className="w-full p-4 bg-red-50 hover:bg-red-100 transition-colors text-center text-p3 font-semibold text-red-700"
              >
                View all {overToleranceRisks.length} risks exceeding tolerance →
              </button>
            )}
          </div>
        </div>
      )}

      {/* No Risks Over Tolerance */}
      {overToleranceRisks.length === 0 && (
        <div className="p-6 border-2 border-green-200 bg-green-50 rounded-lg text-center">
          <CheckCircle size={32} className="text-green-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-green-700 mb-1">All Risks Within Tolerance</h3>
          <p className="text-p3 text-green-600">
            No risks currently exceed the {toleranceThreshold} threshold
          </p>
        </div>
      )}
    </div>
  );
}
