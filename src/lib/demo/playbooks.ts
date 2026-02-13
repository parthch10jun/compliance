/**
 * [DEMO] Compliance Playbooks for PayMe India
 * 
 * Pre-built playbooks/workflows for common compliance scenarios
 */

import { DEMO_MODE } from './config';

export interface PlaybookStep {
  id: string;
  title: string;
  description: string;
  owner: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Blocked';
  dueDate?: string;
  completedDate?: string;
  linkedRequirements?: string[];
  linkedControls?: string[];
  linkedEvidence?: string[];
  automationLevel?: 'Manual' | 'Semi-Automated' | 'Fully Automated';
  estimatedHours?: number;
}

export interface Playbook {
  id: string;
  name: string;
  description: string;
  category: 'Regulatory' | 'Framework' | 'Process' | 'Incident';
  framework: string;
  owner: string;
  status: 'Active' | 'Draft' | 'Archived';
  progress: number; // 0-100
  totalSteps: number;
  completedSteps: number;
  estimatedDuration: string;
  tags: string[];
  steps: PlaybookStep[];
  // [DEMO] Operational linkages - how playbooks drive compliance
  linkedProgramIds?: string[];
  linkedRegulations?: string[];
  linkedRequirementIds?: string[];
  linkedControlIds?: string[];
  linkedObligationIds?: string[];
  // Compliance impact
  complianceObjective?: string;
  businessValue?: string;
  riskMitigation?: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
  demoClient?: string;
}

