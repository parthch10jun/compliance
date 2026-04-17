'use client';

import { useState } from 'react';
import { Save, Check } from 'lucide-react';

interface NotificationPreferences {
  email: {
    riskAssigned: boolean;
    toleranceExceeded: boolean;
    treatmentDeadline: boolean;
    statusChanges: boolean;
    reviewDue: boolean;
  };
  inApp: {
    allAlerts: boolean;
    criticalOnly: boolean;
  };
  frequency: 'immediate' | 'daily' | 'weekly';
}

export default function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: {
      riskAssigned: true,
      toleranceExceeded: true,
      treatmentDeadline: true,
      statusChanges: false,
      reviewDue: true,
    },
    inApp: {
      allAlerts: true,
      criticalOnly: false,
    },
    frequency: 'immediate',
  });

  const [saved, setSaved] = useState(false);

  const handleToggle = (category: 'email' | 'inApp', key: string) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key as keyof typeof prev.email],
      },
    }));
    setSaved(false);
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl">
      <div className="bg-white border border-[var(--border)] rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Email Notifications</h2>
        <p className="text-sm text-[var(--foreground-muted)] mb-6">
          Choose which events trigger email notifications
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
            <div>
              <div className="text-sm font-medium text-[var(--foreground)]">Risk assigned to me</div>
              <div className="text-xs text-[var(--foreground-muted)]">When a new risk is assigned to you as owner</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.email.riskAssigned}
                onChange={() => handleToggle('email', 'riskAssigned')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
            <div>
              <div className="text-sm font-medium text-[var(--foreground)]">Risk exceeds tolerance</div>
              <div className="text-xs text-[var(--foreground-muted)]">When a risk rating goes above tolerance threshold</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.email.toleranceExceeded}
                onChange={() => handleToggle('email', 'toleranceExceeded')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
            <div>
              <div className="text-sm font-medium text-[var(--foreground)]">Treatment deadline approaching</div>
              <div className="text-xs text-[var(--foreground-muted)]">7 days before treatment is due</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.email.treatmentDeadline}
                onChange={() => handleToggle('email', 'treatmentDeadline')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
            <div>
              <div className="text-sm font-medium text-[var(--foreground)]">Review due</div>
              <div className="text-xs text-[var(--foreground-muted)]">When a risk review date is approaching</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.email.reviewDue}
                onChange={() => handleToggle('email', 'reviewDue')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <div className="text-sm font-medium text-[var(--foreground)]">Status changes</div>
              <div className="text-xs text-[var(--foreground-muted)]">When risk status is updated</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.email.statusChanges}
                onChange={() => handleToggle('email', 'statusChanges')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* In-App Notifications */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">In-App Notifications</h2>
        <p className="text-sm text-[var(--foreground-muted)] mb-6">
          Control what appears in your notification center
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
            <div>
              <div className="text-sm font-medium text-[var(--foreground)]">All alerts</div>
              <div className="text-xs text-[var(--foreground-muted)]">Show all risk management activities</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.inApp.allAlerts}
                onChange={() => handleToggle('inApp', 'allAlerts')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3">
        {saved && (
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <Check size={16} />
            Settings saved successfully
          </div>
        )}
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium"
        >
          <Save size={18} />
          Save Preferences
        </button>
      </div>
    </div>
  );
}
