// Compliance Score Calculation Types and Interfaces

export type CalculationMethod = 
  | 'simple-average'
  | 'weighted-average'
  | 'control-based'
  | 'risk-weighted'
  | 'maturity-based'
  | 'custom-formula';

export type WeightingFactor = 
  | 'priority'
  | 'risk-rating'
  | 'control-count'
  | 'test-results'
  | 'maturity-level'
  | 'custom';

export interface CalculationConfig {
  id: string;
  name: string;
  method: CalculationMethod;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SimpleAverageConfig extends CalculationConfig {
  method: 'simple-average';
  includeRequirements: boolean;
  includeControls: boolean;
  includeTests: boolean;
}

export interface WeightedAverageConfig extends CalculationConfig {
  method: 'weighted-average';
  weights: {
    requirements: number;
    controls: number;
    tests: number;
    obligations: number;
  };
  weightingFactors: WeightingFactor[];
  priorityWeights?: {
    Critical: number;
    High: number;
    Medium: number;
    Low: number;
  };
  riskWeights?: {
    Critical: number;
    High: number;
    Medium: number;
    Low: number;
  };
}

export interface ControlBasedConfig extends CalculationConfig {
  method: 'control-based';
  controlEffectivenessWeights: {
    Effective: number;
    'Partially Effective': number;
    Ineffective: number;
    'Not Tested': number;
  };
  testResultWeights: {
    Pass: number;
    Fail: number;
    Pending: number;
  };
  includeControlCoverage: boolean;
}

export interface RiskWeightedConfig extends CalculationConfig {
  method: 'risk-weighted';
  riskImpactMultiplier: {
    Critical: number;
    High: number;
    Medium: number;
    Low: number;
  };
  residualRiskFactor: number;
  controlEffectivenessImpact: number;
}

export interface MaturityBasedConfig extends CalculationConfig {
  method: 'maturity-based';
  maturityLevels: {
    level: number;
    name: string;
    scoreRange: [number, number];
    weight: number;
  }[];
  progressionFactor: number;
}

export interface CustomFormulaConfig extends CalculationConfig {
  method: 'custom-formula';
  formula: string;
  variables: {
    name: string;
    description: string;
    source: 'requirements' | 'controls' | 'tests' | 'obligations' | 'risks' | 'custom';
    aggregation: 'sum' | 'average' | 'weighted-average' | 'min' | 'max' | 'count';
  }[];
}

export type AnyCalculationConfig = 
  | SimpleAverageConfig
  | WeightedAverageConfig
  | ControlBasedConfig
  | RiskWeightedConfig
  | MaturityBasedConfig
  | CustomFormulaConfig;

export interface ComplianceScoreBreakdown {
  overallScore: number;
  method: CalculationMethod;
  calculatedAt: string;
  components: {
    name: string;
    score: number;
    weight: number;
    weightedScore: number;
    details?: any;
  }[];
  metadata: {
    totalRequirements?: number;
    compliantRequirements?: number;
    totalControls?: number;
    effectiveControls?: number;
    totalTests?: number;
    passedTests?: number;
    [key: string]: any;
  };
}

export interface CalculationResult {
  score: number;
  breakdown: ComplianceScoreBreakdown;
  warnings?: string[];
  errors?: string[];
}

// Default calculation configurations
export const DEFAULT_CALCULATION_CONFIGS: Record<CalculationMethod, AnyCalculationConfig> = {
  'simple-average': {
    id: 'calc-simple',
    name: 'Simple Average',
    method: 'simple-average',
    description: 'Average of all requirement compliance scores',
    isActive: true,
    includeRequirements: true,
    includeControls: false,
    includeTests: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'weighted-average': {
    id: 'calc-weighted',
    name: 'Weighted Average',
    method: 'weighted-average',
    description: 'Weighted average based on priority and risk',
    isActive: false,
    weights: {
      requirements: 0.4,
      controls: 0.3,
      tests: 0.2,
      obligations: 0.1,
    },
    weightingFactors: ['priority', 'risk-rating'],
    priorityWeights: {
      Critical: 1.5,
      High: 1.2,
      Medium: 1.0,
      Low: 0.8,
    },
    riskWeights: {
      Critical: 1.5,
      High: 1.3,
      Medium: 1.0,
      Low: 0.7,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'control-based': {
    id: 'calc-control',
    name: 'Control-Based',
    method: 'control-based',
    description: 'Score based on control effectiveness and test results',
    isActive: false,
    controlEffectivenessWeights: {
      Effective: 1.0,
      'Partially Effective': 0.6,
      Ineffective: 0.2,
      'Not Tested': 0.0,
    },
    testResultWeights: {
      Pass: 1.0,
      Fail: 0.0,
      Pending: 0.5,
    },
    includeControlCoverage: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'risk-weighted': {
    id: 'calc-risk',
    name: 'Risk-Weighted',
    method: 'risk-weighted',
    description: 'Score weighted by risk impact and residual risk',
    isActive: false,
    riskImpactMultiplier: {
      Critical: 2.0,
      High: 1.5,
      Medium: 1.0,
      Low: 0.5,
    },
    residualRiskFactor: 0.3,
    controlEffectivenessImpact: 0.7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'maturity-based': {
    id: 'calc-maturity',
    name: 'Maturity-Based',
    method: 'maturity-based',
    description: 'Score based on compliance maturity levels',
    isActive: false,
    maturityLevels: [
      { level: 1, name: 'Initial', scoreRange: [0, 20], weight: 0.5 },
      { level: 2, name: 'Developing', scoreRange: [21, 40], weight: 0.7 },
      { level: 3, name: 'Defined', scoreRange: [41, 60], weight: 0.85 },
      { level: 4, name: 'Managed', scoreRange: [61, 80], weight: 1.0 },
      { level: 5, name: 'Optimized', scoreRange: [81, 100], weight: 1.2 },
    ],
    progressionFactor: 1.1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'custom-formula': {
    id: 'calc-custom',
    name: 'Custom Formula',
    method: 'custom-formula',
    description: 'Custom calculation formula',
    isActive: false,
    formula: '(R * 0.4 + C * 0.3 + T * 0.3) * 100',
    variables: [
      {
        name: 'R',
        description: 'Requirements compliance ratio',
        source: 'requirements',
        aggregation: 'average',
      },
      {
        name: 'C',
        description: 'Controls effectiveness ratio',
        source: 'controls',
        aggregation: 'weighted-average',
      },
      {
        name: 'T',
        description: 'Tests pass ratio',
        source: 'tests',
        aggregation: 'average',
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};
