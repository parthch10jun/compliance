'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Edit, BarChart3 } from 'lucide-react';

export default function WorkflowDetailPage() {
  const params = useParams();
  const workflowId = params.id as string;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doa/workflows" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-h1 font-semibold text-gray-900">Financial Approval Workflow</h1>
            <p className="text-p2 text-gray-600 mt-1">Workflow ID: {workflowId}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href={`/doa/workflows/${workflowId}/analytics`} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Link>
          <button className="px-4 py-2 bg-[#F59E0B] text-white rounded-lg hover:bg-amber-600 flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600">Total Steps</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">4</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600">Workflow Type</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">Sequential</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600">Status</div>
          <div className="text-2xl font-bold text-green-600 mt-1">Active</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-h3 font-semibold mb-4">Workflow Steps</h3>
        <div className="space-y-3">
          {[
            { step: 1, role: 'Manager', condition: 'Amount > $1,000' },
            { step: 2, role: 'Senior Manager', condition: 'Amount > $25,000' },
            { step: 3, role: 'Director', condition: 'Amount > $100,000' },
            { step: 4, role: 'CFO', condition: 'Amount > $500,000' },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-[#F59E0B] font-semibold flex items-center justify-center">
                {item.step}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.role}</div>
                <div className="text-sm text-gray-600">{item.condition}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
