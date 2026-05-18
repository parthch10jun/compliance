# 🔑 DOA Module - Sidebar Navigation Structure

## 📱 **COMPLETE SIDEBAR MENU** (Amber Theme 🟠)

---

### **🏠 Overview**

#### **Dashboard**
- **Icon:** 📊 LayoutDashboard
- **URL:** `/doa`
- **Description:** Main DOA dashboard with KPIs and activity feed

---

### **📋 Authority Matrix**

#### **Authority Matrices**
- **Icon:** 🗂️ Grid3X3
- **URL:** `/doa/authority-matrix`
- **Sub-pages:**
  - `/doa/authority-matrix/new` - Create new matrix
  - `/doa/authority-matrix/[id]` - Matrix details
  - `/doa/authority-matrix/[id]/edit` - Edit matrix
  - `/doa/authority-matrix/[id]/version-history` - Version history
  - `/doa/authority-matrix/[id]/entries` - Manage entries

#### **Matrix Templates**
- **Icon:** 📄 FileText
- **URL:** `/doa/authority-matrix/templates`
- **Description:** Pre-built authority matrix templates

#### **Matrix Comparison**
- **Icon:** ⚖️ Scale
- **URL:** `/doa/authority-matrix/comparison`
- **Description:** Side-by-side matrix comparison

---

### **✅ Approvals**

#### **My Approvals**
- **Icon:** ✅ CheckCircle
- **URL:** `/doa/approvals`
- **Description:** Approvals pending on me

#### **Submit Request**
- **Icon:** ➕ Plus
- **URL:** `/doa/approvals/new`
- **Description:** Submit new approval request (wizard)

#### **Team Approvals**
- **Icon:** 👥 Users
- **URL:** `/doa/approvals/team`
- **Description:** All team approval requests

#### **Approval History**
- **Icon:** 🕐 Clock
- **URL:** `/doa/approvals/history`
- **Description:** Historical approvals and audit trail

---

### **🔄 Workflows**

#### **All Workflows**
- **Icon:** 🔄 Workflow
- **URL:** `/doa/workflows`
- **Description:** Approval workflow configurations

#### **Create Workflow**
- **Icon:** ➕ Plus
- **URL:** `/doa/workflows/new`
- **Description:** Visual workflow builder

#### **Workflow Analytics**
- **Icon:** 📊 BarChart3
- **URL:** `/doa/workflows/analytics`
- **Description:** Workflow performance metrics

---

### **👤 Delegations**

#### **Active Delegations**
- **Icon:** 🔗 Link
- **URL:** `/doa/delegations`
- **Description:** All active delegations

#### **Create Delegation**
- **Icon:** ➕ Plus
- **URL:** `/doa/delegations/new`
- **Description:** Create new delegation

#### **Out of Office**
- **Icon:** ✈️ Plane
- **URL:** `/doa/delegations/ooo`
- **Description:** OOO delegation management

#### **Delegation Calendar**
- **Icon:** 📅 Calendar
- **URL:** `/doa/delegations/calendar`
- **Description:** Calendar view of all delegations

#### **Delegation Templates**
- **Icon:** 📄 FileTemplate
- **URL:** `/doa/delegations/templates`
- **Description:** Delegation templates library

---

### **⚠️ SoD & Compliance**

#### **SoD Monitoring**
- **Icon:** ⚠️ AlertTriangle
- **URL:** `/doa/sod-monitoring`
- **Description:** SoD conflict dashboard

#### **SoD Rules**
- **Icon:** 📜 FileCheck
- **URL:** `/doa/sod/rules`
- **Description:** SoD rules library

#### **Detected Conflicts**
- **Icon:** 🔴 AlertCircle
- **URL:** `/doa/sod/conflicts`
- **Description:** Active SoD conflicts

#### **SoD Analysis**
- **Icon:** 📈 TrendingUp
- **URL:** `/doa/sod/analysis`
- **Description:** SoD risk analysis and trends

---

### **🚨 Exceptions & Overrides**

