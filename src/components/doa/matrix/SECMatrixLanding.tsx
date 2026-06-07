'use client';

/**
 * Saudi Electricity Company — Authorization Matrix grid.
 *
 * A faithful replica of SEC's Excel layout (this is the format Saudi
 * customers expect): a dense RACI grid with a multi-level header where the
 * "Approve" group spans Group CEO, the board committees, the BOD, and the
 * General Assembly. Category tabs filter the visible sections.
 *
 * Strictly SEC-branded — no cross-tenant references appear here.
 */

import React, { useMemo, useState } from 'react';
import { Check, Printer, Search } from 'lucide-react';
import { SEC_MATRIX, SEC_COMMITTEES, type SECApprove } from '@/lib/doa/matrix/sec-data';
import { formatDate } from '@/lib/doa/utils/format';

const NAVY = '#1B4B8F';
const NAVY_DARK = '#143A70';

export default function SECMatrixLanding() {
  const [activeCategory, setActiveCategory] = useState<string>(SEC_MATRIX.categories[0]);
  const [query, setQuery] = useState('');

  // Sections in the active category, with their transactions.
  const visibleSections = useMemo(() => {
    return SEC_MATRIX.sections
      .filter(s => s.category === activeCategory)
      .map(section => {
        let txns = SEC_MATRIX.transactions.filter(t => t.sectionId === section.id);
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
  }, [activeCategory, query]);

  const populatedCategories = useMemo(() => {
    const set = new Set(SEC_MATRIX.sections.map(s => s.category));
    return SEC_MATRIX.categories.map(c => ({ name: c, hasData: set.has(c) }));
  }, []);

  const tick = (on?: boolean) =>
    on ? <Check className="w-3.5 h-3.5 mx-auto" style={{ color: NAVY }} strokeWidth={3} /> : null;

  return (
    <div className="space-y-4">
      {/* Header band */}
      <div className="rounded-lg overflow-hidden border border-gray-200">
        <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: NAVY }}>
          <div>
            <div className="text-[11px] uppercase tracking-widest text-blue-200">
              {SEC_MATRIX.organisation}
            </div>
            <h1 className="text-xl font-semibold text-white mt-0.5">{SEC_MATRIX.title}</h1>
          </div>
          <div className="text-right text-blue-100">
            <div className="text-sm font-semibold">{SEC_MATRIX.version}</div>
            <div className="text-[11px]">Approved {formatDate(SEC_MATRIX.approvedDate)}</div>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-px bg-gray-200 border-t border-gray-200">
          {populatedCategories.map(cat => (
            <button
              key={cat.name}
              onClick={() => cat.hasData && setActiveCategory(cat.name)}
              disabled={!cat.hasData}
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                activeCategory === cat.name
                  ? 'text-white'
                  : cat.hasData
                  ? 'bg-white text-gray-700 hover:bg-gray-50'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
              style={activeCategory === cat.name ? { backgroundColor: NAVY_DARK } : undefined}
            >
              {cat.name}
              {!cat.hasData && <span className="ml-1 text-[9px] uppercase">soon</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search transactions…"
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2"
            style={{ ['--tw-ring-color' as string]: NAVY }}
          />
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
        >
          <Printer className="w-4 h-4" />Print / Export
        </button>
      </div>

      {/* The grid */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-xs border-collapse">
          <thead>
            {/* Header row 1 */}
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
            {/* Header row 2 */}
            <tr style={{ backgroundColor: NAVY_DARK }} className="text-white">
              <th rowSpan={2} className="border border-blue-300/30 px-1.5 py-2 w-14 align-middle leading-tight">Grp CEO</th>
              <th colSpan={6} className="border border-blue-300/30 px-2 py-1.5">Committees</th>
              <th rowSpan={2} className="border border-blue-300/30 px-1.5 py-2 w-12 align-middle">BOD</th>
              <th colSpan={2} className="border border-blue-300/30 px-2 py-1.5 leading-tight">General Assembly</th>
            </tr>
            {/* Header row 3 */}
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
                  No transactions in this category{query ? ' match your search' : ''}.
                </td>
              </tr>
            )}
            {visibleSections.map(({ section, txns }) => (
              <React.Fragment key={section.id}>
                {/* Section header row */}
                <tr style={{ backgroundColor: '#EAF0F9' }}>
                  <td className="border border-gray-200 px-2 py-1.5 font-bold text-gray-900">{section.id}</td>
                  <td colSpan={19} className="border border-gray-200 px-3 py-1.5 font-bold text-gray-900">
                    {section.title}
                  </td>
                </tr>
                {/* Transaction rows */}
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
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-gray-500 px-1">
        <span><strong>D / ND</strong> — Delegable / Non-Delegable</span>
        <span><strong>BOD</strong> — Board of Directors</span>
        <span><strong>EGA / OGA</strong> — Extraordinary / Ordinary General Assembly</span>
        {SEC_COMMITTEES.map(c => (
          <span key={c.key}><strong>{c.label}</strong> — {c.full}</span>
        ))}
      </div>

      <p className="text-[10px] text-gray-400 px-1">
        Strictly Confidential. All information contained in this document is the property of {SEC_MATRIX.organisation}.
      </p>
    </div>
  );
}
