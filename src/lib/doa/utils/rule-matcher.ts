/**
 * Rule Matcher
 *
 * Given a request (authority type + quantitative parameters + scope hints),
 * find the best-fit Active DelegationRule. Tightest accommodating cap wins
 * (so a 50K AED purchase order request matches the 250K PO rule, not the 5M
 * CapEx rule that also happens to be financial).
 */

import type { DelegationRule } from '../types/delegation-rule-types';
import { listDelegationRules } from './delegation-rule-store';

export interface MatchInput {
  authorityType: string;
  monetaryAmount?: number;
  currency?: string;
  percentageAmount?: number;
  quantityAmount?: number;
  region?: string;
  businessUnit?: string;
}

export interface MatchResult {
  matched: boolean;
  rule?: DelegationRule;
  reason: string;
  candidatesConsidered: number;
  alternatives: { ruleId: string; ruleName: string; reason: string }[];
}

export function validateAgainstRule(rule: DelegationRule, input: MatchInput): { ok: boolean; reason: string } {
  return ruleCapAccommodates(rule, input);
}

function ruleCapAccommodates(rule: DelegationRule, input: MatchInput): { ok: boolean; reason: string } {
  if (input.monetaryAmount !== undefined && rule.scope.monetaryCap) {
    if (input.monetaryAmount > rule.scope.monetaryCap.amount) {
      return { ok: false, reason: `requested ${input.monetaryAmount} ${input.currency ?? ''} exceeds cap of ${rule.scope.monetaryCap.amount} ${rule.scope.monetaryCap.currency}` };
    }
    if (input.currency && input.currency !== rule.scope.monetaryCap.currency) {
      return { ok: false, reason: `currency mismatch (request: ${input.currency}, rule: ${rule.scope.monetaryCap.currency})` };
    }
  }
  if (input.percentageAmount !== undefined && rule.scope.percentageCap !== undefined) {
    if (input.percentageAmount > rule.scope.percentageCap) {
      return { ok: false, reason: `requested ${input.percentageAmount}% exceeds cap of ${rule.scope.percentageCap}%` };
    }
  }
  if (input.quantityAmount !== undefined && rule.scope.quantityCap !== undefined) {
    if (input.quantityAmount > rule.scope.quantityCap) {
      return { ok: false, reason: `requested ${input.quantityAmount} exceeds cap of ${rule.scope.quantityCap}` };
    }
  }
  if (input.region && (rule.scope.regions ?? []).length > 0 && !rule.scope.regions!.includes(input.region)) {
    return { ok: false, reason: `region '${input.region}' not in rule scope (${rule.scope.regions!.join(', ')})` };
  }
  if (input.businessUnit && (rule.scope.businessUnits ?? []).length > 0 && !rule.scope.businessUnits!.includes(input.businessUnit)) {
    return { ok: false, reason: `business unit '${input.businessUnit}' not in rule scope` };
  }
  return { ok: true, reason: 'fits' };
}

// "Tightness" — lower is tighter. We want the smallest cap that still accommodates,
// so the rule routing is appropriate for the request's size.
function tightnessScore(rule: DelegationRule): number {
  if (rule.scope.monetaryCap) return rule.scope.monetaryCap.amount;
  if (rule.scope.percentageCap !== undefined) return rule.scope.percentageCap * 1_000_000;
  if (rule.scope.quantityCap !== undefined) return rule.scope.quantityCap * 1_000_000;
  return Number.MAX_SAFE_INTEGER;
}

export function matchRule(input: MatchInput): MatchResult {
  if (!input.authorityType.trim()) {
    return { matched: false, reason: 'No authority type specified.', candidatesConsidered: 0, alternatives: [] };
  }

  const all = listDelegationRules();
  // Active and PendingModification rules both enforce the active version.
  const byAuthority = all.filter(r =>
    (r.status === 'Active' || r.status === 'PendingModification') &&
    r.authorityType.toLowerCase() === input.authorityType.toLowerCase()
  );

  if (byAuthority.length === 0) {
    return {
      matched: false,
      reason: `No Active rule exists for authority type "${input.authorityType}".`,
      candidatesConsidered: 0,
      alternatives: [],
    };
  }

  const candidates = byAuthority.map(rule => ({ rule, check: ruleCapAccommodates(rule, input) }));
  const passing = candidates.filter(c => c.check.ok);
  const failing = candidates.filter(c => !c.check.ok);

  if (passing.length === 0) {
    return {
      matched: false,
      reason: 'Request exceeds the scope of every available rule for this authority type.',
      candidatesConsidered: candidates.length,
      alternatives: failing.map(c => ({
        ruleId: c.rule.id,
        ruleName: c.rule.name,
        reason: c.check.reason,
      })),
    };
  }

  // Pick the tightest accommodating rule.
  passing.sort((a, b) => tightnessScore(a.rule) - tightnessScore(b.rule));
  const best = passing[0].rule;

  return {
    matched: true,
    rule: best,
    reason: `Matched ${best.name} (tightest accommodating cap).`,
    candidatesConsidered: candidates.length,
    alternatives: passing.slice(1).map(c => ({
      ruleId: c.rule.id,
      ruleName: c.rule.name,
      reason: 'also accommodates, but has a looser cap',
    })),
  };
}

export function getAvailableAuthorityTypes(): string[] {
  const rules = listDelegationRules();
  const types = new Set<string>();
  rules.forEach(r => {
    if (r.status === 'Active' || r.status === 'PendingModification') types.add(r.authorityType);
  });
  return Array.from(types).sort();
}
