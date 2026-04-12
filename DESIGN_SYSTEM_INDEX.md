# 📚 Compliance Instance - Complete Design System Index

> **Your complete guide to the UI design system**

---

## 🎯 **Quick Start**

**Building a new compliance page?**
1. Read [`BASE_UI_SPECIFICATION.md`](./docs/BASE_UI_SPECIFICATION.md) - Complete foundation
2. Reference [`BASE_UI_COMPONENTS.md`](./docs/BASE_UI_COMPONENTS.md) - Component library
3. Check [`AUTHORITIES_PAGE_SPEC.md`](./docs/AUTHORITIES_PAGE_SPEC.md) - Detailed example

---

## 📁 **Documentation Structure**

### **🎨 Core Design System**

#### **1. BASE_UI_SPECIFICATION.md** (Main Reference)
**What it covers:**
- ✅ Color system (CSS variables)
- ✅ Typography (custom text classes)
- ✅ Component library (Page Header, KPI Cards, Search, Filters, etc.)
- ✅ Table structure
- ✅ Complete specs for every component

**When to use:** Building any compliance page, need exact specs

---

#### **2. BASE_UI_COMPONENTS.md** (Quick Reference)
**What it covers:**
- ✅ Button styles (Primary, Secondary, Icon)
- ✅ Badge styles (Status, Icon, Count)
- ✅ Spacing reference guide
- ✅ Border radius guide
- ✅ Transitions & animations
- ✅ Interactive states
- ✅ Complete page template (copy-paste ready)

**When to use:** Quick lookup for spacing, buttons, badges

---

### **📄 Page-Specific Guides**

#### **3. AUTHORITIES_PAGE_SPEC.md** (Detailed Example)
**What it covers:**
- ✅ Every element on Authorities page
- ✅ Exact font sizes, colors, spacing
- ✅ KPI scorecard breakdown
- ✅ Grid vs List view comparison
- ✅ Icon mapping
- ✅ Interactive state details

**When to use:** Building a similar list/grid page, need pixel-perfect specs

---

### **🎨 Theme & Styling**

#### **4. ui-patterns.md** (Dark Theme)
**What it covers:**
- ✅ Dark theme color palette
- ✅ Table patterns (with vertical borders)
- ✅ Command Palette (⌘K)
- ✅ Navigation patterns
- ✅ Best practices

**When to use:** Building dark theme pages, table implementation

---

#### **5. LIGHT_THEME_PALETTE.md**
**What it covers:**
- ✅ Light theme colors
- ✅ Component examples in light theme
- ✅ Side-by-side comparison with dark

**When to use:** Implementing theme switching

---

#### **6. THEME_SWITCHING.md**
**What it covers:**
- ✅ How to implement light/dark toggle
- ✅ CSS variables approach
- ✅ Theme provider setup
- ✅ Toggle component

**When to use:** Adding theme switcher

---

### **🗂️ Navigation & Layout**

#### **7. ELEGANT_NAVIGATION.md**
**What it covers:**
- ✅ TopBar redesign
- ✅ Sidebar redesign
- ✅ Visual improvements
- ✅ Before/After comparison

**When to use:** Improving navigation components

---

### **📊 Visual References**

