'use client';

/**
 * Glossary — all defined terms used across the matrix.
 */

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Search } from 'lucide-react';
import { getMatrix } from '@/lib/doa/matrix/store';
import type { Term } from '@/lib/doa/matrix/types';

export default function GlossaryPage() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => { setTerms(getMatrix().terms); }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return terms;
    const q = query.toLowerCase();
    return terms.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.definition.toLowerCase().includes(q),
    );
  }, [terms, query]);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Link href="/doa/matrix" className="p-2 hover:bg-gray-100 rounded">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />Glossary
          </h1>
          <p className="text-sm text-gray-600 mt-0.5">
            {terms.length} defined terms used across the Authority Matrix.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search terms…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {filtered.map(t => (
          <div key={t.id} className="px-4 py-3">
            <div className="text-sm font-semibold text-amber-800 mb-1">{t.name}</div>
            <div className="text-sm text-gray-800">{t.definition}</div>
            {t.notes && <div className="text-xs italic text-gray-600 mt-1">{t.notes}</div>}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-gray-500">No terms match.</div>
        )}
      </div>
    </div>
  );
}
