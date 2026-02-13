'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BarChart3, Building2, FolderKanban, FileStack,
  Shield, FlaskConical, Paperclip, CheckSquare, ClipboardCheck,
  AlertCircle, TrendingUp, AlertTriangle, Library as LibraryIcon,
  FileText, Package, PanelLeftClose, PanelLeft, ChevronRight
} from 'lucide-react';
import clsx from 'clsx';
import type { NavSection } from './TopNav';

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
  description?: string;
}

interface SidebarSection {
  title?: string;
  links: SidebarLink[];
}

// Define sidebar content for each top-level section
const sidebarContent: Record<NavSection, SidebarSection[]> = {
  dashboard: [
    {
      links: [
        { label: 'Overview', href: '/', icon: <LayoutDashboard size={16} />, description: 'Main dashboard' },
        { label: 'Executive View', href: '/dashboard/executive', icon: <BarChart3 size={16} />, description: 'High-level metrics' },
      ]
    }
  ],
  compliance: [
    {
      title: 'Regulatory Universe',
      links: [
        { label: 'Status Tracker', href: '/compliance/status', icon: <TrendingUp size={16} /> },
        { label: 'Authorities', href: '/authorities', icon: <Building2 size={16} /> },
        { label: 'My Programs', href: '/programs', icon: <FolderKanban size={16} /> },
        { label: 'Citations', href: '/citations', icon: <FileStack size={16} /> },
      ]
    }
  ],
  controls: [
    {
      title: 'Control Environment',
      links: [
        { label: 'My Controls', href: '/controls?filter=my', icon: <Shield size={16} />, badge: 12 },
        { label: 'All Controls', href: '/controls', icon: <Shield size={16} /> },
        { label: 'Tests', href: '/tests', icon: <FlaskConical size={16} /> },
        { label: 'Evidence', href: '/evidence', icon: <Paperclip size={16} /> },
      ]
    }
  ],
  'my-work': [
    {
      links: [
        { label: 'My Actions', href: '/tasks', icon: <CheckSquare size={16} />, badge: 12 },
        { label: 'My Assessments', href: '/assessments', icon: <ClipboardCheck size={16} />, badge: 3 },
        { label: 'My Issues', href: '/issues?filter=my', icon: <AlertCircle size={16} />, badge: 5 },
      ]
    }
  ],
  issues: [
    {
      links: [
        { label: 'All Issues', href: '/issues', icon: <AlertTriangle size={16} />, badge: 8 },
        { label: 'My Issues', href: '/issues?filter=my', icon: <AlertCircle size={16} />, badge: 5 },
        { label: 'Critical', href: '/issues?severity=critical', icon: <AlertTriangle size={16} />, badge: 2 },
      ]
    }
  ],
  library: [
    {
      title: 'Resources',
      links: [
        { label: 'Program Templates', href: '/library/programs', icon: <FolderKanban size={16} /> },
        { label: 'Frameworks', href: '/library/frameworks', icon: <LibraryIcon size={16} /> },
        { label: 'Policies', href: '/library/policies', icon: <FileText size={16} /> },
        { label: 'Risks', href: '/library/risks', icon: <AlertCircle size={16} /> },
        { label: 'Assets', href: '/library/assets', icon: <Package size={16} /> },
      ]
    }
  ],
  admin: [
    {
      links: [
        { label: 'Settings', href: '/admin', icon: <LayoutDashboard size={16} /> },
      ]
    }
  ],
};

interface ContextualSidebarProps {
  activeSection: NavSection;
}

export default function ContextualSidebar({ activeSection }: ContextualSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const sections = sidebarContent[activeSection] || [];

  return (
    <aside
      className={clsx(
        'fixed left-0 top-14 bottom-0 bg-[var(--sidebar-bg)] border-r border-[var(--border)] flex flex-col transition-all duration-300 z-40',
        isCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Collapse Toggle */}
      <div className="flex justify-end p-2 border-b border-[var(--border)]">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-[var(--sidebar-hover)] text-[var(--foreground-muted)] transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-6 scrollbar-thin">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.title && !isCollapsed && (
              <h3 className="px-3 py-2 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <div className="space-y-0.5">
              {section.links.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group relative',
                      isActive
                        ? 'bg-[var(--primary-lightest)] text-[var(--primary)] font-medium border-l-3 border-[var(--primary)]'
                        : 'text-[var(--foreground)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--primary)]'
                    )}
                    title={isCollapsed ? link.label : undefined}
                  >
                    <span className={clsx(isActive ? 'text-[var(--primary)]' : 'text-[var(--foreground-muted)] group-hover:text-[var(--primary)]')}>
                      {link.icon}
                    </span>
                    
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{link.label}</span>
                        {link.badge && (
                          <span className="px-1.5 py-0.5 bg-[var(--error)] text-white text-xs font-medium rounded-full min-w-[20px] text-center">
                            {link.badge}
                          </span>
                        )}
                      </>
                    )}

                    {isCollapsed && link.badge && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--error)] rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-3 border-t border-[var(--border)] bg-[var(--sidebar-bg)]">
          <span className="text-xs text-[var(--foreground-muted)]">Ascent v1.0</span>
        </div>
      )}
    </aside>
  );
}

