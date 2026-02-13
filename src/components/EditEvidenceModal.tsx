'use client';

import { useState, useEffect } from 'react';
import { X, FileText, Save } from 'lucide-react';
import clsx from 'clsx';

interface EditEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidence?: {
    id: string;
    code: string;
    name: string;
    description: string;
    type: string;
    status: string;
    validationStatus: string;
    expiresAt?: string;
    reminderDays?: number;
    tags: string[];
    notes?: string;
  };
  onSave?: (evidence: {
    id: string;
    code: string;
    name: string;
    description: string;
    type: string;
    status: string;
    validationStatus: string;
    expiresAt?: string;
    reminderDays?: number;
    tags: string[];
    notes?: string;
  }) => void;
}

export function EditEvidenceModal({ isOpen, onClose, evidence, onSave }: EditEvidenceModalProps) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'Document',
    status: 'Draft',
    validationStatus: 'Not Reviewed',
    expiresAt: '',
    reminderDays: 14,
    tags: [] as string[],
    notes: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (evidence) {
      setFormData({
        code: evidence.code,
        name: evidence.name,
        description: evidence.description,
        type: evidence.type,
        status: evidence.status,
        validationStatus: evidence.validationStatus,
        expiresAt: evidence.expiresAt || '',
        reminderDays: evidence.reminderDays || 14,
        tags: evidence.tags || [],
        notes: evidence.notes || '',
      });
    }
  }, [evidence]);

  if (!isOpen || !evidence) return null;

  const evidenceTypes = ['Document', 'Screenshot', 'Report', 'Log', 'Certificate', 'Policy', 'Procedure', 'Other'];
  const statuses = ['Draft', 'Pending Review', 'Approved', 'Rejected', 'Expired'];
  const validationStatuses = ['Not Reviewed', 'Sufficient', 'Insufficient', 'Needs Update'];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.code.trim()) newErrors.code = 'Evidence code is required';
    if (!formData.name.trim()) newErrors.name = 'Evidence name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (onSave) {
      onSave({ id: evidence.id, ...formData });
      console.log('Updated evidence:', { id: evidence.id, ...formData });
    }
    
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
              <FileText size={20} className="text-rose-600" />
            </div>
            <div>
              <h2 className="text-h3 font-bold text-[var(--foreground)]">Edit Evidence</h2>
              <p className="text-p3 text-[var(--foreground-muted)] mt-0.5">{evidence.code}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-[var(--background-secondary)] rounded-lg transition-colors"
          >
            <X size={20} className="text-[var(--foreground-muted)]" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            {/* Evidence Code */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Evidence Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., EVD-001"
                className={clsx(
                  'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2',
                  errors.code ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)] focus:ring-rose-500'
                )}
              />
              {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code}</p>}
            </div>

            {/* Evidence Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Evidence Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., MFA Configuration Report"
                className={clsx(
                  'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2',
                  errors.name ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)] focus:ring-rose-500'
                )}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the evidence and its purpose..."
                rows={3}
                className={clsx(
                  'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 resize-none',
                  errors.description ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)] focus:ring-rose-500'
                )}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Evidence Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {evidenceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Validation Status */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Validation Status
                </label>
                <select
                  value={formData.validationStatus}
                  onChange={(e) => setFormData({ ...formData, validationStatus: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {validationStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Reminder Days */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Reminder (Days Before Expiry)
                </label>
                <input
                  type="number"
                  value={formData.reminderDays}
                  onChange={(e) => setFormData({ ...formData, reminderDays: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Add a tag and press Enter"
                  className="flex-1 px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2.5 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors text-sm font-medium"
                >
                  Add Tag
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-[var(--background-secondary)] text-[var(--foreground)] rounded-full text-xs font-medium flex items-center gap-2">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes or comments..."
                rows={3}
                className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
              />
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
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm hover:shadow-md"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

