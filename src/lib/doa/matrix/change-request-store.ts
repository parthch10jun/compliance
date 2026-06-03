/**
 * Change Request store + seed.
 *
 * Browser-only persistence for ChangeRequest records. Seed includes four
 * CRs spanning the lifecycle (Draft, L1Endorsed, UnderReview, Implemented)
 * to make the inbox / status views demo-ready from the first load.
 */

import type {
  CRAuditEntry,
  CRProposal,
  CRReviewerStep,
  CRValidatorStep,
  ChangeRequest,
} from './change-request-types';

const STORAGE_KEY = 'doa_change_requests_v1';

const isBrowser = (): boolean => typeof window !== 'undefined';

type Store = Record<string, ChangeRequest>;

function readStore(): Store {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

function writeStore(s: Store): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

// ---------- Seed data ----------------------------------------------------

const defaultReviewerSteps = (): CRReviewerStep[] => [
  { team: 'RiskAndAudit', required: true,
    reviewerUserId: 'user-107', reviewerUserName: 'Priya Nair' },
  { team: 'Legal', required: true,
    reviewerUserId: 'user-110', reviewerUserName: 'Sanjay Gupta' },
  { team: 'Finance', required: true,
    reviewerUserId: 'user-108', reviewerUserName: 'Arjun Mehta' },
  { team: 'InvestmentGovernance', required: true,
    reviewerUserId: 'user-102', reviewerUserName: 'Subhash Iyer' },
  { team: 'Procurement', required: false,
    reviewerUserId: 'user-109', reviewerUserName: 'Neha Reddy' },
  { team: 'HR', required: false,
    reviewerUserId: 'user-105', reviewerUserName: 'Vikram Joshi' },
];

const defaultValidatorSteps = (): CRValidatorStep[] => [
  { role: 'CFO',
    validatorUserId: 'user-104', validatorUserName: 'Ritu Bansal' },
  { role: 'SVP_General_Counsel',
    validatorUserId: 'user-110', validatorUserName: 'Sanjay Gupta' },
  { role: 'Risk_Audit_Committee',
    validatorUserId: 'user-107', validatorUserName: 'Priya Nair' },
];

const isoAt = (date: string, time: string) => `${date}T${time}:00.000Z`;

const seedRequests: ChangeRequest[] = [
  // --- CR-001 — Draft (Adjust D.1.3 CFO cap) -------------------------------
  {
    id: 'cr-001',
    number: 'CR-2026-001',
    requestorUserId: 'user-008',
    requestorUserName: 'James Wilson',
    requestorRole: 'Finance Director',
    requestDate: isoAt('2026-06-02', '11:30'),
    changeType: 'Adjust',
    targetDelegationId: 'D.1.3',
    proposedChange:
      'Raise CFO authority cap on Project Contract approval (D.1.3) from US$ 50m to US$ 75m.',
    proposal: {
      kind: 'Adjust',
      targetDelegationId: 'D.1.3',
      cellChanges: [
        {
          roleId: 'role-cfo',
          roleName: 'CFO',
          before: { hasUnlimitedAuthority: false, monetaryCap: { amount: 50_000_000, currency: 'USD' } },
          after:  { hasUnlimitedAuthority: false, monetaryCap: { amount: 75_000_000, currency: 'USD' } },
        },
      ],
    } as CRProposal,
    justification:
      'EMEA pipeline contracts in Q1/Q2 trending toward the $50-75m bracket. Current ceiling routes every such contract to CEO — projecting 14-16 escalations in H1 alone. Raising the cap reduces CEO bottleneck without weakening control (CFO still gates the dual-key with Project Director).',
    impactAssessment:
      'Operations: faster contracting on EMEA pipeline. Controls: no weakening — dual-key with PD preserved. Compliance: no SOX/audit impact identified. Cumulative annual exposure under CFO sole authority increases by ~30% projected.',
    effectiveDate: isoAt('2026-07-01', '00:00'),
    reviewerSteps: defaultReviewerSteps(),
    validatorSteps: defaultValidatorSteps(),
    status: 'Draft',
    createdAt: isoAt('2026-06-02', '11:30'),
    auditTrail: [
      { id: 'au-cr-001-1', timestamp: isoAt('2026-06-02', '11:30'),
        actorUserId: 'user-008', actorUserName: 'James Wilson',
        action: 'Created' },
    ],
  },

  // --- CR-002 — L1Endorsed (Adjust D.2.6 Procurement Analyst cap) ----------
  {
    id: 'cr-002',
    number: 'CR-2026-002',
    requestorUserId: 'user-014',
    requestorUserName: 'Carlos Mendez',
    requestorRole: 'Procurement Lead',
    requestDate: isoAt('2026-05-28', '14:10'),
    contactPersonUserId: 'user-109',
    contactPersonUserName: 'Neha Reddy',
    changeType: 'Adjust',
    targetDelegationId: 'D.2.6',
    proposedChange:
      'Raise Procurement Analyst authority on D.2.6 (Invoice and payment approval) from US$ 1m to US$ 5m, keeping the existing "within approved plans" qualifier and 3-year contracting-duration limit.',
    proposal: {
      kind: 'Adjust',
      targetDelegationId: 'D.2.6',
      cellChanges: [
        {
          roleId: 'role-procurement-analyst',
          roleName: 'Procurement Analyst',
          before: {
            hasUnlimitedAuthority: false,
            monetaryCap: { amount: 1_000_000, currency: 'USD' },
            conditions: 'within approved plans - Max Contracting Duration 3 years',
          },
          after: {
            hasUnlimitedAuthority: false,
            monetaryCap: { amount: 5_000_000, currency: 'USD' },
            conditions: 'within approved plans - Max Contracting Duration 3 years',
          },
        },
      ],
    } as CRProposal,
    justification:
      'PO volume in the $1-5m range (~40/qtr) is currently bottlenecked at PPM level. Raising the Procurement Analyst ceiling provides routine throughput while keeping all $5m+ POs at PPM and above.',
    impactAssessment:
      'Operations: ~40 routine POs/qtr clear faster. Controls: tightened at the new layer — segregation-of-duties checks still apply at the Analyst level. Compliance: aligns with the new procurement operating model already approved by the Operations Committee.',
    effectiveDate: isoAt('2026-07-15', '00:00'),
    l1EndorserUserId: 'user-102',
    l1EndorserUserName: 'Subhash Iyer',
    l1EndorsedAt: isoAt('2026-05-29', '09:45'),
    l1EndorsementComment:
      'Endorsed. Aligned with the procurement transformation programme; recommend prioritising.',
    reviewerSteps: defaultReviewerSteps(),
    validatorSteps: defaultValidatorSteps(),
    status: 'L1Endorsed',
    createdAt: isoAt('2026-05-28', '14:10'),
    submittedAt: isoAt('2026-05-28', '16:00'),
    auditTrail: [
      { id: 'au-cr-002-1', timestamp: isoAt('2026-05-28', '14:10'),
        actorUserId: 'user-014', actorUserName: 'Carlos Mendez', action: 'Created' },
      { id: 'au-cr-002-2', timestamp: isoAt('2026-05-28', '16:00'),
        actorUserId: 'user-014', actorUserName: 'Carlos Mendez', action: 'Submitted',
        comment: 'Submitted for L1 endorsement to Subhash Iyer (COO).' },
      { id: 'au-cr-002-3', timestamp: isoAt('2026-05-29', '09:45'),
        actorUserId: 'user-102', actorUserName: 'Subhash Iyer', action: 'L1Endorsed',
        comment: 'Endorsed. Aligned with the procurement transformation programme.' },
    ],
  },

  // --- CR-003 — UnderReview (Clarify A.3.2 explanatory notes) -------------
  {
    id: 'cr-003',
    number: 'CR-2026-003',
    requestorUserId: 'user-007',
    requestorUserName: 'Lisa Anderson',
    requestorRole: 'VP IT',
    requestDate: isoAt('2026-05-15', '08:30'),
    changeType: 'Clarify',
    targetDelegationId: 'A.3.2',
    proposedChange:
      'Clarify in the explanatory notes for A.3.2 (Policy approvals) that IT-domain policies require dual sign-off (CTO + CISO) when they touch privileged access or production systems.',
    proposal: {
      kind: 'Clarify',
      targetDelegationId: 'A.3.2',
      explanatoryNotesBefore:
        'Any policy which is not for the Board or Shareholders to approve can be approved by the appropriate member of the Management Team.',
      explanatoryNotesAfter:
        'Any policy which is not for the Board or Shareholders to approve can be approved by the appropriate member of the Management Team. IT-domain policies that touch privileged access or production systems require dual sign-off (CTO + CISO).',
    } as CRProposal,
    justification:
      'Recent audit finding noted ambiguity about who can solely approve IT policies. Adding the dual-sign-off rule for privileged-access policies tightens the control without changing approval authority for routine IT policies.',
    impactAssessment:
      'Operations: minor — only privileged-access policies affected (~3/year). Controls: tightened. Compliance: addresses Audit Finding AUD-2026-014 (Privileged Access Governance).',
    effectiveDate: isoAt('2026-07-01', '00:00'),
    l1EndorserUserId: 'user-103',
    l1EndorserUserName: 'Anurag Kapoor',
    l1EndorsedAt: isoAt('2026-05-16', '10:00'),
    l1EndorsementComment: 'Endorsed. Closes AUD-2026-014.',
    reviewerSteps: [
      { team: 'RiskAndAudit', required: true,
        reviewerUserId: 'user-107', reviewerUserName: 'Priya Nair',
        action: 'Approved', actionDate: isoAt('2026-05-18', '11:00'),
        comment: 'Triage accepted. Routing to Legal next given regulatory overlap on privileged access.' },
      { team: 'Legal', required: true,
        reviewerUserId: 'user-110', reviewerUserName: 'Sanjay Gupta',
        action: 'Approved', actionDate: isoAt('2026-05-22', '15:30'),
        comment: 'Wording reviewed against current Acceptable Use Policy and ISO 27001 A.9.2.3. No legal concerns.' },
      { team: 'Finance', required: true,
        reviewerUserId: 'user-108', reviewerUserName: 'Arjun Mehta' },
      { team: 'InvestmentGovernance', required: true,
        reviewerUserId: 'user-102', reviewerUserName: 'Subhash Iyer' },
      { team: 'Procurement', required: false,
        reviewerUserId: 'user-109', reviewerUserName: 'Neha Reddy' },
      { team: 'HR', required: false,
        reviewerUserId: 'user-105', reviewerUserName: 'Vikram Joshi' },
    ],
    validatorSteps: defaultValidatorSteps(),
    status: 'UnderReview',
    createdAt: isoAt('2026-05-15', '08:30'),
    submittedAt: isoAt('2026-05-15', '17:00'),
    auditTrail: [
      { id: 'au-cr-003-1', timestamp: isoAt('2026-05-15', '08:30'),
        actorUserId: 'user-007', actorUserName: 'Lisa Anderson', action: 'Created' },
      { id: 'au-cr-003-2', timestamp: isoAt('2026-05-15', '17:00'),
        actorUserId: 'user-007', actorUserName: 'Lisa Anderson', action: 'Submitted' },
      { id: 'au-cr-003-3', timestamp: isoAt('2026-05-16', '10:00'),
        actorUserId: 'user-103', actorUserName: 'Anurag Kapoor', action: 'L1Endorsed',
        comment: 'Endorsed. Closes AUD-2026-014.' },
      { id: 'au-cr-003-4', timestamp: isoAt('2026-05-18', '11:00'),
        actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'TriageAccepted',
        comment: 'Accepted for review. Routing to reviewer cascade.' },
      { id: 'au-cr-003-5', timestamp: isoAt('2026-05-22', '15:30'),
        actorUserId: 'user-110', actorUserName: 'Sanjay Gupta', action: 'ReviewerApproved',
        comment: 'Legal review complete.' },
    ],
  },

  // --- CR-004 — Implemented (AddNew interim PD delegation, produced v1.4) --
  {
    id: 'cr-004',
    number: 'CR-2025-014',
    requestorUserId: 'user-015',
    requestorUserName: 'Emily Zhang',
    requestorRole: 'IT Project Manager',
    requestDate: isoAt('2025-12-18', '09:00'),
    changeType: 'AddNew',
    targetDelegationId: 'D.1.13',
    proposedChange:
      'Add D.1.13 — interim Project Director designation for Project Beacon, time-boxed to 6 months, with US$ 10m authority.',
    proposal: {
      kind: 'AddNew',
      newDelegationId: 'D.1.13',
      subsectionId: 'D1',
      description:
        'Interim Project Director designation for Project Beacon — temporary authority assignment for the duration of the project ramp-up phase.',
      explanatoryNotes:
        'Interim designations are time-boxed (max 6 months) and carry reduced caps versus permanent role. Renewal requires CEO re-approval.',
      cellsAdded: [
        {
          roleId: 'role-project-directors',
          roleName: 'Project Directors',
          before: null,
          after: {
            hasUnlimitedAuthority: false,
            monetaryCap: { amount: 10_000_000, currency: 'USD' },
            conditions: 'Project Beacon only · time-boxed 6 months',
          },
        },
      ],
    } as CRProposal,
    justification:
      'Project Beacon enters its critical 2026 execution phase without a permanent Project Director assigned. Interim mechanism allows operational continuity while a permanent candidate is recruited and onboarded.',
    impactAssessment:
      'Operations: continuity on Project Beacon. Controls: interim designation has time-boxed authority (max 6 months) and reduced caps versus permanent role. Compliance: aligns with HR Policy on Interim Assignments.',
    effectiveDate: isoAt('2026-01-01', '00:00'),
    l1EndorserUserId: 'user-103',
    l1EndorserUserName: 'Anurag Kapoor',
    l1EndorsedAt: isoAt('2025-12-19', '11:00'),
    reviewerSteps: defaultReviewerSteps().map(step => ({
      ...step,
      action: 'Approved' as const,
      actionDate: isoAt('2025-12-22', '14:00'),
      comment: `${step.team} reviewed and approved.`,
    })),
    validatorSteps: defaultValidatorSteps().map(step => ({
      ...step,
      action: 'Approved' as const,
      actionDate: isoAt('2025-12-29', '16:00'),
      comment: `${step.role} validation complete.`,
    })),
    approverUserId: 'user-101',
    approverUserName: 'Kundan Verma',
    approverScope: 'CEO',
    approverDecision: 'Approved',
    approverDate: isoAt('2025-12-31', '17:30'),
    approverComment: 'Approved. Time-boxed to 6 months; permanent search to commence in parallel.',
    implementedByUserId: 'user-107',
    implementedByUserName: 'Priya Nair',
    implementedDate: isoAt('2026-01-01', '09:00'),
    resultingMatrixVersion: '1.4',
    communicationsNotes:
      'Day-1 briefing note circulated. Project Beacon team notified via Comms team.',
    status: 'Implemented',
    createdAt: isoAt('2025-12-18', '09:00'),
    submittedAt: isoAt('2025-12-18', '17:00'),
    closedAt: isoAt('2026-01-01', '09:00'),
    auditTrail: [
      { id: 'au-cr-004-1', timestamp: isoAt('2025-12-18', '09:00'),
        actorUserId: 'user-015', actorUserName: 'Emily Zhang', action: 'Created' },
      { id: 'au-cr-004-2', timestamp: isoAt('2025-12-18', '17:00'),
        actorUserId: 'user-015', actorUserName: 'Emily Zhang', action: 'Submitted' },
      { id: 'au-cr-004-3', timestamp: isoAt('2025-12-19', '11:00'),
        actorUserId: 'user-103', actorUserName: 'Anurag Kapoor', action: 'L1Endorsed' },
      { id: 'au-cr-004-4', timestamp: isoAt('2025-12-20', '10:00'),
        actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'TriageAccepted' },
      { id: 'au-cr-004-5', timestamp: isoAt('2025-12-22', '14:00'),
        actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'ReviewersComplete',
        comment: 'All reviewers approved.' },
      { id: 'au-cr-004-6', timestamp: isoAt('2025-12-29', '16:00'),
        actorUserId: 'user-104', actorUserName: 'Ritu Bansal', action: 'ValidatorsComplete',
        comment: 'All three validators signed off.' },
      { id: 'au-cr-004-7', timestamp: isoAt('2025-12-31', '17:30'),
        actorUserId: 'user-101', actorUserName: 'Kundan Verma', action: 'Approved',
        comment: 'Time-boxed to 6 months.' },
      { id: 'au-cr-004-8', timestamp: isoAt('2026-01-01', '09:00'),
        actorUserId: 'user-107', actorUserName: 'Priya Nair', action: 'Implemented',
        comment: 'Matrix bumped to v1.4. Comms team notified.' },
    ],
  },
];

// ---------- API ---------------------------------------------------------

export function listChangeRequests(): ChangeRequest[] {
  const store = readStore();
  const merged: ChangeRequest[] = [];
  const seen = new Set<string>();
  Object.values(store).forEach(cr => {
    merged.push(cr);
    seen.add(cr.id);
  });
  seedRequests.forEach(cr => {
    if (!seen.has(cr.id)) merged.push(cr);
  });
  return merged.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getChangeRequestById(id: string): ChangeRequest | undefined {
  const store = readStore();
  return store[id] ?? seedRequests.find(cr => cr.id === id);
}

export function saveChangeRequest(cr: ChangeRequest): void {
  const store = readStore();
  store[cr.id] = cr;
  writeStore(store);
}

export function deleteChangeRequest(id: string): void {
  const store = readStore();
  delete store[id];
  writeStore(store);
}

export function resetChangeRequests(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function generateCRId(): string {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 7);
  return `cr-${t}-${r}`;
}

export function generateCRAuditId(): string {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 7);
  return `au-cr-${t}-${r}`;
}

export function appendCRAuditEntry(crId: string, entry: CRAuditEntry): void {
  const cr = getChangeRequestById(crId);
  if (!cr) return;
  saveChangeRequest({ ...cr, auditTrail: [...cr.auditTrail, entry] });
}
