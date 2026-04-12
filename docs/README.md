# 📚 Design System Documentation

Complete documentation for the Compliance Instance V1.0 dark theme UI design system.

---

## 🎯 **Start Here**

### **For AI Agents**
If you're an AI agent building features for this app:

1. **Read First:** [`ui-patterns.md`](./ui-patterns.md) - Complete implementation guide (1,000+ lines)
2. **Visual Reference:** [`UI_VISUAL_REFERENCE.md`](./UI_VISUAL_REFERENCE.md) - ASCII diagrams and examples
3. **Live Example:** Browse to `/vendors` or `/ui-showcase` to see everything in action

### **For Developers**
If you're a human developer:

1. **Quick Start:** Read the "Quick Reference" section in [`ui-patterns.md`](./ui-patterns.md)
2. **Copy-Paste:** Use the snippets in "Quick Copy-Paste Snippets" section
3. **Checklist:** Follow the "Implementation Checklist" when building new pages

---

## 📄 **Documentation Files**

### **1. ui-patterns.md** (Main Reference)
**Size:** 1,000+ lines  
**Purpose:** Complete design system documentation

**Contents:**
- ✅ Color palette (exact hex codes)
- ✅ Typography system
- ✅ Component library (20+ components)
- ✅ Table patterns (WITH vertical borders)
- ✅ Layout patterns
- ✅ Animation guidelines
- ✅ Implementation checklist
- ✅ Copy-paste snippets
- ✅ Best practices and anti-patterns

**When to use:** Reference this for ANY UI work

---

### **2. UI_VISUAL_REFERENCE.md** (Visual Guide)
**Size:** 200+ lines  
**Purpose:** Quick visual reference with ASCII diagrams

