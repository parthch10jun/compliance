/**
 * Apply a structured CRProposal to the active matrix version.
 *
 * Mints a new MatrixVersion snapshot (the previous Active becomes Superseded
 * with effectiveTo=now). The new version contains the post-change view of
 * delegations and authorities.
 */

import type {
  AuthorityMatrix,
  Delegation,
  MatrixVersion,
  RoleAuthority,
} from './types';
import type {
  CRCellEdit,
  CRCellState,
  CRProposal,
} from './change-request-types';

const isoNow = (): string => new Date().toISOString();

function nextVersion(current: string): string {
  const parts = current.split('.').map(p => parseInt(p, 10) || 0);
  if (parts.length === 1) return `${parts[0] + 1}.0`;
  parts[parts.length - 1] += 1;
  return parts.join('.');
}

function cellStateToAuth(roleId: string, delegationId: string, s: CRCellState): RoleAuthority {
  return {
    delegationId,
    roleId,
    hasUnlimitedAuthority: s.hasUnlimitedAuthority ?? false,
    monetaryCap: s.monetaryCap,
    conditions: s.conditions,
  };
}

function applyCellEditsToAuthorities(
  authorities: RoleAuthority[],
  delegationId: string,
  edits: CRCellEdit[],
): RoleAuthority[] {
  const editsByRole = new Map(edits.map(e => [e.roleId, e]));
  const next: RoleAuthority[] = [];

  // Keep existing authorities for this delegation that aren't being edited;
  // for edited ones, replace with the 'after' state (or drop if after=null).
  authorities.forEach(a => {
    if (a.delegationId !== delegationId) {
      next.push(a);
      return;
    }
    const edit = editsByRole.get(a.roleId);
    if (!edit) {
      next.push(a);
      return;
    }
    if (edit.after) {
      next.push(cellStateToAuth(a.roleId, delegationId, edit.after));
    }
    // else after=null → drop the cell entirely
    editsByRole.delete(a.roleId);
  });

  // Any remaining edits are inserts (before=null, after=state).
  editsByRole.forEach(edit => {
    if (edit.after) {
      next.push(cellStateToAuth(edit.roleId, delegationId, edit.after));
    }
  });

  return next;
}

/**
 * Apply a CRProposal to the matrix and return the updated matrix.
 * Mutates nothing on the input; returns a fresh object.
 */
export function applyProposalToMatrix(
  matrix: AuthorityMatrix,
  proposal: CRProposal,
  changelogTitle: string,
  approverLabel: string,
): { matrix: AuthorityMatrix; newVersion: MatrixVersion } {
  const now = isoNow();

  // Identify the active version (clone deeply).
  const activeIdx = matrix.versions.findIndex(v => v.status === 'Active');
  if (activeIdx === -1) throw new Error('No active matrix version to mutate.');
  const active = JSON.parse(JSON.stringify(matrix.versions[activeIdx])) as MatrixVersion;

  // Start with the previous active version's data, mutate per proposal.
  let delegations: Delegation[] = active.delegations.map(d => ({ ...d }));
  let authorities: RoleAuthority[] = active.authorities.map(a => ({ ...a }));

  switch (proposal.kind) {
    case 'Adjust': {
      const targetIdx = delegations.findIndex(d => d.id === proposal.targetDelegationId);
      if (targetIdx !== -1) {
        delegations[targetIdx] = {
          ...delegations[targetIdx],
          description: proposal.descriptionAfter ?? delegations[targetIdx].description,
          explanatoryNotes: proposal.explanatoryNotesAfter ?? delegations[targetIdx].explanatoryNotes,
        };
      }
      authorities = applyCellEditsToAuthorities(authorities, proposal.targetDelegationId, proposal.cellChanges);
      break;
    }
    case 'CascadeDown': {
      authorities = applyCellEditsToAuthorities(authorities, proposal.targetDelegationId, proposal.cellsAdded);
      break;
    }
    case 'Remove': {
      if (proposal.wholeDelegation) {
        delegations = delegations.filter(d => d.id !== proposal.targetDelegationId);
        authorities = authorities.filter(a => a.delegationId !== proposal.targetDelegationId);
      } else if (proposal.cellsRemoved) {
        authorities = applyCellEditsToAuthorities(authorities, proposal.targetDelegationId, proposal.cellsRemoved);
      }
      break;
    }
    case 'Clarify': {
      const targetIdx = delegations.findIndex(d => d.id === proposal.targetDelegationId);
      if (targetIdx !== -1) {
        delegations[targetIdx] = {
          ...delegations[targetIdx],
          description: proposal.descriptionAfter ?? delegations[targetIdx].description,
          explanatoryNotes: proposal.explanatoryNotesAfter ?? delegations[targetIdx].explanatoryNotes,
        };
      }
      break;
    }
    case 'AddNew': {
      const newDelegation: Delegation = {
        id: proposal.newDelegationId,
        subsectionId: proposal.subsectionId,
        subSubsectionId: proposal.subSubsectionId ?? null,
        description: proposal.description,
        explanatoryNotes: proposal.explanatoryNotes,
        sortOrder: delegations.length,
      };
      delegations = [...delegations, newDelegation];
      authorities = applyCellEditsToAuthorities(authorities, proposal.newDelegationId, proposal.cellsAdded);
      break;
    }
  }

  // Build new MatrixVersion snapshot.
  const newVersionNumber = nextVersion(active.version);
  const newVersion: MatrixVersion = {
    version: newVersionNumber,
    status: 'Active',
    effectiveFrom: now,
    effectiveTo: null,
    changelogTitle,
    changelogDetail: changelogTitle,
    approvedByLabel: approverLabel,
    approvedDate: now,
    delegations,
    authorities,
    sections: active.sections,
    subsections: active.subsections,
    subSubsections: active.subSubsections,
  };

  // Mark the previously active version as superseded.
  const updatedVersions = matrix.versions.map((v, idx) => {
    if (idx === activeIdx) {
      return { ...v, status: 'Superseded' as const, effectiveTo: now };
    }
    return v;
  });
  updatedVersions.push(newVersion);

  return {
    matrix: { ...matrix, versions: updatedVersions },
    newVersion,
  };
}
