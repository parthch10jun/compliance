'use client';

/**
 * DoA Sidebar Navigation
 * Amber-themed sidebar with 8 main sections
 * NOW WITH PERMISSION-BASED VISIBILITY
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePersona } from '@/contexts/PersonaContext';
import {
  LayoutDashboard,
  FileText,
  CheckCircle2,
  Repeat,
  AlertTriangle,
  AlertOctagon,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Home,
  Shield,
  Smartphone,
} from 'lucide-react';

interface NavItemChild {
  label: string;
  href: string;
  exact?: boolean;
}

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItemChild[];
}

const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/doa',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: 'Authority Matrix',
    href: '/doa/matrix',
    icon: <FileText className="w-5 h-5" />,
    children: [
      { label: 'Browse Matrix', href: '/doa/matrix', exact: true },
      { label: 'By Role', href: '/doa/matrix/by-role' },
      { label: 'Transaction Lookup', href: '/doa/matrix/transaction' },
      { label: 'Versions', href: '/doa/matrix/versions' },
      { label: 'Glossary', href: '/doa/matrix/glossary' },
    ],
  },
  {
    label: 'Change Requests',
    href: '/doa/change-request',
    icon: <FileText className="w-5 h-5" />,
    children: [
      { label: 'Inbox', href: '/doa/change-request', exact: true },
      { label: 'Submit CR', href: '/doa/change-request/new' },
      { label: 'My CRs', href: '/doa/change-request/mine' },
    ],
  },
  {
    label: 'Approvals',
    href: '/doa/approvals',
    icon: <CheckCircle2 className="w-5 h-5" />,
    children: [
      { label: 'Approver Inbox', href: '/doa/approvals-inbox', exact: true },
      { label: 'My Approvals', href: '/doa/approvals', exact: true },
      { label: 'Submit Request', href: '/doa/approvals/new' },
      { label: 'Workflows', href: '/doa/workflows', exact: true },
    ],
  },
  {
    label: 'Delegations',
    href: '/doa/delegations',
    icon: <Repeat className="w-5 h-5" />,
    children: [
      { label: 'Active Delegations', href: '/doa/delegations', exact: true },
      { label: 'Create Delegation', href: '/doa/delegations/new' },
      { label: 'Approval Requests', href: '/doa/requests', exact: true },
      { label: 'Submit Request', href: '/doa/requests/new' },
      { label: 'Calendar View', href: '/doa/delegations/calendar' },
    ],
  },
  {
    label: 'Policy Management',
    href: '/doa/policies',
    icon: <FileText className="w-5 h-5" />,
    children: [
      { label: 'All Policies', href: '/doa/policies', exact: true },
      { label: 'Create Policy', href: '/doa/policies/new' },
    ],
  },
  {
    label: 'SoD Monitoring',
    href: '/doa/sod-monitoring',
    icon: <AlertTriangle className="w-5 h-5" />,
    children: [
      { label: 'Conflict Dashboard', href: '/doa/sod-monitoring', exact: true },
      { label: 'Rules Library', href: '/doa/sod/rules', exact: true },
      { label: 'Analysis', href: '/doa/sod/analysis' },
    ],
  },
  {
    label: 'Exceptions',
    href: '/doa/exceptions',
    icon: <AlertOctagon className="w-5 h-5" />,
    children: [
      { label: 'All Exceptions', href: '/doa/exceptions', exact: true },
      { label: 'Emergency Approvals', href: '/doa/emergency-approvals' },
      { label: 'Overrides', href: '/doa/overrides' },
    ],
  },
  {
    label: 'Reports',
    href: '/doa/reports',
    icon: <BarChart3 className="w-5 h-5" />,
    children: [
      { label: 'Executive Dashboard', href: '/doa/reports/executive-dashboard', exact: true },
      { label: 'All Reports', href: '/doa/reports', exact: true },
      { label: 'Authority Usage', href: '/doa/reports/authority-usage' },
      { label: 'Cycle Time', href: '/doa/reports/approval-cycle-time' },
    ],
  },
  {
    label: 'Audit Trail',
    href: '/doa/audit-trail',
    icon: <Shield className="w-5 h-5" />,
  },
  {
    label: 'Mobile Demo',
    href: '/doa/mobile-demo',
    icon: <Smartphone className="w-5 h-5" />,
  },
  {
    label: 'Settings',
    href: '/doa/settings',
    icon: <Settings className="w-5 h-5" />,
    children: [
      { label: 'General', href: '/doa/settings', exact: true },
      { label: 'Policy Workflow', href: '/doa/policy-workflow' },
      { label: 'Notifications', href: '/doa/settings/notifications' },
      { label: 'Integrations', href: '/doa/settings/integrations' },
    ],
  },
];

export default function DOASidebar() {
  const pathname = usePathname();
  const { hasPermission } = usePersona();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'Authority Matrix',
    'Approvals',
    'Delegations',
    'SoD Monitoring',
  ]);

  const toggleSection = (label: string) => {
    setExpandedSections(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) {
      return pathname === href;
    }
    if (href === '/doa') {
      return pathname === '/doa';
    }
    return pathname.startsWith(href);
  };

  // Check if any child is active (for parent highlighting)
  const hasActiveChild = (children?: NavItem[]) => {
    if (!children) return false;
    return children.some(child => pathname === child.href || pathname.startsWith(child.href + '/'));
  };

  // Filter navigation items based on permissions
  const getFilteredNavItems = () => {
    return navigationItems.map(item => {
      // Filter children based on permissions
      const filteredChildren = item.children?.filter(child => {
        // Authority Matrix children
        if (child.href === '/doa/authority-matrix/new') {
          return hasPermission('createMatrix');
        }
        if (child.href === '/doa/authority-matrix/templates') {
          return hasPermission('viewMatrix');
        }

        // Approvals children
        if (child.href === '/doa/approvals/new') {
          return hasPermission('submitRequests');
        }
        if (child.href === '/doa/workflows') {
          return hasPermission('viewAllApprovals');
        }

        // Delegations children
        if (child.href === '/doa/delegations/new') {
          return hasPermission('createDelegation');
        }

        // SoD children
        if (child.href.includes('/sod/rules')) {
          return hasPermission('viewSoDRules');
        }

        // Default: show
        return true;
      });

      return {
        ...item,
        children: filteredChildren,
      };
    }).filter(item => {
      // Hide entire sections based on permissions
      if (item.label === 'Settings') {
        return hasPermission('manageRoles') || hasPermission('managePolicies');
      }
      if (item.label === 'Reports') {
        return hasPermission('viewReports') || hasPermission('viewDashboard');
      }
      if (item.label === 'SoD Monitoring') {
        return hasPermission('viewSoDRules') || hasPermission('viewDashboard');
      }
      if (item.label === 'Exceptions') {
        return hasPermission('requestException') || hasPermission('manageExceptions') || hasPermission('viewDashboard');
      }

      // Show Dashboard, Authority Matrix, Approvals, Delegations to everyone
      return true;
    });
  };

  const filteredNavItems = getFilteredNavItems();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-[#F59E0B] transition-colors mb-3">
          <Home className="w-4 h-4" />
          <span className="text-sm">Back to Main</span>
        </Link>
        <h2 className="text-h3 font-semibold text-[#F59E0B] flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Delegation of Authority
        </h2>
        <p className="text-p3 text-gray-600 mt-1">
          Authority Matrix & Approvals
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {filteredNavItems.map((item) => (
          <div key={item.label}>
            {/* Main nav item */}
            {item.children ? (
              // Parent item with children - only toggles, doesn't navigate
              <button
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all cursor-pointer
                  text-gray-700 hover:bg-gray-50
                `}
                onClick={() => toggleSection(item.label)}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-p2 font-medium">{item.label}</span>
                </div>
                {expandedSections.includes(item.label) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            ) : (
              // Leaf item - navigates to href
              <Link
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                  ${pathname === item.href
                    ? 'bg-amber-50 text-[#F59E0B]'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {item.icon}
                <span className="text-p2 font-medium">{item.label}</span>
              </Link>
            )}

            {/* Sub-nav items */}
            {item.children && expandedSections.includes(item.label) && (
              <div className="ml-8 mt-1 space-y-1">
                {item.children.map((child) => {
                  // Determine if this child is active
                  const isActive = child.exact
                    ? pathname === child.href  // Exact match only
                    : pathname === child.href || pathname.startsWith(child.href + '/'); // Prefix match

                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`
                        block px-3 py-2 rounded-lg text-p2 transition-colors
                        ${isActive
                          ? 'bg-amber-50 text-[#F59E0B] font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                        }
                      `}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-p3 text-gray-500">
          <div className="font-medium text-[#F59E0B]">DoA Module v1.0</div>
          <div className="mt-1">Centralized Authority Management</div>
        </div>
      </div>
    </aside>
  );
}
