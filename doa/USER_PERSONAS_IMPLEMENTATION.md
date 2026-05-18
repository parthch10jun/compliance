# DoA Module - User Personas Implementation

**Date:** 2026-05-15  
**Status:** ✅ **COMPLETE**

---

## 🎯 **OVERVIEW**

The DoA Module now includes a **complete user persona switching system** that allows demo viewers to experience the application from different role perspectives.

---

## 👥 **8 USER PERSONAS IMPLEMENTED**

Based on the DoA User Personas diagram, we've implemented all 8 personas with their specific permissions:

### **1. DoA Administrator** 🔧
- **Description:** System administrator with full control
- **Permissions:** Full access to everything
- **Primary Actions:**
  - Configure authority matrix
  - Manage policies & versions
  - Define SoD rules
  - Manage roles

### **2. Policy Owner / Compliance** 📋
- **Description:** Compliance officer managing policies
- **Permissions:** Policy management, SoD rules, breach reports
- **Primary Actions:**
  - Align regs to DoA
  - Map regs to DoA
  - Sign-off on changes
  - Run breach reports

### **3. Approver (Manager → Board)** ✅
- **Description:** Manager or executive with approval authority
- **Permissions:** Approve requests, delegate authority
- **Primary Actions:**
  - Approve requests
  - Delegate authority
  - Add justification
  - View delegate queue

### **4. Originator / Requester** 📝
- **Description:** Employee submitting approval requests
- **Permissions:** Submit and track requests only
- **Primary Actions:**
  - Submit requests
  - Track status
  - Re-submit / withdraw

### **5. Internal Auditor** 🔍
- **Description:** Auditor with read-only access to all data
- **Permissions:** View-only access, export evidence
- **Primary Actions:**
  - Read-only audit trail
  - SoD breach reports
  - Authority usage stats
  - Evidence export

### **6. Risk Officer** ⚠️
- **Description:** Risk management and exception oversight
- **Permissions:** Manage exceptions, risk thresholds
- **Primary Actions:**
  - Manage exceptions
  - Link to risk register
  - Set risk thresholds
  - Review overrides

### **7. Integrator / IT Admin** 🔌
- **Description:** System integrator managing technical connections
- **Permissions:** API management, system integration
- **Primary Actions:**
  - Manage API keys
  - Connect ERP/HRMS
  - Monitor integration
  - Rotate credentials

### **8. Executive / Board** 👔
- **Description:** C-level executive with high-level oversight
- **Permissions:** Dashboard view, high-value approvals
- **Primary Actions:**
  - Dashboard view
  - High-value reportals
  - Period attestations
  - Exception summaries

---

## 🎨 **USER INTERFACE**

### **Persona Switcher Component**
- **Location:** Top-right of every DoA page
- **Features:**
  - Dropdown showing all 8 personas
  - Current persona highlighted
  - Shows persona description and primary actions
  - Persists selection in localStorage

### **Visual Design:**
- Clean dropdown with persona cards
- Current persona shown with checkmark
- Hover states for better UX
- Permission summary at bottom of dropdown

---

## 🔧 **TECHNICAL IMPLEMENTATION**

### **Files Created:**

1. **`src/lib/doa/types/personas.ts`**
   - Type definitions for personas
   - Permission matrix for each role
   - Dashboard view preferences

2. **`src/contexts/PersonaContext.tsx`**
   - React Context for persona state
   - `usePersona()` hook
   - localStorage persistence

3. **`src/components/doa/layout/PersonaSwitcher.tsx`**
   - Dropdown UI component
   - Persona selection
   - Visual feedback

### **Integration:**
- Added to `DOATopBar.tsx` (top-right)
- Wrapped `DoALayout` in `PersonaProvider`
- Available on all 51 DoA pages

---

## 📊 **PERMISSION MATRIX**

| Permission | Admin | Policy | Approver | Requester | Auditor | Risk | IT | Executive |
|-----------|-------|--------|----------|-----------|---------|------|----|-----------| 
| View Matrix | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit Matrix | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Submit Requests | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Approve Requests | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Delegate Authority | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Define SoD Rules | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Run Breach Reports | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Manage Exceptions | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| View Audit Trail | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Manage API Keys | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |

---

## 🎬 **DEMO USAGE**

### **How to Use:**

1. **Navigate to any DoA page** (e.g., `/doa`)
2. **Click the Persona Switcher** in the top-right
3. **Select a persona** from the dropdown
4. **Explore the application** with that persona's permissions
5. **Switch personas** anytime to see different views

### **Demo Scenarios:**

**Scenario 1: Requester Experience**
1. Switch to "Originator / Requester"
2. Submit a new approval request
3. Track its status
4. See limited navigation (can't approve or delegate)

**Scenario 2: Approver Experience**
1. Switch to "Approver"
2. View pending approvals
3. Approve/reject requests
4. Create delegations

**Scenario 3: Auditor Experience**
1. Switch to "Internal Auditor"
2. View all audit trails
3. Export evidence reports
4. No edit permissions (read-only)

---

## ✅ **STATUS**

- [x] 8 personas defined
- [x] Permission matrix implemented
- [x] Persona switcher UI created
- [x] Context provider added
- [x] LocalStorage persistence
- [x] Integrated into all DoA pages
- [x] **FUNCTIONAL permission enforcement**
- [x] Conditional navigation (sidebar items hide/show)
- [x] Conditional action buttons (Create/Edit buttons hide/show)
- [x] No errors or warnings

## 🎯 **WHAT'S NOW FUNCTIONAL (NOT JUST COSMETIC!)**

### **Real Permission Enforcement:**

1. **Sidebar Navigation** - Menu items hide/show based on permissions
   - Example: "SoD Monitoring" hidden for Originators
   - Example: "Settings" only visible to Administrators

2. **Action Buttons** - Create/Edit/Delete buttons conditional
   - "Submit Request" button only shows if `submitRequests` permission
   - "Create Delegation" button only shows if `createDelegation` permission
   - "Create Matrix" button only shows if `createMatrix` permission
   - "Create SoD Rule" button only shows if `createSoDRules` permission
   - "Request Exception" button only shows if `requestException` permission

### **Example Test Scenarios:**

**Scenario 1: Switch to "Internal Auditor"**
- ✅ Sidebar shows: Dashboard, Authority Matrix, Approvals, Delegations, Reports, SoD Monitoring
- ❌ Sidebar hides: Settings
- ❌ "Submit Request" button hidden (read-only access)
- ❌ "Create Matrix" button hidden
- ✅ Can view everything, but no edit buttons

**Scenario 2: Switch to "Originator / Requester"**
- ✅ Sidebar shows: Dashboard, Authority Matrix, Approvals, Delegations
- ❌ Sidebar hides: SoD Monitoring, Reports, Exceptions, Settings
- ✅ "Submit Request" button visible
- ❌ "Create Delegation" button hidden (can't delegate)
- ❌ "Create Matrix" button hidden

**Scenario 3: Switch to "DoA Administrator"**
- ✅ ALL sidebar items visible
- ✅ ALL action buttons visible
- ✅ Full access to everything

**READY FOR DEMO!** 🎉
