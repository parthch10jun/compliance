/**
 * Saudi Electricity Company — Authorization Matrix, organised as an ARIS-style
 * org hierarchy:
 *
 *   Authority Matrices ▸ Entity ▸ Tier ▸ Business Line ▸ BL-Branch
 *
 * The matrix *shape* is level-dependent:
 *  - Tier scopes carry a GOVERNANCE matrix: each transaction routes through
 *    Input → Review → Recommend → Approve (Group CEO / Committees / BOD /
 *    General Assembly) → Inform, with a Delegate (D/ND) flag and Remarks.
 *  - Business-Line and BL-Branch scopes carry a RACI matrix: organisational
 *    positions become columns and each cell holds an R/A/C/I assignment.
 *
 * One full path is seeded end-to-end (Saudi Energy ▸ Tier 2 ▸ Distribution &
 * Subscriber Services ▸ Planning & Project Management, the FR-03 dataset).
 * Sibling scopes are present but pending onboarding so the tree reflects the
 * real breadth of the organisation. Labels are English-only.
 */

export const SEC_ORG = 'Saudi Electricity Company';

// ===========================================================================
// Governance matrix (Tier scopes)
// ===========================================================================

export interface SECApprove {
  grpCEO?: boolean;
  // Committees
  EC?: boolean;     // Executive Committee
  NRC?: boolean;    // Nomination & Remuneration Committee
  RC?: boolean;     // Risk Committee
  AC?: boolean;     // Audit Committee
  HSSESC?: boolean; // Health, Safety, Security, Environment & Sustainability Committee
  TC?: boolean;     // Technical Committee
  BOD?: boolean;    // Board of Directors
  EGA?: boolean;    // Extraordinary General Assembly
  OGA?: boolean;    // Ordinary General Assembly
}

export interface SECGovTransaction {
  id: string;            // '1.1'
  sectionId: string;     // '1'
  description: string;
  input?: string;
  review?: string;
  recommend?: string;
  approve: SECApprove;
  inform?: string;
  delegate?: string;     // 'D' | 'ND' | ''
  remarks?: string;
}

export interface SECGovSection {
  id: string;
  title: string;
}

export interface SECGovMatrix {
  shape: 'governance';
  sections: SECGovSection[];
  transactions: SECGovTransaction[];
}

// Committee column metadata (order + tooltips for the governance grid header).
export const SEC_COMMITTEES: { key: keyof SECApprove; label: string; full: string }[] = [
  { key: 'EC', label: 'EC', full: 'Executive Committee' },
  { key: 'NRC', label: 'NRC', full: 'Nomination & Remuneration Committee' },
  { key: 'RC', label: 'RC', full: 'Risk Committee' },
  { key: 'AC', label: 'AC', full: 'Audit Committee' },
  { key: 'HSSESC', label: 'HSSESC', full: 'Health, Safety, Security, Environment & Sustainability Committee' },
  { key: 'TC', label: 'TC', full: 'Technical Committee' },
];

// ===========================================================================
// RACI matrix (Business-Line & BL-Branch scopes)
// ===========================================================================

export type RaciCode = 'R' | 'A' | 'C' | 'I';

export const RACI_LEGEND: Record<RaciCode, { word: string; hint: string }> = {
  R: { word: 'Responsible', hint: 'Does the work to complete the task.' },
  A: { word: 'Accountable', hint: 'Ultimately answerable; approves the outcome.' },
  C: { word: 'Consulted', hint: 'Provides input before the decision.' },
  I: { word: 'Informed', hint: 'Kept up to date on progress / outcome.' },
};

export interface SECRole {
  key: string;
  label: string;   // short column header
  full: string;    // tooltip / legend
}

export interface SECRaciTransaction {
  id: string;            // '1.1.1'
  sectionId: string;     // '1.1'
  description: string;
  assignments: Record<string, RaciCode>; // role key -> code
  remarks?: string;
}

export interface SECRaciSection {
  id: string;
  title: string;
}

export interface SECRaciMatrix {
  shape: 'raci';
  roles: SECRole[];
  sections: SECRaciSection[];
  transactions: SECRaciTransaction[];
}

export type SECMatrixPayload = SECGovMatrix | SECRaciMatrix;

// ===========================================================================
// Org-hierarchy tree
// ===========================================================================

export type SECNodeKind = 'root' | 'entity' | 'tier' | 'businessLine' | 'blBranch';

export const SEC_KIND_LABEL: Record<SECNodeKind, string> = {
  root: 'Authority Matrices',
  entity: 'Entity',
  tier: 'Tier',
  businessLine: 'Business Line',
  blBranch: 'BL-Branch',
};

export interface SECNode {
  id: string;
  label: string;
  kind: SECNodeKind;
  subtitle?: string;     // short descriptor shown in overview cards
  version?: string;      // e.g. 'Version 4'
  approvedDate?: string; // ISO
  matrix?: SECMatrixPayload;
  children?: SECNode[];
}

