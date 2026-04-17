// RM_AR_01, RM_AR_02: Risk Assessment Campaigns

// Workflow step tracking
export interface WorkflowStep {
  stepNumber: number;
  stepName: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Skipped';
  completedBy?: string;
  completedDate?: string;
  notes?: string;
}

// Risk assignment for campaign
export interface RiskAssignment {
  riskId: string;
  riskTitle: string;
  assignedAssessor: string;
  assignedDate: string;
  dueDate: string;
  status: 'Not Started' | 'In Progress' | 'Submitted' | 'Approved' | 'Rejected';
  assessmentId?: string; // Links to completed assessment
}

export interface Assessment {
  id: string;
  campaignId: string;
  campaignName: string;
  riskId: string;
  riskTitle: string;
  assessmentDate: string;
  assessor: string;
  
  // Likelihood Assessment
  likelihood: 1 | 2 | 3 | 4 | 5;
  likelihoodRationale: string;
  
  // Consequence Assessment
  consequence: 1 | 2 | 3 | 4 | 5;
  consequenceRationale: string;
  
  // Multi-dimensional consequences (RM_AR_18, RM_IR_12)
  consequenceDimensions?: {
    financial?: number; // 1-5
    healthSafety?: number;
    environmental?: number;
    operational?: number;
    reputational?: number;
  };
  
  // Calculated risk score
  riskScore: number;
  riskRating: 'Critical' | 'High' | 'Medium' | 'Low';
  
  // Assessment type
  type: 'Inherent' | 'Residual';
  
  // Status
  status: 'Draft' | 'In Review' | 'Approved' | 'Rejected';
  
  // Approval workflow
  reviewedBy?: string;
  reviewDate?: string;
  reviewComments?: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'Planning' | 'Active' | 'In Review' | 'Completed' | 'Cancelled';
  owner: string;
  scope: string; // Business unit, department, etc.
  assessmentCount: number;
  completedCount: number;
  progress: number; // 0-100
  method: 'Qualitative' | 'Quantitative' | 'Semi-Quantitative';

  // Workflow tracking
  currentStep: number; // 1-10
  workflowSteps: WorkflowStep[];
  riskAssignments?: RiskAssignment[];

  // Campaign settings
  requireReview: boolean;
  reviewers?: string[];
  approvers?: string[];

  // Notifications
  notifyOnSubmission: boolean;
  notifyOnApproval: boolean;
}

const defaultWorkflowSteps: WorkflowStep[] = [
  { stepNumber: 1, stepName: 'Campaign Creation', status: 'Not Started' },
  { stepNumber: 2, stepName: 'Risk Selection', status: 'Not Started' },
  { stepNumber: 3, stepName: 'Assessor Assignment', status: 'Not Started' },
  { stepNumber: 4, stepName: 'Assessment Execution', status: 'Not Started' },
  { stepNumber: 5, stepName: 'Multi-dimensional Analysis', status: 'Not Started' },
  { stepNumber: 6, stepName: 'Review & Validation', status: 'Not Started' },
  { stepNumber: 7, stepName: 'Approval Workflow', status: 'Not Started' },
  { stepNumber: 8, stepName: 'Risk Rating Calculation', status: 'Not Started' },
  { stepNumber: 9, stepName: 'Campaign Monitoring', status: 'Not Started' },
  { stepNumber: 10, stepName: 'Campaign Closure', status: 'Not Started' }
];

