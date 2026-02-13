'use client';

import { useState } from 'react';
import { X, Landmark, Save, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface AddAuthorityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (authority: AuthorityFormData) => void;
}

export interface AuthorityFormData {
  name: string;
  shortCode: string;
  type: string;
  description: string;
  websiteUrl: string;
  contactEmail: string;
  jurisdiction: string;
}

const authorityTypes = ['Regulatory', 'Standards Body', 'Jurisdictional', 'Industry', 'International'];
const jurisdictions = ['India', 'United States', 'European Union', 'United Kingdom', 'Saudi Arabia', 'UAE', 'Singapore', 'Global'];

export function AddAuthorityModal({ isOpen, onClose, onAdd }: AddAuthorityModalProps) {
  const [formData, setFormData] = useState<AuthorityFormData>({
    name: '',
    shortCode: '',
    type: 'Regulatory',
    description: '',
    websiteUrl: '',
    contactEmail: '',
    jurisdiction: 'India',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Authority name is required';
    if (!formData.shortCode.trim()) newErrors.shortCode = 'Short code is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    // Validate email if provided
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }
    
    // Validate URL if provided
    if (formData.websiteUrl && !/^https?:\/\/.+/.test(formData.websiteUrl)) {
      newErrors.websiteUrl = 'Invalid URL format (must start with http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (onAdd) {
      onAdd(formData);
      console.log('Created authority:', formData);
    }
    
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      shortCode: '',
      type: 'Regulatory',
      description: '',
      websiteUrl: '',
      contactEmail: '',
      jurisdiction: 'India',
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Landmark size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-h3 font-bold text-[var(--foreground)]">Add Authority</h2>
              <p className="text-p3 text-[var(--foreground-muted)] mt-0.5">
                Add a new regulatory authority or standards body
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
            {/* Name and Short Code */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Authority Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Reserve Bank of India"
                  className={clsx(
                    'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2',
                    errors.name ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)] focus:ring-indigo-500'
                  )}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Short Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.shortCode}
                  onChange={(e) => setFormData({ ...formData, shortCode: e.target.value.toUpperCase() })}
                  placeholder="e.g., RBI"
                  className={clsx(
                    'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 uppercase',
                    errors.shortCode ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)] focus:ring-indigo-500'
                  )}
                />
                {errors.shortCode && <p className="text-xs text-red-500 mt-1">{errors.shortCode}</p>}
              </div>
            </div>

            {/* Type and Jurisdiction */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Authority Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {authorityTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Jurisdiction
                </label>
                <select
                  value={formData.jurisdiction}
                  onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {jurisdictions.map(jurisdiction => (
                    <option key={jurisdiction} value={jurisdiction}>{jurisdiction}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the authority's role, scope, and regulatory focus..."
                rows={3}
                className={clsx(
                  'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 resize-none',
                  errors.description ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)] focus:ring-indigo-500'
                )}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            {/* Website URL */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Website URL
              </label>
              <input
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://www.example.com"
                className={clsx(
                  'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2',
                  errors.websiteUrl ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)] focus:ring-indigo-500'
                )}
              />
              {errors.websiteUrl && <p className="text-xs text-red-500 mt-1">{errors.websiteUrl}</p>}
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="contact@example.com"
                className={clsx(
                  'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2',
                  errors.contactEmail ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)] focus:ring-indigo-500'
                )}
              />
              {errors.contactEmail && <p className="text-xs text-red-500 mt-1">{errors.contactEmail}</p>}
            </div>

            {/* Info Box */}
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg flex gap-3">
              <AlertCircle size={20} className="text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-indigo-900">Authority Information</p>
                <p className="text-xs text-indigo-700 mt-1">
                  This authority will be available for linking to programs, requirements, and obligations. 
                  You can add frameworks and regulations under this authority later.
                </p>
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
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm hover:shadow-md"
          >
            <Save size={16} />
            Create Authority
          </button>
        </div>
      </div>
    </div>
  );
}
