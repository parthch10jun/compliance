/**
 * Seed Delegation Requests
 *
 * Three realistic runtime requests showing the chain-progression states:
 *  - PendingDecision at L1 (just submitted; L1 hasn't acted)
 *  - PendingDecision at L2 (L1 approved; awaiting L2)
 *  - Approved (terminal, single-step chain)
 */

import type { DelegationRequest } from '../types/request-types';

const isoAt = (date: string, time: string) => `${date}T${time}:00.000Z`;

export const seedDelegationRequests: DelegationRequest[] = [
  // ── R-001: PendingDecision at L1 (Vikram hasn't acted yet) ────────────
  {
    id: 'req-001',
    title: 'Salary increase — Sanjana Iyer, 8%',
    authorityType: 'Salary Increase Approval',
    description:
      'Annual merit increase for Sanjana Iyer (Senior Engineer, Engineering). Current base AED 240,000; proposed increase 8% → AED 259,200 (+AED 19,200/yr).',
    justification:
      'Top-quartile performance review; retention-critical role on the data platform team. Manager and skip-level both endorse.',
    monetaryAmount: 19_200,
    currency: 'AED',
    percentageAmount: 8,
    affectedEntity: 'Sanjana Iyer (Senior Engineer)',
    businessUnit: 'Corporate',
    matchedRuleId: 'dr-001',
    matchedRuleName: 'Salary Increase Approval — up to 10%',
    matchedRuleVersion: 1,
    matchedRuleChain: [
      { userId: 'user-105', userName: 'Vikram Joshi', userTitle: 'CHRO', position: 1, label: 'L1' },
      { userId: 'user-104', userName: 'Ritu Bansal', userTitle: 'CFO', position: 2, label: 'L2' },
    ],
    status: 'PendingDecision',
    currentStepIndex: 0,
    stepActions: [],
    requestedByUserId: 'user-012',
    requestedByUserName: 'Alex Johnson',
    requestedAt: isoAt('2026-05-26', '11:15'),
  },

  // ── R-002: PendingDecision at L2 (L1 already approved) ────────────────
  {
    id: 'req-002',
    title: 'CapEx — Dubai office expansion (Phase 2)',
    authorityType: 'Capital Expenditure Approval',
    description:
      'Build-out of Phase 2 floor at the Dubai office: workstations, meeting rooms, AV equipment, networking refresh. Vendor: Element 5 Interiors. Total 1.8M AED.',
    justification:
      'Hiring plan for 2026 requires +60 seats by Q3. Quotes vetted against three vendors; Element 5 came in 12% below the next best with a faster delivery slot.',
    monetaryAmount: 1_800_000,
    currency: 'AED',
    affectedEntity: 'Dubai office — Phase 2 build-out',
    region: 'EMEA',
    businessUnit: 'EMEA',
    matchedRuleId: 'dr-002',
    matchedRuleName: 'Capital Expenditure Approval — up to 5M AED',
    matchedRuleVersion: 1,
    matchedRuleChain: [
      { userId: 'user-108', userName: 'Arjun Mehta', userTitle: 'Finance Director', position: 1, label: 'L1' },
      { userId: 'user-104', userName: 'Ritu Bansal', userTitle: 'CFO', position: 2, label: 'L2' },
    ],
    status: 'PendingDecision',
    currentStepIndex: 1,
    stepActions: [
      {
        stepIndex: 0,
        approverUserId: 'user-108',
        approverUserName: 'Arjun Mehta',
        action: 'Approved',
        timestamp: isoAt('2026-05-26', '14:40'),
        comment: 'Budget line verified against the 2026 office-expansion allocation. OK to proceed to CFO.',
      },
    ],
    requestedByUserId: 'user-008',
    requestedByUserName: 'James Wilson',
    requestedAt: isoAt('2026-05-25', '09:30'),
  },

  // ── R-003: Approved (single-step chain, terminal) ─────────────────────
  {
    id: 'req-003',
    title: 'Purchase order — Salesforce enterprise licenses (FY26 renewal)',
    authorityType: 'Purchase Order Approval',
    description:
      'Annual renewal of 240 Salesforce Enterprise seats + Sandbox + Einstein add-on. Total 180,000 AED, paid annually.',
    justification:
      'Existing licenses expire 30 June 2026; renewal at current tier with vendor discount confirmed for FY26.',
    monetaryAmount: 180_000,
    currency: 'AED',
    affectedEntity: 'Salesforce (vendor renewal)',
    businessUnit: 'Corporate',
    matchedRuleId: 'dr-003',
    matchedRuleName: 'Purchase Order Approval — up to 250K AED',
    matchedRuleVersion: 1,
    matchedRuleChain: [
      { userId: 'user-109', userName: 'Neha Reddy', userTitle: 'Procurement Director', position: 1, label: 'L1' },
    ],
    status: 'Approved',
    currentStepIndex: -1,
    stepActions: [
      {
        stepIndex: 0,
        approverUserId: 'user-109',
        approverUserName: 'Neha Reddy',
        action: 'Approved',
        timestamp: isoAt('2026-05-25', '16:20'),
        comment: 'Renewal terms verified against master agreement. Approved.',
      },
    ],
    requestedByUserId: 'user-014',
    requestedByUserName: 'Carlos Mendez',
    requestedAt: isoAt('2026-05-25', '11:00'),
    finalizedAt: isoAt('2026-05-25', '16:20'),
  },
];
