'use client';

/**
 * New Authority Matrix Wizard
 * Create a new authority matrix from scratch or template
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Plus } from 'lucide-react';

export default function NewAuthorityMatrix() {
  const [formData, setFormData] = useState({
    name: '',
    function: 'Financial',
    description: '',
    effectiveDate: '',
    template: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Authority Matrix created successfully! (Mock submission)');
    window.location.href = '/doa/authority-matrix';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doa/authority-matrix" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-h1 font-semibold text-gray-900">New Authority Matrix</h1>
            <p className="text-p2 text-gray-600 mt-1">Create a new authority matrix for your organization</p>
          </div>
        </div>
      </div>

      {/* Option Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border-2 border-gray-200 hover:border-[#F59E0B] p-6 cursor-pointer transition-all">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <div>
              <h3 className="text-h3 font-semibold text-gray-900 mb-2">Start from Template</h3>
              <p className="text-sm text-gray-600">Use a pre-configured template for common business functions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border-2 border-gray-200 hover:border-[#F59E0B] p-6 cursor-pointer transition-all">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-h3 font-semibold text-gray-900 mb-2">Create from Scratch</h3>
              <p className="text-sm text-gray-600">Build a custom authority matrix tailored to your needs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <h2 className="text-h2 font-semibold text-gray-900">Matrix Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Matrix Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              placeholder="e.g., Financial Approvals Matrix"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Function *</label>
            <select
              value={formData.function}
              onChange={(e) => setFormData({...formData, function: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              required
            >
              <option>Financial</option>
              <option>HR & Compensation</option>
              <option>Procurement</option>
              <option>IT & Technology</option>
              <option>Legal & Contracts</option>
              <option>Operations</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Effective Date *</label>
            <input
              type="date"
              value={formData.effectiveDate}
              onChange={(e) => setFormData({...formData, effectiveDate: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Use Template (Optional)</label>
            <select
              value={formData.template}
              onChange={(e) => setFormData({...formData, template: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
            >
              <option value="">None - Start from scratch</option>
              <option>Standard Financial Approvals</option>
              <option>HR Operations Template</option>
              <option>IT Procurement Template</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              placeholder="Describe the purpose and scope of this authority matrix..."
              required
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Link
            href="/doa/authority-matrix"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium"
          >
            <FileText className="w-4 h-4" />
            Create Matrix
          </button>
        </div>
      </form>
    </div>
  );
}