// ---------------------------------------------------------------------------
// Tier 1 — Board & General Assembly governance matrix
// ---------------------------------------------------------------------------

const TIER1_GOVERNANCE: SECGovMatrix = {
  shape: 'governance',
  sections: [
    { id: '1', title: 'Incorporation and Capital Structure' },
    { id: '2', title: 'Strategy, Business Plan & Capital Investment' },
    { id: '3', title: 'Corporate Governance & Delegation' },
    { id: '4', title: 'Financial Reporting & Distributions' },
  ],
  transactions: [
    // ---- Section 1 — Incorporation and Capital Structure ----
    {
      id: '1.1', sectionId: '1',
      description: "Amending the Company's Bylaws",
      input: 'EC / Group CEO', review: 'NRC', recommend: 'BOD',
      approve: { EGA: true },
      inform: 'SERA, Tadawul, CMA', delegate: 'ND',
      remarks: 'All changes to the Bylaws shall comply with the applicable laws and regulations of the Kingdom. Necessary approvals from SERA and the Ministry shall be obtained.',
    },
    {
      id: '1.2', sectionId: '1',
      description: 'Increase / decrease in share capital',
      input: 'Group CEO', review: 'EC', recommend: 'BOD',
      approve: { EGA: true },
      inform: 'Tadawul, CMA', delegate: 'ND',
      remarks: 'Necessary approvals from CMA / Tadawul shall be obtained.',
    },
    {
      id: '1.3', sectionId: '1',
      description: 'New / changes to company listing in securities markets',
      input: 'RC / Group CEO', review: 'EC', recommend: 'BOD',
      approve: { OGA: true },
      inform: 'Tadawul, CMA', delegate: 'ND',
      remarks: 'Necessary approvals from CMA / Tadawul shall be obtained.',
    },
    {
      id: '1.4', sectionId: '1',
      description: 'Share buy-back',
      input: 'Group CEO', review: 'EC', recommend: 'BOD',
      approve: { EGA: true },
      inform: 'Tadawul, CMA', delegate: 'ND',
      remarks: 'Necessary approvals from CMA / Tadawul shall be obtained.',
    },
    {
      id: '1.5', sectionId: '1',
      description: 'Issuing preferential shares',
      input: 'Group CEO', review: 'EC', recommend: 'BOD',
      approve: { EGA: true },
      inform: 'Tadawul, CMA', delegate: 'ND',
      remarks: 'Necessary approvals from CMA / Tadawul shall be obtained.',
    },
    {
      id: '1.6', sectionId: '1',
      description: 'Conversion of ordinary shares into preferential shares',
      input: 'Group CEO', review: 'EC', recommend: 'BOD',
      approve: { EGA: true },
      inform: 'Tadawul, CMA', delegate: 'ND',
      remarks: 'Necessary approvals from CMA / Tadawul shall be obtained.',
    },

    // ---- Section 2 — Strategy, Business Plan & Capital Investment ----
    {
      id: '2.1', sectionId: '2',
      description: 'Approval of the corporate strategy and long-term plan',
      input: 'Group CEO', review: 'EC', recommend: 'BOD',
      approve: { BOD: true },
      inform: 'SERA', delegate: 'ND',
      remarks: 'Reviewed annually; material deviations require BOD re-approval.',
    },
    {
      id: '2.2', sectionId: '2',
      description: 'Annual business plan and operating / capital budget',
      input: 'Group CEO', review: 'EC', recommend: 'AC',
      approve: { BOD: true },
      inform: '', delegate: 'ND',
      remarks: 'Budget overruns beyond approved tolerance escalate to BOD.',
    },
    {
      id: '2.3', sectionId: '2',
      description: 'Major capital investment projects above SAR 500m',
      input: 'Group CEO', review: 'EC', recommend: 'TC',
      approve: { BOD: true },
      inform: '', delegate: 'D',
      remarks: 'Projects ≤ SAR 500m may be approved by the Group CEO under delegated authority.',
    },
    {
      id: '2.4', sectionId: '2',
      description: 'Entry into a new line of business or market',
      input: 'Group CEO', review: 'EC', recommend: 'BOD',
      approve: { BOD: true },
      inform: 'SERA', delegate: 'ND',
    },

    // ---- Section 3 — Corporate Governance & Delegation ----
    {
      id: '3.1', sectionId: '3',
      description: 'Appointment / removal of the Group CEO',
      input: 'NRC', review: 'NRC', recommend: 'BOD',
      approve: { BOD: true },
      inform: 'SERA, CMA', delegate: 'ND',
    },
    {
      id: '3.2', sectionId: '3',
      description: 'Approval of Board committee charters and terms of reference',
      input: 'Group CEO', review: 'AC', recommend: 'NRC',
      approve: { BOD: true },
      inform: '', delegate: 'ND',
    },
    {
      id: '3.3', sectionId: '3',
      description: 'Approval / amendment of this Delegation of Authority matrix',
      input: 'Group CEO', review: 'AC', recommend: 'NRC',
      approve: { BOD: true },
      inform: 'All functions', delegate: 'ND',
      remarks: 'Changes follow the DoA update process and require BOD approval.',
    },
    {
      id: '3.4', sectionId: '3',
      description: 'Approval of enterprise risk appetite statement',
      input: 'Group CEO', review: 'RC', recommend: 'RC',
      approve: { BOD: true },
      inform: '', delegate: 'ND',
    },

    // ---- Section 4 — Financial Reporting & Distributions ----
    {
      id: '4.1', sectionId: '4',
      description: 'Approval of annual audited financial statements',
      input: 'Group CEO', review: 'AC', recommend: 'BOD',
      approve: { OGA: true },
      inform: 'Tadawul, CMA', delegate: 'ND',
    },
    {
      id: '4.2', sectionId: '4',
      description: 'Recommendation of annual dividend distribution',
      input: 'Group CEO', review: 'AC', recommend: 'BOD',
      approve: { OGA: true },
      inform: 'Tadawul, CMA', delegate: 'ND',
    },
    {
      id: '4.3', sectionId: '4',
      description: 'Appointment / re-appointment of the external auditor',
      input: 'AC', review: 'AC', recommend: 'BOD',
      approve: { OGA: true },
      inform: 'CMA', delegate: 'ND',
    },
    {
      id: '4.4', sectionId: '4',
      description: 'Approval of interim (quarterly) financial statements',
      input: 'Group CEO', review: 'AC', recommend: 'AC',
      approve: { BOD: true },
      inform: 'Tadawul, CMA', delegate: 'ND',
    },
  ],
};

