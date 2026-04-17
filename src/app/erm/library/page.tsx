'use client';

import { Library } from 'lucide-react';

export default function LibraryPage() {
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Library size={24} className="text-[var(--primary)]" />
          <h1 className="text-h2 font-bold text-[var(--foreground)]">Risk Library</h1>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Browse risk scenarios and templates
        </p>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-lg p-6">
        <p className="text-[var(--foreground-muted)]">Risk library and templates coming soon...</p>
      </div>
    </div>
  );
}
