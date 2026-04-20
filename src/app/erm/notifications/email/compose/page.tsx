'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Save, Calendar, Users, FileText, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const emailTemplates = [
  { id: 'risk-alert', name: 'Critical Risk Alert', category: 'Risk' },
  { id: 'treatment-due', name: 'Treatment Deadline', category: 'Treatment' },
  { id: 'review-reminder', name: 'Review Reminder', category: 'Assessment' },
  { id: 'approval-request', name: 'Approval Request', category: 'Workflow' },
  { id: 'campaign-launch', name: 'Campaign Launch', category: 'Assessment' },
  { id: 'tolerance-alert', name: 'Tolerance Exceeded', category: 'Risk' },
  { id: 'custom', name: 'Custom Email', category: 'General' }
];

const recipientGroups = [
  { id: 'exec-team', name: 'Executive Team', count: 8 },
  { id: 'risk-owners', name: 'Risk Owners', count: 45 },
  { id: 'it-team', name: 'IT Team', count: 23 },
  { id: 'all-users', name: 'All Users', count: 234 },
  { id: 'compliance-team', name: 'Compliance Team', count: 12 }
];

export default function ComposeEmailPage() {
  const router = useRouter();
  const [template, setTemplate] = useState('risk-alert');
  const [subject, setSubject] = useState('Critical Risk Alert: ');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [customRecipients, setCustomRecipients] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [scheduleDate, setScheduleDate] = useState('');
  const [relatedRisk, setRelatedRisk] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    alert('Email sent successfully!');
    router.push('/erm/notifications/email');
  };

  const handleSchedule = () => {
    alert('Email scheduled successfully!');
    router.push('/erm/notifications/email');
  };

  const handleSaveDraft = () => {
    alert('Draft saved successfully!');
  };

  const toggleRecipientGroup = (groupId: string) => {
    setRecipients(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const templateContent: Record<string, string> = {
    'risk-alert': `Dear Risk Owner,

A critical risk has been identified that requires your immediate attention.

**Risk Details:**
- Risk ID: {RISK_ID}
- Risk Title: {RISK_TITLE}
- Current Rating: {RISK_RATING}
- Risk Level: {RISK_LEVEL}

**Action Required:**
Please review the risk assessment and provide your response within 48 hours.

**Next Steps:**
1. Review the risk details in the ERM system
2. Update the risk assessment if needed
3. Propose treatment measures

Click here to view the risk: {RISK_LINK}

Best regards,
ERM System`,
    'treatment-due': `Dear Treatment Owner,

This is a reminder that the following treatment plan is due for completion.

**Treatment Details:**
- Treatment ID: {TREATMENT_ID}
- Treatment Title: {TREATMENT_TITLE}
- Due Date: {DUE_DATE}
- Days Remaining: {DAYS_REMAINING}

Please ensure the treatment is completed by the due date.

View treatment plan: {TREATMENT_LINK}

Best regards,
ERM System`,
    'review-reminder': `Dear Risk Owner,

It's time for the quarterly risk review.

**Review Details:**
- Review Period: {REVIEW_PERIOD}
- Due Date: {DUE_DATE}
- Risks to Review: {RISK_COUNT}

Please complete your risk review by the due date.

Access review: {REVIEW_LINK}

Best regards,
ERM System`,
    'approval-request': `Dear Approver,

An approval request requires your attention.

**Request Details:**
- Request Type: {REQUEST_TYPE}
- Requested By: {REQUESTER}
- Date Submitted: {SUBMIT_DATE}
- Priority: {PRIORITY}

Please review and approve/reject this request.

View request: {REQUEST_LINK}

Best regards,
ERM System`,
    'custom': ''
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/erm/notifications/email')}
          className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] mb-4"
        >
          <ArrowLeft size={16} />
          Back to Email Notifications
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h2 font-bold text-[var(--foreground)] mb-2">Compose Email</h1>
            <p className="text-p2 text-[var(--foreground-muted)]">
              Create and send email notifications for risks, treatments, and assessments
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveDraft}
              className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
            >
              <Save size={18} />
              Save Draft
            </button>
            <button
              onClick={handleSchedule}
              className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
            >
              <Calendar size={18} />
              Schedule
            </button>
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium"
            >
              <Send size={18} />
              Send Now
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Compose Area */}
        <div className="col-span-2 space-y-6">
          {/* Template Selection */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Email Template</h3>
            <div className="grid grid-cols-2 gap-3">
              {emailTemplates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    setTemplate(tmpl.id);
                    setMessage(templateContent[tmpl.id] || '');
                  }}
                  className={clsx(
                    'p-4 rounded-lg border-2 text-left transition-all',
                    template === tmpl.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="font-medium text-sm text-gray-900">{tmpl.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{tmpl.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Email Details */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Email Details</h3>

            <div className="space-y-4">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter email subject"
                />
              </div>

              {/* Priority & Related Risk */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Related Risk (Optional)</label>
                  <input
                    type="text"
                    value={relatedRisk}
                    onChange={(e) => setRelatedRisk(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., RSK-001"
                  />
                </div>
              </div>

              {/* Message Body */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm"
                  placeholder="Enter email message..."
                />
                <div className="mt-2 text-xs text-gray-500">
                  Use {'{'}PLACEHOLDER{'}'} for dynamic content (e.g., {'{'}RISK_ID{'}'}, {'{'}RISK_TITLE{'}'})
                </div>
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Send (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Recipients */}
        <div className="space-y-6">
          {/* Recipient Groups */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wide mb-4">
              Recipient Groups
            </h3>
            <div className="space-y-2">
              {recipientGroups.map((group) => (
                <label
                  key={group.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={recipients.includes(group.id)}
                    onChange={() => toggleRecipientGroup(group.id)}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{group.name}</div>
                    <div className="text-xs text-gray-500">{group.count} members</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Recipients */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wide mb-4">
              Custom Recipients
            </h3>
            <textarea
              value={customRecipients}
              onChange={(e) => setCustomRecipients(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Enter email addresses, one per line"
            />
          </div>

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Email Summary</h4>
                <div className="space-y-1 text-xs text-blue-800">
                  <div>Template: <span className="font-medium">{emailTemplates.find(t => t.id === template)?.name}</span></div>
                  <div>Priority: <span className="font-medium">{priority}</span></div>
                  <div>Recipients: <span className="font-medium">{recipients.length} groups</span></div>
                  {scheduleDate && (
                    <div>Scheduled: <span className="font-medium">{new Date(scheduleDate).toLocaleString()}</span></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

