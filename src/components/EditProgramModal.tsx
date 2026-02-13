'use client';

import { useState, useEffect } from 'react';
import { X, Edit, Save, Link2, Unlink, Plus, Trash2, Search, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

interface EditProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  program?: {
    id: string;
    name: string;
    description: string;
    owner: string;
    department: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    tags: string[];
    frameworks?: Array<{ id: string; name: string; authority: string }>;
    requirements?: Array<{ id: string; code: string; title: string }>;
    obligations?: Array<{ id: string; code: string; title: string }>;
    controls?: Array<{ id: string; code: string; name: string }>;
  };
  onSave?: (program: any) => void;
}

type TabType = 'details' | 'frameworks' | 'requirements' | 'obligations' | 'controls';

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

export function EditProgramModal({ isOpen, onClose, program, onSave }: EditProgramModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner: '',
    department: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
    tags: [] as string[],
    frameworks: [] as Array<{ id: string; name: string; authority: string }>,
    requirements: [] as Array<{ id: string; code: string; title: string }>,
    obligations: [] as Array<{ id: string; code: string; title: string }>,
    controls: [] as Array<{ id: string; code: string; name: string }>,
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (program && isOpen) {
      setFormData({
        name: program.name,
        description: program.description,
        owner: program.owner,
        department: program.department,
        priority: program.priority,
        tags: program.tags || [],
        frameworks: program.frameworks || [],
        requirements: program.requirements || [],
        obligations: program.obligations || [],
        controls: program.controls || [],
      });
    }
  }, [program, isOpen]);

  if (!isOpen || !program) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Program name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.owner.trim()) newErrors.owner = 'Owner is required';
    if (!formData.department) newErrors.department = 'Department is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (onSave) {
      onSave({ id: program.id, ...formData });
      console.log('Updated program:', { id: program.id, ...formData });
    }
    
    handleClose();
  };

  const handleClose = () => {
    setErrors({});
    setSearchQuery('');
    setActiveTab('details');
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

  const removeFramework = (id: string) => {
    setFormData({ ...formData, frameworks: formData.frameworks.filter(f => f.id !== id) });
  };

  const removeRequirement = (id: string) => {
    setFormData({ ...formData, requirements: formData.requirements.filter(r => r.id !== id) });
  };

  const removeObligation = (id: string) => {
    setFormData({ ...formData, obligations: formData.obligations.filter(o => o.id !== id) });
  };

  const removeControl = (id: string) => {
    setFormData({ ...formData, controls: formData.controls.filter(c => c.id !== id) });
  };

  const tabs = [
    { id: 'details' as TabType, label: 'Program Details', count: null },
    { id: 'frameworks' as TabType, label: 'Frameworks', count: formData.frameworks.length },
    { id: 'requirements' as TabType, label: 'Requirements', count: formData.requirements.length },
    { id: 'obligations' as TabType, label: 'Obligations', count: formData.obligations.length },
    { id: 'controls' as TabType, label: 'Controls', count: formData.controls.length },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-gradient-to-r from-violet-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center">
              <Edit size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-h3 font-bold text-[var(--foreground)]">Edit Program</h2>
              <p className="text-p3 text-[var(--foreground-muted)] mt-0.5">{program.name}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X size={20} className="text-[var(--foreground-muted)]" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
          <div className="flex gap-1 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'px-4 py-3 text-sm font-medium transition-all relative',
                  activeTab === tab.id
                    ? 'text-violet-600 border-b-2 border-violet-600'
                    : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                )}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className={clsx(
                    'ml-2 px-2 py-0.5 rounded-full text-xs',
                    activeTab === tab.id
                      ? 'bg-violet-100 text-violet-700'
                      : 'bg-gray-100 text-gray-600'
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-5">
              {/* Program Name */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Program Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  rows={3}
                  className={clsx(
                    'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 resize-none',
                    errors.description ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)] focus:ring-violet-500'
                  )}
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>

              {/* Owner and Department */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                    Owner <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    className={clsx(
                      'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2',
                      errors.owner ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)] focus:ring-violet-500'
                    )}
                  />
                  {errors.owner && <p className="text-xs text-red-500 mt-1">{errors.owner}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className={clsx(
                      'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2',
                      errors.department ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)] focus:ring-violet-500'
                    )}
                  >
                    <option value="">Select department</option>
                    {departmentOptions.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department}</p>}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Priority
                </label>
                <div className="flex gap-2">
                  {priorityOptions.map(priority => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority })}
                      className={clsx(
                        'flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                        formData.priority === priority
                          ? 'bg-violet-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      {priority}
                    </button>
                  ))}
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
                    placeholder="Add a tag..."
                    className="flex-1 px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2.5 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium"
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
          )}

          {/* Frameworks Tab */}
          {activeTab === 'frameworks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--foreground-muted)]">
                  Manage frameworks linked to this program
                </p>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition-colors text-sm font-medium"
                >
                  <Plus size={16} />
                  Link Framework
                </button>
              </div>

              {formData.frameworks.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <Link2 size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-sm font-medium text-gray-600">No frameworks linked</p>
                  <p className="text-xs text-gray-500 mt-1">Click "Link Framework" to add frameworks</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.frameworks.map(framework => (
                    <div
                      key={framework.id}
                      className="flex items-center justify-between p-4 bg-white border border-[var(--border)] rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div>
                        <p className="font-medium text-sm text-[var(--foreground)]">{framework.name}</p>
                        <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{framework.authority}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFramework(framework.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Unlink framework"
                      >
                        <Unlink size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Requirements Tab */}
          {activeTab === 'requirements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-[var(--foreground-muted)]">
                    Manage requirements linked to this program
                  </p>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium"
                >
                  <Plus size={16} />
                  Add Requirement
                </button>
              </div>

              {/* Search */}
              {formData.requirements.length > 0 && (
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search requirements..."
                    className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              )}

              {formData.requirements.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <CheckCircle2 size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-sm font-medium text-gray-600">No requirements linked</p>
                  <p className="text-xs text-gray-500 mt-1">Click "Add Requirement" to link requirements</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {formData.requirements
                    .filter(req =>
                      req.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      req.title.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(requirement => (
                      <div
                        key={requirement.id}
                        className="flex items-center justify-between p-4 bg-white border border-[var(--border)] rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div>
                          <p className="font-medium text-sm text-[var(--foreground)]">{requirement.code}</p>
                          <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{requirement.title}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeRequirement(requirement.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove requirement"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Obligations Tab */}
          {activeTab === 'obligations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--foreground-muted)]">
                  Manage obligations linked to this program
                </p>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium"
                >
                  <Plus size={16} />
                  Add Obligation
                </button>
              </div>

              {/* Search */}
              {formData.obligations.length > 0 && (
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search obligations..."
                    className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              )}

              {formData.obligations.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <CheckCircle2 size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-sm font-medium text-gray-600">No obligations linked</p>
                  <p className="text-xs text-gray-500 mt-1">Click "Add Obligation" to link obligations</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {formData.obligations
                    .filter(obl =>
                      obl.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      obl.title.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(obligation => (
                      <div
                        key={obligation.id}
                        className="flex items-center justify-between p-4 bg-white border border-[var(--border)] rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div>
                          <p className="font-medium text-sm text-[var(--foreground)]">{obligation.code}</p>
                          <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{obligation.title}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeObligation(obligation.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove obligation"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Controls Tab */}
          {activeTab === 'controls' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--foreground-muted)]">
                  Manage controls linked to this program
                </p>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  <Plus size={16} />
                  Add Control
                </button>
              </div>

              {/* Search */}
              {formData.controls.length > 0 && (
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search controls..."
                    className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              )}

              {formData.controls.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <CheckCircle2 size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-sm font-medium text-gray-600">No controls linked</p>
                  <p className="text-xs text-gray-500 mt-1">Click "Add Control" to link controls</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {formData.controls
                    .filter(ctrl =>
                      ctrl.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      ctrl.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(control => (
                      <div
                        key={control.id}
                        className="flex items-center justify-between p-4 bg-white border border-[var(--border)] rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div>
                          <p className="font-medium text-sm text-[var(--foreground)]">{control.code}</p>
                          <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{control.name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeControl(control.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove control"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--border)] bg-[var(--background-secondary)] flex justify-between items-center">
          <div className="text-sm text-[var(--foreground-muted)]">
            {activeTab !== 'details' && (
              <span>
                {activeTab === 'frameworks' && `${formData.frameworks.length} framework(s)`}
                {activeTab === 'requirements' && `${formData.requirements.length} requirement(s)`}
                {activeTab === 'obligations' && `${formData.obligations.length} obligation(s)`}
                {activeTab === 'controls' && `${formData.controls.length} control(s)`}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 text-sm font-medium text-[var(--foreground-muted)] hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm hover:shadow-md"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

