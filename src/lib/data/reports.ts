// Communication & Reporting Module
// Requirements: RM_CC_01, RM_CC_04, RM_CC_05, RM_CC_06, RM_MR_31, RM_MR_32

// RM_CC_01: User-defined graphs/charts
export interface CustomChart {
  id: string;
  name: string;
  description: string;
  chartType: 'Bar' | 'Line' | 'Pie' | 'Scatter' | 'Heatmap' | 'Treemap';
  
  // Data source
  dataSource: 'Risks' | 'Controls' | 'Treatments' | 'KRIs' | 'Assessments';
  
  // Filters
  filters: {
    category?: string[];
    businessUnit?: string[];
    ratingRange?: string[];
    dateRange?: { start: string; end: string };
  };
  
  // Dimensions
  xAxis: string; // Field name
  yAxis: string; // Field name
  groupBy?: string; // Optional grouping
  
  // Styling
  colorScheme: 'Default' | 'Risk' | 'Traffic Light' | 'Monochrome';
  showLegend: boolean;
  showDataLabels: boolean;
  
  // Metadata
  createdBy: string;
  createdDate: string;
  isPublic: boolean;
}

// RM_CC_04: Treatment plan status reports
export interface TreatmentStatusReport {
  id: string;
  reportDate: string;
  
  // Overall metrics
  totalPlans: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  overdue: number;
  
  // By business unit
  byBusinessUnit: {
    unit: string;
    total: number;
    completed: number;
    inProgress: number;
    averageCompletion: number; // percentage
  }[];
  
  // By risk rating
  byRiskRating: {
    rating: 'Critical' | 'High' | 'Medium' | 'Low';
    total: number;
    completed: number;
    avgDaysToComplete: number;
  }[];
  
  // Cost tracking
  totalBudget: number;
  totalSpent: number;
  projectedCost: number;
  
  // Effectiveness
  avgRiskReduction: number; // Average inherent → residual reduction
  controlsCoverage: number; // % of risks with controls
}

// RM_CC_05: Risk profiles by portfolio
export interface RiskProfile {
  id: string;
  name: string;
  portfolioType: 'Business Unit' | 'Department' | 'Product Line' | 'Geographic Region' | 'Strategic Initiative';
  portfolioValue: string; // e.g., "IT Department", "North America"
  
  // Risk summary
  totalRisks: number;
  criticalRisks: number;
  highRisks: number;
  mediumRisks: number;
  lowRisks: number;
  
  // Scores
  inherentRiskScore: number;
  residualRiskScore: number;
  riskReductionPercent: number;
  
  // Top risks
  topRisks: {
    riskId: string;
    riskTitle: string;
    rating: string;
    score: number;
  }[];
  
  // Treatment coverage
  controlsCoverage: number; // %
  treatmentPlansCoverage: number; // %
  
  // Trends
  trend: '↑' | '—' | '↓';
  trendPeriod: string; // e.g., "vs Last Quarter"
  
  // KRIs
  kriCount: number;
  kriticalKRIs: number; // KRIs exceeding threshold
  
  // Generated metadata
  generatedBy: string;
  generatedDate: string;
}

// RM_CC_06: Condensed metrics
export interface MetricsSummary {
  id: string;
  title: string;
  period: string; // e.g., "Q2 2024"
  
  // Key metrics
  metrics: {
    name: string;
    value: number | string;
    unit?: string;
    trend?: '↑' | '—' | '↓';
    comparison?: string; // e.g., "+15% vs Q1"
    status?: 'Good' | 'Warning' | 'Critical';
  }[];
  
  // Sparklines (mini trend charts)
  sparklines?: {
    metricName: string;
    dataPoints: number[];
    labels: string[];
  }[];
}

// RM_MR_31: Report library
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Risk' | 'Control' | 'Treatment' | 'Compliance' | 'Executive' | 'Board';
  
  // Report configuration
  sections: {
    sectionName: string;
    sectionType: 'Table' | 'Chart' | 'Metrics' | 'Text' | 'Heatmap';
    dataSource: string;
    filters?: any;
  }[];
  
  // Schedule
  frequency?: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Ad-hoc';
  recipients?: string[];
  
  // Access
  isPublic: boolean;
  allowedRoles: string[];
  
  // Metadata
  createdBy: string;
  createdDate: string;
  lastGenerated?: string;
}

