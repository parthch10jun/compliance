'use client';

/**
 * Reusable form pieces shared by the Create wizard and the Edit page.
 */

import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Search, ShieldCheck } from 'lucide-react';
import { mockUsers } from '@/lib/doa/data/mockUsers';
import type { ChainDesignee, ComplianceLink } from '@/lib/doa/types/delegation-rule-types';

const FRAMEWORKS = ['ISO 27001', 'SOC 2', 'ISO 27701', 'PCI DSS', 'GDPR', 'DPDP', 'Internal', 'Other'];

export function MultiSelectField({
  label, options, values, onChange,
}: { label: string; options: string[]; values: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => {
    onChange(values.includes(opt) ? values.filter(v => v !== opt) : [...values, opt]);
  };
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-2.5 py-1 text-xs rounded-full border ${
              values.includes(opt)
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ChainPicker({
  chain, onAdd, onRemove, onMove,
}: {
  chain: ChainDesignee[];
  onAdd: (userId: string) => void;
  onRemove: (userId: string) => void;
  onMove: (userId: string, dir: -1 | 1) => void;
}) {
  const [query, setQuery] = useState('');
  const filtered = mockUsers.filter(u =>
    !chain.some(c => c.userId === u.id) &&
    u.isActive &&
    (`${u.name} ${u.role} ${u.department}`.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 8);

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {chain.length === 0 && (
          <div className="text-xs text-gray-500 italic py-4 text-center border border-dashed border-gray-300 rounded">
            No chain designees yet. Add at least one below.
          </div>
        )}
        {chain.map((c, idx) => (
          <div key={c.userId} className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded">
            <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {c.position}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{c.userName}</div>
              <div className="text-xs text-gray-600 truncate">{c.userTitle} · {c.label}</div>
            </div>
            <button type="button" onClick={() => onMove(c.userId, -1)} disabled={idx === 0}
              className="p-1 hover:bg-amber-100 rounded disabled:opacity-30 disabled:cursor-not-allowed">
              <ArrowUp className="w-4 h-4 text-gray-700" />
            </button>
            <button type="button" onClick={() => onMove(c.userId, 1)} disabled={idx === chain.length - 1}
              className="p-1 hover:bg-amber-100 rounded disabled:opacity-30 disabled:cursor-not-allowed">
              <ArrowDown className="w-4 h-4 text-gray-700" />
            </button>
            <button type="button" onClick={() => onRemove(c.userId)} className="p-1 hover:bg-red-100 rounded">
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        ))}
      </div>

      <div className="border border-gray-200 rounded p-3">
        <div className="text-xs font-medium text-gray-700 mb-2">Add designee</div>
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, title, or department"
            className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {filtered.map(u => (
            <button
              key={u.id}
              type="button"
              onClick={() => onAdd(u.id)}
              className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded text-left"
            >
              <Plus className="w-3.5 h-3.5 text-gray-400" />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-900 truncate">{u.name}</div>
                <div className="text-xs text-gray-500 truncate">{u.role} · {u.department}</div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-xs text-gray-500 italic py-2 text-center">No matches.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ComplianceLinksEditor({
  links, onChange,
}: { links: ComplianceLink[]; onChange: (l: ComplianceLink[]) => void }) {
  const [draft, setDraft] = useState<ComplianceLink>({
    framework: 'ISO 27001', controlCode: '', controlName: '', rationale: '',
  });
  const addLink = () => {
    if (!draft.controlCode.trim() || !draft.controlName.trim()) return;
    onChange([...links, { ...draft }]);
    setDraft({ framework: draft.framework, controlCode: '', controlName: '', rationale: '' });
  };
  const removeLink = (idx: number) => onChange(links.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {links.length === 0 && (
          <div className="text-xs text-gray-500 italic py-4 text-center border border-dashed border-gray-300 rounded">
            No compliance links yet.
          </div>
        )}
        {links.map((l, idx) => (
          <div key={idx} className="flex items-start gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded">
            <ShieldCheck className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">
                <span className="text-blue-700">{l.framework}</span> · {l.controlCode} — {l.controlName}
              </div>
              {l.rationale && <div className="text-xs text-gray-600 mt-0.5">{l.rationale}</div>}
            </div>
            <button type="button" onClick={() => removeLink(idx)} className="p-1 hover:bg-red-100 rounded">
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        ))}
      </div>

      <div className="border border-gray-200 rounded p-3 space-y-2">
        <div className="text-xs font-medium text-gray-700">Add a compliance link</div>
        <div className="grid grid-cols-3 gap-2">
          <select value={draft.framework}
            onChange={e => setDraft(d => ({ ...d, framework: e.target.value }))}
            className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
            {FRAMEWORKS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <input value={draft.controlCode}
            onChange={e => setDraft(d => ({ ...d, controlCode: e.target.value }))}
            placeholder="Code (e.g. A.9.1)"
            className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          <input value={draft.controlName}
            onChange={e => setDraft(d => ({ ...d, controlName: e.target.value }))}
            placeholder="Control name"
            className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>
        <textarea rows={2} value={draft.rationale}
          onChange={e => setDraft(d => ({ ...d, rationale: e.target.value }))}
          placeholder="Why is this delegation linked to this control? (optional)"
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
        <button type="button" onClick={addLink}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white rounded text-sm hover:bg-amber-600">
          <Plus className="w-4 h-4" />Add link
        </button>
      </div>
    </div>
  );
}

export function chainAddHelper(chain: ChainDesignee[], userId: string): ChainDesignee[] {
  const u = mockUsers.find(x => x.id === userId);
  if (!u || chain.some(c => c.userId === userId)) return chain;
  const position = chain.length + 1;
  return [...chain, { userId: u.id, userName: u.name, userTitle: u.role, position, label: `L${position}` }];
}

export function chainRemoveHelper(chain: ChainDesignee[], userId: string): ChainDesignee[] {
  return chain
    .filter(c => c.userId !== userId)
    .map((c, i) => ({ ...c, position: i + 1, label: `L${i + 1}` }));
}

export function chainMoveHelper(chain: ChainDesignee[], userId: string, dir: -1 | 1): ChainDesignee[] {
  const i = chain.findIndex(c => c.userId === userId);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= chain.length) return chain;
  const next = [...chain];
  [next[i], next[j]] = [next[j], next[i]];
  return next.map((c, k) => ({ ...c, position: k + 1, label: `L${k + 1}` }));
}
