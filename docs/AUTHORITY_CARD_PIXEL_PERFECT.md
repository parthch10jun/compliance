# 📐 Authority Card - Pixel Perfect Specification

> **Every measurement for the authority cards (RBI, SEBI, etc.)**

---

## 📦 **Card Container**

### **Grid Layout:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

**Breakpoints:**
- Mobile (default): `1 column` (100% width)
- Tablet (768px+): `2 columns` (50% width each - gap)
- Desktop (1024px+): `3 columns` (33.33% width each - gap)

**Gap:** `16px` between cards (gap-4)

### **Card Width:**
- **Desktop (1024px+):** `calc((100% - 32px) / 3)` = ~31.7% of container
- **Tablet (768px+):** `calc((100% - 16px) / 2)` = ~48% of container  
- **Mobile:** `100%` of container

**Example at 1440px viewport:**
- Container: ~1200px (with padding)
- Card width: ~384px each
- Gap: 16px between

---

## 🎨 **Card Outer Container**

```tsx
className="p-5 rounded-xl bg-white border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-lg transition-all cursor-pointer group"
```

### **Measurements:**

| Property | Value | Pixels | Notes |
|----------|-------|--------|-------|
| **Padding** | `p-5` | `20px all sides` | Equal padding on all 4 sides |
| **Border Radius** | `rounded-xl` | `12px` | Large, modern corners |
| **Border Width** | `border` | `1px` | Thin border |
| **Border Color** | `var(--border)` | `#E7E5E4` | Stone-200 |
| **Background** | `white` | `#FFFFFF` | Pure white |
| **Min Height** | Auto | ~180-200px | Depends on content |
| **Cursor** | `pointer` | - | Clickable |

### **Hover State:**
| Property | Default | Hover | Transition |
|----------|---------|-------|------------|
| Border Color | `#E7E5E4` | `#0D9488` (teal) | 150ms |
| Box Shadow | none | `0 10px 15px -3px rgba(0,0,0,0.1)` | 150ms |

---

## 📋 **Card Header Section**

```tsx
<div className="flex items-start justify-between mb-3">
```

### **Layout:**
- Display: `flex`
- Justify: `space-between` (icon badge left, chevron right)
- Align: `items-start` (top alignment)
- Bottom Margin: `12px` (mb-3)

### **Left Side (Icon + Text):**
```tsx
<div className="flex items-center gap-3">
```
- Display: `flex`
- Align: `items-center` (vertically centered)
- Gap: `12px` between icon badge and text

---

## 🎨 **Icon Badge**

```tsx
<div className="w-10 h-10 rounded-lg flex items-center justify-center border">
```

### **Measurements:**

| Property | Value | Pixels | Notes |
|----------|-------|--------|-------|
| **Width** | `w-10` | `40px` | Fixed width |
| **Height** | `h-10` | `40px` | Fixed height (square) |
| **Border Radius** | `rounded-lg` | `8px` | Medium corners |
| **Border Width** | `border` | `1px` | Thin border |
| **Display** | `flex` | - | For centering icon |
| **Justify** | `center` | - | Horizontal center |
| **Align** | `center` | - | Vertical center |

### **Colors by Type:**

