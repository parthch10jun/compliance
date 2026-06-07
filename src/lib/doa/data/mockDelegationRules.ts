/**
 * Seed Delegation Rules
 *
 * Eight realistic org-level delegation rules (4 financial, 4 non-financial)
 * that show the full lifecycle: Active, PendingApproval, Draft.
 *
 * These are the "always-present" demo records. User-created rules go to
 * localStorage and are merged on top by the list/detail helpers.
 */

import type { DelegationRule } from '../types/delegation-rule-types';

const isoAt = (date: string, time: string) => `${date}T${time}:00.000Z`;

export const seedDelegationRules: DelegationRule[] = [
  // -------- Financial (RACI) — SEC Distribution capital approval ⭐ RACI demo --------
  // Discreet exception: this delegation follows the SEC Authorization Matrix
  // RACI model instead of an L1/L2/L3 chain. The detail view renders a RACI
  // workflow when `raci` is present; every other delegation is unchanged.
  {
    id: 'dr-sec-raci-001',
    version: 1,
    name: 'Distribution Capital Project Approval — up to SAR 50m (RACI)',
    category: 'Financial',
    authorityType: 'Capital Expenditure Approval',
    description:
      'Authority to approve distribution capital projects within the Planning & Project Management branch up to SAR 50m. Governed by a RACI approval model rather than a sequential L1/L2/L3 chain, mirroring the Tier 2 Distribution & Subscriber Services authorization matrix.',
    justification:
      'Aligns delegated capital approval with the RACI defined in the SEC Authorization Matrix for the Distribution & Subscriber Services business line, so the Responsible, Accountable, Consulted and Informed parties are explicit for every capital decision.',
    scope: {
      monetaryCap: { amount: 50_000_000, currency: 'SAR' },
      businessUnits: ['Distribution & Subscriber Services'],
      functions: ['Capital Planning & Project Monitoring'],
      notes: 'Capital projects above SAR 50m escalate to the Tier governance matrix (BOD / General Assembly).',
    },
    chain: [
      { userId: 'sec-u-201', userName: 'Faisal Al-Otaibi', userTitle: 'Director, Capital Planning & Project Monitoring', position: 1, label: 'R · Responsible' },
      { userId: 'sec-u-202', userName: 'Abdullah Al-Qahtani', userTitle: 'VP, Planning & Project Management', position: 2, label: 'A · Accountable' },
    ],
    raci: [
      { code: 'R', userName: 'Faisal Al-Otaibi', userTitle: 'Director, Capital Planning & Project Monitoring', note: 'Approves the capital project gateway within the delegated cap.' },
      { code: 'A', userName: 'Abdullah Al-Qahtani', userTitle: 'VP, Planning & Project Management', note: 'Accountable for the outcome of the delegated authority.' },
      { code: 'C', userName: 'Mohammed Al-Harbi', userTitle: 'EVP, Distribution & Subscriber Services', note: 'Consulted on cross-directorate and programme-level impact.' },
      { code: 'C', userName: 'Sara Al-Dossari', userTitle: 'Director, Network Studies', note: 'Consulted on load-forecast and network-planning alignment.' },
      { code: 'I', userName: 'Khalid Al-Zahrani', userTitle: 'Group Finance', note: 'Informed of committed capital for budget tracking.' },
    ],
    complianceLinks: [
      {
        framework: 'SEC DoA',
        controlCode: 'T2 · DSS · PPM 1.3',
        controlName: 'Capital Planning & Project Monitoring',
        rationale: 'Mirrors the RACI in the Tier 2 Distribution & Subscriber Services authorization matrix.',
      },
      {
        framework: 'ISO 22301',
        controlCode: '8.4',
        controlName: 'Business continuity — capital resilience',
      },
    ],
    type: 'Permanent',
    effectiveFrom: isoAt('2026-06-06', '00:00'),
    status: 'Active',
    createdByUserId: 'sec-u-202',
    createdByUserName: 'Abdullah Al-Qahtani',
    createdAt: isoAt('2026-06-05', '09:00'),
    approvalAuthorityUserId: 'sec-u-203',
    approvalAuthorityUserName: 'Mohammed Al-Harbi',
    approvalAuthorityTitle: 'EVP, Distribution & Subscriber Services',
    approvalAuthoritySuggestionRationale:
      'Capital cap of SAR 50m sits within the EVP tier for the Distribution & Subscriber Services business line.',
    submittedAt: isoAt('2026-06-05', '09:30'),
    approvedAt: isoAt('2026-06-06', '08:00'),
    approvedComment: 'Approved. RACI assignments confirmed against the Tier 2 authorization matrix.',
    auditTrail: [
      { id: 'au-sec-raci-1', timestamp: isoAt('2026-06-05', '09:00'), actorUserId: 'sec-u-202', actorUserName: 'Abdullah Al-Qahtani', action: 'Created' },
      { id: 'au-sec-raci-2', timestamp: isoAt('2026-06-05', '09:30'), actorUserId: 'sec-u-202', actorUserName: 'Abdullah Al-Qahtani', action: 'Submitted', comment: 'Submitted for EVP approval.' },
      { id: 'au-sec-raci-3', timestamp: isoAt('2026-06-05', '09:31'), actorUserId: 'sec-u-202', actorUserName: 'Abdullah Al-Qahtani', action: 'Notified', comment: 'RACI parties (Responsible, Accountable, Consulted, Informed) notified of designation.' },
      { id: 'au-sec-raci-4', timestamp: isoAt('2026-06-06', '08:00'), actorUserId: 'sec-u-203', actorUserName: 'Mohammed Al-Harbi', action: 'Approved', comment: 'Approved. RACI assignments confirmed against the Tier 2 authorization matrix.' },
    ],
  },

  // -------- Financial 1 — Pay Hike (v3 Active; v1 + v2 in history) ⭐ demo --------
  {
    id: 'dr-001',
    version: 3,
    name: 'Salary Increase Approval — up to 10%',
    category: 'Financial',
    authorityType: 'Salary Increase Approval',
    description:
      'Authority to approve individual salary increases up to 10% of current base salary, with a cumulative annual cap. Privacy-notice acknowledgement required at the L1 step.',
    justification:
      'Decouples routine merit and retention adjustments from CEO sign-off while keeping CHRO and CFO in the loop on cost impact. Cap raised from 1M to 1.5M in May 2026 to accommodate expanded headcount in EMEA.',
    scope: {
      monetaryCap: { amount: 1_500_000, currency: 'AED' },
      percentageCap: 10,
      businessUnits: ['Corporate'],
      notes: 'Annual cumulative impact across all increases under this rule capped at 1.5M AED.',
    },
    chain: [
      { userId: 'user-105', userName: 'Vikram Joshi', userTitle: 'CHRO', position: 1, label: 'L1' },
      { userId: 'user-104', userName: 'Ritu Bansal', userTitle: 'CFO', position: 2, label: 'L2' },
    ],
    complianceLinks: [
      {
        framework: 'SOC 2',
        controlCode: 'CC1.4',
        controlName: 'Control Environment — Personnel',
        rationale: 'Compensation decisions require documented authority and segregation.',
      },
      {
        framework: 'Internal',
        controlCode: 'FIN-AUTH-01',
        controlName: 'Financial Authority Matrix — Compensation',
      },
      {
        framework: 'ISO 27701',
        controlCode: 'A.6.1',
        controlName: 'Privacy obligations in employment terms',
        rationale: 'Pay-hike processing involves personal data; chain handlers must acknowledge privacy obligations.',
      },
    ],
    type: 'Permanent',
    effectiveFrom: isoAt('2026-05-15', '00:00'),
    status: 'Active',
    createdByUserId: 'user-107',
    createdByUserName: 'Priya Nair',
    createdAt: isoAt('2026-03-20', '10:14'),
    approvalAuthorityUserId: 'user-101',
    approvalAuthorityUserName: 'Kundan Verma',
    approvalAuthorityTitle: 'CEO',
    approvalAuthoritySuggestionRationale:
      'Cumulative cap of 1.5M AED falls within executive tier; CEO is the highest-seniority eligible approver.',
    submittedAt: isoAt('2026-03-22', '09:30'),
    approvedAt: isoAt('2026-03-25', '11:45'),
    approvedComment: 'Approved. Quarterly review required after Q3.',
    versionHistory: [
      {
        version: 1,
        name: 'Salary Increase Approval — up to 10%',
        description:
          'Authority to approve individual salary increases up to 10% of current base salary, with a cumulative annual cap.',
        justification:
          'Decouples routine merit and retention adjustments from CEO sign-off while keeping CHRO and CFO in the loop on cost impact.',
        scope: {
          monetaryCap: { amount: 1_000_000, currency: 'AED' },
          percentageCap: 10,
          businessUnits: ['Corporate'],
          notes: 'Annual cumulative impact across all increases under this rule capped at 1M AED.',
        },
        chain: [
          { userId: 'user-105', userName: 'Vikram Joshi', userTitle: 'CHRO', position: 1, label: 'L1' },
          { userId: 'user-104', userName: 'Ritu Bansal', userTitle: 'CFO', position: 2, label: 'L2' },
        ],
        complianceLinks: [
          { framework: 'SOC 2', controlCode: 'CC1.4', controlName: 'Control Environment — Personnel' },
          { framework: 'Internal', controlCode: 'FIN-AUTH-01', controlName: 'Financial Authority Matrix — Compensation' },
        ],
        type: 'Permanent',
        effectiveFrom: isoAt('2026-04-01', '00:00'),
        approvalAuthorityUserId: 'user-101',
        approvalAuthorityUserName: 'Kundan Verma',
        approvalAuthorityTitle: 'CEO',
        approvedAt: isoAt('2026-03-25', '11:45'),
        supersededAt: isoAt('2026-04-20', '14:30'),
        supersededByVersion: 2,
        changesSummary: 'Superseded by v2 — description and justification clarified to reference privacy obligations (non-critical, auto-applied).',
        auditTrail: [
          { id: 'au-001-1', timestamp: isoAt('2026-03-20', '10:14'), actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'Created' },
          { id: 'au-001-2', timestamp: isoAt('2026-03-22', '09:30'), actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'Submitted', comment: 'Submitted for CEO approval.' },
          { id: 'au-001-3', timestamp: isoAt('2026-03-22', '09:31'), actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'Notified', comment: 'Chain designees (Vikram, Ritu) notified of designation.' },
          { id: 'au-001-4', timestamp: isoAt('2026-03-25', '11:45'), actorUserId: 'user-101', actorUserName: 'Kundan Verma', action: 'Approved', comment: 'Approved. Quarterly review required after Q3.' },
        ],
      },
      {
        version: 2,
        name: 'Salary Increase Approval — up to 10%',
        description:
          'Authority to approve individual salary increases up to 10% of current base salary, with a cumulative annual cap. Privacy-notice acknowledgement required at the L1 step.',
        justification:
          'Decouples routine merit and retention adjustments from CEO sign-off while keeping CHRO and CFO in the loop on cost impact.',
        scope: {
          monetaryCap: { amount: 1_000_000, currency: 'AED' },
          percentageCap: 10,
          businessUnits: ['Corporate'],
          notes: 'Annual cumulative impact across all increases under this rule capped at 1M AED.',
        },
        chain: [
          { userId: 'user-105', userName: 'Vikram Joshi', userTitle: 'CHRO', position: 1, label: 'L1' },
          { userId: 'user-104', userName: 'Ritu Bansal', userTitle: 'CFO', position: 2, label: 'L2' },
        ],
        complianceLinks: [
          { framework: 'SOC 2', controlCode: 'CC1.4', controlName: 'Control Environment — Personnel' },
          { framework: 'Internal', controlCode: 'FIN-AUTH-01', controlName: 'Financial Authority Matrix — Compensation' },
        ],
        type: 'Permanent',
        effectiveFrom: isoAt('2026-04-20', '14:30'),
        approvalAuthorityUserId: 'user-101',
        approvalAuthorityUserName: 'Kundan Verma',
        approvalAuthorityTitle: 'CEO',
        approvedAt: isoAt('2026-03-25', '11:45'),
        supersededAt: isoAt('2026-05-15', '10:00'),
        supersededByVersion: 3,
        changesSummary: 'Superseded by v3 — monetary cap raised from 1M to 1.5M AED and ISO 27701 A.6.1 linked (critical, CEO-approved).',
        auditTrail: [
          { id: 'au-001-1', timestamp: isoAt('2026-03-20', '10:14'), actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'Created' },
          { id: 'au-001-2', timestamp: isoAt('2026-03-22', '09:30'), actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'Submitted' },
          { id: 'au-001-3', timestamp: isoAt('2026-03-22', '09:31'), actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'Notified' },
          { id: 'au-001-4', timestamp: isoAt('2026-03-25', '11:45'), actorUserId: 'user-101', actorUserName: 'Kundan Verma', action: 'Approved' },
          {
            id: 'au-001-5', timestamp: isoAt('2026-04-20', '14:30'),
            actorUserId: 'user-107', actorUserName: 'Priya Nair',
            action: 'AutoAppliedNonCritical',
            comment: 'Non-critical edit auto-applied. Description and justification clarified to reference privacy-notice acknowledgement.',
            fieldChanges: [
              { field: 'description', oldValue: 'Authority to approve individual salary increases up to 10% of current base salary, with a cumulative annual cap.', newValue: 'Authority to approve individual salary increases up to 10% of current base salary, with a cumulative annual cap. Privacy-notice acknowledgement required at the L1 step.' },
            ],
          },
          { id: 'au-001-6', timestamp: isoAt('2026-04-20', '14:30'), actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'Notified', comment: 'Chain designees notified of v2.' },
        ],
      },
    ],
    auditTrail: [
      { id: 'au-001-1', timestamp: isoAt('2026-03-20', '10:14'), actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'Created' },
      { id: 'au-001-2', timestamp: isoAt('2026-03-22', '09:30'), actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'Submitted', comment: 'Submitted for CEO approval.' },
      { id: 'au-001-3', timestamp: isoAt('2026-03-22', '09:31'), actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'Notified', comment: 'Chain designees (Vikram, Ritu) notified of designation.' },
      { id: 'au-001-4', timestamp: isoAt('2026-03-25', '11:45'), actorUserId: 'user-101', actorUserName: 'Kundan Verma', action: 'Approved', comment: 'Approved. Quarterly review required after Q3.' },
      {
        id: 'au-001-5', timestamp: isoAt('2026-04-20', '14:30'),
        actorUserId: 'user-107', actorUserName: 'Priya Nair',
        action: 'AutoAppliedNonCritical',
        comment: 'Non-critical edit auto-applied. Description and justification clarified to reference privacy-notice acknowledgement.',
        fieldChanges: [
          { field: 'description', oldValue: 'Authority to approve individual salary increases up to 10% of current base salary, with a cumulative annual cap.', newValue: 'Authority to approve individual salary increases up to 10% of current base salary, with a cumulative annual cap. Privacy-notice acknowledgement required at the L1 step.' },
        ],
      },
      { id: 'au-001-6', timestamp: isoAt('2026-04-20', '14:30'), actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'Notified', comment: 'Chain designees notified of v2.' },
      {
        id: 'au-001-7', timestamp: isoAt('2026-05-10', '09:15'),
        actorUserId: 'user-107', actorUserName: 'Priya Nair',
        action: 'ModificationSubmitted',
        comment: 'Critical modification submitted. Changed: scope (cap raise) and compliance links (added ISO 27701 A.6.1). Routed to Kundan Verma for re-approval.',
        fieldChanges: [
          { field: 'scope', oldValue: { monetaryCap: { amount: 1_000_000, currency: 'AED' } }, newValue: { monetaryCap: { amount: 1_500_000, currency: 'AED' } } },
          { field: 'complianceLinks', oldValue: 2, newValue: 3 },
        ],
      },
      { id: 'au-001-8', timestamp: isoAt('2026-05-15', '10:00'), actorUserId: 'user-101', actorUserName: 'Kundan Verma', action: 'ModificationApproved', comment: 'Approved. EMEA headcount expansion justifies the cap increase; ISO 27701 linkage strengthens privacy posture.' },
    ],
  },

  // -------- Financial 2 — Capital Expenditure (Active) --------
  {
    id: 'dr-002',
    version: 1,
    name: 'Capital Expenditure Approval — up to 5M AED',
    category: 'Financial',
    authorityType: 'Capital Expenditure Approval',
    description: 'Authority to approve capital expenditures up to 5M AED per project.',
    justification:
      'Standardises CapEx routing across business units; ensures Finance Director and CFO both gate spend before commitment.',
    scope: {
      monetaryCap: { amount: 5_000_000, currency: 'AED' },
      businessUnits: ['Corporate', 'North America', 'EMEA', 'APAC', 'LATAM'],
    },
    chain: [
      { userId: 'user-108', userName: 'Arjun Mehta', userTitle: 'Finance Director', position: 1, label: 'L1' },
      { userId: 'user-104', userName: 'Ritu Bansal', userTitle: 'CFO', position: 2, label: 'L2' },
    ],
    complianceLinks: [
      {
        framework: 'SOC 2',
        controlCode: 'CC6.1',
        controlName: 'Logical and Physical Access Controls — Capital Assets',
      },
      {
        framework: 'Internal',
        controlCode: 'FIN-AUTH-02',
        controlName: 'Financial Authority Matrix — Capital Expenditure',
      },
    ],
    type: 'Permanent',
    effectiveFrom: isoAt('2026-01-15', '00:00'),
    status: 'Active',
    createdByUserId: 'user-107',
    createdByUserName: 'Priya Nair',
    createdAt: isoAt('2026-01-05', '14:20'),
    approvalAuthorityUserId: 'user-101',
    approvalAuthorityUserName: 'Kundan Verma',
    approvalAuthorityTitle: 'CEO',
    approvalAuthoritySuggestionRationale:
      'Threshold ≥5M AED maps to highest-seniority approver tier; CEO suggested.',
    submittedAt: isoAt('2026-01-07', '09:00'),
    approvedAt: isoAt('2026-01-12', '16:10'),
    auditTrail: [
      { id: 'au-002-1', timestamp: isoAt('2026-01-05', '14:20'), actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'Created' },
      { id: 'au-002-2', timestamp: isoAt('2026-01-07', '09:00'), actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'Submitted' },
      { id: 'au-002-3', timestamp: isoAt('2026-01-12', '16:10'), actorUserId: 'user-101', actorUserName: 'Kundan Verma', action: 'Approved' },
    ],
  },

  // -------- Financial 3 — Purchase Order (Active) --------
  {
    id: 'dr-003',
    version: 1,
    name: 'Purchase Order Approval — up to 250K AED',
    category: 'Financial',
    authorityType: 'Purchase Order Approval',
    description: 'Authority to approve purchase orders up to 250K AED.',
    justification:
      'Procurement Director can authorise routine spend without escalation; keeps CFO as the policy-level approver of the rule.',
    scope: {
      monetaryCap: { amount: 250_000, currency: 'AED' },
      functions: ['Procurement'],
    },
    chain: [
      { userId: 'user-109', userName: 'Neha Reddy', userTitle: 'Procurement Director', position: 1, label: 'L1' },
    ],
    complianceLinks: [
      {
        framework: 'Internal',
        controlCode: 'FIN-AUTH-03',
        controlName: 'Financial Authority Matrix — Procurement',
      },
    ],
    type: 'Permanent',
    effectiveFrom: isoAt('2026-02-01', '00:00'),
    status: 'Active',
    createdByUserId: 'user-107',
    createdByUserName: 'Priya Nair',
    createdAt: isoAt('2026-01-18', '11:00'),
    approvalAuthorityUserId: 'user-104',
    approvalAuthorityUserName: 'Ritu Bansal',
    approvalAuthorityTitle: 'CFO',
    approvalAuthoritySuggestionRationale:
      'Threshold <1M AED maps to mid-tier; CFO suggested as the highest-seniority Finance approver.',
    submittedAt: isoAt('2026-01-20', '10:00'),
    approvedAt: isoAt('2026-01-25', '15:00'),
    auditTrail: [
      { id: 'au-003-1', timestamp: isoAt('2026-01-18', '11:00'), actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'Created' },
      { id: 'au-003-2', timestamp: isoAt('2026-01-20', '10:00'), actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'Submitted' },
      { id: 'au-003-3', timestamp: isoAt('2026-01-25', '15:00'), actorUserId: 'user-104', actorUserName: 'Ritu Bansal', action: 'Approved' },
    ],
  },

  // -------- Financial 4 — Vendor Contract (PendingApproval) ⭐ demo --------
  {
    id: 'dr-004',
    version: 1,
    name: 'Vendor Contract Approval — up to 2M AED',
    category: 'Financial',
    authorityType: 'Vendor Contract Approval',
    description:
      'Authority to approve vendor contracts (services and goods) up to 2M AED per contract, including renewals.',
    justification:
      'Speeds up vendor onboarding for medium-value contracts while keeping Legal and Finance in the chain. Aligns with new procurement policy effective May 2026.',
    scope: {
      monetaryCap: { amount: 2_000_000, currency: 'AED' },
      functions: ['Procurement', 'Legal'],
    },
    chain: [
      { userId: 'user-110', userName: 'Sanjay Gupta', userTitle: 'Head of Legal', position: 1, label: 'L1' },
      { userId: 'user-104', userName: 'Ritu Bansal', userTitle: 'CFO', position: 2, label: 'L2' },
    ],
    complianceLinks: [
      {
        framework: 'ISO 27001',
        controlCode: 'A.15.1',
        controlName: 'Information security in supplier relationships',
      },
      {
        framework: 'Internal',
        controlCode: 'FIN-AUTH-04',
        controlName: 'Financial Authority Matrix — Vendor Contracts',
      },
    ],
    type: 'Permanent',
    effectiveFrom: isoAt('2026-06-01', '00:00'),
    status: 'PendingApproval',
    createdByUserId: 'user-107',
    createdByUserName: 'Priya Nair',
    createdAt: isoAt('2026-05-20', '09:00'),
    approvalAuthorityUserId: 'user-101',
    approvalAuthorityUserName: 'Kundan Verma',
    approvalAuthorityTitle: 'CEO',
    approvalAuthoritySuggestionRationale:
      'Threshold 1M–5M AED maps to executive tier; CEO suggested given cross-functional scope (Procurement + Legal).',
    submittedAt: isoAt('2026-05-22', '10:30'),
    auditTrail: [
      { id: 'au-004-1', timestamp: isoAt('2026-05-20', '09:00'), actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'Created' },
      { id: 'au-004-2', timestamp: isoAt('2026-05-22', '10:30'), actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'Submitted', comment: 'Effective from 1 June 2026.' },
      { id: 'au-004-3', timestamp: isoAt('2026-05-22', '10:31'), actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'Notified', comment: 'Sanjay Gupta and Ritu Bansal notified of chain designation.' },
    ],
  },

  // -------- Non-Financial 1 — Hiring Authority (PendingModification) ⭐ demo --------
  {
    id: 'dr-005',
    version: 1,
    name: 'Hiring Authority — Grades L1 through L4',
    category: 'Non-Financial',
    authorityType: 'Hiring Approval',
    description:
      'Authority to approve hiring decisions for grades L1 through L4 across all departments.',
    justification:
      'Volume of L1–L4 hiring requires HR Director-level routing; CHRO retains policy ownership.',
    scope: {
      grades: ['L1', 'L2', 'L3', 'L4'],
      businessUnits: ['Corporate', 'North America', 'EMEA', 'APAC', 'LATAM'],
    },
    chain: [
      { userId: 'user-009', userName: 'Maria Garcia', userTitle: 'HR Director', position: 1, label: 'L1' },
    ],
    complianceLinks: [
      {
        framework: 'ISO 27001',
        controlCode: 'A.7.1',
        controlName: 'Prior to employment — screening',
      },
    ],
    type: 'Permanent',
    effectiveFrom: isoAt('2026-01-01', '00:00'),
    status: 'PendingModification',
    createdByUserId: 'user-005',
    createdByUserName: 'Emma Thompson',
    createdAt: isoAt('2025-12-10', '13:00'),
    approvalAuthorityUserId: 'user-105',
    approvalAuthorityUserName: 'Vikram Joshi',
    approvalAuthorityTitle: 'CHRO',
    approvalAuthoritySuggestionRationale:
      'Non-financial, mid-criticality (single chain step, broad scope); CHRO suggested as the HR-domain executive.',
    submittedAt: isoAt('2025-12-12', '08:00'),
    approvedAt: isoAt('2025-12-18', '17:00'),
    pendingModification: {
      proposedAt: isoAt('2026-05-26', '14:30'),
      proposedByUserId: 'user-107',
      proposedByUserName: 'Priya Nair',
      isCritical: true,
      criticalFields: ['scope', 'chain', 'complianceLinks'],
      changes: [
        {
          field: 'scope',
          oldValue: {
            grades: ['L1', 'L2', 'L3', 'L4'],
            businessUnits: ['Corporate', 'North America', 'EMEA', 'APAC', 'LATAM'],
          },
          newValue: {
            grades: ['L1', 'L2', 'L3', 'L4', 'L5'],
            businessUnits: ['Corporate', 'North America', 'EMEA', 'APAC', 'LATAM'],
          },
        },
        {
          field: 'chain',
          oldValue: [
            { userId: 'user-009', userName: 'Maria Garcia', userTitle: 'HR Director', position: 1, label: 'L1' },
          ],
          newValue: [
            { userId: 'user-009', userName: 'Maria Garcia', userTitle: 'HR Director', position: 1, label: 'L1' },
            { userId: 'user-013', userName: 'Nina Patel', userTitle: 'HR Business Partner', position: 2, label: 'L2' },
          ],
        },
        {
          field: 'complianceLinks',
          oldValue: [
            { framework: 'ISO 27001', controlCode: 'A.7.1', controlName: 'Prior to employment — screening' },
          ],
          newValue: [
            { framework: 'ISO 27001', controlCode: 'A.7.1', controlName: 'Prior to employment — screening' },
            { framework: 'ISO 27701', controlCode: 'A.7.4', controlName: 'Privacy training for personnel' },
          ],
        },
      ],
      proposedRule: {
        id: 'dr-005',
        version: 1,
        name: 'Hiring Authority — Grades L1 through L4',
        category: 'Non-Financial',
        authorityType: 'Hiring Approval',
        description:
          'Authority to approve hiring decisions for grades L1 through L4 across all departments.',
        justification:
          'Volume of L1–L4 hiring requires HR Director-level routing; CHRO retains policy ownership.',
        scope: {
          grades: ['L1', 'L2', 'L3', 'L4', 'L5'],
          businessUnits: ['Corporate', 'North America', 'EMEA', 'APAC', 'LATAM'],
        },
        chain: [
          { userId: 'user-009', userName: 'Maria Garcia', userTitle: 'HR Director', position: 1, label: 'L1' },
          { userId: 'user-013', userName: 'Nina Patel', userTitle: 'HR Business Partner', position: 2, label: 'L2' },
        ],
        complianceLinks: [
          { framework: 'ISO 27001', controlCode: 'A.7.1', controlName: 'Prior to employment — screening' },
          { framework: 'ISO 27701', controlCode: 'A.7.4', controlName: 'Privacy training for personnel' },
        ],
        type: 'Permanent',
        effectiveFrom: isoAt('2026-01-01', '00:00'),
        status: 'Active',
        createdByUserId: 'user-005',
        createdByUserName: 'Emma Thompson',
        createdAt: isoAt('2025-12-10', '13:00'),
        approvalAuthorityUserId: 'user-105',
        approvalAuthorityUserName: 'Vikram Joshi',
        approvalAuthorityTitle: 'CHRO',
        approvalAuthoritySuggestionRationale:
          'Non-financial, mid-criticality (single chain step, broad scope); CHRO suggested as the HR-domain executive.',
        submittedAt: isoAt('2025-12-12', '08:00'),
        approvedAt: isoAt('2025-12-18', '17:00'),
        auditTrail: [],
      },
      routedTo: { userId: 'user-105', userName: 'Vikram Joshi' },
      status: 'PendingApproval',
    },
    auditTrail: [
      { id: 'au-005-1', timestamp: isoAt('2025-12-10', '13:00'), actorUserId: 'user-005', actorUserName: 'Emma Thompson', action: 'Created' },
      { id: 'au-005-2', timestamp: isoAt('2025-12-12', '08:00'), actorUserId: 'user-005', actorUserName: 'Emma Thompson', action: 'Submitted' },
      { id: 'au-005-3', timestamp: isoAt('2025-12-18', '17:00'), actorUserId: 'user-105', actorUserName: 'Vikram Joshi', action: 'Approved' },
      {
        id: 'au-005-4',
        timestamp: isoAt('2026-05-26', '14:30'),
        actorUserId: 'user-107',
        actorUserName: 'Priya Nair',
        action: 'ModificationSubmitted',
        comment:
          'Proposed: extend grade range to L5, add Nina Patel (HR Business Partner) as L2, link ISO 27701 A.7.4 for privacy training. Routed to CHRO for re-approval.',
      },
    ],
  },

  // -------- Non-Financial 2 — Leave Approval (Active) --------
  {
    id: 'dr-006',
    version: 1,
    name: 'Leave Approval — up to 30 days',
    category: 'Non-Financial',
    authorityType: 'Leave Approval',
    description:
      'Authority to approve employee leave requests of up to 30 consecutive days.',
    justification:
      'Devolves routine leave approval to managers; longer leave still escalates to HR Director.',
    scope: {
      quantityCap: 30,
      notes: 'Cap measured in consecutive calendar days. Requests >30 days route to HR Director under separate rule.',
    },
    chain: [
      { userId: 'user-011', userName: 'Sophie Martin', userTitle: 'IT Manager', position: 1, label: 'L1 (Line Manager)' },
    ],
    complianceLinks: [
      {
        framework: 'Internal',
        controlCode: 'HR-POL-01',
        controlName: 'Leave Management Policy',
      },
    ],
    type: 'Permanent',
    effectiveFrom: isoAt('2026-01-01', '00:00'),
    status: 'Active',
    createdByUserId: 'user-005',
    createdByUserName: 'Emma Thompson',
    createdAt: isoAt('2025-11-25', '10:00'),
    approvalAuthorityUserId: 'user-105',
    approvalAuthorityUserName: 'Vikram Joshi',
    approvalAuthorityTitle: 'CHRO',
    approvalAuthoritySuggestionRationale:
      'Non-financial, low-criticality (single chain step, quantity-capped); CHRO suggested as HR-domain executive.',
    submittedAt: isoAt('2025-11-26', '12:00'),
    approvedAt: isoAt('2025-11-30', '09:00'),
    auditTrail: [
      { id: 'au-006-1', timestamp: isoAt('2025-11-25', '10:00'), actorUserId: 'user-005', actorUserName: 'Emma Thompson', action: 'Created' },
      { id: 'au-006-2', timestamp: isoAt('2025-11-26', '12:00'), actorUserId: 'user-005', actorUserName: 'Emma Thompson', action: 'Submitted' },
      { id: 'au-006-3', timestamp: isoAt('2025-11-30', '09:00'), actorUserId: 'user-105', actorUserName: 'Vikram Joshi', action: 'Approved' },
    ],
  },

  // -------- Non-Financial 3 — IT Privileged Access (Active) --------
  {
    id: 'dr-007',
    version: 1,
    name: 'IT Privileged Access Grant',
    category: 'Non-Financial',
    authorityType: 'IT Privileged Access Grant',
    description:
      'Authority to approve granting of privileged (admin/root) access to production systems.',
    justification:
      'Privileged access carries elevated security risk; requires both IT operational and security sign-off, with policy ownership at CTO.',
    scope: {
      functions: ['IT', 'Security'],
      notes: 'Applies to production environments only. Sandbox/dev access governed separately.',
    },
    chain: [
      { userId: 'user-007', userName: 'Lisa Anderson', userTitle: 'VP IT', position: 1, label: 'L1' },
      { userId: 'user-106', userName: 'Deepak Sharma', userTitle: 'CISO', position: 2, label: 'L2' },
    ],
    complianceLinks: [
      {
        framework: 'ISO 27001',
        controlCode: 'A.9.1',
        controlName: 'Access control policy',
      },
      {
        framework: 'ISO 27001',
        controlCode: 'A.9.2.3',
        controlName: 'Management of privileged access rights',
      },
    ],
    type: 'Permanent',
    effectiveFrom: isoAt('2026-01-15', '00:00'),
    status: 'Active',
    createdByUserId: 'user-107',
    createdByUserName: 'Priya Nair',
    createdAt: isoAt('2026-01-02', '11:00'),
    approvalAuthorityUserId: 'user-103',
    approvalAuthorityUserName: 'Anurag Kapoor',
    approvalAuthorityTitle: 'CTO',
    approvalAuthoritySuggestionRationale:
      'Non-financial, high-criticality (security-sensitive); CTO suggested as Technology-domain executive.',
    submittedAt: isoAt('2026-01-05', '09:00'),
    approvedAt: isoAt('2026-01-10', '14:30'),
    auditTrail: [
      { id: 'au-007-1', timestamp: isoAt('2026-01-02', '11:00'), actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'Created' },
      { id: 'au-007-2', timestamp: isoAt('2026-01-05', '09:00'), actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'Submitted' },
      { id: 'au-007-3', timestamp: isoAt('2026-01-10', '14:30'), actorUserId: 'user-103', actorUserName: 'Anurag Kapoor', action: 'Approved', comment: 'Approved with monthly access-review requirement.' },
    ],
  },

  // -------- Non-Financial 4 — Policy Exception (Draft) ⭐ demo --------
  {
    id: 'dr-008',
    version: 1,
    name: 'Policy Exception Approval',
    category: 'Non-Financial',
    authorityType: 'Policy Exception Approval',
    description:
      'Authority to grant time-bound exceptions to information-security policies with compensating controls.',
    justification:
      'Centralises exception decisions and ensures every exception has a defined sunset and compensating controls.',
    scope: {
      functions: ['Compliance', 'Risk'],
      notes: 'Exceptions limited to 90 days unless re-approved.',
    },
    chain: [
      { userId: 'user-107', userName: 'Priya Nair', userTitle: 'Head of Governance & Compliance', position: 1, label: 'L1' },
      { userId: 'user-110', userName: 'Sanjay Gupta', userTitle: 'Head of Legal', position: 2, label: 'L2' },
    ],
    complianceLinks: [
      {
        framework: 'ISO 27001',
        controlCode: 'A.5.1',
        controlName: 'Policies for information security',
      },
      {
        framework: 'Internal',
        controlCode: 'GRC-POL-01',
        controlName: 'Policy Exception Management',
      },
    ],
    type: 'Permanent',
    effectiveFrom: isoAt('2026-06-15', '00:00'),
    status: 'Draft',
    createdByUserId: 'user-107',
    createdByUserName: 'Priya Nair',
    createdAt: isoAt('2026-05-25', '16:20'),
    approvalAuthorityUserId: 'user-101',
    approvalAuthorityUserName: 'Kundan Verma',
    approvalAuthorityTitle: 'CEO',
    approvalAuthoritySuggestionRationale:
      'Non-financial, high-criticality (governance-wide impact); CEO suggested as the policy-level authority.',
    auditTrail: [
      { id: 'au-008-1', timestamp: isoAt('2026-05-25', '16:20'), actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'Created' },
    ],
  },
];

export const getSeedDelegationRules = (): DelegationRule[] => seedDelegationRules;