export const mockCampaigns: Campaign[] = [
  {
    id: 'CAMP-2024-Q2',
    name: 'Q2 2024 Enterprise Risk Assessment',
    description: 'Quarterly enterprise-wide risk assessment covering all business units',
    startDate: '2024-04-01',
    endDate: '2024-06-30',
    status: 'Active',
    owner: 'Sarah Chen (CISO)',
    scope: 'Enterprise-wide',
    assessmentCount: 20,
    completedCount: 15,
    progress: 75,
    method: 'Qualitative',
    currentStep: 9,
    workflowSteps: [
      { stepNumber: 1, stepName: 'Campaign Creation', status: 'Completed', completedBy: 'Sarah Chen', completedDate: '2024-04-01' },
      { stepNumber: 2, stepName: 'Risk Selection', status: 'Completed', completedBy: 'Sarah Chen', completedDate: '2024-04-02' },
      { stepNumber: 3, stepName: 'Assessor Assignment', status: 'Completed', completedBy: 'Sarah Chen', completedDate: '2024-04-03' },
      { stepNumber: 4, stepName: 'Assessment Execution', status: 'Completed', completedBy: 'Risk Team', completedDate: '2024-04-20' },
      { stepNumber: 5, stepName: 'Multi-dimensional Analysis', status: 'Completed', completedBy: 'Risk Team', completedDate: '2024-04-20' },
      { stepNumber: 6, stepName: 'Review & Validation', status: 'Completed', completedBy: 'Jennifer Walsh', completedDate: '2024-04-22' },
      { stepNumber: 7, stepName: 'Approval Workflow', status: 'Completed', completedBy: 'Jennifer Walsh', completedDate: '2024-04-23' },
      { stepNumber: 8, stepName: 'Risk Rating Calculation', status: 'Completed', completedBy: 'System', completedDate: '2024-04-23' },
      { stepNumber: 9, stepName: 'Campaign Monitoring', status: 'In Progress' },
      { stepNumber: 10, stepName: 'Campaign Closure', status: 'Not Started' }
    ],
    requireReview: true,
    reviewers: ['Jennifer Walsh (CCO)', 'David Kumar (COO)'],
    approvers: ['Jennifer Walsh (CCO)'],
    notifyOnSubmission: true,
    notifyOnApproval: true,
    riskAssignments: [
      { riskId: 'RSK-001', riskTitle: 'Third-party vendor data breach', assignedAssessor: 'Sarah Chen', assignedDate: '2024-04-03', dueDate: '2024-04-20', status: 'Approved', assessmentId: 'ASMT-001' },
      { riskId: 'RSK-007', riskTitle: 'Key personnel departure', assignedAssessor: 'Maria Garcia', assignedDate: '2024-04-03', dueDate: '2024-04-20', status: 'Submitted', assessmentId: 'ASMT-004' }
    ]
  },
  {
    id: 'CAMP-2024-CYBER',
    name: 'Cybersecurity Risk Assessment 2024',
    description: 'Focused assessment of cybersecurity risks and controls',
    startDate: '2024-03-01',
    endDate: '2024-05-31',
    status: 'In Review',
    owner: 'Sarah Chen (CISO)',
    scope: 'IT Department',
    assessmentCount: 8,
    completedCount: 8,
    progress: 100,
    method: 'Qualitative'
  },
  {
    id: 'CAMP-2024-Q3',
    name: 'Q3 2024 Enterprise Risk Assessment',
    description: 'Next quarterly enterprise-wide risk assessment',
    startDate: '2024-07-01',
    endDate: '2024-09-30',
    status: 'Planning',
    owner: 'Jennifer Walsh (CCO)',
    scope: 'Enterprise-wide',
    assessmentCount: 20,
    completedCount: 0,
    progress: 0,
    method: 'Qualitative'
  },
  {
    id: 'CAMP-2023-Q4',
    name: 'Q4 2023 Enterprise Risk Assessment',
    description: 'Previous quarterly assessment - completed',
    startDate: '2023-10-01',
    endDate: '2023-12-31',
    status: 'Completed',
    owner: 'Sarah Chen (CISO)',
    scope: 'Enterprise-wide',
    assessmentCount: 20,
    completedCount: 20,
    progress: 100,
    method: 'Qualitative'
  }
];

