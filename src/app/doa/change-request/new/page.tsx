'use client';

/**
 * Submit a Change Request (basic form).
 *
 * Section 1 is auto-filled from the current user. Section 2 is filled in
 * by the requestor. Submit currently creates a Draft CR; L1 endorsement
 * and the downstream flow land in subsequent phases.
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Send, AlertTriangle, FileText } from 'lucide-react';
import { useCurrentUser } from '@/lib/doa/hooks/useCurrentUser';
import {
  saveChangeRequest, generateCRId, generateCRAuditId,
} from '@/lib/doa/matrix/change-request-store';
import { getMatrix, getActiveVersion } from '@/lib/doa/matrix/store';
import type { ChangeRequest, CRChangeType, CRReviewerStep, CRValidatorStep } from '@/lib/doa/matrix/change-request-types';

const CHANGE_TYPES: { value: CRChangeType; label: string; hint: string }[] = [
  { value: 'AddNew', label: 'Add a new delegation', hint: 'Introduce an entirely new matter to the matrix.' },
  { value: 'CascadeDown', label: 'Cascade down', hint: 'Delegate an existing authority to a lower role.' },
  { value: 'Adjust', label: 'Adjust', hint: 'Modify cap, conditions, or scope on an existing cell.' },
  { value: 'Remove', label: 'Remove', hint: 'Remove a delegation or a role authority.' },
  { value: 'Clarify', label: 'Clarify', hint: 'Refine description, explanatory notes, or references — no authority change.' },
];

const REVIEWER_STEPS_TEMPLATE: CRReviewerStep[] = [
  { team: 'RiskAndAudit', required: true, reviewerUserId: 'user-107', reviewerUserName: 'Priya Nair' },
  { team: 'Legal', required: true, reviewerUserId: 'user-110', reviewerUserName: 'Sanjay Gupta' },
  { team: 'Finance', required: true, reviewerUserId: 'user-108', reviewerUserName: 'Arjun Mehta' },
  { team: 'InvestmentGovernance', required: true, reviewerUserId: 'user-102', reviewerUserName: 'Subhash Iyer' },
  { team: 'Procurement', required: false, reviewerUserId: 'user-109', reviewerUserName: 'Neha Reddy' },
  { team: 'HR', required: false, reviewerUserId: 'user-105', reviewerUserName: 'Vikram Joshi' },
];

const VALIDATOR_STEPS_TEMPLATE: CRValidatorStep[] = [
  { role: 'CFO', validatorUserId: 'user-104', validatorUserName: 'Ritu Bansal' },
  { role: 'SVP_General_Counsel', validatorUserId: 'user-110', validatorUserName: 'Sanjay Gupta' },
  { role: 'Risk_Audit_Committee', validatorUserId: 'user-107', validatorUserName: 'Priya Nair' },
];

export default function NewCRPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { user } = useCurrentUser();
  const prefillDelegation = params.get('delegation') ?? '';

  const [changeType, setChangeType] = useState<CRChangeType>('Adjust');
  const [targetDelegationId, setTargetDelegationId] = useState(prefillDelegation);
  const [proposedChange, setProposedChange] = useState('');
  const [justification, setJustification] = useState('');
  const [impactAssessment, setImpactAssessment] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [delegationOptions, setDelegationOptions] = useState<{ id: string; description: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitMode, setSubmitMode] = useState<'draft' | 'submit'>('draft');

  useEffect(() => {
    const active = getActiveVersion();
    setDelegationOptions(active.delegations.map(d => ({ id: d.id, description: d.description })));
  }, []);

  const save = () => {
    if (!proposedChange.trim()) { setError('Proposed change description is required.'); return; }
    if (!justification.trim()) { setError('Justification is required.'); return; }
    if (!impactAssessment.trim()) { setError('Impact assessment is required.'); return; }

    const now = new Date().toISOString();
    const id = generateCRId();
    const number = `CR-2026-${String(Math.floor(Math.random() * 900) + 100)}`;

    const isSubmit = submitMode === 'submit';
    const cr: ChangeRequest = {
      id, number,
      requestorUserId: user.id,
      requestorUserName: user.name,
      requestorRole: user.role,
      requestDate: now,
      changeType,
      targetDelegationId: targetDelegationId || null,
      proposedChange: proposedChange.trim(),
      justification: justification.trim(),
      impactAssessment: impactAssessment.trim(),
      effectiveDate: effectiveDate ? new Date(effectiveDate).toISOString() : null,
      reviewerSteps: REVIEWER_STEPS_TEMPLATE.map(s => ({ ...s })),
      validatorSteps: VALIDATOR_STEPS_TEMPLATE.map(s => ({ ...s })),
      status: isSubmit ? 'PendingL1Endorsement' : 'Draft',
      createdAt: now,
      submittedAt: isSubmit ? now : null,
      auditTrail: [
        { id: generateCRAuditId(), timestamp: now, actorUserId: user.id, actorUserName: user.name, action: 'Created' },
        ...(isSubmit ? [{
          id: generateCRAuditId(), timestamp: now, actorUserId: user.id, actorUserName: user.name,
          action: 'Submitted', comment: 'Submitted for L1 endorsement.',
        }] : []),
      ],
    };
    saveChangeRequest(cr);
    router.push(`/doa/change-request/${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Link href="/doa/change-request" className="p-2 hover:bg-gray-100 rounded">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Submit a Change Request</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Drafting as <span className="font-medium text-gray-700">{user.name}</span> · {user.role}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}
        </div>
      )}

      <Section title="Section 1 — Requestor identification">
        <Field label="Requestor"><div className="text-sm text-gray-900">{user.name}</div></Field>
        <Field label="Role"><div className="text-sm text-gray-900">{user.role}</div></Field>
      </Section>

      <Section title="Section 2 — Requested change">
        <Field label="Type of change" required>
          <div className="space-y-1.5">
            {CHANGE_TYPES.map(opt => (
              <label key={opt.value} className="flex items-start gap-2 cursor-pointer">
                <input type="radio" name="changeType" checked={changeType === opt.value}
                  onChange={() => setChangeType(opt.value)} className="mt-0.5" />
                <span className="text-sm">
                  <span className="font-medium text-gray-900">{opt.label}</span>
                  <span className="text-gray-500"> — {opt.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="DoA reference">
          <select value={targetDelegationId}
            onChange={e => setTargetDelegationId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option value="">— None (for new delegation) —</option>
            {delegationOptions.map(d => (
              <option key={d.id} value={d.id}>{d.id} — {d.description.slice(0, 70)}</option>
            ))}
          </select>
        </Field>

        <Field label="Proposed change" required>
          <textarea rows={3} value={proposedChange}
            onChange={e => setProposedChange(e.target.value)}
            placeholder="Detailed description of the change being requested."
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </Field>

        <Field label="Justification" required>
          <textarea rows={3} value={justification}
            onChange={e => setJustification(e.target.value)}
            placeholder="Business rationale for the change."
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </Field>

        <Field label="Impact assessment" required>
          <textarea rows={3} value={impactAssessment}
            onChange={e => setImpactAssessment(e.target.value)}
            placeholder="Potential impact on operations, controls, or compliance."
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </Field>

        <Field label="Effective date">
          <input type="date" value={effectiveDate}
            onChange={e => setEffectiveDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </Field>
      </Section>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => { setSubmitMode('draft'); save(); }}
          className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
          Save as draft
        </button>
        <button
          onClick={() => { setSubmitMode('submit'); save(); }}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded text-sm font-medium hover:bg-amber-600">
          <Send className="w-4 h-4" />Submit for L1 endorsement
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, required = false, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-1.5">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
