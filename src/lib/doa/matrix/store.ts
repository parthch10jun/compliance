/**
 * Matrix store.
 *
 * Browser-only persistence layer for the AuthorityMatrix. First read seeds
 * localStorage from JNBP's bundled JSON; subsequent reads return whatever
 * the user has mutated. Resetting clears localStorage and returns to seed.
 */

import type {
  AuthorityMatrix,
  Delegation,
  MatrixVersion,
  Role,
  RoleAuthority,
} from './types';
import { SEED_MATRIX } from './data';

const STORAGE_KEY = 'doa_authority_matrix_v1';

const isBrowser = (): boolean => typeof window !== 'undefined';

function readStore(): AuthorityMatrix | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthorityMatrix) : null;
  } catch {
    return null;
  }
}

function writeStore(matrix: AuthorityMatrix): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(matrix));
}

export function getMatrix(): AuthorityMatrix {
  return readStore() ?? SEED_MATRIX;
}

export function saveMatrix(matrix: AuthorityMatrix): void {
  writeStore(matrix);
}

export function resetMatrix(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getActiveVersion(matrix: AuthorityMatrix = getMatrix()): MatrixVersion {
  const active = matrix.versions.find(v => v.status === 'Active');
  if (active) return active;
  // Fallback to latest by version string sort.
  return [...matrix.versions].sort((a, b) =>
    b.version.localeCompare(a.version, undefined, { numeric: true }),
  )[0];
}

export function getVersionByNumber(versionNum: string): MatrixVersion | undefined {
  const matrix = getMatrix();
  return matrix.versions.find(v => v.version === versionNum);
}

export function getDelegationById(
  delegationId: string,
  version?: MatrixVersion,
): Delegation | undefined {
  const v = version ?? getActiveVersion();
  return v.delegations.find(d => d.id === delegationId);
}

export function getAuthoritiesForDelegation(
  delegationId: string,
  version?: MatrixVersion,
): RoleAuthority[] {
  const v = version ?? getActiveVersion();
  return v.authorities.filter(a => a.delegationId === delegationId);
}

export function getDelegationsForRole(
  roleId: string,
  version?: MatrixVersion,
): { delegation: Delegation; authority: RoleAuthority }[] {
  const v = version ?? getActiveVersion();
  const auths = v.authorities.filter(a => a.roleId === roleId);
  return auths
    .map(authority => {
      const delegation = v.delegations.find(d => d.id === authority.delegationId);
      if (!delegation) return null;
      return { delegation, authority };
    })
    .filter((x): x is { delegation: Delegation; authority: RoleAuthority } => x !== null);
}

export function getRoleById(roleId: string): Role | undefined {
  return getMatrix().roles.find(r => r.id === roleId);
}

export function getTermByName(name: string): import('./types').Term | undefined {
  const trimmed = name.trim().toLowerCase();
  return getMatrix().terms.find(t => t.name.toLowerCase() === trimmed);
}
