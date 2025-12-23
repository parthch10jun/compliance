'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Home, Inbox, Calendar, Hash, Settings, Library, X } from 'lucide-react';
import clsx from 'clsx';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  category: 'recent' | 'navigation' | 'actions';
  shortcut?: string;
}

const commands: CommandItem[] = [
  { id: 'home', icon: <Home size={18} />, label: 'Go to Home', category: 'navigation', shortcut: 'G then H' },
  { id: 'inbox', icon: <Inbox size={18} />, label: 'Go to Inbox', category: 'navigation', shortcut: 'G then I' },
  { id: 'today', icon: <Calendar size={18} />, label: 'Go to Today', category: 'navigation', shortcut: 'G then T' },
  { id: 'library', icon: <Library size={18} />, label: 'Go to Library', category: 'navigation', shortcut: 'G then L' },
  { id: 'settings', icon: <Settings size={18} />, label: 'Open Settings', category: 'actions', shortcut: 'G then S' },
  { id: 'cbuae', icon: <Hash size={18} />, label: 'CBUAE', category: 'recent' },
  { id: 'sca', icon: <Hash size={18} />, label: 'SCA', category: 'recent' },
  { id: 'dfsa', icon: <Hash size={18} />, label: 'DFSA', category: 'recent' },
];

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const recentItems = filteredCommands.filter(c => c.category === 'recent');
  const navItems = filteredCommands.filter(c => c.category === 'navigation');
  const actionItems = filteredCommands.filter(c => c.category === 'actions');

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      // Handle command execution
      onClose();
    }
  }, [filteredCommands, selectedIndex, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const renderSection = (title: string, items: CommandItem[], startIndex: number) => {
    if (items.length === 0) return null;
    return (
      <div className="py-2">
        <div className="px-3 py-1 text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wide">
          {title}
        </div>
        {items.map((item, idx) => {
          const globalIdx = startIndex + idx;
          return (
            <button
              key={item.id}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors',
                globalIdx === selectedIndex
                  ? 'bg-[var(--primary-lightest)] text-[var(--primary)]'
                  : 'text-[var(--foreground)] hover:bg-[var(--background-secondary)]'
              )}
              onClick={onClose}
            >
              <span className={clsx(globalIdx === selectedIndex ? 'text-[var(--primary)]' : 'text-[var(--foreground-muted)]')}>
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.shortcut && (
                <span className="text-xs text-[var(--foreground-muted)]">{item.shortcut}</span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 command-overlay flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[var(--border)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <Search size={18} className="text-[var(--foreground-muted)]" />
          <input
            type="text"
            placeholder="Search or type a command..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent outline-none text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]"
          />
          <button onClick={onClose} className="p-1 hover:bg-[var(--background-secondary)] rounded">
            <X size={16} className="text-[var(--foreground-muted)]" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {renderSection('Recently Viewed', recentItems, 0)}
          {renderSection('Navigation', navItems, recentItems.length)}
          {renderSection('Actions', actionItems, recentItems.length + navItems.length)}
          
          {filteredCommands.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-[var(--foreground-muted)]">
              No results found for &quot;{query}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

