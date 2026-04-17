// Risk Evaluation & Prioritization Module
// Requirements: RM_ER_01 through RM_ER_06

export interface RiskRanking {
  riskId: string;
  riskTitle: string;
  category: string;
  
  // Rating & Ranking (RM_ER_01, RM_ER_02)
  inherentScore: number;
  inherentRating: 'Critical' | 'High' | 'Medium' | 'Low';
  residualScore: number;
  residualRating: 'Critical' | 'High' | 'Medium' | 'Low';
  
  // Calculated rank (1 = highest risk)
  inherentRank: number;
  residualRank: number;
  
  // Tolerance Comparison (RM_ER_05)
  riskTolerance: number;
  exceedsTolerance: boolean;
  toleranceDelta: number; // How far above/below tolerance
  
  // Priority Assignment (RM_ER_05)
  priority: 'Critical' | 'High' | 'Medium' | 'Low' | 'Monitor';
  treatmentDecision: 'Treat' | 'Accept' | 'Monitor' | 'Escalate';
  
  // Authority Level (RM_ER_06)
  authorityLevel: 'Board' | 'Executive' | 'Management' | 'Operational';
  notificationRequired: boolean;
  
  // Override Information (RM_ER_03, RM_ER_04)
  isOverridden: boolean;
  originalRank?: number;
  overrideRank?: number;
  overriddenBy?: string;
  overrideDate?: string;
  overrideRationale?: string;
}

export interface RiskOverride {
  id: string;
  riskId: string;
  riskTitle: string;
  
  // Original values (RM_ER_04)
  originalScore: number;
  originalRating: 'Critical' | 'High' | 'Medium' | 'Low';
  originalRank: number;
  
  // Override values (RM_ER_03)
  overrideScore: number;
  overrideRating: 'Critical' | 'High' | 'Medium' | 'Low';
  overrideRank: number;
  
  // Justification
  overriddenBy: string;
  overrideDate: string;
  overrideRationale: string;
  
  // Authority
  approvedBy?: string;
  approvalDate?: string;
  
  // Status
  status: 'Pending' | 'Approved' | 'Rejected';
}

// Mock Risk Rankings
export const mockRiskRankings: RiskRanking[] = [
  {
    riskId: 'RSK-001',
    riskTitle: 'Third-party vendor data breach exposure',
    category: 'Cybersecurity',
    inherentScore: 20,
    inherentRating: 'Critical',
    residualScore: 9,
    residualRating: 'Medium',
    inherentRank: 1,
    residualRank: 3,
    riskTolerance: 6,
    exceedsTolerance: true,
    toleranceDelta: 3,
    priority: 'High',
    treatmentDecision: 'Treat',
    authorityLevel: 'Executive',
    notificationRequired: true,
    isOverridden: false
  },
  {
    riskId: 'RSK-002',
    riskTitle: 'Ransomware attack on critical systems',
    category: 'Cybersecurity',
    inherentScore: 25,
    inherentRating: 'Critical',
    residualScore: 12,
    residualRating: 'High',
    inherentRank: 1, // Tied for rank 1
    residualRank: 1,
    riskTolerance: 9,
    exceedsTolerance: true,
    toleranceDelta: 3,
    priority: 'Critical',
    treatmentDecision: 'Escalate',
    authorityLevel: 'Board',
    notificationRequired: true,
    isOverridden: false
  },
  {
    riskId: 'RSK-007',
    riskTitle: 'Key personnel departure',
    category: 'Operational',
    inherentScore: 12,
    inherentRating: 'High',
    residualScore: 6,
    residualRating: 'Medium',
    inherentRank: 3,
    residualRank: 5,
    riskTolerance: 9,
    exceedsTolerance: false,
    toleranceDelta: -3,
    priority: 'Medium',
    treatmentDecision: 'Monitor',
    authorityLevel: 'Management',
    notificationRequired: false,
    isOverridden: false
  },
  {
    riskId: 'RSK-015',
    riskTitle: 'Customer data privacy breach',
    category: 'Compliance',
    inherentScore: 20,
    inherentRating: 'Critical',
    residualScore: 8,
    residualRating: 'Medium',
    inherentRank: 1, // Tied for rank 1
    residualRank: 4,
    riskTolerance: 6,
    exceedsTolerance: true,
    toleranceDelta: 2,
    priority: 'High',
    treatmentDecision: 'Treat',
    authorityLevel: 'Executive',
    notificationRequired: true,
    isOverridden: true,
    originalRank: 1,
    overrideRank: 2,
    overriddenBy: 'Jennifer Walsh (CCO)',
    overrideDate: '2024-04-15',
    overrideRationale: 'New controls implemented reduce actual risk below calculated level'
  }
];

