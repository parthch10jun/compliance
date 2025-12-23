'use client';

import { Users, Building2, Shield, Database, Settings, Bell, Mail, Key } from 'lucide-react';
import Link from 'next/link';

const adminSections = [
  {
    title: 'User Management',
    description: 'Manage users, roles, and permissions',
    icon: Users,
    href: '/admin/users',
    color: 'blue',
  },
  {
    title: 'Organization Settings',
    description: 'Configure organization details and preferences',
    icon: Building2,
    href: '/admin/organization',
    color: 'purple',
  },
  {
    title: 'Security & Access',
    description: 'Manage security policies and access controls',
    icon: Shield,
    href: '/admin/security',
    color: 'red',
  },
  {
    title: 'Data Management',
    description: 'Import, export, and manage data',
    icon: Database,
    href: '/admin/data',
    color: 'green',
  },
  {
    title: 'System Configuration',
    description: 'Configure system settings and integrations',
    icon: Settings,
    href: '/admin/system',
    color: 'gray',
  },
  {
    title: 'Notifications',
    description: 'Manage notification templates and settings',
    icon: Bell,
    href: '/admin/notifications',
    color: 'yellow',
  },
  {
    title: 'Email Settings',
    description: 'Configure email servers and templates',
    icon: Mail,
    href: '/admin/email',
    color: 'indigo',
  },
  {
    title: 'API & Integrations',
    description: 'Manage API keys and third-party integrations',
    icon: Key,
    href: '/admin/integrations',
    color: 'pink',
  },
];

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  red: 'bg-red-100 text-red-600',
  green: 'bg-green-100 text-green-600',
  gray: 'bg-gray-100 text-gray-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  pink: 'bg-pink-100 text-pink-600',
};

export default function AdminPage() {
  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-h1 font-bold text-[var(--foreground)] mb-2">Administration</h1>
        <p className="text-p1 text-[var(--foreground-muted)]">
          Manage system settings, users, and configurations
        </p>
      </div>

      {/* Admin Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="group bg-white border border-[var(--border)] rounded-xl p-6 hover:shadow-lg hover:border-[var(--primary)] transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClasses[section.color as keyof typeof colorClasses]}`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-h4 font-semibold text-[var(--foreground)] mb-1 group-hover:text-[var(--primary)] transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-p3 text-[var(--foreground-muted)]">
                    {section.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* System Info */}
      <div className="mt-8 bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="text-h4 font-semibold text-[var(--foreground)] mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-p3 text-[var(--foreground-muted)] mb-1">Version</div>
            <div className="text-p2 font-medium text-[var(--foreground)]">v1.0.0</div>
          </div>
          <div>
            <div className="text-p3 text-[var(--foreground-muted)] mb-1">Environment</div>
            <div className="text-p2 font-medium text-[var(--foreground)]">Production</div>
          </div>
          <div>
            <div className="text-p3 text-[var(--foreground-muted)] mb-1">Last Updated</div>
            <div className="text-p2 font-medium text-[var(--foreground)]">Dec 23, 2024</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white border border-[var(--border)] rounded-xl p-6">
        <h2 className="text-h4 font-semibold text-[var(--foreground)] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors text-p2 font-medium">
            Create User
          </button>
          <button className="px-4 py-2 bg-[var(--background-secondary)] text-[var(--foreground)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-tertiary)] transition-colors text-p2 font-medium">
            Export Data
          </button>
          <button className="px-4 py-2 bg-[var(--background-secondary)] text-[var(--foreground)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-tertiary)] transition-colors text-p2 font-medium">
            View Audit Log
          </button>
          <button className="px-4 py-2 bg-[var(--background-secondary)] text-[var(--foreground)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-tertiary)] transition-colors text-p2 font-medium">
            System Health
          </button>
        </div>
      </div>
    </div>
  );
}

