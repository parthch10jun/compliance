/**
 * Compliance Module Types
 *
 * HIERARCHY (exclusive parent-child, one-to-many):
 *   Authority/Regulator → Program → Citation
 *   - A Program belongs to ONE Authority
 *   - A Citation belongs to ONE Program (and therefore ONE Authority)
 *
 * SHARED LIBRARIES (many-to-many, reusable):
 *   Controls ← can be linked to multiple Citations/Programs/Authorities
 *   Tests    ← can be reused across multiple Controls
 *   Evidence ← can be mapped to multiple Controls/Tests
 */

export interface Authority {
  id: string;
  name: string;              // Short name (e.g., "RBI", "ISO", "GDPR")
  fullName: string;          // Full name
  type: 'Regulator' | 'Standards Body' | 'Industry Body' | 'Government';
  jurisdiction: string;      // Geographic scope
  website?: string;
  description?: string;
  compliance: number;        // Aggregate compliance score
  trend: number;             // Trend vs last period
  programCount: number;      // Count of programs under this authority
  citationCount: number;     // Count of citations
  controlCount: number;      // Count of linked controls
  status: 'Active' | 'Draft' | 'Archived';
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceProgram {
  id: string;
  name: string;
  description: string;
  authorityId: string;
  authorityName: string;
  framework: string;
  status: 'Active' | 'Draft' | 'Under Review' | 'Archived';
  owner: string;
  department: string;
  complianceScore: number;
  riskRating: 'Critical' | 'High' | 'Medium' | 'Low';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  citations: number;
  controls: number;
  tests: number;
  testsPassed: number;
  testsFailed: number;
  testsPending: number;
  lastReviewDate: string;
  nextReviewDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Citation {
  id: string;
  title: string;
  description: string;
  programId: string;
  programName: string;
  authorityId: string;
  section: string;
  category: string;
  hasObligation: boolean;
  obligationType?: 'Reporting' | 'Disclosure' | 'Notification' | 'Filing';
  obligationDueDate?: string;
  riskRating: number;
  status: 'Compliant' | 'Partially Compliant' | 'Non-Compliant' | 'Not Assessed';
  controls: number;
  owner: string;
  lastReviewDate: string;
  nextReviewDate: string;
}

/**
 * CONTROL - Shared Library Entity
 * Can be linked to MULTIPLE citations across different programs/authorities
 */
export interface Control {
  id: string;
  code: string;                // Unique control code (e.g., "CTRL-001")
  name: string;
  description: string;
  category: string;
  type: 'Preventive' | 'Detective' | 'Corrective';
  automationLevel: 'Manual' | 'Semi-Automated' | 'Fully Automated';
  effectiveness: 'Effective' | 'Partially Effective' | 'Ineffective' | 'Not Tested';
  frequency: 'Continuous' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual';
  owner: string;
  department: string;
  // Many-to-many: Control can be linked to multiple citations
  linkedCitationIds: string[];
  linkedProgramIds: string[];   // Derived from citations
  linkedAuthorityIds: string[]; // Derived from programs
  // Test statistics
  testCount: number;
  testsPassed: number;
  lastTestDate: string;
  nextTestDate: string;
  status: 'Active' | 'Draft' | 'Disabled';
  createdAt: string;
  updatedAt: string;
}

/**
 * TEST - Shared Library Entity
 * Can be reused across MULTIPLE controls
 */
export interface Test {
  id: string;
  code: string;                 // Unique test code (e.g., "TST-001")
  name: string;
  description: string;
  type: 'Design' | 'Operating Effectiveness' | 'Walkthrough';
  procedure: string;            // Test procedure/steps
  expectedResult: string;
  frequency: 'One-time' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual';
  // Many-to-many: Test can be linked to multiple controls
  linkedControlIds: string[];
  // Execution details (per instance)
  status: 'Passed' | 'Failed' | 'Pending' | 'In Progress' | 'Not Started';
  scheduledDate: string;
  completedDate?: string;
  tester: string;
  reviewer?: string;
  evidenceCount: number;
  findings: number;
  riskRating: 'High' | 'Medium' | 'Low';
  createdAt: string;
  updatedAt: string;
}

/**
 * EVIDENCE - Shared Library Entity
 * Can be mapped to MULTIPLE controls and tests
 */
export interface Evidence {
  id: string;
  code: string;                 // Unique evidence code (e.g., "EVD-001")
  name: string;
  description: string;
  type: 'Document' | 'Screenshot' | 'Log' | 'Report' | 'Certificate' | 'Other';
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath?: string;
  // Many-to-many: Evidence can be linked to multiple controls/tests
  linkedControlIds: string[];
  linkedTestIds: string[];
  uploadedBy: string;
  uploadedAt: string;
  validFrom?: string;
  validUntil?: string;
  status: 'Pending Review' | 'Approved' | 'Rejected' | 'Expired';
  reviewedBy?: string;
  reviewedAt?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Link table types for many-to-many relationships
 */
export interface ControlCitationLink {
  controlId: string;
  citationId: string;
  linkedAt: string;
  linkedBy: string;
}

export interface TestControlLink {
  testId: string;
  controlId: string;
  linkedAt: string;
  linkedBy: string;
}

export interface EvidenceControlLink {
  evidenceId: string;
  controlId: string;
  linkedAt: string;
  linkedBy: string;
}

export interface EvidenceTestLink {
  evidenceId: string;
  testId: string;
  linkedAt: string;
  linkedBy: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  programId: string;
  programName: string;
  controlId?: string;
  testId?: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Pending Review' | 'Resolved' | 'Closed';
  category: 'Control Gap' | 'Process Gap' | 'Policy Violation' | 'Audit Finding' | 'Regulatory Finding';
  owner: string;
  assignedTo: string;
  discoveredDate: string;
  dueDate: string;
  resolvedDate?: string;
  rootCause?: string;
  correctiveAction?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Assessment {
  id: string;
  name: string;
  description: string;
  programId: string;
  programName: string;
  type: 'Self-Assessment' | 'Internal Audit' | 'External Audit' | 'Regulatory Exam';
  status: 'Scheduled' | 'In Progress' | 'Under Review' | 'Completed' | 'Overdue';
  assessor: string;
  reviewer?: string;
  scope: string;
  scheduledDate: string;
  startDate?: string;
  completedDate?: string;
  dueDate: string;
  complianceScore?: number;
  findings: number;
  criticalFindings: number;
  department: string;
}

export interface DashboardMetrics {
  overallCompliance: number;
  complianceTrend: number;
  totalAuthorities: number;
  totalPrograms: number;
  activePrograms: number;
  totalCitations: number;
  citationsWithObligations: number;
  totalControls: number;
  effectiveControls: number;
  totalTests: number;
  testsPassed: number;
  testsFailed: number;
  testsPending: number;
  totalEvidence: number;
  openIssues: number;
  criticalIssues: number;
  overdueAssessments: number;
  upcomingDeadlines: number;
}

