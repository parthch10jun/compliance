'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import CommandPalette from './CommandPalette';
import Breadcrumbs from './Breadcrumbs';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import clsx from 'clsx';

interface ShellProps {
  children: React.ReactNode;
}

function ShellContent({ children }: ShellProps) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [pendingNavKey, setPendingNavKey] = useState<string | null>(null);
  const router = useRouter();
  const { isCollapsed } = useSidebar();

  // Navigation shortcuts mapping
  const navShortcuts: Record<string, string> = {
    'h': '/',
    'e': '/dashboard/executive',
    'a': '/authorities',
    'p': '/programs',
    'c': '/citations',
    'o': '/controls',
    't': '/tests',
    'v': '/evidence',
    'i': '/issues',
    's': '/admin',
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if user is typing in an input
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    // Open command palette with Cmd+K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setCommandPaletteOpen(true);
      return;
    }

    // Open command palette with / (forward slash)
    if (e.key === '/') {
      e.preventDefault();
      setCommandPaletteOpen(true);
      return;
    }

    // Handle 'G' key for navigation sequences (G then H = Home, etc.)
    if (e.key === 'g' || e.key === 'G') {
      e.preventDefault();
      setPendingNavKey('g');
      // Clear pending key after 1.5 seconds
      setTimeout(() => setPendingNavKey(null), 1500);
      return;
    }

    // If we have a pending 'g' key, check for navigation shortcut
    if (pendingNavKey === 'g') {
      const key = e.key.toLowerCase();
      if (navShortcuts[key]) {
        e.preventDefault();
        router.push(navShortcuts[key]);
        setPendingNavKey(null);
        return;
      }
      setPendingNavKey(null);
    }
  }, [pendingNavKey, router, navShortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <TopBar onCommandPaletteOpen={() => setCommandPaletteOpen(true)} />
      <Sidebar />

      {/* Main Content Area - Responds to sidebar collapse */}
      <main className={clsx(
        "pt-16 min-h-screen transition-all duration-200",
        isCollapsed ? "ml-16" : "ml-60"
      )}>
        <div className="px-8 pt-4 pb-8">
          <Breadcrumbs />
          {children}
        </div>
      </main>

      {/* Pending Navigation Key Indicator */}
      {pendingNavKey && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--foreground)] text-white rounded-lg shadow-lg">
            <kbd className="px-2 py-0.5 bg-white/20 rounded text-sm font-mono">G</kbd>
            <span className="text-sm">then...</span>
            <span className="text-xs text-white/60 ml-2">H:Home A:Auth P:Prog C:Cite O:Ctrl T:Test</span>
          </div>
        </div>
      )}

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}

// Wrapper component that provides the sidebar context
export default function Shell({ children }: ShellProps) {
  return (
    <SidebarProvider>
      <ShellContent>{children}</ShellContent>
    </SidebarProvider>
  );
}

