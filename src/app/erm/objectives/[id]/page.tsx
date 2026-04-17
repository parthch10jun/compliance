'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Target, TrendingUp, AlertCircle, Calendar, User, Building2, Edit, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { mockObjectives, type Objective, getObjectivesForRisk } from '@/lib/data/objectives';
import { mockOrganizationalStructure } from '@/lib/data/organizational-structure';
import { mockRisks } from '@/lib/data/erm-risks';

export default function ObjectiveDetailPage() {
  const params = useParams();
  const router = useRouter();
  const objectiveId = params.id as string;
  
  const objective = mockObjectives.find(o => o.id === objectiveId);
  
  if (!objective) {
    return (
      <div>
        <div className="text-center py-12">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-600" />
          <h2 className="text-xl font-semibold mb-2">Objective Not Found</h2>
          <p className="text-[var(--foreground-muted)] mb-4">The objective you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/erm/objectives')}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)]"
          >
            Back to Objectives
          </button>
        </div>
      </div>
    );
  }

  const entity = mockOrganizationalStructure.find(e => e.id === objective.organizationalEntityId);
  const linkedRisks = mockRisks.filter(r => objective.linkedRisks?.includes(r.id));
  const parentObjective = objective.parentObjectiveId ? mockObjectives.find(o => o.id === objective.parentObjectiveId) : null;
  const childObjectives = mockObjectives.filter(o => o.parentObjectiveId === objective.id);

  const getStatusColor = (status: Objective['status']) => {
    switch (status) {
      case 'Active': return 'bg-blue-100 text-blue-700';
      case 'In Progress': return 'bg-orange-100 text-orange-700';
      case 'Achieved': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: Objective['type']) => {
    switch (type) {
      case 'Strategic': return 'bg-purple-100 text-purple-700';
      case 'Operational': return 'bg-blue-100 text-blue-700';
      case 'Financial': return 'bg-green-100 text-green-700';
      case 'Compliance': return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/erm/objectives')}
          className="flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Objectives
        </button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Target size={24} className="text-[var(--primary)]" />
              <h1 className="text-h2 font-bold text-[var(--foreground)]">{objective.id}</h1>
              <span className={clsx('px-3 py-1 text-sm font-medium rounded-full', getStatusColor(objective.status))}>
                {objective.status}
              </span>
              <span className={clsx('px-3 py-1 text-sm font-medium rounded-full', getTypeColor(objective.type))}>
                {objective.type}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">{objective.title}</h2>
            <p className="text-p1 text-[var(--foreground-muted)] mb-4">{objective.description}</p>
            <div className="flex items-center gap-4 text-sm text-[var(--foreground-muted)]">
              <span className="flex items-center gap-1">
                <User size={14} />
                {objective.owner}
              </span>
              <span className="flex items-center gap-1">
                <Building2 size={14} />
                {entity?.name || 'Unknown Entity'}
              </span>
              {objective.targetDate && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  Target: {new Date(objective.targetDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium">
              <Edit size={18} />
              Edit Objective
            </button>
            <button className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - KPIs */}
        <div className="col-span-2 space-y-6">
          {/* KPI Cards */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Key Performance Indicators</h2>
            
            {objective.kpis && objective.kpis.length > 0 ? (
              <div className="space-y-4">
                {objective.kpis.map((kpi, idx) => {
                  const current = parseFloat(kpi.current || '0');
                  const target = parseFloat(kpi.target);
                  const progress = Math.min(100, (current / target) * 100);
                  const isOnTrack = progress >= 80;

                  return (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-[var(--foreground)] mb-1">{kpi.name}</h3>
                          <div className="flex items-baseline gap-3">
                            <span className="text-2xl font-bold text-[var(--foreground)]">
                              {kpi.current || '—'}
                            </span>
                            <span className="text-sm text-[var(--foreground-muted)]">
                              / {kpi.target} {kpi.unit}
                            </span>
                          </div>
                        </div>
                        <div className={clsx(
                          'px-3 py-1 rounded-full text-xs font-semibold',
                          isOnTrack ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        )}>
                          {Math.round(progress)}%
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={clsx(
                            'h-3 rounded-full transition-all',
                            isOnTrack ? 'bg-green-600' : 'bg-orange-600'
                          )}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[var(--foreground-muted)] text-center py-8">No KPIs defined for this objective</p>
            )}
          </div>

          {/* Linked Risks */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Linked Risks ({linkedRisks.length})
            </h2>
            
            {linkedRisks.length > 0 ? (
              <div className="space-y-3">
                {linkedRisks.map(risk => (
                  <div
                    key={risk.id}
                    onClick={() => router.push(`/erm/risk-register/${risk.id}`)}
                    className="p-4 border border-[var(--border)] rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-[var(--primary)]">{risk.id}</span>
                          <span className={clsx(
                            'px-2 py-0.5 text-xs font-medium rounded',
                            risk.residualRating === 'Critical' ? 'bg-red-100 text-red-700' :
                            risk.residualRating === 'High' ? 'bg-orange-100 text-orange-700' :
                            risk.residualRating === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          )}>
                            {risk.residualRating}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-[var(--foreground)]">{risk.title}</h3>
                        <p className="text-xs text-[var(--foreground-muted)] mt-1">{risk.category} • {risk.owner}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--foreground-muted)] text-center py-8">No risks linked to this objective</p>
            )}
          </div>
        </div>

        {/* Right Column - Info & Hierarchy */}
        <div className="space-y-6">
          {/* Objective Information */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Objective Information</h2>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">ID</div>
                <div className="text-sm font-medium">{objective.id}</div>
              </div>

              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Type</div>
                <div className="text-sm font-medium">{objective.type}</div>
              </div>

              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Status</div>
                <div className="text-sm font-medium">{objective.status}</div>
              </div>

              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Owner</div>
                <div className="text-sm font-medium">{objective.owner}</div>
              </div>

              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Organizational Entity</div>
                <div className="text-sm font-medium">{entity?.name || 'Unknown'}</div>
                <div className="text-xs text-[var(--foreground-muted)]">{entity?.type}</div>
              </div>

              {objective.targetDate && (
                <div>
                  <div className="text-xs text-[var(--foreground-muted)] mb-1">Target Date</div>
                  <div className="text-sm font-medium">
                    {new Date(objective.targetDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Objective Hierarchy */}
          {(parentObjective || childObjectives.length > 0) && (
            <div className="bg-white border border-[var(--border)] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Objective Hierarchy</h2>

              {parentObjective && (
                <div className="mb-4">
                  <div className="text-xs text-[var(--foreground-muted)] mb-2">Parent Objective:</div>
                  <div
                    onClick={() => router.push(`/erm/objectives/${parentObjective.id}`)}
                    className="p-3 border border-[var(--border)] rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="text-sm font-medium text-[var(--primary)]">{parentObjective.id}</div>
                    <div className="text-xs text-[var(--foreground-muted)] mt-1">{parentObjective.title}</div>
                  </div>
                </div>
              )}

              {childObjectives.length > 0 && (
                <div>
                  <div className="text-xs text-[var(--foreground-muted)] mb-2">
                    Child Objectives ({childObjectives.length}):
                  </div>
                  <div className="space-y-2">
                    {childObjectives.map(child => (
                      <div
                        key={child.id}
                        onClick={() => router.push(`/erm/objectives/${child.id}`)}
                        className="p-3 border border-[var(--border)] rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="text-sm font-medium text-[var(--primary)]">{child.id}</div>
                        <div className="text-xs text-[var(--foreground-muted)] mt-1">{child.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Progress Summary */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Progress Summary</h2>

            {objective.kpis && objective.kpis.length > 0 ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--foreground-muted)]">KPIs on Track</span>
                  <span className="text-sm font-semibold">
                    {objective.kpis.filter(kpi => {
                      const current = parseFloat(kpi.current || '0');
                      const target = parseFloat(kpi.target);
                      return (current / target) >= 0.8;
                    }).length} / {objective.kpis.length}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--foreground-muted)]">Linked Risks</span>
                  <span className="text-sm font-semibold">{linkedRisks.length}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--foreground-muted)]">Critical Risks</span>
                  <span className="text-sm font-semibold text-red-600">
                    {linkedRisks.filter(r => r.residualRating === 'Critical').length}
                  </span>
                </div>

                <div className="pt-3 border-t border-[var(--border)]">
                  <div className="text-sm text-[var(--foreground-muted)] mb-2">Overall Status</div>
                  <div className={clsx(
                    'px-3 py-2 rounded-lg text-center font-semibold',
                    objective.status === 'Achieved' ? 'bg-green-100 text-green-700' :
                    objective.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    objective.status === 'Active' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  )}>
                    {objective.status}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[var(--foreground-muted)] text-sm">No KPIs to track</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
