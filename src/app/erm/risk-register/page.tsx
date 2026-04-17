'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { mockRisks, type Risk } from '@/lib/data/erm-risks';
import RiskDetailModal from '@/components/erm/RiskDetailModal';
import ExportMenu from '@/components/erm/ExportMenu';
import {
  Search, Filter, Download, Plus, ChevronDown, ChevronUp,
  AlertTriangle, Shield, TrendingUp, Eye, X
} from 'lucide-react';
import clsx from 'clsx';

export default function RiskRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Risk>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);

  // Handle URL parameters for filtering
  useEffect(() => {
    const filter = searchParams.get('filter');
    const category = searchParams.get('category');

    const filters: string[] = [];

    if (filter === 'critical') {
      filters.push('Critical risks only');
    } else if (filter === 'treated') {
      setSelectedStatus('Treated');
      filters.push('Treated risks only');
    } else if (filter === 'over-tolerance') {
      filters.push('Exceeding risk tolerance');
    }

    if (category && category !== 'all') {
      setSelectedCategory(category);
      filters.push(`Category: ${category}`);
    }

    setAppliedFilters(filters);
  }, [searchParams]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(mockRisks.map(r => r.category)));
    return ['all', ...cats];
  }, []);

  // Get unique statuses
  const statuses = useMemo(() => {
    const stats = Array.from(new Set(mockRisks.map(r => r.status)));
    return ['all', ...stats];
  }, []);

  // Filter and sort risks
  const filteredRisks = useMemo(() => {
    let filtered = mockRisks;

    // URL-based filter (critical)
    const filter = searchParams.get('filter');
    if (filter === 'critical') {
      filtered = filtered.filter(risk => risk.inherentRating === 'Critical');
    } else if (filter === 'treated') {
      filtered = filtered.filter(risk => risk.status === 'Treated');
    } else if (filter === 'over-tolerance') {
      // Filter risks exceeding Medium tolerance
      filtered = filtered.filter(risk => risk.residualRating === 'High' || risk.residualRating === 'Critical');
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(risk =>
        risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        risk.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        risk.owner.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(risk => risk.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(risk => risk.status === selectedStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchParams, searchTerm, selectedCategory, selectedStatus, sortField, sortDirection]);

  const handleSort = (field: keyof Risk) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Closed': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Identified': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Assessed': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Treated': return 'bg-green-100 text-green-700 border-green-200';
      case 'Monitored': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold text-[var(--foreground)] mb-2">Risk Register</h1>
          <p className="text-p2 text-[var(--foreground-muted)]">
            Comprehensive enterprise risk inventory and assessment
          </p>
          {/* Active Filters Badge */}
          {appliedFilters.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              {appliedFilters.map((filter, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold"
                >
                  <Filter size={12} />
                  {filter}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <ExportMenu screenName="Risk_Register" />
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg text-p2 font-medium hover:shadow-lg transition-all flex items-center gap-2">
            <Plus size={18} />
            Add Risk
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-hover bg-white rounded-lg border border-[var(--border)] p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-600">
              <AlertTriangle size={18} />
            </div>
          </div>
          <p className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">{mockRisks.length}</p>
          <p className="text-sm text-[var(--foreground-muted)]">Total Risks</p>
        </div>

        <div className="card-hover bg-white rounded-lg border border-[var(--border)] p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-red-50 text-red-600">
              <AlertTriangle size={18} />
            </div>
          </div>
          <p className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">
            {mockRisks.filter(r => r.inherentRating === 'Critical').length}
          </p>
          <p className="text-sm text-[var(--foreground-muted)]">Critical</p>
        </div>

        <div className="card-hover bg-white rounded-lg border border-[var(--border)] p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-green-50 text-green-600">
              <Shield size={18} />
            </div>
          </div>
          <p className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">
            {mockRisks.filter(r => r.status === 'Treated').length}
          </p>
          <p className="text-sm text-[var(--foreground-muted)]">Treated</p>
        </div>

        <div className="card-hover bg-white rounded-lg border border-[var(--border)] p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-600">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">84%</p>
          <p className="text-sm text-[var(--foreground-muted)]">Treatment Rate</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg border border-[var(--border)] p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
              <input
                type="text"
                placeholder="Search by risk ID, title, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[var(--border)] rounded-lg text-p2 text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg text-p2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg text-p2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {statuses.map(stat => (
                <option key={stat} value={stat}>
                  {stat === 'all' ? 'All Statuses' : stat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Risk Table - Matching Compliance Design with Resizable Container */}
      <div className="bg-white rounded-lg border border-[var(--border)] overflow-hidden resize overflow-auto" style={{ minHeight: '400px' }}>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '100%' }}>
            {/* Header with sorting */}
            <thead>
              <tr className="bg-[var(--background)] border-b border-[var(--border)]">
                <SortableHeader field="id" currentField={sortField} direction={sortDirection} onSort={handleSort} className="w-28 min-w-[7rem]" style={{ resize: 'horizontal', overflow: 'auto' }}>
                  Risk ID
                </SortableHeader>
                <SortableHeader field="title" currentField={sortField} direction={sortDirection} onSort={handleSort} className="min-w-[20rem]">
                  Risk Title
                </SortableHeader>
                <SortableHeader field="category" currentField={sortField} direction={sortDirection} onSort={handleSort} className="min-w-[7rem]">
                  Category
                </SortableHeader>
                <SortableHeader field="owner" currentField={sortField} direction={sortDirection} onSort={handleSort} className="min-w-[12rem]">
                  Owner
                </SortableHeader>
                <SortableHeader field="inherentRating" currentField={sortField} direction={sortDirection} onSort={handleSort} className="min-w-[6rem]">
                  Inherent Risk
                </SortableHeader>
                <SortableHeader field="residualRating" currentField={sortField} direction={sortDirection} onSort={handleSort} className="min-w-[6rem]">
                  Residual Risk
                </SortableHeader>
                <SortableHeader field="controlsCount" currentField={sortField} direction={sortDirection} onSort={handleSort} className="min-w-[5rem] text-center">
                  Controls
                </SortableHeader>
                <SortableHeader field="status" currentField={sortField} direction={sortDirection} onSort={handleSort} className="min-w-[8rem]">
                  Status
                </SortableHeader>
                <th className="px-4 py-3.5 text-center text-p3 font-semibold text-[var(--foreground)] border-r border-[var(--border)] last:border-r-0 min-w-[5rem]">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-[var(--border)]">
              {filteredRisks.map((risk, idx) => (
                <tr
                  key={risk.id}
                  className="hover:bg-[var(--background-secondary)] transition-colors cursor-pointer"
                  onClick={() => router.push(`/erm/risk-register/${risk.id}`)}
                >
                  <td className="px-4 py-2.5 text-p3 font-medium text-indigo-600 border-r border-[var(--border)]">
                    {risk.id}
                  </td>
                  <td className="px-4 py-2.5 text-p3 text-[var(--foreground)] border-r border-[var(--border)]">
                    <div className="font-medium">{risk.title}</div>
                    <div className="text-xs text-[var(--foreground-muted)] mt-0.5">{risk.description}</div>
                  </td>
                  <td className="px-4 py-2.5 text-p3 text-[var(--foreground)] border-r border-[var(--border)]">
                    {risk.category}
                  </td>
                  <td className="px-4 py-2.5 text-p3 text-[var(--foreground)] border-r border-[var(--border)]">
                    {risk.owner}
                  </td>
                  <td className="px-4 py-2.5 border-r border-[var(--border)]">
                    <span className={clsx(
                      'inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border',
                      getRatingColor(risk.inherentRating)
                    )}>
                      {risk.inherentRating}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 border-r border-[var(--border)]">
                    <span className={clsx(
                      'inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border',
                      getRatingColor(risk.residualRating)
                    )}>
                      {risk.residualRating}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-p3 text-center text-[var(--foreground)] border-r border-[var(--border)]">
                    {risk.controlsCount}
                  </td>
                  <td className="px-4 py-2.5 border-r border-[var(--border)]">
                    <span className={clsx(
                      'inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border',
                      getStatusColor(risk.status)
                    )}>
                      {risk.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 border-r border-[var(--border)] last:border-r-0 text-center">
                    <button className="p-1 hover:bg-indigo-50 rounded transition-colors inline-flex items-center justify-center">
                      <Eye size={14} className="text-[var(--foreground-muted)] hover:text-indigo-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Results Count */}
        <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--background)]">
          <p className="text-p3 text-[var(--foreground-muted)]">
            Showing <span className="font-semibold text-[var(--foreground)]">{filteredRisks.length}</span> of{' '}
            <span className="font-semibold text-[var(--foreground)]">{mockRisks.length}</span> risks
          </p>
        </div>
      </div>
      </div>

      {/* Risk Detail Modal */}
      <RiskDetailModal
        risk={selectedRisk}
        isOpen={selectedRisk !== null}
        onClose={() => setSelectedRisk(null)}
      />
    </>
  );
}

// Sortable Header Component
function SortableHeader({
  field,
  currentField,
  direction,
  onSort,
  children,
  className,
  style
}: {
  field: keyof Risk;
  currentField: keyof Risk;
  direction: 'asc' | 'desc';
  onSort: (field: keyof Risk) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const isActive = currentField === field;

  return (
    <th
      className={clsx(
        "px-4 py-3.5 text-left text-p3 font-semibold text-[var(--foreground)] border-r border-[var(--border)] last:border-r-0 cursor-pointer hover:bg-[var(--background-secondary)] transition-colors select-none",
        className
      )}
      style={style}
      onClick={() => onSort(field)}
    >
      <div className={clsx(
        "flex items-center gap-2",
        className?.includes('text-center') && "justify-center"
      )}>
        {children}
        {isActive && (
          direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
        )}
      </div>
    </th>
  );
}
