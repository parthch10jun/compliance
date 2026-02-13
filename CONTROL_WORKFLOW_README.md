# Control Testing & Evidence Workflow - Complete Guide

## 🎯 Quick Answer

**"When you have a control, how do you know what evidence and what tests it needs, and if those tests are visible?"**

### ✅ Yes, Everything is Visible!

Navigate to any control detail page (e.g., `/controls/ctrl-001`) to see:

1. **All Required Tests** - Listed with status, schedule, and procedures
2. **All Required Evidence** - Listed with approval status and expiration
3. **Complete Workflow** - From test execution to evidence approval
4. **Test Results** - What was tested and what was found
5. **Evidence Review History** - Who uploaded, reviewed, and approved

---

## 📊 Visual Diagrams

### 1. Control Testing & Evidence Workflow
See the Mermaid diagram: "Control Testing & Evidence Workflow"
- Shows the complete flow from Program → Requirements → Controls → Tests → Evidence
- Color-coded by entity type
- Shows all relationships and dependencies

### 2. Complete Workflow Sequence
See the Mermaid diagram: "Complete Control Testing & Evidence Approval Workflow"
- Step-by-step sequence of actions
- Shows all actors (Owner, Tester, Reviewer, Approver)
- Includes notifications and compliance calculations

### 3. Data Relationships
See the Mermaid diagram: "Control, Test, and Evidence Data Relationships"
- Entity-relationship diagram
- Shows all database tables and their relationships
- Includes key fields for each entity

---

## 📁 Documentation Files

### 1. CONTROL_TESTING_WORKFLOW.md
**Comprehensive technical documentation** covering:
- Control hierarchy and structure
- Test structure and execution
- Evidence structure and approval
- Complete 10-step workflow
- How to determine what's needed
- Data flow examples
- Key features and capabilities

### 2. WORKFLOW_SUMMARY.md
**Quick reference guide** with:
- Quick answers to common questions
- Visual flow diagrams (text-based)
- Step-by-step examples
- Where to find information
- How to use the system
- Color-coded status indicators

### 3. CONTROL_WORKFLOW_README.md (this file)
**Overview and navigation guide** to all resources

---

## 🧩 New Components Created

### 1. TestEvidenceRequirements Component
**File**: `src/components/TestEvidenceRequirements.tsx`

**Purpose**: Shows all tests and evidence required for a control

**Features**:
- Summary cards with completion percentages
- Test completion rate (e.g., 100% - 12/12 passed)
- Evidence approval rate (e.g., 100% - 1/1 approved)
- List of all required tests with:
  - Test code, name, type, frequency
  - Status (Passed/Failed/Pending)
  - Tester and schedule
  - Evidence required for each test
- List of all required evidence with:
  - Evidence code, name, type
  - Status (Approved/Pending/Rejected)
  - Validation status
  - Expiration dates with color coding

**Usage**:
```tsx
import { TestEvidenceRequirements } from '@/components';

<TestEvidenceRequirements
  controlCode="CTRL-001"
  controlName="Multi-Factor Authentication"
  tests={linkedTests}
  evidence={linkedEvidence}
/>
```

### 2. ControlWorkflowTimeline Component
**File**: `src/components/ControlWorkflowTimeline.tsx`

**Purpose**: Shows chronological workflow of test execution and evidence approval

**Features**:
- Timeline view of all workflow events
- Color-coded by status (success/warning/error/pending/info)
- Shows actor and timestamp for each event
- Event types:
  - Test scheduled
  - Test executed
  - Evidence uploaded
  - Evidence reviewed
  - Evidence approved/rejected
- Metadata display (test codes, evidence codes, results, decisions)

**Usage**:
```tsx
import { ControlWorkflowTimeline } from '@/components';

<ControlWorkflowTimeline
  controlCode="CTRL-001"
  controlName="Multi-Factor Authentication"
  events={workflowEvents}
/>
```

---

## 🔍 Where to Find Information

### On Control Detail Page (`/controls/[id]`)

#### Section 1: Control Overview
- Control code, name, description
- Owner and department
- Type (Preventive/Detective/Corrective)
- Effectiveness rating
- Compliance score

#### Section 2: Test & Evidence Requirements (NEW)
- Summary cards showing completion rates
- All required tests with status
- All required evidence with approval status
- Evidence requirements for each test
- Expiration tracking

#### Section 3: Control Testing
- Detailed test information
- Test procedures (step-by-step)
- Execution details (tester, dates)
- Test results and findings
- Linked evidence

#### Section 4: Evidence
- All evidence documents
- Approval workflow status
- Review history
- Version history
- Expiration dates

#### Section 5: Workflow Timeline (NEW)
- Chronological view of all events
- Test executions
- Evidence uploads
- Reviews and approvals

#### Section 6: Linked Requirements/Obligations
- Requirements this control satisfies
- Obligations this control fulfills

