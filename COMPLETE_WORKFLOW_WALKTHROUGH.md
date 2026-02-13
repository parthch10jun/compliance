# Complete Compliance Workflow - End-to-End Walkthrough

## 🎯 Overview

This document provides a **complete step-by-step walkthrough** of the entire compliance management workflow, from adding a framework to managing evidence. It also identifies **gaps** that need to be filled.

**Date**: January 2, 2026  
**Status**: Comprehensive Guide with Gap Analysis

---

## 📊 Complete Workflow Chain

```
1. Add Authority/Framework
   ↓
2. Create/Link Program
   ↓
3. Link Framework to Program
   ↓
4. Add Requirements & Obligations
   ↓
5. Map Controls to Requirements
   ↓
6. Create Tests for Controls
   ↓
7. Upload Evidence
   ↓
8. Execute Tests
   ↓
9. Review Evidence
   ↓
10. Track Compliance
```

---

## 🚀 Step-by-Step Walkthrough

### **STEP 1: Add Authority/Framework**

**Current Status**: ⚠️ **BUTTON EXISTS BUT NO MODAL**

**Location**: `/authorities`

**What Works**:
- ✅ Authorities page displays all regulatory bodies
- ✅ Shows counts (programs, requirements, obligations, controls)
- ✅ Grid and list view modes
- ✅ Search and filter functionality
- ✅ "Add Authority" button exists

**What's Missing**:
- ❌ **Add Authority Modal** - Not implemented
- ❌ Authority creation form
- ❌ Authority detail page

**How It Should Work**:
```
1. Navigate to /authorities
2. Click "Add Authority" button
3. Fill in authority details:
   - Name (e.g., "Reserve Bank of India")
   - Short Code (e.g., "RBI")
   - Type (Regulatory, Standards, Jurisdictional)
   - Description
   - Website URL
   - Contact information
4. Click "Create Authority"
5. Authority added to system
```

**Workaround**: Authorities are currently derived from tags in requirements/obligations/controls

---

### **STEP 2: Create Program**

**Current Status**: ✅ **FULLY FUNCTIONAL**

**Location**: `/programs`

**How It Works**:
```
1. Navigate to /programs
2. Click "Create Program" button (violet)
3. Choose creation method:
   a) Use Template (from library)
   b) Create Custom Program
4. For Custom Program:
   - Enter program name
   - Enter description
   - Select framework
   - Assign owner
   - Select department
   - Set priority
   - Add tags
5. Click "Create Program"
6. Program created successfully
```

**Components Used**:
- `ProgramCreationWizard.tsx` - Template selection
- `CreateProgramModal.tsx` - Custom program creation

---

### **STEP 3: Link Framework to Program**

**Current Status**: ✅ **FULLY FUNCTIONAL**

**Location**: `/programs/[id]` (Program Detail Page)

**How It Works**:
```
1. Navigate to program detail page (e.g., /programs/pgm-001)
2. Click "Link Framework" button (cyan, top right)
3. Step 1 - Select Authority:
   - Choose regulatory authority (RBI, ISO, EU, SDAIA, NIST, etc.)
   - Click on authority card
4. Step 2 - Select Framework:
   - Browse available frameworks
   - Use search to filter
   - Click on framework card
   - View framework metadata (requirements, obligations, controls)
5. Click "Link Framework" button
6. Framework linked to program
```

**Components Used**:
- `LinkFrameworkModal.tsx`

**Result**: Framework's requirements and obligations are now available to link to the program

---

### **STEP 4: Add Requirements & Obligations**

#### **4A: Add Requirements**

**Current Status**: ✅ **FULLY FUNCTIONAL**

**Location**: `/programs/[id]` or `/requirements`

