'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, FileText, Shield, FileCheck, ShieldCheck, AlertTriangle,
  Building2, Package, FlaskConical, Users, Settings, ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

interface Module {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string; // yellow, blue, purple, etc.
  pages: {
    name: string;
    href: string;
    icon: React.ReactNode;
  }[];
}

const modules: Module[] = [
  {
    id: 'compliance',
    name: 'Compliance',
    icon: <ShieldCheck size={20} />,
    color: '#FCD34D', // yellow
    pages: [
      { name: 'Overview', href: '/', icon: <LayoutDashboard size={16} /> },
      { name: 'Controls', href: '/controls', icon: <Shield size={16} /> },
      { name: 'Policies', href: '/library/policies', icon: <FileText size={16} /> },
      { name: 'Evidence', href: '/evidence', icon: <FileCheck size={16} /> },
      { name: 'Documents', href: '/documents', icon: <FileText size={16} /> },
      { name: 'Trust', href: '/trust', icon: <ShieldCheck size={16} /> },
      { name: 'People', href: '/people', icon: <Users size={16} /> },
      { name: 'Risks', href: '/risks', icon: <AlertTriangle size={16} /> },
      { name: 'Vendors', href: '/vendors', icon: <Building2 size={16} /> },
      { name: 'Questionnaire', href: '/questionnaire', icon: <FileText size={16} /> },
      { name: 'Integrations', href: '/integrations', icon: <Package size={16} /> },
      { name: 'Cloud Tests', href: '/cloud-tests', icon: <FlaskConical size={16} /> },
    ],
  },
];

export function DualSidebar() {
  const [selectedModule, setSelectedModule] = useState<string>('compliance');
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const pathname = usePathname();

  const currentModule = modules.find(m => m.id === selectedModule);

  return (
    <>
      {/* LEFT SIDEBAR - Icon Only */}
      <div className="fixed left-0 top-0 h-full w-16 bg-[#0A0A0A] border-r border-[#2A2A2A] flex flex-col items-center py-4 z-40">
        {/* Logo / Brand */}
        <div className="mb-8">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FCD34D' }}>
            <ShieldCheck size={24} className="text-black" />
          </div>
        </div>

        {/* Module Icons */}
        <div className="flex-1 flex flex-col gap-2">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => {
                setSelectedModule(module.id);
                setIsRightSidebarOpen(true);
              }}
              className={clsx(
                'w-10 h-10 rounded-lg flex items-center justify-center transition-all',
                selectedModule === module.id
                  ? 'text-black'
                  : 'text-gray-500 hover:text-white hover:bg-[#1A1A1A]'
              )}
              style={{
                backgroundColor: selectedModule === module.id ? module.color : 'transparent'
              }}
            >
              {module.icon}
            </button>
          ))}
        </div>

        {/* Settings at bottom */}
        <div className="mt-auto">
          <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#1A1A1A] transition-all">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* RIGHT SIDEBAR - Detailed Menu (Slides In/Out) */}
      <div
        className={clsx(
          'fixed left-16 top-0 h-full w-56 bg-[#0A0A0A] border-r border-[#2A2A2A] transition-transform duration-300 ease-in-out z-30',
          isRightSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {currentModule && (
          <div className="flex flex-col h-full">
            {/* Module Header */}
            <div className="p-4 border-b border-[#2A2A2A]">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">{currentModule.name}</h2>
                <button
                  onClick={() => setIsRightSidebarOpen(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-2">
              {currentModule.pages.map((page) => {
                const isActive = pathname === page.href;
                
                return (
                  <Link
                    key={page.href}
                    href={page.href}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                      isActive
                        ? 'bg-[#1A1A1A] text-white font-medium'
                        : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]/50'
                    )}
                  >
                    <div className="flex items-center justify-center w-4 h-4">
                      {page.icon}
                    </div>
                    <span>{page.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Backdrop Blur when sidebar is open */}
      {!isRightSidebarOpen && (
        <button
          onClick={() => setIsRightSidebarOpen(true)}
          className="fixed left-16 top-4 z-20 w-8 h-8 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors"
        >
          <ChevronRight size={16} className="transform rotate-180" />
        </button>
      )}
    </>
  );
}
