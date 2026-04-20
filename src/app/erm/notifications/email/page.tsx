'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mail, Bell, Send, Calendar, Clock, Users, Filter, 
  CheckCircle, XCircle, Eye, Settings, Plus, Download
} from 'lucide-react';
import clsx from 'clsx';

type EmailStatus = 'Sent' | 'Pending' | 'Failed' | 'Scheduled' | 'Draft';
type EmailType = 'Risk Alert' | 'Treatment Due' | 'Review Reminder' | 'Assessment' | 'Approval Request' | 'System';

interface EmailNotification {
  id: string;
  type: EmailType;
  subject: string;
  recipients: string[];
  sender: string;
  sentDate: string;
  scheduledDate?: string;
  status: EmailStatus;
  priority: 'High' | 'Medium' | 'Low';
  relatedRisk?: string;
  relatedItem?: string;
  template: string;
  opened: number;
  clicked: number;
}

const mockEmails: EmailNotification[] = [
  {
    id: 'EMAIL-001',
    type: 'Risk Alert',
    subject: 'Critical Risk: Third-party vendor data breach exposure',
    recipients: ['sarah.chen@company.com', 'exec-team@company.com'],
    sender: 'ERM System <erm@company.com>',
    sentDate: '2024-04-20T09:00:00',
    status: 'Sent',
    priority: 'High',
    relatedRisk: 'RSK-001',
    relatedItem: 'Third-party vendor data breach',
    template: 'Critical Risk Alert',
    opened: 8,
    clicked: 3
  },
  {
    id: 'EMAIL-002',
    type: 'Treatment Due',
    subject: 'Treatment Plan Due: MFA Implementation',
    recipients: ['it-team@company.com', 'michael.rodriguez@company.com'],
    sender: 'ERM System <erm@company.com>',
    sentDate: '2024-04-19T14:30:00',
    status: 'Sent',
    priority: 'Medium',
    relatedRisk: 'RSK-002',
    relatedItem: 'TRT-045',
    template: 'Treatment Deadline',
    opened: 5,
    clicked: 2
  },
  {
    id: 'EMAIL-003',
    type: 'Review Reminder',
    subject: 'Quarterly Risk Assessment Review - Q2 2024',
    recipients: ['risk-owners@company.com'],
    sender: 'ERM System <erm@company.com>',
    scheduledDate: '2024-04-25T08:00:00',
    status: 'Scheduled',
    priority: 'Medium',
    template: 'Review Reminder',
    opened: 0,
    clicked: 0
  },
  {
    id: 'EMAIL-004',
    type: 'Approval Request',
    subject: 'Approval Required: Risk Override for Cybersecurity Risk',
    recipients: ['jennifer.walsh@company.com'],
    sender: 'ERM System <erm@company.com>',
    sentDate: '2024-04-20T11:15:00',
    status: 'Sent',
    priority: 'High',
    relatedRisk: 'RSK-010',
    template: 'Approval Request',
    opened: 1,
    clicked: 1
  },
  {
    id: 'EMAIL-005',
    type: 'Assessment',
    subject: 'New Risk Assessment Campaign: Cybersecurity 2024',
    recipients: ['all-users@company.com'],
    sender: 'ERM System <erm@company.com>',
    sentDate: '2024-04-18T10:00:00',
    status: 'Sent',
    priority: 'Low',
    template: 'Campaign Launch',
    opened: 45,
    clicked: 12
  },
  {
    id: 'EMAIL-006',
    type: 'Risk Alert',
    subject: 'Risk Tolerance Exceeded: Operational Resilience',
    recipients: ['exec-team@company.com'],
    sender: 'ERM System <erm@company.com>',
    status: 'Pending',
    priority: 'High',
    relatedRisk: 'RSK-015',
    template: 'Tolerance Alert',
    opened: 0,
    clicked: 0
  }
];

