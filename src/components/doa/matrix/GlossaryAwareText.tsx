'use client';

/**
 * Renders text with capitalised glossary terms detected and wrapped in a
 * hover popover that shows the term's definition.
 *
 * Matching is longest-term-first to avoid prefix collisions
 * (e.g. "Project Contract" wins over "Project").
 */

import React, { useMemo, useState } from 'react';
import type { Term } from '@/lib/doa/matrix/types';

interface Props {
  text: string;
  terms: Term[];
  className?: string;
}

export default function GlossaryAwareText({ text, terms, className }: Props) {
  // Build a regex of all term names, longest first; escape regex metacharacters.
  const { regex, byLower } = useMemo(() => {
    const map = new Map<string, Term>();
    terms.forEach(t => map.set(t.name.toLowerCase(), t));
    const sorted = [...terms].sort((a, b) => b.name.length - a.name.length);
    const pattern = sorted
      .map(t => t.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');
    return {
      regex: pattern ? new RegExp(`\\b(${pattern})\\b`, 'gi') : null,
      byLower: map,
    };
  }, [terms]);

  if (!text) return null;
  if (!regex) return <span className={className}>{text}</span>;

  const pieces: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      pieces.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }
    const term = byLower.get(match[0].toLowerCase())!;
    pieces.push(<GlossaryTag key={key++} term={term} surfaceText={match[0]} />);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    pieces.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }
  return <span className={className}>{pieces}</span>;
}

function GlossaryTag({ term, surfaceText }: { term: Term; surfaceText: string }) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="relative inline cursor-help"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span className="border-b border-dotted border-amber-500 text-amber-800">
        {surfaceText}
      </span>
      {open && (
        <span
          className="absolute left-0 top-full z-50 mt-1 inline-block w-80 max-w-[90vw] rounded-lg border border-gray-200 bg-white p-3 shadow-lg"
          role="tooltip"
        >
          <span className="block text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
            {term.name}
          </span>
          <span className="block text-xs text-gray-800 leading-relaxed">
            {term.definition}
          </span>
          {term.notes && (
            <span className="mt-2 block border-t border-gray-100 pt-2 text-xs italic text-gray-600">
              {term.notes}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
