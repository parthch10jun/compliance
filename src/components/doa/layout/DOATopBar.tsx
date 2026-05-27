'use client';

/**
 * DoA Top Bar
 * Navigation breadcrumbs and quick actions
 */

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bell, Search, ChevronRight } from 'lucide-react';
import PersonaSwitcher from './PersonaSwitcher';
import UserSwitcher from './UserSwitcher';

export default function DOATopBar() {
  const pathname = usePathname();
  
  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'DoA', href: '/doa' }];
    
    let currentPath = '';
    for (let i = 1; i < paths.length; i++) {
      currentPath += `/${paths[i]}`;
      const label = paths[i]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        label,
        href: `/doa${currentPath}`,
      });
    }
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-p2">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.href}>
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
              <Link
                href={crumb.href}
                className={`
                  transition-colors
                  ${index === breadcrumbs.length - 1
                    ? 'text-[#F59E0B] font-medium'
                    : 'text-gray-600 hover:text-[#F59E0B]'
                  }
                `}
              >
                {crumb.label}
              </Link>
            </React.Fragment>
          ))}
        </nav>

        {/* Quick actions */}
        <div className="flex items-center gap-3">
          {/* Acts-as User Switcher (for DoA demo) */}
          <UserSwitcher />

          {/* Persona Switcher */}
          <PersonaSwitcher />

          {/* Search */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          {/* Notifications */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#F59E0B] rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
