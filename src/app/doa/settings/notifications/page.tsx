'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Save, Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    emailApprovalRequests: true,
    emailApprovalActions: true,
    emailDelegations: true,
    emailSoDConflicts: true,
    emailExceptions: false,
    inAppApprovalRequests: true,
    inAppApprovalActions: true,
    inAppDelegations: true,
    inAppSoDConflicts: true,
    slackApprovalRequests: false,
    slackSoDConflicts: true,
    digestFrequency: 'daily',
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Notification settings saved! (Demo mode)');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-semibold text-gray-900">Notification Settings</h1>
        <p className="text-p2 text-gray-600 mt-1">
          Configure how and when you receive notifications
        </p>
      </div>
      
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <Link href="/doa/settings" className="pb-4 border-b-2 border-transparent text-gray-600 hover:text-gray-900">
            General
          </Link>
          <Link href="/doa/settings/notifications" className="pb-4 border-b-2 border-[#F59E0B] text-[#F59E0B] font-medium">
            Notifications
          </Link>
          <Link href="/doa/settings/integrations" className="pb-4 border-b-2 border-transparent text-gray-600 hover:text-gray-900">
            Integrations
          </Link>
        </nav>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Notifications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Mail className="w-5 h-5 text-[#F59E0B]" />
            <h2 className="text-h3 font-semibold text-gray-900">Email Notifications</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: 'emailApprovalRequests', label: 'Approval Requests', desc: 'When you receive a new approval request' },
              { key: 'emailApprovalActions', label: 'Approval Actions', desc: 'When someone approves/rejects your request' },
              { key: 'emailDelegations', label: 'Delegations', desc: 'When authority is delegated to/from you' },
              { key: 'emailSoDConflicts', label: 'SoD Conflicts', desc: 'When new SoD conflicts are detected' },
              { key: 'emailExceptions', label: 'Exceptions', desc: 'When exception requests need your review' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{label}</div>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications[key as keyof typeof notifications] as boolean}
                  onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                  className="w-4 h-4 text-[#F59E0B] border-gray-300 rounded focus:ring-[#F59E0B]"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* In-App Notifications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-[#F59E0B]" />
            <h2 className="text-h3 font-semibold text-gray-900">In-App Notifications</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: 'inAppApprovalRequests', label: 'Approval Requests' },
              { key: 'inAppApprovalActions', label: 'Approval Actions' },
              { key: 'inAppDelegations', label: 'Delegations' },
              { key: 'inAppSoDConflicts', label: 'SoD Conflicts' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900">{label}</div>
                <input
                  type="checkbox"
                  checked={notifications[key as keyof typeof notifications] as boolean}
                  onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                  className="w-4 h-4 text-[#F59E0B] border-gray-300 rounded focus:ring-[#F59E0B]"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Slack Integration */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-[#F59E0B]" />
            <h2 className="text-h3 font-semibold text-gray-900">Slack Notifications</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: 'slackApprovalRequests', label: 'Approval Requests' },
              { key: 'slackSoDConflicts', label: 'SoD Conflicts' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900">{label}</div>
                <input
                  type="checkbox"
                  checked={notifications[key as keyof typeof notifications] as boolean}
                  onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                  className="w-4 h-4 text-[#F59E0B] border-gray-300 rounded focus:ring-[#F59E0B]"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Digest Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-h3 font-semibold text-gray-900 mb-4">Email Digest</h2>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Digest Frequency</label>
            <select
              value={notifications.digestFrequency}
              onChange={(e) => setNotifications({ ...notifications, digestFrequency: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
            >
              <option value="realtime">Real-time (no digest)</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium"
          >
            <Save className="w-5 h-5" />
            Save Notification Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
