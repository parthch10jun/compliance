/**
 * [DEMO] Compliance Playbooks Page
 * 
 * Showcases pre-built compliance playbooks/workflows for common scenarios
 */

'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { 
  BookOpen, CheckCircle2, Clock, AlertCircle, ChevronRight,
  Calendar, User, TrendingUp, Zap, FileText
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { demoPlaybooks, isDemoFeatureEnabled, type Playbook } from '@/lib/demo';

export default function PlaybooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFramework, setSelectedFramework] = useState<string>('All');

  // Only show playbooks if demo mode is enabled
  const playbooks = isDemoFeatureEnabled('demoPlaybooks') ? demoPlaybooks : [];

  // Filter playbooks
  const filteredPlaybooks = playbooks.filter(playbook => {
    const matchesSearch = playbook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         playbook.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || playbook.category === selectedCategory;
    const matchesFramework = selectedFramework === 'All' || playbook.framework === selectedFramework;
    return matchesSearch && matchesCategory && matchesFramework;
  });

  const categories = ['All', ...Array.from(new Set(playbooks.map(p => p.category)))];
  const frameworks = ['All', ...Array.from(new Set(playbooks.map(p => p.framework)))];

  return (
    <div className="p-8">
      <PageHeader
        title="Compliance Playbooks"
        description="Pre-built workflows and implementation guides for common compliance scenarios"
        icon={<BookOpen className="text-[var(--primary)]" size={32} />}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-p2 text-[var(--foreground-muted)]">Total Playbooks</span>
            <BookOpen size={20} className="text-[var(--primary)]" />
          </div>
          <div className="text-h2 font-bold text-[var(--foreground)]">{playbooks.length}</div>
        </div>

        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-p2 text-[var(--foreground-muted)]">Active Playbooks</span>
            <TrendingUp size={20} className="text-green-600" />
          </div>
          <div className="text-h2 font-bold text-[var(--foreground)]">
            {playbooks.filter(p => p.status === 'Active').length}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-p2 text-[var(--foreground-muted)]">Total Steps</span>
            <FileText size={20} className="text-blue-600" />
          </div>
          <div className="text-h2 font-bold text-[var(--foreground)]">
            {playbooks.reduce((sum, p) => sum + p.totalSteps, 0)}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-p2 text-[var(--foreground-muted)]">Avg Progress</span>
            <Zap size={20} className="text-orange-600" />
          </div>
          <div className="text-h2 font-bold text-[var(--foreground)]">
            {Math.round(playbooks.reduce((sum, p) => sum + p.progress, 0) / playbooks.length)}%
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-p2 font-medium text-[var(--foreground)] mb-2">Search</label>
            <input
              type="text"
              placeholder="Search playbooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div>
            <label className="block text-p2 font-medium text-[var(--foreground)] mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-p2 font-medium text-[var(--foreground)] mb-2">Framework</label>
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              {frameworks.map(fw => (
                <option key={fw} value={fw}>{fw}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Playbooks Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredPlaybooks.map(playbook => (
          <PlaybookCard key={playbook.id} playbook={playbook} />
        ))}
      </div>

      {filteredPlaybooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen size={48} className="mx-auto text-[var(--foreground-muted)] mb-4" />
          <p className="text-p1 text-[var(--foreground-muted)]">No playbooks found</p>
        </div>
      )}
    </div>
  );
}

function PlaybookCard({ playbook }: { playbook: Playbook }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-h3 font-semibold text-[var(--foreground)]">{playbook.name}</h3>
            <span className={clsx(
              'px-3 py-1 text-p3 rounded-full',
              playbook.status === 'Active' ? 'bg-green-100 text-green-700' :
              playbook.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            )}>
              {playbook.status}
            </span>
          </div>
          <p className="text-p2 text-[var(--foreground-muted)] mb-4">{playbook.description}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-p3 text-[var(--foreground-muted)]">Progress</span>
          <span className="text-p3 font-medium text-[var(--foreground)]">{playbook.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[var(--primary)] h-2 rounded-full transition-all"
            style={{ width: `${playbook.progress}%` }}
          />
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <span className="text-p3 text-[var(--foreground-muted)]">Category</span>
          <p className="text-p2 font-medium text-[var(--foreground)]">{playbook.category}</p>
        </div>
        <div>
          <span className="text-p3 text-[var(--foreground-muted)]">Framework</span>
          <p className="text-p2 font-medium text-[var(--foreground)]">{playbook.framework}</p>
        </div>
        <div>
          <span className="text-p3 text-[var(--foreground-muted)]">Steps</span>
          <p className="text-p2 font-medium text-[var(--foreground)]">
            {playbook.completedSteps} / {playbook.totalSteps}
          </p>
        </div>
        <div>
          <span className="text-p3 text-[var(--foreground-muted)]">Owner</span>
          <p className="text-p2 font-medium text-[var(--foreground)]">{playbook.owner}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {playbook.tags.slice(0, 5).map((tag, idx) => (
          <span key={idx} className="px-2 py-1 text-p3 bg-[var(--background-secondary)] text-[var(--foreground-muted)] rounded">
            {tag}
          </span>
        ))}
      </div>

      {/* Action Button */}
      <Link
        href={`/playbooks/${playbook.id}`}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
      >
        View Playbook
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}

