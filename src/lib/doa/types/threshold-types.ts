/**
 * Advanced Threshold Types
 * Implements BR-AT-01 through BR-AT-10
 */

// Multi-currency support including Middle Eastern currencies
export type Currency =
  // Major currencies
  | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'INR' | 'AUD' | 'CAD' | 'CHF'
  // Middle Eastern currencies
  | 'AED' // UAE Dirham
  | 'SAR' // Saudi Riyal
  | 'QAR' // Qatari Riyal
  | 'KWD' // Kuwaiti Dinar
  | 'BHD' // Bahraini Dinar
  | 'OMR' // Omani Rial
  | 'JOD' // Jordanian Dinar
  | 'EGP' // Egyptian Pound
  | 'ILS' // Israeli Shekel
  | 'LBP' // Lebanese Pound
  // Additional major currencies
  | 'SGD' // Singapore Dollar
  | 'HKD' // Hong Kong Dollar
  | 'KRW' // South Korean Won
  | 'MXN' // Mexican Peso
  | 'BRL' // Brazilian Real
  | 'ZAR';// South African Rand

export interface MonetaryThreshold {
  type: 'monetary';
  amount: number;
  currency: Currency;
  baseCurrency: Currency; // For FX conversion
  fxRate?: number; // Real-time or configured rate
  fxSource?: 'ECB' | 'Bloomberg' | 'Reuters' | 'Custom';
}

// BR-AT-02: Non-monetary thresholds
export type NonMonetaryType = 
  | 'risk_score' 
  | 'severity' 
  | 'headcount' 
  | 'contract_duration' 
  | 'sla_exposure' 
  | 'data_classification' 
  | 'customer_credit_rating'
  | 'vendor_rating';

export interface NonMonetaryThreshold {
  type: 'non_monetary';
  attributeType: NonMonetaryType;
  value: string | number;
  operator: '=' | '>' | '<' | '>=' | '<=' | '!=' | 'in' | 'not_in';
}

// BR-AT-03: Compound thresholds
export interface CompoundThreshold {
  type: 'compound';
  operator: 'AND' | 'OR';
  conditions: (MonetaryThreshold | NonMonetaryThreshold | CompoundThreshold)[];
}

// BR-AT-04: Multi-dimensional thresholds
export interface DimensionalThreshold {
  role?: string;
  grade?: string;
  department?: string;
  legalEntity?: string;
  businessUnit?: string;
  region?: string;
  costCenter?: string;
  threshold: MonetaryThreshold | NonMonetaryThreshold | CompoundThreshold;
}

// BR-AT-05: Cumulative and per-vendor thresholds
export type ThresholdScope = 'absolute' | 'cumulative' | 'per_vendor' | 'per_counterparty' | 'per_customer';

export interface CumulativeThreshold extends MonetaryThreshold {
  scope: ThresholdScope;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'rolling_12m';
  vendorId?: string;
  counterpartyId?: string;
}

// BR-AT-06: Authority bands with boundary semantics
export interface AuthorityBand {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  minInclusive: boolean; // true = >=, false = >
  maxInclusive: boolean; // true = <=, false = <
  currency: Currency;
  approverRole: string;
  requiredApprovers: number; // BR-AT-08: Four-eyes principle
}

// BR-AT-07: Warning thresholds
export interface ThresholdWarning {
  enabled: boolean;
  warningPercentage: number; // e.g., 90 = warn at 90% of limit
  message?: string;
}

// BR-AT-08: Four-eyes principle
export interface FourEyesPrinciple {
  enabled: boolean;
  thresholdAmount: number;
  currency: Currency;
  requirementAtSameLevel: boolean; // Both approvers at same level
  allowHigherLevel: boolean; // Or one higher level approver
}

// BR-AT-09: Tax and indirect cost handling
export interface TaxInclusionConfig {
  includeVAT: boolean;
  includeGST: boolean;
  includeDuty: boolean;
  includeShipping: boolean;
  includeOtherIndirectCosts: boolean;
  categorySpecific: Record<string, boolean>; // Per category overrides
}

// BR-AT-10: Effective dating
export interface EffectiveDatedThreshold {
  id: string;
  threshold: DimensionalThreshold;
  effectiveDate: string; // ISO date
  expiryDate?: string; // ISO date, optional
  version: number;
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

// Complete Authority Matrix Entry with all threshold features
export interface AdvancedAuthorityEntry {
  id: string;
  matrixId: string;
  function: string;
  category: string;
  
  // BR-AT-04: Multi-dimensional
  dimensions: {
    role?: string[];
    grade?: string[];
    department?: string[];
    legalEntity?: string[];
    businessUnit?: string[];
    region?: string[];
  };
  
  // BR-AT-06: Authority band
  band: AuthorityBand;
  
  // BR-AT-05: Scope
  scope: ThresholdScope;
  
  // BR-AT-07: Warnings
  warning: ThresholdWarning;
  
  // BR-AT-08: Four-eyes
  fourEyes?: FourEyesPrinciple;
  
  // BR-AT-09: Tax inclusion
  taxInclusion: TaxInclusionConfig;
  
  // BR-AT-10: Effective dating
  effectiveDate: string;
  expiryDate?: string;
  version: number;
  
  // Metadata
  createdBy: string;
  createdAt: string;
  modifiedBy?: string;
  modifiedAt?: string;
}

// Threshold evaluation result
export interface ThresholdEvaluationResult {
  matches: boolean;
  matchedEntry?: AdvancedAuthorityEntry;
  requiredApprovers: string[];
  warnings: string[];
  convertedAmount?: {
    original: number;
    originalCurrency: Currency;
    converted: number;
    baseCurrency: Currency;
    fxRate: number;
  };
  fourEyesRequired: boolean;
  cumulativeUsage?: {
    used: number;
    limit: number;
    percentage: number;
    period: string;
  };
}