// ---------------------------------------------------------------------------
// Business Line — Distribution & Subscriber Services (directorate roll-up RACI)
// ---------------------------------------------------------------------------

const DSS_ROLES: SECRole[] = [
  { key: 'evp', label: 'EVP DSS', full: 'EVP, Distribution & Subscriber Services' },
  { key: 'vp_ppm', label: 'VP PPM', full: 'VP, Planning & Project Management' },
  { key: 'vp_am', label: 'VP AM', full: 'VP, Asset Management' },
  { key: 'vp_ops', label: 'VP Ops', full: 'VP, Distribution Operations' },
  { key: 'vp_sub', label: 'VP Subs', full: 'VP, Subscriber Services' },
];

const DSS_BUSINESS_LINE: SECRaciMatrix = {
  shape: 'raci',
  roles: DSS_ROLES,
  sections: [
    { id: '1', title: 'Business Line Oversight' },
  ],
  transactions: [
    {
      id: '1.1', sectionId: '1',
      description: 'Approve the business line annual operating plan and budget',
      assignments: { vp_ppm: 'R', evp: 'A', vp_am: 'C', vp_ops: 'C', vp_sub: 'I' },
      remarks: 'Consolidated from directorate submissions; escalates to Group plan.',
    },
    {
      id: '1.2', sectionId: '1',
      description: 'Approve the business line capital investment programme',
      assignments: { vp_ppm: 'R', evp: 'A', vp_am: 'C', vp_ops: 'C' },
      remarks: 'Programmes above the BL threshold escalate to the Tier governance matrix.',
    },
    {
      id: '1.3', sectionId: '1',
      description: 'Prioritise cross-directorate capital projects',
      assignments: { vp_ppm: 'R', evp: 'A', vp_am: 'C', vp_ops: 'C', vp_sub: 'I' },
    },
    {
      id: '1.4', sectionId: '1',
      description: 'Endorse organisational changes within the business line',
      assignments: { evp: 'A', vp_ppm: 'C', vp_am: 'C', vp_ops: 'C', vp_sub: 'C' },
      remarks: 'People-impacting changes are routed to Group HR for final approval.',
    },
  ],
};

// ---------------------------------------------------------------------------
// BL-Branch — Planning & Project Management (FR-03, full seed)
// ---------------------------------------------------------------------------

const PPM_ROLES: SECRole[] = [
  { key: 'evp', label: 'EVP DSS', full: 'EVP, Distribution & Subscriber Services' },
  { key: 'vp', label: 'VP PPM', full: 'VP, Planning & Project Management' },
  { key: 'dir_np', label: 'Dir. NP', full: 'Director, Network Planning' },
  { key: 'dir_ns', label: 'Dir. NS', full: 'Director, Network Studies' },
  { key: 'dir_cp', label: 'Dir. CP', full: 'Director, Capital Planning & Project Monitoring' },
  { key: 'spec', label: 'Specialist', full: 'Planning Specialist / Engineer' },
];

