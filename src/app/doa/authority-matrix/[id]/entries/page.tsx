'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';

export default function MatrixEntriesPage() {
  const params = useParams();
  const matrixId = params.id as string;

  const entries = [
    { id: 1, amount: '$0 - $1,000', approver: 'Manager', function: 'Operational' },
    { id: 2, amount: '$1,001 - $5,000', approver: 'Senior Manager', function: 'Operational' },
    { id: 3, amount: '$5,001 - $25,000', approver: 'Director', function: 'Strategic' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/doa/authority-matrix/${matrixId}`} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-h1 font-semibold text-gray-900">Matrix Entries</h1>
            <p className="text-p2 text-gray-600 mt-1">All authority entries for this matrix</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] text-white rounded-lg hover:bg-amber-600">
          <Plus className="w-5 h-5" />
          Add Entry
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount Range</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Approver</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Function</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-6 py-4 text-gray-900">{entry.amount}</td>
                <td className="px-6 py-4 text-gray-600">{entry.approver}</td>
                <td className="px-6 py-4 text-gray-600">{entry.function}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
