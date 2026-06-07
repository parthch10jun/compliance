'use client';

/**
 * Saudi Electricity Company — Authorization Matrix, navigated as an
 * ARIS-style org hierarchy:
 *
 *   Authority Matrices ▸ Entity ▸ Tier ▸ Business Line ▸ BL-Branch
 *
 * A collapsible tree (left) + breadcrumb (top) drive a level-dependent
 * right pane:
 *  - Tier scopes render the GOVERNANCE grid (Input / Review / Recommend /
 *    Approve-by Group CEO / Committees / BOD / General Assembly / Inform).
 *  - Business-Line and BL-Branch scopes render the RACI grid (organisational
 *    positions as columns, each cell an R/A/C/I assignment).
 *  - Container scopes render a drill-in overview; un-onboarded scopes render
 *    an empty state.
 *
 * Strictly SEC-branded, English-only — no cross-tenant references appear here.
 */

import React, { useMemo, useState } from 'react';
import {
  Check, Printer, Search, ChevronRight, ChevronDown,
  FolderTree, Building2, Layers, GitBranch, FileSpreadsheet, FileClock,
} from 'lucide-react';
import {
  SEC_TREE, SEC_ORG, SEC_COMMITTEES, SEC_KIND_LABEL, RACI_LEGEND,
  findSECNode, getSECPath, firstSECNodeWithMatrix,
  type SECNode, type SECNodeKind, type SECApprove,
  type SECGovMatrix, type SECRaciMatrix, type RaciCode,
} from '@/lib/doa/matrix/sec-data';
import { formatDate } from '@/lib/doa/utils/format';

const NAVY = '#1B4B8F';
const NAVY_DARK = '#143A70';

const KIND_ICON: Record<SECNodeKind, React.ReactNode> = {
  root: <FolderTree className="w-4 h-4" />,
  entity: <Building2 className="w-4 h-4" />,
  tier: <Layers className="w-4 h-4" />,
  businessLine: <GitBranch className="w-4 h-4" />,
  blBranch: <FileSpreadsheet className="w-4 h-4" />,
};

const RACI_CHIP: Record<RaciCode, string> = {
  R: 'bg-blue-100 text-blue-700',
  A: 'bg-emerald-100 text-emerald-700',
  C: 'bg-amber-100 text-amber-700',
  I: 'bg-gray-100 text-gray-500',
};

