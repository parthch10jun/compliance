'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, Library, ClipboardCheck, ShieldAlert,
  Landmark, AlertTriangle, FileCheck, Shield, FileText, BarChart3,
  Clipboard, ChevronDown, ChevronRight, ListTodo, PanelLeftClose, PanelLeft,
  FolderKanban, Settings, Calendar, CircleAlert, Users, Building2,
  FileStack, FlaskConical, Paperclip, GitBranch, Layers, CheckSquare,
  Package
} from 'lucide-react';
import clsx from 'clsx';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
}

function NavItem({ href, icon, label, isActive, isCollapsed }: NavItemProps) {
  return (
    <Link
      href={href}
      title={isCollapsed ? label : undefined}
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={clsx(
      "fixed left-0 top-16 bottom-0 bg-[var(--sidebar-bg)] border-r border-[var(--border)] flex flex-col transition-all duration-200",
      isCollapsed ? "w-16" : "w-60"
    )}>
      {/* Collapse Toggle */}
      <div className="flex justify-end p-2 flex-shrink-0 border-b border-[var(--border)]">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-[var(--sidebar-hover)] text-[var(--foreground-muted)] transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Scrollable Navigation */}
      <nav className="p-2 space-y-1 overflow-y-auto flex-1 scrollbar-thin">
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
        </NavGroup>

        {/* ✓ My Work */}
        <NavGroup
          icon={<CheckSquare size={18} />}
          label="My Work"
          isCollapsed={isCollapsed}
          defaultOpen={true}
        >
          <NavItem
            href="/tasks"
            icon={<ListTodo size={16} />}
            label="My Actions"
            isActive={pathname === '/tasks'}
            isCollapsed={isCollapsed}
          />
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
            label="Programs"
            isActive={pathname === '/programs' || pathname.startsWith('/programs/')}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/citations"
            icon={<FileStack size={16} />}
            label="Citations"
            isActive={pathname === '/citations' || pathname.startsWith('/citations/')}
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

        {/* 📚 Libraries */}
        <NavGroup
          icon={<Library size={18} />}
          label="Libraries"
          isCollapsed={isCollapsed}
          defaultOpen={false}
        >
          <NavItem
            href="/library/risks"
            icon={<AlertTriangle size={16} />}
            label="Risks"
            isActive={pathname === '/library/risks'}
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
            href="/library/assets"
            icon={<Package size={16} />}
            label="Assets"
            isActive={pathname === '/library/assets'}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/library/frameworks"
            icon={<Landmark size={16} />}
            label="Frameworks"
            isActive={pathname === '/library/frameworks'}
            isCollapsed={isCollapsed}
          />
        </NavGroup>

        {/* Divider */}
        <div className="h-px bg-[var(--border)] my-3"></div>

        {/* ⚙️ Administration */}
        <NavItem
          href="/admin"
          icon={<Settings size={18} />}
          label="Administration"
          isActive={pathname === '/admin' || pathname.startsWith('/admin/')}
          isCollapsed={isCollapsed}
        />
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[var(--border)] bg-[var(--sidebar-bg)]">
          <span className="text-xs text-[var(--foreground-muted)]">Ascent Compliance v1.0</span>
        </div>
      )}
    </aside>
  );
}

