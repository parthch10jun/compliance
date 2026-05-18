'use client';

/**
 * Create New SoD Rule
 * Define a new Segregation of Duties rule
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Plus, X } from 'lucide-react';

export default function NewSoDRule() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    severity: 'Critical',
    function1: '',
    function2: '',
    conflictType: 'Same User',
    riskDescription: '',
    allowOverride: false,
    requiresApproval: true,
    compensatingControls: [''],
    applicableEntities: '',
    regulatoryReference: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('SoD Rule created successfully! (Mock submission)');
    window.location.href = '/doa/sod/rules';
  };

  const addControl = () => {
    setFormData({
      ...formData,
      compensatingControls: [...formData.compensatingControls, ''],
    });
  };

  const removeControl = (index: number) => {
    setFormData({
      ...formData,
      compensatingControls: formData.compensatingControls.filter((_, i) => i !== index),
    });
  };

  const updateControl = (index: number, value: string) => {
    const updated = [...formData.compensatingControls];
    updated[index] = value;
    setFormData({...formData, compensatingControls: updated});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doa/sod/rules" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-h1 font-semibold text-gray-900">Create SoD Rule</h1>
            <p className="text-p2 text-gray-600 mt-1">Define a new segregation of duties rule</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <h2 className="text-h2 font-semibold text-gray-900">Rule Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              placeholder="e.g., Requestor Cannot Approve Own Purchase"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity *</label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({...formData, severity: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              required
            >
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Conflict Type *</label>
            <select
              value={formData.conflictType}
              onChange={(e) => setFormData({...formData, conflictType: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              required
            >
              <option>Same User</option>
              <option>Same Role</option>
              <option>Reporting Line</option>
              <option>Same Department</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Conflicting Function 1 *</label>
            <input
              type="text"
              value={formData.function1}
              onChange={(e) => setFormData({...formData, function1: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              placeholder="e.g., Create Purchase Request"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Conflicting Function 2 *</label>
            <input
              type="text"
              value={formData.function2}
              onChange={(e) => setFormData({...formData, function2: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              placeholder="e.g., Approve Purchase Request"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              placeholder="Describe what this rule prevents..."
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Risk Description *</label>
            <textarea
              value={formData.riskDescription}
              onChange={(e) => setFormData({...formData, riskDescription: e.target.value})}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              placeholder="Describe the risks if this separation is violated..."
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Compensating Controls</label>
            <div className="space-y-2">
              {formData.compensatingControls.map((control, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={control}
                    onChange={(e) => updateControl(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                    placeholder={`Control ${index + 1}`}
                  />
                  {formData.compensatingControls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeControl(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addControl}
                className="flex items-center gap-2 text-[#F59E0B] hover:text-[#D97706] text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Control
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Applicable Entities</label>
            <input
              type="text"
              value={formData.applicableEntities}
              onChange={(e) => setFormData({...formData, applicableEntities: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              placeholder="e.g., All Business Units, APAC only"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Regulatory Reference</label>
            <input
              type="text"
              value={formData.regulatoryReference}
              onChange={(e) => setFormData({...formData, regulatoryReference: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              placeholder="e.g., SOX Section 404, COSO Framework"
            />
          </div>

          <div className="md:col-span-2 space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.allowOverride}
                onChange={(e) => setFormData({...formData, allowOverride: e.target.checked})}
                className="w-4 h-4 text-[#F59E0B] border-gray-300 rounded focus:ring-[#F59E0B]"
              />
              <span className="text-sm text-gray-700">Allow manual override with approval</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.requiresApproval}
                onChange={(e) => setFormData({...formData, requiresApproval: e.target.checked})}
                className="w-4 h-4 text-[#F59E0B] border-gray-300 rounded focus:ring-[#F59E0B]"
              />
              <span className="text-sm text-gray-700">Requires additional approval if violated</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Link
            href="/doa/sod/rules"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium"
          >
            <Shield className="w-4 h-4" />
            Create Rule
          </button>
        </div>
      </form>
    </div>
  );
}