**Contents:**
- ✅ Color palette visual
- ✅ Table structure diagram (shows vertical borders)
- ✅ Card patterns
- ✅ Button patterns
- ✅ Modal overlay pattern
- ✅ Spacing/sizing guides
- ✅ Common mistakes (DON'T vs DO)

**When to use:** Quick visual lookup, understanding structure

---

## 🎨 **Design System Overview**

### **Core Principles**

1. **Dark Theme First**
   - Background: `#0A0A0A` (NOT pure black)
   - Surface: `#1A1A1A` (cards, tables)
   - Border: `#2A2A2A` (subtle)

2. **Consistency Over Creativity**
   - Use exact color values
   - Follow spacing system
   - Copy existing patterns

3. **Professional Polish**
   - Vertical borders in ALL tables
   - Left-align ALL headers
   - Hover states everywhere
   - Smooth transitions always

4. **Accessibility**
   - High contrast text
   - Generous padding/spacing
   - Clear visual hierarchy
   - Keyboard navigation support

---

## 🚀 **Quick Implementation Guide**

### **Building a New Page?**

```bash
# 1. Read the Page Template
See ui-patterns.md → "New Page Template"

# 2. Copy the structure
- Dark background (bg-[#0A0A0A])
- Page header (title + description)
- Search/filter bar
- Main content in cards

# 3. Follow the checklist
See ui-patterns.md → "Implementation Checklist"
```

### **Adding a Table?**

```bash
# CRITICAL REQUIREMENTS:
✅ Header background: bg-[#0A0A0A]
✅ ALL headers: text-left (never center/right)
✅ Vertical borders: border-r border-[#2A2A2A] on all columns except last
✅ Auto-resize: w-full (no table-fixed)
✅ Hover states: hover:bg-[#1A1A1A]/50

# See complete example in:
ui-patterns.md → "Polished Data Tables"
src/app/vendors/page.tsx (reference implementation)
```

### **Creating a Modal?**

```bash
# Pattern:
- Backdrop: bg-black/60 backdrop-blur-sm
- Modal: bg-[#1A1A1A] border border-[#2A2A2A]
- Header: border-b border-[#2A2A2A]
- Footer: border-t border-[#2A2A2A]

# See example in:
ui-patterns.md → "Modal/Dialog" section
```

---

## 🔍 **Finding What You Need**

### **"I need to know the exact color for..."**
→ `ui-patterns.md` → "Dark Theme Palette"

### **"How do I build a table with vertical borders?"**
→ `ui-patterns.md` → "Polished Data Tables"  
→ `UI_VISUAL_REFERENCE.md` → "Table Structure"

### **"What spacing should I use?"**
→ `ui-patterns.md` → "Spacing System"  
→ `UI_VISUAL_REFERENCE.md` → "Spacing System"

### **"How do I style buttons?"**
→ `ui-patterns.md` → "Component Library" → "Buttons"  
→ `UI_VISUAL_REFERENCE.md` → "Button Patterns"

### **"Show me a complete page example"**
→ `ui-patterns.md` → "Quick Copy-Paste Snippets" → "New Page Template"  
→ Browse to `/vendors` or `/ui-showcase` in the app

---

## ✅ **Implementation Checklist**

Before committing any UI work, verify:

### **General**
- [ ] Background is `bg-[#0A0A0A]` (not black)
- [ ] Cards use `bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl`
- [ ] All borders are `border-[#2A2A2A]`
- [ ] All interactive elements have hover states
- [ ] All transitions use `transition-colors`

### **Tables** (CRITICAL)
- [ ] Header has `bg-[#0A0A0A]`
- [ ] ALL headers are `text-left`
- [ ] Vertical borders on all columns except last
- [ ] Table is `w-full` (no fixed widths)
- [ ] Rows have hover: `hover:bg-[#1A1A1A]/50`

### **Typography**
- [ ] Page title: `text-3xl font-bold text-white`
- [ ] Description: `text-gray-500`
- [ ] Table headers: `text-xs font-semibold uppercase text-gray-500`
- [ ] Table cells: `text-sm`

### **Spacing**
- [ ] Page padding: `p-8`
- [ ] Card padding: `p-6`
- [ ] Table cells: `px-4 py-3.5`
- [ ] Gaps between cards: `gap-6`

---

## 🎓 **Learning Path**

### **For New Team Members:**

**Week 1:** Read & Understand
- Read `ui-patterns.md` Quick Reference section
- Browse `/vendors` page source code
- Try building a simple card layout

**Week 2:** Practice
- Build a new page using the Page Template
- Add a table following the table pattern
- Get code review feedback

**Week 3:** Master
- Refactor existing page to match design system
- Create complex layouts
- Help others with design system questions

---

## 📊 **Reference Implementations**

### **Perfect Examples** (Copy These!)

| Component | File | Line | Notes |
|-----------|------|------|-------|
| Table with vertical borders | `src/app/vendors/page.tsx` | 107-204 | ⭐ Reference implementation |
| Command Palette | `src/components/CommandPalette.tsx` | 100-227 | Blur, dark theme |
| Dual Sidebar | `src/components/DualSidebar.tsx` | 1-150 | Icon + detail nav |
| Search Input | `src/app/vendors/page.tsx` | 91-100 | With icon |
| Page Header | `src/app/vendors/page.tsx` | 72-76 | Title + description |

---

## 🆘 **Common Issues & Solutions**

### **"My table headers are centered"**
❌ `<th className="text-center">`  
✅ `<th className="text-left">`

### **"My table columns are too wide/narrow"**
❌ `<table className="w-full table-fixed">`  
✅ `<table className="w-full">`

### **"My table looks plain"**
❌ Missing `bg-[#0A0A0A]` on `<thead>`  
✅ `<thead className="bg-[#0A0A0A]">`

### **"I don't see vertical lines in my table"**
❌ `<td className="px-4 py-3.5">`  
✅ `<td className="px-4 py-3.5 border-r border-[#2A2A2A]">`

---

## 📞 **Support**

**For Questions:**
- Check `ui-patterns.md` first
- Look at `/vendors` page implementation
- Search this repo for similar patterns

**For Updates:**
When updating the design system, update:
1. `ui-patterns.md` (main docs)
2. `UI_VISUAL_REFERENCE.md` (visuals)
3. This README (if structure changes)

---

**Last Updated:** 2026-04-09  
**Design System Version:** 2.0  
**Maintainer:** AI Assistant  
**Repository:** Compliance Instance V1.0
