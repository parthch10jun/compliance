# DoA Module - Level 2 Interactive Testing Checklist

**Test Date:** 2026-05-13  
**Tester:** Manual UI/UX Testing  
**Scope:** Every clickable element, tab, button, and link

---

## 🎯 TESTING METHODOLOGY

For each page, test:
1. ✅ Page loads without error
2. ✅ All **tabs** switch correctly
3. ✅ All **buttons** are clickable and navigate/function
4. ✅ All **table rows** link to detail pages
5. ✅ All **action buttons** (Edit, View, Export) work
6. ✅ All **quick links** and **navigation items** work
7. ✅ **Search** and **filter** UI elements function
8. ✅ **Forms** validate and submit properly

---

## PAGE 1: Main Dashboard (`/doa`)

**Page Load:** [ ]

**KPI Cards (6 total):** 
- [ ] Active Authorities card displays
- [ ] Pending Approvals card displays
- [ ] Active Delegations card displays
- [ ] SoD Conflicts card displays
- [ ] Avg Approval Time card displays
- [ ] Exception Rate card displays

**Quick Action Cards (4 total):**
- [ ] "Submit Request" → `/doa/approvals/new` - Click test
- [ ] "Create Delegation" → `/doa/delegations/new` - Click test
- [ ] "View SoD Conflicts" → `/doa/sod-monitoring` - Click test
- [ ] "View Reports" → `/doa/reports` - Click test

**Header Button:**
- [ ] "Submit Approval Request" → `/doa/approvals/new` - Click test

---

## PAGE 2: Authority Matrix Hub (`/doa/authority-matrix`)

**Page Load:** [ ]

**Summary Cards (4 total):**
- [ ] Total Matrices displays
- [ ] Active Matrices displays
- [ ] Functions Covered displays
- [ ] Total Entries displays

**Header Buttons:**
- [ ] "Export" button - Click test (should trigger action)
- [ ] "Create Matrix" → `/doa/authority-matrix/new` - Click test

**Search & Filter:**
- [ ] Search input field works
- [ ] Filter button clickable

**Table Rows (3 matrices):**
- [ ] Financial Authority Matrix → `/doa/authority-matrix/matrix-001` - Click test
- [ ] HR Authority Matrix → `/doa/authority-matrix/matrix-002` - Click test
- [ ] IT Authority Matrix → `/doa/authority-matrix/matrix-003` - Click test

**Table Action Icons (per row):**
- [ ] View icon (Eye) → detail page - Click test
- [ ] Edit icon → `/doa/authority-matrix/[id]/edit` - Click test

---

## PAGE 3: Approvals Hub (`/doa/approvals`)

**Page Load:** [ ]

**Summary Cards (4 total):**
- [ ] Pending count displays
- [ ] Approved count displays
- [ ] Rejected count displays
- [ ] Total Requests displays

**Header Button:**
- [ ] "Submit Request" → `/doa/approvals/new` - Click test

**Tabs (3 tabs):**
- [ ] "Pending" tab - Click and verify content changes
- [ ] "Approved" tab - Click and verify content changes
- [ ] "Rejected" tab - Click and verify content changes

**Search & Filter:**
- [ ] Search input field works
- [ ] Filter button clickable

**Approval Cards (test first 5):**
- [ ] APPR-2026-0001 → `/doa/approvals/APPR-2026-0001` - Click test
- [ ] APPR-2026-0002 → `/doa/approvals/APPR-2026-0002` - Click test
- [ ] APPR-2026-0003 → detail page - Click test
- [ ] APPR-2026-0004 → detail page - Click test
- [ ] APPR-2026-0005 → detail page - Click test

---

## PAGE 4: SoD Monitoring (`/doa/sod-monitoring`)

**Page Load:** [ ]

**Summary Cards (4 total):**
- [ ] Open Conflicts displays
- [ ] Remediated displays
- [ ] Active Rules displays
- [ ] Critical Open displays

**Header Button:**
- [ ] "View Rules Library" → `/doa/sod/rules` - Click test ⚠️

