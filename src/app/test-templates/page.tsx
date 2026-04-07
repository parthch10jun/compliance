'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components';
import {
  Shield, Lock, Database, GitBranch, FileText, Users, Cloud,
  Search, Filter, Copy, Download, Star, CheckCircle2, ArrowRight,
  Calendar, Clock, Target, Zap, BookOpen, Tag
} from 'lucide-react';
import clsx from 'clsx';

// Template Categories
const categories = [
  {
    id: 'access-control',
    name: 'Access Control',
    icon: Lock,
    color: 'blue',
    templateCount: 12,
    description: 'User authentication, authorization, and access management'
  },
  {
    id: 'data-protection',
    name: 'Data Protection',
    icon: Database,
    color: 'green',
    templateCount: 10,
    description: 'Encryption, DLP, data classification, and privacy controls'
  },
  {
    id: 'change-management',
    name: 'Change Management',
    icon: GitBranch,
    color: 'purple',
    templateCount: 8,
    description: 'Change approval, testing, and deployment processes'
  },
  {
    id: 'network-security',
    name: 'Network Security',
    icon: Shield,
    color: 'red',
    templateCount: 9,
    description: 'Firewalls, IDS/IPS, network segmentation, VPN'
  },
  {
    id: 'incident-response',
    name: 'Incident Response',
    icon: Target,
    color: 'orange',
    templateCount: 6,
    description: 'Detection, escalation, containment, and recovery'
  },
  {
    id: 'backup-recovery',
    name: 'Backup & Recovery',
    icon: Cloud,
    color: 'cyan',
    templateCount: 5,
    description: 'Backup procedures, restoration testing, DR plans'
  }
];

