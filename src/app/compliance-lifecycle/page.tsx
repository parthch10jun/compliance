'use client';

import { useState } from 'react';
import { PageHeader } from '@/components';
import {
  TrendingUp, TrendingDown, Clock, CheckCircle2, Target, Zap,
  FileText, Search, AlertTriangle, BarChart3, Activity, ArrowRight,
  Calendar, Users, Brain, Shield
} from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

// Lifecycle stages with before/after metrics
const lifecycleStages = [
  {
    id: 'dissemination',
    name: 'Regulatory Dissemination',
    icon: FileText,
    color: 'blue',
    description: 'From circular receipt to stakeholder notification',
    metrics: {
      before: {
        time: '4-6 hours',
        timeValue: 5,
        accuracy: '75%',
        accuracyValue: 75,
        coverage: '60%',
        coverageValue: 60,
        method: 'Manual reading, email forwarding'
      },
      after: {
        time: '15-20 min',
        timeValue: 0.3,
        accuracy: '96%',
        accuracyValue: 96,
        coverage: '100%',
        coverageValue: 100,
        method: 'AI extraction, auto-assignment'
      }
    },
    improvements: {
      timeReduction: '95%',
      accuracyGain: '+21%',
      coverageGain: '+40%'
    },
    features: [
      'AI-powered PDF parsing',
      'Automatic action extraction',
      'Smart stakeholder assignment',
      'Instant email notifications',
      'Deadline tracking'
    ],
    route: '/circulars/upload'
  },
  {
    id: 'assessment',
    name: 'Compliance Assessment',
    icon: Search,
    color: 'purple',
    description: 'From requirement identification to control mapping',
    metrics: {
      before: {
        time: '2-3 weeks',
        timeValue: 17.5,
        accuracy: '70%',
        accuracyValue: 70,
        coverage: '65%',
        coverageValue: 65,
        method: 'Spreadsheet tracking, manual reviews'
      },
      after: {
        time: '3-4 days',
        timeValue: 3.5,
        accuracy: '92%',
        accuracyValue: 92,
        coverage: '98%',
        coverageValue: 98,
        method: 'Digital workflows, automated mapping'
      }
    },
    improvements: {
      timeReduction: '80%',
      accuracyGain: '+22%',
      coverageGain: '+33%'
    },
    features: [
      'Pre-built test templates (50+)',
      'Framework mapping automation',
      'Risk-based prioritization',
      'Gap analysis tools',
      'Control effectiveness tracking'
    ],
    route: '/test-templates'
  },
  {
    id: 'monitoring',
    name: 'Control Testing & Monitoring',
    icon: Shield,
    color: 'green',
    description: 'From test planning to evidence collection',
    metrics: {
      before: {
        time: '4-5 hours/test',
        timeValue: 4.5,
        accuracy: '68%',
        accuracyValue: 68,
        coverage: '55%',
        coverageValue: 55,
        method: 'Manual procedures, email evidence'
      },
      after: {
        time: '45-60 min/test',
        timeValue: 0.9,
        accuracy: '94%',
        accuracyValue: 94,
        coverage: '95%',
        coverageValue: 95,
        method: 'Digital execution, centralized evidence'
      }
    },
    improvements: {
      timeReduction: '80%',
      accuracyGain: '+26%',
      coverageGain: '+40%'
    },
    features: [
      'Step-by-step test procedures',
      'In-app evidence upload',
      'Automated scheduling',
      'Real-time status tracking',
      'Reviewer workflows'
    ],
    route: '/control-testing'
  },
  {
    id: 'reporting',
    name: 'Issue Management & Reporting',
    icon: BarChart3,
    color: 'orange',
    description: 'From issue identification to remediation closure',
    metrics: {
      before: {
        time: '3-4 weeks',
        timeValue: 24.5,
        accuracy: '60%',
        accuracyValue: 60,
        coverage: '50%',
        coverageValue: 50,
        method: 'Email threads, scattered tracking'
      },
      after: {
        time: '1-2 weeks',
        timeValue: 10.5,
        accuracy: '90%',
        accuracyValue: 90,
        coverage: '95%',
        coverageValue: 95,
        method: 'Action plans, progress tracking'
      }
    },
    improvements: {
      timeReduction: '57%',
      accuracyGain: '+30%',
      coverageGain: '+45%'
    },
    features: [
      'Structured action plans',
      'Root cause analysis',
      'Step-by-step remediation',
      'Automated escalation',
      'Executive dashboards'
    ],
    route: '/issue-management'
  }
];

