'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Save } from 'lucide-react';
import clsx from 'clsx';

export default function NewControlPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Preventive' as 'Preventive' | 'Detective' | 'Corrective' | 'Directive',
    category: 'Prevent' as 'Avoid' | 'Prevent' | 'Detect' | 'Mitigate' | 'Transfer' | 'Accept',
    owner: '',
    monitor: '',
    effectivenessQualitative: 'Not Assessed' as 'Very Effective' | 'Effective' | 'Moderately Effective' | 'Ineffective' | 'Not Assessed',
    effectivenessQuantitative: 0,
    effectivenessRationale: '',
    costQualitative: 'Low' as 'Low' | 'Medium' | 'High' | 'Very High',
    costQuantitative: 0,
    costCurrency: 'USD',
    costAssumptions: '',
    likelihoodReduction: 0,
    consequenceReduction: 0,
    status: 'Not Started' as 'Not Started' | 'In Progress' | 'Completed' | 'Overdue' | 'On Hold',
    implementationDate: '',
    dueDate: '',
    reviewFrequency: 'Quarterly' as 'Monthly' | 'Quarterly' | 'Semi-Annually' | 'Annually',
    linkedRisks: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating control:', formData);
    // In real app, save to backend
    router.push('/erm/controls');
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/erm/controls')}
          className="flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Controls Library
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <Shield size={24} className="text-[var(--primary)]" />
          <h1 className="text-h2 font-bold text-[var(--foreground)]">Add New Control</h1>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Create a new risk treatment control or mitigation measure
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Main Form */}
          <div className="col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white border border-[var(--border)] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Control Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    placeholder="e.g., Multi-Factor Authentication"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    placeholder="Describe the control and how it mitigates risk..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Type <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    >
                      <option value="Preventive">Preventive</option>
                      <option value="Detective">Detective</option>
                      <option value="Corrective">Corrective</option>
                      <option value="Directive">Directive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Category <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    >
                      <option value="Avoid">Avoid</option>
                      <option value="Prevent">Prevent</option>
                      <option value="Detect">Detect</option>
                      <option value="Mitigate">Mitigate</option>
                      <option value="Transfer">Transfer</option>
                      <option value="Accept">Accept</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Owner <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={formData.owner}
                      onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    >
                      <option value="">Select owner...</option>
                      <option value="Sarah Chen (CISO)">Sarah Chen (CISO)</option>
                      <option value="IT Security Team">IT Security Team</option>
                      <option value="Jennifer Walsh (CCO)">Jennifer Walsh (CCO)</option>
                      <option value="David Kumar (COO)">David Kumar (COO)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Monitor
                    </label>
                    <input
                      type="text"
                      value={formData.monitor}
                      onChange={(e) => setFormData({ ...formData, monitor: e.target.value })}
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                      placeholder="e.g., IT Security Team"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Effectiveness Assessment */}
            <div className="bg-white border border-[var(--border)] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Effectiveness Assessment</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Qualitative Rating
                    </label>
                    <select
                      value={formData.effectivenessQualitative}
                      onChange={(e) => setFormData({ ...formData, effectivenessQualitative: e.target.value as any })}
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    >
                      <option value="Not Assessed">Not Assessed</option>
                      <option value="Very Effective">Very Effective</option>
                      <option value="Effective">Effective</option>
                      <option value="Moderately Effective">Moderately Effective</option>
                      <option value="Ineffective">Ineffective</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Quantitative Rating (0-100%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.effectivenessQuantitative}
                      onChange={(e) => setFormData({ ...formData, effectivenessQuantitative: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Effectiveness Rationale
                  </label>
                  <textarea
                    value={formData.effectivenessRationale}
                    onChange={(e) => setFormData({ ...formData, effectivenessRationale: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    placeholder="Explain why this control is effective..."
                  />
                </div>
              </div>
            </div>

            {/* Treatment Effects */}
            <div className="bg-white border border-[var(--border)] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Risk Treatment Effects</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Likelihood Reduction (0-5)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={formData.likelihoodReduction}
                    onChange={(e) => setFormData({ ...formData, likelihoodReduction: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  />
                  <p className="text-xs text-[var(--foreground-muted)] mt-1">
                    How many levels this control reduces likelihood
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Consequence Reduction (0-5)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={formData.consequenceReduction}
                    onChange={(e) => setFormData({ ...formData, consequenceReduction: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  />
                  <p className="text-xs text-[var(--foreground-muted)] mt-1">
                    How many levels this control reduces consequence
                  </p>
                </div>
              </div>
            </div>

            {/* Cost Information */}
            <div className="bg-white border border-[var(--border)] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Cost Information</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Qualitative Cost
                    </label>
                    <select
                      value={formData.costQualitative}
                      onChange={(e) => setFormData({ ...formData, costQualitative: e.target.value as any })}
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Very High">Very High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Quantitative Cost
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={formData.costCurrency}
                        onChange={(e) => setFormData({ ...formData, costCurrency: e.target.value })}
                        className="w-24 px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                      <input
                        type="number"
                        min="0"
                        value={formData.costQuantitative}
                        onChange={(e) => setFormData({ ...formData, costQuantitative: parseInt(e.target.value) || 0 })}
                        className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Cost Assumptions
                  </label>
                  <textarea
                    value={formData.costAssumptions}
                    onChange={(e) => setFormData({ ...formData, costAssumptions: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    placeholder="Explain cost calculations and assumptions..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Status & Timeline */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white border border-[var(--border)] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Status & Timeline</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Implementation Date
                  </label>
                  <input
                    type="date"
                    value={formData.implementationDate}
                    onChange={(e) => setFormData({ ...formData, implementationDate: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Review Schedule */}
            <div className="bg-white border border-[var(--border)] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Review Schedule</h2>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Review Frequency
                </label>
                <select
                  value={formData.reviewFrequency}
                  onChange={(e) => setFormData({ ...formData, reviewFrequency: e.target.value as any })}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Semi-Annually">Semi-Annually</option>
                  <option value="Annually">Annually</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white border border-[var(--border)] rounded-lg p-6">
              <div className="space-y-3">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full px-4 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Save size={18} />
                  Save Control
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/erm/controls')}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Help */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Creating Controls</h3>
              <p className="text-sm text-blue-800">
                Controls are measures that reduce risk likelihood or consequence. Define effectiveness, cost, and treatment effects to calculate residual risk.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
