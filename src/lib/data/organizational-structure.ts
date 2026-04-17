// RM_EC_01: Organizational Structure Model

export interface OrganizationalEntity {
  id: string;
  name: string;
  type: 'Legal Entity' | 'Business Unit' | 'Subsidiary' | 'Department' | 'Function' | 'Project' | 'Location';
  parentId?: string; // For hierarchical structure
  description?: string;
  owner?: string;
  status: 'Active' | 'Inactive';
  metadata?: {
    code?: string;
    country?: string;
    region?: string;
    businessType?: string;
  };
}

export const mockOrganizationalStructure: OrganizationalEntity[] = [
  // Legal Entities
  {
    id: 'LE-001',
    name: 'Ascent Technologies Inc.',
    type: 'Legal Entity',
    description: 'Parent legal entity',
    owner: 'CEO Office',
    status: 'Active',
    metadata: {
      code: 'ATI',
      country: 'United States',
      region: 'North America'
    }
  },
  {
    id: 'LE-002',
    name: 'Ascent Technologies Europe Ltd.',
    type: 'Legal Entity',
    parentId: 'LE-001',
    description: 'European subsidiary',
    owner: 'Regional Director - EMEA',
    status: 'Active',
    metadata: {
      code: 'ATE',
      country: 'United Kingdom',
      region: 'Europe'
    }
  },
  
  // Business Units
  {
    id: 'BU-001',
    name: 'Information Technology',
    type: 'Business Unit',
    parentId: 'LE-001',
    description: 'IT operations and infrastructure',
    owner: 'David Kumar (COO)',
    status: 'Active'
  },
  {
    id: 'BU-002',
    name: 'Finance & Accounting',
    type: 'Business Unit',
    parentId: 'LE-001',
    description: 'Financial management and reporting',
    owner: 'Patricia Wilson (CFO)',
    status: 'Active'
  },
  {
    id: 'BU-003',
    name: 'Human Resources',
    type: 'Business Unit',
    parentId: 'LE-001',
    description: 'People operations and talent management',
    owner: 'Maria Garcia (CHRO)',
    status: 'Active'
  },
  {
    id: 'BU-004',
    name: 'Compliance & Legal',
    type: 'Business Unit',
    parentId: 'LE-001',
    description: 'Regulatory compliance and legal affairs',
    owner: 'Jennifer Walsh (CCO)',
    status: 'Active'
  },
  
  // Departments
  {
    id: 'DEPT-001',
    name: 'IT Security',
    type: 'Department',
    parentId: 'BU-001',
    description: 'Cybersecurity and information security',
    owner: 'Sarah Chen (CISO)',
    status: 'Active'
  },
  {
    id: 'DEPT-002',
    name: 'Infrastructure',
    type: 'Department',
    parentId: 'BU-001',
    description: 'IT infrastructure and operations',
    owner: 'Technology Director',
    status: 'Active'
  },
  {
    id: 'DEPT-003',
    name: 'Financial Planning & Analysis',
    type: 'Department',
    parentId: 'BU-002',
    description: 'FP&A and budgeting',
    owner: 'FP&A Director',
    status: 'Active'
  },
  {
    id: 'DEPT-004',
    name: 'Talent Acquisition',
    type: 'Department',
    parentId: 'BU-003',
    description: 'Recruitment and onboarding',
    owner: 'Talent Director',
    status: 'Active'
  },
  
  // Projects
  {
    id: 'PROJ-001',
    name: 'Cloud Migration Initiative',
    type: 'Project',
    parentId: 'BU-001',
    description: 'Migration to cloud infrastructure',
    owner: 'Cloud Program Manager',
    status: 'Active',
    metadata: {
      businessType: 'Technology Transformation'
    }
  },
  {
    id: 'PROJ-002',
    name: 'ERP System Implementation',
    type: 'Project',
    parentId: 'BU-002',
    description: 'Enterprise resource planning system rollout',
    owner: 'ERP Program Manager',
    status: 'Active',
    metadata: {
      businessType: 'Business Transformation'
    }
  },
  {
    id: 'PROJ-003',
    name: 'GDPR Compliance Program',
    type: 'Project',
    parentId: 'BU-004',
    description: 'European data protection compliance',
    owner: 'Compliance Manager',
    status: 'Active',
    metadata: {
      businessType: 'Compliance Initiative'
    }
  },
  
  // Locations
  {
    id: 'LOC-001',
    name: 'San Francisco HQ',
    type: 'Location',
    parentId: 'LE-001',
    description: 'Headquarters office',
    status: 'Active',
    metadata: {
      country: 'United States',
      region: 'North America'
    }
  },
  {
    id: 'LOC-002',
    name: 'London Office',
    type: 'Location',
    parentId: 'LE-002',
    description: 'European regional office',
    status: 'Active',
    metadata: {
      country: 'United Kingdom',
      region: 'Europe'
    }
  },
  {
    id: 'LOC-003',
    name: 'Singapore Office',
    type: 'Location',
    parentId: 'LE-001',
    description: 'Asia-Pacific regional office',
    status: 'Active',
    metadata: {
      country: 'Singapore',
      region: 'Asia Pacific'
    }
  }
];

// Helper function to get hierarchy
export function getEntityHierarchy(entityId: string): OrganizationalEntity[] {
  const hierarchy: OrganizationalEntity[] = [];
  let currentId: string | undefined = entityId;
  
  while (currentId) {
    const entity = mockOrganizationalStructure.find(e => e.id === currentId);
    if (!entity) break;
    hierarchy.unshift(entity);
    currentId = entity.parentId;
  }
  
  return hierarchy;
}

// Helper function to get children
export function getEntityChildren(entityId: string): OrganizationalEntity[] {
  return mockOrganizationalStructure.filter(e => e.parentId === entityId);
}
