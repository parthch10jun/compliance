'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Settings, User, Search, Home } from 'lucide-react';
import clsx from 'clsx';

export default function ERMTopBar() {
  const pathname = usePathname();

  return (
    <header className="h-16 bg-white border-b border-[var(--border)] flex items-center justify-between px-6">
      {/* Left Spacer */}
      <div className="flex-1"></div>

      {/* Search Bar - Centered */}
      <div className="flex-1 max-w-lg mx-auto">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
          <input
            type="text"
            placeholder="Search risks, assessments..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-p2 text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-white border border-[var(--border)] rounded text-xs text-[var(--foreground-muted)] font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1 flex-1 justify-end">
        <Link
          href="/erm"
          className={clsx(
            "p-2 rounded-lg transition-colors",
            pathname === '/erm'
              ? "bg-indigo-50 text-indigo-600"
              : "hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          )}
          title="Home"
        >
          <Home size={18} />
        </Link>

        <button
          className="p-2 rounded-lg hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors relative"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
        </button>

        <button
          className="p-2 rounded-lg hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          title="Settings"
        >
          <Settings size={18} />
        </button>

        <div className="w-px h-5 bg-[var(--border)] mx-2"></div>

        <button
          className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold hover:shadow-md transition-shadow"
          title="Profile"
        >
          JD
        </button>
      </div>
    </header>
  );
}
