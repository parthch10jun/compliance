'use client';

import { useState } from 'react';
import { Search, Grid3X3, List, Plus, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

interface Framework {
  id: string;
  name: string;
  shortName: string;
  description: string;
  controlsTotal: number;
  controlsCompliant: number;
  category: string;
  icon: string;
}

const frameworks: Framework[] = [
  { id: '1', name: 'Central Bank of UAE', shortName: 'CBUAE', description: 'Banking and financial regulations', controlsTotal: 156, controlsCompliant: 142, category: 'Financial', icon: '🏦' },
  { id: '2', name: 'Securities & Commodities Authority', shortName: 'SCA', description: 'Securities market regulations', controlsTotal: 98, controlsCompliant: 85, category: 'Financial', icon: '📈' },
  { id: '3', name: 'Dubai Financial Services Authority', shortName: 'DFSA', description: 'DIFC financial services', controlsTotal: 124, controlsCompliant: 118, category: 'Financial', icon: '🏙️' },
  { id: '4', name: 'Abu Dhabi Global Market', shortName: 'ADGM', description: 'ADGM financial services', controlsTotal: 112, controlsCompliant: 98, category: 'Financial', icon: '🌐' },
  { id: '5', name: 'DEWS Pension Scheme', shortName: 'DEWS', description: 'End-of-service benefits', controlsTotal: 45, controlsCompliant: 42, category: 'HR', icon: '💼' },
  { id: '6', name: 'Ministry of Human Resources', shortName: 'MOHRE', description: 'Labour law compliance', controlsTotal: 78, controlsCompliant: 72, category: 'HR', icon: '👥' },
  { id: '7', name: 'Emirates Securities Authority', shortName: 'ESCA', description: 'National securities regulator', controlsTotal: 65, controlsCompliant: 58, category: 'Financial', icon: '🛡️' },
  { id: '8', name: 'Ministry of Economy', shortName: 'MoEC', description: 'Economic regulations', controlsTotal: 54, controlsCompliant: 48, category: 'Economic', icon: '📊' },
];

const categories = ['All', 'Financial', 'HR', 'Economic'];

export default function FrameworksLibrary() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredFrameworks = frameworks.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.shortName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || f.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Frameworks Library</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            {frameworks.length} regulatory frameworks configured
          </p>
        </div>
        <button className="px-4 py-2 text-sm bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] flex items-center gap-2">
          <Plus size={16} />
          Add Framework
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
          <input
            type="text"
            placeholder="Search frameworks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          />
        </div>
        <div className="flex gap-1 p-1 bg-[var(--background-secondary)] rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={clsx(
                'px-3 py-1.5 text-sm rounded-md transition-colors',
                category === cat 
                  ? 'bg-white text-[var(--foreground)] shadow-sm' 
                  : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-1 border border-[var(--border)] rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={clsx('p-1.5 rounded', viewMode === 'grid' ? 'bg-[var(--primary-lightest)] text-[var(--primary)]' : 'text-[var(--foreground-muted)]')}
          >
            <Grid3X3 size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={clsx('p-1.5 rounded', viewMode === 'list' ? 'bg-[var(--primary-lightest)] text-[var(--primary)]' : 'text-[var(--foreground-muted)]')}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Frameworks Grid */}
      <div className={clsx(
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'flex flex-col gap-3'
      )}>
        {filteredFrameworks.map((framework) => {
          const complianceRate = Math.round((framework.controlsCompliant / framework.controlsTotal) * 100);
          return (
            <Link
              key={framework.id}
              href={`/library/frameworks/${framework.id}`}
              className={clsx(
                "bg-white border border-[var(--border)] rounded-xl hover:border-[var(--primary)] hover:shadow-md transition-all group",
                viewMode === 'grid' ? 'p-5' : 'p-4 flex items-center gap-4'
              )}
            >
              <div className={clsx(viewMode === 'list' && 'flex items-center gap-4 flex-1')}>
                <div className={clsx(
                  "text-3xl mb-3",
                  viewMode === 'list' && 'mb-0'
                )}>
                  {framework.icon}
                </div>
                <div className={viewMode === 'list' ? 'flex-1' : ''}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 bg-[var(--primary-lightest)] text-[var(--primary)] rounded font-medium">
                      {framework.shortName}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1">{framework.name}</h3>
                  <p className="text-sm text-[var(--foreground-muted)] mb-3">{framework.description}</p>
                </div>
              </div>
              <div className={clsx("flex items-center justify-between", viewMode === 'list' && 'w-48')}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span className="text-sm text-[var(--foreground-muted)]">
                    {framework.controlsCompliant}/{framework.controlsTotal} controls
                  </span>
                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:text-[var(--primary)] transition-colors" />
              </div>
              {viewMode === 'grid' && (
                <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-[var(--primary)]" 
                    style={{ width: `${complianceRate}%` }}
                  />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

