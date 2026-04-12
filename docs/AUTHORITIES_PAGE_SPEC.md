# 📋 Authorities Page - Complete Design Specification

> **Exact frontend specification for the Authorities page**

---

## 🎨 **Color System**

### **CSS Variables Used:**
```css
--primary:              /* Primary brand color (teal) */
--primary-dark:         /* Darker shade for hover states */
--foreground:           /* Primary text color */
--foreground-muted:     /* Secondary/muted text */
--background-secondary: /* Light gray background */
--border:               /* Border color */
```

### **Authority Type Colors:**
```tsx
const AUTHORITY_TYPES = {
  'Regulator': {
    background: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200'
  },
  'Standards Body': {
    background: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-200'
  },
  'Jurisdiction': {
    background: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200'
  },
  'Category': {
    background: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-200'
  },
  'Other': {
    background: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200'
  }
};
```

---

## 📏 **Typography System**

### **Font Sizes (Custom Classes):**
```css
text-h2  → 32px (2rem)         /* KPI numbers */
text-p1  → 16px (1rem)         /* Stats numbers in cards */
text-p2  → 14px (0.875rem)     /* Authority names, body text */
text-p3  → 12px (0.75rem)      /* Labels, descriptions */
```

### **Font Weights:**
```css
font-medium   → 500  /* Labels, descriptions */
font-semibold → 600  /* Card titles, table headers */
font-bold     → 700  /* KPI numbers, emphasis */
```

### **Text Colors:**
```tsx
Primary text:   text-[var(--foreground)]
Muted text:     text-[var(--foreground-muted)]
Primary accent: text-[var(--primary)]
```

---

## 📐 **Layout Structure**

### **Page Container:**
```tsx
<div className="space-y-6">  // 24px vertical spacing between sections
```

### **Grid Systems:**

#### **KPI Cards Grid:**
```tsx
className="grid grid-cols-4 gap-4"
// 4 columns
// 16px gap between cards
```

#### **Authority Cards Grid:**
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
// Responsive:
// Mobile:  1 column
// Tablet:  2 columns (md breakpoint)
// Desktop: 3 columns (lg breakpoint)
// 16px gap
```

---

## 🎯 **Component Specifications**

### **1. Page Header**

```tsx
<PageHeader
  title="Authorities"
  description="Regulatory bodies, standards, and jurisdictions..."
  action={<AddButton />}
/>
```

**Title:**
- Font size: `text-h1` (implied, typically 36-40px)
- Weight: Bold
- Color: `text-[var(--foreground)]`

**Description:**
- Font size: `text-p2` (14px)
- Color: `text-[var(--foreground-muted)]`

**Action Button:**
```tsx
className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-dark)] transition-all duration-200 text-p2 font-medium shadow-sm hover:shadow-md"

// Breakdown:
padding:      16px horizontal, 10px vertical
background:   var(--primary)
text:         white, 14px, font-medium
border-radius: 12px (rounded-xl)
icon size:    18px
gap:          8px between icon and text
shadow:       shadow-sm (default), shadow-md (hover)
transition:   all properties, 200ms
```

---

### **2. KPI Scorecard**

**Container:**
```tsx
className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow"

// Dimensions:
padding:       20px all sides
border-radius: 12px
background:    white
border:        1px solid var(--border)
hover effect:  shadow-md
```

**Label:**
```tsx
className="text-p3 text-[var(--foreground-muted)] font-medium"

// Typography:
font-size:     12px
color:         muted gray
font-weight:   500
```

**Value:**
```tsx
className="text-h2 font-bold text-[var(--foreground)] mt-1"

// Typography:
font-size:     32px
font-weight:   700
color:         dark (or var(--primary) for Overall Compliance)
margin-top:    4px
```

**Sizes:**
- Width: Auto (flex-1 in 4-column grid)
- Height: Auto (content-based)
- Typical height: ~90-100px

---

### **3. Search & Filter Bar**

```tsx
<SearchFilterBar
  searchValue={searchQuery}
  onSearchChange={setSearchQuery}
  searchPlaceholder="Search authorities..."
  viewMode={viewMode}
  onViewModeChange={setViewMode}
  filters={<FilterButtonGroup />}
/>
```

**Search Input:**
- Height: ~40px
- Padding: 12px horizontal
- Border: 1px solid var(--border)
- Border radius: 8px (rounded-lg)
- Icon size: 16-18px
- Font size: 14px (text-p2)
- Placeholder color: muted

**View Toggle Buttons:**
- Size: 40x40px
- Border radius: 8px
- Active: bg-[var(--primary)], text-white
- Inactive: bg-transparent, text-muted
- Icon size: 18px

**Filter Buttons:**
```tsx
// Active filter:
bg-[var(--primary-lightest)]
text-[var(--primary)]
border-[var(--primary)]

// Inactive filter:
bg-white
text-[var(--foreground-muted)]
border-[var(--border)]

// Common:
padding:       8px 16px
border-radius: 8px
font-size:     14px (text-p2)
font-weight:   500
```

---

### **4. Results Count**

```tsx
className="text-sm text-[var(--foreground-muted)]"

