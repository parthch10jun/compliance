/**
 * Saudi Electricity Company — Authorization Matrix (Tier 1) seed data.
 *
 * Faithful to SEC's Excel layout: each transaction routes through
 * Input → Review → Recommend → Approve (by Group CEO / Committees / BOD /
 * General Assembly) → Inform, with a Delegate (D/ND) flag and Remarks.
 *
 * Section 1 (Incorporation and Capital Structure) is transcribed from the
 * source document. Sections 2-4 are representative placeholders pending the
 * full dataset.
 */

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

export interface SECTransaction {
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

export interface SECSection {
  id: string;
  category: string;      // matches a top category tab
  title: string;
}

export interface SECMatrix {
  organisation: string;
  title: string;
  version: string;
  approvedDate: string;  // ISO
  categories: string[];
  sections: SECSection[];
  transactions: SECTransaction[];
}

export const SEC_MATRIX: SECMatrix = {
  organisation: 'Saudi Electricity Company',
  title: 'Authorization Matrix — Tier 1',
  version: 'Version 4',
  approvedDate: '2025-09-15',
  categories: [
    'Incorporation & Capital',
    'Strategy & Planning',
    'Governance',
    'Investor Affairs',
    'Legal Affairs',
    'Contracting & Purchasing',
    'Finance & Accounts',
    'Treasury & Investment',
    'Human Resources',
  ],
  sections: [
    { id: '1', category: 'Incorporation & Capital', title: 'Incorporation and Capital Structure' },
    { id: '2', category: 'Strategy & Planning', title: 'Strategy, Business Plan & Capital Investment' },
    { id: '3', category: 'Governance', title: 'Corporate Governance & Delegation' },
    { id: '4', category: 'Finance & Accounts', title: 'Financial Reporting & Distributions' },
  ],
  transactions: [
    // ---- Section 1 — Incorporation and Capital Structure (from source) ----
    {
      id: '1.1', sectionId: '1',
      description: "Amending the Company's Bylaws",
      input: 'EC / Group CEO', review: 'NRC', recommend: 'BOD',
      approve: { EGA: true },
      inform: 'SERA, Tadawul, CMA', delegate: 'ND',
      remarks: 'All changes to the Bylaws shall be in compliance with the applicable laws and regulations of the Kingdom. Necessary approvals from SERA and MC shall be obtained.',
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

    // ---- Section 2 — Strategy, Business Plan & Capital Investment (placeholder) ----
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

    // ---- Section 3 — Corporate Governance & Delegation (placeholder) ----
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

    // ---- Section 4 — Financial Reporting & Distributions (placeholder) ----
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

// Committee column metadata (order + tooltips for the grid header).
export const SEC_COMMITTEES: { key: keyof SECApprove; label: string; full: string }[] = [
  { key: 'EC', label: 'EC', full: 'Executive Committee' },
  { key: 'NRC', label: 'NRC', full: 'Nomination & Remuneration Committee' },
  { key: 'RC', label: 'RC', full: 'Risk Committee' },
  { key: 'AC', label: 'AC', full: 'Audit Committee' },
  { key: 'HSSESC', label: 'HSSESC', full: 'Health, Safety, Security, Environment & Sustainability Committee' },
  { key: 'TC', label: 'TC', full: 'Technical Committee' },
];
