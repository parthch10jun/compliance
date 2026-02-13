'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Tag, ChevronRight, Plus, Grid3X3, List, Building2, Globe, Shield, FileText } from 'lucide-react';
import clsx from 'clsx';
import { programs } from '@/lib/data/mock-data';
import { requirements, obligations } from '@/lib/data/requirements-obligations';
import { controls } from '@/lib/data/controls';
import { PageHeader, SearchFilterBar, FilterButtonGroup, AddAuthorityModal } from '@/components';

// Authority type definitions for grouping
const AUTHORITY_TYPES = {
  'Regulator': { icon: Building2, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  'Standards Body': { icon: Shield, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  'Jurisdiction': { icon: Globe, color: 'bg-green-100 text-green-700 border-green-200' },
  'Category': { icon: FileText, color: 'bg-amber-100 text-amber-700 border-amber-200' },
  'Other': { icon: Tag, color: 'bg-gray-100 text-gray-700 border-gray-200' },
};

// Known jurisdictions for categorization
const JURISDICTIONS = ['India', 'International', 'European Union', 'Saudi Arabia', 'USA', 'UK', 'UAE'];
const REGULATORS = ['RBI', 'EU', 'SDAIA', 'SEC', 'FCA', 'CBUAE', 'MeitY', 'OSHA', 'EPA', 'US Coast Guard'];
const STANDARDS_BODIES = ['ISO', 'NIST', 'COBIT'];

function categorizeAuthority(authority: string): keyof typeof AUTHORITY_TYPES {
  if (REGULATORS.includes(authority)) return 'Regulator';
  if (STANDARDS_BODIES.includes(authority)) return 'Standards Body';
  if (JURISDICTIONS.includes(authority)) return 'Jurisdiction';
  if (authority === 'Regulator' || authority === 'Standards Body') return authority as keyof typeof AUTHORITY_TYPES;
  return 'Category';
}

interface AuthorityStats {
  authority: string;
  type: keyof typeof AUTHORITY_TYPES;
  programCount: number;
  requirementCount: number;
  obligationCount: number;
  controlCount: number;
}

export default function AuthoritiesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAuthorityClick = (authority: string) => {
    // Navigate to a filtered view - for now, navigate to programs filtered by this authority
    router.push(`/programs?authority=${encodeURIComponent(authority)}`);
  };

  // Compute all unique authorities and their statistics
  const authorityStats = useMemo(() => {
    const authorityMap = new Map<string, AuthorityStats>();

    // Collect authorities from programs
    programs.forEach(program => {
      program.tags.forEach(authority => {
        if (!authorityMap.has(authority)) {
          authorityMap.set(authority, {
            authority,
            type: categorizeAuthority(authority),
            programCount: 0,
            requirementCount: 0,
            obligationCount: 0,
            controlCount: 0,
          });
        }
        authorityMap.get(authority)!.programCount++;
      });
    });

    // Collect authorities from requirements
    requirements.forEach(req => {
      req.tags.forEach(authority => {
        if (!authorityMap.has(authority)) {
          authorityMap.set(authority, {
            authority,
            type: categorizeAuthority(authority),
            programCount: 0,
            requirementCount: 0,
            obligationCount: 0,
            controlCount: 0,
          });
        }
        authorityMap.get(authority)!.requirementCount++;
      });
    });

    // Collect authorities from obligations
    obligations.forEach(obl => {
      obl.tags.forEach(authority => {
        if (!authorityMap.has(authority)) {
          authorityMap.set(authority, {
            authority,
            type: categorizeAuthority(authority),
            programCount: 0,
            requirementCount: 0,
            obligationCount: 0,
            controlCount: 0,
          });
        }
        authorityMap.get(authority)!.obligationCount++;
      });
    });

    // Collect authorities from controls
    controls.forEach(ctrl => {
      ctrl.tags.forEach(authority => {
        if (!authorityMap.has(authority)) {
          authorityMap.set(authority, {
            authority,
            type: categorizeAuthority(authority),
            programCount: 0,
            requirementCount: 0,
            obligationCount: 0,
            controlCount: 0,
          });
        }
        authorityMap.get(authority)!.controlCount++;
      });
    });

    return Array.from(authorityMap.values()).sort((a, b) => {
      // Sort by total usage
      const aTotal = a.programCount + a.requirementCount + a.obligationCount + a.controlCount;
      const bTotal = b.programCount + b.requirementCount + b.obligationCount + b.controlCount;
      return bTotal - aTotal;
    });
  }, []);

  // Filter authorities
  const filteredAuthorities = useMemo(() => {
    return authorityStats.filter(stat => {
      const matchesSearch = stat.authority.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || stat.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [authorityStats, searchQuery, typeFilter]);

  // Get unique types for filter
  const types = useMemo(() => {
    const typeSet = new Set(authorityStats.map(s => s.type));
    return ['all', ...Array.from(typeSet)];
  }, [authorityStats]);

  // Calculate dynamic metrics
  const metrics = useMemo(() => {
    const activePrograms = programs.filter(p => p.status === 'Active').length;
    const totalControls = controls.length;
    const avgCompliance = programs.length > 0
      ? Math.round(programs.reduce((acc, p) => acc + p.complianceScore, 0) / programs.length)
      : 0;

    return {
      activePrograms,
      totalControls,
      overallCompliance: avgCompliance,
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Authorities"
        description="Regulatory bodies, standards, and jurisdictions linked to your compliance programs"
        action={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-dark)] transition-all duration-200 text-p2 font-medium shadow-sm hover:shadow-md"
          >
            <Plus size={18} />
            Add Authority
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 animate-fade-in-up delay-1">
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-p3 text-[var(--foreground-muted)] font-medium">Total Authorities</p>
          <p className="text-h2 font-bold text-[var(--foreground)] mt-1">{authorityStats.length}</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-p3 text-[var(--foreground-muted)] font-medium">Active Programs</p>
          <p className="text-h2 font-bold text-[var(--foreground)] mt-1">{metrics.activePrograms}</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-p3 text-[var(--foreground-muted)] font-medium">Total Controls</p>
          <p className="text-h2 font-bold text-[var(--foreground)] mt-1">{metrics.totalControls}</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-p3 text-[var(--foreground-muted)] font-medium">Overall Compliance</p>
          <p className="text-h2 font-bold text-[var(--primary)] mt-1">{metrics.overallCompliance}%</p>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search authorities..."
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={
          <FilterButtonGroup
            options={types}
            value={typeFilter}
            onChange={setTypeFilter}
            formatLabel={(opt) => opt === 'all' ? 'All Types' : opt}
          />
        }
      />

      {/* Results Count */}
      <p className="text-sm text-[var(--foreground-muted)]">
        Showing {filteredAuthorities.length} of {authorityStats.length} authorities
      </p>

      {/* Authorities Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up delay-2">
          {filteredAuthorities.map((stat, idx) => {
            const TypeIcon = AUTHORITY_TYPES[stat.type].icon;
            const colorClass = AUTHORITY_TYPES[stat.type].color;
            return (
              <div
                key={stat.authority}
                onClick={() => handleAuthorityClick(stat.authority)}
                className="p-5 rounded-xl bg-white border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-lg transition-all cursor-pointer group"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center border', colorClass)}>
                      <TypeIcon size={20} />
                    </div>
                    <div>
                      <h3 className="text-p2 font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">{stat.authority}</h3>
                      <p className="text-p3 text-[var(--foreground-muted)]">{stat.type}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-[var(--foreground-muted)] group-hover:text-[var(--primary)] transition-colors" />
                </div>
                <div className="mt-3 pt-3 border-t border-[var(--border)] grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-p1 font-semibold text-[var(--foreground)]">{stat.programCount}</p>
                    <p className="text-p3 text-[var(--foreground-muted)]">Programs</p>
                  </div>
                  <div>
                    <p className="text-p1 font-semibold text-[var(--foreground)]">{stat.requirementCount}</p>
                    <p className="text-p3 text-[var(--foreground-muted)]">Reqs</p>
                  </div>
                  <div>
                    <p className="text-p1 font-semibold text-[var(--foreground)]">{stat.obligationCount}</p>
                    <p className="text-p3 text-[var(--foreground-muted)]">Obls</p>
                  </div>
                  <div>
                    <p className="text-p1 font-semibold text-[var(--foreground)]">{stat.controlCount}</p>
                    <p className="text-p3 text-[var(--foreground-muted)]">Controls</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--border)] overflow-hidden animate-fade-in-up delay-2 bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-[var(--background-secondary)]">
              <tr>
                <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Authority</th>
                <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Type</th>
                <th className="text-center px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Programs</th>
                <th className="text-center px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Requirements</th>
                <th className="text-center px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Obligations</th>
                <th className="text-center px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] bg-white">
              {filteredAuthorities.map(stat => {
                const TypeIcon = AUTHORITY_TYPES[stat.type].icon;
                const colorClass = AUTHORITY_TYPES[stat.type].color;
                return (
                  <tr
                    key={stat.authority}
                    onClick={() => handleAuthorityClick(stat.authority)}
                    className="hover:bg-[var(--background-secondary)] cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center border', colorClass)}>
                          <TypeIcon size={16} />
                        </div>
                        <p className="text-p2 font-medium text-[var(--foreground)]">{stat.authority}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-p2 text-[var(--foreground)]">{stat.type}</td>
                    <td className="px-6 py-4 text-center text-p2 font-medium text-[var(--foreground)]">{stat.programCount}</td>
                    <td className="px-6 py-4 text-center text-p2 font-medium text-[var(--foreground)]">{stat.requirementCount}</td>
                    <td className="px-6 py-4 text-center text-p2 font-medium text-[var(--foreground)]">{stat.obligationCount}</td>
                    <td className="px-6 py-4 text-center text-p2 font-medium text-[var(--foreground)]">{stat.controlCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Authority Modal */}
      <AddAuthorityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(authority) => {
          console.log('New authority created:', authority);
          // TODO: Add to authorities list
        }}
      />
    </div>
  );
}

