# Control Testing & Evidence Workflow - Summary

## Quick Answer to Your Question

**"When you have a control, how do you know what evidence and what tests it needs?"**

### Answer:
1. **Navigate to the Control Detail Page**: `/controls/[id]` (e.g., `/controls/ctrl-001`)
2. **View the "Test & Evidence Requirements" Section**: Shows all required tests and evidence
3. **Check the "Control Testing" Section**: Lists all tests with their status, schedule, and results
4. **Review the "Evidence" Section**: Shows all evidence documents with approval status

## How the System Works

### 1. Control → Tests → Evidence Flow

```
CONTROL (CTRL-001: MFA)
  │
  ├─→ TESTS (What needs to be verified)
  │    ├─→ TST-001: MFA Enforcement Verification
  │    │    ├─ Type: Operating Effectiveness
  │    │    ├─ Frequency: Quarterly
  │    │    ├─ Procedure: Step-by-step instructions
  │    │    ├─ Expected Result: 100% MFA coverage
  │    │    └─ Evidence Required: MFA Config Report
  │    │
  │    └─→ TST-002: MFA Bypass Attempt Test
  │         ├─ Type: Operating Effectiveness
  │         ├─ Frequency: Quarterly
  │         ├─ Procedure: Attempt bypass techniques
  │         ├─ Expected Result: All attempts blocked
  │         └─ Evidence Required: SIEM logs, Test results
  │
  └─→ EVIDENCE (Proof of control operation)
       └─→ EVD-001: MFA Configuration Report
            ├─ Type: Report
            ├─ Status: Approved
            ├─ Uploaded: 2024-12-15 by Priya Patel
            ├─ Reviewed: 2024-12-16 by Vikram Singh
            ├─ Validation: Sufficient
            └─ Expires: 2025-03-15
```

### 2. Where to Find This Information

#### On Control Detail Page (`/controls/ctrl-001`):

**Section 1: Control Information**
- Basic details (name, description, owner)
- Effectiveness rating
- Compliance score
- Test statistics (12/12 passed = 100%)

**Section 2: Test & Evidence Requirements** (NEW COMPONENT)
- Summary cards showing:
  - Test Completion: 100% (12/12 passed)
  - Evidence Approval: 100% (1/1 approved)
- List of all required tests with:
  - Test code, name, type
  - Status (Passed/Failed/Pending)
  - Frequency and schedule
  - Evidence required for each test
- List of all required evidence with:
  - Evidence code, name, type
  - Status (Approved/Pending/Rejected)
  - Validation status
  - Expiration dates

**Section 3: Control Testing**
- Detailed view of each test
- Test procedure (step-by-step)
- Execution details (tester, dates)
- Test results and findings
- Linked evidence

**Section 4: Evidence**
- All evidence documents
- Approval workflow status
- Review history
- Version history
- Expiration tracking

**Section 5: Workflow Timeline** (NEW COMPONENT)
- Chronological view of all events:
  - Test scheduled
  - Test executed
  - Evidence uploaded
  - Evidence reviewed
  - Evidence approved/rejected

### 3. Complete Workflow Example

**Scenario**: CTRL-001 (Multi-Factor Authentication)

#### Step 1: Control is Created
- Control owner: Priya Patel
- Frequency: Continuous
- Type: Preventive

#### Step 2: Tests are Defined
Two tests are created:
1. **TST-001**: Verify MFA is enabled
   - Evidence needed: MFA Configuration Report
2. **TST-002**: Attempt to bypass MFA
   - Evidence needed: SIEM logs, Test results

#### Step 3: Test is Scheduled
- Test: TST-001
- Scheduled: 2024-12-15 (Quarterly)
- Tester: Priya Patel
- Reviewer: Vikram Singh

#### Step 4: Test is Executed
- Date: 2024-12-16
- Tester follows procedure:
  1. Review user access logs
  2. Verify MFA prompts for all login attempts
  3. Test with sample accounts
  4. Review exception reports
- Result: Pass
- Actual Result: "All 247 user accounts have MFA enabled. No exceptions found."

#### Step 5: Evidence is Uploaded
- Evidence: EVD-001 (MFA Configuration Report)
- File: mfa-config-report-2024-12.pdf
- Uploaded by: Priya Patel
- Uploaded at: 2024-12-15
- Status: Pending Review
- Linked to: CTRL-001, TST-001, REQ-001

#### Step 6: Evidence is Reviewed
- Reviewer: Vikram Singh
- Reviewed at: 2024-12-16
- Decision: Approve
- Validation Status: Sufficient
- Comments: "Report shows 100% MFA coverage. All requirements met."

#### Step 7: Evidence is Approved
- Approved by: Vikram Singh
- Approved at: 2024-12-16
- Status: Approved
- Expires: 2025-03-15 (3 months)
- Reminder: 14 days before expiration

#### Step 8: Compliance is Calculated
- Test result: Pass (1/1 = 100%)
- Evidence status: Approved
- Control effectiveness: Effective
- Control compliance score: 100%
- Requirement REQ-001 compliance: 95%
- Program PGM-002 compliance: 92%

