'use client';

/**
 * Render the structured before/after diff of a CRProposal.
 *
 * Shows per-cell edits side-by-side (current / proposed), plus any text
 * edits to the delegation's description or explanatory notes. Designed
 * for reviewers to spot exactly what's changing.
 */

import React from 'react';
import { ArrowRight, Plus, Minus, PencilLine } from 'lucide-react';
import { formatNumber } from '@/lib/doa/utils/format';
import type { CRCellEdit, CRCellState, CRProposal } from '@/lib/doa/matrix/change-request-types';

export default function CRProposalDiff({ proposal }: { proposal: CRProposal | undefined }) {
  if (!proposal) {
    return (
      <p className="text-xs italic text-gray-500">
        This CR was submitted without a structured proposal — see the free-text summary above.
      </p>
    );
  }

  switch (proposal.kind) {
    case 'Adjust':
      return (
        <div className="space-y-3">
          <TextDiff label="Description"
            before={proposal.descriptionBefore} after={proposal.descriptionAfter} />
          <TextDiff label="Explanatory notes"
            before={proposal.explanatoryNotesBefore} after={proposal.explanatoryNotesAfter} />
          <CellEdits edits={proposal.cellChanges} />
        </div>
      );
    case 'CascadeDown':
      return (
        <div className="space-y-3">
          <Banner kind="add">Cascade authority down — {proposal.cellsAdded.length} new cell{proposal.cellsAdded.length === 1 ? '' : 's'}.</Banner>
          <CellEdits edits={proposal.cellsAdded} />
        </div>
      );
    case 'Remove':
      return (
        <div className="space-y-3">
          {proposal.wholeDelegation ? (
            <Banner kind="remove">Remove the entire delegation row.</Banner>
          ) : (
            <Banner kind="remove">Remove {proposal.cellsRemoved?.length ?? 0} cell{(proposal.cellsRemoved?.length ?? 0) === 1 ? '' : 's'} from this delegation.</Banner>
          )}
          {proposal.cellsRemoved && <CellEdits edits={proposal.cellsRemoved} />}
        </div>
      );
    case 'Clarify':
      return (
        <div className="space-y-3">
          <Banner kind="edit">Text edit only — no cell changes.</Banner>
          <TextDiff label="Description"
            before={proposal.descriptionBefore} after={proposal.descriptionAfter} />
          <TextDiff label="Explanatory notes"
            before={proposal.explanatoryNotesBefore} after={proposal.explanatoryNotesAfter} />
        </div>
      );
    case 'AddNew':
      return (
        <div className="space-y-3">
          <Banner kind="add">
            Add new delegation <strong>{proposal.newDelegationId}</strong> under subsection {proposal.subsectionId}.
          </Banner>
          <div className="text-xs">
            <div className="font-semibold text-gray-700 mb-1">Description</div>
            <p className="text-gray-800 bg-green-50 border border-green-200 rounded p-2">{proposal.description}</p>
          </div>
          {proposal.explanatoryNotes && (
            <div className="text-xs">
              <div className="font-semibold text-gray-700 mb-1">Explanatory notes</div>
              <p className="text-gray-800 bg-green-50 border border-green-200 rounded p-2">{proposal.explanatoryNotes}</p>
            </div>
          )}
          <div className="text-xs">
            <div className="font-semibold text-gray-700 mb-1">
              Initial role authorities ({proposal.cellsAdded.length})
            </div>
            <CellEdits edits={proposal.cellsAdded} />
          </div>
        </div>
      );
  }
}

// ===========================================================================
// Sub-components
// ===========================================================================

function CellEdits({ edits }: { edits: CRCellEdit[] }) {
  if (edits.length === 0) {
    return <p className="text-xs italic text-gray-500">No cell-level changes.</p>;
  }
  return (
    <ul className="space-y-2">
      {edits.map((edit, idx) => (
        <li key={`${edit.roleId}-${idx}`}>
          <CellEditRow edit={edit} />
        </li>
      ))}
    </ul>
  );
}

function CellEditRow({ edit }: { edit: CRCellEdit }) {
  const isAdd = !edit.before && edit.after;
  const isRemove = edit.before && !edit.after;
  const indicator = isAdd
    ? { icon: <Plus className="w-3.5 h-3.5" />, color: 'text-green-700', bg: 'bg-green-50 border-green-200', verb: 'Add' }
    : isRemove
    ? { icon: <Minus className="w-3.5 h-3.5" />, color: 'text-red-700', bg: 'bg-red-50 border-red-200', verb: 'Remove' }
    : { icon: <PencilLine className="w-3.5 h-3.5" />, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', verb: 'Adjust' };

  return (
    <div className={`border rounded p-3 ${indicator.bg}`}>
      <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold">
        <span className={indicator.color}>{indicator.icon}</span>
        <span className={indicator.color}>{indicator.verb}</span>
        <span className="text-gray-700">·</span>
        <span className="text-gray-900">{edit.roleName}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="text-[10px] uppercase tracking-wide text-gray-500 mb-0.5">Current</div>
          <CellStateView state={edit.before} placeholder="(no authority)" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-amber-700 mb-0.5">Proposed</div>
          <CellStateView state={edit.after} placeholder="(remove)" />
        </div>
      </div>
    </div>
  );
}

function CellStateView({ state, placeholder }: { state: CRCellState | null; placeholder: string }) {
  if (!state) return <em className="text-gray-400">{placeholder}</em>;
  const parts: React.ReactNode[] = [];
  if (state.monetaryCap) {
    parts.push(
      <span key="cap" className="font-semibold text-gray-900">
        {state.monetaryCap.currency} {formatNumber(state.monetaryCap.amount)}
      </span>,
    );
  }
  if (state.hasUnlimitedAuthority && !state.monetaryCap) {
    parts.push(<span key="x" className="text-gray-900">Approval rights</span>);
  }
  if (state.conditions) {
    parts.push(<div key="cond" className="text-gray-700 italic mt-0.5">{state.conditions}</div>);
  }
  if (parts.length === 0) return <span className="text-gray-700 italic">authority granted</span>;
  return <div>{parts}</div>;
}

function TextDiff({ label, before, after }: { label: string; before?: string; after?: string }) {
  if (!after && !before) return null;
  if (before === after) return null;
  return (
    <div className="text-xs">
      <div className="font-semibold text-gray-700 mb-1">{label}</div>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-2 bg-gray-50 border border-gray-200 rounded">
          <div className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">Current</div>
          <p className="text-gray-700 whitespace-pre-wrap">{before || <em className="text-gray-400">(empty)</em>}</p>
        </div>
        <div className="p-2 bg-amber-50 border border-amber-200 rounded">
          <div className="text-[10px] uppercase tracking-wide text-amber-700 mb-1">Proposed</div>
          <p className="text-gray-900 whitespace-pre-wrap">{after || <em className="text-gray-400">(empty)</em>}</p>
        </div>
      </div>
    </div>
  );
}

function Banner({ kind, children }: { kind: 'add' | 'remove' | 'edit'; children: React.ReactNode }) {
  const cls = kind === 'add' ? 'bg-green-50 border-green-200 text-green-900'
    : kind === 'remove' ? 'bg-red-50 border-red-200 text-red-900'
    : 'bg-amber-50 border-amber-200 text-amber-900';
  const icon = kind === 'add' ? <Plus className="w-4 h-4" />
    : kind === 'remove' ? <Minus className="w-4 h-4" />
    : <PencilLine className="w-4 h-4" />;
  return (
    <div className={`flex items-center gap-2 px-3 py-2 border rounded text-xs font-medium ${cls}`}>
      {icon}{children}
    </div>
  );
}
