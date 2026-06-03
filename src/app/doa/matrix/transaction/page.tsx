'use client';

/**
 * Transaction lookup — placeholder.
 *
 * The full transaction-first matcher lives in /doa/requests for now (built
 * in an earlier phase against the older delegations model). The matrix-
 * native transaction matcher will land here in a follow-up.
 */

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Receipt, ChevronRight } from 'lucide-react';

export default function TransactionLookupPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Link href="/doa/matrix" className="p-2 hover:bg-gray-100 rounded">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Receipt className="w-5 h-5" />Transaction Lookup
          </h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Describe a transaction → find which roles can approve it.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <p className="text-sm text-amber-900">
          The matrix-native transaction matcher is coming in a follow-up. In the meantime, the
          existing transaction-first flow lives at{' '}
          <Link href="/doa/requests/new" className="font-medium underline">
            /doa/requests/new
          </Link>{' '}
          and works against the legacy delegation-rule catalogue.
        </p>
        <Link
          href="/doa/matrix"
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:underline"
        >
          Back to matrix <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
