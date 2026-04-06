// ISO 27701:2025 Requirements - Privacy Information Management System (PIMS)
// Extension to ISO 27001 for Privacy Management
// Total: 50 requirements across PIMS-specific clauses

import { RequirementCitation } from '../types/compliance';

export const iso27701Requirements: RequirementCitation[] = [
  // ============================================================================
  // CLAUSE 5: PIMS-SPECIFIC REQUIREMENTS RELATED TO ISO 27001 (8 requirements)
  // ============================================================================
  {
    id: 'iso27701-req-5-1',
    code: 'PIMS-5.1',
    title: 'Understanding the Organization and Its Context for Privacy',
    description: 'The organization shall determine external and internal issues relevant to its purpose and that affect its ability to achieve intended outcomes of the PIMS.',
    section: 'Clause 5: PIMS Requirements (ISO 27001)',
    category: 'Context',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['PIMS', 'Privacy', 'Context', 'ISO 27001'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-5-2',
    code: 'PIMS-5.2',
    title: 'Understanding Privacy Needs and Expectations',
    description: 'The organization shall determine interested parties relevant to the PIMS and their privacy requirements and expectations.',
    section: 'Clause 5: PIMS Requirements (ISO 27001)',
    category: 'Stakeholders',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['PIMS', 'Privacy', 'Stakeholders', 'Requirements'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-5-3',
    code: 'PIMS-5.3',
    title: 'Determining PIMS Scope',
    description: 'The organization shall determine the boundaries and applicability of the PIMS to establish its scope, considering PII processing activities.',
    section: 'Clause 5: PIMS Requirements (ISO 27001)',
    category: 'Scope',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Privacy', 'Scope', 'PII'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-5-4',
    code: 'PIMS-5.4',
    title: 'Privacy Leadership and Commitment',
    description: 'Top management shall demonstrate leadership and commitment with respect to the PIMS by establishing privacy policies and ensuring integration with business processes.',
    section: 'Clause 5: PIMS Requirements (ISO 27001)',
    category: 'Leadership',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['PIMS', 'Privacy', 'Leadership', 'Governance'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-5-5',
    code: 'PIMS-5.5',
    title: 'Privacy Policy',
    description: 'Top management shall establish a privacy policy that is appropriate to the purpose of the organization and includes commitments to satisfy applicable privacy requirements.',
    section: 'Clause 5: PIMS Requirements (ISO 27001)',
    category: 'Policy',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Privacy', 'Policy', 'Compliance'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-5-6',
    code: 'PIMS-5.6',
    title: 'Privacy Roles and Responsibilities',
    description: 'Top management shall ensure that responsibilities and authorities for roles relevant to privacy are assigned and communicated.',
    section: 'Clause 5: PIMS Requirements (ISO 27001)',
    category: 'Roles',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['PIMS', 'Privacy', 'Roles', 'Responsibilities'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-5-7',
    code: 'PIMS-5.7',
    title: 'Privacy Risk Assessment',
    description: 'The organization shall establish and maintain a process for privacy risk assessment that identifies risks to PII principals.',
    section: 'Clause 5: PIMS Requirements (ISO 27001)',
    category: 'Risk Management',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Privacy', 'Risk', 'Assessment'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-5-8',
    code: 'PIMS-5.8',
    title: 'Privacy Objectives and Planning',
    description: 'The organization shall establish privacy objectives at relevant functions and levels and plan how to achieve them.',
    section: 'Clause 5: PIMS Requirements (ISO 27001)',
    category: 'Planning',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['PIMS', 'Privacy', 'Objectives', 'Planning'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },

  // ============================================================================
  // CLAUSE 6: PIMS-SPECIFIC GUIDANCE RELATED TO ISO 27002 (12 requirements)
  // ============================================================================
  {
    id: 'iso27701-req-6-1',
    code: 'PIMS-6.1',
    title: 'Conditions for Collection and Processing',
    description: 'The organization shall identify and document the legal, statutory, regulatory and contractual requirements for PII collection and processing.',
    section: 'Clause 6: PIMS Guidance (ISO 27002)',
    category: 'Legal Compliance',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Privacy', 'Legal', 'Processing'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-6-2',
    code: 'PIMS-6.2',
    title: 'Privacy and PII Protection Policy',
    description: 'A privacy and PII protection policy shall be approved by management, published and communicated to all relevant personnel and interested parties.',
    section: 'Clause 6: PIMS Guidance (ISO 27002)',
    category: 'Policy',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Privacy', 'Policy', 'Communication'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-6-3',
    code: 'PIMS-6.3',
    title: 'Allocation of Privacy Responsibilities',
    description: 'All privacy and PII protection responsibilities shall be defined and allocated.',
    section: 'Clause 6: PIMS Guidance (ISO 27002)',
    category: 'Roles',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['PIMS', 'Privacy', 'Responsibilities', 'Roles'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-6-4',
    code: 'PIMS-6.4',
    title: 'Privacy by Design and by Default',
    description: 'Privacy by design and by default shall be implemented in the development of business processes and information systems.',
    section: 'Clause 6: PIMS Guidance (ISO 27002)',
    category: 'Design',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['PIMS', 'Privacy', 'Design', 'Default'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-6-5',
    code: 'PIMS-6.5',
    title: 'PII Inventory',
    description: 'The organization shall establish and maintain an inventory of PII and its processing purposes.',
    section: 'Clause 6: PIMS Guidance (ISO 27002)',
    category: 'Data Management',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Privacy', 'Inventory', 'PII'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-6-6',
    code: 'PIMS-6.6',
    title: 'Records of PII Processing Activities',
    description: 'Records of PII processing activities shall be established and maintained.',
    section: 'Clause 6: PIMS Guidance (ISO 27002)',
    category: 'Documentation',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Privacy', 'Records', 'Processing'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-6-7',
    code: 'PIMS-6.7',
    title: 'Lawfulness of Processing',
    description: 'The organization shall ensure that PII is processed lawfully and fairly.',
    section: 'Clause 6: PIMS Guidance (ISO 27002)',
    category: 'Legal Compliance',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Privacy', 'Lawfulness', 'Processing'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-6-8',
    code: 'PIMS-6.8',
    title: 'Consent Management',
    description: 'Where consent is the legal basis for processing, the organization shall obtain, record, and manage consent appropriately.',
    section: 'Clause 6: PIMS Guidance (ISO 27002)',
    category: 'Consent',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Privacy', 'Consent', 'Management'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-6-9',
    code: 'PIMS-6.9',
    title: 'Purpose Limitation',
    description: 'PII shall be collected for specified, explicit and legitimate purposes and not further processed in a manner incompatible with those purposes.',
    section: 'Clause 6: PIMS Guidance (ISO 27002)',
    category: 'Data Minimization',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Privacy', 'Purpose', 'Limitation'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-6-10',
    code: 'PIMS-6.10',
    title: 'Data Minimization',
    description: 'PII shall be adequate, relevant and limited to what is necessary in relation to the purposes for which it is processed.',
    section: 'Clause 6: PIMS Guidance (ISO 27002)',
    category: 'Data Minimization',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['PIMS', 'Privacy', 'Minimization', 'Data'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-6-11',
    code: 'PIMS-6.11',
    title: 'Accuracy and Quality',
    description: 'PII shall be accurate and, where necessary, kept up to date. Reasonable steps shall be taken to ensure inaccurate PII is erased or rectified.',
    section: 'Clause 6: PIMS Guidance (ISO 27002)',
    category: 'Data Quality',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['PIMS', 'Privacy', 'Accuracy', 'Quality'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-6-12',
    code: 'PIMS-6.12',
    title: 'Storage Limitation',
    description: 'PII shall be kept in a form which permits identification of PII principals for no longer than necessary for the purposes for which the PII is processed.',
    section: 'Clause 6: PIMS Guidance (ISO 27002)',
    category: 'Data Retention',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['PIMS', 'Privacy', 'Retention', 'Storage'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },

  // ============================================================================
  // CLAUSE 7: PII CONTROLLERS (15 requirements)
  // ============================================================================
  {
    id: 'iso27701-req-7-1',
    code: 'CTRL-7.1',
    title: 'Identify and Document Purpose',
    description: 'The organization acting as PII controller shall identify and document the specific purposes for which PII is collected and processed.',
    section: 'Clause 7: PII Controllers',
    category: 'Purpose',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Controller', 'Purpose', 'Documentation'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-7-2',
    code: 'CTRL-7.2',
    title: 'Identify Lawful Basis',
    description: 'The PII controller shall identify and document the lawful basis for PII processing activities.',
    section: 'Clause 7: PII Controllers',
    category: 'Legal Basis',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Controller', 'Legal', 'Basis'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-7-3',
    code: 'CTRL-7.3',
    title: 'Obtain and Record Consent',
    description: 'Where consent is required, the PII controller shall obtain and record consent from PII principals.',
    section: 'Clause 7: PII Controllers',
    category: 'Consent',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Controller', 'Consent', 'Records'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-7-4',
    code: 'CTRL-7.4',
    title: 'Provide Privacy Notice',
    description: 'The PII controller shall provide PII principals with clear and accessible privacy notices.',
    section: 'Clause 7: PII Controllers',
    category: 'Transparency',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Controller', 'Notice', 'Transparency'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-7-5',
    code: 'CTRL-7.5',
    title: 'PII Principal Rights',
    description: 'The PII controller shall provide mechanisms for PII principals to exercise their rights (access, rectification, erasure, restriction, portability, objection).',
    section: 'Clause 7: PII Controllers',
    category: 'Rights',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Controller', 'Rights', 'DSAR'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-7-6',
    code: 'CTRL-7.6',
    title: 'Obligations to PII Principals',
    description: 'The PII controller shall fulfill obligations to PII principals regarding their PII.',
    section: 'Clause 7: PII Controllers',
    category: 'Obligations',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['PIMS', 'Controller', 'Obligations', 'Principals'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-7-7',
    code: 'CTRL-7.7',
    title: 'Privacy Impact Assessment',
    description: 'The PII controller shall conduct privacy impact assessments for high-risk processing activities.',
    section: 'Clause 7: PII Controllers',
    category: 'Assessment',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Controller', 'PIA', 'DPIA'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-7-8',
    code: 'CTRL-7.8',
    title: 'Contracts with PII Processors',
    description: 'The PII controller shall ensure contracts with PII processors include appropriate privacy and security provisions.',
    section: 'Clause 7: PII Controllers',
    category: 'Contracts',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Controller', 'Contracts', 'Processors'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-7-9',
    code: 'CTRL-7.9',
    title: 'International Transfers',
    description: 'The PII controller shall ensure appropriate safeguards for international transfers of PII.',
    section: 'Clause 7: PII Controllers',
    category: 'Transfers',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Controller', 'Transfers', 'International'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-7-10',
    code: 'CTRL-7.10',
    title: 'Breach Notification',
    description: 'The PII controller shall establish procedures for detecting, reporting, and investigating privacy breaches.',
    section: 'Clause 7: PII Controllers',
    category: 'Incident Response',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Controller', 'Breach', 'Notification'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-7-11',
    code: 'CTRL-7.11',
    title: 'Data Protection Officer',
    description: 'Where required, the PII controller shall designate a data protection officer with appropriate expertise.',
    section: 'Clause 7: PII Controllers',
    category: 'Governance',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['PIMS', 'Controller', 'DPO', 'Governance'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-7-12',
    code: 'CTRL-7.12',
    title: 'Marketing and Profiling',
    description: 'The PII controller shall implement controls for marketing, profiling, and automated decision-making activities.',
    section: 'Clause 7: PII Controllers',
    category: 'Processing',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['PIMS', 'Controller', 'Marketing', 'Profiling'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-7-13',
    code: 'CTRL-7.13',
    title: 'Publicly Available PII',
    description: 'The PII controller shall implement controls for processing publicly available PII.',
    section: 'Clause 7: PII Controllers',
    category: 'Processing',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Medium',
    tags: ['PIMS', 'Controller', 'Public', 'PII'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-7-14',
    code: 'CTRL-7.14',
    title: 'Privacy Monitoring and Review',
    description: 'The PII controller shall monitor, review, and audit privacy controls and processing activities.',
    section: 'Clause 7: PII Controllers',
    category: 'Monitoring',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['PIMS', 'Controller', 'Monitoring', 'Audit'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-7-15',
    code: 'CTRL-7.15',
    title: 'Disposal and Destruction',
    description: 'The PII controller shall ensure secure disposal and destruction of PII when no longer needed.',
    section: 'Clause 7: PII Controllers',
    category: 'Disposal',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['PIMS', 'Controller', 'Disposal', 'Destruction'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },

  // ============================================================================
  // CLAUSE 8: PII PROCESSORS (15 requirements)
  // ============================================================================
  {
    id: 'iso27701-req-8-1',
    code: 'PROC-8.1',
    title: 'Processor Obligations',
    description: 'The PII processor shall process PII only on documented instructions from the PII controller.',
    section: 'Clause 8: PII Processors',
    category: 'Obligations',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Processor', 'Obligations', 'Instructions'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-8-2',
    code: 'PROC-8.2',
    title: 'Confidentiality of Processing',
    description: 'The PII processor shall ensure that persons authorized to process PII have committed to confidentiality.',
    section: 'Clause 8: PII Processors',
    category: 'Confidentiality',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Processor', 'Confidentiality', 'Personnel'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-8-3',
    code: 'PROC-8.3',
    title: 'Security of Processing',
    description: 'The PII processor shall implement appropriate technical and organizational measures to ensure security of PII processing.',
    section: 'Clause 8: PII Processors',
    category: 'Security',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Processor', 'Security', 'Controls'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-8-4',
    code: 'PROC-8.4',
    title: 'Sub-Processor Management',
    description: 'The PII processor shall not engage another processor (sub-processor) without prior authorization from the PII controller.',
    section: 'Clause 8: PII Processors',
    category: 'Third-Party',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Processor', 'Sub-Processor', 'Authorization'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-8-5',
    code: 'PROC-8.5',
    title: 'Assistance to Controller',
    description: 'The PII processor shall assist the PII controller in fulfilling obligations to PII principals.',
    section: 'Clause 8: PII Processors',
    category: 'Support',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['PIMS', 'Processor', 'Assistance', 'Support'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-8-6',
    code: 'PROC-8.6',
    title: 'Deletion or Return of PII',
    description: 'The PII processor shall delete or return all PII to the controller after the end of provision of services.',
    section: 'Clause 8: PII Processors',
    category: 'Data Lifecycle',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['PIMS', 'Processor', 'Deletion', 'Return'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-8-7',
    code: 'PROC-8.7',
    title: 'Demonstration of Compliance',
    description: 'The PII processor shall make available to the controller all information necessary to demonstrate compliance with obligations.',
    section: 'Clause 8: PII Processors',
    category: 'Compliance',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['PIMS', 'Processor', 'Compliance', 'Audit'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-8-8',
    code: 'PROC-8.8',
    title: 'Processor Breach Notification',
    description: 'The PII processor shall notify the controller without undue delay after becoming aware of a PII breach.',
    section: 'Clause 8: PII Processors',
    category: 'Incident Response',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Processor', 'Breach', 'Notification'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-8-9',
    code: 'PROC-8.9',
    title: 'Processing Records',
    description: 'The PII processor shall maintain records of all categories of processing activities carried out on behalf of controllers.',
    section: 'Clause 8: PII Processors',
    category: 'Documentation',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['PIMS', 'Processor', 'Records', 'Documentation'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-8-10',
    code: 'PROC-8.10',
    title: 'Cooperation with Authorities',
    description: 'The PII processor shall cooperate with supervisory authorities in the performance of their tasks.',
    section: 'Clause 8: PII Processors',
    category: 'Regulatory',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['PIMS', 'Processor', 'Authorities', 'Cooperation'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-8-11',
    code: 'PROC-8.11',
    title: 'Data Protection Impact Assessment Support',
    description: 'The PII processor shall assist the controller in ensuring compliance with data protection impact assessment obligations.',
    section: 'Clause 8: PII Processors',
    category: 'Assessment',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Medium',
    tags: ['PIMS', 'Processor', 'DPIA', 'Support'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-8-12',
    code: 'PROC-8.12',
    title: 'Processor Security Measures',
    description: 'The PII processor shall implement security measures including encryption, pseudonymization, and access controls.',
    section: 'Clause 8: PII Processors',
    category: 'Security',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Processor', 'Encryption', 'Security'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-8-13',
    code: 'PROC-8.13',
    title: 'Testing and Monitoring',
    description: 'The PII processor shall regularly test, assess, and evaluate the effectiveness of technical and organizational measures.',
    section: 'Clause 8: PII Processors',
    category: 'Monitoring',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['PIMS', 'Processor', 'Testing', 'Monitoring'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-8-14',
    code: 'PROC-8.14',
    title: 'Audit Rights',
    description: 'The PII processor shall allow for and contribute to audits conducted by the controller or an auditor mandated by the controller.',
    section: 'Clause 8: PII Processors',
    category: 'Audit',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'High',
    tags: ['PIMS', 'Processor', 'Audit', 'Rights'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
  {
    id: 'iso27701-req-8-15',
    code: 'PROC-8.15',
    title: 'International Transfer Safeguards',
    description: 'The PII processor shall implement appropriate safeguards for international transfers of PII as instructed by the controller.',
    section: 'Clause 8: PII Processors',
    category: 'Transfers',
    programId: 'pgm-iso27701',
    programName: 'ISO 27701 PIMS',
    status: 'Not Assessed',
    complianceScore: 0,
    controlCount: 0,
    riskRating: 'Critical',
    tags: ['PIMS', 'Processor', 'Transfers', 'International'],

    owner: 'Data Protection Officer',

    department: 'Privacy & Compliance',

    lastReviewDate: '2026-01-15',

    nextReviewDate: '2027-01-15',

    createdAt: '2025-08-01',

    updatedAt: '2026-02-15',
  },
];

