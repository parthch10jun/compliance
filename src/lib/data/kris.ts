export interface KRI {
  id: string;
  name: string;
  description: string;
  category: 'Cybersecurity' | 'Operational' | 'Financial' | 'Compliance' | 'Strategic';
  owner: string;
  unit: '%' | 'count' | 'days' | 'USD' | 'ratio' | 'minutes';
  direction: 'higher_better' | 'lower_better';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  
  // Thresholds
  greenThreshold: number;
  yellowThreshold: number;
  redThreshold: number;
  
  // Current Status
  currentValue: number;
  previousValue: number;
  status: 'ok' | 'warning' | 'breach';
  trend: 'up' | 'down' | 'stable';
  
  // Linkage
  linkedRisks: string[]; // Risk IDs
  
  // Metadata
  dataSource: string;
  lastMeasured: string;
  nextMeasurement: string;
}

export interface KRIMeasurement {
  id: string;
  kriId: string;
  value: number;
  date: string;
  notes?: string;
  recordedBy: string;
  evidence?: string[];
}

export const mockKRIs: KRI[] = [
  // Cybersecurity KRIs
  {
    id: 'KRI-001',
    name: 'Cybersecurity Incident Count',
    description: 'Number of confirmed security incidents per month',
    category: 'Cybersecurity',
    owner: 'Sarah Chen (CISO)',
    unit: 'count',
    direction: 'lower_better',
    frequency: 'monthly',
    greenThreshold: 5,
    yellowThreshold: 10,
    redThreshold: 15,
    currentValue: 12,
    previousValue: 8,
    status: 'warning',
    trend: 'up',
    linkedRisks: ['RSK-001', 'RSK-002', 'RSK-015'],
    dataSource: 'SIEM System',
    lastMeasured: '2024-04-14',
    nextMeasurement: '2024-05-01'
  },
  {
    id: 'KRI-002',
    name: 'Mean Time to Detect (MTTD)',
    description: 'Average time to detect security incidents',
    category: 'Cybersecurity',
    owner: 'Sarah Chen (CISO)',
    unit: 'minutes',
    direction: 'lower_better',
    frequency: 'monthly',
    greenThreshold: 30,
    yellowThreshold: 60,
    redThreshold: 90,
    currentValue: 25,
    previousValue: 28,
    status: 'ok',
    trend: 'down',
    linkedRisks: ['RSK-002', 'RSK-015'],
    dataSource: 'SOC Dashboard',
    lastMeasured: '2024-04-14',
    nextMeasurement: '2024-05-01'
  },
  {
    id: 'KRI-003',
    name: 'Patch Compliance Rate',
    description: 'Percentage of systems with current patches',
    category: 'Cybersecurity',
    owner: 'Sarah Chen (CISO)',
    unit: '%',
    direction: 'higher_better',
    frequency: 'weekly',
    greenThreshold: 95,
    yellowThreshold: 90,
    redThreshold: 85,
    currentValue: 88,
    previousValue: 92,
    status: 'warning',
    trend: 'down',
    linkedRisks: ['RSK-002'],
    dataSource: 'Vulnerability Management',
    lastMeasured: '2024-04-14',
    nextMeasurement: '2024-04-21'
  },
  {
    id: 'KRI-004',
    name: 'Phishing Click Rate',
    description: 'Percentage of employees clicking phishing simulations',
    category: 'Cybersecurity',
    owner: 'Sarah Chen (CISO)',
    unit: '%',
    direction: 'lower_better',
    frequency: 'monthly',
    greenThreshold: 5,
    yellowThreshold: 10,
    redThreshold: 15,
    currentValue: 18,
    previousValue: 16,
    status: 'breach',
    trend: 'up',
    linkedRisks: ['RSK-003'],
    dataSource: 'Security Awareness Platform',
    lastMeasured: '2024-04-10',
    nextMeasurement: '2024-05-10'
  },
  
  // Operational KRIs
  {
    id: 'KRI-005',
    name: 'System Uptime',
    description: 'Percentage of planned uptime achieved',
    category: 'Operational',
    owner: 'David Kumar (COO)',
    unit: '%',
    direction: 'higher_better',
    frequency: 'daily',
    greenThreshold: 99.5,
    yellowThreshold: 99.0,
    redThreshold: 98.5,
    currentValue: 99.7,
    previousValue: 99.6,
    status: 'ok',
    trend: 'up',
    linkedRisks: ['RSK-008'],
    dataSource: 'Infrastructure Monitoring',
    lastMeasured: '2024-04-14',
    nextMeasurement: '2024-04-15'
  },
  {
    id: 'KRI-006',
    name: 'Incident Resolution Time',
    description: 'Average time to resolve operational incidents',
    category: 'Operational',
    owner: 'David Kumar (COO)',
    unit: 'minutes',
    direction: 'lower_better',
    frequency: 'weekly',
    greenThreshold: 60,
    yellowThreshold: 120,
    redThreshold: 180,
    currentValue: 95,
    previousValue: 110,
    status: 'warning',
    trend: 'down',
    linkedRisks: ['RSK-008', 'RSK-019'],
    dataSource: 'ServiceNow',
    lastMeasured: '2024-04-13',
    nextMeasurement: '2024-04-20'
  },
  {
    id: 'KRI-007',
    name: 'Supplier Delivery Delay Rate',
    description: 'Percentage of supplier deliveries delayed',
    category: 'Operational',
    owner: 'David Kumar (COO)',
    unit: '%',
    direction: 'lower_better',
    frequency: 'monthly',
    greenThreshold: 5,
    yellowThreshold: 10,
    redThreshold: 15,
    currentValue: 22,
    previousValue: 18,
    status: 'breach',
    trend: 'up',
    linkedRisks: ['RSK-004'],
    dataSource: 'Supply Chain System',
    lastMeasured: '2024-04-12',
    nextMeasurement: '2024-05-12'
  },

  // Financial KRIs
  {
    id: 'KRI-008',
    name: 'Credit Default Rate',
    description: 'Percentage of customer accounts in default',
    category: 'Financial',
    owner: 'Patricia Wilson (CFO)',
    unit: '%',
    direction: 'lower_better',
    frequency: 'monthly',
    greenThreshold: 2,
    yellowThreshold: 5,
    redThreshold: 8,
    currentValue: 3.2,
    previousValue: 3.0,
    status: 'warning',
    trend: 'up',
    linkedRisks: ['RSK-016'],
    dataSource: 'Financial System',
    lastMeasured: '2024-04-10',
    nextMeasurement: '2024-05-10'
  },
  {
    id: 'KRI-009',
    name: 'Liquidity Ratio',
    description: 'Current assets divided by current liabilities',
    category: 'Financial',
    owner: 'Patricia Wilson (CFO)',
    unit: 'ratio',
    direction: 'higher_better',
    frequency: 'monthly',
    greenThreshold: 1.5,
    yellowThreshold: 1.2,
    redThreshold: 1.0,
    currentValue: 1.8,
    previousValue: 1.7,
    status: 'ok',
    trend: 'up',
    linkedRisks: ['RSK-006'],
    dataSource: 'ERP System',
    lastMeasured: '2024-04-14',
    nextMeasurement: '2024-05-14'
  },
  {
    id: 'KRI-010',
    name: 'Budget Variance',
    description: 'Percentage deviation from approved budget',
    category: 'Financial',
    owner: 'Patricia Wilson (CFO)',
    unit: '%',
    direction: 'lower_better',
    frequency: 'monthly',
    greenThreshold: 5,
    yellowThreshold: 10,
    redThreshold: 15,
    currentValue: 7.5,
    previousValue: 6.8,
    status: 'warning',
    trend: 'up',
    linkedRisks: ['RSK-006'],
    dataSource: 'Budget Management System',
    lastMeasured: '2024-04-12',
    nextMeasurement: '2024-05-12'
  },

  // Compliance KRIs
  {
    id: 'KRI-011',
    name: 'Policy Acknowledgment Rate',
    description: 'Percentage of employees acknowledging policies',
    category: 'Compliance',
    owner: 'Jennifer Walsh (CCO)',
    unit: '%',
    direction: 'higher_better',
    frequency: 'monthly',
    greenThreshold: 95,
    yellowThreshold: 90,
    redThreshold: 85,
    currentValue: 97,
    previousValue: 96,
    status: 'ok',
    trend: 'up',
    linkedRisks: ['RSK-005'],
    dataSource: 'Policy Management System',
    lastMeasured: '2024-04-14',
    nextMeasurement: '2024-05-14'
  },
  {
    id: 'KRI-012',
    name: 'Audit Finding Count',
    description: 'Number of open audit findings',
    category: 'Compliance',
    owner: 'Jennifer Walsh (CCO)',
    unit: 'count',
    direction: 'lower_better',
    frequency: 'monthly',
    greenThreshold: 5,
    yellowThreshold: 10,
    redThreshold: 15,
    currentValue: 8,
    previousValue: 9,
    status: 'warning',
    trend: 'down',
    linkedRisks: ['RSK-005', 'RSK-011'],
    dataSource: 'Audit Management System',
    lastMeasured: '2024-04-13',
    nextMeasurement: '2024-05-13'
  },
  {
    id: 'KRI-013',
    name: 'Training Completion Rate',
    description: 'Percentage of required training completed',
    category: 'Compliance',
    owner: 'Maria Garcia (CHRO)',
    unit: '%',
    direction: 'higher_better',
    frequency: 'monthly',
    greenThreshold: 95,
    yellowThreshold: 90,
    redThreshold: 85,
    currentValue: 92,
    previousValue: 94,
    status: 'warning',
    trend: 'down',
    linkedRisks: ['RSK-007'],
    dataSource: 'LMS',
    lastMeasured: '2024-04-14',
    nextMeasurement: '2024-05-14'
  },
  {
    id: 'KRI-014',
    name: 'Regulatory Breach Count',
    description: 'Number of regulatory breaches identified',
    category: 'Compliance',
    owner: 'Jennifer Walsh (CCO)',
    unit: 'count',
    direction: 'lower_better',
    frequency: 'quarterly',
    greenThreshold: 0,
    yellowThreshold: 1,
    redThreshold: 2,
    currentValue: 1,
    previousValue: 0,
    status: 'warning',
    trend: 'up',
    linkedRisks: ['RSK-005', 'RSK-011'],
    dataSource: 'Compliance Tracking System',
    lastMeasured: '2024-04-01',
    nextMeasurement: '2024-07-01'
  },
];