export default function SECMatrixLanding() {
  // Default selection = first scope that actually carries a matrix (Tier 1).
  const initialId = useMemo(() => firstSECNodeWithMatrix()?.id ?? SEC_TREE.id, []);
  const [selectedId, setSelectedId] = useState(initialId);
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(getSECPath(initialId).map(n => n.id)),
  );
  const [query, setQuery] = useState('');

  const selected = findSECNode(selectedId) ?? SEC_TREE;
  const path = getSECPath(selectedId);

  const toggle = (id: string) =>
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  const select = (node: SECNode) => {
    setSelectedId(node.id);
    setQuery('');
    setExpanded(prev => {
      const next = new Set(prev);
      getSECPath(node.id).forEach(n => next.add(n.id));
      if (node.children?.length) next.add(node.id);
      return next;
    });
  };

  const hasMatrix = !!selected.matrix;

  return (
    <div className="space-y-4">
      {/* Header band */}
      <div className="rounded-lg overflow-hidden border border-gray-200">
        <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: NAVY }}>
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center text-sm font-bold text-white">
              SEC
            </span>
            <div>
              <div className="text-[11px] uppercase tracking-widest text-blue-200">{SEC_ORG}</div>
              <h1 className="text-xl font-semibold text-white mt-0.5">Authorization Matrix</h1>
            </div>
          </div>
          {(selected.version || selected.approvedDate) && (
            <div className="text-right text-blue-100">
              {selected.version && <div className="text-sm font-semibold">{selected.version}</div>}
              {selected.approvedDate && (
                <div className="text-[11px]">Approved {formatDate(selected.approvedDate)}</div>
              )}
            </div>
          )}
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center flex-wrap gap-y-1 px-4 py-2.5 bg-white border-t border-gray-200 text-sm">
          {path.map((node, i) => {
            const last = i === path.length - 1;
            return (
              <React.Fragment key={node.id}>
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-300 mx-1.5 flex-shrink-0" />}
                <button
                  onClick={() => select(node)}
                  className={`truncate max-w-[16rem] ${
                    last ? 'font-semibold text-gray-900' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {node.label}
                </button>
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      <div className="flex gap-4 items-start">
        {/* Tree rail */}
        <aside className="w-60 flex-shrink-0">
          <div className="border border-gray-200 rounded-lg bg-white p-2">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 px-2 py-1.5">
              Org hierarchy
            </div>
            <TreeNode
              node={SEC_TREE}
              depth={0}
              selectedId={selectedId}
              expanded={expanded}
              onToggle={toggle}
              onSelect={select}
            />
          </div>
        </aside>

        {/* Right pane */}
        <section className="flex-1 min-w-0 space-y-4">
          {/* Scope title + toolbar */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: NAVY }}
              >
                {KIND_ICON[selected.kind]}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">{selected.label}</h2>
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                    {SEC_KIND_LABEL[selected.kind]}
                  </span>
                </div>
                {selected.subtitle && (
                  <p className="text-sm text-gray-600 mt-0.5">{selected.subtitle}</p>
                )}
              </div>
            </div>
            {hasMatrix && (
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 flex-shrink-0"
              >
                <Printer className="w-4 h-4" />Print / Export
              </button>
            )}
          </div>

          {hasMatrix && (
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search transactions…"
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2"
                style={{ ['--tw-ring-color' as string]: NAVY }}
              />
            </div>
          )}

          {/* Scope body */}
          {selected.matrix?.shape === 'governance' ? (
            <GovernanceGrid matrix={selected.matrix} query={query} />
          ) : selected.matrix?.shape === 'raci' ? (
            <RaciGrid matrix={selected.matrix} query={query} />
          ) : selected.children?.length ? (
            <OverviewPanel node={selected} onSelect={select} />
          ) : (
            <EmptyScope />
          )}
        </section>
      </div>

      <p className="text-[10px] text-gray-400 px-1">
        Strictly Confidential. All information contained in this document is the property of {SEC_ORG}.
      </p>
    </div>
  );
}

// ===========================================================================
// Tree
// ===========================================================================

function TreeNode({
  node, depth, selectedId, expanded, onToggle, onSelect,
}: {
  node: SECNode;
  depth: number;
  selectedId: string;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (node: SECNode) => void;
}) {
  const hasChildren = !!node.children?.length;
  const isOpen = expanded.has(node.id);
  const isSelected = selectedId === node.id;

  return (
    <div>
      <div
        className={`flex items-start gap-1 rounded cursor-pointer select-none ${
          isSelected ? 'bg-blue-50 ring-1 ring-blue-200' : 'hover:bg-gray-50'
        }`}
        style={{ paddingLeft: depth * 14 + 4 }}
      >
        <button
          onClick={() => hasChildren && onToggle(node.id)}
          className={`p-1 mt-0.5 flex-shrink-0 ${hasChildren ? 'text-gray-400 hover:text-gray-700' : 'invisible'}`}
          aria-label={isOpen ? 'Collapse' : 'Expand'}
        >
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => onSelect(node)}
          title={node.label}
          className="flex items-start gap-2 py-1.5 pr-2 flex-1 min-w-0 text-left"
        >
          <span className={`flex-shrink-0 mt-0.5 ${isSelected ? 'text-[color:var(--navy)]' : 'text-gray-400'}`} style={{ ['--navy' as string]: NAVY }}>
            {KIND_ICON[node.kind]}
          </span>
          <span className="flex-1 min-w-0">
            <span className={`block text-sm leading-snug ${isSelected ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
              {node.label}
            </span>
          </span>
          {node.matrix && (
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
              style={{ backgroundColor: NAVY }}
              title="Matrix available"
            />
          )}
        </button>
      </div>

      {hasChildren && isOpen && (
        <div>
          {node.children!.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// Governance grid (Tier scopes)
// ===========================================================================

function GovernanceGrid({ matrix, query }: { matrix: SECGovMatrix; query: string }) {
  const visibleSections = useMemo(() => {
    return matrix.sections
      .map(section => {
        let txns = matrix.transactions.filter(t => t.sectionId === section.id);
        if (query.trim()) {
          const q = query.toLowerCase();
          txns = txns.filter(t =>
            `${t.id} ${t.description} ${t.remarks ?? ''} ${t.input ?? ''} ${t.inform ?? ''}`
              .toLowerCase().includes(q),
          );
        }
        return { section, txns };
      })
      .filter(s => s.txns.length > 0);
  }, [matrix, query]);

  const tick = (on?: boolean) =>
    on ? <Check className="w-3.5 h-3.5 mx-auto" style={{ color: NAVY }} strokeWidth={3} /> : null;

  return (
    <>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-xs border-collapse">
          <thead>
            {/* Row 1 */}
            <tr style={{ backgroundColor: NAVY }} className="text-white">
              <th rowSpan={3} className="border border-blue-300/30 px-2 py-2 w-12 align-middle">Sr. No</th>
              <th rowSpan={3} className="border border-blue-300/30 px-3 py-2 text-left align-middle min-w-[18rem]">Description of Transaction</th>
              <th rowSpan={3} className="border border-blue-300/30 px-2 py-2 w-24 align-middle">Input</th>
              <th rowSpan={3} className="border border-blue-300/30 px-2 py-2 w-24 align-middle">Review</th>
              <th rowSpan={3} className="border border-blue-300/30 px-2 py-2 w-24 align-middle">Recommend</th>
              <th colSpan={10} className="border border-blue-300/30 px-2 py-1.5">Approve</th>
              <th rowSpan={3} className="border border-blue-300/30 px-2 py-2 w-28 align-middle">Inform</th>
              <th rowSpan={3} className="border border-blue-300/30 px-2 py-2 w-16 align-middle">Delegate D/ND?</th>
              <th rowSpan={3} className="border border-blue-300/30 px-3 py-2 text-left align-middle min-w-[16rem]">Remarks</th>
            </tr>
            {/* Row 2 */}
            <tr style={{ backgroundColor: NAVY_DARK }} className="text-white">
              <th rowSpan={2} className="border border-blue-300/30 px-1.5 py-2 w-14 align-middle leading-tight">Grp CEO</th>
              <th colSpan={6} className="border border-blue-300/30 px-2 py-1.5">Committees</th>
              <th rowSpan={2} className="border border-blue-300/30 px-1.5 py-2 w-12 align-middle">BOD</th>
              <th colSpan={2} className="border border-blue-300/30 px-2 py-1.5 leading-tight">General Assembly</th>
            </tr>
            {/* Row 3 */}
            <tr style={{ backgroundColor: NAVY_DARK }} className="text-white">
              {SEC_COMMITTEES.map(c => (
                <th key={c.key} title={c.full} className="border border-blue-300/30 px-1.5 py-1.5 w-12">{c.label}</th>
              ))}
              <th className="border border-blue-300/30 px-1.5 py-1.5 w-12" title="Extraordinary General Assembly">EGA</th>
              <th className="border border-blue-300/30 px-1.5 py-1.5 w-12" title="Ordinary General Assembly">OGA</th>
            </tr>
          </thead>
          <tbody>
            {visibleSections.length === 0 && (
              <tr>
                <td colSpan={20} className="px-4 py-12 text-center text-sm text-gray-500">
                  No transactions{query ? ' match your search' : ''}.
                </td>
              </tr>
            )}
            {visibleSections.map(({ section, txns }) => (
              <React.Fragment key={section.id}>
                <tr style={{ backgroundColor: '#EAF0F9' }}>
                  <td className="border border-gray-200 px-2 py-1.5 font-bold text-gray-900">{section.id}</td>
                  <td colSpan={19} className="border border-gray-200 px-3 py-1.5 font-bold text-gray-900">
                    {section.title}
                  </td>
                </tr>
                {txns.map(t => (
                  <tr key={t.id} className="hover:bg-blue-50/40">
                    <td className="border border-gray-200 px-2 py-2 text-center font-medium text-gray-700 align-top">{t.id}</td>
                    <td className="border border-gray-200 px-3 py-2 text-gray-900 align-top">{t.description}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center text-gray-700 align-top">{t.input}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center text-gray-700 align-top">{t.review}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center text-gray-700 align-top">{t.recommend}</td>
                    <td className="border border-gray-200 px-1 py-2 text-center align-top">{tick(t.approve.grpCEO)}</td>
                    {SEC_COMMITTEES.map(c => (
                      <td key={c.key} className="border border-gray-200 px-1 py-2 text-center align-top">
                        {tick(t.approve[c.key as keyof SECApprove])}
                      </td>
                    ))}
                    <td className="border border-gray-200 px-1 py-2 text-center align-top">{tick(t.approve.BOD)}</td>
                    <td className="border border-gray-200 px-1 py-2 text-center align-top">{tick(t.approve.EGA)}</td>
                    <td className="border border-gray-200 px-1 py-2 text-center align-top">{tick(t.approve.OGA)}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center text-gray-700 align-top">{t.inform}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center font-medium text-gray-700 align-top">{t.delegate}</td>
                    <td className="border border-gray-200 px-3 py-2 text-gray-600 align-top">{t.remarks}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-gray-500 px-1 mt-3">
        <span><strong>D / ND</strong> — Delegable / Non-Delegable</span>
        <span><strong>BOD</strong> — Board of Directors</span>
        <span><strong>EGA / OGA</strong> — Extraordinary / Ordinary General Assembly</span>
        {SEC_COMMITTEES.map(c => (
          <span key={c.key}><strong>{c.label}</strong> — {c.full}</span>
        ))}
      </div>
    </>
  );
}

// ===========================================================================
// RACI grid (Business-Line & BL-Branch scopes)
// ===========================================================================

function RaciGrid({ matrix, query }: { matrix: SECRaciMatrix; query: string }) {
  const visibleSections = useMemo(() => {
    return matrix.sections
      .map(section => {
        let txns = matrix.transactions.filter(t => t.sectionId === section.id);
        if (query.trim()) {
          const q = query.toLowerCase();
          txns = txns.filter(t =>
            `${t.id} ${t.description} ${t.remarks ?? ''}`.toLowerCase().includes(q),
          );
        }
        return { section, txns };
      })
      .filter(s => s.txns.length > 0);
  }, [matrix, query]);

  const colCount = 2 + matrix.roles.length + 1;

  return (
    <>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr style={{ backgroundColor: NAVY }} className="text-white">
              <th className="border border-blue-300/30 px-2 py-2 w-14 align-middle">Sr. No</th>
              <th className="border border-blue-300/30 px-3 py-2 text-left align-middle min-w-[20rem]">Activity / Transaction</th>
              {matrix.roles.map(r => (
                <th key={r.key} title={r.full} className="border border-blue-300/30 px-1.5 py-2 w-16 align-middle leading-tight">
                  {r.label}
                </th>
              ))}
              <th className="border border-blue-300/30 px-3 py-2 text-left align-middle min-w-[14rem]">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {visibleSections.length === 0 && (
              <tr>
                <td colSpan={colCount} className="px-4 py-12 text-center text-sm text-gray-500">
                  No transactions{query ? ' match your search' : ''}.
                </td>
              </tr>
            )}
            {visibleSections.map(({ section, txns }) => (
              <React.Fragment key={section.id}>
                <tr style={{ backgroundColor: '#EAF0F9' }}>
                  <td className="border border-gray-200 px-2 py-1.5 font-bold text-gray-900">{section.id}</td>
                  <td colSpan={colCount - 1} className="border border-gray-200 px-3 py-1.5 font-bold text-gray-900">
                    {section.title}
                  </td>
                </tr>
                {txns.map(t => (
                  <tr key={t.id} className="hover:bg-blue-50/40">
                    <td className="border border-gray-200 px-2 py-2 text-center font-medium text-gray-700 align-top">{t.id}</td>
                    <td className="border border-gray-200 px-3 py-2 text-gray-900 align-top">{t.description}</td>
                    {matrix.roles.map(r => {
                      const code = t.assignments[r.key];
                      return (
                        <td key={r.key} className="border border-gray-200 px-1 py-2 text-center align-top">
                          {code ? (
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-[11px] font-bold ${RACI_CHIP[code]}`}>
                              {code}
                            </span>
                          ) : null}
                        </td>
                      );
                    })}
                    <td className="border border-gray-200 px-3 py-2 text-gray-600 align-top">{t.remarks}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* RACI legend + role key */}
      <div className="mt-3 space-y-1.5">
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-gray-600 px-1">
          {(Object.keys(RACI_LEGEND) as RaciCode[]).map(code => (
            <span key={code} className="flex items-center gap-1.5">
              <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold ${RACI_CHIP[code]}`}>
                {code}
              </span>
              <strong>{RACI_LEGEND[code].word}</strong>
              <span className="text-gray-400">— {RACI_LEGEND[code].hint}</span>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-gray-500 px-1">
          {matrix.roles.map(r => (
            <span key={r.key}><strong>{r.label}</strong> — {r.full}</span>
          ))}
        </div>
      </div>
    </>
  );
}

// ===========================================================================
// Container overview + empty state
// ===========================================================================

function OverviewPanel({ node, onSelect }: { node: SECNode; onSelect: (n: SECNode) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {node.children!.map(child => {
        const status = child.matrix
          ? 'Matrix available'
          : child.children?.length
          ? `${child.children.length} sub-scope${child.children.length > 1 ? 's' : ''}`
          : 'Onboarding in progress';
        return (
          <button
            key={child.id}
            onClick={() => onSelect(child)}
            className="text-left border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all bg-white group"
          >
            <div className="flex items-start justify-between mb-2">
              <span
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: NAVY }}
              >
                {KIND_ICON[child.kind]}
              </span>
              <span className="text-[10px] uppercase tracking-wide text-gray-400">
                {SEC_KIND_LABEL[child.kind]}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 leading-snug">{child.label}</h3>
            {child.subtitle && <p className="text-xs text-gray-500 mt-1">{child.subtitle}</p>}
            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium" style={{ color: NAVY }}>
              {child.matrix && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: NAVY }} />}
              <span className={child.matrix ? '' : 'text-gray-400 font-normal'}>{status}</span>
              <ChevronRight className="w-3.5 h-3.5 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        );
      })}
    </div>
  );
}

function EmptyScope() {
  return (
    <div className="border border-dashed border-gray-300 rounded-lg bg-gray-50/60 py-14 text-center">
      <FileClock className="w-9 h-9 text-gray-300 mx-auto mb-3" />
      <p className="text-sm font-medium text-gray-700">Matrix not yet onboarded for this scope</p>
      <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
        This scope is part of the Saudi Energy authority hierarchy. Its authorization matrix is
        being prepared and will appear here once approved.
      </p>
    </div>
  );
}
