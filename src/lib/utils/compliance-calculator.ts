// Compliance Score Calculation Engine

import {
  AnyCalculationConfig,
  CalculationResult,
  ComplianceScoreBreakdown,
  SimpleAverageConfig,
  WeightedAverageConfig,
  ControlBasedConfig,
  RiskWeightedConfig,
  MaturityBasedConfig,
  CustomFormulaConfig,
} from '../types/compliance-calculations';

// Mock data interfaces (replace with actual data from your system)
interface ProgramData {
  requirements: Array<{
    id: string;
    complianceScore: number;
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
    status: string;
  }>;
  controls: Array<{
    id: string;
    effectiveness: 'Effective' | 'Partially Effective' | 'Ineffective' | 'Not Tested';
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
  }>;
  tests: Array<{
    id: string;
    result: 'Pass' | 'Fail' | 'Pending';
    controlId: string;
  }>;
  obligations: Array<{
    id: string;
    status: string;
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
  }>;
  risks: Array<{
    id: string;
    rating: 'Critical' | 'High' | 'Medium' | 'Low';
    residualRisk: number;
  }>;
}

export class ComplianceCalculator {
  /**
   * Calculate compliance score based on configuration
   */
  static calculate(config: AnyCalculationConfig, data: ProgramData): CalculationResult {
    try {
      switch (config.method) {
        case 'simple-average':
          return this.calculateSimpleAverage(config, data);
        case 'weighted-average':
          return this.calculateWeightedAverage(config, data);
        case 'control-based':
          return this.calculateControlBased(config, data);
        case 'risk-weighted':
          return this.calculateRiskWeighted(config, data);
        case 'maturity-based':
          return this.calculateMaturityBased(config, data);
        case 'custom-formula':
          return this.calculateCustomFormula(config, data);
        default:
          throw new Error(`Unknown calculation method: ${(config as any).method}`);
      }
    } catch (error) {
      return {
        score: 0,
        breakdown: {
          overallScore: 0,
          method: config.method,
          calculatedAt: new Date().toISOString(),
          components: [],
          metadata: {},
        },
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Simple Average: Average of all requirement compliance scores
   */
  private static calculateSimpleAverage(
    config: SimpleAverageConfig,
    data: ProgramData
  ): CalculationResult {
    const components: ComplianceScoreBreakdown['components'] = [];
    let totalScore = 0;
    let totalWeight = 0;

    if (config.includeRequirements && data.requirements.length > 0) {
      const reqScore = data.requirements.reduce((sum, req) => sum + req.complianceScore, 0) / data.requirements.length;
      components.push({
        name: 'Requirements',
        score: reqScore,
        weight: 1,
        weightedScore: reqScore,
      });
      totalScore += reqScore;
      totalWeight += 1;
    }

    if (config.includeControls && data.controls.length > 0) {
      const effectiveControls = data.controls.filter(c => c.effectiveness === 'Effective').length;
      const controlScore = (effectiveControls / data.controls.length) * 100;
      components.push({
        name: 'Controls',
        score: controlScore,
        weight: 1,
        weightedScore: controlScore,
      });
      totalScore += controlScore;
      totalWeight += 1;
    }

    if (config.includeTests && data.tests.length > 0) {
      const passedTests = data.tests.filter(t => t.result === 'Pass').length;
      const testScore = (passedTests / data.tests.length) * 100;
      components.push({
        name: 'Tests',
        score: testScore,
        weight: 1,
        weightedScore: testScore,
      });
      totalScore += testScore;
      totalWeight += 1;
    }

    const overallScore = totalWeight > 0 ? totalScore / totalWeight : 0;

    return {
      score: Math.round(overallScore),
      breakdown: {
        overallScore: Math.round(overallScore),
        method: 'simple-average',
        calculatedAt: new Date().toISOString(),
        components,
        metadata: {
          totalRequirements: data.requirements.length,
          compliantRequirements: data.requirements.filter(r => r.complianceScore >= 80).length,
          totalControls: data.controls.length,
          effectiveControls: data.controls.filter(c => c.effectiveness === 'Effective').length,
          totalTests: data.tests.length,
          passedTests: data.tests.filter(t => t.result === 'Pass').length,
        },
      },
    };
  }

  /**
   * Weighted Average: Weighted average based on priority and risk
   */
  private static calculateWeightedAverage(
    config: WeightedAverageConfig,
    data: ProgramData
  ): CalculationResult {
    const components: ComplianceScoreBreakdown['components'] = [];
    let totalWeightedScore = 0;

    // Requirements with priority weighting
    if (data.requirements.length > 0) {
      let reqWeightedSum = 0;
      let reqTotalWeight = 0;

      data.requirements.forEach(req => {
        const priorityWeight = config.priorityWeights?.[req.priority] || 1;
        reqWeightedSum += req.complianceScore * priorityWeight;
        reqTotalWeight += priorityWeight;
      });

      const reqScore = reqTotalWeight > 0 ? reqWeightedSum / reqTotalWeight : 0;
      const weightedScore = reqScore * config.weights.requirements;

      components.push({
        name: 'Requirements',
        score: reqScore,
        weight: config.weights.requirements,
        weightedScore,
        details: { priorityWeighted: true },
      });
      totalWeightedScore += weightedScore;
    }

    // Controls
    if (data.controls.length > 0) {
      const effectiveControls = data.controls.filter(c => c.effectiveness === 'Effective').length;
      const controlScore = (effectiveControls / data.controls.length) * 100;
      const weightedScore = controlScore * config.weights.controls;

      components.push({
        name: 'Controls',
        score: controlScore,
        weight: config.weights.controls,
        weightedScore,
      });
      totalWeightedScore += weightedScore;
    }

    // Tests
    if (data.tests.length > 0) {
      const passedTests = data.tests.filter(t => t.result === 'Pass').length;
      const testScore = (passedTests / data.tests.length) * 100;
      const weightedScore = testScore * config.weights.tests;

      components.push({
        name: 'Tests',
        score: testScore,
        weight: config.weights.tests,
        weightedScore,
      });
      totalWeightedScore += weightedScore;
    }

    // Obligations
    if (data.obligations.length > 0) {
      const completedObligations = data.obligations.filter(o => o.status === 'Completed').length;
      const obligationScore = (completedObligations / data.obligations.length) * 100;
      const weightedScore = obligationScore * config.weights.obligations;

      components.push({
        name: 'Obligations',
        score: obligationScore,
        weight: config.weights.obligations,
        weightedScore,
      });
      totalWeightedScore += weightedScore;
    }

    return {
      score: Math.round(totalWeightedScore),
      breakdown: {
        overallScore: Math.round(totalWeightedScore),
        method: 'weighted-average',
        calculatedAt: new Date().toISOString(),
        components,
        metadata: {
          totalRequirements: data.requirements.length,
          totalControls: data.controls.length,
          totalTests: data.tests.length,
          totalObligations: data.obligations.length,
        },
      },
    };
  }

  /**
   * Control-Based: Score based on control effectiveness and test results
   */
  private static calculateControlBased(
    config: ControlBasedConfig,
    data: ProgramData
  ): CalculationResult {
    const components: ComplianceScoreBreakdown['components'] = [];

    // Control effectiveness score
    let controlWeightedSum = 0;
    let controlTotalWeight = 0;

    data.controls.forEach(control => {
      const weight = config.controlEffectivenessWeights[control.effectiveness];
      controlWeightedSum += weight * 100;
      controlTotalWeight += 1;
    });

    const controlScore = controlTotalWeight > 0 ? controlWeightedSum / controlTotalWeight : 0;

    components.push({
      name: 'Control Effectiveness',
      score: controlScore,
      weight: 0.6,
      weightedScore: controlScore * 0.6,
    });

    // Test results score
    let testWeightedSum = 0;
    let testTotalWeight = 0;

    data.tests.forEach(test => {
      const weight = config.testResultWeights[test.result];
      testWeightedSum += weight * 100;
      testTotalWeight += 1;
    });

    const testScore = testTotalWeight > 0 ? testWeightedSum / testTotalWeight : 0;

    components.push({
      name: 'Test Results',
      score: testScore,
      weight: 0.4,
      weightedScore: testScore * 0.4,
    });

    const overallScore = controlScore * 0.6 + testScore * 0.4;

    return {
      score: Math.round(overallScore),
      breakdown: {
        overallScore: Math.round(overallScore),
        method: 'control-based',
        calculatedAt: new Date().toISOString(),
        components,
        metadata: {
          totalControls: data.controls.length,
          effectiveControls: data.controls.filter(c => c.effectiveness === 'Effective').length,
          totalTests: data.tests.length,
          passedTests: data.tests.filter(t => t.result === 'Pass').length,
        },
      },
    };
  }

  /**
   * Risk-Weighted: Score weighted by risk impact and residual risk
   */
  private static calculateRiskWeighted(
    config: RiskWeightedConfig,
    data: ProgramData
  ): CalculationResult {
    const components: ComplianceScoreBreakdown['components'] = [];

    // Calculate risk-adjusted compliance
    let riskWeightedSum = 0;
    let totalRiskWeight = 0;

    data.risks.forEach(risk => {
      const riskMultiplier = config.riskImpactMultiplier[risk.rating];
      const residualImpact = risk.residualRisk * config.residualRiskFactor;

      // Find controls addressing this risk
      const relatedControls = data.controls.filter(c =>
        // In real implementation, you'd have a mapping between risks and controls
        true
      );

      const controlEffectiveness = relatedControls.length > 0
        ? relatedControls.filter(c => c.effectiveness === 'Effective').length / relatedControls.length
        : 0;

      const riskScore = (controlEffectiveness * config.controlEffectivenessImpact +
                        (1 - residualImpact) * (1 - config.controlEffectivenessImpact)) * 100;

      riskWeightedSum += riskScore * riskMultiplier;
      totalRiskWeight += riskMultiplier;
    });

    const overallScore = totalRiskWeight > 0 ? riskWeightedSum / totalRiskWeight : 0;

    components.push({
      name: 'Risk-Weighted Compliance',
      score: overallScore,
      weight: 1,
      weightedScore: overallScore,
      details: {
        totalRisks: data.risks.length,
        criticalRisks: data.risks.filter(r => r.rating === 'Critical').length,
      },
    });

    return {
      score: Math.round(overallScore),
      breakdown: {
        overallScore: Math.round(overallScore),
        method: 'risk-weighted',
        calculatedAt: new Date().toISOString(),
        components,
        metadata: {
          totalRisks: data.risks.length,
          totalControls: data.controls.length,
          effectiveControls: data.controls.filter(c => c.effectiveness === 'Effective').length,
        },
      },
    };
  }

  /**
   * Maturity-Based: Score based on compliance maturity levels
   */
  private static calculateMaturityBased(
    config: MaturityBasedConfig,
    data: ProgramData
  ): CalculationResult {
    const components: ComplianceScoreBreakdown['components'] = [];

    // Calculate base compliance score
    const baseScore = data.requirements.length > 0
      ? data.requirements.reduce((sum, req) => sum + req.complianceScore, 0) / data.requirements.length
      : 0;

    // Determine maturity level
    const maturityLevel = config.maturityLevels.find(
      level => baseScore >= level.scoreRange[0] && baseScore <= level.scoreRange[1]
    ) || config.maturityLevels[0];

    // Apply maturity weight and progression factor
    const maturityAdjustedScore = baseScore * maturityLevel.weight * config.progressionFactor;

    components.push({
      name: `Maturity Level ${maturityLevel.level}: ${maturityLevel.name}`,
      score: baseScore,
      weight: maturityLevel.weight,
      weightedScore: maturityAdjustedScore,
      details: {
        maturityLevel: maturityLevel.level,
        maturityName: maturityLevel.name,
        progressionFactor: config.progressionFactor,
      },
    });

    return {
      score: Math.round(Math.min(maturityAdjustedScore, 100)),
      breakdown: {
        overallScore: Math.round(Math.min(maturityAdjustedScore, 100)),
        method: 'maturity-based',
        calculatedAt: new Date().toISOString(),
        components,
        metadata: {
          maturityLevel: maturityLevel.level,
          maturityName: maturityLevel.name,
          baseScore,
        },
      },
    };
  }

  /**
   * Custom Formula: Evaluate custom formula
   */
  private static calculateCustomFormula(
    config: CustomFormulaConfig,
    data: ProgramData
  ): CalculationResult {
    const components: ComplianceScoreBreakdown['components'] = [];
    const variables: Record<string, number> = {};

    // Calculate each variable
    config.variables.forEach(variable => {
      let value = 0;

      switch (variable.source) {
        case 'requirements':
          if (variable.aggregation === 'average') {
            value = data.requirements.length > 0
              ? data.requirements.reduce((sum, r) => sum + r.complianceScore, 0) / data.requirements.length / 100
              : 0;
          }
          break;
        case 'controls':
          if (variable.aggregation === 'average' || variable.aggregation === 'weighted-average') {
            value = data.controls.length > 0
              ? data.controls.filter(c => c.effectiveness === 'Effective').length / data.controls.length
              : 0;
          }
          break;
        case 'tests':
          if (variable.aggregation === 'average') {
            value = data.tests.length > 0
              ? data.tests.filter(t => t.result === 'Pass').length / data.tests.length
              : 0;
          }
          break;
      }

      variables[variable.name] = value;

      components.push({
        name: `${variable.name}: ${variable.description}`,
        score: value * 100,
        weight: 1,
        weightedScore: value * 100,
      });
    });

    // Evaluate formula (simplified - in production use a safe expression evaluator)
    let formula = config.formula;
    Object.entries(variables).forEach(([name, value]) => {
      formula = formula.replace(new RegExp(name, 'g'), value.toString());
    });

    let overallScore = 0;
    try {
      // WARNING: eval is dangerous in production! Use a safe expression evaluator library
      overallScore = eval(formula);
    } catch (error) {
      return {
        score: 0,
        breakdown: {
          overallScore: 0,
          method: 'custom-formula',
          calculatedAt: new Date().toISOString(),
          components: [],
          metadata: {},
        },
        errors: ['Failed to evaluate custom formula'],
      };
    }

    return {
      score: Math.round(Math.min(Math.max(overallScore, 0), 100)),
      breakdown: {
        overallScore: Math.round(Math.min(Math.max(overallScore, 0), 100)),
        method: 'custom-formula',
        calculatedAt: new Date().toISOString(),
        components,
        metadata: {
          formula: config.formula,
          variables,
        },
      },
    };
  }
}
