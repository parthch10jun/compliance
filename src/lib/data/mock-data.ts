// Mock Data for Compliance Module
import { ComplianceProgram, Assessment, Issue, DashboardMetrics } from '../types/compliance';
import { cbuaePrograms } from './cbuae-comprehensive';
// [DEMO] Import demo data
// import { paymePrograms, isDemoFeatureEnabled } from '../demo';
import { isDemoFeatureEnabled } from '../demo';

/**
 * My Programs - User's active compliance programs
 * These are either imported from the Program Library or created custom
 */
const basePrograms: ComplianceProgram[] = [
  {
    id: 'pgm-001',
    name: 'RBI IT Governance, Risk, Controls & Assurance Practices',
    description: 'Comprehensive IT governance framework for NBFCs under RBI Scale-Based Regulation',
    tags: ['RBI', 'Regulator', 'India', 'IT Governance', 'NBFC', 'Cybersecurity', 'Banking'],
    framework: 'RBI IT Governance',
    status: 'Active',
    owner: 'Rahul Sharma',
    department: 'IT',
    complianceScore: 90,
    riskRating: 'High',
    priority: 'Critical',
    sourceTemplateId: 'tpl-rbi-itgov-2023',
    isCustom: false,
    requirementCount: 66,
    obligationCount: 24,
    upcomingObligations: 5,
    overdueObligations: 0,
    controls: 123,
    tests: 145,
    testsPassed: 132,
    testsFailed: 8,
    testsPending: 5,
    lastReviewDate: '2024-12-15',
    nextReviewDate: '2025-03-15',
    createdAt: '2024-04-01',
    updatedAt: '2024-01-16'
  },
  {
    id: 'pgm-002', name: 'RBI Cyber Security Framework', description: 'RBI CSF compliance program',
    tags: ['RBI', 'Regulator', 'India', 'Cyber Security', 'Banking'],
    framework: 'RBI CSF', status: 'Active', owner: 'Priya Patel',
    department: 'Information Security', complianceScore: 89, riskRating: 'High', priority: 'Critical',
    sourceTemplateId: 'tpl-rbi-csf', isCustom: false,
    requirementCount: 62, obligationCount: 12, upcomingObligations: 3, overdueObligations: 1,
    controls: 54, tests: 72, testsPassed: 64, testsFailed: 5, testsPending: 3,
    lastReviewDate: '2024-10-20', nextReviewDate: '2025-01-20',
    createdAt: '2024-01-20', updatedAt: '2024-12-18'
  },
  {
    id: 'pgm-dpdp-001',
    name: 'Digital Personal Data Protection Act 2023',
    description: 'India\'s comprehensive data protection law establishing framework for processing digital personal data',
    tags: ['MeitY', 'Regulator', 'India', 'Data Privacy', 'Data Protection', 'DPDP'],
    framework: 'DPDP Act',
    status: 'Active',
    owner: 'Anjali Verma',
    department: 'Legal & Compliance',
    complianceScore: 78,
    riskRating: 'Critical',
    priority: 'Critical',
    sourceTemplateId: 'tpl-dpdp-2023',
    isCustom: false,
    requirementCount: 44,
    obligationCount: 18,
    upcomingObligations: 8,
    overdueObligations: 0,
    controls: 28,
    tests: 42,
    testsPassed: 35,
    testsFailed: 4,
    testsPending: 3,
    lastReviewDate: '2024-12-01',
    nextReviewDate: '2025-03-01',
    createdAt: '2023-08-11',
    updatedAt: '2024-12-20'
  },
  {
    id: 'pgm-003', name: 'ISO 27001:2022', description: 'Information Security Management System',
    tags: ['ISO', 'Standards Body', 'International', 'Information Security', 'ISMS'],
    framework: 'ISO 27001', status: 'Active', owner: 'Amit Kumar',
    department: 'Information Security', complianceScore: 88, riskRating: 'Medium', priority: 'High',
    sourceTemplateId: 'tpl-iso27001', isCustom: false,
    requirementCount: 114, obligationCount: 0, upcomingObligations: 0, overdueObligations: 0,
    controls: 98, tests: 124, testsPassed: 108, testsFailed: 8, testsPending: 8,
    lastReviewDate: '2024-09-30', nextReviewDate: '2024-12-31',
    createdAt: '2024-02-01', updatedAt: '2024-12-15'
  },
  {
    id: 'pgm-004', name: 'GDPR Compliance', description: 'EU General Data Protection Regulation compliance',
    tags: ['EU', 'Regulator', 'European Union', 'Privacy', 'Data Protection', 'GDPR'],
    framework: 'GDPR', status: 'Active', owner: 'Sarah Johnson',
    department: 'Legal', complianceScore: 85, riskRating: 'High', priority: 'Critical',
    sourceTemplateId: 'tpl-gdpr', isCustom: false,
    requirementCount: 88, obligationCount: 32, upcomingObligations: 5, overdueObligations: 2,
    controls: 76, tests: 98, testsPassed: 82, testsFailed: 10, testsPending: 6,
    lastReviewDate: '2024-11-01', nextReviewDate: '2025-02-01',
    createdAt: '2024-02-15', updatedAt: '2024-12-19'
  },
  {
    id: 'pgm-iso9001',
    name: 'ISO 9001:2015 Quality Management',
    description: 'Quality management system for oil & gas operations ensuring customer satisfaction and continual improvement',
    tags: ['ISO', 'Standards Body', 'International', 'Quality', 'QMS', 'Oil & Gas'],
    framework: 'ISO 9001',
    status: 'Active',
    owner: 'Michael Chen',
    department: 'Quality',
    complianceScore: 72,
    riskRating: 'Medium',
    priority: 'High',
    sourceTemplateId: 'tpl-iso9001-2015',
    isCustom: false,
    requirementCount: 7,
    obligationCount: 0,
    upcomingObligations: 0,
    overdueObligations: 0,
    controls: 15,
    tests: 22,
    testsPassed: 18,
    testsFailed: 2,
    testsPending: 2,
    lastReviewDate: '2024-12-01',
    nextReviewDate: '2025-03-01',
    createdAt: '2024-06-01',
    updatedAt: '2024-12-20'
  },
  {
    id: 'pgm-osha',
    name: 'OSHA Safety Standards for Oil & Gas',
    description: 'Occupational Safety and Health Administration compliance for oil and gas operations',
    tags: ['OSHA', 'Regulator', 'USA', 'Safety', 'Health', 'Oil & Gas'],
    framework: 'OSHA',
    status: 'Active',
    owner: 'David Martinez',
    department: 'HSE',
    complianceScore: 68,
    riskRating: 'Critical',
    priority: 'Critical',
    sourceTemplateId: 'tpl-osha-2024',
    isCustom: false,
    requirementCount: 5,
    obligationCount: 2,
    upcomingObligations: 2,
    overdueObligations: 0,
    controls: 12,
    tests: 18,
    testsPassed: 14,
    testsFailed: 3,
    testsPending: 1,
    lastReviewDate: '2024-11-15',
    nextReviewDate: '2025-02-15',
    createdAt: '2024-05-01',
    updatedAt: '2024-12-18'
  },
  {
    id: 'pgm-epa',
    name: 'EPA Environmental Requirements for Oil & Gas',
    description: 'Environmental Protection Agency compliance for oil and gas operations',
    tags: ['EPA', 'Regulator', 'USA', 'Environment', 'Oil & Gas'],
    framework: 'EPA',
    status: 'Active',
    owner: 'Jennifer Lopez',
    department: 'HSE',
    complianceScore: 75,
    riskRating: 'Critical',
    priority: 'Critical',
    sourceTemplateId: 'tpl-epa-2024',
    isCustom: false,
    requirementCount: 5,
    obligationCount: 3,
    upcomingObligations: 3,
    overdueObligations: 0,
    controls: 14,
    tests: 20,
    testsPassed: 16,
    testsFailed: 2,
    testsPending: 2,
    lastReviewDate: '2024-11-20',
    nextReviewDate: '2025-02-20',
    createdAt: '2024-05-15',
    updatedAt: '2024-12-19'
  },
  {
    id: 'pgm-005', name: 'PDPL Compliance', description: 'Saudi Personal Data Protection Law compliance',
    tags: ['SDAIA', 'Regulator', 'Saudi Arabia', 'Privacy', 'Data Protection', 'PDPL'],
    framework: 'PDPL', status: 'Active', owner: 'Ahmed Al-Rashid',
    department: 'Legal', complianceScore: 78, riskRating: 'High', priority: 'High',
    sourceTemplateId: 'tpl-pdpl', isCustom: false,
    requirementCount: 45, obligationCount: 12, upcomingObligations: 3, overdueObligations: 1,
    controls: 52, tests: 68, testsPassed: 52, testsFailed: 8, testsPending: 8,
    lastReviewDate: '2024-10-15', nextReviewDate: '2025-01-15',
    createdAt: '2024-03-01', updatedAt: '2024-12-15'
  },
  {
    id: 'pgm-006', name: 'Internal Security Policy', description: 'Custom internal security policy compliance tracking',
    tags: ['Internal', 'Security Policy', 'Custom'],
    framework: 'Custom', status: 'Active', owner: 'Rahul Sharma',
    department: 'Information Security', complianceScore: 94, riskRating: 'Low', priority: 'Medium',
    isCustom: true,
    requirementCount: 28, obligationCount: 4, upcomingObligations: 1, overdueObligations: 0,
    controls: 22, tests: 30, testsPassed: 28, testsFailed: 1, testsPending: 1,
    lastReviewDate: '2024-12-01', nextReviewDate: '2025-03-01',
    createdAt: '2024-06-01', updatedAt: '2024-12-20'
  },
  // Add comprehensive CBUAE programs (5 major programs with 555 requirements, 2210 controls, 207 obligations)
  ...cbuaePrograms,
];

