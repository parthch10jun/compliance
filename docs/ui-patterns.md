# Beautiful UI Patterns - Complete Implementation Guide

> **For AI Agents & Developers:** This is a complete, production-ready dark theme design system. Copy these patterns exactly for a cohesive, professional application.

---

## 📑 **Table of Contents**

### **Quick Start**
1. [Quick Reference - The Essentials](#quick-reference---the-essentials)
2. [Golden Rules](#golden-rules)
3. [Dark Theme Palette](#dark-theme-palette-detailed)

### **Core Components**
4. [Command Palette (⌘K)](#command-palette-k-search)
5. [Polished Data Tables](#polished-data-tables) ⭐ **Most Important**
6. [Dual Sidebar Navigation](#dual-sidebar-navigation-optional-pattern)

### **Component Library**
7. [Typography System](#typography-system)
8. [Component Library](#component-library) - Badges, Icons, Spinners, etc.
9. [Layout Patterns](#layout-patterns)
10. [Animation Guidelines](#animation-guidelines)

### **Implementation Guide**
11. [Implementation Checklist](#implementation-checklist)
12. [Quick Copy-Paste Snippets](#quick-copy-paste-snippets)
13. [Dark Theme Best Practices](#dark-theme-best-practices)

### **Reference**
14. [Notes for Other Agents](#notes-for-other-agents)

---

## 📋 **Quick Reference - The Essentials**

### **🎨 Core Colors**
```css
Background:     #0A0A0A  ← Main page background (NOT pure black!)
Surface:        #1A1A1A  ← Cards, tables, modals
Border:         #2A2A2A  ← All borders (subtle, not harsh)
Text Primary:   #FFFFFF  ← White text
Text Secondary: #9CA3AF  ← Gray-400 for less important text
Text Muted:     #6B7280  ← Gray-500 for placeholders
Accent Yellow:  #FCD34D  ← Primary CTA buttons
```

### **📊 Table Rules (CRITICAL)**
```tsx
// ✅ DO THIS:
<thead className="bg-[#0A0A0A]">  {/* Dark header background */}
  <tr className="border-b border-[#2A2A2A]">
    {/* ALL headers left-aligned with vertical borders */}
    <th className="px-4 py-3 text-left border-r border-[#2A2A2A]">Name</th>
    <th className="px-4 py-3 text-left border-r border-[#2A2A2A]">Status</th>
    <th className="px-4 py-3 text-left">Actions</th>  {/* Last: no border-r */}
  </tr>
</thead>

// ❌ DON'T DO THIS:
<th className="text-center">Status</th>        // Never center headers
<th className="text-right">Actions</th>         // Never right-align headers
<th className="px-4 py-3">Name</th>             // Missing vertical borders
<thead>                                         // Missing bg-[#0A0A0A]
```

### **🔘 Button Patterns**
```tsx
// Primary (Yellow)
<button className="px-4 py-2 bg-[#FCD34D] text-black rounded-lg font-medium hover:bg-[#FCD34D]/90 transition-colors">

// Secondary (Dark)
<button className="px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-lg hover:bg-[#2A2A2A] transition-colors">

// Icon Button
<button className="p-1.5 hover:bg-[#2A2A2A] rounded transition-colors">
  <Icon size={16} className="text-gray-500" />
</button>
```

### **🔍 Search Input**
```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
  <input
    className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FCD34D]/20"
    placeholder="Search..."
  />
</div>
```

### **🎯 Golden Rules**
1. **NEVER use pure black** (#000000) - Always use #0A0A0A
2. **ALL table headers left-aligned** - Never center or right-align
3. **Vertical borders in tables** - Between ALL columns except last
4. **Header background** - Always `bg-[#0A0A0A]` on `<thead>`
5. **Auto-resize columns** - Never use `table-fixed` or fixed widths
6. **Consistent spacing** - `px-4 py-3` headers, `px-4 py-3.5` cells
7. **Always add hover states** - `hover:bg-[#2A2A2A]` everywhere
8. **Icon sizing** - 16px in tables, 20px in UI, 24px in headers
9. **Rounded corners** - `rounded-lg` for inputs/buttons, `rounded-xl` for cards
10. **Transitions always** - `transition-colors` on all interactive elements

---

## 🎨 **Dark Theme Palette (Detailed)**

Our application uses a sophisticated dark theme inspired by modern SaaS applications.

### **Implementation Approaches:**

#### **✅ RECOMMENDED: CSS Variables**

The codebase already uses CSS variables in `src/app/globals.css`. However, for **dark theme**, you'd use these values:

```css
/* DARK THEME - Not currently in globals.css, but you could add as [data-theme="dark"] */
[data-theme="dark"] {
  --background:           #0A0A0A;  /* Near-black (easier on eyes than pure black) */
  --background-secondary: #1A1A1A;  /* Dark gray for alternating sections */
  --surface:              #1A1A1A;  /* Cards, tables, modals */
  --border:               #2A2A2A;  /* Subtle borders */

  --foreground:           #FFFFFF;  /* White text */
  --foreground-secondary: #E5E7EB;  /* Gray-200 */
  --foreground-muted:     #9CA3AF;  /* Gray-400 */
  --foreground-light:     #6B7280;  /* Gray-500 */

  --primary:              #FCD34D;  /* Yellow accent */
  --primary-hover:        #FDE68A;  /* Yellow-200 */

  --sidebar-bg:           #0A0A0A;
  --sidebar-hover:        #1A1A1A;
}
```

**Then use in components:**
```tsx
className="bg-[var(--background)] text-[var(--foreground)] border-[var(--border)]"
```

#### **Direct Tailwind (What I've shown in examples):**

```css
Background:     #0A0A0A  (Near-black)
Surface:        #1A1A1A  (Dark gray cards)
Border:         #2A2A2A  (Subtle borders)
Text Primary:   #FFFFFF  (White)
Text Secondary: #9CA3AF  (Gray-400)
Accent Yellow:  #FCD34D  (Primary CTA)
Accent Blue:    #3B82F6  (Links, info)
```

**Used as:**
```tsx
className="bg-[#0A0A0A] text-white border-[#2A2A2A]"
```

### **Why This Palette Works:**

1. **Not Pure Black** - #0A0A0A is easier on eyes than #000
2. **Subtle Depth** - #1A1A1A surfaces create visual hierarchy
3. **Gentle Borders** - #2A2A2A provides separation without harshness
4. **High Contrast Text** - White on dark for maximum readability
5. **Professional Accent** - Yellow (#FCD34D) stands out without being harsh

### **Which Approach Should You Use?**

**For this project:** Use direct Tailwind values (`bg-[#0A0A0A]`) since the light theme already uses CSS variables in `globals.css`, and mixing both might be confusing. When you want to add dark mode properly, you'd extend the existing CSS variable system.

---

## ⌘ **Command Palette (⌘K Search)**

### **Implementation:**

**File:** `src/components/CommandPalette.tsx`

**Features:**
- ✅ Keyboard shortcut: ⌘K (Mac) or Ctrl+K (Windows)
- ✅ Blurred backdrop: `backdrop-blur-sm`
- ✅ Centered modal with slide-in animation
- ✅ Search all pages and actions
- ✅ Grouped navigation (Navigation, Settings, etc.)
- ✅ ESC to close
- ✅ Dark theme (#1A1A1A background)

**Key CSS:**

```css
/* Backdrop */
.backdrop {
  @apply fixed inset-0 bg-black/60 backdrop-blur-sm;
}

/* Modal */
.modal {
  @apply w-full max-w-2xl bg-[#1A1A1A] rounded-xl 
         border border-[#2A2A2A] shadow-2xl;
}

/* Search Input */
.search-input {
  @apply bg-transparent text-white placeholder:text-gray-500 
         focus:outline-none;
}

/* Group Heading */
[cmdk-group-heading] {
  @apply px-4 py-2 text-xs font-semibold text-gray-500 
         uppercase tracking-wide bg-[#0A0A0A];
}

/* Items */
[cmdk-item] {
  @apply flex items-center gap-3 px-4 py-2.5 
         text-white hover:bg-[#2A2A2A] transition-colors;
}
```

**How to Use:**

```tsx
import { CommandPalette } from '@/components/CommandPalette'

// In your layout or page
<CommandPalette 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)} 
/>

// Keyboard listener is automatic - just press ⌘K
```

---

## 📊 **Polished Data Tables**

### **Implementation:**

**Example:** `src/app/vendors/page.tsx`

**Features:**
- ✅ **All headers left-aligned** (no center/right alignment)
- ✅ **Vertical borders** between columns (#2A2A2A)
- ✅ **Header background** (#0A0A0A) for visual distinction
- ✅ **Auto-resizing columns** (no fixed widths)
- ✅ Subtle row separators (#2A2A2A)
- ✅ Hover effects (bg-[#1A1A1A]/50)
- ✅ Status badges with colors
- ✅ Loading spinners (Loader2 animate-spin)
- ✅ Icon integration
- ✅ Pagination footer
- ✅ Clean typography

**Key Structure:**

```tsx
<table className="w-full">
  {/* Header - Dark background with vertical borders */}
  <thead className="bg-[#0A0A0A]">
    <tr className="border-b border-[#2A2A2A]">
      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-r border-[#2A2A2A]">
        Name
      </th>
      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-r border-[#2A2A2A]">
        Status
      </th>
      {/* Last column - no right border */}
      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
        Actions
      </th>
    </tr>
  </thead>

  {/* Body - With vertical borders */}
  <tbody>
    <tr className={clsx(
      'border-b border-[#2A2A2A] transition-colors cursor-pointer',
      hoveredRow === id ? 'bg-[#1A1A1A]/50' : ''
    )}>
      <td className="px-4 py-3.5 border-r border-[#2A2A2A]">
        {/* Cell content */}
      </td>
      <td className="px-4 py-3.5 border-r border-[#2A2A2A]">
        {/* Cell content */}
      </td>
      {/* Last column - no right border */}
      <td className="px-4 py-3.5">
        {/* Cell content */}
      </td>
    </tr>
  </tbody>
</table>
```

**Best Practices:**

1. **Left Alignment Always** - All headers and cells left-aligned
2. **Vertical Borders** - Add `border-r border-[#2A2A2A]` to all columns except last
3. **Header Background** - Use `bg-[#0A0A0A]` on `<thead>` for distinction
4. **Auto-resize** - Use `w-full` on table, let columns auto-distribute
5. **Generous Padding** - `px-4 py-3.5` for comfortable spacing
6. **Hover States** - Always add hover feedback
7. **Loading States** - Use `Loader2` with `animate-spin`
8. **Icon Consistency** - All icons same size (16px)
9. **Badge Design** - Rounded, uppercase, muted backgrounds

---

## 🔀 **Dual Sidebar Navigation** (Optional Pattern)

### **Implementation:**

**File:** `src/components/DualSidebar.tsx`

**Features:**
- ✅ Left sidebar: Icon-only modules (64px wide)
- ✅ Right sidebar: Detailed pages (224px wide)
- ✅ Smooth slide-in animation
- ✅ Active state highlighting
- ✅ Collapsible design
- ✅ Color-coded modules

**Structure:**

```
┌──────┬──────────────┬──────────────────┐
│ ICON │ DETAILED     │ MAIN CONTENT     │
│ BAR  │ MENU        │                  │
│ 64px │ 224px       │ Flexible         │
└──────┴──────────────┴──────────────────┘
```

**How It Works:**

1. **Left Sidebar (64px):**
   - Module icons (Compliance, Security, etc.)
   - Active module highlighted with color
   - Settings icon at bottom

2. **Right Sidebar (224px):**
   - Slides in when module selected
   - Shows all subpages with icons + labels
   - Active page highlighted
   - Collapsible with chevron button

**CSS:**

```css
/* Left Sidebar */
.left-sidebar {
  @apply fixed left-0 top-0 h-full w-16 
         bg-[#0A0A0A] border-r border-[#2A2A2A] z-40;
}

/* Right Sidebar (Slides In) */
.right-sidebar {
  @apply fixed left-16 top-0 h-full w-56 
         bg-[#0A0A0A] border-r border-[#2A2A2A] 
         transition-transform duration-300 z-30;
}

/* Open State */
.right-sidebar.open {
  @apply translate-x-0;
}

/* Closed State */
.right-sidebar.closed {
  @apply -translate-x-full;
}
```

---

## 🎯 **Key UI Components**

### **1. Buttons**

```tsx
/* Primary CTA */
<button className="px-4 py-2 bg-[#FCD34D] text-black rounded-lg font-medium hover:bg-[#FCD34D]/90 transition-colors">
  Add Vendor
</button>

/* Secondary */
<button className="px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-lg hover:bg-[#2A2A2A] transition-colors">
  Cancel
</button>
```

### **2. Badges**

```tsx
<span className="px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide bg-gray-800 text-gray-400 border border-gray-700">
  CLOUD
</span>
```

### **3. Search Inputs**

```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
  <input
    type="text"
    placeholder="Search..."
    className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FCD34D]/20"
  />
</div>
```

### **4. Cards/Containers**

```tsx
<div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
  {/* Card content */}
</div>
```

---

## ✨ **Micro-interactions**

### **Hover States:**
```css
transition-colors duration-150
hover:bg-[#1A1A1A]/50
hover:text-white
```

### **Focus States:**
```css
focus:outline-none
focus:ring-2
focus:ring-[#FCD34D]/20
focus:border-[#FCD34D]/50
```

### **Loading Spinners:**
```tsx
<Loader2 className="w-4 h-4 animate-spin text-gray-400" />
```

### **Slide Animations:**
```css
transition-transform duration-300 ease-in-out
```

---

## 📱 **Responsive Design**

All components are mobile-responsive:

```css
/* Desktop */
@media (min-width: 1024px) {
  /* Full sidebar, tables with all columns */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  /* Collapsible sidebar, hide some columns */
}

/* Mobile */
@media (max-width: 767px) {
  /* Icon-only sidebar, stacked layout */
}
```

---

## 🚀 **Quick Start**

### **To Use This Design System:**

1. **Copy the color palette** to `tailwind.config.ts`
2. **Use the components** from `src/components/`
3. **Follow the patterns** shown in `src/app/vendors/page.tsx`
4. **Test with** `http://localhost:3000/ui-showcase`

### **Demo Pages:**

- `/ui-showcase` - All UI patterns in one place
- `/vendors` - Perfect table implementation
- Press `⌘K` anywhere - Command palette

---

---

## 🎨 **Complete Visual Guidelines**

### **Typography System**

```css
/* Font Family */
font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Font Sizes */
text-xs   → 12px  (Table headers, labels, badges)
text-sm   → 14px  (Body text, table cells, descriptions)
text-base → 16px  (Standard UI text)
text-lg   → 18px  (Section headings)
text-xl   → 20px  (Card titles)
text-2xl  → 24px  (Page sections)
text-3xl  → 30px  (Page titles)

/* Font Weights */
font-normal   → 400 (Regular text)
font-medium   → 500 (Emphasized text, names)
font-semibold → 600 (Headers, labels)
font-bold     → 700 (Titles, important headings)

/* Letter Spacing */
tracking-wide  → 0.025em (Uppercase labels)
tracking-wider → 0.05em  (Section headers)
```

---

## 🎭 **Component Library**

### **1. Status Badges**

```tsx
// Base Badge Component
function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: string }) {
  return (
    <span className="px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide bg-gray-800 text-gray-400 border border-gray-700">
      {children}
    </span>
  );
}

// Colored Variants
const statusColors = {
  active: 'bg-green-900/30 text-green-400 border-green-700',
  pending: 'bg-yellow-900/30 text-yellow-400 border-yellow-700',
  inactive: 'bg-gray-800 text-gray-400 border-gray-700',
  error: 'bg-red-900/30 text-red-400 border-red-700',
};
```

### **2. Icon Wrapper**

```tsx
// Consistent Icon Sizing
<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A]">
  <Icon size={20} className="text-gray-400" />
</div>

// Small Icon (in tables)
<Icon size={16} className="text-gray-400" />

// Large Icon (in headers)
<Icon size={24} className="text-white" />
```

### **3. Loading Spinner**

```tsx
import { Loader2 } from 'lucide-react';

// Inline Spinner
<Loader2 className="w-4 h-4 animate-spin text-gray-400" />

// Full-page Loading
<div className="flex items-center justify-center min-h-screen">
  <Loader2 className="w-8 h-8 animate-spin text-[#FCD34D]" />
</div>
```

### **4. Empty States**

```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center mb-4">
    <Icon size={32} className="text-gray-500" />
  </div>
  <h3 className="text-lg font-semibold text-white mb-2">No Items Found</h3>
  <p className="text-sm text-gray-500 mb-6">Get started by creating your first item.</p>
  <button className="px-4 py-2 bg-[#FCD34D] text-black rounded-lg font-medium hover:bg-[#FCD34D]/90 transition-colors">
    Create Item
  </button>
</div>
```

### **5. Pagination**

```tsx
<div className="px-4 py-3 border-t border-[#2A2A2A] flex items-center justify-between text-xs text-gray-500">
  <span>Rows per page: 25</span>
  <div className="flex items-center gap-4">
    <span>1-25 of 100</span>
    <div className="flex gap-1">
      <button className="p-1 hover:bg-[#2A2A2A] rounded disabled:opacity-30 disabled:cursor-not-allowed">
        ‹
      </button>
      <button className="p-1 hover:bg-[#2A2A2A] rounded">
        ›
      </button>
    </div>
  </div>
</div>
```

### **6. Search Bar**

```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
  <input
    type="text"
    placeholder="Search..."
    className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FCD34D]/20 focus:border-[#FCD34D]/50 transition-colors"
  />
</div>
```

### **7. Dropdown Menu**

```tsx
<div className="relative">
  <button className="px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-sm text-white hover:bg-[#2A2A2A] transition-colors flex items-center gap-2">
    <span>Options</span>
    <ChevronDown size={16} />
  </button>

  {/* Dropdown (when open) */}
  <div className="absolute top-full mt-1 right-0 w-48 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-xl overflow-hidden z-50">
    <button className="w-full px-4 py-2 text-sm text-white hover:bg-[#2A2A2A] transition-colors text-left flex items-center gap-2">
      <Icon size={16} />
      <span>Menu Item</span>
    </button>
  </div>
</div>
```

### **8. Tabs**

```tsx
<div className="flex gap-1 p-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg">
  <button className="px-4 py-2 text-sm font-medium rounded-lg bg-[#1A1A1A] text-white">
    Active Tab
  </button>
  <button className="px-4 py-2 text-sm font-medium rounded-lg text-gray-400 hover:text-white hover:bg-[#1A1A1A]/50 transition-colors">
    Inactive Tab
  </button>
</div>
```

### **9. Toast/Notification**

```tsx
<div className="fixed bottom-4 right-4 w-96 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-900/30 border border-green-700 flex items-center justify-center">
      <CheckCircle size={16} className="text-green-400" />
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-white mb-1">Success</h4>
      <p className="text-xs text-gray-400">Your changes have been saved.</p>
    </div>
    <button className="text-gray-500 hover:text-white transition-colors">
      <X size={16} />
    </button>
  </div>
</div>
```

### **10. Modal/Dialog**

```tsx
{/* Backdrop */}
<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />

{/* Modal */}
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div className="w-full max-w-lg bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-2xl">
    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A]">
      <h2 className="text-lg font-semibold text-white">Modal Title</h2>
      <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
        <X size={20} />
      </button>
    </div>

    {/* Body */}
    <div className="px-6 py-4">
      <p className="text-sm text-gray-400">Modal content goes here.</p>
    </div>

    {/* Footer */}
    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#2A2A2A]">
      <button className="px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-lg hover:bg-[#2A2A2A] transition-colors">
        Cancel
      </button>
      <button className="px-4 py-2 bg-[#FCD34D] text-black rounded-lg font-medium hover:bg-[#FCD34D]/90 transition-colors">
        Confirm
      </button>
    </div>
  </div>
</div>
```

---

## 🔲 **Layout Patterns**

### **Page Container**

```tsx
<div className="min-h-screen bg-[#0A0A0A] text-white p-8">
  {/* Page content */}
</div>
```

### **Card Grid**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 hover:border-[#3A3A3A] transition-colors">
    {/* Card content */}
  </div>
</div>
```

### **Two-Column Layout**

```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Sidebar (1/3) */}
  <div className="lg:col-span-1">
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 sticky top-4">
      {/* Sidebar content */}
    </div>
  </div>

  {/* Main Content (2/3) */}
  <div className="lg:col-span-2 space-y-6">
    {/* Main content */}
  </div>
</div>
```

### **Stats/KPI Row**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total</span>
      <TrendingUp size={16} className="text-green-400" />
    </div>
    <div className="text-2xl font-bold text-white mb-1">1,234</div>
    <div className="text-xs text-gray-500">+12% from last month</div>
  </div>
</div>
```

---

## 🎯 **Animation Guidelines**

### **Tailwind Animations**

```css
/* Fade In */
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide In from Top */
.animate-slide-in-from-top-4 {
  animation: slide-in-from-top-4 0.3s ease-out;
}

@keyframes slide-in-from-top-4 {
  from {
    opacity: 0;
    transform: translateY(-16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide In from Bottom */
.animate-slide-in-from-bottom-4 {
  animation: slide-in-from-bottom-4 0.3s ease-out;
}

@keyframes slide-in-from-bottom-4 {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Spin (for loaders) */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### **Staggered Animations**

```tsx
<div className="animate-fade-in">Item 1</div>
<div className="animate-fade-in delay-100">Item 2</div>
<div className="animate-fade-in delay-200">Item 3</div>

/* In CSS */
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
```

---

## 🎨 **Dark Theme Best Practices**

### **Do's:**
- ✅ Use #0A0A0A for main background (not pure black)
- ✅ Use #1A1A1A for cards/surfaces
- ✅ Use #2A2A2A for borders (subtle, not harsh)
- ✅ Use white text with proper contrast
- ✅ Use gray-400 (#9CA3AF) for secondary text
- ✅ Use gray-500 (#6B7280) for placeholders
- ✅ Add `backdrop-blur-sm` to overlays
- ✅ Use subtle hover states (bg-[#2A2A2A])
- ✅ Add smooth transitions everywhere

### **Don'ts:**
- ❌ Don't use pure black (#000000)
- ❌ Don't use harsh white borders
- ❌ Don't use bright colors without opacity
- ❌ Don't center-align table headers
- ❌ Don't forget vertical borders in tables
- ❌ Don't skip hover states
- ❌ Don't use fixed column widths (let them auto-resize)
- ❌ Don't mix light and dark themes

---

## 🔧 **Implementation Checklist**

When building a new page or component:

### **Page Setup**
- [ ] Dark background: `bg-[#0A0A0A]`
- [ ] White text: `text-white`
- [ ] Proper padding: `p-8` or `px-8 py-6`
- [ ] Page title: `text-3xl font-bold`
- [ ] Page description: `text-gray-500`

### **Tables**
- [ ] Container: `bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl`
- [ ] Table: `w-full` (auto-resize)
- [ ] Header row: `bg-[#0A0A0A]`
- [ ] Headers: Left-aligned, uppercase, `text-gray-500`
- [ ] Vertical borders: `border-r border-[#2A2A2A]` on all columns except last
- [ ] Horizontal borders: `border-b border-[#2A2A2A]` on all rows
- [ ] Hover states: `hover:bg-[#1A1A1A]/50`
- [ ] Cell padding: `px-4 py-3.5`

### **Buttons**
- [ ] Primary: `bg-[#FCD34D] text-black rounded-lg hover:bg-[#FCD34D]/90`
- [ ] Secondary: `bg-[#1A1A1A] border border-[#2A2A2A] text-white hover:bg-[#2A2A2A]`
- [ ] Padding: `px-4 py-2` or `px-6 py-3`
- [ ] Font: `font-medium`
- [ ] Transitions: `transition-colors`

### **Forms**
- [ ] Input background: `bg-[#1A1A1A]`
- [ ] Input border: `border border-[#2A2A2A]`
- [ ] Placeholder: `placeholder-gray-500`
- [ ] Focus ring: `focus:ring-2 focus:ring-[#FCD34D]/20`
- [ ] Rounded corners: `rounded-lg`

### **Cards**
- [ ] Background: `bg-[#1A1A1A]`
- [ ] Border: `border border-[#2A2A2A]`
- [ ] Rounded: `rounded-xl`
- [ ] Padding: `p-6`
- [ ] Hover: `hover:border-[#3A3A3A]`

### **Icons**
- [ ] Consistent sizing: 16px (tables), 20px (UI), 24px (headers)
- [ ] Color: `text-gray-400` or `text-gray-500`
- [ ] From: `lucide-react`

### **Spacing**
- [ ] Gap between cards: `gap-6`
- [ ] Gap between sections: `mb-8`
- [ ] Gap inside cards: `space-y-4`
- [ ] Grid columns: `gap-4` or `gap-6`

---

## 📦 **Vendor Icon Component**

Used in the Vendors table to display dynamic vendor logos:

```tsx
function VendorIcon({ icon, name }: { icon?: string; name: string }) {
  const iconMap: Record<string, string> = {
    aws: '☁️',
    github: '🐙',
    stripe: '💳',
    slack: '💬',
    google: '🔍',
    microsoft: '🪟',
    salesforce: '☁️',
    zoom: '📹',
  };

  const emoji = icon && iconMap[icon.toLowerCase()]
    ? iconMap[icon.toLowerCase()]
    : name.charAt(0).toUpperCase();

  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#2A2A2A] text-sm">
      {emoji}
    </div>
  );
}
```

---

## 🚀 **Quick Copy-Paste Snippets**

### **New Page Template**

```tsx
'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';

export default function MyPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Page Title</h1>
        <p className="text-gray-500">Page description goes here</p>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FCD34D]/20"
          />
        </div>
        <button className="px-4 py-2.5 bg-[#FCD34D] text-black rounded-lg font-medium hover:bg-[#FCD34D]/90 transition-colors flex items-center gap-2">
          <Plus size={20} />
          Add New
        </button>
      </div>

      {/* Content */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
        {/* Your content here */}
      </div>
    </div>
  );
}
```

### **Table Template**

```tsx
<div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
  <table className="w-full">
    <thead className="bg-[#0A0A0A]">
      <tr className="border-b border-[#2A2A2A]">
        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-r border-[#2A2A2A]">
          Column 1
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-r border-[#2A2A2A]">
          Column 2
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
          Actions
        </th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A]/50 transition-colors">
        <td className="px-4 py-3.5 border-r border-[#2A2A2A]">
          <span className="text-sm text-white">Cell 1</span>
        </td>
        <td className="px-4 py-3.5 border-r border-[#2A2A2A]">
          <span className="text-sm text-gray-400">Cell 2</span>
        </td>
        <td className="px-4 py-3.5">
          <button className="p-1.5 hover:bg-[#2A2A2A] rounded transition-colors">
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>

  {/* Pagination */}
  <div className="px-4 py-3 border-t border-[#2A2A2A] flex items-center justify-between text-xs text-gray-500">
    <span>Rows per page: 25</span>
    <div className="flex items-center gap-4">
      <span>1-25 of 100</span>
      <div className="flex gap-1">
        <button className="p-1 hover:bg-[#2A2A2A] rounded">‹</button>
        <button className="p-1 hover:bg-[#2A2A2A] rounded">›</button>
      </div>
    </div>
  </div>
</div>
```

---

**Last Updated:** 2026-04-09
**Design System Version:** 2.0
**Author:** AI Assistant
**Repository:** Compliance Instance V1.0

---

## 📝 **Notes for Other Agents**

This document represents a **complete, production-ready dark theme design system**. All patterns have been battle-tested in:

- ✅ `/vendors` page (reference implementation)
- ✅ `/ui-showcase` page (live demo)
- ✅ Command Palette (⌘K anywhere)

**Key Files to Reference:**
- `src/app/vendors/page.tsx` - Perfect table implementation
- `src/components/CommandPalette.tsx` - Search/navigation
- `src/components/DualSidebar.tsx` - Navigation pattern
- `src/app/globals.css` - All color variables and animations

**Philosophy:**
- **Consistency** over creativity
- **Subtlety** over flashiness
- **Function** over decoration
- **Accessibility** always

Copy these patterns exactly for a cohesive, professional application.
