'use client';

/**
 * Screen 13 — Mobile & Conversational Surfaces Demo
 * Shows how DoA approvals work across mobile, Teams, and Outlook with identical audit semantics
 */

import React, { useState } from 'react';
import { 
  Smartphone, MessageSquare, Mail, Shield, CheckCircle, XCircle,
  Fingerprint, ArrowRight, Paperclip, Clock, AlertTriangle, Download,
  ExternalLink, Settings as SettingsIcon, Globe, Bell
} from 'lucide-react';

type Surface = 'mobile' | 'teams' | 'outlook';
type ApprovalAction = 'approve' | 'reject' | null;

export default function MobileSurfacesDemo() {
  const [selectedSurface, setSelectedSurface] = useState<Surface>('mobile');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaVerified, setMfaVerified] = useState(false);
  const [actionTaken, setActionTaken] = useState<ApprovalAction>(null);
  const [comment, setComment] = useState('');
  const [showOfflineQueue, setShowOfflineQueue] = useState(false);

  const mockRequest = {
    id: 'DOA-23491',
    title: 'Annual SaaS renewal — Salesforce',
    amount: 'EUR 450,000',
    currency: 'EUR',
    vendor: 'Salesforce.com EU',
    originator: 'Priya N., Procurement',
    function: 'Procurement',
    step: 'Step 2 of 3 · L2 Proc. Director',
    sla: '11h elapsed / SLA 24h',
    risk: 'Medium',
    sodStatus: 'CLEAR',
    attachments: 3,
    recentContext: 'Pierre G. approved step 1 on 11-May-2025',
    amountUSD: 487200,
  };

  const handleApprove = () => {
    if (mockRequest.amountUSD > 100000 && !mfaVerified) {
      setMfaRequired(true);
      // Simulate MFA verification
      setTimeout(() => {
        setMfaVerified(true);
        setTimeout(() => {
          setActionTaken('approve');
          setMfaRequired(false);
        }, 500);
      }, 2000);
    } else {
      setActionTaken('approve');
    }
  };

  const handleReject = () => {
    setActionTaken('reject');
  };

  const renderMobileView = () => (
    <div className="max-w-sm mx-auto bg-gray-900 rounded-3xl p-4 shadow-2xl">
      {/* Phone status bar */}
      <div className="flex items-center justify-between text-white text-xs mb-4">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-3 border border-white rounded-sm"></div>
          <div className="w-3 h-3 border border-white rounded-full"></div>
          <div className="flex gap-0.5">
            <div className="w-1 h-3 bg-white rounded"></div>
            <div className="w-1 h-3 bg-white rounded opacity-60"></div>
            <div className="w-1 h-3 bg-white rounded opacity-30"></div>
          </div>
        </div>
      </div>

      {/* App header */}
      <div className="bg-amber-600 rounded-t-2xl p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-amber-600 font-bold text-sm">AR</span>
            </div>
            <span className="font-semibold">AutoResilience DoA</span>
          </div>
          <button className="p-1.5 hover:bg-amber-700 rounded">
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="text-xs opacity-90">My Approvals · 8 pending</div>
      </div>

      {/* Approval card */}
      <div className="bg-white p-4 space-y-3">
        {/* Request header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
              Approval Required · {mockRequest.id}
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              {mockRequest.title}
            </h3>
            <div className="text-2xl font-bold text-amber-600 mb-2">
              {mockRequest.amount}
            </div>
          </div>
        </div>

        {/* Key facts */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Originator:</span>
            <span className="font-medium text-gray-900">{mockRequest.originator}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium text-gray-900">{mockRequest.amount} (USD {mockRequest.amountUSD.toLocaleString()})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{mockRequest.step}</span>
            <span className="text-xs text-gray-500">SLA 24h</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">SoD:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded">
              <CheckCircle className="w-3 h-3" />
              {mockRequest.sodStatus}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Risk:</span>
            <span className="inline-flex items-center px-2 py-0.5 bg-yellow-50 text-yellow-700 text-xs font-medium rounded">
              {mockRequest.risk}
            </span>
          </div>
        </div>

        {/* Recent context */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-xs font-semibold text-blue-900 mb-1">Recent context</div>
          <div className="text-xs text-blue-800">{mockRequest.recentContext}</div>
        </div>

        {/* Attachments */}
        <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
          <Paperclip className="w-4 h-4" />
          <span>{mockRequest.attachments} attachments</span>
          <ArrowRight className="w-3 h-3" />
        </button>

        {/* Comment field */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional note..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            rows={2}
          />
        </div>

        {/* MFA Notice */}
        {mockRequest.amountUSD > 100000 && !actionTaken && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
            <Fingerprint className="w-4 h-4 text-amber-600 mt-0.5" />
            <div className="text-xs text-amber-900">
              <div className="font-semibold">Step-up MFA required</div>
              <div>Decision posts back in real time · audited identically to web</div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        {!actionTaken && !mfaRequired && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleApprove}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              <CheckCircle className="w-5 h-5" />
              Approve
            </button>
            <button
              onClick={handleReject}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              <XCircle className="w-5 h-5" />
              Reject
            </button>
          </div>
        )}

        {/* MFA in progress */}
        {mfaRequired && !mfaVerified && (
          <div className="bg-amber-600 rounded-xl p-6 text-center text-white">
            <Fingerprint className="w-12 h-12 mx-auto mb-3 animate-pulse" />
            <div className="font-semibold mb-1">Face ID Required</div>
            <div className="text-sm opacity-90">Authenticating via Microsoft Authenticator...</div>
          </div>
        )}

        {/* MFA verified */}
        {mfaRequired && mfaVerified && (
          <div className="bg-green-600 rounded-xl p-6 text-center text-white">
            <CheckCircle className="w-12 h-12 mx-auto mb-3" />
            <div className="font-semibold mb-1">Authenticated</div>
            <div className="text-sm opacity-90">Processing approval...</div>
          </div>
        )}

        {/* Action taken */}
        {actionTaken && !mfaRequired && (
          <div className={`rounded-xl p-6 text-center text-white ${
            actionTaken === 'approve' ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {actionTaken === 'approve' ? (
              <CheckCircle className="w-12 h-12 mx-auto mb-3" />
            ) : (
              <XCircle className="w-12 h-12 mx-auto mb-3" />
            )}
            <div className="font-semibold mb-1">
              {actionTaken === 'approve' ? 'Approved' : 'Rejected'}
            </div>
            <div className="text-sm opacity-90">
              Decision logged to audit trail · Channel: mobile · MFA: {mockRequest.amountUSD > 100000 ? 'Face ID' : 'Not required'}
            </div>
          </div>
        )}

        {/* Open in app */}
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <ExternalLink className="w-4 h-4" />
          Open in DoA
        </button>
      </div>

      {/* Bottom nav */}
      <div className="bg-gray-50 rounded-b-2xl p-2 flex items-center justify-around border-t border-gray-200">
        <button className="p-2 text-gray-600">
          <Clock className="w-5 h-5" />
        </button>
        <button className="p-2 text-amber-600">
          <CheckCircle className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-600">
          <Bell className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowOfflineQueue(!showOfflineQueue)}
          className="p-2 text-gray-600 relative"
        >
          <Download className="w-5 h-5" />
          {showOfflineQueue && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
      </div>

      {/* Offline queue notice */}
      {showOfflineQueue && (
        <div className="mt-2 bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="text-xs font-semibold text-orange-900 mb-1">Offline Queue (FR-MOB-03)</div>
          <div className="text-xs text-orange-800">
            Decisions queued offline will replay on reconnect with conflict detection
          </div>
        </div>
      )}
    </div>
  );

  const renderTeamsView = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Teams header */}
      <div className="bg-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6" />
          <div>
            <div className="font-semibold">AutoResilience DoA Bot</div>
            <div className="text-xs opacity-90">Personal chat · Just you</div>
          </div>
        </div>
        <div className="text-xs opacity-75">May 13, 09:41</div>
      </div>

      {/* Adaptive card */}
      <div className="p-4 bg-gray-50 border-l-4 border-l-purple-600">
        {/* Card header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Microsoft Teams — Adaptive Card</span>
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">Approval Required</span>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {/* Request summary */}
            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold mb-1">{mockRequest.id}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{mockRequest.title}</h3>
              <div className="text-2xl font-bold text-purple-600">{mockRequest.amount}</div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-gray-600 text-xs mb-1">Originator</div>
                <div className="font-medium text-gray-900">{mockRequest.originator}</div>
              </div>
              <div>
                <div className="text-gray-600 text-xs mb-1">Amount (USD equiv)</div>
                <div className="font-medium text-gray-900">USD {mockRequest.amountUSD.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-600 text-xs mb-1">Step</div>
                <div className="font-medium text-gray-900">{mockRequest.step}</div>
              </div>
              <div>
                <div className="text-gray-600 text-xs mb-1">SLA Status</div>
                <div className="font-medium text-gray-900">{mockRequest.sla}</div>
              </div>
              <div>
                <div className="text-gray-600 text-xs mb-1">SoD Check</div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded">
                  <CheckCircle className="w-3 h-3" />
                  {mockRequest.sodStatus}
                </span>
              </div>
              <div>
                <div className="text-gray-600 text-xs mb-1">Risk Level</div>
                <span className="inline-flex items-center px-2 py-0.5 bg-yellow-50 text-yellow-700 text-xs font-medium rounded">
                  {mockRequest.risk}
                </span>
              </div>
            </div>

            {/* Recent context */}
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <div className="text-xs font-semibold text-blue-900 mb-1">Recent context</div>
              <div className="text-xs text-blue-800">{mockRequest.recentContext}</div>
            </div>

            {/* Comment field */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Comment
              </label>
              <input
                type="text"
                placeholder="Optional note..."
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Step-up MFA notice */}
            <div className="bg-amber-50 border border-amber-200 rounded p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-900">
                <div className="font-semibold">Step-up MFA prompted automatically for amounts ≥ EUR 100k</div>
                <div className="mt-1">Decision posts back in real time · audited identically to web</div>
              </div>
            </div>

            {/* Action buttons (Teams style) */}
            {!actionTaken && (
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleApprove}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold text-sm transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 rounded font-semibold text-sm transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded font-medium text-sm transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  Open in DoA
                </button>
              </div>
            )}

            {/* Action taken */}
            {actionTaken && (
              <div className={`rounded p-4 flex items-center gap-3 ${
                actionTaken === 'approve' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                {actionTaken === 'approve' ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <div>
                  <div className={`font-semibold ${actionTaken === 'approve' ? 'text-green-900' : 'text-red-900'}`}>
                    {actionTaken === 'approve' ? 'Approved' : 'Rejected'} via Teams
                  </div>
                  <div className="text-xs text-gray-700 mt-0.5">
                    Logged to audit trail · Channel: teams · MFA: Microsoft Authenticator
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Teams footer */}
      <div className="p-3 bg-gray-100 border-t border-gray-200 text-xs text-gray-600 rounded-b-lg">
        Card posted to your 1:1 with DoA bot or function-specific channel
      </div>
    </div>
  );

  const renderOutlookView = () => (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg border border-gray-300">
      {/* Outlook header */}
      <div className="bg-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mail className="w-6 h-6" />
          <div>
            <div className="font-semibold">Approval required — DOA-23491</div>
            <div className="text-xs opacity-90">From: doa@autoresilience.com · To: Shashi K.</div>
          </div>
        </div>
        <div className="text-xs opacity-75">May 13, 09:41 AM</div>
      </div>

      {/* Actionable message */}
      <div className="p-6 space-y-4">
        {/* Email subject line */}
        <div>
          <div className="text-xs text-gray-500 mb-1">Subject:</div>
          <h3 className="text-xl font-bold text-gray-900">Approval required — DOA-23491</h3>
        </div>

        {/* Key info box */}
        <div className="bg-blue-50 border-l-4 border-l-blue-700 p-4">
          <div className="text-sm text-blue-900">
            <div className="font-semibold mb-2">Hi Shashi,</div>
            <div className="mb-2">A new approval request is pending your decision.</div>
          </div>
        </div>

        {/* Request card */}
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Outlook — Actionable Email</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">{mockRequest.id}</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 space-y-3">
            {/* Title and amount */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">{mockRequest.title}</h4>
              <div className="text-2xl font-bold text-blue-600">{mockRequest.amount}</div>
              <div className="text-sm text-gray-600 mt-1">Procurement · {mockRequest.vendor}</div>
            </div>

            {/* Details table */}
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-2 text-gray-600 font-medium">Originator:</td>
                  <td className="py-2 text-gray-900">{mockRequest.originator}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600 font-medium">Amount:</td>
                  <td className="py-2 text-gray-900">{mockRequest.amount} (USD {mockRequest.amountUSD.toLocaleString()})</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600 font-medium">Step:</td>
                  <td className="py-2 text-gray-900">{mockRequest.step}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600 font-medium">SLA:</td>
                  <td className="py-2 text-gray-900">{mockRequest.sla}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600 font-medium">SoD:</td>
                  <td className="py-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded">
                      <CheckCircle className="w-3 h-3" />
                      {mockRequest.sodStatus}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600 font-medium">Risk:</td>
                  <td className="py-2">
                    <span className="inline-flex items-center px-2 py-0.5 bg-yellow-50 text-yellow-700 text-xs font-medium rounded">
                      {mockRequest.risk}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600 font-medium">Attachments:</td>
                  <td className="py-2 text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                    <Paperclip className="w-3.5 h-3.5" />
                    {mockRequest.attachments} files
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Recent context */}
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <div className="text-xs font-semibold text-blue-900 mb-1">Recent context</div>
              <div className="text-xs text-blue-800">{mockRequest.recentContext}</div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Comment
              </label>
              <textarea
                placeholder="Optional note..."
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
              />
            </div>

            {/* MFA notice */}
            <div className="bg-amber-50 border border-amber-200 rounded p-3 flex items-start gap-2">
              <Shield className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-900">
                <div className="font-semibold">Step-up MFA required (Microsoft Authenticator)</div>
                <div className="mt-1">For amounts ≥ EUR 100k, MFA prompt via Microsoft Authenticator · Decision posts back in real time · audited identically to web</div>
              </div>
            </div>

            {/* Action buttons */}
            {!actionTaken && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleApprove}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-sm transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border-2 border-gray-400 text-gray-700 hover:bg-gray-50 rounded font-semibold text-sm transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 text-blue-600 hover:underline text-sm font-medium">
                  <ExternalLink className="w-4 h-4" />
                  Open in DoA →
                </button>
              </div>
            )}

            {/* Action taken */}
            {actionTaken && (
              <div className={`rounded p-4 flex items-center gap-3 ${
                actionTaken === 'approve' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                {actionTaken === 'approve' ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <div>
                  <div className={`font-semibold ${actionTaken === 'approve' ? 'text-green-900' : 'text-red-900'}`}>
                    {actionTaken === 'approve' ? 'Approved' : 'Rejected'} via Outlook
                  </div>
                  <div className="text-xs text-gray-700 mt-0.5">
                    Logged to audit trail · Channel: outlook · MFA: Microsoft Authenticator
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Why this email link */}
        <div className="flex items-center gap-2 text-xs text-blue-600 hover:underline cursor-pointer">
          <Globe className="w-3.5 h-3.5" />
          <span>Why this email? Click to see routing logic and manage notification preferences</span>
        </div>

        {/* Footer notice */}
        <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs text-gray-600">
          <div className="font-medium mb-1">Localized content per your preferred language</div>
          <div>Users can act from Outlook desktop, web, and mobile · Same audit trail · Channel attribution included</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mobile & Conversational Surfaces
          </h1>
          <p className="text-gray-600">
            Decision parity across mobile, Microsoft Teams, and Outlook — identical audit semantics with step-up MFA
          </p>
        </div>

        {/* Surface selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedSurface('mobile');
              setActionTaken(null);
              setMfaRequired(false);
              setMfaVerified(false);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedSurface === 'mobile'
                ? 'bg-amber-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-amber-500'
            }`}
          >
            <Smartphone className="w-5 h-5" />
            Native Mobile
          </button>
          <button
            onClick={() => {
              setSelectedSurface('teams');
              setActionTaken(null);
              setMfaRequired(false);
              setMfaVerified(false);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedSurface === 'teams'
                ? 'bg-purple-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-500'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Microsoft Teams
          </button>
          <button
            onClick={() => {
              setSelectedSurface('outlook');
              setActionTaken(null);
              setMfaRequired(false);
              setMfaVerified(false);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedSurface === 'outlook'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
            }`}
          >
            <Mail className="w-5 h-5" />
            Outlook Email
          </button>
        </div>

        {/* Selected surface */}
        <div className="py-8">
          {selectedSurface === 'mobile' && renderMobileView()}
          {selectedSurface === 'teams' && renderTeamsView()}
          {selectedSurface === 'outlook' && renderOutlookView()}
        </div>

        {/* Feature comparison */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Acceptance Criteria — All Met ✓</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Unified Audit Trail</h3>
              </div>
              <p className="text-sm text-gray-600">
                All three surfaces write to the same audit trail with channel attribution (web/mobile/teams/outlook)
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Step-Up MFA</h3>
              </div>
              <p className="text-sm text-gray-600">
                Decisions via mobile/Teams/Outlook respect step-up MFA above configured threshold (EUR 100k demo)
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Localized Content</h3>
              </div>
              <p className="text-sm text-gray-600">
                Notifications include localized content per user's preferred language setting
              </p>
            </div>
          </div>
        </div>

        {/* Technical details */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-amber-900">Native Mobile (iOS/Android)</h3>
            </div>
            <ul className="space-y-1 text-xs text-amber-800">
              <li>• Biometric / Face ID step-up</li>
              <li>• Offline queue with conflict detection (FR-MOB-03)</li>
              <li>• Push notifications</li>
              <li>• Attachment preview</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Microsoft Teams</h3>
            </div>
            <ul className="space-y-1 text-xs text-purple-800">
              <li>• Adaptive card format</li>
              <li>• 1:1 bot or function channel</li>
              <li>• Inline comment field</li>
              <li>• "Open in DoA" deep link</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Outlook Actionable Email</h3>
            </div>
            <ul className="space-y-1 text-xs text-blue-800">
              <li>• Works on desktop, web, mobile</li>
              <li>• MFA via Microsoft Authenticator</li>
              <li>• "Why this email" preference link</li>
              <li>• Localized per user language</li>
            </ul>
          </div>
        </div>

        {/* Info panel */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <div className="font-semibold mb-2">Decision Parity Across All Channels</div>
              <ul className="space-y-1 text-xs text-blue-800">
                <li>• <strong>Identical audit semantics:</strong> Every approval made on mobile, Teams, or Outlook is logged with the same detail as web approvals</li>
                <li>• <strong>Channel attribution:</strong> Audit trail records whether decision came from web/mobile/teams/outlook</li>
                <li>• <strong>Step-up MFA:</strong> Configurable thresholds trigger biometric/Authenticator verification regardless of surface</li>
                <li>• <strong>Offline resilience (mobile):</strong> Decisions queued offline replay on reconnect with conflict detection</li>
                <li>• <strong>Localization:</strong> All surfaces respect user's preferred language for notifications and content</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

