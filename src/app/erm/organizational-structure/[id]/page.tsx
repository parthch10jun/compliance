'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Building, Briefcase, MapPin, FolderTree, Edit, Trash2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { mockOrganizationalStructure, getEntityChildren, getEntityHierarchy, type OrganizationalEntity } from '@/lib/data/organizational-structure';
import { mockObjectives } from '@/lib/data/objectives';
import { mockRisks } from '@/lib/data/erm-risks';

export default function OrganizationalEntityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const entityId = params.id as string;
  
  const entity = mockOrganizationalStructure.find(e => e.id === entityId);
  
  if (!entity) {
    return (
      <div>
        <div className="text-center py-12">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-600" />
          <h2 className="text-xl font-semibold mb-2">Entity Not Found</h2>
          <p className="text-[var(--foreground-muted)] mb-4">The organizational entity you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/erm/organizational-structure')}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)]"
          >
            Back to Organizational Structure
          </button>
        </div>
      </div>
    );
  }

  const hierarchy = getEntityHierarchy(entityId);
  const children = getEntityChildren(entityId);
  const linkedObjectives = mockObjectives.filter(o => o.organizationalEntityId === entityId);
  const linkedRisks = mockRisks.filter(r => 
    r.businessUnit === entity.name || 
    r.legalEntity === entity.name || 
    r.department === entity.name ||
    r.location === entity.name ||
    r.project === entity.name
  );

  const getIcon = (type: OrganizationalEntity['type']) => {
    switch (type) {
      case 'Legal Entity': return <Building2 size={20} className="text-blue-600" />;
      case 'Business Unit': return <Building size={20} className="text-purple-600" />;
      case 'Department': return <Briefcase size={20} className="text-green-600" />;
      case 'Project': return <FolderTree size={20} className="text-orange-600" />;
      case 'Location': return <MapPin size={20} className="text-red-600" />;
      default: return <Building2 size={20} className="text-gray-600" />;
    }
  };

  const getTypeColor = (type: OrganizationalEntity['type']) => {
    switch (type) {
      case 'Legal Entity': return 'bg-blue-100 text-blue-700';
      case 'Business Unit': return 'bg-purple-100 text-purple-700';
      case 'Department': return 'bg-green-100 text-green-700';
      case 'Project': return 'bg-orange-100 text-orange-700';
      case 'Location': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/erm/organizational-structure')}
          className="flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Organizational Structure
        </button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {getIcon(entity.type)}
              <h1 className="text-h2 font-bold text-[var(--foreground)]">{entity.name}</h1>
              <span className={clsx('px-3 py-1 text-sm font-medium rounded-full', getTypeColor(entity.type))}>
                {entity.type}
              </span>
              {entity.status === 'Inactive' && (
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-600">
                  Inactive
                </span>
              )}
            </div>
            {entity.description && (
              <p className="text-p1 text-[var(--foreground-muted)] mb-4">{entity.description}</p>
            )}
            {entity.owner && (
              <div className="text-sm text-[var(--foreground-muted)]">
                Owner: {entity.owner}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium">
              <Edit size={18} />
              Edit Entity
            </button>
            <button className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      {hierarchy.length > 1 && (
        <div className="bg-gray-50 border border-[var(--border)] rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            {hierarchy.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-2">
                {idx > 0 && <span className="text-[var(--foreground-muted)]">/</span>}
                <button
                  onClick={() => router.push(`/erm/organizational-structure/${item.id}`)}
                  className={clsx(
                    'hover:text-[var(--primary)] transition-colors',
                    idx === hierarchy.length - 1 ? 'font-semibold text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'
                  )}
                >
                  {item.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm text-blue-700 mb-1">Objectives</div>
              <div className="text-2xl font-bold text-blue-700">{linkedObjectives.length}</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="text-sm text-orange-700 mb-1">Risks</div>
              <div className="text-2xl font-bold text-orange-700">{linkedRisks.length}</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="text-sm text-purple-700 mb-1">Sub-entities</div>
              <div className="text-2xl font-bold text-purple-700">{children.length}</div>
            </div>
          </div>

          {/* Linked Objectives */}
          {linkedObjectives.length > 0 && (
            <div className="bg-white border border-[var(--border)] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                Objectives ({linkedObjectives.length})
              </h2>
              <div className="space-y-3">
                {linkedObjectives.map(objective => (
                  <div
                    key={objective.id}
                    onClick={() => router.push(`/erm/objectives/${objective.id}`)}
                    className="p-4 border border-[var(--border)] rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-[var(--primary)]">{objective.id}</span>
                      <span className={clsx(
                        'px-2 py-0.5 text-xs font-medium rounded',
                        objective.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      )}>
                        {objective.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold">{objective.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Linked Risks */}
          {linkedRisks.length > 0 && (
            <div className="bg-white border border-[var(--border)] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                Risks ({linkedRisks.length})
              </h2>
              <div className="space-y-3">
                {linkedRisks.map(risk => (
                  <div
                    key={risk.id}
                    onClick={() => router.push(`/erm/risk-register/${risk.id}`)}
                    className="p-4 border border-[var(--border)] rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
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
                    <h3 className="text-sm font-semibold">{risk.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Entity Information */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Entity Information</h2>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">ID</div>
                <div className="text-sm font-medium">{entity.id}</div>
              </div>
              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Type</div>
                <div className="text-sm font-medium">{entity.type}</div>
              </div>
              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Status</div>
                <div className="text-sm font-medium">{entity.status}</div>
              </div>
              {entity.owner && (
                <div>
                  <div className="text-xs text-[var(--foreground-muted)] mb-1">Owner</div>
                  <div className="text-sm font-medium">{entity.owner}</div>
                </div>
              )}
              {entity.metadata?.country && (
                <div>
                  <div className="text-xs text-[var(--foreground-muted)] mb-1">Country</div>
                  <div className="text-sm font-medium">{entity.metadata.country}</div>
                </div>
              )}
              {entity.metadata?.region && (
                <div>
                  <div className="text-xs text-[var(--foreground-muted)] mb-1">Region</div>
                  <div className="text-sm font-medium">{entity.metadata.region}</div>
                </div>
              )}
              {entity.metadata?.code && (
                <div>
                  <div className="text-xs text-[var(--foreground-muted)] mb-1">Code</div>
                  <div className="text-sm font-medium">{entity.metadata.code}</div>
                </div>
              )}
            </div>
          </div>

          {/* Sub-entities */}
          {children.length > 0 && (
            <div className="bg-white border border-[var(--border)] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                Sub-entities ({children.length})
              </h2>
              <div className="space-y-2">
                {children.map(child => (
                  <div
                    key={child.id}
                    onClick={() => router.push(`/erm/organizational-structure/${child.id}`)}
                    className="p-3 border border-[var(--border)] rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {getIcon(child.type)}
                      <div className="flex-1">
                        <div className="text-sm font-medium">{child.name}</div>
                        <div className="text-xs text-[var(--foreground-muted)]">{child.type}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