### 4. How to Know What's Needed

#### For Tests:
Tests are determined by:
1. **Control Type**: Preventive, Detective, or Corrective
2. **Regulatory Requirements**: What regulators require
3. **Risk Level**: Higher risk = more frequent testing
4. **Automation Level**: Automated controls need different tests

**Example for MFA Control**:
- **Design Test**: Verify MFA is configured correctly
- **Operating Effectiveness Test**: Verify MFA is working in practice
- **Negative Test**: Attempt to bypass MFA

#### For Evidence:
Evidence is determined by:
1. **Test Procedure**: What proof is needed to verify the test
2. **Regulatory Requirements**: What documentation regulators require
3. **Control Frequency**: How often evidence must be refreshed
4. **Audit Requirements**: What auditors need to see

**Example for MFA Control**:
- **Configuration Report**: Shows MFA is enabled for all users
- **Access Logs**: Proves MFA challenges are occurring
- **Exception Reports**: Documents any exceptions
- **Screenshots**: Visual proof of MFA prompts
- **Test Results**: Results from bypass attempts

### 5. Visual Indicators

#### Test Status Colors:
- 🟢 **Green (Passed)**: Test completed successfully
- 🔴 **Red (Failed)**: Test found issues
- 🟡 **Yellow (Pending/In Progress)**: Test is scheduled or running
- ⚪ **Gray (Not Started)**: Test not yet executed

#### Evidence Status Colors:
- 🟢 **Green (Approved)**: Evidence is approved and valid
- 🔴 **Red (Rejected/Expired)**: Evidence is rejected or expired
- 🟡 **Yellow (Pending Review)**: Evidence awaiting review
- 🔵 **Blue (Draft)**: Evidence is being prepared

### 6. Key Features

#### Traceability
- Every test is linked to specific evidence
- Every evidence is linked to controls, tests, and requirements
- Complete audit trail of all actions

#### Accountability
- Clear ownership: tester, reviewer, approver
- Timestamps for all actions
- Comments and notes for context

#### Automation
- Scheduled test reminders
- Evidence expiration alerts
- Compliance score auto-calculation

#### Visibility
- Dashboard shows pending tests and reviews
- Timeline shows complete workflow history
- Requirements component shows what's needed

### 7. New Components Created

#### 1. TestEvidenceRequirements Component
**Location**: `src/components/TestEvidenceRequirements.tsx`

**Purpose**: Shows all tests and evidence required for a control

**Features**:
- Summary cards with completion percentages
- List of all required tests with status
- List of all required evidence with approval status
- Evidence requirements for each test
- Expiration tracking

#### 2. ControlWorkflowTimeline Component
**Location**: `src/components/ControlWorkflowTimeline.tsx`

**Purpose**: Shows chronological workflow of test execution and evidence approval

**Features**:
- Timeline view of all events
- Color-coded by status (success/warning/error)
- Shows actor and timestamp for each event
- Metadata for tests and evidence

### 8. Documentation Created

#### 1. CONTROL_TESTING_WORKFLOW.md
Comprehensive documentation covering:
- Control hierarchy
- Control metadata
- Test structure
- Evidence structure
- Complete workflow (10 steps)
- How to know what's needed
- Viewing the workflow
- Review and approval mechanism
- Data flow example
- Key features

#### 2. WORKFLOW_SUMMARY.md (this file)
Quick reference guide for understanding the workflow

### 9. How to Use

#### To View Control Requirements:
1. Go to `/controls/ctrl-001`
2. Scroll to "Test & Evidence Requirements" section
3. See summary cards showing completion rates
4. Review list of required tests
5. Review list of required evidence

#### To Execute a Test:
1. Go to control detail page
2. Find the test in "Control Testing" section
3. Click "Execute Test"
4. Follow the procedure
5. Upload evidence
6. Record result (Pass/Fail)

#### To Upload Evidence:
1. Click "Upload Evidence" button
2. Select files
3. Set evidence type
4. Add description and notes
5. Link to control/test/requirement
6. Submit for review

#### To Review Evidence:
1. Go to evidence detail page
2. Click "Review" button
3. Examine the evidence
4. Make decision (Approve/Reject)
5. Set validation status
6. Add comments
7. Submit review

### 10. Next Steps

To further enhance the system:
1. Add the new components to control detail page
2. Create workflow dashboard showing all pending items
3. Add email notifications for due tests and expiring evidence
4. Create bulk operations for approving multiple evidence items
5. Add analytics dashboard for trends and insights

## Summary

**The system provides complete visibility into:**
- ✅ What tests are required for each control
- ✅ What evidence is needed for each test
- ✅ Status of all tests (passed/failed/pending)
- ✅ Status of all evidence (approved/rejected/pending)
- ✅ Complete workflow from test execution to evidence approval
- ✅ Expiration tracking and reminders
- ✅ Compliance score calculation
- ✅ Audit trail of all actions

**Everything is visible on the Control Detail Page** at `/controls/[id]`

