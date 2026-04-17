'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ChevronRight, Plus, Building, Briefcase, MapPin, FolderTree } from 'lucide-react';
import clsx from 'clsx';
import { mockOrganizationalStructure, type OrganizationalEntity, getEntityChildren } from '@/lib/data/organizational-structure';

export default function OrganizationalStructurePage() {
  const router = useRouter();
  const [expandedEntities, setExpandedEntities] = useState<Set<string>>(new Set(['LE-001']));
  const [selectedType, setSelectedType] = useState<'all' | OrganizationalEntity['type']>('all');

  const toggleExpand = (entityId: string) => {
    const newExpanded = new Set(expandedEntities);
    if (newExpanded.has(entityId)) {
      newExpanded.delete(entityId);
    } else {
      newExpanded.add(entityId);
    }
    setExpandedEntities(newExpanded);
  };

  const getIcon = (type: OrganizationalEntity['type']) => {
    switch (type) {
      case 'Legal Entity':
        return <Building2 size={16} className="text-blue-600" />;
      case 'Business Unit':
        return <Building size={16} className="text-purple-600" />;
      case 'Department':
        return <Briefcase size={16} className="text-green-600" />;
      case 'Project':
        return <FolderTree size={16} className="text-orange-600" />;
      case 'Location':
        return <MapPin size={16} className="text-red-600" />;
      default:
        return <Building2 size={16} className="text-gray-600" />;
    }
  };

  const getTypeColor = (type: OrganizationalEntity['type']) => {
    switch (type) {
      case 'Legal Entity':
        return 'bg-blue-100 text-blue-700';
      case 'Business Unit':
        return 'bg-purple-100 text-purple-700';
      case 'Department':
        return 'bg-green-100 text-green-700';
      case 'Project':
        return 'bg-orange-100 text-orange-700';
      case 'Location':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const rootEntities = mockOrganizationalStructure.filter(e => !e.parentId);

  const renderEntity = (entity: OrganizationalEntity, level: number = 0) => {
    const children = getEntityChildren(entity.id);
    const isExpanded = expandedEntities.has(entity.id);
    const hasChildren = children.length > 0;

    if (selectedType !== 'all' && entity.type !== selectedType) {
      return null;
    }

    return (
      <div key={entity.id}>
        <div
          className={clsx(
            'flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-[var(--border)]',
            level > 0 && 'ml-6'
          )}
          onClick={() => router.push(`/erm/organizational-structure/${entity.id}`)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(entity.id);
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <ChevronRight
                size={16}
                className={clsx(
                  'transition-transform',
                  isExpanded && 'rotate-90'
                )}
              />
            </button>
          )}
          {!hasChildren && <div className="w-6" />}
          
          {getIcon(entity.type)}
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[var(--foreground)]">{entity.name}</span>
              <span className={clsx('px-2 py-0.5 text-xs font-medium rounded', getTypeColor(entity.type))}>
                {entity.type}
              </span>
              {entity.status === 'Inactive' && (
                <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-600">
                  Inactive
                </span>
              )}
            </div>
            {entity.description && (
              <div className="text-sm text-[var(--foreground-muted)] mt-1">{entity.description}</div>
            )}
          </div>
          
          <div className="text-sm text-[var(--foreground-muted)]">{entity.owner}</div>
          
          {entity.metadata?.country && (
            <div className="text-xs text-[var(--foreground-muted)]">
              {entity.metadata.country}
            </div>
          )}
        </div>

        {isExpanded && hasChildren && (
          <div className="ml-3">
            {children.map(child => renderEntity(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const stats = {
    total: mockOrganizationalStructure.length,
    legalEntities: mockOrganizationalStructure.filter(e => e.type === 'Legal Entity').length,
    businessUnits: mockOrganizationalStructure.filter(e => e.type === 'Business Unit').length,
    departments: mockOrganizationalStructure.filter(e => e.type === 'Department').length,
    projects: mockOrganizationalStructure.filter(e => e.type === 'Project').length,
    locations: mockOrganizationalStructure.filter(e => e.type === 'Location').length,
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Building2 size={24} className="text-[var(--primary)]" />
            <h1 className="text-h2 font-bold text-[var(--foreground)]">Organizational Structure</h1>
          </div>
          <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium">
            <Plus size={18} />
            Add Entity
          </button>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Manage organizational hierarchy across legal entities, business units, departments, projects, and locations
        </p>
      </div>

      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="text-sm text-[var(--foreground-muted)] mb-1">Total Entities</div>
          <div className="text-2xl font-bold text-[var(--foreground)]">{stats.total}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-700 mb-1">Legal Entities</div>
          <div className="text-2xl font-bold text-blue-700">{stats.legalEntities}</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-sm text-purple-700 mb-1">Business Units</div>
          <div className="text-2xl font-bold text-purple-700">{stats.businessUnits}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-700 mb-1">Departments</div>
          <div className="text-2xl font-bold text-green-700">{stats.departments}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-sm text-orange-700 mb-1">Projects</div>
          <div className="text-2xl font-bold text-orange-700">{stats.projects}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-700 mb-1">Locations</div>
          <div className="text-2xl font-bold text-red-700">{stats.locations}</div>
        </div>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--foreground-muted)]">Filter by type:</span>
          {['all', 'Legal Entity', 'Business Unit', 'Department', 'Project', 'Location'].map(type => (
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
              {type === 'all' ? 'All' : type}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Hierarchy View</h2>
        <div className="space-y-1">
          {rootEntities.map(entity => renderEntity(entity))}
        </div>
      </div>
    </div>
  );
}
