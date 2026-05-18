/**
 * Mock Delegation Records
 * Realistic delegation scenarios including OOO, permanent, acting, and project-based
 */

import { DelegationRecord } from '../types/doa-types';

export const mockDelegations: DelegationRecord[] = [
  // Active OOO Delegations
  {
    id: 'del-001',
    type: 'OOO',
    delegator: 'user-004',
    delegatorName: 'David Kim',
    delegate: 'user-008',
    delegateName: 'James Wilson',
    authorityType: 'Purchase Order Approval',
    authorityEntryIds: ['entry-fin-002', 'entry-fin-003'],
    scope: 'Approve purchase orders up to $250,000 during vacation period',
    startDate: '2026-05-15',
    endDate: '2026-05-30',
    isActive: true,
    monetaryLimit: 250000,
    transactionLimit: 20,
    geographicScope: ['North America', 'LATAM'],
    approvedBy: 'user-002',
    approvalDate: '2026-05-10',
    rationale: 'Annual vacation - two weeks in May',
    status: 'Approved',
    createdBy: 'user-004',
    createdDate: '2026-05-08',
  },
  {
    id: 'del-002',
    type: 'OOO',
    delegator: 'user-009',
    delegatorName: 'Maria Garcia',
    delegate: 'user-013',
    delegateName: 'Nina Patel',
    authorityType: 'Hiring Approval',
    authorityEntryIds: ['entry-hr-001', 'entry-hr-002'],
    scope: 'Approve hiring decisions for junior and mid-level positions in EMEA',
    startDate: '2026-05-12',
    endDate: '2026-05-20',
    isActive: true,
    transactionLimit: 5,
    geographicScope: ['EMEA'],
    approvedBy: 'user-005',
    approvalDate: '2026-05-09',
    rationale: 'Conference attendance in London',
    status: 'Approved',
    createdBy: 'user-009',
    createdDate: '2026-05-07',
  },
  
  // Expired OOO Delegations
  {
    id: 'del-003',
    type: 'OOO',
    delegator: 'user-006',
    delegatorName: 'Robert Singh',
    delegate: 'user-010',
    delegateName: 'Thomas Brown',
    authorityType: 'Contract Approval',
    authorityEntryIds: ['entry-fin-006'],
    scope: 'Approve contracts up to $100,000',
    startDate: '2026-04-01',
    endDate: '2026-04-15',
    isActive: false,
    monetaryLimit: 100000,
    geographicScope: ['North America'],
    approvedBy: 'user-002',
    approvalDate: '2026-03-28',
    rationale: 'Medical leave',
    status: 'Expired',
    createdBy: 'user-006',
    createdDate: '2026-03-25',
  },
  {
    id: 'del-004',
    type: 'OOO',
    delegator: 'user-011',
    delegatorName: 'Sophie Martin',
    delegate: 'user-015',
    delegateName: 'Emily Zhang',
    authorityType: 'IT Change Approval',
    authorityEntryIds: ['entry-it-001', 'entry-it-002'],
    scope: 'Approve standard and normal IT changes',
    startDate: '2026-03-10',
    endDate: '2026-03-20',
    isActive: false,
    transactionLimit: 15,
    geographicScope: ['EMEA'],
    approvedBy: 'user-007',
    approvalDate: '2026-03-08',
    rationale: 'Training program in Paris',
    status: 'Expired',
    createdBy: 'user-011',
    createdDate: '2026-03-05',
  },
  {
    id: 'del-005',
    type: 'OOO',
    delegator: 'user-012',
    delegatorName: 'Alex Johnson',
    delegate: 'user-008',
    delegateName: 'James Wilson',
    authorityType: 'Expense Approval',
    authorityEntryIds: ['entry-fin-010'],
    scope: 'Approve team expenses up to $5,000',
    startDate: '2026-02-01',
    endDate: '2026-02-10',
    isActive: false,
    monetaryLimit: 5000,
    geographicScope: ['North America'],
    approvedBy: 'user-008',
    approvalDate: '2026-01-30',
    rationale: 'Family emergency',
    status: 'Expired',
    createdBy: 'user-012',
    createdDate: '2026-01-28',
  },
  
  // Permanent Delegations
  {
    id: 'del-006',
    type: 'Permanent',
    delegator: 'user-002',
    delegatorName: 'Michael Rodriguez',
    delegate: 'user-004',
    delegateName: 'David Kim',
    authorityType: 'Budget Approval',
    authorityEntryIds: ['entry-fin-008'],
    scope: 'Approve departmental budgets up to $500,000 for operational efficiency',
    startDate: '2026-01-01',
    isActive: true,
    monetaryLimit: 500000,
    geographicScope: ['North America', 'LATAM'],
    approvedBy: 'user-001',
    approvalDate: '2025-12-20',
    rationale: 'Operational delegation to improve approval cycle times',
    status: 'Approved',
    createdBy: 'user-002',
    createdDate: '2025-12-15',
  },
  {
    id: 'del-007',
    type: 'Permanent',
    delegator: 'user-003',
    delegatorName: 'Jennifer Park',
    delegate: 'user-005',
    delegateName: 'Emma Thompson',
    authorityType: 'HR Policy Decisions',
    authorityEntryIds: ['entry-hr-007'],
    scope: 'Make HR policy decisions and approve terminations',
    startDate: '2026-01-01',
    isActive: true,
    geographicScope: ['Corporate', 'North America', 'EMEA', 'APAC'],
    approvedBy: 'user-001',
    approvalDate: '2025-12-22',
    rationale: 'Organizational restructuring - HR reports to COO',
    status: 'Approved',
    createdBy: 'user-003',
    createdDate: '2025-12-18',
  },
  {
    id: 'del-008',
    type: 'Permanent',
    delegator: 'user-007',
    delegatorName: 'Lisa Anderson',
    delegate: 'user-011',
    delegateName: 'Sophie Martin',
    authorityType: 'Emergency IT Changes',
    authorityEntryIds: ['entry-it-003'],
    scope: 'Approve emergency IT changes for EMEA region',
    startDate: '2026-01-01',
    isActive: true,
    geographicScope: ['EMEA'],
    approvedBy: 'user-003',
    approvalDate: '2025-12-28',
    rationale: 'Regional IT autonomy for faster incident response',
    status: 'Approved',
    createdBy: 'user-007',
    createdDate: '2025-12-20',
  },
  
  // Acting/Interim Delegations
  {
    id: 'del-009',
    type: 'Acting',
    delegator: 'user-008',
    delegatorName: 'James Wilson',
    delegate: 'user-012',
    delegateName: 'Alex Johnson',
    authorityType: 'Finance Director Authority',
    authorityEntryIds: ['entry-fin-002', 'entry-fin-008'],
    scope: 'Full Finance Director authority during secondment',
    startDate: '2026-06-01',
    endDate: '2026-09-30',
    isActive: false,
    monetaryLimit: 500000,
    geographicScope: ['North America'],
    approvedBy: 'user-004',
    approvalDate: '2026-05-10',
    rationale: 'James Wilson seconded to special project - Alex Johnson acting Finance Director',
    status: 'Approved',
    createdBy: 'user-008',
    createdDate: '2026-05-05',
  },
  {
    id: 'del-010',
    type: 'Interim',
    delegator: 'user-010',
    delegatorName: 'Thomas Brown',
    delegate: 'user-014',
    delegateName: 'Carlos Mendez',
    authorityType: 'Procurement Manager Authority',
    authorityEntryIds: ['entry-fin-001', 'entry-it-006'],
    scope: 'Interim procurement authority during transition period',
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    isActive: true,
    monetaryLimit: 50000,
    geographicScope: ['LATAM'],
    approvedBy: 'user-006',
    approvalDate: '2026-03-25',
    rationale: 'Transition period - new procurement structure implementation',
    status: 'Approved',
    createdBy: 'user-010',
    createdDate: '2026-03-20',
  },
];

// Helper functions
export const getDelegationById = (id: string): DelegationRecord | undefined => {
  return mockDelegations.find(del => del.id === id);
};

export const getActiveDelegations = (): DelegationRecord[] => {
  return mockDelegations.filter(del => del.isActive && del.status === 'Approved');
};

export const getDelegationsByType = (type: DelegationRecord['type']): DelegationRecord[] => {
  return mockDelegations.filter(del => del.type === type);
};

export const getDelegationsByDelegator = (delegatorId: string): DelegationRecord[] => {
  return mockDelegations.filter(del => del.delegator === delegatorId);
};

export const getDelegationsByDelegate = (delegateId: string): DelegationRecord[] => {
  return mockDelegations.filter(del => del.delegate === delegateId);
};

export const getExpiringDelegations = (daysAhead: number = 7): DelegationRecord[] => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  
  return mockDelegations.filter(del => {
    if (!del.endDate || !del.isActive) return false;
    const endDate = new Date(del.endDate);
    return endDate >= now && endDate <= futureDate;
  });
};
