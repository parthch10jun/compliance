'use client';

import { useState } from 'react';
import { X, Settings, Bell, Calendar, Save } from 'lucide-react';
import { FrequencyType } from '@/lib/types/program-specifications';

interface WorkflowConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflowType: 'assessment' | 'testing';
  currentConfig: {
    frequency: FrequencyType;
    notificationDays: number;
    automationEnabled: boolean;
  };
  onSave: (config: {
    frequency: FrequencyType;
    notificationDays: number;
    automationEnabled: boolean;
  }) => void;
}

export default function WorkflowConfigModal({
  isOpen,
  onClose,
  workflowType,
  currentConfig,
  onSave,
}: WorkflowConfigModalProps) {
  const [frequency, setFrequency] = useState<FrequencyType>(currentConfig.frequency);
  const [notificationDays, setNotificationDays] = useState(currentConfig.notificationDays);
  const [automationEnabled, setAutomationEnabled] = useState(currentConfig.automationEnabled);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ frequency, notificationDays, automationEnabled });
    onClose();
  };

  const frequencies: FrequencyType[] = ['Weekly', 'Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'Ad-hoc'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Settings className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-h2 font-bold text-[var(--foreground)]">
                  {workflowType === 'assessment' ? 'Assessment Lifecycle' : 'Control Testing'} Configuration
                </h2>
                <p className="text-p3 text-[var(--foreground-muted)]">Configure workflow settings and automation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Frequency */}
          <div>
            <label className="flex items-center gap-2 text-p2 font-semibold text-[var(--foreground)] mb-3">
              <Calendar size={18} className="text-cyan-600" />
              Workflow Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as FrequencyType)}
              className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-p2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {frequencies.map((freq) => (
                <option key={freq} value={freq}>{freq}</option>
              ))}
            </select>
            <p className="text-p3 text-[var(--foreground-muted)] mt-2">
              How often should this workflow be executed?
            </p>
          </div>

          {/* Notification Days */}
          <div>
            <label className="flex items-center gap-2 text-p2 font-semibold text-[var(--foreground)] mb-3">
              <Bell size={18} className="text-cyan-600" />
              Notification Lead Time
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="90"
                value={notificationDays}
                onChange={(e) => setNotificationDays(parseInt(e.target.value))}
                className="w-24 px-4 py-2.5 border border-[var(--border)] rounded-lg text-p2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <span className="text-p2 text-[var(--foreground)]">days before due date</span>
            </div>
            <p className="text-p3 text-[var(--foreground-muted)] mt-2">
              Send notifications this many days before the workflow is due
            </p>
          </div>

          {/* Automation */}
          <div className="p-4 bg-[var(--background-secondary)] rounded-lg">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="automation"
                checked={automationEnabled}
                onChange={(e) => setAutomationEnabled(e.target.checked)}
                className="mt-1 w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              <div className="flex-1">
                <label htmlFor="automation" className="text-p2 font-semibold text-[var(--foreground)] cursor-pointer">
                  Enable Workflow Automation
                </label>
                <p className="text-p3 text-[var(--foreground-muted)] mt-1">
                  Automatically create new workflow instances based on the frequency schedule and send notifications to assigned team members
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-p3 text-blue-800">
              <strong>Note:</strong> Changes to the frequency will affect the next scheduled workflow. Current in-progress workflows will not be affected.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--border)] bg-[var(--background-secondary)]">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-p2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-700 hover:to-blue-700 transition-all flex items-center gap-2"
            >
              <Save size={16} />
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