#### Section 7: Mitigated Risks
- Risks this control addresses
- Risk ratings and mitigation effectiveness

---

## 🔄 Complete Workflow Example

### Scenario: CTRL-001 (Multi-Factor Authentication)

**1. Control Setup**
- Owner creates control
- Links to REQ-001 (Implement MFA)
- Defines tests: TST-001, TST-002

**2. Test Planning**
- TST-001: MFA Enforcement Verification
  - Type: Operating Effectiveness
  - Frequency: Quarterly
  - Evidence needed: MFA Configuration Report

**3. Test Execution**
- Tester: Priya Patel
- Date: 2024-12-16
- Procedure followed step-by-step
- Result: Pass
- Actual: "All 247 accounts have MFA enabled"

**4. Evidence Upload**
- Evidence: EVD-001 (MFA Config Report)
- File: mfa-config-report-2024-12.pdf
- Uploaded by: Priya Patel
- Status: Pending Review

**5. Evidence Review**
- Reviewer: Vikram Singh
- Date: 2024-12-16
- Decision: Approve
- Validation: Sufficient
- Comments: "100% coverage verified"

**6. Evidence Approval**
- Approved by: Vikram Singh
- Status: Approved
- Expires: 2025-03-15

**7. Compliance Update**
- Test status: Passed
- Control score: 100% (12/12 tests passed)
- Requirement REQ-001: 95%
- Program PGM-002: 92%

---

## 🎨 Status Indicators

### Test Status
- 🟢 **Passed** - Test completed successfully
- 🔴 **Failed** - Test found issues
- 🟡 **Pending** - Test scheduled but not executed
- 🔵 **In Progress** - Test currently being executed
- ⚪ **Not Started** - Test not yet scheduled

### Evidence Status
- 🟢 **Approved** - Evidence approved and valid
- 🔴 **Rejected** - Evidence rejected, needs resubmission
- 🔴 **Expired** - Evidence past expiration date
- 🟡 **Pending Review** - Evidence awaiting review
- 🔵 **Draft** - Evidence being prepared

### Validation Status
- ✅ **Sufficient** - Evidence meets all requirements
- ⚠️ **Insufficient** - Evidence incomplete or inadequate
- 🔄 **Needs Update** - Evidence requires updates
- ❓ **Not Reviewed** - Evidence not yet reviewed

---

## 🚀 How to Use

### To View Control Requirements:
1. Navigate to `/controls/ctrl-001`
2. Scroll to "Test & Evidence Requirements" section
3. View summary cards for completion rates
4. Review list of required tests
5. Review list of required evidence

### To Execute a Test:
1. Go to control detail page
2. Find test in "Control Testing" section
3. Click "Execute Test" button
4. Follow the test procedure
5. Upload evidence
6. Record result (Pass/Fail)

### To Upload Evidence:
1. Click "Upload Evidence" button
2. Select files to upload
3. Set evidence type
4. Add description and notes
5. Link to control/test/requirement
6. Submit for review

### To Review Evidence:
1. Go to evidence detail page
2. Click "Review" button
3. Examine the evidence document
4. Make decision (Approve/Reject)
5. Set validation status
6. Add review comments
7. Submit review

---

## 📋 Summary

### What You Can See:
✅ All tests required for each control
✅ All evidence needed for each test
✅ Status of all tests (passed/failed/pending)
✅ Status of all evidence (approved/rejected/pending)
✅ Complete workflow from test to approval
✅ Expiration tracking and reminders
✅ Compliance score calculations
✅ Complete audit trail

### Where to See It:
📍 Control Detail Page: `/controls/[id]`
📍 Test & Evidence Requirements Section
📍 Control Testing Section
📍 Evidence Section
📍 Workflow Timeline Section

### Key Benefits:
🎯 Complete visibility into testing requirements
🎯 Clear approval workflow
🎯 Automated compliance calculations
🎯 Full traceability and audit trail
🎯 Expiration management
🎯 Role-based accountability

---

## 📚 Additional Resources

- **CONTROL_TESTING_WORKFLOW.md** - Detailed technical documentation
- **WORKFLOW_SUMMARY.md** - Quick reference guide
- **Mermaid Diagrams** - Visual workflow representations
- **Component Documentation** - In-code documentation for new components

---

## 🔗 Related Files

- `src/lib/data/controls.ts` - Control data
- `src/lib/data/control-tests.ts` - Test data
- `src/lib/data/evidence.ts` - Evidence data
- `src/lib/types/compliance.ts` - Type definitions
- `src/components/ExecuteTestModal.tsx` - Test execution modal
- `src/components/UploadEvidenceModal.tsx` - Evidence upload modal
- `src/components/ReviewEvidenceModal.tsx` - Evidence review modal
- `src/app/controls/[id]/page.tsx` - Control detail page