// Playbook 1: RBI NBFC Annual Compliance Calendar
export const rbiNBFCPlaybook: Playbook = {
  id: 'playbook-demo-rbi-001',
  name: 'RBI NBFC Annual Compliance Calendar',
  description: 'Complete annual compliance calendar for NBFC operations including all RBI submissions, audits, and regulatory filings',
  category: 'Regulatory',
  framework: 'RBI NBFC Scale-Based Regulation',
  owner: DEMO_MODE.personas.complianceHead.name,
  status: 'Active',
  progress: 50,
  totalSteps: 8,
  completedSteps: 4,
  estimatedDuration: '12 months',
  tags: ['RBI', 'NBFC', 'Annual', 'Regulatory', DEMO_MODE.client],
  // [DEMO] Operational linkages
  linkedProgramIds: ['pgm-demo-payme-001'], // NBFC Compliance Program
  linkedRegulations: ['RBI Scale-Based Regulation 2022', 'RBI Master Direction - NBFC', 'Companies Act 2013'],
  linkedRequirementIds: ['req-001', 'req-002', 'req-006'], // NBS Returns, IT Audit, Board Oversight
  linkedControlIds: ['ctrl-001', 'ctrl-002', 'ctrl-008'], // Regulatory reporting, IT governance, Board controls
  linkedObligationIds: ['obl-demo-payme-001', 'obl-demo-payme-002', 'obl-demo-payme-008'], // NBS, IT Audit, Board Meeting
  complianceObjective: 'Ensure 100% on-time regulatory submissions and maintain NBFC license in good standing',
  businessValue: 'Avoid regulatory penalties (up to ₹1 crore per violation), maintain operational license, enable business growth',
  riskMitigation: 'Prevents license suspension, regulatory action, and reputational damage',
  createdAt: '2024-04-01',
  updatedAt: '2025-01-19',
  isDemo: true,
  demoClient: DEMO_MODE.client,
  steps: [
    {
      id: 'rbi-step-001',
      title: 'Establish IT Governance Framework',
      description: 'Establish comprehensive IT governance framework with clear roles, responsibilities, and oversight mechanisms as per RBI IT Governance guidelines',
      owner: DEMO_MODE.personas.ciso.name,
      status: 'Completed',
      dueDate: '2024-06-30',
      completedDate: '2024-06-15',
      linkedRequirements: ['rbi-itgov-req-004'],
      linkedControls: ['ctrl-001', 'ctrl-002'],
      automationLevel: 'Manual',
      estimatedHours: 120
    },
    {
      id: 'rbi-step-002',
      title: 'Constitute Board IT Strategy Committee',
      description: 'Constitute Board-level IT Strategy Committee with minimum 3 members including 1 independent director, meeting quarterly',
      owner: DEMO_MODE.personas.complianceHead.name,
      status: 'Completed',
      dueDate: '2024-07-31',
      completedDate: '2024-07-20',
      linkedRequirements: ['rbi-itgov-req-005'],
      linkedControls: ['ctrl-003'],
      automationLevel: 'Manual',
      estimatedHours: 40
    },
    {
      id: 'rbi-step-003',
      title: 'Implement Multi-Factor Authentication (MFA)',
      description: 'Deploy and enforce MFA for all user accounts accessing critical systems',
      owner: DEMO_MODE.personas.ciso.name,
      status: 'Completed',
      dueDate: '2024-08-31',
      completedDate: '2024-08-25',
      linkedRequirements: ['rbi-itgov-req-020'],
      linkedControls: ['ctrl-001'],
      automationLevel: 'Fully Automated',
      estimatedHours: 80
    },
    {
      id: 'rbi-step-004',
      title: 'Establish 24x7 Security Operations Centre (SOC)',
      description: 'Set up 24x7 SOC with SIEM integration and incident response capabilities',
      owner: DEMO_MODE.personas.ciso.name,
      status: 'In Progress',
      dueDate: '2025-02-28',
      linkedRequirements: ['rbi-itgov-req-030'],
      linkedControls: ['ctrl-003', 'ctrl-008'],
      automationLevel: 'Semi-Automated',
      estimatedHours: 200
    },
    {
      id: 'rbi-step-005',
      title: 'Annual VAPT by Certified Vendors',
      description: 'Conduct annual Vulnerability Assessment and Penetration Testing by CERT-In empaneled vendors',
      owner: DEMO_MODE.personas.ciso.name,
      status: 'Not Started',
      dueDate: '2025-03-31',
      linkedRequirements: ['rbi-itgov-req-032'],
      linkedControls: ['ctrl-006'],
      automationLevel: 'Manual',
      estimatedHours: 60
    },
    {
      id: 'rbi-step-006',
      title: 'Business Continuity Plan (BCP)',
      description: 'Develop and test comprehensive Business Continuity Plan with annual testing',
      owner: DEMO_MODE.personas.ciso.name,
      status: 'In Progress',
      dueDate: '2025-04-30',
      linkedRequirements: ['rbi-itgov-req-050'],
      linkedControls: ['ctrl-009'],
      automationLevel: 'Manual',
      estimatedHours: 100
    },
    {
      id: 'rbi-step-007',
      title: 'Disaster Recovery Plan (DRP)',
      description: 'Implement Disaster Recovery Plan with alternate data center (200km separation) and quarterly testing',
      owner: DEMO_MODE.personas.ciso.name,
      status: 'Not Started',
      dueDate: '2025-05-31',
      linkedRequirements: ['rbi-itgov-req-051'],
      automationLevel: 'Semi-Automated',
      estimatedHours: 150
    },
    {
      id: 'rbi-step-008',
      title: 'IT Audit Framework Implementation',
      description: 'Establish IT audit framework with annual external IT audit by RBI-approved auditors',
      owner: DEMO_MODE.personas.complianceHead.name,
      status: 'Completed',
      dueDate: '2024-12-31',
      completedDate: '2024-12-20',
      linkedRequirements: ['rbi-itgov-req-060'],
      automationLevel: 'Manual',
      estimatedHours: 80
    }
  ]
};

