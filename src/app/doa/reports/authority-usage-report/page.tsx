'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AuthorityUsageReportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/doa/reports" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-h1 font-semibold text-gray-900">Authority Usage Report</h1>
          <p className="text-p2 text-gray-600 mt-1">
            This report is available at <Link href="/doa/reports/authority-usage" className="text-[#F59E0B] hover:underline">/doa/reports/authority-usage</Link>
          </p>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <p className="text-gray-700">Redirecting to the main authority usage report...</p>
      </div>
    </div>
  );
}
