'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Plus, TrendingDown } from 'lucide-react';
import clsx from 'clsx';
import { mockTreatmentPlans, type TreatmentPlan } from '@/lib/data/erm-controls';

export default function TreatmentPlansPage() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<'all' | TreatmentPlan['status']>('all');

  const filteredPlans = mockTreatmentPlans.filter(plan => {
    if (selectedStatus !== 'all' && plan.status !== selectedStatus) return false;
    return true;
  });

  const getStatusColor = (status: TreatmentPlan['status']) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'In Review': return 'bg-orange-100 text-orange-700';
      case 'Not Started': return 'bg-gray-100 text-gray-700';
      case 'Overdue': return 'bg-red-100 text-red-700';
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Critical': return 'bg-red-100 text-red-700';
      case 'High': return 'bg-orange-100 text-orange-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const stats = {
    total: mockTreatmentPlans.length,
    completed: mockTreatmentPlans.filter(p => p.status === 'Completed').length,
    inProgress: mockTreatmentPlans.filter(p => p.status === 'In Progress').length,
    requiresAction: mockTreatmentPlans.filter(p => p.requiresFurtherTreatment).length
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Shield size={24} className="text-[var(--primary)]" />
            <h1 className="text-h2 font-bold text-[var(--foreground)]">Risk Treatment Plans</h1>
          </div>
          <button
            onClick={() => router.push('/erm/treatments/new')}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium"
          >
            <Plus size={18} />
            New Treatment Plan
          </button>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Manage risk treatment plans and track residual risk reduction
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="text-sm text-[var(--foreground-muted)] mb-1">Total Plans</div>
          <div className="text-2xl font-bold text-[var(--foreground)]">{stats.total}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-700 mb-1">Completed</div>
          <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-700 mb-1">In Progress</div>
          <div className="text-2xl font-bold text-blue-700">{stats.inProgress}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-700 mb-1">Requires Action</div>
          <div className="text-2xl font-bold text-red-700">{stats.requiresAction}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--foreground-muted)]">Filter by status:</span>
          {['all', 'Not Started', 'In Progress', 'In Review', 'Completed', 'Overdue'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status as any)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                selectedStatus === status
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-gray-100 text-[var(--foreground-muted)] hover:bg-gray-200'
              )}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Treatment Plans List */}
      <div className="space-y-4">
        {filteredPlans.map(plan => (
          <div
            key={plan.id}
            onClick={() => router.push(`/erm/treatments/${plan.id}`)}
            className="bg-white border border-[var(--border)] rounded-lg p-6 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-[var(--primary)]">{plan.id}</span>
                  <span className={clsx('px-2 py-0.5 text-xs font-medium rounded', getStatusColor(plan.status))}>
                    {plan.status}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-700">
                    {plan.treatmentOption}
                  </span>
                  {plan.exceedsTolerance && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-red-100 text-red-700">
                      ⚠️ Exceeds Tolerance
                    </span>
                  )}
                  {plan.requiresFurtherTreatment && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-orange-100 text-orange-700">
                      Further Treatment Needed
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">{plan.name}</h3>
                <p className="text-sm text-[var(--foreground-muted)] mb-3">{plan.description}</p>
                <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)]">
                  <span>Risk: {plan.riskId}</span>
                  <span>Owner: {plan.owner}</span>
                  <span>{plan.controls.length} control{plan.controls.length !== 1 ? 's' : ''}</span>
                  {plan.totalCost && <span>Cost: ${plan.totalCost.toLocaleString()}</span>}
                </div>
              </div>
            </div>

            {/* Risk Reduction Visualization */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-xs text-red-700 mb-2">Inherent Risk</div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">L: {plan.inherentLikelihood} × C: {plan.inherentConsequence}</div>
                  <span className={clsx('px-2 py-1 text-xs font-bold rounded', getRatingColor(plan.inherentRating))}>
                    {plan.inherentRating}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <TrendingDown size={32} className="text-green-600" />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-xs text-green-700 mb-2">Residual Risk</div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">L: {plan.residualLikelihood} × C: {plan.residualConsequence}</div>
                  <span className={clsx('px-2 py-1 text-xs font-bold rounded', getRatingColor(plan.residualRating || 'Low'))}>
                    {plan.residualRating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Shield size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-[var(--foreground-muted)]">No treatment plans match your filters</p>
        </div>
      )}
    </div>
  );
}