// Typography:
font-size: 14px
color:     muted gray
```

---

### **5. Authority Card (Grid View)**

**Container:**
```tsx
className="p-5 rounded-xl bg-white border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-lg transition-all cursor-pointer group"

// Dimensions:
padding:       20px all sides
border-radius: 12px
background:    white
border:        1px solid var(--border) (hover: var(--primary))
shadow:        none (hover: shadow-lg)
cursor:        pointer
transition:    all properties
animation:     staggered (50ms delay per card)
```

**Header Section:**
```tsx
className="flex items-start justify-between mb-3"

// Contains: Icon + Text | ChevronRight
margin-bottom: 12px
```

**Icon Badge:**
```tsx
className="w-10 h-10 rounded-lg flex items-center justify-center border"
// + type-specific colors

// Dimensions:
width/height:  40px
border-radius: 8px
icon size:     20px
border:        1px solid (color-specific)
```

**Authority Name:**
```tsx
className="text-p2 font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors"

// Typography:
font-size:     14px
font-weight:   600
color:         dark (hover: primary)
transition:    colors
```

**Type Label:**
```tsx
className="text-p3 text-[var(--foreground-muted)]"

// Typography:
font-size: 12px
color:     muted gray
```

**Chevron Icon:**
```tsx
size={18}
className="text-[var(--foreground-muted)] group-hover:text-[var(--primary)] transition-colors"

// Size: 18px
// Color: muted (hover: primary)
```

**Stats Section:**
```tsx
className="mt-3 pt-3 border-t border-[var(--border)] grid grid-cols-4 gap-2 text-center"

// Layout:
margin-top:    12px
padding-top:   12px
border-top:    1px solid var(--border)
grid:          4 columns
gap:           8px
alignment:     center
```

**Stat Number:**
```tsx
className="text-p1 font-semibold text-[var(--foreground)]"

// Typography:
font-size:   16px
font-weight: 600
color:       dark
```

**Stat Label:**
```tsx
className="text-p3 text-[var(--foreground-muted)]"

// Typography:
font-size: 12px
color:     muted gray
```

---

### **6. List View (Table)**

**Table Container:**
```tsx
className="rounded-xl border border-[var(--border)] overflow-hidden bg-white shadow-sm"

border-radius: 12px
border:        1px solid var(--border)
overflow:      hidden
background:    white
shadow:        shadow-sm
```

**Table Header:**
```tsx
<thead className="bg-[var(--background-secondary)]">

background: light gray (--background-secondary)
```

**Table Header Cell:**
```tsx
className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider"

// Typography:
padding:       24px horizontal, 16px vertical
font-size:     12px
font-weight:   600
color:         muted
text-transform: uppercase
letter-spacing: wider (0.05em)
alignment:     left (left/center based on content)
```

**Table Row:**
```tsx
className="hover:bg-[var(--background-secondary)] cursor-pointer transition-colors"

// Hover:
background: var(--background-secondary)
cursor:     pointer
transition: colors
```

**Table Cell:**
```tsx
className="px-6 py-4"

// Padding:
horizontal: 24px
vertical:   16px
```

**Cell Content (Authority Name):**
```tsx
className="flex items-center gap-3"
// Icon (32x32px, icon 16px) + Name

gap: 12px
```

**Icon in Table:**
```tsx
className="w-8 h-8 rounded-lg flex items-center justify-center border"

// Dimensions:
width/height:  32px (smaller than grid view)
border-radius: 8px
icon size:     16px
```

**Text in Table:**
```tsx
className="text-p2 font-medium text-[var(--foreground)]"

// Typography:
font-size:   14px
font-weight: 500
color:       dark
```

---

## 🎭 **Animations**

### **Page Load Animations:**
```css
.animate-fade-in-up → Fade in from bottom
.delay-1 → 100ms delay
.delay-2 → 200ms delay
```

### **Staggered Card Animation:**
```tsx
style={{ animationDelay: `${idx * 50}ms` }}

// Each card delays by 50ms
// Card 1: 0ms
// Card 2: 50ms
// Card 3: 100ms
// etc.
```

### **Hover Transitions:**
```css
transition-all      → All properties
transition-colors   → Color properties only
transition-shadow   → Shadow property only
duration-200        → 200ms duration (default)
```

---

## 🔍 **Search & Filter Logic**

### **Search:**
```tsx
searchQuery.toLowerCase().includes(authority.toLowerCase())

// Case-insensitive
// Matches anywhere in authority name
```

### **Type Filter:**
```tsx
typeFilter === 'all' || stat.type === typeFilter

// Options: 'all', 'Regulator', 'Standards Body', 'Jurisdiction', 'Category'
```

---

## 📊 **Statistics Calculation**

### **Authority Stats:**
```tsx
{
  authority: string;          // Authority name
  type: string;               // Categorized type
  programCount: number;       // # of programs
  requirementCount: number;   // # of requirements  
  obligationCount: number;    // # of obligations
  controlCount: number;       // # of controls
}
```

### **Sorting:**
```tsx
// Sort by total usage (descending)
const total = programCount + requirementCount + obligationCount + controlCount;
```

---

