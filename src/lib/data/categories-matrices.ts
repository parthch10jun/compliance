// Categories & Matrices Module
// Requirements: RM_EC_03 (Risk categories), RM_EC_04 (Risk matrices with L×C scales)

// RM_EC_03: Risk Categories
export interface RiskCategory {
  id: string;
  name: string;
  description: string;
  parentCategoryId?: string; // For hierarchical categories
  
  // Classification
  level: 'Strategic' | 'Operational' | 'Financial' | 'Compliance' | 'Reputational' | 'Technology';
  isActive: boolean;
  
  // Risk counts
  totalRisks: number;
  criticalRisks: number;
  highRisks: number;
  
  // Color coding
  colorCode: string; // Hex color for UI
  
  // Metadata
  createdBy: string;
  createdDate: string;
  modifiedBy?: string;
  modifiedDate?: string;
}

// Hierarchical relationship
export interface CategoryRelationship {
  parentId: string;
  childId: string;
  relationshipType: 'Parent-Child' | 'Related' | 'Cross-Reference';
}

// RM_EC_04: Risk Matrix with L×C Scales
export interface RiskMatrix {
  id: string;
  name: string;
  description: string;
  
  // Matrix configuration
  level: 'Enterprise' | 'Business Unit' | 'Department' | 'Project';
  dimensions: {
    likelihood: number; // e.g., 5
    consequence: number; // e.g., 5
  };
  
  // Likelihood Scale (RM_EC_04)
  likelihoodScale: LikelihoodLevel[];
  
  // Consequence Scale (RM_EC_04)
  consequenceScale: ConsequenceLevel[];
  
  // Rating thresholds
  thresholds: {
    low: { min: number; max: number; color: string };
    medium: { min: number; max: number; color: string };
    high: { min: number; max: number; color: string };
    critical: { min: number; max: number; color: string };
  };
  
  // Matrix cells (for visualization)
  cells: MatrixCell[][];
  
  // Usage
  isDefault: boolean;
  applicableTo: string[]; // Business units, departments
  
  // Metadata
  createdBy: string;
  createdDate: string;
  lastModified?: string;
  version: number;
}

export interface LikelihoodLevel {
  value: number; // 1-5
  label: string; // e.g., "Rare", "Unlikely", "Possible", "Likely", "Almost Certain"
  description: string;
  
  // Quantitative definitions (optional)
  probabilityRange?: string; // e.g., "< 1%", "1-10%", "10-50%"
  frequencyRange?: string; // e.g., "Once in 10 years", "Once per year"
  
  // Examples
  examples?: string[];
}

export interface ConsequenceLevel {
  value: number; // 1-5
  label: string; // e.g., "Insignificant", "Minor", "Moderate", "Major", "Catastrophic"
  description: string;
  
  // Impact dimensions
  financial?: string; // e.g., "< $100K", "$100K - $500K"
  operational?: string; // e.g., "Minimal disruption", "Significant disruption"
  reputational?: string; // e.g., "Local media", "National media"
  compliance?: string; // e.g., "Minor violation", "Major regulatory breach"
  safety?: string; // e.g., "First aid", "Fatality"
  
  // Examples
  examples?: string[];
}

export interface MatrixCell {
  likelihood: number;
  consequence: number;
  score: number; // L × C
  rating: 'Low' | 'Medium' | 'High' | 'Critical';
  color: string;
}

// Mock Risk Categories (RM_EC_03)
export const mockRiskCategories: RiskCategory[] = [
  {
    id: 'CAT-001',
    name: 'Cybersecurity',
    description: 'Risks related to information security, data breaches, and cyber attacks',
    level: 'Technology',
    isActive: true,
    totalRisks: 8,
    criticalRisks: 0,
    highRisks: 2,
    colorCode: '#3B82F6', // Blue
    createdBy: 'System',
    createdDate: '2024-01-01'
  },
  {
    id: 'CAT-002',
    name: 'Operational',
    description: 'Risks arising from inadequate or failed internal processes, people, and systems',
    level: 'Operational',
    isActive: true,
    totalRisks: 12,
    criticalRisks: 1,
    highRisks: 3,
    colorCode: '#10B981', // Green
    createdBy: 'System',
    createdDate: '2024-01-01'
  },
  {
    id: 'CAT-003',
    name: 'Financial',
    description: 'Risks related to financial loss, market volatility, and economic conditions',
    level: 'Financial',
    isActive: true,
    totalRisks: 6,
    criticalRisks: 0,
    highRisks: 2,
    colorCode: '#F59E0B', // Amber
    createdBy: 'System',
    createdDate: '2024-01-01'
  },
  {
    id: 'CAT-004',
    name: 'Compliance & Regulatory',
    description: 'Risks of non-compliance with laws, regulations, and internal policies',
    level: 'Compliance',
    isActive: true,
    totalRisks: 9,
    criticalRisks: 1,
    highRisks: 4,
    colorCode: '#8B5CF6', // Purple
    createdBy: 'System',
    createdDate: '2024-01-01'
  },
  {
    id: 'CAT-005',
    name: 'Strategic',
    description: 'Risks that could affect the achievement of strategic objectives',
    level: 'Strategic',
    isActive: true,
    totalRisks: 5,
    criticalRisks: 0,
    highRisks: 1,
    colorCode: '#EF4444', // Red
    createdBy: 'System',
    createdDate: '2024-01-01'
  },
  {
    id: 'CAT-006',
    name: 'Reputational',
    description: 'Risks that could damage the organization\'s reputation and brand',
    level: 'Reputational',
    isActive: true,
    totalRisks: 4,
    criticalRisks: 0,
    highRisks: 1,
    colorCode: '#EC4899', // Pink
    createdBy: 'System',
    createdDate: '2024-01-01'
  },
  {
    id: 'CAT-007',
    name: 'Third-Party & Vendor',
    description: 'Risks arising from external service providers and supply chain',
    parentCategoryId: 'CAT-002', // Child of Operational
    level: 'Operational',
    isActive: true,
    totalRisks: 3,
    criticalRisks: 0,
    highRisks: 1,
    colorCode: '#14B8A6', // Teal
    createdBy: 'System',
    createdDate: '2024-01-01'
  }
];

