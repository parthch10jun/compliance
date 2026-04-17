'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, AlertCircle, Search, Filter, Download } from 'lucide-react';
import clsx from 'clsx';
import { mockKRIs, type KRI } from '@/lib/data/kris';

type FilterType = 'all' | 'ok' | 'warning' | 'breach';
type CategoryFilter = 'all' | 'Cybersecurity' | 'Operational' | 'Financial' | 'Compliance' | 'Strategic';

export default function KRIsPage() {
  const router = useRouter();
  const [kris] = useState<KRI[]>(mockKRIs);
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate statistics
  const totalKRIs = kris.length;
  const okCount = kris.filter(k => k.status === 'ok').length;
  const warningCount = kris.filter(k => k.status === 'warning').length;
  const breachCount = kris.filter(k => k.status === 'breach').length;

  // Filter KRIs
  const filteredKRIs = kris.filter(kri => {
    if (statusFilter !== 'all' && kri.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && kri.category !== categoryFilter) return false;
    if (searchQuery && !kri.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusBadge = (status: KRI['status']) => {
    switch (status) {
      case 'ok':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded flex items-center gap-1"><CheckCircle size={12} /> OK</span>;
      case 'warning':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded flex items-center gap-1"><AlertCircle size={12} /> Warning</span>;
      case 'breach':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded flex items-center gap-1"><AlertTriangle size={12} /> Breach</span>;
    }
  };

  const getTrendIcon = (trend: KRI['trend'], direction: KRI['direction']) => {
    if (trend === 'stable') return <Minus size={16} className="text-gray-600" />;
    
    const isGood = (trend === 'up' && direction === 'higher_better') || (trend === 'down' && direction === 'lower_better');
    
    if (trend === 'up') {
      return <TrendingUp size={16} className={isGood ? 'text-green-600' : 'text-red-600'} />;
    } else {
      return <TrendingDown size={16} className={isGood ? 'text-green-600' : 'text-red-600'} />;
    }
  };

  const formatValue = (value: number, unit: KRI['unit']) => {
    if (unit === '%') return `${value}%`;
    if (unit === 'USD') return `$${value.toLocaleString()}`;
    if (unit === 'minutes') return `${value} min`;
    if (unit === 'days') return `${value} days`;
    return value.toString();
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Activity size={24} className="text-[var(--primary)]" />
            <h1 className="text-h2 font-bold text-[var(--foreground)]">Key Risk Indicators</h1>
          </div>
          <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium">
            <Download size={18} />
            Export Report
          </button>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Monitor and track key risk indicators in real-time
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="text-sm text-[var(--foreground-muted)] mb-1">Total KRIs</div>
          <div className="text-2xl font-bold text-[var(--foreground)]">{totalKRIs}</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-700 mb-1">On Track</div>
          <div className="text-2xl font-bold text-green-700">{okCount}</div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-sm text-yellow-700 mb-1">Warning</div>
          <div className="text-2xl font-bold text-yellow-700">{warningCount}</div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-700 mb-1">Breached</div>
          <div className="text-2xl font-bold text-red-700">{breachCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
            <input
              type="text"
              placeholder="Search KRIs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FilterType)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="ok">OK</option>
            <option value="warning">Warning</option>
            <option value="breach">Breach</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Operational">Operational</option>
            <option value="Financial">Financial</option>
            <option value="Compliance">Compliance</option>
          </select>
        </div>
      </div>

      {/* KRI Table */}
      <div className="bg-white border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--foreground)] uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--foreground)] uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--foreground)] uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--foreground)] uppercase">Current Value</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--foreground)] uppercase">Threshold</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--foreground)] uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--foreground)] uppercase">Trend</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--foreground)] uppercase">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredKRIs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-[var(--foreground-muted)]">
                    No KRIs found matching your filters
                  </td>
                </tr>
              ) : (
                filteredKRIs.map(kri => (
                  <tr
                    key={kri.id}
                    onClick={() => router.push(`/erm/kris/${kri.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-[var(--primary)]">{kri.id}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-[var(--foreground)]">{kri.name}</div>
                      <div className="text-xs text-[var(--foreground-muted)]">{kri.description}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--foreground)]">{kri.category}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-[var(--foreground)]">
                      {formatValue(kri.currentValue, kri.unit)}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--foreground-muted)]">
                      {formatValue(kri.direction === 'lower_better' ? kri.redThreshold : kri.greenThreshold, kri.unit)}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(kri.status)}</td>
                    <td className="px-4 py-3">{getTrendIcon(kri.trend, kri.direction)}</td>
                    <td className="px-4 py-3 text-sm text-[var(--foreground)]">{kri.owner}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
