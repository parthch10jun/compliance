// SOC 1 Type II Requirements - Internal Controls over Financial Reporting (ICFR)
// Based on AICPA SSAE 18 and COSO Framework
// Total: 45 control objectives across 5 COSO components

import { RequirementCitation } from '../types/compliance';

export const soc1Requirements: RequirementCitation[] = [
  // ============================================================================
  // CONTROL ENVIRONMENT (10 requirements)
  // ============================================================================
  {
    id: 'soc1-req-ce-1',
    code: 'CE1.1',
    title: 'Integrity and Ethical Values',
    description: 'The entity demonstrates a commitment to integrity and ethical values in financial reporting processes.',
    section: 'Control Environment',
    category: 'Governance',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'Ethics', 'Governance'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ce-2',
    code: 'CE1.2',
    title: 'Board Independence and Oversight',
    description: 'The board of directors demonstrates independence from management and exercises oversight of financial reporting controls.',
    section: 'Control Environment',
    category: 'Governance',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'Board', 'Oversight'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ce-3',
    code: 'CE1.3',
    title: 'Organizational Structure',
    description: 'Management establishes structures, reporting lines, and appropriate authorities and responsibilities for financial reporting.',
    section: 'Control Environment',
    category: 'Governance',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Medium',
    tags: ['COSO', 'ICFR', 'Structure', 'Roles'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ce-4',
    code: 'CE1.4',
    title: 'Commitment to Competence',
    description: 'The entity demonstrates a commitment to attract, develop, and retain competent individuals in financial reporting roles.',
    section: 'Control Environment',
    category: 'Human Resources',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Medium',
    tags: ['COSO', 'ICFR', 'Competence', 'Training'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ce-5',
    code: 'CE1.5',
    title: 'Accountability for Performance',
    description: 'The entity holds individuals accountable for their financial reporting control responsibilities.',
    section: 'Control Environment',
    category: 'Governance',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'Accountability', 'Performance'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ce-6',
    code: 'CE1.6',
    title: 'Human Resource Policies',
    description: 'The entity establishes policies and practices for hiring, training, and retaining personnel involved in financial reporting.',
    section: 'Control Environment',
    category: 'Human Resources',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Medium',
    tags: ['COSO', 'ICFR', 'HR', 'Policies'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ce-7',
    code: 'CE1.7',
    title: 'Management Philosophy and Operating Style',
    description: 'Management demonstrates a philosophy and operating style that supports effective financial reporting controls.',
    section: 'Control Environment',
    category: 'Governance',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Medium',
    tags: ['COSO', 'ICFR', 'Management', 'Culture'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ce-8',
    code: 'CE1.8',
    title: 'Assignment of Authority and Responsibility',
    description: 'The entity assigns authority and responsibility for financial reporting objectives to facilitate effective internal control.',
    section: 'Control Environment',
    category: 'Governance',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'Authority', 'Responsibility'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ce-9',
    code: 'CE1.9',
    title: 'Financial Reporting Competencies',
    description: 'The entity identifies and develops competencies needed to support financial reporting objectives.',
    section: 'Control Environment',
    category: 'Human Resources',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Medium',
    tags: ['COSO', 'ICFR', 'Competencies', 'Skills'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ce-10',
    code: 'CE1.10',
    title: 'Performance Measures and Incentives',
    description: 'The entity establishes performance measures and incentives that support financial reporting objectives.',
    section: 'Control Environment',
    category: 'Governance',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Medium',
    tags: ['COSO', 'ICFR', 'Performance', 'Incentives'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },

  // ============================================================================
  // RISK ASSESSMENT (9 requirements)
  // ============================================================================
  {
    id: 'soc1-req-ra-1',
    code: 'RA2.1',
    title: 'Financial Reporting Objectives',
    description: 'The entity specifies financial reporting objectives with sufficient clarity to enable identification and assessment of risks.',
    section: 'Risk Assessment',
    category: 'Risk Management',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'Objectives', 'Risk'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ra-2',
    code: 'RA2.2',
    title: 'Risk Identification',
    description: 'The entity identifies risks to the achievement of financial reporting objectives across the entity.',
    section: 'Risk Assessment',
    category: 'Risk Management',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'Risk Identification', 'Assessment'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ra-3',
    code: 'RA2.3',
    title: 'Risk Analysis',
    description: 'The entity analyzes risks to the achievement of financial reporting objectives as a basis for determining how risks should be managed.',
    section: 'Risk Assessment',
    category: 'Risk Management',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'Risk Analysis', 'Management'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ra-4',
    code: 'RA2.4',
    title: 'Fraud Risk Assessment',
    description: 'The entity considers the potential for fraud in assessing risks to the achievement of financial reporting objectives.',
    section: 'Risk Assessment',
    category: 'Risk Management',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['COSO', 'ICFR', 'Fraud', 'Risk'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ra-5',
    code: 'RA2.5',
    title: 'Significant Changes Assessment',
    description: 'The entity identifies and assesses changes that could significantly impact the system of internal control over financial reporting.',
    section: 'Risk Assessment',
    category: 'Risk Management',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'Change', 'Assessment'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ra-6',
    code: 'RA2.6',
    title: 'Transaction Processing Risks',
    description: 'The entity identifies and assesses risks related to the processing of financial transactions.',
    section: 'Risk Assessment',
    category: 'Risk Management',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'Transactions', 'Processing'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ra-7',
    code: 'RA2.7',
    title: 'Financial Statement Assertions',
    description: 'The entity assesses risks related to financial statement assertions including completeness, accuracy, and validity.',
    section: 'Risk Assessment',
    category: 'Risk Management',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['COSO', 'ICFR', 'Assertions', 'Financial Statements'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ra-8',
    code: 'RA2.8',
    title: 'IT Systems and Infrastructure Risks',
    description: 'The entity identifies and assesses risks related to IT systems that support financial reporting.',
    section: 'Risk Assessment',
    category: 'Risk Management',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'IT', 'Systems'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ra-9',
    code: 'RA2.9',
    title: 'Third-Party Service Provider Risks',
    description: 'The entity identifies and assesses risks related to third-party service providers that impact financial reporting.',
    section: 'Risk Assessment',
    category: 'Risk Management',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'Third-Party', 'Vendors'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },

  // ============================================================================
  // CONTROL ACTIVITIES (14 requirements)
  // ============================================================================
  {
    id: 'soc1-req-ca-1',
    code: 'CA3.1',
    title: 'Control Activities Selection and Development',
    description: 'The entity selects and develops control activities that contribute to the mitigation of risks to acceptable levels.',
    section: 'Control Activities',
    category: 'Operations',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'Controls', 'Mitigation'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ca-2',
    code: 'CA3.2',
    title: 'Technology Controls',
    description: 'The entity selects and develops general control activities over technology to support the achievement of financial reporting objectives.',
    section: 'Control Activities',
    category: 'Technology',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'IT Controls', 'Technology'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ca-3',
    code: 'CA3.3',
    title: 'Policies and Procedures Deployment',
    description: 'The entity deploys control activities through policies that establish expectations and procedures that put policies into action.',
    section: 'Control Activities',
    category: 'Operations',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Medium',
    tags: ['COSO', 'ICFR', 'Policies', 'Procedures'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ca-4',
    code: 'CA3.4',
    title: 'Segregation of Duties',
    description: 'The entity segregates incompatible duties and implements alternative controls where segregation is not practical.',
    section: 'Control Activities',
    category: 'Operations',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['COSO', 'ICFR', 'Segregation', 'Duties'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ca-5',
    code: 'CA3.5',
    title: 'Authorization and Approval',
    description: 'The entity implements controls to ensure transactions are properly authorized and approved.',
    section: 'Control Activities',
    category: 'Operations',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['COSO', 'ICFR', 'Authorization', 'Approval'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ca-6',
    code: 'CA3.6',
    title: 'Accuracy and Completeness Checks',
    description: 'The entity implements controls to verify the accuracy and completeness of financial data processing.',
    section: 'Control Activities',
    category: 'Operations',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['COSO', 'ICFR', 'Accuracy', 'Completeness'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ca-7',
    code: 'CA3.7',
    title: 'Reconciliations',
    description: 'The entity performs regular reconciliations of financial data to ensure accuracy and identify discrepancies.',
    section: 'Control Activities',
    category: 'Operations',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'Reconciliation', 'Accuracy'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ca-8',
    code: 'CA3.8',
    title: 'Physical Controls',
    description: 'The entity secures physical assets and records related to financial reporting.',
    section: 'Control Activities',
    category: 'Physical Security',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Medium',
    tags: ['COSO', 'ICFR', 'Physical', 'Security'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ca-9',
    code: 'CA3.9',
    title: 'Access Controls',
    description: 'The entity restricts access to financial systems and data to authorized personnel.',
    section: 'Control Activities',
    category: 'Access Control',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['COSO', 'ICFR', 'Access', 'Security'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ca-10',
    code: 'CA3.10',
    title: 'System Development and Change Management',
    description: 'The entity implements controls over system development and changes to financial reporting systems.',
    section: 'Control Activities',
    category: 'Technology',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'Change Management', 'SDLC'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ca-11',
    code: 'CA3.11',
    title: 'Data Backup and Recovery',
    description: 'The entity implements controls to ensure financial data is backed up and can be recovered.',
    section: 'Control Activities',
    category: 'Technology',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'Backup', 'Recovery'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ca-12',
    code: 'CA3.12',
    title: 'Transaction Processing Controls',
    description: 'The entity implements controls to ensure financial transactions are processed completely, accurately, and in a timely manner.',
    section: 'Control Activities',
    category: 'Operations',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['COSO', 'ICFR', 'Transactions', 'Processing'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ca-13',
    code: 'CA3.13',
    title: 'Exception Handling',
    description: 'The entity identifies, investigates, and resolves exceptions in financial processing.',
    section: 'Control Activities',
    category: 'Operations',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'Exceptions', 'Resolution'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ca-14',
    code: 'CA3.14',
    title: 'Reporting Controls',
    description: 'The entity implements controls to ensure financial reports are accurate, complete, and timely.',
    section: 'Control Activities',
    category: 'Operations',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['COSO', 'ICFR', 'Reporting', 'Accuracy'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },

  // ============================================================================
  // INFORMATION AND COMMUNICATION (6 requirements)
  // ============================================================================
  {
    id: 'soc1-req-ic-1',
    code: 'IC4.1',
    title: 'Financial Information Quality',
    description: 'The entity obtains or generates and uses relevant, quality information to support the functioning of internal control over financial reporting.',
    section: 'Information and Communication',
    category: 'Information Management',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'Information', 'Quality'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ic-2',
    code: 'IC4.2',
    title: 'Internal Communication',
    description: 'The entity internally communicates information necessary to support the functioning of internal control over financial reporting.',
    section: 'Information and Communication',
    category: 'Communication',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Medium',
    tags: ['COSO', 'ICFR', 'Communication', 'Internal'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ic-3',
    code: 'IC4.3',
    title: 'External Communication',
    description: 'The entity communicates with external parties regarding matters affecting the functioning of internal control over financial reporting.',
    section: 'Information and Communication',
    category: 'Communication',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Medium',
    tags: ['COSO', 'ICFR', 'Communication', 'External'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ic-4',
    code: 'IC4.4',
    title: 'Financial Reporting Communication Channels',
    description: 'The entity establishes communication channels for reporting financial information and control deficiencies.',
    section: 'Information and Communication',
    category: 'Communication',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'Channels', 'Reporting'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ic-5',
    code: 'IC4.5',
    title: 'Information System Controls',
    description: 'The entity implements controls over information systems that support financial reporting.',
    section: 'Information and Communication',
    category: 'Technology',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'Systems', 'IT'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ic-6',
    code: 'IC4.6',
    title: 'Data Integrity',
    description: 'The entity ensures the integrity of financial data throughout processing and reporting.',
    section: 'Information and Communication',
    category: 'Information Management',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['COSO', 'ICFR', 'Integrity', 'Data'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },

  // ============================================================================
  // MONITORING ACTIVITIES (6 requirements)
  // ============================================================================
  {
    id: 'soc1-req-ma-1',
    code: 'MA5.1',
    title: 'Ongoing and Periodic Evaluations',
    description: 'The entity selects, develops, and performs ongoing and/or separate evaluations to ascertain whether components of internal control are present and functioning.',
    section: 'Monitoring Activities',
    category: 'Monitoring',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'Monitoring', 'Evaluation'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ma-2',
    code: 'MA5.2',
    title: 'Control Deficiency Evaluation',
    description: 'The entity evaluates and communicates internal control deficiencies in a timely manner to parties responsible for taking corrective action.',
    section: 'Monitoring Activities',
    category: 'Monitoring',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'Deficiencies', 'Remediation'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ma-3',
    code: 'MA5.3',
    title: 'Control Testing',
    description: 'The entity performs testing of controls to verify their operating effectiveness.',
    section: 'Monitoring Activities',
    category: 'Monitoring',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['COSO', 'ICFR', 'Testing', 'Effectiveness'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ma-4',
    code: 'MA5.4',
    title: 'Management Review and Oversight',
    description: 'Management reviews and monitors the effectiveness of internal controls over financial reporting.',
    section: 'Monitoring Activities',
    category: 'Monitoring',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'Management', 'Oversight'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ma-5',
    code: 'MA5.5',
    title: 'Continuous Monitoring',
    description: 'The entity implements continuous monitoring activities to provide timely information on control effectiveness.',
    section: 'Monitoring Activities',
    category: 'Monitoring',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Medium',
    tags: ['COSO', 'ICFR', 'Continuous', 'Monitoring'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'soc1-req-ma-6',
    code: 'MA5.6',
    title: 'Corrective Actions',
    description: 'The entity takes corrective actions to remediate identified control deficiencies in a timely manner.',
    section: 'Monitoring Activities',
    category: 'Monitoring',
    programId: 'pgm-soc1-type2',
    programName: 'SOC 1 Type II',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['COSO', 'ICFR', 'Remediation', 'Actions'],

    owner: 'Chief Financial Officer',

    department: 'Finance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
];

