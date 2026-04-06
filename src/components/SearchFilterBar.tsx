import { Search, Grid3X3, List, Layers } from 'lucide-react';
import clsx from 'clsx';

interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  viewMode?: string;
  onViewModeChange?: (mode: any) => void;
  formatLabel?: (option: string) => string;
  showHierarchyView?: boolean;
  'data-tour'?: string;
}

export default function SearchFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters,
  actions,
  viewMode,
  onViewModeChange,
  showHierarchyView = false,
  'data-tour': dataTour
}: SearchFilterBarProps) {
  return (
    <div className="mb-6 animate-fade-in-up delay-1" data-tour={dataTour}>
      <div className="flex items-center gap-4 mb-3">
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

        {/* View Mode Toggle */}
        {viewMode && onViewModeChange && (
          <div className="flex items-center gap-1 p-1 bg-[var(--background-secondary)] rounded-lg">
            <button
              onClick={() => onViewModeChange('grid')}
              className={clsx(
                'p-2 rounded-md transition-all',
                viewMode === 'grid'
                  ? 'bg-white text-[var(--primary)] shadow-sm'
                  : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
              )}
              title="Grid View"
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={clsx(
                'p-2 rounded-md transition-all',
                viewMode === 'list'
                  ? 'bg-white text-[var(--primary)] shadow-sm'
                  : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
              )}
              title="List View"
            >
              <List size={16} />
            </button>
            {showHierarchyView && (
              <button
                onClick={() => onViewModeChange('hierarchy')}
                className={clsx(
                  'p-2 rounded-md transition-all',
                  viewMode === 'hierarchy'
                    ? 'bg-white text-[var(--primary)] shadow-sm'
                    : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                )}
                title="Hierarchy View"
              >
                <Layers size={16} />
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        {actions && <div className="flex items-center gap-3 ml-auto">{actions}</div>}
      </div>

      {/* Filters - Wrapped in separate row */}
      {filters && <div className="flex items-center gap-3 flex-wrap">{filters}</div>}
    </div>
  );
}

interface FilterButtonGroupProps {
  options: readonly string[] | string[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  capitalize?: boolean;
  formatLabel?: (option: string) => string;
}

export function FilterButtonGroup({ options, value, onChange, label, capitalize = true, formatLabel }: FilterButtonGroupProps) {
  const getLabel = (option: string) => {
    if (formatLabel) return formatLabel(option);
    return capitalize ? option.charAt(0).toUpperCase() + option.slice(1) : option;
  };

  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-p3 font-medium text-[var(--foreground-muted)] whitespace-nowrap">
          {label}:
        </span>
      )}
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
            {getLabel(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

