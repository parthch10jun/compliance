# 📋 Authorities Page - Additional Details

> **Supplementary specification (Part 2)**

---

## 🎨 **Icon System**

### **Icons from lucide-react:**
```tsx
import {
  Tag,           // Generic authority
  ChevronRight,  // Card navigation arrow
  Plus,          // Add button
  Grid3X3,       // Grid view toggle
  List,          // List view toggle
  Building2,     // Regulator type
  Globe,         // Jurisdiction type
  Shield,        // Standards Body type
  FileText       // Category type
}
```

### **Icon Sizes:**
```tsx
// In buttons/CTAs:        size={18}
// In card headers:        size={20}
// In table cells:         size={16}
// ChevronRight in cards:  size={18}
```

---

## 📏 **Spacing & Padding**

### **Page-Level:**
```css
.space-y-6 → 24px vertical gap between sections
```

### **Grid Gaps:**
```css
gap-4 → 16px  (KPI cards, authority cards)
gap-2 → 8px   (Stats grid within cards)
gap-3 → 12px  (Icon + text in cards)
```

### **Component Padding:**
```css
p-5        → 20px all sides      (Cards)
px-6 py-4  → 24px h, 16px v      (Table cells)
px-4 py-2.5 → 16px h, 10px v     (Buttons)
```

---

## 🖱️ **Interactive States**

### **Cards (Grid View):**
```tsx
// Default:
border: 1px solid var(--border)

// Hover:
border: 1px solid var(--primary)
box-shadow: shadow-lg
authority name → var(--primary)
chevron → var(--primary)
```

### **Table Rows:**
```tsx
// Hover:
background: var(--background-secondary)
cursor: pointer
```

---

## 📱 **Responsive**

```css
Mobile (default):   grid-cols-1
Tablet (768px):     grid-cols-2
Desktop (1024px):   grid-cols-3
```

---

## 🎭 **Design Tokens**

```typescript
const SPACING = {
  cardPadding: '20px',
  tableCellX: '24px',
  tableCellY: '16px',
  buttonX: '16px',
  buttonY: '10px',
  sectionGap: '24px',
  cardGap: '16px',
};

const BORDER_RADIUS = {
  card: '12px',
  button: '12px',
  icon: '8px',
};

const FONT_SIZE = {
  h2: '32px',  // KPI numbers
  p1: '16px',  // Stat numbers
  p2: '14px',  // Body text
  p3: '12px',  // Labels
};

const ICON_SIZE = {
  button: 18,
  cardHeader: 20,
  table: 16,
  chevron: 18,
};
```

---

## 📋 **Quick Copy Templates**

### **KPI Card:**
```tsx
<div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
  <p className="text-p3 text-[var(--foreground-muted)] font-medium">Label</p>
  <p className="text-h2 font-bold text-[var(--foreground)] mt-1">123</p>
</div>
```

### **Authority Card:**
```tsx
<div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-lg transition-all cursor-pointer group">
  <div className="flex items-start justify-between mb-3">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center border bg-blue-100 text-blue-700 border-blue-200">
        <Icon size={20} />
      </div>
      <div>
        <h3 className="text-p2 font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
          Authority Name
        </h3>
        <p className="text-p3 text-[var(--foreground-muted)]">Type</p>
      </div>
    </div>
    <ChevronRight size={18} className="text-[var(--foreground-muted)] group-hover:text-[var(--primary)] transition-colors" />
  </div>
  
  <div className="mt-3 pt-3 border-t border-[var(--border)] grid grid-cols-4 gap-2 text-center">
    <div>
      <p className="text-p1 font-semibold text-[var(--foreground)]">12</p>
      <p className="text-p3 text-[var(--foreground-muted)]">Programs</p>
    </div>
    {/* Repeat for Requirements, Obligations, Controls */}
  </div>
</div>
```

---

**Companion to:** `AUTHORITIES_PAGE_SPEC.md`  
**Last Updated:** 2026-04-09
