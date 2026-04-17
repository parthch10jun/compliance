'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Shield, TrendingUp, Calendar, User, Building2,
  FileText, Edit, Trash2, AlertTriangle, CheckCircle2, Clock,
  Target, Activity, Link as LinkIcon, Plus, GitBranch
} from 'lucide-react';
import clsx from 'clsx';
import { mockRisks, type Risk } from '@/lib/data/erm-risks';

export default function RiskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const riskId = params.id as string;
  
  const risk = mockRisks.find(r => r.id === riskId);
  const [activeTab, setActiveTab] = useState<'overview' | 'assessment' | 'treatment' | 'controls' | 'bowtie' | 'history'>('overview');
  
  if (!risk) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertTriangle size={48} className="mx-auto mb-4 text-red-600" />
          <h2 className="text-xl font-semibold mb-2">Risk Not Found</h2>
          <p className="text-[var(--foreground-muted)] mb-4">The risk you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/erm/risk-register')}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)]"
          >
            Back to Risk Register
          </button>
        </div>
      </div>
    );
  }
  
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Identified':
        return 'bg-blue-100 text-blue-700';
      case 'Assessed':
        return 'bg-purple-100 text-purple-700';
      case 'Treated':
        return 'bg-green-100 text-green-700';
      case 'Monitored':
        return 'bg-orange-100 text-orange-700';
      case 'Closed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/erm/risk-register')}
          className="flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Risk Register
        </button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Shield size={24} className="text-[var(--primary)]" />
              <h1 className="text-h2 font-bold text-[var(--foreground)]">{risk.id}</h1>
              <span className={clsx('px-3 py-1 text-sm font-medium rounded-full', getStatusColor(risk.status))}>
                {risk.status}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">{risk.title}</h2>
            <p className="text-p1 text-[var(--foreground-muted)] mb-4">{risk.description}</p>
            <div className="flex items-center gap-4 text-sm text-[var(--foreground-muted)]">
              <span className="flex items-center gap-1">
                <User size={14} />
                {risk.owner}
              </span>
              <span className="flex items-center gap-1">
                <Building2 size={14} />
                {risk.businessUnit}
              </span>
              <span className="flex items-center gap-1">
                <FileText size={14} />
                {risk.category}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium">
              <Edit size={18} />
              Edit Risk
            </button>
            <button className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Risk Rating Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {/* Inherent Risk */}
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="text-sm text-[var(--foreground-muted)] mb-2">Inherent Risk</div>
          <div className="flex items-center gap-2 mb-2">
            <span className={clsx('px-3 py-1 text-lg font-bold rounded-lg border', getRatingColor(risk.inherentRating))}>
              {risk.inherentRating}
            </span>
          </div>
          <div className="text-xs text-[var(--foreground-muted)]">
            L: {risk.inherentLikelihood} × C: {risk.inherentConsequence}
          </div>
        </div>
        
        {/* Residual Risk */}
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="text-sm text-[var(--foreground-muted)] mb-2">Residual Risk</div>
          <div className="flex items-center gap-2 mb-2">
            <span className={clsx('px-3 py-1 text-lg font-bold rounded-lg border', getRatingColor(risk.residualRating))}>
              {risk.residualRating}
            </span>
          </div>
          <div className="text-xs text-[var(--foreground-muted)]">
            L: {risk.residualLikelihood} × C: {risk.residualConsequence}
          </div>
        </div>
        
        {/* Treatment Strategy */}
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="text-sm text-[var(--foreground-muted)] mb-2">Treatment</div>
          <div className="text-lg font-semibold text-[var(--foreground)] mb-2">{risk.treatment}</div>
          <div className="text-xs text-[var(--foreground-muted)]">
            {risk.controlsCount} controls
          </div>
        </div>
        
        {/* Review Dates */}
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="text-sm text-[var(--foreground-muted)] mb-2">Next Review</div>
          <div className="text-lg font-semibold text-[var(--foreground)] mb-2">
            {new Date(risk.nextReviewDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="text-xs text-[var(--foreground-muted)]">
            Last: {new Date(risk.lastReviewDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-[var(--border)] rounded-lg mb-6">
        <div className="border-b border-[var(--border)] px-6">
          <div className="flex gap-6">
            {[
              { key: 'overview', label: 'Overview', icon: FileText },
              { key: 'assessment', label: 'Assessment', icon: Target },
              { key: 'treatment', label: 'Treatment', icon: Shield },
              { key: 'controls', label: 'Controls', icon: CheckCircle2 },
              { key: 'bowtie', label: 'Bow-tie', icon: GitBranch },
              { key: 'history', label: 'History', icon: Clock },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={clsx(
                  'flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.key
                    ? 'border-[var(--primary)] text-[var(--primary)]'
                    : 'border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                )}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && <OverviewTab risk={risk} />}
          {activeTab === 'assessment' && <AssessmentTab risk={risk} />}
          {activeTab === 'treatment' && <TreatmentTab risk={risk} />}
          {activeTab === 'controls' && <ControlsTab risk={risk} />}
          {activeTab === 'bowtie' && <BowtieTab risk={risk} />}
          {activeTab === 'history' && <HistoryTab risk={risk} />}
        </div>
      </div>
    </div>
  );
}

// Tab Components
function OverviewTab({ risk }: { risk: Risk }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Risk Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-[var(--border)]">
              <span className="text-sm text-[var(--foreground-muted)]">Risk ID</span>
              <span className="text-sm font-medium">{risk.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border)]">
              <span className="text-sm text-[var(--foreground-muted)]">Category</span>
              <span className="text-sm font-medium">{risk.category}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border)]">
              <span className="text-sm text-[var(--foreground-muted)]">Business Unit</span>
              <span className="text-sm font-medium">{risk.businessUnit}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border)]">
              <span className="text-sm text-[var(--foreground-muted)]">Owner</span>
              <span className="text-sm font-medium">{risk.owner}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border)]">
              <span className="text-sm text-[var(--foreground-muted)]">Status</span>
              <span className="text-sm font-medium">{risk.status}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Review Schedule</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-[var(--border)]">
              <span className="text-sm text-[var(--foreground-muted)]">Last Review</span>
              <span className="text-sm font-medium">
                {new Date(risk.lastReviewDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border)]">
              <span className="text-sm text-[var(--foreground-muted)]">Next Review</span>
              <span className="text-sm font-medium text-orange-600">
                {new Date(risk.nextReviewDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Risk Description</h3>
          <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
            {risk.description}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Treatment Strategy</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-blue-900">{risk.treatment}</span>
              <span className="text-xs text-blue-700">{risk.controlsCount} controls implemented</span>
            </div>
            <p className="text-sm text-blue-700">
              {risk.treatment === 'Mitigate' && 'Implementing controls to reduce risk to acceptable levels'}
              {risk.treatment === 'Avoid' && 'Eliminating activities that cause this risk'}
              {risk.treatment === 'Transfer' && 'Sharing or transferring risk through insurance or contracts'}
              {risk.treatment === 'Accept' && 'Accepting the risk within tolerance levels'}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Risk Ratings Summary</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-[var(--foreground-muted)]">Inherent Risk</span>
              <span className="text-sm font-semibold">{risk.inherentRating}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-[var(--foreground-muted)]">Residual Risk</span>
              <span className="text-sm font-semibold">{risk.residualRating}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-green-700">Risk Reduction</span>
              <span className="text-sm font-semibold text-green-700">
                {risk.inherentLikelihood * risk.inherentConsequence - risk.residualLikelihood * risk.residualConsequence} points
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AssessmentTab({ risk }: { risk: Risk }) {
  const hasControls = risk.controlsCount > 0;

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      {!hasControls && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Residual risk assessment will be available once controls are implemented and applied to this risk.
          </p>
        </div>
      )}

      <div className={hasControls ? "grid grid-cols-2 gap-6" : ""}>
        {/* Inherent Assessment */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4">Inherent Risk Assessment</h3>
          <p className="text-sm text-red-700 mb-4">Risk level before any controls are applied</p>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-red-800 mb-2">Likelihood</div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className={clsx(
                      'w-12 h-12 flex items-center justify-center rounded-lg font-bold',
                      i === risk.inherentLikelihood ? 'bg-red-600 text-white' : 'bg-white text-gray-400 border border-gray-300'
                    )}
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div className="text-xs text-red-700 mt-1">
                {risk.inherentLikelihood === 1 && 'Rare'}
                {risk.inherentLikelihood === 2 && 'Unlikely'}
                {risk.inherentLikelihood === 3 && 'Possible'}
                {risk.inherentLikelihood === 4 && 'Likely'}
                {risk.inherentLikelihood === 5 && 'Almost Certain'}
              </div>
            </div>

            <div>
              <div className="text-sm text-red-800 mb-2">Consequence</div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className={clsx(
                      'w-12 h-12 flex items-center justify-center rounded-lg font-bold',
                      i === risk.inherentConsequence ? 'bg-red-600 text-white' : 'bg-white text-gray-400 border border-gray-300'
                    )}
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div className="text-xs text-red-700 mt-1">
                {risk.inherentConsequence === 1 && 'Insignificant'}
                {risk.inherentConsequence === 2 && 'Minor'}
                {risk.inherentConsequence === 3 && 'Moderate'}
                {risk.inherentConsequence === 4 && 'Major'}
                {risk.inherentConsequence === 5 && 'Catastrophic'}
              </div>
            </div>

            <div className="pt-4 border-t border-red-300">
              <div className="text-sm text-red-800 mb-2">Risk Score</div>
              <div className="text-3xl font-bold text-red-900">
                {risk.inherentLikelihood * risk.inherentConsequence}
              </div>
              <div className="text-sm text-red-700">
                Rating: <strong>{risk.inherentRating}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Residual Assessment - Only show if controls exist */}
        {hasControls && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Residual Risk Assessment</h3>
            <p className="text-sm text-green-700 mb-4">Risk level after controls are applied</p>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-green-800 mb-2">Likelihood</div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className={clsx(
                      'w-12 h-12 flex items-center justify-center rounded-lg font-bold',
                      i === risk.residualLikelihood ? 'bg-green-600 text-white' : 'bg-white text-gray-400 border border-gray-300'
                    )}
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div className="text-xs text-green-700 mt-1">
                {risk.residualLikelihood === 1 && 'Rare'}
                {risk.residualLikelihood === 2 && 'Unlikely'}
                {risk.residualLikelihood === 3 && 'Possible'}
                {risk.residualLikelihood === 4 && 'Likely'}
                {risk.residualLikelihood === 5 && 'Almost Certain'}
              </div>
            </div>

            <div>
              <div className="text-sm text-green-800 mb-2">Consequence</div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className={clsx(
                      'w-12 h-12 flex items-center justify-center rounded-lg font-bold',
                      i === risk.residualConsequence ? 'bg-green-600 text-white' : 'bg-white text-gray-400 border border-gray-300'
                    )}
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div className="text-xs text-green-700 mt-1">
                {risk.residualConsequence === 1 && 'Insignificant'}
                {risk.residualConsequence === 2 && 'Minor'}
                {risk.residualConsequence === 3 && 'Moderate'}
                {risk.residualConsequence === 4 && 'Major'}
                {risk.residualConsequence === 5 && 'Catastrophic'}
              </div>
            </div>

            <div className="pt-4 border-t border-green-300">
              <div className="text-sm text-green-800 mb-2">Risk Score</div>
              <div className="text-3xl font-bold text-green-900">
                {risk.residualLikelihood * risk.residualConsequence}
              </div>
              <div className="text-sm text-green-700">
                Rating: <strong>{risk.residualRating}</strong>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

