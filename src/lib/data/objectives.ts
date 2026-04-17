// RM_EC_02: Objectives at each level of organizational structure

export interface Objective {
  id: string;
  title: string;
  description: string;
  type: 'Strategic' | 'Operational' | 'Financial' | 'Compliance';
  organizationalEntityId: string; // Links to organizational structure
  owner: string;
  status: 'Active' | 'In Progress' | 'Achieved' | 'Cancelled';
  targetDate?: string;
  parentObjectiveId?: string; // For cascading objectives
  kpis?: {
    name: string;
    target: string;
    current?: string;
    unit: string;
  }[];
  linkedRisks?: string[]; // Risk IDs that could affect this objective
}

export const mockObjectives: Objective[] = [
  // Corporate Strategic Objectives
  {
    id: 'OBJ-001',
    title: 'Protect customer data and maintain privacy',
    description: 'Ensure all customer data is protected with industry-leading security measures and comply with all privacy regulations',
    type: 'Strategic',
    organizationalEntityId: 'LE-001', // Ascent Technologies Inc.
    owner: 'Sarah Chen (CISO)',
    status: 'In Progress',
    targetDate: '2024-12-31',
    kpis: [
      { name: 'Zero data breaches', target: '0', current: '0', unit: 'incidents' },
      { name: 'Security audit score', target: '95%', current: '92%', unit: '%' },
      { name: 'Privacy compliance rate', target: '100%', current: '98%', unit: '%' }
    ],
    linkedRisks: ['RSK-001', 'RSK-002', 'RSK-015']
  },
  {
    id: 'OBJ-002',
    title: 'Achieve 99.9% system uptime',
    description: 'Maintain highly available and reliable IT infrastructure to support business operations',
    type: 'Operational',
    organizationalEntityId: 'BU-001', // Information Technology
    owner: 'David Kumar (COO)',
    status: 'In Progress',
    targetDate: '2024-12-31',
    kpis: [
      { name: 'System uptime', target: '99.9%', current: '99.7%', unit: '%' },
      { name: 'Mean time to recovery', target: '<1 hour', current: '1.5 hours', unit: 'hours' },
      { name: 'Incident count', target: '<5', current: '7', unit: 'incidents/month' }
    ],
    linkedRisks: ['RSK-008', 'RSK-019']
  },
  {
    id: 'OBJ-003',
    title: 'Maintain regulatory compliance across all jurisdictions',
    description: 'Ensure full compliance with GDPR, SOC 2, ISO 27001, and other applicable regulations',
    type: 'Compliance',
    organizationalEntityId: 'BU-004', // Compliance & Legal
    owner: 'Jennifer Walsh (CCO)',
    status: 'In Progress',
    targetDate: '2024-12-31',
    kpis: [
      { name: 'Compliance audit findings', target: '0 critical', current: '0 critical', unit: 'findings' },
      { name: 'Policy acknowledgment rate', target: '100%', current: '97%', unit: '%' },
      { name: 'Training completion', target: '100%', current: '92%', unit: '%' }
    ],
    linkedRisks: ['RSK-005', 'RSK-011']
  },
  {
    id: 'OBJ-004',
    title: 'Achieve revenue growth of 25% YoY',
    description: 'Drive sustainable revenue growth through market expansion and customer acquisition',
    type: 'Financial',
    organizationalEntityId: 'LE-001', // Corporate level
    owner: 'CEO Office',
    status: 'In Progress',
    targetDate: '2024-12-31',
    kpis: [
      { name: 'Revenue growth', target: '25%', current: '18%', unit: '%' },
      { name: 'Customer acquisition', target: '1000', current: '650', unit: 'new customers' },
      { name: 'Market share', target: '15%', current: '12%', unit: '%' }
    ],
    linkedRisks: ['RSK-020', 'RSK-018']
  },
  {
    id: 'OBJ-005',
    title: 'Reduce operational costs by 15%',
    description: 'Optimize operational efficiency and reduce costs through automation and process improvements',
    type: 'Financial',
    organizationalEntityId: 'BU-002', // Finance & Accounting
    owner: 'Patricia Wilson (CFO)',
    status: 'In Progress',
    targetDate: '2024-12-31',
    kpis: [
      { name: 'Cost reduction', target: '15%', current: '8%', unit: '%' },
      { name: 'Process automation rate', target: '70%', current: '45%', unit: '%' },
      { name: 'Efficiency gains', target: '20%', current: '12%', unit: '%' }
    ],
    linkedRisks: ['RSK-006', 'RSK-016']
  },
  {
    id: 'OBJ-006',
    title: 'Attract and retain top talent',
    description: 'Build a high-performing workforce with industry-leading talent acquisition and retention',
    type: 'Operational',
    organizationalEntityId: 'BU-003', // Human Resources
    owner: 'Maria Garcia (CHRO)',
    status: 'In Progress',
    targetDate: '2024-12-31',
    kpis: [
      { name: 'Employee retention rate', target: '90%', current: '85%', unit: '%' },
      { name: 'Time to hire', target: '<30 days', current: '42 days', unit: 'days' },
      { name: 'Employee satisfaction', target: '4.5/5', current: '4.2/5', unit: 'score' }
    ],
    linkedRisks: ['RSK-007', 'RSK-010']
  },
  
  // Project-level Objectives (Cascaded)
  {
    id: 'OBJ-007',
    title: 'Complete cloud migration by Q3 2024',
    description: 'Migrate all critical systems to cloud infrastructure with zero downtime',
    type: 'Operational',
    organizationalEntityId: 'PROJ-001', // Cloud Migration Initiative
    owner: 'Cloud Program Manager',
    status: 'In Progress',
    targetDate: '2024-09-30',
    parentObjectiveId: 'OBJ-002', // Links to uptime objective
    kpis: [
      { name: 'Migration completion', target: '100%', current: '65%', unit: '%' },
      { name: 'Migration downtime', target: '0 hours', current: '0 hours', unit: 'hours' },
      { name: 'Budget adherence', target: '100%', current: '95%', unit: '%' }
    ],
    linkedRisks: ['RSK-008', 'RSK-014']
  },
  {
    id: 'OBJ-008',
    title: 'Achieve GDPR full compliance by Q2 2024',
    description: 'Complete all GDPR compliance requirements for European operations',
    type: 'Compliance',
    organizationalEntityId: 'PROJ-003', // GDPR Compliance Program
    owner: 'Compliance Manager',
    status: 'In Progress',
    targetDate: '2024-06-30',
    parentObjectiveId: 'OBJ-003', // Links to regulatory compliance
    kpis: [
      { name: 'Compliance controls implemented', target: '100%', current: '88%', unit: '%' },
      { name: 'Data processing agreements', target: '100%', current: '92%', unit: '%' },
      { name: 'Privacy impact assessments', target: '100%', current: '100%', unit: '%' }
    ],
    linkedRisks: ['RSK-005', 'RSK-015']
  }
];

// Helper functions
export function getObjectivesByEntity(entityId: string): Objective[] {
  return mockObjectives.filter(obj => obj.organizationalEntityId === entityId);
}

export function getObjectivesByStatus(status: Objective['status']): Objective[] {
  return mockObjectives.filter(obj => obj.status === status);
}

export function getLinkedRisksForObjective(objectiveId: string): string[] {
  const objective = mockObjectives.find(obj => obj.id === objectiveId);
  return objective?.linkedRisks || [];
}

export function getObjectivesForRisk(riskId: string): Objective[] {
  return mockObjectives.filter(obj => obj.linkedRisks?.includes(riskId));
}
