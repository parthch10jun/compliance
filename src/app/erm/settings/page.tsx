'use client';

import { useState } from 'react';
import { Settings, Save, Check, X } from 'lucide-react';
import clsx from 'clsx';
import { mandatoryFieldConfigs, AUTO_SAVE_CONFIG, type MandatoryFieldConfig } from '@/lib/data/validation';

export default function SettingsPage() {
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(AUTO_SAVE_CONFIG.enabled);
  const [autoSaveInterval, setAutoSaveInterval] = useState(AUTO_SAVE_CONFIG.interval);
  const [showNotifications, setShowNotifications] = useState(AUTO_SAVE_CONFIG.showNotification);
  const [selectedEntity, setSelectedEntity] = useState<MandatoryFieldConfig['entityType']>('Risk');

  const [fieldConfigs, setFieldConfigs] = useState(mandatoryFieldConfigs);

  const selectedConfig = fieldConfigs.find(c => c.entityType === selectedEntity);

  const toggleFieldMandatory = (fieldName: string) => {
    setFieldConfigs(prev => prev.map(config => {
      if (config.entityType === selectedEntity) {
        return {
          ...config,
          fields: config.fields.map(field => 
            field.fieldName === fieldName
              ? { ...field, isMandatory: !field.isMandatory }
              : field
          )
        };
      }
      return config;
    }));
  };

  const handleSave = () => {
    console.log('Settings saved:', {
      autoSave: { enabled: autoSaveEnabled, interval: autoSaveInterval, showNotifications },
      mandatoryFields: fieldConfigs
    });
    alert('Settings saved successfully!');
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Settings size={24} className="text-[var(--primary)]" />
            <h1 className="text-h2 font-bold text-[var(--foreground)]">System Settings</h1>
          </div>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium"
          >
            <Save size={18} />
            Save Settings
          </button>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Configure auto-save, mandatory fields, and validation rules
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Auto-Save Settings */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Auto-Save Settings</h2>
            <p className="text-sm text-[var(--foreground-muted)] mb-6">
              Configure automatic saving for forms and data entry
            </p>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[var(--foreground)]">Enable Auto-Save</div>
                  <div className="text-sm text-[var(--foreground-muted)]">Automatically save changes</div>
                </div>
                <button
                  onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                  className={clsx(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    autoSaveEnabled ? 'bg-[var(--primary)]' : 'bg-gray-300'
                  )}
                >
                  <span
                    className={clsx(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      autoSaveEnabled ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Auto-Save Interval (seconds)
                </label>
                <input
                  type="number"
                  value={autoSaveInterval}
                  onChange={(e) => setAutoSaveInterval(parseInt(e.target.value) || 30)}
                  min="10"
                  max="300"
                  disabled={!autoSaveEnabled}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-[var(--foreground-muted)] mt-1">
                  Recommended: 30-60 seconds
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[var(--foreground)]">Show Notifications</div>
                  <div className="text-sm text-[var(--foreground-muted)]">Display save confirmations</div>
                </div>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={clsx(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    showNotifications ? 'bg-[var(--primary)]' : 'bg-gray-300'
                  )}
                  disabled={!autoSaveEnabled}
                >
                  <span
                    className={clsx(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      showNotifications ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Auto-Save Features</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Saves changes at regular intervals</li>
                <li>• Prevents data loss</li>
                <li>• Warns before leaving with unsaved changes</li>
                <li>• Works across all forms and data entry</li>
              </ul>
            </div>
          </div>

          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Current Status</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--foreground-muted)]">Auto-Save:</span>
                <span className={clsx(
                  'px-2 py-1 text-xs font-medium rounded',
                  autoSaveEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                )}>
                  {autoSaveEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--foreground-muted)]">Interval:</span>
                <span className="text-sm font-medium">{autoSaveInterval}s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--foreground-muted)]">Notifications:</span>
                <span className={clsx(
                  'px-2 py-1 text-xs font-medium rounded',
                  showNotifications ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                )}>
                  {showNotifications ? 'On' : 'Off'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Mandatory Fields Configuration */}
        <div className="col-span-2 bg-white border border-[var(--border)] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Mandatory Fields Configuration</h2>
          <p className="text-sm text-[var(--foreground-muted)] mb-6">
            Configure which fields are required for each entity type
          </p>

          {/* Entity Type Selector */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm font-medium text-[var(--foreground-muted)]">Configure fields for:</span>
            {mandatoryFieldConfigs.map(config => (
              <button
                key={config.entityType}
                onClick={() => setSelectedEntity(config.entityType)}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  selectedEntity === config.entityType
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-gray-100 text-[var(--foreground-muted)] hover:bg-gray-200'
                )}
              >
                {config.entityType}
              </button>
            ))}
          </div>

          {/* Fields Table */}
          {selectedConfig && (
            <div className="border border-[var(--border)] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-[var(--border)]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Field Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Validation Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Error Message</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-[var(--foreground)]">Mandatory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {selectedConfig.fields.map(field => (
                    <tr key={field.fieldName} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-[var(--foreground)]">{field.displayName}</div>
                        <div className="text-xs text-[var(--foreground-muted)]">{field.fieldName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-700">
                          {field.validationType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[var(--foreground-muted)]">{field.errorMessage || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleFieldMandatory(field.fieldName)}
                          className={clsx(
                            'p-1 rounded transition-colors',
                            field.isMandatory 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          )}
                        >
                          {field.isMandatory ? <Check size={20} /> : <X size={20} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Summary */}
          {selectedConfig && (
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="text-sm font-semibold text-orange-900 mb-2">Configuration Summary</h4>
              <div className="text-sm text-orange-800">
                <strong>{selectedConfig.fields.filter(f => f.isMandatory).length}</strong> mandatory fields out of <strong>{selectedConfig.fields.length}</strong> total fields for <strong>{selectedEntity}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
