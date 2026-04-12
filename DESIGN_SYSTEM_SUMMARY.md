# 🎨 Design System Summary - For AI Agents

> **Quick handoff document for AI agents working on this codebase**

## 🚨 **CRITICAL RULES - READ FIRST**

### **Table Requirements (NON-NEGOTIABLE)**
```tsx
// ✅ ALWAYS DO THIS:
<thead className="bg-[#0A0A0A]">                    // Dark header background
  <tr className="border-b border-[#2A2A2A]">
    <th className="text-left border-r border-[#2A2A2A]">Name</th>      // Left + vertical border
    <th className="text-left border-r border-[#2A2A2A]">Status</th>    // Left + vertical border
    <th className="text-left">Actions</th>                             // Left, no border-r (last)
  </tr>
</thead>

// ❌ NEVER DO THIS:
<th className="text-center">Status</th>    // ❌ Never center headers
<th className="text-right">Actions</th>    // ❌ Never right-align headers
<th>Name</th>                              // ❌ Missing text-left
<td className="px-4 py-3.5">Cell</td>      // ❌ Missing border-r border-[#2A2A2A]
<thead> (without bg-[#0A0A0A])            // ❌ Missing background
```

### **Color Requirements**
```css
Background: #0A0A0A  ← NOT #000000! Never pure black!
Surface:    #1A1A1A  ← Cards, tables, modals
Border:     #2A2A2A  ← ALL borders
Text:       #FFFFFF  ← White
Secondary:  #9CA3AF  ← Gray-400
Accent:     #FCD34D  ← Yellow (primary CTAs)
```

---

## 📁 **Documentation Structure**

```
docs/
├── README.md                   ← Start here (navigation guide)
├── ui-patterns.md             ← Complete reference (1,000+ lines) ⭐
└── UI_VISUAL_REFERENCE.md     ← Visual diagrams (ASCII art)
```

---

## 🎯 **Quick Start for AI Agents**

### **Step 1: Read These Sections**
1. `docs/ui-patterns.md` → "Quick Reference - The Essentials"
2. `docs/ui-patterns.md` → "Polished Data Tables"
3. `docs/UI_VISUAL_REFERENCE.md` → "Table Structure"

### **Step 2: Study Reference Implementation**
```
src/app/vendors/page.tsx  ← PERFECT table implementation
Lines 107-204: Table with vertical borders
Lines 91-100: Search input
Lines 72-76: Page header
```

### **Step 3: Use Templates**
```
docs/ui-patterns.md → "Quick Copy-Paste Snippets"
- New Page Template
- Table Template
- Button patterns
- Modal pattern
```

---

## ⚡ **Copy-Paste Essentials**

### **Page Structure**
```tsx
<div className="min-h-screen bg-[#0A0A0A] text-white p-8">
  <h1 className="text-3xl font-bold mb-2">Page Title</h1>
  <p className="text-gray-500 mb-8">Description</p>
  
  {/* Content here */}
</div>
```

### **Card**
```tsx
<div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
  {/* Content */}
</div>
```

### **Primary Button**
```tsx
<button className="px-4 py-2 bg-[#FCD34D] text-black rounded-lg font-medium hover:bg-[#FCD34D]/90 transition-colors">
  Add Item
</button>
```

### **Search Input**
```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
  <input
    className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FCD34D]/20"
    placeholder="Search..."
  />
</div>
```

