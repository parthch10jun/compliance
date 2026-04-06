import { Risk, RiskControlLink, RiskRequirementLink, RiskObligationLink, calculateRiskScore, getRiskRating, calculateRiskReduction } from '../types/compliance';
import { e2eRisks } from './end-to-end-workflows';

/**
 * RISKS - Mock data for risk register
 */
export const risks: Risk[] = [
  {
    id: 'risk-001',
    code: 'RISK-001',
    title: 'Customer Data Breach',
    riskStatement: 'Unauthorized access to customer PII database leading to data breach and regulatory penalties',
    category: 'Data Security',
    owner: 'Jane Doe',
    department: 'Information Security',
    
    // Inherent Risk (before controls)
    inherentLikelihood: 5,
    inherentImpact: 5,
    inherentScore: 25,
    inherentRating: 'Critical',
    
    // Residual Risk (after controls)
    residualLikelihood: 2,
    residualImpact: 3,
    residualScore: 6,
    residualRating: 'Medium',
    
    // Risk Reduction
    riskReduction: 76,
    
    // Relationships
    linkedRequirementIds: ['req-001', 'req-002'],
    linkedObligationIds: ['obl-002', 'obl-003'],
    linkedControlIds: ['ctrl-001', 'ctrl-002', 'ctrl-003'],
    
    // Metadata
    status: 'Monitoring',
    lastAssessmentDate: '2024-12-15',
    nextReviewDate: '2025-03-15',
    createdAt: '2024-01-10',
    updatedAt: '2024-12-15'
  },
  {
    id: 'risk-002',
    code: 'RISK-002',
    title: 'Ransomware Attack',
    riskStatement: 'Ransomware attack encrypts critical systems and data, causing operational disruption and financial loss',
    category: 'Cyber Security',
    owner: 'Jane Doe',
    department: 'Information Security',
    
    inherentLikelihood: 4,
    inherentImpact: 5,
    inherentScore: 20,
    inherentRating: 'Critical',
    
    residualLikelihood: 2,
    residualImpact: 4,
    residualScore: 8,
    residualRating: 'High',
    
    riskReduction: 60,
    
    linkedRequirementIds: ['req-002', 'req-006'],
    linkedObligationIds: ['obl-002'],
    linkedControlIds: ['ctrl-002', 'ctrl-004', 'ctrl-005', 'ctrl-006', 'ctrl-007'],
    
    status: 'Active',
    lastAssessmentDate: '2024-12-10',
    nextReviewDate: '2025-03-10',
    createdAt: '2024-01-15',
    updatedAt: '2024-12-10'
  },
  {
    id: 'risk-003',
    code: 'RISK-003',
    title: 'Third-Party Vendor Failure',
    riskStatement: 'Critical third-party vendor fails to deliver services, impacting business operations',
    category: 'Operational',
    owner: 'Michael Chen',
    department: 'Operations',
    
    inherentLikelihood: 3,
    inherentImpact: 4,
    inherentScore: 12,
    inherentRating: 'High',
    
    residualLikelihood: 2,
    residualImpact: 2,
    residualScore: 4,
    residualRating: 'Medium',
    
    riskReduction: 67,
    
    linkedRequirementIds: ['req-003'],
    linkedObligationIds: [],
    linkedControlIds: ['ctrl-008', 'ctrl-009'],
    
    status: 'Monitoring',
    lastAssessmentDate: '2024-11-20',
    nextReviewDate: '2025-02-20',
    createdAt: '2024-02-01',
    updatedAt: '2024-11-20'
  },
  {
    id: 'risk-004',
    code: 'RISK-004',
    title: 'Regulatory Non-Compliance',
    riskStatement: 'Failure to comply with GDPR requirements leading to fines and reputational damage',
    category: 'Compliance',
    owner: 'Sarah Johnson',
    department: 'Legal',
    
    inherentLikelihood: 3,
    inherentImpact: 5,
    inherentScore: 15,
    inherentRating: 'Critical',
    
    residualLikelihood: 2,
    residualImpact: 3,
    residualScore: 6,
    residualRating: 'Medium',
    
    riskReduction: 60,
    
    linkedRequirementIds: ['req-004', 'req-005'],
    linkedObligationIds: ['obl-003', 'obl-004'],
    linkedControlIds: ['ctrl-010', 'ctrl-011', 'ctrl-012'],
    
    status: 'Monitoring',
    lastAssessmentDate: '2024-12-01',
    nextReviewDate: '2025-03-01',
    createdAt: '2024-02-15',
    updatedAt: '2024-12-01'
  },
  {
    id: 'risk-005',
    code: 'RISK-005',
    title: 'Insider Threat - Data Theft',
    riskStatement: 'Malicious insider exfiltrates sensitive customer data for personal gain',
    category: 'Data Security',
    owner: 'Jane Doe',
    department: 'Information Security',
    
    inherentLikelihood: 4,
    inherentImpact: 4,
    inherentScore: 16,
    inherentRating: 'Critical',
    
    residualLikelihood: 2,
    residualImpact: 2,
    residualScore: 4,
    residualRating: 'Medium',
    
    riskReduction: 75,
    
    linkedRequirementIds: ['req-001', 'req-002'],
    linkedObligationIds: ['obl-002'],
    linkedControlIds: ['ctrl-001', 'ctrl-002', 'ctrl-013'],
    
    status: 'Monitoring',
    lastAssessmentDate: '2024-11-25',
    nextReviewDate: '2025-02-25',
    createdAt: '2024-03-01',
    updatedAt: '2024-11-25'
  },
  // End-to-End Workflow Risks
  ...e2eRisks, // Adds 3 end-to-end risks (SOC 2 CC6.1, SOC 1 CE-1, ISO 27701 PIMS-5.5)
];

