import { ProgramSpecifications, SpecificationTemplate } from '../types/program-specifications';

// Default templates
export const specificationTemplates: SpecificationTemplate[] = [
  {
    id: 'tpl-standard-assessment',
    name: 'Standard Requirements Assessment',
    description: 'Standard 4-step requirements assessment lifecycle for regulatory compliance',
    type: 'assessment',
    assessmentSteps: [
      {
        order: 1,
        title: 'Initial Assessment',
        description: 'Evaluate requirement applicability and scope',
        detailedProcedure: `# Initial Assessment Procedure

## Objective
Determine if the requirement applies to your organization and define the scope of compliance.

## Steps
1. Review the requirement text and regulatory guidance
2. Assess applicability based on:
   - Organization type and size
   - Geographic jurisdiction
   - Business activities
   - Regulatory exemptions
3. Document applicability decision with rationale
4. Define scope boundaries if applicable
5. Identify key stakeholders and owners

## Deliverables
- Applicability assessment document
- Scope definition
- Stakeholder matrix

## Success Criteria
- Clear applicability decision documented
- Scope boundaries defined
- Stakeholders identified and notified`,
      },
      {
        order: 2,
        title: 'Gap Analysis',
        description: 'Identify gaps between current and required state',
        detailedProcedure: `# Gap Analysis Procedure

## Objective
Identify and document gaps between current state and regulatory requirements.

## Steps
1. Document current state:
   - Existing policies and procedures
   - Current controls
   - Available evidence
2. Compare against requirements
3. Identify gaps and deficiencies
4. Assess gap severity and risk
5. Prioritize remediation activities

## Deliverables
- Current state assessment
- Gap analysis report
- Remediation plan with priorities

## Success Criteria
- All gaps identified and documented
- Risk assessment completed
- Remediation priorities established`,
      },
      {
        order: 3,
        title: 'Implementation',
        description: 'Execute remediation and control implementation',
        detailedProcedure: `# Implementation Procedure

## Objective
Execute remediation activities and implement required controls.

## Steps
1. Develop implementation plan
2. Assign resources and responsibilities
3. Implement controls and procedures
4. Update policies and documentation
5. Train relevant personnel
6. Deploy technical solutions if needed

## Deliverables
- Implementation plan
- Updated policies and procedures
- Control documentation
- Training records

## Success Criteria
- All remediation activities completed
- Controls implemented and operational
- Documentation updated
- Personnel trained`,
      },
      {
        order: 4,
        title: 'Validation & Review',
        description: 'Verify compliance and document evidence',
        detailedProcedure: `# Validation & Review Procedure

## Objective
Verify that compliance has been achieved and maintain evidence.

## Steps
1. Review implemented controls
2. Test control effectiveness
3. Collect and organize evidence
4. Document compliance status
5. Obtain management sign-off
6. Schedule next review

## Deliverables
- Validation report
- Evidence repository
- Compliance certification
- Review schedule

## Success Criteria
- Controls validated as effective
- Evidence documented and stored
- Compliance status confirmed
- Next review scheduled`,
      },
    ],
    defaultFrequency: 'Quarterly',
    defaultNotificationDays: 14,
    isDefault: true,
    createdAt: '2024-01-01',
    createdBy: 'System',
    tags: ['Standard', 'Regulatory', 'Assessment'],
  },
  {
    id: 'tpl-standard-testing',
    name: 'Standard Control Testing',
    description: 'Standard 4-step control testing methodology',
    type: 'testing',
    testingSteps: [
      {
        order: 1,
        title: 'Test Planning',
        description: 'Define test scope, objectives, and criteria',
        detailedProcedure: `# Test Planning Procedure

## Objective
Define comprehensive test plan for control effectiveness validation.

## Steps
1. Identify controls to be tested
2. Define test objectives and scope
3. Determine test methodology
4. Establish success criteria
5. Allocate resources and timeline
6. Prepare test documentation

## Deliverables
- Test plan document
- Test scripts and procedures
- Resource allocation
- Timeline and schedule

## Success Criteria
- Test plan approved
- Resources allocated
- Test procedures documented`,
      },
      {
        order: 2,
        title: 'Test Execution',
        description: 'Perform testing and collect evidence',
        detailedProcedure: `# Test Execution Procedure

## Objective
Execute tests and collect evidence of control effectiveness.

## Steps
1. Execute test procedures
2. Collect evidence and samples
3. Document observations
4. Interview control owners
5. Review system logs and reports
6. Record test results

## Deliverables
- Test execution records
- Evidence samples
- Observation notes
- Interview summaries

## Success Criteria
- All tests executed per plan
- Evidence collected and documented
- Observations recorded`,
      },
      {
        order: 3,
        title: 'Results Analysis',
        description: 'Evaluate findings and determine effectiveness',
        detailedProcedure: `# Results Analysis Procedure

## Objective
Analyze test results and determine control effectiveness rating.

## Steps
1. Review all test results
2. Identify exceptions and deficiencies
3. Assess severity and impact
4. Determine effectiveness rating
5. Document findings
6. Prepare recommendations

## Deliverables
- Analysis report
- Findings summary
- Effectiveness rating
- Recommendations

## Success Criteria
- All results analyzed
- Effectiveness rating determined
- Findings documented`,
      },
      {
        order: 4,
        title: 'Remediation',
        description: 'Address deficiencies and retest if needed',
        detailedProcedure: `# Remediation Procedure

## Objective
Address identified deficiencies and verify corrective actions.

## Steps
1. Communicate findings to control owners
2. Develop remediation plan
3. Implement corrective actions
4. Retest controls if needed
5. Verify remediation effectiveness
6. Update control documentation

## Deliverables
- Remediation plan
- Corrective action records
- Retest results
- Updated documentation

## Success Criteria
- Deficiencies remediated
- Retesting completed successfully
- Documentation updated`,
      },
    ],
    defaultFrequency: 'Annual',
    defaultNotificationDays: 30,
    isDefault: true,
    createdAt: '2024-01-01',
    createdBy: 'System',
    tags: ['Standard', 'Testing', 'Controls'],
  },
];

