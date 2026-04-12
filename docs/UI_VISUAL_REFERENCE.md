# Visual Reference Guide - Dark Theme UI

## 🎨 Color Palette Visual

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  #0A0A0A  ████████████████  Background (Near-black)    │
│                                                         │
│  #1A1A1A  ████████████████  Surface (Cards, Tables)    │
│                                                         │
│  #2A2A2A  ████████████████  Border (Subtle)            │
│                                                         │
│  #FFFFFF  ████████████████  Text Primary (White)       │
│                                                         │
│  #9CA3AF  ████████████████  Text Secondary (Gray-400)  │
│                                                         │
│  #6B7280  ████████████████  Text Muted (Gray-500)      │
│                                                         │
│  #FCD34D  ████████████████  Accent (Yellow)            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 📊 Table Structure (WITH VERTICAL BORDERS)

```
┌────────────────────────────────────────────────────────────────────────┐
│ Table Container: bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl      │
├────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ THEAD: bg-[#0A0A0A] ← Dark background for distinction            │ │
│ ├───────────────┬───────────────┬───────────────┬────────────────────┤ │
│ │ Name          │ Status        │ Category      │ Actions            │ │
│ │ text-left ✅  │ text-left ✅  │ text-left ✅  │ text-left ✅       │ │
│ │ border-r ✅   │ border-r ✅   │ border-r ✅   │ (no border-r) ✅   │ │
│ ├───────────────┼───────────────┼───────────────┼────────────────────┤ │
│ │ AWS           │ Assessing...  │ CLOUD         │ ⋮                  │ │
│ │ border-r ✅   │ border-r ✅   │ border-r ✅   │                    │ │
│ ├───────────────┼───────────────┼───────────────┼────────────────────┤ │
│ │ GitHub        │ Active        │ DEV           │ ⋮                  │ │
│ │ border-r ✅   │ border-r ✅   │ border-r ✅   │                    │ │
│ └───────────────┴───────────────┴───────────────┴────────────────────┘ │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Pagination: border-t border-[#2A2A2A]                             │ │
│ │ Rows per page: 25           1-25 of 100          ‹  ›             │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

**Key Points:**
- ✅ **VERTICAL BORDERS** between all columns (except last)
- ✅ **HORIZONTAL BORDERS** between all rows
- ✅ **DARK HEADER BACKGROUND** (#0A0A0A)
- ✅ **ALL LEFT-ALIGNED** (never center/right)

## 🔲 Card/Container Pattern

```
┌──────────────────────────────────────────────────────────┐
│ bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6     │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Card Title (text-xl font-semibold text-white)   │    │
│  │ Description (text-sm text-gray-500)             │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Card Content                                    │    │
│  │                                                 │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## 🔘 Button Patterns

```
┌─────────────────────────────────────────────┐
│ PRIMARY (Yellow)                            │
│ ┌─────────────────────────────────────────┐ │
│ │ bg-[#FCD34D] text-black rounded-lg      │ │
│ │ Add Vendor                              │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ SECONDARY (Dark)                            │
│ ┌─────────────────────────────────────────┐ │
│ │ bg-[#1A1A1A] border border-[#2A2A2A]    │ │
│ │ Cancel                                  │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ ICON BUTTON                                 │
│ ┌───────┐                                   │
│ │  ⋮   │ hover:bg-[#2A2A2A] rounded        │
│ └───────┘                                   │
└─────────────────────────────────────────────┘
```

## 🔍 Search Input Pattern

