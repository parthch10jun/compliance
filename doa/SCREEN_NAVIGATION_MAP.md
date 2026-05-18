# 📍 DoA Module - Complete Screen Navigation Map

## 🎯 **ALL 9 SCREENS - HOW TO ACCESS WITHIN THE APPLICATION**

### **Screen 1: Approvals Inbox** ✅
**Path:** `/doa/approvals-inbox`

**How to Access:**
1. Click "**My Work**" in left sidebar
2. Or click "**Approvals**" in left sidebar → "Inbox"
3. Shows: Pending approvals, SLA countdown, filters, batch actions

---

### **Screen 2: Approval Detail** ✅
**Path:** `/doa/approvals/apr-001`

**How to Access:**
1. From **Screen 1** (Approvals Inbox)
2. Click any approval card (e.g., "APR-000045 - Salesforce License Renewal")
3. Shows: Full request details, approval actions, timeline, MFA for $100K+

---

### **Screen 3: Authority Matrix Grid View** ✅
**Path:** `/doa/authority-matrix/matrix-004/grid`

**How to Access:**
1. Click "**Authority Matrix**" in left sidebar
2. Click "**Procurement Authority Matrix**" card
3. Click "**View in Grid**" button (top-right, amber border)
4. Shows: 5 tabs (Grid, Tree, Versions, Diff, Settings), filters, row inspector

**Alternative Direct Access:**
- Sidebar → Authority Matrix → All Matrices → Click any matrix → View in Grid

---

### **Screen 4: Authority Matrix Builder (Edit)** ✅
**Path:** `/doa/authority-matrix/matrix-004/edit`

**How to Access:**
1. Click "**Authority Matrix**" in left sidebar
2. Click "**Procurement Authority Matrix**" card
3. Click "**Edit Matrix**" button
4. Shows: Two-pane editor with structure tree (left) and row editor (right), threshold band editor

**Alternative:**
- From Screen 3 (Grid View) → Click "**Edit**" button in top-right

---

### **Screen 5: Matrix Simulator** ✅
**Path:** `/doa/authority-matrix/simulate`

**How to Access:**
1. Click "**Authority Matrix**" in left sidebar
2. Click "**Simulator**" tab or button
3. Shows: Two-pane layout - hypothetical request (left), routing results with "Why this chain?" (right)

**Alternative:**
- From any Matrix detail page → Click "**Simulate**" button

---

### **Screen 6: Delegations List & Calendar** ✅
**Path:** `/doa/delegations`

**How to Access:**
1. Click "**Delegations**" in left sidebar
2. Shows: 5 tabs (Active, Scheduled, Expired, Revoked, My delegations)
3. Features: Filters, table with calendar on right, selected delegation highlighting

---

### **Screen 7: Create Delegation Wizard** ✅
**Path:** `/doa/delegations/new`

**How to Access:**
1. From **Screen 6** (Delegations)
2. Click "**New delegation**" button (top-right, amber)
3. Shows: 4-step wizard:
   - Step 1: Select Delegate
   - Step 2: Scope & Limits (with live preview)
   - Step 3: Conflicts & Approval
   - Step 4: Review & Submit

**Features:**
- ✓ Next/Back navigation works
- ✓ "Run conflicts" button shows SoD check
- ✓ "View affected" button shows impacted requests
- ✓ Live pre-flight panel updates in real-time

---

### **Screen 8: Policy Versions & Diff View** ✅
**Path:** `/doa/policies/procurement`

**How to Access:**
1. Click "**Policy Management**" in left sidebar
2. See the **featured amber card** at the top: "DOA Policy · Procurement"
3. Click "**View Versions & Diff**" button
4. Shows: Version timeline + side-by-side diff table

**Features:**
- ✓ Click any version to select (shows "L" or "R" badge)
- ✓ Shift-click to compare two versions
- ✓ Filter chips (All, Added, Changed, Removed)
- ✓ Enhanced diff visualization with color coding:
  - **Green** = Added (+ prefix)
  - **Amber** = Changed (bold on both sides)
  - **Red** = Removed (− prefix, strikethrough)

---

### **Screen 9: SoD Rule Library** ✅
**Path:** `/doa/sod/rules`

**How to Access:**
1. Click "**SoD Monitoring**" in left sidebar
2. Click "**Rules Library**"
3. Shows: Complete rule library with filters, test panel, bulk operations

**Features:**
- ✓ **Filter strip** with Severity, Function, Action, Status filters
- ✓ **Comprehensive table** with columns:
  - ID, Name, Severity chip, Function(s), Rule expression (truncated), Action chip, Hits in last 30 days, Actions
- ✓ **Severity chips:** Critical (red), High (amber), Medium (grey), Low (blue)
- ✓ **Action chips:** Block (red), Warn (amber), Log (grey)
- ✓ **Interactive test panel** at bottom:
  - Paste JSON event payload
  - Click "Evaluate" to test rule
  - See real-time results (<500ms per NFR-PERF-02)
  - Load sample payloads
- ✓ **Bulk operations:** Select multiple rules, enable/disable, export
- ✓ **Import/Export:** Upload YAML/JSON rule packs
- ✓ **Quick actions:** View, Test, More options menu

**Test Flow:**
1. Go to `/doa/sod/rules`
2. Click **Play icon** (▶) on any rule → Opens test panel
3. Edit JSON payload or click "Load Sample"
4. Click "Evaluate Rule" → See result in <500ms
5. Results show: BLOCKED / WARNING / LOGGED based on rule action

---

## 🗺️ **NAVIGATION STRUCTURE**

```
DoA Module (Left Sidebar)
├── My Work → Screen 1 (Approvals Inbox)
│   └── Click approval → Screen 2 (Approval Detail)
│
├── Authority Matrix
│   ├── All Matrices → Click matrix → View in Grid → Screen 3
│   ├── Click matrix → Edit Matrix → Screen 4 (Builder)
│   └── Simulator → Screen 5
│
├── Delegations → Screen 6 (List & Calendar)
│   └── New delegation → Screen 7 (Wizard)
│
├── Policy Management → Screen 8 featured at top
│   └── "DOA Policy · Procurement" → View Versions & Diff
│
└── SoD Monitoring
    └── Rules Library → Screen 9 (Rule Library + Test Panel)
```

---

## ✅ **VERIFICATION CHECKLIST**

All screens are accessible via:
- ✅ Left sidebar navigation
- ✅ Direct URLs
- ✅ Contextual buttons within other screens
- ✅ Breadcrumb navigation where applicable

**Test the full workflow:**
1. Start at `/doa` (Dashboard)
2. Navigate through all 8 screens using only the UI
3. All screens load correctly with full interactivity

---

## 🎨 **THEME & DESIGN**
- **Primary Color:** Amber (#F59E0B)
- **Mode:** Light only (strictly)
- **Button Sizing:** Compact (`px-3 py-1.5`, `text-sm`)
- **Professional IDs:** APR-000045, DOA-123456, etc.

