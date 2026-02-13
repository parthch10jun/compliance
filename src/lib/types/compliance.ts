/**
 * Compliance Module Types
 *
 * FLEXIBLE TAG-BASED SYSTEM:
 *   Tags can represent authorities, regulators, jurisdictions, categories, etc.
 *   This provides maximum flexibility for categorization and filtering
 *
 * SHARED LIBRARIES (many-to-many, reusable):
 *   Controls ← can be linked to multiple Citations/Programs via tags
 *   Tests    ← can be reused across multiple Controls
 *   Evidence ← can be mapped to multiple Controls/Tests
 */

/**
 * PROGRAM TEMPLATE - Pre-loaded, read-only compliance frameworks in the Library
 * These are standards/regulations that come with the application and cannot be modified.
 * Users can import these into their "My Programs" to create active compliance programs.
 */
export interface ProgramTemplate {
  id: string;
  name: string;
  description: string;
  longDescription?: string;           // Detailed description for preview
  tags: string[];                     // Authorities, regulators, jurisdictions, categories
  framework: string;
  version: string;                    // e.g., "2022", "v3.0"
  category: 'Regulatory' | 'Standard' | 'Framework' | 'Industry';

  // Pre-defined content counts
  requirementCount: number;
  obligationCount: number;
  controlCount: number;

  // Metadata
  publisher: string;                  // e.g., "RBI", "ISO", "NIST"
  effectiveDate?: string;
  lastUpdated: string;
  popularity: number;                 // How many times imported

  // Features/highlights
  keyFeatures: string[];
  applicableTo: string[];             // Industries, regions, etc.

  createdAt: string;
  updatedAt: string;
}

/**
 * COMPLIANCE PROGRAM - User's active compliance programs ("My Programs")
 * Can be created from scratch or imported from ProgramTemplate
 */
export interface ComplianceProgram {
  id: string;
  name: string;
  description: string;
  tags: string[];                     // Flexible tags: authorities, regulators, jurisdictions, categories
  framework: string;
  status: 'Active' | 'Draft' | 'Under Review' | 'Archived';
  owner: string;
  department: string;
  complianceScore: number;
  riskRating: 'Critical' | 'High' | 'Medium' | 'Low';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';

  // Source tracking - if imported from library
  sourceTemplateId?: string;          // ID of ProgramTemplate if imported
  isCustom: boolean;                  // true = created from scratch, false = imported from library

  // Separate tracking for requirements and obligations
  requirementCount: number;
  obligationCount: number;
  upcomingObligations: number;
  overdueObligations: number;

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

/**
 * REQUIREMENT CITATION - Continuous-state compliance
 * Broad regulatory mandates that define ongoing compliance posture
 * Examples: "Maintain access controls", "Implement encryption", "Establish incident response"
 */
export interface RequirementCitation {
  id: string;
  code: string;              // e.g., "REQ-RBI-001"
  title: string;
  description: string;
  programId: string;
  programName: string;
  tags: string[];             // Flexible tags: authorities, regulators, jurisdictions, categories
  section: string;           // Citation section/clause reference
  category: string;          // e.g., "Access Control", "Data Protection"
  riskRating: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Compliant' | 'Partially Compliant' | 'Non-Compliant' | 'Not Assessed';
  complianceScore?: number;  // 0-100
  controlCount: number;      // Number of controls mapped
  owner: string;
  department: string;
  lastReviewDate: string;
  nextReviewDate: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * OBLIGATION CITATION - Event-driven, time-bound compliance
 * Specific actionable items with deadlines, triggers, and regulator accountability
 * Examples: "Submit Q4 report by Jan 31", "Notify breach within 72 hours", "File annual disclosure"
 */
export interface ObligationCitation {
  id: string;
  code: string;              // e.g., "OBL-RBI-001"
  title: string;
  description: string;
  programId: string;
  programName: string;
  tags: string[];             // Flexible tags: authorities, regulators, jurisdictions, categories
  section: string;           // Citation section/clause reference

  // Obligation-specific fields
  obligationType: 'Reporting' | 'Disclosure' | 'Notification' | 'Filing' | 'Submission' | 'Certification';
  frequency: 'One-time' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual' | 'Event-Driven';

  // Timeline & Triggers
  dueDate: string;           // Next due date
  triggerEvent?: string;     // For event-driven obligations (e.g., "Security breach", "Material change")
  triggerCondition?: string; // Condition that activates the obligation
  leadTime?: number;         // Days before due date to start preparation

  // Regulator Accountability
  submissionMethod: 'Portal' | 'Email' | 'Physical' | 'API' | 'Other';
  recipientContact?: string; // Regulator contact/department
  confirmationRequired: boolean;

