/**
 * Mock Approval Workflows
 * Realistic workflow configurations for different approval scenarios
 */

import { ApprovalWorkflow, ApprovalStep } from '../types/doa-types';

export const mockWorkflows: ApprovalWorkflow[] = [
  {
    id: 'wf-001',
    name: 'Purchase Order Approval - Under $10k',
    description: 'Single-level approval for purchase orders under $10,000',
    decisionType: 'Purchase Order',
    thresholdCondition: 'Amount < $10,000',
    steps: [
      {
        stepNumber: 1,
        stepName: 'Manager Approval',
        approverType: 'Role',
        approvers: ['Manager'],
        requiredApprovals: 1,
        allowDelegation: true,
        allowRejection: true,
        stepSlaHours: 24,
      },
    ],
    routingType: 'Sequential',
    slaHours: 24,
    escalationAfterHours: 30,
    escalationTo: ['user-008'],
    isActive: true,
    version: '1.0',
  },
  {
    id: 'wf-002',
    name: 'Purchase Order Approval - $10k-$50k',
    description: 'Two-level approval for purchase orders between $10,000 and $50,000',
    decisionType: 'Purchase Order',
    thresholdCondition: '$10,000 ≤ Amount < $50,000',
    steps: [
      {
        stepNumber: 1,
        stepName: 'Manager Review',
        approverType: 'Role',
        approvers: ['Manager'],
        requiredApprovals: 1,
        allowDelegation: true,
        allowRejection: true,
        stepSlaHours: 24,
      },
      {
        stepNumber: 2,
        stepName: 'Senior Manager Approval',
        approverType: 'Role',
        approvers: ['Finance Director'],
        requiredApprovals: 1,
        allowDelegation: true,
        allowRejection: true,
        stepSlaHours: 48,
      },
    ],
    routingType: 'Sequential',
    slaHours: 72,
    escalationAfterHours: 84,
    escalationTo: ['user-004'],
    isActive: true,
    version: '1.2',
  },
  {
    id: 'wf-003',
    name: 'Purchase Order Approval - $50k-$250k',
    description: 'Three-level approval for purchase orders between $50,000 and $250,000',
    decisionType: 'Purchase Order',
    thresholdCondition: '$50,000 ≤ Amount < $250,000',
    steps: [
      {
        stepNumber: 1,
        stepName: 'Department Manager Review',
        approverType: 'Role',
        approvers: ['Manager'],
        requiredApprovals: 1,
        allowDelegation: true,
        allowRejection: true,
        stepSlaHours: 24,
      },
      {
        stepNumber: 2,
        stepName: 'Finance Director Review',
        approverType: 'User',
        approvers: ['user-008'],
        requiredApprovals: 1,
        allowDelegation: true,
        allowRejection: true,
        stepSlaHours: 48,
      },
      {
        stepNumber: 3,
        stepName: 'VP Finance Approval',
        approverType: 'User',
        approvers: ['user-004'],
        requiredApprovals: 1,
        allowDelegation: true,
        allowRejection: true,
        stepSlaHours: 48,
      },
    ],
    routingType: 'Sequential',
    slaHours: 120,
    escalationAfterHours: 144,
    escalationTo: ['user-002'],
    isActive: true,
    version: '2.0',
  },
  {
    id: 'wf-004',
    name: 'Hiring Approval - Junior Level',
    description: 'Two-level approval for junior level hiring (Grade 1-3)',
    decisionType: 'Hiring',
    thresholdCondition: 'Salary Grade 1-3',
    steps: [
      {
        stepNumber: 1,
        stepName: 'HR Business Partner Review',
        approverType: 'Role',
        approvers: ['HR Business Partner'],
        requiredApprovals: 1,
        allowDelegation: true,
        allowRejection: true,
        stepSlaHours: 48,
      },
      {
        stepNumber: 2,
        stepName: 'HR Director Approval',
        approverType: 'Role',
        approvers: ['HR Director'],
        requiredApprovals: 1,
        allowDelegation: true,
        allowRejection: true,
        stepSlaHours: 72,
      },
    ],
    routingType: 'Sequential',
    slaHours: 120,
    escalationAfterHours: 144,
    escalationTo: ['user-005'],
    isActive: true,
    version: '1.0',
  },
  {
    id: 'wf-005',
    name: 'Emergency IT Change Approval',
    description: 'Fast-track approval for emergency IT changes',
    decisionType: 'IT Change - Emergency',
    thresholdCondition: 'Emergency/Critical changes',
    steps: [
      {
        stepNumber: 1,
        stepName: 'VP IT Emergency Approval',
        approverType: 'User',
        approvers: ['user-007'],
        requiredApprovals: 1,
        allowDelegation: true,
        allowRejection: false,
        stepSlaHours: 4,
        conditions: 'Emergency declared; service outage or critical security issue',
      },
    ],
    routingType: 'Sequential',
    slaHours: 4,
    escalationAfterHours: 6,
    escalationTo: ['user-003'],
    isActive: true,
    version: '1.1',
  },
];

// Helper functions
export const getWorkflowById = (id: string): ApprovalWorkflow | undefined => {
  return mockWorkflows.find(wf => wf.id === id);
};

export const getWorkflowByDecisionType = (decisionType: string): ApprovalWorkflow[] => {
  return mockWorkflows.filter(wf => wf.decisionType === decisionType);
};

export const getActiveWorkflows = (): ApprovalWorkflow[] => {
  return mockWorkflows.filter(wf => wf.isActive);
};
