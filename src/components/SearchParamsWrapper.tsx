'use client';

import { Suspense, ReactNode } from 'react';

export function SearchParamsWrapper({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    }>
      {children}
    </Suspense>
  );
}