**How It Works**:
```
1. On program detail page, scroll to "Requirements" section
2. Click "+ Add" button (amber)
3. Choose mode:
   a) Import from Library
   b) Create New Requirement
   
For Import from Library:
4a. Search and filter requirements
5a. Select multiple requirements (checkboxes)
6a. Click "Import Selected"
7a. Requirements added to program

For Create New:
4b. Fill in requirement details:
    - Code (e.g., REQ-001)
    - Title
    - Description
    - Section reference
    - Category (Access Control, Data Protection, etc.)
    - Priority (Low, Medium, High, Critical)
5b. Click "Create Requirement"
6b. Requirement created and added to program
```

**Components Used**:
- `AddRequirementModal.tsx`

#### **4B: Add Obligations**

**Current Status**: ⚠️ **BUTTON EXISTS BUT NO MODAL**

**Location**: `/obligations`

**What Works**:
- ✅ Obligations page displays all obligations
- ✅ Shows deadlines, status, frequency
- ✅ Search and filter functionality
- ✅ "Add Obligation" button exists

**What's Missing**:
- ❌ **Add Obligation Modal** - Not implemented
- ❌ Obligation creation form

**How It Should Work**:
```
1. Navigate to /obligations
2. Click "Add Obligation" button
3. Fill in obligation details:
   - Code (e.g., OBL-001)
   - Title
   - Description
   - Type (Reporting, Filing, Notification, Audit, Review)
   - Frequency (One-time, Monthly, Quarterly, Annual)
   - Due date
   - Trigger event (optional)
   - Responsible party
   - Program linkage
4. Click "Create Obligation"
5. Obligation added to system
```

---

### **STEP 5: Map Controls to Requirements**

**Current Status**: ✅ **FULLY FUNCTIONAL**

**Location**: `/programs/[id]` (on requirement cards)

**How It Works**:
```
1. On program detail page, find a requirement card
2. Click "Map Control" button on the requirement
3. Choose mode:
   a) Select Existing Controls
   b) Create New Control
   
For Select Existing:
4a. Search and filter controls
5a. Select multiple controls (checkboxes)
6a. Click "Map Selected"
7a. Controls linked to requirement

For Create New:
4b. Fill in control details:
    - Code (e.g., CTRL-001)
    - Name
    - Description
    - Category (Access Control, Encryption, etc.)
    - Type (Preventive, Detective, Corrective)
    - Automation Level (Manual, Semi-Automated, Fully Automated)
    - Frequency (Continuous, Daily, Weekly, Monthly, etc.)
    - Owner
    - Department
5b. Click "Create Control"
6b. Control created and automatically mapped to requirement
```

**Components Used**:
- `MapControlModal.tsx`
- `CreateControlModal.tsx`

---

### **STEP 6: Create Tests for Controls**

**Current Status**: ✅ **FULLY FUNCTIONAL**

**Location**: `/controls/[id]` (Control Detail Page)

**How It Works**:
```
1. Navigate to control detail page
2. Click "Add Test" button
3. Fill in test details:
   - Test code (e.g., TST-001)
   - Test name
   - Test type (Manual, Automated, Hybrid)
   - Frequency (Daily, Weekly, Monthly, Quarterly, Annual)
   - Test procedure (step-by-step)
   - Expected result
   - Assignee
   - Due date
4. Click "Create Test"
5. Test created and linked to control
```

**Components Used**:
- `AddTestModal.tsx`

---

### **STEP 7: Upload Evidence**

**Current Status**: ✅ **FULLY FUNCTIONAL**

**Location**: Multiple locations (Controls, Tests, Evidence Library)

**How It Works**:
```
1. From control detail page or test page
2. Click "Upload Evidence" button
3. Upload evidence:
   - Drag and drop files OR click to browse
   - Select evidence type (Document, Screenshot, Report, etc.)
   - Add description
   - Set validity date (optional)
   - Add notes
   - Link to control or test
4. Click "Upload Evidence"
5. Evidence uploaded and linked
```

**Components Used**:
- `UploadEvidenceModal.tsx`

**Alternative**: Navigate to `/evidence` and upload directly

---

### **STEP 8: Execute Tests**

**Current Status**: ✅ **FULLY FUNCTIONAL**