// Mock Risk Overrides
export const mockRiskOverrides: RiskOverride[] = [
  {
    id: 'OVR-001',
    riskId: 'RSK-015',
    riskTitle: 'Customer data privacy breach',
    originalScore: 20,
    originalRating: 'Critical',
    originalRank: 1,
    overrideScore: 20,
    overrideRating: 'Critical',
    overrideRank: 2,
    overriddenBy: 'Jennifer Walsh (CCO)',
    overrideDate: '2024-04-15',
    overrideRationale: 'New controls implemented reduce actual risk below calculated level. GDPR compliance measures now fully operational.',
    approvedBy: 'Board Risk Committee',
    approvalDate: '2024-04-16',
    status: 'Approved'
  },
  {
    id: 'OVR-002',
    riskId: 'RSK-007',
    riskTitle: 'Key personnel departure',
    originalScore: 12,
    originalRating: 'High',
    originalRank: 3,
    overrideScore: 9,
    overrideRating: 'Medium',
    overrideRank: 5,
    overriddenBy: 'Maria Garcia (CHRO)',
    overrideDate: '2024-04-20',
    overrideRationale: 'Succession planning and retention programs now in place reduce actual impact.',
    status: 'Pending'
  }
];

// Helper Functions
export function getRankingsForCategory(category: string): RiskRanking[] {
  return mockRiskRankings.filter(r => r.category === category);
}

export function getTopRisks(count: number = 10, type: 'inherent' | 'residual' = 'residual'): RiskRanking[] {
  const sorted = [...mockRiskRankings].sort((a, b) => {
    if (type === 'inherent') {
      return b.inherentScore - a.inherentScore;
    }
    return b.residualScore - a.residualScore;
  });
  return sorted.slice(0, count);
}

export function getRisksExceedingTolerance(): RiskRanking[] {
  return mockRiskRankings.filter(r => r.exceedsTolerance);
}

export function getRisksByAuthority(level: RiskRanking['authorityLevel']): RiskRanking[] {
  return mockRiskRankings.filter(r => r.authorityLevel === level);
}

export function getOverriddenRisks(): RiskRanking[] {
  return mockRiskRankings.filter(r => r.isOverridden);
}

export function calculateRank(risks: RiskRanking[], type: 'inherent' | 'residual' = 'residual'): RiskRanking[] {
  const sorted = [...risks].sort((a, b) => {
    if (type === 'inherent') {
      return b.inherentScore - a.inherentScore;
    }
    return b.residualScore - a.residualScore;
  });
  
  let currentRank = 1;
  return sorted.map((risk, index) => {
    if (index > 0) {
      const prevScore = type === 'inherent' ? sorted[index - 1].inherentScore : sorted[index - 1].residualScore;
      const currentScore = type === 'inherent' ? risk.inherentScore : risk.residualScore;
      if (currentScore < prevScore) {
        currentRank = index + 1;
      }
    }
    return {
      ...risk,
      [type === 'inherent' ? 'inherentRank' : 'residualRank']: currentRank
    };
  });
}
