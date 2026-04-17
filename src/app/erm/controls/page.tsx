'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Plus, Search, Filter } from 'lucide-react';
import clsx from 'clsx';
import { mockERMControls, type ERMControl } from '@/lib/data/erm-controls';

export default function ControlsLibraryPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | ERMControl['type']>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ERMControl['category']>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | ERMControl['status']>('all');

  const filteredControls = mockERMControls.filter(control => {
    if (searchTerm && !control.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !control.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedType !== 'all' && control.type !== selectedType) return false;
    if (selectedCategory !== 'all' && control.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && control.status !== selectedStatus) return false;
    return true;
  });

  const getStatusColor = (status: ERMControl['status']) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Not Started': return 'bg-gray-100 text-gray-700';
      case 'Overdue': return 'bg-red-100 text-red-700';
      case 'On Hold': return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness) {
      case 'Very Effective': return 'bg-green-100 text-green-700';
      case 'Effective': return 'bg-blue-100 text-blue-700';
      case 'Moderately Effective': return 'bg-yellow-100 text-yellow-700';
      case 'Ineffective': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const stats = {
    total: mockERMControls.length,
    completed: mockERMControls.filter(c => c.status === 'Completed').length,
    inProgress: mockERMControls.filter(c => c.status === 'In Progress').length,
    notStarted: mockERMControls.filter(c => c.status === 'Not Started').length
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Shield size={24} className="text-[var(--primary)]" />
            <h1 className="text-h2 font-bold text-[var(--foreground)]">Controls Library</h1>
          </div>
          <button 
            onClick={() => router.push('/erm/controls/new')}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium"
          >
            <Plus size={18} />
            Add Control
          </button>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Manage risk treatment controls and mitigation measures
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="text-sm text-[var(--foreground-muted)] mb-1">Total Controls</div>
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
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-700 mb-1">Not Started</div>
          <div className="text-2xl font-bold text-gray-700">{stats.notStarted}</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-4 mb-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search controls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="Preventive">Preventive</option>
              <option value="Detective">Detective</option>
              <option value="Corrective">Corrective</option>
              <option value="Directive">Directive</option>
            </select>
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Avoid">Avoid</option>
              <option value="Prevent">Prevent</option>
              <option value="Detect">Detect</option>
              <option value="Mitigate">Mitigate</option>
              <option value="Transfer">Transfer</option>
              <option value="Accept">Accept</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Controls List */}
      <div className="space-y-4">
        {filteredControls.map(control => (
          <div
            key={control.id}
            onClick={() => router.push(`/erm/controls/${control.id}`)}
            className="bg-white border border-[var(--border)] rounded-lg p-6 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-[var(--primary)]">{control.id}</span>
                  <span className={clsx('px-2 py-0.5 text-xs font-medium rounded', getStatusColor(control.status))}>
                    {control.status}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-700">
                    {control.type}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-700">
                    {control.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">{control.name}</h3>
                <p className="text-sm text-[var(--foreground-muted)] mb-3">{control.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Owner</div>
                <div className="text-sm font-medium">{control.owner}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Effectiveness</div>
                <span className={clsx('text-xs px-2 py-1 rounded font-medium', getEffectivenessColor(control.effectivenessQualitative))}>
                  {control.effectivenessQualitative}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Cost</div>
                <div className="text-sm font-medium">
                  {control.costQuantitative ? `$${control.costQuantitative.toLocaleString()}` : control.costQualitative}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Linked Risks</div>
                <div className="text-sm font-medium">{control.linkedRisks.length}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredControls.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Shield size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-[var(--foreground-muted)]">No controls match your filters</p>
        </div>
      )}
    </div>
  );
}
