'use client';

import ERMSidebar from '@/components/erm/ERMSidebar';
import ERMTopBar from '@/components/erm/ERMTopBar';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { useSidebar } from '@/contexts/SidebarContext';
import clsx from 'clsx';

function ERMContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex h-screen bg-[var(--background)]">
      {/* ERM Sidebar */}
      <ERMSidebar />

      {/* Main Content Area */}
      <div
        className={clsx(
          'flex-1 flex flex-col overflow-hidden transition-all duration-300',
          isCollapsed ? 'ml-16' : 'ml-60'
        )}
      >
        {/* ERM TopBar */}
        <ERMTopBar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function ERMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <ERMContent>{children}</ERMContent>
    </SidebarProvider>
  );
}
