// Requirement Assessments Data
// Assessments track the evaluation and testing of requirements

export interface RequirementAssessment {
  id: string;
  requirementId: string;
  title: string;
  description: string;
  assessmentType: 'Self-Assessment' | 'Internal Audit' | 'External Audit' | 'Continuous Monitoring';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue';
  result?: 'Compliant' | 'Partially Compliant' | 'Non-Compliant' | 'Not Applicable';
  score?: number; // 0-100
  assessor: string;
  assessorRole: string;
  scheduledDate: string;
  completedDate?: string;
  dueDate: string;
  findings: string[];
  recommendations: string[];
  evidenceCount: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
}

export const requirementAssessments: RequirementAssessment[] = [
  {
    id: 'assess-1',
    requirementId: 'req-1',
    title: 'Q1 2024 Capital Adequacy Assessment',
    description: 'Quarterly assessment of capital adequacy ratio compliance',
    assessmentType: 'Self-Assessment',
    status: 'Completed',
    result: 'Compliant',
    score: 95,
    assessor: 'Sarah Johnson',
    assessorRole: 'Risk Manager',
    scheduledDate: '2024-01-15',
    completedDate: '2024-01-20',
    dueDate: '2024-01-31',
    findings: [
      'CAR maintained at 16.2%, above minimum requirement of 15%',
      'All documentation properly maintained',
      'Board reporting completed on time'
    ],
    recommendations: [
      'Continue monitoring capital levels monthly',
      'Update stress testing scenarios'
    ],
    evidenceCount: 8,
    priority: 'High'
  },
  {
    id: 'assess-2',
    requirementId: 'req-1',
    title: 'Annual External Audit - Capital Requirements',
    description: 'External auditor review of capital adequacy framework',
    assessmentType: 'External Audit',
    status: 'Scheduled',
    assessor: 'KPMG India',
    assessorRole: 'External Auditor',
    scheduledDate: '2024-03-01',
    dueDate: '2024-03-15',
    findings: [],
    recommendations: [],
    evidenceCount: 0,
    priority: 'Critical'
  },
  {
    id: 'assess-3',
    requirementId: 'req-2',
    title: 'KYC Process Compliance Review',
    description: 'Assessment of KYC procedures and documentation',
    assessmentType: 'Internal Audit',
    status: 'In Progress',
    score: 78,
    assessor: 'Michael Chen',
    assessorRole: 'Internal Auditor',
    scheduledDate: '2024-01-10',
    dueDate: '2024-01-25',
    findings: [
      'KYC documentation complete for 95% of customers',
      'Some delays in periodic KYC updates',
      'Digital KYC process working effectively'
    ],
    recommendations: [
      'Implement automated reminders for periodic KYC',
      'Enhance training for branch staff',
      'Review high-risk customer KYC more frequently'
    ],
    evidenceCount: 12,
    priority: 'High'
  },
  {
    id: 'assess-4',
    requirementId: 'req-3',
    title: 'AML Transaction Monitoring Assessment',
    description: 'Evaluation of AML transaction monitoring controls',
    assessmentType: 'Continuous Monitoring',
    status: 'Completed',
    result: 'Partially Compliant',
    score: 72,
    assessor: 'Priya Sharma',
    assessorRole: 'Compliance Officer',
    scheduledDate: '2024-01-05',
    completedDate: '2024-01-18',
    dueDate: '2024-01-20',
    findings: [
      'Transaction monitoring system operational',
      'Alert investigation process needs improvement',
      'Some delays in STR filing',
      'Training completion rate at 85%'
    ],
    recommendations: [
      'Enhance alert investigation procedures',
      'Implement stricter STR filing timelines',
      'Complete pending staff training',
      'Review and update transaction monitoring rules'
    ],
    evidenceCount: 15,
    priority: 'Critical'
  },
  {
    id: 'assess-5',
    requirementId: 'req-4',
    title: 'Data Privacy Controls Assessment',
    description: 'Review of data privacy and protection controls',
    assessmentType: 'Self-Assessment',
    status: 'Overdue',
    assessor: 'Rajesh Kumar',
    assessorRole: 'Data Protection Officer',
    scheduledDate: '2023-12-15',
    dueDate: '2024-01-05',
    findings: [],
    recommendations: [],
    evidenceCount: 0,
    priority: 'High'
  },
  {
    id: 'assess-6',
    requirementId: 'req-5',
    title: 'Cyber Security Framework Review',
    description: 'Assessment of cyber security controls and incident response',
    assessmentType: 'Internal Audit',
    status: 'Completed',
    result: 'Compliant',
    score: 88,
    assessor: 'Amit Patel',
    assessorRole: 'IT Security Manager',
    scheduledDate: '2024-01-08',
    completedDate: '2024-01-22',
    dueDate: '2024-01-30',
    findings: [
      'Firewall and intrusion detection systems operational',
      'Incident response plan tested and updated',
      'Vulnerability assessments conducted quarterly',
      'Security awareness training completed'
    ],
    recommendations: [
      'Implement additional DDoS protection',
      'Enhance security monitoring capabilities',
      'Conduct penetration testing bi-annually'
    ],
    evidenceCount: 10,
    priority: 'Critical'
  }
];

