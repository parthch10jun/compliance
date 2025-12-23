'use client';

import { useState } from 'react';
import { Search, FileText, Plus, Calendar, User, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

interface Policy {
  id: string;
  title: string;
  category: string;
  version: string;
  lastReview: string;
  nextReview: string;
  owner: string;
  status: 'Active' | 'Under Review' | 'Draft' | 'Archived';
}

const policies: Policy[] = [
  { id: '1', title: 'Anti-Money Laundering (AML) Policy', category: 'Compliance', version: '3.2', lastReview: '2024-10-15', nextReview: '2025-04-15', owner: 'Compliance Team', status: 'Active' },
  { id: '2', title: 'Data Protection & Privacy Policy', category: 'Privacy', version: '2.1', lastReview: '2024-09-01', nextReview: '2025-03-01', owner: 'Legal Team', status: 'Active' },
  { id: '3', title: 'Information Security Policy', category: 'Security', version: '4.0', lastReview: '2024-11-20', nextReview: '2025-05-20', owner: 'IT Security', status: 'Under Review' },
  { id: '4', title: 'Business Continuity Policy', category: 'Operations', version: '1.5', lastReview: '2024-08-10', nextReview: '2025-02-10', owner: 'Operations', status: 'Active' },
  { id: '5', title: 'Conflict of Interest Policy', category: 'HR', version: '2.3', lastReview: '2024-07-01', nextReview: '2025-01-01', owner: 'HR Team', status: 'Draft' },
];

const statusColors = {
  Active: 'bg-green-100 text-green-700',
  'Under Review': 'bg-yellow-100 text-yellow-700',
  Draft: 'bg-gray-100 text-gray-600',
  Archived: 'bg-red-100 text-red-700',
};

const categoryColors: Record<string, string> = {
  Compliance: 'bg-purple-100 text-purple-700',
  Privacy: 'bg-blue-100 text-blue-700',
  Security: 'bg-red-100 text-red-700',
  Operations: 'bg-orange-100 text-orange-700',
  HR: 'bg-green-100 text-green-700',
};

export default function PoliciesLibrary() {
  const [search, setSearch] = useState('');

  const filteredPolicies = policies.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Policy Library</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            {policies.length} policies managed
          </p>
        </div>
        <button className="px-4 py-2 text-sm bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] flex items-center gap-2">
          <Plus size={16} />
          Add Policy
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
        <input
          type="text"
          placeholder="Search policies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPolicies.map((policy) => (
          <Link
            key={policy.id}
            href={`/library/policies/${policy.id}`}
            className="bg-white border border-[var(--border)] rounded-xl p-5 hover:border-[var(--primary)] hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[var(--primary-lightest)] rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-[var(--primary)]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={clsx("text-xs px-2 py-0.5 rounded", categoryColors[policy.category] || 'bg-gray-100 text-gray-600')}>
                    {policy.category}
                  </span>
                  <span className={clsx("text-xs px-2 py-0.5 rounded", statusColors[policy.status])}>
                    {policy.status}
                  </span>
                  <span className="text-xs text-[var(--foreground-muted)]">v{policy.version}</span>
                </div>
                <h3 className="font-semibold text-[var(--foreground)] mb-2">{policy.title}</h3>
                <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)]">
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {policy.owner}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    Next review: {new Date(policy.nextReview).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:text-[var(--primary)] transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

