'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GitBranch, Plus, Search, Eye, Edit, Play } from 'lucide-react';
import { usePersona } from '@/contexts/PersonaContext';

export default function WorkflowsPage() {
  const { hasPermission } = usePersona();
  const [searchQuery, setSearchQuery] = useState('');

  const workflows = [
    { id: 'wf-001', name: 'Financial Approval Workflow', type: 'Sequential', steps: 4, active: true },
    { id: 'wf-002', name: 'HR Approval Workflow', type: 'Parallel', steps: 3, active: true },
    { id: 'wf-003', name: 'IT Procurement Workflow', type: 'Conditional', steps: 5, active: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-semibold text-gray-900">Approval Workflows</h1>
          <p className="text-p2 text-gray-600 mt-1">Configure and manage approval routing workflows</p>
        </div>
        {hasPermission('manageWorkflows') && (
          <Link
            href="/doa/workflows/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Workflow
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-p3 font-semibold text-gray-700">Workflow Name</th>
              <th className="px-6 py-3 text-left text-p3 font-semibold text-gray-700">Type</th>
              <th className="px-6 py-3 text-left text-p3 font-semibold text-gray-700">Steps</th>
              <th className="px-6 py-3 text-left text-p3 font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-right text-p3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {workflows.map((workflow) => (
              <tr key={workflow.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <Link href={`/doa/workflows/${workflow.id}`} className="font-medium text-gray-900 hover:text-[#F59E0B]">
                    {workflow.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-gray-600">{workflow.type}</td>
                <td className="px-6 py-4 text-gray-600">{workflow.steps} steps</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${workflow.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {workflow.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/doa/workflows/${workflow.id}`} className="p-2 hover:bg-gray-100 rounded-lg">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </Link>
                    {hasPermission('editWorkflow') && (
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
