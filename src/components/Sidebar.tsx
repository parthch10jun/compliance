'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  LayoutDashboard, BookOpen, Library, ClipboardCheck, ShieldAlert,
  Landmark, AlertTriangle, FileCheck, Shield, FileText, BarChart3,
  Clipboard, ChevronDown, ChevronRight, ListTodo, PanelLeftClose, PanelLeft,
  FolderKanban, Settings, Calendar, CircleAlert, Users, Building2,
  FileStack, FlaskConical, Paperclip, GitBranch, Layers, CheckSquare,
  Package, Tag, Calculator, Sliders, Compass, Bell, TrendingUp, Clock, FileBarChart
} from 'lucide-react';
import clsx from 'clsx';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  'data-tour'?: string;
}

function NavItem({ href, icon, label, isActive, isCollapsed, 'data-tour': dataTour }: NavItemProps) {
  return (
    <Link
      href={href}
      title={isCollapsed ? label : undefined}
      data-tour={dataTour}
      className={clsx(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
        isActive
          ? 'bg-[var(--primary-lightest)] text-[var(--primary)] border-l-3 border-[var(--primary)]'
          : 'text-[var(--foreground)] hover:bg-[var(--sidebar-hover)]'
      )}
    >
      <span className={clsx(isActive ? 'text-[var(--primary)]' : 'text-[var(--foreground-muted)]')}>
        {icon}
      </span>
      {!isCollapsed && <span className="flex-1">{label}</span>}
    </Link>
  );
}

interface NavGroupProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  isCollapsed?: boolean;
  defaultOpen?: boolean;
}

