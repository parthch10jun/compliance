'use client';

/**
 * Submit a Change Request — structured form.
 *
 * Four steps:
 *   1. Pick change type
 *   2. Pick target delegation (skip for AddNew)
 *   3. Structured editor specific to the change type
 *   4. Justification + impact + effective date
 */

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft, Send, AlertTriangle, ChevronRight, ChevronLeft, Check, Plus, Minus, PencilLine,
} from 'lucide-react';
import { useCurrentUser } from '@/lib/doa/hooks/useCurrentUser';
import {
  saveChangeRequest, generateCRId, generateCRAuditId,
} from '@/lib/doa/matrix/change-request-store';
import {
  getMatrix, getActiveVersion, getAuthoritiesForDelegation, getRoleById,
} from '@/lib/doa/matrix/store';
import { formatNumber } from '@/lib/doa/utils/format';
import type {
  AuthorityMatrix, Delegation, MatrixVersion, RoleAuthority, Role,
} from '@/lib/doa/matrix/types';
import type {
  ChangeRequest, CRChangeType, CRCellEdit, CRCellState,
  CRProposal, CRReviewerStep, CRValidatorStep,
} from '@/lib/doa/matrix/change-request-types';

const CHANGE_TYPES: { value: CRChangeType; label: string; hint: string }[] = [
  { value: 'Adjust', label: 'Adjust', hint: 'Modify an existing delegation — e.g. raise a cap or change conditions.' },
  { value: 'CascadeDown', label: 'Cascade down', hint: 'Grant authority to a role that doesn\'t currently appear on this delegation.' },
  { value: 'Remove', label: 'Remove', hint: 'Remove a role\'s authority on a delegation, or remove the delegation entirely.' },
  { value: 'Clarify', label: 'Clarify', hint: 'Refine description / explanatory notes only — no authority change.' },
  { value: 'AddNew', label: 'Add new', hint: 'Introduce a new matter to the matrix.' },
];

const REVIEWER_TEMPLATE: CRReviewerStep[] = [
  { team: 'RiskAndAudit', required: true, reviewerUserId: 'user-107', reviewerUserName: 'Priya Nair' },
  { team: 'Legal', required: true, reviewerUserId: 'user-110', reviewerUserName: 'Sanjay Gupta' },
  { team: 'Finance', required: true, reviewerUserId: 'user-108', reviewerUserName: 'Arjun Mehta' },
  { team: 'InvestmentGovernance', required: true, reviewerUserId: 'user-102', reviewerUserName: 'Subhash Iyer' },
  { team: 'Procurement', required: false, reviewerUserId: 'user-109', reviewerUserName: 'Neha Reddy' },
  { team: 'HR', required: false, reviewerUserId: 'user-105', reviewerUserName: 'Vikram Joshi' },
];

const VALIDATOR_TEMPLATE: CRValidatorStep[] = [
  { role: 'CFO', validatorUserId: 'user-104', validatorUserName: 'Ritu Bansal' },
  { role: 'SVP_General_Counsel', validatorUserId: 'user-110', validatorUserName: 'Sanjay Gupta' },
  { role: 'Risk_Audit_Committee', validatorUserId: 'user-107', validatorUserName: 'Priya Nair' },
];

type Step = 1 | 2 | 3 | 4;

export default function NewCRPage() {
  // useSearchParams() needs a Suspense boundary for static generation
  // (Next.js opts out of prerender otherwise). Wrap the real form.
  return (
    <Suspense fallback={<div className="px-6 py-12 text-center text-sm text-gray-500">Loading form…</div>}>
      <NewCRPageInner />
    </Suspense>
  );
}

function NewCRPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { user } = useCurrentUser();

  const [matrix, setMatrix] = useState<AuthorityMatrix | null>(null);
  const [active, setActive] = useState<MatrixVersion | null>(null);
  useEffect(() => {
    const m = getMatrix();
    setMatrix(m);
    setActive(getActiveVersion(m));
  }, []);

  // ----- Step 1: change type -----
  const [changeType, setChangeType] = useState<CRChangeType>('Adjust');
  // ----- Step 2: target delegation -----
  const prefill = params.get('delegation') ?? '';
  const [targetDelegationId, setTargetDelegationId] = useState(prefill);
  const [step, setStep] = useState<Step>(1);

  // ----- Step 3: structured editor state -----
  // For Adjust / CascadeDown / Remove: cell edits
  const [cellEdits, setCellEdits] = useState<Record<string, CRCellEdit>>({}); // keyed by roleId
  // For Clarify / Adjust: text edits
  const [descriptionAfter, setDescriptionAfter] = useState('');
  const [notesAfter, setNotesAfter] = useState('');
  // For Remove: wholeDelegation toggle
  const [wholeDelegationRemove, setWholeDelegationRemove] = useState(false);
  // For AddNew
  const [newDelId, setNewDelId] = useState('');
  const [newDelSubsection, setNewDelSubsection] = useState('');
  const [newDelDescription, setNewDelDescription] = useState('');
  const [newDelNotes, setNewDelNotes] = useState('');

  // ----- Step 4: justification etc. -----
  const [justification, setJustification] = useState('');
  const [impactAssessment, setImpactAssessment] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');

  // Validation / error
  const [error, setError] = useState<string | null>(null);

  // ---------- Derived data --------------------------------------------------
  const targetDelegation: Delegation | undefined = useMemo(() => {
    if (!active) return undefined;
    return active.delegations.find(d => d.id === targetDelegationId);
  }, [active, targetDelegationId]);

  const currentAuthorities: RoleAuthority[] = useMemo(() => {
    if (!active || !targetDelegationId) return [];
    return getAuthoritiesForDelegation(targetDelegationId, active);
  }, [active, targetDelegationId]);

  // When target delegation changes, hydrate the structured-edit state from current values
  useEffect(() => {
    if (!targetDelegation) return;
    setDescriptionAfter(targetDelegation.description);
    setNotesAfter(targetDelegation.explanatoryNotes);
    setCellEdits({});
    setWholeDelegationRemove(false);
  }, [targetDelegation?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- Cell-edit helpers --------------------------------------------
  const cellStateFor = (auth?: RoleAuthority): CRCellState => {
    if (!auth) return {};
    return {
      hasUnlimitedAuthority: auth.hasUnlimitedAuthority,
      monetaryCap: auth.monetaryCap,
      conditions: auth.conditions,
    };
  };

  const updateCellEdit = (roleId: string, edit: Partial<CRCellEdit>) => {
    setCellEdits(prev => ({
      ...prev,
      [roleId]: { ...(prev[roleId] ?? { roleId, roleName: '', before: null, after: null }), ...edit },
    }));
  };

  // ---------- Submit --------------------------------------------------------
  const handleSubmit = (asDraft: boolean) => {
    setError(null);
    // Step 4 fields required
    if (!justification.trim()) { setError('Justification is required.'); return; }
    if (!impactAssessment.trim()) { setError('Impact assessment is required.'); return; }
    if (changeType !== 'AddNew' && !targetDelegationId) {
      setError('Pick a target delegation.'); return;
    }
    if (changeType === 'AddNew' && (!newDelId.trim() || !newDelDescription.trim() || !newDelSubsection)) {
      setError('New delegation ID, subsection, and description are required.'); return;
    }

    // Build the proposal
    let proposal: CRProposal;
    const editsArray: CRCellEdit[] = Object.values(cellEdits).filter(e => e.roleName); // skip stub entries

    switch (changeType) {
      case 'Adjust': {
        proposal = {
          kind: 'Adjust',
          targetDelegationId,
          cellChanges: editsArray,
          descriptionBefore: targetDelegation?.description,
          descriptionAfter: descriptionAfter !== targetDelegation?.description ? descriptionAfter : undefined,
          explanatoryNotesBefore: targetDelegation?.explanatoryNotes,
          explanatoryNotesAfter: notesAfter !== targetDelegation?.explanatoryNotes ? notesAfter : undefined,
        };
        break;
      }
      case 'CascadeDown': {
        proposal = { kind: 'CascadeDown', targetDelegationId, cellsAdded: editsArray };
        break;
      }
      case 'Remove': {
        proposal = {
          kind: 'Remove',
          targetDelegationId,
          wholeDelegation: wholeDelegationRemove,
          cellsRemoved: wholeDelegationRemove ? undefined : editsArray,
        };
        break;
      }
      case 'Clarify': {
        proposal = {
          kind: 'Clarify',
          targetDelegationId,
          descriptionBefore: targetDelegation?.description,
          descriptionAfter: descriptionAfter !== targetDelegation?.description ? descriptionAfter : undefined,
          explanatoryNotesBefore: targetDelegation?.explanatoryNotes,
          explanatoryNotesAfter: notesAfter !== targetDelegation?.explanatoryNotes ? notesAfter : undefined,
        };
        break;
      }
      case 'AddNew': {
        proposal = {
          kind: 'AddNew',
          newDelegationId: newDelId.trim(),
          subsectionId: newDelSubsection,
          description: newDelDescription.trim(),
          explanatoryNotes: newDelNotes.trim(),
          cellsAdded: editsArray,
        };
        break;
      }
    }

    const now = new Date().toISOString();
    const id = generateCRId();
    const number = `CR-2026-${String(Math.floor(Math.random() * 900) + 100)}`;
    const summary = buildSummary(proposal);

    // Per JNBP's CR form ("Requestor identification — L1 level is mandatory"),
    // the requestor IS the L1 endorser. So when submitting (not saving draft)
    // we self-endorse and land directly in R&A's triage queue.
    const cr: ChangeRequest = {
      id, number,
      requestorUserId: user.id,
      requestorUserName: user.name,
      requestorRole: user.role,
      requestDate: now,
      changeType,
      targetDelegationId: changeType === 'AddNew' ? null : targetDelegationId,
      proposedChange: summary,
      proposal,
      justification: justification.trim(),
      impactAssessment: impactAssessment.trim(),
      effectiveDate: effectiveDate ? new Date(effectiveDate).toISOString() : null,
      reviewerSteps: REVIEWER_TEMPLATE.map(s => ({ ...s })),
      validatorSteps: VALIDATOR_TEMPLATE.map(s => ({ ...s })),
      status: asDraft ? 'Draft' : 'L1Endorsed',
      createdAt: now,
      submittedAt: asDraft ? null : now,
      l1EndorserUserId: asDraft ? null : user.id,
      l1EndorserUserName: asDraft ? null : user.name,
      l1EndorsedAt: asDraft ? null : now,
      l1EndorsementComment: asDraft ? null
        : `Self-endorsed at submission (requestor = L1 per A.3.5).`,
      auditTrail: [
        { id: generateCRAuditId(), timestamp: now,
          actorUserId: user.id, actorUserName: user.name, action: 'Created' },
        ...(!asDraft ? [
          { id: generateCRAuditId(), timestamp: now,
            actorUserId: user.id, actorUserName: user.name,
            action: 'Submitted', comment: 'Submitted by L1 (requestor self-endorsed).' },
          { id: generateCRAuditId(), timestamp: now,
            actorUserId: user.id, actorUserName: user.name,
            action: 'L1Endorsed',
            comment: 'Self-endorsed at submission (requestor = L1 per A.3.5).' },
        ] : []),
      ],
    };
    saveChangeRequest(cr);
    router.push(`/doa/change-request/${id}`);
  };

  if (!matrix || !active) return null;

  // ----- Render ------------------------------------------------------------
  return (
    <div className="space-y-4">
      {/* Header */}
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

      {/* Stepper */}
      <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
        <div className="flex items-center justify-between">
          {([
            [1, 'Change type'],
            [2, 'Target delegation'],
            [3, 'Structured edit'],
            [4, 'Justify & submit'],
          ] as [Step, string][]).map(([n, label], idx) => (
            <React.Fragment key={n}>
              <button
                onClick={() => setStep(n)}
                className="flex items-center gap-2"
              >
                <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                  n < step ? 'bg-green-500 text-white' :
                  n === step ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'
                }`}>{n < step ? <Check className="w-3.5 h-3.5" /> : n}</span>
                <span className={`text-xs ${n === step ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>{label}</span>
              </button>
              {idx < 3 && <ChevronRight className="w-4 h-4 text-gray-300" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}
        </div>
      )}

      {/* Step 1 — pick type */}
      {step === 1 && (
        <Section title="What kind of change?">
          <div className="space-y-2">
            {CHANGE_TYPES.map(opt => (
              <label key={opt.value} className={`flex items-start gap-3 p-3 border rounded cursor-pointer ${
                changeType === opt.value ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input type="radio" name="ct" checked={changeType === opt.value}
                  onChange={() => setChangeType(opt.value)} className="mt-1" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{opt.label}</div>
                  <div className="text-xs text-gray-600">{opt.hint}</div>
                </div>
              </label>
            ))}
          </div>
        </Section>
      )}

      {/* Step 2 — pick delegation */}
      {step === 2 && changeType !== 'AddNew' && (
        <Section title="Pick the target delegation">
          <select value={targetDelegationId}
            onChange={e => setTargetDelegationId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option value="">— Select —</option>
            {active.delegations.map(d => (
              <option key={d.id} value={d.id}>{d.id} — {d.description.slice(0, 80)}</option>
            ))}
          </select>
          {targetDelegation && (
            <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded text-xs">
              <div className="font-semibold text-gray-900 mb-1">{targetDelegation.id}</div>
              <p className="text-gray-700">{targetDelegation.description}</p>
              {targetDelegation.explanatoryNotes && (
                <p className="text-gray-600 italic mt-1">{targetDelegation.explanatoryNotes}</p>
              )}
              <p className="text-gray-500 mt-2">
                {currentAuthorities.length} role{currentAuthorities.length === 1 ? '' : 's'} currently authorised
              </p>
            </div>
          )}
        </Section>
      )}

      {step === 2 && changeType === 'AddNew' && (
        <Section title="New delegation skeleton">
          <Field label="New delegation ID" required>
            <input type="text" value={newDelId}
              onChange={e => setNewDelId(e.target.value)}
              placeholder="e.g. D.7.1"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </Field>
          <Field label="Subsection" required>
            <select value={newDelSubsection}
              onChange={e => setNewDelSubsection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
              <option value="">— Select subsection —</option>
              {active.subsections.map(s => (
                <option key={s.id} value={s.id}>{s.id} — {s.title}</option>
              ))}
            </select>
          </Field>
          <Field label="Description" required>
            <textarea rows={2} value={newDelDescription}
              onChange={e => setNewDelDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </Field>
          <Field label="Explanatory notes">
            <textarea rows={2} value={newDelNotes}
              onChange={e => setNewDelNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </Field>
        </Section>
      )}

      {/* Step 3 — structured editor */}
      {step === 3 && (
        <Section title="What's changing?">
          {(changeType === 'Adjust' || changeType === 'Clarify') && (
            <>
              <Field label="Description">
                <textarea rows={3} value={descriptionAfter}
                  onChange={e => setDescriptionAfter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </Field>
              <Field label="Explanatory notes">
                <textarea rows={4} value={notesAfter}
                  onChange={e => setNotesAfter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </Field>
            </>
          )}

          {(changeType === 'Adjust' || changeType === 'Remove') && targetDelegation && (
            <>
              <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mt-3 mb-2">
                Existing cells ({currentAuthorities.length})
              </div>
              {changeType === 'Remove' && (
                <label className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-sm cursor-pointer mb-2">
                  <input type="checkbox" checked={wholeDelegationRemove}
                    onChange={e => setWholeDelegationRemove(e.target.checked)} />
                  <span className="text-red-900 font-medium">Remove the entire delegation row</span>
                </label>
              )}
              {!wholeDelegationRemove && (
                <ul className="space-y-2">
                  {currentAuthorities.map(auth => {
                    const role = getRoleById(auth.roleId);
                    return (
                      <CellEditRow
                        key={auth.roleId}
                        role={role}
                        current={auth}
                        mode={changeType as 'Adjust' | 'Remove'}
                        edit={cellEdits[auth.roleId]}
                        onChange={edit => updateCellEdit(auth.roleId, edit)}
                      />
                    );
                  })}
                </ul>
              )}
            </>
          )}

          {changeType === 'CascadeDown' && (
            <>
              <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mt-3 mb-2">
                Current authority chain on {targetDelegationId}
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Pick a role <strong>not currently authorised</strong> and grant them a cap — typically below the lowest existing cap, to cascade authority downward.
              </p>
              <CurrentChainPreview authorities={currentAuthorities} allRoles={matrix.roles} />

              <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mt-4 mb-2">
                Cascade authority down to
              </div>
              <AddCellPicker
                allRoles={matrix.roles}
                excludeRoleIds={currentAuthorities.map(a => a.roleId)}
                edits={cellEdits}
                onAdd={(role, state) => updateCellEdit(role.id, {
                  roleId: role.id, roleName: role.name, before: null, after: state,
                })}
                onRemove={roleId => setCellEdits(prev => {
                  const { [roleId]: _, ...rest } = prev;
                  return rest;
                })}
              />
            </>
          )}

          {changeType === 'AddNew' && (
            <>
              <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mt-3 mb-2">
                Initial role authorities on the new delegation
              </div>
              <AddCellPicker
                allRoles={matrix.roles}
                excludeRoleIds={[]}
                edits={cellEdits}
                onAdd={(role, state) => updateCellEdit(role.id, {
                  roleId: role.id, roleName: role.name, before: null, after: state,
                })}
                onRemove={roleId => setCellEdits(prev => {
                  const { [roleId]: _, ...rest } = prev;
                  return rest;
                })}
              />
            </>
          )}
        </Section>
      )}

      {/* Step 4 — justify + submit */}
      {step === 4 && (
        <Section title="Justify and submit">
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
      )}

      {/* Footer nav */}
      <div className="flex justify-between">
        <button onClick={() => setStep(s => (s > 1 ? (s - 1) as Step : s))}
          disabled={step === 1}
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-40">
          <ChevronLeft className="w-4 h-4" />Back
        </button>
        {step < 4 ? (
          <button onClick={() => setStep(s => (s < 4 ? (s + 1) as Step : s))}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded text-sm hover:bg-amber-600">
            Next<ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => handleSubmit(true)}
              className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
              Save as draft
            </button>
            <button onClick={() => handleSubmit(false)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded text-sm font-medium hover:bg-amber-600">
              <Send className="w-4 h-4" />Submit (self-endorse as L1)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Cell-edit row (Adjust / Remove)
// ============================================================================

function CellEditRow({
  role, current, mode, edit, onChange,
}: {
  role: Role | undefined;
  current: RoleAuthority;
  mode: 'Adjust' | 'Remove';
  edit: CRCellEdit | undefined;
  onChange: (edit: Partial<CRCellEdit>) => void;
}) {
  const isEdited = !!edit && (edit.before !== null || edit.after !== null);
  const isRemove = edit?.after === null;

  // Initialize from current if not yet edited
  const before: CRCellState = {
    hasUnlimitedAuthority: current.hasUnlimitedAuthority,
    monetaryCap: current.monetaryCap,
    conditions: current.conditions,
  };
  const after: CRCellState = edit?.after ?? before;

  const amount = after.monetaryCap?.amount ?? '';
  const currency = after.monetaryCap?.currency ?? current.monetaryCap?.currency ?? 'USD';
  const conditions = after.conditions ?? '';

  return (
    <li className={`border rounded p-3 ${isEdited ? 'border-amber-300 bg-amber-50/60' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-gray-900">{role?.name ?? current.roleId}</div>
        <div className="flex items-center gap-2 text-xs">
          {mode === 'Adjust' && (
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="checkbox"
                checked={!isEdited}
                onChange={e => {
                  if (e.target.checked) onChange({ roleId: current.roleId, roleName: role?.name ?? '', before: null, after: null });
                  else onChange({ roleId: current.roleId, roleName: role?.name ?? '', before, after: { ...before } });
                }} />
              keep
            </label>
          )}
          {mode === 'Adjust' && (
            <label className="flex items-center gap-1 cursor-pointer text-red-700">
              <input type="checkbox"
                checked={isEdited && isRemove}
                onChange={e => {
                  if (e.target.checked) onChange({ roleId: current.roleId, roleName: role?.name ?? '', before, after: null });
                  else onChange({ roleId: current.roleId, roleName: role?.name ?? '', before: null, after: null });
                }} />
              remove
            </label>
          )}
          {mode === 'Remove' && (
            <label className="flex items-center gap-1 cursor-pointer text-red-700">
              <input type="checkbox"
                checked={isEdited && isRemove}
                onChange={e => {
                  if (e.target.checked) onChange({ roleId: current.roleId, roleName: role?.name ?? '', before, after: null });
                  else onChange({ roleId: current.roleId, roleName: role?.name ?? '', before: null, after: null });
                }} />
              mark for removal
            </label>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-600 mb-2">
        Current:{' '}
        {current.monetaryCap
          ? <strong className="text-gray-900">{current.monetaryCap.currency} {formatNumber(current.monetaryCap.amount)}</strong>
          : current.hasUnlimitedAuthority
          ? <span className="text-gray-900">Approval rights</span>
          : <span className="italic">Conditional</span>}
        {current.conditions && <span className="italic"> · {current.conditions}</span>}
      </div>

      {mode === 'Adjust' && isEdited && !isRemove && (
        <div className="grid grid-cols-3 gap-2">
          <label className="text-xs">
            <span className="block text-gray-600 mb-1">New amount</span>
            <input type="text" inputMode="numeric"
              value={String(amount)}
              onChange={e => {
                const num = Number(e.target.value.replace(/[, ]/g, ''));
                if (Number.isNaN(num)) return;
                onChange({
                  roleId: current.roleId, roleName: role?.name ?? '',
                  before,
                  after: { ...after, hasUnlimitedAuthority: false, monetaryCap: { amount: num, currency } },
                });
              }}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </label>
          <label className="text-xs">
            <span className="block text-gray-600 mb-1">Currency</span>
            <select value={currency}
              onChange={e => onChange({
                roleId: current.roleId, roleName: role?.name ?? '',
                before,
                after: { ...after, monetaryCap: { amount: Number(amount) || 0, currency: e.target.value } },
              })}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
              {['USD', 'EUR', 'GBP', 'AED', 'JPY'].map(c => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="text-xs col-span-1">
            <span className="block text-gray-600 mb-1">Conditions</span>
            <input type="text" value={conditions}
              onChange={e => onChange({
                roleId: current.roleId, roleName: role?.name ?? '',
                before,
                after: { ...after, conditions: e.target.value },
              })}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </label>
        </div>
      )}
    </li>
  );
}

// ============================================================================
// Current chain preview (CascadeDown context)
// ============================================================================

function CurrentChainPreview({
  authorities, allRoles,
}: { authorities: RoleAuthority[]; allRoles: Role[] }) {
  const roleById = new Map(allRoles.map(r => [r.id, r] as const));
  // Sort descending by cap (Unlimited / no-cap first, then by amount desc, then conditional)
  const sorted = [...authorities].sort((a, b) => {
    const av = a.hasUnlimitedAuthority ? Number.POSITIVE_INFINITY
      : a.monetaryCap?.amount ?? -1;
    const bv = b.hasUnlimitedAuthority ? Number.POSITIVE_INFINITY
      : b.monetaryCap?.amount ?? -1;
    return bv - av;
  });

  if (sorted.length === 0) {
    return (
      <p className="text-xs italic text-gray-500 p-3 bg-gray-50 border border-gray-200 rounded">
        No roles currently have authority on this delegation.
      </p>
    );
  }

  return (
    <ul className="space-y-1 max-h-56 overflow-y-auto border border-gray-200 rounded bg-gray-50 p-2">
      {sorted.map(a => {
        const role = roleById.get(a.roleId);
        const capStr = a.monetaryCap
          ? `${a.monetaryCap.currency} ${formatNumber(a.monetaryCap.amount)}`
          : a.hasUnlimitedAuthority ? 'Approval rights' : '—';
        return (
          <li key={a.roleId} className="flex items-center justify-between text-xs px-2 py-1">
            <span className="text-gray-900">{role?.name ?? a.roleId}</span>
            <span className="font-mono text-gray-700">{capStr}</span>
          </li>
        );
      })}
    </ul>
  );
}

// ============================================================================
// Add-cell picker (CascadeDown / AddNew)
// ============================================================================

function AddCellPicker({
  allRoles, excludeRoleIds, edits, onAdd, onRemove,
}: {
  allRoles: Role[];
  excludeRoleIds: string[];
  edits: Record<string, CRCellEdit>;
  onAdd: (role: Role, state: CRCellState) => void;
  onRemove: (roleId: string) => void;
}) {
  const [selectRoleId, setSelectRoleId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [conditions, setConditions] = useState('');
  const [unlimited, setUnlimited] = useState(false);

  const available = allRoles
    .filter(r => !excludeRoleIds.includes(r.id) && !edits[r.id])
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const addedEntries = Object.values(edits);

  const addCell = () => {
    if (!selectRoleId) return;
    const role = allRoles.find(r => r.id === selectRoleId);
    if (!role) return;
    const state: CRCellState = {};
    if (unlimited) {
      state.hasUnlimitedAuthority = true;
    } else if (amount) {
      state.monetaryCap = { amount: Number(amount.replace(/[, ]/g, '')) || 0, currency };
    }
    if (conditions) state.conditions = conditions;
    onAdd(role, state);
    setSelectRoleId(''); setAmount(''); setConditions(''); setUnlimited(false);
  };

  return (
    <div className="space-y-3">
      {addedEntries.length > 0 && (
        <ul className="space-y-1.5">
          {addedEntries.map(e => (
            <li key={e.roleId} className="flex items-center justify-between p-2 bg-amber-50 border border-amber-200 rounded text-xs">
              <span><strong>{e.roleName}</strong>{' '}
                {e.after?.monetaryCap && <span>· {e.after.monetaryCap.currency} {formatNumber(e.after.monetaryCap.amount)}</span>}
                {e.after?.hasUnlimitedAuthority && <span>· Approval rights</span>}
                {e.after?.conditions && <span className="italic"> · {e.after.conditions}</span>}
              </span>
              <button onClick={() => onRemove(e.roleId)} className="text-red-700 hover:bg-red-100 rounded p-1">
                <Minus className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="border border-gray-200 rounded p-3 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <select value={selectRoleId}
            onChange={e => setSelectRoleId(e.target.value)}
            className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option value="">— Pick a role —</option>
            {available.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <label className="flex items-center gap-1.5 text-xs">
            <input type="checkbox" checked={unlimited} onChange={e => setUnlimited(e.target.checked)} />
            Approval rights (no monetary cap)
          </label>
        </div>
        {!unlimited && (
          <div className="grid grid-cols-3 gap-2">
            <input type="text" inputMode="numeric" value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Amount"
              className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <select value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
              {['USD', 'EUR', 'GBP', 'AED', 'JPY'].map(c => <option key={c}>{c}</option>)}
            </select>
            <input type="text" value={conditions}
              onChange={e => setConditions(e.target.value)}
              placeholder="Conditions (optional)"
              className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
        )}
        <button onClick={addCell} disabled={!selectRoleId}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white rounded text-sm hover:bg-amber-600 disabled:opacity-40">
          <Plus className="w-4 h-4" />Add cell
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Helpers
// ============================================================================

function buildSummary(proposal: CRProposal): string {
  switch (proposal.kind) {
    case 'Adjust':
      return `Adjust ${proposal.targetDelegationId}: ${proposal.cellChanges.length} cell edit${proposal.cellChanges.length === 1 ? '' : 's'}.`;
    case 'CascadeDown':
      return `Cascade down on ${proposal.targetDelegationId}: add ${proposal.cellsAdded.length} role${proposal.cellsAdded.length === 1 ? '' : 's'}.`;
    case 'Remove':
      return proposal.wholeDelegation
        ? `Remove the entire delegation ${proposal.targetDelegationId}.`
        : `Remove ${proposal.cellsRemoved?.length ?? 0} cell${(proposal.cellsRemoved?.length ?? 0) === 1 ? '' : 's'} from ${proposal.targetDelegationId}.`;
    case 'Clarify':
      return `Clarify ${proposal.targetDelegationId} — text update only.`;
    case 'AddNew':
      return `Add new delegation ${proposal.newDelegationId}: ${proposal.description.slice(0, 80)}`;
  }
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
