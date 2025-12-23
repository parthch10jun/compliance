'use client';

import { useState } from 'react';
import {
  Plus, LayoutGrid, List,
  Shield, CheckCircle2, XCircle, Clock, AlertTriangle,
  Zap, Eye, Wrench, Calendar, MoreHorizontal, TrendingUp, Settings, ChevronRight
} from 'lucide-react';
import { controls, programs } from '@/lib/data/mock-data';
import { PageHeader, SearchFilterBar, FilterButtonGroup } from '@/components';
import { formatDateShort } from '@/lib/utils';

type EffectivenessFilter = 'all' | 'Effective' | 'Partially Effective' | 'Ineffective' | 'Not Tested';
type TypeFilter = 'all' | 'Preventive' | 'Detective' | 'Corrective';

export default function ControlsDashboard() {
  const [effectivenessFilter, setEffectivenessFilter] = useState<EffectivenessFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredControls = controls.filter(ctl => {
    const matchesEffectiveness = effectivenessFilter === 'all' || ctl.effectiveness === effectivenessFilter;
    const matchesType = typeFilter === 'all' || ctl.type === typeFilter;
    const matchesSearch = ctl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ctl.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEffectiveness && matchesType && matchesSearch;
  });

  const effectivenessStats = {
    effective: controls.filter(c => c.effectiveness === 'Effective').length,
    partial: controls.filter(c => c.effectiveness === 'Partially Effective').length,
    ineffective: controls.filter(c => c.effectiveness === 'Ineffective').length,
    notTested: controls.filter(c => c.effectiveness === 'Not Tested').length,
  };

  const typeStats = {
    preventive: controls.filter(c => c.type === 'Preventive').length,
    detective: controls.filter(c => c.type === 'Detective').length,
    corrective: controls.filter(c => c.type === 'Corrective').length,
  };

  const automationStats = {
    manual: controls.filter(c => c.automationLevel === 'Manual').length,
    semiAuto: controls.filter(c => c.automationLevel === 'Semi-Automated').length,
    fullyAuto: controls.filter(c => c.automationLevel === 'Fully Automated').length,
  };

  const totalTests = controls.reduce((acc, c) => acc + c.tests, 0);
  const passedTests = controls.reduce((acc, c) => acc + c.testsPassed, 0);
  const testPassRate = Math.round((passedTests / totalTests) * 100);

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Controls Dashboard"
        description="Monitor control effectiveness and testing coverage"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Controls' }
        ]}
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-dark)] transition-all duration-200 text-p2 font-medium shadow-sm hover:shadow-md">
            <Plus size={18} />
            New Control
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="animate-fade-in-up delay-1 grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-xl p-5 text-white shadow-md">
          <p className="text-white/70 text-p3 font-medium mb-1">Total Controls</p>
          <p className="text-h2 font-bold tracking-tight">{controls.length}</p>
          <p className="text-p3 text-white/60 mt-2">Across {programs.length} programs</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-p3 font-medium">Effective</p>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <p className="text-h2 font-bold tracking-tight text-emerald-600">{effectivenessStats.effective}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">{Math.round((effectivenessStats.effective / controls.length) * 100)}% of total</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-p3 font-medium">Partially Effective</p>
            <AlertTriangle size={16} className="text-amber-500" />
          </div>
          <p className="text-h2 font-bold tracking-tight text-amber-600">{effectivenessStats.partial}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">Needs improvement</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-p3 font-medium">Ineffective</p>
            <XCircle size={16} className="text-red-500" />
          </div>
          <p className="text-h2 font-bold tracking-tight text-red-600">{effectivenessStats.ineffective}</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">Requires action</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[var(--foreground-muted)] text-p3 font-medium">Test Pass Rate</p>
            <TrendingUp size={16} className="text-[var(--primary)]" />
          </div>
          <p className="text-h2 font-bold tracking-tight text-[var(--primary)]">{testPassRate}%</p>
          <p className="text-p3 text-[var(--foreground-muted)] mt-2">{passedTests} of {totalTests} passed</p>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="animate-fade-in-up delay-2 grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Control Type Distribution */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-6 hover:shadow-md transition-shadow">
          <h3 className="text-h4 text-[var(--foreground)] mb-4">Control Types</h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-blue-500" />
                  <span className="text-sm text-[var(--foreground)]">Preventive</span>
                </div>
                <span className="text-sm font-medium text-[var(--foreground)]">{typeStats.preventive}</span>
              </div>
              <div className="w-full h-2 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(typeStats.preventive / controls.length) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Eye size={14} className="text-purple-500" />
                  <span className="text-sm text-[var(--foreground)]">Detective</span>
                </div>
                <span className="text-sm font-medium text-[var(--foreground)]">{typeStats.detective}</span>
              </div>
              <div className="w-full h-2 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(typeStats.detective / controls.length) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Wrench size={14} className="text-orange-500" />
                  <span className="text-sm text-[var(--foreground)]">Corrective</span>
                </div>
                <span className="text-sm font-medium text-[var(--foreground)]">{typeStats.corrective}</span>
              </div>
              <div className="w-full h-2 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(typeStats.corrective / controls.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Automation Level */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Automation Level</h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-emerald-500" />
                  <span className="text-sm text-[var(--foreground)]">Fully Automated</span>
                </div>
                <span className="text-sm font-medium text-[var(--foreground)]">{automationStats.fullyAuto}</span>
              </div>
              <div className="w-full h-2 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(automationStats.fullyAuto / controls.length) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Settings size={14} className="text-[var(--primary)]" />
                  <span className="text-sm text-[var(--foreground)]">Semi-Automated</span>
                </div>
                <span className="text-sm font-medium text-[var(--foreground)]">{automationStats.semiAuto}</span>
              </div>
              <div className="w-full h-2 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: `${(automationStats.semiAuto / controls.length) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-500" />
                  <span className="text-sm text-[var(--foreground)]">Manual</span>
                </div>
                <span className="text-sm font-medium text-[var(--foreground)]">{automationStats.manual}</span>
              </div>
              <div className="w-full h-2 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
                <div className="h-full bg-gray-500 rounded-full" style={{ width: `${(automationStats.manual / controls.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Effectiveness Distribution */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-6 hover:shadow-md transition-shadow">
          <h3 className="text-h4 text-[var(--foreground)] mb-4">Effectiveness</h3>
          <div className="flex items-center justify-center h-32">
            <div className="relative w-32 h-32">
              {/* Simple donut visualization */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3"
                  strokeDasharray={`${(effectivenessStats.effective / controls.length) * 100} 100`} />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f59e0b" strokeWidth="3"
                  strokeDasharray={`${(effectivenessStats.partial / controls.length) * 100} 100`}
                  strokeDashoffset={`-${(effectivenessStats.effective / controls.length) * 100}`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[var(--foreground)]">{Math.round((effectivenessStats.effective / controls.length) * 100)}%</span>
                <span className="text-[10px] text-[var(--foreground-muted)]">Effective</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-[var(--foreground-muted)]">Effective</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs text-[var(--foreground-muted)]">Partial</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              <span className="text-xs text-[var(--foreground-muted)]">Other</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search controls by name or category..."
        filters={
          <>
            <FilterButtonGroup
              options={['all', 'Effective', 'Partially Effective', 'Ineffective', 'Not Tested']}
              value={effectivenessFilter}
              onChange={(value) => setEffectivenessFilter(value as EffectivenessFilter)}
              capitalize={false}
            />
            <FilterButtonGroup
              options={['all', 'Preventive', 'Detective', 'Corrective']}
              value={typeFilter}
              onChange={(value) => setTypeFilter(value as TypeFilter)}
              capitalize={false}
            />
          </>
        }
      />

      {/* Controls Table */}
      <div className="animate-fade-in-up delay-4 bg-white rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-[var(--background-secondary)]">
            <tr>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Control</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Category</th>
              <th className="text-center px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Type</th>
              <th className="text-center px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Automation</th>
              <th className="text-center px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Effectiveness</th>
              <th className="text-center px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Tests</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Next Test</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredControls.map((ctl) => (
              <tr key={ctl.id} className="hover:bg-[var(--background-secondary)] transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-[var(--foreground)]">{ctl.name}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">{ctl.owner}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-[var(--foreground)]">{ctl.category}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded font-medium ${
                    ctl.type === 'Preventive' ? 'bg-blue-100 text-blue-700' :
                    ctl.type === 'Detective' ? 'bg-purple-100 text-purple-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {ctl.type === 'Preventive' && <Shield size={10} />}
                    {ctl.type === 'Detective' && <Eye size={10} />}
                    {ctl.type === 'Corrective' && <Wrench size={10} />}
                    {ctl.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    ctl.automationLevel === 'Fully Automated' ? 'bg-emerald-100 text-emerald-700' :
                    ctl.automationLevel === 'Semi-Automated' ? 'bg-[var(--primary-lightest)] text-[var(--primary)]' :
                    'bg-gray-100 text-gray-700'
                  }`}>{ctl.automationLevel}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                    ctl.effectiveness === 'Effective' ? 'bg-emerald-100 text-emerald-700' :
                    ctl.effectiveness === 'Partially Effective' ? 'bg-amber-100 text-amber-700' :
                    ctl.effectiveness === 'Ineffective' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {ctl.effectiveness === 'Effective' && <CheckCircle2 size={10} />}
                    {ctl.effectiveness === 'Partially Effective' && <AlertTriangle size={10} />}
                    {ctl.effectiveness === 'Ineffective' && <XCircle size={10} />}
                    {ctl.effectiveness}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-[var(--foreground)]">{ctl.testsPassed}/{ctl.tests}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-p3 text-[var(--foreground-muted)]">
                    {formatDateShort(ctl.nextTestDate)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-[var(--foreground-muted)] hover:text-[var(--primary)]">
                    <ChevronRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

