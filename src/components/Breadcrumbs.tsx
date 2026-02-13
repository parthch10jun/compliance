'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

// Route label mapping
const routeLabels: Record<string, string> = {
  '': 'Dashboard',
  'dashboard': 'Dashboard',
  'executive': 'Executive View',
  'risk-heatmap': 'Risk Heat Map',
  'authorities': 'Authorities',
  'programs': 'Programs',
  'citations': 'Citations',
  'requirements': 'Requirements',
  'obligations': 'Obligations',
  'controls': 'Controls',
  'tests': 'Tests',
  'evidence': 'Evidence',
  'assessments': 'Assessments',
  'issues': 'Issues',
  'tasks': 'Tasks',
  'compliance': 'Compliance',
  'status': 'Status',
  'library': 'Library',
  'frameworks': 'Frameworks',
  'policies': 'Policies',
  'risks': 'Risks',
  'assets': 'Assets',
  'audits': 'Audits',
  'admin': 'Admin',
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // Don't show breadcrumbs on home page
  if (pathname === '/') {
    return null;
  }

  // Parse the pathname into breadcrumb items
  const segments = pathname.split('/').filter(Boolean);

  // Filter out 'dashboard' segment to avoid redundancy with Home
  const filteredSegments = segments.filter(segment => segment !== 'dashboard');

  const breadcrumbs: BreadcrumbItem[] = filteredSegments.map((segment, index) => {
    const href = '/' + filteredSegments.slice(0, index + 1).join('/');
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    return { label, href };
  });

  // Add home as the first item
  breadcrumbs.unshift({ label: 'Home', href: '/' });

  return (
    <nav className="flex items-center gap-1 mb-4 text-sm" aria-label="Breadcrumb">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const isFirst = index === 0;

        return (
          <div key={crumb.href} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight size={14} className="text-[var(--foreground-muted)]" />
            )}
            
            {isLast ? (
              <span className="px-2 py-1 text-[var(--foreground)] font-medium">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-lightest)] transition-colors"
              >
                {isFirst && <Home size={14} />}
                {!isFirst && crumb.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