const PPM_BRANCH: SECRaciMatrix = {
  shape: 'raci',
  roles: PPM_ROLES,
  sections: [
    { id: '1.1', title: 'Network Planning' },
    { id: '1.2', title: 'Network Studies' },
    { id: '1.3', title: 'Capital Planning & Project Monitoring' },
  ],
  transactions: [
    {
      id: '1.1.1', sectionId: '1.1',
      description: 'Review commercial terms in the electricity service connection agreement',
      assignments: { spec: 'R', dir_np: 'A', vp: 'C', evp: 'I' },
      remarks: 'Non-standard terms are escalated to the VP for endorsement.',
    },
    {
      id: '1.2.1', sectionId: '1.2',
      description: 'Prepare and issue the annual load forecast report',
      assignments: { spec: 'R', dir_ns: 'A', dir_np: 'C', vp: 'C', evp: 'I' },
      remarks: 'Feeds the capital plan and the unified materials requirement plan.',
    },
    {
      id: '1.3.1', sectionId: '1.3',
      description: 'Form the distribution committee for preliminary capital plan approval',
      assignments: { dir_cp: 'R', vp: 'A', evp: 'C', dir_np: 'I', dir_ns: 'I' },
    },
    {
      id: '1.3.2', sectionId: '1.3',
      description: 'Approve gateway (stage-gate) models for capital projects',
      assignments: { dir_cp: 'R', vp: 'C', evp: 'A' },
      remarks: 'Gateway approval is non-delegable above the branch capital threshold.',
    },
    {
      id: '1.3.3', sectionId: '1.3',
      description: 'Approve the unified requirement plan for distribution materials',
      assignments: { dir_cp: 'R', vp: 'A', dir_ns: 'C', evp: 'I' },
    },
  ],
};

// ---------------------------------------------------------------------------
// The tree
// ---------------------------------------------------------------------------

export const SEC_TREE: SECNode = {
  id: 'root',
  label: 'Authority Matrices',
  kind: 'root',
  subtitle: SEC_ORG,
  children: [
    {
      id: 'saudi-energy',
      label: 'Saudi Energy',
      kind: 'entity',
      subtitle: 'Parent entity — Saudi Electricity Company',
      children: [
        {
          id: 'tier-1',
          label: 'Tier 1',
          kind: 'tier',
          subtitle: 'Board & General Assembly governance',
          version: 'Version 4',
          approvedDate: '2025-09-15',
          matrix: TIER1_GOVERNANCE,
        },
        {
          id: 'tier-2',
          label: 'Tier 2',
          kind: 'tier',
          subtitle: 'Executive & management authorities',
          children: [
            {
              id: 'bl-dss',
              label: 'Distribution & Subscriber Services',
              kind: 'businessLine',
              subtitle: 'Distribution network & customer-facing services',
              version: 'Version 2',
              approvedDate: '2026-01-20',
              matrix: DSS_BUSINESS_LINE,
              children: [
                {
                  id: 'br-ppm',
                  label: 'Planning & Project Management',
                  kind: 'blBranch',
                  subtitle: 'Network planning, studies & capital planning',
                  version: 'Version 2',
                  approvedDate: '2026-01-20',
                  matrix: PPM_BRANCH,
                },
                {
                  id: 'br-am',
                  label: 'Asset Management',
                  kind: 'blBranch',
                  subtitle: 'Asset strategy, maintenance & reliability',
                },
                {
                  id: 'br-sg',
                  label: 'Smart Grids',
                  kind: 'blBranch',
                  subtitle: 'Metering, automation & grid intelligence',
                },
              ],
            },
            {
              id: 'bl-gen',
              label: 'Generation & Sustainability',
              kind: 'businessLine',
              subtitle: 'Power generation fleet & sustainability',
            },
          ],
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Tree helpers
// ---------------------------------------------------------------------------

/** Depth-first lookup of a node by id. */
export function findSECNode(id: string, node: SECNode = SEC_TREE): SECNode | null {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const hit = findSECNode(id, child);
    if (hit) return hit;
  }
  return null;
}

/** Path of nodes from the root down to (and including) the target id. */
export function getSECPath(id: string, node: SECNode = SEC_TREE, trail: SECNode[] = []): SECNode[] {
  const next = [...trail, node];
  if (node.id === id) return next;
  for (const child of node.children ?? []) {
    const hit = getSECPath(id, child, next);
    if (hit.length) return hit;
  }
  return [];
}

/** First node in the tree (DFS) that actually carries a matrix. */
export function firstSECNodeWithMatrix(node: SECNode = SEC_TREE): SECNode | null {
  if (node.matrix) return node;
  for (const child of node.children ?? []) {
    const hit = firstSECNodeWithMatrix(child);
    if (hit) return hit;
  }
  return null;
}