// Helper function to calculate next date based on frequency
function calculateNextDate(lastDate: string, frequency: string): string {
  const date = new Date(lastDate);
  switch (frequency) {
    case 'Weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'Monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'Quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'Semi-Annual':
      date.setMonth(date.getMonth() + 6);
      break;
    case 'Annual':
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  return date.toISOString().split('T')[0];
}

// Program specifications for each program
export const programSpecifications: ProgramSpecifications[] = [
  {
    programId: 'cbuae-aml',
    assessmentLifecycle: {
      id: 'asl-cbuae-aml',
      programId: 'cbuae-aml',
      enabled: true,
      frequency: 'Quarterly',
      lastAssessmentDate: '2024-10-01',
      nextAssessmentDate: '2025-01-01',
      automationEnabled: true,
      notificationDays: 14,
      templateId: 'tpl-standard-assessment',
      steps: [
        {
          id: 'step-aml-1',
          order: 1,
          title: 'Initial Assessment',
          description: 'Evaluate requirement applicability and scope',
          detailedProcedure: specificationTemplates[0].assessmentSteps![0].detailedProcedure,
          status: 'completed',
          assignedTo: 'Chief Compliance Officer',
          completedDate: '2024-10-15',
          completedBy: 'Sarah Johnson',
          evidence: ['assessment-report-q4-2024.pdf', 'scope-document.pdf'],
        },
        {
          id: 'step-aml-2',
          order: 2,
          title: 'Gap Analysis',
          description: 'Identify gaps between current and required state',
          detailedProcedure: specificationTemplates[0].assessmentSteps![1].detailedProcedure,
          status: 'completed',
          assignedTo: 'Compliance Team',
          completedDate: '2024-11-01',
          completedBy: 'Michael Chen',
          evidence: ['gap-analysis-q4-2024.pdf'],
        },
        {
          id: 'step-aml-3',
          order: 3,
          title: 'Implementation',
          description: 'Execute remediation and control implementation',
          detailedProcedure: specificationTemplates[0].assessmentSteps![2].detailedProcedure,
          status: 'in-progress',
          assignedTo: 'Operations Team',
          dueDate: '2024-12-15',
        },
        {
          id: 'step-aml-4',
          order: 4,
          title: 'Validation & Review',
          description: 'Verify compliance and document evidence',
          detailedProcedure: specificationTemplates[0].assessmentSteps![3].detailedProcedure,
          status: 'not-started',
          assignedTo: 'Internal Audit',
          dueDate: '2024-12-31',
        },
      ],
    },
    controlTesting: {
      id: 'ct-cbuae-aml',
      programId: 'cbuae-aml',
      enabled: true,
      frequency: 'Annual',
      lastTestingDate: '2024-01-15',
      nextTestingDate: '2025-01-15',
      automationEnabled: true,
      notificationDays: 30,
      templateId: 'tpl-standard-testing',
      steps: [
        {
          id: 'test-aml-1',
          order: 1,
          title: 'Test Planning',
          description: 'Define test scope, objectives, and criteria',
          detailedProcedure: specificationTemplates[1].testingSteps![0].detailedProcedure,
          status: 'completed',
          assignedTo: 'Internal Audit',
          completedDate: '2024-01-20',
          completedBy: 'David Wilson',
          evidence: ['test-plan-2024.pdf'],
        },
        {
          id: 'test-aml-2',
          order: 2,
          title: 'Test Execution',
          description: 'Perform testing and collect evidence',
          detailedProcedure: specificationTemplates[1].testingSteps![1].detailedProcedure,
          status: 'completed',
          assignedTo: 'Audit Team',
          completedDate: '2024-02-28',
          completedBy: 'Emily Brown',
          evidence: ['test-results-2024.xlsx', 'evidence-samples.zip'],
        },
        {
          id: 'test-aml-3',
          order: 3,
          title: 'Results Analysis',
          description: 'Evaluate findings and determine effectiveness',
          detailedProcedure: specificationTemplates[1].testingSteps![2].detailedProcedure,
          status: 'completed',
          assignedTo: 'Chief Audit Executive',
          completedDate: '2024-03-15',
          completedBy: 'David Wilson',
          evidence: ['analysis-report-2024.pdf'],
        },
        {
          id: 'test-aml-4',
          order: 4,
          title: 'Remediation',
          description: 'Address deficiencies and retest if needed',
          detailedProcedure: specificationTemplates[1].testingSteps![3].detailedProcedure,
          status: 'completed',
          assignedTo: 'Compliance Team',
          completedDate: '2024-04-30',
          completedBy: 'Sarah Johnson',
          evidence: ['remediation-plan.pdf', 'retest-results.pdf'],
        },
      ],
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-12-01',
    createdBy: 'System',
    updatedBy: 'Sarah Johnson',
  },
  {
    programId: 'cbuae-cr',
    assessmentLifecycle: {
      id: 'asl-cbuae-cr',
      programId: 'cbuae-cr',
      enabled: true,
      frequency: 'Annual',
      lastAssessmentDate: '2024-01-15',
      nextAssessmentDate: '2025-01-15',
      automationEnabled: true,
      notificationDays: 30,
      templateId: 'tpl-standard-assessment',
      steps: [
        {
          id: 'step-cr-1',
          order: 1,
          title: 'Initial Assessment',
          description: 'Evaluate credit risk requirement applicability',
          detailedProcedure: specificationTemplates[0].assessmentSteps![0].detailedProcedure,
          status: 'completed',
          assignedTo: 'Chief Risk Officer',
          completedDate: '2024-02-01',
          completedBy: 'John Smith',
          evidence: ['cr-assessment-2024.pdf'],
        },
        {
          id: 'step-cr-2',
          order: 2,
          title: 'Gap Analysis',
          description: 'Identify credit risk management gaps',
          detailedProcedure: specificationTemplates[0].assessmentSteps![1].detailedProcedure,
          status: 'completed',
          assignedTo: 'Risk Management Team',
          completedDate: '2024-03-15',
          completedBy: 'Jane Doe',
          evidence: ['cr-gap-analysis-2024.pdf'],
        },
        {
          id: 'step-cr-3',
          order: 3,
          title: 'Implementation',
          description: 'Implement credit risk controls',
          detailedProcedure: specificationTemplates[0].assessmentSteps![2].detailedProcedure,
          status: 'completed',
          assignedTo: 'Credit Risk Team',
          completedDate: '2024-06-30',
          completedBy: 'Risk Manager',
        },
        {
          id: 'step-cr-4',
          order: 4,
          title: 'Validation',
          description: 'Validate credit risk framework effectiveness',
          detailedProcedure: specificationTemplates[0].assessmentSteps![3].detailedProcedure,
          status: 'completed',
          assignedTo: 'Internal Audit',
          completedDate: '2024-08-15',
          completedBy: 'Audit Manager',
          evidence: ['cr-validation-report-2024.pdf'],
        },
      ],
    },
    controlTesting: {
      id: 'ct-cbuae-cr',
      programId: 'cbuae-cr',
      enabled: true,
      frequency: 'Semi-Annual',
      lastTestingDate: '2024-06-01',
      nextTestingDate: '2024-12-01',
      automationEnabled: false,
      notificationDays: 21,
      templateId: 'tpl-standard-testing',
      steps: [
        {
          id: 'test-cr-1',
          order: 1,
          title: 'Test Planning',
          description: 'Plan credit risk control testing',
          detailedProcedure: specificationTemplates[1].testingSteps![0].detailedProcedure,
          status: 'completed',
          assignedTo: 'Internal Audit',
          completedDate: '2024-06-10',
          completedBy: 'Audit Team',
        },
        {
          id: 'test-cr-2',
          order: 2,
          title: 'Test Execution',
          description: 'Execute credit risk control tests',
          detailedProcedure: specificationTemplates[1].testingSteps![1].detailedProcedure,
          status: 'in-progress',
          assignedTo: 'Testing Team',
          dueDate: '2024-11-30',
        },
        {
          id: 'test-cr-3',
          order: 3,
          title: 'Results Analysis',
          description: 'Analyze test results and findings',
          detailedProcedure: specificationTemplates[1].testingSteps![2].detailedProcedure,
          status: 'not-started',
          assignedTo: 'Risk Team',
        },
        {
          id: 'test-cr-4',
          order: 4,
          title: 'Remediation',
          description: 'Address identified deficiencies',
          detailedProcedure: specificationTemplates[1].testingSteps![3].detailedProcedure,
          status: 'not-started',
          assignedTo: 'Credit Risk Team',
        },
      ],
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-11-15',
    createdBy: 'System',
    updatedBy: 'John Smith',
  },
  {
    programId: 'cbuae-lr',
    assessmentLifecycle: {
      id: 'asl-cbuae-lr',
      programId: 'cbuae-lr',
      enabled: true,
      frequency: 'Quarterly',
      lastAssessmentDate: '2024-09-01',
      nextAssessmentDate: '2024-12-01',
      automationEnabled: true,
      notificationDays: 14,
      templateId: 'tpl-standard-assessment',
      steps: [
        {
          id: 'step-lr-1',
          order: 1,
          title: 'Initial Assessment',
          description: 'Evaluate liquidity risk requirements',
          detailedProcedure: specificationTemplates[0].assessmentSteps![0].detailedProcedure,
          status: 'completed',
          assignedTo: 'Treasury Head',
          completedDate: '2024-09-15',
          completedBy: 'Treasury Manager',
        },
        {
          id: 'step-lr-2',
          order: 2,
          title: 'Gap Analysis',
          description: 'Identify liquidity management gaps',
          detailedProcedure: specificationTemplates[0].assessmentSteps![1].detailedProcedure,
          status: 'completed',
          assignedTo: 'Treasury Team',
          completedDate: '2024-10-01',
          completedBy: 'Liquidity Analyst',
        },
        {
          id: 'step-lr-3',
          order: 3,
          title: 'Implementation',
          description: 'Implement liquidity controls',
          detailedProcedure: specificationTemplates[0].assessmentSteps![2].detailedProcedure,
          status: 'in-progress',
          assignedTo: 'Treasury Operations',
          dueDate: '2024-11-30',
        },
        {
          id: 'step-lr-4',
          order: 4,
          title: 'Validation',
          description: 'Validate liquidity framework',
          detailedProcedure: specificationTemplates[0].assessmentSteps![3].detailedProcedure,
          status: 'not-started',
          assignedTo: 'Internal Audit',
        },
      ],
    },
    controlTesting: {
      id: 'ct-cbuae-lr',
      programId: 'cbuae-lr',
      enabled: true,
      frequency: 'Monthly',
      lastTestingDate: '2024-10-01',
      nextTestingDate: '2024-11-01',
      automationEnabled: true,
      notificationDays: 7,
      templateId: 'tpl-standard-testing',
      steps: [
        {
          id: 'test-lr-1',
          order: 1,
          title: 'Test Planning',
          description: 'Plan liquidity control testing',
          detailedProcedure: specificationTemplates[1].testingSteps![0].detailedProcedure,
          status: 'completed',
          assignedTo: 'Treasury Team',
          completedDate: '2024-10-05',
          completedBy: 'Treasury Manager',
        },
        {
          id: 'test-lr-2',
          order: 2,
          title: 'Test Execution',
          description: 'Execute liquidity tests',
          detailedProcedure: specificationTemplates[1].testingSteps![1].detailedProcedure,
          status: 'completed',
          assignedTo: 'Testing Team',
          completedDate: '2024-10-20',
          completedBy: 'Test Analyst',
        },
        {
          id: 'test-lr-3',
          order: 3,
          title: 'Results Analysis',
          description: 'Analyze liquidity test results',
          detailedProcedure: specificationTemplates[1].testingSteps![2].detailedProcedure,
          status: 'in-progress',
          assignedTo: 'Treasury Team',
          dueDate: '2024-10-31',
        },
        {
          id: 'test-lr-4',
          order: 4,
          title: 'Remediation',
          description: 'Address liquidity deficiencies',
          detailedProcedure: specificationTemplates[1].testingSteps![3].detailedProcedure,
          status: 'not-started',
          assignedTo: 'Treasury Operations',
        },
      ],
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-10-25',
    createdBy: 'System',
    updatedBy: 'Treasury Manager',
  },
];

// Helper functions
export function getProgramSpecifications(programId: string): ProgramSpecifications | undefined {
  return programSpecifications.find(spec => spec.programId === programId);
}

export function getTemplate(templateId: string): SpecificationTemplate | undefined {
  return specificationTemplates.find(tpl => tpl.id === templateId);
}

export function calculateWorkflowProgress(steps: any[]): {
  totalSteps: number;
  completedSteps: number;
  inProgressSteps: number;
  blockedSteps: number;
  notStartedSteps: number;
  percentComplete: number;
} {
  const totalSteps = steps.length;
  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const inProgressSteps = steps.filter(s => s.status === 'in-progress').length;
  const blockedSteps = steps.filter(s => s.status === 'blocked').length;
  const notStartedSteps = steps.filter(s => s.status === 'not-started').length;
  const percentComplete = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return {
    totalSteps,
    completedSteps,
    inProgressSteps,
    blockedSteps,
    notStartedSteps,
    percentComplete,
  };
}

export function isWorkflowOverdue(nextDate?: string): boolean {
  if (!nextDate) return false;
  return new Date(nextDate) < new Date();
}

export function getDaysUntilDue(nextDate?: string): number | undefined {
  if (!nextDate) return undefined;
  const today = new Date();
  const due = new Date(nextDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

