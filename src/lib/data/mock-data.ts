// Mock Data for Compliance Module
import { Authority, ComplianceProgram, Control, Assessment, Issue, DashboardMetrics } from '../types/compliance';

export const authorities: Authority[] = [
  {
    id: 'rbi', name: 'RBI', fullName: 'Reserve Bank of India', type: 'Regulator', jurisdiction: 'India',
    compliance: 91, trend: 3.2, programs: 4, citations: 156, citationsWithObligations: 24,
    controls: 142, tests: 186, evidence: 312, status: 'Active', createdAt: '2024-01-15', updatedAt: '2024-12-20'
  },
  {
    id: 'iso', name: 'ISO', fullName: 'International Organization for Standardization', type: 'Standards Body', jurisdiction: 'International',
    compliance: 88, trend: 2.1, programs: 3, citations: 114, citationsWithObligations: 0,
    controls: 98, tests: 124, evidence: 198, status: 'Active', createdAt: '2024-01-10', updatedAt: '2024-12-18'
  },
  {
    id: 'eu', name: 'EU', fullName: 'European Commission', type: 'Regulator', jurisdiction: 'European Union',
    compliance: 85, trend: -1.4, programs: 2, citations: 88, citationsWithObligations: 32,
    controls: 76, tests: 98, evidence: 156, status: 'Active', createdAt: '2024-02-01', updatedAt: '2024-12-19'
  },
  {
    id: 'sdaia', name: 'SDAIA', fullName: 'Saudi Data & AI Authority', type: 'Regulator', jurisdiction: 'Saudi Arabia',
    compliance: 78, trend: 5.8, programs: 1, citations: 45, citationsWithObligations: 12,
    controls: 52, tests: 68, evidence: 94, status: 'Active', createdAt: '2024-03-01', updatedAt: '2024-12-15'
  },
];

export const programs: ComplianceProgram[] = [
  {
    id: 'pgm-001', name: 'RBI IT Governance', description: 'RBI IT Governance Framework compliance program',
    authorityId: 'rbi', authorityName: 'RBI', framework: 'RBI IT Gov', status: 'Active', owner: 'Rahul Sharma',
    department: 'IT', complianceScore: 92, riskRating: 'Medium', priority: 'High', citations: 45, controls: 38,
    tests: 52, testsPassed: 48, testsFailed: 2, testsPending: 2, lastReviewDate: '2024-11-15', nextReviewDate: '2025-02-15',
    createdAt: '2024-01-15', updatedAt: '2024-12-20'
  },
  {
    id: 'pgm-002', name: 'RBI Cyber Security Framework', description: 'RBI CSF compliance program',
    authorityId: 'rbi', authorityName: 'RBI', framework: 'RBI CSF', status: 'Active', owner: 'Priya Patel',
    department: 'Information Security', complianceScore: 89, riskRating: 'High', priority: 'Critical', citations: 62, controls: 54,
    tests: 72, testsPassed: 64, testsFailed: 5, testsPending: 3, lastReviewDate: '2024-10-20', nextReviewDate: '2025-01-20',
    createdAt: '2024-01-20', updatedAt: '2024-12-18'
  },
  {
    id: 'pgm-003', name: 'ISO 27001:2022', description: 'Information Security Management System',
    authorityId: 'iso', authorityName: 'ISO', framework: 'ISO 27001', status: 'Active', owner: 'Amit Kumar',
    department: 'Information Security', complianceScore: 88, riskRating: 'Medium', priority: 'High', citations: 114, controls: 98,
    tests: 124, testsPassed: 108, testsFailed: 8, testsPending: 8, lastReviewDate: '2024-09-30', nextReviewDate: '2024-12-31',
    createdAt: '2024-02-01', updatedAt: '2024-12-15'
  },
  {
    id: 'pgm-004', name: 'GDPR Compliance', description: 'EU General Data Protection Regulation compliance',
    authorityId: 'eu', authorityName: 'EU', framework: 'GDPR', status: 'Active', owner: 'Sarah Johnson',
    department: 'Legal', complianceScore: 85, riskRating: 'High', priority: 'Critical', citations: 88, controls: 76,
    tests: 98, testsPassed: 82, testsFailed: 10, testsPending: 6, lastReviewDate: '2024-11-01', nextReviewDate: '2025-02-01',
    createdAt: '2024-02-15', updatedAt: '2024-12-19'
  },
  {
    id: 'pgm-005', name: 'PDPL Compliance', description: 'Saudi Personal Data Protection Law compliance',
    authorityId: 'sdaia', authorityName: 'SDAIA', framework: 'PDPL', status: 'Active', owner: 'Ahmed Al-Rashid',
    department: 'Legal', complianceScore: 78, riskRating: 'High', priority: 'High', citations: 45, controls: 52,
    tests: 68, testsPassed: 52, testsFailed: 8, testsPending: 8, lastReviewDate: '2024-10-15', nextReviewDate: '2025-01-15',
    createdAt: '2024-03-01', updatedAt: '2024-12-15'
  },
];