export default function EmailNotificationsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<'all' | EmailStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | EmailType>('all');
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(null);

  const filteredEmails = mockEmails.filter(email => {
    if (statusFilter !== 'all' && email.status !== statusFilter) return false;
    if (typeFilter !== 'all' && email.type !== typeFilter) return false;
    return true;
  });

  const totalSent = mockEmails.filter(e => e.status === 'Sent').length;
  const totalScheduled = mockEmails.filter(e => e.status === 'Scheduled').length;
  const totalPending = mockEmails.filter(e => e.status === 'Pending').length;
  const totalFailed = mockEmails.filter(e => e.status === 'Failed').length;
  const avgOpenRate = mockEmails.filter(e => e.status === 'Sent').reduce((sum, e) => sum + (e.opened > 0 ? 1 : 0), 0) / (totalSent || 1) * 100;

  const getStatusIcon = (status: EmailStatus) => {
    switch (status) {
      case 'Sent': return <CheckCircle size={16} className="text-green-600" />;
      case 'Pending': return <Clock size={16} className="text-yellow-600" />;
      case 'Failed': return <XCircle size={16} className="text-red-600" />;
      case 'Scheduled': return <Calendar size={16} className="text-blue-600" />;
      default: return <Mail size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: EmailStatus) => {
    switch (status) {
      case 'Sent': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Failed': return 'bg-red-100 text-red-700';
      case 'Scheduled': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Mail size={24} className="text-[var(--primary)]" />
            <h1 className="text-h2 font-bold text-[var(--foreground)]">Email Notifications</h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => router.push('/erm/notifications/email/settings')}
              className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
            >
              <Settings size={18} />
              Settings
            </button>
            <button 
              onClick={() => router.push('/erm/notifications/email/compose')}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium"
            >
              <Plus size={18} />
              Compose
            </button>
          </div>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Manage and monitor email notifications for risk alerts, treatments, and assessments
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <Send size={16} />
            Sent
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalSent}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-blue-700 mb-1">
            <Calendar size={16} />
            Scheduled
          </div>
          <div className="text-2xl font-bold text-blue-700">{totalScheduled}</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-yellow-700 mb-1">
            <Clock size={16} />
            Pending
          </div>
          <div className="text-2xl font-bold text-yellow-700">{totalPending}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-red-700 mb-1">
            <XCircle size={16} />
            Failed
          </div>
          <div className="text-2xl font-bold text-red-700">{totalFailed}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-green-700 mb-1">
            <Eye size={16} />
            Open Rate
          </div>
          <div className="text-2xl font-bold text-green-700">{avgOpenRate.toFixed(0)}%</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[var(--border)] rounded-lg px-6 py-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[var(--foreground-muted)]" />
            <span className="text-sm font-semibold text-[var(--foreground)]">Filters:</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--foreground)]">Status:</span>
            <div className="flex gap-2">
              {(['all', 'Sent', 'Scheduled', 'Pending', 'Failed', 'Draft'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={clsx(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-all border',
                    statusFilter === status
                      ? 'bg-teal-500 text-white border-teal-500'
                      : 'bg-white text-[var(--foreground-muted)] border-gray-300 hover:bg-gray-50'
                  )}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--foreground)]">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-4 py-1.5 border border-gray-300 rounded-md text-sm bg-white"
            >
              <option value="all">All Types</option>
              <option value="Risk Alert">Risk Alert</option>
              <option value="Treatment Due">Treatment Due</option>
              <option value="Review Reminder">Review Reminder</option>
              <option value="Assessment">Assessment</option>
              <option value="Approval Request">Approval Request</option>
              <option value="System">System</option>
            </select>
          </div>
        </div>
      </div>

      {/* Email Table */}
      <div className="bg-white border border-[var(--border)] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Recipients</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Metrics</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredEmails.map(email => (
              <tr
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-semibold text-teal-600 text-sm">{email.id}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 text-sm">{email.subject}</div>
                  {email.relatedItem && (
                    <div className="text-xs text-gray-500 mt-0.5">Related: {email.relatedItem}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700">{email.type}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-700">
                    <Users size={14} />
                    <span>{email.recipients.length}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-700">
                    {email.status === 'Scheduled' && email.scheduledDate
                      ? new Date(email.scheduledDate).toLocaleString()
                      : email.sentDate
                      ? new Date(email.sentDate).toLocaleString()
                      : '-'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(email.status)}
                    <span className="text-sm font-medium text-gray-700">{email.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={clsx('px-2 py-1 text-xs font-medium rounded', getPriorityColor(email.priority))}>
                    {email.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {email.status === 'Sent' && (
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye size={12} />
                        <span>{email.opened}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Send size={12} />
                        <span>{email.clicked}</span>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

