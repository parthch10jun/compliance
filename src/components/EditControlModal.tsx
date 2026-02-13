'use client';

import { useState, useEffect } from 'react';
import { X, Shield, Save } from 'lucide-react';
import clsx from 'clsx';

interface EditControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  control?: {
    id: string;
    code: string;
    name: string;
    description: string;
    category: string;
    type: string;
    automationLevel: string;
    frequency: string;
    owner: string;
    department: string;
    effectiveness?: string;
  };
  onSave?: (control: {
    id: string;
    code: string;
    name: string;
    description: string;
    category: string;
    type: string;
    automationLevel: string;
    frequency: string;
    owner: string;
    department: string;
    effectiveness: string;
  }) => void;
}

export function EditControlModal({ isOpen, onClose, control, onSave }: EditControlModalProps) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    category: 'Access Control',
    type: 'Preventive',
    automationLevel: 'Manual',
    frequency: 'Monthly',
    owner: '',
    department: '',
    effectiveness: 'Not Tested',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (control) {
      setFormData({
        code: control.code,
        name: control.name,
        description: control.description,
        category: control.category,
        type: control.type,
        automationLevel: control.automationLevel,
        frequency: control.frequency,
        owner: control.owner,
        department: control.department,
        effectiveness: control.effectiveness || 'Not Tested',
      });
    }
  }, [control]);

  if (!isOpen || !control) return null;

  const categories = [
    'Access Control',
    'Cryptography',
    'Monitoring',
    'Business Continuity',
    'Endpoint Security',
    'Vulnerability Management',
    'Network Security',
    'Incident Management',
    'Training & Awareness',
    'Privacy',
    'Documentation',
    'Data Protection',
    'Audit & Logging',
    'Change Management',
    'Asset Management'
  ];

  const types = ['Preventive', 'Detective', 'Corrective'];
  const automationLevels = ['Manual', 'Semi-Automated', 'Fully Automated'];
  const frequencies = ['Continuous', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annual'];
  const effectivenessLevels = ['Effective', 'Partially Effective', 'Ineffective', 'Not Tested'];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.code.trim()) newErrors.code = 'Control code is required';
    if (!formData.name.trim()) newErrors.name = 'Control name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.owner.trim()) newErrors.owner = 'Owner is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (onSave) {
      onSave({ id: control.id, ...formData });
      console.log('Updated control:', { id: control.id, ...formData });
    }
    
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <Shield size={20} className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-h3 font-bold text-[var(--foreground)]">Edit Control</h2>
              <p className="text-p3 text-[var(--foreground-muted)] mt-0.5">{control.code}</p>
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
            {/* Control Code */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Control Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., CTRL-014"
                className={clsx(
                  'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2',
                  errors.code ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)] focus:ring-violet-500'
                )}
              />
              {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code}</p>}
            </div>

            {/* Control Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Control Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Multi-Factor Authentication"
                className={clsx(
                  'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2',
                  errors.name ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)] focus:ring-violet-500'
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
                placeholder="Describe the control's purpose and implementation..."
                rows={3}
                className={clsx(
                  'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 resize-none',
                  errors.description ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)] focus:ring-violet-500'
                )}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Control Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Automation Level */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Automation Level
                </label>
                <select
                  value={formData.automationLevel}
                  onChange={(e) => setFormData({ ...formData, automationLevel: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {automationLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {frequencies.map(freq => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>

              {/* Effectiveness */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Effectiveness
                </label>
                <select
                  value={formData.effectiveness}
                  onChange={(e) => setFormData({ ...formData, effectiveness: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {effectivenessLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Owner */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Owner <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  placeholder="e.g., John Doe"
                  className={clsx(
                    'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2',
                    errors.owner ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)] focus:ring-violet-500'
                  )}
                />
                {errors.owner && <p className="text-xs text-red-500 mt-1">{errors.owner}</p>}
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g., Information Security"
                  className={clsx(
                    'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2',
                    errors.department ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)] focus:ring-violet-500'
                  )}
                />
                {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department}</p>}
              </div>
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
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm hover:shadow-md"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

