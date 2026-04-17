// Workflow Engine & Task Management Module
// Requirements: RM_MR_13 through RM_MR_27, RM_EC_07

// RM_EC_07, RM_MR_15: User Roles & Privileges
export interface UserRole {
  id: string;
  name: string;
  description: string;
  level: 'Executive' | 'Management' | 'Operational' | 'Viewer';
  
  // Privileges (RM_EC_07)
  privileges: {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    override: boolean;
    approve: boolean;
    assignTasks: boolean;
    configureWorkflows: boolean;
  };
  
  // Members
  users: string[];
  
  // Metadata
  createdBy: string;
  createdDate: string;
}

// RM_MR_13: Workflow Definition
export interface Workflow {
  id: string;
  name: string;
  description: string;
  entityType: 'Risk' | 'Control' | 'Treatment Plan' | 'Assessment' | 'Override';
  
  // Steps
  steps: WorkflowStep[];
  
  // Current state
  status: 'Active' | 'Inactive' | 'Draft';
  
  // Metadata
  createdBy: string;
  createdDate: string;
}

export interface WorkflowStep {
  stepNumber: number;
  stepName: string;
  stepType: 'Review' | 'Approval' | 'Task' | 'Notification' | 'Delegation';
  
  // Assignments (RM_MR_16)
  assignedTo: {
    type: 'Role' | 'User' | 'Group';
    value: string;
  }[];
  
  // Requirements
  requiresSignOff: boolean;
  isMandatory: boolean;
  
  // Escalation (RM_MR_14)
  escalateTo?: string; // Role or user to escalate to
  escalationAfterDays?: number;
  
  // Deadlines (RM_MR_17)
  dueInDays?: number;
  
  // Next steps
  onApprove?: number; // Next step number
  onReject?: number; // Next step number (RM_MR_19: rollback)
}

// RM_MR_16, RM_MR_20: Task
export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'Review' | 'Approval' | 'Assessment' | 'Update' | 'Response';
  
  // Assignment (RM_MR_16)
  assignedToType: 'Role' | 'User' | 'Group';
  assignedToValue: string;
  assignedBy: string;
  assignedDate: string;
  
  // Deadlines (RM_MR_17)
  dueDate: string;
  isOverdue: boolean;
  
  // Related entity
  entityType: 'Risk' | 'Control' | 'Treatment Plan' | 'Assessment' | 'Override';
  entityId: string;
  entityTitle: string;
  
  // Status tracking (RM_MR_18)
  status: 'Not Started' | 'In Progress' | 'Pending Review' | 'Completed' | 'Rejected' | 'Escalated';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  
  // Workflow link
  workflowId?: string;
  workflowStepNumber?: number;
  
  // Completion
  completedBy?: string;
  completedDate?: string;
  feedback?: string; // RM_MR_13: feedback capability
  
  // Sign-off (RM_MR_13)
  requiresSignOff: boolean;
  signedOffBy?: string;
  signOffDate?: string;
  
  // Notifications (RM_MR_21)
  notificationsSent: boolean;
  lastNotificationDate?: string;
  
  // Metadata
  createdBy: string;
  createdDate: string;
  modifiedBy?: string;
  modifiedDate?: string;
}

// RM_MR_14: Sign-off record
export interface SignOff {
  id: string;
  entityType: 'Risk' | 'Control' | 'Treatment Plan' | 'Assessment';
  entityId: string;
  
  // Hierarchical sign-off (RM_MR_14)
  level: number; // 1 = operational, 2 = management, 3 = executive, 4 = board
  roleName: string;
  
  // Sign-off details
  signedBy: string;
  signOffDate: string;
  status: 'Approved' | 'Rejected' | 'Pending';
  comments?: string;
  
  // Escalation (RM_MR_14)
  escalatedFrom?: string;
  escalationReason?: string;
}