**Alert Banner:**
- [ ] "Review Now" button → `/doa/sod/conflicts` - Click test ⚠️

**Conflicts by Severity Section:**
- [ ] Critical severity bar displays
- [ ] High severity bar displays
- [ ] Medium severity bar displays
- [ ] Low severity bar displays

**Recent Conflicts List:**
- [ ] "View All" link → `/doa/sod/conflicts` - Click test ⚠️
- [ ] Each conflict card → `/doa/sod/conflicts/[id]` - Click test ⚠️

---

## PAGE 5: Delegations Hub (`/doa/delegations`)

**Page Load:** [ ]

**Summary Cards (4 total):**
- [ ] Active count displays
- [ ] Expiring Soon displays
- [ ] OOO Delegations displays
- [ ] Permanent displays

**Header Buttons:**
- [ ] "Calendar View" → `/doa/delegations/calendar` - Click test
- [ ] "Create Delegation" → `/doa/delegations/new` - Click test

**Tabs (3 tabs):**
- [ ] "Active" tab - Click and verify content changes
- [ ] "Expired" tab - Click and verify content changes
- [ ] "All Delegations" tab - Click and verify content changes

**Delegation Cards (test 5):**
- [ ] del-001 → `/doa/delegations/del-001` - Click test
- [ ] del-002 → `/doa/delegations/del-002` - Click test
- [ ] del-003 → detail page - Click test
- [ ] del-007 → detail page - Click test
- [ ] del-010 → detail page - Click test

---

## PAGE 6: Reports Dashboard (`/doa/reports`)

**Page Load:** [ ]

**Header:**
- [ ] Date range selector works
- [ ] "Export All" button clickable

**Key Metrics (4 cards):**
- [ ] Total Requests displays
- [ ] Approval Rate displays
- [ ] Avg Cycle Time displays
- [ ] Total Value Approved displays

**Report Categories (4 sections):**

### Authority Matrix Reports
- [ ] "Authority Matrix Coverage Report" → link - Click test
- [ ] "Authority Usage Report" → link - Click test
- [ ] "Matrix Version History" → link - Click test
- [ ] Each "Export" button clickable

### Approval Analytics
- [ ] "Approval Cycle Time Analysis" → link - Click test
- [ ] "Bottleneck Identification" → link - Click test
- [ ] "Approval Volume Trends" → link - Click test
- [ ] "Exception Rate Analysis" → link - Click test

### Delegation Reports
- [ ] "Active Delegations Summary" → link - Click test
- [ ] "Delegation Coverage Report" → link - Click test
- [ ] "Permanent Delegation Review" → link - Click test

### SoD Compliance
- [ ] "SoD Conflict Summary" → link - Click test
- [ ] "Remediation Tracking" → link - Click test
- [ ] "SoD Rule Effectiveness" → link - Click test

**Quick Export Templates:**
- [ ] "Executive Summary" button clickable
- [ ] "Audit Package" button clickable
- [ ] "Monthly Report" button clickable

---

## PAGE 7: Exceptions Dashboard (`/doa/exceptions`)

**Page Load:** [ ]

**Summary Cards (4 total):**
- [ ] Pending count displays
- [ ] Approved count displays
- [ ] Rejected count displays
- [ ] Critical Pending displays

**Header Button:**
- [ ] "Request Exception" → `/doa/exceptions/new` - Click test ⚠️

**Tabs (4 tabs):**
- [ ] "Pending" tab - Click and verify
- [ ] "Approved" tab - Click and verify
- [ ] "Rejected" tab - Click and verify
- [ ] "All" tab - Click and verify

**Search & Filter:**
- [ ] Search input works
- [ ] Filter button clickable

**Exception Cards:**
- [ ] EXC-001 → `/doa/exceptions/EXC-001` - Click test
- [ ] EXC-002 → detail page - Click test
- [ ] EXC-003 → detail page - Click test

---

## LEVEL 2 DETAIL PAGES

(Testing checklist continues in separate document)
