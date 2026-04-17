'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  LayoutDashboard, Shield, Target, Layers, Grid3X3, FlaskConical,
  TrendingUp, Activity, FileText, Library, Settings, ChevronsLeft,
  ChevronsRight, ChevronRight, AlertTriangle, BarChart3, Bell, CheckCircle
} from 'lucide-react';
import clsx from 'clsx';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  isCollapsed?: boolean;
}

function NavItem({ href, icon, label, badge, isCollapsed }: NavItemProps) {
  const pathname = usePathname();
  // Exact match for dashboard, otherwise check if path starts with href
  const isActive = href === '/erm'
    ? pathname === '/erm'
    : pathname.startsWith(href);

  return (
    <Link
      href={href}
      title={isCollapsed ? label : undefined}
      className={clsx(
        'group flex items-center gap-3 px-3 py-2 rounded-lg text-p2 transition-all relative',
        isActive
          ? 'bg-indigo-50 text-indigo-600 font-medium'
          : 'text-[var(--foreground-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]'
      )}
    >
      {/* Left accent bar for active */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-600 rounded-r-full"></div>
      )}

      <span className={clsx(
        'transition-colors',
        isActive ? 'text-indigo-600' : 'text-[var(--foreground-muted)] group-hover:text-[var(--foreground)]'
      )}>
        {icon}
      </span>

      {!isCollapsed && (
        <>
          <span className="flex-1">{label}</span>
          {badge && badge > 0 && (
            <span className="px-1.5 py-0.5 bg-indigo-600 text-white text-xs font-medium rounded-full min-w-[20px] text-center">
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

interface NavGroupProps {
  label: string;
  children: React.ReactNode;
  isCollapsed?: boolean;
}

function NavGroup({ label, children, isCollapsed }: NavGroupProps) {
  if (isCollapsed) {
    return <div className="space-y-0.5">{children}</div>;
  }

  return (
    <div className="space-y-0.5">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
        {label}
      </div>
      {children}
    </div>
  );
}

export default function ERMSidebar() {
  const { isCollapsed, toggleCollapsed } = useSidebar();

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 bottom-0 bg-white border-r border-[var(--border)] flex flex-col transition-all duration-300 ease-in-out z-30',
        isCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo/Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--border)]">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <span className="font-semibold text-base text-[var(--foreground)]">ERM</span>
              <p className="text-xs text-[var(--foreground-muted)]">Risk Management</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto">
            <Shield size={18} className="text-white" />
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <div className="flex justify-end p-2 border-b border-[var(--border)]">
        <button
          onClick={toggleCollapsed}
          className="p-1.5 rounded-lg hover:bg-[var(--sidebar-hover)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-6" style={{ scrollbarWidth: 'thin' }}>
        {/* Overview Section */}
        <NavGroup label="Overview" isCollapsed={isCollapsed}>
          <NavItem href="/erm" icon={<LayoutDashboard size={18} />} label="Dashboard" isCollapsed={isCollapsed} />
          <NavItem href="/erm/heatmap" icon={<BarChart3 size={18} />} label="Heat Map" isCollapsed={isCollapsed} />
        </NavGroup>

        {/* Risk Management Section */}
        <NavGroup label="Risk Management" isCollapsed={isCollapsed}>
          <NavItem href="/erm/risk-register" icon={<AlertTriangle size={18} />} label="Risk Register" isCollapsed={isCollapsed} />
          <NavItem href="/erm/assessments" icon={<FlaskConical size={18} />} label="Assessments" isCollapsed={isCollapsed} />
          <NavItem href="/erm/treatments" icon={<Shield size={18} />} label="Treatments" isCollapsed={isCollapsed} />
          <NavItem href="/erm/control-testing" icon={<CheckCircle size={18} />} label="Control Testing" isCollapsed={isCollapsed} />
        </NavGroup>

        {/* Context & Setup Section */}
        <NavGroup label="Context" isCollapsed={isCollapsed}>
          <NavItem href="/erm/organizational-structure" icon={<Layers size={18} />} label="Organization" isCollapsed={isCollapsed} />
          <NavItem href="/erm/objectives" icon={<Target size={18} />} label="Objectives" isCollapsed={isCollapsed} />
          <NavItem href="/erm/categories" icon={<Grid3X3 size={18} />} label="Categories" isCollapsed={isCollapsed} />
          <NavItem href="/erm/matrices" icon={<BarChart3 size={18} />} label="Matrices" isCollapsed={isCollapsed} />
        </NavGroup>

        {/* Monitoring Section */}
        <NavGroup label="Monitoring" isCollapsed={isCollapsed}>
          <NavItem href="/erm/kris" icon={<Activity size={18} />} label="KRIs" isCollapsed={isCollapsed} />
          <NavItem href="/erm/reports" icon={<FileText size={18} />} label="Reports" isCollapsed={isCollapsed} />
        </NavGroup>

        {/* Notifications Section */}
        <NavGroup label="Notifications" isCollapsed={isCollapsed}>
          <NavItem href="/erm/notifications" icon={<Bell size={18} />} label="Alerts & Activities" badge={3} isCollapsed={isCollapsed} />
        </NavGroup>

        {/* Library Section */}
        <NavGroup label="Library" isCollapsed={isCollapsed}>
          <NavItem href="/erm/library" icon={<Library size={18} />} label="Frameworks" isCollapsed={isCollapsed} />
        </NavGroup>

        {/* Back to Compliance Link */}
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:shadow-md bg-gradient-to-r from-teal-500 to-teal-600 text-white group"
          >
            <Shield size={20} className="flex-shrink-0" />
            {!isCollapsed && (
              <div className="flex-1">
                <div className="font-semibold text-sm">Compliance</div>
                <div className="text-xs opacity-90">Go to GRC Module</div>
              </div>
            )}
            {!isCollapsed && (
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            )}
          </Link>
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="flex-shrink-0 p-3 border-t border-[var(--border)] bg-white">
          <span className="text-xs text-[var(--foreground-muted)]">Ascent ERM v1.0</span>
        </div>
      )}
    </aside>
  );
}
