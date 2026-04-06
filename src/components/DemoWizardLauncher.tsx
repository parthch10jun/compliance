'use client';

import { useState } from 'react';
import { useDemoWizard } from '@/contexts/DemoWizardContext';
import { demoTours } from '@/lib/demo/tours';
import {
  Sparkles, Play, X, ChevronRight, Clock, Rocket,
  BookOpen, Shield, FileText, Workflow, Zap
} from 'lucide-react';
import clsx from 'clsx';

export default function DemoWizardLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const { startTour, isActive } = useDemoWizard();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'getting-started':
        return <Rocket size={20} />;
      case 'programs':
        return <BookOpen size={20} />;
      case 'requirements':
        return <FileText size={20} />;
      case 'controls':
        return <Shield size={20} />;
      case 'workflows':
        return <Workflow size={20} />;
      case 'advanced':
        return <Zap size={20} />;
      default:
        return <Sparkles size={20} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'getting-started':
        return 'from-violet-500 to-purple-600';
      case 'programs':
        return 'from-blue-500 to-cyan-600';
      case 'requirements':
        return 'from-emerald-500 to-teal-600';
      case 'controls':
        return 'from-orange-500 to-amber-600';
      case 'workflows':
        return 'from-pink-500 to-rose-600';
      case 'advanced':
        return 'from-indigo-500 to-blue-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const handleStartTour = (tourId: string) => {
    const tour = demoTours.find(t => t.id === tourId);
    if (tour) {
      startTour(tour);
      setIsOpen(false);
    }
  };

  // Don't show launcher if demo is active
  if (isActive) return null;

  return (
    <>
      {/* Floating Launch Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        title="Start Demo Tour"
      >
        <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      </button>

      {/* Demo Tours Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--border)] bg-gradient-to-r from-[var(--primary-lightest)] to-[var(--accent-lightest)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center shadow-lg">
                    <Sparkles className="text-white" size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--foreground)]">
                      Interactive Demo Tours
                    </h2>
                    <p className="text-[var(--foreground-muted)] mt-1">
                      Learn how to use Ascent Compliance with guided walkthroughs
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/50 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Tours Grid */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {demoTours.map((tour) => (
                  <button
                    key={tour.id}
                    onClick={() => handleStartTour(tour.id)}
                    className="group text-left p-5 rounded-xl border-2 border-[var(--border)] hover:border-[var(--primary)] hover:shadow-lg transition-all duration-200 bg-white hover:bg-[var(--background-secondary)]"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={clsx(
                        'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform',
                        getCategoryColor(tour.category)
                      )}>
                        {getCategoryIcon(tour.category)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                            {tour.name}
                          </h3>
                          <span className="text-2xl">{tour.icon}</span>
                        </div>
                        <p className="text-sm text-[var(--foreground-muted)] mb-3 line-clamp-2">
                          {tour.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)]">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            {tour.estimatedTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <Play size={14} />
                            {tour.steps.length} steps
                          </div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRight
                        size={20}
                        className="text-[var(--foreground-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all flex-shrink-0"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

