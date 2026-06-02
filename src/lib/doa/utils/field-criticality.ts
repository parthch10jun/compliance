/**
 * Field Criticality Analysis
 *
 * Diffs two DelegationRule versions and classifies the change set as
 * critical (requires full re-approval, ends at the approval authority)
 * or non-critical (auto-applied + audit log + chain designees notified).
 *
 * Critical:
 *   authorityType, category, scope (any sub-field), chain (any change),
 *   complianceLinks, type, approvalAuthorityUserId
 *
 * Non-critical:
 *   name, description, justification, effectiveFrom, effectiveTo
 */

import type { DelegationRule } from '../types/delegation-rule-types';
import { CRITICAL_FIELDS } from '../types/delegation-rule-types';

export interface FieldChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface ModificationAnalysis {
  isCritical: boolean;
  criticalFields: string[];
  nonCriticalFields: string[];
  changes: FieldChange[];
}

/**
 * Stable stringify — sorts object keys at every depth so the resulting
 * string compares equal regardless of insertion order. Without this, a
 * scope object built freshly by the edit form differs from the seed
 * object's serialised form merely because the form inserts keys in a
 * different order than the seed defines them — producing phantom
 * "critical change" warnings on initial load.
 */
function stableStringify(value: unknown): string {
  return JSON.stringify(value, (_key, v) => {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      return Object.keys(v as Record<string, unknown>)
        .sort()
        .reduce<Record<string, unknown>>((acc, k) => {
          acc[k] = (v as Record<string, unknown>)[k];
          return acc;
        }, {});
    }
    return v;
  });
}

function deepEqual(a: unknown, b: unknown): boolean {
  return stableStringify(a) === stableStringify(b);
}

const TRACKED_FIELDS: Array<keyof DelegationRule> = [
  'name',
  'category',
  'authorityType',
  'description',
  'justification',
  'scope',
  'chain',
  'complianceLinks',
  'type',
  'effectiveFrom',
  'effectiveTo',
  'approvalAuthorityUserId',
];

export function diffRules(oldRule: DelegationRule, newRule: DelegationRule): FieldChange[] {
  const changes: FieldChange[] = [];
  TRACKED_FIELDS.forEach(field => {
    const oldValue = oldRule[field];
    const newValue = newRule[field];
    if (!deepEqual(oldValue, newValue)) {
      changes.push({ field, oldValue, newValue });
    }
  });
  return changes;
}

export function analyzeModification(
  oldRule: DelegationRule,
  newRule: DelegationRule,
): ModificationAnalysis {
  const changes = diffRules(oldRule, newRule);
  const criticalSet = new Set<string>(CRITICAL_FIELDS as readonly string[]);
  const criticalFields = changes.map(c => c.field).filter(f => criticalSet.has(f));
  const nonCriticalFields = changes.map(c => c.field).filter(f => !criticalSet.has(f));
  return {
    isCritical: criticalFields.length > 0,
    criticalFields,
    nonCriticalFields,
    changes,
  };
}

export function isFieldCritical(field: string): boolean {
  return (CRITICAL_FIELDS as readonly string[]).includes(field);
}
