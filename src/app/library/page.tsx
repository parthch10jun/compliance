'use client';

import { PageHeader } from '@/components';
import { Library, FileText, Package, AlertCircle, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { programTemplates } from '@/lib/data/program-library';

const libraryCategories = [
  {
    id: 'programs',
    title: 'Program Templates',
    description: 'Pre-built compliance programs ready to import',
    icon: BookOpen,
    href: '/library/programs',
    count: programTemplates.length,
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'frameworks',
    title: 'Frameworks',
    description: 'Compliance frameworks and standards library',
    icon: Library,
    href: '/library/frameworks',
    count: 12,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'policies',
    title: 'Policies',
    description: 'Organizational policies and procedures',
    icon: FileText,
    href: '/library/policies',
    count: 24,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'risks',
    title: 'Risks',
    description: 'Risk register and assessments',
    icon: AlertCircle,
    href: '/library/risks',
    count: 18,
    color: 'from-amber-500 to-amber-600'
  },
  {
    id: 'assets',
    title: 'Assets',
    description: 'IT assets and inventory',
    icon: Package,
    href: '/library/assets',
    count: 156,
    color: 'from-purple-500 to-purple-600'
  },
];

const resourceHubs = [
  {
    id: 'iso27001',
    title: 'ISO 27001 Hub',
    description: 'Comprehensive resources, guides, and templates for ISO 27001 compliance',
    href: '/iso27001-hub',
    color: 'from-emerald-400 to-teal-500',
    badge: 'Resource Hub'
  },
  {
    id: 'dpdp',
    title: 'DPDP Act Hub',
    description: 'Complete guide to India\'s Digital Personal Data Protection Act 2023',
    href: '/dpdp-hub',
    color: 'from-orange-400 to-red-500',
    badge: 'Resource Hub'
  },
];

export default function LibraryPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Library"
        description="Access frameworks, policies, risks, and assets"
      />

      {/* Resource Hubs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-h3 font-bold text-[var(--foreground)]">Resource Hubs</h2>
          <span className="text-p3 text-[var(--foreground-muted)]">Comprehensive compliance guides</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resourceHubs.map((hub) => (
            <Link
              key={hub.id}
              href={hub.href}
              className="group relative overflow-hidden p-8 rounded-2xl border-2 border-[var(--border)] hover:border-transparent hover:shadow-2xl transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${hub.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-white/90 group-hover:bg-white text-[var(--primary)] rounded-full text-p3 font-bold mb-4">
                  {hub.badge}
                </span>
                <h3 className="text-h3 font-bold text-[var(--foreground)] group-hover:text-white mb-3 transition-colors">
                  {hub.title}
                </h3>
                <p className="text-p2 text-[var(--foreground-muted)] group-hover:text-white/90 mb-4 transition-colors">
                  {hub.description}
                </p>
                <div className="flex items-center gap-2 text-[var(--primary)] group-hover:text-white font-semibold transition-colors">
                  <span>Explore resources</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Library Categories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-h3 font-bold text-[var(--foreground)]">Library Categories</h2>
          <span className="text-p3 text-[var(--foreground-muted)]">Manage your compliance assets</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {libraryCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                href={category.href}
                className="group p-6 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center shadow-md`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <ArrowRight size={20} className="text-[var(--foreground-muted)] group-hover:text-[var(--primary)] transition-colors" />
                </div>

                <h3 className="text-h4 font-semibold text-[var(--foreground)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                  {category.title}
                </h3>
                <p className="text-p2 text-[var(--foreground-muted)] mb-4">
                  {category.description}
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[var(--foreground)]">{category.count}</span>
                  <span className="text-p2 text-[var(--foreground-muted)]">items</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