### **Complete Table** (With Vertical Borders)
```tsx
<div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
  <table className="w-full">
    <thead className="bg-[#0A0A0A]">
      <tr className="border-b border-[#2A2A2A]">
        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 border-r border-[#2A2A2A]">
          Column 1
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 border-r border-[#2A2A2A]">
          Column 2
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
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
          <button className="p-1.5 hover:bg-[#2A2A2A] rounded">
            <MoreVertical size={16} className="text-gray-500" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## ✅ **Pre-Commit Checklist**

Before submitting ANY UI code:

### **Colors**
- [ ] Background is `bg-[#0A0A0A]` (not `bg-black`)
- [ ] Cards are `bg-[#1A1A1A]`
- [ ] Borders are `border-[#2A2A2A]`

### **Tables**
- [ ] `<thead>` has `className="bg-[#0A0A0A]"`
- [ ] ALL `<th>` have `className="text-left"`
- [ ] ALL columns (except last) have `border-r border-[#2A2A2A]`
- [ ] Table has `className="w-full"` (no `table-fixed`)
- [ ] Rows have `hover:bg-[#1A1A1A]/50`

### **Interactive Elements**
- [ ] All buttons/links have hover states
- [ ] All use `transition-colors`
- [ ] Icons are consistent size (16px tables, 20px UI)

### **Spacing**
- [ ] Page padding: `p-8`
- [ ] Card padding: `p-6`
- [ ] Table cells: `px-4 py-3.5`
- [ ] Gaps: `gap-6` between cards

---

## 🎨 **Design Tokens**

```typescript
// COLORS (EXACT VALUES - DO NOT APPROXIMATE)
const colors = {
  background: '#0A0A0A',      // Main background
  surface: '#1A1A1A',         // Cards, tables
  border: '#2A2A2A',          // All borders
  text: {
    primary: '#FFFFFF',       // White
    secondary: '#9CA3AF',     // Gray-400
    muted: '#6B7280',         // Gray-500
  },
  accent: '#FCD34D',          // Yellow (CTAs)
};

// SPACING
const spacing = {
  pagePadding: 'p-8',         // 32px
  cardPadding: 'p-6',         // 24px
  tableCellX: 'px-4',         // 16px
  tableCellY: 'py-3.5',       // 14px
  gap: 'gap-6',               // 24px
};

// BORDER RADIUS
const borderRadius = {
  input: 'rounded-lg',        // 8px
  card: 'rounded-xl',         // 12px
  badge: 'rounded',           // 4px
};

// ICONS
const iconSize = {
  table: 16,                  // Tables
  ui: 20,                     // General UI
  header: 24,                 // Page headers
};
```

---

## 🚀 **Common Tasks**

### **"Build a new data table page"**
1. Copy template from `docs/ui-patterns.md` → "Table Template"
2. Ensure ALL headers are `text-left`
3. Add `border-r border-[#2A2A2A]` to all columns except last
4. Add `bg-[#0A0A0A]` to `<thead>`
5. Test hover states work

### **"Add a search bar"**
1. Copy from `src/app/vendors/page.tsx` lines 91-100
2. Ensure colors match: `bg-[#1A1A1A] border-[#2A2A2A]`
3. Add icon: `Search` from `lucide-react`

### **"Create a modal"**
1. Use template from `docs/ui-patterns.md` → "Modal/Dialog"
2. Backdrop: `bg-black/60 backdrop-blur-sm`
3. Modal: `bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl`

### **"Style a button"**
1. Primary: `bg-[#FCD34D] text-black`
2. Secondary: `bg-[#1A1A1A] border border-[#2A2A2A] text-white`
3. Always add: `rounded-lg hover:bg-[...]/90 transition-colors`

---

## 📚 **Full Documentation**

For complete details, see:
- **`docs/README.md`** - Navigation and overview
- **`docs/ui-patterns.md`** - Complete guide (1,000+ lines)
- **`docs/UI_VISUAL_REFERENCE.md`** - Visual diagrams

---

## 🎯 **Key Takeaways**

1. **NEVER center or right-align table headers** - Always `text-left`
2. **ALWAYS add vertical borders in tables** - `border-r border-[#2A2A2A]`
3. **ALWAYS use #0A0A0A for background** - Not pure black
4. **ALWAYS add hover states** - `hover:bg-[#2A2A2A]`
5. **ALWAYS use exact colors** - Don't approximate
6. **ALWAYS check `/vendors` page** - It's the perfect reference

---

**Version:** 2.0  
**Last Updated:** 2026-04-09  
**Perfect Reference:** `src/app/vendors/page.tsx`  
**Live Demo:** `/ui-showcase`