export const mockAssessments: Assessment[] = [
  {
    id: 'ASMT-001',
    campaignId: 'CAMP-2024-Q2',
    campaignName: 'Q2 2024 Enterprise Risk Assessment',
    riskId: 'RSK-001',
    riskTitle: 'Third-party vendor data breach exposure',
    assessmentDate: '2024-04-15',
    assessor: 'Sarah Chen (CISO)',
    likelihood: 4,
    likelihoodRationale: 'Multiple third-party vendors with varying security controls. Recent industry incidents indicate increased threat.',
    consequence: 5,
    consequenceRationale: 'Potential exposure of sensitive customer data could result in significant financial and reputational damage.',
    consequenceDimensions: {
      financial: 5,
      healthSafety: 1,
      environmental: 1,
      operational: 4,
      reputational: 5
    },
    riskScore: 20,
    riskRating: 'Critical',
    type: 'Inherent',
    status: 'Approved',
    reviewedBy: 'Jennifer Walsh (CCO)',
    reviewDate: '2024-04-16',
    reviewComments: 'Assessment methodology and rationale are sound. Approved.'
  },
  {
    id: 'ASMT-002',
    campaignId: 'CAMP-2024-Q2',
    campaignName: 'Q2 2024 Enterprise Risk Assessment',
    riskId: 'RSK-001',
    riskTitle: 'Third-party vendor data breach exposure',
    assessmentDate: '2024-04-15',
    assessor: 'Sarah Chen (CISO)',
    likelihood: 3,
    likelihoodRationale: 'After implementing vendor security assessments and encryption controls, likelihood is reduced.',
    consequence: 3,
    consequenceRationale: 'With improved incident response and cyber insurance, impact is mitigated.',
    consequenceDimensions: {
      financial: 3,
      healthSafety: 1,
      environmental: 1,
      operational: 3,
      reputational: 3
    },
    riskScore: 9,
    riskRating: 'Medium',
    type: 'Residual',
    status: 'Approved',
    reviewedBy: 'Jennifer Walsh (CCO)',
    reviewDate: '2024-04-16',
    reviewComments: 'Residual risk assessment reflects effective control implementation.'
  },
  {
    id: 'ASMT-003',
    campaignId: 'CAMP-2024-CYBER',
    campaignName: 'Cybersecurity Risk Assessment 2024',
    riskId: 'RSK-015',
    riskTitle: 'Customer data privacy breach',
    assessmentDate: '2024-03-20',
    assessor: 'Security Analyst',
    likelihood: 4,
    likelihoodRationale: 'High volume of customer data and increasing cyber threats.',
    consequence: 5,
    consequenceRationale: 'GDPR and privacy regulation violations would result in severe penalties.',
    consequenceDimensions: {
      financial: 5,
      healthSafety: 1,
      environmental: 1,
      operational: 3,
      reputational: 5
    },
    riskScore: 20,
    riskRating: 'Critical',
    type: 'Inherent',
    status: 'Approved'
  },
  {
    id: 'ASMT-004',
    campaignId: 'CAMP-2024-Q2',
    campaignName: 'Q2 2024 Enterprise Risk Assessment',
    riskId: 'RSK-007',
    riskTitle: 'Key personnel departure',
    assessmentDate: '2024-04-18',
    assessor: 'Maria Garcia (CHRO)',
    likelihood: 3,
    likelihoodRationale: 'Competitive job market and talent demand in key roles.',
    consequence: 4,
    consequenceRationale: 'Loss of critical institutional knowledge could disrupt operations.',
    consequenceDimensions: {
      financial: 3,
      healthSafety: 1,
      environmental: 1,
      operational: 5,
      reputational: 2
    },
    riskScore: 12,
    riskRating: 'High',
    type: 'Inherent',
    status: 'In Review',
    reviewedBy: 'Jennifer Walsh (CCO)',
    reviewComments: 'Please provide more detail on succession planning status.'
  }
];

// Helper functions
export function getCampaignAssessments(campaignId: string): Assessment[] {
  return mockAssessments.filter(a => a.campaignId === campaignId);
}

export function getAssessmentsByRisk(riskId: string): Assessment[] {
  return mockAssessments.filter(a => a.riskId === riskId);
}

export function calculateRiskRating(likelihood: number, consequence: number): 'Critical' | 'High' | 'Medium' | 'Low' {
  const score = likelihood * consequence;
  if (score >= 16) return 'Critical';
  if (score >= 10) return 'High';
  if (score >= 5) return 'Medium';
  return 'Low';
}
