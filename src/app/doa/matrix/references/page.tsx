'use client';

/**
 * References — source documents that ground the matrix.
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { getMatrix } from '@/lib/doa/matrix/store';
import type { Reference } from '@/lib/doa/matrix/types';

export default function ReferencesPage() {
  const [refs, setRefs] = useState<Reference[]>([]);
  useEffect(() => { setRefs(getMatrix().references); }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Link href="/doa/matrix" className="p-2 hover:bg-gray-100 rounded">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5" />Reference Documents
          </h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Source documents referenced throughout the Authority Matrix.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {refs.map(r => (
          <div key={r.id} className="px-4 py-3">
            <div className="text-sm font-semibold text-gray-900">{r.name}</div>
            {r.description && <div className="text-xs text-gray-600 mt-1">{r.description}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
