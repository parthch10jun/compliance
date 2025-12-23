# Typography System & Design Guidelines

## Typography Hierarchy

This application uses a standardized typography scale defined in `src/app/globals.css`:

### Typography Scale

| Class | Size | Use Case | Font Weight |
|-------|------|----------|-------------|
| `.text-title` | 36px (2.25rem) | Page titles, hero headings | Bold (700) |
| `.text-h1` | 30px (1.875rem) | Major section headings | Semibold (600) |
| `.text-h2` | 24px (1.5rem) | Section headings, card titles | Semibold (600) |
| `.text-h3` | 20px (1.25rem) | Subsection headings | Medium (500) |
| `.text-h4` | 18px (1.125rem) | Card titles, minor headings | Medium (500) |
| `.text-p1` | 16px (1rem) | Body text, primary content | Normal (400) |
| `.text-p2` | 14px (0.875rem) | Secondary text, descriptions | Normal (400) |
| `.text-p3` | 12px (0.75rem) | Labels, captions, metadata | Normal (400) |

### Usage Guidelines

#### Page Headers
- **Page Title**: Use `.text-h1` (30px, semibold)
- **Page Description**: Use `.text-p2` (14px, normal)
- **Breadcrumbs**: Use `.text-p3` (12px, normal)

#### Cards & Metrics
- **Card Title**: Use `.text-h4` (18px, medium)
- **Metric Value**: Use `.text-h2` (24px, semibold/bold)
- **Metric Label**: Use `.text-p3` (12px, medium)
- **Card Description**: Use `.text-p3` (12px, normal)

#### Tables
- **Table Headers**: Use `.text-p3` (12px, semibold, uppercase)
- **Table Cell Content**: Use `.text-p2` (14px, normal)
- **Table Cell Labels**: Use `.text-p3` (12px, normal)

#### Buttons & Controls
- **Primary Buttons**: Use `.text-p2` (14px, medium)
- **Secondary Buttons**: Use `.text-p2` (14px, normal)
- **Filter Buttons**: Use `.text-p2` (14px, medium)

#### Forms
- **Input Labels**: Use `.text-p2` (14px, medium)
- **Input Placeholder**: Use `.text-p2` (14px, normal)
- **Helper Text**: Use `.text-p3` (12px, normal)

## Component Standards

### PageHeader Component
Use the `PageHeader` component for consistent page headers:

```tsx
<PageHeader
  title="Page Title"
  description="Optional description"
  breadcrumbs={[
    { label: 'Dashboard', href: '/' },
    { label: 'Current Page' }
  ]}
  action={<button>Action Button</button>}
/>
```

### SearchFilterBar Component
Use the `SearchFilterBar` component for search and filter controls:

```tsx
<SearchFilterBar
  searchValue={searchQuery}
  onSearchChange={setSearchQuery}
  searchPlaceholder="Search..."
  filters={<FilterButtonGroup options={...} value={...} onChange={...} />}
  actions={<button>Action</button>}
/>
```

### FilterButtonGroup Component
Use for filter button groups:

```tsx
<FilterButtonGroup
  options={['all', 'option1', 'option2']}
  value={currentValue}
  onChange={setValue}
  capitalize={true}
/>
```

## Design Principles

### Spacing
- **Page padding**: 32px (p-8)
- **Section spacing**: 32px (mb-8)
- **Card padding**: 20-24px (p-5, p-6)
- **Element gaps**: 12-16px (gap-3, gap-4)

### Border Radius
- **Cards**: 12px (rounded-xl)
- **Buttons**: 12px (rounded-xl)
- **Inputs**: 12px (rounded-xl)
- **Small elements**: 8px (rounded-lg)

### Shadows
- **Cards (hover)**: `shadow-md`
- **Buttons (hover)**: `shadow-md`
- **Elevated elements**: `shadow-sm`

### Transitions
- **Standard duration**: 200ms
- **Easing**: ease, ease-out, ease-in-out
- **Properties**: all, colors, transform, shadow

## Color Usage

### Text Colors
- **Primary text**: `var(--foreground)` - #0f172a
- **Secondary text**: `var(--foreground-secondary)` - #334155
- **Muted text**: `var(--foreground-muted)` - #64748b
- **Light text**: `var(--foreground-light)` - #94a3b8

### Status Colors
- **Success**: Green (#059669)
- **Warning**: Amber (#d97706)
- **Error**: Red (#dc2626)
- **Info**: Primary Teal (#0d9488)

## Consistency Rules

1. **All page titles** should use `text-h1` (30px)
2. **All metric values** should use `text-h2` (24px)
3. **All metric labels** should use `text-p3` (12px)
4. **All table headers** should use `text-p3` uppercase
5. **All descriptions** should use `text-p2` (14px)
6. **All buttons** should use `text-p2` (14px)
7. **All cards** should have `rounded-xl` and `hover:shadow-md`
8. **All inputs** should have `rounded-xl` and focus ring

