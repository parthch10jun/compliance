# ⚡ Quick Fix Checklist - Make Any Page Match Compliance Instance

> **Print this out and check off each item as you fix your page**

---

## 🎯 **The 15-Minute Transformation**

### **Step 1: KPI Cards (2 min)**
- [ ] Change `p-3` → `p-5`
- [ ] Change `rounded` → `rounded-xl`
- [ ] Change label size to `text-p3` (12px)
- [ ] Change number size to `text-h2` (32px)
- [ ] Add `border border-[var(--border)]`
- [ ] Add `hover:shadow-md transition-shadow`
- [ ] Add `mt-1` between label and number

**Before:** `<div className="p-3 rounded shadow-sm">`  
**After:** `<div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">`

---

### **Step 2: Authority Cards (5 min)**
- [ ] Change `p-3` → `p-5`
- [ ] Change `rounded` → `rounded-xl`
- [ ] Add colored icon badge (40x40px)
- [ ] Add ChevronRight to right side
- [ ] Add `hover:border-[var(--primary)] hover:shadow-lg`
- [ ] Add `group` class to card
- [ ] Add `group-hover:text-[var(--primary)]` to name and chevron
- [ ] Add `border-t border-[var(--border)]` above stats
- [ ] Change stat numbers to `text-p1` (16px)
- [ ] Change `gap-1` → `gap-2` in stats grid

**Icon Badge Template:**
```tsx
<div className="w-10 h-10 rounded-lg flex items-center justify-center border bg-blue-100 text-blue-700 border-blue-200">
  <Building2 size={20} />
</div>
```

---

### **Step 3: Search Bar (2 min)**
- [ ] Wrap input in relative div
- [ ] Add Search icon positioned absolute
- [ ] Change `px-3` → `pl-10 pr-4` (to accommodate icon)
- [ ] Change `py-2` → `py-2.5`
- [ ] Change `rounded` → `rounded-lg`
- [ ] Add focus ring: `focus:ring-2 focus:ring-[var(--primary)]/20`

---

### **Step 4: Filters (2 min)**
- [ ] Active filter: `bg-[var(--primary-lightest)] text-[var(--primary)] border border-[var(--primary)]`
- [ ] Inactive filter: `bg-white text-[var(--foreground-muted)] border border-[var(--border)]`
- [ ] Change `px-3 py-1.5` → `px-4 py-2`
- [ ] Change `rounded` → `rounded-lg`
- [ ] Add `transition-colors`
- [ ] Add hover: `hover:bg-[var(--background-secondary)]`

---

### **Step 5: View Toggle (2 min)**
- [ ] Add container: `<div className="flex gap-1 bg-[var(--background-secondary)] p-1 rounded-lg">`
- [ ] Add Grid button with Grid3X3 icon
- [ ] Add List button with List icon
- [ ] Active: `bg-[var(--primary)] text-white`
- [ ] Inactive: `bg-transparent text-[var(--foreground-muted)]`

**Template:**
```tsx
<div className="flex gap-1 bg-[var(--background-secondary)] p-1 rounded-lg">
  <button className={viewMode === 'grid' ? 'p-2 rounded-lg bg-[var(--primary)] text-white' : 'p-2 rounded-lg bg-transparent text-[var(--foreground-muted)] hover:bg-white'}>
    <Grid3X3 size={18} />
  </button>
  <button className={viewMode === 'list' ? 'p-2 rounded-lg bg-[var(--primary)] text-white' : 'p-2 rounded-lg bg-transparent text-[var(--foreground-muted)] hover:bg-white'}>
    <List size={18} />
  </button>
</div>
```

---

### **Step 6: Spacing (2 min)**
- [ ] Page sections: Change `space-y-4` → `space-y-6`
- [ ] KPI grid: Change `gap-2` or `gap-3` → `gap-4`
- [ ] Authority grid: Change to `gap-4`
- [ ] Icon + text: Use `gap-3`
- [ ] Filter buttons: Use `gap-2`

---

## 🎨 **CSS Variables Checklist**

Add to your `globals.css`:

- [ ] `--primary: #0D9488;`
- [ ] `--primary-lightest: #CCFBF1;`
- [ ] `--foreground: #0F172A;`
- [ ] `--foreground-muted: #64748B;`
- [ ] `--background-secondary: #F5F5F4;`
- [ ] `--border: #E7E5E4;`
- [ ] `.text-h2 { font-size: 32px; }`
- [ ] `.text-p1 { font-size: 16px; }`
- [ ] `.text-p2 { font-size: 14px; }`
- [ ] `.text-p3 { font-size: 12px; }`

---

## ⚡ **Quick Reference**

### **Padding:**
```
Small elements:  p-2  (8px)
Cards:           p-5  (20px)
Buttons:         px-4 py-2.5
Table cells:     px-6 py-4
```

### **Border Radius:**
```
Small:  rounded     (4px)
Medium: rounded-lg  (8px)
Large:  rounded-xl  (12px)
```

### **Gaps:**
```
Tight:    gap-1  (4px)
Normal:   gap-2  (8px)
Standard: gap-3  (12px)
Cards:    gap-4  (16px)
Sections: gap-6  (24px)
```

### **Font Sizes:**
```
KPI numbers:  text-h2  (32px)
Stat numbers: text-p1  (16px)
Body text:    text-p2  (14px)
Labels:       text-p3  (12px)
```

### **Icon Sizes:**
```
Table:        16px
Buttons:      18px
Card header:  20px
Page header:  24px
```

---

## ✅ **Final Checks**

- [ ] All cards have `p-5` padding
- [ ] All cards have `rounded-xl` radius
- [ ] All KPI numbers are `text-h2`
- [ ] All authority cards have colored icon badges
- [ ] All authority cards have chevron arrows
- [ ] Search bar has icon inside
- [ ] View toggle exists (grid/list)
- [ ] Filters use teal color scheme
- [ ] All spacing is `gap-4` or larger
- [ ] All hover effects work
- [ ] All transitions added
- [ ] Page sections use `space-y-6`

---

## 🎯 **Time Estimate**

- KPI Cards: 2 minutes
- Authority Cards: 5 minutes
- Search Bar: 2 minutes
- Filters: 2 minutes
- View Toggle: 2 minutes
- Spacing: 2 minutes

**Total: ~15 minutes**

---

**Print this checklist and keep it handy!** ✅