// RM_MR_15: Define new role
export const defaultRoles: UserRole[] = [
  {
    id: 'ROLE-001',
    name: 'Risk Owner',
    description: 'Owns and manages specific risks',
    level: 'Management',
    privileges: {
      view: true,
      create: true,
      update: true,
      delete: false,
      override: false,
      approve: false,
      assignTasks: true,
      configureWorkflows: false
    },
    users: ['Sarah Chen (CISO)', 'David Kumar (COO)'],
    createdBy: 'System',
    createdDate: '2024-01-01'
  },
  {
    id: 'ROLE-002',
    name: 'Risk Analyst',
    description: 'Conducts risk assessments and analysis',
    level: 'Operational',
    privileges: {
      view: true,
      create: true,
      update: true,
      delete: false,
      override: false,
      approve: false,
      assignTasks: false,
      configureWorkflows: false
    },
    users: ['Risk Analyst 1', 'Risk Analyst 2'],
    createdBy: 'System',
    createdDate: '2024-01-01'
  },
  {
    id: 'ROLE-003',
    name: 'Risk Approver',
    description: 'Approves risk assessments and treatment plans',
    level: 'Executive',
    privileges: {
      view: true,
      create: false,
      update: false,
      delete: false,
      override: true,
      approve: true,
      assignTasks: true,
      configureWorkflows: false
    },
    users: ['Jennifer Walsh (CCO)', 'Board Risk Committee'],
    createdBy: 'System',
    createdDate: '2024-01-01'
  },
  {
    id: 'ROLE-004',
    name: 'ERM Administrator',
    description: 'Full system administration',
    level: 'Executive',
    privileges: {
      view: true,
      create: true,
      update: true,
      delete: true,
      override: true,
      approve: true,
      assignTasks: true,
      configureWorkflows: true
    },
    users: ['Jennifer Walsh (CCO)'],
    createdBy: 'System',
    createdDate: '2024-01-01'
  }
];

// Mock Tasks (RM_MR_16, RM_MR_20)
export const mockTasks: Task[] = [
  {
    id: 'TASK-001',
    title: 'Review Q2 Cybersecurity Risk Assessment',
    description: 'Review and approve the updated cybersecurity risk assessment for Q2 2024',
    type: 'Review',
    assignedToType: 'Role',
    assignedToValue: 'Risk Approver',
    assignedBy: 'Sarah Chen (CISO)',
    assignedDate: '2024-04-15',
    dueDate: '2024-04-22',
    isOverdue: false,
    entityType: 'Assessment',
    entityId: 'ASMT-001',
    entityTitle: 'Q2 2024 Cybersecurity Assessment',
    status: 'In Progress',
    priority: 'High',
    workflowId: 'WF-001',
    workflowStepNumber: 2,
    requiresSignOff: true,
    notificationsSent: true,
    lastNotificationDate: '2024-04-15',
    createdBy: 'Sarah Chen (CISO)',
    createdDate: '2024-04-15'
  },
  {
    id: 'TASK-002',
    title: 'Update Treatment Plan for RSK-001',
    description: 'Update the treatment plan based on new controls implemented',
    type: 'Update',
    assignedToType: 'User',
    assignedToValue: 'Sarah Chen (CISO)',
    assignedBy: 'Jennifer Walsh (CCO)',
    assignedDate: '2024-04-10',
    dueDate: '2024-04-20',
    isOverdue: true,
    entityType: 'Treatment Plan',
    entityId: 'PLAN-001',
    entityTitle: 'Third-Party Vendor Risk Mitigation Plan',
    status: 'Pending Review',
    priority: 'Critical',
    requiresSignOff: false,
    notificationsSent: true,
    lastNotificationDate: '2024-04-19',
    createdBy: 'Jennifer Walsh (CCO)',
    createdDate: '2024-04-10',
    completedBy: 'Sarah Chen (CISO)',
    completedDate: '2024-04-18',
    feedback: 'Updated with new vendor security assessment controls'
  },
  {
    id: 'TASK-003',
    title: 'Conduct Monthly KRI Review',
    description: 'Review all KRIs and update thresholds as needed',
    type: 'Review',
    assignedToType: 'Role',
    assignedToValue: 'Risk Analyst',
    assignedBy: 'Jennifer Walsh (CCO)',
    assignedDate: '2024-04-18',
    dueDate: '2024-04-25',
    isOverdue: false,
    entityType: 'Assessment',
    entityId: 'KRI-REVIEW-001',
    entityTitle: 'April 2024 KRI Review',
    status: 'Not Started',
    priority: 'Medium',
    requiresSignOff: true,
    notificationsSent: true,
    lastNotificationDate: '2024-04-18',
    createdBy: 'Jennifer Walsh (CCO)',
    createdDate: '2024-04-18'
  },
  {
    id: 'TASK-004',
    title: 'Approve New Control Implementation',
    description: 'Review and approve the new MFA control for vendor access',
    type: 'Approval',
    assignedToType: 'Role',
    assignedToValue: 'Risk Approver',
    assignedBy: 'Sarah Chen (CISO)',
    assignedDate: '2024-04-19',
    dueDate: '2024-04-26',
    isOverdue: false,
    entityType: 'Control',
    entityId: 'ERM-CTRL-006',
    entityTitle: 'Multi-Factor Authentication for Vendor Access',
    status: 'In Progress',
    priority: 'High',
    requiresSignOff: true,
    signedOffBy: 'Jennifer Walsh (CCO)',
    signOffDate: '2024-04-20',
    notificationsSent: true,
    lastNotificationDate: '2024-04-19',
    createdBy: 'Sarah Chen (CISO)',
    createdDate: '2024-04-19'
  },
  {
    id: 'TASK-005',
    title: 'Complete Risk Assessment for RSK-015',
    description: 'Assess likelihood and consequence for customer data privacy breach risk',
    type: 'Assessment',
    assignedToType: 'User',
    assignedToValue: 'Risk Analyst 1',
    assignedBy: 'Sarah Chen (CISO)',
    assignedDate: '2024-04-12',
    dueDate: '2024-04-19',
    isOverdue: true,
    entityType: 'Risk',
    entityId: 'RSK-015',
    entityTitle: 'Customer data privacy breach',
    status: 'Escalated',
    priority: 'Critical',
    requiresSignOff: false,
    notificationsSent: true,
    lastNotificationDate: '2024-04-20',
    createdBy: 'Sarah Chen (CISO)',
    createdDate: '2024-04-12'
  }
];

