# 🚀 DoA Module - Quick Start Guide

## 📌 **OVERVIEW**

**What we're building:** 51 frontend pages for Delegation of Authority module  
**Approach:** Frontend-only with realistic mock data  
**Timeline:** 5 days (6-8 hours per day)  
**Technology:** Next.js 15, React, TypeScript, Tailwind CSS  
**Color Theme:** 🟠 Amber (#F59E0B)

---

## 🎯 **DELIVERABLES**

### **Pages Breakdown**
- ✅ **1** Dashboard page
- ✅ **8** Authority Matrix pages
- ✅ **10** Approval Workflow pages
- ✅ **8** Delegation Management pages
- ✅ **7** SoD Monitoring pages
- ✅ **5** Exception Handling pages
- ✅ **7** Reports & Analytics pages
- ✅ **5** Settings & Admin pages

**Total: 51 pages**

### **Components Breakdown**
- ✅ **3** Layout components (Sidebar, TopBar, Layout)
- ✅ **62** Feature-specific components
- ✅ **6** Mock data files
- ✅ **1** Type definitions file

**Total: 65+ components**

---

## 📂 **FILE STRUCTURE**

```
src/
├── app/doa/                          # All DoA pages
│   ├── layout.tsx                    # DoA layout wrapper
│   ├── page.tsx                      # Main dashboard
│   ├── authority-matrix/             # 8 pages
│   ├── approvals/                    # 10 pages
│   ├── delegations/                  # 8 pages
│   ├── sod/                          # 7 pages
│   ├── exceptions/                   # 5 pages
│   ├── reports/                      # 7 pages
│   └── settings/                     # 5 pages
│
├── components/doa/                   # All DoA components
│   ├── layout/                       # Sidebar, TopBar
│   ├── dashboards/                   # Dashboard components
│   ├── authority-matrix/             # Matrix components
│   ├── approvals/                    # Approval components
│   ├── delegations/                  # Delegation components
│   ├── sod/                          # SoD components
│   └── shared/                       # Shared utilities
│
└── lib/doa/                          # Data & utilities
    ├── data/                         # Mock data files
    ├── types/                        # Type definitions
    └── utils/                        # Helper functions
```

---

## 🎨 **DESIGN SYSTEM**

### **Color Palette**
```css
--doa-primary: #F59E0B         /* Amber-500 - Main */
--doa-primary-hover: #D97706   /* Amber-600 - Hover */
--doa-primary-light: #FCD34D   /* Amber-300 - Light */
--doa-primary-bg: #FEF3C7      /* Amber-100 - Background */

/* Status Colors */
--status-approved: #10B981     /* Green-500 */
--status-pending: #F59E0B      /* Amber-500 */
--status-rejected: #DC2626     /* Red-600 */
--status-expired: #6B7280      /* Gray-500 */
--status-emergency: #EF4444    /* Red-500 */

/* Authority Level Colors */
--level-board: #7C3AED         /* Purple-600 */
--level-executive: #DC2626     /* Red-600 */
--level-senior: #F59E0B        /* Amber-500 */
--level-management: #3B82F6    /* Blue-500 */
--level-operational: #10B981   /* Green-500 */
```

### **Typography**
- **Headers:** `text-h1` (28px), `text-h2` (24px), `text-h3` (20px)
- **Body:** `text-p2` (14px), `text-p3` (12px)
- **Font:** System font stack (same as ERM)

### **Components**
- **Cards:** `rounded-lg border p-4`
- **Buttons:** Primary (amber), Secondary (gray), Danger (red)
- **Badges:** Rounded, color-coded by status
- **Tables:** Striped rows, hover states
- **Forms:** Clear labels, validation states

---

## 🔢 **MOCK DATA REQUIREMENTS**

### **Authority Matrices (3 complete matrices)**

**1. Financial Authority Matrix**
- Purchase Orders: $0-$10M (5 tiers)
- Contract Approvals: $0-$5M (4 tiers)
- Budget Approvals: $0-$50M (5 tiers)
- Expense Approvals: $0-$100k (4 tiers)

**2. HR Authority Matrix**
- Hiring Decisions: Junior, Mid, Senior, Executive
- Compensation Changes: 0-50% increases
- Terminations: Performance, Redundancy, Misconduct
- Leave Approvals: Annual, Sick, Parental

**3. IT Authority Matrix**
- IT Change Approvals: Standard, Normal, Emergency
- System Access Grants: Read, Write, Admin, Owner
- Vendor Onboarding: <$50k, $50k-$500k, >$500k

### **Delegations (12 records)**
- 2 Active OOO delegations
- 3 Expired OOO delegations
- 3 Permanent delegations
- 2 Acting/Interim delegations
- 2 Project-based delegations

### **Approval Requests (20 records)**
- 5 Pending (various amounts, types)
- 10 Approved (history)
- 3 Rejected (with reasons)
- 2 Emergency approvals

### **SoD Rules (8 rules)**
- 3 Critical severity (e.g., "Requestor cannot approve own purchase")
- 3 High severity
- 2 Medium severity

### **SoD Conflicts (5 detected)**
- 2 Open (need resolution)
- 2 Remediated (closed)
- 1 Accepted with compensating controls

---

## ⚡ **IMPLEMENTATION ORDER**

### **Phase 1: Foundation (Day 1 - 6h)**
1. ✅ Create type definitions (`doa-types.ts`)
2. ✅ Build all mock data files
3. ✅ Create DoA layout & sidebar
4. ✅ Build main dashboard

### **Phase 2: Authority Matrix (Day 2 - 8h)**
1. ✅ Matrix hub page
2. ✅ Create/Edit matrix wizard
3. ✅ Matrix detail view
4. ✅ Entry management pages
5. ✅ Version history & comparison

### **Phase 3: Approvals (Day 3 - 8h)**
1. ✅ Approvals dashboard
2. ✅ Submit request wizard
3. ✅ Approval detail & action page
4. ✅ Workflow configuration pages

### **Phase 4: Delegation & SoD (Day 4 - 8h)**
1. ✅ Delegations dashboard
2. ✅ Create/edit delegation
3. ✅ Calendar view
4. ✅ SoD monitoring dashboard
5. ✅ Rules management
6. ✅ Conflict remediation

### **Phase 5: Reports & Polish (Day 5 - 6h)**
1. ✅ Exception management pages
2. ✅ All 7 reports
3. ✅ Settings & admin pages
4. ✅ Final testing & polish

---

## ✅ **QUALITY STANDARDS**

### **Must-Have Features**
- ✅ All pages accessible via navigation
- ✅ Forms accept input (controlled components)
- ✅ Filters work on list views
- ✅ Search functionality operational
- ✅ Detail pages show realistic data
- ✅ Status badges color-coded
- ✅ Responsive design (mobile-friendly)
- ✅ Consistent amber theme
- ✅ Loading states where appropriate
- ✅ Error handling graceful

### **Level 2 Interactivity**
- ✅ Forms validate input
- ✅ Wizards navigate steps
- ✅ Tabs switch content
- ✅ Modals open/close
- ✅ Filters update results
- ✅ Tables sort (client-side)
- ✅ Links navigate correctly
- ✅ Export menus present (mock)

---

## 🎬 **DEMO SCENARIOS**

When complete, you should be able to demonstrate:

1. **Authority Matrix Management**
   - Browse matrices by function
   - View financial authority matrix
   - Navigate version history
   - See authority entries with thresholds

2. **Approval Workflow**
   - Submit new approval request
   - See pending approvals
   - Approve/reject a request
   - View approval timeline

3. **Delegation Management**
   - Create OOO delegation
   - View active delegations
   - Check calendar view
   - Revoke delegation

4. **SoD Monitoring**
   - View conflict dashboard
   - See critical SoD rules
   - Review conflict details
   - Document remediation

5. **Reporting**
   - Access reports hub
   - View approval cycle time report
   - Check exception analysis
   - Export executive summary (mock)

---

## 📚 **REFERENCE MATERIALS**

### **Code References**
- `/src/app/erm/*` - ERM module patterns
- `/src/components/compliance/*` - Compliance components
- `/erm/ERM_SYSTEM_COMPLETE_SUMMARY.md` - Implementation guide

### **Documentation**
- `/doa/DOA_MODULE_PLAN.md` - Complete module plan
- `/doa/DOA_IMPLEMENTATION_PLAN.md` - Detailed implementation plan
- `/docs/BASE_UI_SPECIFICATION.md` - Design system

---

## 🚦 **GETTING STARTED**

### **Step 1: Review Requirements**
- Read all 10 BRD prompts (already captured)
- Review existing DoA plan documents
- Understand scope and objectives

### **Step 2: Set Up Structure**
- Create folder structure
- Set up type definitions
- Build mock data

### **Step 3: Build Foundation**
- DoA layout & sidebar
- Main dashboard
- Integration into main app

### **Step 4: Iterate Through Modules**
- Complete one module at a time
- Test navigation as you go
- Commit frequently

### **Step 5: Polish & Test**
- Verify all 51 pages accessible
- Test responsive design
- Ensure consistent styling
- Final QA pass

---

**Ready to build!** 🎯

Start with: `src/lib/doa/types/doa-types.ts`

