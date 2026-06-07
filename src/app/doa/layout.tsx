'use client';

/**
 * Delegation of Authority (DoA) Module - Layout
 * Standalone layout for the DoA module with its own sidebar and navigation.
 *
 * The root carries `data-doa-accent={profileId}` so the accent colour can be
 * themed per client profile via scoped CSS (see globals.css): JNBP keeps the
 * amber brand; SEC re-maps the amber palette to the Authorization-Matrix navy
 * so the chrome and the matrix align.
 */

import React from 'react';
import DOASidebar from '@/components/doa/layout/DOASidebar';
import DOATopBar from '@/components/doa/layout/DOATopBar';
import { PersonaProvider } from '@/contexts/PersonaContext';
import { useClientProfile } from '@/lib/doa/hooks/useClientProfile';

export default function DoALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profileId } = useClientProfile();

  return (
    <PersonaProvider>
      <div data-doa-accent={profileId} className="light flex h-screen overflow-hidden bg-white">
        {/* Sidebar */}
        <DOASidebar />

        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top bar */}
          <DOATopBar />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
            <div className="px-6 py-5">
              {children}
            </div>
          </main>
        </div>
      </div>
    </PersonaProvider>
  );
}
