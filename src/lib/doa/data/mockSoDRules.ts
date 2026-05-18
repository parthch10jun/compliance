/**
 * Mock Segregation of Duties (SoD) Rules and Conflicts
 * Realistic SoD rules for financial, HR, and IT processes
 */

import { SoDRule, SoDConflict } from '../types/doa-types';

export const mockSoDRules: SoDRule[] = [
  {
    id: 'sod-001',
    name: 'Requestor Cannot Approve Own Purchase',
    description: 'The person who creates a purchase request cannot approve the same purchase request',
    severity: 'Critical',
    function1: 'Create Purchase Request',
    function2: 'Approve Purchase Request',
    conflictType: 'Same User',
    riskDescription: 'Risk of fraudulent or unauthorized purchases without independent review',
    allowOverride: false,
    requiresApproval: true,
    compensatingControls: [
      'Secondary review by Finance Director',
      'Monthly audit of all self-approved transactions',
      'Real-time monitoring alerts'
    ],
    applicableEntities: ['Corporate', 'North America', 'EMEA', 'APAC', 'LATAM'],
    isActive: true,
    regulatoryReference: 'SOX §404, Internal Controls',
    createdBy: 'user-002',
    createdDate: '2025-01-15',
  },
  {
    id: 'sod-002',
    name: 'Vendor Setup and Payment Processing Separation',
    description: 'The person who sets up a new vendor cannot process payments to that vendor',
    severity: 'Critical',
    function1: 'Vendor Setup/Onboarding',
    function2: 'Vendor Payment Processing',
    conflictType: 'Same User',
    riskDescription: 'Risk of creating fictitious vendors and processing fraudulent payments',
    allowOverride: false,
    requiresApproval: true,
    compensatingControls: [
      'Vendor master data review by separate team',
      'Payment authorization by manager',
      'Quarterly vendor validation'
    ],
    applicableEntities: ['Corporate', 'North America', 'EMEA', 'APAC', 'LATAM'],
    isActive: true,
    regulatoryReference: 'SOX §404, Anti-Fraud Controls',
    createdBy: 'user-002',
    createdDate: '2025-01-15',
  },
  {
    id: 'sod-003',
    name: 'Hiring and Compensation Decision Separation',
    description: 'The person who approves hiring cannot unilaterally approve compensation changes for the same employee',
    severity: 'High',
    function1: 'Hiring Approval',
    function2: 'Compensation Change Approval',
    conflictType: 'Same User',
    riskDescription: 'Risk of inflated compensation or nepotism without proper oversight',
    allowOverride: true,
    requiresApproval: true,
    compensatingControls: [
      'HR Director review of all compensation changes',
      'Compensation band compliance check',
      'Annual compensation audit'
    ],
    applicableEntities: ['Corporate', 'North America', 'EMEA', 'APAC'],
    isActive: true,
    regulatoryReference: 'HR Policy §3.2, Compensation Governance',
    createdBy: 'user-005',
    createdDate: '2025-02-01',
  },
  {
    id: 'sod-004',
    name: 'Payroll Processing and Approval Separation',
    description: 'The person who processes payroll changes cannot approve those same changes',
    severity: 'Critical',
    function1: 'Payroll Data Entry',
    function2: 'Payroll Approval',
    conflictType: 'Same User',
    riskDescription: 'Risk of unauthorized salary changes or ghost employees',
    allowOverride: false,
    requiresApproval: true,
    compensatingControls: [
      'Dual authorization for all payroll changes',
      'Monthly payroll reconciliation',
      'Exception reporting'
    ],
    applicableEntities: ['Corporate', 'North America', 'EMEA', 'APAC', 'LATAM'],
    isActive: true,
    regulatoryReference: 'SOX §404, Payroll Controls',
    createdBy: 'user-005',
    createdDate: '2025-02-01',
  },
  {
    id: 'sod-005',
    name: 'Termination Decision and System Access Revocation',
    description: 'The person who terminates an employee must not be the only person who revokes system access',
    severity: 'High',
    function1: 'Employee Termination',
    function2: 'System Access Revocation',
    conflictType: 'Same User',
    riskDescription: 'Risk of delayed access revocation or unauthorized access retention',
    allowOverride: true,
    requiresApproval: true,
    compensatingControls: [
      'IT automatically notified of terminations',
      'Access revocation checklist',
      'Post-termination access audit'
    ],
    applicableEntities: ['Corporate', 'North America', 'EMEA', 'APAC'],
    isActive: true,
    regulatoryReference: 'IT Security Policy §2.5',
    createdBy: 'user-007',
    createdDate: '2025-02-10',
  },
  {
    id: 'sod-006',
    name: 'IT Change Implementation and Approval Separation',
    description: 'The person who implements an IT change cannot be the sole approver of that change',
    severity: 'High',
    function1: 'IT Change Implementation',
    function2: 'IT Change Approval',
    conflictType: 'Same User',
    riskDescription: 'Risk of unauthorized changes or inadequate testing',
    allowOverride: true,
    requiresApproval: true,
    compensatingControls: [
      'Change Advisory Board (CAB) review',
      'Peer review of high-risk changes',
      'Post-implementation verification'
    ],
    applicableEntities: ['Corporate', 'North America', 'EMEA', 'APAC', 'LATAM'],
    isActive: true,
    regulatoryReference: 'ITIL Change Management, IT Policy §4.1',
    createdBy: 'user-007',
    createdDate: '2025-02-10',
  },
  {
    id: 'sod-007',
    name: 'Access Request and Access Grant Separation',
    description: 'The person who requests system access for themselves cannot approve their own access request',
    severity: 'High',
    function1: 'Access Request Submission',
    function2: 'Access Request Approval',
    conflictType: 'Same User',
    riskDescription: 'Risk of unauthorized privilege escalation',
    allowOverride: false,
    requiresApproval: true,
    compensatingControls: [
      'Manager approval required',
      'Quarterly access review',
      'Privileged access monitoring'
    ],
    applicableEntities: ['Corporate', 'North America', 'EMEA', 'APAC', 'LATAM'],
    isActive: true,
    regulatoryReference: 'ISO 27001 A.9.2, Access Control',
    createdBy: 'user-007',
    createdDate: '2025-02-10',
  },
  {
    id: 'sod-008',
    name: 'Database Administration and Audit Log Review',
    description: 'Database administrators should not be the only reviewers of database audit logs',
    severity: 'Medium',
    function1: 'Database Administration',
    function2: 'Database Audit Log Review',
    conflictType: 'Same Role',
    riskDescription: 'Risk of unauthorized data manipulation without detection',
    allowOverride: true,
    requiresApproval: true,
    compensatingControls: [
      'Security team reviews critical database logs',
      'Automated anomaly detection',
      'Annual security audit'
    ],
    applicableEntities: ['Corporate', 'North America', 'EMEA', 'APAC', 'LATAM'],
    isActive: true,
    regulatoryReference: 'ISO 27001 A.12.4, Logging and Monitoring',
    createdBy: 'user-007',
    createdDate: '2025-02-15',
  },
];

