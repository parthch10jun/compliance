'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, Shield, CheckSquare, AlertTriangle,
  Library, Settings, Bell, User, Search, Zap
} from 'lucide-react';
import clsx from 'clsx';

interface TopNavProps {
  onCommandPaletteOpen: () => void;
}

export type NavSection = 'dashboard' | 'compliance' | 'controls' | 'my-work' | 'issues' | 'library' | 'admin';

interface NavTab {
  id: NavSection;
  label: string;
  icon: React.ReactNode;
  href: string;
  matchPaths: string[];
}

const navTabs: NavTab[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
    href: '/',
    matchPaths: ['/', '/dashboard']
  },
  {
    id: 'compliance',
    label: 'Compliance',
    icon: <BookOpen size={18} />,
    href: '/authorities',
    matchPaths: ['/authorities', '/programs', '/citations', '/compliance']
  },
  {
    id: 'controls',
    label: 'Controls',
    icon: <Shield size={18} />,
    href: '/controls',
    matchPaths: ['/controls', '/tests', '/evidence']
  },
  {
    id: 'my-work',
    label: 'My Work',
    icon: <CheckSquare size={18} />,
    href: '/tasks',
    matchPaths: ['/tasks', '/assessments']
  },
  {
    id: 'issues',
    label: 'Issues',
    icon: <AlertTriangle size={18} />,
    href: '/issues',
    matchPaths: ['/issues']
  },
  {
    id: 'library',
    label: 'Library',
    icon: <Library size={18} />,
    href: '/library',
    matchPaths: ['/library']
  },
];

export default function TopNav({ onCommandPaletteOpen }: TopNavProps) {
  const pathname = usePathname();

  // Determine active tab based on current path
  const getActiveTab = (): NavSection => {
    for (const tab of navTabs) {
      if (tab.matchPaths.some(path => pathname === path || pathname.startsWith(path + '/'))) {
        return tab.id;
      }
    }
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-md border-b border-[var(--border)] z-50">
      <div className="h-full max-w-[1920px] mx-auto px-6 flex items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-base text-[var(--foreground)] tracking-tight">Ascent</span>
            <span className="text-xs text-[var(--foreground-muted)] ml-1.5">Compliance</span>
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <nav className="flex items-center gap-1 flex-1 max-w-3xl">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-[var(--primary)] text-white shadow-sm'
                    : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)]'
                )}
              >
                {tab.icon}
                <span className="hidden md:inline">{tab.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Command Palette Button */}
          <button
            onClick={onCommandPaletteOpen}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--background-secondary)] hover:bg-[var(--primary-lightest)] text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-all duration-200 border border-[var(--border)]"
            title="Search (⌘K)"
          >
            <Search size={16} />
            <span className="hidden lg:inline text-xs">Search</span>
            <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-[var(--border)] rounded text-[10px] font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Quick Actions */}
          <button
            className="p-2 rounded-lg hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-all duration-200"
            title="Quick Actions"
          >
            <Zap size={18} />
          </button>

          {/* Notifications */}
          <button
            className="p-2 rounded-lg hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-all duration-200 relative"
            title="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--error)] rounded-full ring-2 ring-white"></span>
          </button>

          {/* Settings */}
          <Link
            href="/admin"
            className="p-2 rounded-lg hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-all duration-200"
            title="Settings"
          >
            <Settings size={18} />
          </Link>

          <div className="w-px h-6 bg-[var(--border)] mx-1"></div>

          {/* User Profile */}
          <button
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-white shadow-sm hover:shadow-md transition-all duration-200"
            title="User Profile"
          >
            <User size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}