**Location**: `/controls/[id]` or test management pages

**How It Works**:
```
1. Navigate to control detail page
2. Find test in tests section
3. Click "Execute Test" button
4. Execute test:
   - Review test procedure
   - Perform test steps
   - Record result (Pass/Fail)
   - Add findings/notes
   - Attach evidence (optional)
5. Click "Submit Results"
6. Test execution recorded
```

**Components Used**:
- `ExecuteTestModal.tsx`

---

### **STEP 9: Review Evidence**

**Current Status**: ✅ **FULLY FUNCTIONAL**

**Location**: `/evidence/[id]` (Evidence Detail Page)

**How It Works**:
```
1. Navigate to evidence detail page
2. For pending evidence, click "Review Evidence" button
3. Review evidence:
   - View evidence summary
   - Select decision: Approve or Reject
   - If Approve: Select validation status (Sufficient, Insufficient, Needs Update)
   - Enter review comments (required)
4. Click "Approve Evidence" or "Reject Evidence"
5. Evidence status updated
```

**Components Used**:
- `ReviewEvidenceModal.tsx`

---

### **STEP 10: Track Compliance**

**Current Status**: ✅ **FULLY FUNCTIONAL**

**Location**: Dashboard, Program Detail Pages

**How It Works**:
```
1. Navigate to dashboard (/)
2. View compliance metrics:
   - Overall compliance score
   - Requirements compliance
   - Control effectiveness
   - Test pass rate
   - Obligation completion
3. Click on compliance score for detailed breakdown
4. View trends and analytics
5. Identify areas needing attention
```

**Components Used**:
- `ComplianceScoreModal.tsx`
- Dashboard components

---

## ❌ Identified Gaps

### **Gap 1: Add Authority Modal**
**Status**: ❌ Not Implemented  
**Priority**: Medium  
**Location**: `/authorities`  
**Impact**: Users cannot add new regulatory authorities to the system

### **Gap 2: Add Obligation Modal**
**Status**: ❌ Not Implemented  
**Priority**: High  
**Location**: `/obligations`  
**Impact**: Users cannot create new obligations

### **Gap 3: Authority Detail Page**
**Status**: ❌ Not Implemented  
**Priority**: Low  
**Location**: `/authorities/[id]`  
**Impact**: Users cannot view detailed information about an authority

### **Gap 4: Obligation Detail Page**
**Status**: ❌ Not Implemented  
**Priority**: Medium  
**Location**: `/obligations/[id]`  
**Impact**: Users cannot view detailed information about an obligation

### **Gap 5: Bulk Operations**
**Status**: ❌ Not Implemented  
**Priority**: Low  
**Location**: Multiple pages  
**Impact**: Users cannot perform bulk actions (delete, update, link)

---

## 🎯 Priority Gaps to Fill

### **1. Add Obligation Modal** (HIGH PRIORITY)
This is critical because obligations are a core part of compliance management.

**Required Features**:
- Obligation code and title
- Description and section reference
- Type selection (Reporting, Filing, Notification, Audit, Review)
- Frequency selection (One-time, Monthly, Quarterly, Annual)
- Due date picker
- Trigger event (optional)
- Responsible party assignment
- Program linkage
- Form validation

### **2. Add Authority Modal** (MEDIUM PRIORITY)
While authorities can be derived from tags, having a dedicated modal improves UX.

**Required Features**:
- Authority name and short code
- Type selection (Regulatory, Standards, Jurisdictional)
- Description
- Website URL
- Contact information
- Logo upload (optional)
- Form validation

---

## ✅ What's Already Complete

1. ✅ Program creation (template and custom)
2. ✅ Framework linking
3. ✅ Requirement management (add, import, create)
4. ✅ Control mapping and creation
5. ✅ Test creation and execution
6. ✅ Evidence upload and management
7. ✅ Evidence review and approval
8. ✅ Compliance tracking and analytics
9. ✅ Dashboard and reporting

---

**Next Steps**: Implement the missing modals to complete the workflow!