export const controls: Control[] = [
  { id: 'ctl-001', name: 'Access Control Policy', description: 'Logical access control policy enforcement', citationId: 'cit-001', programId: 'pgm-003', category: 'Access Control', type: 'Preventive', automationLevel: 'Semi-Automated', effectiveness: 'Effective', frequency: 'Continuous', owner: 'Amit Kumar', department: 'IT', tests: 4, testsPassed: 4, lastTestDate: '2024-12-10', nextTestDate: '2025-01-10', status: 'Active' },
  { id: 'ctl-002', name: 'Data Encryption', description: 'Encryption of data at rest and in transit', citationId: 'cit-002', programId: 'pgm-002', category: 'Cryptography', type: 'Preventive', automationLevel: 'Fully Automated', effectiveness: 'Effective', frequency: 'Continuous', owner: 'Priya Patel', department: 'Security', tests: 3, testsPassed: 3, lastTestDate: '2024-12-05', nextTestDate: '2025-01-05', status: 'Active' },
  { id: 'ctl-003', name: 'Security Monitoring', description: 'Real-time security event monitoring', citationId: 'cit-003', programId: 'pgm-002', category: 'Monitoring', type: 'Detective', automationLevel: 'Fully Automated', effectiveness: 'Effective', frequency: 'Continuous', owner: 'Vikram Singh', department: 'SOC', tests: 5, testsPassed: 4, lastTestDate: '2024-12-15', nextTestDate: '2025-01-15', status: 'Active' },
  { id: 'ctl-004', name: 'Incident Response', description: 'Security incident response procedures', citationId: 'cit-004', programId: 'pgm-002', category: 'Incident Management', type: 'Corrective', automationLevel: 'Manual', effectiveness: 'Partially Effective', frequency: 'Monthly', owner: 'Priya Patel', department: 'Security', tests: 2, testsPassed: 1, lastTestDate: '2024-11-20', nextTestDate: '2024-12-20', status: 'Active' },
  { id: 'ctl-005', name: 'Data Subject Rights', description: 'GDPR data subject access request handling', citationId: 'cit-005', programId: 'pgm-004', category: 'Privacy', type: 'Corrective', automationLevel: 'Semi-Automated', effectiveness: 'Effective', frequency: 'Monthly', owner: 'Sarah Johnson', department: 'Legal', tests: 3, testsPassed: 3, lastTestDate: '2024-12-01', nextTestDate: '2025-01-01', status: 'Active' },
  { id: 'ctl-006', name: 'Consent Management', description: 'User consent collection and management', citationId: 'cit-006', programId: 'pgm-004', category: 'Privacy', type: 'Preventive', automationLevel: 'Fully Automated', effectiveness: 'Effective', frequency: 'Continuous', owner: 'Sarah Johnson', department: 'Legal', tests: 2, testsPassed: 2, lastTestDate: '2024-12-08', nextTestDate: '2025-01-08', status: 'Active' },
  { id: 'ctl-007', name: 'Change Management', description: 'IT change management process', citationId: 'cit-007', programId: 'pgm-001', category: 'Change Management', type: 'Preventive', automationLevel: 'Semi-Automated', effectiveness: 'Partially Effective', frequency: 'Weekly', owner: 'Rahul Sharma', department: 'IT', tests: 4, testsPassed: 3, lastTestDate: '2024-12-12', nextTestDate: '2025-01-12', status: 'Active' },
  { id: 'ctl-008', name: 'Backup & Recovery', description: 'Data backup and disaster recovery', citationId: 'cit-008', programId: 'pgm-001', category: 'Business Continuity', type: 'Corrective', automationLevel: 'Fully Automated', effectiveness: 'Effective', frequency: 'Daily', owner: 'Rahul Sharma', department: 'IT', tests: 3, testsPassed: 3, lastTestDate: '2024-12-18', nextTestDate: '2025-01-18', status: 'Active' },
];

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
  overallCompliance: 87, complianceTrend: 2.4, totalAuthorities: 4, totalPrograms: 10, activePrograms: 8,
  totalCitations: 403, citationsWithObligations: 68, totalControls: 368, effectiveControls: 312,
  totalTests: 476, testsPassed: 396, testsFailed: 42, testsPending: 38, totalEvidence: 760,
  openIssues: 15, criticalIssues: 2, overdueAssessments: 3, upcomingDeadlines: 8
};

