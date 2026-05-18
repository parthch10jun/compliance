/**
 * Approval Routing Engine
 * Deterministic routing with delegation, scope, and effective-date logic
 */

import type { ApprovalRequest } from '../types/doa-types';
import type { AdvancedDelegation } from '../types/delegation-types';
import type { WorkflowDefinition, RoutingResult, ApprovalChainStep, ApproverInfo } from '../types/workflow-types';
import { mockHRMSUsers, isUserOnLeave } from '../data/mockHRMS';
import { resolveActiveApprover } from '../utils/delegation-validation';

/**
 * Main routing engine - determines approval chain for a request
 */
export function routeRequest(
  request: ApprovalRequest,
  workflow: WorkflowDefinition,
  activeDelegations: AdvancedDelegation[]
): RoutingResult {
  
  const approvalChain: ApprovalChainStep[] = [];
  const skippedSteps: number[] = [];
  let totalEstimatedHours = 0;
  
  for (const step of workflow.steps) {
    // Check skip rules
    const shouldSkip = evaluateSkipRules(request, step, workflow);
    
    if (shouldSkip.skip) {
      skippedSteps.push(step.stepNumber);
      continue;
    }
    
    // Resolve approvers (considering delegation, leave status, pools)
    const approvers = resolveApprovers(step, activeDelegations);
    
    // Calculate deadline
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + step.sla.stepSlaHours);
    
    approvalChain.push({
      stepNumber: step.stepNumber,
      stepName: step.stepName,
      approvers,
      routingType: step.routingType,
      requiredApprovals: step.requiredApprovals,
      slaHours: step.sla.stepSlaHours,
      deadline: deadline.toISOString(),
      canSkip: step.skipRules ? step.skipRules.length > 0 : false,
      skipReason: shouldSkip.reason,
    });
    
    totalEstimatedHours += step.sla.stepSlaHours;
  }
  
  return {
    requestId: request.id,
    workflowId: workflow.id,
    approvalChain,
    estimatedCompletionHours: totalEstimatedHours,
    skipApplied: skippedSteps.length > 0,
    skippedSteps: skippedSteps.length > 0 ? skippedSteps : undefined,
    routingReason: `Routed based on ${workflow.name} - ${approvalChain.length} approval steps required`,
  };
}

/**
 * Evaluate skip rules for a step
 */
function evaluateSkipRules(
  request: ApprovalRequest,
  step: any,
  workflow: WorkflowDefinition
): { skip: boolean; reason?: string } {
  
  if (!step.skipRules || step.skipRules.length === 0) {
    return { skip: false };
  }
  
  // Example: Skip manager approval if originator is senior enough
  const originator = mockHRMSUsers.find(u => u.id === request.requestedBy);
  if (!originator) {
    return { skip: false };
  }
  
  // Skip L1 manager if originator is Grade 8+
  if (step.stepNumber === 1 && step.stepName.includes('Manager') && originator.grade >= 8) {
    return {
      skip: true,
      reason: `Skipped - originator (${originator.name}, Grade ${originator.grade}) exceeds required approval level`
    };
  }
  
  return { skip: false };
}

/**
 * Resolve actual approvers considering delegation, leave, and pools
 */
function resolveApprovers(
  step: any,
  activeDelegations: AdvancedDelegation[]
): ApproverInfo[] {
  
  const approvers: ApproverInfo[] = [];
  
  // Handle approval pools
  if (step.approvalPool) {
    const pool = step.approvalPool;
    const activeMembers = pool.members
      .map(userId => mockHRMSUsers.find(u => u.id === userId))
      .filter(u => u && !isUserOnLeave(u.id));
    
    approvers.push({
      userId: pool.id,
      userName: pool.name,
      userRole: 'Approval Pool',
      isPool: true,
      poolInfo: {
        ...pool,
        activeMembers: activeMembers.map(u => u!.id)
      },
      isDelegated: false,
      onLeave: false,
      estimatedResponseTime: step.sla.stepSlaHours,
    });
    
    return approvers;
  }
  
  // Handle individual approvers
  if (step.approvers && step.approvers.length > 0) {
    for (const approverId of step.approvers) {
      const user = mockHRMSUsers.find(u => u.id === approverId);
      if (!user) continue;
      
      // Check if user is on leave or has delegation
      const isOnLeave = isUserOnLeave(user.id);
      const delegation = activeDelegations.find(
        d => d.delegatorUser.id === approverId && d.lifecycle.status === 'active'
      );
      
      if (delegation) {
        // User has active delegation
        approvers.push({
          userId: delegation.delegateUser.id,
          userName: delegation.delegateUser.name,
          userRole: delegation.delegateUser.roles[0]?.name || 'Unknown',
          isPool: false,
          isDelegated: true,
          originalApprover: user.name,
          onLeave: isOnLeave,
          estimatedResponseTime: step.sla.stepSlaHours,
        });
      } else if (isOnLeave && user.manager) {
        // User on leave, escalate to manager
        approvers.push({
          userId: user.manager.id,
          userName: user.manager.name,
          userRole: user.manager.roles[0]?.name || 'Unknown',
          isPool: false,
          isDelegated: true,
          originalApprover: user.name,
          onLeave: false,
          estimatedResponseTime: step.sla.stepSlaHours,
        });
      } else {
        // Standard approver
        approvers.push({
          userId: user.id,
          userName: user.name,
          userRole: user.roles[0]?.name || 'Unknown',
          isPool: false,
          isDelegated: false,
          onLeave: isOnLeave,
          estimatedResponseTime: step.sla.stepSlaHours,
        });
      }
    }
  }
  
  return approvers;
}

/**
 * Check if request can be recalled
 */
export function canRecallRequest(request: ApprovalRequest): {
  canRecall: boolean;
  requiresConsent: boolean;
  reason: string;
} {
  
  // Can always recall before first approval
  if (!request.approvalHistory || request.approvalHistory.length === 0) {
    return {
      canRecall: true,
      requiresConsent: false,
      reason: 'No approvals yet - request can be recalled freely'
    };
  }
  
  // After first approval, requires approver consent
  return {
    canRecall: true,
    requiresConsent: true,
    reason: 'Request has received approvals - requires approver consent to recall'
  };
}
