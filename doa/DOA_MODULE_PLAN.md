# 🔑 Delegation of Authority (DOA) Module - Complete Planning Document

## 📋 **EXECUTIVE SUMMARY**

**Module:** Delegation of Authority (DOA)
**Purpose:** Centralize enterprise authority matrix, automate approval routing, enforce SoD, and provide real-time governance visibility
**Architecture:** Standalone module with own layout, following ERM pattern
**Color Theme:** 🟠 Amber/Orange (#F59E0B) - representing authority, decisions, and empowerment
**Deployment Target:** http://localhost:3003/doa
**Requirements Coverage:** 100% of BRD sections 3.1-5.3

---

## 🎨 **DESIGN SYSTEM**

### **Color Palette**
```css
Primary:        #F59E0B  (Amber-500)  - Main authority color
Primary Hover:  #D97706  (Amber-600)  - Hover states
Primary Light:  #FCD34D  (Amber-300)  - Light variant
Primary Lighter:#FDE68A  (Amber-200)  - Lighter
Primary Lightest:#FEF3C7 (Amber-100)  - Backgrounds
Dark:           #B45309  (Amber-700)  - Dark variant
```

**Status Colors:**
- Approved: `#10B981` (Green-500)
- Pending: `#F59E0B` (Amber-500)
- Rejected: `#DC2626` (Red-600)
- Expired: `#6B7280` (Gray-500)
- Emergency: `#EF4444` (Red-500)

**Authority Level Colors:**
- Board: `#7C3AED` (Purple-600)
- Executive: `#DC2626` (Red-600)
- Senior Management: `#F59E0B` (Amber-500)
- Management: `#3B82F6` (Blue-500)
- Operational: `#10B981` (Green-500)

### **Typography & Layout**
- Headers: `text-h1`, `text-h2` (same as ERM/Compliance)
- Body: `text-p2`, `text-p3`
- Cards: `rounded-lg`, `border-[var(--border)]`, `p-4`
- Gradient cards for KPIs
- Responsive grid layouts

---

## 🏗️ **ARCHITECTURE**

### **Module Structure**
```
/doa (Standalone App)
├── layout.tsx              # DOA-specific layout
├── DOASidebar.tsx          # Own sidebar navigation
├── DOATopBar.tsx           # Own top bar
└── [pages...]              # All DOA pages
```

### **Integration Pattern**
- Accessed from main Compliance sidebar (bottom section)
- Completely independent from Compliance/ERM
- Own data models and components
- Link back to Compliance available

---

## 📊 **DATA MODELS**

### **1. Authority Matrix**
```typescript
interface AuthorityMatrix {
  id: string;
  name: string;
  description: string;
  version: string;
  effectiveDate: string;
  expiryDate?: string;
  status: 'Draft' | 'Active' | 'Superseded' | 'Archived';
  
  // Organizational scope
  applicableEntities: string[]; // Legal entities, BUs, etc.
  function: 'Financial' | 'Procurement' | 'HR' | 'IT' | 'Legal' | 'Operations' | 'Sales' | 'Risk' | 'Compliance' | 'ESG';
  
  // Authority entries
  entries: AuthorityEntry[];
  
  // Approval & governance
  approvedBy: string;
  approvalDate: string;
  nextReviewDate: string;
  
  // Metadata
  createdBy: string;
  createdDate: string;
  modifiedBy?: string;
  modifiedDate?: string;
}

interface AuthorityEntry {
  id: string;
  matrixId: string;
  
  // Decision type
  decisionType: string; // e.g., "Purchase Order", "Hiring", "Contract Approval"
  category: 'Monetary' | 'Non-Monetary';
  
  // Thresholds
  monetaryThreshold?: {
    min: number;
    max: number;
    currency: string;
  };
  nonMonetaryCondition?: string;
  
  // Authorization levels
  requiredRole: string;
  requiredGrade?: string;
  authorityLevel: 'Board' | 'Executive' | 'Senior Management' | 'Management' | 'Operational';
  
  // Approval workflow
  approvalType: 'Single' | 'Multi-Level' | 'Parallel' | 'Conditional';
  approvers: string[]; // Role IDs or specific users
  escalationPath?: string[];
  
  // Entity/jurisdiction overlay
  legalEntity?: string;
  country?: string;
  businessUnit?: string;
  costCenter?: string;
  
  // SoD rules
  sodRuleIds: string[];
  
  // Additional constraints
  additionalConditions?: string;
  requiresDocumentation?: boolean;
  requiresJustification?: boolean;
}
```

### **2. Delegation Record**
```typescript
interface DelegationRecord {
  id: string;
  type: 'Permanent' | 'Temporary' | 'Acting' | 'Interim' | 'Project-Based' | 'OOO';

  // Delegation details
  delegator: string; // Original authority holder
  delegate: string; // Person receiving authority
  authorityType: string; // What authority is being delegated

  // Scope
  authorityEntryIds: string[]; // Which authority entries
  scope: string; // Description of delegated authority

  // Duration
  startDate: string;
  endDate?: string;
  isActive: boolean;

  // Limits
  monetaryLimit?: number;
  transactionLimit?: number; // Max transactions per period
  geographicScope?: string[];

  // Approval & tracking
  approvedBy: string;
  approvalDate: string;
  rationale: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Expired' | 'Revoked';

  // Metadata
  createdBy: string;
  createdDate: string;
  revokedBy?: string;
  revokedDate?: string;
  revokedReason?: string;
}
```

### **3. Approval Workflow**
```typescript
interface ApprovalWorkflow {
  id: string;
  name: string;
  description: string;

  // Trigger
  decisionType: string;
  thresholdCondition: string;

  // Workflow steps
  steps: ApprovalStep[];

  // Routing logic
  routingType: 'Sequential' | 'Parallel' | 'Conditional';

  // SLA
  slaHours: number;
  escalationAfterHours: number;
  escalationTo: string[];

  // Status
  isActive: boolean;
  version: string;
}

interface ApprovalStep {
  stepNumber: number;
  stepName: string;
  approverType: 'Role' | 'User' | 'Group' | 'Dynamic';
  approvers: string[];

  // Step requirements
  requiredApprovals: number; // For parallel voting
  allowDelegation: boolean;
  allowRejection: boolean;

  // SLA for this step
  stepSlaHours: number;

  // Conditions
  conditions?: string; // When this step applies
  skipConditions?: string; // When to skip this step
}
```

### **4. Approval Request**
```typescript
interface ApprovalRequest {
  id: string;
  requestNumber: string; // Auto-generated (APR-00001)

  // Request details
  requestType: string;
  description: string;
  requestedBy: string;
  requestedDate: string;

  // Business details
  businessUnit: string;
  costCenter?: string;
  project?: string;

  // Financial details
  monetaryAmount?: number;
  currency?: string;
  budgetCode?: string;

  // Workflow
  workflowId: string;
  currentStep: number;
  status: 'Draft' | 'Submitted' | 'Pending' | 'Approved' | 'Rejected' | 'Withdrawn' | 'Expired';

  // Approvals received
  approvalHistory: ApprovalAction[];

  // Documents
  attachments: string[];
  justification: string;

  // SoD check
  sodCheckPassed: boolean;
  sodConflicts?: SoDConflict[];

  // Exception handling
  isException: boolean;
  isEmergency: boolean;
  overrideReason?: string;
  compensatingControls?: string[];

  // Timestamps
  submittedDate?: string;
  completedDate?: string;
  expiryDate?: string;
}

interface ApprovalAction {
  approver: string;
  action: 'Approved' | 'Rejected' | 'Delegated' | 'Returned for Clarification';
  actionDate: string;
  comments?: string;
  stepNumber: number;
}
```

### **5. SoD (Segregation of Duties) Rule**
```typescript
interface SoDRule {
  id: string;
  name: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';

  // Conflicting functions
  function1: string;
  function2: string;

  // Rule details
  conflictType: 'Same User' | 'Same Role' | 'Reporting Line' | 'Same Department';
  riskDescription: string;

  // Remediation
  allowOverride: boolean;
  requiresApproval: boolean;
  compensatingControls: string[];

  // Scope
  applicableEntities: string[];

  // Status
  isActive: boolean;

  // Metadata
  regulatoryReference?: string; // e.g., "SOX §404", "MiFID II"
  createdBy: string;
  createdDate: string;
}

interface SoDConflict {
  ruleId: string;
  ruleName: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  conflictDescription: string;
  affectedUsers: string[];
  detectedDate: string;

  // Resolution
  status: 'Open' | 'Remediated' | 'Accepted with Compensating Controls' | 'Override Approved';
  resolution?: string;
  compensatingControls?: string[];
  approvedBy?: string;
  approvalDate?: string;
}
```

---

## 📄 **PAGE STRUCTURE (50+ Pages)**

### **Level 1: Navigation & Dashboards (10 pages)**

#### **1. DOA Dashboard** (`/doa`)
- **KPI Cards (6):**
  - Total Active Authorities
  - Pending Approvals
  - Active Delegations
  - SoD Conflicts Detected
  - Average Approval Time
  - Exception Rate
- **Charts:**
  - Approval volume trend (6 months)
  - Authority usage by function (pie chart)
  - Delegation timeline
  - SoD conflict status breakdown
- **Quick Actions:**
  - Submit new approval request
  - View my delegations
  - SoD alerts
- **Recent Activity Feed**

#### **2. Authority Matrix Hub** (`/doa/authority-matrix`)
- **List View:**
  - All authority matrices
  - Filter by function, entity, status
  - Version history
- **Summary Cards:**
  - Total matrices
  - Functions covered
  - Pending reviews
- **Actions:**
  - Create new matrix
  - Import template
  - Export to Excel

#### **3. Approvals Dashboard** (`/doa/approvals`)
- **My Approvals View:**
  - Pending on me
  - Approved by me
  - Delegated approvals
- **Team View:**
  - All team approvals
  - By status
- **Filters:**
  - Date range
  - Amount range
  - Request type
  - Status

#### **4. Delegations Dashboard** (`/doa/delegations`)
- **Active Delegations:**
  - OOO delegations
  - Permanent delegations
  - Expiring soon
- **My Delegations:**
  - Delegated to me
  - Delegated by me
- **Calendar View:**
  - Timeline of delegations

#### **5. SoD Monitoring** (`/doa/sod-monitoring`)
- **Conflict Dashboard:**
  - Critical conflicts
  - High priority
  - By severity
- **Rules Library:**
  - All SoD rules
  - Active vs inactive
- **Resolution Tracking:**
  - Open conflicts
  - Remediated
  - Accepted with controls

### **Level 2: Detailed Pages & Forms (40+ pages)**

#### **Authority Matrix Module (8 pages)**
1. `/doa/authority-matrix/new` - Create new matrix (multi-step wizard)
2. `/doa/authority-matrix/[id]` - View matrix details
3. `/doa/authority-matrix/[id]/edit` - Edit matrix
4. `/doa/authority-matrix/[id]/version-history` - Version history
5. `/doa/authority-matrix/[id]/entries` - Manage authority entries
6. `/doa/authority-matrix/[id]/entries/new` - Add new entry
7. `/doa/authority-matrix/templates` - Matrix templates library
8. `/doa/authority-matrix/comparison` - Compare matrices (side-by-side)

#### **Approval Workflow Module (10 pages)**
1. `/doa/approvals/new` - Submit new approval request (wizard)
2. `/doa/approvals/[id]` - Approval request details
3. `/doa/approvals/[id]/act` - Approve/reject screen
4. `/doa/approvals/[id]/history` - Approval history & audit trail
5. `/doa/approvals/[id]/documents` - Attached documents
6. `/doa/workflows` - Workflow configuration list
7. `/doa/workflows/new` - Create new workflow (visual builder)
8. `/doa/workflows/[id]` - Workflow details
9. `/doa/workflows/[id]/edit` - Edit workflow
10. `/doa/workflows/[id]/analytics` - Workflow performance analytics

#### **Delegation Management Module (8 pages)**
1. `/doa/delegations/new` - Create new delegation
2. `/doa/delegations/[id]` - Delegation details
3. `/doa/delegations/[id]/edit` - Edit delegation
4. `/doa/delegations/[id]/revoke` - Revoke delegation
5. `/doa/delegations/ooo` - Out-of-office delegations
6. `/doa/delegations/calendar` - Delegation calendar view
7. `/doa/delegations/templates` - Delegation templates
8. `/doa/delegations/history` - Delegation audit trail

#### **SoD Management Module (7 pages)**
1. `/doa/sod/rules` - SoD rules library
2. `/doa/sod/rules/new` - Create new SoD rule
3. `/doa/sod/rules/[id]` - Rule details
4. `/doa/sod/conflicts` - Detected conflicts dashboard
5. `/doa/sod/conflicts/[id]` - Conflict details & remediation
6. `/doa/sod/analysis` - SoD risk analysis
7. `/doa/sod/reports` - SoD compliance reports

#### **Exception & Override Module (5 pages)**
1. `/doa/exceptions` - Exception dashboard
2. `/doa/exceptions/new` - Request exception
3. `/doa/exceptions/[id]` - Exception details
4. `/doa/emergency-approvals` - Emergency approvals log
5. `/doa/overrides` - Override tracking & audit

#### **Reporting & Analytics (7 pages)**
1. `/doa/reports` - Reports hub
2. `/doa/reports/authority-usage` - Authority usage report
3. `/doa/reports/approval-cycle-time` - Cycle time analysis
4. `/doa/reports/delegation-activity` - Delegation activity report
5. `/doa/reports/sod-compliance` - SoD compliance report
6. `/doa/reports/exception-analysis` - Exception analysis
7. `/doa/reports/executive-summary` - Executive dashboard report

#### **Administration & Settings (5 pages)**
1. `/doa/settings` - General settings
2. `/doa/settings/notifications` - Notification preferences
3. `/doa/settings/email-templates` - Email templates
4. `/doa/settings/integrations` - Integration settings (ERP, HRMS, IDP)
5. `/doa/settings/audit-log` - Full audit trail

---

## 🔄 **WORKFLOWS**

### **Workflow 1: Submit & Approve Request**
```
1. User creates approval request (/doa/approvals/new)
2. System identifies applicable workflow based on:
   - Decision type
   - Monetary amount
   - Business unit
3. Real-time SoD check
4. If SoD conflict → Flag + require override approval
5. Route to first approver
6. Email/Teams notification
7. Approver reviews (/doa/approvals/[id])
8. Approve/reject/delegate
9. If multi-level → route to next approver
10. Final approval → Close request
11. Audit trail recorded
```

### **Workflow 2: Create Delegation (OOO)**
```
1. User goes to /doa/delegations/ooo
2. Fills form:
   - Delegate person
   - Start/end date
   - Scope of authority
3. System validates:
   - Delegate has sufficient privileges
   - No SoD conflicts created
4. Sends for approval (if required)
5. Auto-activate on start date
6. Auto-expire on end date
7. Email notifications to delegate
```

### **Workflow 3: SoD Conflict Detection & Remediation**
```
1. System detects conflict (real-time or batch)
2. Alert created (/doa/sod/conflicts)
3. Notification to risk/compliance team
4. Review conflict (/doa/sod/conflicts/[id])
5. Choose remediation:
   - Revoke access
   - Apply compensating controls
   - Request override approval
6. Document decision
7. Close conflict
8. Generate audit evidence
```

---

## 🎯 **MOCK DATA REQUIREMENTS**

### **Authority Matrices (3)**
1. **Financial Authority Matrix**
   - Purchase orders: $0-$10M (5 tiers)
   - Contract approvals
   - Budget approvals

2. **HR Authority Matrix**
   - Hiring decisions
   - Compensation changes
   - Terminations

3. **IT Authority Matrix**
   - IT change approvals
   - System access grants
   - Vendor onboarding

### **Delegations (12)**
- 5 OOO delegations (2 active, 3 expired)
- 3 Permanent delegations
- 2 Acting/Interim
- 2 Project-based

### **Approval Requests (20)**
- 5 Pending
- 10 Approved
- 3 Rejected
- 2 Emergency

### **SoD Rules (8)**
- 3 Critical (e.g., Requestor cannot approve own purchase)
- 3 High
- 2 Medium

### **SoD Conflicts (5)**
- 2 Open
- 2 Remediated
- 1 Accepted with compensating controls

---

## 🎨 **UI COMPONENTS**

### **Custom Components to Build**
1. **AuthorityMatrixTable** - Interactive authority matrix grid
2. **ApprovalTimeline** - Visual approval workflow progress
3. **DelegationCalendar** - Calendar view of delegations
4. **SoDConflictAlert** - Warning banner for SoD conflicts
5. **ApprovalActionPanel** - Approve/reject interface
6. **WorkflowBuilder** - Visual workflow designer
7. **AmountThresholdSlider** - Monetary threshold selector
8. **EntitySelector** - Multi-select for org entities
9. **ApproverPicker** - Role/user selection with hierarchy
10. **AuditTrail** - Immutable audit log display

### **Reusable ERM/Compliance Components**
- KPI Cards
- Search/Filter bars
- Data tables
- Modal dialogs
- Export menu
- Page headers

---

## 📋 **REQUIREMENTS MAPPING**

### **Objectives (OBJ-01 to OBJ-08)**
- ✅ OBJ-01: Authority Matrix pages cover all functions
- ✅ OBJ-02: Workflow automation pages
- ✅ OBJ-03: Delegation module eliminates email forwards
- ✅ OBJ-04: SoD monitoring real-time
- ✅ OBJ-05: Approval analytics show cycle time
- ✅ OBJ-06: Audit trail on every page
- ✅ OBJ-07: Executive dashboard
- ✅ OBJ-08: Integration settings page

### **In Scope (Section 5.1)**
- ✅ Authority matrix design (8 pages)
- ✅ Monetary & non-monetary thresholds (data model)
- ✅ Role-based authority (AuthorityEntry model)
- ✅ Permanent & temporary delegation (Delegation module)
- ✅ Multi-level workflows (Approval module)
- ✅ Policy versioning (Version history pages)
- ✅ Exception management (Exception module)
- ✅ SoD library (SoD module)
- ✅ Audit trail (Every detail page)
- ✅ Integration mockups (Settings page)
- ✅ Reporting (7 report pages)
- ✅ Mobile-friendly UI (Responsive design)
- ✅ Integration with ERM/Policy/Compliance (Links)

---

## 🚀 **IMPLEMENTATION PHASES**

### **Phase 1: Foundation (Day 1)**
- Create DOA layout, sidebar, topbar
- Data models in TypeScript
- Mock data (authorities, delegations, approvals, SoD)
- Add DOA to main sidebar

### **Phase 2: Core Pages (Day 2)**
- Dashboard
- Authority Matrix hub + detail page
- Approvals dashboard + detail page
- Basic workflows

### **Phase 3: Advanced Features (Day 3)**
- Delegation management
- SoD monitoring
- Exception handling
- Workflow builder mockup

### **Phase 4: Reporting & Polish (Day 4)**
- All reports
- Analytics
- Export functionality
- Documentation

---

## ✅ **SUCCESS CRITERIA**

1. **50+ pages created** and accessible
2. **All workflows demonstrable** (click-through)
3. **Level 2 interactivity:** Forms, filters, detail views work
4. **Consistent design** with ERM/Compliance
5. **Amber theme** applied throughout
6. **Mock data** realistic and comprehensive
7. **Demo-ready:** Can present to stakeholders
8. **Documentation:** Complete guide created

---

**Next Steps:** Begin implementation with Phase 1 - Foundation!