```
┌────────────────────────────────────────────────────────┐
│ bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg       │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 🔍  Search...                                      │ │
│ │     placeholder-gray-500                           │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

## 📦 Badge Pattern

```
┌──────────┐  ┌──────────┐  ┌──────────┐
│  CLOUD   │  │  ACTIVE  │  │  DRAFT   │
│ bg-gray- │  │ bg-green │  │ bg-gray- │
│   800    │  │  -900/30 │  │   800    │
└──────────┘  └──────────┘  └──────────┘
uppercase, rounded, with border
```

## ⌘ Command Palette (Overlay)

```
┌──────────────────────────────────────────────────────────────┐
│ BACKDROP: bg-black/60 backdrop-blur-sm                       │
│                                                              │
│    ┌─────────────────────────────────────────────────┐      │
│    │ bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl │      │
│    ├─────────────────────────────────────────────────┤      │
│    │ 🔍  Search...                            ESC    │      │
│    ├─────────────────────────────────────────────────┤      │
│    │ NAVIGATION bg-[#0A0A0A]                        │      │
│    ├─────────────────────────────────────────────────┤      │
│    │ 📊  Overview                                   │      │
│    │ 📄  Policies                                   │      │
│    │ 🛡️  Controls                                   │      │
│    │ ✅  Evidence                                   │      │
│    └─────────────────────────────────────────────────┘      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 🎭 Modal Pattern

```
┌──────────────────────────────────────────────────────────────┐
│ BACKDROP: bg-black/60 backdrop-blur-sm                       │
│                                                              │
│         ┌──────────────────────────────────────┐            │
│         │ Header  bg-[#1A1A1A]            ✕   │            │
│         ├──────────────────────────────────────┤            │
│         │                                      │            │
│         │  Modal Body                          │            │
│         │  text-gray-400                       │            │
│         │                                      │            │
│         ├──────────────────────────────────────┤            │
│         │        Cancel      Confirm           │            │
│         │       (gray)      (yellow)           │            │
│         └──────────────────────────────────────┘            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 📏 Spacing System

```
Padding/Margin Scale:
─────────────────────
px-1   → 4px    (tiny)
px-2   → 8px    (small icons)
px-3   → 12px   (compact)
px-4   → 16px   (standard) ✅ Most common
px-6   → 24px   (cards)
px-8   → 32px   (page margins)

py-1   → 4px
py-2   → 8px
py-2.5 → 10px   (buttons)
py-3   → 12px   (table headers)
py-3.5 → 14px   (table cells) ✅
py-4   → 16px
```

## 🎯 Icon Sizing Guide

```
Tables:     size={16}   w-4 h-4   ✅
UI:         size={20}   w-5 h-5   ✅
Headers:    size={24}   w-6 h-6   ✅
Large:      size={32}   w-8 h-8
```

## 🌈 Status Color System

```
✅ Success/Active:     green-400, green-700, green-900/30
⚠️  Warning/Pending:   yellow-400, yellow-700, yellow-900/30
❌ Error/Overdue:      red-400, red-700, red-900/30
ℹ️  Info/Processing:  blue-400, blue-700, blue-900/30
⚪ Neutral/Draft:      gray-400, gray-700, gray-800
```

## 🔄 Hover State Pattern

```
DEFAULT STATE          HOVER STATE
─────────────         ─────────────
bg-[#1A1A1A]    →    bg-[#2A2A2A]
text-gray-400   →    text-white
border-[#2A2A2A] →   border-[#3A3A3A]

Always add: transition-colors ✅
```

## 📐 Border Radius Guide

```
rounded      → 4px   (small elements)
rounded-lg   → 8px   (buttons, inputs) ✅
rounded-xl   → 12px  (cards, modals) ✅
rounded-full → 9999px (avatars, badges)
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ **DON'T:**
```tsx
// Pure black background
<div className="bg-black">

// Center-aligned table headers
<th className="text-center">Status</th>

// Missing vertical borders in tables
<td className="px-4 py-3.5">Cell</td>

// Fixed column widths
<table className="w-full table-fixed">

// Missing header background
<thead>
  <tr>...</tr>
</thead>

// Right-aligned Actions column
<th className="text-right">Actions</th>
```

### ✅ **DO:**
```tsx
// Near-black background
<div className="bg-[#0A0A0A]">

// Left-aligned table headers
<th className="text-left">Status</th>

// Vertical borders in tables
<td className="px-4 py-3.5 border-r border-[#2A2A2A]">Cell</td>

// Auto-resizing columns
<table className="w-full">

// Dark header background
<thead className="bg-[#0A0A0A]">
  <tr>...</tr>
</thead>

// Left-aligned Actions column
<th className="text-left">Actions</th>
```

---

**Last Updated:** 2026-04-09  
**Version:** 2.0  
**Reference Implementation:** `/src/app/vendors/page.tsx`
