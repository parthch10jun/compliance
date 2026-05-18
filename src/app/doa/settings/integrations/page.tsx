'use client';

import React from 'react';
import Link from 'next/link';
import { Link as LinkIcon, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function IntegrationSettings() {
  const integrations = [
    {
      name: 'SAP ERP',
      description: 'Sync purchase orders and vendor data',
      status: 'connected',
      lastSync: '2026-05-13T14:30:00Z',
    },
    {
      name: 'Workday HCM',
      description: 'Import employee data and org structure',
      status: 'connected',
      lastSync: '2026-05-13T12:00:00Z',
    },
    {
      name: 'Slack',
      description: 'Send approval notifications to Slack channels',
      status: 'connected',
      lastSync: 'Real-time',
    },
    {
      name: 'Microsoft Teams',
      description: 'Enable Teams integration for approvals',
      status: 'disconnected',
      lastSync: null,
    },
    {
      name: 'NetSuite',
      description: 'Financial data synchronization',
      status: 'disconnected',
      lastSync: null,
    },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-semibold text-gray-900">Integration Settings</h1>
        <p className="text-p2 text-gray-600 mt-1">
          Manage external system integrations and data synchronization
        </p>
      </div>
      
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <Link href="/doa/settings" className="pb-4 border-b-2 border-transparent text-gray-600 hover:text-gray-900">
            General
          </Link>
          <Link href="/doa/settings/notifications" className="pb-4 border-b-2 border-transparent text-gray-600 hover:text-gray-900">
            Notifications
          </Link>
          <Link href="/doa/settings/integrations" className="pb-4 border-b-2 border-[#F59E0B] text-[#F59E0B] font-medium">
            Integrations
          </Link>
        </nav>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-p3 text-gray-600">Active Integrations</div>
          <div className="text-h2 font-bold text-gray-900 mt-1">
            {integrations.filter(i => i.status === 'connected').length}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-p3 text-gray-600">Available Integrations</div>
          <div className="text-h2 font-bold text-gray-900 mt-1">{integrations.length}</div>
        </div>
      </div>
      
      <div className="space-y-3">
        {integrations.map((integration) => (
          <div key={integration.name} className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-3 rounded-lg ${
                  integration.status === 'connected' ? 'bg-green-50' : 'bg-gray-50'
                }`}>
                  <LinkIcon className={`w-6 h-6 ${
                    integration.status === 'connected' ? 'text-green-600' : 'text-gray-400'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-h4 font-semibold text-gray-900">{integration.name}</h3>
                    {integration.status === 'connected' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3" />
                        Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <XCircle className="w-3 h-3" />
                        Disconnected
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{integration.description}</p>
                  
                  {integration.status === 'connected' && integration.lastSync && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <RefreshCw className="w-4 h-4" />
                      <span>
                        Last sync: {integration.lastSync === 'Real-time' ? 'Real-time' : 
                          new Date(integration.lastSync).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                {integration.status === 'connected' ? (
                  <>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-sm">
                      Configure
                    </button>
                    <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm">
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors text-sm font-medium">
                    Connect
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <LinkIcon className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Need a Custom Integration?</h3>
            <p className="text-sm text-blue-700 mt-1">
              Contact your system administrator to set up additional integrations or custom connectors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
