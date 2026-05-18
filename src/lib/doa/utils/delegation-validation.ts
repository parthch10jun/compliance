/**
 * Delegation Validation Logic
 * Implements BR-DEL-04, BR-DEL-06
 */

import type { 
  AdvancedDelegation, 
  CircularDelegationCheck, 
  DelegationValidationResult,
  HRMSUser,
  MonetaryCap 
} from '../types/delegation-types';
import { mockHRMSUsers } from '../data/mockHRMS';

// BR-DEL-04: Validate monetary cap
export function validateMonetaryCap(
  delegateCapAmount: number,
  delegatorLimit: number
): { valid: boolean; error?: string } {
  if (delegateCapAmount > delegatorLimit) {
    return {
      valid: false,
      error: `Delegate cap ($${delegateCapAmount.toLocaleString()}) cannot exceed delegator's authority limit ($${delegatorLimit.toLocaleString()})`
    };
  }
  return { valid: true };
}

// BR-DEL-06: Detect circular delegation
export function detectCircularDelegation(
  delegatorId: string,
  delegateId: string,
  existingDelegations: AdvancedDelegation[]
): CircularDelegationCheck {
  const visited = new Set<string>();
  const path: string[] = [];
  
  function hasCycle(currentId: string): boolean {
    if (visited.has(currentId)) {
      // Found a cycle
      const cycleStart = path.indexOf(currentId);
      if (cycleStart !== -1) {
        path.push(currentId); // Complete the cycle
        return true;
      }
    }
    
    visited.add(currentId);
    path.push(currentId);
    
    // Find all active delegations where current user is the delegator
    const userDelegations = existingDelegations.filter(
      d => d.delegatorUser.id === currentId && 
           d.lifecycle.status === 'active'
    );
    
    for (const delegation of userDelegations) {
      if (hasCycle(delegation.delegateUser.id)) {
        return true;
      }
    }
    
    path.pop();
    return false;
  }
  
  // Simulate adding new delegation
  const tempDelegation: Partial<AdvancedDelegation> = {
    delegatorUser: mockHRMSUsers.find(u => u.id === delegatorId)!,
    delegateUser: mockHRMSUsers.find(u => u.id === delegateId)!,
    lifecycle: { status: 'active' } as any,
  };
  
  const testDelegations = [...existingDelegations, tempDelegation as AdvancedDelegation];
  
  // Start from delegate and see if we can reach delegator
  if (hasCycle(delegateId)) {
    return {
      isCircular: true,
      detectedCycle: path,
      isSoDRelevant: true,
      preventionReason: `Circular delegation detected: ${path.map(id => {
        const user = mockHRMSUsers.find(u => u.id === id);
        return user?.name || id;
      }).join(' → ')}`
    };
  }
  
  return {
    isCircular: false,
    isSoDRelevant: false,
  };
}

// BR-DEL-05: Check if manager approval required
export function requiresManagerApproval(
  delegatorGrade: number,
  delegateGrade: number,
  gradeThreshold: number = 1
): { required: boolean; reason?: string; gradeDifference: number } {
  const gradeDifference = delegatorGrade - delegateGrade;
  
  if (gradeDifference > gradeThreshold) {
    return {
      required: true,
      reason: `Delegate is ${gradeDifference} grade${gradeDifference > 1 ? 's' : ''} below delegator (threshold: ${gradeThreshold})`,
      gradeDifference
    };
  }
  
  return { required: false, gradeDifference };
}

// Complete validation
export function validateDelegation(
  delegatorId: string,
  delegateId: string,
  monetaryCap: number | undefined,
  delegatorAuthorityLimit: number,
  existingDelegations: AdvancedDelegation[],
  delegatorGrade: number,
  delegateGrade: number
): DelegationValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for self-delegation
  if (delegatorId === delegateId) {
    errors.push('Cannot delegate to yourself');
  }
  
  // BR-DEL-04: Monetary cap validation
  let monetaryCapValid = true;
  if (monetaryCap !== undefined) {
    const capValidation = validateMonetaryCap(monetaryCap, delegatorAuthorityLimit);
    if (!capValidation.valid) {
      errors.push(capValidation.error!);
      monetaryCapValid = false;
    }
  }
  
  // BR-DEL-06: Circular delegation check
  const circularCheck = detectCircularDelegation(delegatorId, delegateId, existingDelegations);
  if (circularCheck.isCircular) {
    errors.push(circularCheck.preventionReason!);
  }
  
  // BR-DEL-05: Manager approval check
  const approvalCheck = requiresManagerApproval(delegatorGrade, delegateGrade);
  if (approvalCheck.required) {
    warnings.push(approvalCheck.reason!);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    circularDelegation: circularCheck,
    monetaryCapValid,
    approvalRequired: approvalCheck.required ? {
      required: true,
      reason: 'grade_difference',
      gradeDifference: approvalCheck.gradeDifference,
      status: 'pending'
    } : {
      required: false,
      reason: 'none',
      status: 'approved'
    }
  };
}

// BR-DEL-08: Resolve active approver from fallback chain
export function resolveActiveApprover(primaryUser: HRMSUser, existingDelegations: AdvancedDelegation[]): {
  approver: HRMSUser;
  reason: string;
} {
  // Check if primary is on leave
  if (!primaryUser.isOnLeave) {
    return { approver: primaryUser, reason: 'Primary approver available' };
  }
  
  // Find active delegation for primary user
  const delegation = existingDelegations.find(
    d => d.delegatorUser.id === primaryUser.id && 
         d.lifecycle.status === 'active' &&
         (!d.lifecycle.expiryDate || new Date(d.lifecycle.expiryDate) > new Date())
  );
  
  if (delegation) {
    const delegate = delegation.delegateUser;
    
    // Check if delegate is also on leave
    if (!delegate.isOnLeave) {
      return { approver: delegate, reason: 'Primary on leave, routed to delegate' };
    }
    
    // Check if delegate has a delegation
    const delegatesDelegation = existingDelegations.find(
      d => d.delegatorUser.id === delegate.id && 
           d.lifecycle.status === 'active'
    );
    
    if (delegatesDelegation && !delegatesDelegation.delegateUser.isOnLeave) {
      return { 
        approver: delegatesDelegation.delegateUser, 
        reason: 'Primary and delegate on leave, routed to delegate\'s delegate' 
      };
    }
  }
  
  // Fallback to manager
  if (primaryUser.manager) {
    return { 
      approver: primaryUser.manager, 
      reason: 'Primary and delegates unavailable, escalated to manager' 
    };
  }
  
  // Last resort: return primary (will be handled as error case)
  return { approver: primaryUser, reason: 'No fallback available - requires manual intervention' };
}
