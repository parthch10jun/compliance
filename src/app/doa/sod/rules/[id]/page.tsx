'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Shield } from 'lucide-react';

export default function SoDRuleDetailPage() {
  const params = useParams();
  const ruleId = params.id as string;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/doa/sod/rules" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-h1 font-semibold text-gray-900">SoD Rule Detail</h1>
          <p className="text-p2 text-gray-600 mt-1">Rule ID: {ruleId}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-h3 font-semibold text-gray-900">Approve own expense reports</h3>
            <p className="text-gray-600 mt-2">A user cannot both create and approve their own expense reports to prevent fraud.</p>
            <div className="mt-4 flex items-center gap-4">
              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded">Critical Severity</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
