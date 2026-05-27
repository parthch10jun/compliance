/**
 * Approval-Authority Suggester
 *
 * Given a delegation rule's threshold and scope, suggests the most appropriate
 * user with canApproveDelegations. The user can override; the suggester just
 * picks a sensible default and explains why.
 *
 * Tiering (financial):
 *   ≥5M AED         → 'highest'  (CEO tier)
 *   1M – <5M AED    → 'executive' (CFO/COO tier)
 *   <1M AED         → 'mid'       (VP/Head tier, but executive if domain match available)
 *
 * Tiering (non-financial):
 *   chain depth ≥3  → 'highest'
 *   chain depth =2  → 'executive'
 *   chain depth =1  → 'mid'
 *
 * A "domain hint" (Finance/HR/IT/Operations/Compliance) refines tier 'mid' /
 * 'executive' picks to the domain executive when available.
 */

import type { DoAUser } from '../types/doa-types';
import type {
  ChainDesignee,
  DelegationCategory,
  DelegationScope,
} from '../types/delegation-rule-types';
import { mockUsers } from '../data/mockUsers';

export type ApproverTier = 'highest' | 'executive' | 'mid';

export interface SuggestionInput {
  category: DelegationCategory;
  scope: DelegationScope;
  chain: ChainDesignee[];
  authorityType?: string;
  departmentHint?: string;
}

export interface SuggestionResult {
  suggestedUserId: string;
  suggestedUserName: string;
  suggestedUserTitle: string;
  tier: ApproverTier;
  rationale: string;
  alternatives: { userId: string; userName: string; userTitle: string; seniorityLevel: number }[];
}

const DEPARTMENT_KEYWORDS: { keywords: string[]; department: string }[] = [
  { keywords: ['finance', 'capex', 'budget', 'expenditure', 'payment', 'invoice'], department: 'Finance' },
  { keywords: ['hr', 'hiring', 'salary', 'compensation', 'leave', 'termination', 'pay hike'], department: 'HR' },
  { keywords: ['it', 'technology', 'tech', 'access', 'system', 'privileged'], department: 'IT' },
  { keywords: ['legal', 'contract', 'vendor', 'litigation'], department: 'Legal' },
  { keywords: ['compliance', 'policy', 'risk', 'governance', 'audit'], department: 'Compliance' },
  { keywords: ['procurement', 'purchase order', 'supplier'], department: 'Procurement' },
  { keywords: ['operations', 'operational'], department: 'Operations' },
];

function inferDepartmentFromContext(input: SuggestionInput): string | undefined {
  if (input.departmentHint) return input.departmentHint;
  const haystack = `${input.authorityType ?? ''} ${input.scope.notes ?? ''} ${(input.scope.functions ?? []).join(' ')}`.toLowerCase();
  for (const { keywords, department } of DEPARTMENT_KEYWORDS) {
    if (keywords.some(k => haystack.includes(k))) return department;
  }
  return undefined;
}

function pickTier(input: SuggestionInput): ApproverTier {
  if (input.category === 'Financial') {
    const amount = input.scope.monetaryCap?.amount ?? 0;
    if (amount >= 5_000_000) return 'highest';
    if (amount >= 1_000_000) return 'executive';
    return 'mid';
  }
  // Non-financial: tier by chain depth (proxy for criticality)
  const depth = input.chain.length;
  if (depth >= 3) return 'highest';
  if (depth === 2) return 'executive';
  return 'mid';
}

function seniorityForTier(tier: ApproverTier): number {
  if (tier === 'highest') return 10;
  if (tier === 'executive') return 8;
  return 6;
}

function eligibleApprovers(): DoAUser[] {
  return mockUsers.filter(u => u.canApproveDelegations && u.isActive);
}

function describeThreshold(input: SuggestionInput): string {
  if (input.category === 'Financial') {
    const amount = input.scope.monetaryCap?.amount;
    const currency = input.scope.monetaryCap?.currency ?? 'AED';
    if (!amount) return 'no monetary cap set';
    if (amount >= 5_000_000) return `≥5M ${currency}`;
    if (amount >= 1_000_000) return `1M–5M ${currency}`;
    return `<1M ${currency}`;
  }
  return `${input.chain.length}-step chain (non-financial)`;
}

export function suggestApprovalAuthority(input: SuggestionInput): SuggestionResult {
  const tier = pickTier(input);
  const minSeniority = seniorityForTier(tier);
  const department = inferDepartmentFromContext(input);
  const pool = eligibleApprovers();

  // Filter pool by tier (≥ minSeniority for that tier; allow one step below
  // if 'mid' since the mid tier maps to E1 VPs not the C-suite).
  const tierFloor = tier === 'mid' ? minSeniority - 1 : minSeniority;
  const tieredPool = pool
    .filter(u => (u.seniorityLevel ?? 0) >= tierFloor)
    .sort((a, b) => (b.seniorityLevel ?? 0) - (a.seniorityLevel ?? 0));

  // Try department match first
  let chosen: DoAUser | undefined;
  let domainNote = '';
  if (department) {
    chosen = tieredPool.find(u => u.department === department);
    if (chosen) domainNote = ` Domain-matched to ${department}.`;
  }

  // Fallback: highest seniority eligible
  if (!chosen) chosen = tieredPool[0];

  // Last-ditch fallback: any approver
  if (!chosen) chosen = pool.sort((a, b) => (b.seniorityLevel ?? 0) - (a.seniorityLevel ?? 0))[0];

  const tierLabel = tier === 'highest' ? 'highest-seniority' : tier === 'executive' ? 'executive' : 'mid';
  const rationale = chosen
    ? `Threshold ${describeThreshold(input)} maps to ${tierLabel} approver tier.${domainNote} ${chosen.role} suggested.`
    : 'No eligible approver found.';

  const alternatives = pool
    .filter(u => u.id !== chosen?.id)
    .sort((a, b) => (b.seniorityLevel ?? 0) - (a.seniorityLevel ?? 0))
    .slice(0, 5)
    .map(u => ({
      userId: u.id,
      userName: u.name,
      userTitle: u.role,
      seniorityLevel: u.seniorityLevel ?? 0,
    }));

  return {
    suggestedUserId: chosen?.id ?? '',
    suggestedUserName: chosen?.name ?? '',
    suggestedUserTitle: chosen?.role ?? '',
    tier,
    rationale,
    alternatives,
  };
}