function NavGroup({ icon, label, children, isCollapsed, defaultOpen = false }: NavGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (isCollapsed) {
    return (
      <div className="relative group">
        <button
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--foreground)] hover:bg-[var(--sidebar-hover)] w-full transition-colors"
          title={label}
        >
          <span className="text-[var(--foreground-muted)]">{icon}</span>
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--foreground)] hover:bg-[var(--sidebar-hover)] w-full transition-colors"
      >
        <span className="text-[var(--foreground-muted)]">{icon}</span>
        <span className="flex-1 text-left">{label}</span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {isOpen && (
        <div className="ml-4 mt-1 space-y-0.5 border-l border-[var(--border)] pl-3">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapsed } = useSidebar();

  return (
    <aside className={clsx(
      "fixed left-0 top-16 bottom-0 bg-[var(--sidebar-bg)] border-r border-[var(--border)] flex flex-col transition-all duration-200",
      isCollapsed ? "w-16" : "w-60"
    )}>
      {/* Collapse Toggle */}
      <div className="flex justify-end p-2 flex-shrink-0 border-b border-[var(--border)]">
        <button
          onClick={toggleCollapsed}
          className="p-1.5 rounded-lg hover:bg-[var(--sidebar-hover)] text-[var(--foreground-muted)] transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Scrollable Navigation */}
      <nav className="p-2 space-y-1 overflow-y-auto flex-1 pb-4" style={{ scrollbarWidth: 'thin' }}>
        {/* 📊 Dashboards */}
        <NavGroup
          icon={<BarChart3 size={18} />}
          label="Dashboards"
          isCollapsed={isCollapsed}
          defaultOpen={true}
        >
          <NavItem
            href="/"
            icon={<LayoutDashboard size={16} />}
            label="Overview"
            isActive={pathname === '/'}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/dashboard/executive"
            icon={<BarChart3 size={16} />}
            label="Executive"
            isActive={pathname === '/dashboard/executive'}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/dashboard/risk-heatmap"
            icon={<AlertTriangle size={16} />}
            label="Risk Heat Map"
            isActive={pathname === '/dashboard/risk-heatmap'}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/reports"
            icon={<FileBarChart size={16} />}
            label="Reports"
            isActive={pathname === '/reports' || pathname.startsWith('/reports/')}
            isCollapsed={isCollapsed}
          />
        </NavGroup>

        {/* ✓ My Work */}
        <NavGroup
          icon={<CheckSquare size={18} />}
          label="My Work"
          isCollapsed={isCollapsed}
          defaultOpen={true}
        >
          <NavItem
            href="/assessments"
            icon={<Calendar size={16} />}
            label="My Assessments"
            isActive={pathname === '/assessments' || pathname.startsWith('/assessments/')}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/issues"
            icon={<CircleAlert size={16} />}
            label="My Issues"
            isActive={pathname === '/issues' || pathname.startsWith('/issues/')}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/control-testing"
            icon={<Shield size={16} />}
            label="Control Testing"
            isActive={pathname === '/control-testing' || pathname.startsWith('/control-testing/')}
            isCollapsed={isCollapsed}
            badgeColor="blue"
          />
          <NavItem
            href="/issue-management"
            icon={<CircleAlert size={16} />}
            label="Issue Management"
            isActive={pathname === '/issue-management' || pathname.startsWith('/issue-management/')}
            isCollapsed={isCollapsed}
            badgeColor="red"
          />
          <NavItem
            href="/test-templates"
            icon={<FileText size={16} />}
            label="Test Templates"
            isActive={pathname === '/test-templates' || pathname.startsWith('/test-templates/')}
            isCollapsed={isCollapsed}
            badgeColor="green"
          />
        </NavGroup>

        {/* 🔔 Regulatory Intelligence */}
        <NavGroup
          icon={<Bell size={18} />}
          label="Regulatory Intelligence"
          isCollapsed={isCollapsed}
          defaultOpen={true}
        >
          <NavItem
            href="/regulatory-intelligence"
            icon={<Bell size={16} />}
            label="Updates & Alerts"
            isActive={pathname === '/regulatory-intelligence' || pathname.startsWith('/regulatory-intelligence/')}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/circulars"
            icon={<FileText size={16} />}
            label="Circulars & Notifications"
            isActive={pathname === '/circulars' || pathname.startsWith('/circulars/')}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/requirement-versions"
            icon={<GitBranch size={16} />}
            label="Version History"
            isActive={pathname === '/requirement-versions' || pathname.startsWith('/requirement-versions/')}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/predictive-compliance"
            icon={<TrendingUp size={16} />}
            label="Predictive Compliance"
            isActive={pathname === '/predictive-compliance' || pathname.startsWith('/predictive-compliance/')}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/compliance-calendar"
            icon={<Clock size={16} />}
            label="Compliance Calendar"
            isActive={pathname === '/compliance-calendar' || pathname.startsWith('/compliance-calendar/')}
            isCollapsed={isCollapsed}
          />
        </NavGroup>

        {/* 🔍 Internal Audit */}
        <NavGroup
          icon={<Shield size={18} />}
          label="Internal Audit"
          isCollapsed={isCollapsed}
          defaultOpen={true}
        >
          <NavItem
            href="/internal-audit"
            icon={<Shield size={16} />}
            label="Audit Dashboard"
            isActive={pathname === '/internal-audit' || pathname.startsWith('/internal-audit/')}
            isCollapsed={isCollapsed}
          />
        </NavGroup>

        {/* 📖 Regulatory Universe */}
        <NavGroup
          icon={<BookOpen size={18} />}
          label="Regulatory Universe"
          isCollapsed={isCollapsed}
          defaultOpen={true}
        >
          <NavItem
            href="/authorities"
            icon={<Building2 size={16} />}
            label="Authorities"
            isActive={pathname === '/authorities' || pathname.startsWith('/authorities/')}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/programs"
            icon={<FolderKanban size={16} />}
            label="My Programs"
            isActive={pathname === '/programs' || pathname.startsWith('/programs/')}
            isCollapsed={isCollapsed}
            data-tour="programs-nav"
          />
          <NavItem
            href="/requirements"
            icon={<FileText size={16} />}
            label="Requirements"
            isActive={pathname === '/requirements' || pathname.startsWith('/requirements/')}
            isCollapsed={isCollapsed}
            data-tour="requirements-nav"
          />
          <NavItem
            href="/obligations"
            icon={<Calendar size={16} />}
            label="Obligations"
            isActive={pathname === '/obligations' || pathname.startsWith('/obligations/')}
            isCollapsed={isCollapsed}
            data-tour="obligations-nav"
          />
          <NavItem
            href="/playbooks"
            icon={<BookOpen size={16} />}
            label="Playbooks"
            isActive={pathname === '/playbooks' || pathname.startsWith('/playbooks/')}
            isCollapsed={isCollapsed}
          />
        </NavGroup>

        {/* 🛡️ Control Environment */}
        <NavGroup
          icon={<Shield size={18} />}
          label="Control Environment"
          isCollapsed={isCollapsed}
          defaultOpen={true}
        >
          <NavItem
            href="/controls"
            icon={<Settings size={16} />}
            label="Controls"
            isActive={pathname === '/controls' || pathname.startsWith('/controls/')}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/tests"
            icon={<FlaskConical size={16} />}
            label="Tests"
            isActive={pathname === '/tests' || pathname.startsWith('/tests/')}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/evidence"
            icon={<Paperclip size={16} />}
            label="Evidence"
            isActive={pathname === '/evidence' || pathname.startsWith('/evidence/')}
            isCollapsed={isCollapsed}
          />
        </NavGroup>

        {/* ⚠️ Risk Management */}
        <NavGroup
          icon={<AlertTriangle size={18} />}
          label="Risk Management"
          isCollapsed={isCollapsed}
          defaultOpen={true}
        >
          <NavItem
            href="/risks"
            icon={<ShieldAlert size={16} />}
            label="Risk Register"
            isActive={pathname === '/risks' || pathname.startsWith('/risks/')}
            isCollapsed={isCollapsed}
          />
        </NavGroup>

        {/* 📚 Libraries */}
        <NavGroup
          icon={<Library size={18} />}
          label="Libraries"
          isCollapsed={isCollapsed}
          defaultOpen={false}
        >
          <NavItem
            href="/library/programs"
            icon={<BookOpen size={16} />}
            label="Program Templates"
            isActive={pathname === '/library/programs'}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/library/frameworks"
            icon={<Landmark size={16} />}
            label="Frameworks"
            isActive={pathname === '/library/frameworks'}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/library/policies"
            icon={<FileCheck size={16} />}
            label="Policies"
            isActive={pathname === '/library/policies'}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/library/risks"
            icon={<AlertTriangle size={16} />}
            label="Risks"
            isActive={pathname === '/library/risks'}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/library/assets"
            icon={<Package size={16} />}
            label="Assets"
            isActive={pathname === '/library/assets'}
            isCollapsed={isCollapsed}
          />
        </NavGroup>

        {/* 🛠️ Tools */}
        <NavGroup
          icon={<Sliders size={18} />}
          label="Tools"
          isCollapsed={isCollapsed}
          defaultOpen={pathname === '/builder' || pathname === '/setup-wizard'}
        >
          <NavItem
            href="/builder"
            icon={<Layers size={16} />}
            label="Visual Builder"
            isActive={pathname === '/builder'}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/setup-wizard"
            icon={<Compass size={16} />}
            label="Setup Wizard"
            isActive={pathname === '/setup-wizard'}
            isCollapsed={isCollapsed}
          />
        </NavGroup>

        {/* 🧭 Compliance Hubs */}
        {/* <NavGroup
          icon={<Compass size={18} />}
          label="Compliance Hubs"
          isCollapsed={isCollapsed}
          defaultOpen={false}
        >
          <NavItem
            href="/dpdp-hub"
            icon={<Shield size={16} />}
            label="DPDP Act 2023"
            isActive={pathname === '/dpdp-hub'}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/iso27001-hub"
            icon={<Shield size={16} />}
            label="ISO 27001:2022"
            isActive={pathname === '/iso27001-hub'}
            isCollapsed={isCollapsed}
          />
        </NavGroup> */}

        {/* Divider */}
        <div className="h-px bg-[var(--border)] my-3"></div>

        {/* ⚙️ Administration */}
        <NavGroup
          icon={<Settings size={18} />}
          label="Administration"
          isCollapsed={isCollapsed}
          defaultOpen={pathname.startsWith('/settings') || pathname.startsWith('/admin')}
        >
          <NavItem
            href="/admin"
            icon={<Settings size={16} />}
            label="Overview"
            isActive={pathname === '/admin'}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/settings/compliance-scoring"
            icon={<Calculator size={16} />}
            label="Compliance Scoring"
            isActive={pathname === '/settings/compliance-scoring'}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/admin/organization"
            icon={<Building2 size={16} />}
            label="Organization"
            isActive={pathname === '/admin/organization'}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/admin/users"
            icon={<Users size={16} />}
            label="Users & Roles"
            isActive={pathname === '/admin/users'}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/admin/integrations"
            icon={<GitBranch size={16} />}
            label="Integrations"
            isActive={pathname === '/admin/integrations'}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/admin/system"
            icon={<Sliders size={16} />}
            label="System Settings"
            isActive={pathname === '/admin/system'}
            isCollapsed={isCollapsed}
          />
        </NavGroup>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="flex-shrink-0 p-3 border-t border-[var(--border)] bg-[var(--sidebar-bg)]">
          <span className="text-xs text-[var(--foreground-muted)]">Ascent Compliance v1.0</span>
        </div>
      )}
    </aside>
  );
}

