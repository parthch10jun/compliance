'use client';

/**
 * Visual Workflow Builder
 * No-code workflow designer with sequential, parallel, and conditional routing
 */

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, CheckCircle } from 'lucide-react';
import WorkflowDesigner from '@/components/doa/workflows/WorkflowDesigner';

export default function CreateWorkflowPage() {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [decisionType, setDecisionType] = useState('Purchase Order');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = (steps: any[]) => {
    // Save workflow configuration
    const workflow = {
      id: `wf-${Date.now()}`,
      name: workflowName || 'Untitled Workflow',
      description: workflowDescription,
      decisionType,
      steps,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const existingWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
    existingWorkflows.push(workflow);
    localStorage.setItem('workflows', JSON.stringify(existingWorkflows));

    setShowSuccess(true);

    setTimeout(() => {
      window.location.href = '/doa/workflows';
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doa/workflows" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workflow Designer</h1>
            <p className="text-sm text-gray-600 mt-1">
              Build approval workflows with sequential, parallel, and conditional routing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => handleSave([])}
            className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            Save Workflow
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5" />
          <div>
            <div className="font-semibold">Workflow Saved!</div>
            <div className="text-sm">Redirecting to workflows list...</div>
          </div>
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workflow Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
              placeholder="e.g., Purchase Order Approval - Over $100K"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Decision Type <span className="text-red-600">*</span>
            </label>
            <select
              value={decisionType}
              onChange={(e) => setDecisionType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
            >
              <option>Purchase Order</option>
              <option>Contract Approval</option>
              <option>Budget Request</option>
              <option>Hiring Approval</option>
              <option>Expense Report</option>
              <option>Capital Expenditure</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
              rows={2}
              placeholder="Describe when this workflow should be used..."
            />
          </div>
        </div>
      </div>

      {/* Visual Designer */}
      <WorkflowDesigner onSave={handleSave} />
    </div>
  );
}