// Playbook 2: ISO 27001 Implementation Roadmap
export const iso27001Playbook: Playbook = {
  id: 'playbook-demo-iso-001',
  name: 'ISO 27001:2022 Implementation Roadmap',
  description: 'Step-by-step implementation guide for ISO 27001:2022 Information Security Management System',
  category: 'Framework',
  framework: 'ISO 27001:2022',
  owner: DEMO_MODE.personas.ciso.name,
  status: 'Active',
  progress: 62,
  totalSteps: 8,
  completedSteps: 5,
  estimatedDuration: '9 months',
  tags: ['ISO 27001', 'Information Security', 'ISMS', DEMO_MODE.client],
  // [DEMO] Operational linkages
  linkedProgramIds: ['pgm-demo-payme-004'], // ISO 27001:2022 ISMS
  linkedRegulations: ['ISO 27001:2022', 'ISO 27002:2022', 'RBI Cyber Security Framework'],
  linkedRequirementIds: ['req-004'], // ISMS requirements
  linkedControlIds: ['ctrl-005'], // ISMS controls
  linkedObligationIds: ['obl-demo-payme-005', 'obl-demo-payme-004'], // ISMS Review, Cyber Incident Reporting
  complianceObjective: 'Achieve ISO 27001:2022 certification and establish robust information security management',
  businessValue: 'Enables enterprise client acquisition, reduces security incidents by 60%, demonstrates security maturity',
  riskMitigation: 'Prevents data breaches, cyber attacks, and information security incidents',
  createdAt: '2024-06-01',
  updatedAt: '2025-01-19',
  isDemo: true,
  demoClient: DEMO_MODE.client,
  steps: [
    {
      id: 'iso-step-001',
      title: 'Define ISMS Scope',
      description: 'Define the scope and boundaries of the Information Security Management System covering all critical systems and processes',
      owner: DEMO_MODE.personas.ciso.name,
      status: 'Completed',
      completedDate: '2024-06-15',
      linkedRequirements: ['rbi-itgov-req-003'],
      automationLevel: 'Manual',
      estimatedHours: 16
    },
    {
      id: 'iso-step-002',
      title: 'Conduct Risk Assessment',
      description: 'Identify and assess information security risks across all systems and processes using ISO 27005 methodology',
      owner: DEMO_MODE.personas.ciso.name,
      status: 'Completed',
      completedDate: '2024-07-30',
      linkedRequirements: ['rbi-itgov-req-019'],
      linkedControls: ['ctrl-007'],
      automationLevel: 'Semi-Automated',
      estimatedHours: 60
    },
    {
      id: 'iso-step-003',
      title: 'Implement Access Controls (A.5)',
      description: 'Implement ISO 27001:2022 Annex A.5 access control requirements including MFA, RBAC, and privileged access management',
      owner: DEMO_MODE.personas.ciso.name,
      status: 'Completed',
      completedDate: '2024-09-30',
      linkedRequirements: ['rbi-itgov-req-020'],
      linkedControls: ['ctrl-001', 'ctrl-002'],
      automationLevel: 'Fully Automated',
      estimatedHours: 80
    },
    {
      id: 'iso-step-004',
      title: 'Implement Cryptographic Controls (A.8)',
      description: 'Implement encryption for data at rest and in transit as per ISO 27001:2022 Annex A.8',
      owner: DEMO_MODE.personas.ciso.name,
      status: 'In Progress',
      dueDate: '2025-02-15',
      linkedRequirements: ['rbi-itgov-req-026'],
      linkedControls: ['ctrl-004'],
      automationLevel: 'Fully Automated',
      estimatedHours: 100
    },
    {
      id: 'iso-step-005',
      title: 'Implement Security Monitoring (A.8.16)',
      description: 'Deploy SIEM and security monitoring tools for continuous threat detection and incident response',
      owner: DEMO_MODE.personas.ciso.name,
      status: 'In Progress',
      dueDate: '2025-02-28',
      linkedRequirements: ['rbi-itgov-req-030'],
      linkedControls: ['ctrl-003', 'ctrl-008'],
      automationLevel: 'Fully Automated',
      estimatedHours: 120
    },
    {
      id: 'iso-step-006',
      title: 'Vulnerability Management (A.8.8)',
      description: 'Implement vulnerability scanning and patch management processes',
      owner: DEMO_MODE.personas.ciso.name,
      status: 'Completed',
      completedDate: '2024-11-30',
      linkedRequirements: ['rbi-itgov-req-032'],
      linkedControls: ['ctrl-006'],
      automationLevel: 'Semi-Automated',
      estimatedHours: 60
    },
    {
      id: 'iso-step-007',
      title: 'Internal ISMS Audit',
      description: 'Conduct internal ISMS audit to verify compliance with ISO 27001:2022 requirements',
      owner: DEMO_MODE.personas.complianceHead.name,
      status: 'Not Started',
      dueDate: '2025-03-31',
      linkedRequirements: ['rbi-itgov-req-060'],
      automationLevel: 'Manual',
      estimatedHours: 40
    },
    {
      id: 'iso-step-008',
      title: 'Certification Audit',
      description: 'External certification audit by accredited ISO 27001 certification body',
      owner: DEMO_MODE.personas.ciso.name,
      status: 'Not Started',
      dueDate: '2025-04-30',
      automationLevel: 'Manual',
      estimatedHours: 24
    }
  ]
};