// Test Templates Data
const testTemplates = [
  // Access Control Templates
  {
    id: 'tpl-ac-001',
    categoryId: 'access-control',
    code: 'TPL-AC-001',
    name: 'Multi-Factor Authentication (MFA) Enforcement',
    description: 'Verify that MFA is enforced for all users accessing critical systems',
    framework: ['SOC 2', 'ISO 27001', 'RBI IT Governance'],
    testType: 'Operating Effectiveness',
    frequency: 'Quarterly',
    sampleSize: '25 users',
    difficulty: 'Easy',
    estimatedTime: '2-3 hours',
    popularity: 95,
    timesUsed: 847,
    lastUpdated: '2025-01-15',
    steps: [
      {
        order: 1,
        title: 'Obtain User Access List',
        description: 'Extract complete list of users from identity provider (e.g., Azure AD, Okta)',
        expectedEvidence: 'User list export with MFA status',
        guidance: 'Use admin portal or API to export users. Include fields: username, email, MFA enabled, MFA method'
      },
      {
        order: 2,
        title: 'Select Sample',
        description: 'Use random sampling to select 25 users from the population',
        expectedEvidence: 'Sample selection worksheet with random seed',
        guidance: 'Use Excel RAND() function or statistical sampling tool. Document seed for reproducibility'
      },
      {
        order: 3,
        title: 'Review MFA Configuration',
        description: 'For each sampled user, verify MFA is enabled and configured',
        expectedEvidence: 'Screenshots or system reports showing MFA status',
        guidance: 'Check: (1) MFA enabled flag, (2) At least one MFA method registered, (3) MFA enforced on login'
      },
      {
        order: 4,
        title: 'Test MFA Enforcement',
        description: 'Attempt login for 5 sampled users to verify MFA prompt appears',
        expectedEvidence: 'Screenshots of MFA prompts during login',
        guidance: 'Use test accounts or coordinate with users. Verify cannot bypass MFA'
      },
      {
        order: 5,
        title: 'Review Exceptions',
        description: 'Identify any users without MFA and validate exceptions are documented/approved',
        expectedEvidence: 'Exception approval forms or tickets',
        guidance: 'Check exception log. Verify: (1) Business justification, (2) Approver, (3) Expiration date'
      },
      {
        order: 6,
        title: 'Document Results',
        description: 'Complete test workpaper with pass/fail determination and observations',
        expectedEvidence: 'Test workpaper with conclusion',
        guidance: 'Pass criteria: ≥95% of sample has MFA enabled. All exceptions properly documented'
      }
    ],
    passCriteria: '95% of sampled users have MFA enabled and enforced; all exceptions documented and approved',
    commonIssues: [
      'Service accounts excluded from MFA without proper documentation',
      'Legacy applications not supporting MFA',
      'Users enrolled in MFA but enforcement not enabled'
    ],
    relatedControls: ['SOC2-AC-001', 'ISO27001-A.9.4.2', 'RBI-ITG-AC-05']
  },
  {
    id: 'tpl-ac-002',
    categoryId: 'access-control',
    code: 'TPL-AC-002',
    name: 'User Access Review',
    description: 'Verify periodic access reviews are performed and inappropriate access is revoked',
    framework: ['SOC 2', 'ISO 27001', 'RBI IT Governance', 'CBUAE'],
    testType: 'Operating Effectiveness',
    frequency: 'Quarterly',
    sampleSize: '3 systems, 15 users per system',
    difficulty: 'Medium',
    estimatedTime: '4-6 hours',
    popularity: 92,
    timesUsed: 756,
    lastUpdated: '2025-01-10',
    steps: [
      {
        order: 1,
        title: 'Select Systems for Testing',
        description: 'Choose 3 critical systems that require periodic access reviews',
        expectedEvidence: 'List of selected systems with criticality classification',
        guidance: 'Prioritize: (1) Production databases, (2) Financial systems, (3) Customer data systems'
      },
      {
        order: 2,
        title: 'Obtain Access Review Records',
        description: 'Request completed access review documentation for the last review cycle',
        expectedEvidence: 'Access review reports, approval emails, tickets',
        guidance: 'Should include: Review date, reviewer name, list of users reviewed, actions taken'
      },
      {
        order: 3,
        title: 'Verify Review Timeliness',
        description: 'Confirm reviews were completed within the required frequency (quarterly)',
        expectedEvidence: 'Review completion dates vs. policy requirement',
        guidance: 'Check policy for required frequency. Flag if review is late or missing'
      },
      {
        order: 4,
        title: 'Sample Users for Detailed Testing',
        description: 'For each system, randomly select 15 users for detailed validation',
        expectedEvidence: 'Sample selection worksheet',
        guidance: 'Include mix of active and recently terminated users'
      },
      {
        order: 5,
        title: 'Validate Access Appropriateness',
        description: 'Verify sampled users\' access aligns with job role and responsibilities',
        expectedEvidence: 'Job role documentation, access comparison matrix',
        guidance: 'Compare: (1) User job title, (2) Assigned access, (3) Expected access per role matrix'
      },
      {
        order: 6,
        title: 'Test Remediation Actions',
        description: 'For any access flagged as inappropriate, verify it was revoked timely',
        expectedEvidence: 'Access removal tickets, system logs showing revocation',
        guidance: 'Check: Access removed within 24-48 hours of review completion'
      }
    ],
    passCriteria: 'Access reviews completed quarterly; 100% of inappropriate access revoked within 48 hours',
    commonIssues: [
      'Reviews completed but not documented properly',
      'Inappropriate access identified but not revoked',
      'No follow-up on review findings'
    ],
    relatedControls: ['SOC2-AC-003', 'ISO27001-A.9.2.5', 'RBI-ITG-AC-08', 'CBUAE-AC-012']
  },
  {
    id: 'tpl-ac-003',
    categoryId: 'access-control',
    code: 'TPL-AC-003',
    name: 'Privileged Access Management (PAM)',
    description: 'Test controls over privileged/admin account access and usage monitoring',
    framework: ['SOC 2', 'RBI IT Governance', 'CBUAE'],
    testType: 'Operating Effectiveness',
    frequency: 'Quarterly',
    sampleSize: '20 admin accounts',
    difficulty: 'Hard',
    estimatedTime: '5-7 hours',
    popularity: 88,
    timesUsed: 623,
    lastUpdated: '2025-01-12',
    steps: [],
    passCriteria: 'All admin accounts managed through PAM solution; session recordings available',
    commonIssues: [],
    relatedControls: ['SOC2-AC-005', 'RBI-ITG-AC-12', 'CBUAE-AC-015']
  },

  // Data Protection Templates
  {
    id: 'tpl-dp-001',
    categoryId: 'data-protection',
    code: 'TPL-DP-001',
    name: 'Data Encryption at Rest',
    description: 'Verify sensitive data is encrypted at rest using approved algorithms',
    framework: ['SOC 2', 'ISO 27001', 'DPDP Act', 'RBI IT Governance'],
    testType: 'Design + Operating Effectiveness',
    frequency: 'Semi-Annual',
    sampleSize: '5 databases/storage systems',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    popularity: 90,
    timesUsed: 712,
    lastUpdated: '2025-01-08',
    steps: [],
    passCriteria: 'All sensitive data encrypted using AES-256 or stronger',
    commonIssues: [],
    relatedControls: ['SOC2-DP-001', 'ISO27001-A.10.1.1', 'RBI-ITG-DP-03']
  },
  {
    id: 'tpl-dp-002',
    categoryId: 'data-protection',
    code: 'TPL-DP-002',
    name: 'Data Loss Prevention (DLP) Policy Effectiveness',
    description: 'Test DLP policies block transmission of sensitive data via email/web',
    framework: ['SOC 2', 'ISO 27001', 'DPDP Act'],
    testType: 'Operating Effectiveness',
    frequency: 'Quarterly',
    sampleSize: '25 test transmissions',
    difficulty: 'Medium',
    estimatedTime: '2-3 hours',
    popularity: 85,
    timesUsed: 589,
    lastUpdated: '2025-01-14',
    steps: [],
    passCriteria: '100% of test transmissions containing PII/sensitive data are blocked',
    commonIssues: [],
    relatedControls: ['SOC2-DP-003', 'ISO27001-A.13.2.3', 'DPDP-SEC-08']
  },

  // Change Management Templates
  {
    id: 'tpl-cm-001',
    categoryId: 'change-management',
    code: 'TPL-CM-001',
    name: 'Production Change Approval Process',
    description: 'Verify all production changes are approved before implementation',
    framework: ['SOC 2', 'ISO 27001', 'RBI IT Governance'],
    testType: 'Operating Effectiveness',
    frequency: 'Quarterly',
    sampleSize: '25 changes',
    difficulty: 'Easy',
    estimatedTime: '2-3 hours',
    popularity: 93,
    timesUsed: 891,
    lastUpdated: '2025-01-16',
    steps: [],
    passCriteria: '100% of production changes have documented approval prior to deployment',
    commonIssues: [],
    relatedControls: ['SOC2-CM-001', 'ISO27001-A.12.1.2', 'RBI-ITG-CM-02']
  },
  {
    id: 'tpl-cm-002',
    categoryId: 'change-management',
    code: 'TPL-CM-002',
    name: 'Change Rollback Procedures',
    description: 'Test that failed changes can be rolled back successfully',
    framework: ['SOC 2', 'ISO 27001'],
    testType: 'Operating Effectiveness',
    frequency: 'Semi-Annual',
    sampleSize: '5 rollback scenarios',
    difficulty: 'Hard',
    estimatedTime: '4-6 hours',
    popularity: 78,
    timesUsed: 445,
    lastUpdated: '2025-01-11',
    steps: [],
    passCriteria: 'Rollback procedures documented and successfully tested',
    commonIssues: [],
    relatedControls: ['SOC2-CM-003', 'ISO27001-A.12.1.4']
  },

  // Network Security Templates
  {
    id: 'tpl-ns-001',
    categoryId: 'network-security',
    code: 'TPL-NS-001',
    name: 'Firewall Rule Review',
    description: 'Review firewall rules for appropriateness and least privilege',
    framework: ['SOC 2', 'ISO 27001', 'RBI IT Governance', 'CBUAE'],
    testType: 'Operating Effectiveness',
    frequency: 'Quarterly',
    sampleSize: '30 firewall rules',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    popularity: 87,
    timesUsed: 678,
    lastUpdated: '2025-01-13',
    steps: [],
    passCriteria: 'All firewall rules have business justification; no overly permissive rules',
    commonIssues: [],
    relatedControls: ['SOC2-NS-001', 'ISO27001-A.13.1.1', 'RBI-ITG-NS-04']
  },
  {
    id: 'tpl-ns-002',
    categoryId: 'network-security',
    code: 'TPL-NS-002',
    name: 'Intrusion Detection/Prevention System (IDS/IPS)',
    description: 'Verify IDS/IPS is configured and alerts are monitored',
    framework: ['SOC 2', 'ISO 27001', 'CBUAE'],
    testType: 'Operating Effectiveness',
    frequency: 'Quarterly',
    sampleSize: '20 alerts',
    difficulty: 'Medium',
    estimatedTime: '3-5 hours',
    popularity: 82,
    timesUsed: 534,
    lastUpdated: '2025-01-09',
    steps: [],
    passCriteria: 'IDS/IPS actively monitoring; alerts reviewed and acted upon within SLA',
    commonIssues: [],
    relatedControls: ['SOC2-NS-003', 'ISO27001-A.13.1.1', 'CBUAE-NS-07']
  },

  // Incident Response Templates
  {
    id: 'tpl-ir-001',
    categoryId: 'incident-response',
    code: 'TPL-IR-001',
    name: 'Security Incident Response Plan Testing',
    description: 'Conduct tabletop exercise to test incident response procedures',
    framework: ['SOC 2', 'ISO 27001', 'RBI IT Governance', 'CBUAE'],
    testType: 'Operating Effectiveness',
    frequency: 'Annual',
    sampleSize: 'Full IR team',
    difficulty: 'Hard',
    estimatedTime: '6-8 hours',
    popularity: 91,
    timesUsed: 412,
    lastUpdated: '2025-01-05',
    steps: [],
    passCriteria: 'IR plan successfully tested; lessons learned documented',
    commonIssues: [],
    relatedControls: ['SOC2-IR-001', 'ISO27001-A.16.1.5', 'RBI-ITG-IR-02']
  },

  // Backup & Recovery Templates
  {
    id: 'tpl-br-001',
    categoryId: 'backup-recovery',
    code: 'TPL-BR-001',
    name: 'Backup Restoration Testing',
    description: 'Verify backups can be successfully restored within RTO',
    framework: ['SOC 2', 'ISO 27001', 'RBI IT Governance'],
    testType: 'Operating Effectiveness',
    frequency: 'Quarterly',
    sampleSize: '3 critical systems',
    difficulty: 'Medium',
    estimatedTime: '4-6 hours',
    popularity: 94,
    timesUsed: 823,
    lastUpdated: '2025-01-17',
    steps: [],
    passCriteria: 'Backups restored successfully within defined RTO; data integrity verified',
    commonIssues: [],
    relatedControls: ['SOC2-BR-001', 'ISO27001-A.12.3.1', 'RBI-ITG-BR-03']
  }
];