// [DEMO] Combine base programs with demo programs if demo mode is enabled
// export const programs: ComplianceProgram[] = isDemoFeatureEnabled('demoProgram')
//   ? [...basePrograms, ...paymePrograms]
//   : basePrograms;
export const programs: ComplianceProgram[] = basePrograms;

// Re-export controls from the dedicated controls data file
export { controls } from './controls';

export const assessments: Assessment[] = [
  { id: 'ass-001', name: 'Q4 2024 ISO 27001 Internal Audit', description: 'Quarterly internal audit of ISMS', programId: 'pgm-003', programName: 'ISO 27001:2022', type: 'Internal Audit', status: 'In Progress', assessor: 'Internal Audit Team', reviewer: 'Amit Kumar', scope: 'All ISMS controls', scheduledDate: '2024-12-01', startDate: '2024-12-01', dueDate: '2024-12-31', findings: 3, criticalFindings: 0, department: 'Information Security' },
  { id: 'ass-002', name: 'RBI CSF Annual Assessment', description: 'Annual RBI Cyber Security Framework assessment', programId: 'pgm-002', programName: 'RBI Cyber Security Framework', type: 'Self-Assessment', status: 'Scheduled', assessor: 'Priya Patel', scope: 'All CSF domains', scheduledDate: '2025-01-15', dueDate: '2025-02-15', findings: 0, criticalFindings: 0, department: 'Information Security' },
  { id: 'ass-003', name: 'GDPR Annual Review', description: 'Annual GDPR compliance review', programId: 'pgm-004', programName: 'GDPR Compliance', type: 'External Audit', status: 'Overdue', assessor: 'External Auditor', reviewer: 'Sarah Johnson', scope: 'All GDPR articles', scheduledDate: '2024-12-01', dueDate: '2024-12-15', findings: 5, criticalFindings: 1, department: 'Legal' },
  { id: 'ass-004', name: 'PDPL Gap Assessment', description: 'Initial PDPL gap assessment', programId: 'pgm-005', programName: 'PDPL Compliance', type: 'Self-Assessment', status: 'Completed', assessor: 'Ahmed Al-Rashid', scope: 'All PDPL requirements', scheduledDate: '2024-11-01', startDate: '2024-11-01', completedDate: '2024-11-30', dueDate: '2024-11-30', complianceScore: 78, findings: 8, criticalFindings: 2, department: 'Legal' },
  { id: 'ass-005', name: 'RBI IT Gov Quarterly Review', description: 'Q4 IT Governance review', programId: 'pgm-001', programName: 'RBI IT Governance', type: 'Self-Assessment', status: 'Scheduled', assessor: 'Rahul Sharma', scope: 'IT governance controls', scheduledDate: '2025-01-01', dueDate: '2025-01-31', findings: 0, criticalFindings: 0, department: 'IT' },
];

