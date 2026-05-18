'use client';

/**
 * Approval Request Detail - Screen 2
 * Single-screen, decision-grade view with full context:
 * - Approval chain pipeline
 * - Activity & comments timeline
 * - Attachments panel
 * - SoD evaluation
 * - Related items
 * - Decision panel with actions
 */

import { useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Download, FileText, Clock, AlertTriangle,
  CheckCircle2, XCircle, Info, ExternalLink, Shield, Eye,
  MessageSquare, Paperclip, ChevronRight, Link2, AlertCircle, Users
} from 'lucide-react';
import { mockApprovalRequests } from '@/lib/doa/data/mockApprovals';

export default function ApprovalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showRequestInfoDialog, setShowRequestInfoDialog] = useState(false);
  const [showDelegateDialog, setShowDelegateDialog] = useState(false);
  const [decisionComment, setDecisionComment] = useState('');
  const [requiresMFA, setRequiresMFA] = useState(false);

  const approval = mockApprovalRequests.find(a => a.id === id);

  if (!approval) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Request Not Found</h2>
          <p className="text-gray-600 mb-4">The requested approval could not be found.</p>
          <Link href="/doa/approvals-inbox" className="text-[#F59E0B] hover:text-amber-700">
            ← Back to Inbox
          </Link>
        </div>
      </div>
    );
  }

  // Check if MFA is required (amount >= $100K)
  const mfaThreshold = 100000;
  const needsMFA = (approval.monetaryAmount || 0) >= mfaThreshold;

  // Mock approval chain data
  const approvalChain = [
    {
      level: 'L1',
      title: 'Cat. Manager',
      approver: 'Lily Tan',
      status: 'Approved',
      timestamp: '06 May 14:23',
      decision: 'Approved',
      comment: 'Renewal aligns with FY26 budget envelope.',
    },
    {
      level: 'L2',
      title: 'Proc. Director',
      approver: 'Shashi K. (you)',
      status: 'Pending',
      timestamp: null,
      decision: null,
      comment: null,
    },
    {
      level: 'L3',
      title: 'VP Procurement',
      approver: 'Pierre G.',
      status: 'Waiting',
      timestamp: null,
      decision: null,
      comment: null,
    },
  ];

  // Mock activity timeline
  const activityTimeline = [
    { date: '06 May 14:23', actor: 'Originator', action: 'Submitted with quote.pdf, contract draft v3' },
    { date: '06 May 14:24', actor: 'DoA Engine', action: 'Resolved chain (3 levels)' },
    { date: '06 May 14:28', actor: 'Notification', action: 'Email to Lily Tan, SLA 24h' },
    { date: '06 May 15:02', actor: 'Lily Tan (L1)', action: 'Approved — "Renewal aligns with FY26 budget envelope."' },
    { date: '06 May 15:03', actor: 'Notification', action: 'Push + Teams card sent to Shashi K. (you)' },
  ];

  // Mock attachments
  const attachments = [
    { name: 'quote.pdf', size: '242 KB', uploader: 'Originator', canPreview: true },
    { name: 'contract_v3.docx', size: '1.1 MB', uploader: 'Originator', canPreview: false },
    { name: 'prior_year_invoice.pdf', size: '178 KB', uploader: 'Lily Tan', canPreview: true },
  ];

  // Mock SoD rules
  const sodRules = [
    { id: 'SOD-001', rule: 'Originator ≠ Approver', status: 'Pass' },
    { id: 'SOD-006', rule: 'Cat. mgr ≠ AP approver', status: 'Pass' },
    { id: 'SOD-002', rule: 'Vendor master maintainer ≠ AP', status: 'N/A' },
    { id: 'SOD-004', rule: 'Hiring mgr ≠ comp. approver', status: 'N/A' },
  ];

  // Mock related items
  const relatedItems = {
    riskRegister: 'RR-2024-118 (vendor concentration)',
    policy: 'DOA-PROC-Policy v2026.2 (signed PDF)',
    auditTrail: '12 entries — view',
    complianceFindings: null,
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Pending':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'Waiting':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // Handle approve
  const handleApprove = () => {
    if (needsMFA && !requiresMFA) {
      setRequiresMFA(true);
      alert('Step-up MFA required for amounts ≥ $100K. Please authenticate via your mobile device.');
      return;
    }

    console.log('Approve:', id, decisionComment);
    alert(`Approved request ${approval.requestNumber}. Next routing: ${approvalChain[2].approver}`);
    setShowApproveDialog(false);
  };

  // Handle reject
  const handleReject = () => {
    if (!decisionComment.trim()) {
      alert('Comment is required for rejection');
      return;
    }

    console.log('Reject:', id, decisionComment);
    alert(`Rejected request ${approval.requestNumber}. Originator will be notified.`);
    setShowRejectDialog(false);
  };

  // Handle request info
  const handleRequestInfo = () => {
    if (!decisionComment.trim()) {
      alert('Comment is required when requesting information');
      return;
    }

    console.log('Request info:', id, decisionComment);
    alert(`Information requested. Routes back to originator. SLA paused.`);
    setShowRequestInfoDialog(false);
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doa/approvals-inbox" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {approval.requestNumber} · Annual SaaS renewal — Salesforce CRM
              </h1>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>Submitted {new Date(approval.submittedDate || approval.requestedDate).toLocaleString()}</span>
              <span>•</span>
              <span>In Review</span>
              <span>•</span>
              <span>Step {approval.currentStep || 2} of {approval.totalSteps || 3}</span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRejectDialog(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reject
          </button>
          <button
            onClick={() => setShowRequestInfoDialog(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Request info
          </button>
          <button
            onClick={() => setShowApproveDialog(true)}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Approve
          </button>
        </div>
      </div>


      {/* Key Facts Strip */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-7 gap-4 text-sm">
          <div>
            <div className="text-gray-600 mb-1">Project</div>
            <div className="font-semibold text-gray-900">CRM Investment / SaaS</div>
          </div>
          <div>
            <div className="text-gray-600 mb-1">Entity</div>
            <div className="font-semibold text-gray-900">EUR BCO</div>
          </div>
          <div>
            <div className="text-gray-600 mb-1">Vendor</div>
            <Link href="#" className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              Salesforce.com EU
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <div>
            <div className="text-gray-600 mb-1">Contract</div>
            <Link href="#" className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              CLM-98123 (link)
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <div>
            <div className="text-gray-600 mb-1">Risk</div>
            <div className="font-semibold text-gray-900">Medium</div>
          </div>
          <div>
            <div className="text-gray-600 mb-1">SoD</div>
            <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
              CLEAR
            </span>
          </div>
          <div>
            <div className="text-gray-600 mb-1">Amount</div>
            <div className="font-bold text-gray-900">
              EUR 450,000
              <div className="text-xs text-gray-600 font-normal">(USD 487,500 @ BCB official)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Left Column - Main Content */}
        <div className="col-span-2 space-y-4">
          {/* Approval Chain */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Chain</h3>
            <div className="text-sm text-gray-600 mb-4">
              Matrix: DOA-PROC-2026.2 · Effective 01-Apr-2026
            </div>

            <div className="flex items-center gap-4">
              {approvalChain.map((step, index) => (
                <div key={step.level} className="flex items-center gap-4 flex-1">
                  <div
                    className={`flex-1 rounded-lg border-2 p-4 ${
                      step.status === 'Approved'
                        ? 'bg-green-50 border-green-300'
                        : step.status === 'Pending'
                        ? 'bg-amber-50 border-amber-300'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="text-xs font-semibold text-gray-600 mb-1">{step.level}</div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">{step.title}</div>
                    <div
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                        step.status === 'Approved'
                          ? 'bg-green-600 text-white'
                          : step.status === 'Pending'
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-400 text-white'
                      }`}
                    >
                      {step.status}
                    </div>
                    <div className="text-sm text-gray-700 mt-2">{step.approver}</div>
                    {step.timestamp && (
                      <div className="text-xs text-gray-600 mt-1">{step.timestamp}</div>
                    )}
                  </div>

                  {index < approvalChain.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>


          {/* Activity & Comments */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity & Comments</h3>
            <div className="space-y-3">
              {activityTimeline.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{activity.date}</span>
                      <span className="font-semibold text-gray-900">{activity.actor}</span>
                    </div>
                    <div className="text-gray-700 mt-1">{activity.action}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments (3)</h3>
            <div className="space-y-2">
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{attachment.name}</div>
                      <div className="text-xs text-gray-600">
                        {attachment.size} · by {attachment.uploader}
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-white transition-colors">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* SoD Evaluation */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">SoD evaluation</h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded">
                CLEAR
              </span>
            </div>
            <div className="space-y-2">
              {sodRules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">{rule.id}</div>
                    <div className="text-xs text-gray-600">{rule.rule}</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      rule.status === 'Pass'
                        ? 'bg-green-100 text-green-700'
                        : rule.status === 'N/A'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {rule.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Related */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-gray-600 mb-1">Risk register</div>
                <Link href="#" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  {relatedItems.riskRegister}
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Policy</div>
                <Link href="#" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  {relatedItems.policy}
                  <Download className="w-3 h-3" />
                </Link>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Audit trail</div>
                <Link href="#" className="text-blue-600 hover:text-blue-800">
                  {relatedItems.auditTrail}
                </Link>
              </div>
              {relatedItems.complianceFindings && (
                <div>
                  <div className="text-gray-600 mb-1">Compliance findings</div>
                  <div className="text-gray-900">{relatedItems.complianceFindings}</div>
                </div>
              )}
            </div>
          </div>

          {/* Your Decision */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your decision</h3>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">
                Comment (required for reject):
              </label>
              <textarea
                value={decisionComment}
                onChange={(e) => setDecisionComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent text-sm"
                placeholder="Add a note for the next approver..."
              />
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setShowApproveDialog(true)}
                className="w-full px-4 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Approve
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowRejectDialog(true)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                >
                  Reject
                </button>
                <button
                  onClick={() => setShowRequestInfoDialog(true)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                >
                  Request info
                </button>
              </div>

              <button
                onClick={() => setShowDelegateDialog(true)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                Delegate this step
              </button>
            </div>

            {needsMFA && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-700">
                  <strong>Step-up MFA required:</strong> Amount ≥ $100K threshold. You'll be prompted to authenticate.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Approve Dialog */}
      {showApproveDialog && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowApproveDialog(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Approve Request</h3>
                <p className="text-sm text-gray-600 mt-1">{approval.requestNumber}</p>
              </div>

              <div className="p-6">
                {needsMFA && !requiresMFA && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <strong>Step-up MFA Required</strong>
                        <p className="mt-1">
                          This approval requires multi-factor authentication because the amount exceeds $100,000.
                          You will be prompted to authenticate via your registered mobile device.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <div className="text-sm text-gray-700 mb-2">
                    <strong>Next routing:</strong> {approvalChain[2].approver} ({approvalChain[2].title})
                  </div>
                  {decisionComment && (
                    <div className="p-3 bg-gray-50 rounded border border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">Your comment:</div>
                      <div className="text-sm text-gray-900">{decisionComment}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowApproveDialog(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm Approval
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Reject Dialog */}
      {showRejectDialog && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowRejectDialog(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Reject Request</h3>
                <p className="text-sm text-gray-600 mt-1">{approval.requestNumber}</p>
              </div>

              <div className="p-6">
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-800">
                      Rejection will close the approval chain and notify the originator. This action cannot be undone.
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={decisionComment}
                    onChange={(e) => setDecisionComment(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                    placeholder="Explain why this request is being rejected..."
                    autoFocus
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowRejectDialog(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Request Info Dialog */}
      {showRequestInfoDialog && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowRequestInfoDialog(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Request Information</h3>
                <p className="text-sm text-gray-600 mt-1">{approval.requestNumber}</p>
              </div>

              <div className="p-6">
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      This will route the request back to the originator with your question. SLA timer will pause.
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question / Information Needed <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={decisionComment}
                    onChange={(e) => setDecisionComment(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                    placeholder="What information do you need from the originator?"
                    autoFocus
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowRequestInfoDialog(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestInfo}
                  className="px-6 py-2 bg-[#F59E0B] text-white rounded-lg hover:bg-amber-600 transition-colors font-medium flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delegate Dialog */}
      {showDelegateDialog && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowDelegateDialog(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Delegate This Step</h3>
                <p className="text-sm text-gray-600 mt-1">Delegate to another approver with SoD pre-check</p>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delegate To
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent">
                    <option>Select approver...</option>
                    <option>Pierre G. (VP Procurement)</option>
                    <option>Lily Tan (Cat. Manager)</option>
                    <option>John Smith (Director)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Delegation
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                    placeholder="Why are you delegating this step?"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowDelegateDialog(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Delegation with SoD pre-check would be processed');
                    setShowDelegateDialog(false);
                  }}
                  className="px-6 py-2 bg-[#F59E0B] text-white rounded-lg hover:bg-amber-600 transition-colors font-medium flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Confirm Delegation
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
