import { Search } from 'lucide-react';
import clsx from 'clsx';

interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}

export default function SearchFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters,
  actions
}: SearchFilterBarProps) {
  return (
    <div className="flex items-center gap-4 mb-6 animate-fade-in-up delay-1">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 border border-[var(--border)] rounded-xl text-p2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-lighter)] focus:border-transparent search-input transition-all"
        />
      </div>

      {/* Filters */}
      {filters && <div className="flex items-center gap-3">{filters}</div>}

      {/* Actions */}
      {actions && <div className="flex items-center gap-3 ml-auto">{actions}</div>}
    </div>
  );
}

interface FilterButtonGroupProps {
  options: readonly string[] | string[];
  value: string;
  onChange: (value: string) => void;
  capitalize?: boolean;
}

export function FilterButtonGroup({ options, value, onChange, capitalize = true }: FilterButtonGroupProps) {
  return (
    <div className="filter-group">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={clsx(
            'filter-btn',
            value === option ? 'filter-btn-active' : 'filter-btn-inactive'
          )}
        >
          {capitalize ? option.charAt(0).toUpperCase() + option.slice(1) : option}
        </button>
      ))}
    </div>
  );
}

