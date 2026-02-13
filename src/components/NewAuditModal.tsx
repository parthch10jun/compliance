'use client';

import { useState } from 'react';
import { X, Calendar, Users, FileText, Target, Shield } from 'lucide-react';
import { programs } from '@/lib/data/mock-data';

interface NewAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (auditData: any) => void;
}

export default function NewAuditModal({ isOpen, onClose, onSubmit }: NewAuditModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    programId: '',
    auditType: 'Compliance Audit' as const,
    scope: '',
    objectives: '',
    plannedStartDate: '',
    plannedEndDate: '',
    leadAuditor: '',
    auditTeam: '',
    auditee: '',
    department: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedProgram = programs.find(p => p.id === formData.programId);
    
    const auditData = {
      ...formData,
      id: `audit-${Date.now()}`,
      programName: selectedProgram?.name || '',
      framework: selectedProgram?.tags[0] || '',
      status: 'Planning' as const,
      objectives: formData.objectives.split('\n').filter(o => o.trim()),
      auditTeam: formData.auditTeam.split(',').map(m => m.trim()).filter(m => m),
      requirementsInScope: 0,
      requirementsTested: 0,
      controlsInScope: 0,
      controlsTested: 0,
      totalFindings: 0,
      criticalFindings: 0,
      highFindings: 0,
      mediumFindings: 0,
      lowFindings: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    onSubmit(auditData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create New Audit</h2>
              <p className="text-sm text-gray-600">Set up a new internal audit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={16} className="text-blue-600" />
              Basic Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Audit Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Q1 2024 RBI Compliance Audit"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of the audit purpose and scope"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program *
                </label>
                <select
                  required
                  value={formData.programId}
                  onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a program</option>
                  {programs.map(program => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Audit Type *
                </label>
                <select
                  required
                  value={formData.auditType}
                  onChange={(e) => setFormData({ ...formData, auditType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Compliance Audit">Compliance Audit</option>
                  <option value="Control Testing">Control Testing</option>
                  <option value="Gap Analysis">Gap Analysis</option>
                  <option value="Risk Assessment">Risk Assessment</option>
                  <option value="Process Review">Process Review</option>
                </select>
              </div>
            </div>
          </div>

          {/* Scope & Objectives */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Target size={16} className="text-blue-600" />
              Scope & Objectives
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scope *
              </label>
              <textarea
                required
                value={formData.scope}
                onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Define what will be covered in this audit"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objectives (one per line)
              </label>
              <textarea
                value={formData.objectives}
                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Verify compliance with RBI guidelines&#10;Test effectiveness of controls&#10;Identify gaps in implementation"
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Calendar size={16} className="text-blue-600" />
              Timeline
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Planned Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.plannedStartDate}
                  onChange={(e) => setFormData({ ...formData, plannedStartDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Planned End Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.plannedEndDate}
                  onChange={(e) => setFormData({ ...formData, plannedEndDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Users size={16} className="text-blue-600" />
              Audit Team
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lead Auditor *
                </label>
                <input
                  type="text"
                  required
                  value={formData.leadAuditor}
                  onChange={(e) => setFormData({ ...formData, leadAuditor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Rajesh Kumar"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auditee *
                </label>
                <input
                  type="text"
                  required
                  value={formData.auditee}
                  onChange={(e) => setFormData({ ...formData, auditee: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Compliance Department"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Members (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.auditTeam}
                  onChange={(e) => setFormData({ ...formData, auditTeam: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Priya Sharma, Amit Patel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Risk & Compliance"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Shield size={18} />
              Create Audit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

