'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Target, Plus, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { mockObjectives, type Objective } from '@/lib/data/objectives';
import { mockOrganizationalStructure } from '@/lib/data/organizational-structure';

export default function ObjectivesPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<'all' | Objective['type']>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | Objective['status']>('all');

  const filteredObjectives = mockObjectives.filter(obj => {
    if (selectedType !== 'all' && obj.type !== selectedType) return false;
    if (selectedStatus !== 'all' && obj.status !== selectedStatus) return false;
    return true;
  });

  const getStatusColor = (status: Objective['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-100 text-blue-700';
      case 'In Progress':
        return 'bg-orange-100 text-orange-700';
      case 'Achieved':
        return 'bg-green-100 text-green-700';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: Objective['type']) => {
    switch (type) {
      case 'Strategic':
        return 'bg-purple-100 text-purple-700';
      case 'Operational':
        return 'bg-blue-100 text-blue-700';
      case 'Financial':
        return 'bg-green-100 text-green-700';
      case 'Compliance':
        return 'bg-red-100 text-red-700';
    }
  };

  const getEntityName = (entityId: string) => {
    return mockOrganizationalStructure.find(e => e.id === entityId)?.name || 'Unknown';
  };

  const stats = {
    total: mockObjectives.length,
    active: mockObjectives.filter(o => o.status === 'In Progress').length,
    achieved: mockObjectives.filter(o => o.status === 'Achieved').length,
    atRisk: 2,
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Target size={24} className="text-[var(--primary)]" />
            <h1 className="text-h2 font-bold text-[var(--foreground)]">Strategic Objectives</h1>
          </div>
          <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium">
            <Plus size={18} />
            Add Objective
          </button>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Manage organizational objectives and track their relationships to risks
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="text-sm text-[var(--foreground-muted)] mb-1">Total Objectives</div>
          <div className="text-2xl font-bold text-[var(--foreground)]">{stats.total}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-700 mb-1 flex items-center gap-1">
            <Clock size={14} />
            In Progress
          </div>
          <div className="text-2xl font-bold text-blue-700">{stats.active}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-700 mb-1 flex items-center gap-1">
            <CheckCircle2 size={14} />
            Achieved
          </div>
          <div className="text-2xl font-bold text-green-700">{stats.achieved}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-sm text-orange-700 mb-1 flex items-center gap-1">
            <AlertCircle size={14} />
            At Risk
          </div>
          <div className="text-2xl font-bold text-orange-700">{stats.atRisk}</div>
        </div>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-[var(--foreground-muted)] block mb-2">Type:</span>
            <div className="flex flex-wrap gap-2">
              {['all', 'Strategic', 'Operational', 'Financial', 'Compliance'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type as any)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    selectedType === type
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-gray-100 text-[var(--foreground-muted)] hover:bg-gray-200'
                  )}
                >
                  {type === 'all' ? 'All Types' : type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="text-sm font-medium text-[var(--foreground-muted)] block mb-2">Status:</span>
            <div className="flex flex-wrap gap-2">
              {['all', 'Active', 'In Progress', 'Achieved', 'Cancelled'].map(status => (
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
                  {status === 'all' ? 'All Status' : status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredObjectives.map(objective => (
          <div
            key={objective.id}
            onClick={() => router.push(`/erm/objectives/${objective.id}`)}
            className="bg-white border border-[var(--border)] rounded-lg p-6 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-[var(--primary)]">{objective.id}</span>
              <span className={clsx('px-2 py-0.5 text-xs font-medium rounded', getTypeColor(objective.type))}>
                {objective.type}
              </span>
              <span className={clsx('px-2 py-0.5 text-xs font-medium rounded', getStatusColor(objective.status))}>
                {objective.status}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">{objective.title}</h3>
            <p className="text-sm text-[var(--foreground-muted)] mb-3">{objective.description}</p>
            <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)] mb-4">
              <span>Owner: {objective.owner}</span>
              <span>Entity: {getEntityName(objective.organizationalEntityId)}</span>
              {objective.targetDate && (
                <span>Target: {new Date(objective.targetDate).toLocaleDateString()}</span>
              )}
              {objective.linkedRisks && (
                <span className="text-orange-600 font-medium">
                  {objective.linkedRisks.length} linked risk{objective.linkedRisks.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {objective.kpis && objective.kpis.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-[var(--foreground-muted)] mb-2">Key Performance Indicators:</div>
                <div className="grid grid-cols-3 gap-3">
                  {objective.kpis.slice(0, 3).map((kpi, idx) => {
                    const current = parseFloat(kpi.current || '0');
                    const target = parseFloat(kpi.target);
                    const progress = Math.min(100, (current / target) * 100);
                    const isOnTrack = progress >= 80;

                    return (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-[var(--foreground-muted)] mb-1">{kpi.name}</div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-sm font-semibold">{kpi.current || '—'}</span>
                          <span className="text-xs text-[var(--foreground-muted)]">/ {kpi.target}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={clsx(
                              'h-1.5 rounded-full transition-all',
                              isOnTrack ? 'bg-green-600' : 'bg-orange-600'
                            )}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredObjectives.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Target size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-[var(--foreground-muted)]">No objectives match your filters</p>
        </div>
      )}
    </div>
  );
}