export const issues: Issue[] = [
  { id: 'iss-001', title: 'Access Review Delays', description: 'User access reviews not completed within SLA', programId: 'pgm-003', programName: 'ISO 27001:2022', controlId: 'ctl-001', severity: 'Medium', status: 'In Progress', category: 'Process Gap', owner: 'Amit Kumar', assignedTo: 'Vikram Singh', discoveredDate: '2024-12-10', dueDate: '2024-12-31', createdAt: '2024-12-10', updatedAt: '2024-12-15' },
  { id: 'iss-002', title: 'Incomplete Incident Documentation', description: 'Security incidents missing root cause analysis', programId: 'pgm-002', programName: 'RBI Cyber Security Framework', controlId: 'ctl-004', severity: 'High', status: 'Open', category: 'Control Gap', owner: 'Priya Patel', assignedTo: 'Priya Patel', discoveredDate: '2024-12-05', dueDate: '2024-12-25', createdAt: '2024-12-05', updatedAt: '2024-12-10' },
  { id: 'iss-003', title: 'DSAR Response Time Breach', description: 'Data subject access requests exceeding 30-day limit', programId: 'pgm-004', programName: 'GDPR Compliance', severity: 'Critical', status: 'Open', category: 'Regulatory Finding', owner: 'Sarah Johnson', assignedTo: 'Legal Team', discoveredDate: '2024-12-01', dueDate: '2024-12-20', createdAt: '2024-12-01', updatedAt: '2024-12-05' },
  { id: 'iss-004', title: 'Missing Data Classification', description: 'Sensitive data not properly classified per PDPL', programId: 'pgm-005', programName: 'PDPL Compliance', severity: 'High', status: 'In Progress', category: 'Policy Violation', owner: 'Ahmed Al-Rashid', assignedTo: 'Data Governance Team', discoveredDate: '2024-11-20', dueDate: '2024-12-30', createdAt: '2024-11-20', updatedAt: '2024-12-12' },
  { id: 'iss-005', title: 'Patch Management Gap', description: 'Critical patches not applied within 72 hours', programId: 'pgm-001', programName: 'RBI IT Governance', controlId: 'ctl-007', severity: 'High', status: 'Pending Review', category: 'Audit Finding', owner: 'Rahul Sharma', assignedTo: 'IT Operations', discoveredDate: '2024-12-08', dueDate: '2024-12-22', resolvedDate: '2024-12-18', correctiveAction: 'Implemented automated patch deployment', createdAt: '2024-12-08', updatedAt: '2024-12-18' },
  { id: 'iss-006', title: 'Backup Verification Failure', description: 'Monthly backup restoration test failed', programId: 'pgm-001', programName: 'RBI IT Governance', controlId: 'ctl-008', severity: 'Critical', status: 'In Progress', category: 'Control Gap', owner: 'Rahul Sharma', assignedTo: 'IT Operations', discoveredDate: '2024-12-15', dueDate: '2024-12-25', createdAt: '2024-12-15', updatedAt: '2024-12-16' },
];

