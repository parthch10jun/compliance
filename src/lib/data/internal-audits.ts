// Internal Audit Module Data
import { ComplianceProgram } from '../types/compliance';

export interface InternalAudit {
  id: string;
  title: string;
  description: string;
  programId: string;
  programName: string;
  framework: string;
  
  // Audit Details
  auditType: 'Compliance Audit' | 'Control Testing' | 'Gap Analysis' | 'Risk Assessment' | 'Process Review';
  scope: string;
  objectives: string[];
  
  // Status & Timeline
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed' | 'Cancelled';
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  
  // Team
  leadAuditor: string;
  auditTeam: string[];
  auditee: string;
  department: string;
  
  // Scope Coverage
  requirementsInScope: number;
  requirementsTested: number;
  controlsInScope: number;
  controlsTested: number;
  
  // Findings
  totalFindings: number;
  criticalFindings: number;
  highFindings: number;
  mediumFindings: number;
  lowFindings: number;
  
  // Results
  complianceScore?: number;
  overallRating?: 'Satisfactory' | 'Needs Improvement' | 'Unsatisfactory';
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface AuditFinding {
  id: string;
  auditId: string;
  findingNumber: string;
  
  // Classification
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  category: 'Control Gap' | 'Process Deficiency' | 'Documentation Issue' | 'Non-Compliance' | 'Best Practice';
  
  // Context
  requirementId?: string;
  requirementCode?: string;
  requirementTitle?: string;
  controlId?: string;
  controlCode?: string;
  controlName?: string;
  
  // Details
  observation: string;
  impact: string;
  rootCause: string;
  recommendation: string;
  
  // Remediation
  status: 'Open' | 'In Progress' | 'Resolved' | 'Accepted Risk' | 'Closed';
  owner: string;
  dueDate: string;
  remediationPlan?: string;
  remediationStatus?: string;
  resolvedDate?: string;
  
  // Evidence
  evidenceIds: string[];
  
  // Metadata
  identifiedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditTestResult {
  id: string;
  auditId: string;
  
  // What was tested
  requirementId: string;
  requirementCode: string;
  requirementTitle: string;
  controlId?: string;
  controlCode?: string;
  controlName?: string;
  
  // Test Details
  testProcedure: string;
  sampleSize?: number;
  testDate: string;
  tester: string;
  
  // Results
  result: 'Pass' | 'Fail' | 'Partial' | 'Not Tested';
  findings: string;
  evidence: string[];
  
  // Scoring
  effectivenessRating?: 'Effective' | 'Partially Effective' | 'Ineffective' | 'Not Applicable';
  
  createdAt: string;
  updatedAt: string;
}

export interface GapAnalysis {
  id: string;
  auditId: string;
  programId: string;
  programName: string;
  
  // Analysis
  totalRequirements: number;
  compliantRequirements: number;
  partiallyCompliantRequirements: number;
  nonCompliantRequirements: number;
  notApplicableRequirements: number;
  
  compliancePercentage: number;
  gapPercentage: number;
  
  // By Category
  categoryBreakdown: {
    category: string;
    total: number;
    compliant: number;
    gaps: number;
    percentage: number;
  }[];
  
  // Priority Gaps
  criticalGaps: number;
  highPriorityGaps: number;
  
  // Recommendations
  recommendations: string[];
  estimatedRemediationEffort: string;
  estimatedCost?: string;
  
  createdAt: string;
  updatedAt: string;
}

// Mock Data
export const internalAudits: InternalAudit[] = [
  {
    id: 'audit-001',
    title: 'Q4 2024 RBI IT Governance Compliance Audit',
    description: 'Comprehensive audit of IT governance controls and compliance with RBI guidelines',
    programId: 'pgm-001',
    programName: 'RBI IT Governance, Risk, Controls & Assurance Practices',
    framework: 'RBI IT Governance',
    auditType: 'Compliance Audit',
    scope: 'All IT governance requirements, cybersecurity controls, and data protection measures',
    objectives: [
      'Verify compliance with RBI IT Governance framework',
      'Test effectiveness of cybersecurity controls',
      'Assess data protection and privacy controls',
      'Identify gaps and recommend improvements'
    ],
    status: 'In Progress',
    plannedStartDate: '2024-12-01',
    plannedEndDate: '2024-12-31',
    actualStartDate: '2024-12-01',
    leadAuditor: 'Vikram Singh',
    auditTeam: ['Priya Patel', 'Amit Kumar', 'Sarah Johnson'],
    auditee: 'Rahul Sharma',
    department: 'IT',
    requirementsInScope: 66,
    requirementsTested: 45,
    controlsInScope: 123,
    controlsTested: 89,
    totalFindings: 12,
    criticalFindings: 2,
    highFindings: 4,
    mediumFindings: 5,
    lowFindings: 1,
    complianceScore: 87,
    overallRating: 'Needs Improvement',
    createdAt: '2024-11-15',
    updatedAt: '2024-12-20'
  },
  {
    id: 'audit-002',
    title: 'DPDP Act 2023 Gap Analysis',
    description: 'Gap analysis for Digital Personal Data Protection Act compliance readiness',
    programId: 'pgm-dpdp-001',
    programName: 'Digital Personal Data Protection Act 2023',
    framework: 'DPDP Act',
    auditType: 'Gap Analysis',
    scope: 'All DPDP requirements including consent management, data processing, and individual rights',
    objectives: [
      'Identify gaps in current data protection practices',
      'Assess consent management implementation',
      'Review data processing activities',
      'Evaluate breach notification procedures'
    ],
    status: 'Completed',
    plannedStartDate: '2024-11-01',
    plannedEndDate: '2024-11-30',
    actualStartDate: '2024-11-01',
    actualEndDate: '2024-11-28',
    leadAuditor: 'Anjali Verma',
    auditTeam: ['Priya Patel', 'Sarah Johnson'],
    auditee: 'Legal & Compliance Team',
    department: 'Legal & Compliance',
    requirementsInScope: 44,
    requirementsTested: 44,
    controlsInScope: 28,
    controlsTested: 28,
    totalFindings: 18,
    criticalFindings: 3,
    highFindings: 7,
    mediumFindings: 6,
    lowFindings: 2,
    complianceScore: 72,
    overallRating: 'Needs Improvement',
    createdAt: '2024-10-20',
    updatedAt: '2024-11-28'
  },
  {
    id: 'audit-003',
    title: 'ISO 27001 Control Effectiveness Testing',
    description: 'Annual testing of ISO 27001 information security controls',
    programId: 'pgm-003',
    programName: 'ISO 27001:2022',
    framework: 'ISO 27001',
    auditType: 'Control Testing',
    scope: 'All Annex A controls implemented in the ISMS',
    objectives: [
      'Test operating effectiveness of security controls',
      'Verify control documentation',
      'Assess control maturity',
      'Prepare for external certification audit'
    ],
    status: 'Planning',
    plannedStartDate: '2025-01-15',
    plannedEndDate: '2025-02-28',
    leadAuditor: 'Amit Kumar',
    auditTeam: ['Vikram Singh', 'Priya Patel'],
    auditee: 'Information Security Team',
    department: 'Information Security',
    requirementsInScope: 114,
    requirementsTested: 0,
    controlsInScope: 98,
    controlsTested: 0,
    totalFindings: 0,
    criticalFindings: 0,
    highFindings: 0,
    mediumFindings: 0,
    lowFindings: 0,
    createdAt: '2024-12-10',
    updatedAt: '2024-12-10'
  },
  {
    id: 'audit-004',
    title: 'CBUAE AML/CFT Controls Review',
    description: 'Review of Anti-Money Laundering and Counter-Terrorist Financing controls',
    programId: 'cbuae-aml',
    programName: 'CBUAE AML/CFT Regulation',
    framework: 'CBUAE',
    auditType: 'Process Review',
    scope: 'Customer due diligence, transaction monitoring, and suspicious activity reporting',
    objectives: [
      'Review CDD procedures and implementation',
      'Test transaction monitoring effectiveness',
      'Assess SAR filing process',
      'Verify training and awareness programs'
    ],
    status: 'Review',
    plannedStartDate: '2024-10-01',
    plannedEndDate: '2024-11-30',
    actualStartDate: '2024-10-01',
    actualEndDate: '2024-11-25',
    leadAuditor: 'Sarah Johnson',
    auditTeam: ['Vikram Singh', 'Anjali Verma'],
    auditee: 'Compliance Team',
    department: 'Compliance',
    requirementsInScope: 65,
    requirementsTested: 65,
    controlsInScope: 55,
    controlsTested: 55,
    totalFindings: 8,
    criticalFindings: 1,
    highFindings: 3,
    mediumFindings: 3,
    lowFindings: 1,
    complianceScore: 91,
    overallRating: 'Satisfactory',
    createdAt: '2024-09-15',
    updatedAt: '2024-11-25'
  }
];

export const auditFindings: AuditFinding[] = [
  {
    id: 'finding-001',
    auditId: 'audit-001',
    findingNumber: 'RBI-2024-001',
    title: 'Incomplete MFA Implementation',
    description: 'Multi-factor authentication not enforced for all privileged accounts',
    severity: 'Critical',
    category: 'Control Gap',
    requirementId: 'req-001',
    requirementCode: 'RBI-IT-001',
    requirementTitle: 'Access Control and Authentication',
    controlId: 'ctrl-001',
    controlCode: 'AC-001',
    controlName: 'Multi-Factor Authentication',
    observation: 'During testing, found 12 privileged accounts (8% of total) without MFA enabled. These include 5 database administrator accounts and 7 system administrator accounts.',
    impact: 'High risk of unauthorized access to critical systems. Non-compliance with RBI IT Governance requirements. Potential for data breach or system compromise.',
    rootCause: 'Legacy systems do not support MFA integration. Manual exception process not properly documented or tracked.',
    recommendation: 'Implement MFA for all privileged accounts within 30 days. For legacy systems, implement compensating controls such as enhanced monitoring and session recording. Document all exceptions with risk acceptance.',
    status: 'In Progress',
    owner: 'Rahul Sharma',
    dueDate: '2025-01-15',
    remediationPlan: 'Phase 1: Enable MFA for 7 accounts by Dec 31. Phase 2: Upgrade legacy systems to support MFA by Jan 15. Phase 3: Implement compensating controls for remaining systems.',
    remediationStatus: 'Phase 1 completed - 7/12 accounts now have MFA',
    evidenceIds: ['evd-audit-001'],
    identifiedDate: '2024-12-05',
    createdAt: '2024-12-05',
    updatedAt: '2024-12-20'
  },
  {
    id: 'finding-002',
    auditId: 'audit-001',
    findingNumber: 'RBI-2024-002',
    title: 'Inadequate Security Awareness Training',
    description: 'Security awareness training completion rate below required threshold',
    severity: 'High',
    category: 'Non-Compliance',
    requirementId: 'req-015',
    requirementCode: 'RBI-IT-015',
    requirementTitle: 'Security Awareness and Training',
    observation: 'Only 78% of employees completed mandatory security awareness training. RBI requires 100% completion. 45 employees have not completed training, including 12 in IT department.',
    impact: 'Increased risk of security incidents due to lack of awareness. Non-compliance with regulatory requirements. Potential for phishing attacks and social engineering.',
    rootCause: 'No automated tracking system for training completion. Manual follow-up process ineffective. New joiners not automatically enrolled.',
    recommendation: 'Implement automated training platform with mandatory completion tracking. Set up automatic enrollment for new joiners. Escalate non-completion to department heads.',
    status: 'Open',
    owner: 'Priya Patel',
    dueDate: '2025-01-31',
    evidenceIds: [],
    identifiedDate: '2024-12-08',
    createdAt: '2024-12-08',
    updatedAt: '2024-12-08'
  },
  {
    id: 'finding-003',
    auditId: 'audit-002',
    findingNumber: 'DPDP-2024-001',
    title: 'Missing Consent Records',
    description: 'Consent records not maintained for all data processing activities',
    severity: 'Critical',
    category: 'Non-Compliance',
    requirementId: 'req-dpdp-005',
    requirementCode: 'DPDP-005',
    requirementTitle: 'Consent Management',
    observation: 'Consent records missing for 23% of customer data processing activities. No audit trail for consent withdrawal requests. Consent forms do not meet DPDP Act requirements for clarity and specificity.',
    impact: 'Direct violation of DPDP Act Section 6. Risk of regulatory penalties up to ₹250 crores. Inability to demonstrate lawful basis for data processing. Reputational damage.',
    rootCause: 'Legacy systems not designed for consent management. No centralized consent repository. Consent process not updated after DPDP Act enactment.',
    recommendation: 'Implement consent management platform immediately. Obtain fresh consent from all customers using DPDP-compliant forms. Establish audit trail for all consent actions. Train staff on consent requirements.',
    status: 'In Progress',
    owner: 'Anjali Verma',
    dueDate: '2025-02-28',
    remediationPlan: 'Consent management platform procurement in progress. Expected implementation by Feb 15. Customer re-consent campaign to start Jan 15.',
    remediationStatus: 'Platform selected, procurement approval pending',
    evidenceIds: [],
    identifiedDate: '2024-11-15',
    createdAt: '2024-11-15',
    updatedAt: '2024-12-01'
  },
  {
    id: 'finding-004',
    auditId: 'audit-002',
    findingNumber: 'DPDP-2024-002',
    title: 'Data Breach Notification Process Not Defined',
    description: 'No documented process for data breach notification to Data Protection Board',
    severity: 'High',
    category: 'Process Deficiency',
    requirementId: 'req-dpdp-018',
    requirementCode: 'DPDP-018',
    requirementTitle: 'Data Breach Notification',
    observation: 'No formal process exists for identifying, assessing, and reporting data breaches to the Data Protection Board within required 72-hour timeframe. No breach response team designated.',
    impact: 'Inability to comply with mandatory breach notification requirements. Risk of penalties for late or non-notification. Lack of coordinated response to data breaches.',
    rootCause: 'Data breach notification requirements are new under DPDP Act. Existing incident response plan does not cover regulatory notification.',
    recommendation: 'Develop and document data breach notification process. Designate breach response team. Conduct breach response drills. Integrate with incident response plan.',
    status: 'Resolved',
    owner: 'Anjali Verma',
    dueDate: '2024-12-15',
    resolvedDate: '2024-12-10',
    remediationPlan: 'Breach notification SOP developed and approved. Breach response team designated. Training completed.',
    remediationStatus: 'Completed',
    evidenceIds: ['evd-breach-sop'],
    identifiedDate: '2024-11-18',
    createdAt: '2024-11-18',
    updatedAt: '2024-12-10'
  }
];

export const gapAnalyses: GapAnalysis[] = [
  {
    id: 'gap-001',
    auditId: 'audit-002',
    programId: 'pgm-dpdp-001',
    programName: 'Digital Personal Data Protection Act 2023',
    totalRequirements: 44,
    compliantRequirements: 18,
    partiallyCompliantRequirements: 16,
    nonCompliantRequirements: 10,
    notApplicableRequirements: 0,
    compliancePercentage: 41,
    gapPercentage: 59,
    categoryBreakdown: [
      { category: 'Consent Management', total: 8, compliant: 2, gaps: 6, percentage: 25 },
      { category: 'Data Processing', total: 12, compliant: 5, gaps: 7, percentage: 42 },
      { category: 'Individual Rights', total: 10, compliant: 4, gaps: 6, percentage: 40 },
      { category: 'Data Security', total: 8, compliant: 5, gaps: 3, percentage: 63 },
      { category: 'Breach Notification', total: 6, compliant: 2, gaps: 4, percentage: 33 }
    ],
    criticalGaps: 3,
    highPriorityGaps: 7,
    recommendations: [
      'Implement comprehensive consent management platform',
      'Establish Data Protection Officer role and team',
      'Develop data processing inventory and records',
      'Create individual rights fulfillment process',
      'Implement data breach notification procedures',
      'Conduct organization-wide DPDP Act training',
      'Update privacy policies and notices',
      'Implement data minimization practices'
    ],
    estimatedRemediationEffort: '6-9 months',
    estimatedCost: '₹50-75 lakhs',
    createdAt: '2024-11-28',
    updatedAt: '2024-11-28'
  },
  {
    id: 'gap-002',
    auditId: 'audit-001',
    programId: 'pgm-001',
    programName: 'RBI IT Governance, Risk, Controls & Assurance Practices',
    totalRequirements: 66,
    compliantRequirements: 52,
    partiallyCompliantRequirements: 10,
    nonCompliantRequirements: 4,
    notApplicableRequirements: 0,
    compliancePercentage: 79,
    gapPercentage: 21,
    categoryBreakdown: [
      { category: 'IT Governance', total: 12, compliant: 10, gaps: 2, percentage: 83 },
      { category: 'Cybersecurity', total: 18, compliant: 14, gaps: 4, percentage: 78 },
      { category: 'IT Operations', total: 15, compliant: 12, gaps: 3, percentage: 80 },
      { category: 'IT Audit', total: 8, compliant: 6, gaps: 2, percentage: 75 },
      { category: 'Business Continuity', total: 13, compliant: 10, gaps: 3, percentage: 77 }
    ],
    criticalGaps: 2,
    highPriorityGaps: 4,
    recommendations: [
      'Complete MFA implementation for all privileged accounts',
      'Enhance security awareness training program',
      'Implement automated vulnerability management',
      'Strengthen change management process',
      'Improve IT audit trail and logging',
      'Update business continuity testing frequency'
    ],
    estimatedRemediationEffort: '3-4 months',
    estimatedCost: '₹25-35 lakhs',
    createdAt: '2024-12-20',
    updatedAt: '2024-12-20'
  }
];
