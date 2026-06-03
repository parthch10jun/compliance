/**
 * Authority Matrix — type definitions.
 *
 * Models the JNBP DoA matrix: a versioned, hierarchical catalogue of
 * delegations with sparse role-authority cells. Cell values use a hybrid
 * shape — structured monetary cap + free-text conditions.
 */

export interface Role {
  id: string;
  name: string;
  sortOrder: number;
}

export interface Section {
  id: string;          // 'A', 'B', 'C', 'D'
  title: string;       // 'STRATEGY & GOVERNANCE'
  sortOrder: number;
}

export interface Subsection {
  id: string;          // 'A1', 'A2', 'D3'
  sectionId: string;
  title: string;
  sortOrder: number;
}

export interface SubSubsection {
  id: string;          // 'D3.1', 'D3.2', 'D3.3'
  subsectionId: string;
  title: string;
  sortOrder: number;
}

export interface Delegation {
  id: string;          // 'A.1.1', 'D.3.1.1', etc.
  subsectionId: string;
  subSubsectionId?: string | null;
  description: string;
  explanatoryNotes: string;
  referenceDocText?: string | null;
  sortOrder: number;
}

export interface RoleAuthority {
  delegationId: string;
  roleId: string;
  hasUnlimitedAuthority: boolean;        // true for cells that were just "X"
  monetaryCap?: { amount: number; currency: string };
  conditions?: string;                   // free-text qualifiers ("up to COD", "Offtake only", etc.)
}

export interface Term {
  id: string;
  name: string;
  definition: string;
  notes?: string;
}

export interface Reference {
  id: string;
  name: string;
  description: string;
}

export type MatrixVersionStatus = 'Active' | 'Superseded';

export interface MatrixVersion {
  version: string;                       // '1.0', '1.1', '1.4'
  status: MatrixVersionStatus;
  effectiveFrom: string;                 // ISO date
  effectiveTo?: string | null;           // ISO date, null for active
  changelogTitle: string;
  changelogDetail?: string | null;
  approvedByLabel?: string | null;       // 'Board', 'CEO' or specific name
  approvedDate?: string | null;          // ISO date
  // Each version snapshots the full matrix content. The Active version is the
  // source of truth for current lookups; Superseded versions exist for the
  // history page and version-to-version diffs.
  delegations: Delegation[];
  authorities: RoleAuthority[];
  sections: Section[];
  subsections: Subsection[];
  subSubsections: SubSubsection[];
}

export interface AuthorityMatrix {
  id: string;
  name: string;
  // Canonical reference data (not versioned in this scope — changes via a
  // separate ceremony in a future phase).
  roles: Role[];
  terms: Term[];
  references: Reference[];
  // The full version history, oldest-first. Exactly one entry has
  // status='Active'; the rest are 'Superseded'.
  versions: MatrixVersion[];
}
