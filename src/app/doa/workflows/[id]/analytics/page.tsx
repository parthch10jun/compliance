'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function WorkflowAnalyticsPage() {
  const params = useParams();
  const workflowId = params.id as string;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/doa/workflows/${workflowId}`} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-h1 font-semibold text-gray-900">Workflow Analytics</h1>
          <p className="text-p2 text-gray-600 mt-1">Performance metrics for Workflow {workflowId}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600">Avg. Completion Time</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">2.3 days</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600">Success Rate</div>
          <div className="text-2xl font-bold text-green-600 mt-1">94%</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600">Total Requests</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">247</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600">Bottleneck Step</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">Step 3</div>
        </div>
      </div>
    </div>
  );
}