/**
 * RISK CONTROL LINKS - How controls mitigate risks
 */
export const riskControlLinks: RiskControlLink[] = [
  // RISK-001: Customer Data Breach
  {
    riskId: 'risk-001',
    controlId: 'ctrl-001',
    controlEffectiveness: 'Largely Effective',
    effectivenessScore: 3,
    isKeyControl: true,
    likelihoodReduction: 5,
    impactReduction: 2,
    linkedAt: '2024-01-10',
    linkedBy: 'jane.doe@example.com',
    notes: 'MFA significantly reduces likelihood of unauthorized access'
  },
  {
    riskId: 'risk-001',
    controlId: 'ctrl-002',
    controlEffectiveness: 'Largely Effective',
    effectivenessScore: 3,
    isKeyControl: true,
    likelihoodReduction: undefined,
    impactReduction: 2,
    linkedAt: '2024-01-10',
    linkedBy: 'jane.doe@example.com',
    notes: 'Encryption reduces impact of data breach'
  },
  {
    riskId: 'risk-001',
    controlId: 'ctrl-003',
    controlEffectiveness: 'Partially Effective',
    effectivenessScore: 2,
    isKeyControl: false,
    likelihoodReduction: 3,
    impactReduction: undefined,
    linkedAt: '2024-01-10',
    linkedBy: 'jane.doe@example.com',
    notes: 'SIEM monitoring helps detect breaches early'
  },
  
  // RISK-002: Ransomware Attack
  {
    riskId: 'risk-002',
    controlId: 'ctrl-002',
    controlEffectiveness: 'Largely Effective',
    effectivenessScore: 3,
    isKeyControl: true,
    likelihoodReduction: undefined,
    impactReduction: 4,
    linkedAt: '2024-01-15',
    linkedBy: 'jane.doe@example.com',
    notes: 'Encryption limits ransomware impact'
  },
  {
    riskId: 'risk-002',
    controlId: 'ctrl-004',
    controlEffectiveness: 'Fully Effective',
    effectivenessScore: 4,
    isKeyControl: true,
    likelihoodReduction: undefined,
    impactReduction: 2,
    linkedAt: '2024-01-15',
    linkedBy: 'jane.doe@example.com',
    notes: 'Regular backups enable recovery'
  },
  {
    riskId: 'risk-002',
    controlId: 'ctrl-005',
    controlEffectiveness: 'Largely Effective',
    effectivenessScore: 3,
    isKeyControl: false,
    likelihoodReduction: 4,
    impactReduction: undefined,
    linkedAt: '2024-01-15',
    linkedBy: 'jane.doe@example.com',
    notes: 'Endpoint protection prevents ransomware execution'
  },
  {
    riskId: 'risk-002',
    controlId: 'ctrl-006',
    controlEffectiveness: 'Partially Effective',
    effectivenessScore: 2,
    isKeyControl: false,
    likelihoodReduction: 2,
    impactReduction: undefined,
    linkedAt: '2024-01-15',
    linkedBy: 'jane.doe@example.com',
    notes: 'Incident response plan helps contain attacks'
  },
  {
    riskId: 'risk-002',
    controlId: 'ctrl-007',
    controlEffectiveness: 'Largely Effective',
    effectivenessScore: 3,
    isKeyControl: false,
    likelihoodReduction: 3,
    impactReduction: undefined,
    linkedAt: '2024-01-15',
    linkedBy: 'jane.doe@example.com',
    notes: 'Security awareness training reduces phishing success'
  },

  // RISK-003: Third-Party Vendor Failure
  {
    riskId: 'risk-003',
    controlId: 'ctrl-008',
    controlEffectiveness: 'Largely Effective',
    effectivenessScore: 3,
    isKeyControl: true,
    likelihoodReduction: 3,
    impactReduction: 2,
    linkedAt: '2024-02-01',
    linkedBy: 'michael.chen@example.com',
    notes: 'Vendor risk assessment identifies critical dependencies'
  },
  {
    riskId: 'risk-003',
    controlId: 'ctrl-009',
    controlEffectiveness: 'Fully Effective',
    effectivenessScore: 4,
    isKeyControl: true,
    likelihoodReduction: undefined,
    impactReduction: 3,
    linkedAt: '2024-02-01',
    linkedBy: 'michael.chen@example.com',
    notes: 'Vendor SLA monitoring ensures service levels'
  },

  // RISK-004: Regulatory Non-Compliance
  {
    riskId: 'risk-004',
    controlId: 'ctrl-010',
    controlEffectiveness: 'Largely Effective',
    effectivenessScore: 3,
    isKeyControl: true,
    likelihoodReduction: 3,
    impactReduction: 3,
    linkedAt: '2024-02-15',
    linkedBy: 'sarah.johnson@example.com',
    notes: 'Privacy policy ensures GDPR compliance'
  },
  {
    riskId: 'risk-004',
    controlId: 'ctrl-011',
    controlEffectiveness: 'Largely Effective',
    effectivenessScore: 3,
    isKeyControl: true,
    likelihoodReduction: 2,
    impactReduction: 2,
    linkedAt: '2024-02-15',
    linkedBy: 'sarah.johnson@example.com',
    notes: 'Data subject rights process addresses GDPR requirements'
  },
  {
    riskId: 'risk-004',
    controlId: 'ctrl-012',
    controlEffectiveness: 'Partially Effective',
    effectivenessScore: 2,
    isKeyControl: false,
    likelihoodReduction: 2,
    impactReduction: undefined,
    linkedAt: '2024-02-15',
    linkedBy: 'sarah.johnson@example.com',
    notes: 'Consent management tracks user preferences'
  },

  // RISK-005: Insider Threat - Data Theft
  {
    riskId: 'risk-005',
    controlId: 'ctrl-001',
    controlEffectiveness: 'Largely Effective',
    effectivenessScore: 3,
    isKeyControl: true,
    likelihoodReduction: 4,
    impactReduction: undefined,
    linkedAt: '2024-03-01',
    linkedBy: 'jane.doe@example.com',
    notes: 'MFA prevents unauthorized access by insiders'
  },
  {
    riskId: 'risk-005',
    controlId: 'ctrl-002',
    controlEffectiveness: 'Largely Effective',
    effectivenessScore: 3,
    isKeyControl: true,
    likelihoodReduction: undefined,
    impactReduction: 3,
    linkedAt: '2024-03-01',
    linkedBy: 'jane.doe@example.com',
    notes: 'Encryption limits data exfiltration impact'
  },
  {
    riskId: 'risk-005',
    controlId: 'ctrl-013',
    controlEffectiveness: 'Fully Effective',
    effectivenessScore: 4,
    isKeyControl: true,
    likelihoodReduction: 3,
    impactReduction: 2,
    linkedAt: '2024-03-01',
    linkedBy: 'jane.doe@example.com',
    notes: 'User activity monitoring detects suspicious behavior'
  },
];

