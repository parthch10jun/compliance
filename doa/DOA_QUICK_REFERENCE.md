# 🔑 DOA Module - Quick Reference Card

## 🚀 **QUICK ACCESS**

**Main URL:** http://localhost:3000/doa
**Theme:** 🟠 Amber (#F59E0B)
**From Compliance:** Bottom of sidebar → "Delegation of Authority" button

---

## 📊 **TOP 10 PAGES TO DEMO**

1. **Dashboard** → `/doa`
   - KPIs, trends, activity feed
   
2. **Submit Approval Request** → `/doa/approvals/new`
   - Multi-step wizard for new approval
   
3. **Approve Request** → `/doa/approvals/[id]`
   - Approve/reject interface with comments
   
4. **Authority Matrix** → `/doa/authority-matrix/[id]`
   - Interactive authority matrix table
   
5. **Create OOO Delegation** → `/doa/delegations/ooo`
   - Out-of-office delegation form
   
6. **Delegation Calendar** → `/doa/delegations/calendar`
   - Visual timeline of all delegations
   
7. **SoD Conflicts** → `/doa/sod/conflicts`
   - Real-time conflict dashboard
   
8. **Workflow Builder** → `/doa/workflows/new`
   - Visual approval workflow designer
   
9. **Executive Dashboard** → `/doa/reports/executive-summary`
   - C-suite view with authority metrics
   
10. **Audit Log** → `/doa/settings/audit-log`
    - Immutable audit trail viewer

---

## 🎨 **COLOR CODES**

### **Status:**
```
🟢 Approved:  #10B981 (Green-500)
🟡 Pending:   #F59E0B (Amber-500)
🔴 Rejected:  #DC2626 (Red-600)
⚫ Expired:   #6B7280 (Gray-500)
⚡ Emergency: #EF4444 (Red-500)
```

### **Authority Levels:**
```
🟣 Board:              #7C3AED (Purple-600)
🔴 Executive:          #DC2626 (Red-600)
🟠 Senior Management:  #F59E0B (Amber-500)
🔵 Management:         #3B82F6 (Blue-500)
🟢 Operational:        #10B981 (Green-500)
```

---

## 📋 **NAVIGATION CHEAT SHEET**

### **Overview**
- `/doa` - Dashboard

### **Authority Matrix**
- `/doa/authority-matrix` - All matrices
- `/doa/authority-matrix/new` - Create new
- `/doa/authority-matrix/templates` - Templates
- `/doa/authority-matrix/comparison` - Compare

### **Approvals**
- `/doa/approvals` - My approvals
- `/doa/approvals/new` - Submit request
- `/doa/approvals/team` - Team approvals
- `/doa/approvals/history` - History

### **Workflows**
- `/doa/workflows` - All workflows
- `/doa/workflows/new` - Create workflow
- `/doa/workflows/analytics` - Performance

### **Delegations**
- `/doa/delegations` - Active delegations
- `/doa/delegations/new` - Create delegation
- `/doa/delegations/ooo` - Out of office
- `/doa/delegations/calendar` - Calendar view
- `/doa/delegations/templates` - Templates

### **SoD & Compliance**
- `/doa/sod-monitoring` - Monitoring dashboard
- `/doa/sod/rules` - Rules library
- `/doa/sod/conflicts` - Detected conflicts
- `/doa/sod/analysis` - Risk analysis

### **Exceptions**
- `/doa/exceptions` - Exception dashboard
- `/doa/exceptions/new` - Request exception
- `/doa/emergency-approvals` - Emergency log
- `/doa/overrides` - Override tracking

### **Reports**
- `/doa/reports` - Reports hub
- `/doa/reports/authority-usage` - Usage report
- `/doa/reports/approval-cycle-time` - Cycle time
- `/doa/reports/delegation-activity` - Delegation report
- `/doa/reports/sod-compliance` - SoD compliance
- `/doa/reports/exception-analysis` - Exception trends
- `/doa/reports/executive-summary` - Executive view

### **Settings**
- `/doa/settings` - General settings
- `/doa/settings/notifications` - Notifications
- `/doa/settings/email-templates` - Email templates
- `/doa/settings/integrations` - Integrations
- `/doa/settings/audit-log` - Audit log

---

## 🔄 **DEMO WORKFLOWS**

### **Scenario 1: Submit Purchase Order Approval ($75k)**
```
1. Go to /doa/approvals/new
2. Select request type: "Purchase Order"
3. Enter amount: $75,000
4. System shows: "Requires 2 approvals (Manager + CFO)"
5. SoD check: ✅ Pass
6. Attach justification document
7. Submit request
8. Dashboard shows: "Pending on Finance Manager"
```

### **Scenario 2: Set OOO Delegation**
```
1. Go to /doa/delegations/ooo
2. Delegate to: "Sarah Chen"
3. Scope: "All approvals up to $50k"
4. Dates: Dec 20-30, 2024
5. SoD check: ✅ Pass
6. Auto-approves (no approval needed for OOO)
7. System sends email to Sarah
8. Calendar shows delegation block
```

### **Scenario 3: Resolve SoD Conflict**
```
1. Alert appears: "John has Requestor + Approver roles"
2. Go to /doa/sod/conflicts/SOD-001
3. View conflict details
4. Choose remediation: "Apply compensating control"
5. Add control: "Monthly manager review required"
6. Document rationale
7. Submit resolution
8. Conflict status: ✅ Remediated
```

---

## 📊 **MOCK DATA QUICK VIEW**

### **Authority Matrices**
- FIN-001: Financial Authority (Purchase, Budget, Contract)
- HR-001: HR Authority (Hiring, Compensation, Termination)
- IT-001: IT Authority (Access, Changes, Vendors)

### **Users (Sample)**
- John Smith - Finance Manager ($0-$100k authority)
- Sarah Chen - CFO ($0-$1M authority)
- David Kumar - CEO (Unlimited authority)
- Maria Garcia - CHRO (HR decisions)

### **Pending Approvals**
- APR-001: Purchase Order $45k (Pending on Finance Manager)
- APR-002: Hiring - Senior Engineer (Pending on CHRO)
- APR-003: Contract Amendment $120k (Pending on CFO)
- APR-004: System Access Request (Pending on IT Manager)
- APR-005: Budget Reallocation $250k (Pending on CEO)

### **Active Delegations**
- DLG-001: John → Sarah (OOO, Dec 20-30)
- DLG-002: Maria → David (Permanent, HR backup)
- DLG-003: IT Manager → Tech Lead (Project-based)

### **SoD Conflicts**
- SOD-001: User has Requestor + Approver (Critical)
- SOD-002: Same user creates & approves invoices (High)

---

## 🎯 **KEY FEATURES TO HIGHLIGHT**

### **1. Real-Time SoD Checks**
- Every approval request checked against SoD rules
- Instant conflict detection
- Remediation workflow

### **2. Automated Routing**
- System identifies workflow based on:
  - Decision type
  - Monetary amount
  - Business unit
  - Legal entity
- Multi-level, parallel, conditional logic

### **3. Time-Bound Delegations**
- Auto-activate on start date
- Auto-expire on end date
- Email notifications
- No manual intervention

### **4. Immutable Audit Trail**
- Every action logged
- Who, what, when, why
- Cannot be modified
- Regulatory-ready

### **5. Executive Visibility**
- Real-time dashboards
- Authority usage metrics
- Cycle time analytics
- Exception tracking

---

## ✅ **TESTING CHECKLIST**

- [ ] Can navigate to all 50+ pages
- [ ] Dashboard loads with KPIs
- [ ] Can submit approval request
- [ ] Can approve/reject request
- [ ] Can create delegation
- [ ] SoD conflicts show correctly
- [ ] Reports display data
- [ ] Export buttons present
- [ ] Settings pages accessible
- [ ] Audit log shows activities
- [ ] Mobile responsive design
- [ ] Amber theme consistent
- [ ] Back to Compliance works
- [ ] All forms validate
- [ ] All tables sortable

---

## 📞 **SUPPORT**

**Documentation:**
- `/doa/DOA_MODULE_PLAN.md` - Complete planning
- `/doa/DOA_SIDEBAR_NAVIGATION.md` - Navigation guide
- `/doa/DOA_IMPLEMENTATION_SUMMARY.md` - Implementation details
- `/doa/DOA_QUICK_REFERENCE.md` - This file

**Architecture Diagrams:**
- Mermaid diagram: Module architecture
- Mermaid diagram: Workflow flows

---

**Last Updated:** 2024
**Version:** 1.0
**Status:** Planning Complete ✅
