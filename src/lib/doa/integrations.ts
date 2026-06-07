/**
 * DoA Integrations catalogue + permission store.
 *
 * Models the systems a DoA programme typically connects to (SAP ERP, GRC,
 * SuccessFactors, Ariba, e-signature, etc.). Each integration exposes a set
 * of tools grouped into read-only and write/sync, and each tool carries a
 * three-state permission (allow / ask / deny) — mirroring a modern
 * connector-permissions UI. State persists in localStorage.
 */

export type ToolPermission = 'allow' | 'ask' | 'deny';

export interface IntegrationTool {
  id: string;
  label: string;
  description: string;
  defaultPermission: ToolPermission;
}

export interface Integration {
  id: string;
  name: string;
  vendor: string;
  category: 'ERP' | 'GRC' | 'HR' | 'Procurement' | 'E-Signature' | 'Productivity' | 'ITSM';
  monogram: string;
  accent: string;
  blurb: string;
  defaultConnected: boolean;
  readTools: IntegrationTool[];
  writeTools: IntegrationTool[];
}

export const INTEGRATIONS: Integration[] = [
  {
    id: 'sap-erp',
    name: 'SAP ERP',
    vendor: 'SAP',
    category: 'ERP',
    monogram: 'ERP',
    accent: '#0FAAFF',
    blurb: 'Bring financial structure into the DoA — cost centres, GL accounts, and approval thresholds. Push approved delegations back as workflow authorisations.',
    defaultConnected: true,
    readTools: [
      { id: 'read_cost_centers', label: 'Read cost centres', description: 'Pull the cost-centre hierarchy to scope delegations.', defaultPermission: 'allow' },
      { id: 'read_org_units', label: 'Read org units', description: 'Org structure for routing approvals.', defaultPermission: 'allow' },
      { id: 'read_approval_thresholds', label: 'Read approval thresholds', description: 'Existing spend limits per role.', defaultPermission: 'allow' },
      { id: 'read_vendor_master', label: 'Read vendor master', description: 'Vendor records for contract delegations.', defaultPermission: 'ask' },
      { id: 'read_gl_accounts', label: 'Read GL accounts', description: 'General-ledger accounts for financial scoping.', defaultPermission: 'ask' },
    ],
    writeTools: [
      { id: 'push_approved_delegations', label: 'Push approved delegations', description: 'Write authorised delegations into SAP workflow.', defaultPermission: 'ask' },
      { id: 'sync_financial_limits', label: 'Sync financial limits', description: 'Update SAP release strategies from the matrix.', defaultPermission: 'ask' },
      { id: 'post_approval_workflow', label: 'Post approval workflow', description: 'Trigger SAP approval workflows on matrix events.', defaultPermission: 'deny' },
    ],
  },
  {
    id: 'sap-grc',
    name: 'SAP GRC',
    vendor: 'SAP',
    category: 'GRC',
    monogram: 'GRC',
    accent: '#1E8E3E',
    blurb: 'Keep segregation-of-duties and risk controls aligned. Run proposed delegation changes through GRC risk analysis before they go live.',
    defaultConnected: false,
    readTools: [
      { id: 'read_sod_rules', label: 'Read SoD rules', description: 'Segregation-of-duties rule set.', defaultPermission: 'allow' },
      { id: 'read_risk_ratings', label: 'Read risk ratings', description: 'Risk scores per role/function.', defaultPermission: 'allow' },
      { id: 'read_control_assignments', label: 'Read control assignments', description: 'Which controls map to which authorities.', defaultPermission: 'allow' },
      { id: 'read_mitigation_controls', label: 'Read mitigation controls', description: 'Compensating controls for accepted risks.', defaultPermission: 'ask' },
    ],
    writeTools: [
      { id: 'push_delegation_for_risk_analysis', label: 'Submit delegation for risk analysis', description: 'Run a proposed change through GRC before approval.', defaultPermission: 'ask' },
      { id: 'sync_sod_conflicts', label: 'Sync SoD conflicts', description: 'Pull detected conflicts back into the matrix.', defaultPermission: 'ask' },
      { id: 'post_remediation_status', label: 'Post remediation status', description: 'Write remediation outcomes to GRC.', defaultPermission: 'deny' },
    ],
  },
  {
    id: 'sap-successfactors',
    name: 'SAP SuccessFactors',
    vendor: 'SAP',
    category: 'HR',
    monogram: 'SF',
    accent: '#7B2FF7',
    blurb: 'The people source of truth. Sync employees, org hierarchy, grades and titles, and the joiners / movers / leavers feed so the matrix always reflects who actually holds each role.',
    defaultConnected: true,
    readTools: [
      { id: 'read_employees', label: 'Read employees', description: 'Employee master records.', defaultPermission: 'allow' },
      { id: 'read_org_hierarchy', label: 'Read org hierarchy', description: 'Reporting lines and structure.', defaultPermission: 'allow' },
      { id: 'read_job_titles_grades', label: 'Read job titles & grades', description: 'Title and grade for role mapping.', defaultPermission: 'allow' },
      { id: 'read_reporting_lines', label: 'Read reporting lines', description: 'Manager/subordinate relationships.', defaultPermission: 'allow' },
    ],
    writeTools: [
      { id: 'sync_joiners_movers_leavers', label: 'Sync joiners / movers / leavers', description: 'Auto-update role holders on HR events.', defaultPermission: 'allow' },
      { id: 'push_role_assignments', label: 'Push role assignments', description: 'Write matrix role assignments back to SF.', defaultPermission: 'deny' },
    ],
  },
  {
    id: 'sap-ariba',
    name: 'SAP Ariba',
    vendor: 'SAP',
    category: 'Procurement',
    monogram: 'AR',
    accent: '#F08C00',
    blurb: 'Procurement and sourcing. Route purchase-order approvals through the matrix and keep spend thresholds in sync with delegated authority.',
    defaultConnected: false,
    readTools: [
      { id: 'read_procurement_categories', label: 'Read procurement categories', description: 'Category tree for scoping delegations.', defaultPermission: 'allow' },
      { id: 'read_supplier_master', label: 'Read supplier master', description: 'Supplier records.', defaultPermission: 'ask' },
      { id: 'read_po_data', label: 'Read purchase orders', description: 'PO data for approval routing.', defaultPermission: 'allow' },
    ],
    writeTools: [
      { id: 'sync_po_approval_routing', label: 'Sync PO approval routing', description: 'Apply matrix routing to Ariba approvals.', defaultPermission: 'ask' },
      { id: 'push_spend_thresholds', label: 'Push spend thresholds', description: 'Write delegated spend limits to Ariba.', defaultPermission: 'ask' },
    ],
  },
  {
    id: 'docusign',
    name: 'DocuSign',
    vendor: 'DocuSign',
    category: 'E-Signature',
    monogram: 'DS',
    accent: '#FFCC22',
    blurb: 'E-signature for authority letters and approvals. Route delegation sign-offs for signature, store the executed documents, and chase reminders.',
    defaultConnected: true,
    readTools: [
      { id: 'read_signature_status', label: 'Read signature status', description: 'Track envelope progress.', defaultPermission: 'allow' },
      { id: 'read_completed_envelopes', label: 'Read completed envelopes', description: 'Retrieve signed documents.', defaultPermission: 'allow' },
    ],
    writeTools: [
      { id: 'send_for_signature', label: 'Send delegation for signature', description: 'Create an envelope for an approved delegation.', defaultPermission: 'ask' },
      { id: 'store_signed_letters', label: 'Store signed authority letters', description: 'File executed documents against the record.', defaultPermission: 'allow' },
      { id: 'send_reminders', label: 'Send signature reminders', description: 'Nudge pending signers.', defaultPermission: 'ask' },
    ],
  },
  {
    id: 'microsoft-365',
    name: 'Microsoft 365',
    vendor: 'Microsoft',
    category: 'Productivity',
    monogram: 'M365',
    accent: '#0F6CBD',
    blurb: 'Identity and communications. Resolve users from Entra ID and push approval notifications to email and Teams.',
    defaultConnected: false,
    readTools: [
      { id: 'read_user_directory', label: 'Read user directory (Entra ID)', description: 'User and group lookup.', defaultPermission: 'allow' },
      { id: 'read_groups', label: 'Read groups', description: 'Security/distribution groups.', defaultPermission: 'ask' },
    ],
    writeTools: [
      { id: 'send_email_notifications', label: 'Send email notifications', description: 'Email approval requests and outcomes.', defaultPermission: 'ask' },
      { id: 'post_to_teams', label: 'Post to Teams channel', description: 'Notify a governance channel.', defaultPermission: 'ask' },
    ],
  },
  {
    id: 'servicenow',
    name: 'ServiceNow',
    vendor: 'ServiceNow',
    category: 'ITSM',
    monogram: 'SNOW',
    accent: '#62D84E',
    blurb: 'IT service management. Raise change tickets for matrix updates and sync approval status with the CMDB.',
    defaultConnected: false,
    readTools: [
      { id: 'read_change_requests', label: 'Read change requests', description: 'Existing CRs for correlation.', defaultPermission: 'allow' },
      { id: 'read_cmdb', label: 'Read CMDB', description: 'Configuration items for IT delegations.', defaultPermission: 'ask' },
    ],
    writeTools: [
      { id: 'create_change_ticket', label: 'Create change ticket', description: 'Open a ServiceNow CR for a matrix change.', defaultPermission: 'ask' },
      { id: 'sync_approval_status', label: 'Sync approval status', description: 'Reflect matrix approvals in ServiceNow.', defaultPermission: 'ask' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Persistence — connection state + per-tool permission overrides
// ---------------------------------------------------------------------------

const CONN_KEY = 'doa_integration_connections_v1';
const PERM_KEY = 'doa_integration_permissions_v1';

const isBrowser = (): boolean => typeof window !== 'undefined';

export function getConnections(): Record<string, boolean> {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(CONN_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function isConnected(integration: Integration): boolean {
  const conns = getConnections();
  return integration.id in conns ? conns[integration.id] : integration.defaultConnected;
}

export function setConnected(id: string, connected: boolean): void {
  if (!isBrowser()) return;
  const conns = getConnections();
  conns[id] = connected;
  window.localStorage.setItem(CONN_KEY, JSON.stringify(conns));
}

export function getPermissions(): Record<string, ToolPermission> {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(PERM_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function getToolPermission(integrationId: string, tool: IntegrationTool): ToolPermission {
  const perms = getPermissions();
  const key = `${integrationId}:${tool.id}`;
  return perms[key] ?? tool.defaultPermission;
}

export function setToolPermission(integrationId: string, toolId: string, perm: ToolPermission): void {
  if (!isBrowser()) return;
  const perms = getPermissions();
  perms[`${integrationId}:${toolId}`] = perm;
  window.localStorage.setItem(PERM_KEY, JSON.stringify(perms));
}
