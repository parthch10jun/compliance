# 📍 DoA Module - Complete Page Map

## 🗺️ **NAVIGATION STRUCTURE**

All pages accessible from: `http://localhost:3003/doa/*`

---

## **LEVEL 1: MAIN NAVIGATION (9 sections)**

### **1. 📊 Dashboard**
| # | Route | File | Purpose |
|---|-------|------|---------|
| 1 | `/doa` | `app/doa/page.tsx` | Main KPI dashboard |

---

### **2. 📋 Authority Matrix (8 pages)**
| # | Route | File | Purpose |
|---|-------|------|---------|
| 2 | `/doa/authority-matrix` | `app/doa/authority-matrix/page.tsx` | Matrix hub - list all matrices |
| 3 | `/doa/authority-matrix/new` | `app/doa/authority-matrix/new/page.tsx` | Create new matrix (wizard) |
| 4 | `/doa/authority-matrix/[id]` | `app/doa/authority-matrix/[id]/page.tsx` | Matrix detail view |
| 5 | `/doa/authority-matrix/[id]/edit` | `app/doa/authority-matrix/[id]/edit/page.tsx` | Edit matrix |
| 6 | `/doa/authority-matrix/[id]/version-history` | `app/doa/authority-matrix/[id]/version-history/page.tsx` | Version timeline |
| 7 | `/doa/authority-matrix/[id]/entries/new` | `app/doa/authority-matrix/[id]/entries/new/page.tsx` | Add authority entry |
| 8 | `/doa/authority-matrix/templates` | `app/doa/authority-matrix/templates/page.tsx` | Template library |
| 9 | `/doa/authority-matrix/comparison` | `app/doa/authority-matrix/comparison/page.tsx` | Compare matrices |

---

### **3. ✅ Approvals (10 pages)**
| # | Route | File | Purpose |
|---|-------|------|---------|
| 10 | `/doa/approvals` | `app/doa/approvals/page.tsx` | Approvals dashboard |
| 11 | `/doa/approvals/new` | `app/doa/approvals/new/page.tsx` | Submit new request (wizard) |
| 12 | `/doa/approvals/[id]` | `app/doa/approvals/[id]/page.tsx` | Request detail & action |
| 13 | `/doa/approvals/[id]/act` | `app/doa/approvals/[id]/act/page.tsx` | Approve/reject interface |
| 14 | `/doa/approvals/[id]/history` | `app/doa/approvals/[id]/history/page.tsx` | Approval history |
| 15 | `/doa/approvals/[id]/documents` | `app/doa/approvals/[id]/documents/page.tsx` | Attachments |
| 16 | `/doa/workflows` | `app/doa/workflows/page.tsx` | Workflow configuration list |
| 17 | `/doa/workflows/new` | `app/doa/workflows/new/page.tsx` | Create workflow (builder) |
| 18 | `/doa/workflows/[id]` | `app/doa/workflows/[id]/page.tsx` | Workflow details |
| 19 | `/doa/workflows/[id]/analytics` | `app/doa/workflows/[id]/analytics/page.tsx` | Workflow performance |

---

### **4. 🔄 Delegations (8 pages)**
| # | Route | File | Purpose |
|---|-------|------|---------|
| 20 | `/doa/delegations` | `app/doa/delegations/page.tsx` | Delegations dashboard |
| 21 | `/doa/delegations/new` | `app/doa/delegations/new/page.tsx` | Create delegation |
| 22 | `/doa/delegations/[id]` | `app/doa/delegations/[id]/page.tsx` | Delegation detail |
| 23 | `/doa/delegations/[id]/edit` | `app/doa/delegations/[id]/edit/page.tsx` | Edit delegation |
| 24 | `/doa/delegations/[id]/revoke` | `app/doa/delegations/[id]/revoke/page.tsx` | Revoke delegation |
| 25 | `/doa/delegations/ooo` | `app/doa/delegations/ooo/page.tsx` | OOO delegations |
| 26 | `/doa/delegations/calendar` | `app/doa/delegations/calendar/page.tsx` | Calendar view |
| 27 | `/doa/delegations/history` | `app/doa/delegations/history/page.tsx` | Audit trail |

---

### **5. ⚠️ SoD Monitoring (7 pages)**
| # | Route | File | Purpose |
|---|-------|------|---------|
| 28 | `/doa/sod-monitoring` | `app/doa/sod-monitoring/page.tsx` | SoD dashboard |
| 29 | `/doa/sod/rules` | `app/doa/sod/rules/page.tsx` | Rules library |
| 30 | `/doa/sod/rules/new` | `app/doa/sod/rules/new/page.tsx` | Create SoD rule |
| 31 | `/doa/sod/rules/[id]` | `app/doa/sod/rules/[id]/page.tsx` | Rule details |
| 32 | `/doa/sod/conflicts` | `app/doa/sod/conflicts/page.tsx` | Conflicts dashboard |
| 33 | `/doa/sod/conflicts/[id]` | `app/doa/sod/conflicts/[id]/page.tsx` | Conflict remediation |
| 34 | `/doa/sod/analysis` | `app/doa/sod/analysis/page.tsx` | SoD risk analysis |

---

### **6. 🚨 Exceptions (5 pages)**
| # | Route | File | Purpose |
|---|-------|------|---------|
| 35 | `/doa/exceptions` | `app/doa/exceptions/page.tsx` | Exceptions dashboard |
| 36 | `/doa/exceptions/new` | `app/doa/exceptions/new/page.tsx` | Request exception |
| 37 | `/doa/exceptions/[id]` | `app/doa/exceptions/[id]/page.tsx` | Exception details |
| 38 | `/doa/emergency-approvals` | `app/doa/emergency-approvals/page.tsx` | Emergency log |
| 39 | `/doa/overrides` | `app/doa/overrides/page.tsx` | Override tracking |

