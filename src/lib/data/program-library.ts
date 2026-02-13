// Program Library - Pre-loaded compliance frameworks and standards
// These are read-only templates that can be imported into "My Programs"

import { ProgramTemplate } from '../types/compliance';
import cbuaeFrameworks from './cbuae-frameworks';
import rbiITGovernance from './rbi-it-governance';
import dpdpITFramework from './dpdp-act-2023';
import oilGasStandards from './oil-gas-standards';

export const programTemplates: ProgramTemplate[] = [
  // ============================================================================
  // CBUAE (Central Bank of UAE) FRAMEWORKS
  // ============================================================================
  ...cbuaeFrameworks,

  // ============================================================================
  // RBI (Reserve Bank of India) FRAMEWORKS
  // ============================================================================
  rbiITGovernance.template,
  {
    id: 'tpl-rbi-csf',
    name: 'RBI Cyber Security Framework',
    description: 'Mandatory cyber security requirements for banks and financial institutions in India',
    longDescription: 'The RBI Cyber Security Framework mandates baseline security controls for banks to protect against cyber threats. It covers areas including SOC operations, incident response, vulnerability management, and security awareness. Banks must implement these controls and report cyber incidents to RBI.',
    tags: ['RBI', 'Regulator', 'India', 'Cyber Security', 'Banking'],
    framework: 'RBI CSF',
    version: '2022',
    category: 'Regulatory',
    requirementCount: 52,
    obligationCount: 12,
    controlCount: 45,
    publisher: 'Reserve Bank of India',
    effectiveDate: '2022-07-01',
    lastUpdated: '2024-03-20',
    popularity: 143,
    keyFeatures: [
      'Security Operations Center (SOC)',
      'Incident Response & Reporting',
      'Vulnerability Assessment & Penetration Testing',
      'Network Security & Segmentation',
      'Security Awareness Training'
    ],
    applicableTo: ['Banks', 'NBFCs', 'Payment Banks', 'India'],
    createdAt: '2022-07-01',
    updatedAt: '2024-03-20'
  },

  // ============================================================================
  // DPDP (Digital Personal Data Protection Act) - INDIA
  // ============================================================================
  dpdpITFramework.template,

  // ============================================================================
  // OIL & GAS INDUSTRY STANDARDS
  // ============================================================================
  ...oilGasStandards.templates,

  // ============================================================================
  // INTERNATIONAL STANDARDS
  // ============================================================================
  {
    id: 'tpl-iso27001',
    name: 'ISO 27001:2022',
    description: 'International standard for information security management systems (ISMS)',
    longDescription: 'ISO/IEC 27001 is the international standard for information security management. It provides a framework for establishing, implementing, maintaining, and continually improving an ISMS. The 2022 version includes updated controls addressing cloud security, threat intelligence, and data protection.',
    tags: ['ISO', 'Standards Body', 'International', 'Information Security'],
    framework: 'ISO 27001',
    version: '2022',
    category: 'Standard',
    requirementCount: 93,
    obligationCount: 0,
    controlCount: 93,
    publisher: 'ISO/IEC',
    effectiveDate: '2022-10-25',
    lastUpdated: '2024-01-15',
    popularity: 312,
    keyFeatures: [
      'Risk-based approach to security',
      '93 controls across 4 themes',
      'Organizational, People, Physical, Technological controls',
      'Certification available',
      'Integration with other ISO standards'
    ],
    applicableTo: ['All Industries', 'International'],
    createdAt: '2022-10-25',
    updatedAt: '2024-01-15'
  },
  {
    id: 'tpl-gdpr',
    name: 'GDPR Compliance Framework',
    description: 'European Union General Data Protection Regulation requirements',
    longDescription: 'The General Data Protection Regulation (GDPR) is the EU comprehensive data protection law. This framework covers data subject rights, lawful processing, consent management, data protection impact assessments, breach notification, and cross-border data transfers.',
    tags: ['EU', 'Regulator', 'European Union', 'Data Privacy', 'GDPR'],
    framework: 'GDPR',
    version: '2018',
    category: 'Regulatory',
    requirementCount: 68,
    obligationCount: 15,
    controlCount: 42,
    publisher: 'European Commission',
    effectiveDate: '2018-05-25',
    lastUpdated: '2024-02-10',
    popularity: 287,
    keyFeatures: [
      'Data Subject Rights Management',
      'Consent & Legal Basis',
      'Data Protection Impact Assessments',
      'Breach Notification (72 hours)',
      'Cross-border Transfer Mechanisms'
    ],
    applicableTo: ['Organizations processing EU resident data', 'European Union', 'International'],
    createdAt: '2018-05-25',
    updatedAt: '2024-02-10'
  },
  {
    id: 'tpl-pdpl',
    name: 'Saudi PDPL Framework',
    description: 'Saudi Arabia Personal Data Protection Law compliance requirements',
    longDescription: 'The Personal Data Protection Law (PDPL) is Saudi Arabia comprehensive data protection regulation enforced by SDAIA. It establishes requirements for processing personal data, data subject rights, cross-border transfers, and data breach notification for organizations operating in the Kingdom.',
    tags: ['SDAIA', 'Regulator', 'Saudi Arabia', 'Data Privacy', 'Middle East'],
    framework: 'PDPL',
    version: '2023',
    category: 'Regulatory',
    requirementCount: 38,
    obligationCount: 8,
    controlCount: 28,
    publisher: 'Saudi Data & AI Authority',
    effectiveDate: '2023-09-14',
    lastUpdated: '2024-04-05',
    popularity: 76,
    keyFeatures: [
      'Personal Data Processing Requirements',
      'Data Subject Rights',
      'Cross-border Transfer Rules',
      'Data Breach Notification',
      'Privacy Impact Assessments'
    ],
    applicableTo: ['Organizations in Saudi Arabia', 'Organizations processing Saudi resident data', 'Middle East'],
    createdAt: '2023-09-14',
    updatedAt: '2024-04-05'
  },
  {
    id: 'tpl-nist-csf',
    name: 'NIST Cybersecurity Framework',
    description: 'US National Institute of Standards framework for managing cybersecurity risk',
    longDescription: 'The NIST Cybersecurity Framework provides a policy framework of computer security guidance for organizations to assess and improve their ability to prevent, detect, and respond to cyber attacks. It organizes cybersecurity activities into five core functions: Identify, Protect, Detect, Respond, and Recover.',
    tags: ['NIST', 'Standards Body', 'USA', 'Cyber Security'],
    framework: 'NIST CSF',
    version: '2.0',
    category: 'Framework',
    requirementCount: 108,
    obligationCount: 0,
    controlCount: 108,
    publisher: 'NIST',
    effectiveDate: '2024-02-26',
    lastUpdated: '2024-03-01',
    popularity: 245,
    keyFeatures: [
      'Five Core Functions: Identify, Protect, Detect, Respond, Recover',
      'Governance function added in 2.0',
      'Supply chain risk management',
      'Flexible implementation tiers',
      'Industry-agnostic approach'
    ],
    applicableTo: ['Critical Infrastructure', 'All Industries', 'USA', 'International'],
    createdAt: '2024-02-26',
    updatedAt: '2024-03-01'
  },
  {
    id: 'tpl-pci-dss',
    name: 'PCI DSS v4.0',
    description: 'Payment Card Industry Data Security Standard for card payment processing',
    longDescription: 'PCI DSS is a global security standard for organizations that handle credit card data. Version 4.0 introduces a customized approach for meeting requirements and places greater emphasis on continuous security processes. It covers network security, access control, encryption, and security testing.',
    tags: ['PCI', 'Industry', 'International', 'Payment Security'],
    framework: 'PCI DSS',
    version: '4.0',
    category: 'Industry',
    requirementCount: 64,
    obligationCount: 4,
    controlCount: 250,
    publisher: 'PCI Security Standards Council',
    effectiveDate: '2024-03-31',
    lastUpdated: '2024-04-15',
    popularity: 198,
    keyFeatures: [
      'Customized approach for compliance',
      'Enhanced authentication requirements',
      'Expanded encryption requirements',
      'Targeted risk analysis',
      'Continuous compliance monitoring'
    ],
    applicableTo: ['Payment Processors', 'Merchants', 'Service Providers', 'Financial Services'],
    createdAt: '2024-03-31',
    updatedAt: '2024-04-15'
  },
  {
    id: 'tpl-sox',
    name: 'SOX IT Controls Framework',
    description: 'Sarbanes-Oxley Act IT general controls and application controls',
    longDescription: 'The SOX IT Controls Framework covers IT general controls (ITGCs) and IT application controls required for SOX compliance. It addresses access management, change management, computer operations, and application controls that support the integrity of financial reporting systems.',
    tags: ['SEC', 'Regulator', 'USA', 'Financial Controls', 'SOX'],
    framework: 'SOX',
    version: '2023',
    category: 'Regulatory',
    requirementCount: 42,
    obligationCount: 6,
    controlCount: 58,
    publisher: 'PCAOB / SEC',
    effectiveDate: '2002-07-30',
    lastUpdated: '2024-01-20',
    popularity: 167,
    keyFeatures: [
      'IT General Controls (ITGCs)',
      'Application Controls',
      'Access Management',
      'Change Management',
      'Computer Operations'
    ],
    applicableTo: ['Public Companies', 'USA', 'Financial Services'],
    createdAt: '2002-07-30',
    updatedAt: '2024-01-20'
  },
];