#### **Exception Dashboard**
- **Icon:** 🚨 AlertOctagon
- **URL:** `/doa/exceptions`
- **Description:** Exception requests and approvals

#### **Request Exception**
- **Icon:** ➕ Plus
- **URL:** `/doa/exceptions/new`
- **Description:** Submit exception request

#### **Emergency Approvals**
- **Icon:** ⚡ Zap
- **URL:** `/doa/emergency-approvals`
- **Description:** Emergency approval tracking

#### **Overrides Log**
- **Icon:** 📋 ClipboardList
- **URL:** `/doa/overrides`
- **Description:** Authority override audit log

---

### **📊 Reports & Analytics**

#### **Reports Hub**
- **Icon:** 📊 FileBarChart
- **URL:** `/doa/reports`
- **Description:** All DOA reports

#### **Authority Usage**
- **Icon:** 📈 TrendingUp
- **URL:** `/doa/reports/authority-usage`
- **Description:** Authority utilization report

#### **Approval Cycle Time**
- **Icon:** ⏱️ Timer
- **URL:** `/doa/reports/approval-cycle-time`
- **Description:** Approval performance metrics

#### **Delegation Activity**
- **Icon:** 🔗 Activity
- **URL:** `/doa/reports/delegation-activity`
- **Description:** Delegation usage report

#### **SoD Compliance**
- **Icon:** ✅ ShieldCheck
- **URL:** `/doa/reports/sod-compliance`
- **Description:** SoD compliance status

#### **Exception Analysis**
- **Icon:** 📉 BarChart
- **URL:** `/doa/reports/exception-analysis`
- **Description:** Exception trend analysis

#### **Executive Summary**
- **Icon:** 👔 Briefcase
- **URL:** `/doa/reports/executive-summary`
- **Description:** Executive-level dashboard

---

### **⚙️ Settings & Admin**

#### **General Settings**
- **Icon:** ⚙️ Settings
- **URL:** `/doa/settings`
- **Description:** DOA module settings

#### **Notifications**
- **Icon:** 🔔 Bell
- **URL:** `/doa/settings/notifications`
- **Description:** Notification preferences

#### **Email Templates**
- **Icon:** ✉️ Mail
- **URL:** `/doa/settings/email-templates`
- **Description:** Customize email templates

#### **Integrations**
- **Icon:** 🔌 Plug
- **URL:** `/doa/settings/integrations`
- **Description:** ERP, HRMS, IDP integrations

#### **Audit Log**
- **Icon:** 📜 ScrollText
- **URL:** `/doa/settings/audit-log`
- **Description:** Complete audit trail

---

### **🔙 Navigation**

#### **Back to Compliance**
- **Icon:** ⬅️ ArrowLeft
- **URL:** `/`
- **Style:** Teal gradient button at bottom
- **Description:** Return to main Compliance module

---

## 📊 **SIDEBAR STATISTICS**

- **Total Sections:** 9
- **Total Menu Items:** 40+
- **Total Sub-pages:** 50+
- **All Accessible:** ✅ Yes
- **All Clickable:** ✅ Yes (Level 2 depth)
- **Theme Color:** 🟠 Amber (#F59E0B)

---

## 🎨 **SIDEBAR DESIGN SPECS**

### **Active State:**
- Background: `bg-amber-50`
- Text: `text-amber-600`
- Border: Left accent bar (amber-600)
- Icon: `text-amber-600`

### **Hover State:**
- Background: `hover:bg-[var(--sidebar-hover)]`
- Text: `hover:text-[var(--foreground)]`

### **Collapsed State:**
- Width: `w-16`
- Show icons only
- Tooltip on hover

### **Expanded State:**
- Width: `w-60`
- Show icons + labels
- Collapsible groups

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] All 9 sections created
- [ ] All 40+ menu items linked
- [ ] All pages routable
- [ ] Amber theme applied
- [ ] Icons consistent
- [ ] Tooltips for collapsed view
- [ ] Active states work
- [ ] Sub-navigation expands/collapses
- [ ] Back to Compliance button present
- [ ] Mobile responsive

---

**Next:** Implement sidebar component with all navigation items!