export default function ComplianceLifecyclePage() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  // Calculate overall metrics
  const overallTimeReduction = Math.round(
    lifecycleStages.reduce((sum, s) => sum + parseFloat(s.improvements.timeReduction), 0) / lifecycleStages.length
  );
  
  const overallAccuracyGain = Math.round(
    lifecycleStages.reduce((sum, s) => sum + parseFloat(s.improvements.accuracyGain.replace('+', '').replace('%', '')), 0) / lifecycleStages.length
  );

  return (
    <div className="max-w-full">
      <PageHeader
        title="Compliance Lifecycle Efficiency"
        description="Measuring impact across the complete compliance lifecycle"
      />

      {/* Overall Impact Summary */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-blue-900">Time Reduction</h3>
          </div>
          <p className="text-4xl font-bold text-blue-600">{overallTimeReduction}%</p>
          <p className="text-xs text-blue-700 mt-1">Avg. across lifecycle</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-green-900">Accuracy Gain</h3>
          </div>
          <p className="text-4xl font-bold text-green-600">+{overallAccuracyGain}%</p>
          <p className="text-xs text-green-700 mt-1">Quality improvement</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-purple-900">Coverage Improvement</h3>
          </div>
          <p className="text-4xl font-bold text-purple-600">+37%</p>
          <p className="text-xs text-purple-700 mt-1">Compliance visibility</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-600 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-orange-900">Stages Automated</h3>
          </div>
          <p className="text-4xl font-bold text-orange-600">4/4</p>
          <p className="text-xs text-orange-700 mt-1">End-to-end coverage</p>
        </div>
      </div>

      {/* Lifecycle Visual Flow */}
      <div className="bg-white rounded-xl border p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Activity className="w-6 h-6 text-blue-600" />
          Compliance Lifecycle Stages
        </h2>

        <div className="grid grid-cols-4 gap-6 mb-8">
          {lifecycleStages.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = selectedStage === stage.id;

            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(isSelected ? null : stage.id)}
                className={clsx(
                  'relative p-6 rounded-xl border-2 transition-all text-left',
                  isSelected
                    ? `border-${stage.color}-500 bg-${stage.color}-50 shadow-lg scale-105`
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                )}
              >
                {/* Stage Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
                  {idx + 1}
                </div>

                {/* Icon */}
                <div className={clsx(
                  'p-3 rounded-lg mb-4 inline-block',
                  `bg-${stage.color}-100`
                )}>
                  <Icon className={clsx('w-6 h-6', `text-${stage.color}-600`)} />
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-gray-900 mb-2">{stage.name}</h3>
                <p className="text-xs text-gray-600 mb-4">{stage.description}</p>

                {/* Key Metric */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500">Time Saved</span>
                    <span className={clsx('font-bold', `text-${stage.color}-600`)}>
                      {stage.improvements.timeReduction}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={clsx('h-full rounded-full', `bg-${stage.color}-600`)}
                      style={{ width: stage.improvements.timeReduction }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail */}
        {selectedStage && lifecycleStages.find(s => s.id === selectedStage) && (
          <div className="mt-8 p-6 bg-gray-50 rounded-xl border">
            {(() => {
              const stage = lifecycleStages.find(s => s.id === selectedStage)!;
              const Icon = stage.icon;

              return (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={clsx('p-2 rounded-lg', `bg-${stage.color}-600`)}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{stage.name}</h3>
                        <p className="text-sm text-gray-600">{stage.description}</p>
                      </div>
                    </div>
                    <Link
                      href={stage.route}
                      className={clsx(
                        'flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors',
                        `bg-${stage.color}-600 hover:bg-${stage.color}-700`
                      )}
                    >
                      View Feature
                      <ArrowRight size={16} />
                    </Link>
                  </div>

                  {/* Before vs After Comparison */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Before */}
                    <div className="bg-white rounded-lg border-2 border-red-200 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <h4 className="font-bold text-gray-900">Before (Manual Process)</h4>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Average Time</p>
                          <p className="text-2xl font-bold text-red-600">{stage.metrics.before.time}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Accuracy</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-500 rounded-full"
                                style={{ width: `${stage.metrics.before.accuracyValue}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-red-600">{stage.metrics.before.accuracy}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Coverage</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-500 rounded-full"
                                style={{ width: `${stage.metrics.before.coverageValue}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-red-600">{stage.metrics.before.coverage}</span>
                          </div>
                        </div>
                        <div className="pt-4 border-t">
                          <p className="text-xs text-gray-500 mb-1">Method</p>
                          <p className="text-sm text-gray-700">{stage.metrics.before.method}</p>
                        </div>
                      </div>
                    </div>

                    {/* After */}
                    <div className={clsx('bg-white rounded-lg border-2 p-6', `border-${stage.color}-200`)}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className={clsx('w-3 h-3 rounded-full', `bg-${stage.color}-500`)}></div>
                        <h4 className="font-bold text-gray-900">After (Automated Process)</h4>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Average Time</p>
                          <p className={clsx('text-2xl font-bold', `text-${stage.color}-600`)}>{stage.metrics.after.time}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Accuracy</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={clsx('h-full rounded-full', `bg-${stage.color}-600`)}
                                style={{ width: `${stage.metrics.after.accuracyValue}%` }}
                              />
                            </div>
                            <span className={clsx('text-sm font-bold', `text-${stage.color}-600`)}>{stage.metrics.after.accuracy}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Coverage</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={clsx('h-full rounded-full', `bg-${stage.color}-600`)}
                                style={{ width: `${stage.metrics.after.coverageValue}%` }}
                              />
                            </div>
                            <span className={clsx('text-sm font-bold', `text-${stage.color}-600`)}>{stage.metrics.after.coverage}</span>
                          </div>
                        </div>
                        <div className="pt-4 border-t">
                          <p className="text-xs text-gray-500 mb-1">Method</p>
                          <p className="text-sm text-gray-700">{stage.metrics.after.method}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Improvements */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className={clsx('p-4 rounded-lg', `bg-${stage.color}-50`)}>
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingDown className={clsx('w-4 h-4', `text-${stage.color}-600`)} />
                        <p className="text-xs font-semibold text-gray-700">Time Reduction</p>
                      </div>
                      <p className={clsx('text-2xl font-bold', `text-${stage.color}-600`)}>{stage.improvements.timeReduction}</p>
                    </div>
                    <div className={clsx('p-4 rounded-lg', `bg-${stage.color}-50`)}>
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className={clsx('w-4 h-4', `text-${stage.color}-600`)} />
                        <p className="text-xs font-semibold text-gray-700">Accuracy Gain</p>
                      </div>
                      <p className={clsx('text-2xl font-bold', `text-${stage.color}-600`)}>{stage.improvements.accuracyGain}</p>
                    </div>
                    <div className={clsx('p-4 rounded-lg', `bg-${stage.color}-50`)}>
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className={clsx('w-4 h-4', `text-${stage.color}-600`)} />
                        <p className="text-xs font-semibold text-gray-700">Coverage Gain</p>
                      </div>
                      <p className={clsx('text-2xl font-bold', `text-${stage.color}-600`)}>{stage.improvements.coverageGain}</p>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div>
                    <h5 className="text-sm font-semibold text-gray-700 mb-3">Key Features Enabling This Improvement</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {stage.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-3 bg-white rounded-lg border">
                          <CheckCircle2 className={clsx('w-4 h-4 flex-shrink-0 mt-0.5', `text-${stage.color}-600`)} />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* ROI Calculation */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-green-600" />
          Return on Investment (RoI)
        </h2>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 border border-green-200">
            <p className="text-sm text-gray-600 mb-2">Time Saved per Month</p>
            <p className="text-3xl font-bold text-green-600">~160 hours</p>
            <p className="text-xs text-gray-500 mt-1">Across all 4 lifecycle stages</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-green-200">
            <p className="text-sm text-gray-600 mb-2">Cost Savings per Year</p>
            <p className="text-3xl font-bold text-green-600">₹48L+</p>
            <p className="text-xs text-gray-500 mt-1">Based on avg. compliance team cost</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-green-200">
            <p className="text-sm text-gray-600 mb-2">Risk Reduction</p>
            <p className="text-3xl font-bold text-green-600">65%</p>
            <p className="text-xs text-gray-500 mt-1">Fewer compliance gaps and delays</p>
          </div>
        </div>
      </div>
    </div>
  );
}
