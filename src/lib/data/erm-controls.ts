// ERM Treatment & Controls Management Module
// Requirements: RM_TR_01 through RM_TR_23

export interface ERMControl {
  id: string;
  name: string;
  description: string;
  type: 'Preventive' | 'Detective' | 'Corrective' | 'Directive';
  category: 'Avoid' | 'Prevent' | 'Detect' | 'Mitigate' | 'Transfer' | 'Accept';
  
  // Ownership & Assignment
  owner: string;
  monitor?: string; // RM_TR_14
  contactInfo?: string;
  
  // Effectiveness (RM_TR_04, RM_TR_05)
  effectivenessQualitative: 'Very Effective' | 'Effective' | 'Moderately Effective' | 'Ineffective' | 'Not Assessed';
  effectivenessQuantitative?: number; // 0-100%
  effectivenessRationale?: string;
  
  // Cost (RM_TR_08, RM_TR_23)
  costQualitative?: 'Low' | 'Medium' | 'High' | 'Very High';
  costQuantitative?: number;
  costCurrency?: string;
  costAssumptions?: string;
  
  // Treatment Effects (RM_TR_09)
  likelihoodReduction?: number; // 0-5 (how much it reduces L)
  consequenceReduction?: number; // 0-5 (how much it reduces C)
  
  // Status & Tracking (RM_TR_17, RM_TR_18)
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue' | 'On Hold';
  implementationDate?: string;
  dueDate?: string;
  completionDate?: string;
  
  // Review & Monitoring (RM_TR_19, RM_TR_20)
  reviewDate?: string;
  nextReviewDate?: string;
  reviewFrequency?: 'Monthly' | 'Quarterly' | 'Semi-Annually' | 'Annually';
  
  // Links
  linkedRisks: string[]; // Can be assigned to multiple risks (RM_TR_07)
  
  // Metadata
  createdBy: string;
  createdDate: string;
  modifiedBy?: string;
  modifiedDate?: string;
}

export interface TreatmentPlan {
  id: string;
  name: string;
  description: string;
  riskId: string;
  
  // Ownership (RM_TR_13)
  owner: string;
  ownerContact?: string;
  
  // Options & Measures (RM_TR_12, RM_TR_15)
  treatmentOption: 'Avoid' | 'Prevent' | 'Detect' | 'Mitigate' | 'Transfer' | 'Accept';
  controls: string[]; // Array of control IDs
  
  // Residual Risk Calculation (RM_TR_10, RM_TR_11)
  inherentLikelihood: number;
  inherentConsequence: number;
  inherentRating: 'Critical' | 'High' | 'Medium' | 'Low';
  
  targetLikelihood?: number;
  targetConsequence?: number;
  targetRating?: 'Critical' | 'High' | 'Medium' | 'Low';
  
  residualLikelihood?: number;
  residualConsequence?: number;
  residualRating?: 'Critical' | 'High' | 'Medium' | 'Low';
  
  // Status & Timeline (RM_TR_17, RM_TR_18, RM_TR_19)
  status: 'Not Started' | 'In Progress' | 'In Review' | 'Completed' | 'Overdue';
  startDate: string;
  dueDate: string;
  reviewDate?: string;
  
  // Cost
  totalCost?: number;
  costCurrency?: string;
  
  // Tolerance Check (RM_TR_11)
  exceedsTolerance: boolean;
  requiresFurtherTreatment: boolean;
  
  // Organizational Assignment (RM_TR_16)
  organizationalEntity?: string; // Business Unit, Department, etc.
  
  // Metadata
  createdBy: string;
  createdDate: string;
  modifiedBy?: string;
  modifiedDate?: string;
}

