'use client';

import { useState } from 'react';
import { X, FlaskConical, Calendar, User, FileText, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

interface AddTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  controlId?: string;
  controlName?: string;
  onAdd?: (test: { name: string; procedure: string; frequency: string }) => void;
}

export function AddTestModal({ isOpen, onClose, controlId, controlName, onAdd }: AddTestModalProps) {
  const [testData, setTestData] = useState({
    name: '',
    procedure: '',
    frequency: 'Monthly',
    type: 'Manual',
    assignee: '',
    expectedResult: '',
    passCriteria: '',
  });

  if (!isOpen) return null;

  const frequencies = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'On-Demand'];
  const testTypes = ['Manual', 'Automated', 'Hybrid'];

  const handleSubmit = () => {
    if (onAdd && testData.name) {
      onAdd({
        name: testData.name,
        procedure: testData.procedure,
        frequency: testData.frequency,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border)] bg-gradient-to-r from-indigo-50 to-violet-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center">
                <FlaskConical size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">Add Test</h2>
                <p className="text-sm text-[var(--foreground-muted)] mt-0.5">
                  {controlName ? `Create test for "${controlName}"` : 'Create a new test'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-lg transition-colors">
              <X size={24} className="text-[var(--foreground-muted)]" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Test Name *</label>
            <input
              type="text"
              placeholder="e.g., MFA Configuration Verification"
              value={testData.name}
              onChange={(e) => setTestData({...testData, name: e.target.value})}
              className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Test Procedure *</label>
            <textarea
              rows={4}
              placeholder="Describe the steps to perform this test..."
              value={testData.procedure}
              onChange={(e) => setTestData({...testData, procedure: e.target.value})}
              className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                <Calendar size={14} className="inline mr-1" />
                Frequency
              </label>
              <select
                value={testData.frequency}
                onChange={(e) => setTestData({...testData, frequency: e.target.value})}
                className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {frequencies.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                <FlaskConical size={14} className="inline mr-1" />
                Test Type
              </label>
              <select
                value={testData.type}
                onChange={(e) => setTestData({...testData, type: e.target.value})}
                className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {testTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              <User size={14} className="inline mr-1" />
              Assignee
            </label>
            <input
              type="text"
              placeholder="Who will perform this test?"
              value={testData.assignee}
              onChange={(e) => setTestData({...testData, assignee: e.target.value})}
              className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              <CheckCircle2 size={14} className="inline mr-1" />
              Pass Criteria
            </label>
            <input
              type="text"
              placeholder="What defines a passing result?"
              value={testData.passCriteria}
              onChange={(e) => setTestData({...testData, passCriteria: e.target.value})}
              className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--background-secondary)] flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-[var(--foreground-muted)]">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={!testData.name || !testData.procedure}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FlaskConical size={16} />
            Create Test
          </button>
        </div>
      </div>
    </div>
  );
}