---

### **7. 📈 Reports (7 pages)**
| # | Route | File | Purpose |
|---|-------|------|---------|
| 40 | `/doa/reports` | `app/doa/reports/page.tsx` | Reports hub |
| 41 | `/doa/reports/authority-usage` | `app/doa/reports/authority-usage/page.tsx` | Authority usage |
| 42 | `/doa/reports/approval-cycle-time` | `app/doa/reports/approval-cycle-time/page.tsx` | Cycle time analysis |
| 43 | `/doa/reports/delegation-activity` | `app/doa/reports/delegation-activity/page.tsx` | Delegation activity |
| 44 | `/doa/reports/sod-compliance` | `app/doa/reports/sod-compliance/page.tsx` | SoD compliance |
| 45 | `/doa/reports/exception-analysis` | `app/doa/reports/exception-analysis/page.tsx` | Exception analysis |
| 46 | `/doa/reports/executive-summary` | `app/doa/reports/executive-summary/page.tsx` | Executive dashboard |
| 47 | `/doa/reports/sod-reports` | `app/doa/reports/sod-reports/page.tsx` | SoD reports (BR-SOD-05) |

---

### **8. ⚙️ Settings (5 pages)**
| # | Route | File | Purpose |
|---|-------|------|---------|
| 48 | `/doa/settings` | `app/doa/settings/page.tsx` | General settings |
| 49 | `/doa/settings/notifications` | `app/doa/settings/notifications/page.tsx` | Notification prefs |
| 50 | `/doa/settings/email-templates` | `app/doa/settings/email-templates/page.tsx` | Email templates |
| 51 | `/doa/settings/integrations` | `app/doa/settings/integrations/page.tsx` | Integration config |
| 52 | `/doa/settings/audit-log` | `app/doa/settings/audit-log/page.tsx` | Full audit trail |

---

## **TOTAL: 52 PAGES** ✅

---

## 🎨 **PAGE COMPLEXITY LEVELS**

### **Simple Pages (20-30 min each)**
- Templates library
- Comparison view
- OOO delegations
- Notifications settings
- Email templates
- Integration settings

### **Medium Pages (45-60 min each)**
- Matrix hub
- Approvals dashboard
- Delegations dashboard
- SoD monitoring dashboard
- Exceptions dashboard
- Reports hub
- Most report pages

### **Complex Pages (90-120 min each)**
- Main dashboard (KPIs + charts)
- Create matrix wizard
- Submit approval wizard
- Approval detail & action
- Create delegation form
- Calendar view
- Conflict remediation

---

## 🧩 **COMPONENT DEPENDENCIES**

### **Core Layout (Required First)**
1. `DOASidebar.tsx`
2. `DOATopBar.tsx`
3. `app/doa/layout.tsx`

### **Shared Components (Build Early)**
1. `KPICard.tsx`
2. `StatusBadge.tsx`
3. `DataTable.tsx`
4. `FilterBar.tsx`
5. `SearchInput.tsx`
6. `ExportMenu.tsx`
7. `AuditTrail.tsx`

### **Domain Components (Build as Needed)**
- Authority Matrix: `AuthorityMatrixTable`, `MatrixEntryForm`, `MatrixVersionHistory`
- Approvals: `ApprovalTimeline`, `ApprovalActionPanel`, `ApprovalCard`
- Delegations: `DelegationCalendar`, `DelegationForm`, `DelegationCard`
- SoD: `SoDConflictAlert`, `SoDRuleForm`, `ConflictResolutionPanel`

---

## 📦 **MOCK DATA FILES**

| File | Records | Purpose |
|------|---------|---------|
| `mockAuthorityMatrices.ts` | 3 matrices, 30+ entries | Financial, HR, IT authorities |
| `mockDelegations.ts` | 12 records | OOO, permanent, acting delegations |
| `mockApprovals.ts` | 20 records | Pending, approved, rejected requests |
| `mockSoDRules.ts` | 8 rules | Critical, high, medium severity |
| `mockSoDConflicts.ts` | 5 conflicts | Open, remediated conflicts |
| `mockWorkflows.ts` | 5 workflows | Sequential, parallel workflows |
| `mockUsers.ts` | 20+ users | Approvers, delegates, requestors |

---

## 🎯 **BUILD ORDER RECOMMENDATION**

### **Day 1: Foundation**
1. Layout & Sidebar
2. Main Dashboard
3. Mock Data Files

### **Day 2: Authority Matrix**
4-9: All 8 authority matrix pages

### **Day 3: Approvals**
10-19: All 10 approval pages

### **Day 4: Delegations & SoD**
20-27: All 8 delegation pages
28-34: All 7 SoD pages

### **Day 5: Exceptions, Reports, Settings**
35-39: All 5 exception pages
40-47: All 8 report pages
48-52: All 5 settings pages

---

## ✅ **COMPLETION CHECKLIST**

- [ ] All 52 pages created
- [ ] All pages accessible via routing
- [ ] Sidebar navigation complete
- [ ] Mock data comprehensive
- [ ] Forms accept input
- [ ] Filters work
- [ ] Responsive design
- [ ] Amber theme applied
- [ ] No broken links
- [ ] Demo-ready

---

**Use this map to track progress during implementation!**

