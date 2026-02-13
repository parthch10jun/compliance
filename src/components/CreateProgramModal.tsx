'use client';

import { useState } from 'react';
import { X, Sparkles, Shield, Building2, User, Tag, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface CreateProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (programData: ProgramFormData) => void;
}

export interface ProgramFormData {
  name: string;
  description: string;
  framework: string;
  owner: string;
  department: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  tags: string[];
}

const priorityOptions = ['Low', 'Medium', 'High', 'Critical'] as const;
const departmentOptions = [
  'Information Security',
  'IT',
  'Legal',
  'Compliance',
  'Risk Management',
  'Operations',
  'Finance',
  'Human Resources'
];

export function CreateProgramModal({ isOpen, onClose, onSubmit }: CreateProgramModalProps) {
  const [formData, setFormData] = useState<ProgramFormData>({
    name: '',
    description: '',
    framework: '',
    owner: '',
    department: '',
    priority: 'Medium',
    tags: []
  });
  
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof ProgramFormData, string>>>({});

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProgramFormData, string>> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Program name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.framework.trim()) newErrors.framework = 'Framework is required';
    if (!formData.owner.trim()) newErrors.owner = 'Owner is required';
    if (!formData.department) newErrors.department = 'Department is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      framework: '',
      owner: '',
      department: '',
      priority: 'Medium',
      tags: []
    });
    setTagInput('');
    setErrors({});
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-gradient-to-r from-violet-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-h2 font-bold text-[var(--foreground)]">Create Custom Program</h2>
              <p className="text-p3 text-[var(--foreground-muted)]">Build a compliance program from scratch</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X size={20} className="text-[var(--foreground-muted)]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-5">
            {/* Program Name */}
            <div>
              <label className="block text-p2 font-medium text-[var(--foreground)] mb-2">
                Program Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={clsx(
                  'w-full px-4 py-2.5 border rounded-lg text-p2 bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all',
                  errors.name ? 'border-red-500' : 'border-[var(--border)]'
                )}
                placeholder="e.g., Custom GDPR Compliance Program"
              />
              {errors.name && (
                <p className="text-p3 text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-p2 font-medium text-[var(--foreground)] mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={clsx(
                  'w-full px-4 py-2.5 border rounded-lg text-p2 bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all resize-none',
                  errors.description ? 'border-red-500' : 'border-[var(--border)]'
                )}
                placeholder="Describe the purpose and scope of this compliance program"
              />
              {errors.description && (
                <p className="text-p3 text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.description}
                </p>
              )}
            </div>

            {/* Framework */}
            <div>
              <label className="block text-p2 font-medium text-[var(--foreground)] mb-2">
                Framework <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Shield size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                <input
                  type="text"
                  value={formData.framework}
                  onChange={(e) => setFormData({ ...formData, framework: e.target.value })}
                  className={clsx(
                    'w-full pl-10 pr-4 py-2.5 border rounded-lg text-p2 bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all',
                    errors.framework ? 'border-red-500' : 'border-[var(--border)]'
                  )}
                  placeholder="e.g., Custom Framework, Internal Policy"
                />
              </div>
              {errors.framework && (
                <p className="text-p3 text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.framework}
                </p>
              )}
            </div>

            {/* Owner and Department */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-p2 font-medium text-[var(--foreground)] mb-2">
                  Owner <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                  <input
                    type="text"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    className={clsx(
                      'w-full pl-10 pr-4 py-2.5 border rounded-lg text-p2 bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all',
                      errors.owner ? 'border-red-500' : 'border-[var(--border)]'
                    )}
                    placeholder="Program owner name"
                  />
                </div>
                {errors.owner && (
                  <p className="text-p3 text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.owner}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-p2 font-medium text-[var(--foreground)] mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className={clsx(
                      'w-full pl-10 pr-4 py-2.5 border rounded-lg text-p2 bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all appearance-none',
                      errors.department ? 'border-red-500' : 'border-[var(--border)]'
                    )}
                  >
                    <option value="">Select department</option>
                    {departmentOptions.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                {errors.department && (
                  <p className="text-p3 text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.department}
                  </p>
                )}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-p2 font-medium text-[var(--foreground)] mb-2">
                Priority
              </label>
              <div className="flex gap-2">
                {priorityOptions.map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority })}
                    className={clsx(
                      'flex-1 px-4 py-2.5 rounded-lg font-medium text-p2 transition-all border',
                      formData.priority === priority
                        ? priority === 'Critical' ? 'bg-red-100 text-red-700 border-red-300' :
                          priority === 'High' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                          priority === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                          'bg-gray-100 text-gray-700 border-gray-300'
                        : 'bg-[var(--background)] text-[var(--foreground-muted)] border-[var(--border)] hover:border-violet-500/30'
                    )}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-p2 font-medium text-[var(--foreground)] mb-2">
                Tags
              </label>
              <div className="relative">
                <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-20 py-2.5 border border-[var(--border)] rounded-lg text-p2 bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all"
                  placeholder="Add tags (press Enter)"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-violet-600 text-white rounded text-p3 font-medium hover:bg-violet-700 transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-p3 font-medium flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-violet-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border)] bg-[var(--background-secondary)]">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 border border-[var(--border)] rounded-lg font-medium text-p2 hover:bg-[var(--background)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-violet-600 text-white rounded-lg font-medium text-p2 hover:bg-violet-700 transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <Sparkles size={18} />
            Create Program
          </button>
        </div>
      </div>
    </div>
  );
}

