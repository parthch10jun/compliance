'use client';

/**
 * Delegation of Authority (DoA) Module - Layout
 * Standalone layout for the DoA module with its own sidebar and navigation
 */

import React from 'react';
import DOASidebar from '@/components/doa/layout/DOASidebar';
import DOATopBar from '@/components/doa/layout/DOATopBar';
import { PersonaProvider } from '@/contexts/PersonaContext';

export default function DoALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PersonaProvider>
      <div className="light flex h-screen overflow-hidden bg-white">
        {/* Sidebar */}
        <DOASidebar />

        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top bar */}
          <DOATopBar />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
            <div className="px-8 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </PersonaProvider>
  );
}
