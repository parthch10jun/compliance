/**
 * JNBP Authority Matrix — seed loader.
 *
 * Imports the parsed Excel JSON, types it, and assembles 5 matrix versions
 * (v1.0 → v1.4) using the metadata from the Version tab of the source file.
 * For the demo, v1.0-v1.3 share the same content as v1.4 — only metadata
 * (effective dates, changelog) differs. The active version is v1.4.
 */

import type {
  AuthorityMatrix,
  Delegation,
  MatrixVersion,
  Reference,
  Role,
  RoleAuthority,
  Section,
  Subsection,
  SubSubsection,
  Term,
} from '../types';
import rawData from './jnbp-matrix.json';

interface RawData {
  matrixName: string;
  roles: Role[];
  sections: Section[];
  subsections: Subsection[];
  subSubsections: SubSubsection[];
  delegations: Delegation[];
  authorities: RoleAuthority[];
  terms: Term[];
  references: Reference[];
  versions: { version: string; date: string; description: string }[];
}

const data = rawData as unknown as RawData;

const isoDate = (d: string): string => {
  if (!d || d === 'Day 1 of JERA Nex bp') return '2025-10-01T00:00:00.000Z';
  // Excel datetimes look like '2025-11-01 00:00:00' — normalise to ISO.
  const t = d.includes('T') ? d : d.replace(' ', 'T');
  return new Date(t).toISOString();
};

const APPROVERS_BY_VERSION: Record<string, string> = {
  '1': 'Board',
  '1.1': 'Nathalie Oosterlinck (CEO)',
  '1.2': 'Board',
  '1.3': 'Nathalie Oosterlinck (CEO)',
  '1.4': 'Nathalie Oosterlinck (CEO)',
};

function buildVersionSnapshot(
  versionRaw: { version: string; date: string; description: string },
  status: 'Active' | 'Superseded',
  effectiveTo: string | null,
): MatrixVersion {
  return {
    version: versionRaw.version,
    status,
    effectiveFrom: isoDate(versionRaw.date),
    effectiveTo,
    changelogTitle: versionRaw.description.split('.')[0].trim() + '.',
    changelogDetail: versionRaw.description,
    approvedByLabel: APPROVERS_BY_VERSION[versionRaw.version] ?? 'Board',
    approvedDate: isoDate(versionRaw.date),
    // All snapshots share the v1.4 content for demo simplicity. Future work
    // can vary the past versions to make the diff view richer.
    delegations: data.delegations,
    authorities: data.authorities,
    sections: data.sections,
    subsections: data.subsections,
    subSubsections: data.subSubsections,
  };
}

export function getSeedMatrix(): AuthorityMatrix {
  const sortedVersions = [...data.versions].sort((a, b) =>
    a.version.localeCompare(b.version, undefined, { numeric: true }),
  );

  const versions: MatrixVersion[] = sortedVersions.map((v, idx) => {
    const isLast = idx === sortedVersions.length - 1;
    const nextEffective = !isLast ? isoDate(sortedVersions[idx + 1].date) : null;
    return buildVersionSnapshot(
      v,
      isLast ? 'Active' : 'Superseded',
      isLast ? null : nextEffective,
    );
  });

  return {
    id: 'matrix-jnbp',
    name: data.matrixName,
    roles: data.roles,
    terms: data.terms,
    references: data.references,
    versions,
  };
}

export const SEED_MATRIX: AuthorityMatrix = getSeedMatrix();
