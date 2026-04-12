# 🎨 Base UI Components Reference

> **Part 2: Buttons, Badges, Spacing, Icons, and Templates**

---

## 🔘 **Button Styles**

### **Primary Button:**
```tsx
<button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-dark)] transition-all duration-200 text-p2 font-medium shadow-sm hover:shadow-md">
  <Plus size={18} />
  Button Text
</button>
```
**Specs:** Padding `16px h, 10px v`, Background primary→dark on hover, Icon `18px`, Shadow sm→md

### **Secondary Button:**
```tsx
<button className="px-4 py-2.5 bg-white border border-[var(--border)] text-[var(--foreground)] rounded-xl hover:bg-[var(--background-secondary)] transition-colors text-p2 font-medium">
  Button Text
</button>
```

### **Icon Button:**
```tsx
<button className="p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
  <MoreVertical size={18} />
</button>
```
**Size:** `32px` square

---

## 🏷️ **Badge Styles**

### **Status Badge:**
```tsx
<span className="px-2 py-0.5 rounded text-p3 font-medium uppercase tracking-wide bg-green-100 text-green-700 border border-green-200">
  ACTIVE
</span>
```

### **Icon Badge:**
```tsx
<div className="w-10 h-10 rounded-lg flex items-center justify-center border bg-blue-100 text-blue-700 border-blue-200">
  <Icon size={20} />
</div>
```

### **Count Badge:**
```tsx
<span className="px-1.5 py-0.5 bg-[var(--error)] text-white text-p3 font-medium rounded-full min-w-[20px] text-center">
  12
</span>
```

---

## 📏 **Spacing Reference**

```css
/* Gaps */
gap-2  → 8px   (filter buttons, stat grids)
gap-3  → 12px  (icon + text)
gap-4  → 16px  (main grids)
gap-6  → 24px  (large sections)

/* Padding */
p-2    → 8px   (icon buttons)
p-5    → 20px  (cards)
px-4   → 16px  (buttons)
px-6   → 24px  (table cells)
py-2.5 → 10px  (buttons)
py-4   → 16px  (table cells)

/* Margins */
mt-1   → 4px   (label to value)
mt-3   → 12px  (section spacing)
mb-3   → 12px  (header spacing)

/* Page sections */
space-y-6 → 24px vertical gap
```

---

## 🎨 **Border Radius**

```css
rounded      → 4px    (badges)
rounded-lg   → 8px    (inputs, icon badges)
rounded-xl   → 12px   (cards, buttons)
rounded-full → 9999px (count badges)
```

---

## 🌫️ **Shadow System**

```css
shadow-sm  → Default cards
shadow-md  → Hover cards/buttons  
shadow-lg  → Card hover
shadow-xl  → Modals
```

---

## ⚡ **Transitions**

```tsx
// Cards: transition-all
// Text/Icons: transition-colors  
// Shadows: transition-shadow
// Duration: duration-200 (200ms)
```

### **Staggered Animation:**
```tsx
style={{ animationDelay: `${idx * 50}ms` }}
className="animate-fade-in-up"
```

---

## 🖱️ **Interactive States**

### **Card Hover:**
```css
border: var(--border) → var(--primary)
shadow: none/sm → lg
text: foreground → primary (name, chevron)
```

### **Button Hover:**
```css
Primary: bg-primary → bg-primary-dark, shadow-sm → shadow-md
Secondary: bg-white → bg-secondary
```

### **Focus:**
```css
focus:outline-none
focus:ring-2
focus:ring-[var(--primary)]/20
focus:border-[var(--primary)]
```

---

## 📱 **Responsive Grid**

```tsx
// Mobile: 1 column
// Tablet (md: 768px): 2 columns  
// Desktop (lg: 1024px): 3 columns
// KPIs: Always 4 columns

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

---

## 🎯 **Icons** (lucide-react)

**Sizes:**
```tsx
16px → table cells
18px → buttons, chevrons
20px → card headers
24px → page headers
32px → empty states
```

**Common:**
```tsx
Plus, Search, Filter, MoreVertical, ChevronRight,
Grid3X3, List, Building2, Globe, Shield, FileText
```

---

## 📋 **Quick Copy: Complete Page**

```tsx
'use client';

import { useState } from 'react';
import { Search, Plus, Grid3X3, List } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import clsx from 'clsx';

export default function MyPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <PageHeader
        title="Page Name"
        description="Description"
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-dark)] transition-all duration-200 text-p2 font-medium shadow-sm hover:shadow-md">
            <Plus size={18} />
            Add Item
          </button>
        }
      />

      {/* 2. KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-p3 text-[var(--foreground-muted)] font-medium">Total</p>
          <p className="text-h2 font-bold text-[var(--foreground)] mt-1">123</p>
        </div>
      </div>

      {/* 3. Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[var(--border)] rounded-lg text-p2 placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </div>
        
        <div className="flex gap-1 bg-[var(--background-secondary)] p-1 rounded-lg">
          <button onClick={() => setViewMode('grid')} className={clsx('p-2 rounded-lg transition-colors', viewMode === 'grid' ? 'bg-[var(--primary)] text-white' : 'bg-transparent text-[var(--foreground-muted)]')}>
            <Grid3X3 size={18} />
          </button>
          <button onClick={() => setViewMode('list')} className={clsx('p-2 rounded-lg transition-colors', viewMode === 'list' ? 'bg-[var(--primary)] text-white' : 'bg-transparent text-[var(--foreground-muted)]')}>
            <List size={18} />
          </button>
        </div>
      </div>

      {/* 4. Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-lg transition-all cursor-pointer group">
            {/* Card content */}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

**Companion to:** `BASE_UI_SPECIFICATION.md`  
**Last Updated:** 2026-04-09
