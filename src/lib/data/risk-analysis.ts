// Advanced Risk Analysis Module
// Requirements: RM_AR_20, RM_AR_21, RM_AR_23, RM_AR_24, RM_AR_26, RM_AR_27, RM_AR_31, RM_AR_32, RM_AR_33

// RM_AR_23: Treatment Intensity
export type TreatmentIntensity = 'None' | '+' | '++' | '+++' | '++++';

// RM_AR_24: Trend
export type RiskTrend = '↑' | '—' | '↓';

// RM_AR_26, RM_AR_27: Version History & Change Tracking
export interface RiskVersion {
  versionNumber: number;
  versionDate: string;
  modifiedBy: string;
  changeRationale: string;
  
  // Snapshot of risk at this version
  inherentLikelihood: number;
  inherentConsequence: number;
  inherentScore: number;
  inherentRating: string;
  
  residualLikelihood: number;
  residualConsequence: number;
  residualScore: number;
  residualRating: string;
  
  // What changed
  changesDescription: string;
  fieldChanges: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}

// RM_AR_21: Rating Scales
export interface RatingScale {
  id: string;
  name: string;
  type: 'Likelihood' | 'Consequence';
  scaleType: 'Qualitative' | 'Semi-Quantitative' | 'Quantitative';
  
  levels: {
    value: number;
    label: string;
    description: string;
    quantitativeRange?: string; // e.g., "$1M - $5M" or "1% - 10%"
  }[];
}

// RM_AR_32: Matrix Conversion
export interface RiskMatrix {
  id: string;
  name: string;
  level: 'Enterprise' | 'Business Unit' | 'Department' | 'Project';
  
  likelihoodScaleId: string;
  consequenceScaleId: string;
  
  // Matrix cells (5x5)
  cells: {
    likelihood: number;
    consequence: number;
    score: number;
    rating: 'Critical' | 'High' | 'Medium' | 'Low';
    color: string;
  }[][];
  
  // Thresholds
  thresholds: {
    low: { min: number; max: number };
    medium: { min: number; max: number };
    high: { min: number; max: number };
    critical: { min: number; max: number };
  };
}

// RM_AR_31: Aggregated Risk
export interface AggregatedRisk {
  id: string;
  name: string;
  aggregationType: 'Category' | 'Business Unit' | 'Department' | 'Geographic';
  aggregationValue: string; // e.g., "Cybersecurity", "IT Department"
  
  // Constituent risks
  riskIds: string[];
  riskCount: number;
  
  // Aggregated scores
  totalInherentScore: number;
  totalResidualScore: number;
  averageInherentScore: number;
  averageResidualScore: number;
  maxInherentScore: number;
  maxResidualScore: number;
  
  // Aggregated rating
  aggregatedRating: 'Critical' | 'High' | 'Medium' | 'Low';
  
