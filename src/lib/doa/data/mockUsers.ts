/**
 * Mock Users Data for DoA Module
 * Realistic user profiles for testing approval workflows and delegations
 */

import { DoAUser } from '../types/doa-types';

export const mockUsers: DoAUser[] = [
  // Board Level
  {
    id: 'user-001',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'CEO',
    grade: 'C1',
    department: 'Executive',
    businessUnit: 'Corporate',
    isActive: true,
  },
  {
    id: 'user-002',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@company.com',
    role: 'CFO',
    grade: 'C1',
    department: 'Finance',
    businessUnit: 'Corporate',
    manager: 'user-001',
    managerName: 'Sarah Chen',
    isActive: true,
  },
  {
    id: 'user-003',
    name: 'Jennifer Park',
    email: 'jennifer.park@company.com',
    role: 'COO',
    grade: 'C1',
    department: 'Operations',
    businessUnit: 'Corporate',
    manager: 'user-001',
    managerName: 'Sarah Chen',
    isActive: true,
  },
  
  // Executive Level
  {
    id: 'user-004',
    name: 'David Kim',
    email: 'david.kim@company.com',
    role: 'VP Finance',
    grade: 'E1',
    department: 'Finance',
    businessUnit: 'Corporate',
    manager: 'user-002',
    managerName: 'Michael Rodriguez',
    isActive: true,
  },
  {
    id: 'user-005',
    name: 'Emma Thompson',
    email: 'emma.thompson@company.com',
    role: 'VP Human Resources',
    grade: 'E1',
    department: 'HR',
    businessUnit: 'Corporate',
    manager: 'user-003',
    managerName: 'Jennifer Park',
    isActive: true,
  },
  {
    id: 'user-006',
    name: 'Robert Singh',
    email: 'robert.singh@company.com',
    role: 'VP Procurement',
    grade: 'E1',
    department: 'Procurement',
    businessUnit: 'Corporate',
    manager: 'user-002',
    managerName: 'Michael Rodriguez',
    isActive: true,
  },
  {
    id: 'user-007',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@company.com',
    role: 'VP IT',
    grade: 'E1',
    department: 'IT',
    businessUnit: 'Corporate',
    manager: 'user-003',
    managerName: 'Jennifer Park',
    isActive: true,
  },
  
  // Senior Management
  {
    id: 'user-008',
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    role: 'Finance Director',
    grade: 'M1',
    department: 'Finance',
    businessUnit: 'North America',
    manager: 'user-004',
    managerName: 'David Kim',
    isActive: true,
  },
  {
    id: 'user-009',
    name: 'Maria Garcia',
    email: 'maria.garcia@company.com',
    role: 'HR Director',
    grade: 'M1',
    department: 'HR',
    businessUnit: 'EMEA',
    manager: 'user-005',
    managerName: 'Emma Thompson',
    isActive: true,
  },
  {
    id: 'user-010',
    name: 'Thomas Brown',
    email: 'thomas.brown@company.com',
    role: 'Procurement Manager',
    grade: 'M2',
    department: 'Procurement',
    businessUnit: 'North America',
    manager: 'user-006',
    managerName: 'Robert Singh',
    isActive: true,
  },
  {
    id: 'user-011',
    name: 'Sophie Martin',
    email: 'sophie.martin@company.com',
    role: 'IT Manager',
    grade: 'M2',
    department: 'IT',
    businessUnit: 'EMEA',
    manager: 'user-007',
    managerName: 'Lisa Anderson',
    isActive: true,
  },
  
  // Management
  {
    id: 'user-012',
    name: 'Alex Johnson',
    email: 'alex.johnson@company.com',
    role: 'Finance Manager',
    grade: 'M3',
    department: 'Finance',
    businessUnit: 'North America',
    manager: 'user-008',
    managerName: 'James Wilson',
    isActive: true,
  },
  {
    id: 'user-013',
    name: 'Nina Patel',
    email: 'nina.patel@company.com',
    role: 'HR Business Partner',
    grade: 'M3',
    department: 'HR',
    businessUnit: 'APAC',
    manager: 'user-009',
    managerName: 'Maria Garcia',
    isActive: true,
  },
  {
    id: 'user-014',
    name: 'Carlos Mendez',
    email: 'carlos.mendez@company.com',
    role: 'Procurement Lead',
    grade: 'M3',
    department: 'Procurement',
    businessUnit: 'LATAM',
    manager: 'user-010',
    managerName: 'Thomas Brown',
    isActive: true,
  },
  {
    id: 'user-015',
    name: 'Emily Zhang',
    email: 'emily.zhang@company.com',
    role: 'IT Project Manager',
    grade: 'M3',
    department: 'IT',
    businessUnit: 'APAC',
    manager: 'user-011',
    managerName: 'Sophie Martin',
    isActive: true,
  },
];

// Helper functions for mock data
export const getUserById = (id: string): DoAUser | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getUsersByRole = (role: string): DoAUser[] => {
  return mockUsers.filter(user => user.role === role);
};

export const getUsersByDepartment = (department: string): DoAUser[] => {
  return mockUsers.filter(user => user.department === department);
};

export const getUsersByBusinessUnit = (businessUnit: string): DoAUser[] => {
  return mockUsers.filter(user => user.businessUnit === businessUnit);
};
