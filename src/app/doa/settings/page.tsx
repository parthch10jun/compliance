'use client';

/**
 * DoA Settings - General
 * General configuration settings for the DoA module
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { Settings as SettingsIcon, Save, Bell, Link as LinkIcon } from 'lucide-react';

export default function DoASettings() {
  const [settings, setSettings] = useState({
    defaultCurrency: 'USD',
    fiscalYearStart: '01',
    approvalTimeout: '72',
    enableNotifications: true,
    enableAuditLog: true,
    requireJustification: true,
    autoArchiveDays: '365',
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved! (Demo mode)');
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-semibold text-gray-900">Settings</h1>
          <p className="text-p2 text-gray-600 mt-1">
            Configure general settings for the Delegation of Authority module
          </p>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <Link
            href="/doa/settings"
            className="pb-4 border-b-2 border-[#F59E0B] text-[#F59E0B] font-medium"
          >
            General
          </Link>
          <Link
            href="/doa/settings/notifications"
            className="pb-4 border-b-2 border-transparent text-gray-600 hover:text-gray-900"
          >
            Notifications
          </Link>
          <Link
            href="/doa/settings/integrations"
            className="pb-4 border-b-2 border-transparent text-gray-600 hover:text-gray-900"
          >
            Integrations
          </Link>
        </nav>
      </div>
      
      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-h3 font-semibold text-gray-900 mb-6">General Configuration</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Default Currency
                </label>
                <select
                  value={settings.defaultCurrency}
                  onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                  <option>JPY</option>
                  <option>CNY</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Fiscal Year Start (Month)
                </label>
                <select
                  value={settings.fiscalYearStart}
                  onChange={(e) => setSettings({ ...settings, fiscalYearStart: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                      {new Date(2000, i, 1).toLocaleDateString('en-US', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Default Approval Timeout (hours)
              </label>
              <input
                type="number"
                value={settings.approvalTimeout}
                onChange={(e) => setSettings({ ...settings, approvalTimeout: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                min="1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Approvals will escalate after this many hours of inactivity
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Auto-Archive Completed Records (days)
              </label>
              <input
                type="number"
                value={settings.autoArchiveDays}
                onChange={(e) => setSettings({ ...settings, autoArchiveDays: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                min="30"
              />
              <p className="text-sm text-gray-500 mt-1">
                Completed approvals and closed conflicts will be archived after this period
              </p>
            </div>
          </div>
        </div>
        
        {/* Feature Toggles */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-h3 font-semibold text-gray-900 mb-6">Feature Configuration</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Enable Notifications</div>
                <p className="text-sm text-gray-600 mt-1">Send email and in-app notifications for approvals</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59E0B]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Enable Audit Logging</div>
                <p className="text-sm text-gray-600 mt-1">Log all authority actions for compliance</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableAuditLog}
                  onChange={(e) => setSettings({ ...settings, enableAuditLog: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59E0B]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Require Justification</div>
                <p className="text-sm text-gray-600 mt-1">Mandate justification comments for all approvals</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requireJustification}
                  onChange={(e) => setSettings({ ...settings, requireJustification: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59E0B]"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            Reset to Defaults
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium"
          >
            <Save className="w-5 h-5" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
