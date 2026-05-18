'use client';

/**
 * New Approval Request Wizard
 * Multi-step form for submitting new approval requests
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, FileText, DollarSign, Users, Upload, Loader2 } from 'lucide-react';
import { saveApprovalToLocalStorage, generateApprovalId } from '@/lib/doa/data/enhancedData';
import type { ApprovalRequest } from '@/lib/doa/types/doa-types';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/common/Toast';

export default function NewApprovalRequest() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toasts, removeToast, success } = useToast();
  const [formData, setFormData] = useState({
    requestType: 'Purchase Order',
    description: '',
    businessUnit: '',
    costCenter: '',
    monetaryAmount: '',
    currency: 'USD',
    justification: '',
    urgency: 'Normal',
    attachments: [] as File[],
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate request number
    const requestNumber = `APR-2026-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`;
    const now = new Date().toISOString();

    // Create approval request object
    const newApproval: ApprovalRequest = {
      id: generateApprovalId(),
      requestNumber,
      requestType: formData.requestType,
      description: formData.description,
      requestedBy: 'user-001', // Current user (mock)
      requestedByName: 'Demo User',
      requestedDate: now,
      businessUnit: formData.businessUnit || 'Corporate',
      costCenter: formData.costCenter || 'DEMO-001',
      monetaryAmount: parseFloat(formData.monetaryAmount) || 0,
      currency: formData.currency,
      status: 'Pending',
      workflowId: 'wf-001',
      currentStep: 1,
      approvalHistory: [],
      justification: formData.justification,
      sodCheckPassed: true,
      isException: false,
      isEmergency: formData.urgency === 'Emergency',
    };

    // Save to localStorage
    saveApprovalToLocalStorage(newApproval);

    // Success notification
    success(`✅ Approval request ${requestNumber} submitted successfully!\nYou can view it in the Approvals list.`);

    // Redirect to approvals list after a short delay
    setTimeout(() => {
      window.location.href = '/doa/approvals';
    }, 1500);
  };

  const steps = [
    { number: 1, name: 'Request Details', icon: FileText },
    { number: 2, name: 'Financial Info', icon: DollarSign },
    { number: 3, name: 'Justification', icon: Users },
    { number: 4, name: 'Review & Submit', icon: Check },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doa/approvals" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-h1 font-semibold text-gray-900">New Approval Request</h1>
            <p className="text-p2 text-gray-600 mt-1">Submit a new request for approval</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          {steps.map((s, idx) => (
            <div key={s.number} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= s.number ? 'bg-[#F59E0B] text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s.number ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                </div>
                <div>
                  <div className={`font-medium ${step >= s.number ? 'text-gray-900' : 'text-gray-500'}`}>
                    {s.name}
                  </div>
                  <div className="text-xs text-gray-500">Step {s.number}</div>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${step > s.number ? 'bg-[#F59E0B]' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-h2 font-semibold text-gray-900">Request Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Request Type *</label>
                <select
                  value={formData.requestType}
                  onChange={(e) => handleInputChange('requestType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  required
                >
                  <option>Purchase Order</option>
                  <option>Contract Approval</option>
                  <option>Hiring</option>
                  <option>Budget Allocation</option>
                  <option>Capital Expenditure</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Unit *</label>
                <select
                  value={formData.businessUnit}
                  onChange={(e) => handleInputChange('businessUnit', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  required
                >
                  <option value="">Select Business Unit</option>
                  <option>North America</option>
                  <option>EMEA</option>
                  <option>APAC</option>
                  <option>Latin America</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  placeholder="Describe what you need approval for..."
                  required
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-h2 font-semibold text-gray-900">Financial Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                <input
                  type="number"
                  value={formData.monetaryAmount}
                  onChange={(e) => handleInputChange('monetaryAmount', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency *</label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  required
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                  <option>JPY</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost Center *</label>
                <input
                  type="text"
                  value={formData.costCenter}
                  onChange={(e) => handleInputChange('costCenter', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  placeholder="e.g., IT-NA-001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
                <select
                  value={formData.urgency}
                  onChange={(e) => handleInputChange('urgency', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                >
                  <option>Normal</option>
                  <option>Urgent</option>
                  <option>Emergency</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-h2 font-semibold text-gray-900">Justification & Attachments</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Justification *</label>
              <textarea
                value={formData.justification}
                onChange={(e) => handleInputChange('justification', e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                placeholder="Explain why this approval is needed, expected benefits, and any relevant background..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#F59E0B] transition-colors">
                <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PDF, Word, Excel, or image files (max 10MB)</p>
                <input type="file" multiple className="hidden" />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-h2 font-semibold text-gray-900">Review & Submit</h2>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Request Type</div>
                  <div className="font-medium text-gray-900">{formData.requestType}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Business Unit</div>
                  <div className="font-medium text-gray-900">{formData.businessUnit || 'Not specified'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Amount</div>
                  <div className="font-medium text-gray-900">
                    {formData.monetaryAmount ? `${formData.currency} ${parseFloat(formData.monetaryAmount).toLocaleString()}` : 'Not specified'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Cost Center</div>
                  <div className="font-medium text-gray-900">{formData.costCenter || 'Not specified'}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-gray-500">Description</div>
                  <div className="font-medium text-gray-900">{formData.description || 'Not specified'}</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This request will be routed based on your authority matrix.
                You will receive an email notification once it's been submitted.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-6 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Submit Request
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
