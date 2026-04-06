// Circulars and Notifications - Regulatory Updates with Compliance Deadlines
// This demonstrates the AI-powered deadline extraction feature for Company Secretary

export interface ComplianceAction {
  id: string;
  title: string;
  description: string;
  deadline: string;
  section: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  applicableTo: string[];
  relatedRequirementIds: string[];
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  assignedTo?: string;
}

export interface Circular {
  id: string;
  circularNumber: string;
  title: string;
  issuer: 'MCA' | 'SEBI' | 'RBI' | 'NSE' | 'BSE';
  issueDate: string;
  effectiveDate: string;
  category: string;
  summary: string;
  pdfUrl?: string;
  extractedActions: ComplianceAction[];
  aiConfidenceScore: number; // 0-100
  tags: string[];
}

// Sample MCA Circular - Director Appointment Requirements
export const circulars: Circular[] = [
  {
    id: 'cir-mca-001',
    circularNumber: 'MCA/DIR/2025/002',
    title: 'Compliance Requirements for Appointment of Directors',
    issuer: 'MCA',
    issueDate: '2025-02-01',
    effectiveDate: '2025-02-15',
    category: 'Director Appointment',
    summary: 'This circular provides updated guidelines for the appointment of directors in listed companies, including timelines for DIN application, consent filing, and board resolution requirements.',
    tags: ['Directors', 'Appointment', 'Form DIR-12', 'DIN', 'Board Resolution'],
    aiConfidenceScore: 94,
    extractedActions: [
      {
        id: 'act-001',
        title: 'Obtain DIN for Proposed Director',
        description: 'Apply for Director Identification Number (DIN) through Form DIR-3 for the proposed director before appointment',
        deadline: '2025-02-28',
        section: 'Para 2.1',
        priority: 'Critical',
        applicableTo: ['Listed Companies', 'Public Companies'],
        relatedRequirementIds: ['ca-req-003'],
        status: 'Pending'
      },
      {
        id: 'act-002',
        title: 'Obtain Written Consent from Director',
        description: 'Collect Form DIR-2 (written consent) from the proposed director along with declaration of non-disqualification',
        deadline: '2025-03-05',
        section: 'Para 2.2',
        priority: 'Critical',
        applicableTo: ['Listed Companies', 'Public Companies'],
        relatedRequirementIds: ['ca-req-003'],
        status: 'Pending'
      },
      {
        id: 'act-003',
        title: 'Pass Board Resolution',
        description: 'Pass board resolution approving the appointment of director with terms and conditions',
        deadline: '2025-03-10',
        section: 'Para 3.1',
        priority: 'High',
        applicableTo: ['All Companies'],
        relatedRequirementIds: ['ca-req-003', 'ca-req-001'],
        status: 'Pending'
      },
      {
        id: 'act-004',
        title: 'File Form DIR-12 with ROC',
        description: 'File Form DIR-12 (Particulars of appointment of directors) with Registrar within 30 days of appointment',
        deadline: '2025-03-25',
        section: 'Para 4.1',
        priority: 'Critical',
        applicableTo: ['All Companies'],
        relatedRequirementIds: ['ca-req-003'],
        status: 'Pending'
      },
      {
        id: 'act-005',
        title: 'Update Register of Directors',
        description: 'Update statutory register of directors (Form MBP-1) within 7 days of appointment',
        deadline: '2025-03-02',
        section: 'Para 5.1',
        priority: 'High',
        applicableTo: ['All Companies'],
        relatedRequirementIds: ['ca-req-008'],
        status: 'Pending'
      },
      {
        id: 'act-006',
        title: 'Disclosure to Stock Exchanges',
        description: 'For listed companies, intimate appointment to stock exchanges within 24 hours',
        deadline: '2025-02-26',
        section: 'Para 6.1',
        priority: 'Critical',
        applicableTo: ['Listed Companies'],
        relatedRequirementIds: ['lodr-req-009'],
        status: 'Pending'
      },
      {
        id: 'act-007',
        title: 'Independent Director Declaration',
        description: 'Obtain declaration of independence from independent directors as per Section 149(6)',
        deadline: '2025-03-10',
        section: 'Para 7.1',
        priority: 'High',
        applicableTo: ['Listed Companies', 'Public Companies'],
        relatedRequirementIds: ['ca-req-003', 'lodr-req-004'],
        status: 'Pending'
      },
      {
        id: 'act-008',
        title: 'Update Company Website',
        description: 'Update company website with details of directors including profile and expertise',
        deadline: '2025-03-15',
        section: 'Para 8.1',
        priority: 'Medium',
        applicableTo: ['Listed Companies'],
        relatedRequirementIds: ['lodr-req-002'],
        status: 'Pending'
      },
      {
        id: 'act-009',
        title: 'Verify DSC and KYC',
        description: 'Ensure director has valid Digital Signature Certificate and KYC is updated in MCA portal',
        deadline: '2025-02-25',
        section: 'Para 9.1',
        priority: 'High',
        applicableTo: ['All Companies'],
        relatedRequirementIds: ['ca-req-003'],
        status: 'Pending'
      },
      {
        id: 'act-010',
        title: 'Committee Reconstitution',
        description: 'Review and reconstitute board committees if required based on new director appointment',
        deadline: '2025-03-20',
        section: 'Para 10.1',
        priority: 'Medium',
        applicableTo: ['Listed Companies'],
        relatedRequirementIds: ['lodr-req-005', 'lodr-req-006', 'lodr-req-007'],
        status: 'Pending'
      }
    ]
  },
  // Sample SEBI Circular - Quarterly Results Disclosure
  {
    id: 'cir-sebi-001',
    circularNumber: 'SEBI/HO/CFD/CFD-PoD-1/P/CIR/2025/15',
    title: 'Disclosure of Financial Results - Revised Timeline for Q4 FY2024-25',
    issuer: 'SEBI',
    issueDate: '2025-02-10',
    effectiveDate: '2025-02-10',
    category: 'Financial Disclosure',
    summary: 'SEBI has issued revised guidelines for disclosure of quarterly and annual financial results for Q4 FY2024-25, including extended timelines for certain categories of listed entities.',
    tags: ['Financial Results', 'Quarterly', 'Disclosure', 'Regulation 33', 'Audit'],
    aiConfidenceScore: 96,
    extractedActions: [
      {
        id: 'act-011',
        title: 'Board Meeting Notice to Exchanges',
        description: 'Give prior intimation of board meeting to stock exchanges at least 2 working days before the meeting',
        deadline: '2025-05-26',
        section: 'Para 2.1',
        priority: 'High',
        applicableTo: ['Listed Companies'],
        relatedRequirementIds: ['lodr-req-001'],
        status: 'Pending'
      },
      {
        id: 'act-012',
        title: 'Statutory Auditors Limited Review',
        description: 'Obtain limited review report from statutory auditors for Q4 standalone financial results',
        deadline: '2025-05-25',
        section: 'Para 3.1',
        priority: 'Critical',
        applicableTo: ['Listed Companies'],
        relatedRequirementIds: ['lodr-req-001'],
        status: 'Pending'
      },
      {
        id: 'act-013',
        title: 'Audit Committee Approval',
        description: 'Present financial results to Audit Committee for review and recommendation to Board',
        deadline: '2025-05-28',
        section: 'Para 4.1',
        priority: 'Critical',
        applicableTo: ['Listed Companies'],
        relatedRequirementIds: ['lodr-req-001', 'lodr-req-005'],
        status: 'Pending'
      },
      {
        id: 'act-014',
        title: 'Board Approval of Results',
        description: 'Obtain board approval for audited annual financial results within 60 days of FY end',
        deadline: '2025-05-30',
        section: 'Para 5.1',
        priority: 'Critical',
        applicableTo: ['Listed Companies'],
        relatedRequirementIds: ['lodr-req-001', 'lodr-req-004'],
        status: 'Pending'
      },
      {
        id: 'act-015',
        title: 'Submit Results to Stock Exchanges',
        description: 'Submit approved financial results to NSE and BSE within 30 minutes of board meeting conclusion',
        deadline: '2025-05-30',
        section: 'Para 6.1',
        priority: 'Critical',
        applicableTo: ['Listed Companies'],
        relatedRequirementIds: ['lodr-req-001'],
        status: 'Pending'
      },
      {
        id: 'act-016',
        title: 'Newspaper Publication',
        description: 'Publish financial results in at least one English and one vernacular newspaper within 48 hours',
        deadline: '2025-06-01',
        section: 'Para 7.1',
        priority: 'High',
        applicableTo: ['Listed Companies'],
        relatedRequirementIds: ['lodr-req-001'],
        status: 'Pending'
      },
      {
        id: 'act-017',
        title: 'Upload to Company Website',
        description: 'Upload financial results to company website within 24 hours of submission to exchanges',
        deadline: '2025-05-31',
        section: 'Para 8.1',
        priority: 'High',
        applicableTo: ['Listed Companies'],
        relatedRequirementIds: ['lodr-req-001', 'lodr-req-002'],
        status: 'Pending'
      },
      {
        id: 'act-018',
        title: 'Statement on Impact of Audit Qualifications',
        description: 'If audit report has qualifications, submit statement on impact of audit qualifications',
        deadline: '2025-05-30',
        section: 'Para 9.1',
        priority: 'Critical',
        applicableTo: ['Listed Companies'],
        relatedRequirementIds: ['lodr-req-001'],
        status: 'Pending'
      }
    ]
  }
];

// Helper function to get circulars by issuer
export const getCircularsByIssuer = (issuer: Circular['issuer']): Circular[] => {
  return circulars.filter(c => c.issuer === issuer);
};

// Helper function to get all pending actions
export const getPendingActions = (): ComplianceAction[] => {
  return circulars.flatMap(c => c.extractedActions.filter(a => a.status === 'Pending'));
};

// Helper function to get actions by priority
export const getActionsByPriority = (priority: ComplianceAction['priority']): ComplianceAction[] => {
  return circulars.flatMap(c => c.extractedActions.filter(a => a.priority === priority));
};

// Helper function to get upcoming deadlines (within X days)
export const getUpcomingDeadlines = (days: number): ComplianceAction[] => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return circulars.flatMap(c => c.extractedActions.filter(a => {
    const deadline = new Date(a.deadline);
    return deadline >= now && deadline <= futureDate;
  })).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
};

