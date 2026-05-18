'use client';

/**
 * Exception Request Form
 * Request an exception or override to DoA rules
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertOctagon, Upload } from 'lucide-react';

export default function NewExceptionRequest() {
  const [formData, setFormData] = useState({
    type: 'Authority Override',
    severity: 'Medium',
    description: '',
    reason: '',
    amount: '',
    duration: '',
    compensatingControls: [''],
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Exception request submitted! (Demo mode)');
  };
  
  const addCompensatingControl = () => {
    setFormData({
      ...formData,
      compensatingControls: [...formData.compensatingControls, ''],
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/doa/exceptions"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-h1 font-semibold text-gray-900">Request Exception</h1>
          <p className="text-p2 text-gray-600 mt-1">
            Submit a request for authority override or exception
          </p>
        </div>
      </div>
      
      {/* Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-900">Exception Request Requires Approval</h3>
            <p className="text-sm text-amber-700 mt-1">
              All exception requests require approval from senior management or compliance officer.
            </p>
          </div>
        </div>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          {/* Exception Type */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Exception Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
              required
            >
              <option>Authority Override</option>
              <option>SoD Override</option>
              <option>Delegation Override</option>
              <option>Emergency Approval</option>
            </select>
          </div>
          
          {/* Severity */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Severity *
            </label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
              required
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
              placeholder="Describe the exception you need..."
              required
            />
          </div>
          
          {/* Reason/Justification */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Business Justification *
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
              placeholder="Provide detailed business justification..."
              required
            />
          </div>
          
          {/* Amount (if applicable) */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Amount (if applicable)
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
              placeholder="Enter amount in USD"
            />
          </div>
          
          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Exception Duration *
            </label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
              required
            >
              <option value="">Select duration...</option>
              <option>One-time</option>
              <option>24 hours</option>
              <option>7 days</option>
              <option>30 days</option>
              <option>90 days</option>
              <option>Custom</option>
            </select>
          </div>
          
          {/* Compensating Controls */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Compensating Controls *
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Describe the controls that will mitigate the risk of this exception
            </p>
            <div className="space-y-3">
              {formData.compensatingControls.map((control, index) => (
                <input
                  key={index}
                  type="text"
                  value={control}
                  onChange={(e) => {
                    const newControls = [...formData.compensatingControls];
                    newControls[index] = e.target.value;
                    setFormData({ ...formData, compensatingControls: newControls });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                  placeholder={`Compensating control ${index + 1}`}
                  required
                />
              ))}
            </div>
            <button
              type="button"
              onClick={addCompensatingControl}
              className="mt-3 text-sm text-[#F59E0B] hover:text-[#D97706]"
            >
              + Add Another Control
            </button>
          </div>
          
          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Supporting Documents
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#F59E0B] transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">PDF, DOC, XLS up to 10MB</p>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/doa/exceptions"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium"
          >
            Submit Exception Request
          </button>
        </div>
      </form>
    </div>
  );
}