// Mock Workflows (RM_MR_13, RM_MR_14)
export const mockWorkflows: Workflow[] = [
  {
    id: 'WF-001',
    name: 'Risk Assessment Approval Workflow',
    description: 'Standard workflow for approving risk assessments with cascading sign-offs',
    entityType: 'Assessment',
    steps: [
      {
        stepNumber: 1,
        stepName: 'Initial Assessment',
        stepType: 'Task',
        assignedTo: [{ type: 'Role', value: 'Risk Analyst' }],
        requiresSignOff: false,
        isMandatory: true,
        dueInDays: 5,
        onApprove: 2
      },
      {
        stepNumber: 2,
        stepName: 'Management Review',
        stepType: 'Review',
        assignedTo: [{ type: 'Role', value: 'Risk Owner' }],
        requiresSignOff: true,
        isMandatory: true,
        dueInDays: 3,
        escalateTo: 'Risk Approver',
        escalationAfterDays: 5,
        onApprove: 3,
        onReject: 1
      },
      {
        stepNumber: 3,
        stepName: 'Executive Approval',
        stepType: 'Approval',
        assignedTo: [{ type: 'Role', value: 'Risk Approver' }],
        requiresSignOff: true,
        isMandatory: true,
        dueInDays: 2,
        escalateTo: 'Board Risk Committee',
        escalationAfterDays: 3,
        onReject: 1
      }
    ],
    status: 'Active',
    createdBy: 'Jennifer Walsh (CCO)',
    createdDate: '2024-01-01'
  }
];

// Helper Functions
export function getTasksForUser(userId: string): Task[] {
  return mockTasks.filter(t => 
    t.assignedToType === 'User' && t.assignedToValue === userId
  );
}

export function getTasksForRole(roleName: string): Task[] {
  return mockTasks.filter(t => 
    t.assignedToType === 'Role' && t.assignedToValue === roleName
  );
}

export function getOverdueTasks(): Task[] {
  return mockTasks.filter(t => t.isOverdue);
}

export function getUsersByRole(roleId: string): string[] {
  const role = defaultRoles.find(r => r.id === roleId);
  return role?.users || [];
}
