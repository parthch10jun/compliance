'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import clsx from 'clsx';
import { useFormWithAutoSave } from '@/lib/hooks/useAutoSave';
import { validateFormData } from '@/lib/data/validation';

export default function DemoAutoSavePage() {
  const router = useRouter();
  
  const [validationResult, setValidationResult] = useState<any>(null);

  const { formData, updateField, resetForm, autoSave } = useFormWithAutoSave(
    {
      title: '',
      description: '',
      category: '',
      owner: '',
      inherentLikelihood: '',
      inherentConsequence: '',
      status: 'Identified'
    },
    async (data) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('[Auto-Save] Saved data:', data);
    },
    {
      interval: 10, // 10 seconds for demo (faster than normal)
      enabled: true,
      entityType: 'Risk Demo',
      entityId: 'demo-001'
    }
  );

  const handleValidate = () => {
    const result = validateFormData('Risk', formData);
    setValidationResult(result);
  };

  const handleSubmit = async () => {
    const result = validateFormData('Risk', formData);
    setValidationResult(result);
    
    if (result.isValid) {
      await autoSave.saveNow();
      alert('Form submitted successfully!');
      resetForm();
      setValidationResult(null);
    } else {
      alert(`Cannot submit: ${result.missingMandatoryFields.length} required fields missing`);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/erm/settings')}
          className="flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Settings
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <Save size={24} className="text-[var(--primary)]" />
          <h1 className="text-h2 font-bold text-[var(--foreground)]">Auto-Save Demo</h1>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          This form demonstrates auto-save and mandatory field validation features
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="col-span-2 bg-white border border-[var(--border)] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6">Create New Risk (Demo)</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Risk Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Enter risk title"
                className={clsx(
                  'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent',
                  validationResult?.errors.find((e: any) => e.fieldName === 'title')
                    ? 'border-red-500'
                    : 'border-[var(--border)]'
                )}
              />
              {validationResult?.errors.find((e: any) => e.fieldName === 'title') && (
                <p className="text-xs text-red-600 mt-1">
                  {validationResult.errors.find((e: any) => e.fieldName === 'title').errorMessage}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Description <span className="text-red-600">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Enter detailed risk description"
                rows={4}
                className={clsx(
                  'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent',
                  validationResult?.errors.find((e: any) => e.fieldName === 'description')
                    ? 'border-red-500'
                    : 'border-[var(--border)]'
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Category <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className={clsx(
                    'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent',
                    validationResult?.errors.find((e: any) => e.fieldName === 'category')
                      ? 'border-red-500'
                      : 'border-[var(--border)]'
                  )}
                >
                  <option value="">Select category</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Operational">Operational</option>
                  <option value="Financial">Financial</option>
                  <option value="Compliance">Compliance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Risk Owner <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) => updateField('owner', e.target.value)}
                  placeholder="Enter owner name"
                  className={clsx(
                    'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent',
                    validationResult?.errors.find((e: any) => e.fieldName === 'owner')
                      ? 'border-red-500'
                      : 'border-[var(--border)]'
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Inherent Likelihood <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.inherentLikelihood}
                  onChange={(e) => updateField('inherentLikelihood', e.target.value)}
                  className={clsx(
                    'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent',
                    validationResult?.errors.find((e: any) => e.fieldName === 'inherentLikelihood')
                      ? 'border-red-500'
                      : 'border-[var(--border)]'
                  )}
                >
                  <option value="">Select likelihood</option>
                  <option value="1">1 - Rare</option>
                  <option value="2">2 - Unlikely</option>
                  <option value="3">3 - Possible</option>
                  <option value="4">4 - Likely</option>
                  <option value="5">5 - Almost Certain</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Inherent Consequence <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.inherentConsequence}
                  onChange={(e) => updateField('inherentConsequence', e.target.value)}
                  className={clsx(
                    'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent',
                    validationResult?.errors.find((e: any) => e.fieldName === 'inherentConsequence')
                      ? 'border-red-500'
                      : 'border-[var(--border)]'
                  )}
                >
                  <option value="">Select consequence</option>
                  <option value="1">1 - Insignificant</option>
                  <option value="2">2 - Minor</option>
                  <option value="3">3 - Moderate</option>
                  <option value="4">4 - Major</option>
                  <option value="5">5 - Catastrophic</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border)]">
            <button
              onClick={resetForm}
              className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset Form
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleValidate}
                className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors"
              >
                Validate
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Auto-Save Status */}
        <div className="space-y-6">
          {/* Auto-Save Status */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Auto-Save Status</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {autoSave.isSaving ? (
                  <Clock size={20} className="text-blue-600 animate-spin" />
                ) : autoSave.hasUnsavedChanges ? (
                  <AlertCircle size={20} className="text-orange-600" />
                ) : (
                  <CheckCircle size={20} className="text-green-600" />
                )}
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {autoSave.isSaving ? 'Saving...' : autoSave.hasUnsavedChanges ? 'Unsaved Changes' : 'All Saved'}
                  </div>
                  <div className="text-xs text-[var(--foreground-muted)]">
                    {autoSave.lastSaved 
                      ? `Last saved ${autoSave.timeSinceLastSave}s ago`
                      : 'Not saved yet'}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)] space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">Save Count:</span>
                  <span className="font-medium">{autoSave.saveCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">Has Changes:</span>
                  <span className={clsx(
                    'px-2 py-0.5 text-xs font-medium rounded',
                    autoSave.hasUnsavedChanges ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                  )}>
                    {autoSave.hasUnsavedChanges ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => autoSave.saveNow()}
                disabled={autoSave.isSaving}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save size={16} />
                Save Now
              </button>
            </div>
          </div>

          {/* Validation Status */}
          {validationResult && (
            <div className={clsx(
              'border rounded-lg p-6',
              validationResult.isValid
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            )}>
              <h3 className="text-sm font-semibold mb-4">
                {validationResult.isValid ? '✅ Validation Passed' : '❌ Validation Failed'}
              </h3>
              
              {!validationResult.isValid && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-red-900">
                    Missing {validationResult.missingMandatoryFields.length} required fields:
                  </div>
                  <ul className="text-sm text-red-800 space-y-1">
                    {validationResult.missingMandatoryFields.map((field: string) => (
                      <li key={field}>• {field}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Features Demo</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>✅ Auto-saves every 10 seconds</li>
              <li>✅ Warns before leaving with unsaved changes</li>
              <li>✅ Validates mandatory fields</li>
              <li>✅ Real-time validation feedback</li>
              <li>✅ Manual save button</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