  // Status & Tracking
  status: 'Upcoming' | 'In Progress' | 'Submitted' | 'Acknowledged' | 'Overdue' | 'Completed';
  lastSubmissionDate?: string;
  nextDueDate: string;

  // Evidence & Workflow
  evidenceRequired: string[];  // Types of evidence needed
  approvalRequired: boolean;
  approver?: string;

  // Escalation
  riskRating: 'Critical' | 'High' | 'Medium' | 'Low';
  escalationPath?: string[];   // Chain of escalation
  penaltyForNonCompliance?: string;

  owner: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * CONTROL - Shared Library Entity
 * Can be linked to MULTIPLE requirements and obligations across different programs
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

  // Many-to-many: Control can be linked to multiple requirements AND obligations
  linkedRequirementIds: string[];  // Links to continuous-state requirements
  linkedObligationIds: string[];   // Links to time-bound obligations
  linkedProgramIds: string[];      // Derived from requirements/obligations
  tags: string[];                  // Flexible tags: authorities, regulators, jurisdictions, categories
  linkedEvidenceIds: string[];     // Links to evidence documents
  linkedRiskIds: string[];         // Links to risks this control mitigates

  // Compliance Status (calculated from tests and evidence)
  complianceStatus: 'Compliant' | 'Partially Compliant' | 'Non-Compliant' | 'Not Assessed';
  complianceScore: number;         // 0-100, calculated from test results and evidence

  // Test statistics
  testCount: number;
  testsPassed: number;
  testsFailed: number;
  lastTestDate: string;
  nextTestDate: string;
  status: 'Active' | 'Draft' | 'Disabled';
  createdAt: string;
  updatedAt: string;
}

/**
 * EVIDENCE - Document/artifact that proves control effectiveness
 * Supports versioning and approval workflow
 */
export interface Evidence {
  id: string;
  code: string;                     // Unique evidence code (e.g., "EVD-001")
  name: string;
  description: string;
  type: 'Document' | 'Screenshot' | 'Report' | 'Log' | 'Certificate' | 'Policy' | 'Procedure' | 'Other';

  // File information
  fileName: string;
  fileSize: number;                 // in bytes
  fileType: string;                 // MIME type
  fileUrl: string;                  // Storage URL

  // Versioning
  version: string;                  // e.g., "1.0", "2.1"
  versionHistory: EvidenceVersion[];

  // Linked entities
  linkedControlIds: string[];
  linkedRequirementIds: string[];
  linkedObligationIds: string[];
  linkedTestIds: string[];

  // Status and validation
  status: 'Approved' | 'Pending Review' | 'Rejected' | 'Expired' | 'Draft';
  validationStatus: 'Sufficient' | 'Insufficient' | 'Needs Update' | 'Not Reviewed';

  // Approval workflow
  uploadedBy: string;
  uploadedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;

  // Expiration
  expiresAt?: string;
  reminderDays?: number;            // Days before expiration to send reminder

  // Metadata
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * EVIDENCE VERSION - Version history for evidence documents
 */
export interface EvidenceVersion {
  version: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  changes?: string;                 // Description of changes
  status: 'Current' | 'Superseded' | 'Archived';
}

/**
 * CONTROL TEST - Individual test execution for a control
 */
export interface ControlTest {
  id: string;
  code: string;                     // Unique test code (e.g., "TST-001")
  name: string;
  description: string;

  // Test details
  type: 'Design' | 'Operating Effectiveness' | 'Walkthrough' | 'Automated' | 'Manual';
  procedure: string;                // Test procedure/steps
  expectedResult: string;

  // Linked entities
  controlId: string;
  linkedEvidenceIds: string[];      // Evidence used in this test

  // Execution
  status: 'Passed' | 'Failed' | 'Pending' | 'In Progress' | 'Not Started';
  result?: 'Pass' | 'Fail' | 'Partial';
  actualResult?: string;
  findings?: string;                // Issues found during test

  // Scheduling
  frequency: 'One-time' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual';
  scheduledDate: string;
  executedDate?: string;
  dueDate: string;

  // Personnel
  tester: string;
  reviewer?: string;

  // Metadata
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
 * Link table types for many-to-many relationships
 */
export interface ControlRequirementLink {
  controlId: string;
  requirementId: string;
  linkedAt: string;
  linkedBy: string;
  notes?: string;
}

export interface ControlObligationLink {
  controlId: string;
  obligationId: string;
  linkedAt: string;
  linkedBy: string;
  notes?: string;
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

