'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell, Settings, User, Zap, Home,
  BarChart3, CheckSquare, BookOpen, Shield, AlertTriangle,
  Library as LibraryIcon, ChevronDown, ChevronRight, Building2,
  FolderKanban, FlaskConical, Paperclip, AlertCircle,
  Package, FileCheck, TrendingUp, FileText, Calendar
} from 'lucide-react';
import clsx from 'clsx';

interface TopBarProps {
  onCommandPaletteOpen: () => void;
}

export default function TopBar({ onCommandPaletteOpen }: TopBarProps) {
  const [showQuickAccess, setShowQuickAccess] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const pathname = usePathname();

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-[var(--border)] z-40">
        <div className="h-full max-w-[1800px] mx-auto px-6 flex items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-base">A</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-lg text-[var(--foreground)] tracking-tight">Ascent</span>
            <span className="text-xs text-[var(--foreground-muted)] ml-2">Compliance</span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Right Icons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Home Button */}
          <Link
            href="/"
            className={clsx(
              "p-2.5 rounded-xl transition-all duration-200",
              pathname === '/'
                ? "bg-[var(--primary-lightest)] text-[var(--primary)]"
                : "hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:text-[var(--primary)]"
            )}
            title="Home Dashboard"
          >
            <Home size={20} />
          </Link>

          {/* Quick Access Button */}
          <button
            data-tour="command-palette"
            onClick={() => setShowQuickAccess(!showQuickAccess)}
            className={clsx(
              "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200",
              showQuickAccess
                ? "bg-[var(--primary)] text-white shadow-md"
                : "bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:bg-[var(--primary-lightest)] hover:text-[var(--primary)]"
            )}
            title="Quick Access"
          >
            <Zap size={18} />
            <span className="text-p2 font-medium hidden sm:inline">Quick Access</span>
          </button>

          <button className="p-2.5 rounded-xl hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-all duration-200 relative" title="Notifications">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--error)] rounded-full ring-2 ring-white"></span>
          </button>
          <button className="p-2.5 rounded-xl hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-all duration-200" title="Settings">
            <Settings size={20} />
          </button>
          <div className="w-px h-6 bg-[var(--border)] mx-1"></div>
          <button className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-white shadow-sm hover:shadow-md transition-all duration-200" title="User Profile">
            <User size={18} />
          </button>
        </div>
      </div>
    </header>

      {/* Quick Access Dropdown Panel */}
      {showQuickAccess && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            onClick={() => setShowQuickAccess(false)}
          />

          {/* Quick Access Panel */}
          <div className="fixed top-16 right-6 w-80 bg-white border border-[var(--border)] rounded-xl shadow-2xl z-40 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-h4 font-bold text-[var(--foreground)]">Quick Access</h3>
                <button
                  onClick={() => setShowQuickAccess(false)}
                  className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1">
                {/* Dashboard */}
                <Link
                  href="/"
                  onClick={() => setShowQuickAccess(false)}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-p2 transition-all',
                    pathname === '/'
                      ? 'bg-[var(--primary-lightest)] text-[var(--primary)] font-medium'
                      : 'text-[var(--foreground)] hover:bg-[var(--background-secondary)]'
                  )}
                >
                  <BarChart3 size={18} />
                  <span className="flex-1">Dashboard</span>
                  <span className="text-p3 text-[var(--foreground-muted)]">Status at a glance</span>
                </Link>

                {/* My Work - Most Accessed */}
                <Link
                  href="/tasks"
                  onClick={() => setShowQuickAccess(false)}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-p2 transition-all',
                    pathname === '/tasks'
                      ? 'bg-[var(--primary-lightest)] text-[var(--primary)] font-medium'
                      : 'text-[var(--foreground)] hover:bg-[var(--background-secondary)]'
                  )}
                >
                  <CheckSquare size={18} />
                  <span className="flex-1">My Work</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[var(--error)] text-white text-xs font-medium rounded-full">12</span>
                    <span className="text-p3 text-[var(--foreground-muted)]">MOST ACCESSED</span>
                  </div>
                </Link>

                {/* Compliance */}
                <div>
                  <button
                    onClick={() => toggleSection('compliance')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-p2 text-[var(--foreground)] hover:bg-[var(--background-secondary)] w-full transition-all"
                  >
                    <BookOpen size={18} />
                    <span className="flex-1 text-left font-medium">Compliance</span>
                    {expandedSections.includes('compliance') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  {expandedSections.includes('compliance') && (
                    <div className="ml-6 mt-1 space-y-0.5 border-l-2 border-[var(--border)] pl-3">
                      <Link
                        href="/compliance/status"
                        onClick={() => setShowQuickAccess(false)}
                        className={clsx(
                          'flex items-center gap-2 px-3 py-2 rounded-lg text-p2 transition-all',
                          pathname === '/compliance/status'
                            ? 'bg-[var(--primary-lightest)] text-[var(--primary)] font-medium'
                            : 'text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]'
                        )}
                      >
                        <TrendingUp size={16} />
                        <span>Status</span>
                      </Link>
                      <Link
                        href="/authorities"
                        onClick={() => setShowQuickAccess(false)}
                        className={clsx(
                          'flex items-center gap-2 px-3 py-2 rounded-lg text-p2 transition-all',
                          pathname.startsWith('/authorities')
                            ? 'bg-[var(--primary-lightest)] text-[var(--primary)] font-medium'
                            : 'text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]'
                        )}
                      >
                        <Building2 size={16} />
                        <span>Authorities</span>
                      </Link>
                      <Link
                        href="/programs"
                        onClick={() => setShowQuickAccess(false)}
                        className={clsx(
                          'flex items-center gap-2 px-3 py-2 rounded-lg text-p2 transition-all',
                          pathname.startsWith('/programs')
                            ? 'bg-[var(--primary-lightest)] text-[var(--primary)] font-medium'
                            : 'text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]'
                        )}
                      >
                        <FolderKanban size={16} />
                        <span>Programs</span>
                      </Link>
                      <Link
                        href="/requirements"
                        onClick={() => setShowQuickAccess(false)}
                        className={clsx(
                          'flex items-center gap-2 px-3 py-2 rounded-lg text-p2 transition-all',
                          pathname.startsWith('/requirements')
                            ? 'bg-[var(--primary-lightest)] text-[var(--primary)] font-medium'
                            : 'text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]'
                        )}
                      >
                        <FileText size={16} />
                        <span>Requirements</span>
                      </Link>
                      <Link
                        href="/obligations"
                        onClick={() => setShowQuickAccess(false)}
                        className={clsx(
                          'flex items-center gap-2 px-3 py-2 rounded-lg text-p2 transition-all',
                          pathname.startsWith('/obligations')
                            ? 'bg-[var(--primary-lightest)] text-[var(--primary)] font-medium'
                            : 'text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]'
                        )}
                      >
                        <Calendar size={16} />
                        <span>Obligations</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div>
                  <button
                    onClick={() => toggleSection('controls')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-p2 text-[var(--foreground)] hover:bg-[var(--background-secondary)] w-full transition-all"
                  >
                    <Shield size={18} />
                    <span className="flex-1 text-left font-medium">Controls</span>
                    {expandedSections.includes('controls') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  {expandedSections.includes('controls') && (
                    <div className="ml-6 mt-1 space-y-0.5 border-l-2 border-[var(--border)] pl-3">
                      <Link
                        href="/controls?filter=my"
                        onClick={() => setShowQuickAccess(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-p2 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)] transition-all"
                      >
                        <Shield size={16} />
                        <span>My Controls</span>
                      </Link>
                      <Link
                        href="/controls"
                        onClick={() => setShowQuickAccess(false)}
                        className={clsx(
                          'flex items-center gap-2 px-3 py-2 rounded-lg text-p2 transition-all',
                          pathname === '/controls'
                            ? 'bg-[var(--primary-lightest)] text-[var(--primary)] font-medium'
                            : 'text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]'
                        )}
                      >
                        <Shield size={16} />
                        <span>All Controls</span>
                      </Link>
                      <Link
                        href="/tests"
                        onClick={() => setShowQuickAccess(false)}
                        className={clsx(
                          'flex items-center gap-2 px-3 py-2 rounded-lg text-p2 transition-all',
                          pathname.startsWith('/tests')
                            ? 'bg-[var(--primary-lightest)] text-[var(--primary)] font-medium'
                            : 'text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]'
                        )}
                      >
                        <FlaskConical size={16} />
                        <span>Tests</span>
                      </Link>
                      <Link
                        href="/evidence"
                        onClick={() => setShowQuickAccess(false)}
                        className={clsx(
                          'flex items-center gap-2 px-3 py-2 rounded-lg text-p2 transition-all',
                          pathname.startsWith('/evidence')
                            ? 'bg-[var(--primary-lightest)] text-[var(--primary)] font-medium'
                            : 'text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]'
                        )}
                      >
                        <Paperclip size={16} />
                        <span>Evidence</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Risks */}
                <Link
                  href="/risks"
                  onClick={() => setShowQuickAccess(false)}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-p2 transition-all',
                    pathname === '/risks' || pathname.startsWith('/risks/')
                      ? 'bg-[var(--primary-lightest)] text-[var(--primary)] font-medium'
                      : 'text-[var(--foreground)] hover:bg-[var(--background-secondary)]'
                  )}
                >
                  <AlertTriangle size={18} />
                  <span className="flex-1">Risk Register</span>
                </Link>

                {/* Issues */}
                <Link
                  href="/issues"
                  onClick={() => setShowQuickAccess(false)}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-p2 transition-all',
                    pathname === '/issues'
                      ? 'bg-[var(--primary-lightest)] text-[var(--primary)] font-medium'
                      : 'text-[var(--foreground)] hover:bg-[var(--background-secondary)]'
                  )}
                >
                  <AlertCircle size={18} />
                  <span className="flex-1">Issues</span>
                  <span className="px-2 py-0.5 bg-[var(--error)] text-white text-xs font-medium rounded-full">8</span>
                </Link>

                {/* Library */}
                <div>
                  <button
                    onClick={() => toggleSection('library')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-p2 text-[var(--foreground)] hover:bg-[var(--background-secondary)] w-full transition-all"
                  >
                    <LibraryIcon size={18} />
                    <span className="flex-1 text-left font-medium">Library</span>
                    {expandedSections.includes('library') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  {expandedSections.includes('library') && (
                    <div className="ml-6 mt-1 space-y-0.5 border-l-2 border-[var(--border)] pl-3">
                      <Link
                        href="/library/risks"
                        onClick={() => setShowQuickAccess(false)}
                        className={clsx(
                          'flex items-center gap-2 px-3 py-2 rounded-lg text-p2 transition-all',
                          pathname === '/library/risks'
                            ? 'bg-[var(--primary-lightest)] text-[var(--primary)] font-medium'
                            : 'text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]'
                        )}
                      >
                        <AlertCircle size={16} />
                        <span>Risks</span>
                      </Link>
                      <Link
                        href="/library/policies"
                        onClick={() => setShowQuickAccess(false)}
                        className={clsx(
                          'flex items-center gap-2 px-3 py-2 rounded-lg text-p2 transition-all',
                          pathname === '/library/policies'
                            ? 'bg-[var(--primary-lightest)] text-[var(--primary)] font-medium'
                            : 'text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]'
                        )}
                      >
                        <FileCheck size={16} />
                        <span>Policies</span>
                      </Link>
                      <Link
                        href="/library/assets"
                        onClick={() => setShowQuickAccess(false)}
                        className={clsx(
                          'flex items-center gap-2 px-3 py-2 rounded-lg text-p2 transition-all',
                          pathname === '/library/assets'
                            ? 'bg-[var(--primary-lightest)] text-[var(--primary)] font-medium'
                            : 'text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]'
                        )}
                      >
                        <Package size={16} />
                        <span>Assets</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Settings - Admin Only */}
                <Link
                  href="/admin"
                  onClick={() => setShowQuickAccess(false)}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-p2 transition-all',
                    pathname.startsWith('/admin')
                      ? 'bg-[var(--primary-lightest)] text-[var(--primary)] font-medium'
                      : 'text-[var(--foreground)] hover:bg-[var(--background-secondary)]'
                  )}
                >
                  <Settings size={18} />
                  <span className="flex-1">Settings</span>
                  <span className="text-p3 text-[var(--foreground-muted)]">Admin only</span>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

