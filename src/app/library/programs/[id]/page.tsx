'use client';

import { use, useState } from 'react';
import { PageHeader } from '@/components';
import { programTemplates } from '@/lib/data/program-library';
import { 
  Shield, Calendar, Download, ArrowLeft, BookOpen, 
  Star, Users, FileText, CheckCircle2, Tag, Globe,
  Building2, TrendingUp, Eye, Share2
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { notFound, useRouter } from 'next/navigation';

export default function ProgramTemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  
  const template = programTemplates.find(t => t.id === id);

  if (!template) {
    notFound();
  }

  const handleImport = () => {
    setImporting(true);
    // Simulate import process
    setTimeout(() => {
      router.push('/programs');
    }, 1500);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Regulatory': return 'bg-red-100 text-red-700 border-red-200';
      case 'Standard': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Framework': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Industry': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link 
        href="/library/programs"
        className="inline-flex items-center gap-2 text-p2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Program Library
      </Link>

      {/* Page Header */}
      <PageHeader
        title={template.name}
        description={template.description}
        action={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-[var(--border)] bg-[var(--background)] rounded-xl hover:bg-[var(--background-secondary)] transition-all duration-200 text-p2 font-medium">
              <Share2 size={18} />
              Share
            </button>
            <button 
              onClick={handleImport}
              disabled={importing}
              className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-all duration-200 text-p2 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              {importing ? 'Importing...' : 'Import to My Programs'}
            </button>
          </div>
        }
      />

      {/* Template Info Bar */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className={clsx('px-3 py-1.5 text-xs rounded-full font-medium border', getCategoryColor(template.category))}>
          {template.category}
        </span>
        <div className="flex items-center gap-2 text-p2 text-[var(--foreground-muted)]">
          <Building2 size={16} />
          <span>{template.publisher}</span>
        </div>
        <div className="flex items-center gap-2 text-p2 text-[var(--foreground-muted)]">
          <Calendar size={16} />
          <span>Version {template.version}</span>
        </div>
        <div className="flex items-center gap-2 text-p2 text-[var(--foreground-muted)]">
          <Users size={16} />
          <span>{template.popularity} organizations using</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up delay-1">
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1">Requirements</p>
          <p className="text-h2 font-bold text-[var(--foreground)]">{template.requirementCount}</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1">Obligations</p>
          <p className="text-h2 font-bold text-[var(--foreground)]">{template.obligationCount}</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1">Controls</p>
          <p className="text-h2 font-bold text-[var(--foreground)]">{template.controlCount}</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-[var(--foreground-muted)] text-p3 font-medium mb-1">Popularity</p>
          <div className="flex items-center gap-2">
            <Star size={20} className="text-amber-500 fill-amber-500" />
            <p className="text-h2 font-bold text-[var(--foreground)]">{template.popularity}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up delay-2">
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <h3 className="text-h3 font-semibold text-[var(--foreground)] mb-4">About This Framework</h3>
            <p className="text-p2 text-[var(--foreground)] leading-relaxed">
              {template.longDescription || template.description}
            </p>
          </div>

          {/* Key Features */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <h3 className="text-h3 font-semibold text-[var(--foreground)] mb-4">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {template.keyFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-[var(--background-secondary)] rounded-lg">
                  <CheckCircle2 size={18} className="text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span className="text-p2 text-[var(--foreground)]">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What's Included */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <h3 className="text-h3 font-semibold text-[var(--foreground)] mb-4">What's Included</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-[var(--background-secondary)] rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                  <FileText size={20} className="text-cyan-600" />
                </div>
                <div>
                  <h4 className="text-p2 font-semibold text-[var(--foreground)] mb-1">
                    {template.requirementCount} Requirements
                  </h4>
                  <p className="text-p3 text-[var(--foreground-muted)]">
                    Comprehensive regulatory requirements mapped to controls and tests
                  </p>
                </div>
              </div>

              {template.obligationCount > 0 && (
                <div className="flex items-start gap-4 p-4 bg-[var(--background-secondary)] rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Calendar size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-p2 font-semibold text-[var(--foreground)] mb-1">
                      {template.obligationCount} Obligations
                    </h4>
                    <p className="text-p3 text-[var(--foreground-muted)]">
                      Time-bound compliance obligations with due dates and workflows
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4 p-4 bg-[var(--background-secondary)] rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Shield size={20} className="text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-p2 font-semibold text-[var(--foreground)] mb-1">
                    {template.controlCount} Controls
                  </h4>
                  <p className="text-p3 text-[var(--foreground-muted)]">
                    Pre-configured controls with testing procedures and evidence requirements
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Applicable To */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <h3 className="text-h3 font-semibold text-[var(--foreground)] mb-4">Applicable To</h3>
            <div className="flex flex-wrap gap-2">
              {template.applicableTo.map((item, idx) => (
                <span key={idx} className="px-3 py-1.5 text-p3 bg-cyan-50 text-cyan-700 rounded-lg border border-cyan-200 font-medium">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <h3 className="text-h3 font-semibold text-[var(--foreground)] mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {template.tags.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 text-p3 bg-[var(--background-secondary)] text-[var(--foreground-muted)] rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Version Info */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <h3 className="text-h3 font-semibold text-[var(--foreground)] mb-4">Version Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-p3 text-[var(--foreground-muted)] mb-1">Version</p>
                <p className="text-p2 font-medium text-[var(--foreground)]">{template.version}</p>
              </div>
              <div>
                <p className="text-p3 text-[var(--foreground-muted)] mb-1">Effective Date</p>
                <p className="text-p2 font-medium text-[var(--foreground)]">
                  {template.effectiveDate ? new Date(template.effectiveDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-p3 text-[var(--foreground-muted)] mb-1">Last Updated</p>
                <p className="text-p2 font-medium text-[var(--foreground)]">
                  {template.lastUpdated ? new Date(template.lastUpdated).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Import CTA */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-600 flex items-center justify-center">
                <Download size={20} className="text-white" />
              </div>
              <h3 className="text-h3 font-semibold text-cyan-900">Ready to Import?</h3>
            </div>
            <p className="text-p3 text-cyan-800 mb-4">
              Import this template to your programs and start managing compliance immediately.
            </p>
            <button
              onClick={handleImport}
              disabled={importing}
              className="w-full px-4 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importing ? 'Importing...' : 'Import Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