| Type | Background | Text/Icon | Border |
|------|------------|-----------|--------|
| **Regulator** | `bg-blue-100` (#DBEAFE) | `text-blue-700` (#1D4ED8) | `border-blue-200` (#BFDBFE) |
| **Standards Body** | `bg-purple-100` (#F3E8FF) | `text-purple-700` (#7E22CE) | `border-purple-200` (#E9D5FF) |
| **Jurisdiction** | `bg-green-100` (#DCFCE7) | `text-green-700` (#15803D) | `border-green-200` (#BBF7D0) |
| **Category** | `bg-amber-100` (#FEF3C7) | `text-amber-700` (#B45309) | `border-amber-200` (#FDE68A) |
| **Other** | `bg-gray-100` (#F3F4F6) | `text-gray-700` (#374151) | `border-gray-200` (#E5E7EB) |

### **Icon Inside Badge:**
- Size: `20px` (size={20})
- Color: Inherits from badge text color
- Common icons: `Building2`, `Shield`, `Globe`, `FileText`, `Tag`

---

## 📝 **Text Section (Next to Icon)**

```tsx
<div>
  <h3 className="text-p2 font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
    Reserve Bank of India
  </h3>
  <p className="text-p3 text-[var(--foreground-muted)]">
    Regulator
  </p>
</div>
```

### **Authority Name (h3):**

| Property | Value | Pixels | Notes |
|----------|-------|--------|-------|
| **Font Size** | `text-p2` | `14px` | Custom class |
| **Font Weight** | `font-semibold` | `600` | Semi-bold |
| **Color (default)** | `var(--foreground)` | `#0F172A` | Dark slate |
| **Color (hover)** | `var(--primary)` | `#0D9488` | Teal |
| **Line Height** | Default | ~20px | 1.4-1.5 ratio |
| **Transition** | `colors` | 150ms | Smooth color change |

### **Type Label (p):**

| Property | Value | Pixels | Notes |
|----------|-------|--------|-------|
| **Font Size** | `text-p3` | `12px` | Custom class |
| **Font Weight** | `normal` | `400` | Regular |
| **Color** | `var(--foreground-muted)` | `#64748B` | Muted gray |
| **Line Height** | Default | ~16px | 1.3-1.4 ratio |
| **Margin Top** | Auto | ~2px | Natural spacing |

---

## ➡️ **ChevronRight Icon**

```tsx
<ChevronRight size={18} className="text-[var(--foreground-muted)] group-hover:text-[var(--primary)] transition-colors" />
```

### **Measurements:**

| Property | Value | Pixels | Notes |
|----------|-------|--------|-------|
| **Size** | `18` | `18px × 18px` | Width and height |
| **Color (default)** | `var(--foreground-muted)` | `#64748B` | Muted gray |
| **Color (hover)** | `var(--primary)` | `#0D9488` | Teal |
| **Transition** | `colors` | 150ms | Smooth color change |
| **Stroke Width** | `2` | 2px | lucide-react default |

---

## 📊 **Stats Section**

```tsx
<div className="mt-3 pt-3 border-t border-[var(--border)] grid grid-cols-4 gap-2 text-center">
```

### **Container Measurements:**

| Property | Value | Pixels | Notes |
|----------|-------|--------|-------|
| **Margin Top** | `mt-3` | `12px` | Space from header |
| **Padding Top** | `pt-3` | `12px` | Space from border |
| **Border Top Width** | `border-t` | `1px` | Thin separator |
| **Border Color** | `var(--border)` | `#E7E5E4` | Stone-200 |
| **Display** | `grid` | - | CSS Grid |
| **Columns** | `grid-cols-4` | 4 equal columns | 25% each |
| **Gap** | `gap-2` | `8px` | Between columns |
| **Text Align** | `text-center` | Center | All text centered |

---

## 🔢 **Individual Stat**

```tsx
<div>
  <p className="text-p1 font-semibold text-[var(--foreground)]">12</p>
  <p className="text-p3 text-[var(--foreground-muted)]">Programs</p>
</div>
```

### **Stat Number:**

| Property | Value | Pixels | Notes |
|----------|-------|--------|-------|
| **Font Size** | `text-p1` | `16px` | Custom class |
| **Font Weight** | `font-semibold` | `600` | Semi-bold |
| **Color** | `var(--foreground)` | `#0F172A` | Dark slate |
| **Line Height** | Default | ~22px | 1.4 ratio |

### **Stat Label:**

| Property | Value | Pixels | Notes |
|----------|-------|--------|-------|
| **Font Size** | `text-p3` | `12px` | Custom class |
| **Font Weight** | `normal` | `400` | Regular |
| **Color** | `var(--foreground-muted)` | `#64748B` | Muted gray |
| **Line Height** | Default | ~16px | 1.3 ratio |
| **Margin Top** | Auto | ~2px | Natural spacing |

### **Stat Labels (Shortened):**
- Programs → "Programs"
- Requirements → "Reqs" (shortened to fit)
- Obligations → "Obls" (shortened to fit)
- Controls → "Controls"

---

## 📐 **Complete Card Dimensions**

### **At Desktop (3-column grid):**
- **Total Width:** ~384px (example at 1200px container)
- **Content Width:** 344px (384px - 40px padding)
- **Total Height:** ~180-200px (auto, depends on text wrapping)

### **Breakdown:**
```
┌────────────────────────────────────────┐
│ 20px padding                           │ ← p-5 top
│ ┌────────────────────────────────────┐ │
│ │ Header Section (52px height)       │ │
│ │ ┌──┐ Name                        ➤ │ │
│ │ │40│ Type                           │ │
│ │ └──┘                                │ │
│ └────────────────────────────────────┘ │
│ 12px margin                            │ ← mb-3
│ ┌────────────────────────────────────┐ │
│ │ 1px border                         │ │ ← border-t
│ │ 12px padding                       │ │ ← pt-3
│ │ Stats Section (60px height)        │ │
│ │ ┌──┐ ┌──┐ ┌──┐ ┌──┐              │ │
│ │ │12│ │45│ │32│ │8 │ ← Numbers    │ │
│ │ └──┘ └──┘ └──┘ └──┘              │ │
│ │  P    R    O    C   ← Labels     │ │
│ └────────────────────────────────────┘ │
│ 20px padding                           │ ← p-5 bottom
└────────────────────────────────────────┘
      20px ←→ content ←→ 20px
```

### **Height Breakdown:**
- Top padding: 20px
- Header height: ~52px (40px icon + 12px gap consideration)
- Header margin: 12px
- Border: 1px
- Stats padding: 12px
- Stats content: ~60px (16px number + 2px + 12px label + padding)
- Bottom padding: 20px
- **Total:** ~177px minimum (can grow with text wrapping)

---

## 🎭 **Animation**

```tsx
style={{ animationDelay: `${idx * 50}ms` }}
className="... animate-fade-in-up delay-2"
```

### **Stagger Effect:**
- Each card delays by: `50ms × card index`
- Card 1: 0ms delay
- Card 2: 50ms delay
- Card 3: 100ms delay
- Card 4: 150ms delay
- etc.

### **Fade-in-up Animation:**
- Duration: 300ms
- Easing: ease-out
- From: opacity 0, translateY(16px)
- To: opacity 1, translateY(0)

---

---

## 📊 **Visual Measurement Diagram**

```
┌──────────────────────────────────────────────────────────────┐
│                         384px (example)                       │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │                     20px padding (p-5)                   │ │
│ │ ┌──────────────────────────────────────────────────────┐ │ │
│ │ │                    HEADER SECTION                     │ │ │
│ │ │ ┌───────────────────────────────┐    ┌─────────────┐ │ │ │
│ │ │ │ ┌────┐                        │    │             │ │ │ │
│ │ │ │ │ 🏛️ │ Reserve Bank of India ←─┼─14px─→ ➤       │ │ │ │
│ │ │ │ │40px│ Regulator ←12px        │    │18px × 18px  │ │ │ │
│ │ │ │ └────┘                        │    │             │ │ │ │
│ │ │ │  ↑                            │    └─────────────┘ │ │ │
│ │ │ │ 40px                          │                    │ │ │
│ │ │ │ Icon                          │                    │ │ │
│ │ │ │ (20px icon inside)            │                    │ │ │
│ │ │ └───────────────────────────────┘                    │ │ │
│ │ │                 ↑ 12px gap (gap-3)                   │ │ │
│ │ └──────────────────────────────────────────────────────┘ │ │
│ │                     12px margin (mb-3)                   │ │
│ │ ┌──────────────────────────────────────────────────────┐ │ │
│ │ │ 1px border-t (#E7E5E4) ──────────────────────────── │ │ │
│ │ │                     12px padding (pt-3)              │ │ │
│ │ │                    STATS SECTION                     │ │ │
│ │ │ ┌────────┬────────┬────────┬────────┐              │ │ │
│ │ │ │   12   │   45   │   32   │    8   │ ← 16px       │ │ │
│ │ │ │Programs│  Reqs  │  Obls  │Controls│ ← 12px       │ │ │
│ │ │ │  25%   │  25%   │  25%   │  25%   │              │ │ │
│ │ │ └────────┴────────┴────────┴────────┘              │ │ │
│ │ │         ↑ 8px gap between columns (gap-2)           │ │ │
│ │ └──────────────────────────────────────────────────────┘ │ │
│ │                     20px padding (p-5)                   │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ ← 20px →              344px content              ← 20px →   │
└──────────────────────────────────────────────────────────────┘
         ↑                                              ↑
    Border 1px                                    Border 1px
    (#E7E5E4)                                     (#E7E5E4)
```

---

## 📏 **Quick Reference Table**

### **All Measurements at a Glance:**

| Element | Property | Value | Pixels |
|---------|----------|-------|--------|
| **Card** | Padding | `p-5` | 20px all sides |
| **Card** | Border radius | `rounded-xl` | 12px |
| **Card** | Border width | `1px` | 1px |
| **Icon Badge** | Size | `w-10 h-10` | 40px × 40px |
| **Icon Badge** | Radius | `rounded-lg` | 8px |
| **Icon Inside** | Size | `size={20}` | 20px × 20px |
| **Header Gap** | Icon to text | `gap-3` | 12px |
| **Header Margin** | Bottom | `mb-3` | 12px |
| **Name** | Font size | `text-p2` | 14px |
| **Name** | Font weight | `font-semibold` | 600 |
| **Type** | Font size | `text-p3` | 12px |
| **Chevron** | Size | `size={18}` | 18px × 18px |
| **Stats** | Margin top | `mt-3` | 12px |
| **Stats** | Padding top | `pt-3` | 12px |
| **Stats** | Grid gap | `gap-2` | 8px |
| **Stat Number** | Font size | `text-p1` | 16px |
| **Stat Number** | Font weight | `font-semibold` | 600 |
| **Stat Label** | Font size | `text-p3` | 12px |

---

## 🎨 **Color Reference**

### **CSS Variables:**
```css
--foreground:       #0F172A  /* Dark slate - primary text */
--foreground-muted: #64748B  /* Muted gray - secondary text */
--border:           #E7E5E4  /* Stone-200 - borders */
--primary:          #0D9488  /* Teal-600 - hover accent */
--background:       #FAFAF9  /* Stone-50 - page background */
```

### **Type-Specific Colors (Icon Badges):**
```css
/* Regulator */
background: #DBEAFE  (blue-100)
text:       #1D4ED8  (blue-700)
border:     #BFDBFE  (blue-200)

/* Standards Body */
background: #F3E8FF  (purple-100)
text:       #7E22CE  (purple-700)
border:     #E9D5FF  (purple-200)

/* Jurisdiction */
background: #DCFCE7  (green-100)
text:       #15803D  (green-700)
border:     #BBF7D0  (green-200)

/* Category */
background: #FEF3C7  (amber-100)
text:       #B45309  (amber-700)
border:     #FDE68A  (amber-200)
```

---

## 💡 **Copy-Paste Ready Code**

```tsx
<div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-lg transition-all cursor-pointer group">
  {/* Header */}
  <div className="flex items-start justify-between mb-3">
    <div className="flex items-center gap-3">
      {/* Icon Badge - 40x40px */}
      <div className="w-10 h-10 rounded-lg flex items-center justify-center border bg-blue-100 text-blue-700 border-blue-200">
        <Building2 size={20} />
      </div>

      {/* Text */}
      <div>
        <h3 className="text-p2 font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
          Reserve Bank of India
        </h3>
        <p className="text-p3 text-[var(--foreground-muted)]">
          Regulator
        </p>
      </div>
    </div>

    {/* Chevron - 18px */}
    <ChevronRight size={18} className="text-[var(--foreground-muted)] group-hover:text-[var(--primary)] transition-colors" />
  </div>

  {/* Stats - 4 columns, 8px gap */}
  <div className="mt-3 pt-3 border-t border-[var(--border)] grid grid-cols-4 gap-2 text-center">
    <div>
      <p className="text-p1 font-semibold text-[var(--foreground)]">12</p>
      <p className="text-p3 text-[var(--foreground-muted)]">Programs</p>
    </div>
    <div>
      <p className="text-p1 font-semibold text-[var(--foreground)]">45</p>
      <p className="text-p3 text-[var(--foreground-muted)]">Reqs</p>
    </div>
    <div>
      <p className="text-p1 font-semibold text-[var(--foreground)]">32</p>
      <p className="text-p3 text-[var(--foreground-muted)]">Obls</p>
    </div>
    <div>
      <p className="text-p1 font-semibold text-[var(--foreground)]">8</p>
      <p className="text-p3 text-[var(--foreground-muted)]">Controls</p>
    </div>
  </div>
</div>
```

---

**Last Updated:** 2026-04-09
**Page:** `/authorities`
**Card Type:** Grid View Authority Card
**Total Measurements:** 25+ exact specifications
