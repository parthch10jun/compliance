'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Folder, Plus, Edit, Trash2, BarChart3 } from 'lucide-react';
import clsx from 'clsx';
import { mockRiskCategories, type RiskCategory } from '@/lib/data/categories-matrices';

export default function CategoriesPage() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<'all' | RiskCategory['level']>('all');

  const filteredCategories = mockRiskCategories.filter(cat => {
    if (selectedLevel !== 'all' && cat.level !== selectedLevel) return false;
    return true;
  });

  const totalRisks = mockRiskCategories.reduce((sum, cat) => sum + cat.totalRisks, 0);
  const totalCritical = mockRiskCategories.reduce((sum, cat) => sum + cat.criticalRisks, 0);
  const totalHigh = mockRiskCategories.reduce((sum, cat) => sum + cat.highRisks, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Folder size={24} className="text-[var(--primary)]" />
            <h1 className="text-h2 font-bold text-[var(--foreground)]">Risk Categories</h1>
          </div>
          <button
            onClick={() => router.push('/erm/categories/new')}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium"
          >
            <Plus size={18} />
            Create Category
          </button>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Manage risk categories and classifications with hierarchical relationships
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="text-sm text-[var(--foreground-muted)] mb-1">Total Categories</div>
          <div className="text-2xl font-bold text-[var(--foreground)]">{mockRiskCategories.length}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-700 mb-1">Total Risks</div>
          <div className="text-2xl font-bold text-blue-700">{totalRisks}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-700 mb-1">Critical Risks</div>
          <div className="text-2xl font-bold text-red-700">{totalCritical}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-sm text-orange-700 mb-1">High Risks</div>
          <div className="text-2xl font-bold text-orange-700">{totalHigh}</div>
        </div>
      </div>

      {/* Level Filters */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--foreground-muted)]">Filter by level:</span>
          {['all', 'Strategic', 'Operational', 'Financial', 'Compliance', 'Reputational', 'Technology'].map(level => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level as any)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                selectedLevel === level
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-gray-100 text-[var(--foreground-muted)] hover:bg-gray-200'
              )}
            >
              {level === 'all' ? 'All' : level}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 gap-6">
        {filteredCategories.map(category => (
          <div
            key={category.id}
            className="bg-white border border-[var(--border)] rounded-lg p-6 hover:shadow-md transition-all"
          >
            {/* Category Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.colorCode }}
                  />
                  <span className="text-sm font-medium text-[var(--primary)]">{category.id}</span>
                  {category.parentCategoryId && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-700">
                      Subcategory
                    </span>
                  )}
                  <span className={clsx('px-2 py-0.5 text-xs font-medium rounded',
                    category.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  )}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{category.name}</h3>
                <p className="text-sm text-[var(--foreground-muted)] mb-3">{category.description}</p>
                <div className="text-xs text-[var(--foreground-muted)]">
                  Level: <span className="font-medium text-[var(--foreground)]">{category.level}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(`/erm/categories/${category.id}`)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit size={16} className="text-[var(--foreground-muted)]" />
                </button>
                <button
                  onClick={() => alert('Delete category')}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>
            </div>

            {/* Risk Statistics */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Total</div>
                <div className="text-xl font-bold text-[var(--foreground)]">{category.totalRisks}</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <div className="text-xs text-red-700 mb-1">Critical</div>
                <div className="text-xl font-bold text-red-700">{category.criticalRisks}</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                <div className="text-xs text-orange-700 mb-1">High</div>
                <div className="text-xl font-bold text-orange-700">{category.highRisks}</div>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => router.push(`/erm/risk-register?category=${category.id}`)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
            >
              <BarChart3 size={16} />
              View Risks in Category
            </button>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Folder size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-[var(--foreground-muted)]">No categories match your filters</p>
        </div>
      )}
    </div>
  );
}