/**
 * RISK REQUIREMENT LINKS
 */
export const riskRequirementLinks: RiskRequirementLink[] = [
  {
    riskId: 'risk-001',
    requirementId: 'req-001',
    relationshipType: 'Addresses',
    linkedAt: '2024-01-10',
    linkedBy: 'jane.doe@example.com',
    notes: 'MFA requirement directly addresses unauthorized access risk'
  },
  {
    riskId: 'risk-001',
    requirementId: 'req-002',
    relationshipType: 'Mitigates',
    linkedAt: '2024-01-10',
    linkedBy: 'jane.doe@example.com',
    notes: 'Encryption requirement mitigates data breach impact'
  },
  {
    riskId: 'risk-004',
    requirementId: 'req-004',
    relationshipType: 'Addresses',
    linkedAt: '2024-02-15',
    linkedBy: 'sarah.johnson@example.com',
    notes: 'Data subject rights process addresses GDPR compliance risk'
  },
];

/**
 * RISK OBLIGATION LINKS
 */
export const riskObligationLinks: RiskObligationLink[] = [
  {
    riskId: 'risk-001',
    obligationId: 'obl-002',
    relationshipType: 'Monitors',
    linkedAt: '2024-01-10',
    linkedBy: 'jane.doe@example.com',
    notes: 'Breach notification obligation monitors this risk'
  },
  {
    riskId: 'risk-001',
    obligationId: 'obl-003',
    relationshipType: 'Monitors',
    linkedAt: '2024-01-10',
    linkedBy: 'jane.doe@example.com',
    notes: 'GDPR breach notification obligation'
  },
  {
    riskId: 'risk-004',
    obligationId: 'obl-003',
    relationshipType: 'Addresses',
    linkedAt: '2024-02-15',
    linkedBy: 'sarah.johnson@example.com',
    notes: 'Breach notification addresses compliance risk'
  },
  {
    riskId: 'risk-004',
    obligationId: 'obl-004',
    relationshipType: 'Monitors',
    linkedAt: '2024-02-15',
    linkedBy: 'sarah.johnson@example.com',
    notes: 'Annual DPIA monitors compliance risk'
  },
];