// Mock Risk Matrices (RM_EC_04)
export const mockRiskMatrices: RiskMatrix[] = [
  {
    id: 'MATRIX-ENT-001',
    name: 'Enterprise Risk Matrix (5×5)',
    description: 'Standard enterprise-level risk assessment matrix',
    level: 'Enterprise',
    dimensions: { likelihood: 5, consequence: 5 },
    likelihoodScale: [
      {
        value: 1,
        label: 'Rare',
        description: 'May occur only in exceptional circumstances',
        probabilityRange: '< 1%',
        frequencyRange: 'Once in 10+ years',
        examples: ['Black swan events', 'Unprecedented disasters']
      },
      {
        value: 2,
        label: 'Unlikely',
        description: 'Could occur at some time',
        probabilityRange: '1% - 10%',
        frequencyRange: 'Once in 5-10 years',
        examples: ['Major system failure', 'Significant regulatory change']
      },
      {
        value: 3,
        label: 'Possible',
        description: 'Might occur at some time',
        probabilityRange: '10% - 50%',
        frequencyRange: 'Once every 1-5 years',
        examples: ['Minor data breach', 'Employee turnover']
      },
      {
        value: 4,
        label: 'Likely',
        description: 'Will probably occur in most circumstances',
        probabilityRange: '50% - 90%',
        frequencyRange: 'Multiple times per year',
        examples: ['Phishing attempts', 'Software bugs']
      },
      {
        value: 5,
        label: 'Almost Certain',
        description: 'Expected to occur in most circumstances',
        probabilityRange: '> 90%',
        frequencyRange: 'Weekly or daily',
        examples: ['Spam emails', 'Failed login attempts']
      }
    ],
    consequenceScale: [
      {
        value: 1,
        label: 'Insignificant',
        description: 'Minimal impact on operations',
        financial: '< $10K',
        operational: 'No disruption',
        reputational: 'Internal only',
        compliance: 'Minor procedural issue',
        examples: ['Small system glitch', 'Minor process delay']
      },
      {
        value: 2,
        label: 'Minor',
        description: 'Minor impact, manageable with routine procedures',
        financial: '$10K - $100K',
        operational: 'Brief disruption (< 1 day)',
        reputational: 'Local concern',
        compliance: 'Reportable incident',
        examples: ['Short service outage', 'Customer complaint']
      },
      {
        value: 3,
        label: 'Moderate',
        description: 'Moderate impact requiring management attention',
        financial: '$100K - $1M',
        operational: 'Significant disruption (1-7 days)',
        reputational: 'Regional media coverage',
        compliance: 'Regulatory warning',
        examples: ['Data breach (limited scope)', 'Service degradation']
      },
      {
        value: 4,
        label: 'Major',
        description: 'Significant impact requiring senior management intervention',
        financial: '$1M - $10M',
        operational: 'Major disruption (1-4 weeks)',
        reputational: 'National media coverage',
        compliance: 'Regulatory fine',
        examples: ['Large data breach', 'System compromise']
      },
      {
        value: 5,
        label: 'Catastrophic',
        description: 'Severe impact threatening organizational viability',
        financial: '> $10M',
        operational: 'Extended outage (> 1 month)',
        reputational: 'International crisis',
        compliance: 'License revocation',
        examples: ['Complete system failure', 'Existential threat']
      }
    ],
    thresholds: {
      low: { min: 1, max: 4, color: '#10B981' }, // Green
      medium: { min: 5, max: 9, color: '#F59E0B' }, // Amber
      high: { min: 10, max: 15, color: '#F97316' }, // Orange
      critical: { min: 16, max: 25, color: '#EF4444' } // Red
    },
    cells: [], // Will be calculated
    isDefault: true,
    applicableTo: ['All'],
    createdBy: 'System',
    createdDate: '2024-01-01',
    version: 1
  }
];

// Helper function to generate matrix cells
export function generateMatrixCells(matrix: RiskMatrix): MatrixCell[][] {
  const cells: MatrixCell[][] = [];
  
  for (let l = matrix.dimensions.likelihood; l >= 1; l--) {
    const row: MatrixCell[] = [];
    for (let c = 1; c <= matrix.dimensions.consequence; c++) {
      const score = l * c;
      let rating: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
      let color = matrix.thresholds.low.color;
      
      if (score >= matrix.thresholds.critical.min) {
        rating = 'Critical';
        color = matrix.thresholds.critical.color;
      } else if (score >= matrix.thresholds.high.min) {
        rating = 'High';
        color = matrix.thresholds.high.color;
      } else if (score >= matrix.thresholds.medium.min) {
        rating = 'Medium';
        color = matrix.thresholds.medium.color;
      }
      
      row.push({ likelihood: l, consequence: c, score, rating, color });
    }
    cells.push(row);
  }
  
  return cells;
}

// Generate cells for default matrix
mockRiskMatrices[0].cells = generateMatrixCells(mockRiskMatrices[0]);
