'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import {
  Home, BarChart3, Building2, FolderKanban, FileStack, Shield,
  FlaskConical, Paperclip, ClipboardCheck, AlertCircle, CheckSquare,
  Library, FileText, Package, TrendingUp, Settings, Plus, Search,
  Keyboard, HelpCircle, BookOpen
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  href?: string;
  action?: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();

  const navigate = useCallback((href: string) => {
    router.push(href);
    onClose();
  }, [router, onClose]);

  // Navigation commands
  const navigationCommands: CommandItem[] = [
    { id: 'home', icon: <Home size={16} />, label: 'Go to Dashboard', shortcut: 'G H', href: '/' },
    { id: 'executive', icon: <BarChart3 size={16} />, label: 'Executive Dashboard', shortcut: 'G E', href: '/dashboard/executive' },
    { id: 'authorities', icon: <Building2 size={16} />, label: 'Authorities', shortcut: 'G A', href: '/authorities' },
    { id: 'programs', icon: <FolderKanban size={16} />, label: 'Programs', shortcut: 'G P', href: '/programs' },
    { id: 'citations', icon: <FileStack size={16} />, label: 'Citations', shortcut: 'G C', href: '/citations' },
    { id: 'controls', icon: <Shield size={16} />, label: 'Controls', shortcut: 'G O', href: '/controls' },
    { id: 'tests', icon: <FlaskConical size={16} />, label: 'Tests', shortcut: 'G T', href: '/tests' },
    { id: 'evidence', icon: <Paperclip size={16} />, label: 'Evidence', shortcut: 'G V', href: '/evidence' },
    { id: 'assessments', icon: <ClipboardCheck size={16} />, label: 'Assessments', href: '/assessments' },
    { id: 'issues', icon: <AlertCircle size={16} />, label: 'Issues', shortcut: 'G I', href: '/issues' },
    { id: 'tasks', icon: <CheckSquare size={16} />, label: 'Tasks', href: '/tasks' },
    { id: 'compliance', icon: <TrendingUp size={16} />, label: 'Compliance Status', href: '/compliance/status' },
  ];

  // Library commands
  const libraryCommands: CommandItem[] = [
    { id: 'programs', icon: <BookOpen size={16} />, label: 'Program Templates', href: '/library/programs' },
    { id: 'frameworks', icon: <Library size={16} />, label: 'Frameworks Library', href: '/library/frameworks' },
    { id: 'policies', icon: <FileText size={16} />, label: 'Policies Library', href: '/library/policies' },
    { id: 'risks', icon: <TrendingUp size={16} />, label: 'Risks Library', href: '/library/risks' },
    { id: 'assets', icon: <Package size={16} />, label: 'Assets Library', href: '/library/assets' },
  ];

  // Action commands
  const actionCommands: CommandItem[] = [
    { id: 'new-control', icon: <Plus size={16} />, label: 'Create New Control', action: () => navigate('/controls?action=new') },
    { id: 'new-test', icon: <Plus size={16} />, label: 'Create New Test', action: () => navigate('/tests?action=new') },
    { id: 'new-evidence', icon: <Plus size={16} />, label: 'Upload Evidence', action: () => navigate('/evidence?action=new') },
    { id: 'new-issue', icon: <Plus size={16} />, label: 'Report Issue', action: () => navigate('/issues?action=new') },
    { id: 'settings', icon: <Settings size={16} />, label: 'Open Settings', shortcut: 'G S', href: '/admin' },
  ];

  // Help commands
  const helpCommands: CommandItem[] = [
    { id: 'shortcuts', icon: <Keyboard size={16} />, label: 'Keyboard Shortcuts', shortcut: '?' },
    { id: 'help', icon: <HelpCircle size={16} />, label: 'Help & Documentation' },
  ];

  const handleSelect = useCallback((item: CommandItem) => {
    if (item.href) {
      navigate(item.href);
    } else if (item.action) {
      item.action();
    }
    onClose();
  }, [navigate, onClose]);

  // Handle escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[12vh]"
      onClick={onClose}
    >
      <Command
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[var(--border)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--border)]">
          <Search size={20} className="text-[var(--foreground-muted)]" />
          <Command.Input
            placeholder="Search commands, pages, or type '>' for actions..."
            className="flex-1 bg-transparent outline-none text-base text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]"
            autoFocus
          />
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground-muted)] font-medium">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <Command.List className="max-h-[400px] overflow-y-auto p-2">
          <Command.Empty className="py-8 text-center text-sm text-[var(--foreground-muted)]">
            No results found. Try a different search term.
          </Command.Empty>

          {/* Navigation */}
          <Command.Group heading="Navigation" className="pb-2">
            {navigationCommands.map((item) => (
              <Command.Item
                key={item.id}
                value={item.label}
                onSelect={() => handleSelect(item)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-[var(--foreground)] hover:bg-[var(--primary-lightest)] hover:text-[var(--primary)] data-[selected=true]:bg-[var(--primary-lightest)] data-[selected=true]:text-[var(--primary)] transition-colors"
              >
                <span className="text-[var(--foreground-muted)] group-hover:text-[var(--primary)]">
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <kbd className="px-2 py-0.5 bg-[var(--background-secondary)] border border-[var(--border)] rounded text-xs text-[var(--foreground-muted)] font-mono">
                    {item.shortcut}
                  </kbd>
                )}
              </Command.Item>
            ))}
          </Command.Group>

          {/* Library */}
          <Command.Group heading="Library" className="pb-2">
            {libraryCommands.map((item) => (
              <Command.Item
                key={item.id}
                value={item.label}
                onSelect={() => handleSelect(item)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-[var(--foreground)] hover:bg-[var(--primary-lightest)] hover:text-[var(--primary)] data-[selected=true]:bg-[var(--primary-lightest)] data-[selected=true]:text-[var(--primary)] transition-colors"
              >
                <span className="text-[var(--foreground-muted)]">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
              </Command.Item>
            ))}
          </Command.Group>

          {/* Actions */}
          <Command.Group heading="Quick Actions" className="pb-2">
            {actionCommands.map((item) => (
              <Command.Item
                key={item.id}
                value={item.label}
                onSelect={() => handleSelect(item)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-[var(--foreground)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] data-[selected=true]:bg-[var(--accent-light)] data-[selected=true]:text-[var(--accent)] transition-colors"
              >
                <span className="text-[var(--accent)]">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <kbd className="px-2 py-0.5 bg-[var(--background-secondary)] border border-[var(--border)] rounded text-xs text-[var(--foreground-muted)] font-mono">
                    {item.shortcut}
                  </kbd>
                )}
              </Command.Item>
            ))}
          </Command.Group>

          {/* Help */}
          <Command.Group heading="Help" className="pb-2">
            {helpCommands.map((item) => (
              <Command.Item
                key={item.id}
                value={item.label}
                onSelect={() => handleSelect(item)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-[var(--foreground)] hover:bg-[var(--background-secondary)] data-[selected=true]:bg-[var(--background-secondary)] transition-colors"
              >
                <span className="text-[var(--foreground-muted)]">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <kbd className="px-2 py-0.5 bg-[var(--background-secondary)] border border-[var(--border)] rounded text-xs text-[var(--foreground-muted)] font-mono">
                    {item.shortcut}
                  </kbd>
                )}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)] bg-[var(--background-secondary)]">
          <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)]">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-[var(--border)] rounded text-[10px] font-mono">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-[var(--border)] rounded text-[10px] font-mono">↵</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-[var(--border)] rounded text-[10px] font-mono">ESC</kbd>
              Close
            </span>
          </div>
          <span className="text-xs text-[var(--foreground-muted)]">
            <kbd className="px-1.5 py-0.5 bg-white border border-[var(--border)] rounded text-[10px] font-mono mr-1">⌘K</kbd>
            to open anytime
          </span>
        </div>
      </Command>
    </div>
  );
}