// Playbook 3: Digital Lending Fair Practices
export const digitalLendingPlaybook: Playbook = {
  id: 'playbook-demo-dl-001',
  name: 'Digital Lending Fair Practices Implementation',
  description: 'Implementation of RBI Digital Lending Guidelines and Fair Practices Code for mobile app-based lending',
  category: 'Regulatory',
  framework: 'RBI Digital Lending Guidelines',
  owner: DEMO_MODE.personas.complianceHead.name,
  status: 'Active',
  progress: 80,
  totalSteps: 5,
  completedSteps: 4,
  estimatedDuration: '6 months',
  tags: ['RBI', 'Digital Lending', 'Fair Practices', 'Mobile App', DEMO_MODE.client],
  // [DEMO] Operational linkages
  linkedProgramIds: ['pgm-demo-payme-002'], // Digital Lending Guidelines
  linkedRegulations: ['RBI Digital Lending Guidelines 2022', 'Fair Practices Code', 'Consumer Protection Act'],
  linkedRequirementIds: ['req-005'], // LSP oversight
  linkedControlIds: ['ctrl-006'], // LSP controls
  linkedObligationIds: ['obl-demo-payme-006'], // Quarterly LSP Review
  complianceObjective: 'Ensure 100% compliance with RBI digital lending norms and fair practices code',
  businessValue: 'Enables continued digital lending operations, protects from regulatory action, builds customer trust',
  riskMitigation: 'Prevents app delisting, regulatory penalties (up to ₹10 crore), and customer complaints',
  createdAt: '2024-09-01',
  updatedAt: '2025-01-19',
  isDemo: true,
  demoClient: DEMO_MODE.client,
  steps: [
    {
      id: 'dl-step-001',
      title: 'LSP Due Diligence',
      description: 'Conduct due diligence on all Lending Service Providers (LSPs) as per RBI Digital Lending Guidelines',
      owner: DEMO_MODE.personas.complianceHead.name,
      status: 'Completed',
      completedDate: '2024-09-30',
      linkedRequirements: ['rbi-itgov-req-011'],
      automationLevel: 'Manual',
      estimatedHours: 40
    },
    {
      id: 'dl-step-002',
      title: 'Key Fact Statement (KFS) Implementation',
      description: 'Implement standardized Key Fact Statement in loan app and disbursement process as per RBI guidelines',
      owner: DEMO_MODE.personas.complianceHead.name,
      status: 'Completed',
      completedDate: '2024-10-15',
      linkedControls: ['ctrl-010'],
      automationLevel: 'Fully Automated',
      estimatedHours: 80
    },
    {
      id: 'dl-step-003',
      title: 'Automated Consent Management',
      description: 'Implement automated consent capture and management system for customer data as per DPDP Act 2023',
      owner: DEMO_MODE.personas.dpo.name,
      status: 'Completed',
      completedDate: '2024-11-30',
      linkedRequirements: ['dpdp-req-020'],
      linkedControls: ['ctrl-011'],
      automationLevel: 'Fully Automated',
      estimatedHours: 120
    },
    {
      id: 'dl-step-004',
      title: 'Grievance Redressal Portal',
      description: 'Deploy customer grievance redressal portal with automated tracking and 30-day SLA',
      owner: DEMO_MODE.personas.complianceHead.name,
      status: 'In Progress',
      dueDate: '2025-01-31',
      linkedControls: ['ctrl-010'],
      automationLevel: 'Fully Automated',
      estimatedHours: 100
    },
    {
      id: 'dl-step-005',
      title: 'Fair Practices Code Implementation',
      description: 'Implement Fair Practices Code across all digital lending channels',
      owner: DEMO_MODE.personas.complianceHead.name,
      status: 'Completed',
      completedDate: '2024-12-15',
      automationLevel: 'Manual',
      estimatedHours: 60
    }
  ]
};