export const mockSoDConflicts: SoDConflict[] = [
  {
    id: 'conflict-001',
    ruleId: 'sod-001',
    ruleName: 'Requestor Cannot Approve Own Purchase',
    severity: 'Critical',
    conflictDescription: 'Alex Johnson has both purchase request creation and approval rights for amounts up to $50,000',
    affectedUsers: ['user-012'],
    affectedUserNames: ['Alex Johnson'],
    detectedDate: '2026-05-10',
    status: 'Open',
  },
  {
    id: 'conflict-002',
    ruleId: 'sod-002',
    ruleName: 'Vendor Setup and Payment Processing Separation',
    severity: 'Critical',
    conflictDescription: 'Thomas Brown has access to both vendor master data maintenance and payment processing functions',
    affectedUsers: ['user-010'],
    affectedUserNames: ['Thomas Brown'],
    detectedDate: '2026-05-08',
    status: 'Open',
    resolution: 'Under review - evaluating split of duties between Procurement and AP teams',
  },
  {
    id: 'conflict-003',
    ruleId: 'sod-007',
    ruleName: 'Access Request and Access Grant Separation',
    severity: 'High',
    conflictDescription: 'Emily Zhang previously had permission to approve her own access requests to production systems',
    affectedUsers: ['user-015'],
    affectedUserNames: ['Emily Zhang'],
    detectedDate: '2026-04-25',
    status: 'Remediated',
    resolution: 'Access approval permission removed; now requires manager approval',
    approvedBy: 'user-007',
    approvedByName: 'Lisa Anderson',
    approvalDate: '2026-04-26',
    resolvedDate: '2026-04-26',
  },
  {
    id: 'conflict-004',
    ruleId: 'sod-003',
    ruleName: 'Hiring and Compensation Decision Separation',
    severity: 'High',
    conflictDescription: 'Maria Garcia has authority to both approve hiring and compensation changes for EMEA region',
    affectedUsers: ['user-009'],
    affectedUserNames: ['Maria Garcia'],
    detectedDate: '2026-04-15',
    status: 'Accepted with Compensating Controls',
    resolution: 'Risk accepted due to regional structure; compensating controls implemented',
    compensatingControls: [
      'VP HR reviews all compensation changes > $5000',
      'Monthly audit report of hiring and compensation decisions',
      'Annual internal audit review'
    ],
    approvedBy: 'user-005',
    approvedByName: 'Emma Thompson',
    approvalDate: '2026-04-20',
    resolvedDate: '2026-04-20',
  },
  {
    id: 'conflict-005',
    ruleId: 'sod-006',
    ruleName: 'IT Change Implementation and Approval Separation',
    severity: 'High',
    conflictDescription: 'Sophie Martin was both implementing and approving routine IT changes for EMEA infrastructure',
    affectedUsers: ['user-011'],
    affectedUserNames: ['Sophie Martin'],
    detectedDate: '2026-03-30',
    status: 'Remediated',
    resolution: 'Process changed: all changes now require peer review and separate approval from IT Manager',
    approvedBy: 'user-007',
    approvedByName: 'Lisa Anderson',
    approvalDate: '2026-04-05',
    resolvedDate: '2026-04-10',
  },
];

// Helper functions
export const getSoDRuleById = (id: string): SoDRule | undefined => {
  return mockSoDRules.find(rule => rule.id === id);
};

export const getSoDRulesBySeverity = (severity: 'Critical' | 'High' | 'Medium' | 'Low'): SoDRule[] => {
  return mockSoDRules.filter(rule => rule.severity === severity);
};

export const getActiveSoDRules = (): SoDRule[] => {
  return mockSoDRules.filter(rule => rule.isActive);
};

export const getSoDConflictById = (id: string): SoDConflict | undefined => {
  return mockSoDConflicts.find(conflict => conflict.id === id);
};

export const getOpenSoDConflicts = (): SoDConflict[] => {
  return mockSoDConflicts.filter(conflict => conflict.status === 'Open');
};

export const getSoDConflictsBySeverity = (severity: 'Critical' | 'High' | 'Medium' | 'Low'): SoDConflict[] => {
  return mockSoDConflicts.filter(conflict => conflict.severity === severity);
};
