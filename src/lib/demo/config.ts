/**
 * [DEMO] Demo Mode Configuration
 * 
 * This file controls demo-specific features for client demonstrations.
 * Toggle DEMO_MODE.enabled to turn demo features on/off.
 * 
 * To remove all demo features:
 * 1. Set DEMO_MODE.enabled = false
 * 2. Delete the /src/lib/demo folder
 * 3. Remove demo imports from data files
 */

export const DEMO_MODE = {
  enabled: true, // Set to false to disable all demo features
  client: 'payme-india',
  clientName: 'PayMe India',
  
  features: {
    demoProgram: true,      // Show PayMe India demo compliance program
    demoPlaybooks: true,    // Show demo playbooks/workflows
    demoDashboard: true,    // Show demo dashboard widgets
    demoData: true,         // Include demo-specific data
    demoScenarios: true,    // Enable demo scenarios
  },
  
  // Client-specific information
  clientInfo: {
    name: 'PayMe India',
    legalName: 'PayMe India Private Limited',
    industry: 'Financial Services',
    sector: 'NBFC - Digital Lending',
    regulators: ['RBI', 'MeitY'],
    headquarters: 'Noida, Uttar Pradesh, India',
    website: 'https://www.paymeindia.in',
    
    // Key compliance areas
    complianceAreas: [
      'RBI NBFC Scale-Based Regulation',
      'RBI Digital Lending Guidelines',
      'DPDP Act 2023',
      'ISO 27001:2022',
      'IT Act 2000',
      'Prevention of Money Laundering Act (PMLA)'
    ],
    
    // Business context
    businessContext: {
      products: ['Personal Loans', 'MSME Loans', 'Short-term Loans', 'Empowerment Loans'],
      customerBase: '5M+ customers',
      loansDisbursed: '₹2000+ Crores',
      avgLoanSize: '₹50,000',
      processingTime: '< 5 minutes',
    }
  },
  
  // Demo personas
  personas: {
    complianceHead: {
      name: 'Rajesh Kumar',
      role: 'Head of Compliance',
      email: 'rajesh.kumar@paymeindia.in',
      department: 'Legal & Compliance'
    },
    ciso: {
      name: 'Priya Sharma',
      role: 'Chief Information Security Officer',
      email: 'priya.sharma@paymeindia.in',
      department: 'Information Security'
    },
    dpo: {
      name: 'Anjali Verma',
      role: 'Data Protection Officer',
      email: 'anjali.verma@paymeindia.in',
      department: 'Legal & Compliance'
    },
    cfo: {
      name: 'Vikram Malhotra',
      role: 'Chief Financial Officer',
      email: 'vikram.malhotra@paymeindia.in',
      department: 'Finance'
    }
  }
};

/**
 * Helper function to check if demo mode is enabled
 */
export function isDemoEnabled(): boolean {
  return DEMO_MODE.enabled;
}

/**
 * Helper function to check if a specific demo feature is enabled
 */
export function isDemoFeatureEnabled(feature: keyof typeof DEMO_MODE.features): boolean {
  return DEMO_MODE.enabled && DEMO_MODE.features[feature];
}

/**
 * Helper function to get demo client info
 */
export function getDemoClientInfo() {
  return DEMO_MODE.clientInfo;
}

/**
 * Helper function to get demo personas
 */
export function getDemoPersonas() {
  return DEMO_MODE.personas;
}

/**
 * Tag for identifying demo data
 */
export const DEMO_TAG = '[DEMO]';

/**
 * Demo data marker interface
 */
export interface DemoMarker {
  isDemo?: boolean;
  demoClient?: string;
  demoDescription?: string;
}

