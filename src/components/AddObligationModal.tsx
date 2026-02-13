'use client';

import { useState } from 'react';
import { X, Calendar, FileText, AlertCircle, Save } from 'lucide-react';
import clsx from 'clsx';

interface AddObligationModalProps {
  isOpen: boolean;
  onClose: () => void;
  programId?: string;
  programName?: string;
  onAdd?: (obligation: ObligationFormData) => void;
}

export interface ObligationFormData {
  code: string;
  title: string;
  description: string;
  section: string;
  type: string;
  frequency: string;
  dueDate: string;
  triggerEvent: string;
  responsibleParty: string;
  programId?: string;
  programName?: string;
}

const obligationTypes = ['Reporting', 'Filing', 'Notification', 'Audit', 'Review', 'Disclosure', 'Certification'];
const frequencies = ['One-time', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'Biennial'];

export function AddObligationModal({ isOpen, onClose, programId, programName, onAdd }: AddObligationModalProps) {
  const [formData, setFormData] = useState<ObligationFormData>({
    code: '',
    title: '',
    description: '',
    section: '',
    type: 'Reporting',
    frequency: 'Quarterly',
    dueDate: '',
    triggerEvent: '',
    responsibleParty: '',
    programId,
    programName,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.code.trim()) newErrors.code = 'Code is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (!formData.responsibleParty.trim()) newErrors.responsibleParty = 'Responsible party is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (onAdd) {
      onAdd(formData);
      console.log('Created obligation:', formData);
    }
    
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      code: '',
      title: '',
      description: '',
      section: '',
      type: 'Reporting',
      frequency: 'Quarterly',
      dueDate: '',
      triggerEvent: '',
      responsibleParty: '',
      programId,
      programName,
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center">
              <Calendar size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-h3 font-bold text-[var(--foreground)]">Add Obligation</h2>
              <p className="text-p3 text-[var(--foreground-muted)] mt-0.5">
                {programName ? `Add to ${programName}` : 'Create a new compliance obligation'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X size={20} className="text-[var(--foreground-muted)]" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            {/* Code and Title */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Obligation Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., OBL-001"
                  className={clsx(
                    'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2',
                    errors.code ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)] focus:ring-orange-500'
                  )}
                />
                {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Section Reference
                </label>
                <input
                  type="text"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  placeholder="e.g., Section 4.2.1"
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Obligation Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Quarterly Compliance Report Submission"
                className={clsx(
                  'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2',
                  errors.title ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)] focus:ring-orange-500'
                )}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the obligation, what needs to be done, and any specific requirements..."
                rows={3}
                className={clsx(
                  'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 resize-none',
                  errors.description ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)] focus:ring-orange-500'
                )}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            {/* Type, Frequency, Due Date */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Obligation Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {obligationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {frequencies.map(freq => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className={clsx(
                    'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2',
                    errors.dueDate ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)] focus:ring-orange-500'
                  )}
                />
                {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
              </div>
            </div>

            {/* Trigger Event */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Trigger Event (Optional)
              </label>
              <input
                type="text"
                value={formData.triggerEvent}
                onChange={(e) => setFormData({ ...formData, triggerEvent: e.target.value })}
                placeholder="e.g., End of fiscal quarter, System change, Incident occurrence"
                className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <p className="text-xs text-[var(--foreground-muted)] mt-1">
                Specify any event that triggers this obligation
              </p>
            </div>

            {/* Responsible Party */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Responsible Party <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.responsibleParty}
                onChange={(e) => setFormData({ ...formData, responsibleParty: e.target.value })}
                placeholder="e.g., Compliance Officer, Legal Team, IT Department"
                className={clsx(
                  'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2',
                  errors.responsibleParty ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)] focus:ring-orange-500'
                )}
              />
              {errors.responsibleParty && <p className="text-xs text-red-500 mt-1">{errors.responsibleParty}</p>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--border)] bg-[var(--background-secondary)] flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 text-sm font-medium text-[var(--foreground-muted)] hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm hover:shadow-md"
          >
            <Save size={16} />
            Create Obligation
          </button>
        </div>
      </div>
    </div>
  );
}