// Playbook 4: DPDP Customer Data Protection
export const dpdpPlaybook: Playbook = {
  id: 'playbook-demo-dpdp-001',
  name: 'DPDP Act 2023 - Customer Consent Management',
  description: 'Implementation of DPDP Act 2023 requirements for customer personal data protection and consent management',
  category: 'Regulatory',
  framework: 'DPDP Act 2023',
  owner: DEMO_MODE.personas.dpo.name,
  status: 'Active',
  progress: 60,
  totalSteps: 5,
  completedSteps: 3,
  estimatedDuration: '8 months',
  tags: ['DPDP', 'Data Privacy', 'Consent Management', 'MeitY', DEMO_MODE.client],
  // [DEMO] Operational linkages
  linkedProgramIds: ['pgm-demo-payme-003'], // Customer Data Protection (DPDP)
  linkedRegulations: ['DPDP Act 2023', 'IT Act 2000', 'Consumer Protection Act 2019'],
  linkedRequirementIds: ['dpdp-req-020'], // Consent management
  linkedControlIds: ['ctrl-007'], // Consent controls
  linkedObligationIds: ['obl-demo-payme-003', 'obl-demo-payme-007'], // Data Breach Notification, Consent Audit
  complianceObjective: 'Achieve full DPDP Act compliance and establish robust consent management framework',
  businessValue: 'Avoids penalties (up to ₹200 crores), builds customer trust, enables data-driven business',
  riskMitigation: 'Prevents data breach penalties, consent violations, and regulatory enforcement actions',
  createdAt: '2024-08-11',
  updatedAt: '2025-01-19',
  isDemo: true,
  demoClient: DEMO_MODE.client,
  steps: [
    {
      id: 'dpdp-step-001',
      title: 'Data Inventory & Mapping',
      description: 'Complete inventory of all personal data collected, processed, and stored as per DPDP Act 2023 requirements',
      owner: DEMO_MODE.personas.dpo.name,
      status: 'Completed',
      completedDate: '2024-09-30',
      linkedRequirements: ['dpdp-req-010'],
      automationLevel: 'Semi-Automated',
      estimatedHours: 80
    },
    {
      id: 'dpdp-step-002',
      title: 'Consent Notice Implementation',
      description: 'Implement clear, specific consent notices for all data collection points in compliance with DPDP Act',
      owner: DEMO_MODE.personas.dpo.name,
      status: 'Completed',
      completedDate: '2024-10-31',
      linkedRequirements: ['dpdp-req-020'],
      linkedControls: ['ctrl-011'],
      automationLevel: 'Fully Automated',
      estimatedHours: 60
    },
    {
      id: 'dpdp-step-003',
      title: 'Data Principal Rights Portal',
      description: 'Deploy self-service portal for data access, correction, and erasure requests (DSAR)',
      owner: DEMO_MODE.personas.dpo.name,
      status: 'In Progress',
      dueDate: '2025-02-15',
      linkedRequirements: ['dpdp-req-030'],
      linkedControls: ['ctrl-010'],
      automationLevel: 'Fully Automated',
      estimatedHours: 120
    },
    {
      id: 'dpdp-step-004',
      title: 'Breach Detection & Notification',
      description: 'Implement automated data breach detection and 72-hour notification system to Data Protection Board',
      owner: DEMO_MODE.personas.ciso.name,
      status: 'In Progress',
      dueDate: '2025-02-28',
      linkedRequirements: ['dpdp-req-040'],
      linkedControls: ['ctrl-008'],
      automationLevel: 'Fully Automated',
      estimatedHours: 100
    },
    {
      id: 'dpdp-step-005',
      title: 'Data Retention & Deletion',
      description: 'Implement automated data retention policies and secure deletion procedures',
      owner: DEMO_MODE.personas.dpo.name,
      status: 'Not Started',
      dueDate: '2025-03-31',
      linkedRequirements: ['dpdp-req-050'],
      automationLevel: 'Fully Automated',
      estimatedHours: 80
    }
  ]
};

export const demoPlaybooks = [
  rbiNBFCPlaybook,
  iso27001Playbook,
  digitalLendingPlaybook,
  dpdpPlaybook
];

