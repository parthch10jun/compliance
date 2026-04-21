'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plug, CheckCircle, XCircle, Settings, ExternalLink, 
  Database, Mail, Calendar, MessageSquare, FileText,
  ShieldCheck, BarChart3, GitBranch, Cloud, Webhook
} from 'lucide-react';
import clsx from 'clsx';

type IntegrationStatus = 'Active' | 'Inactive' | 'Available' | 'Coming Soon';
type IntegrationType = 'Authentication' | 'Communication' | 'Data' | 'Analytics' | 'Security' | 'Productivity' | 'GRC' | 'Developer';

interface Integration {
  id: string;
  name: string;
  description: string;
  type: IntegrationType;
  status: IntegrationStatus;
  icon: string;
  provider: string;
  features: string[];
  documentation?: string;
  setupTime?: string;
  lastSync?: string;
  version?: string;
}

const integrations: Integration[] = [
  // Authentication & Identity
  {
    id: 'azure-ad',
    name: 'Microsoft Azure AD',
    description: 'Enterprise identity and access management with single sign-on',
    type: 'Authentication',
    status: 'Active',
    icon: '🔐',
    provider: 'Microsoft',
    features: ['Single Sign-On (SSO)', 'Multi-factor Authentication', 'Role-based Access', 'User Provisioning'],
    documentation: 'https://docs.microsoft.com/azure/active-directory',
    setupTime: '30 minutes',
    lastSync: '2024-04-20T15:30:00',
    version: '2.0'
  },
  {
    id: 'okta',
    name: 'Okta',
    description: 'Identity and access management platform',
    type: 'Authentication',
    status: 'Available',
    icon: '🔑',
    provider: 'Okta',
    features: ['SSO', 'Universal Directory', 'Lifecycle Management', 'API Access Management'],
    documentation: 'https://developer.okta.com',
    setupTime: '45 minutes'
  },
  {
    id: 'auth0',
    name: 'Auth0',
    description: 'Flexible authentication and authorization platform',
    type: 'Authentication',
    status: 'Available',
    icon: '🛡️',
    provider: 'Auth0',
    features: ['SSO', 'Social Login', 'MFA', 'Passwordless Authentication'],
    documentation: 'https://auth0.com/docs',
    setupTime: '20 minutes'
  },

  // Communication & Collaboration
  {
    id: 'slack',
    name: 'Slack',
    description: 'Real-time notifications and collaboration for risk events',
    type: 'Communication',
    status: 'Active',
    icon: '💬',
    provider: 'Slack Technologies',
    features: ['Risk Alerts', 'Treatment Reminders', 'Approval Notifications', 'Custom Workflows'],
    documentation: 'https://api.slack.com',
    setupTime: '15 minutes',
    lastSync: '2024-04-20T16:00:00',
    version: '1.5'
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Collaborate on risks and treatments within Teams',
    type: 'Communication',
    status: 'Active',
    icon: '👥',
    provider: 'Microsoft',
    features: ['Channel Notifications', 'Bot Commands', 'Adaptive Cards', 'File Sharing'],
    documentation: 'https://docs.microsoft.com/microsoftteams',
    setupTime: '20 minutes',
    lastSync: '2024-04-20T14:45:00',
    version: '1.0'
  },
  {
    id: 'gmail',
    name: 'Gmail / Google Workspace',
    description: 'Send risk notifications and reports via Gmail',
    type: 'Communication',
    status: 'Active',
    icon: '📧',
    provider: 'Google',
    features: ['Email Notifications', 'Calendar Integration', 'Document Sharing', 'Automated Reports'],
    documentation: 'https://developers.google.com/workspace',
    setupTime: '25 minutes',
    lastSync: '2024-04-20T16:15:00',
    version: '2.1'
  },
  {
    id: 'outlook',
    name: 'Microsoft Outlook',
    description: 'Email notifications and calendar integration',
    type: 'Communication',
    status: 'Active',
    icon: '📮',
    provider: 'Microsoft',
    features: ['Email Alerts', 'Meeting Scheduling', 'Task Sync', 'Contact Management'],
    documentation: 'https://docs.microsoft.com/outlook',
    setupTime: '20 minutes',
    lastSync: '2024-04-20T15:00:00',
    version: '1.8'
  },

  // Data & Analytics
  {
    id: 'powerbi',
    name: 'Microsoft Power BI',
    description: 'Advanced risk analytics and interactive dashboards',
    type: 'Analytics',
    status: 'Active',
    icon: '📊',
    provider: 'Microsoft',
    features: ['Custom Dashboards', 'Risk Heatmaps', 'Trend Analysis', 'Executive Reports'],
    documentation: 'https://docs.microsoft.com/power-bi',
    setupTime: '40 minutes',
    lastSync: '2024-04-20T12:00:00',
    version: '3.0'
  },
  {
    id: 'tableau',
    name: 'Tableau',
    description: 'Visual analytics and business intelligence',
    type: 'Analytics',
    status: 'Available',
    icon: '📈',
    provider: 'Tableau Software',
    features: ['Data Visualization', 'Interactive Reports', 'Dashboard Embedding', 'Real-time Analytics'],
    documentation: 'https://help.tableau.com',
    setupTime: '45 minutes'
  },
  {
    id: 'excel',
    name: 'Microsoft Excel',
    description: 'Export risk data and import risk registers',
    type: 'Data',
    status: 'Active',
    icon: '📑',
    provider: 'Microsoft',
    features: ['Data Export', 'Bulk Import', 'Template Support', 'Pivot Table Integration'],
    documentation: 'https://support.microsoft.com/excel',
    setupTime: '10 minutes',
    lastSync: '2024-04-20T16:30:00',
    version: '1.0'
  },

  // GRC & Compliance
  {
    id: 'servicenow',
    name: 'ServiceNow GRC',
    description: 'Integrated governance, risk, and compliance platform',
    type: 'GRC',
    status: 'Available',
    icon: '🏢',
    provider: 'ServiceNow',
    features: ['Risk Sync', 'Incident Management', 'Audit Trail', 'Policy Management'],
    documentation: 'https://docs.servicenow.com',
    setupTime: '2 hours'
  },
  {
    id: 'archer',
    name: 'RSA Archer',
    description: 'Enterprise GRC platform integration',
    type: 'GRC',
    status: 'Coming Soon',
    icon: '🎯',
    provider: 'RSA Security',
    features: ['Risk Assessment Sync', 'Control Mapping', 'Compliance Reporting', 'Audit Management'],
    documentation: 'https://community.rsa.com',
    setupTime: '3 hours'
  },
  {
    id: 'metricstream',
    name: 'MetricStream',
    description: 'Connected GRC platform',
    type: 'GRC',
    status: 'Coming Soon',
    icon: '📐',
    provider: 'MetricStream',
    features: ['Risk Integration', 'Compliance Automation', 'Audit Integration', 'Policy Sync'],
    setupTime: '2.5 hours'
  },

  // Security & Monitoring
  {
    id: 'splunk',
    name: 'Splunk',
    description: 'Security information and event management',
    type: 'Security',
    status: 'Available',
    icon: '🔍',
    provider: 'Splunk',
    features: ['Log Analysis', 'Threat Detection', 'Risk Correlation', 'Real-time Monitoring'],
    documentation: 'https://docs.splunk.com',
    setupTime: '1 hour'
  },
  {
    id: 'crowdstrike',
    name: 'CrowdStrike',
    description: 'Endpoint protection and threat intelligence',
    type: 'Security',
    status: 'Available',
    icon: '🦅',
    provider: 'CrowdStrike',
    features: ['Threat Intelligence', 'Incident Data', 'Risk Indicators', 'Vulnerability Data'],
    documentation: 'https://developer.crowdstrike.com',
    setupTime: '45 minutes'
  },

  // Productivity & Project Management
  {
    id: 'jira',
    name: 'Jira',
    description: 'Create treatment tasks and track progress in Jira',
    type: 'Productivity',
    status: 'Active',
    icon: '📋',
    provider: 'Atlassian',
    features: ['Treatment Tasks', 'Issue Tracking', 'Sprint Planning', 'Workflow Automation'],
    documentation: 'https://developer.atlassian.com/jira',
    setupTime: '30 minutes',
    lastSync: '2024-04-20T13:30:00',
    version: '2.0'
  },
  {
    id: 'asana',
    name: 'Asana',
    description: 'Project management for risk treatment plans',
    type: 'Productivity',
    status: 'Available',
    icon: '✅',
    provider: 'Asana',
    features: ['Task Management', 'Timeline View', 'Team Collaboration', 'Progress Tracking'],
    documentation: 'https://developers.asana.com',
    setupTime: '25 minutes'
  },
  {
    id: 'monday',
    name: 'Monday.com',
    description: 'Work operating system for risk management workflows',
    type: 'Productivity',
    status: 'Coming Soon',
    icon: '🗓️',
    provider: 'Monday.com',
    features: ['Workflow Automation', 'Custom Dashboards', 'Time Tracking', 'Resource Management'],
    setupTime: '35 minutes'
  },

  // Cloud Storage
  {
    id: 'sharepoint',
    name: 'SharePoint',
    description: 'Document management and collaboration',
    type: 'Data',
    status: 'Active',
    icon: '📂',
    provider: 'Microsoft',
    features: ['Document Storage', 'Version Control', 'Co-authoring', 'Metadata Management'],
    documentation: 'https://docs.microsoft.com/sharepoint',
    setupTime: '35 minutes',
    lastSync: '2024-04-20T11:00:00',
    version: '1.5'
  },
  {
    id: 'gdrive',
    name: 'Google Drive',
    description: 'Cloud storage for risk documentation',
    type: 'Data',
    status: 'Active',
    icon: '☁️',
    provider: 'Google',
    features: ['File Storage', 'Real-time Collaboration', 'Access Control', 'File Sharing'],
    documentation: 'https://developers.google.com/drive',
    setupTime: '20 minutes',
    lastSync: '2024-04-20T15:45:00',
    version: '1.2'
  },
  {
    id: 'dropbox',
    name: 'Dropbox Business',
    description: 'Secure file storage and sharing',
    type: 'Data',
    status: 'Available',
    icon: '📦',
    provider: 'Dropbox',
    features: ['File Sync', 'Team Folders', 'Paper Integration', 'Smart Sync'],
    documentation: 'https://www.dropbox.com/developers',
    setupTime: '25 minutes'
  },

  // Developer & API
  {
    id: 'rest-api',
    name: 'REST API',
    description: 'Full RESTful API for custom integrations',
    type: 'Developer',
    status: 'Active',
    icon: '🔌',
    provider: 'ERM Platform',
    features: ['CRUD Operations', 'Webhooks', 'Rate Limiting', 'Authentication'],
    documentation: '/api/docs',
    setupTime: 'Varies',
    version: '3.0'
  },
  {
    id: 'webhooks',
    name: 'Webhooks',
    description: 'Real-time event notifications to external systems',
    type: 'Developer',
    status: 'Active',
    icon: '🪝',
    provider: 'ERM Platform',
    features: ['Risk Events', 'Treatment Updates', 'Assessment Completion', 'Custom Events'],
    documentation: '/api/webhooks',
    setupTime: '15 minutes',
    version: '2.0'
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect with 5000+ apps without code',
    type: 'Developer',
    status: 'Active',
    icon: '⚡',
    provider: 'Zapier',
    features: ['No-code Automation', 'Multi-step Workflows', 'Conditional Logic', 'Data Formatting'],
    documentation: 'https://zapier.com/apps/erm',
    setupTime: '10 minutes',
    lastSync: '2024-04-20T14:00:00',
    version: '1.0'
  }
];

