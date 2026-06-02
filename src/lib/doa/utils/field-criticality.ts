/**
 * Field Criticality Analysis
 *
 * Diffs two DelegationRule versions and classifies each change. The diff
 * is granular at the sub-field level for scope so that, e.g. a region
 * tag toggle is reported separately from a monetary-cap change.
 *
 * Critical (requires re-approval by the rule's approval authority):
 *   - scope.monetaryCap     — bounds the request envelope (money)
 *   - scope.percentageCap   — bounds the request envelope (%)
 *   - chain                 — who handles runtime requests (people)
 *
 * Non-critical (auto-applies, audit-logged, chain notified, version bumps):
 *   - name, description, justification
 *   - effectiveFrom, effectiveTo, type
 *   - category, authorityType
 *   - complianceLinks
 *   - approvalAuthorityUserId
 *   - scope.quantityCap, scope.regions, scope.functions,
 *     scope.businessUnits, scope.grades, scope.notes
 */

import type { DelegationRule, DelegationScope } from '../types/delegation-rule-types';

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

const CRITICAL_PATHS = new Set<string>([
  'chain',
  'scope.monetaryCap',
  'scope.percentageCap',
]);

export function isCriticalChange(path: string): boolean {
  return CRITICAL_PATHS.has(path);
}

/**
 * Stable stringify — sorts object keys at every depth so the resulting
 * string compares equal regardless of insertion order. Without this, a
 * scope object built freshly by the edit form differs from the seed
 * object's serialised form merely because the form inserts keys in a
 * different order than the seed defines them.
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

/**
 * Treat "absent" and "empty" as equivalent — so toggling a region tag on
 * then off (which leaves an empty array) compares equal to the original
 * (which never had the key).
 */
function normalize(value: unknown): unknown {
  if (value === undefined || value === null) return undefined;
  if (Array.isArray(value) && value.length === 0) return undefined;
  if (typeof value === 'string' && value === '') return undefined;
  return value;
}

function deepEqual(a: unknown, b: unknown): boolean {
  const na = normalize(a);
  const nb = normalize(b);
  if (na === undefined && nb === undefined) return true;
  if (na === undefined || nb === undefined) return false;
  return stableStringify(na) === stableStringify(nb);
}

const TOP_LEVEL_TRACKED: Array<keyof DelegationRule> = [
  'name',
  'category',
  'authorityType',
  'description',
  'justification',
  'chain',
  'complianceLinks',
  'type',
  'effectiveFrom',
  'effectiveTo',
  'approvalAuthorityUserId',
];

const SCOPE_SUB_PATHS: Array<keyof DelegationScope> = [
  'monetaryCap',
  'percentageCap',
  'quantityCap',
  'regions',
  'functions',
  'businessUnits',
  'grades',
  'notes',
];

export function diffRules(oldRule: DelegationRule, newRule: DelegationRule): FieldChange[] {
  const changes: FieldChange[] = [];

  TOP_LEVEL_TRACKED.forEach(field => {
    const oldValue = oldRule[field];
    const newValue = newRule[field];
    if (!deepEqual(oldValue, newValue)) {
      changes.push({ field, oldValue, newValue });
    }
  });

  SCOPE_SUB_PATHS.forEach(sub => {
    const oldValue = oldRule.scope?.[sub];
    const newValue = newRule.scope?.[sub];
    if (!deepEqual(oldValue, newValue)) {
      changes.push({ field: `scope.${sub}`, oldValue, newValue });
    }
  });

  return changes;
}

export function analyzeModification(
  oldRule: DelegationRule,
  newRule: DelegationRule,
): ModificationAnalysis {
  const changes = diffRules(oldRule, newRule);
  const criticalFields = changes.map(c => c.field).filter(isCriticalChange);
  const nonCriticalFields = changes.map(c => c.field).filter(f => !isCriticalChange(f));
  return {
    isCritical: criticalFields.length > 0,
    criticalFields,
    nonCriticalFields,
    changes,
  };
}

export function isFieldCritical(field: string): boolean {
  return isCriticalChange(field);
}