type LeftPaneTab = string; // Category ID
type MiddlePaneContent = { type: 'template'; data: any } | null;
type RightPaneContent = { type: 'detail'; data: any } | null;

export default function TestTemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0].id);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showTemplateDetail, setShowTemplateDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFramework, setFilterFramework] = useState<string>('all');

  // Auto-select first category
  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0].id);
    }
  }, [selectedCategory]);

  // Filter templates by category and search
  const filteredTemplates = testTemplates.filter(template => {
    if (template.categoryId !== selectedCategory) return false;
    if (filterFramework !== 'all' && !template.framework.includes(filterFramework)) return false;
    if (searchQuery) {
      return template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             template.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
             template.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Get category info
  const currentCategory = categories.find(c => c.id === selectedCategory);

  // Stats
  const stats = {
    totalTemplates: testTemplates.length,
    categories: categories.length,
    mostPopular: testTemplates.reduce((prev, current) =>
      (prev.popularity > current.popularity) ? prev : current
    ).name,
    totalUses: testTemplates.reduce((sum, t) => sum + t.timesUsed, 0)
  };

  return (
    <div className="max-w-full">
      <PageHeader
        title="Test Templates Library"
        description="Pre-built test procedures to accelerate control testing"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTemplates}</p>
              <p className="text-xs text-gray-500">Templates</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Tag className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
              <p className="text-xs text-gray-500">Categories</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Star className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 line-clamp-1">{stats.mostPopular}</p>
              <p className="text-xs text-gray-500">Most Popular</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUses.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Times Used</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Pane Layout */}
      <div className="flex gap-4 h-[calc(100vh-340px)] min-h-[700px]">
        {/* LEFT PANE: Template Categories */}
        <div className="flex-[0_0_28%] bg-white rounded-xl border overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b bg-blue-50">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen size={16} className="text-blue-600" />
              Template Categories
            </h3>
            <p className="text-xs text-gray-600 mt-1">{stats.totalTemplates} templates available</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setSelectedTemplate(null);
                    setShowTemplateDetail(false);
                  }}
                  className={clsx(
                    'w-full text-left p-4 border-b transition-all',
                    selectedCategory === category.id
                      ? 'bg-blue-50 border-l-4 border-l-blue-500'
                      : 'hover:bg-gray-50'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={clsx(
                      'p-2 rounded-lg',
                      `bg-${category.color}-100`
                    )}>
                      <Icon size={20} className={`text-${category.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">{category.name}</h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{category.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                          {category.templateCount} templates
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* MIDDLE PANE: Templates in Selected Category */}
        <div className="flex-[0_0_36%] bg-white rounded-xl border overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-1">
              <Shield size={16} className="text-blue-600" />
              {currentCategory?.name || 'Select a Category'}
            </h3>
            <p className="text-xs text-gray-600">{filteredTemplates.length} templates</p>
          </div>

          {/* Search & Filter */}
          <div className="p-3 border-b bg-gray-50 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterFramework}
              onChange={(e) => setFilterFramework(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Frameworks</option>
              <option value="SOC 2">SOC 2</option>
              <option value="ISO 27001">ISO 27001</option>
              <option value="RBI IT Governance">RBI IT Governance</option>
              <option value="CBUAE">CBUAE</option>
              <option value="DPDP Act">DPDP Act</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredTemplates.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FileText size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No templates found</p>
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template);
                    setShowTemplateDetail(true);
                  }}
                  className={clsx(
                    'w-full text-left p-4 border-b transition-all',
                    selectedTemplate?.id === template.id
                      ? 'bg-green-50 border-l-4 border-l-green-500'
                      : 'hover:bg-gray-50'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-mono text-green-600">{template.code}</span>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-xs text-gray-600">{template.popularity}%</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{template.name}</h4>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{template.description}</p>

                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={clsx(
                      'px-2 py-0.5 rounded text-xs font-medium',
                      template.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      template.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    )}>
                      {template.difficulty}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700">
                      {template.testType}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {template.estimatedTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {template.timesUsed} uses
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-1 flex-wrap">
                    {template.framework.slice(0, 3).map((fw: string, idx: number) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-600">
                        {fw}
                      </span>
                    ))}
                    {template.framework.length > 3 && (
                      <span className="text-xs text-gray-500">+{template.framework.length - 3}</span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANE: Template Detail */}
        {showTemplateDetail && selectedTemplate && (
          <div className="flex-[0_0_36%] bg-white rounded-xl border overflow-hidden flex flex-col shadow-sm">
            <div className="p-4 border-b bg-green-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <FileText size={16} className="text-green-600" />
                  Template Details
                </h3>
                <button
                  onClick={() => setShowTemplateDetail(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs font-mono text-green-600">{selectedTemplate.code}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Template Info */}
              <div className="mb-6">
                <h4 className="text-base font-bold text-gray-900 mb-2">{selectedTemplate.name}</h4>
                <p className="text-sm text-gray-700 mb-4">{selectedTemplate.description}</p>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-500 mb-1">Test Type</p>
                    <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 font-medium">
                      {selectedTemplate.testType}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Difficulty</p>
                    <span className={clsx(
                      'px-2 py-1 rounded font-medium',
                      selectedTemplate.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      selectedTemplate.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    )}>
                      {selectedTemplate.difficulty}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Frequency</p>
                    <p className="font-medium text-gray-900">{selectedTemplate.frequency}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Sample Size</p>
                    <p className="font-medium text-gray-900">{selectedTemplate.sampleSize}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Estimated Time</p>
                    <p className="font-medium text-gray-900">{selectedTemplate.estimatedTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Popularity</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${selectedTemplate.popularity}%` }}
                        />
                      </div>
                      <span className="font-medium text-gray-900">{selectedTemplate.popularity}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Applicable Frameworks */}
              <div className="mb-6 pb-4 border-b">
                <h5 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Applicable Frameworks</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.framework.map((fw: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">
                      {fw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Test Procedure Steps */}
              {selectedTemplate.steps && selectedTemplate.steps.length > 0 && (
                <div className="mb-6 pb-4 border-b">
                  <h5 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Test Procedure ({selectedTemplate.steps.length} Steps)</h5>
                  <div className="space-y-4">
                    {selectedTemplate.steps.map((step: any) => (
                      <div key={step.order} className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                            {step.order}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 mb-1">{step.title}</p>
                            <p className="text-xs text-gray-700 mb-2">{step.description}</p>
                            {step.expectedEvidence && (
                              <div className="bg-white rounded p-2 mb-2">
                                <p className="text-xs text-gray-500 mb-1">Expected Evidence:</p>
                                <p className="text-xs text-gray-700 font-medium">{step.expectedEvidence}</p>
                              </div>
                            )}
                            {step.guidance && (
                              <div className="bg-blue-50 rounded p-2">
                                <p className="text-xs text-blue-600 font-medium mb-1">💡 Guidance:</p>
                                <p className="text-xs text-blue-700">{step.guidance}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pass Criteria */}
              <div className="mb-6 pb-4 border-b">
                <h5 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Pass Criteria</h5>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">{selectedTemplate.passCriteria}</p>
                </div>
              </div>

              {/* Common Issues */}
              {selectedTemplate.commonIssues && selectedTemplate.commonIssues.length > 0 && (
                <div className="mb-6 pb-4 border-b">
                  <h5 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Common Issues</h5>
                  <ul className="space-y-2">
                    {selectedTemplate.commonIssues.map((issue: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                        <span className="text-amber-500 mt-0.5">⚠️</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related Controls */}
              <div className="mb-6 pb-4 border-b">
                <h5 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Related Controls</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.relatedControls.map((control: string, idx: number) => (
                    <span key={idx} className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-mono">
                      {control}
                    </span>
                  ))}
                </div>
              </div>

              {/* Usage Stats */}
              <div className="mb-6">
                <h5 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Usage Statistics</h5>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-600 mb-1">Times Used</p>
                    <p className="text-lg font-bold text-blue-700">{selectedTemplate.timesUsed}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs text-purple-600 mb-1">Last Updated</p>
                    <p className="text-sm font-medium text-purple-700">{selectedTemplate.lastUpdated}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t bg-gray-50 space-y-2">
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <CheckCircle2 size={16} />
                Use This Template
                <ArrowRight size={16} />
              </button>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Copy size={14} />
                  Clone
                </button>
                <button className="flex-1 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Download size={14} />
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

