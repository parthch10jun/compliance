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
import { useClientProfile } from '@/lib/doa/hooks/useClientProfile';
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
    label: 'Delegations',
    href: '/doa/delegations',
    icon: <Repeat className="w-5 h-5" />,
    children: [
      { label: 'Active Delegations', href: '/doa/delegations', exact: true },
      { label: 'Create Delegation', href: '/doa/delegations/new' },
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
  const { profileId } = useClientProfile();
  const isSEC = profileId === 'sec';
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

  // In the SEC workspace we keep the FULL DoA navigation — every module stays
  // visible exactly as in the main app (Dashboard, Change Requests, Delegations,
  // Policies, SoD, Exceptions, Reports, Audit Trail, Settings → Integrations …).
  // Only the Authority Matrix *content* changes by profile (see the
  // profile-aware matrix page); the top bar separately hides the JNBP
  // persona/user switchers so no JERA-named identities leak.

  // Filter navigation items based on permissions
  const getFilteredNavItems = () => {
    return navigationItems.map(item => {
      // Filter children based on permissions
      const filteredChildren = item.children?.filter(child => {
        // SEC workspace: keep every child — full navigation, unchanged.
        if (isSEC) return true;
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
      // SEC workspace: show every module, same as the full app.
      if (isSEC) return true;
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
    <aside className="w-52 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-3 py-3.5 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-1.5 text-gray-500 hover:text-[#F59E0B] transition-colors mb-2.5">
          <Home className="w-3.5 h-3.5" />
          <span className="text-xs">Back to Main</span>
        </Link>
        <h2 className="text-base font-semibold text-[#F59E0B] flex items-center gap-2 leading-tight">
          <FileText className="w-5 h-5 flex-shrink-0" />
          Delegation of Authority
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Authority Matrix &amp; Approvals
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5">
        {filteredNavItems.map((item) => (
          <div key={item.label}>
            {/* Main nav item */}
            {item.children ? (
              // Parent item with children - only toggles, doesn't navigate
              <button
                className={`
                  w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-all cursor-pointer
                  text-gray-700 hover:bg-gray-50
                `}
                onClick={() => toggleSection(item.label)}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {item.icon}
                  <span className="text-p2 font-medium truncate">{item.label}</span>
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
                  flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all
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
              <div className="ml-6 mt-0.5 space-y-0.5">
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
