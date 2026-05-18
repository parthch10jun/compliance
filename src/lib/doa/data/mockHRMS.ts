/**
 * Mock HRMS Data
 * Simulates HRMS integration for BR-DEL-01 and BR-DEL-08
 */

import type { HRMSUser, Role } from '../types/delegation-types';

export const mockRoles: Role[] = [
  { id: 'role-cfo', name: 'Chief Financial Officer', grade: 10, department: 'Finance', authorityLimit: 10000000, currency: 'USD' },
  { id: 'role-vp-finance', name: 'VP Finance', grade: 9, department: 'Finance', authorityLimit: 5000000, currency: 'USD' },
  { id: 'role-director-finance', name: 'Finance Director', grade: 8, department: 'Finance', authorityLimit: 1000000, currency: 'USD' },
  { id: 'role-sr-manager-finance', name: 'Senior Finance Manager', grade: 7, department: 'Finance', authorityLimit: 500000, currency: 'USD' },
  { id: 'role-manager-finance', name: 'Finance Manager', grade: 6, department: 'Finance', authorityLimit: 100000, currency: 'USD' },
  { id: 'role-vp-it', name: 'VP Information Technology', grade: 9, department: 'IT', authorityLimit: 3000000, currency: 'USD' },
  { id: 'role-it-director', name: 'IT Director', grade: 8, department: 'IT', authorityLimit: 750000, currency: 'USD' },
  { id: 'role-it-manager', name: 'IT Manager', grade: 6, department: 'IT', authorityLimit: 250000, currency: 'USD' },
  { id: 'role-procurement-director', name: 'Procurement Director', grade: 8, department: 'Procurement', authorityLimit: 2000000, currency: 'USD' },
  { id: 'role-hr-director', name: 'HR Director', grade: 8, department: 'HR', authorityLimit: 500000, currency: 'USD' },
];

export const mockHRMSUsers: HRMSUser[] = [
  {
    id: 'user-001',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    roles: [mockRoles[0]], // CFO
    grade: 10,
    isOnLeave: false,
  },
  {
    id: 'user-002',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@company.com',
    roles: [mockRoles[1]], // VP Finance
    grade: 9,
    isOnLeave: true,
    leaveStartDate: '2026-05-10',
    leaveEndDate: '2026-05-25',
  },
  {
    id: 'user-003',
    name: 'Emily Watson',
    email: 'emily.watson@company.com',
    roles: [mockRoles[2]], // Finance Director
    grade: 8,
    isOnLeave: false,
  },
  {
    id: 'user-004',
    name: 'David Kim',
    email: 'david.kim@company.com',
    roles: [mockRoles[3]], // Senior Finance Manager
    grade: 7,
    isOnLeave: false,
  },
  {
    id: 'user-005',
    name: 'Jennifer Taylor',
    email: 'jennifer.taylor@company.com',
    roles: [mockRoles[4]], // Finance Manager
    grade: 6,
    isOnLeave: false,
  },
  {
    id: 'user-006',
    name: 'Robert Anderson',
    email: 'robert.anderson@company.com',
    roles: [mockRoles[5]], // VP IT
    grade: 9,
    isOnLeave: false,
  },
  {
    id: 'user-007',
    name: 'Lisa Martinez',
    email: 'lisa.martinez@company.com',
    roles: [mockRoles[6]], // IT Director
    grade: 8,
    isOnLeave: true,
    leaveStartDate: '2026-05-12',
    leaveEndDate: '2026-05-18',
  },
  {
    id: 'user-008',
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    roles: [mockRoles[7]], // IT Manager
    grade: 6,
    isOnLeave: false,
  },
  {
    id: 'user-009',
    name: 'Patricia Brown',
    email: 'patricia.brown@company.com',
    roles: [mockRoles[8]], // Procurement Director
    grade: 8,
    isOnLeave: false,
  },
  {
    id: 'user-010',
    name: 'Thomas Garcia',
    email: 'thomas.garcia@company.com',
    roles: [mockRoles[9]], // HR Director
    grade: 8,
    isOnLeave: false,
  },
];

// Set up manager relationships
mockHRMSUsers[1].manager = mockHRMSUsers[0]; // VP Finance reports to CFO
mockHRMSUsers[2].manager = mockHRMSUsers[1]; // Finance Director reports to VP Finance
mockHRMSUsers[3].manager = mockHRMSUsers[2]; // Sr Manager reports to Director
mockHRMSUsers[4].manager = mockHRMSUsers[3]; // Manager reports to Sr Manager
mockHRMSUsers[6].manager = mockHRMSUsers[5]; // IT Director reports to VP IT
mockHRMSUsers[7].manager = mockHRMSUsers[6]; // IT Manager reports to IT Director

// Helper functions
export function getUserById(id: string): HRMSUser | undefined {
  return mockHRMSUsers.find(u => u.id === id);
}

export function getRoleById(id: string): Role | undefined {
  return mockRoles.find(r => r.id === id);
}

export function getUsersByRole(roleId: string): HRMSUser[] {
  return mockHRMSUsers.filter(u => u.roles.some(r => r.id === roleId));
}

export function isUserOnLeave(userId: string): boolean {
  const user = getUserById(userId);
  if (!user) return false;
  
  if (!user.isOnLeave) return false;
  
  const now = new Date();
  const start = user.leaveStartDate ? new Date(user.leaveStartDate) : null;
  const end = user.leaveEndDate ? new Date(user.leaveEndDate) : null;
  
  return start && end ? now >= start && now <= end : user.isOnLeave;
}

export function getGradeDifference(user1Grade: number, user2Grade: number): number {
  return Math.abs(user1Grade - user2Grade);
}

export function getUsersOnLeave(): HRMSUser[] {
  return mockHRMSUsers.filter(u => isUserOnLeave(u.id));
}