  // Requirements (continuous-state)
  totalRequirements: number;
  compliantRequirements: number;
  partiallyCompliantRequirements: number;
  nonCompliantRequirements: number;

  // Obligations (event-driven, time-bound)
  totalObligations: number;
  upcomingObligations: number;
  overdueObligations: number;
  completedObligations: number;

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

// ============================================================================
// RISK MANAGEMENT
// ============================================================================

/**
 * RISK - Core risk entity
 * Represents identified risks with inherent and residual risk assessments
 */
export interface Risk {
  id: string;
  code: string;                // e.g., "RISK-001"
  title: string;               // Short risk title
  riskStatement: string;       // Full risk statement
  category: string;            // e.g., "Data Security", "Operational", "Financial"
  owner: string;
  department: string;

  // Inherent Risk (before controls)
  inherentLikelihood: number;  // 1-5
  inherentImpact: number;      // 1-5
  inherentScore: number;       // likelihood × impact (1-25)
  inherentRating: 'Critical' | 'High' | 'Medium' | 'Low';

  // Residual Risk (after controls)
  residualLikelihood: number;  // 1-5
  residualImpact: number;      // 1-5
  residualScore: number;       // likelihood × impact (1-25)
  residualRating: 'Critical' | 'High' | 'Medium' | 'Low';

  // Risk Reduction
  riskReduction: number;       // Percentage reduction

  // Relationships
  linkedRequirementIds: string[];  // Requirements this risk relates to
  linkedObligationIds: string[];   // Obligations this risk relates to
  linkedControlIds: string[];      // Controls that mitigate this risk

  // Metadata
  status: 'Active' | 'Monitoring' | 'Mitigated' | 'Accepted' | 'Transferred' | 'Closed';
  lastAssessmentDate: string;
  nextReviewDate: string;
  createdAt: string;
  updatedAt: string;

  // Extended mapping dimensions (optional)
  functions?: string[];    // Business functions affected
  assets?: string[];       // Assets at risk
  strategies?: string[];   // Strategic initiatives impacted
}

/**
 * RISK CONTROL LINK - Links risks to controls with effectiveness rating
 */
export interface RiskControlLink {
  riskId: string;
  controlId: string;
  controlEffectiveness: 'Fully Effective' | 'Largely Effective' | 'Partially Effective' | 'Ineffective' | 'Not Tested';
  effectivenessScore: number;  // 1-4 (maps to effectiveness rating)
  isKeyControl: boolean;       // Is this a key control for this risk?
  likelihoodReduction?: number; // How much this control reduces likelihood (e.g., 5 → 2)
  impactReduction?: number;     // How much this control reduces impact (e.g., 5 → 2)
  linkedAt: string;
  linkedBy: string;
  notes?: string;
}

/**
 * RISK REQUIREMENT LINK - Links risks to requirements
 */
export interface RiskRequirementLink {
  riskId: string;
  requirementId: string;
  relationshipType: 'Addresses' | 'Mitigates' | 'Monitors';
  linkedAt: string;
  linkedBy: string;
  notes?: string;
}

/**
 * RISK OBLIGATION LINK - Links risks to obligations
 */
export interface RiskObligationLink {
  riskId: string;
  obligationId: string;
  relationshipType: 'Addresses' | 'Mitigates' | 'Monitors';
  linkedAt: string;
  linkedBy: string;
  notes?: string;
}

/**
 * RISK ASSESSMENT - Historical risk assessment record
 */
export interface RiskAssessment {
  id: string;
  riskId: string;
  assessmentDate: string;
  assessor: string;

  // Assessment scores
  likelihood: number;
  impact: number;
  score: number;
  rating: 'Critical' | 'High' | 'Medium' | 'Low';

  // Context
  assessmentType: 'Initial' | 'Periodic' | 'Triggered' | 'Post-Incident';
  notes?: string;
  changesFromPrevious?: string;

  createdAt: string;
}

/**
 * Helper function to calculate risk score
 */
export function calculateRiskScore(likelihood: number, impact: number): number {
  return likelihood * impact;
}

/**
 * Helper function to determine risk rating from score
 */
export function getRiskRating(score: number): 'Critical' | 'High' | 'Medium' | 'Low' {
  if (score >= 15) return 'Critical';
  if (score >= 8) return 'High';
  if (score >= 3) return 'Medium';
  return 'Low';
}

/**
 * Helper function to calculate risk reduction percentage
 */
export function calculateRiskReduction(inherentScore: number, residualScore: number): number {
  if (inherentScore === 0) return 0;
  return Math.round(((inherentScore - residualScore) / inherentScore) * 100);
}