#### **8. UI_VISUAL_REFERENCE.md**
**What it covers:**
- ✅ ASCII art diagrams
- ✅ Color palette visuals
- ✅ Table structure diagrams
- ✅ Common mistakes (DON'T vs DO)

**When to use:** Visual learner, need quick diagrams

---

### **🤖 AI Integration**

#### **9. AI_CIRCULAR_INTEGRATION.md**
**What it covers:**
- ✅ AI service integration guide
- ✅ API details
- ✅ Upload component
- ✅ Display component
- ✅ Error handling

**When to use:** Integrating AI features

---

## 🎯 **Common Tasks**

### **Task: Build a New List/Grid Page**

**Steps:**
1. Copy template from `BASE_UI_COMPONENTS.md` → "Complete Page Template"
2. Reference `BASE_UI_SPECIFICATION.md` for component specs
3. Check `AUTHORITIES_PAGE_SPEC.md` for detailed example
4. Use `ui-patterns.md` for table implementation

---

### **Task: Create a KPI Card**

**Reference:**
- `BASE_UI_SPECIFICATION.md` → "2. KPI Scorecard"
- `BASE_UI_COMPONENTS.md` → "Quick Copy: Complete Page" → KPIs section

**Template:**
```tsx
<div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
  <p className="text-p3 text-[var(--foreground-muted)] font-medium">Label</p>
  <p className="text-h2 font-bold text-[var(--foreground)] mt-1">123</p>
</div>
```

---

### **Task: Add a Search Bar**

**Reference:**
- `BASE_UI_SPECIFICATION.md` → "3. Search Input"

**Template:**
```tsx
<div className="relative flex-1 max-w-md">
  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
  <input
    type="text"
    placeholder="Search..."
    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[var(--border)] rounded-lg text-p2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
  />
</div>
```

---

### **Task: Build a Table**

**Reference:**
- `ui-patterns.md` → "Polished Data Tables"
- `BASE_UI_SPECIFICATION.md` → "7. Table (List View)"

**Key rules:**
- ALL headers left-aligned
- Vertical borders between columns
- Header background: `bg-[var(--background-secondary)]`
- Auto-resize (no fixed widths)

---

### **Task: Style a Button**

**Reference:**
- `BASE_UI_COMPONENTS.md` → "Button Styles"

**Primary:**
```tsx
<button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-dark)] transition-all text-p2 font-medium shadow-sm hover:shadow-md">
  <Plus size={18} />
  Button Text
</button>
```

---

## 📊 **Design Token Quick Reference**

```typescript
// COLORS
--primary:          #0D9488  (Teal-600)
--foreground:       #0F172A  (Slate-900)
--foreground-muted: #64748B  (Slate-500)
--background:       #FAFAF9  (Stone-50)
--border:           #E7E5E4  (Stone-200)

// TYPOGRAPHY
text-h2: 32px  (KPI numbers)
text-p1: 16px  (Stat numbers)
text-p2: 14px  (Body text, names)
text-p3: 12px  (Labels)

// SPACING
p-5:      20px  (Cards)
px-4:     16px  (Buttons)
px-6:     24px  (Table cells)
gap-4:    16px  (Grids)
space-y-6: 24px  (Page sections)

// BORDER RADIUS
rounded-lg:  8px   (Inputs, icons)
rounded-xl:  12px  (Cards, buttons)

// ICONS
18px → Buttons, chevrons
20px → Card headers
16px → Table cells
```

---

## ✅ **Checklist: New Page**

- [ ] Copy page template from `BASE_UI_COMPONENTS.md`
- [ ] Add PageHeader with title, description, action button
- [ ] Add 4 KPI cards in grid
- [ ] Add search bar with icon
- [ ] Add filter buttons with active states
- [ ] Add view toggle (grid/list)
- [ ] Implement grid view with proper spacing
- [ ] Implement table view with vertical borders
- [ ] Add hover states to all interactive elements
- [ ] Add transitions (transition-all/colors/shadow)
- [ ] Test responsive breakpoints
- [ ] Verify all colors use CSS variables
- [ ] Check all text uses custom classes (text-p2, etc.)

---

## 🆘 **Troubleshooting**

**"My table headers are centered"**
→ Use `text-left` on all `<th>` elements

**"No vertical borders in table"**
→ Add `border-r border-[var(--border)]` to all columns except last

**"Colors don't match"**
→ Use CSS variables: `text-[var(--foreground)]`, not hardcoded colors

**"Spacing looks off"**
→ Check `BASE_UI_COMPONENTS.md` → "Spacing Reference"

**"Buttons don't look right"**
→ Copy exact classes from `BASE_UI_COMPONENTS.md` → "Button Styles"

---

## 📞 **Support**

**For design questions:** Check this index, then specific doc  
**For component examples:** `BASE_UI_COMPONENTS.md`  
**For exact specs:** `BASE_UI_SPECIFICATION.md`  
**For page examples:** `AUTHORITIES_PAGE_SPEC.md`

---

**Last Updated:** 2026-04-09  
**Version:** 1.0  
**Maintained by:** AI Assistant