export default function IntegrationsPage() {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState<'all' | IntegrationType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | IntegrationStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const types: ('all' | IntegrationType)[] = ['all', 'Authentication', 'Communication', 'Data', 'Analytics', 'Security', 'Productivity', 'GRC', 'Developer'];

  const filteredIntegrations = integrations.filter(integration => {
    if (typeFilter !== 'all' && integration.type !== typeFilter) return false;
    if (statusFilter !== 'all' && integration.status !== statusFilter) return false;
    if (searchQuery && !integration.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !integration.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const activeCount = integrations.filter(i => i.status === 'Active').length;
  const availableCount = integrations.filter(i => i.status === 'Available').length;
  const comingSoonCount = integrations.filter(i => i.status === 'Coming Soon').length;

  const getStatusColor = (status: IntegrationStatus) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700 border-green-200';
      case 'Inactive': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Available': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Coming Soon': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: IntegrationStatus) => {
    switch (status) {
      case 'Active': return <CheckCircle size={16} className="text-green-600" />;
      case 'Inactive': return <XCircle size={16} className="text-gray-600" />;
      case 'Available': return <Plug size={16} className="text-blue-600" />;
      case 'Coming Soon': return <Settings size={16} className="text-purple-600" />;
      default: return <Plug size={16} className="text-gray-600" />;
    }
  };

  const getTypeIcon = (type: IntegrationType) => {
    switch (type) {
      case 'Authentication': return <ShieldCheck size={18} />;
      case 'Communication': return <MessageSquare size={18} />;
      case 'Data': return <Database size={18} />;
      case 'Analytics': return <BarChart3 size={18} />;
      case 'Security': return <ShieldCheck size={18} />;
      case 'Productivity': return <Calendar size={18} />;
      case 'GRC': return <FileText size={18} />;
      case 'Developer': return <GitBranch size={18} />;
      default: return <Plug size={18} />;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Plug size={24} className="text-[var(--primary)]" />
            <h1 className="text-h2 font-bold text-[var(--foreground)]">Integrations</h1>
          </div>
          <button
            onClick={() => router.push('/erm/integrations/marketplace')}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium"
          >
            <ExternalLink size={18} />
            Browse Marketplace
          </button>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Connect your ERM system with leading platforms and tools
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Integrations</div>
          <div className="text-2xl font-bold text-gray-900">{integrations.length}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-700 mb-1">Active</div>
          <div className="text-2xl font-bold text-green-700">{activeCount}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-700 mb-1">Available</div>
          <div className="text-2xl font-bold text-blue-700">{availableCount}</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-sm text-purple-700 mb-1">Coming Soon</div>
          <div className="text-2xl font-bold text-purple-700">{comingSoonCount}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search integrations..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--foreground)]">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--foreground)]">Status:</span>
            <div className="flex gap-2">
              {(['all', 'Active', 'Available', 'Coming Soon'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={clsx(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-all border',
                    statusFilter === status
                      ? 'bg-teal-500 text-white border-teal-500'
                      : 'bg-white text-[var(--foreground-muted)] border-gray-300 hover:bg-gray-50'
                  )}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filteredIntegrations.map(integration => (
          <div
            key={integration.id}
            className="bg-white border border-[var(--border)] rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/erm/integrations/${integration.id}`)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{integration.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">{integration.name}</h3>
                  <p className="text-xs text-gray-500">{integration.provider}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {getStatusIcon(integration.status)}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

            {/* Status & Type */}
            <div className="flex items-center gap-2 mb-4">
              <span className={clsx('px-2 py-1 text-xs font-medium rounded border', getStatusColor(integration.status))}>
                {integration.status}
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700 flex items-center gap-1">
                {getTypeIcon(integration.type)}
                {integration.type}
              </span>
            </div>

            {/* Features */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-700 mb-2">Features:</div>
              <div className="flex flex-wrap gap-1">
                {integration.features.slice(0, 3).map((feature, idx) => (
                  <span key={idx} className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-700">
                    {feature}
                  </span>
                ))}
                {integration.features.length > 3 && (
                  <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600">
                    +{integration.features.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Footer Info */}
            <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
              {integration.setupTime && (
                <div>Setup: {integration.setupTime}</div>
              )}
              {integration.version && (
                <div>v{integration.version}</div>
              )}
              {integration.lastSync && (
                <div>Synced: {new Date(integration.lastSync).toLocaleDateString()}</div>
              )}
            </div>

            {/* Action Button */}
            <div className="mt-4">
              {integration.status === 'Active' ? (
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Settings size={14} />
                  Configure
                </button>
              ) : integration.status === 'Available' ? (
                <button className="w-full px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--primary-dark)] transition-colors flex items-center justify-center gap-2">
                  <Plug size={14} />
                  Connect
                </button>
              ) : (
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed">
                  Coming Soon
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <Plug size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No integrations found matching your criteria</p>
        </div>
      )}
    </div>
  );
}