export const dashboardMetrics: DashboardMetrics = {
  overallCompliance: 89,
  complianceTrend: 3.2,
  totalAuthorities: 18,
  totalPrograms: programs.length, // Now includes 5 comprehensive CBUAE programs
  activePrograms: programs.filter(p => p.status === 'Active').length,
  // Requirements (continuous-state) - Updated with CBUAE data
  totalRequirements: programs.reduce((sum, p) => sum + p.requirementCount, 0), // ~987 requirements
  compliantRequirements: Math.floor(programs.reduce((sum, p) => sum + p.requirementCount, 0) * 0.82),
  partiallyCompliantRequirements: Math.floor(programs.reduce((sum, p) => sum + p.requirementCount, 0) * 0.12),
  nonCompliantRequirements: Math.floor(programs.reduce((sum, p) => sum + p.requirementCount, 0) * 0.06),
  // Obligations (event-driven, time-bound) - Updated with CBUAE data
  totalObligations: programs.reduce((sum, p) => sum + p.obligationCount, 0), // ~332 obligations
  upcomingObligations: programs.reduce((sum, p) => sum + p.upcomingObligations, 0),
  overdueObligations: programs.reduce((sum, p) => sum + (p.overdueObligations || 0), 0),
  completedObligations: Math.floor(programs.reduce((sum, p) => sum + p.obligationCount, 0) * 0.75),
  // Controls & Tests - Updated with CBUAE data
  totalControls: programs.reduce((sum, p) => sum + p.controls, 0), // ~2,838 controls
  effectiveControls: Math.floor(programs.reduce((sum, p) => sum + p.controls, 0) * 0.88),
  totalTests: programs.reduce((sum, p) => sum + p.tests, 0), // ~3,611 tests
  testsPassed: programs.reduce((sum, p) => sum + p.testsPassed, 0),
  testsFailed: programs.reduce((sum, p) => sum + p.testsFailed, 0),
  testsPending: programs.reduce((sum, p) => sum + p.testsPending, 0),
  totalEvidence: Math.floor(programs.reduce((sum, p) => sum + p.controls, 0) * 2.5), // ~7,095 evidence items
  openIssues: 18,
  criticalIssues: 3,
  overdueAssessments: 3,
  upcomingDeadlines: 12
};

