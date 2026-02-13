# Requirements & Obligations - Quick Reference Guide

## 🤔 When to Use Which?

### Use **Requirement** when:
- ✅ It's an ongoing compliance state (not a one-time action)
- ✅ It can be measured with a compliance score
- ✅ It requires continuous monitoring
- ✅ It's about "being compliant" vs "doing something"
- ✅ Examples: "Maintain encryption", "Have MFA enabled", "Establish policy"

### Use **Obligation** when:
- ✅ It has a specific deadline or due date
- ✅ It requires submission to a regulator
- ✅ It's triggered by an event
- ✅ Missing it has specific penalties
- ✅ It requires evidence collection and approval
- ✅ Examples: "Submit Q4 report", "File annual disclosure", "Notify breach"

---

## 📊 Type Definitions

### RequirementCitation
```typescript
{
  id: string;
  code: string;              // "REQ-RBI-001"
  title: string;
  description: string;
  programId: string;
  programName: string;
  authorityId: string;
  authorityName: string;
  section: string;
  category: string;
  riskRating: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Compliant' | 'Partially Compliant' | 'Non-Compliant' | 'Not Assessed';
  complianceScore?: number;  // 0-100
  controlCount: number;
  owner: string;
  department: string;
  lastReviewDate: string;
  nextReviewDate: string;
  createdAt: string;
  updatedAt: string;
}
```

### ObligationCitation
```typescript
{
  id: string;
  code: string;              // "OBL-RBI-001"
  title: string;
  description: string;
  programId: string;
  programName: string;
  authorityId: string;
  authorityName: string;
  section: string;
  
  // Obligation-specific
  obligationType: 'Reporting' | 'Disclosure' | 'Notification' | 'Filing' | 'Submission' | 'Certification';
  frequency: 'One-time' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual' | 'Event-Driven';
  dueDate: string;
  triggerEvent?: string;
  triggerCondition?: string;
  leadTime?: number;
  submissionMethod: 'Portal' | 'Email' | 'Physical' | 'API' | 'Other';
  recipientContact?: string;
  confirmationRequired: boolean;
  status: 'Upcoming' | 'In Progress' | 'Submitted' | 'Overdue' | 'Completed';
  lastSubmissionDate?: string;
  nextDueDate: string;
  evidenceRequired?: string[];
  approvalRequired: boolean;
  approver?: string;
  riskRating: 'Critical' | 'High' | 'Medium' | 'Low';
  escalationPath?: string[];
  penaltyForNonCompliance?: string;
  owner: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 🔗 Linking to Controls

### Link Requirement to Control
```typescript
const link: ControlRequirementLink = {
  controlId: 'ctrl-001',
  requirementId: 'req-001',
  linkedAt: '2024-12-23',
  linkedBy: 'user@example.com',
  notes: 'MFA control addresses authentication requirement'
};
```

### Link Obligation to Control
```typescript
const link: ControlObligationLink = {
  controlId: 'ctrl-002',
  obligationId: 'obl-001',
  linkedAt: '2024-12-23',
  linkedBy: 'user@example.com',
  notes: 'Automated report generation control'
};
```

---

## 🛠️ Utility Functions

### Date Formatting
```typescript
import { formatDate, formatDateShort, formatDateLong } from '@/lib/utils';

formatDate('2025-01-15')      // "Jan 15, 2025"
formatDateShort('2025-01-15') // "Jan 15, 2025" (same as formatDate)
formatDateLong('2025-01-15')  // "January 15, 2025"
```

### Date Calculations
```typescript
import { getDaysBetween, isOverdue, isDueSoon } from '@/lib/utils';

getDaysBetween('2025-01-15')  // 23 (days from today)
isOverdue('2024-12-01')       // true
isDueSoon('2024-12-30')       // true (within 7 days)
```

### Relative Time
```typescript
import { formatRelativeTime } from '@/lib/utils';

formatRelativeTime('2024-12-24') // "Tomorrow"
formatRelativeTime('2024-12-22') // "Yesterday"
formatRelativeTime('2025-01-05') // "in 13 days"
```

---

## 📁 File Locations

### Types
- `src/lib/types/compliance.ts` - All type definitions

### Data
- `src/lib/data/requirements-obligations.ts` - Mock data for both

### Pages
- `src/app/requirements/page.tsx` - Requirements list page
- `src/app/obligations/page.tsx` - Obligations list page

### Components
- `src/components/Sidebar.tsx` - Navigation (includes Requirements & Obligations)
- `src/components/TopBar.tsx` - Quick access menu
- `src/components/Breadcrumbs.tsx` - Breadcrumb navigation

### Utilities
- `src/lib/utils.ts` - Date formatting and helper functions

---

## 🎨 UI Patterns

### Requirements Page
- **Focus**: Compliance score, status, control mapping
- **Colors**: Blue for compliant, amber for partial, red for non-compliant
- **Filters**: Status, Risk
- **KPIs**: Total, Compliant, Partially Compliant, Non-Compliant, Avg Score

### Obligations Page
- **Focus**: Deadlines, submissions, urgency
- **Colors**: Red for overdue, amber for due soon, blue for in progress
- **Filters**: Status, Type
- **KPIs**: Total, Due This Month, In Progress, Overdue, Upcoming, Completed

---

## 🔄 Common Workflows

### Requirement Workflow
1. Create requirement from regulatory citation
2. Map to relevant controls
3. Schedule periodic reviews
4. Assess compliance score
5. Update status based on control effectiveness

### Obligation Workflow
1. Create obligation from regulatory citation
2. Set deadline and frequency
3. Assign owner and approver
4. Collect required evidence
5. Submit to regulator
6. Track confirmation
7. Schedule next occurrence (if recurring)

---

## 📊 Metrics to Track

### Requirements
- Overall compliance score
- % Compliant vs Partially Compliant vs Non-Compliant
- Control coverage (requirements with controls mapped)
- Review cycle adherence

### Obligations
- On-time submission rate
- Overdue count
- Average lead time used
- Confirmation receipt rate
- Penalty incidents

---

## 🚨 Common Pitfalls

### ❌ Don't
- Mix requirements and obligations in the same entity
- Use obligations for ongoing compliance states
- Use requirements for time-bound submissions
- Forget to update `nextDueDate` after obligation completion

### ✅ Do
- Keep requirements focused on continuous compliance
- Keep obligations focused on deadlines and submissions
- Link both to appropriate controls
- Update metrics when status changes
- Use proper date utilities for consistency

---

## 📞 Need Help?

- **Type System**: See `src/lib/types/compliance.ts`
- **Examples**: See `src/lib/data/requirements-obligations.ts`
- **Architecture**: See `REQUIREMENTS_OBLIGATIONS_SPLIT.md`
- **Design System**: See `DESIGN_SYSTEM.md`

---

**Last Updated**: December 23, 2024

