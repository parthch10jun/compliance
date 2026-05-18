/**
 * Mock DoA Policies
 * Realistic policy data demonstrating BR-POL-01 through BR-POL-08
 */

import type { DoAPolicy, PolicyApprover } from '../types/policy-types';

export const mockDoAPolicies: DoAPolicy[] = [
  // EFFECTIVE POLICY - Current production version
  {
    metadata: {
      policyId: 'pol-doa-001',
      policyNumber: 'DOA-2026-001',
      title: 'Global Delegation of Authority Policy',
      description: 'Enterprise-wide authority matrix governing approval limits and delegation rules',
      owner: 'Sarah Chen',
      department: 'Finance',
      category: 'authority_matrix',
      version: '2.0',
      versionHistory: [
        {
          versionNumber: '1.0',
          state: 'superseded',
          effectiveDate: '2025-01-01',
          endDate: '2026-04-30',
          createdBy: 'John Smith',
          createdDate: '2024-12-01',
          approvedDate: '2024-12-15',
          changeLog: 'Initial policy version',
          pdfArtifactUrl: '/policies/doa-2026-001-v1.0.pdf',
        },
        {
          versionNumber: '2.0',
          state: 'effective',
          effectiveDate: '2026-05-01',
          createdBy: 'Sarah Chen',
          createdDate: '2026-03-15',
          approvedDate: '2026-04-20',
          changeLog: 'Updated approval thresholds for inflation adjustment; added Middle Eastern currencies',
          pdfArtifactUrl: '/policies/doa-2026-001-v2.0.pdf',
        },
      ],
      createdDate: '2024-12-01',
      lastModifiedDate: '2026-04-20',
      effectiveDate: '2026-05-01',
      author: 'Sarah Chen',
      authorEmail: 'sarah.chen@company.com',
      state: 'effective',
      isHotfix: false,
      changeRationale: 'Annual review identified need for threshold adjustments due to 8% inflation rate',
      businessJustification: 'Maintaining current approval volumes without excessive escalations requires threshold increase',
    },
    state: 'effective',
    stateHistory: [
      {
        fromState: 'draft',
        toState: 'in_review',
        changedBy: 'Sarah Chen',
        changedDate: '2026-03-20',
        reason: 'Ready for compliance review',
      },
      {
        fromState: 'in_review',
        toState: 'approved',
        changedBy: 'System',
        changedDate: '2026-04-20',
        reason: 'All approvers signed off',
      },
      {
        fromState: 'approved',
        toState: 'effective',
        changedBy: 'System',
        changedDate: '2026-05-01',
        reason: 'Effective date reached',
      },
    ],
    approvalWorkflow: {
      workflowId: 'apw-001',
      requiredApprovers: [
        {
          role: 'compliance',
          name: 'Thomas Garcia',
          email: 'thomas.garcia@company.com',
          required: true,
          signedDate: '2026-04-10',
          signature: 'sig-thomas-garcia-20260410',
          comments: 'Approved - thresholds align with risk appetite',
          status: 'approved',
        },
        {
          role: 'risk',
          name: 'Patricia Brown',
          email: 'patricia.brown@company.com',
          required: true,
          signedDate: '2026-04-12',
          signature: 'sig-patricia-brown-20260412',
          comments: 'Approved - risk controls adequate',
          status: 'approved',
        },
        {
          role: 'legal',
          name: 'Robert Anderson',
          email: 'robert.anderson@company.com',
          required: true,
          signedDate: '2026-04-18',
          signature: 'sig-robert-anderson-20260418',
          comments: 'Approved - no legal concerns',
          status: 'approved',
        },
        {
          role: 'cfo',
          name: 'Sarah Chen',
          email: 'sarah.chen@company.com',
          required: true,
          signedDate: '2026-04-20',
          signature: 'sig-sarah-chen-20260420',
          comments: 'Final approval granted',
          status: 'approved',
        },
      ],
      currentStep: 4,
      totalSteps: 4,
      startedDate: '2026-03-20',
      completedDate: '2026-04-20',
      status: 'approved',
    },
    policyManagementId: 'pm-global-policies-156',
    relatedPolicies: ['pol-proc-001', 'pol-expense-001'],
    futureVersions: [],
    activeVersion: '2.0',
    pdfArtifacts: [
      {
        policyId: 'pol-doa-001',
        version: '2.0',
        generatedDate: '2026-04-20T15:30:00Z',
        generatedBy: 'System',
        pdfUrl: '/policies/artifacts/doa-2026-001-v2.0-signed.pdf',
        fileSize: 2456789,
        checksum: 'sha256:a3f5e8d9c2b1a0f7e6d5c4b3a2f1e0d9',
        digitalSignatures: [
          {
            signer: 'Thomas Garcia',
            role: 'Chief Compliance Officer',
            signedDate: '2026-04-10T14:20:00Z',
            signature: 'sig-thomas-garcia-20260410',
          },
          {
            signer: 'Patricia Brown',
            role: 'Chief Risk Officer',
            signedDate: '2026-04-12T10:15:00Z',
            signature: 'sig-patricia-brown-20260412',
          },
          {
            signer: 'Robert Anderson',
            role: 'General Counsel',
            signedDate: '2026-04-18T16:45:00Z',
            signature: 'sig-robert-anderson-20260418',
          },
          {
            signer: 'Sarah Chen',
            role: 'Chief Financial Officer',
            signedDate: '2026-04-20T15:30:00Z',
            signature: 'sig-sarah-chen-20260420',
          },
        ],
        watermark: 'OFFICIAL - APPROVED',
        metadata: {
          author: 'Sarah Chen',
          title: 'Global Delegation of Authority Policy v2.0',
          subject: 'Delegation of Authority',
          keywords: ['DoA', 'Authority Matrix', 'Approvals', 'Governance'],
        },
      },
    ],
    attachments: ['threshold-analysis.xlsx', 'inflation-report-2026.pdf'],
    auditTrail: [
      {
        action: 'Policy created',
        performedBy: 'Sarah Chen',
        performedDate: '2026-03-15T09:00:00Z',
        details: 'Created new policy version 2.0',
      },
      {
        action: 'Submitted for review',
        performedBy: 'Sarah Chen',
        performedDate: '2026-03-20T14:30:00Z',
        details: 'Submitted to compliance, risk, and legal for review',
      },
      {
        action: 'Compliance approved',
        performedBy: 'Thomas Garcia',
        performedDate: '2026-04-10T14:20:00Z',
        details: 'Compliance review completed and approved',
      },
      {
        action: 'Risk approved',
        performedBy: 'Patricia Brown',
        performedDate: '2026-04-12T10:15:00Z',
        details: 'Risk assessment completed and approved',
      },
      {
        action: 'Legal approved',
        performedBy: 'Robert Anderson',
        performedDate: '2026-04-18T16:45:00Z',
        details: 'Legal review completed and approved',
      },
      {
        action: 'Final approval',
        performedBy: 'Sarah Chen',
        performedDate: '2026-04-20T15:30:00Z',
        details: 'CFO final approval granted',
      },
      {
        action: 'PDF generated',
        performedBy: 'System',
        performedDate: '2026-04-20T15:31:00Z',
        details: 'Signed PDF artifact generated',
      },
      {
        action: 'Policy activated',
        performedBy: 'System',
        performedDate: '2026-05-01T00:00:00Z',
        details: 'Policy became effective',
      },
    ],
  },

  // IN REVIEW - Policy awaiting approvals
  {
    metadata: {
      policyId: 'pol-doa-002',
      policyNumber: 'DOA-2026-002',
      title: 'IT Authority Matrix Policy',
      description: 'Specific authority limits for IT expenditures and technology approvals',
      owner: 'Robert Anderson',
      department: 'IT',
      category: 'authority_matrix',
      version: '1.0',
      versionHistory: [
        {
          versionNumber: '1.0',
          state: 'in_review',
          effectiveDate: '2026-06-01',
          createdBy: 'Robert Anderson',
          createdDate: '2026-05-10',
          changeLog: 'Initial IT authority matrix',
        },
      ],
      createdDate: '2026-05-10',
      lastModifiedDate: '2026-05-10',
      effectiveDate: '2026-06-01',
      author: 'Robert Anderson',
      authorEmail: 'robert.anderson@company.com',
      state: 'in_review',
      isHotfix: false,
      changeRationale: 'Establish dedicated IT approval thresholds separate from general procurement',
      businessJustification: 'IT purchases require technical expertise not present in general procurement approvers',
    },
    state: 'in_review',
    stateHistory: [
      {
        fromState: 'draft',
        toState: 'in_review',
        changedBy: 'Robert Anderson',
        changedDate: '2026-05-10',
        reason: 'Initial submission for review',
      },
    ],
    approvalWorkflow: {
      workflowId: 'apw-002',
      requiredApprovers: [
        {
          role: 'compliance',
          name: 'Thomas Garcia',
          email: 'thomas.garcia@company.com',
          required: true,
          status: 'pending',
        },
        {
          role: 'risk',
          name: 'Patricia Brown',
          email: 'patricia.brown@company.com',
          required: true,
          status: 'pending',
        },
        {
          role: 'legal',
          name: 'Robert Anderson',
          email: 'robert.anderson@company.com',
          required: true,
          status: 'pending',
        },
        {
          role: 'function_head',
          name: 'David Kim',
          email: 'david.kim@company.com',
          required: true,
          status: 'pending',
        },
      ],
      currentStep: 0,
      totalSteps: 4,
      startedDate: '2026-05-10',
      status: 'pending',
    },
    policyManagementId: 'pm-global-policies-157',
    relatedPolicies: ['pol-doa-001'],
    futureVersions: [],
    activeVersion: '1.0',
    pdfArtifacts: [],
    attachments: ['it-spending-analysis.xlsx'],
    auditTrail: [
      {
        action: 'Policy created',
        performedBy: 'Robert Anderson',
        performedDate: '2026-05-10T09:00:00Z',
        details: 'Created IT authority matrix policy',
      },
      {
        action: 'Submitted for review',
        performedBy: 'Robert Anderson',
        performedDate: '2026-05-10T11:30:00Z',
        details: 'Submitted to compliance, risk, legal, and IT head for review',
      },
    ],
  },

  // HOTFIX - Emergency policy change
  {
    metadata: {
      policyId: 'pol-doa-003',
      policyNumber: 'DOA-2026-003-HOTFIX',
      title: 'Emergency Vendor Payment Authority - Hotfix',
      description: 'Temporary increase in payment authority for critical vendor situation',
      owner: 'Sarah Chen',
      department: 'Finance',
      category: 'authority_matrix',
      version: '1.0-hotfix',
      versionHistory: [
        {
          versionNumber: '1.0-hotfix',
          state: 'effective',
          effectiveDate: '2026-05-14',
          endDate: '2026-06-14',
          createdBy: 'Sarah Chen',
          createdDate: '2026-05-14',
          approvedDate: '2026-05-14',
          changeLog: 'Emergency authority increase for vendor payment delays',
        },
      ],
      createdDate: '2026-05-14',
      lastModifiedDate: '2026-05-14',
      effectiveDate: '2026-05-14',
      endDate: '2026-06-14',
      author: 'Sarah Chen',
      authorEmail: 'sarah.chen@company.com',
      state: 'effective',
      isHotfix: true,
      hotfixExpiryDate: '2026-06-14',
      changeRationale: 'Critical vendor threatening service disruption due to payment processing delays',
      businessJustification: 'Emergency authority needed to approve accelerated payments exceeding normal limits',
    },
    state: 'effective',
    stateHistory: [
      {
        fromState: 'draft',
        toState: 'approved',
        changedBy: 'CEO',
        changedDate: '2026-05-14T10:00:00Z',
        reason: 'Emergency approval granted',
      },
      {
        fromState: 'approved',
        toState: 'effective',
        changedBy: 'System',
        changedDate: '2026-05-14T10:05:00Z',
        reason: 'Hotfix immediately activated',
      },
    ],
    hotfix: {
      isHotfix: true,
      hotfixReason: 'Critical vendor (AWS) threatening immediate service termination due to payment delays',
      hotfixRequestedBy: 'Sarah Chen - CFO',
      hotfixApprovedBy: 'Jennifer Taylor - CEO',
      hotfixExpiryDate: '2026-06-14',
      hotfixCreatedDate: '2026-05-14T09:30:00Z',
      permanentReplacementDue: '2026-06-01',
    },
    approvalWorkflow: {
      workflowId: 'apw-hotfix-001',
      requiredApprovers: [
        {
          role: 'ceo',
          name: 'Jennifer Taylor',
          email: 'jennifer.taylor@company.com',
          required: true,
          signedDate: '2026-05-14T10:00:00Z',
          signature: 'sig-jennifer-taylor-emergency',
          comments: 'Emergency approval granted - critical business continuity issue',
          status: 'approved',
        },
      ],
      currentStep: 1,
      totalSteps: 1,
      startedDate: '2026-05-14T09:30:00Z',
      completedDate: '2026-05-14T10:00:00Z',
      status: 'approved',
    },
    policyManagementId: 'pm-global-policies-158',
    relatedPolicies: ['pol-doa-001'],
    futureVersions: [],
    activeVersion: '1.0-hotfix',
    pdfArtifacts: [
      {
        policyId: 'pol-doa-003',
        version: '1.0-hotfix',
        generatedDate: '2026-05-14T10:05:00Z',
        generatedBy: 'System',
        pdfUrl: '/policies/artifacts/doa-2026-003-hotfix.pdf',
        fileSize: 456789,
        checksum: 'sha256:h9f5e8d9c2b1a0f7e6d5c4b3a2f1e0d9',
        digitalSignatures: [
          {
            signer: 'Jennifer Taylor',
            role: 'Chief Executive Officer',
            signedDate: '2026-05-14T10:00:00Z',
            signature: 'sig-jennifer-taylor-emergency',
          },
        ],
        watermark: 'HOTFIX - EXPIRES 2026-06-14',
        metadata: {
          author: 'Sarah Chen',
          title: 'Emergency Vendor Payment Authority - HOTFIX',
          subject: 'Emergency Policy Change',
          keywords: ['DoA', 'Emergency', 'Hotfix', 'Vendor Payment'],
        },
      },
    ],
    attachments: ['vendor-termination-notice.pdf', 'business-impact-analysis.pdf'],
    auditTrail: [
      {
        action: 'Emergency hotfix created',
        performedBy: 'Sarah Chen',
        performedDate: '2026-05-14T09:30:00Z',
        details: 'Created emergency hotfix for vendor payment authority',
      },
      {
        action: 'CEO emergency approval',
        performedBy: 'Jennifer Taylor',
        performedDate: '2026-05-14T10:00:00Z',
        details: 'Emergency approval granted due to critical business continuity risk',
      },
      {
        action: 'Hotfix activated',
        performedBy: 'System',
        performedDate: '2026-05-14T10:05:00Z',
        details: 'Hotfix policy immediately effective, expires 2026-06-14',
      },
    ],
  },
];

// Helper functions
export function getPolicyById(id: string): DoAPolicy | undefined {
  return mockDoAPolicies.find(p => p.metadata.policyId === id);
}

export function getPolicyByNumber(number: string): DoAPolicy | undefined {
  return mockDoAPolicies.find(p => p.metadata.policyNumber === number);
}

export function getEffectivePolicies(): DoAPolicy[] {
  return mockDoAPolicies.filter(p => p.state === 'effective');
}

export function getPoliciesInReview(): DoAPolicy[] {
  return mockDoAPolicies.filter(p => p.state === 'in_review');
}

export function getHotfixPolicies(): DoAPolicy[] {
  return mockDoAPolicies.filter(p => p.metadata.isHotfix);
}
