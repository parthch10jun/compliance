// Program Specifications Types

export type WorkflowStepStatus = 'not-started' | 'in-progress' | 'completed' | 'blocked';
export type FrequencyType = 'Weekly' | 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual' | 'Ad-hoc';

export interface WorkflowStep {
  id: string;
  order: number;
  title: string;
  description: string;
  detailedProcedure: string;
  status: WorkflowStepStatus;
  assignedTo?: string;
  dueDate?: string;
  completedDate?: string;
  completedBy?: string;
  evidence?: string[];
  notes?: string;
}

export interface AssessmentLifecycle {
  id: string;
  programId: string;
  enabled: boolean;
  frequency: FrequencyType;
  lastAssessmentDate?: string;
  nextAssessmentDate?: string;
  steps: WorkflowStep[];
  automationEnabled: boolean;
  notificationDays: number; // Days before due date to send notification
  templateId?: string;
}

export interface ControlTesting {
  id: string;
  programId: string;
  enabled: boolean;
  frequency: FrequencyType;
  lastTestingDate?: string;
  nextTestingDate?: string;
  steps: WorkflowStep[];
  automationEnabled: boolean;
  notificationDays: number;
  templateId?: string;
}

export interface ProgramSpecifications {
  programId: string;
  assessmentLifecycle: AssessmentLifecycle;
  controlTesting: ControlTesting;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface SpecificationTemplate {
  id: string;
  name: string;
  description: string;
  type: 'assessment' | 'testing' | 'both';
  assessmentSteps?: Omit<WorkflowStep, 'id' | 'status' | 'assignedTo' | 'dueDate' | 'completedDate' | 'completedBy' | 'evidence' | 'notes'>[];
  testingSteps?: Omit<WorkflowStep, 'id' | 'status' | 'assignedTo' | 'dueDate' | 'completedDate' | 'completedBy' | 'evidence' | 'notes'>[];
  defaultFrequency: FrequencyType;
  defaultNotificationDays: number;
  isDefault: boolean;
  createdAt: string;
  createdBy: string;
  tags: string[];
}

export interface WorkflowProgress {
  totalSteps: number;
  completedSteps: number;
  inProgressSteps: number;
  blockedSteps: number;
  percentComplete: number;
  isOverdue: boolean;
  daysUntilDue?: number;
}

