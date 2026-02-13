'use client';

import { useState } from 'react';
import { 
  Search, Grid3X3, List, Download, ChevronRight, BookOpen, 
  Star, Users, Calendar, Shield, FileText, Tag, Eye,
  Building2, Globe, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { programTemplates } from '@/lib/data/program-library';
import { PageHeader, SearchFilterBar } from '@/components';

const categories = ['All', 'Regulatory', 'Standard', 'Framework', 'Industry'];

export default function ProgramLibraryPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const filteredTemplates = programTemplates.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(search.toLowerCase()) || 
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = category === 'All' || t.category === category;
    return matchesSearch && matchesCategory;
  });

  const selectedProgram = selectedTemplate 
    ? programTemplates.find(t => t.id === selectedTemplate) 
    : null;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Regulatory': return 'bg-rose-500/10 text-rose-600 border-rose-200';
      case 'Standard': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'Framework': return 'bg-violet-500/10 text-violet-600 border-violet-200';
      case 'Industry': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* Main Content */}
      <div className={clsx(
        "flex flex-col transition-all duration-300 ease-out",
        selectedTemplate ? "flex-[0_0_58%]" : "flex-1"
      )}>
        <PageHeader
          title="Program Library"
          description="Pre-built compliance frameworks and standards ready to import"
        />

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-lg text-sm bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50"
            />
          </div>
          <div className="flex gap-1 p-1 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={clsx(
                  'px-3 py-1.5 text-sm rounded-md transition-all font-medium',
                  category === cat 
                    ? 'bg-[var(--background)] text-[var(--foreground)] shadow-sm' 
                    : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-1 p-1 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)]">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx('p-2 rounded-md', viewMode === 'grid' ? 'bg-[var(--background)] shadow-sm' : 'text-[var(--foreground-muted)]')}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx('p-2 rounded-md', viewMode === 'list' ? 'bg-[var(--background)] shadow-sm' : 'text-[var(--foreground-muted)]')}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-auto pr-2">
          <div className={clsx(
            viewMode === 'grid'
              ? 'grid gap-4 pb-4'
              : 'flex flex-col gap-3 pb-4',
            viewMode === 'grid' && !selectedTemplate && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
            viewMode === 'grid' && selectedTemplate && 'grid-cols-1 lg:grid-cols-2'
          )}>
            {filteredTemplates.map((template) => {
              const isSelected = selectedTemplate === template.id;
              return (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={clsx(
                  'group bg-[var(--background)] border rounded-xl p-5 cursor-pointer transition-all duration-200',
                  isSelected
                    ? 'border-cyan-500/50 shadow-md'
                    : 'border-[var(--border)] hover:shadow-md hover:border-cyan-500/30'
                )}
              >

                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                      <Shield size={20} className="text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--foreground)] group-hover:text-cyan-600 transition-colors">
                        {template.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
                        <span>{template.publisher}</span>
                        <span>•</span>
                        <span>v{template.version}</span>
                      </div>
                    </div>
                  </div>
                  <span className={clsx('px-2 py-1 text-xs font-medium rounded-full border', getCategoryColor(template.category))}>
                    {template.category}
                  </span>
                </div>

                <p className="text-sm text-[var(--foreground-muted)] mb-4 line-clamp-2">
                  {template.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)] mb-4">
                  <span className="flex items-center gap-1">
                    <FileText size={14} />
                    {template.requirementCount} Requirements
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield size={14} />
                    {template.controlCount} Controls
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {template.popularity} imports
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {template.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-xs bg-[var(--background-secondary)] text-[var(--foreground-muted)] rounded-md">
                      {tag}
                    </span>
                  ))}
                  {template.tags.length > 3 && (
                    <span className="px-2 py-0.5 text-xs bg-[var(--background-secondary)] text-[var(--foreground-muted)] rounded-md">
                      +{template.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      {selectedProgram && (
        <div className="flex-[0_0_40%] bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Template Preview</h2>
            <button
              onClick={() => setSelectedTemplate(null)}
              className="p-2 hover:bg-[var(--background-secondary)] rounded-lg text-[var(--foreground-muted)]"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-auto space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Shield size={28} className="text-cyan-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--foreground)]">{selectedProgram.name}</h3>
                <p className="text-sm text-[var(--foreground-muted)] mt-1">
                  {selectedProgram.publisher} • Version {selectedProgram.version}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2">Description</h4>
              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                {selectedProgram.longDescription || selectedProgram.description}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[var(--background-secondary)] rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-cyan-600">{selectedProgram.requirementCount}</div>
                <div className="text-xs text-[var(--foreground-muted)]">Requirements</div>
              </div>
              <div className="bg-[var(--background-secondary)] rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-emerald-600">{selectedProgram.obligationCount}</div>
                <div className="text-xs text-[var(--foreground-muted)]">Obligations</div>
              </div>
              <div className="bg-[var(--background-secondary)] rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{selectedProgram.controlCount}</div>
                <div className="text-xs text-[var(--foreground-muted)]">Controls</div>
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">Key Features</h4>
              <ul className="space-y-2">
                {selectedProgram.keyFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[var(--foreground-muted)]">
                    <ChevronRight size={16} className="text-cyan-500 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Applicable To */}
            <div>
              <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">Applicable To</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProgram.applicableTo.map((item, idx) => (
                  <span key={idx} className="px-3 py-1 text-xs bg-[var(--background-secondary)] text-[var(--foreground-muted)] rounded-full border border-[var(--border)]">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">Authority Tags</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProgram.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 text-xs bg-cyan-500/10 text-cyan-600 rounded-full border border-cyan-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[var(--foreground-muted)]">Last Updated</span>
                <p className="font-medium text-[var(--foreground)]">{selectedProgram.lastUpdated}</p>
              </div>
              <div>
                <span className="text-[var(--foreground-muted)]">Times Imported</span>
                <p className="font-medium text-[var(--foreground)]">{selectedProgram.popularity}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[var(--border)] mt-4 flex gap-3">
            <button className="flex-1 px-4 py-2.5 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2">
              <Download size={18} />
              Import to My Programs
            </button>
            <Link
              href={`/library/programs/${selectedProgram.id}`}
              className="px-4 py-2.5 border border-[var(--border)] rounded-lg font-medium hover:bg-[var(--background-secondary)] transition-colors flex items-center gap-2"
            >
              <Eye size={18} />
              Full View
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
