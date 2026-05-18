/**
 * User Personas and Role-Based Permissions
 * Based on DoA User Personas diagram
 */

export type UserPersona = 
  | 'DoA Administrator'
  | 'Policy Owner / Compliance'
  | 'Approver (Manager → Board)'
  | 'Originator / Requester'
  | 'Internal Auditor'
  | 'Risk Officer'
  | 'Integrator / IT Admin'
  | 'Executive / Board';

export interface PersonaPermissions {
  persona: UserPersona;
  displayName: string;
  description: string;
  permissions: {
    // Authority Matrix
    viewMatrix?: boolean;
    editMatrix?: boolean;
    createMatrix?: boolean;
    manageVersions?: boolean;
    
    // Approvals
    submitRequests?: boolean;
    approveRequests?: boolean;
    viewAllApprovals?: boolean;
    viewMyApprovals?: boolean;
    delegateAuthority?: boolean;
    viewDelegateQueue?: boolean;
    
    // Delegations
    createDelegation?: boolean;
    viewDelegations?: boolean;
    revokeDelegation?: boolean;
    
    // SoD Rules
    viewSoDRules?: boolean;
    createSoDRules?: boolean;
    editSoDRules?: boolean;
    runBreachReports?: boolean;
    
    // Exceptions & Overrides
    requestException?: boolean;
    approveException?: boolean;
    manageExceptions?: boolean;
    linkToRiskRegister?: boolean;
    setRiskThresholds?: boolean;
    
    // Reporting & Audit
    viewReports?: boolean;
    viewAuditTrail?: boolean;
    viewSoDBreaches?: boolean;
    viewAuthorityStats?: boolean;
    exportEvidence?: boolean;
    viewDashboard?: boolean;
    viewHighValueReportals?: boolean;
    viewPeriodAttestations?: boolean;
    viewExceptionSummaries?: boolean;
    
    // Administration
    manageRoles?: boolean;
    defineSoDRules?: boolean;
    managePolicies?: boolean;
    signOffChanges?: boolean;
    
    // Integration
    manageAPIKeys?: boolean;
    connectERPHRMS?: boolean;
    monitorIntegration?: boolean;
    rotateCredentials?: boolean;
  };
  primaryActions: string[];
  dashboardView: 'full' | 'approver' | 'requester' | 'admin' | 'auditor' | 'executive';
}

export const PERSONA_DEFINITIONS: Record<UserPersona, PersonaPermissions> = {
  'DoA Administrator': {
    persona: 'DoA Administrator',
    displayName: 'DoA Administrator',
    description: 'System administrator with full control',
    permissions: {
      viewMatrix: true,
      editMatrix: true,
      createMatrix: true,
      manageVersions: true,
      submitRequests: true,
      approveRequests: true,
      viewAllApprovals: true,
      delegateAuthority: true,
      createDelegation: true,
      viewDelegations: true,
      revokeDelegation: true,
      viewSoDRules: true,
      createSoDRules: true,
      editSoDRules: true,
      runBreachReports: true,
      manageExceptions: true,
      viewReports: true,
      viewAuditTrail: true,
      exportEvidence: true,
      manageRoles: true,
      defineSoDRules: true,
      managePolicies: true,
      viewDashboard: true,
    },
    primaryActions: ['Configure authority matrix', 'Manage policies & versions', 'Define SoD rules', 'Manage roles'],
    dashboardView: 'admin',
  },
  
  'Policy Owner / Compliance': {
    persona: 'Policy Owner / Compliance',
    displayName: 'Policy Owner',
    description: 'Compliance officer managing policies',
    permissions: {
      viewMatrix: true,
      editMatrix: true,
      manageVersions: true,
      viewAllApprovals: true,
      viewSoDRules: true,
      createSoDRules: true,
      editSoDRules: true,
      runBreachReports: true,
      viewReports: true,
      viewAuditTrail: true,
      viewSoDBreaches: true,
      exportEvidence: true,
      managePolicies: true,
      signOffChanges: true,
      viewDashboard: true,
    },
    primaryActions: ['Align regs to DoA', 'Map regs to DoA', 'Sign-off on changes', 'Run breach reports'],
    dashboardView: 'admin',
  },
  
  'Approver (Manager → Board)': {
    persona: 'Approver (Manager → Board)',
    displayName: 'Approver',
    description: 'Manager or executive with approval authority',
    permissions: {
      viewMatrix: true,
      submitRequests: true,
      approveRequests: true,
      viewMyApprovals: true,
      delegateAuthority: true,
      createDelegation: true,
      viewDelegations: true,
      viewDelegateQueue: true,
      viewReports: false,
      viewAuditTrail: false,
      viewDashboard: true,
    },
    primaryActions: ['Approve requests', 'Delegate authority', 'Add justification', 'View delegate queue'],
    dashboardView: 'approver',
  },

  'Originator / Requester': {
    persona: 'Originator / Requester',
    displayName: 'Requester',
    description: 'Employee submitting approval requests',
    permissions: {
      viewMatrix: true,
      submitRequests: true,
      viewMyApprovals: true,
      viewDashboard: true,
    },
    primaryActions: ['Submit requests', 'Track status', 'Re-submit / withdraw'],
    dashboardView: 'requester',
  },

  'Internal Auditor': {
    persona: 'Internal Auditor',
    displayName: 'Internal Auditor',
    description: 'Auditor with read-only access to all data',
    permissions: {
      viewMatrix: true,
      viewAllApprovals: true,
      viewDelegations: true,
      viewSoDRules: true,
      viewSoDBreaches: true,
      viewReports: true,
      viewAuditTrail: true,
      viewAuthorityStats: true,
      exportEvidence: true,
      viewDashboard: true,
    },
    primaryActions: ['Read-only audit trail', 'SoD breach reports', 'Authority usage stats', 'Evidence export'],
    dashboardView: 'auditor',
  },

  'Risk Officer': {
    persona: 'Risk Officer',
    displayName: 'Risk Officer',
    description: 'Risk management and exception oversight',
    permissions: {
      viewMatrix: true,
      viewAllApprovals: true,
      viewSoDRules: true,
      viewSoDBreaches: true,
      manageExceptions: true,
      approveException: true,
      linkToRiskRegister: true,
      setRiskThresholds: true,
      viewReports: true,
      viewDashboard: true,
    },
    primaryActions: ['Manage exceptions', 'Link to risk register', 'Set risk thresholds', 'Review overrides'],
    dashboardView: 'admin',
  },

  'Integrator / IT Admin': {
    persona: 'Integrator / IT Admin',
    displayName: 'IT Admin',
    description: 'System integrator managing technical connections',
    permissions: {
      viewMatrix: true,
      manageAPIKeys: true,
      connectERPHRMS: true,
      monitorIntegration: true,
      rotateCredentials: true,
      viewDashboard: true,
    },
    primaryActions: ['Manage API keys', 'Connect ERP/HRMS', 'Monitor integration', 'Rotate credentials'],
    dashboardView: 'admin',
  },

  'Executive / Board': {
    persona: 'Executive / Board',
    displayName: 'Executive',
    description: 'C-level executive with high-level oversight',
    permissions: {
      viewMatrix: true,
      approveRequests: true,
      viewDashboard: true,
      viewHighValueReportals: true,
      viewPeriodAttestations: true,
      viewExceptionSummaries: true,
      viewReports: true,
    },
    primaryActions: ['Dashboard view', 'High-value reportals', 'Period attestations', 'Exception summaries'],
    dashboardView: 'executive',
  },
};