// Mock Data
export const mockCustomCharts: CustomChart[] = [
  {
    id: 'CHART-001',
    name: 'Risk Distribution by Category',
    description: 'Pie chart showing risk count by category',
    chartType: 'Pie',
    dataSource: 'Risks',
    filters: {},
    xAxis: 'category',
    yAxis: 'count',
    colorScheme: 'Risk',
    showLegend: true,
    showDataLabels: true,
    createdBy: 'Jennifer Walsh (CCO)',
    createdDate: '2024-01-15',
    isPublic: true
  },
  {
    id: 'CHART-002',
    name: 'Risk Trend Over Time',
    description: 'Line chart showing residual risk scores by month',
    chartType: 'Line',
    dataSource: 'Risks',
    filters: { dateRange: { start: '2024-01-01', end: '2024-04-30' } },
    xAxis: 'month',
    yAxis: 'residualScore',
    groupBy: 'category',
    colorScheme: 'Default',
    showLegend: true,
    showDataLabels: false,
    createdBy: 'Sarah Chen (CISO)',
    createdDate: '2024-02-01',
    isPublic: true
  }
];

export const mockTreatmentStatusReport: TreatmentStatusReport = {
  id: 'RPT-TSR-001',
  reportDate: '2024-04-21',
  totalPlans: 15,
  completed: 8,
  inProgress: 5,
  notStarted: 1,
  overdue: 1,
  byBusinessUnit: [
    { unit: 'IT Department', total: 6, completed: 4, inProgress: 2, averageCompletion: 75 },
    { unit: 'Finance', total: 4, completed: 2, inProgress: 2, averageCompletion: 60 },
    { unit: 'Operations', total: 5, completed: 2, inProgress: 1, averageCompletion: 50 }
  ],
  byRiskRating: [
    { rating: 'Critical', total: 3, completed: 2, avgDaysToComplete: 45 },
    { rating: 'High', total: 6, completed: 4, avgDaysToComplete: 30 },
    { rating: 'Medium', total: 5, completed: 2, avgDaysToComplete: 60 },
    { rating: 'Low', total: 1, completed: 0, avgDaysToComplete: 0 }
  ],
  totalBudget: 500000,
  totalSpent: 325000,
  projectedCost: 475000,
  avgRiskReduction: 45,
  controlsCoverage: 85
};

export const mockRiskProfiles: RiskProfile[] = [
  {
    id: 'PROF-001',
    name: 'IT Department Risk Profile',
    portfolioType: 'Business Unit',
    portfolioValue: 'IT Department',
    totalRisks: 8,
    criticalRisks: 0,
    highRisks: 2,
    mediumRisks: 5,
    lowRisks: 1,
    inherentRiskScore: 145,
    residualRiskScore: 68,
    riskReductionPercent: 53,
    topRisks: [
      { riskId: 'RSK-001', riskTitle: 'Third-party vendor data breach', rating: 'Medium', score: 9 },
      { riskId: 'RSK-002', riskTitle: 'Ransomware attack', rating: 'High', score: 12 }
    ],
    controlsCoverage: 88,
    treatmentPlansCoverage: 75,
    trend: '↓',
    trendPeriod: 'vs Q1 2024',
    kriCount: 12,
    kriticalKRIs: 2,
    generatedBy: 'System',
    generatedDate: '2024-04-21'
  }
];

export const mockReportTemplates: ReportTemplate[] = [
  {
    id: 'TPL-001',
    name: 'Executive Risk Summary',
    description: 'High-level risk overview for executive leadership',
    category: 'Executive',
    sections: [
      { sectionName: 'Key Metrics', sectionType: 'Metrics', dataSource: 'risks' },
      { sectionName: 'Risk Heatmap', sectionType: 'Heatmap', dataSource: 'risks' },
      { sectionName: 'Top 10 Risks', sectionType: 'Table', dataSource: 'risks' }
    ],
    frequency: 'Monthly',
    recipients: ['Board Risk Committee', 'Jennifer Walsh (CCO)'],
    isPublic: false,
    allowedRoles: ['Executive', 'Risk Approver'],
    createdBy: 'Jennifer Walsh (CCO)',
    createdDate: '2024-01-01',
    lastGenerated: '2024-04-01'
  }
];
