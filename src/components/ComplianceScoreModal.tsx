'use client';

import { X, Calculator, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Clock, Shield, FileText, FlaskConical } from 'lucide-react';
import { ComplianceCalculator } from '@/lib/utils/compliance-calculator';
import { DEFAULT_CALCULATION_CONFIGS } from '@/lib/types/compliance-calculations';
import clsx from 'clsx';

interface ComplianceScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  programId?: string;
  // Allow passing pre-calculated data or mock data
  data?: {
    overallScore: number;
    trend?: number;
    programs?: number;
    requirements?: { total: number; compliant: number; atRisk: number; nonCompliant: number };
    controls?: { total: number; effective: number; partiallyEffective: number; ineffective: number };
    tests?: { total: number; passed: number; failed: number; pending: number };
    obligations?: { total: number; completed: number; inProgress: number; overdue: number };
  };
}

export function ComplianceScoreModal({ isOpen, onClose, title = 'Organization', data }: ComplianceScoreModalProps) {
  if (!isOpen) return null;

  // Default mock data if not provided
  const scoreData = data || {
    overallScore: 87,
    trend: 2.4,
    programs: 10,
    requirements: { total: 335, compliant: 289, atRisk: 32, nonCompliant: 14 },
    controls: { total: 368, effective: 312, partiallyEffective: 42, ineffective: 14 },
    tests: { total: 476, passed: 396, failed: 42, pending: 38 },
    obligations: { total: 68, completed: 52, inProgress: 12, overdue: 4 },
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Calculate component scores
  const reqCompliance = scoreData.requirements ? 
    Math.round((scoreData.requirements.compliant / scoreData.requirements.total) * 100) : 86;
  const ctrlEffectiveness = scoreData.controls ? 
    Math.round((scoreData.controls.effective / scoreData.controls.total) * 100) : 85;
  const testPassRate = scoreData.tests ? 
    Math.round((scoreData.tests.passed / scoreData.tests.total) * 100) : 83;
  const oblCompletion = scoreData.obligations ? 
    Math.round((scoreData.obligations.completed / scoreData.obligations.total) * 100) : 76;

  const components = [
    { 
      name: 'Requirements Compliance', 
      score: reqCompliance, 
      weight: 0.30,
      icon: FileText,
      details: scoreData.requirements
    },
    { 
      name: 'Control Effectiveness', 
      score: ctrlEffectiveness, 
      weight: 0.30,
      icon: Shield,
      details: scoreData.controls
    },
    { 
      name: 'Test Pass Rate', 
      score: testPassRate, 
      weight: 0.25,
      icon: FlaskConical,
      details: scoreData.tests
    },
    { 
      name: 'Obligation Completion', 
      score: oblCompletion, 
      weight: 0.15,
      icon: CheckCircle2,
      details: scoreData.obligations
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Calculator size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Compliance Score Breakdown</h2>
                <p className="text-white/70 text-sm mt-0.5">{title} • Weighted Average Method</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Overall Score */}
          <div className="mt-6 flex items-center gap-8">
            <div>
              <p className="text-white/70 text-sm mb-1">Overall Score</p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold">{scoreData.overallScore}%</span>
                {scoreData.trend && (
                  <div className={clsx(
                    'flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium',
                    scoreData.trend >= 0 ? 'bg-emerald-500/20 text-emerald-200' : 'bg-red-500/20 text-red-200'
                  )}>
                    {scoreData.trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {scoreData.trend >= 0 ? '+' : ''}{scoreData.trend}%
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 grid grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{scoreData.requirements?.total || 335}</p>
                <p className="text-white/60 text-xs">Requirements</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{scoreData.controls?.total || 368}</p>
                <p className="text-white/60 text-xs">Controls</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{scoreData.tests?.total || 476}</p>
                <p className="text-white/60 text-xs">Tests</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{scoreData.obligations?.total || 68}</p>
                <p className="text-white/60 text-xs">Obligations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Score Components */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-4">
            Score Components
          </h3>
          <div className="space-y-5">
            {components.map((component, idx) => {
              const Icon = component.icon;
              const weightedScore = (component.score * component.weight).toFixed(1);
              
              return (
                <div key={idx} className="bg-[var(--background-secondary)] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        component.score >= 80 ? 'bg-emerald-100' :
                        component.score >= 60 ? 'bg-amber-100' : 'bg-red-100'
                      )}>
                        <Icon size={20} className={getScoreColor(component.score)} />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--foreground)]">{component.name}</p>
                        <p className="text-xs text-[var(--foreground-muted)]">
                          Weight: {(component.weight * 100)}% • Contribution: {weightedScore}%
                        </p>
                      </div>
                    </div>
                    <div className={clsx('text-2xl font-bold', getScoreColor(component.score))}>
                      {component.score}%
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={clsx('h-full rounded-full transition-all duration-500', getScoreBg(component.score))}
                      style={{ width: `${component.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calculation Formula */}
          <div className="mt-6 p-4 bg-violet-50 border border-violet-200 rounded-xl">
            <h4 className="font-medium text-violet-900 mb-2 flex items-center gap-2">
              <Calculator size={16} />
              Calculation Formula
            </h4>
            <p className="text-sm text-violet-700 font-mono">
              Score = (Requirements × 0.30) + (Controls × 0.30) + (Tests × 0.25) + (Obligations × 0.15)
            </p>
            <p className="text-xs text-violet-600 mt-2">
              = ({reqCompliance} × 0.30) + ({ctrlEffectiveness} × 0.30) + ({testPassRate} × 0.25) + ({oblCompletion} × 0.15) = {scoreData.overallScore}%
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--background-secondary)] flex items-center justify-between">
          <p className="text-sm text-[var(--foreground-muted)]">
            Last calculated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg font-medium text-sm hover:bg-violet-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