function TreatmentTab({ risk }: { risk: Risk }) {
  const treatments = [
    {
      id: 'TRT-001',
      title: 'Implement Multi-Factor Authentication',
      status: 'Completed',
      priority: 'High',
      dueDate: '2024-03-15',
      owner: risk.owner,
      progress: 100
    },
    {
      id: 'TRT-002',
      title: 'Conduct Security Awareness Training',
      status: 'In Progress',
      priority: 'High',
      dueDate: '2024-05-01',
      owner: risk.owner,
      progress: 65
    },
    {
      id: 'TRT-003',
      title: 'Regular Penetration Testing',
      status: 'Planned',
      priority: 'Medium',
      dueDate: '2024-06-30',
      owner: risk.owner,
      progress: 0
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Treatment Actions</h3>
        <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] flex items-center gap-2">
          <Plus size={16} />
          Add Treatment
        </button>
      </div>

      <div className="space-y-4">
        {treatments.map(treatment => (
          <div key={treatment.id} className="bg-white border border-[var(--border)] rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-[var(--primary)]">{treatment.id}</span>
                  <span className={clsx(
                    'px-2 py-0.5 text-xs font-medium rounded',
                    treatment.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    treatment.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  )}>
                    {treatment.status}
                  </span>
                  <span className={clsx(
                    'px-2 py-0.5 text-xs font-medium rounded',
                    treatment.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  )}>
                    {treatment.priority}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-[var(--foreground)] mb-1">{treatment.title}</h4>
                <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)]">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    Due: {new Date(treatment.dueDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {treatment.owner}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)] mb-1">
                <span>Progress</span>
                <span className="font-medium">{treatment.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={clsx(
                    'h-2 rounded-full transition-all',
                    treatment.progress === 100 ? 'bg-green-600' : 'bg-blue-600'
                  )}
                  style={{ width: `${treatment.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ControlsTab({ risk }: { risk: Risk }) {
  const controls = [
    {
      id: 'CTL-001',
      name: 'Multi-Factor Authentication',
      type: 'Preventive',
      effectiveness: 'High',
      frequency: 'Continuous',
      owner: risk.owner,
      lastTested: '2024-04-01'
    },
    {
      id: 'CTL-002',
      name: 'Intrusion Detection System',
      type: 'Detective',
      effectiveness: 'High',
      frequency: 'Continuous',
      owner: risk.owner,
      lastTested: '2024-04-10'
    },
    {
      id: 'CTL-003',
      name: 'Security Awareness Training',
      type: 'Preventive',
      effectiveness: 'Medium',
      frequency: 'Quarterly',
      owner: risk.owner,
      lastTested: '2024-03-15'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Risk Controls ({risk.controlsCount})</h3>
        <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] flex items-center gap-2">
          <Plus size={16} />
          Add Control
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-[var(--border)]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--foreground)]">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Control Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Effectiveness</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Frequency</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Last Tested</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Owner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {controls.map(control => (
              <tr key={control.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-[var(--primary)]">{control.id}</td>
                <td className="px-4 py-3 text-sm font-medium">{control.name}</td>
                <td className="px-4 py-3">
                  <span className={clsx(
                    'px-2 py-1 text-xs font-medium rounded',
                    control.type === 'Preventive' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  )}>
                    {control.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={clsx(
                    'px-2 py-1 text-xs font-medium rounded',
                    control.effectiveness === 'High' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  )}>
                    {control.effectiveness}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{control.frequency}</td>
                <td className="px-4 py-3 text-sm">{new Date(control.lastTested).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm text-[var(--foreground-muted)]">{control.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HistoryTab({ risk }: { risk: Risk }) {
  const history = [
    {
      id: 'H-001',
      date: '2024-04-14',
      action: 'Risk Reviewed',
      user: risk.owner,
      details: 'Quarterly risk review completed. All controls operating effectively.'
    },
    {
      id: 'H-002',
      date: '2024-04-01',
      action: 'Control Tested',
      user: risk.owner,
      details: 'Multi-Factor Authentication control tested and verified.'
    },
    {
      id: 'H-003',
      date: '2024-03-15',
      action: 'Risk Rating Updated',
      user: risk.owner,
      details: 'Residual risk reduced from High to Medium after implementing new controls.'
    },
    {
      id: 'H-004',
      date: '2024-01-15',
      action: 'Risk Identified',
      user: risk.owner,
      details: 'Risk initially identified during annual risk assessment process.'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Activity Timeline</h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[var(--border)]"></div>

        {/* Timeline items */}
        <div className="space-y-6">
          {history.map((item, index) => (
            <div key={item.id} className="relative pl-14">
              {/* Timeline dot */}
              <div className="absolute left-4 top-1 w-4 h-4 bg-[var(--primary)] rounded-full border-4 border-white"></div>

              <div className="bg-white border border-[var(--border)] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-[var(--foreground)]">{item.action}</h4>
                  <span className="text-xs text-[var(--foreground-muted)]">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-sm text-[var(--foreground-muted)] mb-2">{item.details}</p>
                <div className="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
                  <User size={12} />
                  {item.user}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BowtieTab({ risk }: { risk: Risk }) {
  const sources = risk.sources || ['Inadequate security controls', 'Human error', 'Third-party vulnerabilities'];
  const event = risk.event || 'Unauthorized access to sensitive data';
  const consequences = risk.consequences || ['Financial loss', 'Reputational damage', 'Regulatory penalties'];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">About Bow-tie Analysis</h3>
        <p className="text-sm text-blue-800">
          Bow-tie analysis visualizes risk sources (causes), the risk event, and potential consequences.
          This helps identify where preventive and detective controls should be placed.
        </p>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-lg p-8">
        <div className="grid grid-cols-3 gap-8 items-center">
          {/* Left: Sources */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4 text-center">
              Risk Sources (Causes)
            </h3>
            <div className="space-y-3">
              {sources.map((source, idx) => (
                <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-3 relative">
                  <div className="text-sm font-medium text-red-900">{source}</div>
                  {/* Arrow */}
                  <div className="absolute top-1/2 -right-6 w-6 h-0.5 bg-red-400" />
                  <div className="absolute top-1/2 -right-5 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-red-400" style={{marginTop: '-4px'}} />
                </div>
              ))}
            </div>
          </div>

          {/* Center: Event */}
          <div className="flex items-center justify-center">
            <div className="bg-orange-100 border-2 border-orange-400 rounded-lg p-6 text-center relative">
              <div className="text-xs font-semibold text-orange-700 mb-2 uppercase">Risk Event</div>
              <div className="text-sm font-bold text-orange-900">{event}</div>

              {/* Left arrow pointing in */}
              <div className="absolute top-1/2 -left-8 w-8 h-0.5 bg-red-400" />
              {/* Right arrow pointing out */}
              <div className="absolute top-1/2 -right-8 w-8 h-0.5 bg-red-400" />
            </div>
          </div>

          {/* Right: Consequences */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4 text-center">
              Consequences (Impacts)
            </h3>
            <div className="space-y-3">
              {consequences.map((consequence, idx) => (
                <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-3 relative">
                  <div className="text-sm font-medium text-red-900">{consequence}</div>
                  {/* Arrow */}
                  <div className="absolute top-1/2 -left-6 w-6 h-0.5 bg-red-400" />
                  <div className="absolute top-1/2 -left-5 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-red-400" style={{marginTop: '-4px'}} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-[var(--border)]">
          <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">How to interpret this diagram:</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold text-red-700 mb-1">Risk Sources (Left)</div>
              <div className="text-[var(--foreground-muted)]">
                Hazards, threats, or vulnerabilities that could trigger the risk event.
                Preventive controls should address these.
              </div>
            </div>
            <div>
              <div className="font-semibold text-orange-700 mb-1">Risk Event (Center)</div>
              <div className="text-[var(--foreground-muted)]">
                The specific event or scenario that represents the materialization of the risk.
              </div>
            </div>
            <div>
              <div className="font-semibold text-red-700 mb-1">Consequences (Right)</div>
              <div className="text-[var(--foreground-muted)]">
                Potential impacts if the risk event occurs.
                Detective and mitigating controls should address these.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Placement Suggestions */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Control Placement Recommendations</h3>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Shield size={16} />
              Preventive Controls (Before Event)
            </h4>
            <p className="text-sm text-blue-800 mb-3">
              Place controls between sources and the event to prevent occurrence:
            </p>
            <ul className="text-sm text-blue-900 space-y-1">
              <li>• Security training and awareness</li>
              <li>• Access controls and authentication</li>
              <li>• Vendor security assessments</li>
              <li>• Encryption and data protection</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              <CheckCircle2 size={16} />
              Detective/Mitigating Controls (After Event)
            </h4>
            <p className="text-sm text-green-800 mb-3">
              Place controls between event and consequences to detect/mitigate:
            </p>
            <ul className="text-sm text-green-900 space-y-1">
              <li>• Intrusion detection systems</li>
              <li>• Security monitoring and alerts</li>
              <li>• Incident response procedures</li>
              <li>• Cyber insurance coverage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