// Mock Controls Library (RM_TR_01)
export const mockERMControls: ERMControl[] = [
  {
    id: 'ERM-CTRL-001',
    name: 'Vendor Security Assessment',
    description: 'Comprehensive security assessment of all third-party vendors before onboarding',
    type: 'Preventive',
    category: 'Prevent',
    owner: 'Sarah Chen (CISO)',
    monitor: 'IT Security Team',
    effectivenessQualitative: 'Effective',
    effectivenessQuantitative: 75,
    effectivenessRationale: 'Reduces likelihood of vendor-related incidents by ensuring baseline security standards',
    costQualitative: 'Medium',
    costQuantitative: 50000,
    costCurrency: 'USD',
    costAssumptions: 'Annual cost for vendor assessment program including tools and personnel',
    likelihoodReduction: 2,
    consequenceReduction: 1,
    status: 'Completed',
    implementationDate: '2023-06-01',
    completionDate: '2023-08-15',
    reviewDate: '2024-03-01',
    nextReviewDate: '2024-09-01',
    reviewFrequency: 'Semi-Annually',
    linkedRisks: ['RSK-001'],
    createdBy: 'Sarah Chen',
    createdDate: '2023-05-15'
  },
  {
    id: 'ERM-CTRL-002',
    name: 'Data Encryption (At Rest & In Transit)',
    description: 'AES-256 encryption for data at rest and TLS 1.3 for data in transit',
    type: 'Preventive',
    category: 'Mitigate',
    owner: 'IT Security Team',
    effectivenessQualitative: 'Very Effective',
    effectivenessQuantitative: 90,
    effectivenessRationale: 'Industry-standard encryption significantly reduces impact of data breaches',
    costQualitative: 'Low',
    costQuantitative: 15000,
    costCurrency: 'USD',
    likelihoodReduction: 1,
    consequenceReduction: 3,
    status: 'Completed',
    implementationDate: '2023-01-01',
    completionDate: '2023-03-01',
    nextReviewDate: '2024-07-01',
    reviewFrequency: 'Annually',
    linkedRisks: ['RSK-001', 'RSK-015'],
    createdBy: 'IT Security Team',
    createdDate: '2022-12-01'
  },
  {
    id: 'ERM-CTRL-003',
    name: 'Cyber Insurance Policy',
    description: 'Comprehensive cyber liability insurance covering data breach response and financial losses',
    type: 'Corrective',
    category: 'Transfer',
    owner: 'Patricia Wilson (CFO)',
    effectivenessQualitative: 'Effective',
    effectivenessQuantitative: 70,
    effectivenessRationale: 'Transfers financial impact of cyber incidents to insurance provider',
    costQualitative: 'Medium',
    costQuantitative: 120000,
    costCurrency: 'USD',
    costAssumptions: 'Annual premium for $10M coverage with $500K deductible',
    likelihoodReduction: 0,
    consequenceReduction: 2,
    status: 'Completed',
    implementationDate: '2023-01-01',
    completionDate: '2023-01-15',
    nextReviewDate: '2024-12-31',
    reviewFrequency: 'Annually',
    linkedRisks: ['RSK-001', 'RSK-015'],
    createdBy: 'Patricia Wilson',
    createdDate: '2022-11-01'
  },
  {
    id: 'ERM-CTRL-004',
    name: 'Security Awareness Training',
    description: 'Quarterly security awareness training for all employees covering phishing, social engineering, and data protection',
    type: 'Preventive',
    category: 'Prevent',
    owner: 'Maria Garcia (CHRO)',
    monitor: 'IT Security Team',
    effectivenessQualitative: 'Moderately Effective',
    effectivenessQuantitative: 60,
    effectivenessRationale: 'Reduces human error risk but effectiveness varies by employee engagement',
    costQualitative: 'Low',
    costQuantitative: 25000,
    costCurrency: 'USD',
    costAssumptions: 'Training platform subscription and 4 sessions per year',
    likelihoodReduction: 1,
    consequenceReduction: 0,
    status: 'In Progress',
    implementationDate: '2024-01-01',
    dueDate: '2024-12-31',
    nextReviewDate: '2024-10-01',
    reviewFrequency: 'Quarterly',
    linkedRisks: ['RSK-001', 'RSK-002'],
    createdBy: 'Maria Garcia',
    createdDate: '2023-12-01'
  },
  {
    id: 'ERM-CTRL-005',
    name: 'Incident Response Plan',
    description: 'Documented incident response procedures with defined roles and escalation paths',
    type: 'Detective',
    category: 'Detect',
    owner: 'Sarah Chen (CISO)',
    monitor: 'IT Security Team',
    effectivenessQualitative: 'Very Effective',
    effectivenessQuantitative: 85,
    effectivenessRationale: 'Enables rapid detection and response to security incidents, minimizing impact',
    costQualitative: 'Low',
    costQuantitative: 10000,
    costCurrency: 'USD',
    likelihoodReduction: 0,
    consequenceReduction: 2,
    status: 'Completed',
    implementationDate: '2023-03-01',
    completionDate: '2023-04-30',
    reviewDate: '2024-04-01',
    nextReviewDate: '2024-10-01',
    reviewFrequency: 'Semi-Annually',
    linkedRisks: ['RSK-001', 'RSK-002', 'RSK-015'],
    createdBy: 'Sarah Chen',
    createdDate: '2023-02-01'
  }
];

export const mockTreatmentPlans: TreatmentPlan[] = [
  {
    id: 'PLAN-001',
    name: 'Third-Party Vendor Risk Mitigation Plan',
    description: 'Comprehensive plan to reduce third-party vendor data breach risk',
    riskId: 'RSK-001',
    owner: 'Sarah Chen (CISO)',
    ownerContact: 'sarah.chen@ascent.com',
    treatmentOption: 'Mitigate',
    controls: ['ERM-CTRL-001', 'ERM-CTRL-002'],
    inherentLikelihood: 4,
    inherentConsequence: 5,
    inherentRating: 'Critical',
    targetLikelihood: 2,
    targetConsequence: 3,
    targetRating: 'Medium',
    residualLikelihood: 3,
    residualConsequence: 3,
    residualRating: 'Medium',
    status: 'Completed',
    startDate: '2023-05-01',
    dueDate: '2023-12-31',
    reviewDate: '2024-03-15',
    totalCost: 65000,
    costCurrency: 'USD',
    exceedsTolerance: false,
    requiresFurtherTreatment: false,
    organizationalEntity: 'BU-001',
    createdBy: 'Sarah Chen',
    createdDate: '2023-04-15'
  }
];

// Helper functions
export function getControlsForRisk(riskId: string): ERMControl[] {
  return mockERMControls.filter(c => c.linkedRisks.includes(riskId));
}

export function getTreatmentPlansForRisk(riskId: string): TreatmentPlan[] {
  return mockTreatmentPlans.filter(p => p.riskId === riskId);
}

export function calculateResidualRisk(
  inherentL: number,
  inherentC: number,
  likelihoodReduction: number,
  consequenceReduction: number
): { residualL: number; residualC: number; residualScore: number; residualRating: string } {
  const residualL = Math.max(1, inherentL - likelihoodReduction);
  const residualC = Math.max(1, inherentC - consequenceReduction);
  const residualScore = residualL * residualC;
  
  let residualRating: string;
  if (residualScore >= 16) residualRating = 'Critical';
  else if (residualScore >= 10) residualRating = 'High';
  else if (residualScore >= 5) residualRating = 'Medium';
  else residualRating = 'Low';
  
  return { residualL, residualC, residualScore, residualRating };
}