  // Breakdown by rating
  breakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

// Mock Rating Scales (RM_AR_21)
export const mockRatingScales: RatingScale[] = [
  {
    id: 'SCALE-L-QUAL',
    name: 'Qualitative Likelihood Scale',
    type: 'Likelihood',
    scaleType: 'Qualitative',
    levels: [
      { value: 1, label: 'Rare', description: 'May occur only in exceptional circumstances' },
      { value: 2, label: 'Unlikely', description: 'Could occur at some time' },
      { value: 3, label: 'Possible', description: 'Might occur at some time' },
      { value: 4, label: 'Likely', description: 'Will probably occur in most circumstances' },
      { value: 5, label: 'Almost Certain', description: 'Expected to occur in most circumstances' }
    ]
  },
  {
    id: 'SCALE-C-QUAL',
    name: 'Qualitative Consequence Scale',
    type: 'Consequence',
    scaleType: 'Qualitative',
    levels: [
      { value: 1, label: 'Insignificant', description: 'Minimal impact on operations' },
      { value: 2, label: 'Minor', description: 'Minor impact, manageable with routine procedures' },
      { value: 3, label: 'Moderate', description: 'Moderate impact requiring management attention' },
      { value: 4, label: 'Major', description: 'Significant impact requiring senior management intervention' },
      { value: 5, label: 'Catastrophic', description: 'Severe impact threatening organizational viability' }
    ]
  },
  {
    id: 'SCALE-C-QUANT',
    name: 'Quantitative Financial Consequence Scale',
    type: 'Consequence',
    scaleType: 'Quantitative',
    levels: [
      { value: 1, label: 'Very Low', description: 'Financial impact', quantitativeRange: '< $100K' },
      { value: 2, label: 'Low', description: 'Financial impact', quantitativeRange: '$100K - $500K' },
      { value: 3, label: 'Medium', description: 'Financial impact', quantitativeRange: '$500K - $2M' },
      { value: 4, label: 'High', description: 'Financial impact', quantitativeRange: '$2M - $10M' },
      { value: 5, label: 'Very High', description: 'Financial impact', quantitativeRange: '> $10M' }
    ]
  }
];

// Mock Risk Matrix (RM_AR_20)
export const enterpriseRiskMatrix: RiskMatrix = {
  id: 'MATRIX-ENT',
  name: 'Enterprise Risk Matrix',
  level: 'Enterprise',
  likelihoodScaleId: 'SCALE-L-QUAL',
  consequenceScaleId: 'SCALE-C-QUAL',
  cells: [], // Will be calculated
  thresholds: {
    low: { min: 1, max: 4 },
    medium: { min: 5, max: 9 },
    high: { min: 10, max: 15 },
    critical: { min: 16, max: 25 }
  }
};

// Mock Version History (RM_AR_26, RM_AR_27)
export const mockRiskVersions: Record<string, RiskVersion[]> = {
  'RSK-001': [
    {
      versionNumber: 1,
      versionDate: '2024-01-15',
      modifiedBy: 'Sarah Chen (CISO)',
      changeRationale: 'Initial risk assessment',
      inherentLikelihood: 5,
      inherentConsequence: 5,
      inherentScore: 25,
      inherentRating: 'Critical',
      residualLikelihood: 4,
      residualConsequence: 5,
      residualScore: 20,
      residualRating: 'Critical',
      changesDescription: 'Initial assessment created',
      fieldChanges: []
    },
    {
      versionNumber: 2,
      versionDate: '2024-04-01',
      modifiedBy: 'Sarah Chen (CISO)',
      changeRationale: 'Updated after implementing vendor security assessment program',
      inherentLikelihood: 4,
      inherentConsequence: 5,
      inherentScore: 20,
      inherentRating: 'Critical',
      residualLikelihood: 3,
      residualConsequence: 3,
      residualScore: 9,
      residualRating: 'Medium',
      changesDescription: 'Reduced residual risk due to new controls',
      fieldChanges: [
        { field: 'residualLikelihood', oldValue: 4, newValue: 3 },
        { field: 'residualConsequence', oldValue: 5, newValue: 3 },
        { field: 'residualRating', oldValue: 'Critical', newValue: 'Medium' }
      ]
    }
  ]
};

// Mock Aggregated Risks (RM_AR_31)
export const mockAggregatedRisks: AggregatedRisk[] = [
  {
    id: 'AGG-CAT-CYBER',
    name: 'Cybersecurity Risks (Aggregated)',
    aggregationType: 'Category',
    aggregationValue: 'Cybersecurity',
    riskIds: ['RSK-001', 'RSK-002', 'RSK-015'],
    riskCount: 3,
    totalInherentScore: 65,
    totalResidualScore: 29,
    averageInherentScore: 21.7,
    averageResidualScore: 9.7,
    maxInherentScore: 25,
    maxResidualScore: 12,
    aggregatedRating: 'High',
    breakdown: {
      critical: 0,
      high: 1,
      medium: 2,
      low: 0
    }
  },
  {
    id: 'AGG-BU-IT',
    name: 'IT Department Risks (Aggregated)',
    aggregationType: 'Business Unit',
    aggregationValue: 'IT Department',
    riskIds: ['RSK-001', 'RSK-002'],
    riskCount: 2,
    totalInherentScore: 45,
    totalResidualScore: 21,
    averageInherentScore: 22.5,
    averageResidualScore: 10.5,
    maxInherentScore: 25,
    maxResidualScore: 12,
    aggregatedRating: 'High',
    breakdown: {
      critical: 0,
      high: 1,
      medium: 1,
      low: 0
    }
  }
];

// Helper Functions
export function calculateTreatmentIntensity(controlsCount: number, effectivenessAvg: number): TreatmentIntensity {
  const intensity = controlsCount * (effectivenessAvg / 100);
  if (intensity >= 4) return '++++';
  if (intensity >= 3) return '+++';
  if (intensity >= 2) return '++';
  if (intensity >= 1) return '+';
  return 'None';
}

export function calculateTrend(currentScore: number, previousScore: number): RiskTrend {
  if (currentScore > previousScore) return '↑';
  if (currentScore < previousScore) return '↓';
  return '—';
}

export function getRatingFromMatrix(likelihood: number, consequence: number, matrix: RiskMatrix): string {
  const score = likelihood * consequence;
  const { thresholds } = matrix;
  
  if (score >= thresholds.critical.min) return 'Critical';
  if (score >= thresholds.high.min) return 'High';
  if (score >= thresholds.medium.min) return 'Medium';
  return 'Low';
}

export function convertBetweenMatrices(
  sourceLikelihood: number,
  sourceConsequence: number,
  sourceMatrix: RiskMatrix,
  targetMatrix: RiskMatrix
): { likelihood: number; consequence: number; score: number; rating: string } {
  // Simple conversion - in real app would have more sophisticated logic
  const sourceScore = sourceLikelihood * sourceConsequence;
  const targetScore = sourceScore; // Keep same absolute risk level
  
  // Find closest L×C combination in target matrix
  const targetLikelihood = Math.round(Math.sqrt(targetScore));
  const targetConsequence = Math.round(targetScore / targetLikelihood);
  const targetRating = getRatingFromMatrix(targetLikelihood, targetConsequence, targetMatrix);
  
  return {
    likelihood: Math.min(5, Math.max(1, targetLikelihood)),
    consequence: Math.min(5, Math.max(1, targetConsequence)),
    score: targetScore,
    rating: targetRating
  };
}
