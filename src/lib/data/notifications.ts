export interface Notification {
  id: string;
  type: 'TOLERANCE_EXCEEDED' | 'RISK_ASSIGNED' | 'TREATMENT_COMPLETE' | 'REVIEW_DUE' | 'STATUS_CHANGED';
  riskId: string;
  riskTitle: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  recipient: string;
  metadata: {
    oldValue?: string;
    newValue?: string;
    threshold?: string;
    owner?: string;
  };
}

export interface EmailTemplate {
  id: string;
  name: string;
  type: 'tolerance_exceeded' | 'risk_assigned' | 'treatment_complete' | 'review_due' | 'status_changed';
  subject: string;
  body: string;
  variables: string[];
}

export const mockNotifications: Notification[] = [
  {
    id: 'NOT-001',
    type: 'TOLERANCE_EXCEEDED',
    riskId: 'RSK-015',
    riskTitle: 'Customer data privacy breach',
    message: 'Risk rating exceeded tolerance threshold',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isRead: false,
    recipient: 'Sarah Chen (CISO)',
    metadata: {
      threshold: 'Medium',
      newValue: 'High'
    }
  },
  {
    id: 'NOT-002',
    type: 'TOLERANCE_EXCEEDED',
    riskId: 'RSK-013',
    riskTitle: 'Business continuity - natural disaster',
    message: 'Risk rating exceeded tolerance threshold',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    isRead: false,
    recipient: 'David Kumar (COO)',
    metadata: {
      threshold: 'Medium',
      newValue: 'High'
    }
  },
  {
    id: 'NOT-003',
    type: 'RISK_ASSIGNED',
    riskId: 'RSK-001',
    riskTitle: 'Third-party vendor data breach exposure',
    message: 'New risk has been assigned to you',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isRead: true,
    recipient: 'Sarah Chen (CISO)',
    metadata: {
      owner: 'Sarah Chen (CISO)'
    }
  },
  {
    id: 'NOT-004',
    type: 'TREATMENT_COMPLETE',
    riskId: 'RSK-007',
    riskTitle: 'Key personnel departure - knowledge loss',
    message: 'Risk treatment has been completed',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    isRead: true,
    recipient: 'Maria Garcia (CHRO)',
    metadata: {
      oldValue: 'In Progress',
      newValue: 'Completed'
    }
  },
  {
    id: 'NOT-005',
    type: 'REVIEW_DUE',
    riskId: 'RSK-002',
    riskTitle: 'Ransomware attack on critical infrastructure',
    message: 'Risk review is due in 7 days',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    isRead: true,
    recipient: 'Sarah Chen (CISO)',
    metadata: {
      newValue: '2024-06-15'
    }
  },
  {
    id: 'NOT-006',
    type: 'STATUS_CHANGED',
    riskId: 'RSK-020',
    riskTitle: 'Competitive market disruption',
    message: 'Risk status changed from Identified to Assessed',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    isRead: true,
    recipient: 'CEO Office',
    metadata: {
      oldValue: 'Identified',
      newValue: 'Assessed'
    }
  },
  {
    id: 'NOT-007',
    type: 'TOLERANCE_EXCEEDED',
    riskId: 'RSK-020',
    riskTitle: 'Competitive market disruption',
    message: 'Risk rating exceeded tolerance threshold',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    isRead: true,
    recipient: 'CEO Office',
    metadata: {
      threshold: 'Medium',
      newValue: 'High'
    }
  }
];

export const mockEmailTemplates: EmailTemplate[] = [
  {
    id: 'TPL-001',
    name: 'Risk Tolerance Exceeded',
    type: 'tolerance_exceeded',
    subject: 'URGENT: Risk {{risk_id}} - {{risk_title}} Exceeded Tolerance',
    body: `Dear {{owner_name}},

This is an automated notification to inform you that risk {{risk_id}} - {{risk_title}} has exceeded the tolerance threshold.

Risk Details:
- Risk ID: {{risk_id}}
- Risk Title: {{risk_title}}
- Current Rating: {{current_rating}}
- Tolerance Threshold: {{threshold}}
- Date: {{date}}

Action Required:
Please review this risk immediately and implement appropriate treatment measures to bring it within acceptable tolerance levels.

You can view the full risk details in the ERM system.

Best regards,
Risk Management System`,
    variables: ['risk_id', 'risk_title', 'owner_name', 'current_rating', 'threshold', 'date']
  },
  {
    id: 'TPL-002',
    name: 'Risk Assignment',
    type: 'risk_assigned',
    subject: 'New Risk Assigned: {{risk_id}} - {{risk_title}}',
    body: `Dear {{owner_name}},

A new risk has been assigned to you for management and oversight.

Risk Details:
- Risk ID: {{risk_id}}
- Risk Title: {{risk_title}}
- Category: {{category}}
- Current Rating: {{current_rating}}
- Assignment Date: {{date}}

Next Steps:
Please review the risk details and develop an appropriate treatment plan within 5 business days.

Access the risk in the ERM system to begin your assessment.

Best regards,
Risk Management System`,
    variables: ['risk_id', 'risk_title', 'owner_name', 'category', 'current_rating', 'date']
  }
];
